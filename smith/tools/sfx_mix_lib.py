"""Shared SFX renderer: cue list [[t, kind, scene], ...] -> stereo wav. Used by sfx_mix.py and make_clip.py."""
import glob, os, re
import numpy as np, soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__))
SR = 48000
D = os.path.join(HERE, "..", "assets", "media", "sfx")
KINDS = {  # kind: (clips, level dB, min gap between two cues of this kind in s)
    "fire":      (["gun_fire.wav"], -24, 0.35),
    "mortar":    (["mortar_thump.wav"], -24, 0.30),
    "impact":    (["candidates/cand3_hit.wav", "candidates/cand1_hit.wav"], -7, 0.25),  # real distant artillery (CC BY, see SFX_CREDITS)
    "explosion": (["candidates/cand2_hit.wav", "candidates/cand4_hit.wav"], -4, 0.20),  # real distant explosions (CC BY / CC0)
    "missile":   (["missile_launch_hit.wav"], -9, 0.80),
    "mg":        (["mg_burst.wav"], -18, 1.00),
    "whoosh":    (["whoosh.wav"], -15, 0.50),
    "hit":       (["hit.wav"], -8, 0.50),
    "static":    (["radio_static.wav"], -21, 3.00),
    "tick":      (["counter_tick.wav"], -20, 0.12),
    "jet":       (["jet_flyby.wav"], -11, 1.2),
    "prop":      (["prop_flyby.wav"], -13, 1.5),
    "heli":      (["heli_flyby.wav"], -14, 2.0),
}
# Owner rule 2026-09-29 (HANDOVER 1b "Sound library scope"): the library is only for the events above; everything else gets
# its own sourced sound (assets/media/sfx/new/<kind>_<n>.wav, credits in new/CREDITS_NEW.md), at library-like levels.
# New kinds are mixed ONLY once the owner approved them: list the kind names in assets/media/sfx/new/APPROVED.txt
# (or set SFX_TEST=1 for owner test clips). Extra variants of library kinds (new/impact_<n>.wav, new/explosion_<n>.wav)
# follow the same gate.
NEW_KINDS = {  # kind: (level dB, min gap s)
    "naval_gun": (-12, 0.6), "bugle": (-20, 4.0), "blizzard": (-26, 20.0), "truck": (-22, 6.0),
    "parachute": (-20, 0.4), "bulldozer": (-24, 6.0), "ship": (-24, 8.0),
}
# no identical repeats: every cue gets a small random pitch shift (semitones, +/-) and never the same clip twice in a row.
# Changes how library sounds play, so it is gated like a new sound: word "vary" in new/APPROVED.txt (or SFX_TEST=1).
VARY = {"impact": 1.5, "explosion": 1.5, "fire": 1.5, "mortar": 1.5, "mg": 1.0, "missile": 1.0, "jet": 1.0, "prop": 1.0,
        "heli": 1.0, "hit": 0.5, "whoosh": 1.0, "naval_gun": 1.5, "bugle": 0.7, "truck": 1.0, "parachute": 1.5,
        "bulldozer": 1.0, "ship": 0.7}


def _approved():
    appr = f"{D}/new/APPROVED.txt"
    return set(open(appr).read().split()) if os.path.exists(appr) else set()


def _on(name):
    return os.environ.get("SFX_TEST") == "1" or name in _approved()


def _kinds():
    kinds = {k: (list(v[0]), v[1], v[2]) for k, v in KINDS.items()}
    for f in sorted(glob.glob(f"{D}/new/*_[0-9]*.wav")):
        kind = re.sub(r"_\d+$", "", os.path.basename(f)[:-4])
        if not _on(kind):
            continue
        if kind in kinds:
            kinds[kind][0].append(os.path.relpath(f, D))
        elif kind in NEW_KINDS:
            prev = kinds.get(kind, ([], *NEW_KINDS[kind]))
            kinds[kind] = (prev[0] + [os.path.relpath(f, D)], prev[1], prev[2])
    return kinds


def _pitch(a, semis):
    if abs(semis) < 0.05:
        return a
    r = 2 ** (semis / 12)  # r > 1 = higher and shorter
    return np.interp(np.arange(0, len(a) - 1, r), np.arange(len(a)), a).astype("float32")


def render(cues, total, out):
    kinds = _kinds()
    clips = {}
    for kind, (files, _, _) in kinds.items():
        arr = []
        for f in files:
            a, sr = sf.read(f"{D}/{f}", dtype="float32", always_2d=True)
            assert sr == SR, f
            arr.append(a.mean(axis=1))
        clips[kind] = arr
    out_arr = np.zeros(int((total + 5) * SR), dtype="float32")
    rng = np.random.default_rng(7)
    vary = _on("vary")
    last, prev, count = {}, {}, 0
    for t, kind, _scene in cues:
        if kind not in kinds:
            continue
        _, db, gap = kinds[kind]
        if t - last.get(kind, -99) < gap:
            continue
        last[kind] = t
        n_c = len(clips[kind])
        if vary:
            k = int(rng.integers(n_c)) if n_c > 1 else 0
            if n_c > 1 and k == prev.get(kind):
                k = (k + 1 + int(rng.integers(n_c - 1))) % n_c
            prev[kind] = k
            clip = _pitch(clips[kind][k], rng.uniform(-1, 1) * VARY.get(kind, 0))
        else:  # locked behaviour: alternate the clips
            clip = clips[kind][(prev.get(kind, -1) + 1) % n_c]
            prev[kind] = (prev.get(kind, -1) + 1) % n_c
        gain = 10 ** ((db + rng.uniform(-2.0, 1.0)) / 20)
        i = int(t * SR)
        n = min(len(clip), len(out_arr) - i)
        out_arr[i:i + n] += clip[:n] * gain
        count += 1
    peak = np.abs(out_arr).max() or 1
    if peak > 0.89:
        out_arr *= 0.89 / peak
    sf.write(out, np.stack([out_arr, out_arr], axis=1)[: int(total * SR)], SR, subtype="PCM_16")
    return count
