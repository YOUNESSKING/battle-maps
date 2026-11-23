"""Replace ONE re-voiced section (narrate.py ... SNN -> audio/voice_SNN.wav + timing_SNN.json, and its owner-voice conversion
audio/voice_owner_SNN.wav) inside the full narration, shifting every later paragraph by the length difference.
Works for the FIRST section only (S01: its own file starts at 0 with the same 0.4 s head).
usage: python3 ajackson/tools/splice_section.py S01      (backs up voice.wav, voice_owner.wav, timing.json as *_prev.*)"""
import json, shutil, sys
import numpy as np, soundfile as sf
A = "/home/user/battle-maps/ajackson/audio"; SID = sys.argv[1]
T = json.load(open(f"{A}/timing.json")); N = json.load(open(f"{A}/timing_{SID}.json"))
nxt = next(p["start"] for p in T["paragraphs"] if p["section"] != SID and T["paragraphs"].index(p) > 0)   # old start of the next section
assert T["paragraphs"][0]["section"] == SID, "first section only"
new_end = N["duration"]; delta = new_end - nxt
for f in ("voice.wav", "voice_owner.wav", "timing.json"):
    shutil.copy(f"{A}/{f}", f"{A}/{f.replace('.', '_prev.')}")
for old, new in (("voice_prev.wav", f"voice_{SID}.wav"), ("voice_owner_prev.wav", f"voice_owner_{SID}.wav")):
    a, sr = sf.read(f"{A}/{old}", dtype="float32"); b, sr2 = sf.read(f"{A}/{new}", dtype="float32"); assert sr == sr2
    b = b[:int(round(new_end * sr))]
    if len(b) < int(round(new_end * sr)): b = np.concatenate([b, np.zeros(int(round(new_end * sr)) - len(b), np.float32)])
    out = np.concatenate([b, a[int(round(nxt * sr)):]])
    sf.write(f"{A}/{old.replace('_prev', '')}", out, sr); print(old.replace("_prev", ""), round(len(out) / sr, 3), "s")
paras = N["paragraphs"] + [dict(p, start=round(p["start"] + delta, 3), end=round(p["end"] + delta, 3)) for p in T["paragraphs"] if p["section"] != SID]
words = sum(len(p["text"].split()) for p in paras); dur = round(T["duration"] + delta, 3)
json.dump(dict(T, duration=dur, wpm=round(words / (dur / 60), 1), paragraphs=paras), open(f"{A}/timing.json", "w"), indent=1)
print(f"{SID}: old next-section start {nxt:.3f} -> {new_end:.3f} (delta {delta:+.3f} s); total {dur:.1f} s")
