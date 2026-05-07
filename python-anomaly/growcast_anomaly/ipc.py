"""JSON contract emitted to stdout for the robot presenter."""

from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

from . import __schema__ as SCHEMA, __algorithm__ as DEFAULT_ALGORITHM
from .inference import ScanResult


def _algorithm_id(model_version: str) -> str:
    v = model_version.lower()
    if "patchcore" in v:
        return "patchcore-lite"
    if "feat_ae" in v:
        return "feature-ae"
    return DEFAULT_ALGORITHM


def build_payload(
    result: ScanResult,
    image_path: str | Path,
    heatmap_path: str | Path | None = None,
) -> dict:
    return {
        "schema": SCHEMA,
        "image": str(image_path),
        "verdict": result.verdict,
        "score": round(result.score, 6),
        "threshold": round(result.threshold, 6),
        "confidence": round(result.confidence, 4),
        "heatmap_path": str(heatmap_path) if heatmap_path else None,
        "latency_ms": result.latency_ms,
        "algorithm": _algorithm_id(result.model_version),
        "model_version": result.model_version,
        "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    }


def emit(payload: dict) -> None:
    sys.stdout.write(json.dumps(payload, separators=(",", ":")) + "\n")
    sys.stdout.flush()
