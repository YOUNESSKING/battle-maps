"""Assemble the Frontlines 1-min test: scenes + archive film -> build/frontlines-1m-test.mp4 (1080p, ~-14 LUFS).
Music: Kevin MacLeod "Five Armies" (incompetech, CC BY 4.0) from 1:00, ducked under the voice (Frontlines-style: prominent score)."""
import json, subprocess
T = json.load(open("audio/timing.json")); P = T["paragraphs"]; END = P[-1]["end"] + 2.4
st = {p["tag"].split("|")[0].split(":")[1].strip(): p["start"] for p in P}
run = lambda a: subprocess.run(a, check=True)
# 1. picture: globe (padded to start at 0), terrain, film f-1, f-2, river
segs = ["scenes/globe/renders/globe.mp4", "scenes/corridor/renders/corridor.mp4", "build/f-1.mp4", "build/f-2.mp4", "scenes/river2d/renders/river2d.mp4"]
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
# 3. mix: voice (warm EQ + light compression + small room), music ducked by the voice, sfx; master to -14 LUFS
fc = ("[0:a]aresample=48000,highpass=f=70,equalizer=f=180:t=q:w=1:g=2.5,equalizer=f=3500:t=q:w=1.2:g=1.5,acompressor=threshold=-20dB:ratio=3:attack=8:release=120,"
      "aecho=0.8:0.5:28:0.12,volume=1.6,asplit=2[vo][sc];"
      f"[1:a]aresample=48000,atrim=start=60,asetpts=PTS-STARTPTS,volume=0.17,afade=t=in:d=1.5,afade=t=out:st={END - 2.5}:d=2.5[mu];"
      "[mu][sc]sidechaincompress=threshold=0.04:ratio=5:attack=40:release=600[mud];"
      "[2:a]aresample=48000,volume=0.5[fx];"
      f"[vo][mud][fx]amix=inputs=3:normalize=0,atrim=0:{END},loudnorm=I=-14:TP=-1.5:LRA=11[a]")
run(["ffmpeg", "-v", "error", "-y", "-i", "audio/voice.wav", "-i", "assets/media/music_five_armies.mp3", "-i", "build/sfx.wav", "-filter_complex", fc, "-map", "[a]", "-c:a", "pcm_s16le", "build/mix.wav"])
run(["ffmpeg", "-v", "error", "-y", "-i", "build/video.mp4", "-i", "build/mix.wav", "-map", "0:v", "-map", "1:a", "-t", str(END), "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
     "-movflags", "+faststart", "build/frontlines-1m-test.mp4"])
print("wrote build/frontlines-1m-test.mp4", END)
