"""Export the PatchCore-lite feature extractor to ONNX.

The extractor is fully frozen (ImageNet-pretrained MobileNetV2, no trainable
parameters), so this script doesn't need a checkpoint — it instantiates the
module with pretrained weights and exports it directly.

The Pi consumes:
- `models/healthy_ae.onnx`  — the extractor (input image, output embeddings)
- `models/bank.npy`         — the healthy memory bank (built by `build_bank.py`)
- `models/ae_meta.json`     — metadata including the calibrated threshold

Usage:
    python -m train.export_onnx --out models/healthy_ae.onnx
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import torch

from .patchcore_model import PatchCoreExtractor, EMBED_DIM, N_POSITIONS


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Export PatchCore extractor to ONNX.")
    p.add_argument("--out", type=Path, default=Path("models/healthy_ae.onnx"))
    p.add_argument("--meta-out", type=Path, default=None)
    p.add_argument("--opset", type=int, default=17)
    p.add_argument("--version-tag", type=str, default="healthy_patchcore.v3")
    return p.parse_args()


def main() -> None:
    args = parse_args()
    args.out.parent.mkdir(parents=True, exist_ok=True)
    meta_out = args.meta_out or args.out.with_name("ae_meta.json")

    model = PatchCoreExtractor()
    model.eval()

    dummy = torch.randn(1, 3, 224, 224, dtype=torch.float32)
    torch.onnx.export(
        model,
        dummy,
        str(args.out),
        opset_version=args.opset,
        input_names=["input"],
        output_names=["embeddings"],
        dynamic_axes={"input": {0: "batch"}, "embeddings": {0: "batch"}},
    )
    print(f"[export] wrote ONNX -> {args.out}")

    try:
        import onnxruntime as ort
        s = ort.InferenceSession(str(args.out), providers=["CPUExecutionProvider"])
        o = s.run(None, {s.get_inputs()[0].name: dummy.numpy()})[0]
        print(f"[export] ONNX self-check: output shape {o.shape}  (expected (1, {N_POSITIONS}, {EMBED_DIM}))")
        assert o.shape == (1, N_POSITIONS, EMBED_DIM)
    except Exception as e:
        print(f"[export] ONNX self-check failed: {e}")

    # Preserve any prior threshold/calibration; otherwise stub it.
    if meta_out.exists():
        meta = json.loads(meta_out.read_text())
    else:
        meta = {}
    meta.update({
        "version": args.version_tag,
        "imagenet_mean": [0.485, 0.456, 0.406],
        "imagenet_std": [0.229, 0.224, 0.225],
        "onnx_opset": args.opset,
        "intra_op_threads": 2,
        "feature_layer_cut": "MobileNetV2.features[7,14] concat",
        "embed_dim": EMBED_DIM,
        "n_positions": N_POSITIONS,
        "spatial": 14,
        "output_format": meta.get("output_format", "embeddings"),
    })
    meta.setdefault("threshold", 0.5)  # placeholder
    meta_out.write_text(json.dumps(meta, indent=2) + "\n")
    print(f"[export] wrote meta -> {meta_out}")


if __name__ == "__main__":
    main()
