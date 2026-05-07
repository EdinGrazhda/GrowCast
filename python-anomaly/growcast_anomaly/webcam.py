"""Webcam frame loop for live demo on the robot."""

from __future__ import annotations

import time
from pathlib import Path
from typing import Iterator

import cv2
from PIL import Image


def frames(device: int = 0, interval_s: float = 2.0, warmup_s: float = 0.5) -> Iterator[Image.Image]:
    """Yield PIL frames from a v4l2 camera, paced by `interval_s`.

    Caller decides when to stop (Ctrl-C or breaking the loop).
    """
    cap = cv2.VideoCapture(device)
    if not cap.isOpened():
        raise RuntimeError(f"Could not open video device {device}")

    try:
        # Drain a few frames to let the sensor settle.
        deadline = time.time() + warmup_s
        while time.time() < deadline:
            cap.read()

        next_due = time.time()
        while True:
            now = time.time()
            if now < next_due:
                time.sleep(next_due - now)
            ok, frame_bgr = cap.read()
            if not ok:
                continue
            frame_rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
            yield Image.fromarray(frame_rgb)
            next_due = time.time() + interval_s
    finally:
        cap.release()


def save_frame(img: Image.Image, out_dir: str | Path, idx: int) -> Path:
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    p = out_dir / f"frame_{idx:05d}.jpg"
    img.save(p, format="JPEG", quality=85)
    return p
