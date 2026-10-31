"""Cut a vertical YouTube Short (1080x1920) out of the long video's scene renders + narration.

usage (from thomas/): python3 tools/make_short.py shorts/<name>.json
Spec: {"name", "title": ["LINE 1", "LINE 2"], "gold": "WORD", "music": "music_src_<locked track>.mp3",
       "segments": [{"scene": "ridge2", "from": abs_s, "to": abs_s, ["pic_from": abs_s], ["x": crop_left]} | {"image": "archive/x.jpg", "from", "to", "caption"}],
       "cues": [[kind, short_time], ...]}   (extra locked-kit cues, e.g. ["hit", 0.05]; kinds as in STYLE_LOCK 3)
Gun flashes / shell bursts come from shorts/events_<scene>.json (scene time, read from the scene's timeline).
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
SFXDIR = "../goosegreen/assets/media/sfx"  # the locked sound kit (md5-checked by check_sound_lock)
SKEL = "../rokossovsky"  # locked reference video: sfx_mix_lib.py, check_sound_lock.py, music_src_*.mp3
MUSIC_VOL = 0.08
ENC = ["-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-r", str(FPS)]
run = lambda *a: subprocess.run(["ffmpeg", "-v", "error", "-y", *a], check=True)

# ---------- sound cues: the scene's own flashes/bursts (shorts/events_<scene>.json, scene time) -> locked kinds ----------
# flash = a gun/musket firing -> "fire" (quiet launch); burst = a shell landing -> "impact" (real distant artillery) + a shake;
# clash = a melee starburst -> "hit" (STYLE_LOCK 3/3a). Events are read from the scene's timeline (see SHORTS.md).
cues, shakes, total, seg_t0 = [], [], 0.0, []
for s in spec["segments"]:
    seg_t0.append(total)
    if "scene" in s and os.path.exists(f"shorts/events_{s['scene']}.json"):
        for t, kind in json.load(open(f"shorts/events_{s['scene']}.json")):
            a = t + spec["scene_start"][s["scene"]]
            pf = s.get("pic_from", s["from"])  # picture start (abs); differs from the audio when a line plays over another map shot
            if pf <= a < pf + s["to"] - s["from"] - 0.3:
                cues.append([total + a - pf, {"flash": "fire", "burst": "impact", "clash": "hit"}[kind], s["scene"]])
                if kind == "burst":
                    shakes.append(total + a - pf)
    total += s["to"] - s["from"]
cues += [[t, kind, "short"] for kind, t in spec.get("cues", [])]  # e.g. ["hit", 0.05] for the title slam
cues.sort()

# ---------- picture: one vertical clip per segment ----------
LAYOUT = lambda x=None: (f"split[a][b];[a]scale=-2:1920,crop=1080:1920,gblur=sigma=40,eq=brightness=-0.25[bg];"
                         f"[b]crop=1080:1080:{'(iw-1080)/2' if x is None else x}:0[fg];[bg][fg]overlay=0:{Y0}")  # x: crop left edge (segment "x")
def shake(t0, d):  # K.shake(t, 3, 0.35) on every shell that lands, as a decaying jitter of the whole frame
    ts = [t - t0 for t in shakes if t0 <= t < t0 + d]
    if not ts:
        return ""
    ex = lambda f: "+".join(f"between(t,{x:.3f},{x + 0.35:.3f})*3*{f}(2*PI*24*(t-{x:.3f}))*(1-(t-{x:.3f})/0.35)" for x in ts)
    return f",scale=1092:1941,crop=1080:1920:x='6+({ex('sin')})':y='10+({ex('cos')})'"
clips = []
for k, s in enumerate(spec["segments"]):
    d = s["to"] - s["from"]
    out = f"{OUT}/seg{k}.mp4"
    if "scene" in s:
        st = s.get("pic_from", s["from"]) - spec["scene_start"][s["scene"]]
        run("-ss", f"{st:.3f}", "-i", f"scenes/{s['scene']}/renders/{s['scene']}.mp4", "-t", f"{d:.3f}",
            "-vf", f"scale=1920:1080,fps={FPS},{LAYOUT(s.get('x'))}{shake(seg_t0[k], d)}", *ENC, "-an", out)
    else:  # archive picture: slow push-in on a 1920x1080 canvas, then the same layout
        fr = int(d * FPS) + 2
        run("-loop", "1", "-framerate", str(FPS), "-i", s["image"], "-t", f"{d:.3f}", "-vf",
            f"scale=3840:2160:force_original_aspect_ratio=increase,crop=3840:2160,zoompan=z='1.0+0.15*on/{fr}':x='iw/2-iw/zoom/2':"
            f"y='ih/2-ih/zoom/2':d={fr}:s=1920x1080:fps={FPS},{LAYOUT(s.get('x'))}", *ENC, "-an", out)
    clips.append(out)
open(f"{OUT}/list.txt", "w").write("".join(f"file '{os.path.abspath(c)}'\n" for c in clips))
run("-f", "concat", "-safe", "0", "-i", f"{OUT}/list.txt", "-c", "copy", f"{OUT}/picture.mp4")

# ---------- audio: the LOCKED mix (STYLE_LOCK 3-5, same chain as rokossovsky/tools/assemble_full.py) ----------
parts = []
for k, s in enumerate(spec["segments"]):
    p = f"{OUT}/v{k}.wav"
    run("-ss", f"{s['from']:.3f}", "-i", "audio/voice.wav", "-t", f"{s['to'] - s['from']:.3f}", "-ar", "48000", "-ac", "2",
        "-af", "afade=t=in:d=0.05,afade=t=out:st=%.3f:d=0.08" % (s["to"] - s["from"] - 0.08), p)
    parts.append(p)
open(f"{OUT}/alist.txt", "w").write("".join(f"file '{os.path.abspath(p)}'\n" for p in parts))
run("-f", "concat", "-safe", "0", "-i", f"{OUT}/alist.txt", "-c", "pcm_s16le", f"{OUT}/voice.wav")
# SFX: the locked kit + levels via rokossovsky's sfx_mix_lib; the sound-lock check runs first and stops the build if anything changed
sys.path.insert(0, os.path.abspath(f"{SKEL}/tools"))
import check_sound_lock, sfx_mix_lib
check_sound_lock.ROOT = os.path.abspath(SKEL)
check_sound_lock.SFX = sfx_mix_lib.D = os.path.abspath(SFXDIR)
n = sfx_mix_lib.render(cues, total, f"{OUT}/sfx.wav")
print(f"  {n} sound cues ({sum(1 for c in cues if c[1] == 'impact')} impacts, {len(shakes)} shakes)")
# music: the locked track for this part of the story, -20 LUFS, MUSIC_VOL 0.08, 2 s in / 3 s out, ducked thr 0.03 ratio 6 20/400 ms;
# SFX ducked lightly (thr 0.03 ratio 3 10/300 ms); limiter 0.5; then two-pass loudnorm -14 LUFS / TP -1.5 / LRA 11
run("-stream_loop", "-1", "-i", f"{SKEL}/assets/media/{spec['music']}", "-t", f"{total + 1:.2f}", "-af",
    "aresample=48000,aformat=channel_layouts=stereo,loudnorm=I=-20:TP=-2:LRA=12", "-ar", "48000", f"{OUT}/music.wav")
f = ["[0:a]aresample=48000,aformat=channel_layouts=stereo,asplit=3[vo][key][key2]",
     "[1:a]aresample=48000,aformat=channel_layouts=stereo[sfxin]",
     "[sfxin][key2]sidechaincompress=threshold=0.03:ratio=3:attack=10:release=300[sfx]",
     f"[2:a]aresample=48000,atrim=0:{total:.3f},volume={MUSIC_VOL},afade=t=in:d=2,afade=t=out:st={total - 3:.3f}:d=3[mus]",
     "[mus][key]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[musd]",
     "[vo][musd][sfx]amix=inputs=3:normalize=0,alimiter=limit=0.5:level=false[aout]"]
run("-i", f"{OUT}/voice.wav", "-i", f"{OUT}/sfx.wav", "-i", f"{OUT}/music.wav", "-filter_complex", ";".join(f),
    "-map", "[aout]", "-t", f"{total:.3f}", "-ar", "48000", f"{OUT}/mix.wav")
LN = "loudnorm=I=-14:TP=-1.5:LRA=11"
m = json.loads(subprocess.run(["ffmpeg", "-hide_banner", "-i", f"{OUT}/mix.wav", "-af", LN + ":print_format=json", "-f", "null", "-"],
                              capture_output=True, text=True).stderr.split("[Parsed_loudnorm")[-1].split("\n", 1)[1])
run("-i", f"{OUT}/mix.wav", "-af", f"{LN}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:"
    f"measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true", "-ar", "48000", f"{OUT}/audio.wav")

# ---------- hook title (top band), owner style A (2026-10-31): white Oswald, ONE gold word, soft shadow, nothing else ----------
from PIL import ImageFilter
GOLD, WHITE = (242, 193, 78), (255, 255, 255)
img = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
shadow = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0)); sd = ImageDraw.Draw(shadow)
y = 110
for line in spec["title"]:
    size = 118
    fnt = ImageFont.truetype(FONT, size)
    while d.textlength(line, font=fnt) > 980:
        size -= 4; fnt = ImageFont.truetype(FONT, size)
    x = (1080 - d.textlength(line, font=fnt)) / 2
    for w in line.split(" "):
        col = GOLD if w.strip(".,?!") == spec.get("gold") else WHITE
        sd.text((x + 4, y + 4), w, font=fnt, fill=(0, 0, 0, 220), stroke_width=2, stroke_fill=(0, 0, 0, 220))
        d.text((x, y), w, font=fnt, fill=col)
        x += d.textlength(w + " ", font=fnt)
    y += size + 16
out_img = shadow.filter(ImageFilter.GaussianBlur(8)); out_img.alpha_composite(img)
out_img.save(f"{OUT}/title.png")

# ---------- captions: whisper word timings -> 1-3 word chunks, white with the spoken word in gold, soft shadow ----------
subprocess.run(["hyperframes", "transcribe", f"{OUT}/voice.wav", "--json"], check=True, capture_output=True)
words = json.load(open(f"{OUT}/transcript.json"))
ts = lambda t: "%d:%02d:%05.2f" % (t // 3600, t % 3600 // 60, t % 60)
ass = ["[Script Info]", "PlayResX: 1080", "PlayResY: 1920", "", "[V4+ Styles]",
       "Format: Name, Fontname, Fontsize, PrimaryColour, OutlineColour, BackColour, Bold, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV",
       "Style: C,Oswald,86,&H00FFFFFF,&H64000000,&H78000000,1,1,1.5,4,8,60,60,1560", "", "[Events]",
       "Format: Layer, Start, End, Style, Text"]
GOLD_ASS = "&H4EC1F2&"  # BGR of #F2C14E
chunk = []
def flush():
    if not chunk:
        return
    end = chunk[-1]["end"] + 0.05
    for i, w in enumerate(chunk):  # one event per word: that word gold, the others white
        t1 = chunk[i + 1]["start"] if i + 1 < len(chunk) else end
        txt = " ".join((f"{{\\c{GOLD_ASS}}}" + x["text"].strip().upper() + "{\\c&HFFFFFF&}") if j == i else x["text"].strip().upper()
                       for j, x in enumerate(chunk))
        ass.append(f"Dialogue: 0,{ts(w['start'] if i else chunk[0]['start'])},{ts(t1)},C,{{\\blur2}}{txt}")
    chunk.clear()
for w in words:
    if chunk and (len(chunk) == 3 or w["start"] - chunk[-1]["end"] > 0.35):
        flush()
    chunk.append(w)
    if w["text"].strip()[-1:] in ".,?!:":
        flush()
flush()
ev = ass[ass.index("Format: Layer, Start, End, Style, Text") + 1:]  # never let two captions overlap (libass would stack them)
sec = lambda x: int(x[0]) * 3600 + int(x[1]) * 60 + float(x[2])
for i in range(len(ev) - 1):
    a, b = ev[i].split(",", 3), ev[i + 1].split(",", 3)
    if sec(a[2].split(":")) > sec(b[1].split(":")):
        a[2] = b[1]; ev[i] = ",".join(a)
ass[len(ass) - len(ev):] = ev
open(f"{OUT}/captions.ass", "w").write("\n".join(ass) + "\n")

# ---------- final ----------
os.makedirs("build/shorts", exist_ok=True)
run("-i", f"{OUT}/picture.mp4", "-i", f"{OUT}/title.png", "-i", f"{OUT}/audio.wav", "-filter_complex",
    f"[0:v][1:v]overlay=0:0,subtitles={OUT}/captions.ass:fontsdir=tools[v]", "-map", "[v]", "-map", "2:a",
    *ENC, "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-t", f"{total:.3f}", f"build/shorts/{name}.mp4")
print(f"wrote build/shorts/{name}.mp4 ({total:.1f} s)")
