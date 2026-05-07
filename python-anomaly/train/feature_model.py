"""Feature-space anomaly module.

Combines a frozen MobileNetV2 backbone (ImageNet-pretrained) with a small
trainable Conv-AE that reconstructs a mid-layer feature map. At inference
time the module returns a per-position score map directly — squared
reconstruction error averaged over channels at each spatial position.

This is the v2 architecture; the v1 pixel-MSE AE plateaued around 60%
accuracy on PlantVillage. Operating in MobileNetV2 feature space gives the
AE a semantic input where disease deviates cleanly from the healthy manifold.
The whole module exports as a single self-contained ONNX so the Pi runs one
session and never needs torchvision.
"""

from __future__ import annotations

import torch
from torch import nn
from torchvision.models import MobileNet_V2_Weights, mobilenet_v2

# MobileNetV2 layer choice. features[:14] = stem + first 13 inverted-residual
# blocks. With 224x224 input this outputs a (96, 14, 14) tensor — 14×14 is
# enough spatial resolution for a meaningful upsampled heatmap, and 96
# channels is small enough that the feature-AE stays tiny.
BACKBONE_CUT = 14
FEAT_CH = 96
FEAT_HW = 14
LATENT_DIM = 64


class FrozenBackbone(nn.Module):
    """MobileNetV2 features[:BACKBONE_CUT], frozen, BatchNorm in eval mode."""

    def __init__(self) -> None:
        super().__init__()
        full = mobilenet_v2(weights=MobileNet_V2_Weights.DEFAULT).features
        self.body = nn.Sequential(*list(full.children())[:BACKBONE_CUT])
        for p in self.parameters():
            p.requires_grad = False

    def train(self, mode: bool = True):
        # Even when the surrounding module is in train(), the backbone stays
        # in eval() so BatchNorm running stats don't drift.
        super().train(mode)
        for m in self.modules():
            if isinstance(m, nn.BatchNorm2d):
                m.eval()
        return self

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.body(x)


class FeatureConvAE(nn.Module):
    """Conv-AE on (FEAT_CH, FEAT_HW, FEAT_HW) feature maps with FC bottleneck."""

    def __init__(self, latent_dim: int = LATENT_DIM) -> None:
        super().__init__()
        self.latent_dim = latent_dim

        # Encoder: 14x14 -> 7x7 -> flatten -> latent
        self.enc_conv = nn.Sequential(
            nn.Conv2d(FEAT_CH, 64, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(64, 32, kernel_size=4, stride=2, padding=1),  # 14 -> 7
            nn.ReLU(inplace=True),
        )
        self._mid_flat = 32 * 7 * 7
        self.enc_fc = nn.Linear(self._mid_flat, latent_dim)

        # Decoder: latent -> 7x7 -> 14x14
        self.dec_fc = nn.Linear(latent_dim, self._mid_flat)
        self.dec_conv = nn.Sequential(
            nn.ReLU(inplace=True),
            nn.ConvTranspose2d(32, 64, kernel_size=4, stride=2, padding=1),  # 7 -> 14
            nn.ReLU(inplace=True),
            nn.Conv2d(64, FEAT_CH, kernel_size=3, padding=1),
        )

    def forward(self, feat: torch.Tensor) -> torch.Tensor:
        z = self.enc_fc(self.enc_conv(feat).flatten(1))
        out = self.dec_fc(z).view(-1, 32, 7, 7)
        return self.dec_conv(out)


class AnomalyModule(nn.Module):
    """End-to-end module that goes from image to per-position score map."""

    def __init__(self, latent_dim: int = LATENT_DIM) -> None:
        super().__init__()
        self.backbone = FrozenBackbone()
        self.ae = FeatureConvAE(latent_dim=latent_dim)

    def extract(self, x: torch.Tensor) -> torch.Tensor:
        with torch.no_grad():
            return self.backbone(x)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        feat = self.backbone(x)
        recon = self.ae(feat)
        # Per-position MSE across channels -> (B, H, W)
        return ((feat - recon) ** 2).mean(dim=1)
