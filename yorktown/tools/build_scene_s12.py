"""Script-12 test (research/style_tests/script12): build_scene.py reading the TEST timing (never grant/audio/timing.json).
usage (from grant/): python3 tools/build_scene_s12.py SCENE BASEMAP FIRST_TAG LAST_TAG START END
START/END = absolute seconds in the test voice (scene cut points, may fall inside a paragraph). Paragraph times are scene-relative
(a paragraph that began before START gets a negative start). Also writes SCENE_TIMING.anchors = [[estimated, actual], ...] scene-relative
(sentence starts measured from the silences in the test voice), used by the s12 kit `at` to correct the proportional B.at estimate."""
import sys as _s, os as _o; _s.path.insert(0, _o.path.dirname(_o.path.abspath(__file__))); import _linkcopy  # noqa: hard-link assets (disk)
import json, os, re, shutil, subprocess, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
TEST = "/home/user/battle-maps/research/style_tests/script12/audio"
name, basemap, first, last, t0, t_end = sys.argv[1:7]
t0, t_end = float(t0), float(t_end)
timing = json.load(open(f"{TEST}/timing.json"))
paras = timing["paragraphs"]
key = lambda p: p["tag"].split("|")[0].replace("MAP:", "").strip()
i0 = next(i for i, p in enumerate(paras) if key(p) == first)
i1 = next(i for i, p in enumerate(paras) if key(p) == last)
dur = round(t_end - t0, 3)
# anchors: sentence/clause starts (estimate) -> the end of the nearest silence in the voice (actual)
sil = subprocess.run(["ffmpeg", "-nostats", "-i", f"{TEST}/voice.wav", "-af", "silencedetect=noise=-40dB:d=0.18", "-f", "null", "-"], capture_output=True, text=True).stderr
ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", sil)]
anch, used = [[0.0, 0.0]], set()
for p in paras:
    s0, s1, txt = p["start"], p["end"], p["text"]
    for m in re.finditer(r"(?:^|[.;:]\s+)(\S)", txt):
        est = s0 + (s1 - s0) * m.start(1) / len(txt)
        c = [(abs(e - est), k) for k, e in enumerate(ends) if abs(e - est) < 1.0 and k not in used]
        if c: d, k = min(c); used.add(k); anch.append([round(est, 3), round(ends[k] - 0.05, 3)])
anch.sort()
scene_t = {"abs_start": t0, "duration": dur,
           "paras": {key(p): [round(p["start"] - t0, 3), round(p["end"] - t0, 3)] for p in paras[i0:i1 + 1]},
           "text": {key(p): p["text"] for p in paras[i0:i1 + 1]},
           "anchors": [[round(a - t0, 3), round(b - t0, 3)] for a, b in anch]}
out = f"{ROOT}/scenes/{name}"
os.makedirs(f"{out}/assets", exist_ok=True)
for d in ("lib", "vendor"):
    shutil.copytree(f"{ROOT}/{d}", f"{out}/{d}", dirs_exist_ok=True)
shutil.copytree(f"{ROOT}/assets/fonts", f"{out}/assets/fonts", dirs_exist_ok=True)
shutil.copy(f"{ROOT}/assets/grain.png", f"{out}/assets/grain.png")
shutil.copy(f"{ROOT}/assets/{basemap}.jpg", f"{out}/assets/relief.jpg")
STYLEW = os.path.exists(f"{ROOT}/assets/{basemap}_close.jpg")
if STYLEW:
    shutil.copy(f"{ROOT}/assets/{basemap}_close.jpg", f"{out}/assets/relief_close.jpg")
for f in os.listdir(f"{ROOT}/assets"):
    if f.endswith(".png") and f != "grain.png":
        shutil.copy(f"{ROOT}/assets/{f}", f"{out}/assets/{f}")
if os.path.isdir(f"{ROOT}/assets/media"):
    os.makedirs(f"{out}/assets/media", exist_ok=True)
    for f in os.listdir(f"{ROOT}/assets/media"):
        if os.path.isfile(f"{ROOT}/assets/media/{f}") and f.lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
            shutil.copy(f"{ROOT}/assets/media/{f}", f"{out}/assets/media/{f}")
open(f"{out}/timing.js", "w").write("window.SCENE_TIMING = " + json.dumps(scene_t) + ";\n")
_bj = f"{ROOT}/assets/{basemap}.json"
credit = json.load(open(_bj if os.path.exists(_bj) else f"{ROOT}/assets/{basemap.replace('_w', '_hd_lift')}.json"))["credit"]
html = open(f"{ROOT}/tools/scene_template_w.html" if STYLEW else f"{ROOT}/tools/scene_template.html").read()
html = html.replace("{{DURATION}}", str(dur)).replace("{{CREDIT}}", credit).replace("{{SCENE_JS}}", open(f"{ROOT}/scenes-src/{name}.js").read())
open(f"{out}/index.html", "w").write(html)
shutil.copy("/home/user/battle-maps/chipyongni/hyperframes.json", f"{out}/hyperframes.json")
json.dump({"id": name, "name": name, "createdAt": "2026-11-07T00:00:00.000Z"}, open(f"{out}/meta.json", "w"))
print(f"{name}: {dur}s  (abs {t0}-{t_end})  paras: {list(scene_t['paras'])}  anchors: {len(anch)}")
