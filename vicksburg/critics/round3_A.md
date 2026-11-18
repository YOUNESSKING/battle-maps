# Critic A, round 3 (FINAL CHECK): THE LOOK (Vicksburg 3D, final GPU renders `/tmp/vx_render3`, 1280x720)

Method: every scene sampled every 3 s as 4x4 contact sheets, plus ~70 full-res stills and 2.5x sector crops
(`scratchpad/c3/` + `c3/fr/`); dive white-outs measured (S01 / S11: 0.57-0.60 s above Y 180, fine). Times are scene-local seconds.

## Scores (10 = GM polish)

| Scene | R2 | R3 | One line |
| --- | --- | --- | --- |
| S01 cold open | 6.5 | 7.5 | Big Black beat now correct (column over, then fire 42.1, red/blue arrows apart); 39-41 the long blue route still runs off the bottom-left edge |
| S02 fortress + plan | 5.5 | 6.5 | arrows trimmed, plan clean, clouds gone; Chickasaw smoke 72-80 is one flat grey square-ish blob over the boxes; Vicksburg still rust streets |
| S03 night run | 5 | 7.5 | fleet spaced, Henry Clay fire mid-frame + readable, 22 April steamers small and spaced: all three fixed |
| S04 Grand Gulf + Bruinsburg | 6.5 | 7 | Grierson card off his line, head in frame, rail sparks; landed boxes still in a field (sev 1, known) |
| S05 Port Gibson | 6.5 | 7 | bottom boxes in frame, ridge-road arrows; "curtains" 39-48 still read as white blurred bars on/among the boxes |
| S06 cut loose | 6 | 7 | Grant's banner off the arrow, arrows inside; 70 Pemberton's banner top + "Vicksburg" tucked under the date plate |
| S07 Raymond | 6.5 | 7 | dive clean, short 'weight of the corps' pushes stop at the creek; curtains still grey bars partly on the Union boxes (26-35); Gregg's retreat arrow 36-37.9 is wide and its head leaves the top edge as the camera moves |
| S08 Jackson | 5.5 | 7 | magenta gone, quote below banner, red road X gone; the new ground glaze is a visible grey ellipse with a rim over the town 20-52 (dark disc at night 24-27) |
| S09 Champion Hill | 6.5 | 7.5 | furniture one-at-a-time, crest boxes upright, banners in frame; volley curtains 87-100 still white blurred rectangles |
| S10 Big Black | 7.5 | 7.5 | next-morning arrows stop at visible bridges; timeline seal still sits on "17" (15-24) |
| S11 assaults | 6.5 | 7 | trench smoke now a continuous curtain (55-63); seals cover the May day labels (75-79); last blue arrow runs off the right edge (84) |
| S12 siege + surrender | 6.5 | 8 | callback gunboats right size + in frame, cards one at a time, Grant's dot on the oak, letter title in with the band: all fixed |
| **Overall** | **6.2** | **7.2** | no broken frames, no world edges, no units on burning bridges or in unbridged water, no rotating boxes, no cut cards |

## Round-2 findings: status

| R2 finding | status | evidence (R3) |
| --- | --- | --- |
| N1 close towns red carpet | **partly** | roofs now weathered brown/slate (engine), S08 Jackson grey-blue (fixed, no magenta); but Vicksburg (S02 42-54, S03 66, S11 55) and Port Gibson (S05 48-64) still sit on rust-red street ground; red boxes on them still low-contrast |
| N2 wide river staircase / chain-mail | **not fixed** | S01 14.6-15 crop: stair-stepped banks + jagged texture edges; S03 77, S04 0-15 same. At 720p reads as a soft jaggy edge, not a glitch (sev 2) |
| N3 S03 22 April steamers giant | **fixed** | 74-84 small boats, ~3 lengths apart, in the channel |
| N3 S12 callback gunboats giant | **fixed** | 129-135 seven small boats inside the frame |
| S03 fleet comb 18-45 | **fixed** | 25, 40: boats spaced, no touching |
| S03 Henry Clay fire too small | **fixed** | 47-60 bright fire mid-left with label |
| N4 S01 red box in burning bridge, arrows stacked | **fixed** | 40.8 column on the road west, 42.3 red arrow north of the blue, 43.0 fire after the last box, blue stops at east bank |
| S10 arrow across river with no bridge | **fixed** | 43.5 arrows stop at the east ends of visible bridges |
| N5 arrows 2x width / off frame | **mostly fixed** | widths 0.2-0.24 everywhere; still off frame: S01 39-41 (long blue route exits bottom-left + right), S11 84 (blue arrow exits right edge) |
| S04 Grierson card on his line | **fixed** | 48-52 card left, head + rider inside, rail sparks |
| N6 cauliflower clouds | **fixed** (S02, S08, S09) | residual small grey cloud lower-right S03 77-84, S06 80-94 (sev 1) |
| Smoke puffs -> curtains | **partly** | S11 55-63 continuous curtain: good. S05 39-48 and S09 87-100: soft white rectangles strung along the lines, partly over boxes; S02 72-80 one flat grey blob over Sherman's/Confederate boxes; S10 15-27 tall grey wall (unchanged from R2, reads as smoke) |
| N7 sheared boxes | **fixed** | S12 60-70, S09 100, S08 45: upright rectangles |
| N8 S08 quote over Grant banner | **fixed** | 36-45 quote under the banner |
| S05 bottom boxes cut | **fixed** | 33-64 inside |
| S09/S10 furniture + timeline | **fixed** (S09), **partly** (S10/S11) | S09 one card at a time; S10 15-24 seal on "17"; S11 75-79 seals overlap "12/14/16/17 May" |
| S12 blank letter band | **fixed** | 70.8 title fading in with band, full by 71.0 |
| S12 three cards at once | **fixed** | Pemberton 62.5, Grant 65 (dot on oak), Mexico 67.5 |
| S11 Chickasaw plate / Walnut Hills | **not fixed** (sev 1, deferred) | 5.0 "Walnut Hills" over a box, arrow head on the boxes |
| S04 landed boxes in a field | **not fixed** (sev 1, deferred) | 60-87 |
| S06 box on "Jackson" | **fixed** | 80-94 |
| S08 pale-red road X | **fixed** | grey-ochre roads |
| Wide grade too dark | **partly** | S01 36 / S04 57: mean (93-95, 103-106, 89-90), dark share 0.09-0.11 (GM range); S02 72: (79,88,79) / 0.34 still dark |

## New findings (none severity 3)

| scene | t | sector | problem | fix | sev |
| --- | --- | --- | --- | --- | --- |
| S08 | 20-52 (24-27 night) | Jackson town | the new GROUND glaze disc is visible as a grey ellipse with a soft rim around the town (a dark disc at night): reads as a spotlight / overlay, not ground | rim softness x3 (feather to 0 over 40 % of the radius) or follow the town footprint; glaze alpha 0.30 -> 0.18 | 2 |
| S02 | 72-80 | Chickasaw Bayou | one flat grey square-ish smoke blob (~120 px) sits over Sherman's and the Confederate boxes | replace with a short curtain in front of the Union line (S11 settings), alpha <= 0.2 | 2 |
| S05 / S09 | S05 39-48, S09 87-100 | battle lines | curtains render as soft white rectangles (beads of bars), some over boxes | use S11's settings (denser points, alpha 0.17, grey tint), seat 1 unit in front, never over the boxes | 2 |
| S07 | 36-37.9 | retreat arrow | Gregg's retreat arrow ~2x the others' width; head exits the top edge before its 38.0 fade | width 0.24, fade at 36.5 or trim to the frame | 2 |
| S07 | 33.3-33.8 | right | a lone blue arrowhead appears before its shaft draws (engine draw start) | start that arrow 0.3 s earlier or draw shaft-first | 1 |
| S06 | 69-71 | top-left | Pemberton's banner top and the "Vicksburg" name tuck under the date plate | camera 4 % lower or banner steps out at 69 | 1 |
| S11 | 75-79 | timeline | seals overlap the day labels | seal y -14 px (above the label) | 1 |
| S08 | 24-27 | bottom | blue boxes cut by the bottom edge / legend at night | frame 5 % up | 1 |
| S12 | 67.5 | right edge | last Union box cut by the right edge | key 2 units west | 1 |

## Must-fix before publish
None. Nothing found would embarrass the film: no broken or black frames, dive white-outs ~0.6 s, no map edges, no units on a
burning bridge or in water without a bridge, boxes never rotate, no cut cards. The sev-2 items above (S08 glaze disc, S02 smoke blob,
S05/S07/S09 white smoke bars, the wide river staircase, rust town ground, two off-frame arrows) are polish; fix them only if a re-render
of S02/S05/S08/S09 is cheap. If only one: the S08 ground disc (20-52), the most visible "overlay" look in the film.

## Verdict
**FIT TO PUBLISH (look), overall 7.2/10** (R1 4.8, R2 6.2). All twelve final renders checked, S07 last.
