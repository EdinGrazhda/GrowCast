"""Image preprocessing for the Conv-Autoencoder.

Matches the training pipeline: 224x224 RGB, ImageNet mean/std normalisation,
NCHW float32 layout.
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

INPUT_SIZE = 224
IMAGENET_MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
IMAGENET_STD = np.array([0.229, 0.224, 0.225], dtype=np.float32)


def load_image(path: str | Path) -> Image.Image:
    return Image.open(path).convert("RGB")


def to_model_input(img: Image.Image) -> np.ndarray:
    """PIL image -> (1, 3, 224, 224) float32 normalised tensor."""
    resized = img.resize((INPUT_SIZE, INPUT_SIZE), Image.BILINEAR)
    arr = np.asarray(resized, dtype=np.float32) / 255.0
    arr = (arr - IMAGENET_MEAN) / IMAGENET_STD
    arr = np.transpose(arr, (2, 0, 1))
    return arr[None, ...].astype(np.float32, copy=False)


def denormalize(tensor: np.ndarray) -> np.ndarray:
    """(3, H, W) normalised -> (H, W, 3) uint8 for display/blending."""
    chw = tensor[0] if tensor.ndim == 4 else tensor
    hwc = np.transpose(chw, (1, 2, 0))
    hwc = hwc * IMAGENET_STD + IMAGENET_MEAN
    hwc = np.clip(hwc * 255.0, 0, 255).astype(np.uint8)
    return hwc
