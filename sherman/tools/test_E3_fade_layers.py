# TEST E3: territory colour fades away with distance from the front line. Writes only assets/media/test_E3{a,b}_*.
import numpy as np
from PIL import Image
from scipy import ndimage
V = {"a": (450, 0.30), "b": (250, 0.12)}   # fade distance (px of the 2880 world), colour left far from the front
for d in ("jul03", "jul10", "jul22", "aug64", "sep64"):
    X = np.asarray(Image.open(f"assets/media/atlanta_ctl_{d}_mx.png").convert("RGBA")).astype(np.float32)
    on = X[..., 3] > 30
    red = (X[..., 0] > X[..., 2] + 40) & on; blue = (X[..., 2] > X[..., 0] + 40) & on
    edge = (ndimage.binary_dilation(red, iterations=3) & blue) | (ndimage.binary_dilation(blue, iterations=3) & red)
    dist = ndimage.distance_transform_edt(~edge) if edge.any() else np.full(on.shape, 1e9)
    for k, (D, floor) in V.items():
        t = np.clip(dist / D, 0, 1); t = t * t * (3 - 2 * t)
        Y = X.copy(); Y[..., 3] *= (1 - t) + floor * t
        Image.fromarray(Y.astype(np.uint8), "RGBA").save(f"assets/media/test_E3{k}_atlanta_ctl_{d}_mx.png", optimize=True)
    print(d, int(edge.sum()))
