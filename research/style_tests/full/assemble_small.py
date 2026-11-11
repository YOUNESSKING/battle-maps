"""Small test clip of s12d_full2 (scene s 6-26 = the five-battle clock + the Big Black): video slice + the matching voice slice, the locked
music bed (0.08, sidechain ducking) and the scene's own SFX cues at the LOCKED levels (grant/tools/sfx_mix_lib.render, check_sound_lock),
the same amix/alimiter chain and two-pass loudnorm to -14 LUFS as research/style_tests/script12/assemble_s12.py. No ref:* cues; unseen
artillery (fire/impact) dropped (STYLE_LOCK 1c rule 4: s12d is not a visible-guns scene).
usage: python3 research/style_tests/full/assemble_small.py [T0 T1]   (scene seconds, default 6 26)"""
import glob, html, json, os, re, subprocess, sys
G = "/home/user/battle-maps/grant"; HERE = os.path.dirname(os.path.abspath(__file__)); B = f"{HERE}/build"
S12 = "/home/user/battle-maps/research/style_tests/script12"
sys.path.insert(0, f"{G}/tools"); os.chdir(G)
SC = "s12d_full2"
T0, T1 = (float(sys.argv[1]), float(sys.argv[2])) if len(sys.argv) > 2 else (6.0, 26.0)
D = T1 - T0
os.makedirs(B, exist_ok=True)
st = json.loads(open(f"scenes/{SC}/timing.js").read().split("=", 1)[1].strip().rstrip(";"))
A0 = st["abs_start"] + T0                       # absolute time in the test voice / music
VID = f"{B}/small_video.mp4"
PRE = f"scenes/{SC}/renders/{SC}_{T0:g}_{T1:g}.mp4"   # rendered with hyperframes render --start T0 --end T1 (clip starts at 0)
SRC = ["-i", PRE] if os.path.exists(PRE) else ["-ss", f"{T0:.3f}", "-i", f"scenes/{SC}/renders/{SC}.mp4"]
subprocess.run(["ffmpeg", "-v", "error", "-y", *SRC, "-t", f"{D:.3f}",
                "-vf", "scale=1920:1080,fps=30", "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p", "-an", VID], check=True)
CHROME = glob.glob("/root/.cache/hyperframes/chrome/chrome-headless-shell/*/chrome-headless-shell-linux64/chrome-headless-shell")[0]
dom = subprocess.run([CHROME, "--headless", "--no-sandbox", "--disable-gpu", "--allow-file-access-from-files", "--virtual-time-budget=3000",
                      "--dump-dom", "file://" + os.path.abspath(f"scenes/{SC}/index.html")], capture_output=True, text=True, timeout=180).stdout
m = re.search(r'<html[^>]*data-sfx="([^"]*)"', dom)
cues, drop = [], 0
for kind, t in (json.loads(html.unescape(m.group(1))) if m else []):
    if not (T0 <= t <= T1) or kind.startswith("ref:"): continue
    if kind in ("fire", "impact"): drop += 1; continue
    cues.append([round(t - T0, 2), kind, SC])
cues.sort(); json.dump(cues, open(f"{B}/sfx_cues.json", "w"), indent=0)
print("cues", cues, "unseen artillery dropped", drop)
import sfx_mix_lib as M
M.render(cues, D, f"{B}/sfx.wav")
subprocess.run(["python3", "tools/check_sound_lock.py"], check=True)
MUSIC_VOL = 0.08
f = [f"[0:a]atrim={A0:.3f}:{A0 + D:.3f},asetpts=PTS-STARTPTS,aresample=48000,asplit=3[vo][key][key2]", "[1:a]aresample=48000[sfxin]",
     "[sfxin][key2]sidechaincompress=threshold=0.03:ratio=3:attack=10:release=300[sfx]",
     f"[2:a]atrim={A0:.3f}:{A0 + D:.3f},asetpts=PTS-STARTPTS,aresample=48000,volume={MUSIC_VOL},afade=t=in:d=1,afade=t=out:st={D - 2}:d=2[mus]",
     "[mus][key]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[musd]",
     "[vo][musd][sfx]amix=inputs=3:normalize=0,alimiter=limit=0.5:level=false[aout]"]
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{S12}/audio/voice.wav", "-i", f"{B}/sfx.wav", "-stream_loop", "-1", "-i", "assets/media/music.wav",
                "-filter_complex", ";".join(f), "-map", "[aout]", "-t", f"{D:.2f}", "-c:a", "pcm_s16le", f"{B}/mix.wav"], check=True)
LN = "loudnorm=I=-14:TP=-1.5:LRA=11"
r = subprocess.run(["ffmpeg", "-nostats", "-i", f"{B}/mix.wav", "-af", LN + ":print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
mm = json.loads(r[r.rindex("{"):r.rindex("}") + 1])
af = (f"{LN}:measured_I={mm['input_i']}:measured_TP={mm['input_tp']}:measured_LRA={mm['input_lra']}:measured_thresh={mm['input_thresh']}:offset={mm['target_offset']}:linear=true,aresample=48000")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", VID, "-i", f"{B}/mix.wav", "-af", af, "-map", "0:v", "-map", "1:a", "-t", f"{D:.2f}",
                "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", f"{HERE}/small_test.mp4"], check=True)
print("wrote", f"{HERE}/small_test.mp4", D)
