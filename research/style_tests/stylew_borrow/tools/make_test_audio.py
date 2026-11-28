"""Sound for the Style W borrow test clip: the Marion film's own mix for each window (voice A + music bed + the locked kit cues of the
scene) + the NEW flintlock musket shots, one per visible muzzle flash (BW.shot -> data-shots), -14 LUFS.

usage: python3 research/style_tests/stylew_borrow/tools/make_test_audio.py OUT.wav VC_DIR
  VC_DIR holds out_a.wav (film 0-27 s), out_b.wav (56-76 s), out_d.wav (738-765.5 s, r9), out_c.wav (797.5-846.2 s): voice A (tts/convert_voice.py) of the
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
TMPP = f"{os.environ.get('TMPDIR', '/tmp')}/_bw{os.getpid()}"   # per-process temp prefix (parallel A/B builds no longer clobber each other)
SR = 48000; OUT, VC = sys.argv[1], sys.argv[2]
GG = f"{REPO}/goosegreen/assets/media/sfx"; GM = f"{REPO}/grant/assets/media/sfx/candidates"   # r13: the 3D films' sound sources (ajackson/tools/assemble.py, gm3d/clip/assemble.py)
SEGS = [(0.0, 17.8, "test-bw-hook-a"), (float(os.environ.get("B0", "56.35")), float(os.environ.get("B1", "59.95")), "test-bw-hook-b"), (71.45, 75.85, "test-bw-hook-b"), (750.21, 764.81, "test-bw-m3d"), (801.5, 839.5, "test-bw-m3f")]   # r9: + the Fort Motte six-pounder (m3d scene 40.0-54.6)
VOICE = [(0.0, "out_a.wav"), (56.0, "out_b.wav"), (738.0, "out_d.wav"), (797.5, "out_c.wav")]
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
        scene_cache[name] = (st["abs_start"], g("data-sfx"), g("data-shots"), g("data-bwt"))
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
imp = rd(f"{GG}/candidates/cand1_hit.wav") * db(-15 + 4)   # r13: the reference is now the 3D films' cannon (Jackson: gun -15 dB, sfx +4 dB)
probe = np.zeros((int(4 * SR), 2), np.float32); rng = np.random.default_rng(3); L = T.Lib(rng)
T.render_volley(L, probe, dict(type="musket_volley", tShare=0.5, unit=dict(men=144), at=dict(camDist=20, px=[960, 540]),
                               shots=[dict(tShare=0.5 + 0.04 * k, at=dict(px=[700 + 30 * k, 540])) for k in range(16)]), rng, [])
CN_DB = float(os.environ.get("CANNON_DB", "7")); MU_DB = float(os.environ.get("MUSKET_DB", "12"))
CN_REL = float(os.environ.get("CANNON_REL", "1.5")); MU_REL = float(os.environ.get("MUSKET_REL", "-1")); MU_REL2 = float(os.environ.get("MUSKET_REL2", "2"))   # r14h: the gun stems' level vs the voice (100 ms max RMS)   # r14 (owner: guns and muskets too low): the 3D cannon stem +7 dB, the muskets +12 dB (now outside the voice-keyed compressor; chosen from a gain grid, NOTES)
GAIN = (rms_peak(imp) - 8) - rms_peak(probe) + MU_DB
print(f"cannon impact {rms_peak(imp):.1f} dB, raw volley {rms_peak(probe):.1f} dB -> musket stem gain {GAIN:+.1f} dB")

parts, log = [], []
ONLY = os.environ.get("ONLY")   # r14h: build one window only (A/B snippets)
if ONLY: SEGS = [q for q in SEGS if q[2] == ONLY]
for (a, b, name) in SEGS:
    d = b - a; n = int(round(d * SR)); t0, cues, shots, bwt = scene(name)
    vo = voice(a, d); vo = np.pad(vo, ((0, max(0, n - len(vo))), (0, 0)))[:n]
    mu = rd(f"{M}/assets/media/music.wav", s=a, d=d); mu = np.pad(mu, ((0, max(0, n - len(mu))), (0, 0)))[:n]
    kit = [[t + t0 - a, k, name] for k, t in cues if a <= t + t0 < b and k not in ("mg", "musket")]
    # r10 (owner: "the artillery should be like the film 3D, I like that sound"): the cannon shot is mixed as in the 3D films (Andrew Jackson v4,
    # ajackson/tools/assemble.py + OWNER_DECISIONS row 14): the 3D films' gun sound (goosegreen candidates/cand1_hit.wav at -15 dB) +4 dB,
    # ducked only 25 % under the voice, its onset (0.115 s into the file) on the flash frame. The locked kit files are untouched.
    # r13 (owner: "guns and artillery exactly like the 3D films"): every kit gun / impact cue in the borrow windows is dropped (no doubled sound);
    # the visible cannon shot gets the 3D "gun" on its flash frame, its visible impact the 3D "boom", the burning roof the 3D "fire".
    GUNK = ("fire", "impact", "explosion", "mortar", "mg"); guns = [c for c in kit if c[1] == "fire" and name == "test-bw-m3d"]
    booms = [c for c in kit if c[1] == "impact" and name == "test-bw-m3d"]; KEEPK = ()   # r14h (owner, final): the guns use ONLY the 3D-film sounds: no Style W kit cannon / impact cues (an extra impact only if the judges pick one, IMPACT env)
    dropped = [c for c in kit if c[1] in GUNK and c[1] not in KEEPK]; kit = [c for c in kit if c[1] not in GUNK or c[1] in KEEPK]
    kitg = [c for c in kit if c[1] in KEEPK]; kit = [c for c in kit if c[1] not in KEEPK]   # r14h: the kit impact joins the cannon stem
    K.render(kit, d, TMPP + "_kit.wav"); fx = rd(TMPP + "_kit.wav"); fx = np.pad(fx, ((0, max(0, n - len(fx))), (0, 0)))[:n]; os.remove(TMPP + "_kit.wav")
    # musket shots: [t, screen x, screen y] (scene time), grouped into ripples
    sh = sorted([[t + t0 - a, x, y] for t, x, y in shots if a <= t + t0 < b - 0.05])
    st = np.zeros((n + SR * 3, 2), np.float32); groups = []
    for s in sh:
        if groups and s[0] - groups[-1][-1][0] < 0.9: groups[-1].append(s)
        else: groups.append([s])
    rng = np.random.default_rng(int(a * 10) + 7); L = T.Lib(rng)
    front = np.zeros(len(st), np.float32); boost = np.ones(len(st), np.float32)   # r2: mask: the first shot of each ripple (up to the second shot) stays at full level; the tail is ducked 6 dB under the voice
    FRONT_S = float(os.environ.get("FRONT_S", "0.35"))   # r14i: the loud "front" of a ripple = its first 0.35 s (a 20-shot ripple's second shot is 33 ms in); the rest is the ducked tail
    for g in groups:
        e = dict(type="musket_volley", tShare=g[0][0], unit=dict(men=len(g) * 9), at=dict(camDist=20, px=[g[0][1], g[0][2]]),
                 shots=[dict(tShare=t, at=dict(px=[x, y])) for t, x, y in g])
        T.render_volley(L, st, e, rng, log)
        i0 = max(0, int((g[0][0] - 0.12) * SR)); i1 = int((max(g[1][0] if len(g) > 1 else g[0][0] + 1.5, g[0][0] + FRONT_S) - 0.01) * SR); front[i0:i1] = 1
        if name == "test-bw-m3f" and g is groups[0]: boost[i0:i1] = db(2)   # r14 (critic B): the first ambush shot +2 dB over the voice
    f = int(0.01 * SR); front = np.convolve(front, np.ones(f) / f, "same")
    tail = st * (1 - front)[:, None]; st = st * (front * boost)[:, None]
    w = int(0.05 * SR); env = np.sqrt(np.convolve((vo ** 2).mean(1), np.ones(w) / w, "same")); env = (env > 0.01).astype(np.float32)
    k = int(0.25 * SR); env = np.clip(np.convolve(env, np.hanning(k) / np.hanning(k).sum(), "same") * 1.2, 0, 1)
    EX = float(os.environ.get("MUSKET_EXTRA_DB", "0"))   # r3: first shot -4 dB, tail -6 dB under the voice (+ EX on both) so the bangs peak <= -6 dBFS
    TL_DB = float(os.environ.get("TAIL_DB", "-12")); TL_DK = float(os.environ.get("TAIL_DUCK", "0.75"))   # r14i (critic B): the ripple tails -12 dB + 75 % under the voice (r13 had -6 + 50 % before a voice-keyed compressor), after the per-ripple limiter
    mus_front = st[:n] * db(-4 + EX) * db(GAIN); mus_tail = tail[:n] * (1 - TL_DK * env)[:, None] * db(EX + TL_DB) * db(GAIN)
    mus_shots = mus_front + mus_tail
    # r14 (owner: too low): the musket stem joins the cannon stem (not the voice-keyed sidechain compressor), ducked only by the 30 % tail rule above
    kv = int(0.25 * SR); venv = np.convolve(np.abs(vo).mean(1), np.ones(kv) / kv, mode="same"); venv = np.clip(venv / (np.percentile(venv, 95) + 1e-9), 0, 1)
    cn = np.zeros((n + SR * 8, 2), np.float32)
    gb = np.zeros_like(cn); fr = np.zeros_like(cn)   # r14i (critic B): the roof fire is its own stem (in r14h it rode in the pre-limited cannon stem and came up ~4.5 dB over the voice)
    def put(clip, t, onset, g, buf=None):   # onset of the clip on the cue time
        buf = cn if buf is None else buf
        i0 = int(round((t - onset) * SR)); i0 = max(0, i0); m = min(len(clip), len(buf) - i0); buf[i0:i0 + m] += clip[:m] * db(g); return round(t + a, 3)
    log3 = []
    if guns:
        g3 = rd(f"{GG}/candidates/cand1_hit.wav"); GX = float(os.environ.get("GUN_EXTRA", "6.5")); GT = float(os.environ.get("GUN_TAIL_DB", "-12"))   # r14i (critic B): the crack its own stem; its body past GUN_TAIL_AT s eased GT dB over 0.2 s so it stops filling the boom's window (the strike 0.5 s later)
        ge = np.ones(len(g3), np.float32); tt = np.arange(len(g3)) / SR - 0.115; GA = float(os.environ.get("GUN_TAIL_AT", "0.30")); ge = db(GT * np.clip((tt - GA) / 0.2, 0, 1)).astype(np.float32); g3 = g3 * ge[:, None]
        log3 += [("gun cand1_hit", -15 + 4 + CN_DB + GX, put(g3, c[0], 0.115, -15 + 4 + CN_DB + GX, gb)) for c in guns]   # r14h: the shot itself above its boom
    if booms:
        b3 = rd(f"{GG}/candidates/cand2_hit.wav"); log3 += [("boom cand2_hit (impact)", -19 + 4 + CN_DB, put(b3, c[0], 0.067, -19 + 4 + CN_DB)) for c in booms]
        IMP = os.environ.get("IMPACT")   # r14h: an extra impact on the strike, "path|ffmpeg filter|dB vs the boom" (the judges' pick), inside the cannon stem
        if IMP:
            ip, iflt, irel = IMP.split("|"); ic = rd(ip, iflt or None); ie = np.abs(ic).mean(1); io = float(np.argmax(ie > 0.1 * ie.max())) / SR
            log3 += [(f"impact {os.path.basename(ip)}", -19 + 4 + CN_DB + float(irel), put(ic, c[0], io, -19 + 4 + CN_DB + float(irel))) for c in booms]
    if name == "test-bw-m3d" and bwt:   # the roof catches fire on screen at T_ROOF + 0.9 (scene time)
        fire = rd(f"{GM}/bombs/bomb4_heavyexplosionreverbusc.mp3", "lowpass=f=900", 0, 5.6); fire *= np.clip((5.6 - np.arange(len(fire)) / SR) / 2.0, 0, 1)[:, None]
        tf = bwt[2] + 0.9 + t0 - a
        FDB = float(os.environ.get("FIRE_DB", "-13"))
        if 0 <= tf < d: log3.append(("fire bomb4 lowpass 900", FDB, put(fire, tf, 0.121, FDB, fr)))
    if kitg:
        K.render(kitg, d, TMPP + "_kitg.wav"); kg = rd(TMPP + "_kitg.wav"); os.remove(TMPP + "_kitg.wav"); cn[:min(len(kg), len(cn))] += kg[:len(cn)]
    def _pk(x, w=0.1):   # max short-term RMS (dB) of a stem in this window
        c = np.concatenate([[0], np.cumsum((x.mean(1).astype(np.float64)) ** 2)]); k = int(w * SR)
        return 10 * np.log10(max(1e-12, (c[k:] - c[:-k]).max() / k)) if len(c) > k else -120
    print(f"  stems (100 ms max RMS, pre-mix): voice {_pk(vo):.1f} dB | cannon {_pk(cn[:n] * (1 - 0.15 * venv)[:, None]):.1f} dB | muskets {_pk(mus_shots):.1f} dB")
    # r14h (owner: guns clearly louder): the cannon stem (kit impact + 3D gun + boom + fire) and the musket stem are each pushed into their own
    # limiter to a short-term level set against THIS window's voice (cannon = voice + CN_REL dB, muskets = voice + MU_REL dB, 100 ms max RMS)
    vk = vo.copy(); vref = _pk(vo)
    def prelim(x, target, ceil):
        if _pk(x) < -100: return x
        g = target - _pk(x)
        for _ in range(3):
            sf.write(TMPP + "_pl.wav", x * db(g), SR, subtype="FLOAT")
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", TMPP + "_pl.wav", "-af", f"alimiter=limit={ceil}:attack=1:release=60:level=false", "-c:a", "pcm_f32le", TMPP + "_pl2.wav"], check=True)
            y = rd(TMPP + "_pl2.wav"); y = np.pad(y, ((0, max(0, len(x) - len(y))), (0, 0)))[:len(x)]; gl = g; g += target - _pk(y)
        prelim.gain = gl; prelim.gr = _pk(x * db(gl)) - _pk(y)   # r14i: the gain applied and the limiter's reduction (100 ms RMS)
        os.remove(TMPP + "_pl.wav"); os.remove(TMPP + "_pl2.wav"); return y
    GUN_REL = float(os.environ.get("GUN_REL", "10"))   # r14i: the crack (own limiter, ceiling -2 dBFS) vs the boom stem (CN_REL, ceiling -4)
    cnB = prelim(cn[:n] * (1 - 0.15 * venv)[:, None], vref + CN_REL, db(-4)); cnG = prelim(gb[:n] * (1 - 0.15 * venv)[:, None], vref + GUN_REL, db(-2)); cnS = cnB + cnG
    if os.environ.get("DUMP_CN") and guns: np.save(os.environ["DUMP_CN"], np.stack([cnB.mean(1), cnG.mean(1), vk.mean(1)]))   # debug: boom / gun / voice stems of the cannon window
    musS = np.zeros_like(mus_shots)   # r14h (advisor): each ripple pushed to the target on its own (the buckshot ripple no longer rides under the first)
    cuts = [max(0, int((g[0][0] - 0.2) * SR)) for g in groups] + [n]
    for k in range(len(groups)):   # r14i: the FRONT shot of each ripple pushed to the target; its tail follows that gain minus the limiting (no squash-up of the tail)
        j0, j1 = cuts[k], cuts[k + 1]; prelim.gain = prelim.gr = 0
        musS[j0:j1] = prelim(mus_front[j0:j1], vref + MU_REL + (MU_REL2 if k else 0), db(-6)) + mus_tail[j0:j1] * db(prelim.gain - prelim.gr)   # r14h: the later ripples +2 dB (the 66.56 volley read +2.8 vs r13, the brief asks +4-6)
    if not groups: musS = mus_shots
    print(f"  stems (100 ms max RMS): voice {vref:.1f} | cannon {_pk(cnS):.1f} | muskets {_pk(musS):.1f} dB")
    FDK = float(os.environ.get("FIRE_DUCK", "0.6"))
    vo = vo + cnS + musS + fr[:n] * (1 - FDK * venv)[:, None]   # r14i: the fire ducked 60 % under the voice
    # battle bed: the 3D films' distant-warfare ambience, battle windows only (from the first visible shot), 1 s fades, -23 dB, ducked 35 %
    tb = (sh[0][0] - 0.8) if (name == "test-bw-m3f" and sh) else (guns[0][0] - 1.0) if guns else None
    if tb is not None and tb < d - 1:
        amb = rd(f"{GM}/cand5_distant-warfare.mp3", None, 70, d - tb + 0.5); amb = np.pad(amb, ((0, max(0, int((d - tb) * SR) + 1 - len(amb))), (0, 0)))
        i0 = int(tb * SR); m = n - i0; e = np.clip(np.minimum(np.arange(m) / SR, (m - np.arange(m)) / SR) / 1.0, 0, 1)
        vo[i0:] += amb[:m] * db(-27) * (e * (1 - 0.35 * venv[i0:]))[:, None]; log3.append(("ambience cand5 distant-warfare", -27, round(tb + a, 3)))   # r14h: -27 (was -23)
    if dropped: print(f"  dropped kit gun cues: {[(c[1], round(c[0] + a, 2)) for c in dropped]}")
    for l in log3: print(f"  3D-film sound: {l[0]:32s} {l[1]:+.0f} dB at {l[2]} (film s)")
    print(f"{name:16s} {a:7.2f}-{b:7.2f}  kit cues {len(kit):3d}  musket shots {len(sh):3d} in {len(groups)} ripples")
    parts.append((vo, mu, fx, vk))

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
tmp = TMPP + "_"
for i, nm in enumerate(("vo", "mu", "fx", "vk")): sf.write(f"{tmp}{nm}.wav", cat(i), SR, subtype="FLOAT")
D = sum(b - a for a, b, _ in SEGS) - XF * (len(SEGS) - 1)
# r14h (advisor): the compressors are keyed by the VOICE only (vk), the music bed 0.05 (was 0.08), no limiter before the loudness stage
f = ["[3:a]asplit=2[key][key2]", "[2:a][key2]sidechaincompress=threshold=0.03:ratio=2:attack=10:release=300[sfx]",
     "[1:a]volume=0.05[mus]", "[mus][key]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[musd]",
     "[0:a][musd][sfx]amix=inputs=3:normalize=0[aout]"]
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{tmp}vo.wav", "-i", f"{tmp}mu.wav", "-i", f"{tmp}fx.wav", "-i", f"{tmp}vk.wav", "-filter_complex", ";".join(f),
                "-map", "[aout]", "-c:a", "pcm_f32le", f"{tmp}mix.wav"], check=True)
# r14h (advisor): loudnorm fell back to dynamic gain around the loud shots; now a STATIC gain to -14 LUFS + one brick-wall limiter (-2.2 dBFS)
def ilufs(fn):
    r = subprocess.run(["ffmpeg", "-nostats", "-i", fn, "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
    return float(re.findall(r"I:\s+(-?[\d.]+) LUFS", r)[-1])
LIM = float(os.environ.get("LIMIT_DB", "-2.6")); g = -14.0 - ilufs(f"{tmp}mix.wav")   # r14h: limit -3.0 (AAC adds ~1 dB of true peak: -2.2 read -1.1 dBTP in the mp4)
for _ in range(3):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{tmp}mix.wav", "-af", f"volume={g:.2f}dB,alimiter=limit={db(LIM):.4f}:attack=1:release=60:level=false,aresample=48000",
                    "-c:a", "pcm_s16le", OUT], check=True)
    I = ilufs(OUT); print(f"  loudness pass: gain {g:+.2f} dB -> {I:.2f} LUFS"); 
    if abs(I + 14.0) <= 0.15: break
    g += -14.0 - I
if os.environ.get("DUMP_VK"):   # r14i: the pure voice stem (pre-gain) + the final gain, for measure_margins.py
    import shutil; shutil.copy(f"{tmp}vk.wav", os.environ["DUMP_VK"]); json.dump(dict(gain_db=g), open(os.environ["DUMP_VK"] + ".json", "w"))
for nm in ("vo", "mu", "fx", "vk", "mix"): os.remove(f"{tmp}{nm}.wav")

json.dump(dict(gain_db=round(GAIN, 2), segments=SEGS, volleys=log), open(OUT.rsplit(".", 1)[0] + "_log.json", "w"), indent=0, default=float)
print("wrote", OUT, round(D, 2), "s")
