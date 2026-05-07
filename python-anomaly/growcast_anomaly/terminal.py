"""Rich-based terminal output sized for an 80-col lxterminal."""

from __future__ import annotations

import os
from pathlib import Path

from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.text import Text

from .inference import ScanResult

_console = Console(no_color=os.environ.get("NO_COLOR") == "1", width=72)


def _algorithm_label(model_version: str) -> str:
    if "patchcore" in model_version.lower():
        return "PatchCore-lite (k-NN to healthy feature bank)"
    if "feat_ae" in model_version.lower():
        return "Feature-space Autoencoder (reconstruction error)"
    return "Conv-Autoencoder (reconstruction error)"


def render(result: ScanResult, image_path: str | Path, heatmap_path: str | Path | None = None) -> None:
    color = "red" if result.verdict == "anomaly" else "green"
    icon = "⚠" if result.verdict == "anomaly" else "✓"
    headline = Text(f"{icon}  {result.verdict.upper()}", style=f"bold {color}")

    table = Table.grid(padding=(0, 1))
    table.add_column(style="dim", justify="right")
    table.add_column()
    table.add_row("Image:", str(image_path))
    table.add_row("Verdict:", headline)
    table.add_row("Score:", f"{result.score:.4f}  (threshold {result.threshold:.4f})")
    table.add_row("Confidence:", f"{int(round(result.confidence * 100))}%")
    if heatmap_path:
        table.add_row("Heatmap:", str(heatmap_path))
    table.add_row("Latency:", f"{result.latency_ms} ms")
    table.add_row("Algorithm:", _algorithm_label(result.model_version))
    table.add_row("Model:", result.model_version)

    _console.print(Panel(table, title="GrowCast Anomaly Scan", border_style=color))
