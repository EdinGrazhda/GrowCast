"""Train the feature-space anomaly AE on healthy leaves.

The frozen MobileNetV2 backbone runs at every step but doesn't update; only
the small Feature-AE trains. Loss is MSE between the backbone's mid-layer
feature map and the AE's reconstruction of it.

Run on a developer laptop (CPU works, MPS or CUDA is faster). The Pi never
trains.

Usage:
    python -m train.train_ae --data data/healthy_sample --epochs 25 --out checkpoints/ae.pt
"""

from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
import torch
from PIL import Image
from torch import nn, optim
from torch.utils.data import DataLoader, Dataset
from torchvision import transforms

from .feature_model import AnomalyModule

IMAGENET_MEAN = (0.485, 0.456, 0.406)
IMAGENET_STD = (0.229, 0.224, 0.225)
EXTS = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}


class FlatImageFolder(Dataset):
    """Recursively load every image under root, ignoring class labels."""

    def __init__(self, root: Path, transform):
        self.paths = [p for p in root.rglob("*") if p.suffix.lower() in EXTS]
        if not self.paths:
            raise RuntimeError(f"No images found under {root}")
        self.transform = transform

    def __len__(self) -> int:
        return len(self.paths)

    def __getitem__(self, idx: int):
        img = Image.open(self.paths[idx]).convert("RGB")
        return self.transform(img)


def build_transforms(train: bool):
    if train:
        ops = [
            transforms.RandomResizedCrop(224, scale=(0.85, 1.0), ratio=(0.9, 1.1)),
            transforms.RandomHorizontalFlip(),
            transforms.ColorJitter(brightness=0.05, contrast=0.05, saturation=0.05),
        ]
    else:
        ops = [transforms.Resize(256), transforms.CenterCrop(224)]
    ops += [
        transforms.ToTensor(),
        transforms.Normalize(IMAGENET_MEAN, IMAGENET_STD),
    ]
    return transforms.Compose(ops)


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Train feature-space AE on healthy leaves.")
    p.add_argument("--data", type=Path, required=True)
    p.add_argument("--out", type=Path, default=Path("checkpoints/ae.pt"))
    p.add_argument("--epochs", type=int, default=25)
    p.add_argument("--batch-size", type=int, default=64)
    p.add_argument("--lr", type=float, default=1e-3)
    p.add_argument("--num-workers", type=int, default=2)
    default_device = (
        "cuda" if torch.cuda.is_available()
        else ("mps" if torch.backends.mps.is_available() else "cpu")
    )
    p.add_argument("--device", type=str, default=default_device)
    return p.parse_args()


def main() -> None:
    args = parse_args()
    args.out.parent.mkdir(parents=True, exist_ok=True)

    device = torch.device(args.device)
    print(f"[train] device={device}, data={args.data}")

    train_ds = FlatImageFolder(args.data, build_transforms(train=True))
    score_ds = FlatImageFolder(args.data, build_transforms(train=False))
    print(f"[train] {len(train_ds)} healthy images")

    train_loader = DataLoader(
        train_ds, batch_size=args.batch_size, shuffle=True,
        num_workers=args.num_workers, pin_memory=(device.type == "cuda"),
    )

    model = AnomalyModule().to(device)
    n_total = sum(p.numel() for p in model.parameters())
    n_trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
    print(f"[train] params total={n_total/1e6:.2f}M trainable={n_trainable/1e6:.2f}M")

    # Only the AE trains.
    opt = optim.Adam((p for p in model.parameters() if p.requires_grad), lr=args.lr)
    loss_fn = nn.MSELoss()

    for epoch in range(1, args.epochs + 1):
        model.train()  # FrozenBackbone overrides train() to keep BN in eval.
        running = 0.0
        for batch in train_loader:
            batch = batch.to(device, non_blocking=True)
            with torch.no_grad():
                feat = model.backbone(batch)
            recon = model.ae(feat)
            loss = loss_fn(recon, feat)
            opt.zero_grad(set_to_none=True)
            loss.backward()
            opt.step()
            running += loss.item() * batch.size(0)
        avg = running / len(train_ds)
        print(f"[epoch {epoch:02d}/{args.epochs}] feat_mse={avg:.5f}")

    # Calibration sweep over the un-augmented training set: for each image,
    # compute the score map and take the 95th-percentile pixel as the image
    # score. Threshold = 99th percentile of those — only a starting point;
    # `train.calibrate` will overwrite it with a balanced cutoff.
    model.eval()
    score_loader = DataLoader(
        score_ds, batch_size=args.batch_size, shuffle=False, num_workers=args.num_workers
    )
    scores: list[float] = []
    with torch.no_grad():
        for batch in score_loader:
            batch = batch.to(device, non_blocking=True)
            score_map = model(batch)  # (B, H, W)
            flat = score_map.flatten(1)
            q95 = torch.quantile(flat, 0.95, dim=1)
            scores.extend(q95.detach().cpu().tolist())

    scores_np = np.asarray(scores, dtype=np.float64)
    threshold = float(np.quantile(scores_np, 0.99))
    print(
        f"[calibrate] healthy score: min={scores_np.min():.5f} "
        f"median={np.median(scores_np):.5f} max={scores_np.max():.5f}"
    )
    print(f"[calibrate] starter threshold (99th pct of healthy) = {threshold:.5f}")
    print("[calibrate] Run `python -m train.calibrate ...` to tune this on a held-out set.")

    ckpt = {
        "state_dict": model.state_dict(),
        "threshold": threshold,
        "train_count": len(train_ds),
        "torch_version": torch.__version__,
        "imagenet_mean": list(IMAGENET_MEAN),
        "imagenet_std": list(IMAGENET_STD),
        "feature_layer_cut": "MobileNetV2.features[:14]",
    }
    torch.save(ckpt, args.out)
    print(f"[train] saved checkpoint -> {args.out}")


if __name__ == "__main__":
    main()
