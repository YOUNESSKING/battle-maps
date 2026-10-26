"""Archive film paragraphs for the Frontlines test (restored + tinted film, date card, depth photo) -> build/f-1.mp4, build/f-2.mp4"""
import json, sys
sys.path.insert(0, "tools")
import archive_shots
T = json.load(open("audio/timing.json")); P = T["paragraphs"]
key = lambda p: p["tag"].split("|")[0].replace("ARCHIVE:", "").replace("MAP:", "").strip()
enc = ["-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-r", "30", "-an"]
SHOTS = {  # merged style: newspaper headline card, film in the projector frame, date card (headline style), 3D-depth portrait
 "f-1": [{"photo": "assets/media/headline_holland.jpg", "move": "in", "focus": [0.5, 0.42], "dur": 3.2},
         {"film": "assets/film/clips/mg_drop_01.mp4", "ss": 0.3, "tint": True, "frame": True, "dur": 3.0, "headline": ["SEPTEMBER 1944", "NIJMEGEN\nTHE NETHERLANDS"]},
         {"film": "assets/film/clips/mg_gun_01.mp4", "ss": 0.8, "tint": True, "frame": True}],
 "f-2": [{"photo": "assets/media/gavin_src.jpg", "move": "in", "focus": [0.5, 0.36], "label": "JAMES M. GAVIN · COMMANDER, 82ND AIRBORNE · AGE 37", "depth": True, "dur": 4.4},
         {"film": "assets/film/clips/mg_paras_march_01.mp4", "ss": 0.5, "tint": True, "frame": True, "dur": 2.8},
         {"film": "assets/film/clips/mg_boats_01.mp4", "ss": 0.3, "tint": True, "frame": True}],
}
for i, p in enumerate(P):
    k = key(p)
    if k in SHOTS:
        dur = round(P[i + 1]["start"] - p["start"], 3)
        archive_shots.build(SHOTS[k], dur, f"build/{k}.mp4", 1920, 1080, enc); print(k, dur)
