"""Reconstruction-error map -> coloured overlay PNG for the robot's screen."""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

# Compact 256-row jet LUT, computed once at import time. Avoids a matplotlib dep on the Pi.
def _build_jet_lut() -> np.ndarray:
    x = np.linspace(0.0, 1.0, 256, dtype=np.float32)

    def _channel(t, peak):
        # Triangular ramps centred at peak with width 0.5; output in [0, 1].
        return np.clip(1.5 - np.abs(4.0 * (t - peak)), 0.0, 1.0)

    r = _channel(x, 0.75)
    g = _channel(x, 0.5)
    b = _channel(x, 0.25)
    return (np.stack([r, g, b], axis=1) * 255.0).astype(np.uint8)


_JET = _build_jet_lut()


def render_overlay(
    original: Image.Image,
    error_map: np.ndarray,
    out_path: str | Path,
    alpha: float = 0.5,
) -> Path:
    """Blend a jet-coloured error map over the original image and save as PNG."""
    out_path = Path(out_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    w, h = original.size
    em = error_map.astype(np.float32)
    em_min, em_max = float(em.min()), float(em.max())
    if em_max - em_min < 1e-12:
        norm = np.zeros_like(em)
    else:
        norm = (em - em_min) / (em_max - em_min)

    indices = (norm * 255.0).astype(np.uint8)
    coloured = _JET[indices]  # (h_em, w_em, 3) uint8
    coloured_img = Image.fromarray(coloured, mode="RGB").resize((w, h), Image.BILINEAR)

    blended = Image.blend(original.convert("RGB"), coloured_img, alpha=alpha)
    blended.save(out_path, format="PNG", optimize=True)
    return out_path
