"""Assemble the full Greene video: map renders + Ken Burns archive clips + voice + ducked music + SFX.

usage: cd greene && python3 tools/assemble_full.py [--preview]
Writes build/greene-full-1080p.mp4 (master) and build/greene-preview-720p.mp4; chapters -> build/chapters.txt.
Map runs: a scene named after the first tag of every contiguous run of MAP paragraphs (scenes/NAME/renders/NAME.mp4).
Archive paragraphs: ARCHIVE[key] below (image, move, credit or quote).
"""
import json, os, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from kenburns import kenburns

M = "assets/media"
ARCHIVE = json.load(open("tools/archive_map.json"))  # key -> {"file", "move", "credit", "quote": [text, who] | null}
MUSIC = json.load(open("tools/music_map.json"))      # [{"file", "from_tag", "vol"}]: bed starting at that paragraph
SFX = json.load(open("tools/sfx_map.json"))          # [{"file", "tag", "phrase" | "off", "vol"}]

FILE_CREDIT = {"washington.jpg": "George Washington, by Charles Willson Peale", "morgan.jpg": "Daniel Morgan, by Charles Willson Peale",
               "otho_williams.jpg": "Otho Holland Williams, by Charles Willson Peale", "tarleton.jpg": "Banastre Tarleton, by Joshua Reynolds (1782)",
               "cornwallis.jpg": "Charles, Earl Cornwallis, by Thomas Gainsborough (1783)", "greene.jpg": "Nathanael Greene, by Charles Willson Peale"}
T = json.load(open("audio/timing.json"))
P, total = T["paragraphs"], T["duration"]
key = lambda p: p["tag"].split("|")[0].split(":", 1)[1].strip()
kind = lambda p: p["tag"].split(":")[0]
starts = [0.0] + [p["start"] for p in P[1:]] + [total]
os.makedirs("build/seg", exist_ok=True)
enc = ["-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-r", "30", "-an"]

AUDIO_ONLY = os.environ.get("AUDIO_ONLY") == "1"
segs, i, missing = [], 0, []
while i < len(P) and not AUDIO_ONLY:
    k = key(P[i])
    out = f"build/seg/{i:02d}.mp4"
    if kind(P[i]) == "ARCHIVE":
        dur = starts[i + 1] - starts[i]
        a = dict(ARCHIVE[k])
        if isinstance(a["file"], list):
            pick = next((x for x in a["file"] if os.path.exists(f"{M}/{x}")), a["file"][-1])
            if pick != a["file"][0]:
                a["credit"] = FILE_CREDIT.get(pick, "")
            a["file"] = pick
        if not os.path.exists(out) or os.path.getmtime(out) < os.path.getmtime("tools/archive_map.json"):
            kenburns(f"{M}/{a['file']}", out, dur, a.get("move", "in"), a.get("credit", ""), a.get("quote"))
        segs.append(out); i += 1
        continue
    j = i
    while j < len(P) and kind(P[j]) == "MAP" and (j == i or not os.path.isdir(f"scenes/{key(P[j])}")):
        j += 1  # a run ends at the next archive paragraph or where the next scene starts
    dur = starts[j] - starts[i]
    src = f"scenes/{k}/renders/{k}.mp4"
    if not os.path.exists(src):
        missing.append(k)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", f"color=c=0x1a1712:s=1920x1080:d={dur:.3f}", *enc, out], check=True)
    else:
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-vf", "tpad=stop_mode=clone:stop_duration=3,fps=30", "-t", f"{dur:.3f}", *enc, out], check=True)
    segs.append(out); i = j
if missing:
    print("MISSING map renders (black placeholders):", missing)

if not AUDIO_ONLY:
    open("build/seg/list.txt", "w").write("".join(f"file '{os.path.abspath(s)}'\n" for s in segs))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", "build/seg/list.txt", "-c", "copy", "build/video-only.mp4"], check=True)


def t_of(tag, phrase=None, off=0.0):
    p = next(p for p in P if key(p) == tag)
    if phrase:
        i = p["text"].index(phrase)
        return p["start"] + (p["end"] - p["start"]) * i / len(p["text"]) + off
    return p["start"] + off


# ---------- audio ----------
inputs = ["-i", "build/video-only.mp4", "-i", "audio/voice.wav"]
f = ["[1:a]aresample=48000,pan=stereo|c0=c0|c1=c0,asplit=2[vo][vokey]"]
beds, n = [], 2
for bi, b in enumerate(MUSIC):
    t0 = t_of(b["from_tag"], off=b.get("off", -1.0)) if b["from_tag"] != "START" else 0.0
    t1 = t_of(MUSIC[bi + 1]["from_tag"], off=MUSIC[bi + 1].get("off", -1.0)) if bi + 1 < len(MUSIC) else total + 2
    t0 = max(t0, 0)
    d = t1 - t0 + 1.5
    inputs += ["-stream_loop", "-1", "-i", f"{M}/{b['file']}"]
    f.append(f"[{n}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:{d:.2f},asetpts=PTS-STARTPTS,volume={b.get('vol', 0.5)},"
             f"afade=t=in:d=1.5,afade=t=out:st={d - 2.5:.2f}:d=2.5,adelay={int(t0 * 1000)}|{int(t0 * 1000)}[m{bi}]")
    beds.append(f"[m{bi}]"); n += 1
mix = ["[vo]"]
if beds:
    f.append(f"{''.join(beds)}amix=inputs={len(beds)}:normalize=0[mus]")
    f.append("[mus][vokey]sidechaincompress=threshold=0.02:ratio=10:attack=20:release=600[musd]")
    mix.append("[musd]")
for si, s in enumerate(SFX):
    t = t_of(s["tag"], s.get("phrase"), s.get("off", 0.0))
    inputs += ["-i", f"{M}/{s['file']}"]
    f.append(f"[{n}:a]aresample=48000,aformat=channel_layouts=stereo,"
             + (f"atrim=0:{s['dur']},afade=t=out:st={s['dur'] - 2}:d=2," if s.get("dur") else "")
             + f"volume={s.get('vol', 0.5)},adelay={int(t * 1000)}|{int(t * 1000)}[s{si}]")
    mix.append(f"[s{si}]"); n += 1
f.append(f"{''.join(mix)}amix=inputs={len(mix)}:normalize=0,atrim=0:{total:.2f},loudnorm=I=-14:TP=-1.5:LRA=11[aout]")
subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(f), "-map", "0:v", "-map", "[aout]",
                "-t", f"{total:.2f}", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart",
                "build/greene-full-1080p.mp4"], check=True)
if not AUDIO_ONLY:
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "build/greene-full-1080p.mp4", "-vf", "scale=1280:720", "-c:v", "libx264", "-crf", "30",
                "-preset", "medium", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", "build/greene-preview-720p.mp4"], check=True)

# chapters for the YouTube description
fmt = lambda s: f"{int(s // 60)}:{int(s % 60):02d}"
chap, seen = [], set()
names = {"HOOK": "Intro", "ENDING": "Legacy"}
for p in P:
    sec = p["section"]
    if sec not in seen:
        seen.add(sec)
        chap.append(f"{fmt(0 if not chap else p['start'])} {names.get(sec, sec.title().replace('Move', 'Move'))}")
open("build/chapters.txt", "w").write("\n".join(chap) + "\n")
print("done", round(total, 1), "s; missing:", missing)
