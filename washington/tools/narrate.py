"""Vicksburg narration: Kokoro am_michael per paragraph -> audio/voice.wav + audio/timing.json (paragraph start/end, section = scene).
Then tools/words.py adds word times (faster-whisper alignment) and tools/voice_a.sh converts to voice A (same timing).
usage (from anywhere): python3 vicksburg/tools/narrate.py [voice] [speed] [only_section]"""
import json, os, re, sys
import numpy as np, soundfile as sf
sys.path.insert(0, "/home/user/battle-maps/grant/tools")
from kokoro_onnx import Kokoro
import tts_names
from tts_names import speak
tts_names.PHON.update({"Villeré": "vˈɪləɹˌeɪ", "Pakenham": "pˈeɪkənəm", "Tohopeka": "tˌoʊhəpˈiːkə", "Tallapoosa": "tˌæləpˈuːsə",
    "Baratarians": "bˌæɹətˈɛɹiənz", "Lafitte": "ləfˈiːt", "Borgne": "bˈɔːɹn"})
# this video's names (exact Kokoro phonemes where the default is wrong; ear-checked via the whisper round trip in words.py)
# default Kokoro phonemes checked 2026-11-18: Bruinsburg, Pemberton, McClernand, Vicksburg fine; Tilghman + Grierson fixed in tts_names
VOICE = sys.argv[1] if len(sys.argv) > 1 else "am_michael"
SPEED = float(sys.argv[2]) if len(sys.argv) > 2 else 1.0
ONLY = sys.argv[3] if len(sys.argv) > 3 else None
SAY = {}
V = "/home/user/battle-maps/washington"; OUT = f"{V}/audio"
GAP_PARA, GAP_SECTION, HEAD = 0.55, 1.4, 0.4

os.chdir("/home/user/battle-maps/tts")
k = Kokoro("kokoro-v1.0.onnx", "voices-v1.0.bin")
text = open(f"{V}/script.md").read()
sections = text.split("\n## ")[1:]
sr, chunks, timing, t = 24000, [np.zeros(int(24000 * HEAD), np.float32)], [], HEAD
for sec in sections:
    name = sec.split("\n")[0]; sid = name.split()[0]
    if ONLY and sid != ONLY: continue
    s0 = t
    for p in sec.split("\n\n"):
        if not p.startswith("[S"): continue
        tag = re.match(r"^\[([^\]]*)\]", p).group(1)
        spoken = re.sub(r"^\[[^\]]*\]\s*", "", p).strip()
        say = spoken
        for a, b in SAY.items(): say = say.replace(a, b)
        audio, sr = speak(k, say, VOICE, SPEED)
        audio = audio.astype(np.float32); dur = len(audio) / sr
        timing.append({"section": sid, "tag": tag, "start": round(t, 3), "end": round(t + dur, 3), "text": spoken})
        chunks += [audio, np.zeros(int(sr * GAP_PARA), np.float32)]; t += dur + GAP_PARA
        print(f"{t:7.1f}s  {sid} {tag[:50]}", flush=True)
    chunks.append(np.zeros(int(sr * (GAP_SECTION - GAP_PARA)), np.float32)); t += GAP_SECTION - GAP_PARA
    print(f"== {sid} {s0:.1f}-{t:.1f} ({t - s0:.1f} s)", flush=True)
os.makedirs(OUT, exist_ok=True)
sfx = f"_{ONLY}" if ONLY else ""
sf.write(f"{OUT}/voice{sfx}.wav", np.concatenate(chunks), sr)
words = sum(len(p["text"].split()) for p in timing)
json.dump({"voice": VOICE, "speed": SPEED, "duration": round(t, 3), "wpm": round(words / (t / 60), 1), "paragraphs": timing},
          open(f"{OUT}/timing{sfx}.json", "w"), indent=1)
print("total", round(t, 1), "s", "wpm", round(words / (t / 60), 1))
