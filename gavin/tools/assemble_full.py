"""Assemble the full Goose Green video: map renders + archive stills (Ken Burns) + voice + ducked music.

usage (from goosegreen/): python3 tools/assemble_full.py [--preview]
- Map paragraphs are cut from scenes/<scene>/renders/<scene>.mp4 (SCENES below); a missing render becomes a card.
- Archive paragraphs use the images listed in archive.json {"<para index>": ["archive_x.jpg", ...]} from
  assets/media/; images split the paragraph evenly, each with a slow zoom. Missing -> placeholder card.
- Music: assets/media/music.wav (optional), ducked under the voice with a sidechain. Loudness -14 LUFS.
Writes build/gavin.mp4 (1080p master) or build/gavin-720p.mp4 (--preview) + build/chapters.txt.
"""
import json, os, subprocess, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__))))
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
os.chdir(ROOT)
PREVIEW = "--preview" in sys.argv
AUDIO_ONLY = "--audio-only" in sys.argv  # reuse build/video_only_<height>p.mp4 (one per resolution), only remix the sound (e.g. after a level change)
MUSIC_VOL = 0.08  # music bed level before ducking (owner 2026-09-30: option C, quieter; was 0.18)
W, H, FPS = (1280, 720, 30) if PREVIEW else (1920, 1080, 30)
T = json.load(open("audio/timing.json"))
paras, total = T["paragraphs"], T["duration"]
key = lambda p: p["tag"].split("|")[0].replace("MAP:", "").replace("ARCHIVE:", "").strip()
idx = {key(p): i for i, p in enumerate(paras)}
SCENES = {  # scene name -> (first tag, last tag), as built with build_scene.py
    "hook": ("hook-1", "hook-2"),
    "intro": ("hook-3", "hook-3"),
    "m1a": ("move1-1", "move1-3"),
    "m1b": ("move1-4", "move1-8"),
    "m2a": ("move2-1", "move2-1"),
    "m2b": ("move2-2", "move2-9"),
    "m3a": ("move3-1", "move3-2"),
    "m3b": ("move3-3", "move3-10"),
    "ending": ("end-2", "end-3"),
}
CHAPTERS = [("hook-1", "Intro: 26 boats"), ("move1-1", "Move 1: Biazza Ridge"),
            ("move2-1", "Move 2: The La Fiere Causeway"), ("move3-1", "Move 3: The Waal Crossing"),
            ("end-1", "Legacy")]
ARCH_FILE = os.environ.get("ARCHIVE", "archive.json")  # FRONTLINES test: build/frontlines/archive_frontlines.json
ARCH = json.load(open(ARCH_FILE)) if os.path.exists(ARCH_FILE) else {}
NAME = os.environ.get("NAME", "gavin")  # output name: build/<NAME>.mp4 (+ its own video-only track and segment folder)
FLY = json.loads(os.environ.get("FLY", "{}"))  # {"move1-1": "scenes/fly1/renders/fly1.mp4", ...}: 3D flyover for the first 9.5 s, 1 s dissolve into the map
starts = [p["start"] for p in paras] + [total]
enc = ["-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-r", str(FPS), "-an"]
SEG = "build/seg" if NAME == "gavin" else f"build/seg_{NAME}"
os.makedirs(SEG, exist_ok=True)
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


VONLY = f"build/video_only_{H}p.mp4" if NAME == "gavin" else f"build/{NAME}_video_only_{H}p.mp4"
segs, i = [], 0
if AUDIO_ONLY:
    assert os.path.exists(VONLY), "run once without --audio-only first"
    i = len(paras)
while i < len(paras):
    dur = starts[i + 1] - starts[i]
    out = f"{SEG}/{i:02d}.mp4"
    tag = paras[i]["tag"]
    scene, t0 = scene_of(i)
    render = f"scenes/{scene}/renders/{scene}.mp4" if scene else None
    if tag.startswith("ARCHIVE") and ARCH.get(str(i)) and isinstance(ARCH[str(i)][0], dict):  # shot lists: film + moving photos (archive_shots.py)
        import archive_shots
        archive_shots.build(ARCH[str(i)], dur, out, W, H, enc)
    elif tag.startswith("ARCHIVE") and ARCH.get(str(i)):
        imgs = [f"assets/media/{f}" for f in ARCH[str(i)] if os.path.exists(f"assets/media/{f}")]
        parts = []
        for n, src in enumerate(imgs):
            part = f"{SEG}/{i:02d}_{n}.mp4"
            still(src, dur / len(imgs), part, i + n); parts.append(part)
        open(f"{SEG}/p.txt", "w").write("".join(f"file '{os.path.abspath(p)}'\n" for p in parts))
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", f"{SEG}/p.txt", "-c", "copy", out], check=True)
    elif not tag.startswith("ARCHIVE") and render and os.path.exists(render):
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{starts[i] - t0:.3f}", "-i", render, "-t", f"{dur:.3f}",
                        "-vf", f"scale={W}:{H},tpad=stop_mode=clone:stop_duration=3", "-t", f"{dur:.3f}", *enc, out], check=True)
        if key(paras[i]) in FLY and os.path.exists(FLY[key(paras[i])]):
            tmp = out[:-4] + "_fly.mp4"
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-t", "9.5", "-i", FLY[key(paras[i])], "-ss", "8.5", "-i", out, "-filter_complex",
                            f"[0:v]scale={W}:{H},fps={FPS},format=yuv420p[a];[1:v]fps={FPS},format=yuv420p,setpts=PTS-STARTPTS[b];[a][b]xfade=transition=fade:duration=1.0:offset=8.5",
                            "-t", f"{dur:.3f}", *enc, tmp], check=True)
            os.replace(tmp, out)
    else:
        png = f"{SEG}/{i:02d}.png"
        card(("MAP " + key(paras[i]) + " (not rendered yet)") if not tag.startswith("ARCHIVE") else tag, png)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-loop", "1", "-i", png, "-t", f"{dur:.3f}", *enc, out], check=True)
    segs.append(out); i += 1
    print(f"{starts[i - 1]:7.1f}s  {tag[:60]}", flush=True)

if not AUDIO_ONLY:
    open(f"{SEG}/list.txt", "w").write("".join(f"file '{os.path.abspath(s)}'\n" for s in segs))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", f"{SEG}/list.txt", "-c", "copy", VONLY], check=True)

# audio: mix voice + ducked music (peak-limited) -> build/mix.wav, then two-pass loudnorm to -14 LUFS
subprocess.run(["python3", "tools/sfx_cues.py"], check=True)
subprocess.run(["python3", "tools/sfx_mix.py"], check=True)
inputs = ["-i", "audio/voice.wav", "-i", "build/sfx.wav"]
f = ["[0:a]aresample=48000,asplit=3[vo][key][key2]",
     "[1:a]aresample=48000[sfxin]",
     "[sfxin][key2]sidechaincompress=threshold=0.03:ratio=3:attack=10:release=300[sfx]"]
if os.path.exists("assets/media/music.wav"):
    inputs += ["-stream_loop", "-1", "-i", "assets/media/music.wav"]
    f += [f"[2:a]aresample=48000,atrim=0:{total},volume={MUSIC_VOL},afade=t=in:d=2,afade=t=out:st={total - 3}:d=3[mus]",
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
name = f"build/{NAME}-720p.mp4" if PREVIEW else f"build/{NAME}.mp4"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", VONLY, "-i", "build/mix.wav", "-af", af, "-map", "0:v", "-map", "1:a",
                "-t", f"{total:.2f}", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", name], check=True)
mmss = lambda s: f"{int(s // 60)}:{int(s % 60):02d}"
open("build/chapters.txt", "w").write("".join(f"{'0:00' if n == 0 else mmss(paras[idx[t]]['start'])} {title}\n" for n, (t, title) in enumerate(CHAPTERS)))
print("wrote", name, round(total, 1), "s")
