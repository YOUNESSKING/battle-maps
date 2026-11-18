# S01 cold open (D = 55.32 s): notes

Regions: `wide` -> (dive) `vicksburg` -> (cut on the paragraph change, 33.62) `wide`. Build: `python3 vicksburg/tools/make_scene.py vicksburg/sequences/S01` (23.8 MB). Contact sheet: `sheet.jpg`.

## Shot list (local scene time; words from `tools/scene_times.py S01 --words`)
| t | Picture | On its word |
| --- | --- | --- |
| 0.0-8.1 | wide map from altitude (dist 640 -> 300), ONE continuous push-in down the river onto the city; the red garrison boxes at Vicksburg from frame 1, clean first frame | plaque "Spring 1863" on "spring" (0.82); 2 blue groups + 3 boats above the city on "Union" (4.56); "Mississippi River" (5.42); "Vicksburg" place name on "Vicksburg" (7.74), the push ends at 8.1 |
| 8.1-14.7 | the camera settles and drifts over the city | 3D gold title **5 BATTLES · 18 DAYS** (Cinzel, lining figures) lands on "eighteen" 9.80 / "days" 10.02, grows to 10.4, readable through "five battles" (12.44-13.3) to ~15.3 |
| 14.7-18.5 | the cloud dive (push 14.7, title flies past the lens, deck 16.8, white-out 17.95, swap 18.5); whoosh cue 16.95 | "with no supply line ... two Confederate armies" over the dive |
| 19.35-21.85 | emergence over the river at the city (vicksburg close), camera west of the river looking ENE at the bluffs | |
| 20.42-27.8 | 12 battery shots along the bluff batteries (flash + plume, shot falls in the river; gun cues, no boom) | first shot on "guns" (20.36) |
| 25.2-32.6 | red pulse running down the river from the city front | on "closed" (25.44) |
| 30.3-33.3 | camera pulls up over De Soto Point: two blue thrusts (Grant's canal, across the point) grow and stop short, fade | "Every Union attempt ... had failed" |
| 33.62 | cut to the wide map (montage) | plaque back |
| 34.78 | blue arrow across the river below the city (Louisiana shore -> Bruinsburg) + blue group | "crossed" |
| 37.06-39.8 | long blue arrow inland Bruinsburg - Port Gibson - Rocky Springs - Utica - Raymond - Jackson, camera follows NE | "turned its back on Vicksburg" (+ "Vicksburg" label 38.14) |
| 39.2-41.9 | red at Jackson driven off NE (red arrow), red at Edwards driven back west (the split) | "marched inland" |
| 40.0-43.0 | the arrow swings back west Jackson - Clinton - Bolton - Champion Hill - Big Black - the city | |
| 41.3 | the Big Black bridge burns as the march passes (fire cue) | "nine weeks" |
| 43.4-44.9 | two blue groups close round the city | |
| 43.93-47.3 | gold number 29,500 counts up over the city | "nearly thirty thousand" |
| 45.9-47.5 | the garrison marches out a few hundred metres, turns grey (stacks arms) | "marched out" / "stacked" (cap 47.52) |
| 47.6-48.2 | three white flags rise over the city | "stacked their arms" |
| 49.4-55.32 | pull back over the valley (dist 250 -> 720); from "campaign" (50.7) the Mississippi glows blue from Vicksburg south, complete on "two" (53.14); picture alive to the end | |

No Grant name, portrait or banner anywhere in S01. Cues: 12 gun, 1 fire, 1 whoosh (`scenes/S01/cues.json`).

## Engine changes (backward-compatible, documented in engine/README.md)
- `title.font`: optional woff2 for the 3D title (Cormorant's old-style "5"/"18" read as lowercase; S01 uses Cinzel 700).
- (S03) `boats[].sAt(t, i)` arc-length schedule; overlay `world: (t) => [x, y, h]` anchors that follow a moving thing.
- LESSONS: `S.draw` runs after the render (use an fx custom emitter for per-frame scene changes); `fx.custom` must be registered in
  `build`; the ordered-list `fx` form gets no cues (`VX.cues` kind names differ from scene.js); wide-map fires need `size: 16`.

## Open issues
- The title says "5 BATTLES" from "eighteen days" (9.8), before "five battles" is spoken (12.44): as briefed by the lead.
- The red "closed river" pulse reads pinkish on the blue water; the blue end glow is a pale cyan line (both custom additive sprites).
- White flags are simple planes (no cloth animation beyond a small sway); readable at dist 250 only.
- At 30.6-33.6 a sliver of the region's south-east edge can show in the bottom-right corner (the vicksburg bundle ends at y 715).
- Five battle sites are not marked individually (the title carries the count); the montage arrows stay on the wide map to the end.

## Round 2 fixes (critics round1_A / round1_B; script + voice unchanged)
| Finding | Fix |
| --- | --- |
| B 0-9 empty slow push, no action in frame 1 (sev 3) | From t = 0.25: the bluff batteries on the wide map fire at a Union gunboat rounding the bend above the city (10 shots 0.25-9.0, flash 0.2 s + plume + splash at the boat, gun cues); 2 red gun groups on the bluffs; wide troopScale 16 (was 10); push starts closer (dist 540). Plaque on "spring" (0.72). |
| B 9.5-16.5 static under the title, dive at 17 (sev 2) | Dive push key at 9.5 ("eighteen" 9.80); slow straight push 9.5-12.8 under the title, then the dive accelerates (deck 14.7-15.85, swap 16.4); title on 9.80, grows to 10.4, leaves as the deck closes (~14.4-14.75). |
| B 18.2-19.3 ~1 s flat white (sev 2) | New per-dive `off` (engine): warm +0.05, emerge +0.15, clear +0.4, haze +1.05 -> opaque white ~0.27 s (16.28-16.55), cloud texture in every other frame. Lands 19.75, before "guns". |
| A plaque gone 18-34 + 50-55 (sev 2) | No plaque.hide at all: "Spring 1863" stays from 0.72 to the end. |
| A 26-33 near top-down + 90 deg yaw (sev 2) | Close keys tilt 49-52, yaw -14 -> 0 over the whole close shot (emergence from the south looking north at the city front). |
| A/B 20-24 flashes not readable (sev 2) | Close battery flash x1.3 + plume x1.0 bigger, flashLife 0.16 (3-5 frames); first shot on "guns". (x3 made a white blob that hid the city.) |
| A/B pulse pink, end glow cyan (sev 2) | Both now FLAT UNLIT sprites (mode 2, normal alpha) in #be3a2a / #2c57b7 (linear values), not additive: the river reads red at 26-31 and Union blue from Vicksburg south at 51-55; the blue route arrows leave at 50.6 so the blue river is the only blue. |
| B 30-32 nothing says FAILED (sev 1) | Red FAILED stamp slams on "failed" 32.54 over the two stopped thrusts (DOM, pinned to De Soto Point), out by 33.45; thrusts out 33.0 (before the dissolve). |
| A 30.6-33.6 world edge (known) | Close keys re-framed; all four frame corners inside the vicksburg box at every key (frustum check). End key moved (was outside the wide box on the left). |
| A 33.3 hard cut mid-montage (sev 2) | 0.6 s dissolve to the montage (new engine key option `dissolve`). |
| B 39-43 montage invisible (sev 2) | Montage = short shots joined by 0.4 s dissolves: crossing below the city (dist 200), march inland, the split (Jackson driven NE / Edwards driven W, dist 390, 39.3-41.25), the Big Black bridge burning with Pemberton's boxes crossing west (dist 190, 41.25-43.3; fire t0 38.2 so it is ablaze, cue 41.3), the ring round the city + 29,500 + flags. |
| B 44-48 payoff late (sev 1) | Script order (locked): left for the lead. |

Engine changes (backward-compatible, README): `dives[].off`, cut-key `dissolve`, boats `h(t, i)`, `O.distance(..., { dash: false })`, `O.letter(..., { qSize, height })`.
Cues now: 22 gun, 1 fire (41.3), 1 whoosh (14.85).
Open: the dive's emergence frame (16.6-17.2) still has stratus sheets over the city for ~1 s (engine look); title says "5 BATTLES" from 9.8 (as briefed).

## Round 3 fixes (critics round 2)
- B N1 / A N4 (Big Black bridge in the montage): Pemberton's field army now crosses the bridge as a road column (VX.march 40.0-42.4, tail clears ~41.9);
  the fire starts only at 42.1 (BBF). The Union march and its arrow stop at the EAST bank ([1532, 686.5]); the red "driven back" arrow sits 7 units
  north of the blue route (never on top of it).
- B N9: the fire burns 42.1-43.3 (fadeOut 0.6, smoulder 0.3, smoke life 4.5 s): no pillar over the surrender payoff (checked 44.6, 46.0).
- B N5: three big on-word shots (guns 20.36, bluffs 21.66, river 22.48) from the bluff crest south of the town (batteries 8-10, 1.2 u east of the
  seat), orange muzzle flash + glow ring, shot falls in the river; then five smaller shots (23.3-27.8), also from the crest, not the streets.
- Dive: S01's short `off` profile is now the engine default (S01 keeps its explicit OFF, unchanged).
- Checks: check_paths lists only the Bruinsburg landing (Mississippi + Bayou Pierre mouth, legit); check_edges OK.
