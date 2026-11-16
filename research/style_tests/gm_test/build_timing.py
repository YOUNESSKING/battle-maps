"""Key moments for the GM test, estimated from audio/timing.json (phrase time = paragraph start + char position / length x duration,
the same estimate B.at uses in the grant scenes). Writes scene/timing.js (window.T) and build/times.json (for assemble.py)."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
tm = json.load(open(f"{HERE}/audio/timing.json")); P = tm["paragraphs"]
TAIL = 1.4
def at(i, phrase, off=0.0):
    p = P[i]; k = p["text"].find(phrase); assert k >= 0, phrase
    return round(p["start"] + (p["end"] - p["start"]) * k / len(p["text"]) + off, 2)
T = {
    "D": round(tm["duration"] + TAIL, 2),
    "p1": P[0]["start"], "p2": P[1]["start"], "p3": P[2]["start"], "p4": P[3]["start"], "p5": P[4]["start"], "end5": P[4]["end"],
    "burned": at(0, "burned the bridge"), "grant": at(0, "Ulysses Grant"), "oneday1": at(0, "It stopped him"), "story": at(0, "This is the story"),
    "dive": round(P[0]["end"] - 0.2, 2),
    "ch": at(1, "Champion Hill"), "pem": at(1, "Pemberton"), "crossing": at(1, "crossing of the Big Black"), "back": at(1, "river at their back"),
    "midm": at(2, "By mid-morning"), "nine": at(2, "A little after nine"), "memoirs": at(2, "in his Memoirs"), "taken": at(2, "the line was taken"),
    "bburn": at(2, "Behind it, the bridge"), "guns": at(2, "Eighteen guns"), "pris": at(2, "1,751"), "six": at(2, "Some six"),
    "fire2": at(3, "Grant had seen fire"), "april": at(3, "One April night"), "steamer": at(3, "A steamer burned"), "drift": at(3, "drifted on"), "deck": at(3, "Grant watched"),
    "nextday": at(4, "By the next day"), "three": at(4, "three new bridges"), "oneday2": at(4, "stopped him for one day"),
}
os.makedirs(f"{HERE}/build", exist_ok=True)
json.dump(T, open(f"{HERE}/build/times.json", "w"), indent=1)
open(f"{HERE}/scene/timing.js", "w").write("window.T = " + json.dumps(T) + ";\n")
print(json.dumps(T))
