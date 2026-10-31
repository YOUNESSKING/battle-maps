"""Refined who-controls-the-ground overlays on the `tunnel` map (z13: Chattanooga, Lookout Mountain, Missionary Ridge, Tunnel Hill)
for bg-a (Cleburne #14 hook/bg agent). Traced by eye on tunnel_hd_lift in map px (the river line, Lookout's crest, the ridge):
  oct63  siege: Union pocket in the city (Tennessee River at its back); Confederates on Lookout Mountain + Lookout Valley, Chattanooga
         Valley, Missionary Ridge and everything east.
  nov23  Cracker Line (Lookout Valley Union, from 28 Oct) + Orchard Knob taken (23 Nov).
  nov24  Lookout Mountain taken (24 Nov); Sherman's bridgehead at the north end (Billy Goat Hill) facing Tunnel Hill.
  nov25e evening 25 Nov: the centre of the ridge and Rossville Union; Cleburne still on Tunnel Hill (north end).
Colours as tools/hka_make_control.py (Confederate blue (110,160,255) 0.565, Union A4 red (240,105,95) + red rim).
-> assets/media/hka_tunnel2_ctl_<date>_mx.png   usage (from cleburne/): python3 tools/hka_make_tunnel_ctl.py"""
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

W, H = 2880, 1620
RIVER_NE = [(1500, 585), (1800, 495), (2050, 300), (2200, 0), (2880, 0), (2880, 1620)]
CSA = {   # Confederate-held polygon (tunnel map px), closed along the river (north) and the map's east/south edges
    "oct63": [(0, 1620), (0, 1250), (300, 1150), (560, 1100), (780, 1180), (860, 1230), (930, 1150), (1080, 1100), (1180, 1030), (1220, 900),
              (1250, 800), (1350, 640)] + RIVER_NE,
    "nov23": [(780, 1620), (800, 1300), (840, 1235), (930, 1150), (1080, 1100), (1230, 1110), (1260, 1000), (1290, 880), (1330, 750), (1380, 640)] + RIVER_NE,
    "nov24": [(1060, 1620), (1110, 1430), (1190, 1160), (1230, 1050), (1290, 900), (1340, 790), (1370, 735), (1410, 725), (1450, 700), (1520, 640),
              (1560, 580), (1800, 495), (2050, 300), (2200, 0), (2880, 0), (2880, 1620)],
    "nov25e": [(1350, 1620), (1290, 1400), (1330, 1150), (1380, 950), (1400, 820), (1360, 790), (1370, 735), (1410, 725), (1450, 700), (1520, 640),
               (1560, 580), (1800, 495), (2050, 300), (2200, 0), (2880, 0), (2880, 1620)],
}

def build(date):
    im = Image.new("L", (W, H), 0); ImageDraw.Draw(im).polygon(CSA[date], fill=255)
    csa = np.array(im) > 0; un = ~csa
    out = np.zeros((H, W, 4), np.float32)
    d = ndimage.distance_transform_edt(~csa)
    out[un, :3] = (240, 105, 95); out[un, 3] = (0.62 + 0.25 * np.exp(-d / 40.0))[un]
    out[csa, :3] = (110, 160, 255); out[csa, 3] = 0.565
    rim = ndimage.gaussian_filter((un & ndimage.binary_dilation(csa, iterations=3)).astype(np.float32), 3) * 3.0
    sel = np.clip(rim, 0, 1) > 0.35
    out[sel, :3] = (240, 105, 95); out[sel, 3] = np.maximum(out[sel, 3], 0.85)
    Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save(f"assets/media/hka_tunnel2_ctl_{date}_mx.png", optimize=True)
    print("wrote hka_tunnel2_ctl_%s_mx.png" % date)

def loss(d0, d1):   # E2: split d0 into the ground that stays (keep) and the ground about to change hands (loss)
    full = np.array(Image.open(f"assets/media/hka_tunnel2_ctl_{d0}_mx.png")).astype(np.float32)
    m = [np.array(ImageDraw.Draw(im := Image.new("L", (W, H), 0)).polygon(CSA[d], fill=255) or im) > 0 for d in (d0, d1)]
    lost = ndimage.gaussian_filter((m[0] & ~m[1]).astype(np.float32), 4)
    for nm, a in (("keep", 1 - lost), ("loss", lost)):
        o = full.copy(); o[..., 3] *= a
        Image.fromarray(o.astype(np.uint8), "RGBA").save(f"assets/media/hka_tunnel2_ctl_{d0}_{nm}_mx.png", optimize=True)
    print("wrote", d0, "keep/loss ->", d1)

if __name__ == "__main__":
    for dd in CSA: build(dd)
    for a, b in (("oct63", "nov23"), ("nov23", "nov24"), ("nov24", "nov25e")): loss(a, b)
