"""Final sound mix: voice + music bed (ducked, swells between sections) + SFX cues + ambience -> -14 LUFS.

usage (from smith/): python3 tools/mix_audio.py      (needs build/video_only.mp4 from assemble_full.py)
Sounds: assets/sfx/NAME.wav (see assets/sfx/CREDITS.md). Music: assets/sfx/music.mp3 (falls back to assets/media/music.*).
Cue times are narration phrases (same idea as B.at in the map scenes): the phrase's position in the paragraph text,
scaled to the paragraph's spoken duration. Missing sound files are skipped and listed.
Writes build/smith-full.mp4 (1080p master) and build/smith-preview-720p.mp4 (< 30 MB).
"""
import glob, json, os, re, subprocess

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
os.chdir(ROOT)
T = json.load(open("audio/timing.json"))
DUR = T["duration"]
PAR = {p["tag"].split("|")[0].replace("MAP:", "").replace("ARCHIVE:", "").strip(): p for p in T["paragraphs"]}
ARCH = [p for p in T["paragraphs"] if p["tag"].startswith("ARCHIVE")]
for i, p in enumerate(ARCH):
    PAR[f"archive-{i}"] = p


def at(key, phrase=None, off=0.0):
    p = PAR[key]
    if not phrase:
        return p["start"] + off
    i = p["text"].lower().find(phrase.lower())
    assert i >= 0, (key, phrase)
    return p["start"] + (p["end"] - p["start"]) * i / len(p["text"]) + off


# (time, sound, gain)  gain is linear; sounds are peak-normalised, final mix is loudness-normalised
C = []
def cue(t, snd, g=0.35):
    C.append((round(t, 2), snd, g))
def method(key, gain=0.4):  # three soft hits, one per method line
    for ph in ("Build the lifeline first", "Refuse to be rushed", "eep the division whole"):
        cue(at(key, ph), "soft_hit", gain)

# ---- hook ----
cue(0.3, "whoosh_1", 0.3)                                   # peninsula appears
cue(4.8, "whoosh_2", 0.45)                                  # dive into Chosin (hand-off 6.4-7.0)
cue(at("hook-1", "bugles and whistles"), "bugle", 0.45)
cue(at("hook-1", "bugles and whistles", 1.2), "whistle", 0.35)
cue(at("hook-1", "came pouring down"), "drum_hit", 0.55)
cue(at("hook-2", "that road was cut"), "mortar_1", 0.35)
cue(at("hook-2", "surrounded, outnumbered"), "artillery_1", 0.3)
cue(52.5, "whoosh_1", 0.45)                                 # pull back out to the peninsula
cue(57.9, "thud_1", 0.5)                                    # Smith cut-out + bio card
# ---- move 1: Inchon ----
cue(at("inchon-1", off=0.3), "drum_hit", 0.6)               # MOVE 1 title card
cue(at("inchon-2", "land an army"), "whoosh_2", 0.3)        # sea arrow round the peninsula
cue(at("inchon-5", off=0.4), "thud_2", 0.45)                # Smith stake
cue(at("inchon-5", "working with the Navy"), "surf_boats", 0.2)
cue(at("inchon-6", "stormed the fortified island"), "naval_barrage", 0.45)
cue(at("inchon-6", "Navy and Marine aircraft"), "prop_flyby_1", 0.4)
cue(at("inchon-6", "Navy and Marine aircraft", 2.0), "jet_flyby", 0.35)
cue(at("inchon-6", "pounded it for days"), "explosion_med_1", 0.35)
cue(at("inchon-7", "the landing craft hit two beaches"), "surf_boats", 0.35)
cue(at("inchon-7", "the landing craft hit two beaches", 1.0), "artillery_2", 0.3)
cue(at("archive-2", "straight up it"), "gunfire_distant", 0.2)
cue(at("archive-2", "smothered an enemy grenade"), "explosion_med_2", 0.3)
cue(at("inchon-8", "collapsed"), "artillery_3", 0.25)
method("inchon-9")
# ---- move 2: Hagaru-ri ----
cue(at("hagaru-1", off=0.3), "drum_hit", 0.6)
cue(at("hagaru-3", "The Chinese commander"), "thud_3", 0.45)   # Song Shilun stake
cue(at("hagaru-4", "But Smith saw something different"), "thud_1", 0.45)
cue(at("hagaru-5", "explosives"), "explosion_med_1", 0.35)
cue(at("hagaru-6", "the trap was sprung"), "drum_hit", 0.55)
cue(at("hagaru-6", "the trap was sprung", 0.4), "bugle", 0.4)
cue(at("hagaru-6", "struck the Marines at Yudam-ni"), "mortar_2", 0.4)
cue(at("hagaru-6", "cut the road behind them"), "artillery_1", 0.3)
cue(at("hagaru-7", "threw an entire division"), "whistle", 0.35)
cue(at("hagaru-7", "threw an entire division", 0.8), "mortar_1", 0.4)
cue(at("hagaru-7", "fought through the night"), "artillery_2", 0.35)
cue(at("hagaru-7", "lost East Hill"), "explosion_med_2", 0.35)
cue(at("hagaru-8", "the first transport plane landed"), "transport_drone", 0.35)
cue(at("hagaru-8", "Planes flew in ammunition"), "parachute", 0.4)
cue(at("archive-4"), "transport_drone", 0.25)
method("hagaru-9")
# ---- move 3: breakout ----
cue(at("breakout-1", off=0.3), "drum_hit", 0.6)
cue(at("breakout-3", "Infantry climbed the ridges"), "gunfire_distant", 0.25)
cue(at("breakout-3", "fighter-bombers"), "prop_flyby_2", 0.45)
cue(at("breakout-3", "fighter-bombers", 1.6), "dive_bomb", 0.45)
cue(at("breakout-3", "It did not simply drive"), "jet_flyby", 0.3)
cue(at("breakout-4", "The Chinese had blown that bridge"), "explosion_big", 0.55)
cue(at("breakout-5", "C-119 cargo planes"), "transport_drone", 0.4)
cue(at("breakout-5", "under giant parachutes"), "parachute", 0.45)
cue(at("breakout-6", "stormed the heights"), "gunfire_distant", 0.3)
cue(at("breakout-6", "stormed the heights", 1.5), "artillery_3", 0.3)
cue(at("breakout-6", "It was finished"), "thud_2", 0.35)
cue(at("archive-7", "engineers blew up the port"), "explosion_big", 0.6)
cue(at("breakout-7", "had been wrecked"), "artillery_1", 0.2)
method("breakout-8")
# ---- ending ----
cue(at("ending-1", "Matthew Ridgway"), "thud_3", 0.45)
method("ending-2", 0.45)
cue(at("ending-2", "Which of Smith's moves", -2.0), "drum_hit", 0.5)

# ambience beds: (start, end, sound, gain), looped + faded
BEDS = [(0.0, 53.1, "wind_blizzard", 0.22), (at("hagaru-2"), at("hagaru-9"), "wind_blizzard", 0.16),
        (at("breakout-1"), at("breakout-8"), "wind_blizzard", 0.16), (at("ending-2"), DUR, "wind_blizzard", 0.12),
        (at("hook-1", "came pouring down"), 53.0, "war_drums", 0.22), (at("hagaru-6"), at("hagaru-8"), "war_drums", 0.2),
        (at("breakout-4"), at("breakout-6", "It was finished"), "war_drums", 0.18),
        (at("hagaru-7"), at("hagaru-8"), "gunfire_distant", 0.16), (at("hook-2"), at("hook-2", "In Tokyo"), "gunfire_distant", 0.14)]

# music swells: between sections / on title cards the bed rises (the voice ducking still applies)
SWELLS = [(at("inchon-1") - 1.4, at("inchon-1") + 4), (at("hagaru-1") - 1.4, at("hagaru-1") + 4),
          (at("breakout-1") - 1.4, at("breakout-1") + 4), (at("ending-1") - 1.4, at("ending-1") + 3), (DUR - 4, DUR)]


def run(cmd, capture=False):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-y", *cmd], check=True, capture_output=capture, text=True)
    return r.stderr if capture else None


sfx = lambda n: f"assets/sfx/{n}.wav"
music = next(iter(sorted(glob.glob("assets/sfx/music.*") + glob.glob("assets/media/music.*"))), None)
missing = sorted({s for _, s, _ in C if not os.path.exists(sfx(s))} | {b[2] for b in BEDS if not os.path.exists(sfx(b[2]))})
cues = [c for c in C if os.path.exists(sfx(c[1]))]
beds = [b for b in BEDS if os.path.exists(sfx(b[2]))]

inputs, f, mix = ["-i", "audio/voice.wav"], ["[0:a]aresample=48000,aformat=channel_layouts=stereo,asplit=2[vo][vokey]"], ["[vo]"]
n = 1
if music:
    inputs += ["-stream_loop", "-1", "-i", music]
    swell = "+".join(f"0.9*between(t,{a:.2f},{b:.2f})" for a, b in SWELLS)
    f.append(f"[{n}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:{DUR + 1},volume='0.10*(1+{swell})':eval=frame,"
             f"afade=t=in:d=2,afade=t=out:st={DUR - 3}:d=3[mus]")
    f.append("[mus][vokey]sidechaincompress=threshold=0.02:ratio=10:attack=20:release=500[musd]")
    mix.append("[musd]"); n += 1
for k, (a, b, s, g) in enumerate(beds):
    inputs += ["-stream_loop", "-1", "-i", sfx(s)]
    d = b - a
    f.append(f"[{n}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:{d:.2f},volume={g},afade=t=in:d=2.5,"
             f"afade=t=out:st={max(d - 2.5, 0):.2f}:d=2.5,adelay={int(a * 1000)}:all=1[bed{k}]")
    mix.append(f"[bed{k}]"); n += 1
for k, (t, s, g) in enumerate(cues):
    inputs += ["-i", sfx(s)]
    f.append(f"[{n}:a]aresample=48000,aformat=channel_layouts=stereo,volume={g},adelay={int(t * 1000)}:all=1[c{k}]")
    mix.append(f"[c{k}]"); n += 1
f.append(f"{''.join(mix)}amix=inputs={len(mix)}:normalize=0:duration=first,atrim=0:{DUR:.2f}[pre]")
os.makedirs("build", exist_ok=True)
graph = ";".join(f)
open("build/mix_graph.txt", "w").write(graph)
run([*inputs, "-filter_complex_script", "build/mix_graph.txt", "-map", "[pre]", "-c:a", "pcm_s24le", "build/mix_pre.wav"])
# two-pass loudnorm to -14 LUFS
st = run(["-i", "build/mix_pre.wav", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], capture=True)
m = json.loads(st[st.rindex("{"):st.rindex("}") + 1])
ln = (f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:"
      f"measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
run(["-i", "build/video_only.mp4", "-i", "build/mix_pre.wav", "-map", "0:v", "-map", "1:a", "-af", ln + ",aresample=48000",
     "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "build/smith-full.mp4"])
kbps = int(27 * 8 * 1024 / DUR) - 96
run(["-i", "build/smith-full.mp4", "-vf", "scale=1280:720", "-c:v", "libx264", "-preset", "medium", "-b:v", f"{kbps}k",
     "-maxrate", f"{kbps * 2}k", "-bufsize", f"{kbps * 4}k", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", "build/smith-preview-720p.mp4"])
st = run(["-i", "build/smith-full.mp4", "-af", "ebur128", "-f", "null", "-"], capture=True)
print("loudness:", re.findall(r"I:\s+(-?[\d.]+) LUFS", st)[-1], "LUFS | cues:", len(cues), "beds:", len(beds), "| music:", music)
print("missing sounds:", missing or "none")
