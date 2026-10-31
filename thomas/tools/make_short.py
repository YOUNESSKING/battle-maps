"""Cut a vertical YouTube Short (1080x1920) out of the long video's scene renders + narration.

usage (from thomas/): python3 tools/make_short.py shorts/<name>.json
Spec: {"name", "title": ["LINE 1", "LINE 2"], "red": "WORD", "sub": "PLACE · YEAR", "music": "file.mp3",
       "segments": [{"scene": "ridge2", "from": abs_s, "to": abs_s} | {"image": "archive/x.jpg", "from", "to", "caption"}],
       "sfx": [[file, short_time, volume], ...]}
Times are absolute narration times (audio/timing.json). Layout: blurred map fills the frame, the map centre (1080x1080) sits in
the middle, hook title on top, word-by-word captions (whisper via `hyperframes transcribe`) under it.
Writes build/shorts/<name>.mp4.
"""
import json, os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
os.chdir(ROOT)
spec = json.load(open(sys.argv[1]))
name = spec["name"]
OUT = f"build/shorts/{name}"
os.makedirs(OUT, exist_ok=True)
FPS, Y0 = 30, 420  # map panel top
FONT = "tools/oswald-latin-700-normal.ttf"
SFXDIR = "../goosegreen/assets/media/sfx"
ENC = ["-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-r", str(FPS)]
run = lambda *a: subprocess.run(["ffmpeg", "-v", "error", "-y", *a], check=True)

# ---------- picture: one vertical clip per segment ----------
LAYOUT = (f"split[a][b];[a]scale=-2:1920,crop=1080:1920,gblur=sigma=40,eq=brightness=-0.25[bg];"
          f"[b]crop=1080:1080:(iw-1080)/2:0[fg];[bg][fg]overlay=0:{Y0}")
clips, total = [], 0.0
for k, s in enumerate(spec["segments"]):
    d = s["to"] - s["from"]; total += d
    out = f"{OUT}/seg{k}.mp4"
    if "scene" in s:
        st = s["from"] - spec["scene_start"][s["scene"]]
        run("-ss", f"{st:.3f}", "-i", f"scenes/{s['scene']}/renders/{s['scene']}.mp4", "-t", f"{d:.3f}",
            "-vf", f"scale=1920:1080,fps={FPS},{LAYOUT}", *ENC, "-an", out)
    else:  # archive picture: slow push-in on a 1920x1080 canvas, then the same layout
        fr = int(d * FPS) + 2
        run("-loop", "1", "-framerate", str(FPS), "-i", s["image"], "-t", f"{d:.3f}", "-vf",
            f"scale=3840:2160:force_original_aspect_ratio=increase,crop=3840:2160,zoompan=z='1.0+0.15*on/{fr}':x='iw/2-iw/zoom/2':"
            f"y='ih/2-ih/zoom/2':d={fr}:s=1920x1080:fps={FPS},{LAYOUT}", *ENC, "-an", out)
    clips.append(out)
open(f"{OUT}/list.txt", "w").write("".join(f"file '{os.path.abspath(c)}'\n" for c in clips))
run("-f", "concat", "-safe", "0", "-i", f"{OUT}/list.txt", "-c", "copy", f"{OUT}/picture.mp4")

# ---------- audio: narration pieces + music bed (ducked) + locked-kit SFX ----------
parts = []
for k, s in enumerate(spec["segments"]):
    p = f"{OUT}/v{k}.wav"
    run("-ss", f"{s['from']:.3f}", "-i", "audio/voice.wav", "-t", f"{s['to'] - s['from']:.3f}", "-ar", "48000", "-ac", "2",
        "-af", "afade=t=in:d=0.05,afade=t=out:st=%.3f:d=0.08" % (s["to"] - s["from"] - 0.08), p)
    parts.append(p)
open(f"{OUT}/alist.txt", "w").write("".join(f"file '{os.path.abspath(p)}'\n" for p in parts))
run("-f", "concat", "-safe", "0", "-i", f"{OUT}/alist.txt", "-c", "pcm_s16le", f"{OUT}/voice.wav")
ins = ["-i", f"{OUT}/voice.wav", "-i", f"assets/audio/{spec['music']}"]
f = ["[0:a]asplit=2[vo][key]",
     f"[1:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:{total + 1},asetpts=PTS-STARTPTS,loudnorm=I=-21:TP=-3,"
     f"volume={spec.get('music_lufs', -36) + 21}dB,afade=t=in:d=0.5,afade=t=out:st={total - 2}:d=2[mus]",
     "[mus][key]sidechaincompress=threshold=0.015:ratio=4:attack=40:release=700[musd]"]
mix = ["[vo]", "[musd]"]
for n, (file, t, vol) in enumerate(spec.get("sfx", [])):
    ins += ["-i", f"{SFXDIR}/{file}"]
    f.append(f"[{n + 2}:a]aresample=48000,aformat=channel_layouts=stereo,volume={vol},adelay={int(t * 1000)}|{int(t * 1000)}[s{n}]")
    mix.append(f"[s{n}]")
f.append(f"{''.join(mix)}amix=inputs={len(mix)}:normalize=0,atrim=0:{total},loudnorm=I=-14:TP=-1.5:LRA=11[aout]")
run(*ins, "-filter_complex", ";".join(f), "-map", "[aout]", "-ar", "48000", f"{OUT}/audio.wav")

# ---------- hook title (top band) ----------
img = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
y = 80
for line in spec["title"]:
    size = 112
    fnt = ImageFont.truetype(FONT, size)
    while d.textlength(line, font=fnt) > 1000:
        size -= 4; fnt = ImageFont.truetype(FONT, size)
    words, x = line.split(" "), (1080 - d.textlength(line, font=fnt)) / 2
    for w in words:
        col = (230, 40, 40) if w.strip(".,?!") == spec.get("red") else (255, 255, 255)
        d.text((x, y), w, font=fnt, fill=col, stroke_width=6, stroke_fill=(0, 0, 0))
        x += d.textlength(w + " ", font=fnt)
    y += size + 14
sub = ImageFont.truetype(FONT, 40)
d.text(((1080 - d.textlength(spec["sub"], font=sub)) / 2, y + 6), spec["sub"], font=sub, fill=(242, 193, 78), stroke_width=3, stroke_fill=(0, 0, 0))
img.save(f"{OUT}/title.png")

# ---------- captions: whisper word timings -> 1-3 word chunks ----------
subprocess.run(["hyperframes", "transcribe", f"{OUT}/voice.wav", "--json"], check=True, capture_output=True)
words = json.load(open(f"{OUT}/transcript.json"))
ts = lambda t: "%d:%02d:%05.2f" % (t // 3600, t % 3600 // 60, t % 60)
ass = ["[Script Info]", "PlayResX: 1080", "PlayResY: 1920", "", "[V4+ Styles]",
       "Format: Name, Fontname, Fontsize, PrimaryColour, OutlineColour, BackColour, Bold, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV",
       "Style: C,Oswald,92,&H00FFFFFF,&H00000000,&H80000000,1,1,7,2,8,60,60,1560", "", "[Events]",
       "Format: Layer, Start, End, Style, Text"]
chunk = []
def flush():
    if chunk:
        end = chunk[-1]["end"] + 0.05
        ass.append(f"Dialogue: 0,{ts(chunk[0]['start'])},{ts(end)},C," + " ".join(w["text"].strip().upper() for w in chunk))
        chunk.clear()
for w in words:
    if chunk and (len(chunk) == 3 or w["start"] - chunk[-1]["end"] > 0.35):
        flush()
    chunk.append(w)
    if w["text"].strip()[-1:] in ".,?!:":
        flush()
flush()
open(f"{OUT}/captions.ass", "w").write("\n".join(ass) + "\n")

# ---------- final ----------
os.makedirs("build/shorts", exist_ok=True)
run("-i", f"{OUT}/picture.mp4", "-i", f"{OUT}/title.png", "-i", f"{OUT}/audio.wav", "-filter_complex",
    f"[0:v][1:v]overlay=0:0,subtitles={OUT}/captions.ass:fontsdir=tools[v]", "-map", "[v]", "-map", "2:a",
    *ENC, "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-t", f"{total:.3f}", f"build/shorts/{name}.mp4")
print(f"wrote build/shorts/{name}.mp4 ({total:.1f} s)")
