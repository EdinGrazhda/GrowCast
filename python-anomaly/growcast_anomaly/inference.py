"""ONNX runtime wrapper for GrowCast anomaly detection.

Supports three on-disk model formats, picked from `ae_meta.json["output_format"]`:

- "embeddings"        — v3, PatchCore-lite. ONNX outputs (B, N_POSITIONS, D)
                        L2-normalised per-position embeddings. We score by
                        taking each query embedding's k-NN distance into a
                        precomputed `bank.npy` (memory bank of healthy
                        embeddings). Per-position score = 1 - max cosine sim.
                        Image score = 95th percentile of per-position scores.
- "score_map"         — v2, feature-space AE. ONNX outputs (B, H, W) score map.
- (legacy / unset)    — v1, pixel AE. ONNX outputs (B, C, H, W) reconstruction.
"""

from __future__ import annotations

import json
import time
from dataclasses import dataclass
from pathlib import Path

import numpy as np
import onnxruntime as ort

from .preprocess import to_model_input

DEFAULT_MODEL = Path(__file__).resolve().parent.parent / "models" / "healthy_ae.onnx"
DEFAULT_META = Path(__file__).resolve().parent.parent / "models" / "ae_meta.json"


@dataclass
class ScanResult:
    score: float
    threshold: float
    verdict: str  # "normal" | "anomaly"
    confidence: float
    error_map: np.ndarray  # (H, W) float32, model-resolution
    latency_ms: int
    model_version: str


class AnomalyDetector:
    def __init__(
        self,
        model_path: str | Path | None = None,
        meta_path: str | Path | None = None,
        threshold_override: float | None = None,
    ):
        self.model_path = Path(model_path or DEFAULT_MODEL)
        self.meta_path = Path(meta_path or DEFAULT_META)
        if not self.model_path.exists():
            raise FileNotFoundError(
                f"ONNX model not found at {self.model_path}. "
                "Build one with `python -m train.export_onnx` then "
                "`python -m train.build_bank`."
            )
        if not self.meta_path.exists():
            raise FileNotFoundError(
                f"Model metadata not found at {self.meta_path}. "
                "It should be produced by `python -m train.export_onnx`."
            )

        self.meta = json.loads(self.meta_path.read_text())
        self.threshold = (
            float(threshold_override) if threshold_override is not None
            else float(self.meta["threshold"])
        )
        self.model_version = str(self.meta.get("version", self.model_path.stem))
        self.output_format = self.meta.get("output_format")
        self.spatial = int(self.meta.get("spatial", 14))

        so = ort.SessionOptions()
        so.intra_op_num_threads = max(1, (self.meta.get("intra_op_threads") or 2))
        so.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
        self.session = ort.InferenceSession(
            str(self.model_path), sess_options=so, providers=["CPUExecutionProvider"]
        )
        self.input_name = self.session.get_inputs()[0].name
        self.output_name = self.session.get_outputs()[0].name

        # Lazy-load the memory bank when needed.
        self._bank: np.ndarray | None = None
        if self.output_format == "embeddings":
            bank_name = self.meta.get("bank_path", "bank.npy")
            self._bank_path = self.meta_path.parent / bank_name

    def _load_bank(self) -> np.ndarray:
        if self._bank is None:
            if not self._bank_path.exists():
                raise FileNotFoundError(
                    f"Memory bank not found at {self._bank_path}. "
                    "Build one with `python -m train.build_bank`."
                )
            bank = np.load(self._bank_path).astype(np.float32, copy=False)
            # Ensure rows are unit-norm for cosine similarity.
            norms = np.linalg.norm(bank, axis=1, keepdims=True)
            self._bank = bank / np.clip(norms, 1e-8, None)
        return self._bank

    def score_image(self, img) -> ScanResult:
        from PIL import Image as _Image  # local import keeps module import light

        if not isinstance(img, _Image.Image):
            raise TypeError("score_image expects a PIL.Image")

        x = to_model_input(img)
        t0 = time.perf_counter()
        out = self.session.run([self.output_name], {self.input_name: x})[0]

        if self.output_format == "embeddings":
            error_map = self._score_patchcore(out)
        elif self.output_format == "score_map" or out.ndim == 3:
            error_map = out[0]
        else:
            # legacy v1 pixel-AE: ONNX returned a reconstruction
            diff = (x - out) ** 2
            error_map = diff[0].sum(axis=0)

        latency_ms = int((time.perf_counter() - t0) * 1000)

        # Image-level score: 95th percentile of per-position scores.
        score = float(np.quantile(error_map, 0.95))

        verdict = "anomaly" if score > self.threshold else "normal"
        confidence = _confidence_from_score(score, self.threshold, verdict)

        return ScanResult(
            score=score,
            threshold=self.threshold,
            verdict=verdict,
            confidence=confidence,
            error_map=error_map.astype(np.float32, copy=False),
            latency_ms=latency_ms,
            model_version=self.model_version,
        )

    def _score_patchcore(self, embeddings: np.ndarray) -> np.ndarray:
        """k-NN distance scoring against the healthy memory bank.

        embeddings: (1, N_POSITIONS, D) L2-normalised per-position vectors.
        Returns:    (spatial, spatial) per-position anomaly score.

        Both queries and bank are unit-norm, so inner product = cosine sim.
        Per-position anomaly score = 1 - mean(top-K cosine sims). Averaging
        the top-K (instead of taking the single max) makes the score robust
        to a single very-close bank vector — a query has to be far from
        several healthy references to be flagged. K is meta["topk"] (default 5).
        """
        bank = self._load_bank()                 # (M, D)
        q = embeddings[0]                        # (N_POSITIONS, D)
        sims = q @ bank.T                        # (N_POSITIONS, M)
        k = int(self.meta.get("topk", 5))
        k = min(k, sims.shape[1])
        if k <= 1:
            top_mean = sims.max(axis=1)
        else:
            # np.partition is O(M); we want the top-K largest.
            top_idx = np.argpartition(-sims, k - 1, axis=1)[:, :k]
            rows = np.arange(sims.shape[0])[:, None]
            top_vals = sims[rows, top_idx]
            top_mean = top_vals.mean(axis=1)
        per_pos = 1.0 - top_mean
        return per_pos.reshape(self.spatial, self.spatial)


def _confidence_from_score(score: float, threshold: float, verdict: str) -> float:
    if threshold <= 0:
        return 0.5
    if verdict == "anomaly":
        c = (score - threshold) / max(threshold, 1e-6)
    else:
        c = (threshold - score) / max(threshold, 1e-6)
    return float(max(0.0, min(1.0, c)))
