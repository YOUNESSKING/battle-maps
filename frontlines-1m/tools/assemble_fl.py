"""Assemble the Frontlines 1-min test: scenes + archive film -> build/frontlines-1m-test.mp4 (1080p, ~-14 LUFS).
Music: Kevin MacLeod "Five Armies" (incompetech, CC BY 4.0) from 1:00, ducked under the voice (Frontlines-style: prominent score)."""
import json, subprocess
T = json.load(open("audio/timing.json")); P = T["paragraphs"]; END = P[-1]["end"] + 2.4
st = {p["tag"].split("|")[0].split(":")[1].strip(): p["start"] for p in P}
run = lambda a: subprocess.run(a, check=True)
# 1. picture: globe (padded to start at 0), terrain, film f-1, f-2, river
segs = ["scenes/globe/renders/globe.mp4", "scenes/corridor_m/renders/corridor_m.mp4", "build/f-1.mp4", "build/f-2.mp4", "scenes/river_m/renders/river_m.mp4"]
inp = sum([["-i", s] for s in segs], [])
fc = f"[0:v]fps=30,format=yuv420p,tpad=start_duration={st['g-1']}:start_mode=clone[v0];" + "".join(f"[{i}:v]fps=30,format=yuv420p,setsar=1[v{i}];" for i in range(1, 5)) + "[v0][v1][v2][v3][v4]concat=n=5:v=1:a=0[v]"
run(["ffmpeg", "-v", "error", "-y", *inp, "-filter_complex", fc, "-map", "[v]", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "build/video.mp4"])
# 2. sound effects: cues from the scenes + film sound design (aircraft over the drop, the gun, distant fire over the boats)
run(["python3", "tools/sfx_cues.py"])
cues = json.load(open("build/sfx_cues.json"))
f1, f2 = st["f-1"], st["f-2"]
cues += [[round(t, 2), k, "film"] for k, t in [("prop", f1 + 0.2), ("static", f1 + 1.0), ("impact", f1 + 6.4), ("impact", f1 + 7.6), ("mg", f2 + 8.0), ("impact", f2 + 9.6)]]
json.dump(sorted(cues), open("build/sfx_cues.json", "w"))
run(["python3", "tools/sfx_mix.py"])
# 3. mix: EXACTLY the channel's locked chain (gavin/tools/assemble_full.py + finalize.sh): raw voice, SFX at the locked levels ducked
#    under the voice, music at MUSIC_VOL 0.08 ducked, limiter 0.5; then the gain + limiter pass to ~-14 LUFS (gain measured, as in finalize)
MUSIC_VOL = 0.08
MATCH = 10 ** ((-19.7 - -11.8) / 20)  # bring Five Armies (-11.8 LUFS from 1:00) to the channel bed's loudness (gavin music.wav, -19.7 LUFS) first
f = ["[0:a]aresample=48000,asplit=3[vo][key][key2]", "[1:a]aresample=48000[sfxin]",
     "[sfxin][key2]sidechaincompress=threshold=0.03:ratio=3:attack=10:release=300[sfx]",
     f"[2:a]aresample=48000,atrim=start=60,asetpts=PTS-STARTPTS,atrim=0:{END},volume={MUSIC_VOL * MATCH:.4f},afade=t=in:d=2,afade=t=out:st={END - 3}:d=3[mus]",
     "[mus][key]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[musd]",
     "[vo][musd][sfx]amix=inputs=3:normalize=0,alimiter=limit=0.5:level=false[aout]"]
run(["ffmpeg", "-v", "error", "-y", "-i", "audio/voice.wav", "-i", "build/sfx.wav", "-i", "assets/media/music_five_armies.mp3", "-filter_complex", ";".join(f),
     "-map", "[aout]", "-t", f"{END:.2f}", "-c:a", "pcm_s16le", "build/mix_raw.wav"])
r = subprocess.run(["ffmpeg", "-nostats", "-i", "build/mix_raw.wav", "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
I = float(r[r.rindex("I:"):].split()[1]); gain = round(-14.4 - I + 0.6, 1)  # +0.6: the limiter takes back ~0.6 dB
for _ in range(3):  # the limiter eats a variable amount: measure the result and correct the gain until ~-14.3 LUFS
    run(["ffmpeg", "-v", "error", "-y", "-i", "build/mix_raw.wav", "-af", f"volume={gain}dB,alimiter=limit=0.8:attack=2:release=80:level=false,aresample=48000", "-c:a", "pcm_s16le", "build/mix.wav"])
    r = subprocess.run(["ffmpeg", "-nostats", "-i", "build/mix.wav", "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
    got = float(r[r.rindex("I:"):].split()[1])
    if abs(got + 14.3) < 0.25: break
    gain = round(gain + (-14.3 - got), 1)
print("raw mix", I, "LUFS, gain", gain, "dB")
run(["ffmpeg", "-v", "error", "-y", "-i", "build/video.mp4", "-i", "build/mix.wav", "-map", "0:v", "-map", "1:a", "-t", str(END), "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
     "-movflags", "+faststart", "build/merge-1m-test.mp4"])
print("wrote build/merge-1m-test.mp4", END)
