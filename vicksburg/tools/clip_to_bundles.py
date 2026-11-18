"""Convert the approved v8 clip's world (research/style_tests/gm3d/clip/assets/: world_data.js + height_*.png + ground_*.jpg) into two
world bundles in the engine's contract (vicksburg/worlds/<region>/{height.png, ground.jpg, region.js}):
  _clip_wide  = the clip's wide region (kept for the engine regression test; never overwritten by the baker)
  bigblack    = the clip's close region (the baker may later overwrite it with a re-bake from the same DEM)
and worlds/geo.js (only if missing: the baker owns it). Files are COPIED (never hard links).
usage: python3 vicksburg/tools/clip_to_bundles.py [--force-geo] [--only _clip_wide|bigblack]"""
import json, os, shutil, sys

REPO = "/home/user/battle-maps"
CLIP = f"{REPO}/research/style_tests/gm3d/clip/assets"
OUT = f"{REPO}/vicksburg/worlds"
# the baked Vicksburg road through the Big Black close region (bake_clip.close_roads 'main', east of the line -> west of Bovina; the clip's ESC_RD)
BIGBLACK_MAIN_ROAD = [[1519.4, 705.25], [1518.35, 705.51], [1517.3, 705.73], [1516.31, 705.35], [1515.31, 705.16], [1514.29, 705.01], [1513.28, 704.86],
    [1512.26, 704.74], [1511.26, 704.55], [1510.28, 704.37], [1509.24, 704.31], [1508.26, 704.16], [1507.45, 703.46], [1506.6, 702.93], [1505.59, 702.8],
    [1504.72, 702.46], [1503.77, 702.09], [1502.68, 701.96], [1501.83, 701.34], [1501.14, 700.54], [1500.32, 699.97], [1499.57, 699.27], [1498.31, 698.52],
    [1497.22, 698.36], [1496.45, 697.73], [1495.66, 697.16], [1494.85, 696.59], [1494.28, 695.69], [1493.55, 694.97], [1492.04, 694.5], [1490.14, 693.77]]


def main():
    src = open(f"{CLIP}/world_data.js").read()
    D = json.loads(src[src.index("=") + 1:].strip().rstrip(";"))
    only = sys.argv[sys.argv.index("--only") + 1] if "--only" in sys.argv else None
    jobs = [("_clip_wide", "wide", "wide", 14.0), ("bigblack", "close", "close", 6.0)]
    for name, key, kind, exag in jobs:
        if only and name != only:
            continue
        d = D["regions"][key]; o = f"{OUT}/{name}"; os.makedirs(o, exist_ok=True)
        for a, b in [(f"height_{key}.png", "height.png"), (f"ground_{key}.jpg", "ground.jpg")]:
            if os.path.exists(f"{o}/{b}"):
                os.remove(f"{o}/{b}")   # never write through a hard link
            shutil.copyfile(f"{CLIP}/{a}", f"{o}/{b}")
        feats = {"bridges": [d["bridge"]] if d.get("bridge") else [],
                 "works": [{"kind": "breastwork", "name": "Big Black breastworks", "pts": d["breastworks"]}] if d.get("breastworks") else [],
                 "pontoons": d.get("pontoons", [])}
        towns = D["towns_wide"] if kind == "wide" else {k: v for k, v in D["towns"].items() if d["box"][0] <= v[0] <= d["box"][0] + d["box"][2] and d["box"][1] <= v[1] <= d["box"][1] + d["box"][3]}
        R = {"name": name, "kind": kind, "box": d["box"], "hm": d["hm"], "tex": d.get("tex"), "exag": exag, "rivers": d["rivers"],
             "roads": [{"name": "main", "pts": BIGBLACK_MAIN_ROAD}] if name == "bigblack" else [], "houses": d["houses"], "trees": d["trees"],
             "towns": towns, "features": feats, "source": "research/style_tests/gm3d/clip/assets (v8 bake_clip.py), converted by vicksburg/tools/clip_to_bundles.py"}
        if os.path.exists(f"{o}/region.js"):
            os.remove(f"{o}/region.js")
        with open(f"{o}/region.js", "w") as f:
            f.write(f'(window.GM3D_REGIONS = window.GM3D_REGIONS || {{}})["{name}"] = ' + json.dumps(R, separators=(",", ":")) + ";\n")
        print(name, kind, d["box"], "houses", len(d["houses"]), "trees", len(d["trees"]), "rivers", [r["name"] for r in d["rivers"]])
    geo = f"{OUT}/geo.js"
    if not os.path.exists(geo) or "--force-geo" in sys.argv:
        G = dict(D["geo"]); G["towns"] = D["towns_wide"]; G["frame"] = "vicksburg_hd_lift"
        with open(geo, "w") as f:
            f.write("window.GM3D_GEO = " + json.dumps(G, separators=(",", ":")) + ";\n")
        print("wrote", geo)
    else:
        print("kept existing", geo)


if __name__ == "__main__":
    main()
