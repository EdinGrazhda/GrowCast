"""Conv-Autoencoder with a proper FC bottleneck.

Encoder: 224 -> 112 -> 56 -> 28 -> 14 (256 ch) -> flatten -> Linear(LATENT)
Decoder: Linear -> reshape (256, 14, 14) -> mirrored upsample -> 224

The FC bottleneck is the load-bearing piece. Without it, a fully-convolutional
AE retains enough spatial capacity (256*14*14 = 50,176 floats) to pass any
input through almost unchanged, and disease lesions reconstruct as cleanly as
healthy tissue. With a 128-d bottleneck the AE is forced to learn a compact
representation of "healthy leaves on segmented background"; anomalous lesions
fall outside that manifold and produce elevated reconstruction error.
"""

from __future__ import annotations

import torch
from torch import nn

LATENT_DIM = 32
_FEAT_CH = 256
_FEAT_HW = 14  # 224 / 2^4


def _enc_block(in_ch: int, out_ch: int) -> nn.Sequential:
    return nn.Sequential(
        nn.Conv2d(in_ch, out_ch, kernel_size=4, stride=2, padding=1),
        nn.BatchNorm2d(out_ch),
        nn.ReLU(inplace=True),
    )


def _dec_block(in_ch: int, out_ch: int, last: bool = False) -> nn.Sequential:
    layers = [nn.ConvTranspose2d(in_ch, out_ch, kernel_size=4, stride=2, padding=1)]
    if last:
        return nn.Sequential(*layers)
    layers += [nn.BatchNorm2d(out_ch), nn.ReLU(inplace=True)]
    return nn.Sequential(*layers)


class ConvAutoencoder(nn.Module):
    def __init__(self, latent_dim: int = LATENT_DIM) -> None:
        super().__init__()
        self.latent_dim = latent_dim
        self._feat_shape = (_FEAT_CH, _FEAT_HW, _FEAT_HW)

        self.encoder_conv = nn.Sequential(
            _enc_block(3, 32),
            _enc_block(32, 64),
            _enc_block(64, 128),
            _enc_block(128, _FEAT_CH),
        )
        flat = _FEAT_CH * _FEAT_HW * _FEAT_HW
        self.encoder_fc = nn.Linear(flat, latent_dim)
        self.decoder_fc = nn.Linear(latent_dim, flat)
        self.decoder_conv = nn.Sequential(
            _dec_block(_FEAT_CH, 128),
            _dec_block(128, 64),
            _dec_block(64, 32),
            _dec_block(32, 3, last=True),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        feat = self.encoder_conv(x)
        z = self.encoder_fc(feat.flatten(1))
        feat2 = self.decoder_fc(z).view(-1, *self._feat_shape)
        return self.decoder_conv(feat2)
