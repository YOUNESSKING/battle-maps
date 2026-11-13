"""D3 v2: no channel logo (owner: not real), allied land tinted blue again (owner). D3 (owner 2026-11-13, after reviews youtube/thumb_review_D2F2_1/2.md): clean vidIQ map (no echelon boxes, warm land), 'Yorktown' above the
pocket so the pocket shows, small true place labels, gold frame, and OUR brand corner: the Generals on the Map logo + an elegant '1781 / MAPPED'
date plate (owner: 'put it elegantly, date mapped and the logo too'). -> youtube/thumb/yorktown-thumb8-D3.jpg + thumb8_D3_vs_ref.jpg"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
W, H = 1280, 720; O = "tools/oswald-latin-700-normal.ttf"
MONO = "/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf"; MONOR = "/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf"
SERIF = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
im = Image.open("youtube/thumb/bg_vidiq_D3.jpg").convert("RGB").resize((W, H), Image.LANCZOS).convert("RGBA")
# owner 2026-11-13: restore the side colours of D/D2: the land held by the allies (everything outside the red pocket) tinted blue
import numpy as np
a = np.asarray(im.convert("RGB")).astype(np.float32); R, G, Bc = a[..., 0], a[..., 1], a[..., 2]
land = (G > Bc + 8) & (G > R - 6)                      # green land, not the water, the red pocket or the blue arrows
tint = np.array([196, 206, 255], np.float32)
out = a.copy(); out[land] = a[land] * 0.3 + tint * 0.7
im = Image.fromarray(out.clip(0, 255).astype(np.uint8)).convert("RGBA")
d = ImageDraw.Draw(im)
f = ImageFont.truetype(MONOR, 22)
for t, xy in (("Williamsburg", (40, 375)), ("Gloucester", (560, 150)), ("Chesapeake Bay", (960, 95)),
              ("Hampton", (930, 620)), ("James River", (280, 650))):
    d.text(xy, t, font=f, fill=(50, 56, 64), stroke_width=2, stroke_fill=(240, 244, 236))
d.text((660, 236), "Yorktown", font=ImageFont.truetype(MONO, 112), fill=(24, 40, 110), anchor="mm", stroke_width=7, stroke_fill=(255, 255, 255))
# brand corner: dark plate with gold keyline, our round logo, '1781' + tracked 'MAPPED' in gold
px, py, pw, ph = 20, 18, 190, 112
plate = Image.new("RGBA", (W, H), (0, 0, 0, 0)); pd = ImageDraw.Draw(plate)
pd.rounded_rectangle([px + 4, py + 6, px + pw + 4, py + ph + 6], radius=16, fill=(0, 0, 0, 110))
plate = plate.filter(ImageFilter.GaussianBlur(5)); im.alpha_composite(plate); d = ImageDraw.Draw(im)
d.rounded_rectangle([px, py, px + pw, py + ph], radius=16, fill=(22, 24, 28, 238), outline=(205, 168, 82), width=3)
d.text((px + 95, py + 44), "1781", font=ImageFont.truetype(O, 62), fill=(246, 240, 226), anchor="mm")
mf = ImageFont.truetype(SERIF, 22); txt = "M A P P E D"
d.text((px + 95, py + 89), txt, font=mf, fill=(214, 176, 88), anchor="mm")
d.line([(px + 20, py + 72), (px + 170, py + 72)], fill=(205, 168, 82), width=2)
# gold frame
d.rectangle([3, 3, W - 4, H - 4], outline=(205, 168, 82), width=8); d.rectangle([11, 11, W - 12, H - 12], outline=(60, 44, 20), width=2)
im.convert("RGB").save("youtube/thumb/yorktown-thumb8-D3.jpg", quality=94)
F2 = ImageFont.truetype(O, 24)
s = Image.new("RGB", (2 * 640 + 2 * 168 + 100, 360 + 60), (24, 22, 20)); dd = ImageDraw.Draw(s)
for k, (f_, lab) in enumerate([("youtube/thumb/yorktown-thumb8-D3.jpg", "D3 (new)"), ("youtube/thumb/ref_D_eastory.jpg", "ref: Eastory 'Eastern Front 1944/45' (10.3M)")]):
    i = Image.open(f_).convert("RGB"); x = 20 + k * 660
    s.paste(i.resize((640, 360), Image.LANCZOS), (x, 40)); dd.text((x, 8), lab, font=F2, fill=(235, 225, 205))
    s.paste(i.resize((168, 94), Image.LANCZOS), (1340 + k * 188, 40))
dd.text((1340, 145), "feed size: ours | ref", font=ImageFont.truetype(O, 18), fill=(170, 160, 140))
s.save("youtube/thumb/thumb8_D3_vs_ref.jpg", quality=92); print("ok")
