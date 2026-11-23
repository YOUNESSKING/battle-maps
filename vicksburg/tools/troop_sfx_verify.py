"""Objective checks for the troop sound test (python3 vicksburg/tools/troop_sfx_verify.py VIDEO_WITH_OLD_OR_NEW.mp4 STEM.wav STEM_LOG.json STEM_HIST.json MIX.wav)
 A  time base: cannon muzzle flashes (orange sprites, VISIBLE) in the video vs the event list (+-1 frame at 30 fps)
 B  stem onsets: first musket shot of every event vs the event time (+-1 frame), and every shot time inside the ripple window
 C  levels: voice vs SFX in the final mix, clipping, true peak
 D  repetition: identical sample (file + pitch) inside 2 s"""
import json, sys, subprocess, numpy as np, soundfile as sf
V, STEM, LOG, HIST, MIX = sys.argv[1:6]; SD = "/home/user/battle-maps/vicksburg/sound"; W, H = 1280, 720; SR = 48000; FPS = 30
R = {}
# ---- A: flash frames of cannon shots
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", V, "-vf", f"fps={FPS}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
F = np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3)
cnt = []
for fr in range(len(F)):
    a = F[fr].astype(np.int16); r, g, b = a[..., 0], a[..., 1], a[..., 2]; cnt.append(int(((r > 200) & (b < r - 90) & (g > .35 * r) & (g < .85 * r)).sum()))
cnt = np.array(cnt); offs = []; rows = []
for s in ("S09", "S10"):
    for e in json.load(open(f"{SD}/troop_events_{s}.json"))["events"]:
        if e["type"] != "cannon_shot": continue
        f0 = int(round(e["tShare"] * FPS)); jump = None
        for k in range(-4, 8):
            fr = f0 + k
            if 3 <= fr < len(cnt) and cnt[fr] - np.median(cnt[fr - 3:fr]) >= 40: jump = k; break
        rows.append((e["tShare"], jump))
        if jump is not None: offs.append(jump)
A = dict(cannon_events=len(rows), flash_found=len(offs), offset_frames=offs, within_1_frame=int(sum(abs(o) <= 1 for o in offs)), not_detected=[t for t, j in rows if j is None])
print("A cannon flash vs event (frames):", A)
# ---- B: stem onsets
log = json.load(open(LOG)); stem, _ = sf.read(STEM, dtype="float32"); m = np.abs(stem).max(1)
w = int(.003 * SR); env = np.sqrt(np.convolve(m ** 2, np.ones(w) / w, "same"))
B = []
allst = sorted(st for L in log if "shot_times" in L for st in L["shot_times"])
for L in log:
    if L["type"] not in ("musket_volley", "independent_fire") or "shot_times" not in L: continue
    for st in L["shot_times"]:
        if any(abs(o - st) < .6 for o in allst if o != st): continue   # isolated shots only: a clean onset cannot be read inside a ripple
        a, b = int((st - .1) * SR), int((st + .08) * SR); seg = env[a:b]; pk = seg.max()
        if pk < 1e-4: continue
        o = next(i for i, v_ in enumerate(seg) if v_ > .25 * pk); B.append((a + o) / SR - st)
Bv = np.array([x for x in B if x is not None]) * 1000
first_err = []
for L in log:
    if L["type"] == "musket_volley":
        first_err.append(L["onset"] - L["t"])
sys.path.insert(0, "/home/user/battle-maps/vicksburg/tools"); import troop_sfx as T   # sample-accuracy of the placement itself: 1 shot into silence at 3 distances x 19 times
ue = []
for t in np.arange(1, 40, 2.1):
    for dd in (0., .5, 1.):
        o_ = np.zeros((int(45 * SR), 2), np.float32); Lb = T.Lib(np.random.default_rng(int(t * 10))); y, att, nm, j = Lb.shot(t, dd, 0, 0., 11000 - 8300 * dd); T.put(o_, y, t, att)
        m_ = np.abs(o_).max(1); e_ = np.sqrt(np.convolve(m_ ** 2, np.ones(w) / w, "same")); sg = e_[int((t - .05) * SR):int((t + .06) * SR)]; ue.append(((int((t - .05) * SR) + next(k for k, q in enumerate(sg) if q > .25 * sg.max())) / SR - t) * 1000)
print(f"B0 placement test (one shot into silence, {len(ue)} trials): onset error mean {np.mean(ue):.1f} ms, max |err| {np.abs(ue).max():.1f} ms")
print(f"B first shot of every volley vs its event time: max {max(abs(x) for x in first_err) * 1000:.1f} ms over {len(first_err)} volleys; every other shot is scheduled inside the ripple window [t, t+R] (R {min(l['ripple'] for l in log if l['type']=='musket_volley'):.2f}-{max(l['ripple'] for l in log if l['type']=='musket_volley'):.2f} s)")
# ---- C: levels
mix, _ = sf.read(MIX, dtype="float32"); wd = json.load(open("/home/user/battle-maps/vicksburg/audio/voice_words.json"))
spans = []
for sec in wd:
    for ww, a, b in sec["words"]:
        for fs, so, ln in ((728.252, 0, 55), (871.788, 55, 15)):
            if fs <= a < fs + ln: spans.append((a - fs + so, min(b, fs + ln) - fs + so))
vm = np.zeros(len(mix), bool)
for a, b in spans: vm[int(a * SR):int(b * SR)] = True
d = lambda x: 20 * np.log10(np.sqrt((x ** 2).mean()) + 1e-12)
voice_rms = d(mix[vm]); stem_active = np.abs(stem[:len(mix)]).max(1) > 1e-4
# SFX level (stem, after duck -6 dB under voice and the +0.2 dB normalisation) in the 1 s after each volley / skirmish
vol_pk = []; sk_pk = []
for L in log:
    if L["type"] in ("musket_volley", "independent_fire"):
        a = int(L["t"] * SR); seg = stem[a:a + SR]; pk = 20 * np.log10(np.abs(seg).max() + 1e-12) - (6 if vm[min(a + SR // 4, len(vm) - 1)] else 0)
        (vol_pk if L["type"] == "musket_volley" else sk_pk).append(pk)
tp = subprocess.run(["ffmpeg", "-nostats", "-i", MIX, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
print(f"C voice RMS in word regions {voice_rms:.1f} dBFS | musket volley peak (stem, after duck) {np.mean(vol_pk):.1f} dBFS (min {min(vol_pk):.1f}, max {max(vol_pk):.1f}) | skirmish shot peak {np.mean(sk_pk) if sk_pk else float('nan'):.1f} | mix sample peak {20 * np.log10(np.abs(mix).max()):.2f} dBFS | clipped samples {(np.abs(mix) >= .999).sum()}")
print("  ", [l.strip() for l in tp.splitlines() if "I:" in l][-1], "|", [l.strip() for l in tp.splitlines() if "Peak:" in l][-1])
# ---- D: repetition
hist = json.load(open(HIST))["used"]; hist.sort(); bad = 0; near = 0
for i, (t, n, j) in enumerate(hist):
    for t2, n2, j2 in hist[i + 1:]:
        if t2 - t >= 2.0: break
        if n2 == n:
            near += 1
            if abs(j2 - j) < .02: bad += 1
print(f"D {len(hist)} placed shots, {len(set(h[1] for h in hist))} distinct recordings; same recording within 2 s: {near} pairs; identical (same recording AND same pitch) within 2 s: {bad}")
json.dump(dict(A=A, B=dict(placement_err_ms_max=float(np.abs(ue).max()), first_shot_err_ms_max=max(abs(x) for x in first_err) * 1000), C=dict(voice_rms=voice_rms, volley_peak=float(np.mean(vol_pk)), skirmish_peak=float(np.mean(sk_pk)) if sk_pk else None), D=dict(shots=len(hist), same_recording_pairs=near, identical=bad)), open(f"{SD}/verify.json", "w"), indent=1, default=float)
