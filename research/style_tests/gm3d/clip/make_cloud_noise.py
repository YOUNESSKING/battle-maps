"""Offline 3D cloud noise for the volumetric clouds (fx.js `vclouds`): one tileable 128^3 RGBA8 volume, deterministic.
R = Perlin-Worley (low-frequency shape breakup), G = inverted Worley fbm 4/8/16 cells (billows),
B = inverted Worley fbm 8/16/32 cells (fine cauliflower / erosion), A = Perlin fbm 4/8/16 (domain warp for torn edges).
usage: python3 make_cloud_noise.py  -> cloudtex/noise128.bin (raw x-fastest RGBA8, 8 MiB)"""
import os
import numpy as np

N = 128
HERE = os.path.dirname(os.path.abspath(__file__))
rng = np.random.default_rng(1863)
g = (np.arange(N, dtype=np.float32) + 0.5) / N
Z, Y, X = np.meshgrid(g, g, g, indexing="ij")   # index [z, y, x]


def worley(C):
    pts = rng.random((C, C, C, 3), dtype=np.float32)
    fx, fy, fz = X * C, Y * C, Z * C
    cx, cy, cz = np.floor(fx).astype(np.int32), np.floor(fy).astype(np.int32), np.floor(fz).astype(np.int32)
    best = np.full(X.shape, 9.0, np.float32)
    for dz in (-1, 0, 1):
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                xx, yy, zz = cx + dx, cy + dy, cz + dz
                p = pts[zz % C, yy % C, xx % C]
                d = (xx + p[..., 0] - fx) ** 2 + (yy + p[..., 1] - fy) ** 2 + (zz + p[..., 2] - fz) ** 2
                np.minimum(best, d, out=best)
    return np.clip(np.sqrt(best), 0, 1)


def perlin(C):
    gr = rng.normal(size=(C, C, C, 3)).astype(np.float32); gr /= np.linalg.norm(gr, axis=-1, keepdims=True)
    fx, fy, fz = X * C, Y * C, Z * C
    x0, y0, z0 = np.floor(fx).astype(np.int32), np.floor(fy).astype(np.int32), np.floor(fz).astype(np.int32)
    tx, ty, tz = fx - x0, fy - y0, fz - z0
    fade = lambda t: t * t * t * (t * (t * 6 - 15) + 10)
    u, v, w = fade(tx), fade(ty), fade(tz)
    out = 0
    for dz in (0, 1):
        for dy in (0, 1):
            for dx in (0, 1):
                G = gr[(z0 + dz) % C, (y0 + dy) % C, (x0 + dx) % C]
                dot = G[..., 0] * (tx - dx) + G[..., 1] * (ty - dy) + G[..., 2] * (tz - dz)
                wt = (u if dx else 1 - u) * (v if dy else 1 - v) * (w if dz else 1 - w)
                out = out + wt * dot
    return out * 0.5 + 0.5


def remap(v, a, b, c, d):
    return c + (v - a) / (b - a) * (d - c)


p = perlin(4) * 0.55 + perlin(8) * 0.28 + perlin(16) * 0.17
w4, w8, w16, w32 = 1 - worley(4), 1 - worley(8), 1 - worley(16), 1 - worley(32)
wf_lo = w4 * 0.625 + w8 * 0.25 + w16 * 0.125
wf_hi = w8 * 0.625 + w16 * 0.25 + w32 * 0.125
pw = np.clip(remap(p, wf_lo - 1, 1, 0, 1), 0, 1)              # Perlin-Worley (Schneider 2015)
warp = perlin(4) * 0.5 + perlin(8) * 0.3 + perlin(16) * 0.2


def norm(a):
    lo, hi = np.percentile(a, 0.5), np.percentile(a, 99.5)
    return np.clip((a - lo) / (hi - lo), 0, 1)


vol = np.stack([norm(pw), norm(wf_lo), norm(wf_hi), norm(warp)], axis=-1)
os.makedirs(f"{HERE}/cloudtex", exist_ok=True)
(vol * 255 + 0.5).astype(np.uint8).tofile(f"{HERE}/cloudtex/noise128.bin")
print("noise128.bin", vol.shape, [round(float(vol[..., i].mean()), 3) for i in range(4)])
