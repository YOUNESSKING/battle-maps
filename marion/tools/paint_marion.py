"""Turn the 1876 Currier & Ives lithograph of Marion (PD) into a warm painted-look colour portrait for thumbnails (no AI):
melt the engraving hatching, tritone, hand-placed colour zones (skin, dark-blue coat, cream cravat, leather helmet), warm rim light.
out: youtube/thumb/marion_painted.png (RGBA)"""
import numpy as np
from PIL import Image, ImageFilter, ImageOps, ImageDraw, ImageEnhance, ImageChops
cut = Image.open("youtube/thumb/marion_lc_bust_cut.png").convert("RGBA")
A = cut.split()[3].filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(2.5))
g = ImageOps.grayscale(cut.convert("RGB")).filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.GaussianBlur(1.6))
g = ImageOps.autocontrast(g, cutoff=1)
base = ImageOps.colorize(g, black=(24, 18, 12), mid=(140, 106, 70), white=(243, 227, 198))
W, H = cut.size
def zone(shape, blur):
    m = Image.new("L", (W, H), 0); d = ImageDraw.Draw(m); shape(d); return m.filter(ImageFilter.GaussianBlur(blur))
# colour zones (lithograph bust coords, measured on a grid): luminance-preserving colour per zone
face = zone(lambda d: d.ellipse([352, 240, 498, 352], fill=255), 10)
neck = zone(lambda d: d.polygon([(372, 330), (470, 330), (476, 395), (366, 395)], fill=255), 10)
helm = zone(lambda d: d.polygon([(330, 140), (510, 140), (515, 252), (335, 252)], fill=255), 8)
plume = zone(lambda d: d.polygon([(405, 15), (505, 15), (500, 150), (410, 150)], fill=255), 8)
crav = zone(lambda d: d.polygon([(385, 385), (490, 385), (500, 560), (430, 600), (378, 560)], fill=255), 10)
coat = zone(lambda d: d.polygon([(270, 395), (565, 395), (575, 760), (265, 760)], fill=255), 12)
sash = zone(lambda d: d.polygon([(265, 640), (575, 640), (575, 760), (265, 760)], fill=255), 10)
def cz(black, mid, white): return ImageOps.colorize(g, black=black, mid=mid, white=white)
def put(img, mask, colimg, amt=1.0): return Image.composite(colimg, img, mask.point(lambda v: int(v * amt)))
out = base
out = put(out, coat, cz((6, 9, 20), (26, 40, 80), (78, 98, 146)))            # Continental dark blue
out = put(out, sash, cz((26, 6, 6), (110, 26, 24), (176, 70, 58)), 0.8)      # red sash
out = put(out, crav, cz((60, 52, 44), (196, 186, 166), (240, 232, 214)))         # cream cravat
out = put(out, ImageChops.lighter(face, neck), cz((52, 26, 14), (178, 112, 80), (236, 196, 160)))   # skin
out = put(out, helm, cz((16, 10, 6), (92, 64, 38), (200, 170, 126)))             # leather helmet
out = put(out, plume, cz((40, 36, 34), (190, 186, 178), (250, 248, 242)), 0.9)
out = ImageEnhance.Contrast(out).enhance(1.08); out = ImageEnhance.Color(out).enhance(0.85); out = ImageEnhance.Brightness(out).enhance(0.92)
# warm key light from the left + cool fill right (painted look)
L = Image.linear_gradient("L").rotate(90).resize((W, H))   # 0 left .. 255 right after rotate? normalise
grad = np.linspace(1.04, 0.78, W)[None, :, None]
arr = np.asarray(out).astype(float) * grad
arr[..., 0] *= 1.03; arr[..., 2] *= 0.96
out = Image.fromarray(np.clip(arr, 0, 255).astype("uint8"))
# subtle canvas grain
noise = Image.effect_noise((W, H), 10).convert("RGB"); out = Image.blend(out, ImageChops.overlay(out, noise), 0.25)
res = out.convert("RGBA"); res.putalpha(A)
res.save("youtube/thumb/marion_painted.png")
prev = Image.new("RGBA", (W, H), (30, 24, 18, 255)); prev.alpha_composite(res); prev.convert("RGB").resize((W // 2, H // 2)).save("/tmp/claude-0/-home-user-battle-maps/d2193916-cfa7-586c-889e-763a64804f90/scratchpad/painted.jpg")
print("ok")
