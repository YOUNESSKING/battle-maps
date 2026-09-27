"""Assemble the full Goose Green video: map renders + archive stills (Ken Burns) + voice + ducked music.

usage (from goosegreen/): python3 tools/assemble_full.py [--preview]
- Map paragraphs are cut from scenes/<scene>/renders/<scene>.mp4 (SCENES below); a missing render becomes a card.
- Archive paragraphs use the images listed in archive.json {"<para index>": ["archive_x.jpg", ...]} from
  assets/media/; images split the paragraph evenly, each with a slow zoom. Missing -> placeholder card.
- Music: assets/media/music.wav (optional), ducked under the voice with a sidechain. Loudness -14 LUFS.
Writes build/goosegreen.mp4 (1080p master) or build/goosegreen-720p.mp4 (--preview) + build/chapters.txt.
"""
import json, os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
os.chdir(ROOT)
PREVIEW = "--preview" in sys.argv
W, H, FPS = (1280, 720, 30) if PREVIEW else (1920, 1080, 30)
T = json.load(open("audio/timing.json"))
paras, total = T["paragraphs"], T["duration"]
key = lambda p: p["tag"].split("|")[0].replace("MAP:", "").strip()
idx = {key(p): i for i, p in enumerate(paras)}
SCENES = {  # scene name -> (first tag, last tag), as built with build_scene.py
    "hook-bbc": ("hook-bbc", "hook-bbc"),
    "hook-atlantic": ("hook-falklands", "hook-falklands"),
    "hook-isthmus": ("hook-isthmus", "hook-bio-2"),
    "move1": ("move1-1", "move1-10"),
    "move2": ("move2-1", "move2-12"),
    "move3": ("move3-1", "move3-10"),
    "ending": ("end-1", "end-2"),
}
CHAPTERS = [("hook-bbc", "Intro: the BBC leak"), ("move1-1", "Move 1: The Night Assault"),
            ("move2-1", "Move 2: Darwin Hill and Boca House"), ("move3-1", "Move 3: The Goose Green Bluff"),
            ("end-1", "Legacy")]
ARCH = json.load(open("archive.json")) if os.path.exists("archive.json") else {}
starts = [p["start"] for p in paras] + [total]
enc = ["-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-r", str(FPS), "-an"]
os.makedirs("build/seg", exist_ok=True)
FONT = "tools/oswald-latin-700-normal.ttf"


def scene_of(i):
    for name, (a, b) in SCENES.items():
        if idx[a] <= i <= idx[b]:
            return name, starts[idx[a]]
    return None, 0


def card(text, out):
    img = Image.new("RGB", (W, H), (22, 22, 20))
    d = ImageDraw.Draw(img)
    f = ImageFont.truetype(FONT, int(H * 0.035))
    words, lines, cur = text.split(), [], ""
    for w in words:
        if d.textlength(cur + " " + w, font=f) > W * 0.8:
            lines.append(cur); cur = w
        else:
            cur = (cur + " " + w).strip()
    lines.append(cur)
    y = H / 2 - len(lines) * H * 0.025
    for ln in lines:
        d.text((W / 2, y), ln, font=f, fill=(210, 200, 170), anchor="mm"); y += H * 0.05
    img.save(out)


def still(src, dur, out, n):
    """Slow zoom on one image, cover-cropped to 16:9; alternating zoom in / out."""
    frames = max(2, int(round(dur * FPS)))
    z = "min(1+0.08*on/{f},1.08)".format(f=frames) if n % 2 == 0 else "max(1.08-0.08*on/{f},1.0)".format(f=frames)
    vf = (f"scale={W * 2}:{H * 2}:force_original_aspect_ratio=increase,crop={W * 2}:{H * 2},"
          f"zoompan=z='{z}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={frames}:s={W}x{H}:fps={FPS}")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-loop", "1", "-i", src, "-vf", vf, "-frames:v", str(frames), *enc, out], check=True)


segs, i = [], 0
while i < len(paras):
    dur = starts[i + 1] - starts[i]
    out = f"build/seg/{i:02d}.mp4"
    tag = paras[i]["tag"]
    scene, t0 = scene_of(i)
    render = f"scenes/{scene}/renders/{scene}.mp4" if scene else None
    if tag.startswith("ARCHIVE") and ARCH.get(str(i)):
        imgs = [f"assets/media/{f}" for f in ARCH[str(i)] if os.path.exists(f"assets/media/{f}")]
        parts = []
        for n, src in enumerate(imgs):
            part = f"build/seg/{i:02d}_{n}.mp4"
            still(src, dur / len(imgs), part, i + n); parts.append(part)
        open("build/seg/p.txt", "w").write("".join(f"file '{os.path.abspath(p)}'\n" for p in parts))
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", "build/seg/p.txt", "-c", "copy", out], check=True)
    elif not tag.startswith("ARCHIVE") and render and os.path.exists(render):
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{starts[i] - t0:.3f}", "-i", render, "-t", f"{dur:.3f}",
                        "-vf", f"scale={W}:{H},tpad=stop_mode=clone:stop_duration=3", "-t", f"{dur:.3f}", *enc, out], check=True)
    else:
        png = f"build/seg/{i:02d}.png"
        card(("MAP " + key(paras[i]) + " (not rendered yet)") if not tag.startswith("ARCHIVE") else tag, png)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-loop", "1", "-i", png, "-t", f"{dur:.3f}", *enc, out], check=True)
    segs.append(out); i += 1
    print(f"{starts[i - 1]:7.1f}s  {tag[:60]}", flush=True)

open("build/seg/list.txt", "w").write("".join(f"file '{os.path.abspath(s)}'\n" for s in segs))
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", "build/seg/list.txt", "-c", "copy", "build/video_only.mp4"], check=True)

# audio: mix voice + ducked music (peak-limited) -> build/mix.wav, then two-pass loudnorm to -14 LUFS
subprocess.run(["python3", "tools/sfx_cues.py"], check=True)
subprocess.run(["python3", "tools/sfx_mix.py"], check=True)
inputs = ["-i", "audio/voice.wav", "-i", "build/sfx.wav"]
f = ["[0:a]aresample=48000,asplit=3[vo][key][key2]",
     "[1:a]aresample=48000[sfxin]",
     "[sfxin][key2]sidechaincompress=threshold=0.03:ratio=3:attack=10:release=300[sfx]"]
if os.path.exists("assets/media/music.wav"):
    inputs += ["-stream_loop", "-1", "-i", "assets/media/music.wav"]
    f += [f"[2:a]aresample=48000,atrim=0:{total},volume=0.35,afade=t=in:d=2,afade=t=out:st={total - 3}:d=3[mus]",
          "[mus][key]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[musd]",
          "[vo][musd][sfx]amix=inputs=3:normalize=0,alimiter=limit=0.5:level=false[aout]"]
else:
    f += ["[key]anullsink", "[vo][sfx]amix=inputs=2:normalize=0,alimiter=limit=0.5:level=false[aout]"]
subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(f), "-map", "[aout]", "-t", f"{total:.2f}",
                "-c:a", "pcm_s16le", "build/mix.wav"], check=True)
LN = "loudnorm=I=-14:TP=-1.5:LRA=11"
r = subprocess.run(["ffmpeg", "-nostats", "-i", "build/mix.wav", "-af", LN + ":print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
m = json.loads(r[r.rindex("{"):r.rindex("}") + 1])
af = (f"{LN}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
      f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,aresample=48000")
name = "build/goosegreen-720p.mp4" if PREVIEW else "build/goosegreen.mp4"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "build/video_only.mp4", "-i", "build/mix.wav", "-af", af, "-map", "0:v", "-map", "1:a",
                "-t", f"{total:.2f}", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", name], check=True)
mmss = lambda s: f"{int(s // 60)}:{int(s % 60):02d}"
open("build/chapters.txt", "w").write("".join(f"{'0:00' if n == 0 else mmss(paras[idx[t]]['start'])} {title}\n" for n, (t, title) in enumerate(CHAPTERS)))
print("wrote", name, round(total, 1), "s")
