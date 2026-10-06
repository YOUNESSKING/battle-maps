"""Narrate text in the owner's cloned voice (Chatterbox, MIT), paced like the reference.
usage: clone_voice.py REF.wav OUT.wav "text" [exaggeration 0.45] [cfg 0.3] [--wps 1.65] [--gap 1.4] [--comma 0.45]
Text is split into sentences (and clauses at commas/dashes); each piece is generated separately and joined with
silence: --gap after a sentence, --comma after a clause. The speech is then time-stretched (pitch kept) so the whole
take runs at --wps words per second including pauses (owner's reference: 1.64 wps, ~2 s between sentences).
Lower cfg = slower, more deliberate delivery."""
import os, re, subprocess, sys, tempfile, torch, torchaudio
from chatterbox.tts import ChatterboxTTS

args = sys.argv[1:]
opt = {"--wps": 1.65, "--gap": 1.4, "--comma": 0.45}
for k in list(opt):
    if k in args:
        i = args.index(k); opt[k] = float(args[i + 1]); del args[i:i + 2]
ref, out, text = args[:3]
ex = float(args[3]) if len(args) > 3 else 0.45
cfg = float(args[4]) if len(args) > 4 else 0.3
torch.manual_seed(7)
m = ChatterboxTTS.from_pretrained(device="cpu")
sil = lambda s: torch.zeros(1, int(m.sr * s))

speech, pauses, parts = 0.0, 0.0, []
for sent in [x.strip() for x in re.split(r"(?<=[.!?])\s+", text) if x.strip()]:
    clauses = [c.strip() for c in re.split(r"(?<=[,;:—])\s+|\s+-\s+", sent) if c.strip()]
    for j, c in enumerate(clauses):
        a = m.generate(c, audio_prompt_path=ref, exaggeration=ex, cfg_weight=cfg)
        parts.append(("speech", a)); speech += a.shape[1] / m.sr
        p = opt["--gap"] if j == len(clauses) - 1 else opt["--comma"]
        parts.append(("pause", p)); pauses += p
parts.pop(); pauses -= opt["--gap"]  # no trailing pause

# stretch only the speech so speech/tempo + pauses = words / wps
words = len(re.findall(r"[A-Za-z0-9']+", text))
target = words / opt["--wps"]
tempo = min(max(speech / max(target - pauses, 0.3 * speech), 0.75), 1.15)
tmp = tempfile.mkdtemp()
pieces = []
for k, (kind, v) in enumerate(parts):
    if kind == "pause":
        pieces.append(sil(v)); continue
    src, dst = f"{tmp}/{k}.wav", f"{tmp}/{k}s.wav"
    torchaudio.save(src, v, m.sr)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-af", f"atempo={tempo:.4f}", dst], check=True)
    pieces.append(torchaudio.load(dst)[0])
wav = torch.cat(pieces, dim=1)
torchaudio.save(out, wav, m.sr)
print(f"wrote {out}: {wav.shape[1] / m.sr:.1f}s, {words} words, {words / (wav.shape[1] / m.sr):.2f} wps (tempo {tempo:.2f})")
