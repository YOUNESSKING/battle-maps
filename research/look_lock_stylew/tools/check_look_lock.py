"""LOOK LOCK gate for the Style W "borrow" look (lock v1 = the approved test r15, owner 2026-11-28). Run it before ANY render of a film
that is built with `kit/build_scene.py ... --borrow`. Mirrors tools/check_sound_lock.py. Rules: research/look_lock_stylew/LOCK.md.

usage (from anywhere):
  python3 research/look_lock_stylew/tools/check_look_lock.py                         (a) hashes + locked values  -> LOOK LOCK OK / BROKEN
  python3 .../check_look_lock.py --lint marion/scenes-src/<scene>.js ...            (a) + (b) lint the scene sources for locked-value overrides
  python3 .../check_look_lock.py --frames [--only id,id] [--work DIR]               (a) + (c) build the 4 test scenes, render local SwiftShader
                                                                                     stills at the golden times, compare with golden/
  python3 .../check_look_lock.py --mp4 FILE                                         (a) + (c) compare frames of an mp4 in the r15 layout
                                                                                     (e.g. a re-render of the test windows) with golden/
  python3 .../check_look_lock.py --audio FILE [--cues cannon=34.63,impact=35.13,volley=63.37,later=66.56 --voice 40-44] [--voice-dir VC]
                                                                                     (a) + the shot-loudness / voice-margin check
  python3 .../check_look_lock.py --relock "OWNER, date: exact approval words"       OWNER ONLY: write lock v(N+1) from the current files

Exit code 0 = LOOK LOCK OK (warnings about the pending clouds / dive do not fail the gate), 1 = LOOK LOCK BROKEN or a check failed.
"""
import argparse, glob, hashlib, json, os, re, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__)); LL = os.path.dirname(HERE); REPO = os.path.abspath(os.path.join(LL, "..", ".."))
LOCK = os.path.join(LL, "lock.json"); GOLD = os.path.join(LL, "golden")
PB, PE = re.compile(r"LOOK-LOCK pending-begin (\S+)"), re.compile(r"LOOK-LOCK pending-end (\S+)")
ENV_FORBIDDEN = ["CANNON_DB", "MUSKET_DB", "CANNON_REL", "MUSKET_REL", "MUSKET_REL2", "FRONT_S", "MUSKET_EXTRA_DB", "TAIL_DB", "TAIL_DUCK",
                 "LATER_FRONT_DUCK", "TAIL_END_DB", "TAIL_END_AT", "LATER_TAIL_DB", "GUN_EXTRA", "GUN_TAIL_DB", "GUN_TAIL_AT", "GUN_CRACK_DB",
                 "GUN_REL", "CRACK_DRIVE", "MUSKET_GRMAX", "FIRE_DB", "FIRE_DUCK", "LIMIT_DB", "IMPACT"]


# ------------------------------------------------------------------ (a) hashes
def split_pending(text):
    """-> (locked text with every pending region removed, {region name: pending text})"""
    out, pend, cur = [], {}, None
    for ln in text.splitlines(keepends=True):
        mb, me = PB.search(ln), PE.search(ln)
        if mb: cur = mb.group(1); pend.setdefault(cur, ""); continue
        if me: cur = None; continue
        if cur: pend[cur] += ln
        else: out.append(ln)
    return "".join(out), pend


def region(text, a, b):
    i = text.index(a); j = text.index(b, i); return text[i:j]


def digest(spec):
    p = os.path.join(REPO, spec["path"])
    if not os.path.exists(p): return None, {}
    raw = open(p, "rb").read(); m = spec.get("mode", "file")
    if m == "file": return hashlib.sha256(raw).hexdigest(), {}
    txt = raw.decode("utf-8")
    if m == "sections":
        lk, pend = split_pending(txt); return hashlib.sha256(lk.encode()).hexdigest(), {k: hashlib.sha256(v.encode()).hexdigest() for k, v in pend.items()}
    if m == "region": return hashlib.sha256(region(txt, spec["from"], spec["to"]).encode()).hexdigest(), {}
    raise SystemExit(f"bad mode {m}")


def node_lock():
    """BW.LOCK as built (evaluated from borrow.js with node) -> dict"""
    s = open(os.path.join(REPO, "marion/kit/js/borrow.js")).read(); i = s.index("const LOCK = Object.freeze("); j = s.index("\n  const lockErr", i)
    js = s[i:j].replace("const LOCK = Object.freeze(", "const LOCK = (", 1) + "\nprocess.stdout.write(JSON.stringify(LOCK));"
    r = subprocess.run(["node", "-e", js], capture_output=True, text=True)
    if r.returncode: raise SystemExit("cannot evaluate BW.LOCK from borrow.js:\n" + r.stderr[:600])
    return json.loads(r.stdout)


def audio_defaults():
    s = open(os.path.join(REPO, "research/style_tests/stylew_borrow/tools/make_test_audio.py")).read()
    return {k: float(v) for k, v in re.findall(r'os\.environ\.get\("([A-Z0-9_]+)", "(-?[\d.]+)"\)', s)}


def check_hashes(L):
    errs, miss, warns = [], [], []
    for spec in L["locked_files"]:
        h, pend = digest(spec)
        if h is None: (miss if spec.get("not_committed") else errs).append(spec["path"]); continue
        if h != spec["sha256"]: errs.append(spec["path"] + ("" if spec.get("mode", "file") == "file" else f" ({spec['mode']}: the locked part changed)"))
        for k, v in pend.items():
            if spec.get("pending", {}).get(k) not in (None, v): warns.append(f"pending region '{k}' in {spec['path']} changed since lock v{L['version']} (allowed: not approved, being redone)")
    try:
        nl = node_lock()
        for k in ("smoke", "content", "windSpeed", "volleyCall", "shotCall", "capBox", "soot", "gold", "focus"):
            if nl.get(k) != L["params"]["blocks"][k]: errs.append(f"marion/kit/js/borrow.js BW.LOCK.{k} differs from lock.json params.blocks.{k}")
        if nl.get("v") != L["version"]: errs.append(f"BW.LOCK.v = {nl.get('v')} but lock.json is version {L['version']}")
    except SystemExit as e: errs.append(str(e))
    ad = audio_defaults()
    for k, v in L["params"]["audio"]["env_defaults"].items():
        if ad.get(k) != v: errs.append(f"make_test_audio.py default {k} = {ad.get(k)} (locked {v})")
    for k in ENV_FORBIDDEN:
        if k in os.environ: errs.append(f"environment variable {k}={os.environ[k]} overrides a locked audio value (unset it)")
    return errs, miss, warns


# ------------------------------------------------------------------ (b) lint
def calls(src, name):
    """every `name(` call in src -> its argument text (balanced parentheses)"""
    out = []
    for m in re.finditer(re.escape(name) + r"\(", src):
        i = m.end(); d = 1; j = i
        while j < len(src) and d:
            d += {"(": 1, ")": -1}.get(src[j], 0); j += 1
        out.append((src.count("\n", 0, m.start()) + 1, src[i:j - 1]))
    return out


def top_keys(obj):
    """keys at depth 1 of the first {...} literal in a text"""
    i = obj.find("{")
    if i < 0: return []
    d, keys, k = 0, [], i
    for j in range(i, len(obj)):
        c = obj[j]
        if c in "{[(": d += 1
        elif c in "}])": d -= 1
        if d == 0: break
        if d == 1 and c in "{,":
            m = re.match(r"\s*([A-Za-z_$][\w$]*)\s*:", obj[j + 1:])
            if m: keys.append(m.group(1))
    return keys


LINT_ERR = [
    (r"\bvolley\s*:\s*\{", "a literal volley/smoke config: use volley: BW.smoke(\"musket.day\" | \"musket.night\" | \"cannon\", {content})"),
    (r"\bBW\.volley\(", "BW.volley with free knobs: use BW.musketVolley(pts, t0, span, n, {seed, aim, shake})"),
    (r"\bBW\.shot\(", "BW.shot: use BW.musketShot(p, t, {aim})"),
    (r"\bBW\.gold\(", "BW.gold with free options: use BW.goldSlam / BW.goldTitle(text, tOn, tOff, {y, w, tGrow, sub})"),
    (r"\bK\.FOCUS_\w+\s*=(?!=)", "focus look set in the scene (locked in BW.LOCK.focus)"),
    (r"BWGL_CFG\.(volley|vshots|vcannon|vcolumn)\b", "writes the 3D layer config directly (use BW.smoke / BW.musketVolley / BW.cannon / BW.soot)"),
    (r"\bBW\.LOCK\b[^\n;]*?(?<![=!<>])=(?!=)", "changes BW.LOCK in a scene"),
    (r"\.gmo\b", "restyles the GM overlay (plaque / key / ledger / timeline) in a scene"),
    (r"\bBW\.smokeGL\(|\bsmoke\s*:\s*\[", "the r4 smoke curtains (not part of the approved look)"),
]
LINT_WARN = [
    (r"\bdive\s*:|\bdiveOff\s*:|\bstratus\s*:", "cloud dive not approved"),
    (r"\bfair\s*:|\bBW\.clouds\(|\bshadowK\s*:", "clouds not approved (pending, not locked)"),
]


def lint(path, L):
    src = open(path).read(); errs, warns = [], []
    nocom = re.sub(r"//[^\n]*", "", src)   # rules run on code, not on comments
    ln = lambda m: nocom.count("\n", 0, m.start()) + 1
    for rx, why in LINT_ERR:
        for m in re.finditer(rx, nocom): errs.append(f"{os.path.basename(path)}:{ln(m)}: {why}")
    for rx, why in LINT_WARN:
        hits = [ln(m) for m in re.finditer(rx, nocom)]
        if hits: warns.append(f"{os.path.basename(path)}:{','.join(map(str, sorted(set(hits))))}: WARNING: {why}")
    B = L["params"]["blocks"]
    for line, arg in calls(nocom, "BW.smoke"):
        m = re.match(r'\s*"([^"]+)"\s*,?(.*)$', arg, re.S)
        if not m: errs.append(f"{os.path.basename(path)}:{line}: BW.smoke needs a preset name string"); continue
        kind, rest = m.group(1), m.group(2)
        if kind not in B["smoke"]: errs.append(f"{os.path.basename(path)}:{line}: unknown smoke preset \"{kind}\""); continue
        for k in top_keys(rest):
            if k not in B["content"]: errs.append(f"{os.path.basename(path)}:{line}: BW.smoke(\"{kind}\") overrides locked \"{k}\"")
        for wk in ("wind", "cwind"):
            w = re.search(r"\b" + wk + r"\s*:\s*\[\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\]", rest)
            if w:
                sp, ref = (float(w.group(1)) ** 2 + float(w.group(2)) ** 2) ** 0.5, B["windSpeed"][kind]
                if abs(sp / ref - 1) > 0.25: errs.append(f"{os.path.basename(path)}:{line}: {kind} {wk} speed {sp:.1f} px/s vs locked {ref} (+-25 %): pick the direction only")
    for name, locked in (("BW.cannon", {"recoil"}), ("BW.hit", {"back"}), ("BW.wipe", {"dust", "hold"}), ("BW.rout", set())):
        for line, arg in calls(nocom, name):
            j = arg.find("{"); keys = top_keys(arg[j:]) if j >= 0 else []
            for k in keys:
                if k in locked: errs.append(f"{os.path.basename(path)}:{line}: {name} option \"{k}\" is a locked effect size")
    for name, allowed in (("BW.musketVolley", {"seed", "aim", "shake"}), ("BW.musketShot", {"aim"}), ("BW.goldSlam", {"y", "w", "tGrow"}), ("BW.goldTitle", {"y", "w", "tGrow", "sub"})):
        for line, arg in calls(nocom, name):
            for k in top_keys(arg):
                if k not in allowed: errs.append(f"{os.path.basename(path)}:{line}: {name} option \"{k}\" is not a content input ({', '.join(sorted(allowed))})")
    return errs, warns


# ------------------------------------------------------------------ (c) frames
def compare(a_png, golden_png, box, full=None):
    import numpy as np
    from PIL import Image
    from skimage.metrics import structural_similarity as ssim
    A = Image.open(a_png).convert("RGB")
    A = A.crop(box) if full is None else A.resize(full, Image.LANCZOS)
    A = np.asarray(A, np.float32); G = np.asarray(Image.open(golden_png).convert("RGB"), np.float32)
    s = ssim(A.mean(2), G.mean(2), data_range=255, gaussian_weights=True, sigma=1.5)
    dm = float(np.abs(A.reshape(-1, 3).mean(0) - G.reshape(-1, 3).mean(0)).max())
    dp = float(np.abs(np.percentile(A.mean(2), [5, 50, 95, 99]) - np.percentile(G.mean(2), [5, 50, 95, 99])).max())
    ad = np.abs(A - G).mean(2); d10 = float((ad > 40).mean() * 100)   # % of pixels off by > 40 levels (a shape / colour that moved)
    return dict(ssim=round(float(s), 4), dmean=round(dm, 2), dpct=round(dp, 2), d40=round(d10, 2))


def drift(a_png, ref_png, box):
    """tier 2: the local still vs the LOCAL reference still (same renderer, deterministic): blurred per-pixel difference"""
    import numpy as np
    from PIL import Image, ImageFilter
    A = Image.open(a_png).convert("RGB").crop(box); R = Image.open(ref_png).convert("RGB")
    if A.size != R.size: A = A.resize(R.size, Image.LANCZOS)
    d = np.abs(np.asarray(A.filter(ImageFilter.GaussianBlur(2)), np.float32) - np.asarray(R.filter(ImageFilter.GaussianBlur(2)), np.float32)).max(2)
    return dict(px6=round(float((d > 6).mean() * 100), 3), p995=round(float(np.percentile(d, 99.5)), 1))


def judge(r, T):
    bad = []
    if r["ssim"] < T["ssim"]: bad.append(f"ssim {r['ssim']} < {T['ssim']}")
    if r["dmean"] > T["dmean"]: bad.append(f"mean colour off {r['dmean']} > {T['dmean']}")
    if r["dpct"] > T["dpct"]: bad.append(f"tone percentiles off {r['dpct']} > {T['dpct']}")
    if r["d40"] > T["d40"]: bad.append(f"{r['d40']} % pixels off by > 40 > {T['d40']}")
    return bad


def frames_local(L, only, work):
    G = json.load(open(os.path.join(GOLD, "golden.json")))["frames"]; G = [g for g in G if not only or g["id"] in only]
    os.makedirs(work, exist_ok=True); M = os.path.join(REPO, "marion"); shots = {}
    subprocess.run(["python3", "kit/make_kit.py"], cwd=M, check=True, capture_output=True)
    for sc in sorted({g["scene"] for g in G}):
        b = next(g["build"] for g in G if g["scene"] == sc)
        r = subprocess.run(["python3", "kit/build_scene.py", sc] + b.split() + ["--borrow"], cwd=M, capture_output=True, text=True)
        if r.returncode or "SYNTAX ERROR" in r.stdout: raise SystemExit(f"build {sc} failed:\n{r.stdout[-800:]}{r.stderr[-800:]}")
        lo, nc = (any(g.get(k) for g in G if g["scene"] == sc) for k in ("lores_clouds", "no_clouds"))
        if lo or nc:   # the PENDING clouds (not tested): low resolution, or off where none is on screen, so SwiftShader stays inside the snapshot timeout
            bp = os.path.join(M, "scenes", sc, "gl", "bwgl.mjs"); t = open(bp).read(); os.remove(bp)   # (a copy in the scene, never the kit file)
            t = t.replace("resolution: C.fair.res ?? 0.75", "resolution: 0.4").replace("maxSteps: C.fair.maxSteps ?? 200", "maxSteps: 90")
            if nc: t = t.replace("if (C.fair) {", "if (false) {").replace("if (C.stratus && DV) {", "if (false) {")
            open(bp, "w").write(t)
        ts = sorted({g["scene_t"] for g in G if g["scene"] == sc}); out = os.path.join(work, sc)
        for k in range(3):   # the snapshot command occasionally drops a frame: retry
            r = subprocess.run(["bash", os.path.join(REPO, "vicksburg/tools/snap.sh"), f"scenes/{sc}", ",".join(f"{t:.4f}" for t in ts), out], cwd=M, capture_output=True, text=True)
            fs = sorted(glob.glob(f"{out}/frame-*.png"))
            if len(fs) >= len(ts): break
            print(f"  {sc}: snapshot try {k + 1} got {len(fs)}/{len(ts)} stills: {(r.stdout + r.stderr).strip().splitlines()[-1:]}")
        for f in fs:
            t = float(re.search(r"at-([\d.]+)s", f).group(1)); shots[(sc, round(t, 3))] = f
    return [(g, shots.get((g["scene"], round(g["scene_t"], 3)))) for g in G]


def frames_mp4(L, mp4, only, work):
    G = json.load(open(os.path.join(GOLD, "golden.json")))["frames"]; G = [g for g in G if not only or g["id"] in only]; os.makedirs(work, exist_ok=True); out = []
    for g in G:
        f = os.path.join(work, g["id"] + ".png")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{g['frame'] / 30 - 0.005:.4f}", "-i", mp4, "-frames:v", "1", f], check=True); out.append((g, f))
    return out


def check_frames(L, pairs, kind, save_refs=False):
    T = L["frame_thresholds"][kind]; TD = L["frame_thresholds"]["local_ref"]; fails = []
    print(f"| golden frame | block | crop ssim | colour | tones | >40 lv % | full ssim | local ref: px > 6 lv % | p99.5 | |"); print("|---|---|---|---|---|---|---|---|---|---|")
    for g, f in pairs:
        if not f: fails.append(f"{g['id']}: no frame rendered"); print(f"| {g['id']} | {g['block']} | - | - | - | - | - | NO FRAME |"); continue
        r = compare(f, os.path.join(GOLD, g["crop_png"]), g["crop"]); rf = compare(f, os.path.join(GOLD, g["full_png"]), None, (960, 540))
        bad = judge(r, T) + [f"full {x}" for x in judge(rf, T["full"])]
        rp = os.path.join(GOLD, "local", g["id"] + ".png"); dr = None
        if save_refs:
            from PIL import Image
            os.makedirs(os.path.dirname(rp), exist_ok=True); im = Image.open(f).convert("RGB").crop(g["crop"])
            if im.size[0] > 1000: im = im.resize((im.size[0] // 2, im.size[1] // 2), Image.LANCZOS)
            im.save(rp, optimize=True)
        if kind == "local":
            if os.path.exists(rp):
                dr = drift(f, rp, g["crop"])
                if dr["px6"] > TD["px6"] or dr["p995"] > TD["p995"]: bad.append(f"drift vs the local reference: {dr['px6']} % px > 6 levels (max {TD['px6']}), p99.5 {dr['p995']} (max {TD['p995']})")
            else: bad.append("no local reference still (golden/local/)")
        if bad: fails.append(f"{g['id']} ({g['block']}): " + "; ".join(bad))
        print(f"| {g['id']} | {g['block']} | {r['ssim']} | {r['dmean']} | {r['dpct']} | {r['d40']} | {rf['ssim']} | {dr['px6'] if dr else '-'} | {dr['p995'] if dr else '-'} | {'FAIL' if bad else 'ok'} |")
    return fails


# ------------------------------------------------------------------ audio
def check_audio(L, f, cues, voice, vdir):
    import numpy as np
    A = L["params"]["audio"]; ref = A["reference_r15"]; tol = A["tolerance_db"]; fails = []
    x = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-vn", "-ac", "2", "-ar", "48000", "-f", "f32le", "-"], capture_output=True).stdout, np.float32).reshape(-1, 2)
    m = lambda t, d: 10 * np.log10(np.mean(x[int(t * 48000):int((t + d) * 48000)] ** 2) + 1e-12)
    v0, v1 = voice; vo = m(v0, v1 - v0); print(f"voice only {v0}-{v1} s: {vo:.1f} dB (r15 {ref['voice_only']})")
    print("| cue | t | dB (0.35 s) | vs voice | r15 vs voice | |"); print("|---|---|---|---|---|---|")
    for kind, t in cues:
        lv = m(t, 0.35); off = lv - vo; want = ref["offsets_vs_voice"][kind]; ok = abs(off - want) <= tol
        if not ok: fails.append(f"{kind} at {t}: {off:+.1f} dB vs voice (locked {want:+.1f} +-{tol})")
        print(f"| {kind} | {t} | {lv:.1f} | {off:+.1f} | {want:+.1f} | {'ok' if ok else 'FAIL'} |")
    r = subprocess.run(["ffmpeg", "-nostats", "-i", f, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
    I = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", r)[-1]); P = float(re.findall(r"Peak:\s+(-?[\d.]+) dBFS", r)[-1])
    print(f"loudness {I:.1f} LUFS (locked {A['lufs']} +-{A['lufs_tol']}), true peak {P:.1f} dBFS (max {A['true_peak_max']})")
    if abs(I - A["lufs"]) > A["lufs_tol"]: fails.append(f"loudness {I} LUFS")
    if P > A["true_peak_max"]: fails.append(f"true peak {P} dBFS")
    if vdir:   # r15 layout only: the buckshot ripple's voice margins (measure_buckshot.py, needs the voice stems)
        r = subprocess.run(["python3", os.path.join(REPO, "research/style_tests/stylew_borrow/tools/measure_buckshot.py"), vdir, f"check={f}"], capture_output=True, text=True).stdout
        print(r.strip()); row = [ln for ln in r.splitlines() if ln.startswith("| check")]
        if row:
            nums = [float(v) for v in re.findall(r"[+-][\d.]+", row[0].split("|", 3)[3])]
            for got, want in zip(nums, A["buckshot_margins_r15"]):
                if abs(got - want) > tol: fails.append(f"buckshot voice margin {got:+.1f} vs r15 {want:+.1f}")
    return fails


# ------------------------------------------------------------------ relock (owner only)
def relock(L, words):
    if not re.search(r"20\d\d-\d\d-\d\d", words): raise SystemExit("--relock needs the owner's dated approval words, e.g. \"owner 2026-12-03: 'lock it'\"")
    L["history"].append({"version": L["version"], "approved": L["approved"]}); L["version"] += 1; L["approved"] = words
    for spec in L["locked_files"]:
        h, pend = digest(spec)
        if h: spec["sha256"] = h; spec["pending"] = pend or spec.get("pending", {})
        if not spec.get("pending"): spec.pop("pending", None)
    L["params"]["blocks"] = {k: v for k, v in node_lock().items() if k != "v"}; L["params"]["audio"]["env_defaults"] = audio_defaults()
    json.dump(L, open(LOCK, "w"), indent=1); print(f"wrote lock v{L['version']} -> {LOCK} (now bump BW.LOCK.v in borrow.js to {L['version']})")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--lint", nargs="*", default=[]); ap.add_argument("--frames", action="store_true"); ap.add_argument("--mp4")
    ap.add_argument("--only", default=""); ap.add_argument("--work", default=None)
    ap.add_argument("--audio"); ap.add_argument("--cues", default="cannon=34.63,impact=35.13,volley=63.37,later=66.56"); ap.add_argument("--voice", default="40-44")
    ap.add_argument("--voice-dir"); ap.add_argument("--relock")
    ap.add_argument("--save-local-refs", action="store_true", help="OWNER RELOCK ONLY: store the local stills as golden/local/ references")
    a = ap.parse_args(); L = json.load(open(LOCK))
    if a.relock: relock(L, a.relock); return 0
    errs, miss, warns = check_hashes(L); bad = False
    for w in warns: print("WARNING:", w)
    for m in miss: print(f"LOOK LOCK: locked sound file missing (not committed; restore it from its project): {m}")
    print("pending (NOT locked, NOT approved): " + "; ".join(f"{k}: {v['status']}" for k, v in L["pending"].items()))
    if errs:
        for e in errs: print("LOOK LOCK BROKEN:", e)
        bad = True
    elif miss: print("LOOK LOCK INCOMPLETE: files missing (see above)"); bad = True
    else: print(f"LOOK LOCK OK (v{L['version']}: {L['approved_short']})")
    for p in a.lint:
        e, w = lint(p, L)
        for x in w: print(x)
        for x in e: print("LINT ERROR:", x)
        print(f"lint {p}: {'FAIL' if e else 'ok'}" + (f" ({len(w)} warning lines)" if w else "")); bad |= bool(e)
    only = set(filter(None, a.only.split(",")))
    work = a.work or tempfile.mkdtemp(prefix="looklock_", dir=os.environ.get("TMPDIR", "/tmp"))
    if a.frames or a.mp4:
        pairs = frames_local(L, only, work) if a.frames else frames_mp4(L, a.mp4, only, work)
        fails = check_frames(L, pairs, "local" if a.frames else "mp4", a.save_local_refs and a.frames)
        for x in fails: print("FRAMES FAIL:", x)
        print(f"frames vs golden ({len(pairs)}): {'FAIL' if fails else 'PASS'}  (stills in {work})"); bad |= bool(fails)
    if a.audio:
        cues = [(k, float(v)) for k, v in (c.split("=") for c in a.cues.split(","))]; v0, v1 = (float(v) for v in a.voice.split("-"))
        fails = check_audio(L, a.audio, cues, (v0, v1), a.voice_dir)
        for x in fails: print("AUDIO FAIL:", x)
        print(f"audio: {'FAIL' if fails else 'PASS'}"); bad |= bool(fails)
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
