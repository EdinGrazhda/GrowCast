"""Re-calibrate the anomaly threshold using held-out healthy + diseased images.

The 99th-percentile-of-training-scores heuristic from `train_ae.py` is too lax
when the healthy training set has high-variance outliers. This script uses a
small validation set with both classes to find the F1-optimal threshold and
rewrites `ae_meta.json` in place.

Usage:
    python -m train.calibrate \
        --healthy-dir data/healthy_sample \
        --diseased-dir data/diseased_holdout \
        --meta models/ae_meta.json \
        --max-per-class 200
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np

from growcast_anomaly.inference import AnomalyDetector
from growcast_anomaly.preprocess import load_image

EXTS = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}


def _list_images(root: Path, max_n: int) -> list[Path]:
    paths = [p for p in root.rglob("*") if p.suffix.lower() in EXTS and p.is_file()]
    paths.sort()
    if max_n and len(paths) > max_n:
        # Even-stride sampling so we don't bias toward one alphabetical bucket.
        idx = np.linspace(0, len(paths) - 1, max_n).astype(int)
        paths = [paths[i] for i in idx]
    return paths


def _score_all(detector: AnomalyDetector, paths: list[Path]) -> np.ndarray:
    scores = []
    for p in paths:
        result = detector.score_image(load_image(p))
        scores.append(result.score)
    return np.asarray(scores, dtype=np.float64)


def _metrics_at(threshold: float, healthy_scores: np.ndarray, diseased_scores: np.ndarray) -> dict:
    tp = int((diseased_scores > threshold).sum())
    fp = int((healthy_scores > threshold).sum())
    fn = int((diseased_scores <= threshold).sum())
    tn = int((healthy_scores <= threshold).sum())
    precision = tp / (tp + fp) if (tp + fp) else 0.0
    recall = tp / (tp + fn) if (tp + fn) else 0.0
    specificity = tn / (tn + fp) if (tn + fp) else 0.0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) else 0.0
    youden = recall + specificity - 1.0  # TPR - FPR
    accuracy = (tp + tn) / (tp + fp + fn + tn)
    return {
        "tp": tp, "fp": fp, "tn": tn, "fn": fn,
        "precision": precision, "recall": recall, "specificity": specificity,
        "f1": f1, "youden": youden, "accuracy": accuracy,
    }


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--healthy-dir", type=Path, required=True)
    p.add_argument("--diseased-dir", type=Path, required=True)
    p.add_argument("--meta", type=Path, default=Path("models/ae_meta.json"))
    p.add_argument("--model", type=Path, default=None)
    p.add_argument("--max-per-class", type=int, default=200)
    p.add_argument(
        "--objective", choices=["youden", "f1", "accuracy"], default="youden",
        help="What to maximize when sweeping thresholds (default: youden = TPR - FPR).",
    )
    args = p.parse_args()

    detector = AnomalyDetector(args.model, args.meta)
    print(f"[calibrate] using model {detector.model_path.name}")

    healthy_paths = _list_images(args.healthy_dir, args.max_per_class)
    diseased_paths = _list_images(args.diseased_dir, args.max_per_class)
    print(f"[calibrate] healthy={len(healthy_paths)} diseased={len(diseased_paths)}")
    if not diseased_paths:
        raise SystemExit("Need at least one diseased image to calibrate.")

    print("[calibrate] scoring healthy...")
    h = _score_all(detector, healthy_paths)
    print("[calibrate] scoring diseased...")
    d = _score_all(detector, diseased_paths)

    print(
        f"[calibrate]   healthy:  min={h.min():.3f} median={np.median(h):.3f} "
        f"95th={np.quantile(h, 0.95):.3f} max={h.max():.3f}"
    )
    print(
        f"[calibrate]   diseased: min={d.min():.3f} median={np.median(d):.3f} "
        f"95th={np.quantile(d, 0.95):.3f} max={d.max():.3f}"
    )

    # Sweep thresholds across the union of scores; pick best per the chosen objective.
    candidates = np.unique(np.concatenate([h, d]))
    best_t = None
    best_score = -1e9
    best_metrics: dict = {}
    for t in candidates:
        m = _metrics_at(float(t), h, d)
        score = m[args.objective]
        if score > best_score:
            best_score = score
            best_t = float(t)
            best_metrics = m

    print(
        f"[calibrate] best {args.objective}={best_score:.3f} at threshold={best_t:.3f}\n"
        f"            precision={best_metrics['precision']:.3f} "
        f"recall={best_metrics['recall']:.3f} "
        f"specificity={best_metrics['specificity']:.3f} "
        f"accuracy={best_metrics['accuracy']:.3f} f1={best_metrics['f1']:.3f}"
    )

    meta = json.loads(args.meta.read_text())
    meta["threshold"] = best_t
    meta["calibration"] = {
        "method": args.objective,
        "healthy_count": len(healthy_paths),
        "diseased_count": len(diseased_paths),
        **{k: round(v, 4) if isinstance(v, float) else v for k, v in best_metrics.items()},
    }
    args.meta.write_text(json.dumps(meta, indent=2) + "\n")
    print(f"[calibrate] wrote new threshold to {args.meta}")


if __name__ == "__main__":
    main()
