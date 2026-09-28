#!/usr/bin/env python3
"""
Synthesize UI/utility sound effects for the 'smith' video (Korean War: Inchon /
Chosin Reservoir / Marine breakout) that were not found under a usable licence.

Generates, at 48 kHz stereo, peak-normalized to about -1 dBFS:
  whoosh_1, whoosh_2   - filtered noise swell, ~1.2 s
  thud_1, thud_2, thud_3 - low wooden thump for units dropping on the map
  drum_hit             - single deep orchestral/taiko hit with long tail
  soft_hit             - soft low hit for method-card lines
  war_drums            - ~25 s slow ominous drum loop, ~70 bpm
  parachute             - canopy opening + flutter (no clean CC0/PD source found)

Uses numpy + scipy only. Run:
    python3 synth_sfx.py [outdir]
"""
import os
import sys
import numpy as np
from scipy import signal as sig
from scipy.io import wavfile

SR = 48000


def peak_normalize(x, target_dbfs=-1.0):
    peak = np.max(np.abs(x)) + 1e-12
    target = 10 ** (target_dbfs / 20.0)
    return x * (target / peak)


def to_stereo(x):
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    return x


def write_wav(path, x, sr=SR):
    x = to_stereo(x)
    x = np.clip(x, -1.0, 1.0)
    x16 = (x * 32767.0).astype(np.int16)
    wavfile.write(path, sr, x16)
    print("wrote", path, f"{x.shape[0]/sr:.2f}s")


def fade(x, sr, fade_in=0.005, fade_out=0.05):
    n = len(x)
    n_in = min(int(sr * fade_in), n)
    n_out = min(int(sr * fade_out), n)
    if n_in > 0:
        x[:n_in] *= np.linspace(0, 1, n_in)
    if n_out > 0:
        x[-n_out:] *= np.linspace(1, 0, n_out)
    return x


def simple_reverb(x, sr, decay=0.35, room_ms=90, mix=0.25):
    """Cheap comb/allpass style room reverb: a handful of decaying echoes."""
    out = x.copy()
    delays_ms = [room_ms * m for m in (1.0, 1.37, 1.81, 2.35, 3.02)]
    for i, dms in enumerate(delays_ms):
        d = int(sr * dms / 1000.0)
        if d >= len(x):
            continue
        g = decay ** (i + 1)
        echo = np.zeros_like(x)
        echo[d:] = x[:-d] * g
        out += echo * mix
    return out


def lowpass(x, sr, cutoff, order=4):
    b, a = sig.butter(order, cutoff / (sr / 2), btype="low")
    return sig.lfilter(b, a, x)


def highpass(x, sr, cutoff, order=4):
    b, a = sig.butter(order, cutoff / (sr / 2), btype="high")
    return sig.lfilter(b, a, x)


def bandpass(x, sr, low, high, order=4):
    b, a = sig.butter(order, [low / (sr / 2), high / (sr / 2)], btype="band")
    return sig.lfilter(b, a, x)


def white_noise(n):
    return np.random.default_rng().standard_normal(n)


# ---------------------------------------------------------------------------

def gen_whoosh(sr=SR, dur=1.2, seed=0, sweep_lo=200, sweep_hi=4000):
    rng = np.random.default_rng(seed)
    n = int(sr * dur)
    t = np.linspace(0, dur, n, endpoint=False)
    noise = rng.standard_normal(n)
    # sweeping bandpass center frequency (rises then falls)
    env_shape = np.sin(np.pi * t / dur)  # 0 -> 1 -> 0
    center = sweep_lo + (sweep_hi - sweep_lo) * env_shape
    # implement time-varying bandpass by chunked filtering
    out = np.zeros(n)
    chunk = 512
    for i in range(0, n, chunk):
        j = min(i + chunk, n)
        c = np.mean(center[i:j])
        lo = max(40, c * 0.6)
        hi = min(sr / 2 - 100, c * 1.6)
        out[i:j] = bandpass(noise[i:j], sr, lo, hi, order=2)
    amp_env = env_shape ** 1.5
    out = out * amp_env
    out = peak_normalize(out, -1.0)
    out = fade(out, sr, 0.01, 0.08)
    return out


def gen_thud(sr=SR, dur=0.35, seed=0, base_freq=70, wood=True):
    rng = np.random.default_rng(seed)
    n = int(sr * dur)
    t = np.arange(n) / sr
    body = np.sin(2 * np.pi * base_freq * t) * np.exp(-t * 18)
    body += 0.5 * np.sin(2 * np.pi * base_freq * 1.5 * t) * np.exp(-t * 25)
    click = rng.standard_normal(int(sr * 0.01))
    click = highpass(click, sr, 800) if wood else lowpass(click, sr, 2000)
    click *= np.exp(-np.arange(len(click)) / (sr * 0.003))
    out = np.zeros(n)
    out[: len(click)] += click * 0.6
    out += body
    out = simple_reverb(out, sr, decay=0.3, room_ms=40, mix=0.15)
    out = peak_normalize(out, -1.0)
    out = fade(out, sr, 0.001, 0.15)
    return out


def gen_drum_hit(sr=SR, dur=3.0, seed=1):
    rng = np.random.default_rng(seed)
    n = int(sr * dur)
    t = np.arange(n) / sr
    fundamental = 60
    body = np.zeros(n)
    for h, amp, decay in [(1, 1.0, 2.2), (1.5, 0.35, 3.5), (2.0, 0.2, 4.5), (2.7, 0.12, 5.5)]:
        body += amp * np.sin(2 * np.pi * fundamental * h * t) * np.exp(-t * decay)
    # pitch drop for taiko-like punch
    pitch_env = 1.0 + 0.5 * np.exp(-t * 30)
    body_punch = np.sin(2 * np.pi * fundamental * pitch_env * t) * np.exp(-t * 3.0)
    strike = rng.standard_normal(int(sr * 0.02))
    strike = lowpass(strike, sr, 3000)
    strike *= np.exp(-np.arange(len(strike)) / (sr * 0.004))
    out = np.zeros(n)
    out[: len(strike)] += strike * 0.8
    out += body * 0.7 + body_punch * 0.6
    out = simple_reverb(out, sr, decay=0.45, room_ms=140, mix=0.35)
    out = peak_normalize(out, -1.0)
    out = fade(out, sr, 0.001, 1.5)
    return out


def gen_soft_hit(sr=SR, dur=0.6, seed=2):
    rng = np.random.default_rng(seed)
    n = int(sr * dur)
    t = np.arange(n) / sr
    body = np.sin(2 * np.pi * 90 * t) * np.exp(-t * 9)
    body += 0.3 * np.sin(2 * np.pi * 135 * t) * np.exp(-t * 12)
    breath = rng.standard_normal(n)
    breath = lowpass(breath, sr, 500)
    breath *= np.exp(-t * 20) * 0.15
    out = body + breath
    out = simple_reverb(out, sr, decay=0.25, room_ms=60, mix=0.15)
    out = peak_normalize(out, -1.0)
    out = fade(out, sr, 0.002, 0.3)
    return out


def gen_war_drums(sr=SR, dur=26.0, bpm=70, seed=3):
    rng = np.random.default_rng(seed)
    n = int(sr * dur)
    out = np.zeros(n)
    beat_period = 60.0 / bpm
    # pattern: slow ominous - hit on beats 1 and 3 of a 4-beat bar, with a soft
    # ghost note before beat 1 every other bar
    beat_times = np.arange(0, dur, beat_period)
    bar = 0
    for i, bt in enumerate(beat_times):
        beat_in_bar = i % 4
        is_hit = beat_in_bar in (0, 2)
        if not is_hit:
            continue
        strength = 1.0 if beat_in_bar == 0 else 0.75
        hit = gen_drum_hit(sr=sr, dur=min(2.5, dur - bt + 0.1), seed=seed * 1000 + i) * strength
        start = int(bt * sr)
        end = min(n, start + len(hit))
        out[start:end] += hit[: end - start]
        # soft ghost note leading into strong beats every other bar
        if beat_in_bar == 0 and (i // 4) % 2 == 1:
            ghost_t = bt - beat_period * 0.5
            if ghost_t > 0:
                ghost = gen_soft_hit(sr=sr, dur=0.5, seed=seed * 2000 + i) * 0.35
                gs = int(ghost_t * sr)
                ge = min(n, gs + len(ghost))
                out[gs:ge] += ghost[: ge - gs]
    # distant low drone under the drums for ominous atmosphere
    t = np.arange(n) / sr
    drone = 0.06 * np.sin(2 * np.pi * 55 * t) + 0.04 * np.sin(2 * np.pi * 41 * t)
    lfo = 0.5 + 0.5 * np.sin(2 * np.pi * 0.05 * t)
    drone *= (0.6 + 0.4 * lfo)
    out += drone
    out = simple_reverb(out, sr, decay=0.4, room_ms=160, mix=0.25)
    out = peak_normalize(out, -1.0)
    out = fade(out, sr, 0.05, 1.5)
    return out


def gen_parachute(sr=SR, dur=3.0, seed=4):
    """Canopy opens with a snap + rush of air, then settles into a soft flutter."""
    rng = np.random.default_rng(seed)
    n = int(sr * dur)
    t = np.arange(n) / sr
    out = np.zeros(n)

    # 0.0-0.15s: fabric snap (short burst of high-passed noise)
    snap_n = int(sr * 0.15)
    snap = rng.standard_normal(snap_n)
    snap = bandpass(snap, sr, 800, 6000, order=3)
    snap *= np.exp(-np.arange(snap_n) / (sr * 0.03))
    out[:snap_n] += snap * 0.9

    # 0.1-1.0s: rush of air opening (noise swell, band sweeping down)
    rush_start = int(sr * 0.08)
    rush_n = int(sr * 1.0)
    rush = rng.standard_normal(rush_n)
    chunk = 512
    rush_out = np.zeros(rush_n)
    for i in range(0, rush_n, chunk):
        j = min(i + chunk, rush_n)
        frac = i / rush_n
        c = 3000 - 2000 * frac
        rush_out[i:j] = bandpass(rush[i:j], sr, max(200, c * 0.5), min(sr / 2 - 100, c * 1.4), order=2)
    env = np.sin(np.pi * np.linspace(0, 1, rush_n) ** 0.6 * 0.9)
    rush_out *= env
    end = min(n, rush_start + rush_n)
    out[rush_start:end] += rush_out[: end - rush_start] * 0.7

    # 0.8s onward: soft irregular canopy flutter (amplitude-modulated filtered noise)
    flutter_start = int(sr * 0.7)
    flutter_n = n - flutter_start
    flutter = rng.standard_normal(flutter_n)
    flutter = bandpass(flutter, sr, 300, 2500, order=2)
    mod = 0.5 + 0.5 * np.sin(2 * np.pi * rng.uniform(1.5, 2.5) * np.arange(flutter_n) / sr)
    mod2 = 0.7 + 0.3 * np.sin(2 * np.pi * rng.uniform(0.3, 0.7) * np.arange(flutter_n) / sr)
    flutter *= mod * mod2
    fade_in = np.linspace(0, 1, int(sr * 0.2))
    flutter[: len(fade_in)] *= fade_in
    fade_out = np.linspace(1, 0, int(sr * 0.3))
    flutter[-len(fade_out):] *= fade_out
    out[flutter_start:] += flutter * 0.35

    out = simple_reverb(out, sr, decay=0.3, room_ms=100, mix=0.2)
    out = peak_normalize(out, -1.0)
    out = fade(out, sr, 0.001, 0.3)
    return out


def main():
    outdir = sys.argv[1] if len(sys.argv) > 1 else "."
    os.makedirs(outdir, exist_ok=True)

    write_wav(os.path.join(outdir, "whoosh_1.wav"), gen_whoosh(seed=10, dur=1.2))
    write_wav(os.path.join(outdir, "whoosh_2.wav"), gen_whoosh(seed=20, dur=1.1, sweep_lo=300, sweep_hi=5000))

    write_wav(os.path.join(outdir, "thud_1.wav"), gen_thud(seed=30, base_freq=65))
    write_wav(os.path.join(outdir, "thud_2.wav"), gen_thud(seed=31, base_freq=80))
    write_wav(os.path.join(outdir, "thud_3.wav"), gen_thud(seed=32, base_freq=55, dur=0.4))

    write_wav(os.path.join(outdir, "drum_hit.wav"), gen_drum_hit(seed=40))
    write_wav(os.path.join(outdir, "soft_hit.wav"), gen_soft_hit(seed=41))
    write_wav(os.path.join(outdir, "war_drums.wav"), gen_war_drums(seed=42, dur=26.0, bpm=70))
    write_wav(os.path.join(outdir, "parachute.wav"), gen_parachute(seed=43))


if __name__ == "__main__":
    main()
