"""Jackson film: musket / march / cheer stem for the whole film from the engine's troop events (sound design = vicksburg/tools/troop_sfx.py,
Epidemic Sound Enfield shots, ripple volleys on the exact visible muzzle-flash times, distance + pan).
1. exports events for every scene x region with troops (vicksburg/tools/export_troop_events.mjs, tShare = FILM time)
2. keeps only events that are on screen (sound only for what the viewer sees), cannon left to assemble.py (locked kit on scene cues)
3. renders the stem with troop_sfx.render_stem (kit=False) -> ajackson/build/troop_stem.wav (film length)
usage: python3 ajackson/tools/troop_stem.py [--no-export]"""
import json, os, subprocess, sys
import numpy as np, soundfile as sf
REPO = "/home/user/battle-maps"; AJ = f"{REPO}/ajackson"; SD = f"{AJ}/sound"
sys.path.insert(0, f"{REPO}/vicksburg/tools")
import troop_sfx as T
SC = json.load(open(f"{AJ}/audio/scenes.json"))["scenes"]
REG = {"S01": ["chalmette", "horseshoe", "neworleans"], "S03": ["horseshoe"], "S04": ["chalmette", "neworleans"],
       "S05": ["chalmette", "neworleans"], "S06": ["chalmette"], "S07": ["chalmette"]}
os.makedirs(SD, exist_ok=True)
files = []
for s in SC:
    for reg in REG.get(s["id"], []):
        f = f"{SD}/troop_events_{s['id']}_{reg}.json"
        if "--no-export" not in sys.argv or not os.path.exists(f):
            subprocess.run(["node", f"{REPO}/vicksburg/tools/export_troop_events.mjs", f"{AJ}/scenes/{s['id']}", reg, "0", str(s["D"]),
                            str(s["A"]), str(s["A"]), f], check=True, capture_output=True)
        d = json.load(open(f)); n0 = len(d["events"])
        def vis(e):
            if e["type"] == "musket_volley" and e.get("shots"):
                return any(T.on_screen(q["at"]) for q in e["shots"])
            return T.on_screen(e.get("at", {}))
        # the last 0.6 s of a scene dissolves into the next scene: drop events there (the next scene owns that time)
        d["events"] = [e for e in d["events"] if e["type"] != "cannon_shot" and vis(e) and e["t"] <= s["D"] - 0.6]
        print(f"{s['id']} {reg}: {n0} events -> {len(d['events'])} on screen ({sum(e['type'] == 'musket_volley' for e in d['events'])} volleys)")
        g = f + ".vis.json"; json.dump(d, open(g, "w")); files.append(g)
stem, log, L = T.render_stem(files, kit=False)
D = SC[-1]["A"] + SC[-1]["D"]; N = int(D * T.SR)
out = np.zeros((N, 2), np.float32); n = min(N, len(stem)); out[:n] = stem[:n]
os.makedirs(f"{AJ}/build", exist_ok=True); sf.write(f"{AJ}/build/troop_stem.wav", out, T.SR, subtype="FLOAT")
json.dump(log, open(f"{AJ}/build/troop_stem_log.json", "w"), indent=0)
from collections import Counter
print("stem", round(D, 1), "s", dict(Counter(x["type"] for x in log)))
