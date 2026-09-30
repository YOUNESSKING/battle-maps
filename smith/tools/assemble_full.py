"""Assemble the full Smith video: map renders + archive film/photos + voice + music.

usage (from smith/): python3 tools/assemble_full.py [--audio-only]
- Map paragraphs are cut from scenes/<scene>/renders/*.mp4 (scene list = SCENES below, same as MAPS_BRIEF.md).
  A missing render becomes a placeholder card so the cut can still be reviewed.
- Archive paragraphs use ARCHIVE[tag-number] = list of media: "film:NAME" (assets/film/clips/NAME.mp4)
  or "photo:FILE" (assets/media/FILE, slow Ken Burns). Duration is split evenly between the items.
- Audio (locked channel mix, same as goosegreen/tools/assemble_full.py): SFX cues from the scene pages (tools/sfx_cues.py)
  -> build/sfx.wav (tools/sfx_mix.py) -> voice + SFX (lightly ducked) + music bed assets/media/music.wav
  (tools/make_music_bed.py, MUSIC_VOL, ducked under the voice) -> limiter -> two-pass loudnorm -14 LUFS, AAC 192k.
- --audio-only: reuse build/video_only.mp4 (1080p picture track) and only remix the sound (no re-render, no re-cut).
Writes build/smith-full.mp4 (1080p master) + build/chapters.txt.
"""
import glob, json, os, random, subprocess, sys
from PIL import Image, ImageFilter, ImageDraw, ImageFont

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
os.chdir(ROOT)
AUDIO_ONLY = "--audio-only" in sys.argv  # reuse build/video_only.mp4, only remix the sound
MUSIC_VOL = 0.18  # music bed level before ducking (locked, STYLE_LOCK.md section 5)
T = json.load(open("audio/timing.json"))
P, DUR = T["paragraphs"], T["duration"]
FPS = 30
ENC = ["-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p", "-r", str(FPS), "-an"]

SCENES = {  # scene -> (first tag, last tag)
    "hook": ("hook-1", "hook-3"), "inchon-a": ("inchon-1", "inchon-2"), "inchon-b": ("inchon-3", "inchon-7"),
    "inchon-c": ("inchon-8", "inchon-9"), "hagaru-a": ("hagaru-1", "hagaru-1"), "hagaru-b": ("hagaru-2", "hagaru-2"),
    "hagaru-c": ("hagaru-3", "hagaru-8"), "hagaru-d": ("hagaru-9", "hagaru-9"), "breakout-a": ("breakout-1", "breakout-2"),
    "breakout-b": ("breakout-3", "breakout-3"), "breakout-c": ("breakout-4", "breakout-6"),
    "breakout-d": ("breakout-7", "breakout-8"), "ending-1": ("ending-1", "ending-1"), "ending-2": ("ending-2", "ending-2"),
}
CHAPTERS = [("hook-1", "Intro: trapped at the Chosin Reservoir"), ("inchon-1", "Move 1: Inchon"),
            ("hagaru-1", "Move 2: Hagaru-ri"), ("breakout-1", "Move 3: The breakout"), ("ending-1", "Smith's legacy")]
# archive slots, keyed by the index of the ARCHIVE paragraph in script order (0 = first archive paragraph)
ARCHIVE = {
    0: ["film:chosin_snow_march_01", "photo:chosin_column.jpg", "film:chosin_snow_march_02"],  # marching out of the mountains
    1: ["photo:macarthur_mckinley.jpg", "film:officers_01", "film:inchon_wolmido_01"],  # MacArthur / worst place to land
    2: ["film:inchon_seawall_01", "photo:lopez_seawall.jpg"],                            # Lopez at Red Beach
    3: ["photo:almond.jpg", "film:macarthur_02"],                                        # Almond
    4: ["film:hagaru_airstrip_01", "film:hagaru_airstrip_02", "photo:hagaru_airstrip.jpg", "film:chosin_cold_01"],  # airlift, Yudam-ni
    5: ["photo:smith_correspondents.jpg", "film:chosin_snow_march_03"],                  # "attacking in another direction"
    6: ["photo:treadway_bridge.jpg", "film:vehicles_dead_01", "film:foxholes_snow_01"],  # bridge, the dead, morphine
    7: ["film:hungnam_ships_01", "photo:hungnam_ships.jpg", "film:hungnam_explosion_02", "photo:hungnam_explosion.jpg"],
    8: ["photo:smith_later.jpg", "photo:smith_portrait.jpg"],                             # ending portrait
}

key = lambda p: p["tag"].split("|")[0].replace("MAP:", "").replace("ARCHIVE:", "").strip()
scene_of, scene_t0 = {}, {}
tags = [key(p) for p in P]
for s, (a, b) in SCENES.items():
    i0, i1 = tags.index(a), tags.index(b)
    scene_t0[s] = P[i0]["start"]
    for i in range(i0, i1 + 1):
        scene_of[i] = s

starts = [0.0] + [p["start"] for p in P[1:]] + [DUR]  # each paragraph owns [starts[i], starts[i+1])
os.makedirs("build/seg", exist_ok=True)
os.makedirs("build/cards", exist_ok=True)


def run(cmd):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *cmd], check=True)


def hook_composite():
    """hook-in (korea) -> hook (chosin) -> hook-out (korea), 0.6 s dissolves at the hand-offs (abs times):
    9.8 s (dive onto Chosin during "nineteen fifty", before "bugles") and 56.2 s (after "until spring", hook-3 starts 55.96).
    Scene builds that match these offsets (also in the header of each hook scene file):
      build_scene.py hook-in korea hook-1 hook-1 --to 10.4 / hook chosin hook-1 hook-3 --from 9.8 --to 56.8 / hook-out korea hook-2 hook-3 --from 56.2"""
    parts = [render_of_dir(s) for s in ("hook-in", "hook", "hook-out")]
    if not all(parts):
        return None
    out = "build/hook_composite.mp4"
    run(["-i", parts[0], "-i", parts[1], "-i", parts[2], "-filter_complex",
         "[0:v]settb=AVTB,fps=30[a];[1:v]settb=AVTB,fps=30[b];[2:v]settb=AVTB,fps=30[c];"
         "[a][b]xfade=transition=fade:duration=0.6:offset=9.8[ab];[ab][c]xfade=transition=fade:duration=0.6:offset=56.2[v]",
         "-map", "[v]", *ENC, out])
    return out


def render_of(scene):
    if scene == "hook":
        return hook_composite() or render_of_dir("hook")
    return render_of_dir(scene)


def render_of_dir(scene):
    c = sorted(glob.glob(f"scenes/{scene}/renders/*.mp4"), key=os.path.getmtime)
    return c[-1] if c else None


def card(text, out):
    im = Image.new("RGB", (1920, 1080), (28, 26, 22))
    d = ImageDraw.Draw(im)
    try:
        f = ImageFont.truetype("tools/oswald-latin-700-normal.ttf", 44)
    except OSError:
        f = ImageFont.load_default()
    words, lines, cur = text.split(), [], ""
    for w in words:
        if len(cur) + len(w) > 60:
            lines.append(cur); cur = ""
        cur += w + " "
    lines.append(cur)
    for j, l in enumerate(lines[:8]):
        d.text((160, 380 + j * 64), l.strip(), fill=(230, 220, 190), font=f)
    im.save(out)


def still_segment(img_path, dur, out, seed):
    """Photo -> 1920x1080 with blurred fill, slow Ken Burns push-in (or pull-out), light film grade."""
    src = Image.open(img_path).convert("RGB")
    bg = src.copy()
    s = max(1920 / bg.width, 1080 / bg.height)
    bg = bg.resize((int(bg.width * s) + 1, int(bg.height * s) + 1)).crop((0, 0, 1920, 1080)).filter(ImageFilter.GaussianBlur(28))
    bg = Image.eval(bg, lambda v: int(v * 0.45))
    s = min(1920 / src.width, 1080 / src.height)
    fg = src.resize((int(src.width * s), int(src.height * s)), Image.LANCZOS)
    bg.paste(fg, ((1920 - fg.width) // 2, (1080 - fg.height) // 2))
    big = f"build/cards/kb_{seed}.png"
    bg.resize((3840, 2160), Image.LANCZOS).save(big)
    n = max(2, int(round(dur * FPS)))
    r = random.Random(seed)
    zin = r.random() < 0.7
    z = f"1+0.10*on/{n}" if zin else f"1.10-0.10*on/{n}"
    fx, fy = r.uniform(0.35, 0.65), r.uniform(0.35, 0.6)
    vf = (f"zoompan=z='{z}':x='(iw-iw/zoom)*{fx:.2f}':y='(ih-ih/zoom)*{fy:.2f}':d={n}:s=1920x1080:fps={FPS},"
          "format=gray,format=yuv420p,eq=contrast=1.05:brightness=-0.02,noise=alls=6:allf=t")
    run(["-loop", "1", "-i", big, "-frames:v", str(n), "-vf", vf, *ENC, out])


def film_segment(clip, dur, out):
    """Film clip trimmed (or looped) to dur."""
    run(["-stream_loop", "-1", "-i", clip, "-t", f"{dur:.3f}", "-vf", "scale=1920:1080:force_original_aspect_ratio=decrease,"
         "pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30", *ENC, out])


segs, i, ai, missing = [], 0, 0, []
if AUDIO_ONLY:
    assert os.path.exists("build/video_only.mp4"), "run once without --audio-only first"
    i = len(P)
while i < len(P):
    out = f"build/seg/{i:02d}.mp4"
    if P[i]["tag"].startswith("ARCHIVE"):
        dur = starts[i + 1] - starts[i]
        items = []
        for m in ARCHIVE.get(ai, []):
            kind, name = m.split(":", 1)
            path = f"assets/film/clips/{name}.mp4" if kind == "film" else f"assets/media/{name}"
            if os.path.exists(path):
                items.append((kind, path))
        if not items:
            missing.append(f"archive #{ai} ({key(P[i])[:50]})")
            card("ARCHIVE: " + key(P[i]), f"build/cards/a{ai}.png")
            items = [("photo", f"build/cards/a{ai}.png")]
        part = dur / len(items)
        parts = []
        for k, (kind, path) in enumerate(items):
            po = f"build/seg/{i:02d}_{k}.mp4"
            (film_segment(path, part, po) if kind == "film" else still_segment(path, part, po, i * 10 + k))
            parts.append(po)
        open("build/seg/tmp.txt", "w").write("".join(f"file '{os.path.abspath(p)}'\n" for p in parts))
        run(["-f", "concat", "-safe", "0", "-i", "build/seg/tmp.txt", "-c", "copy", out])
        segs.append(out); i += 1; ai += 1
    else:
        s = scene_of[i]
        j = i
        while j < len(P) and not P[j]["tag"].startswith("ARCHIVE") and scene_of.get(j) == s:
            j += 1
        dur = starts[j] - starts[i]
        src = render_of(s)
        if src:
            off = starts[i] - scene_t0[s] if i else 0.0
            run(["-ss", f"{max(off, 0):.3f}", "-i", src, "-t", f"{dur:.3f}", "-vf", "tpad=stop_mode=clone:stop_duration=3", "-t", f"{dur:.3f}", *ENC, out])
        else:
            missing.append(f"render {s}")
            card(f"MAP SCENE '{s}' NOT RENDERED YET", f"build/cards/m{i}.png")
            run(["-loop", "1", "-i", f"build/cards/m{i}.png", "-t", f"{dur:.3f}", *ENC, out])
        segs.append(out); i = j

if not AUDIO_ONLY:
    open("build/seg/list.txt", "w").write("".join(f"file '{os.path.abspath(s)}'\n" for s in segs))
    run(["-f", "concat", "-safe", "0", "-i", "build/seg/list.txt", "-c", "copy", "build/video_only.mp4"])

# ---------- audio (locked, copied from goosegreen/tools/assemble_full.py): voice + ducked SFX + ducked music -> -14 LUFS ----------
total = DUR
subprocess.run([sys.executable, "tools/sfx_cues.py"], check=True)
subprocess.run([sys.executable, "tools/sfx_mix.py"], check=True)
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
name = "build/smith-full.mp4"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "build/video_only.mp4", "-i", "build/mix.wav", "-af", af, "-map", "0:v", "-map", "1:a",
                "-t", f"{total:.2f}", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", name], check=True)
mmss = lambda s: f"{int(s // 60)}:{int(s % 60):02d}"
cidx = {key(p): n for n, p in enumerate(P)}
open("build/chapters.txt", "w").write("".join(f"{'0:00' if n == 0 else mmss(P[cidx[t]]['start'])} {title}\n" for n, (t, title) in enumerate(CHAPTERS)))
print("wrote", name, round(total, 1), "s")
print("missing video:", missing or "none")
