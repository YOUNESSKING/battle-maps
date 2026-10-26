"""Narration for the Frontlines 1-min test: python3 tools/narrate_fl.py [VOICE] [SPEED] -> audio/voice.wav + audio/timing.json"""
import json, re, sys, os
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
VOICE = sys.argv[1] if len(sys.argv) > 1 else "bm_george"
SPEED = float(sys.argv[2]) if len(sys.argv) > 2 else 0.9
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
PRON = {"Nijmegen": "Nymaygen", "Waal": "Vahl"}
GAP = 0.9  # Frontlines lets the narration breathe
k = Kokoro("/home/user/battle-maps/tts/kokoro-v1.0.onnx", "/home/user/battle-maps/tts/voices-v1.0.bin")
paras = [p for p in open(f"{ROOT}/script.md").read().split("\n\n") if p.startswith("[")]
sr, chunks, timing, t = 24000, [np.zeros(int(24000 * 0.5), np.float32)], [], 0.5  # 0.5 s of globe before the first word
for p in paras:
    tag = re.match(r"^\[([^\]]*)\]", p).group(1); spoken = re.sub(r"^\[[^\]]*\]\s*", "", p).strip(); s = spoken
    for a, b in PRON.items(): s = s.replace(a, b)
    audio, sr = k.create(s, voice=VOICE, speed=SPEED, lang="en-gb" if VOICE.startswith("b") else "en-us")
    d = len(audio) / sr
    timing.append({"section": "Test", "tag": tag, "start": round(t, 2), "end": round(t + d, 2), "text": spoken})
    chunks += [audio.astype(np.float32), np.zeros(int(sr * GAP), np.float32)]; t += d + GAP
    print(f"{t:6.1f}s {tag[:50]}")
sf.write(f"{ROOT}/audio/voice.wav", np.concatenate(chunks), sr)
json.dump({"voice": VOICE, "speed": SPEED, "duration": round(t + 1.5, 2), "paragraphs": timing}, open(f"{ROOT}/audio/timing.json", "w"), indent=1)
print("total", round(t, 1))
