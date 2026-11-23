#!/usr/bin/env python3
"""3D stills of baked world bundles on the engine (a throw-away sequence per region, rendered with tools/snap.sh).
usage: python3 vicksburg/tools/world_stills.py <region> [<region> ...]   [VX_PROJECT=<proj> or --project <proj>: that project's worlds]
  (project regions: the config's "stills" list of 3 cameras {at, dist, tilt, yaw} wins; else "focus" + the defaults)
  -> vicksburg/worlds/previews/<region>_3d.jpg (3 cameras side by side: overview, typical battle camera, low oblique)
The temporary sequence + scene live in /tmp/vx_bake/stills/ (nothing is written under vicksburg/sequences or vicksburg/scenes)."""
import json, os, subprocess, sys, shutil
import cv2, numpy as np

REPO = "/home/user/battle-maps"; VX = f"{REPO}/vicksburg"; TMP = "/tmp/vx_bake/stills"
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from vx_project import Project, project_name
PRJ = Project(project_name()) if project_name() else None
WORLDS = PRJ.worlds if PRJ else f"{VX}/worlds"
if PRJ: TMP = f"{PRJ.tmp}/stills"


def region_data(r):
    s = open(f"{WORLDS}/{r}/region.js").read(); return json.loads(s[s.index("] = ") + 3:].strip().rstrip(";"))


def cams(D):
    x0, y0, bw, bh = D["box"]; c = [x0 + bw / 2, y0 + bh / 2]
    if D.get("stills"): return [dict(fov=30, **k) for k in D["stills"]]
    if D["kind"] == "wide":
        return [dict(at=c, dist=900, tilt=30, yaw=0), dict(at=[1400, 720], dist=320, tilt=44, yaw=0), dict(at=[1300, 950], dist=160, tilt=55, yaw=-10)]
    f = D.get("focus") or c
    return [dict(at=c, dist=max(bw, bh) * 0.95, tilt=35, yaw=0), dict(at=f, dist=45, tilt=50, yaw=-5), dict(at=f, dist=26, tilt=58, yaw=12)]


FOCUS = {"vicksburg": [1372, 676], "siege": [1400, 678], "champion": [1636, 698], "portgibson": [1280, 1016], "raymond": [1700, 774],
         "jackson": [1880, 722], "bruinsburg": [1185, 1028], "bigblack_new": [1515, 684], "bigblack": [1516, 705]}


def main(regs):
    for r in regs:
        D = region_data(r); D["focus"] = FOCUS.get(r); K = cams(D)
        if PRJ:
            cfg = json.load(open(f"{PRJ.configs}/{r}.json")); D["focus"] = cfg.get("focus"); D["stills"] = cfg.get("stills"); K = cams(D)
        seqd = f"{TMP}/seq_{r}"; os.makedirs(seqd, exist_ok=True)
        keys = [dict(t=i * 2.0, region=r, ease="cut" if i else "io", **{"fov": 30, **k}) for i, k in enumerate(K)]
        keys.append(dict(keys[-1], t=6.0, ease="cut"))
        js = "window.SEQ = " + json.dumps(dict(name=f"worldcheck_{r}", D=6.0, regions=[r], keys=keys, clouds={r: False}, units=[], arrows=[], overlay=[],
                                               date="1863-05-01" if not PRJ else "1815-01-08")) + ";\n"
        open(f"{seqd}/seq.js", "w").write(js)
        out = f"{TMP}/scene_{r}"; shutil.rmtree(out, ignore_errors=True)
        subprocess.run(["python3", f"{VX}/tools/make_scene.py", seqd, "--out", out] + (["--project", PRJ.name] if PRJ else []), check=True)
        snap = f"{TMP}/snap_{r}"; shutil.rmtree(snap, ignore_errors=True)
        subprocess.run(["bash", f"{VX}/tools/snap.sh", out, "1,3,5", snap], check=True)
        fr = sorted(f for f in os.listdir(snap) if f.startswith("frame-") and f.endswith(".png"))
        ims = [cv2.resize(cv2.imread(f"{snap}/{f}"), (640, 360), interpolation=cv2.INTER_AREA) for f in fr[:3]]
        cv2.imwrite(f"{WORLDS}/previews/{r}_3d.jpg", np.hstack(ims), [cv2.IMWRITE_JPEG_QUALITY, 85])
        print(r, "->", f"{WORLDS}/previews/{r}_3d.jpg")


if __name__ == "__main__":
    main([a for i, a in enumerate(sys.argv[1:]) if a != "--project" and sys.argv[i] != "--project"])
