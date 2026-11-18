"""Word times for the narration: faster-whisper (word_timestamps) on audio/voice.wav, aligned to the script words paragraph by paragraph
(difflib on normalised words; unmatched script words are interpolated). Writes audio/words.json = [{section, tag, start, end,
words: [[word, t0, t1], ...]}] and prints the whisper text where it differs from the script (pronunciation check).
usage: python3 vicksburg/tools/words.py [wav] [timing.json]"""
import difflib, json, re, sys
from faster_whisper import WhisperModel
V = "/home/user/battle-maps/vicksburg"
WAV = sys.argv[1] if len(sys.argv) > 1 else f"{V}/audio/voice.wav"
TJ = sys.argv[2] if len(sys.argv) > 2 else f"{V}/audio/timing.json"
T = json.load(open(TJ))
norm = lambda w: re.sub(r"[^a-z0-9]", "", w.lower())
m = WhisperModel("small.en", device="cpu", compute_type="int8")
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
_a, _sr = sf.read(WAV, dtype="float32"); _a = _a.mean(1) if _a.ndim > 1 else _a
_a = resample_poly(_a, 16000, _sr).astype(np.float32)
segs, _ = m.transcribe(_a, word_timestamps=True, beam_size=5, vad_filter=False,
                       initial_prompt="Vicksburg, Pemberton, Bruinsburg, Grand Gulf, McClernand, McPherson, Grierson, Tilghman, Loring, Hovey, Champion Hill, Big Black.")
W = [(w.word.strip(), w.start, w.end) for s in segs for w in s.words]
print("whisper words", len(W), flush=True)
out = []
for P in T["paragraphs"]:
    sw = P["text"].split()
    hw = [w for w in W if w[1] >= P["start"] - 0.3 and w[2] <= P["end"] + 0.3]
    a, b = [norm(x) for x in sw], [norm(x[0]) for x in hw]
    sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
    tt = [None] * len(sw)
    for i, j, n in sm.get_matching_blocks():
        for q in range(n): tt[i + q] = (hw[j + q][1], hw[j + q][2])
    # interpolate the gaps (numbers spoken as words, names whisper heard differently)
    known = [i for i, x in enumerate(tt) if x]
    for i in range(len(sw)):
        if tt[i]: continue
        lo = max([k for k in known if k < i], default=None); hi = min([k for k in known if k > i], default=None)
        t0 = tt[lo][1] if lo is not None else P["start"]; t1 = tt[hi][0] if hi is not None else P["end"]
        n0 = lo if lo is not None else -1; n1 = hi if hi is not None else len(sw)
        f0 = (i - n0) / (n1 - n0); f1 = (i + 1 - n0) / (n1 - n0)
        tt[i] = (t0 + (t1 - t0) * f0, t0 + (t1 - t0) * f1)
    out.append({"section": P["section"], "tag": P["tag"][:40], "start": P["start"], "end": P["end"],
                "words": [[w, round(x[0], 3), round(x[1], 3)] for w, x in zip(sw, tt)]})
    heard = " ".join(x[0] for x in hw)
    if sm.ratio() < 0.93: print(f"[{P['section']} {P['start']:.1f}] ratio {sm.ratio():.2f}\n  script: {P['text']}\n  heard:  {heard}")
json.dump(out, open(WAV.replace(".wav", "_words.json").replace("voice_owner", "voice"), "w"), indent=0)
print("ok")
