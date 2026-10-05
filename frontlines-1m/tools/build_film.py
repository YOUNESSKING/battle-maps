"""Archive film paragraphs for the Frontlines test (restored + tinted film, date card, depth photo) -> build/f-1.mp4, build/f-2.mp4"""
import json, sys
sys.path.insert(0, "tools")
import archive_shots
T = json.load(open("audio/timing.json")); P = T["paragraphs"]
key = lambda p: p["tag"].split("|")[0].replace("ARCHIVE:", "").replace("MAP:", "").strip()
enc = ["-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-r", "30", "-an"]
SHOTS = {
 "f-1": [{"film": "assets/film/clips/mg_drop_01.mp4", "ss": 0.3, "tint": True, "dur": 3.6, "headline": ["SEPTEMBER 1944", "NIJMEGEN\nTHE NETHERLANDS"]},
         {"film": "assets/film/clips/mg_landing_03.mp4", "ss": 0.5, "tint": True, "dur": 2.6},
         {"film": "assets/film/clips/mg_gun_01.mp4", "ss": 0.8, "tint": True}],
 "f-2": [{"photo": "assets/media/gavin_src.jpg", "move": "in", "focus": [0.5, 0.36], "label": "MAJ. GEN. JAMES M. GAVIN · 82ND AIRBORNE · AGE 37", "depth": True, "dur": 4.6},
         {"film": "assets/film/clips/mg_paras_march_01.mp4", "ss": 0.5, "tint": True, "dur": 2.9},
         {"film": "assets/film/clips/mg_boats_01.mp4", "ss": 0.3, "tint": True}],
}
for i, p in enumerate(P):
    k = key(p)
    if k in SHOTS:
        dur = round(P[i + 1]["start"] - p["start"], 3)
        archive_shots.build(SHOTS[k], dur, f"build/{k}.mp4", 1920, 1080, enc); print(k, dur)
