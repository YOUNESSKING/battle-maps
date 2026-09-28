"""Assemble the full Smith video: map renders + archive film/photos + voice + music.

usage (from smith/): python3 tools/assemble_full.py [--preview]
- Map paragraphs are cut from scenes/<scene>/renders/*.mp4 (scene list = SCENES below, same as MAPS_BRIEF.md).
  A missing render becomes a placeholder card so the cut can still be reviewed.
- Archive paragraphs use ARCHIVE[tag-number] = list of media: "film:NAME" (assets/film/clips/NAME.mp4)
  or "photo:FILE" (assets/media/FILE, slow Ken Burns). Duration is split evenly between the items.
- Audio: voice + music bed (assets/media/music.* if present, ducked under the voice) -> loudnorm -14 LUFS.
Writes build/smith-full.mp4 (1080p master) and build/smith-preview-720p.mp4 (< 30 MB for chat).
"""
import glob, json, os, random, subprocess, sys
from PIL import Image, ImageFilter, ImageDraw, ImageFont

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
os.chdir(ROOT)
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


def render_of(scene):
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

open("build/seg/list.txt", "w").write("".join(f"file '{os.path.abspath(s)}'\n" for s in segs))
run(["-f", "concat", "-safe", "0", "-i", "build/seg/list.txt", "-c", "copy", "build/video_only.mp4"])

# ---------- audio ----------
music = next(iter(sorted(glob.glob("assets/media/music.*"))), None)
inputs = ["-i", "build/video_only.mp4", "-i", "audio/voice.wav"]
f = ["[1:a]aresample=48000,asplit=2[vo][vokey]"]
mix = ["[vo]"]
if music:
    inputs += ["-stream_loop", "-1", "-i", music]
    f.append(f"[2:a]aresample=48000,atrim=0:{DUR + 1},volume=0.35,afade=t=in:d=2,afade=t=out:st={DUR - 3}:d=3[mus]")
    f.append("[mus][vokey]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[musd]")
    mix.append("[musd]")
else:
    f[0] = "[1:a]aresample=48000[vo]"
f.append(f"{''.join(mix)}amix=inputs={len(mix)}:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[aout]")
run([*inputs, "-filter_complex", ";".join(f), "-map", "0:v", "-map", "[aout]", "-t", f"{DUR:.2f}",
     "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "build/smith-full.mp4"])
kbps = int(27 * 8 * 1024 / DUR) - 96  # fit the preview under ~27 MB
run(["-i", "build/smith-full.mp4", "-vf", "scale=1280:720", "-c:v", "libx264", "-preset", "medium", "-b:v", f"{kbps}k",
     "-maxrate", f"{kbps * 2}k", "-bufsize", f"{kbps * 4}k", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", "build/smith-preview-720p.mp4"])
print("wrote build/smith-full.mp4 + build/smith-preview-720p.mp4", round(DUR, 1), "s", "music" if music else "NO MUSIC")
print("missing:", missing or "none")
