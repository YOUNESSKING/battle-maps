"""Re-voice ONLY the Marion paragraphs this test needs (Kokoro am_michael, speed 1.0, Marion name phonemes from tts/PRONUNCIATION.md)
and place each at its marion/audio/timing.json start -> marion/audio/voice.wav (film length, silence elsewhere; git-ignored).
Kokoro is deterministic, so each paragraph matches the published timing (printed: measured vs timing.json length).
usage: python3 research/style_tests/stylew_borrow/tools/voice_clip.py hook-1 hook-2 ..."""
import json, os, re, sys
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
os.chdir("/home/user/battle-maps/tts")
sys.path.insert(0, "/home/user/battle-maps/cleburne/tools")
import tts_names
tts_names.PRON = {}
tts_names.PHON = {"Santee": "sˌæntˈiː", "Edisto": "ˈɛdɪstoʊ", "Horry": "ˈɔːɹi", "Pee Dee": "pˌiː dˈiː"}
M = "/home/user/battle-maps/marion/audio"
T = json.load(open(f"{M}/timing.json")); P = T["paragraphs"]
key = lambda p: p["tag"].split("|")[0].replace("MAP:", "").replace("ARCHIVE:", "").strip()
k = Kokoro("kokoro-v1.0.onnx", "voices-v1.0.bin")
SR = 24000; out = np.zeros(int((T["duration"] + 1) * SR), np.float32)
for p in P:
    if key(p) not in sys.argv[1:]: continue
    a, sr = tts_names.speak(k, p["text"], T.get("voice", "am_michael"), T.get("speed", 1.0)); assert sr == SR
    i = int(round(p["start"] * SR)); out[i:i + len(a)] = a
    print(f"{key(p):8s} start {p['start']:7.2f}  len {len(a) / SR:6.2f}  timing {p['end'] - p['start']:6.2f}", flush=True)
sf.write(f"{M}/voice.wav", out, SR)
print("wrote", f"{M}/voice.wav")
