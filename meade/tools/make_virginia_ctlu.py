"""Virginia control overlay for 30 June 1862 (Glendale) with the MEADE sides: Union = blue (110,160,255), Confederate = red (232,52,52)
(rim on the red side). Geometry = tools/make_virginia_control.py (jackson, read-only reuse) jun62, with McClellan's Peninsula pocket
redrawn for 30 Jun 1862 (after Gaines' Mill: the north bank of the Chickahominy + White House abandoned; the army between White Oak
Swamp, Glendale and Malvern Hill, falling back to the James). Notes: research/FACT_NOTES_penn.md (shared Virginia overlay).
-> assets/media/virginia_ctl_jun62u_mx.png       usage (from meade/): python3 tools/make_virginia_ctlu.py"""
import os, sys
import numpy as np
from PIL import Image
from scipy import ndimage
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import make_virginia_control as VC

# 30 Jun 1862: White Oak Swamp - Glendale (37.435N 77.245W) - Malvern Hill (37.41N 77.25W) - the James; lower Peninsula
PEN_JUN30 = [(37.47, -77.26), (37.455, -77.30), (37.43, -77.31), (37.40, -77.29), (37.38, -77.25), (37.37, -77.18), (37.32, -77.08),
             (37.25, -76.85), (37.20, -76.74), (37.10, -76.55), (36.98, -76.45), (36.98, -76.27), (37.10, -76.25), (37.25, -76.42),
             (37.33, -76.62), (37.30, -76.80), (37.38, -76.98), (37.45, -77.12)]

def build(land, va):
    H, W = land.shape
    polys = [p for p in VC.UNION_VA["jun62"] if p is not VC.UNION_VA["jun62"][-1]] + [PEN_JUN30]
    un = (land & ~va) | (VC.mask(polys, W, H) & land)
    csa = land & ~un
    out = np.zeros((H, W, 4), np.float32)
    d = ndimage.distance_transform_edt(~un)
    out[csa, :3] = (232, 52, 52); out[csa, 3] = (0.62 + 0.25 * np.exp(-d / 40.0))[csa]
    out[un, :3] = (110, 160, 255); out[un, 3] = 0.565
    rim = ndimage.gaussian_filter((csa & ndimage.binary_dilation(un, iterations=3)).astype(np.float32), 3) * 3.0
    rim = np.clip(rim, 0, 1) * land; sel = rim > 0.35
    out[sel, :3] = (255, 120, 100); out[sel, 3] = np.maximum(out[sel, 3], 0.85)
    Image.fromarray(np.clip(out * [1, 1, 1, 255], 0, 255).astype(np.uint8), "RGBA").save("assets/media/virginia_ctl_jun62u_mx.png", optimize=True)
    print("wrote virginia_ctl_jun62u_mx.png")

if __name__ == "__main__":
    land = np.array(Image.open("assets/virginia_land.png").convert("L")) > 127
    VC.POTOMAC[:] = VC.snap_potomac()
    VC.VIRGINIA[18:18 + len(VC.POTOMAC)] = VC.POTOMAC[::-1]
    build(land, VC.mask([VC.VIRGINIA], *land.shape[::-1]))
