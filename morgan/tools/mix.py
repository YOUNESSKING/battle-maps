"""Final mix in the LOCKED chain (STYLE_LOCK §3-5): build/picture.mp4 + voice + locked music bed + locked SFX -> build/morgan-1080p.mp4

usage (from morgan/): python3 tools/make_music_bed.py   (once: assets/media/music.wav, the locked Kevin MacLeod bed)
                      python3 tools/mix.py [--preview]
- Music: assets/media/music.wav at MUSIC_VOL 0.08, ducked under the voice (threshold 0.03, ratio 6, attack 20, release 400).
- SFX: the locked kit (assets/media/sfx/, levels in sfx_mix_lib.KINDS, checked by check_sound_lock.py) + Morgan's own
  musket / cavalry / cheer sounds (assets/audio/, 18th-century sounds the locked kit doesn't have); the SFX bus is ducked
  lightly under the voice (threshold 0.03, ratio 3, attack 10, release 300).
- Limiter 0.5, then two-pass loudnorm to -14 LUFS, true peak -1.5, LRA 11, AAC 192k.
"""
import json, os, subprocess, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
os.chdir(ROOT)
sys.path.insert(0, os.path.join(ROOT, "tools"))
import sfx_mix_lib

T = json.load(open("audio/timing.json"))
DUR = T["duration"]
P = {p["tag"].split("|")[0].replace("MAP:", "").strip(): p for p in T["paragraphs"] if p["tag"].startswith("MAP")}
A = "assets/audio"
MUSIC_VOL = 0.08  # locked (STYLE_LOCK §5); Morgan v1-v3 used its own tracks at -21 / -37 / -41 LUFS
LEGACY_DB = -3    # Morgan's own musket / cavalry / cheer sounds, trimmed a notch (owner, v3)


def at(key, phrase, off=0.0):
    """absolute time a phrase is spoken (same maths as B.at in lib/battle.js)."""
    p = P[key]; text = p["text"]; i = text.index(phrase); ss = p["sents"]
    k = 0
    while k + 1 < len(ss) and ss[k + 1][0] <= i:
        k += 1
    c0, c1 = ss[k][0], ss[k + 1][0] if k + 1 < len(ss) else len(text)
    return ss[k][1] + (ss[k][2] - ss[k][1]) * (i - c0) / max(1, c1 - c0) + off


S = lambda k: P[k]["start"]
# locked kit cues [t, kind, scene]: whoosh only on the 3 biggest camera moves, hit on title cards, real booms for cannon
KIT = [
    [0.4, "whoosh", "hook1"],                                   # opening push-in to the Carolinas
    [at("hook-1", "Charleston had fallen"), "impact", "hook1"],
    [at("hook-1", "Charleston had fallen", 0.5), "impact", "hook1"],
    [S("hook-2") - 0.3, "hit", "hook2"],                         # bio card slams in
    [S("hook-3") + 0.4, "whoosh", "hook2"],                      # zoom-out to the three battles
    [S("sar-1") + 0.2, "hit", "saratoga1"], [S("cow-1") + 0.2, "hit", "cowpens1"], [S("gui-1") + 0.2, "hit", "guilford1"],
    [at("cow-14", "a hundred and ten"), "hit", "cowpens3"],     # casualty card
    [at("gui-6", "fire grapeshot"), "impact", "guilford2"], [at("gui-6", "fire grapeshot", 0.4), "impact", "guilford2"],
    [at("gui-8", "he surrendered", -1.0), "impact", "guilford3"],
    [S("ending-1") + 0.3, "whoosh", "ending"],                  # final pull-out
]
LEGACY = [  # (file, time, volume)
    ("sfx_musket_single.wav", at("sar-5", "Firing from behind trees"), 0.5),
    ("sfx_musket_single.wav", at("sar-5", "Firing from behind trees", 1.3), 0.45),
    ("sfx_musket_single.wav", at("sar-5", "they shot down"), 0.5),
    ("sfx_musket_single.wav", at("sar-8", "on his third shot"), 0.6),
    ("sfx_musket_single.wav", at("cow-8", "opened fire"), 0.5),
    ("sfx_musket_single.wav", at("cow-8", "opened fire", 0.8), 0.45),
    ("sfx_musket_volley.wav", at("cow-8", "the militia fired"), 0.55),
    ("sfx_musket_volley.wav", at("cow-8", "fired again"), 0.55),
    ("sfx_cheer.wav", at("cow-9", "raised a cheer"), 0.35),
    ("sfx_cavalry.wav", at("cow-9", "straight into William"), 0.5),
    ("sfx_musket_volley.wav", at("cow-12", "fired a volley"), 0.7),
    ("sfx_cheer.wav", at("cow-12", "charged with the bayonet"), 0.4),
    ("sfx_cavalry.wav", at("cow-13", "Washington's cavalry swept"), 0.5),
    ("sfx_musket_volley.wav", at("gui-5", "fired at least once"), 0.5),
    ("sfx_cavalry.wav", at("gui-6", "Washington's cavalry smashed"), 0.45),
]
os.makedirs("build", exist_ok=True)
n = sfx_mix_lib.render(sorted(KIT), DUR, "build/sfx_kit.wav")  # runs check_sound_lock first
print("kit cues:", n)
inputs = ["-i", "audio/voice.wav", "-i", "build/sfx_kit.wav", "-i", "assets/media/music.wav"]
f = ["[0:a]aresample=48000,aformat=channel_layouts=stereo,asplit=3[vo][key][key2]",
     f"[2:a]aresample=48000,atrim=0:{DUR},volume={MUSIC_VOL},afade=t=in:d=2,afade=t=out:st={DUR - 3}:d=3[mus]",
     "[mus][key]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[musd]"]
legs = ["[1:a]aresample=48000,aformat=channel_layouts=stereo[kit]"]
lab = ["[kit]"]
for i, (file, t, vol) in enumerate(LEGACY):
    inputs += ["-i", f"{A}/{file}"]
    legs.append(f"[{3 + i}:a]aresample=48000,aformat=channel_layouts=stereo,volume={vol},volume={LEGACY_DB}dB,"
                f"adelay={int(t * 1000)}|{int(t * 1000)}[l{i}]")
    lab.append(f"[l{i}]")
f += legs
f.append(f"{''.join(lab)}amix=inputs={len(lab)}:normalize=0,atrim=0:{DUR}[sfxin]")
f.append("[sfxin][key2]sidechaincompress=threshold=0.03:ratio=3:attack=10:release=300[sfx]")
f.append("[vo][musd][sfx]amix=inputs=3:normalize=0,alimiter=limit=0.5:level=false[aout]")
subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(f), "-map", "[aout]", "-t", f"{DUR:.2f}",
                "-c:a", "pcm_s16le", "build/mix.wav"], check=True)
LN = "loudnorm=I=-14:TP=-1.5:LRA=11"
r = subprocess.run(["ffmpeg", "-nostats", "-i", "build/mix.wav", "-af", LN + ":print_format=json", "-f", "null", "-"],
                   capture_output=True, text=True).stderr
m = json.loads(r[r.rindex("{"):r.rindex("}") + 1])
af = (f"{LN}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
      f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,aresample=48000")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "build/picture.mp4", "-i", "build/mix.wav", "-af", af, "-map", "0:v", "-map", "1:a",
                "-t", f"{DUR:.2f}", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart",
                "build/morgan-1080p.mp4"], check=True)
if "--preview" in sys.argv:
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "build/morgan-1080p.mp4", "-vf", "scale=1280:720", "-c:v", "libx264",
                    "-crf", "30", "-preset", "medium", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart",
                    "build/morgan-720p-preview.mp4"], check=True)
print("ok", DUR)
