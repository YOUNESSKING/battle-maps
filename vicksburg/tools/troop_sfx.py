"""Vicksburg troop sound design (TEST, not a change to the locked kit).

Reads vicksburg/sound/troop_events_S09.json / _S10.json (exported from the troops test: musket volleys with unit size, ripple vs single,
screen x, camera distance; skirmishers; cannon; marching; bridge stream; captures) and renders an SFX stem at the share-video time
(event.tShare), then mixes it under the film audio of the same windows and muxes it onto a test video.

  python3 vicksburg/tools/troop_sfx.py stem  OUT_STEM.wav [--kit]        # musket / feet / cheer stem (+ locked cannon kit with --kit)
  python3 vicksburg/tools/troop_sfx.py mix   BASE_AUDIO.wav OUT_MIX.wav  # base = film audio of the windows (S09 55-110 + S10 20-35, 70 s)
  python3 vicksburg/tools/troop_sfx.py mux   VIDEO.mp4 MIX.wav OUT.mp4

Sources (sound/SOURCES.md): Epidemic Sound "Guns, Antique, Rifle, Pattern-Enfield, 1853" at 5/10/20/30/60 m (35 single shots, sound/shots/),
"Objects, Bag, Backpack, Soldier, Movement, Marching", "Crowds, Loop Group, Army Charging Into Battle". Cannon = the LOCKED goosegreen kit.
Rules: every sound is tied to a visible event (event list = the renderer's own smoke/flash times), no synthesized whooshes/booms."""
import json, os, subprocess, sys
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, fftconvolve, resample_poly

REPO = "/home/user/battle-maps"; V = f"{REPO}/vicksburg"; SD = f"{V}/sound"; SH = os.environ.get("TROOP_SHOTS", f"{SD}/shots"); GG = f"{REPO}/goosegreen/assets/media/sfx"   # TROOP_SHOTS = another shot set (e.g. ajackson/sound/shots_flint)
SR = 48000; SEED = 1863
db = lambda x: 10 ** (x / 20)
BUCKET_M = {"enf05": 0, "enf10": 1, "enf20": 2, "enf30a": 3, "enf30b": 3, "enf60a": 4, "enf60b": 4}   # recording distance class 5/10/20/30/60 m


def load_ff(path, af=None, start=0.0, dur=None):
    cmd = ["ffmpeg", "-v", "error"] + (["-ss", str(start)] if start else []) + ["-i", path] + (["-t", str(dur)] if dur else []) + (["-af", af] if af else []) + ["-ac", "2", "-ar", str(SR), "-f", "f32le", "-"]
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32).reshape(-1, 2).copy()


def lowpass(x, fc):
    return sosfilt(butter(2, min(fc, SR * .45), "lp", fs=SR, output="sos"), x, axis=0) if fc < 20000 else x


def pan_stereo(mono, p):
    """equal-power pan, p in [-1, 1]"""
    a = (np.clip(p, -1, 1) + 1) * np.pi / 4
    return np.stack([mono * np.cos(a), mono * np.sin(a)], 1)


def make_ir(rng, secs, wet_hf):
    n = int(secs * SR); t = np.arange(n) / SR
    ir = rng.standard_normal((n, 2)) * np.exp(-t / (secs / 5.5))[:, None]
    ir = lowpass(ir, wet_hf); ir[:int(.012 * SR)] *= np.linspace(0, 1, int(.012 * SR))[:, None]
    return ir / np.sqrt((ir ** 2).sum(0).max())


class Lib:
    def __init__(self, rng):
        self.rng = rng; self.shots = []
        for f in sorted(os.listdir(SH)):
            if not f.startswith("enf"): continue
            x, _ = sf.read(f"{SH}/{f}", dtype="float32"); tag = f.split("_")[0]; pk = np.abs(x).max()
            att = int(np.argmax(np.abs(x).max(1) > .25 * pk))          # attack = first sample above 25 % of the peak -> aligned to the visible flash
            self.shots.append(dict(name=f[:-5], b=BUCKET_M[tag], x=x, att=att))
        self.cheer = sf.read(f"{SH}/cheer_charge.flac", dtype="float32")[0]; self.march = sf.read(f"{SH}/march_loop.flac", dtype="float32")[0]
        self.hist = []   # (time, shot name, pitch class) of everything placed, to avoid an identical sample within 2 s
        self.irs = {k: make_ir(rng, s, hf) for k, (s, hf) in {"near": (.5, 7000), "mid": (.9, 5000), "far": (1.5, 3500)}.items()}

    def pick(self, t, target_b):
        cand = []
        for s in self.shots:
            recent = any(h[1] == s["name"] and abs(t - h[0]) < 2.0 for h in self.hist)
            cand.append((abs(s["b"] - target_b) + self.rng.random() * .9 + (6 if recent else 0), s))
        sc, s = min(cand, key=lambda z: z[0])
        return s, sc >= 6

    def shot(self, t, d, gain_db, pan, lp, pitch=None):
        """one dry musket shot -> (stereo array, attack offset in samples). d = 0 (close) .. 1 (far)"""
        s, reused = self.pick(t, d * 4 + self.rng.normal(0, .55))
        prev = [h[2] for h in self.hist if h[1] == s["name"] and abs(t - h[0]) < 2.0]
        j = pitch if pitch is not None else self.rng.uniform(-.045, .045)
        for _ in range(40):   # a recording heard again inside 2 s must differ in pitch by >= 3.5 % (pool of 35 shots is smaller than two back-to-back volleys)
            if all(abs(j - q) >= .035 for q in prev): break
            j = self.rng.uniform(-.1, .1)
        up, dn = 1000, int(round(1000 * (1 + j))); x = resample_poly(s["x"], up, dn, axis=0).astype(np.float32); att = int(s["att"] * up / dn)
        mono = x.mean(1); side = (x[:, 0] - x[:, 1]) * .5
        y = pan_stereo(mono, pan) + np.stack([side, -side], 1) * .35
        y = lowpass(y, lp) * db(gain_db)
        self.hist.append((t, s["name"], round(j, 3)))
        return y.astype(np.float32), att, s["name"], j


def put(out, y, t, att=0):
    i = int(round(t * SR)) - att; a = max(0, -i); i = max(i, 0); n = min(len(y) - a, len(out) - i)
    if n > 0: out[i:i + n] += y[a:a + n]


def dnorm(cd, near=12.0, far=48.0):
    return float(np.clip((cd - near) / (far - near), 0, 1))


def pan_of(at):
    if at.get("nx") is not None: return (at["nx"] - .5) * 1.7
    px = at.get("px")
    return float(np.clip((px[0] / 1920 - .5) * 1.7, -1, 1)) if px else 0.0


def on_screen(at):
    if at.get("onScreen") is True: return True
    px = at.get("px")
    return bool(px and 0 <= px[0] <= 1920 and 0 <= px[1] <= 1080)


def render_volley(L, out, e, rng, log):
    men = e["unit"].get("men", 144); K = int(np.clip(round(men / 9), 3, 16)); d = dnorm(e["at"].get("camDist", 30))
    R = e.get("rippleSeconds", .9) if e.get("style", "ripple") == "ripple" else .12
    R = float(np.clip(R * rng.uniform(.8, 1.25) * (.6 + .4 * min(men, 144) / 144), .3, 1.2)) if R > .2 else R
    t0 = e["tShare"]
    # a ripple: one flank goes first, the rest follow raggedly with a few late stragglers (never an even comb)
    u = np.sort(np.clip((np.arange(K) + rng.uniform(-.95, .95, K)) / max(K - 1, 1), 0, 1) ** rng.uniform(.8, 1.35))
    u[0] = 0.0   # the flank that gets the order fires on the event time itself
    p0, p1 = pan_of(e.get("from", e["at"])), pan_of(e.get("to", e["at"]))
    SH = e.get("shots")   # engine v8: the exact visible muzzle-flash times (first = the event time): one shot sound per flash (<= 20)
    if SH:
        SH = sorted(SH, key=lambda q: q["tShare"]); SH = [SH[i] for i in sorted(set(np.linspace(0, len(SH) - 1, min(len(SH), 20)).round().astype(int)))]
        K = len(SH); R = max(SH[-1]["tShare"] - t0, .12); u = np.array([(q["tShare"] - t0) / R for q in SH])
        p0 = p1 = None
    dry = np.zeros((int((R + 3.0) * SR), 2), np.float32); times = []
    lp = 11000 - 8300 * d
    for k in range(K):
        tk = u[k] * R
        pk = np.clip((pan_of(SH[k]["at"]) if SH else p0 + (p1 - p0) * u[k]) + rng.normal(0, .04), -1, 1)
        y, att, nm, j = L.shot(t0 + tk, d, rng.uniform(-3.5, 1.5), pk, lp * rng.uniform(.9, 1.1))
        put(dry, y, tk + .05, att); times.append(round(t0 + tk, 3))
    pk0 = np.abs(dry).max()
    target = -9 - 6 * d + 3 * np.log2(K / 16)
    dry *= db(target) / pk0
    wet = fftconvolve(dry, L.irs["near" if d < .33 else "mid" if d < .66 else "far"][:, :1] * np.ones((1, 2)), axes=0)[:len(dry)] * (.05 + .16 * d)
    put(out, dry + wet, t0 - .05, 0)
    log.append(dict(type="musket_volley", t=t0, K=K, ripple=round(R, 2), d=round(d, 2), shot_times=times, onset=round(min(times), 3), peak_db=round(target, 1)))


def render_skirmish(L, out, e, rng, log):
    if not on_screen(e["at"]): log.append(dict(type="independent_fire", t=e["tShare"], skipped="off screen")); return
    d = dnorm(e["at"].get("camDist", 25)); dur = e.get("duration", 1.5); n = max(2, int(round(dur * max(e.get("ratePerSec", 0), .6) * 1.5 + 1)))
    ts = np.sort(e["tShare"] + rng.uniform(.05, max(dur - .1, .2), n)); times = []
    if e.get("shots"): ts = np.array(sorted(q["tShare"] for q in e["shots"]))[:max(n, 2) * 2]; n = len(ts)   # engine v8: on the visible flashes
    for t in ts:
        y, att, nm, j = L.shot(t, d, 0, pan_of(e["at"]) + rng.normal(0, .05), (11000 - 8300 * d) * rng.uniform(.85, 1.1))
        y *= db(-22 - 6 * d + rng.uniform(-2.5, 1.5)) / max(np.abs(y).max(), 1e-6)
        wet = fftconvolve(y, L.irs["mid"][:, :1] * np.ones((1, 2)), axes=0)[:len(y)] * .12
        put(out, y + wet, t, att); times.append(round(float(t), 3))
    log.append(dict(type="independent_fire", t=e["tShare"], n=n, d=round(d, 2), shot_times=times, onset=times[0]))


def gated_loop(L, out, src, t0, t1, gain_db, pan, lp, rng, fade=.5, hp=None):
    n = int((t1 - t0) * SR)
    if n <= 0: return
    off = int(rng.uniform(0, max(1, len(src) - 1)))
    x = np.concatenate([src, src, src])[off:off + n].mean(1) if len(src) > 1 else src
    x = lowpass(x[:, None], lp)[:, 0]
    if hp: x = sosfilt(butter(2, hp, "hp", fs=SR, output="sos"), x)
    f = min(int(fade * SR), n // 2); env = np.ones(n); env[:f] = np.linspace(0, 1, f); env[n - f:] = np.linspace(1, 0, f)
    put(out, pan_stereo(x * env, pan) * db(gain_db), t0)


def render_stem(events_files, kit=False):
    rng = np.random.default_rng(SEED); L = Lib(rng); D = 0
    scenes = []
    for f in events_files:
        d = json.load(open(f)); scenes.append(d); D = max(D, d["shareOffset"] + d["window"][1] - d["window"][0])
    out = np.zeros((int((D + 1) * SR), 2), np.float32); log = []
    allev = sorted([(e, d) for d in scenes for e in d["events"]], key=lambda z: z[0]["tShare"])
    stops = {}   # (scene, unit) -> list of stop times, to close each march
    for e, d in allev:
        if e["type"] == "march_stop": stops.setdefault((d["scene"], e["unit"]["unit"]), []).append(e["tShare"] + e.get("duration", 0) * 0)
    cap_n = 0
    for e, d in allev:
        ty = e["type"]
        if ty == "musket_volley": render_volley(L, out, e, rng, log)
        elif ty == "independent_fire": render_skirmish(L, out, e, rng, log)
        elif ty == "march_start" and on_screen(e["at"]):
            nxt = [s for s in stops.get((d["scene"], e["unit"]["unit"]), []) if s > e["tShare"] + .2]
            t1 = min(nxt) if nxt else e["tShare"] + 2.5; t1 = min(t1, e["tShare"] + 6)
            dd = dnorm(e["at"].get("camDist", 30)); men = e["unit"].get("men", 144)
            gated_loop(L, out, L.march, e["tShare"], t1, -34 - 9 * dd + 2 * np.log2(max(men, 8) / 144), pan_of(e["at"]), 2600 - 1200 * dd, rng, fade=.6)
            log.append(dict(type="march", t=e["tShare"], until=round(t1, 2), unit=e["unit"]["unit"]))
        elif ty == "bridge_stream_first_on_deck":
            last = next((x for x, _ in allev if x["type"] == "bridge_stream_last_off_deck" and x["unit"]["unit"] == e["unit"]["unit"] and x["unit"].get("block") == e["unit"].get("block") and x["tShare"] > e["tShare"]), None)
            t1 = last["tShare"] if last else e["tShare"] + 2.2
            gated_loop(L, out, L.march, e["tShare"], t1, -28, pan_of(e["at"]), 4200, rng, fade=.2, hp=250)   # footsteps on the planks
            log.append(dict(type="bridge_stream", t=e["tShare"], until=round(t1, 2)))
        elif ty in ("capture", "retaken") and on_screen(e["at"]):
            cap_n += 1; dd = dnorm(e["at"].get("camDist", 30)); off = rng.uniform(0, 3.5)
            c = L.cheer[int(off * SR):int((off + 2.6) * SR)].mean(1); f = int(.4 * SR)
            c = c.copy(); c[:f] *= np.linspace(0, 1, f); c[-f:] *= np.linspace(1, 0, f)
            put(out, pan_stereo(lowpass(c[:, None], 2300)[:, 0], pan_of(e["at"])) * db(-31 - 5 * dd), e["tShare"])
            log.append(dict(type=ty, t=e["tShare"]))
    if kit:   # the LOCKED kit sample + level, exactly as vicksburg/tools/assemble.py (gun -15 dB at the shot, boom -19 dB at the impact)
        gun = load_ff(f"{GG}/candidates/cand1_hit.wav"); boom = load_ff(f"{GG}/candidates/cand2_hit.wav"); last = -9
        for e, d in allev:
            if e["type"] != "cannon_shot" or e["tShare"] - last < .35: continue
            last = e["tShare"]; put(out, gun * db(-15), e["tShare"])
            if e.get("impact"): put(out, boom * db(-19), e["impact"]["tShare"])
            log.append(dict(type="cannon_shot", t=e["tShare"], onset=e["tShare"]))
    return out[:int(D * SR)], log, L


def voice_env(D, gap=.3):
    """voice activity from the narration word times (film time -> share time via the two windows); smoothed duck envelope 0..1"""
    wd = json.load(open(f"{V}/audio/voice_words.json")); n = int(D * SR); env = np.zeros(n)
    wins = [(728.252, 0.0, 55.0), (871.788, 55.0, 15.0)]
    for sec in wd:
        for w, a, b in sec["words"]:
            for fs, so, ln in wins:
                if fs <= a < fs + ln:
                    i, j = int((a - fs + so) * SR), int((min(b + gap * .5, fs + ln) - fs + so) * SR); env[i:j] = 1
    k = int(.18 * SR); env = np.convolve(env, np.hanning(k) / np.hanning(k).sum(), "same")
    return np.clip(env * 1.15, 0, 1)


OLD_VOLLEY_GAIN = .15   # fitted on the 19 old volley cues in the film audio: LS gain of the old clip inside the loudnormed mix = .12-.19 (median .15)


def remove_old_volleys(base):
    vol = load_ff(f"{REPO}/greene/assets/media/sfx_musket_volley.mp3", af="lowpass=f=2600,aecho=0.8:0.6:60:0.25")
    out = base.copy(); last = -9
    for scene, off, a0, a1, fs in (("S09_gm", 0.0, 55, 110, 728.252), ("S10_gm", 55.0, 20, 35, 871.788)):
        cu = sorted(json.load(open(f"{V}/scenes/{scene}/cues.json"))["CUES"], key=lambda c: c[1]); last = -9
        for k, t in cu:
            if k != "volley" or not (a0 <= t < a1) or t - last < .35: continue
            last = t; i = int((t - a0 + off) * SR); n = min(len(vol), len(out) - i)
            if n > 0: out[i:i + n] -= vol[:n] * OLD_VOLLEY_GAIN
    return out


def do_mix(base_path, out_path, stem_path):
    base, _ = sf.read(base_path, dtype="float32"); stem, _ = sf.read(stem_path, dtype="float32"); n = min(len(base), len(stem))
    base = remove_old_volleys(base[:n]); stem = stem[:n]; D = n / SR
    env = voice_env(D)
    duck = (1 - .5 * env)[:, None]   # SFX under the voice: -6 dB while a word is spoken
    mix = base + stem * duck
    # -14 LUFS integrated, TP -1.5 (same chain as assemble.py)
    sf.write(out_path + ".pre.wav", mix, SR, subtype="FLOAT"); LN = "loudnorm=I=-14:TP=-1.5:LRA=11"
    r = subprocess.run(["ffmpeg", "-nostats", "-i", out_path + ".pre.wav", "-af", LN + ":print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
    m = json.loads(r[r.rindex("{"):r.rindex("}") + 1])
    af = f"{LN}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,aresample=48000"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", out_path + ".pre.wav", "-af", af, "-c:a", "pcm_s16le", out_path], check=True); os.remove(out_path + ".pre.wav")
    print("mix", out_path, "pre-norm", m["input_i"], "LUFS ->", "-14 LUFS")


if __name__ == "__main__":
    cmd = sys.argv[1]
    if cmd == "stem":
        evf = [f"{SD}/troop_events_S09.json", f"{SD}/troop_events_S10.json"]
        out, log, L = render_stem(evf, kit="--kit" in sys.argv)
        sf.write(sys.argv[2], out, SR, subtype="FLOAT"); json.dump(log, open(sys.argv[2].rsplit(".", 1)[0] + "_log.json", "w"), indent=1)
        json.dump(dict(used=L.hist), open(sys.argv[2].rsplit(".", 1)[0] + "_hist.json", "w"))
        print("stem", sys.argv[2], f"{len(out) / SR:.1f}s", "events", len(log), "peak dBFS", round(20 * np.log10(np.abs(out).max()), 1))
    elif cmd == "mix": do_mix(sys.argv[2], sys.argv[3], sys.argv[4])
    elif cmd == "mux":
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", sys.argv[2], "-i", sys.argv[3], "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", sys.argv[4]], check=True)
