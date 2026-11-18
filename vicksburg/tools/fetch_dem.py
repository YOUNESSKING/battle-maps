"""Rebuild grant/assets/src/vicksburg_hd_elev.npy (git-ignored) for the 'vicksburg_hd_lift' frame (zoom 10, 2880x1620, x2 = 5760x3240)
from Mapzen/AWS terrain tiles at z11, exactly as cleburne/tools/bake_hd.py does, without writing any image. usage: python3 fetch_dem.py"""
import json, os, sys
import numpy as np
REPO = "/home/user/battle-maps"; sys.path.insert(0, f"{REPO}/cleburne/tools")
from bake import tile
J = json.load(open(f"{REPO}/grant/assets/vicksburg_hd_lift.json")); z = J["zoom"] + 1; S = 2
W, H = J["size"][0] * S, J["size"][1] * S; x0, y0 = J["origin_world_px"][0] * S, J["origin_world_px"][1] * S
tx0, ty0, tx1, ty1 = x0 // 256, y0 // 256, (x0 + W) // 256, (y0 + H) // 256
print("tiles", (tx1 - tx0 + 1) * (ty1 - ty0 + 1), flush=True)
mosaic = np.vstack([np.hstack([tile(z, tx, ty).astype(np.float32) for tx in range(tx0, tx1 + 1)]) for ty in range(ty0, ty1 + 1)])
elev = mosaic[y0 - ty0 * 256:y0 - ty0 * 256 + H, x0 - tx0 * 256:x0 - tx0 * 256 + W]
os.makedirs(f"{REPO}/grant/assets/src", exist_ok=True)
np.save(f"{REPO}/grant/assets/src/vicksburg_hd_elev.npy", elev.astype(np.float32)); print("ok", elev.shape, elev.min(), elev.max())
