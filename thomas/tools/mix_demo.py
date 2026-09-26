"""Mix the 1-minute detail-style demo: scenes/demo render + narration slice + music bed (-41 LUFS) + SFX -> build/{S}-detail-1080p.mp4 and a 720p copy."""
import json, os, subprocess, sys
S = sys.argv[1] if len(sys.argv) > 1 else "demo"
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
os.chdir(ROOT)
T = json.load(open("audio/timing.json"))
P = {p["tag"].split("|")[0].replace("MAP:", "").strip(): p for p in T["paragraphs"] if p["tag"].startswith("MAP")}
T0 = P["chick-5"]["start"]; DUR = P["chick-8"]["start"] - T0


def at(key, phrase, off=0.0):
    p = P[key]; text = p["text"]; i = text.index(phrase); ss = p["sents"]; k = 0
    while k + 1 < len(ss) and ss[k + 1][0] <= i:
        k += 1
    c0, c1 = ss[k][0], ss[k + 1][0] if k + 1 < len(ss) else len(text)
    return ss[k][1] + (ss[k][2] - ss[k][1]) * (i - c0) / max(1, c1 - c0) + off - T0


MUSIC_LUFS, SFX_DB, A = -41, -3, "assets/audio"
SFX = [("sfx_musket_single.wav", 2.0, 0.35), ("sfx_musket_single.wav", 7.5, 0.3),
       ("sfx_drum_roll.wav", at("chick-5", "Longstreet's column hit it", -1.2), 0.5),
       ("sfx_cannon.wav", at("chick-5", "Longstreet's column hit it"), 0.55), ("sfx_musket_volley.wav", at("chick-5", "Longstreet's column hit it", 0.3), 0.55),
       ("sfx_cannon.wav", at("chick-5", "Longstreet's column hit it", 1.4), 0.45), ("sfx_cheer.wav", at("chick-6", "His men poured through"), 0.4),
       ("sfx_musket_volley.wav", at("chick-6", "wheeled to the right", 0.6), 0.5), ("sfx_cannon.wav", at("chick-6", "wheeled to the right", 1.2), 0.45),
       ("sfx_musket_volley.wav", at("chick-6", "A third of the Union"), 0.4), ("sfx_whoosh.wav", at("chick-7", "believed the same thing", -0.3), 0.6)]
ins = ["-i", f"scenes/{S}/renders/{S}.mp4", "-ss", f"{T0:.2f}", "-t", f"{DUR:.2f}", "-i", "audio/voice.wav", "-i", f"{A}/music_03_ready_aim_fire.mp3"]
f = ["[1:a]aresample=48000,aformat=channel_layouts=stereo,asplit=2[vo][key]",
     f"[2:a]aresample=48000,aformat=channel_layouts=stereo,atrim=20:{20 + DUR + 1},asetpts=PTS-STARTPTS,loudnorm=I=-21:TP=-3,volume={MUSIC_LUFS + 21}dB,afade=t=in:d=1,afade=t=out:st={DUR - 2}:d=2[mus]",
     "[mus][key]sidechaincompress=threshold=0.015:ratio=4:attack=40:release=700[musd]"]
mix = ["[vo]", "[musd]"]
for n, (fn, t, v) in enumerate(SFX):
    ins += ["-i", f"{A}/{fn}"]
    f.append(f"[{3 + n}:a]aresample=48000,aformat=channel_layouts=stereo,volume={v},volume={SFX_DB}dB,adelay={int(t * 1000)}|{int(t * 1000)}[s{n}]"); mix.append(f"[s{n}]")
f.append(f"{''.join(mix)}amix=inputs={len(mix)}:normalize=0,atrim=0:{DUR},loudnorm=I=-14:TP=-1.5:LRA=11[aout]")
os.makedirs("build", exist_ok=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", ";".join(f), "-map", "0:v", "-map", "[aout]", "-t", f"{DUR:.2f}",
                "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", f"build/{S}-detail-1080p.mp4"], check=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"build/{S}-detail-1080p.mp4", "-vf", "scale=1280:720", "-c:v", "libx264", "-crf", "26", "-preset", "medium",
                "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", f"build/{S}-detail-720p.mp4"], check=True)
print("ok", round(DUR, 2))
