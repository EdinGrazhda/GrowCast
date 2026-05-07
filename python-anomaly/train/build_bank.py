"""Build a PatchCore-lite memory bank from healthy training images.

Run on a developer laptop. Output is a single `bank.npy` file (and an
accompanying `ae_meta.json` with provenance) that the Pi loads alongside
`healthy_ae.onnx` at inference time.

Usage:
    python -m train.build_bank \
        --data data/healthy_sample \
        --extractor-onnx models/healthy_ae.onnx \
        --out models/bank.npy \
        --subsample-frac 0.01
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
import onnxruntime as ort
from PIL import Image
from tqdm import tqdm

from growcast_anomaly.preprocess import load_image, to_model_input

EXTS = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Build PatchCore healthy memory bank.")
    p.add_argument("--data", type=Path, required=True)
    p.add_argument("--extractor-onnx", type=Path, default=Path("models/healthy_ae.onnx"))
    p.add_argument("--meta", type=Path, default=Path("models/ae_meta.json"))
    p.add_argument("--out", type=Path, default=Path("models/bank.npy"))
    p.add_argument("--subsample-frac", type=float, default=0.02,
                   help="Final fraction of all extracted positions to keep (default 2%).")
    p.add_argument(
        "--coreset", choices=["random", "greedy"], default="greedy",
        help="Subsampling strategy. 'greedy' = k-center furthest-point (PatchCore-paper style), "
             "'random' = random subsample (faster, ~1-2% AUROC worse).",
    )
    p.add_argument(
        "--greedy-pool-frac", type=float, default=0.05,
        help="For greedy mode, randomly pre-subsample to this fraction first to keep "
             "k-center O(K*P) tractable on large banks (default 5%).",
    )
    p.add_argument("--max-images", type=int, default=None)
    p.add_argument("--seed", type=int, default=0)
    return p.parse_args()


def greedy_kcenter(
    pool: np.ndarray, n_select: int, seed: int = 0
) -> np.ndarray:
    """Greedy k-center / furthest-point subsampling.

    Iteratively pick the point whose minimum distance to the already-selected
    set is maximal. Equivalent to a 2-approximation of the k-center clustering
    objective, and the standard "coreset" PatchCore uses. Inputs assumed
    L2-normalised, so squared-Euclidean = 2 - 2*cosine_sim.
    """
    rng = np.random.default_rng(seed)
    n = len(pool)
    n_select = min(n_select, n)

    # Start from a random seed point.
    selected = np.empty(n_select, dtype=np.int64)
    first = int(rng.integers(0, n))
    selected[0] = first
    # min_dist[i] = squared distance from pool[i] to nearest already-selected point.
    min_dist = 2.0 - 2.0 * (pool @ pool[first])
    min_dist[first] = 0.0

    for k in tqdm(range(1, n_select), desc="greedy k-center"):
        idx = int(np.argmax(min_dist))
        selected[k] = idx
        new_d = 2.0 - 2.0 * (pool @ pool[idx])
        np.minimum(min_dist, new_d, out=min_dist)

    return pool[selected]


def _list_images(root: Path, max_n: int | None) -> list[Path]:
    paths = [p for p in root.rglob("*") if p.suffix.lower() in EXTS and p.is_file()]
    paths.sort()
    if max_n and len(paths) > max_n:
        idx = np.linspace(0, len(paths) - 1, max_n).astype(int)
        paths = [paths[i] for i in idx]
    return paths


def main() -> None:
    args = parse_args()
    rng = np.random.default_rng(args.seed)

    so = ort.SessionOptions()
    so.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
    sess = ort.InferenceSession(str(args.extractor_onnx), sess_options=so,
                                providers=["CPUExecutionProvider"])
    in_name = sess.get_inputs()[0].name
    out_name = sess.get_outputs()[0].name

    paths = _list_images(args.data, args.max_images)
    print(f"[bank] {len(paths)} healthy images")

    chunks: list[np.ndarray] = []
    for p in tqdm(paths, desc="extract"):
        img = load_image(p)
        x = to_model_input(img)
        feats = sess.run([out_name], {in_name: x})[0]  # (1, N_POS, D)
        chunks.append(feats[0])

    bank_full = np.concatenate(chunks, axis=0).astype(np.float32)
    print(f"[bank] full bank: {bank_full.shape} ({bank_full.nbytes/1e6:.1f} MB)")

    n_keep = max(64, int(round(len(bank_full) * args.subsample_frac)))

    if args.coreset == "greedy":
        # Pre-subsample to a manageable pool (greedy k-center is O(K*P)).
        pool_size = max(n_keep * 4, int(len(bank_full) * args.greedy_pool_frac))
        pool_size = min(pool_size, len(bank_full))
        if pool_size < len(bank_full):
            pool_idx = rng.choice(len(bank_full), size=pool_size, replace=False)
            pool = bank_full[pool_idx]
        else:
            pool = bank_full
        print(f"[bank] greedy k-center: pool={len(pool):,}  target={n_keep:,}")
        bank = greedy_kcenter(pool, n_keep, seed=args.seed)
    else:
        if n_keep < len(bank_full):
            idx = rng.choice(len(bank_full), size=n_keep, replace=False)
            bank = bank_full[idx]
        else:
            bank = bank_full
    print(f"[bank] subsampled ({args.coreset}): {bank.shape} ({bank.nbytes/1e6:.1f} MB)")

    # Already L2-normalised by the extractor, but normalise again for safety.
    norms = np.linalg.norm(bank, axis=1, keepdims=True)
    bank = bank / np.clip(norms, 1e-8, None)

    args.out.parent.mkdir(parents=True, exist_ok=True)
    np.save(args.out, bank)
    print(f"[bank] wrote {args.out}")

    # Stamp the meta file so inference.py knows to use k-NN scoring.
    meta = json.loads(args.meta.read_text()) if args.meta.exists() else {}
    meta["output_format"] = "embeddings"
    meta["bank_path"] = args.out.name
    meta["bank_size"] = int(bank.shape[0])
    meta["embed_dim"] = int(bank.shape[1])
    meta["n_positions"] = 196
    meta["spatial"] = 14
    meta["coreset"] = args.coreset
    # Remove any v2-AE leftovers that no longer apply.
    meta.pop("calibration", None)
    if "threshold" not in meta:
        meta["threshold"] = 0.5  # placeholder; calibrate.py will overwrite
    args.meta.write_text(json.dumps(meta, indent=2) + "\n")
    print(f"[bank] updated meta -> {args.meta}")


if __name__ == "__main__":
    main()
