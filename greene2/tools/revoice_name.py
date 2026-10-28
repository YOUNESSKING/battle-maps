"""Re-voice only the paragraphs that contain a mis-stressed name, with exact phonemes for that name, time-fitted to the old
paragraph length (so timing.json, the scene renders and the SFX sync stay unchanged). Greene remake 2026-10-27: Cornwallis.
usage (from /home/user/battle-maps/tts): python3 /home/user/battle-maps/greene2/tools/revoice_name.py
-> greene2/audio/fix/p<i>.wav (Kokoro, fitted) + fix/list.json; then convert each with tts/convert_voice.py and splice (splice_fix.py)."""
import json, re, ast, subprocess
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
ROOT = "/home/user/battle-maps/greene2"
FIX = {"Cornwallis's": "kɔːɹnwˈɑːlɪsᵻz", "Cornwallis": "kɔːɹnwˈɑːlɪs"}   # korn-WAH-lis, stress on the 2nd syllable
PRON = ast.literal_eval(re.search(r"PRON = (\{.*?\})", open(f"{ROOT}/tools/narrate.py").read(), re.S).group(1))
PRON.pop("Cornwallis", None)
T = json.load(open(f"{ROOT}/audio/timing.json")); k = Kokoro("kokoro-v1.0.onnx", "voices-v1.0.bin")
done = []
for i, p in enumerate(T["paragraphs"]):
    if "Cornwallis" not in p["text"]:
        continue
    parts = re.split(r"(Cornwallis's|Cornwallis)", p["text"])
    ph = []
    for part in parts:
        if part in FIX: ph.append(FIX[part]); continue
        s = part
        for a, b in PRON.items(): s = s.replace(a, b)
        if s.strip(): ph.append(k.tokenizer.phonemize(s, "en-us"))
    phon = " ".join(x.strip() for x in ph)
    phon = re.sub(r"\s+([.,;:?!])", r"\1", phon)
    audio, sr = k.create(phon, voice=T["voice"], speed=T["speed"], lang="en-us", is_phonemes=True)
    old = p["end"] - p["start"]; new = len(audio) / sr; tempo = new / old
    raw = f"{ROOT}/audio/fix/p{i}_raw.wav"; out = f"{ROOT}/audio/fix/p{i}.wav"
    sf.write(raw, audio, sr)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-af", f"atempo={tempo:.5f}", "-ar", str(sr), out], check=True)
    a2, _ = sf.read(out, dtype="float32"); n = int(round(old * sr))
    a2 = np.pad(a2, (0, max(0, n - len(a2))))[:n]; sf.write(out, a2, sr)
    done.append({"i": i, "start": p["start"], "end": p["end"], "tempo": round(tempo, 4)})
    print(i, f"old {old:.2f}s new {new:.2f}s tempo {tempo:.3f}", flush=True)
json.dump(done, open(f"{ROOT}/audio/fix/list.json", "w"), indent=1)
