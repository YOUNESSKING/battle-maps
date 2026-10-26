"""AI upscale low-resolution archive images (Real-ESRGAN x4plus, ONNX, BSD-3; owner v6: "you used low-quality images").
usage (from morgan/): python3 tools/upscale.py archive/a02.jpg [...]   -> overwrites each file with a ~2400 px wide version
(the original is kept as archive/orig/<name>). Tiles of 128 px with 16 px overlap, x4, then resized to TARGET width."""
import os, sys
import numpy as np, onnxruntime as ort
from PIL import Image

TARGET, T, OV = 2400, 128, 16
so = ort.SessionOptions(); so.log_severity_level = 3
sess = ort.InferenceSession("/opt/models/realesrgan_x4plus_128.onnx", so, providers=["CPUExecutionProvider"])


def up4(img):
    a = np.asarray(img.convert("RGB"), np.float32) / 255
    h, w, _ = a.shape
    out = np.zeros((h * 4, w * 4, 3), np.float32); wt = np.zeros((h * 4, w * 4, 1), np.float32)
    step = T - OV
    ys = list(range(0, max(1, h - T), step)) + [max(0, h - T)]; xs = list(range(0, max(1, w - T), step)) + [max(0, w - T)]
    ramp = np.minimum(np.minimum(np.arange(T * 4) + 1, np.arange(T * 4)[::-1] + 1), OV * 4) / (OV * 4)
    win = (ramp[:, None] * ramp[None, :])[..., None]
    for y in sorted(set(ys)):
        for x in sorted(set(xs)):
            tile = a[y:y + T, x:x + T]
            ph, pw = T - tile.shape[0], T - tile.shape[1]
            tile = np.pad(tile, ((0, ph), (0, pw), (0, 0)), mode="reflect")
            r = sess.run(None, {"image": tile.transpose(2, 0, 1)[None]})[0][0].transpose(1, 2, 0)
            r = r[:T * 4 - ph * 4, :T * 4 - pw * 4]; ww = win[:r.shape[0], :r.shape[1]]
            out[y * 4:y * 4 + r.shape[0], x * 4:x * 4 + r.shape[1]] += r * ww; wt[y * 4:y * 4 + r.shape[0], x * 4:x * 4 + r.shape[1]] += ww
    return Image.fromarray((out / np.maximum(wt, 1e-6) * 255).clip(0, 255).astype(np.uint8))


for p in sys.argv[1:]:
    im = Image.open(p).convert("RGB")
    if im.width >= 1500:
        print("skip", p, im.size); continue
    os.makedirs(os.path.join(os.path.dirname(p), "orig"), exist_ok=True)
    keep = os.path.join(os.path.dirname(p), "orig", os.path.basename(p))
    if not os.path.exists(keep):
        im.save(keep, quality=95)
    src = Image.open(keep).convert("RGB")
    if src.width > 800:  # CPU time: x4 from <= 800 px (-> 3200, then down to TARGET); the model rebuilds the fine detail
        src = src.resize((800, int(src.height * 800 / src.width)), Image.LANCZOS)
    big = up4(src)
    big = big.resize((TARGET, int(big.height * TARGET / big.width)), Image.LANCZOS)
    big.save(p, quality=94); print("upscaled", p, im.size, "->", big.size, flush=True)
