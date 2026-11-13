"""D2 (owner 2026-11-13): D closer to its Eastory reference: corner logo badge (stencil '1781 MAPPED', like 'WWII MAPPED'), gold frame,
small typewriter place labels, extra numbered counters. -> youtube/thumb/yorktown-thumb7-D2.jpg + thumb7_D2_vs_ref.jpg"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
W, H = 1280, 720; O = "tools/oswald-latin-700-normal.ttf"
MONO = "/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf"; MONOR = "/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf"
im = Image.open("youtube/thumb/bg_vidiq_D_eastory.jpg").convert("RGB").resize((W, H), Image.LANCZOS).convert("RGBA")
d = ImageDraw.Draw(im)
# small place labels (typewriter, dark grey, like the reference's town names)
f = ImageFont.truetype(MONOR, 22)
for t, xy in (("Williamsburg", (70, 300)), ("Gloucester", (560, 150)), ("York River", (840, 205)), ("Chesapeake Bay", (950, 95)),
              ("Hampton", (930, 620)), ("James River", (300, 640))):
    d.text(xy, t, font=f, fill=(55, 60, 70), stroke_width=2, stroke_fill=(235, 240, 245))
# extra numbered counters (blue allied ring, red inside), Eastory square counters
def counter(x, y, n, col, fg):
    d.rectangle([x, y, x + 38, y + 38], fill=col, outline=(40, 40, 50), width=2)
    d.text((x + 19, y + 21), str(n), font=ImageFont.truetype(O, 26), fill=fg, anchor="mm")
for (x, y, n) in ((60, 470, 7), (520, 590, 9), (900, 560, 15)):
    counter(x, y, n, (196, 214, 238), (25, 45, 110))
for (x, y, n) in ():
    counter(x, y, n, (246, 196, 190), (130, 20, 20))
# big place name (as before)
d.text((668, 330), "Yorktown", font=ImageFont.truetype(MONO, 118), fill=(24, 40, 110), anchor="mm", stroke_width=7, stroke_fill=(255, 255, 255))
# corner logo badge: stencil-like '1781' over 'MAPPED' (yellow), like the reference's 'WWII MAPPED'
bx, by = 22, 16
d.rectangle([bx, by, bx + 190, by + 104], fill=(35, 38, 45, 230), outline=(230, 200, 60), width=3)
d.text((bx + 95, by + 40), "1781", font=ImageFont.truetype(O, 60), fill=(240, 236, 226), anchor="mm", stroke_width=2, stroke_fill=(20, 20, 20))
d.text((bx + 95, by + 84), "MAPPED", font=ImageFont.truetype(O, 32), fill=(240, 205, 50), anchor="mm")
# gold frame
d.rectangle([3, 3, W - 4, H - 4], outline=(214, 170, 60), width=8); d.rectangle([11, 11, W - 12, H - 12], outline=(60, 40, 20), width=2)
im.convert("RGB").save("youtube/thumb/yorktown-thumb7-D2.jpg", quality=94)
F2 = ImageFont.truetype(O, 24)
s = Image.new("RGB", (2 * 640 + 2 * 168 + 100, 360 + 60), (24, 22, 20)); dd = ImageDraw.Draw(s)
for k, (f_, lab) in enumerate([("youtube/thumb/yorktown-thumb7-D2.jpg", "D2 (new)"), ("youtube/thumb/ref_D_eastory.jpg", "ref: Eastory 'Eastern Front 1944/45' (10.3M)")]):
    i = Image.open(f_).convert("RGB"); x = 20 + k * 660
    s.paste(i.resize((640, 360), Image.LANCZOS), (x, 40)); dd.text((x, 8), lab, font=F2, fill=(235, 225, 205))
    s.paste(i.resize((168, 94), Image.LANCZOS), (1340 + k * 188, 40))
dd.text((1340, 145), "feed size: ours | ref", font=ImageFont.truetype(O, 18), fill=(170, 160, 140))
s.save("youtube/thumb/thumb7_D2_vs_ref.jpg", quality=92); print("ok")
