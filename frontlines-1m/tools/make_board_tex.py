"""Dark 'Frontlines' board texture for the Nijmegen crossing map: basemap graded dark + the Waal (water mask) in deep glowing blue."""
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
b = Image.open("assets/nijmegen.jpg").convert("RGB")
b = ImageEnhance.Color(b).enhance(0.25); b = ImageEnhance.Brightness(b).enhance(0.42); b = ImageEnhance.Contrast(b).enhance(1.25)
a = np.asarray(b, np.float32) * np.array([0.9, 0.97, 1.08])
w = np.asarray(Image.open("assets/nijmegen_water.png").convert("RGBA"))[..., 3].astype(np.float32) / 255
glow = np.asarray(Image.fromarray((w * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(14)), np.float32) / 255
water = np.array([18, 44, 82], np.float32); edge = np.array([70, 140, 230], np.float32)
a = a * (1 - w[..., None]) + water * w[..., None]
a = a + edge * np.clip(glow - w, 0, 1)[..., None] * 0.9
Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).save("assets/media/board_nijmegen.jpg", quality=92)
Image.new("L", (64, 36), 0).save("assets/flat_height.png")
print("ok")
