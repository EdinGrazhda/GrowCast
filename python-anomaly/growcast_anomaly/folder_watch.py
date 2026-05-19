"""Folder-watching frame source.

For cameras that don't expose v4l2 — the Orbbec Astra on the JetAuto publishes
through the Orbbec ROS driver, so `cv2.VideoCapture(0)` can't see it. Pair this
with `rosrun image_view extract_images` (or any JPG-dropping producer) and the
`watch` subcommand to feed `growcast-anomaly` from a directory instead of a
camera device.

Always yields the *newest* image — stale frames are skipped if inference is
slower than the producer. A file must have a stable size across two polls
before it is read, so we never grab a half-written JPG.
"""

from __future__ import annotations

import time
from pathlib import Path
from typing import Iterator


def watch_paths(
    watch_dir: Path,
    pattern: str = "*.jpg",
    interval_s: float = 2.0,
) -> Iterator[Path]:
    watch_dir = Path(watch_dir)
    watch_dir.mkdir(parents=True, exist_ok=True)
    last_yielded: Path | None = None
    sizes: dict[str, int] = {}

    while True:
        loop_start = time.time()

        candidates = []
        for p in watch_dir.glob(pattern):
            try:
                candidates.append((p.stat().st_mtime, p))
            except OSError:
                continue
        candidates.sort(reverse=True)

        chosen: Path | None = None
        for _mtime, p in candidates:
            try:
                size = p.stat().st_size
            except OSError:
                continue
            key = str(p)
            if size > 0 and sizes.get(key) == size:
                chosen = p
                break
            sizes[key] = size

        if chosen is not None and chosen != last_yielded:
            yield chosen
            last_yielded = chosen
            if len(sizes) > 200:
                sizes = {str(chosen): sizes.get(str(chosen), 0)}

        elapsed = time.time() - loop_start
        if elapsed < interval_s:
            time.sleep(interval_s - elapsed)
