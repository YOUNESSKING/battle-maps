# Battle 19: Vicksburg 1863, the first 3D campaign film (plan, 2026-11-18)

Brief: `research/START_BATTLE_19_VICKSBURG.md` (binding). Look = approved 3D test v8 (`research/style_tests/gm3d/clip/`).
Decisions taken without the owner (pre-approved) are logged in `OWNER_DECISIONS.md`.

## Film
- Working title: "The Campaign That Split the Confederacy: 5 Battles in 18 Days | Vicksburg 1863" (3 options at packaging).
- Length target ~18-19 min, ~140 wpm (~2,500-2,650 words), Kokoro am_michael -> voice A.
- One story with a clock: 16 Apr night run -> 30 Apr Bruinsburg -> 1 May Port Gibson -> cut loose -> 12 May Raymond -> 14 May Jackson
  -> 16 May Champion Hill -> 17 May Big Black -> 19 + 22 May assaults -> siege -> 4 Jul surrender.

## Sequences (scene = one HyperFrames project, ~1-3 min each, rendered separately and concatenated)
| # | Sequence | World(s) | ~len |
| --- | --- | --- | --- |
| S01 | Cold open: the river, the fortress, the stakes; cloud dive onto Vicksburg; 3D gold title on its words; Grant's name moment | wide + vicksburg close | 1:15 |
| S02 | The enemy plan + the winter of failures + Grant's gamble (march down the west bank) | wide | 1:30 |
| S03 | 16 April, night: running the batteries, Henry Clay burns | vicksburg close (night) | 1:45 |
| S04 | Grand Gulf fails (29 Apr), Bruinsburg (30 Apr), feints | wide + bruinsburg close | 1:30 |
| S05 | Port Gibson (1 May) | portgibson close | 1:30 |
| S06 | Cut loose: the twist, between two armies | wide | 1:15 |
| S07 | Raymond (12 May) | raymond close | 1:15 |
| S08 | Jackson (14 May) + the intercepted message (set-up) | jackson close | 1:15 |
| S09 | Champion Hill (16 May): the hill changes hands | championhill close | 2:45 |
| S10 | Big Black River Bridge (17 May) | bigblack close (v8 world) | 1:15 |
| S11 | Assaults 19 + 22 May | siege close | 1:15 |
| S12 | Siege, surrender 4 Jul, river open, end | siege close + wide | 1:45 |

## Steps and time estimates
1. Research + `research/FACT_NOTES.md` + `research/GEO.md` (coordinates, roads, positions) + 2 fact-check agents: ~2 h (agent, parallel with 3).
2. Script `script.md` (every paragraph tagged with its sequence/shot), GM narration style: ~1.5 h.
3. One-time engineering (parallel with 1-2):
   a. `tools/bake_world.py` + `worlds/*.json`: config-driven baker from `bake_clip.py` (DEM, rivers, roads, towns, period landscape) for one wide
      campaign region + close regions: ~3 h (Opus agent).
   b. `engine/`: the clip's world/fx/overlay/banner/troops code generalised: any number of close regions, a sequence file per scene
      (camera keys, dives, units, arrows, banners, labels, overlays, fx events, sound cues) driving one template `index.html`: ~3 h (Opus agent).
4. Voice (Kokoro + voice A), `timing.json`, word times (title lands on its words): ~0.5 h.
5. Scenes S01-S12 (agents in parallel, max 3, shared brief + LESSONS), snapshot sheets per scene, critic per round: ~7 h.
6. Render on RunPod (A5000, recipe in `research/runpod/`, budget <= $2, pods always terminated + listed): ~1-1.5 h wall.
7. Assemble (sound kit, quiet orchestral bed, -14 LUFS), contact sheets, two critics frame by frame + sector by sector vs GM, fixes,
   re-render changed chunks only: ~3 h.
8. Packaging (3 titles, 2-3 thumbnails, description without links, tags, chapters), PDF guide, Gofile upload, PR + merge: ~2 h.
Total ~20 h of wall time. PR + merge to main at each milestone (plan, research+script, engine, scenes, final).
