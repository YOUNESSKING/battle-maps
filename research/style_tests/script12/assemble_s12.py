"""Script-12 test: concatenate the rendered s12 scenes + voice + music + the scenes' SFX at the LOCKED levels -> build/s12_test.mp4.
A wrapper (the locked grant/tools/assemble_full.py reads grant/audio/timing.json and cannot be pointed at a test folder): it uses the same
locked pieces unchanged: grant/tools/sfx_mix_lib.render (KINDS levels, runs check_sound_lock), music bed volume 0.08 + sidechain ducking,
the same amix/alimiter chain and the two-pass loudnorm to -14 LUFS. REF_SOUNDS off (no ref:* cue is rendered: sfx_mix_lib only knows the
locked kinds). STYLE_LOCK 1c rule 4: fire/impact cues only for scenes with clearly visible guns (VIS_ARTY).
usage: python3 research/style_tests/script12/assemble_s12.py [--audio-only]"""
import glob, html, json, os, re, subprocess, sys
G = "/home/user/battle-maps/grant"; HERE = os.path.dirname(os.path.abspath(__file__)); B = f"{HERE}/build"
sys.path.insert(0, f"{G}/tools"); os.chdir(G)
SCENES = ["s12a", "s12b", "s12c", "s12d", "s12e"]
VIS_ARTY = {"s12b"}          # the night run past the big, lit batteries (= m2b, which is in assemble_full's _VIS_ARTY)
total = json.load(open(f"{HERE}/audio/timing.json"))["duration"]
os.makedirs(B, exist_ok=True)
VID = f"{B}/s12_video.mp4"
if "--audio-only" not in sys.argv:
    lst = f"{B}/list.txt"; open(lst, "w").write("".join(f"file '{G}/scenes/{s}/renders/{s}.mp4'\n" for s in SCENES))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-vf", "scale=1920:1080,fps=30", "-t", f"{total:.3f}",
                    "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p", "-an", VID], check=True)
CHROME = glob.glob("/root/.cache/hyperframes/chrome/chrome-headless-shell/*/chrome-headless-shell-linux64/chrome-headless-shell")[0]
cues, drop = [], 0
for s in SCENES:
    tjs = open(f"scenes/{s}/timing.js").read(); st = json.loads(tjs[tjs.index("=") + 1:].strip().rstrip(";"))
    dom = subprocess.run([CHROME, "--headless", "--no-sandbox", "--disable-gpu", "--allow-file-access-from-files", "--virtual-time-budget=3000",
                          "--dump-dom", "file://" + os.path.abspath(f"scenes/{s}/index.html")], capture_output=True, text=True, timeout=180).stdout
    m = re.search(r'<html[^>]*data-sfx="([^"]*)"', dom)
    n = 0
    for kind, t in (json.loads(html.unescape(m.group(1))) if m else []):
        if not (0 <= t <= st["duration"]) or kind.startswith("ref:"): continue
        if kind in ("fire", "impact") and s not in VIS_ARTY: drop += 1; continue
        cues.append([round(st["abs_start"] + t, 2), kind, s]); n += 1
    print(f"{s}: {n} cues")
cues.sort(); json.dump(cues, open(f"{B}/sfx_cues.json", "w"), indent=0)
print("unseen artillery cues dropped:", drop)
import sfx_mix_lib as M
M.render(cues, total, f"{B}/sfx.wav")
subprocess.run(["python3", "tools/check_sound_lock.py"], check=True)
MUSIC_VOL = 0.08
f = ["[0:a]aresample=48000,asplit=3[vo][key][key2]", "[1:a]aresample=48000[sfxin]", "[sfxin][key2]sidechaincompress=threshold=0.03:ratio=3:attack=10:release=300[sfx]",
     f"[2:a]aresample=48000,atrim=0:{total},volume={MUSIC_VOL},afade=t=in:d=2,afade=t=out:st={total - 3}:d=3[mus]",
     "[mus][key]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[musd]",
     "[vo][musd][sfx]amix=inputs=3:normalize=0,alimiter=limit=0.5:level=false[aout]"]
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{HERE}/audio/voice.wav", "-i", f"{B}/sfx.wav", "-stream_loop", "-1", "-i", "assets/media/music.wav",
                "-filter_complex", ";".join(f), "-map", "[aout]", "-t", f"{total:.2f}", "-c:a", "pcm_s16le", f"{B}/mix.wav"], check=True)
LN = "loudnorm=I=-14:TP=-1.5:LRA=11"
r = subprocess.run(["ffmpeg", "-nostats", "-i", f"{B}/mix.wav", "-af", LN + ":print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
m = json.loads(r[r.rindex("{"):r.rindex("}") + 1])
af = (f"{LN}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,aresample=48000")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", VID, "-i", f"{B}/mix.wav", "-af", af, "-map", "0:v", "-map", "1:a", "-t", f"{total:.2f}",
                "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", f"{B}/s12_test.mp4"], check=True)
print("wrote", f"{B}/s12_test.mp4", total)
