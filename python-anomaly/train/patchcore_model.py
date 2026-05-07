"""PatchCore-lite feature extractor — WideResNet50 backbone (v3.1).

Concatenates two WideResNet50 mid-layer feature maps (different scales) into
a single per-position embedding tensor. The Pi-side runtime then does k-NN
distance scoring against a pre-built memory bank of healthy embeddings.

Backbone choice: WideResNet50_2 — the same backbone the original PatchCore
paper uses to hit 99.6% AUROC on MVTec AD. Materially richer features than
MobileNetV2; ONNX is bigger (~95 MB vs 3.6 MB) and Pi-side latency rises to
~2 s per frame, but accuracy ceiling lifts ~5 percentage points.

Layers used:
- layer2: 512 ch @ 28x28   (mid-level)
- layer3: 1024 ch @ 14x14  (semantic / object-level)

layer2 is 2x2-avg-pooled to 14x14 and concatenated channel-wise with layer3
→ 1536 ch @ 14x14 → 196 per-position embeddings of dim 1536.
"""

from __future__ import annotations

import torch
import torch.nn.functional as F
from torch import nn
from torchvision.models import Wide_ResNet50_2_Weights, wide_resnet50_2

EMBED_DIM = 512 + 1024  # 1536
SPATIAL = 14
N_POSITIONS = SPATIAL * SPATIAL  # 196


class PatchCoreExtractor(nn.Module):
    """Frozen WideResNet50 multi-scale feature extractor.

    forward(x) -> (B, N_POSITIONS, EMBED_DIM)  L2-normalised per-position vectors.
    """

    def __init__(self) -> None:
        super().__init__()
        m = wide_resnet50_2(weights=Wide_ResNet50_2_Weights.DEFAULT)
        self.stem = nn.Sequential(m.conv1, m.bn1, m.relu, m.maxpool)
        self.layer1 = m.layer1
        self.layer2 = m.layer2
        self.layer3 = m.layer3
        # layer4 + avgpool + fc deliberately discarded — we don't need them
        # and dropping them shrinks the ONNX significantly.
        for p in self.parameters():
            p.requires_grad = False

    def train(self, mode: bool = True):
        # Keep BatchNorm running stats frozen.
        super().train(mode)
        for m in self.modules():
            if isinstance(m, nn.BatchNorm2d):
                m.eval()
        return self

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.stem(x)               # (B, 64, 56, 56)
        x = self.layer1(x)             # (B, 256, 56, 56)
        f2 = self.layer2(x)            # (B, 512, 28, 28)
        f3 = self.layer3(f2)           # (B, 1024, 14, 14)
        f2_pooled = F.avg_pool2d(f2, kernel_size=2, stride=2)  # 28→14
        feat = torch.cat([f2_pooled, f3], dim=1)               # (B, 1536, 14, 14)

        b = feat.shape[0]
        feat = feat.permute(0, 2, 3, 1).reshape(b, N_POSITIONS, EMBED_DIM)
        feat = F.normalize(feat, p=2, dim=2)
        return feat
