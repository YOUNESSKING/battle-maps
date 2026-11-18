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
