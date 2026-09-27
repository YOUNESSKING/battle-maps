"""Assemble the full Belisarius video: map renders + archive Ken Burns shots + voice + music + SFX.

usage (from belisarius/): python3 tools/assemble_full.py [--preview]
writes build/video.mp4 (picture only), build/belisarius-1080p.mp4 (master) and build/belisarius-720p.mp4 (preview).
Missing map renders or archive images become placeholder cards, so the cut always assembles.
"""
import json, os, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H, FPS = 1920, 1080, 30
T = json.load(open("audio/timing.json"))
P = T["paragraphs"]
key = lambda p: p["tag"].split("|")[0].replace("MAP:", "").replace("ARCHIVE:", "").strip()
starts = [0.0] + [p["start"] for p in P[1:]] + [T["duration"]]

# map scenes: first paragraph tag -> scene name (render at scenes/NAME/renders/NAME.mp4)
SCENES = {"hook-rome": "hook-rome", "hook-empire": "hook-empire", "dara-1": "dara-region", "dara-2": "dara",
          "tricam-1": "tricam-fleet", "tricam-2": "tricam-africa", "tricam-3": "tricam", "tricam-11": "tricam-recap",
          "rome-1": "rome-italy", "rome-2": "rome", "rome-10": "rome-raid", "rome-11": "rome-recap",
          "ending-ravenna": "ending-ravenna", "ending-method": "ending-method"}

# archive paragraphs in order: list of shots (image, start box, end box); boxes = (cx, cy, zoom) in image fractions,
# zoom 1 = the largest 16:9 crop that fits. A paragraph's time is split evenly between its shots.
ARCHIVE = [
    [("sanvitale.jpg", (0.5, 0.5, 1.0), (0.39, 0.27, 2.3))],                      # hook: San Vitale, push in on Belisarius
    [("cataphract.jpg", (0.5, 0.5, 1.0), (0.5, 0.5, 1.12), "fit"),
     ("justinian_coin.jpg", (0.5, 0.5, 1.0), (0.5, 0.5, 1.2), "fit")],           # hook: cavalry + coin
    [("skylitzes.jpg", (0.5, 0.5, 1.0), (0.45, 0.5, 1.15), "fit")],                # after Dara
    [("gelimer.jpg", (0.5, 0.5, 1.0), (0.5, 0.45, 1.15), "fit")],                  # Gelimer captured (Knackfuss)
    [("david.jpg", (0.5, 0.5, 1.0), (0.66, 0.4, 1.6))],                            # David, Belisarius begging
    [("sanvitale.jpg", (0.39, 0.25, 2.3), (0.39, 0.23, 2.7))],                     # San Vitale detail, slow drift
]
ENC = ["-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-r", str(FPS), "-an"]


def font(size):
    return ImageFont.truetype("tools/oswald-latin-700-normal.ttf", size)


def card(text, out):
    im = Image.new("RGB", (W, H), (38, 34, 28))
    d = ImageDraw.Draw(im)
    d.multiline_text((W / 2, H / 2), text, font=font(44), fill=(226, 212, 176), anchor="mm", align="center")
    im.save(out)


def kenburns(shots, dur, out):
    """Smooth sub-pixel Ken Burns via PIL EXTENT transforms, piped to ffmpeg."""
    n = int(round(dur * FPS))
    per = [n // len(shots)] * len(shots); per[-1] += n - sum(per)
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
                          "-r", str(FPS), "-i", "-", *ENC, out], stdin=subprocess.PIPE)
    vign = np.asarray(Image.open("assets/vignette.png"), np.float32)[..., None] / 255 if os.path.exists("assets/vignette.png") else None
    for shot, k in zip(shots, per):
        img, a, b = shot[:3]
        path = f"assets/archive/{img}"
        if not os.path.exists(path):
            card(f"[ARCHIVE]\n{img}", "build/tmp_card.png"); path = "build/tmp_card.png"
        im = Image.open(path).convert("RGB")
        if len(shot) > 3 and shot[3] == "fit":
            im = fit_canvas(im)
        iw, ih = im.size
        bw0 = min(iw, ih * W / H)  # largest 16:9 crop width
        for f in range(k):
            s = f / max(k - 1, 1)
            s = s * s * (3 - 2 * s) * 0.6 + s * 0.4  # gentle ease
            cx, cy, z = (a[i] + (b[i] - a[i]) * s for i in range(3))
            bw = bw0 / z; bh = bw * H / W
            x0 = min(max(cx * iw - bw / 2, 0), iw - bw); y0 = min(max(cy * ih - bh / 2, 0), ih - bh)
            fr = np.asarray(im.transform((W, H), Image.EXTENT, (x0, y0, x0 + bw, y0 + bh), Image.BICUBIC), np.float32)
            if vign is not None:
                fr = fr * vign
            fade = min(1.0, f / 6, (k - 1 - f) / 6) if len(shots) > 1 else 1.0
            p.stdin.write((fr * fade).clip(0, 255).astype(np.uint8).tobytes())
    p.stdin.close(); p.wait()


def fit_canvas(im):
    """Whole image on a blurred, darkened copy of itself (for small or oddly shaped images)."""
    CW, CH = W * 2, H * 2
    iw, ih = im.size
    sc = max(CW / iw, CH / ih)
    bg = im.resize((int(iw * sc) + 1, int(ih * sc) + 1), Image.BILINEAR)
    bg = bg.crop(((bg.width - CW) // 2, (bg.height - CH) // 2, (bg.width - CW) // 2 + CW, (bg.height - CH) // 2 + CH))
    bg = Image.eval(bg.filter(ImageFilter.GaussianBlur(40)), lambda v: int(v * 0.4))
    sc = min(CW * 0.92 / iw, CH * 0.9 / ih)
    fg = im.resize((int(iw * sc), int(ih * sc)), Image.LANCZOS)
    bg.paste(fg, ((CW - fg.width) // 2, (CH - fg.height) // 2))
    return bg


def vignette():
    if os.path.exists("assets/vignette.png"):
        return
    y, x = np.mgrid[0:H, 0:W]
    r = np.hypot((x - W / 2) / (W / 2), (y - H / 2) / (H / 2))
    Image.fromarray((255 * (1 - 0.35 * np.clip(r - 0.55, 0, 1) ** 1.5)).astype(np.uint8)).save("assets/vignette.png")


def video():
    os.makedirs("build/seg", exist_ok=True)
    vignette()
    segs, i, ai = [], 0, 0
    while i < len(P):
        dur = starts[i + 1] - starts[i]
        out = f"build/seg/{i:02d}.mp4"
        if P[i]["tag"].startswith("ARCHIVE"):
            kenburns(ARCHIVE[ai], dur, out); ai += 1; i += 1
        else:
            name = SCENES[key(P[i])]
            j = i + 1
            while j < len(P) and not P[j]["tag"].startswith("ARCHIVE") and key(P[j]) not in SCENES:
                j += 1
            dur = starts[j] - starts[i]
            src = f"scenes/{name}/renders/{name}.mp4"
            if os.path.exists(src):
                subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-vf",
                                f"scale={W}:{H},tpad=stop_mode=clone:stop_duration=3", "-t", f"{dur:.3f}", *ENC, out], check=True)
            else:
                card(f"[MAP SCENE MISSING]\n{name}", "build/tmp_card.png")
                subprocess.run(["ffmpeg", "-v", "error", "-y", "-loop", "1", "-i", "build/tmp_card.png", "-t", f"{dur:.3f}", *ENC, out], check=True)
            i = j
        segs.append(out)
        print(f"{starts[i]:7.1f}s  {out}", flush=True)
    open("build/seg/list.txt", "w").write("".join(f"file '{os.path.abspath(s)}'\n" for s in segs))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", "build/seg/list.txt", "-c", "copy",
                    "build/video.mp4"], check=True)


def at(tag, off=0.0):
    return next(p["start"] for p in P if key(p) == tag) + off


MUSIC_LUFS = -42.0  # music bed level before ducking; the raw voice is about -24 LUFS, so the bed sits ~18 dB under it


def lufs(path):
    out = subprocess.run(["ffmpeg", "-i", path, "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
    return float(out.rsplit("I:", 1)[1].split("LUFS")[0])


MIN_GAP_DB = 15.0  # the ducked music + SFX bed must sit at least this far under the voice in every section


def check_balance(bed="build/bed.wav", voice="audio/voice.wav"):
    """Fail the build if the music/SFX bed is too loud. The mix writes the ducked bed on its own to build/bed.wav,
    so bed and voice are measured directly, per section (each section has its own music track)."""
    def sec_lufs(f, a, b):
        out = subprocess.run(["ffmpeg", "-ss", f"{a:.2f}", "-t", f"{b - a:.2f}", "-i", f, "-af", "ebur128", "-f", "null", "-"],
                             capture_output=True, text=True).stderr
        return float(out.rsplit("I:", 1)[1].split("LUFS")[0])
    marks = [0, at("dara-1"), at("tricam-1"), at("rome-1"), at("ending-ravenna"), T["duration"]]
    bad = []
    for a, b in zip(marks, marks[1:]):
        gap = sec_lufs(voice, a, b) - sec_lufs(bed, a, b)
        print(f"balance {a:6.0f}-{b:6.0f}s: music/SFX bed is {gap:.1f} dB under the voice")
        if gap < MIN_GAP_DB:
            bad.append((round(a), round(b), round(gap, 1)))
    if bad:
        sys.exit(f"MUSIC TOO LOUD (bed less than {MIN_GAP_DB} dB under the voice) in sections {bad}: "
                 "lower MUSIC_LUFS / SFX volumes and re-run with --mix-only")


def mix():
    dur = T["duration"]
    A = "assets/audio"
    # music bed per section: (track, start, end)
    bed = [("music1.mp3", 0, at("tricam-1") - 1), ("music2.mp3", at("tricam-1") - 1, at("rome-1") - 1),
           ("music3.mp3", at("rome-1") - 1, dur + 1)]
    bed = [b for b in bed if os.path.exists(f"{A}/{b[0]}")]
    cues = [("sfx_drum.wav", 0.3, 0.5), ("sfx_whoosh.wav", at("dara-1") - 0.4, 0.4), ("sfx_drum.wav", at("dara-2") + 0.5, 0.35),
            ("sfx_horses.wav", at("dara-9", 2.0), 0.3), ("sfx_swords.wav", at("dara-11", 7.0), 0.3),
            ("sfx_whoosh.wav", at("tricam-1") - 0.4, 0.4), ("sfx_drum.wav", at("tricam-3") + 0.5, 0.35),
            ("sfx_horses.wav", at("tricam-6", 1.0), 0.3), ("sfx_swords.wav", at("tricam-8", 3.0), 0.3),
            ("sfx_whoosh.wav", at("rome-1") - 0.4, 0.4), ("sfx_drum.wav", at("rome-5") + 0.5, 0.35),
            ("sfx_arrows.wav", at("rome-6", 11.0), 0.35), ("sfx_whoosh.wav", at("ending-ravenna") - 0.4, 0.4)]
    cues = [c for c in cues if os.path.exists(f"{A}/{c[0]}")]
    inputs, f, mixes = ["-i", "build/video.mp4", "-i", "audio/voice.wav"], [], ["[vo]"]
    f.append("[1:a]aresample=48000,asplit=2[vo][vokey]")
    n = 2
    mus = []
    for k, (trk, s, e) in enumerate(bed):
        inputs += ["-stream_loop", "-1", "-i", f"{A}/{trk}"]
        d = e - s
        gain = 10 ** ((MUSIC_LUFS - lufs(f"{A}/{trk}")) / 20)
        f.append(f"[{n}:a]aresample=48000,atrim=0:{d:.2f},asetpts=PTS-STARTPTS,volume={gain:.4f},afade=t=in:d=2,"
                 f"afade=t=out:st={d - 2.5:.2f}:d=2.5,adelay={int(s * 1000)}|{int(s * 1000)}[m{k}]")
        mus.append(f"[m{k}]"); n += 1
    if mus:
        f.append(f"{''.join(mus)}amix=inputs={len(mus)}:normalize=0[mus]")
        f.append("[mus][vokey]sidechaincompress=threshold=0.02:ratio=4:attack=30:release=700[musd]")
        mixes.append("[musd]")
    else:
        f[0] = "[1:a]aresample=48000[vo]"
    for k, (name, t, vol) in enumerate(cues):
        inputs += ["-i", f"{A}/{name}"]
        f.append(f"[{n}:a]aresample=48000,volume={vol * 0.5},adelay={int(t * 1000)}|{int(t * 1000)}[s{k}]"); mixes.append(f"[s{k}]"); n += 1
    beds = mixes[1:]
    if not beds:
        f.append("anullsrc=r=48000:cl=mono,atrim=0:1[silent]"); beds = ["[silent]"]
    f.append(f"{''.join(beds)}amix=inputs={len(beds)}:normalize=0,asplit=2[bed][bedout]")
    f.append(f"[vo][bed]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000,alimiter=limit=0.82:level=false[aout]")
    subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(f), "-map", "0:v", "-map", "[aout]",
                    "-t", f"{dur:.2f}", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart",
                    "build/belisarius-1080p.mp4", "-map", "[bedout]", "-t", f"{dur:.2f}", "build/bed.wav"], check=True)
    check_balance()
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "build/belisarius-1080p.mp4", "-vf", "scale=1280:720",
                    "-c:v", "libx264", "-crf", "30", "-preset", "fast", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart",
                    "build/belisarius-720p.mp4"], check=True)
    print("music:", [b[0] for b in bed], "sfx:", len(cues))


if __name__ == "__main__":
    if "--mix-only" not in sys.argv:
        video()
    mix()
    print("done", T["duration"], "s")
