"""Archive film paragraphs for the Frontlines test (restored + tinted film, date card, depth photo) -> build/f-1.mp4, build/f-2.mp4"""
import json, sys
sys.path.insert(0, "tools")
import archive_shots
T = json.load(open("audio/timing.json")); P = T["paragraphs"]
key = lambda p: p["tag"].split("|")[0].replace("ARCHIVE:", "").replace("MAP:", "").strip()
enc = ["-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-r", "30", "-an"]
SHOTS = {  # D-Day test: newspaper headline card, 3D-depth photos, film in the projector frame, headline date card
 "a-1": [{"photo": "assets/media/headline_dday.jpg", "move": "in", "focus": [0.5, 0.42], "dur": 2.6},
         {"photo": "assets/media/archive_normandy_pathfinders.jpg", "move": "in", "focus": [0.5, 0.4], "label": "PATHFINDERS, 505TH PARACHUTE INFANTRY · ENGLAND, JUNE 1944", "depth": True, "dur": 2.9},
         {"film": "assets/film/clips/normandy_drop_01.mp4", "ss": 0.3, "tint": True, "frame": True, "dur": 3.4, "headline": ["6 JUNE 1944", "NORMANDY\nFRANCE"]},
         {"film": "assets/film/clips/normandy_gliders_air_02.mp4", "ss": 0.3, "tint": True, "frame": True}],
 "a-2": [{"photo": "assets/media/archive_normandy_sainte_marie_dumont.jpg", "move": "in", "focus": [0.5, 0.45], "label": "AIRBORNE TROOPS IN SAINTE-MARIE-DU-MONT · 7 JUNE 1944", "depth": True, "dur": 4.4},
         {"film": "assets/film/clips/normandy_faces_01.mp4", "ss": 0.4, "tint": True, "frame": True, "dur": 3.0},
         {"film": "assets/film/clips/normandy_glider_wreck_02.mp4", "ss": 0.3, "tint": True, "frame": True}],
}
for i, p in enumerate(P):
    k = key(p)
    if k in SHOTS:
        dur = round(P[i + 1]["start"] - p["start"], 3)
        archive_shots.build(SHOTS[k], dur, f"build/{k}.mp4", 1920, 1080, enc); print(k, dur)
