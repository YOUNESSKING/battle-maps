"""Scene timing: scene SNN covers the film from its section's start to the next section's start (S01 from 0), plus TAIL s of overlap
that assembly cross-dissolves into the next scene. Local scene t = film t - A.
usage: python3 vicksburg/tools/scene_times.py S05 [--words]   (prints A, D, every paragraph and, with --words, every word, in LOCAL time)
       python3 vicksburg/tools/scene_times.py --all           (table of all scenes; writes audio/scenes.json)"""
import json, sys
V = "/home/user/battle-maps/vicksburg"; TAIL = 0.6
T = json.load(open(f"{V}/audio/timing.json")); W = json.load(open(f"{V}/audio/voice_words.json"))
secs = []
for p in T["paragraphs"]:
    if not secs or secs[-1]["id"] != p["section"]: secs.append({"id": p["section"], "first": p["start"]})
for i, s in enumerate(secs):
    s["A"] = 0.0 if i == 0 else round(secs[i]["first"] - 0.35, 3)
for i, s in enumerate(secs):
    end = secs[i + 1]["A"] if i + 1 < len(secs) else T["duration"] + 2.5
    s["D"] = round(end - s["A"] + (TAIL if i + 1 < len(secs) else 0), 3)
if "--all" in sys.argv:
    json.dump({"tail": TAIL, "scenes": secs}, open(f"{V}/audio/scenes.json", "w"), indent=1)
    for s in secs: print(f"{s['id']}  A={s['A']:8.2f}  D={s['D']:7.2f}")
    sys.exit()
sid = sys.argv[1]; s = next(x for x in secs if x["id"] == sid); A = s["A"]
print(f"{sid}: film A={A:.2f}  scene D={s['D']:.2f} s (last {TAIL} s = overlap dissolved into the next scene)")
for p in W:
    if p["section"] != sid: continue
    print(f"\n[{p['start'] - A:7.2f} - {p['end'] - A:7.2f}] {p['tag']}")
    if "--words" in sys.argv: print("   " + " ".join(f"{w}@{t0 - A:.2f}" for w, t0, t1 in p["words"]))
    else: print("   " + " ".join(w for w, *_ in p["words"]))
