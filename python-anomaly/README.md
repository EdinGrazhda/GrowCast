# growcast-anomaly

Plant disease anomaly detector for the **GrowCast** robot presenter. Runs as a
Python CLI in an LX terminal on a Raspberry Pi, using a small **Convolutional
Autoencoder** trained on healthy leaves. Disease shows up as elevated
reconstruction error; the CLI emits a verdict, confidence, and a heatmap PNG
the robot can display.

> Algorithm choice (from the GrowCast literature review):
> Convolutional Autoencoder, per Bergmann et al. (MVTec AD, CVPR 2019) — the
> reference the review explicitly transfers to *"plant diseases deviate from a
> learned model of healthy plant tissue"*, and the only one of the four
> reviewed algorithms that natively handles images and produces a spatial
> heatmap.

## Layout

```
python-anomaly/
├── growcast_anomaly/    # Pi-side runtime package (no PyTorch dep)
├── train/               # laptop-side training + ONNX export
├── models/              # healthy_ae.onnx + ae_meta.json
└── data/healthy/        # training images (gitignored)
```

The Pi never sees PyTorch. Train on a laptop, ship the ONNX.

## Install (Raspberry Pi — runtime only)

```bash
cd python-anomaly
python3 -m venv .venv && source .venv/bin/activate
pip install -e .
```

Runtime deps: `onnxruntime`, `numpy`, `pillow`, `rich`,
`opencv-python-headless`.

## Install (laptop — training + runtime)

```bash
pip install -e ".[train]"
```

Adds `torch`, `torchvision`, `tqdm`.

## Build the model (laptop, one-time)

PatchCore-lite has no training step — the feature extractor is a frozen
ImageNet-pretrained MobileNetV2. The "model" is a precomputed memory bank
of healthy embeddings, plus a calibrated threshold.

1. Drop healthy leaf images into `data/healthy/` (subdirectories are walked
   recursively). PlantVillage's `*___healthy` classes work well — see Mohanty
   et al., 2016. ~200 images per crop, ~12 crops, gives a good cross-crop
   detector.

2. Drop a held-out healthy/diseased mix into `data/diseased_calib/` for
   threshold calibration.

3. Export the feature extractor to ONNX (downloads MobileNetV2 weights once):

   ```bash
   python -m train.export_onnx --out models/healthy_ae.onnx
   ```

4. Build the healthy memory bank:

   ```bash
   python -m train.build_bank \
       --data data/healthy \
       --extractor-onnx models/healthy_ae.onnx \
       --out models/bank.npy \
       --subsample-frac 0.01
   ```

   ~20 s for 2,400 images on a laptop CPU. Writes `models/bank.npy` and
   stamps `models/ae_meta.json` with bank metadata.

5. Calibrate the threshold:

   ```bash
   python -m train.calibrate \
       --healthy-dir  data/healthy \
       --diseased-dir data/diseased_calib \
       --meta models/ae_meta.json \
       --objective youden
   ```

   `--objective youden` maximises TPR − FPR (balanced precision/recall).
   `--objective f1` maximises F1.
   `--objective accuracy` maximises plain accuracy.

6. Copy `models/healthy_ae.onnx`, `models/bank.npy`, and
   `models/ae_meta.json` to the Pi.

## Run (Pi)

Single-image inference, human-readable:

```bash
growcast-anomaly detect /path/to/leaf.jpg --heatmap
```

Robot-IPC mode — one JSON object per scan, line-delimited on stdout:

```bash
growcast-anomaly detect /path/to/leaf.jpg --json --heatmap
```

Live webcam loop (the demo):

```bash
growcast-anomaly capture --device 0 --interval 2 --json --heatmap-dir /tmp/gc
```

## Robot IPC contract

```json
{
  "schema": "growcast.anomaly.v1",
  "image": "frame_00007.jpg",
  "verdict": "anomaly",
  "score": 0.0214,
  "threshold": 0.0091,
  "confidence": 0.87,
  "heatmap_path": "/tmp/gc/frame_00007.heatmap.png",
  "latency_ms": 712,
  "algorithm": "conv-autoencoder",
  "model_version": "healthy_ae.v1",
  "timestamp": "2026-05-06T12:34:56Z"
}
```

The robot presenter spawns `growcast-anomaly capture --json ...` as a
subprocess, reads each line, and:

- `verdict == "anomaly"` → TTS *"I'm seeing something unusual on this leaf,
  confidence 87%"* + display `heatmap_path` on the robot's screen.
- `verdict == "normal"` → TTS *"This leaf looks healthy."*

## Measured accuracy on PlantVillage

The shipped model is **PatchCore-lite** — a frozen ImageNet-pretrained
WideResNet50 emits multi-scale per-position embeddings (concatenation of
`layer2` 2×2-pooled and `layer3`, L2-normalised, 1536-d × 196 positions per
image). At inference time each query embedding's anomaly score is
`1 − mean(top-5 cosine similarities)` against a precomputed greedy-coreset
memory bank of healthy embeddings. Image score = 95th percentile of
per-position scores.

Built from 2,352 PlantVillage healthy leaves (200 each from 12 classes);
memory bank is a **9,220-vector greedy k-center coreset** (2% of all
extracted positions, 56 MB on disk). Calibrated with Youden's J on a 300+300
held-out healthy/diseased mix:

| Metric | Value |
|---|---|
| **Accuracy** | **94.2%** |
| **Precision** | **95.5%** |
| **Specificity** | **95.7%** |
| **Recall (sensitivity)** | **92.7%** |
| F1 | 0.941 |
| Threshold | 0.256 |

Spot-checked on an unseen 17-image holdout (12 healthy + 5 diseased):
**100%** combined accuracy, **5/5 diseased caught, 12/12 healthy correct**.

### Algorithm choice rationale

This maps to **Algorithm 2 (LOF / k-nearest-neighbour density)** in the
GrowCast lit review, applied to deep CNN features instead of tabular data.
Iteration history:

| Iteration | Approach | Accuracy |
|---|---|---|
| v1 | Pixel Conv-AE, 32-d bottleneck | 60.5% |
| v2 | Feature-space Conv-AE (MobileNetV2.features[:14]) | 81.2% |
| v3 | PatchCore-lite, MobileNetV2 layers 7+14, 1% random | 90.2% |
| **v4** | **PatchCore-lite, WideResNet50 layers 2+3, 2% greedy coreset, top-5 k-NN** | **94.2%** |

The pixel-AE failure mode is the one Bergmann et al. (MVTec, 2019) call out:
raw pixels carry too much low-level texture noise to discriminate disease.
Feature-space AE fixed most of it; PatchCore replaced the parametric
reconstruction model with a non-parametric memory bank; v4's larger backbone
+ greedy coreset + top-5 averaging closed most of the remaining gap.

### Pi deployment

The Pi loads three artifacts:

- `models/healthy_ae.onnx` — frozen WideResNet50 feature extractor (~95 MB)
- `models/bank.npy` — greedy-coreset healthy memory bank (~56 MB)
- `models/ae_meta.json` — calibrated threshold + provenance

The Pi only ever runs `onnxruntime` + numpy — no PyTorch, no torchvision.
Inference: ~150 ms on this Mac CPU; estimated 1.5–2.5 s per frame on Pi 4 CPU.
The bigger backbone is the latency cost; if real-time matters more than the
last few accuracy points, swap back to v3's MobileNetV2 build (90% accuracy,
~10× smaller, ~10× faster).

Live sensitivity tuning still supported via `--threshold <value>`.

## Exit codes (`detect` only)

- `0` — verdict was `normal`.
- `2` — verdict was `anomaly`.
- non-zero (other) — error.

This makes shell-level wiring trivial:

```bash
growcast-anomaly detect leaf.jpg --json && echo "ok" || echo "anomaly"
```
