"""Sound for the Style W borrow test clip: the Marion film's own mix for each window (voice A + music bed + the locked kit cues of the
scene) + the NEW flintlock musket shots, one per visible muzzle flash (BW.shot -> data-shots), -14 LUFS.

usage: python3 research/style_tests/stylew_borrow/tools/make_test_audio.py OUT.wav VC_DIR
  VC_DIR holds out_a.wav (film 0-27 s), out_b.wav (56-76 s), out_c.wav (797.5-846.2 s): voice A (tts/convert_voice.py) of the
  re-voiced Kokoro windows (voice_clip.py); marion/assets/media/music.wav = tools/make_music_bed.py; the locked kit wavs from goosegreen.
Musket shots: troop_sfx.Lib with the Jackson flintlock shot set (lock snap + pan flash + real black-powder bang, ajackson/sound/SOURCES.md),
grouped into ripples (shots < 0.9 s apart) and rendered with troop_sfx.render_volley (attack on the flash frame, pan from screen x).
Level: a volley sits 8 dB under the locked kit cannon impact (owner decision, ajackson/OWNER_DECISIONS.md row 14), measured below.
The kit's old "mg" cue (single generic volley sample) is dropped where the borrow scenes fire shot by shot."""
import glob, html, json, os, re, subprocess, sys
import numpy as np, soundfile as sf
REPO = "/home/user/battle-maps"; M = f"{REPO}/marion"
os.environ["TROOP_SHOTS"] = f"{REPO}/ajackson/sound/shots_flint"
sys.path.insert(0, f"{REPO}/vicksburg/tools"); sys.path.insert(0, f"{M}/tools")
import troop_sfx as T
import sfx_mix_lib as K
SR = 48000; OUT, VC = sys.argv[1], sys.argv[2]
SEGS = [(0.0, 17.8, "test-bw-hook-a"), (float(os.environ.get("B0", "56.35")), float(os.environ.get("B1", "59.95")), "test-bw-hook-b"), (71.45, 75.85, "test-bw-hook-b"), (801.5, 839.5, "test-bw-m3f")]
VOICE = [(0.0, "out_a.wav"), (56.0, "out_b.wav"), (797.5, "out_c.wav")]
CHROME = glob.glob("/root/.cache/hyperframes/chrome/chrome-headless-shell/*/chrome-headless-shell-linux64/chrome-headless-shell")[0]
rd = lambda p, a=None, s=0, d=None: T.load_ff(p, af=a, start=s, dur=d)
db = lambda x: 10 ** (x / 20)
scene_cache = {}


def scene(name):
    if name not in scene_cache:
        tjs = open(f"{M}/scenes/{name}/timing.js").read(); st = json.loads(tjs[tjs.index("=") + 1:].strip().rstrip(";"))
        dom = subprocess.run([CHROME, "--headless", "--no-sandbox", "--disable-gpu", "--allow-file-access-from-files", "--virtual-time-budget=4000",
                              "--dump-dom", "file://" + f"{M}/scenes/{name}/index.html"], capture_output=True, text=True, timeout=180).stdout
        g = lambda a: json.loads(html.unescape(m.group(1))) if (m := re.search(r'<html[^>]*' + a + r'="([^"]*)"', dom)) else []
        scene_cache[name] = (st["abs_start"], g("data-sfx"), g("data-shots"))
    return scene_cache[name]


def voice(a, d):
    for off, f in VOICE:
        inf = sf.info(f"{VC}/{f}")
        if off <= a and a + d <= off + inf.frames / inf.samplerate + 0.01:
            y = rd(f"{VC}/{f}", s=a - off, d=d); return np.pad(y, ((0, max(0, int(d * SR) - len(y))), (0, 0)))[:int(d * SR)]
    raise SystemExit(f"no voice window for {a}")


# --- level: one 16-shot volley 8 dB under the locked cannon impact (cand3_hit at the kit level -7 dB), 400 ms RMS peaks
def rms_peak(x, w=int(0.4 * SR)):
    e = np.convolve((x ** 2).mean(1), np.ones(w) / w, "same"); return 10 * np.log10(e.max() + 1e-12)
imp = rd(f"{M}/assets/media/sfx/candidates/cand3_hit.wav") * db(-7)
probe = np.zeros((int(4 * SR), 2), np.float32); rng = np.random.default_rng(3); L = T.Lib(rng)
T.render_volley(L, probe, dict(type="musket_volley", tShare=0.5, unit=dict(men=144), at=dict(camDist=20, px=[960, 540]),
                               shots=[dict(tShare=0.5 + 0.04 * k, at=dict(px=[700 + 30 * k, 540])) for k in range(16)]), rng, [])
GAIN = (rms_peak(imp) - 8) - rms_peak(probe)
print(f"cannon impact {rms_peak(imp):.1f} dB, raw volley {rms_peak(probe):.1f} dB -> musket stem gain {GAIN:+.1f} dB")

parts, log = [], []
for (a, b, name) in SEGS:
    d = b - a; n = int(round(d * SR)); t0, cues, shots = scene(name)
    vo = voice(a, d); vo = np.pad(vo, ((0, max(0, n - len(vo))), (0, 0)))[:n]
    mu = rd(f"{M}/assets/media/music.wav", s=a, d=d); mu = np.pad(mu, ((0, max(0, n - len(mu))), (0, 0)))[:n]
    kit = [[t + t0 - a, k, name] for k, t in cues if a <= t + t0 < b and k not in ("mg", "musket")]
    K.render(kit, d, "/tmp/_bw_kit.wav"); fx = rd("/tmp/_bw_kit.wav"); fx = np.pad(fx, ((0, max(0, n - len(fx))), (0, 0)))[:n]; os.remove("/tmp/_bw_kit.wav")
    # musket shots: [t, screen x, screen y] (scene time), grouped into ripples
    sh = sorted([[t + t0 - a, x, y] for t, x, y in shots if a <= t + t0 < b - 0.05])
    st = np.zeros((n + SR * 3, 2), np.float32); groups = []
    for s in sh:
        if groups and s[0] - groups[-1][-1][0] < 0.9: groups[-1].append(s)
        else: groups.append([s])
    rng = np.random.default_rng(int(a * 10) + 7); L = T.Lib(rng)
    front = np.zeros(len(st), np.float32)   # r2: mask: the first shot of each ripple (up to the second shot) stays at full level; the tail is ducked 6 dB under the voice
    for g in groups:
        e = dict(type="musket_volley", tShare=g[0][0], unit=dict(men=len(g) * 9), at=dict(camDist=20, px=[g[0][1], g[0][2]]),
                 shots=[dict(tShare=t, at=dict(px=[x, y])) for t, x, y in g])
        T.render_volley(L, st, e, rng, log)
        i0 = max(0, int((g[0][0] - 0.12) * SR)); i1 = int(((g[1][0] if len(g) > 1 else g[0][0] + 1.5) - 0.01) * SR); front[i0:i1] = 1
    f = int(0.01 * SR); front = np.convolve(front, np.ones(f) / f, "same")
    tail = st * (1 - front)[:, None]; st = st * front[:, None]
    w = int(0.05 * SR); env = np.sqrt(np.convolve((vo ** 2).mean(1), np.ones(w) / w, "same")); env = (env > 0.01).astype(np.float32)
    k = int(0.25 * SR); env = np.clip(np.convolve(env, np.hanning(k) / np.hanning(k).sum(), "same") * 1.2, 0, 1)
    EX = float(os.environ.get("MUSKET_EXTRA_DB", "0"))   # r3: first shot -4 dB, tail -6 dB under the voice (+ EX on both) so the bangs peak <= -6 dBFS
    fx = fx + (st[:n] * db(-4 + EX) + tail[:n] * (1 - 0.5 * env)[:, None] * db(EX)) * db(GAIN)
    print(f"{name:16s} {a:7.2f}-{b:7.2f}  kit cues {len(kit):3d}  musket shots {len(sh):3d} in {len(groups)} ripples")
    parts.append((vo, mu, fx))

# --- concat (10 ms joins under the picture's fade through black) and the assemble_full.py chain: music 0.08 ducked (ratio 6), sfx ducked (ratio 3)
XF = float(os.environ.get("XF", "0"))   # r5: straight crossfades of XF s at the joins (the picture uses xfade with the same overlap)
def cat(i):
    if XF <= 0:
        out = []
        for p in parts:
            x = p[i].copy(); f = int(0.08 * SR); x[:f] *= np.linspace(0, 1, f)[:, None]; x[-f:] *= np.linspace(1, 0, f)[:, None]; out.append(x)
        return np.concatenate(out)
    f = int(round(XF * SR)); y = parts[0][i].copy()
    for p in parts[1:]:
        x = p[i]; r = np.linspace(0, 1, f)[:, None]; y[-f:] = y[-f:] * (1 - r) + x[:f] * r; y = np.concatenate([y, x[f:]])
    return y
tmp = "/tmp/_bw_"
for i, nm in enumerate(("vo", "mu", "fx")): sf.write(f"{tmp}{nm}.wav", cat(i), SR, subtype="FLOAT")
D = sum(b - a for a, b, _ in SEGS) - XF * (len(SEGS) - 1)
f = ["[0:a]asplit=3[vo][key][key2]", "[2:a][key2]sidechaincompress=threshold=0.03:ratio=3:attack=10:release=300[sfx]",
     f"[1:a]volume=0.08[mus]", "[mus][key]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[musd]",
     "[vo][musd][sfx]amix=inputs=3:normalize=0,alimiter=limit=0.5:level=false[aout]"]
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{tmp}vo.wav", "-i", f"{tmp}mu.wav", "-i", f"{tmp}fx.wav", "-filter_complex", ";".join(f),
                "-map", "[aout]", "-c:a", "pcm_s16le", f"{tmp}mix.wav"], check=True)
LN = "loudnorm=I=-14:TP=-1.5:LRA=11"
r = subprocess.run(["ffmpeg", "-nostats", "-i", f"{tmp}mix.wav", "-af", LN + ":print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
m = json.loads(r[r.rindex("{"):r.rindex("}") + 1])
af = (f"{LN}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}"
      f":offset={m['target_offset']}:linear=true,aresample=48000")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{tmp}mix.wav", "-af", af, "-c:a", "pcm_s16le", OUT], check=True)
for nm in ("vo", "mu", "fx", "mix"): os.remove(f"{tmp}{nm}.wav")
json.dump(dict(gain_db=round(GAIN, 2), segments=SEGS, volleys=log), open(OUT.rsplit(".", 1)[0] + "_log.json", "w"), indent=0, default=float)
print("wrote", OUT, round(D, 2), "s")
