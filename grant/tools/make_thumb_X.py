import numpy as np, cv2, random, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops, ImageEnhance
FONT = '/home/user/battle-maps/grant/tools/oswald-latin-700-normal.ttf'
W, H = 1280, 720
bg = Image.open('bg_usual.png').convert('RGB').resize((W, H), Image.LANCZOS)
# darken right third further for the portrait
g = Image.new('L', (W, H), 0); gd = ImageDraw.Draw(g)
for x in range(W): gd.line([(x, 0), (x, H)], fill=int(min(170, max(0, (x - 720) * 0.45))))
bg = Image.composite(Image.new('RGB', (W, H), (12, 12, 14)), bg, g)
# ---- real Brady portrait, natural colourisation, face pop, cool rim
cut = Image.open('cut.png').convert('RGBA'); sc = 1.95
cut = cut.resize((int(cut.width * sc), int(cut.height * sc)), Image.LANCZOS)
gr = np.array(cut.convert('L')).astype(np.float32) / 255
gr = cv2.bilateralFilter(gr, 5, 0.08, 4)                      # soften scan specks
gr = np.clip((gr - 0.08) / 0.82, 0, 1) ** 1.12                  # highlights down, contrast up
lut_s = np.array([[20, 12, 12], [112, 64, 46], [196, 140, 112], [240, 210, 186]], np.float32)  # natural skin, auburn beard
lut_c = np.array([[6, 10, 20], [26, 40, 72], [70, 90, 132], [170, 186, 210]], np.float32)       # dark blue coat
def gm(x, lut):
    y = x * 3; i = np.clip(y.astype(int), 0, 2); f = (y - i)[..., None]; return lut[i] * (1 - f) + lut[i + 1] * f
Hh, Ww = gr.shape; yy, xx = np.mgrid[0:Hh, 0:Ww]
fm = np.exp(-(((xx - 335 * sc) / (150 * sc)) ** 2 + ((yy - 345 * sc) / (190 * sc)) ** 2) ** 1.5)
fm = cv2.GaussianBlur(fm, (0, 0), 14)[..., None]
col = gm(gr, lut_s) * fm + gm(gr, lut_c) * (1 - fm)
eyes = np.exp(-(((xx - 340 * sc) / (60 * sc)) ** 2 + ((yy - 325 * sc) / (12 * sc)) ** 2))[..., None]   # blue-grey eyes hint
col = col * (1 - 0.25 * eyes) + np.array([120, 140, 160]) * 0.25 * eyes
por = ImageEnhance.Sharpness(Image.fromarray(np.clip(col, 0, 255).astype(np.uint8))).enhance(1.5)
alpha = cut.getchannel('A').filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(1.2))
cutoff = int(560 * sc); fade = Image.new('L', cut.size, 255); fd = ImageDraw.Draw(fade)
for y in range(cut.height): fd.line([(0, y), (cut.width, y)], fill=255 if y < cutoff - 140 else int(max(0, 255 * (1 - (y - (cutoff - 140)) / 140))))
alpha = ImageChops.multiply(alpha, fade)
sm_ = Image.new('L', cut.size, 255); ImageDraw.Draw(sm_).rectangle([int(100 * sc), int(490 * sc), int(275 * sc), int(620 * sc)], fill=0)
alpha = ImageChops.multiply(alpha, sm_.filter(ImageFilter.GaussianBlur(int(22 * sc))))
ox, oy = int(1060 - 335 * sc), int(18 - 200 * sc)
canvas = bg.convert('RGBA')
sh = Image.new('RGBA', cut.size, (0, 0, 0, 0)); sh.putalpha(alpha.filter(ImageFilter.GaussianBlur(18)).point(lambda v: int(v * 0.75)))
canvas.alpha_composite(sh, (ox - 16, oy + 10))
rim = Image.new('RGBA', cut.size, (255, 236, 205, 0)); rim.putalpha(ImageChops.subtract(alpha.filter(ImageFilter.MaxFilter(5)), alpha).filter(ImageFilter.GaussianBlur(3)).point(lambda v: int(v * 0.35)))
canvas.alpha_composite(rim, (ox, oy))
pa = por.convert('RGBA'); pa.putalpha(alpha); canvas.alpha_composite(pa, (ox, oy))
base = canvas.convert('RGB')
# ---- torn red brush banner + distressed white text
def brush_banner(img, x0, y0, x1, y1, seed):
    rng = np.random.default_rng(seed); m = np.zeros((H, W), np.uint8)
    for k in range(9):    # stacked rough strokes
        yy0 = y0 + k * (y1 - y0) / 9; th = (y1 - y0) / 9 + 14
        xs = np.arange(x0 + rng.integers(-30, 10), x1 + rng.integers(-40, 40), 4)
        top = yy0 + rng.normal(0, 3, len(xs)); bot = top + th
        pts = list(zip(xs, top)) + list(zip(xs[::-1], bot[::-1]))
        cv2.fillPoly(m, [np.array(pts, np.int32)], 255)
    # ragged ends
    noise = cv2.GaussianBlur((rng.random((H, W)) * 255).astype(np.uint8), (0, 0), 3)
    edge = cv2.morphologyEx(m, cv2.MORPH_GRADIENT, np.ones((25, 25), np.uint8))
    m = np.where((edge > 0) & (noise < 120), 0, m).astype(np.uint8)
    M = Image.fromarray(m).filter(ImageFilter.GaussianBlur(1))
    shd = Image.new('RGBA', (W, H), (0, 0, 0, 0)); shd.putalpha(M.filter(ImageFilter.GaussianBlur(10)).point(lambda v: int(v * 0.7)))
    out = img.convert('RGBA'); out.alpha_composite(shd, (6, 9))
    red = np.zeros((H, W, 3), np.float32); red[...] = (196, 18, 28)
    tex = cv2.GaussianBlur(rng.normal(0, 1, (H, W)).astype(np.float32), (0, 0), 2) * 14
    red = np.clip(red + tex[..., None] * np.array([1, 0.3, 0.3]), 0, 255)
    rl = Image.fromarray(red.astype(np.uint8)).convert('RGBA'); rl.putalpha(M); out.alpha_composite(rl)
    return out
def distressed_text(img, txt, box, size, seed):
    x0, y0, x1, y1 = box; f = ImageFont.truetype(FONT, size)
    while f.getlength(txt) > (x1 - x0) - 40: size -= 4; f = ImageFont.truetype(FONT, size)
    tw = f.getlength(txt); tb = f.getbbox(txt); th = tb[3] - tb[1]
    x = x0 + ((x1 - x0) - tw) / 2; y = y0 + ((y1 - y0) - th) / 2 - tb[1]
    L = Image.new('L', (W, H), 0); ImageDraw.Draw(L).text((x, y), txt, font=f, fill=255)
    rng = np.random.default_rng(seed); sp = (rng.random((H, W)) < 0.012).astype(np.uint8) * 255
    sp = cv2.dilate(sp, np.ones((2, 2), np.uint8)); Larr = np.array(L); Larr[sp > 0] = (Larr[sp > 0] * 0.25).astype(np.uint8)
    wl = Image.new('RGBA', (W, H), (250, 248, 240, 0)); wl.putalpha(Image.fromarray(Larr))
    sl = Image.new('RGBA', (W, H), (0, 0, 0, 0)); sl.putalpha(L.filter(ImageFilter.GaussianBlur(4)).point(lambda v: int(v * 0.55)))
    img.alpha_composite(sl, (3, 5)); img.alpha_composite(wl); return img
for name, txt in [('X1', 'THE BACK DOOR'), ('X2', '29,500 SURRENDERED'), ('X3', 'NO WAY IN?')]:
    c = brush_banner(base, 0, 540, 800, 688, 11)
    c = distressed_text(c, txt, (10, 540, 790, 688), 132, 4)
    c.convert('RGB').save(f'{name}.jpg', quality=95)
s = Image.new('RGB', (W, H * 3 + 20), (25, 25, 25))
for i, n in enumerate(['X1', 'X2', 'X3']): s.paste(Image.open(n + '.jpg'), (0, i * (H + 10)))
s.resize((640, (H * 3 + 20) // 2)).save('sheet_X.jpg'); print('ok')
