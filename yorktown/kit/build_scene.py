"""YORKTOWN MAP KIT scene builder: scenes-src/<scene>.js (+ kit/yt_kit.js + data) -> scenes/<scene>/index.html, assets hard-linked.
usage (from yorktown/):
  python3 kit/build_scene.py SCENE BASE FIRST_TAG LAST_TAG [--inset MAP ...]      a narrated scene (audio/timing.json)
  python3 kit/build_scene.py SCENE BASE --dur 12 [--inset MAP ...]                  a test scene (no narration; B.at not usable)
BASE = east | chesapeake | peninsula | yorktown (uses assets/BASE_m.jpg + BASE_m_close.jpg from kit/make_m.py).
The scene runs from the start of FIRST_TAG to the start of the paragraph after LAST_TAG. `at(para, phrase)` in the kit = B.at corrected
by SCENE_TIMING.anchors (sentence starts measured from the silences in audio/voice.wav), as in grant's s12 builder.
The scene source is plain JS run after the kit (GD, B, K, GG, E, tl, camera(), UNIT(), BANNER(), ... are in scope)."""
import sys as _s, os as _o; _s.path.insert(0, _o.path.join(_o.path.dirname(_o.path.abspath(__file__)), "..", "tools")); import _linkcopy  # noqa: hard links (disk)
import json, os, re, shutil, subprocess, sys
KIT = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(KIT)
sys.path.insert(0, KIT); sys.path.insert(0, f"{KIT}/data")
from proj import ll2px  # noqa
from places import PLACES, RIVER_LINES  # noqa
a = sys.argv[1:]; insets = []; src = None
while "--inset" in a: i = a.index("--inset"); insets.append(a[i + 1]); del a[i:i + 2]
VARS = {}
while "--var" in a: i = a.index("--var"); k_, v_ = a[i + 1].split("=", 1); VARS[k_] = v_; del a[i:i + 2]   # GD.var.<k> in the scene (one source, variants)
if "--src" in a: i = a.index("--src"); src = a[i + 1]; del a[i:i + 2]   # build scenes/<SCENE> from scenes-src/<src>.js (one source, several scenes)
name, base = a[0], a[1]
if a[2] == "--dur":
    dur = float(a[3]); scene_t = {"abs_start": 0, "duration": dur, "paras": {}, "text": {}, "anchors": [[0, 0]]}
else:
    first, last = a[2], a[3]
    timing = json.load(open(f"{ROOT}/audio/timing.json")); paras = timing["paragraphs"]
    key = lambda p: p["tag"].split("|")[0].replace("MAP:", "").strip()
    i0 = next(i for i, p in enumerate(paras) if key(p) == first); i1 = next(i for i, p in enumerate(paras) if key(p) == last)
    t0 = paras[i0]["start"]; t_end = paras[i1 + 1]["start"] if i1 + 1 < len(paras) else timing["duration"]; dur = round(t_end - t0, 3)
    sil = subprocess.run(["ffmpeg", "-nostats", "-i", f"{ROOT}/audio/voice.wav", "-af", "silencedetect=noise=-40dB:d=0.18", "-f", "null", "-"], capture_output=True, text=True).stderr
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", sil)]
    anch, used = [[0.0, 0.0]], set()
    for p in paras[i0:i1 + 1]:
        s0, s1, txt = p["start"], p["end"], p["text"]
        for mm in re.finditer(r"(?:^|[.;:!?]\s+)(\S)", txt):
            est = s0 + (s1 - s0) * mm.start(1) / len(txt)
            c = [(abs(e - est), k) for k, e in enumerate(ends) if abs(e - est) < 1.0 and k not in used]
            if c: d, k = min(c); used.add(k); anch.append([round(est - t0, 3), round(ends[k] - 0.05 - t0, 3)])
    anch.sort()
    scene_t = {"abs_start": t0, "duration": dur, "paras": {key(p): [round(p["start"] - t0, 3), round(p["end"] - t0, 3)] for p in paras[i0:i1 + 1]},
               "text": {key(p): p["text"] for p in paras[i0:i1 + 1]}, "anchors": anch}
def VER(m):   # newest baked version of a basemap: assets/<m>_m9.jpg .. _m2.jpg, else _m (make_m.py v=N writes new files; scenes rebuilt pick them up)
    for v in range(9, 1, -1):
        if os.path.exists(f"{ROOT}/assets/{m}_m{v}.jpg"): return f"_m{v}"
    return "_m"
BV = VER(base)
out = f"{ROOT}/scenes/{name}"
os.makedirs(f"{out}/assets/media", exist_ok=True); os.makedirs(f"{out}/assets/fonts", exist_ok=True)
for d in ("lib", "vendor"): shutil.copytree(f"{ROOT}/{d}", f"{out}/{d}", dirs_exist_ok=True)
for fdir in (f"{ROOT}/assets/fonts", f"{KIT}/fonts"):
    for f in os.listdir(fdir):
        if f.endswith((".woff2", ".ttf")): shutil.copy(f"{fdir}/{f}", f"{out}/assets/fonts/{f}")
shutil.copy(f"{ROOT}/assets/grain.png", f"{out}/assets/grain.png")
shutil.copy(f"{ROOT}/assets/{base}{BV}.jpg", f"{out}/assets/relief.jpg")
shutil.copy(f"{ROOT}/assets/{base}{BV}_close.jpg", f"{out}/assets/relief_close.jpg")
for suf in ("water", "land"): shutil.copy(f"{ROOT}/assets/{base}{BV}_{suf}.png", f"{out}/assets/{base}_m_{suf}.png")   # scene-side name stays <base>_m_*.png
for m in insets:
    shutil.copy(f"{ROOT}/assets/{m}{VER(m)}.jpg", f"{out}/assets/inset_{m}.jpg")
    shutil.copy(f"{ROOT}/assets/{m}{VER(m)}_close.jpg", f"{out}/assets/inset_{m}_close.jpg")   # r3: INSET(map, { close: true }) for full-frame inset cuts
for f in os.listdir(f"{ROOT}/assets/media"):   # flags, portraits (heads), card art; not the big music / sfx
    p = f"{ROOT}/assets/media/{f}"
    if os.path.isfile(p) and f.lower().endswith((".png", ".jpg", ".jpeg", ".webp")) and "_det_" not in f: shutil.copy(p, f"{out}/assets/media/{f}")
wx = f"{KIT}/weather"; WXDATA = ""
if os.path.isdir(wx):
    os.makedirs(f"{out}/assets/wx", exist_ok=True)
    for f in os.listdir(wx):
        if f.startswith(f"{base}_m") and f.endswith((".png",)) and "_snow" not in f: shutil.copy(f"{wx}/{f}", f"{out}/assets/wx/{f}")
WXDATA = open(f"{wx}/{base}_m_data.js").read() if os.path.exists(f"{wx}/{base}_m_data.js") else ""   # WEATHER_DATA (ripple seeds), inlined
GD = {"base": base, "var": VARS, "maps": {}, "places": PLACES, "rivers": {k: [[round(v, 1) for v in ll2px(base, la, lo)] for la, lo in pts] for k, pts in RIVER_LINES.items()}}
for f in os.listdir(f"{ROOT}/assets"):
    if re.fullmatch(r"(east|chesapeake|peninsula|yorktown)\.json", f):
        J = json.load(open(f"{ROOT}/assets/{f}")); GD["maps"][J["name"]] = {k: J[k] for k in ("zoom", "origin_world_px", "meters_per_px")}
bj = f"{KIT}/data/{base}_bake{BV if BV != '_m' else ''}.json"
GD["bake"] = json.load(open(bj)) if os.path.exists(bj) else {}
GD["bake"].pop("ends", None)
GD["insetBake"] = {}   # carved names of the nested maps (LABEL_BOXES / NUDGE keep units off them too)
for m in insets:
    _v = VER(m); _f = f"{KIT}/data/{m}_bake{_v if _v != '_m' else ''}.json"
    if os.path.exists(_f): GD["insetBake"][m] = {k: {"label": t.get("label"), "name": t["name"]} for k, t in json.load(open(_f))["towns"].items()}
open(f"{out}/timing.js", "w").write("window.SCENE_TIMING = " + json.dumps(scene_t) + ";\n")
kit = open(f"{KIT}/yt_kit.js").read()
AT = ("const at = (k, ph, off = 0) => { const e = B.at(k, ph), A = B.T.anchors || [[0, 0]], Z = A[A.length - 1];"   # r3: past the last measured
      " if (e >= Z[0]) return Z[1] + (e - Z[0]) + off;"                                                                      # anchor: keep its correction
      " let i = 0; while (i < A.length - 2 && e > A[i + 1][0]) i++; const a = A[i], b = A[i + 1];"
      " const v = b[0] > a[0] ? a[1] + (b[1] - a[1]) * (e - a[0]) / (b[0] - a[0]) : a[1] + (e - a[0]); return v + off; };")
assert kit.count("const { at } = B;") == 1
kit = kit.replace("const { at } = B;", AT)
body = open(f"{ROOT}/scenes-src/{src or name}.js").read()
js = WXDATA + "\nconst GD = " + json.dumps(GD, separators=(",", ":")) + ";\n" + kit + "\n// ================= SCENE scenes-src/" + (src or name) + ".js =================\n" + body
html = open(f"{ROOT}/tools/scene_template_w.html").read()
html = html.replace("{{DURATION}}", str(dur)).replace("{{CREDIT}}", "").replace("{{SCENE_JS}}", js)
open(f"{out}/index.html", "w").write(html)
open(f"{out}/.scene_check.js", "w").write(js); _chk = subprocess.run(["node", "--check", f"{out}/.scene_check.js"], capture_output=True, text=True); os.remove(f"{out}/.scene_check.js")   # an inline-script syntax error renders a blank map
if _chk.returncode: print("!! SCENE SCRIPT SYNTAX ERROR:\n" + _chk.stderr[:800])
shutil.copy("/home/user/battle-maps/chipyongni/hyperframes.json", f"{out}/hyperframes.json")
json.dump({"id": name, "name": name, "createdAt": "2026-11-11T00:00:00.000Z"}, open(f"{out}/meta.json", "w"))
print(f"{name}: {dur}s base {base}{BV} insets {insets} paras {list(scene_t['paras'])} anchors {len(scene_t['anchors'])}")
