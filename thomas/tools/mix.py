"""Final mix: build/picture.mp4 + voice + music bed (ducked under the voice) + SFX cues -> build/thomas-1080p.mp4 (+ 720p preview with --preview).

usage (from thomas/): python3 tools/mix.py
Music: Kevin MacLeod (incompetech.com), CC BY — see assets/audio/CREDITS.md for the description lines.
"""
import json, os, subprocess, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
os.chdir(ROOT)
T = json.load(open("audio/timing.json"))
DUR = T["duration"]
P = {p["tag"].split("|")[0].replace("MAP:", "").strip(): p for p in T["paragraphs"] if p["tag"].startswith("MAP")}
A = "assets/audio"
# Music bed level in LUFS, before the final -14 LUFS normalisation. The narration is about -24 LUFS, so -37 keeps the music
# ~17 dB under the voice, and the sidechain ducks it a few dB more while he speaks. (v1 used -21: music as loud as the voice.)
MUSIC_LUFS = -41  # v2 used -37; owner asked for a bit lower
SFX_DB = -3       # global sound-effect trim on top of each cue's volume (owner: 'a notch lower')


def at(key, phrase, off=0.0):
    """absolute time a phrase is spoken (same maths as B.at in lib/battle.js)."""
    p = P[key]; text = p["text"]; i = text.index(phrase); ss = p["sents"]
    k = 0
    while k + 1 < len(ss) and ss[k + 1][0] <= i:
        k += 1
    c0, c1 = ss[k][0], ss[k + 1][0] if k + 1 < len(ss) else len(text)
    return ss[k][1] + (ss[k][2] - ss[k][1]) * (i - c0) / max(1, c1 - c0) + off


S = lambda k: P[k]["start"]
END0 = next(p["start"] for p in T["paragraphs"] if p["section"].startswith("ENDING"))
# (file, start, end, offset in track)
MUSIC = [
    ("music_01_heavy_heart.mp3", 0, S("chick-1"), 0),
    ("music_02_clash_defiant.mp3", S("chick-1"), S("chick-5"), 0),
    ("music_03_ready_aim_fire.mp3", S("chick-5"), S("chick-10"), 0),
    ("music_06_undaunted.mp3", S("chick-10"), S("ridge-1"), 0),
    ("music_01_heavy_heart.mp3", S("ridge-1"), S("ridge-4"), 120),
    ("music_05_crusade.mp3", S("ridge-4"), S("ridge-9"), 0),
    ("music_06_undaunted.mp3", S("ridge-9"), S("nash-1"), 70),
    ("music_02_clash_defiant.mp3", S("nash-1"), S("nash-6"), 150),
    ("music_03_ready_aim_fire.mp3", S("nash-6"), S("nash-10"), 60),
    ("music_06_undaunted.mp3", S("nash-10"), END0, 0),
    ("music_01_heavy_heart.mp3", END0, DUR + 1, 225),
]
SFX = [  # (file, time, volume)
    ("sfx_musket_volley.wav", at("hook-1", "come charging out"), 0.5),
    ("sfx_cannon.wav", at("hook-1", "come charging out", 1.2), 0.4),
    ("sfx_whoosh.wav", S("hook-2") - 0.4, 0.7),
    ("sfx_thud.wav", S("hook-3") + 0.9, 0.8),
    ("sfx_drum_roll.wav", S("chick-1") - 0.3, 0.6), ("sfx_whoosh.wav", S("chick-1") + 0.2, 0.6),
    ("sfx_musket_volley.wav", at("chick-3", "Bragg struck"), 0.45),
    ("sfx_cannon.wav", at("chick-5", "Longstreet's column hit it"), 0.55),
    ("sfx_musket_volley.wav", at("chick-5", "Longstreet's column hit it", 0.8), 0.5),
    ("sfx_cheer.wav", at("chick-6", "His men poured through"), 0.35),
    ("sfx_musket_volley.wav", at("chick-9", "wave after wave"), 0.5),
    ("sfx_musket_volley.wav", at("chick-9", "thrown back"), 0.5),
    ("sfx_cannon.wav", at("chick-9", "thrown back", 1.0), 0.35),
    ("sfx_drum_roll.wav", S("ridge-1") - 0.3, 0.6), ("sfx_whoosh.wav", S("ridge-1") + 0.2, 0.6),
    ("sfx_cannon.wav", at("ridge-4", "six signal guns"), 0.5),
    ("sfx_cannon.wav", at("ridge-4", "six signal guns", 0.7), 0.45),
    ("sfx_cannon.wav", at("ridge-4", "six signal guns", 1.4), 0.45),
    ("sfx_musket_volley.wav", at("ridge-5", "fired a volley"), 0.5),
    ("sfx_cannon.wav", at("ridge-5", "pouring fire"), 0.5),
    ("sfx_cheer.wav", at("ridge-8", "blue flags appeared"), 0.4),
    ("sfx_drum_roll.wav", S("nash-1") - 0.3, 0.6), ("sfx_whoosh.wav", S("nash-1") + 0.2, 0.6),
    ("sfx_cannon.wav", at("nash-2", "frontal assault"), 0.45),
    ("sfx_musket_volley.wav", at("nash-2", "frontal assault", 0.9), 0.45),
    ("sfx_musket_volley.wav", at("nash-6", "feint against"), 0.45),
    ("sfx_cavalry.wav", at("nash-6", "dismounted cavalry together"), 0.4),
    ("sfx_cannon.wav", at("nash-7", "redoubts were stormed"), 0.45),
    ("sfx_cannon.wav", at("nash-8", "pounded the hilltop"), 0.5),
    ("sfx_musket_volley.wav", at("nash-9", "stormed Shy's Hill"), 0.55),
    ("sfx_cavalry.wav", at("nash-9", "cavalry at its heels"), 0.45),
]
inputs = ["-i", "build/picture.mp4", "-i", "audio/voice.wav"]
f, idx = ["[1:a]aresample=48000,aformat=channel_layouts=stereo,asplit=2[vo][vokey]"], 2
mus = []
for n, (file, s, e, off) in enumerate(MUSIC):
    inputs += ["-i", f"{A}/{file}"]
    d = e - s + 1.5
    f.append(f"[{idx}:a]aresample=48000,aformat=channel_layouts=stereo,atrim={off}:{off + d},asetpts=PTS-STARTPTS,"
             f"loudnorm=I=-21:TP=-3,volume={MUSIC_LUFS + 21}dB,afade=t=in:d={0.3 if n == 0 else 1.5},afade=t=out:st={d - 1.5}:d=1.5,"
             f"adelay={int(s * 1000)}|{int(s * 1000)}[m{n}]")
    mus.append(f"[m{n}]"); idx += 1
f.append(f"{''.join(mus)}amix=inputs={len(mus)}:normalize=0,afade=t=out:st={DUR - 3}:d=3[mus]")
f.append("[mus][vokey]sidechaincompress=threshold=0.015:ratio=4:attack=40:release=700:makeup=1[musd]")
mixes = ["[vo]", "[musd]"]
for n, (file, t, vol) in enumerate(SFX):
    inputs += ["-i", f"{A}/{file}"]
    f.append(f"[{idx}:a]aresample=48000,aformat=channel_layouts=stereo,volume={vol},volume={SFX_DB}dB,adelay={int(t * 1000)}|{int(t * 1000)}[s{n}]")
    mixes.append(f"[s{n}]"); idx += 1
f.append(f"{''.join(mixes)}amix=inputs={len(mixes)}:normalize=0,atrim=0:{DUR},loudnorm=I=-14:TP=-1.5:LRA=11[aout]")
os.makedirs("build", exist_ok=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(f), "-map", "0:v", "-map", "[aout]",
                "-t", f"{DUR:.2f}", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart",
                "build/thomas-1080p.mp4"], check=True)
if "--preview" in sys.argv:
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "build/thomas-1080p.mp4", "-vf", "scale=1280:720", "-c:v", "libx264",
                "-crf", "30", "-preset", "medium", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", "build/thomas-720p-preview.mp4"], check=True)
print("ok", DUR)
