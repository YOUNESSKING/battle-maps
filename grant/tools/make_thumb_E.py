import numpy as np, cv2, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
D = Image.open('/home/user/battle-maps/grant/youtube/grant-thumb-D_BEHIND_ENEMY_LINES.jpg').convert('RGB')
FONT = '/home/user/battle-maps/grant/tools/oswald-latin-700-normal.ttf'
W, H = 1280, 720
# ---- map: clean the old aerial (labels, blocks) by inpainting, keep x<700
a = np.array(D)
m = np.zeros((H, W), np.uint8)
hsv = cv2.cvtColor(a, cv2.COLOR_RGB2HSV)
r, g, b = a[..., 0].astype(int), a[..., 1].astype(int), a[..., 2].astype(int)
red = (r > 150) & (g < 70) & (b < 80)            # red flag blocks
blue = (b > 120) & (r < 60) & (g < 90)           # blue blocks
for msk in (red, blue):
    mm = msk.astype(np.uint8); n, lab, st, _ = cv2.connectedComponentsWithStats(mm)
    for i in range(1, n):
        x, y, w, h, ar = st[i]
        if 10 <= w <= 60 and 8 <= h <= 40 and ar > 0.6 * w * h and x < 700 and y < 480: m[y:y+h, x:x+w] = 255
for (x0, y0, x1, y1) in [(24, 16, 280, 76), (30, 296, 228, 342), (684, 244, 786, 294)]: m[y0:y1, x0:x1] = 255
m = cv2.dilate(m, np.ones((7, 7), np.uint8))
clean = cv2.inpaint(a, m, 5, cv2.INPAINT_TELEA)
clean = cv2.GaussianBlur(clean, (0, 0), 0.0001) if False else clean
x0_, y0_, x1_, y1_ = 20, 290, 235, 346
sm = cv2.GaussianBlur(clean[y0_-8:y1_+8, x0_-8:x1_+8], (0, 0), 7)
clean[y0_:y1_, x0_:x1_] = sm[8:-8, 8:-8]
bg = Image.fromarray(clean).crop((0, 0, 760, 720))
canvas = Image.new('RGB', (W, H), (8, 8, 10)); canvas.paste(bg, (0, 0))
# fade map into black toward the face
grad = Image.new('L', (W, H), 0); gd = ImageDraw.Draw(grad)
for x in range(W):
    v = 255 if x < 400 else int(max(0, 255 * (1 - (x - 400) / 300)))
    gd.line([(x, 0), (x, H)], fill=v)
canvas = Image.composite(canvas, Image.new('RGB', (W, H), (8, 8, 10)), grad)
# warm/contrast the map, vignette edges
arr = np.array(canvas).astype(np.float32)
arr[..., 0] *= 1.06; arr[..., 2] *= 0.92
yy, xx = np.mgrid[0:H, 0:W]; vig = 1 - 0.38 * (((xx - 330) / 520) ** 2 + ((yy - 360) / 520) ** 2)
arr *= np.clip(vig, 0.45, 1)[..., None]
canvas = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
# ---- arrow (Union blue, white outline): cross river low, sweep east, hook back into the city
d = ImageDraw.Draw(canvas, 'RGBA')
pts = [(70, 470), (230, 478), (420, 470), (585, 420), (640, 320), (610, 230), (520, 195), (440, 215)]
def bez(ps, n=60):
    out = []
    for t in np.linspace(0, 1, n):
        q = [np.array(p, float) for p in ps]
        while len(q) > 1: q = [(1 - t) * q[i] + t * q[i + 1] for i in range(len(q) - 1)]
        out.append(tuple(q[0]))
    return out
path = bez(pts)
shadow = Image.new('RGBA', (W, H), (0, 0, 0, 0)); sd = ImageDraw.Draw(shadow)
sd.line([(x + 7, y + 9) for x, y in path], fill=(0, 0, 0, 170), width=46, joint='curve'); shadow = shadow.filter(ImageFilter.GaussianBlur(8))
canvas.paste(shadow, (0, 0), shadow); d = ImageDraw.Draw(canvas, 'RGBA')
d.line(path, fill=(255, 255, 255, 255), width=44, joint='curve')
d.line(path, fill=(28, 96, 235, 255), width=32, joint='curve')
for p in path[::3]: d.ellipse([p[0] - 16, p[1] - 16, p[0] + 16, p[1] + 16], fill=(28, 96, 235, 255))
p1, p0 = np.array(path[-1]), np.array(path[-4]); v = (p1 - p0) / np.linalg.norm(p1 - p0); n = np.array([-v[1], v[0]])
tip = p1 + v * 64; l = p1 + n * 52 - v * 6; rr = p1 - n * 52 - v * 6
d.polygon([tuple(tip + v * 8), tuple(l - v * 8 + n * 8), tuple(rr - v * 8 - n * 8)], fill=(255, 255, 255, 255))
d.polygon([tuple(tip), tuple(l), tuple(rr)], fill=(28, 96, 235, 255))
gl = np.array(canvas).astype(np.float32); yy0, xx0 = np.mgrid[0:H, 0:W]
bw = np.exp(-(((xx0 - 1040) / 330) ** 2 + ((yy0 - 520) / 300) ** 2))[..., None]
gl += bw * np.array([95, 38, 18], np.float32); canvas = Image.fromarray(np.clip(gl, 0, 255).astype(np.uint8))
# ---- portrait: cutout, tighter, colourised, rim light
cut = Image.open('cut.png').convert('RGBA')
sc = 1.85
cut = cut.resize((int(cut.width * sc), int(cut.height * sc)), Image.LANCZOS)
gray = np.array(cut.convert('L')).astype(np.float32) / 255
gray = np.clip((gray - 0.5) * 1.35 + 0.52, 0, 1)                    # contrast
rgbp = np.zeros(gray.shape + (3,), np.float32)
lut_s = np.array([[14, 8, 10], [104, 48, 30], [205, 128, 92], [246, 206, 170]], np.float32)   # skin/beard warm
lut_c = np.array([[8, 12, 22], [34, 52, 92], [86, 112, 160], [190, 205, 228]], np.float32)       # coat blue
def grad_map(g, lut):
    x = g * 3; i = np.clip(x.astype(int), 0, 2); f = (x - i)[..., None]; return lut[i] * (1 - f) + lut[i + 1] * f
sk, co = grad_map(gray, lut_s), grad_map(gray, lut_c)
Hh, Ww = gray.shape; yy2, xx2 = np.mgrid[0:Hh, 0:Ww]
# face/beard region (source coords head ~ x 230-440,y 200-480) -> scaled, offset by crop below
fx, fy = (330 - 120) * sc / sc, 0  # placeholder
fm = np.zeros((Hh, Ww), np.float32)
cx, cy = 335 * sc, 345 * sc
fm = np.exp(-(((xx2 - cx) / (150 * sc)) ** 2 + ((yy2 - cy) / (190 * sc)) ** 2) ** 1.5)
fm = cv2.GaussianBlur(fm, (0, 0), 14)[..., None]
col = sk * fm + co * (1 - fm)
cut_rgb = Image.fromarray(np.clip(col, 0, 255).astype(np.uint8)); alpha = cut.getchannel('A')
# placement: hair top near y=40 -> bbox top of source 195*sc
ox = 1010 - int(335 * sc); oy = 22 - int(200 * sc)
# crop off the strap/lower body softly with a bottom fade
fade = Image.new('L', cut.size, 255); fd = ImageDraw.Draw(fade)
cutoff = int((505) * sc)
for y in range(cut.height):
    v = 255 if y < cutoff - 120 else int(max(0, 255 * (1 - (y - (cutoff - 120)) / 120)))
    fd.line([(0, y), (cut.width, y)], fill=v)
alpha = ImageChops.multiply(alpha, fade)
rim = alpha.filter(ImageFilter.GaussianBlur(3)); rim = ImageChops.subtract(alpha, ImageChops.offset(rim, 7, 0))   # left edge rim
rimcol = Image.new('RGB', cut.size, (255, 196, 120))
cut_rgb = Image.composite(rimcol, cut_rgb, rim.point(lambda v: min(255, v * 2)).filter(ImageFilter.GaussianBlur(2)))
glow = Image.new('RGBA', (W, H), (0, 0, 0, 0)); glow.paste(Image.new('RGBA', cut.size, (255, 170, 90, 150)), (ox, oy), alpha.filter(ImageFilter.GaussianBlur(10)))
glow = glow.filter(ImageFilter.GaussianBlur(14)); canvas.paste(glow, (0, 0), glow)
canvas.paste(cut_rgb, (ox, oy), alpha)
# ---- text: GRANT name + CUT LOOSE banner
def stroke_text(img, xy, txt, size, fill=(255, 255, 255), stroke=(10, 10, 10), sw=9):
    f = ImageFont.truetype(FONT, size); ImageDraw.Draw(img).text(xy, txt, font=f, fill=fill, stroke_width=sw, stroke_fill=stroke)
    return f
# torn red banner
random.seed(7); bx0, by0, bx1, by1 = 22, 500, 700, 702
top = [(bx0 + i * 22, by0 + random.randint(-9, 9)) for i in range(0, (bx1 - bx0) // 22 + 1)]
bot = [(bx1 - i * 22, by1 + random.randint(-9, 9)) for i in range(0, (bx1 - bx0) // 22 + 1)]
poly = top + bot
shd = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(shd).polygon([(x + 8, y + 10) for x, y in poly], fill=(0, 0, 0, 180)); shd = shd.filter(ImageFilter.GaussianBlur(7))
canvas.paste(shd, (0, 0), shd); d = ImageDraw.Draw(canvas)
d.polygon(poly, fill=(200, 16, 46)); d.line(poly + [poly[0]], fill=(110, 6, 24), width=5)
f = ImageFont.truetype(FONT, 150)
tw = d.textlength('CUT LOOSE', font=f)
stroke_text(canvas, (bx0 + (bx1 - bx0 - tw) / 2, by0 + 14), 'CUT LOOSE', 150, sw=8, stroke=(90, 4, 18))
# name, top-left big
stroke_text(canvas, (30, 8), 'GRANT', 118, sw=9)
canvas.save('thumb_E.jpg', quality=95)
canvas.resize((168, 94), Image.LANCZOS).save('thumb_E_small.png')
print('ok')
