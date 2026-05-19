"""growcast-anomaly command-line entry point."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from . import __version__
from .inference import AnomalyDetector
from .ipc import build_payload, emit
from .preprocess import load_image


def _add_common_model_args(p: argparse.ArgumentParser) -> None:
    p.add_argument("--model", type=Path, default=None, help="Path to ONNX model (default: bundled)")
    p.add_argument("--meta", type=Path, default=None, help="Path to ae_meta.json (default: bundled)")
    p.add_argument(
        "--threshold", type=float, default=None,
        help="Override the calibrated threshold (useful for live demo tuning).",
    )


def _heatmap_path_for(image_path: Path, heatmap_dir: Path | None) -> Path:
    if heatmap_dir is not None:
        return heatmap_dir / (image_path.stem + ".heatmap.png")
    return image_path.with_suffix("").with_name(image_path.stem + ".heatmap.png")


def _scan_one(detector: AnomalyDetector, image_path: Path, args: argparse.Namespace) -> int:
    img = load_image(image_path)
    result = detector.score_image(img)

    heatmap_path = None
    if args.heatmap or args.heatmap_dir is not None:
        from .heatmap import render_overlay
        heatmap_path = _heatmap_path_for(image_path, args.heatmap_dir)
        render_overlay(img, result.error_map, heatmap_path)

    if args.json:
        emit(build_payload(result, image_path, heatmap_path))
    else:
        from .terminal import render
        render(result, image_path, heatmap_path)

    return 0 if result.verdict == "normal" else 2


def cmd_detect(args: argparse.Namespace) -> int:
    detector = AnomalyDetector(args.model, args.meta, threshold_override=args.threshold)
    return _scan_one(detector, Path(args.image), args)


def cmd_capture(args: argparse.Namespace) -> int:
    from .webcam import frames, save_frame

    detector = AnomalyDetector(args.model, args.meta, threshold_override=args.threshold)
    out_dir = args.heatmap_dir or Path("/tmp/growcast")
    out_dir.mkdir(parents=True, exist_ok=True)

    try:
        for idx, img in enumerate(frames(device=args.device, interval_s=args.interval)):
            frame_path = save_frame(img, out_dir, idx)
            args.heatmap_dir = out_dir  # so heatmap lands beside the frame
            args.image = frame_path
            _scan_one(detector, frame_path, args)
    except KeyboardInterrupt:
        if not args.json:
            print("\nstopped.", file=sys.stderr)
    return 0


def cmd_watch(args: argparse.Namespace) -> int:
    from .folder_watch import watch_paths

    detector = AnomalyDetector(args.model, args.meta, threshold_override=args.threshold)
    try:
        for frame_path in watch_paths(args.directory, pattern=args.pattern, interval_s=args.interval):
            _scan_one(detector, frame_path, args)
    except KeyboardInterrupt:
        if not args.json:
            print("\nstopped.", file=sys.stderr)
    return 0


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="growcast-anomaly",
        description="GrowCast plant disease anomaly detector (Conv-Autoencoder, ONNX).",
    )
    p.add_argument("--version", action="version", version=f"growcast-anomaly {__version__}")
    sub = p.add_subparsers(dest="cmd", required=True)

    pd = sub.add_parser("detect", help="Score a single image.")
    pd.add_argument("image", type=Path, help="Path to a JPEG/PNG image.")
    pd.add_argument("--json", action="store_true", help="Emit JSON line on stdout (robot IPC mode).")
    pd.add_argument("--heatmap", action="store_true", help="Save a heatmap PNG next to the image.")
    pd.add_argument("--heatmap-dir", type=Path, default=None, help="Directory to write heatmap PNGs into.")
    _add_common_model_args(pd)
    pd.set_defaults(func=cmd_detect)

    pc = sub.add_parser("capture", help="Webcam loop: scan a frame every --interval seconds.")
    pc.add_argument("--device", type=int, default=0, help="v4l2 device index (default 0).")
    pc.add_argument("--interval", type=float, default=2.0, help="Seconds between scans.")
    pc.add_argument("--json", action="store_true", help="Emit JSON lines on stdout.")
    pc.add_argument("--heatmap", action="store_true", help="Always save heatmaps.")
    pc.add_argument("--heatmap-dir", type=Path, default=None, help="Directory for frames+heatmaps.")
    _add_common_model_args(pc)
    pc.set_defaults(func=cmd_capture)

    pw = sub.add_parser(
        "watch",
        help="Watch a directory for new JPGs and score the newest one each interval "
             "(for non-v4l2 cameras like the Orbbec Astra on the JetAuto).",
    )
    pw.add_argument("directory", type=Path, help="Directory to poll for new images.")
    pw.add_argument("--pattern", default="*.jpg", help="Glob pattern (default *.jpg).")
    pw.add_argument("--interval", type=float, default=2.0, help="Seconds between polls.")
    pw.add_argument("--json", action="store_true", help="Emit JSON lines on stdout.")
    pw.add_argument("--heatmap", action="store_true", help="Always save heatmaps.")
    pw.add_argument("--heatmap-dir", type=Path, default=None, help="Directory for heatmaps.")
    _add_common_model_args(pw)
    pw.set_defaults(func=cmd_watch)

    return p


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
