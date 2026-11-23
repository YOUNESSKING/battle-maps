"""Project / frame support for the Vicksburg 3D engine tools (bake_world.py, make_scene.py, world_stills.py, make_geo builders).

A PROJECT is a film folder with its own worlds, geography and sequences (e.g. ajackson/). Select it with the env var VX_PROJECT=<folder>
(or `--project <folder>` on the tools). Without it every tool behaves exactly as before (the Vicksburg film, 'vicksburg_hd_lift' frame).

Project layout:
  <proj>/data/frame.json     the BASE frame: {"name", "zoom": 10, "origin": [OX, OY] (web-mercator world px at that zoom), "engine_mpu"}
  <proj>/data/geo.json       research geography (same schema as vicksburg/data/geo.json), x/y in BASE frame units
  <proj>/worlds/configs/*.json, <proj>/worlds/<region>/, <proj>/worlds/geo.js, <proj>/worlds/previews/
  <proj>/sequences/<name>/seq.js, <proj>/scenes/ (git-ignored)

Region frames: a region config may set "zoom" (default = base zoom). Its map units are then BASE units x k, k = 2^(zoom - base zoom), with the
SAME origin corner (so a z8 region = base / 4, a z11 region = base x 2). All regions of a project therefore share one geography; dives between
regions of different zoom work because each region is its own scene (the dive swaps regions inside the white-out).
"""
import json, math, os, sys
import numpy as np

REPO = "/home/user/battle-maps"
EARTH_C = 40075016.686


def project_name(argv=None):
    argv = sys.argv if argv is None else argv
    if "--project" in argv: return argv[argv.index("--project") + 1]
    return os.environ.get("VX_PROJECT") or None


class Project:
    def __init__(self, name):
        self.name = name; self.dir = f"{REPO}/{name}"
        self.frame = json.load(open(f"{self.dir}/data/frame.json"))
        self.zoom = self.frame["zoom"]; self.origin = self.frame["origin"]
        self.engine_mpu = self.frame.get("engine_mpu", 129.36)
        self.worlds = f"{self.dir}/worlds"; self.configs = f"{self.worlds}/configs"; self.geo_json = f"{self.dir}/data/geo.json"
        self.sequences = f"{self.dir}/sequences"; self.scenes = f"{self.dir}/scenes"
        self.tmp = f"/tmp/vx_bake/{name}"; self.dem_dir = f"{self.worlds}/_dem"

    # ---- coordinates ----
    def N(self, zoom=None): return 256 * 2 ** (self.zoom if zoom is None else zoom)

    def k(self, zoom): return 2.0 ** ((zoom if zoom is not None else self.zoom) - self.zoom)

    def to_map(self, lat, lon, zoom=None):
        """lat/lon -> map units of the frame at `zoom` (default: base)"""
        N = self.N(); la = math.radians(lat)
        x = (lon + 180) / 360 * N - self.origin[0]; y = (1 - math.log(math.tan(la) + 1 / math.cos(la)) / math.pi) / 2 * N - self.origin[1]
        k = self.k(zoom); return x * k, y * k

    def to_ll(self, x, y, zoom=None):
        k = self.k(zoom); X, Y = x / k + self.origin[0], y / k + self.origin[1]; N = self.N()
        return math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * Y / N)))), X / N * 360 - 180

    def mpu(self, zoom=None, lat=None, y=None):
        """true metres per map unit of the frame at `zoom`, at latitude lat (or map y in that frame)"""
        if lat is None: lat = self.to_ll(0, y, zoom)[0]
        return EARTH_C / self.N(zoom) * math.cos(math.radians(lat))

    def frame_info(self, zoom=None, box=None):
        z = self.zoom if zoom is None else zoom; k = self.k(z)
        d = dict(project=self.name, zoom=z, k=k, base_zoom=self.zoom, origin=[o * k for o in self.origin])
        if box is not None:
            d["mpu_true"] = round(self.mpu(z, y=box[1] + box[3] / 2), 3)
            la0, lo0 = self.to_ll(box[0], box[1], z); la1, lo1 = self.to_ll(box[0] + box[2], box[1] + box[3], z)
            d["ll_box"] = [round(la1, 5), round(lo0, 5), round(la0, 5), round(lo1, 5)]   # S, W, N, E
        return d


def fetch_dem(P, box, zoom, dpu, cache=True):
    """DEM (metres, float32) over a map box [x0, y0, w, h] of the frame at `zoom`, at dpu px per map unit, from the AWS terrain
    (terrarium) tiles at zoom + log2(dpu) (cleburne/tools/bake.py `tile`, tile cache cleburne/tools/.tiles). Cached as .npy in
    <proj>/worlds/_dem/ (git-ignored: *.npy)."""
    tz = zoom + int(round(math.log2(dpu)))
    if 2 ** (tz - zoom) != dpu: raise ValueError("dpu must be a power of two")
    x0, y0, bw, bh = box
    f = f"{P.dem_dir}/dem_z{zoom}_{x0:g}_{y0:g}_{bw:g}_{bh:g}_d{dpu}.npy"
    if cache and os.path.exists(f): return np.load(f)
    sys.path.insert(0, f"{REPO}/cleburne/tools"); from bake import tile
    k = P.k(zoom); ox, oy = P.origin[0] * k * dpu, P.origin[1] * k * dpu   # world px at the tile zoom
    W, H = int(round(bw * dpu)), int(round(bh * dpu)); X0 = int(round(ox + x0 * dpu)); Y0 = int(round(oy + y0 * dpu))
    tx0, ty0, tx1, ty1 = X0 // 256, Y0 // 256, (X0 + W - 1) // 256, (Y0 + H - 1) // 256
    print(f"  DEM z{tz}: {(tx1 - tx0 + 1) * (ty1 - ty0 + 1)} tiles for box {box} (frame z{zoom})", flush=True)
    rows = []
    for ty in range(ty0, ty1 + 1):
        rows.append(np.hstack([tile(tz, tx, ty).astype(np.float32) for tx in range(tx0, tx1 + 1)]))
    mosaic = np.vstack(rows)
    elev = np.ascontiguousarray(mosaic[Y0 - ty0 * 256:Y0 - ty0 * 256 + H, X0 - tx0 * 256:X0 - tx0 * 256 + W]).astype(np.float32)
    os.makedirs(P.dem_dir, exist_ok=True); np.save(f, elev)
    return elev
