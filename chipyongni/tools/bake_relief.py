"""Bake a muted parchment shaded-relief basemap from open AWS Terrarium tiles.

Elevation: Mapzen/AWS Terrain Tiles (SRTM and others), open data.
Re-run after changing CENTER, Z, SIZE, EXAGGERATION or the colors below.
"""
import io
import json
import math
import os
import urllib.request

import numpy as np
from PIL import Image, ImageFilter

CENTER = (37.4750, 127.6370)  # Chipyong-ni (lat, lon)
Z = 14                        # 7.58 m per pixel at this latitude
SIZE = (2880, 1620)           # output width, height
EXAGGERATION = 2.2
LOW = np.array([222, 208, 172], float)   # valley parchment
HIGH = np.array([150, 148, 108], float)  # ridge olive
SHADOW = np.array([70, 62, 48], float)
TILE_URL = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, "..", "assets")
CACHE = os.path.join(HERE, ".tiles")


def world_px(lat, lon, z):
    n = 256 * 2 ** z
    x = (lon + 180) / 360 * n
    y = (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n
    return x, y


def tile(x, y):
    os.makedirs(CACHE, exist_ok=True)
    path = os.path.join(CACHE, f"{Z}_{x}_{y}.png")
    if not os.path.exists(path):
        with urllib.request.urlopen(TILE_URL.format(z=Z, x=x, y=y)) as r:
            open(path, "wb").write(r.read())
    a = np.asarray(Image.open(path).convert("RGB"), float)
    return a[..., 0] * 256 + a[..., 1] + a[..., 2] / 256 - 32768


def main():
    w, h = SIZE
    cx, cy = world_px(*CENTER, Z)
    x0, y0 = int(cx - w / 2), int(cy - h / 2)
    tx0, ty0 = x0 // 256, y0 // 256
    tx1, ty1 = (x0 + w) // 256, (y0 + h) // 256
    mosaic = np.vstack([
        np.hstack([tile(tx, ty) for tx in range(tx0, tx1 + 1)])
        for ty in range(ty0, ty1 + 1)
    ])
    ox, oy = x0 - tx0 * 256, y0 - ty0 * 256
    elev = mosaic[oy:oy + h, ox:ox + w]
    elev = np.clip(elev, 0, None)  # drop no-data spikes (terrain here is all above sea level)

    mpp = 156543.03392 * math.cos(math.radians(CENTER[0])) / 2 ** Z
    k = np.array([1, 4, 6, 4, 1], float) / 16  # small separable blur to soften SRTM stepping
    smooth = np.pad(elev, 2, mode="edge")
    smooth = np.apply_along_axis(lambda r: np.convolve(r, k, "valid"), 1, smooth)
    smooth = np.apply_along_axis(lambda c: np.convolve(c, k, "valid"), 0, smooth)
    gy, gx = np.gradient(smooth * EXAGGERATION, mpp)
    slope = np.arctan(np.hypot(gx, gy))
    aspect = np.arctan2(-gx, gy)

    def shade(az, alt):
        az, alt = math.radians(az), math.radians(alt)
        return np.clip(np.sin(alt) * np.cos(slope) + np.cos(alt) * np.sin(slope) * np.cos(az - aspect), 0, 1)

    hs = 0.6 * shade(315, 40) + 0.25 * shade(270, 50) + 0.15 * shade(0, 60)
    t = np.clip((elev - np.percentile(elev, 2)) / (np.percentile(elev, 98) - np.percentile(elev, 2)), 0, 1)[..., None]
    base = LOW * (1 - t) + HIGH * t
    hs = hs[..., None]
    rgb = base * (0.55 + 0.55 * hs) * (hs > 0.5) + (SHADOW * (1 - hs * 2) * 0.35 + base * hs * 2 * 0.65 + base * 0.2) * (hs <= 0.5)
    rgb = base * 0.35 + rgb * 0.65

    # desaturate slightly and add deterministic paper grain
    grey = rgb.mean(axis=2, keepdims=True)
    rgb = grey * 0.25 + rgb * 0.75
    rng = np.random.default_rng(1951)
    grain = np.asarray(Image.fromarray((rng.normal(128, 40, (h // 2, w // 2))).clip(0, 255).astype(np.uint8))
                       .resize((w, h), Image.BILINEAR).filter(ImageFilter.GaussianBlur(0.8)), float)
    rgb = rgb + (grain[..., None] - 128) * 0.10
    img = Image.fromarray(rgb.clip(0, 255).astype(np.uint8))

    os.makedirs(ASSETS, exist_ok=True)
    img.save(os.path.join(ASSETS, "relief.jpg"), quality=90)
    lat_lon = lambda px, py: (
        math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * (y0 + py) / (256 * 2 ** Z))))),
        (x0 + px) / (256 * 2 ** Z) * 360 - 180,
    )
    json.dump({
        "center": CENTER, "zoom": Z, "size": SIZE, "meters_per_px": round(mpp, 3),
        "px_per_mile": round(1609.344 / mpp, 1),
        "top_left": lat_lon(0, 0), "bottom_right": lat_lon(w, h),
        "elevation_m": [round(float(elev.min())), round(float(elev.max()))],
        "credit": "Terrain: Mapzen/AWS Terrain Tiles (SRTM, open data)",
    }, open(os.path.join(ASSETS, "relief-coords.json"), "w"), indent=2)
    print("baked", img.size, f"{mpp:.2f} m/px", f"elev {elev.min():.0f}-{elev.max():.0f} m")


if __name__ == "__main__":
    main()
