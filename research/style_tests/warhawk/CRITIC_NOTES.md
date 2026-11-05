# Warhawk map copy: critic rounds (owner 2026-11-05: "start fresh, ditch our map rules, copy the reference video's maps, use two critical agents")
Reference: Warhawk "Deathblow of the Dakota: Dakota War of 1862 - Part 2/2" (youtu.be/NiXnbOO7Vt0). The video could not be downloaded (YouTube bot check), so the
real frames are YouTube's own thumbnail frames (ref_*.jpg) + the owner's screenshot ../ref_A_flat_illustrated.png + an AI walkthrough (VIDIQ_MAP_NOTES.md).
Test only, NOT locked. Generator: ../make_style_w.py (wide look + close= battle look, same woods/rivers so the camera cross-fades between them).

## Owner rules for this work (2026-11-05)
- **Before committing to / showing any test, dispatch it to the two critic agents first**; fix what they find, then show the owner.
- One colour for the whole map: the greener (close battle) one. Never recolour the ink-drawn trees into green blobs (rejected: "you butchered the trees").
- Draw what the story talks about on the map (hilltops, the narrow ridge spine, ravine, railroad + tunnel, open fields).
- Tests carry sound (narration + music + SFX via tools/make_clip.py).
- Place labels much smaller, reference style (white serif + soft shadow, no box); no country names under flags.
- Important towns the armies head for are PERMANENT town symbols on the map (dot + serif name), like the reference maps.
- Territory colour ONLY at the moments that help the viewer (owner 2026-11-05: "it should be only at the part that is helpful for the viewer"): e.g. the opening (who holds what) and the moment ground changes hands; never left on through the middle of a scene.
- Territory colours scale with zoom (owner 2026-11-05: "stronger when you zoom out to show the whole continent or the whole country"): full red/blue fill (~55 %, color blend) on far-out views, fading to front bands only on battle close-ups (opacity follows the camera scale: full at s <= 0.75, none at s >= 1.4).
- Territory scenario (test): 23-Nov lines on the opening wide shots, Billy Goat Hill changes hands on "he seized a hill" (loser paler, winner fills), colours dissolve ~2.8 s at "Cleburne saw something"; on the green map the colours are normal-blend red/blue at ~24 % + a light front line (multiply turns muddy on green).

## Scores
| Round | Critic 1 (wide map) | Critic 2 (glyph detail + close look) |
|---|---|---|
| 1 (w1) | 3/10 | 3/10 |
| 2 (w4) | 5/10 | wide 6/10, close 5/10 |
| w7 (after round-2 fixes) | not yet judged | not yet judged |

## What the critics measured (kept in the generator)
- Wide ground: warm khaki (162,159,112), R >= G, paper mottle at 2-15 px + soft 15-120 px, NO vignette (measured: corners not darker).
- Ink: warm sepia (50,44,20), softened ~1 px; ink covers 4-9 % of a screen.
- Round trees: mushroom domes ~17x16 screen px, lumpy outline, mid-tone fill, dark lower-right crescent, short trunk, 1-2 inner curls, overlapping into cauliflower clumps.
- Pines: dark cones ~17x21 with a light sliver on the left, thin outline, dark base smudge.
- Clumps: 10-30 trees, 80-200 px across, ONE tree type per clump, sitting close to the rivers; few lone trees.
- Grass: mixed asymmetric 1-4 blade tufts with hooked tips, sitting on patches of faint horizontal hatch rows.
- Rivers: few (main + ~4 creeks per screen), smooth constant-width ribbons, main ~13 px / creek ~7 px on a wide screen, pale (213,229,240) with a blue-grey (154,173,183) band inside the upper-left bank and a warm dark line under the lower bank, no glow.
- Close look: mossy turf (118,123,69) with fine grain, strong screen vignette (corner ~55 % darker), top-down canopy woods with lit north-west and dark south-east rims (canopy + water colours are unverified: no real close frame shows them).

## Still open
- Cross-shaped river arms at the top right of the tunnel map (old reservoir outline in the river data).
- Close-up trees and water are partly guesses (only the AI notes describe them).
