# Critic A, round 1: THE LOOK (Vicksburg 3D, S01-S12 GPU renders, 1280x720)

Method: every scene sampled every 3 s (S01, S10 every 2 s) as 4x4 contact sheets, plus full-res stills and 2.5x sector crops at
~45 moments (`/tmp/vx_critic_A/`, `fr/`). Compared against the approved v8 clip (`research/style_tests/gm3d/clip/contact_sheet.jpg`,
README v4-v8 numbers) and GM measurements (DETAIL_STUDY, GM_STUDY, gm_criticA/B). Times are scene-local seconds.
Colour stats (central 700x450): wide frames mean (76,86,73) / darkest 5 % (31,41,41) / dark share (L<60) 0.29-0.30 (S02 3 s, S04 5 s);
S12 end 122 s mean (61,63,52), dark share 0.55; Champion close S09 35 s (70,79,72). GM wide (90,96,84) / (34,47,41); GM close ~(103,105,96),
dark share 0.11-0.15. Our wide map is ~12-15 levels too dark with 2x GM's dark share (the woods read as black camouflage blobs).

## Scores (10 = GM polish)

| Scene | Score | One line |
| --- | --- | --- |
| S01 cold open | 5 | push-in + gold title + dive work; emergence goes top-down, plaque gone 18-34 s, world edge, cut to wide mid-montage |
| S02 fortress + plan | 5 | good hairpin close + inset; rotated boxes, red town glyphs, world edges, boxes on the river at Milliken's Bend |
| S03 night run | 5 | night grade is right; fleet unreadable for 15 s, white fire blob, red-roof city carpet, 20 s near-static wide ending |
| S04 Grand Gulf + Bruinsburg | 5 | gunboats = one black comb + white weir streak; dashed road; 15 s dimmed quote over the Grant banner |
| S05 Port Gibson | 4 | cotton-ball smoke, red/blue interleaved, arrow crosses the burning bridge, world edge top-right |
| S06 cut loose | 5 | clear story arrows; rotated X-boxes everywhere, two long dimmed quotes, clutter at 84-93 s |
| S07 Raymond | 4 | good dive; tiny fight with cotton puffs, arrows cross the creek with no bridge, world edge, label to an off-frame unit |
| S08 Jackson | 4 | rain reads; no units in Jackson for 25 s, factory fire only 1 s before the end, vertical rotated columns |
| S09 Champion Hill | 5 | dense, roads readable; crest fight unreadable (red inside blue), banners/cards cut by frame, dark teal ground |
| S10 Big Black | 7 | closest to v8; polygon lake, seals over timeline text, broken arrowhead 43 s, next-morning jump (known) |
| S11 assaults | 4 | silver "foil" river + world edge across the whole siege intro; unreadable letter body; quote crosses a cut |
| S12 siege + surrender | 4 | foil river again (night + surrender), placeholder newspaper, Grant card cut, dark muddy finale, no sunset |
| **Overall** | **4.8** | the 3D world is there; the boxes, wide glyphs, world edges, water and smoke keep it well below v8 |

## Findings (scene | t | sector | problem | fix | sev)

### Global (hit many scenes; fix once in the engine)

| scene | t | sector | problem | fix | sev |
| --- | --- | --- | --- | --- | --- |
| ALL | S02 42-75, S04 0-15, S06 69-93, S08 0-20/54-60, S09 33-170, S11 0-60, S12 0-100, S01 wide | all | **Boxes still rotate with the unit's facing**: lines drawn diagonally give parallelogram/tilted boxes; columns are stacks of boxes turned 90 deg (S08 0-20, S09 69, S11 27 = vertical "X" plates). The 4dc43df fix only freezes facing on marches; the owner rule is "boxes never rotate". S10 (upright boxes) shows how it should look. | `scene.js` drawTroops: keep `fx/fy` only for the line OFFSETS, but pass a fixed upright orientation to `BX.set` (`fx: 0, fy: 1` in map space, or the camera's screen-up projected on the ground, so every box is the Style W upright rectangle in every shot); same for `T3` blocks. Columns then read as box stacks along the road. | 3 |
| ALL wide | S01, S02 0-20/66-136, S04 0-50, S06, S07 0-6, S08 0-12/54-97, S09 0-33, S11 0-27/66-84, S12 99-140 | towns | **Wide-map town glyphs = clusters of red crossed "ladder" marks** (Raymond 6.5 s, Jackson, Edwards, Clinton, Port Gibson): they read as red Confederate units and drown the real red boxes (S06 81-93 Jackson, S08 0-9). | Wide town glyph in neutral ink (dark brown/slate, cream roofs), <= half the current size, no red; railroad stations as small dark ticks. Red is reserved for Confederate units/arrows. | 3 |
| ALL | S01 30.6-33.6 BR (known), S02 0-5 TL, S02 21-60 TR horizon, S02 102-136 L, S05 57-65 TR, S07 12-15 BR, S09 ~97-105 TR, S11 30-60 TR, S12 120-140 TL | edges | **Edge of the world visible** (flat grey/beige apron with a straight edge beyond the baked terrain). | Per region: add a fogged ground skirt (2x tile, region's far-ground colour fading into the haze colour) AND a camera QA check: for every camera key sample the 4 frustum corners on the ground plane and fail the scene if one is outside the baked bounds; raise far haze to ~0.45 at the top edge (v4: 0.78 d .. 2.3 d, #a9b8c1). | 3 |
| S11, S12 (siege, vicksburg close) | S11 30-60, S12 6-18 (night), 78-96, 120 | river | **River renders as crumpled silver foil / scales** (huge normal-map ripples + specular, the city bend is the brightest thing in frame). | Scale the water normal frequency with the region's world scale (x4-6 finer on siege/vicksburg close), amplitude x0.3, cap specular ~0.25, night moon glint as a narrow streak only; target GM: flat dark slate river with faint ripples (as v8 Big Black). | 3 |
| S05, S07, S09, S11 | S05 39-48, S07 21-33, S09 54-60/99-111, S11 42-55 | battle | **Smoke = round white cotton puffs floating above the fight**, not the v7/v8 battalion curtains; they hide boxes and look like cartoon clouds. | Use v7 musketry: `smokeLine` along each firing line, `cluster: [1,1]`, `LOOKS.gmTall`, neutral grey (150,153,157), alpha 0.27, `fadeAfter` 6 s, sprites seated on the ground; no single sphere puffs. | 2 |
| wide | S02 0-60, S04 36-48, S09 0-15, S11 66-84, S12 99-140, S01 0-6 | near-lens | **Wide clouds read as grey plastic cauliflowers** (smooth grey lobes, dark undersides, often a big one at the lower-right/left corner covering 15 % of the frame). v8 wide clouds were warm, bright, torn. | Use the v6/v8 `vclouds` wide settings (sun (1,.95,.85) x1.45, ambient top (.62,.65,.70), lit cream tops ~(178,177,170) p90 ~200, rim tearing), keep near-lens corner masses out of the lower third, max one per frame. | 2 |
| wide | all wide shots; S12 end | ground | **Wide map too dark, woods near-black**: mean (76,86,73) vs GM (90,96,84), dark share 0.29 (S12 end 0.55) vs GM 0.11-0.15; reads as camouflage, not landscape. | Wide grade: lift woods +18-22 levels (target darkest 5 % ~(34,47,41)), toe +6, or raise the wide `#veil`; S12 final shot add a warm sunset grade (plan) instead of the muddy dark. | 2 |
| close | S09 33-170, S05, S07 | ground | Close woods are a single teal-black blanket covering 60-70 % (Champion Hill): the crest/ravines (the story) do not read; S09 close mean (70,79,72) vs GM (103,105,96). | Lighten/olive the canopy (GM teal/olive jitter), add hillshade on the canopy blanket, open more fields on the crest; keep woods <= 45 % of frame on battle shots. | 2 |
| many | S02 105-120, S04 66-87, S05 33-63, S06 69-93, S07 33-36, S09 30/75 | arrows | Arrows ~2x the v8 width, saturated blue/pink, often run off the frame edge (heads/tails cut). | v6 arrow look: width x0.75 (`a.width` 0.32 -> 0.22-0.24), colours #4f73c0 / #b8574c, glow + rim; start and end inside a 6 % safe margin. | 2 |
| S01, S03, S12 | S01 18-34 + 50-55; S12 0-1 | plaque | **Date plaque disappears** (S01 whole dive + emergence + montage start, and the last 5 s) - STYLE rule: the date plaque never disappears; v8 kept it through the white. | Keep the plaque up through the dive (only roll its text inside the white), no fade at the scene end (the assembly crossfade covers it). | 2 |
| many | S04 69-84 (15 s), S06 21-33 + 48-57, S08 36-45, S09 36-45/114-130, S11 57-66, S12 114-120 | quote cards | Quote cards dim the whole map to ~35 % for 6-15 s while nothing moves = dead time; GM's quote banner sits over a live, drifting map. S11 ~66 s the quote stays up across the cut to the wide map. | Dim <= 20 %, camera keeps drifting and one action continues under the card; max ~6-7 s; card out before any region cut. | 2 |
| S03, S05, S08, S12 | S03 15-60, S05 33-63, S08 21-53, S12 6-18 | towns close | Towns are carpets of red roofs on rust ground: Vicksburg/Jackson/Port Gibson read as giant red (Confederate) masses. | Close roofs: v4 7-colour palette weighted to slate/brown/grey (red <= 20 %), town ground grey-ochre, not rust. | 2 |
| S04, S09, S10, S11 | S04 0-12, S09 0-33/141-168, S10, S11 66-84 | timeline | Wax-seal timeline appears in some scenes only (S09 0-30, 141-168; S10; S11) and the seals sit ON the day labels ("1 May Port Gibson", "17 Big Black", "18" hidden). | Seals above the bar's label row (offset -14 px) or labels below; show the timeline consistently from S04 on (or not at all). | 1 |

### Scene by scene

| scene | t | sector | problem | fix | sev |
| --- | --- | --- | --- | --- | --- |
| S01 | 26-33 | camera | Emergence camera goes near top-down (~15 deg from vertical) and yaws ~90 deg (river turns vertical): dizzy, nothing like GM's 50-54 deg close tilt. | Close keys after the dive: tilt 48-52 deg, yaw change <= 20 deg over the shot. | 2 |
| S01 | 33.3-33.8 | cut | Hard cut close -> wide in the middle of the montage (no dive, no dissolve), blue arrow half-faded at the cut. | 0.6 s dissolve or a fast pull-up cloud pass; arrow out before the cut. | 2 |
| S01 | 24-33, 50-55 | river | "Closed" pulse pinkish, final glow pale cyan (known); also the blue "across the river" arrow at 30-32 crosses the peninsula, not the river below the city. | Pulse #be3a2a at 60 %, glow #2c57b7; arrow from Hard Times across the water to Bruinsburg side. | 2 |
| S02 | 96-104 | Milliken's Bend | Grant banner and two blue box rows sit ON the river. | Move keys 0.6-1 unit west onto the Louisiana bank. | 2 |
| S02 | 42-60 | boxes | Red boxes scattered in diagonal strings across open country NE of the city (not on lines/forts/roads). | Put them on the bluff line / city lines (forts) or on roads. | 1 |
| S03 | 0-15 | fleet | Fleet = a few dark specks; "Three transports" label (12 s) points at an unreadable dot; the camera holds the same framing ~15 s. | Deck lamps + wakes x2 on this shot, camera 30 % closer with a slow push down the line. | 2 |
| S03 | 48-60 | fire | Henry Clay fire = bright white-yellow blob, no smoke column (known). | v7 bridge-fire look: tongues, peak (248,196,96), dark grey column, orange water glow. | 2 |
| S03 | 66-87 | camera | Wide dawn shot ~20 s with almost no camera motion (frames 66/75/84 near identical) under the ledger; the "Night" plaque lingers ~0.8 s into the day frame. | Slow push/yaw across the 20 s; roll the plaque inside the dissolve. | 2 |
| S04 | 0-15 | gunboats | Porter's 8 gunboats are one long black comb (boats overlapping) with a white foam "weir" across the river. | Space the boats 2.5 lengths apart in line, x0.6 size on the wide map, no wake foam on wide. | 2 |
| S04 | 30-35 | road | Dashed white Bruinsburg -> Port Gibson line: Style W lock = no dashed arrows/lines. | Highlight the real road (soft cream glow along it) or a solid thin line. | 2 |
| S04 | 69-84 | quote | Quote text over the Grant banner (banner bottom under the 2nd/3rd lines); map dimmed 15 s. | Banner up/right of the card or hidden while the card is up; see global quote fix. | 2 |
| S05 | 0-18 | night | Red pickets barely visible at night; boxes ~2.5 % of width. | Night box brightness +20 %, light rim; camera closer on the first shots. | 2 |
| S05 | 40 | frame | Bottom row of blue boxes cut by the frame. | Frame up 5 %. | 1 |
| S05 | 47-49 | flank | Red boxes sit inside/among the blue flank line (push-apart only across units, but they overlap visually) - who is where is unreadable. | Separate the lines >= 1 box depth; red falls back before blue arrives. | 2 |
| S05 | 48 | labels | "Over the bayou" plate overlaps the "Port Gibson" name. | Offset the plate right/below or hide the town name while it is up. | 1 |
| S05 | 57-63 | bridge | Blue arrow crosses Bayou Pierre exactly through the burning bridge (owner: never cross a burning bridge). | Bend the arrow to the upstream crossing (Grindstone Ford) or end it at the bayou. | 2 |
| S06 | 63 | arrow | A pale arrowhead with no shaft appears left-middle before the "expected" ghost arrow. | Check the ghost arrow t0/dur (head drawn before its body). | 1 |
| S06 | 84-93 | clutter | "Pemberton" label on the blue arrow/boxes; red arrows drawn over the Grant banner. | Label above the red boxes at Edwards; arrows end short of the banner. | 1 |
| S07 | 12-15 | frame | "A single brigade?" points at a unit cut by the bottom edge; world edge bottom-right. | Re-aim the camera key so the brigade sits mid-frame. | 2 |
| S07 | 33-36 | creek | Blue arrows + boxes cross Fourteenmile Creek with no bridge (owner rule). | Arrows end at the creek bank; crossing only at the road bridge. | 2 |
| S08 | 12 | dive | Johnston card AND "Cannot be held" plate both up inside the white-out, leader line runs into cloud. | Card only after emergence; plate later. | 1 |
| S08 | 30-53 | town | Long low shot over Jackson with no troops at all (Grant banner alone in a field); the factory is not distinguishable; the fire appears only at ~52.5 s as a yellow blob without smoke, ~1 s before the end. | Blue boxes in the streets, a distinct factory building (long roof + chimney) under the "cotton factory" plate, fire + dark column from the plate's word on, held >= 3 s. | 2 |
| S08 | 30-53 | roads | Two very wide pale-red roads form a giant "X" across the top of the frame. | Close road width x0.5, colour toward ochre. | 1 |
| S09 | 75-78, 162-168 | frame | Grant banner cut by the top edge (and touching the ledger at 168). | Keep banners inside a 10 % top margin; move key or tilt. | 2 |
| S09 | 81-84 | frame | Bowen card at the bottom edge, partly cut, overlapping the legend area. | Card top-right or above its leader target; legend steps out. | 2 |
| S09 | 97-111 | crest | Red and blue lines cross through each other on the crest ("contested for the third time") - the viewer cannot tell who holds it; "massed Union guns" (97-104) show no visible battery flashes. | Two clear lines facing each other with a smoke curtain between; artillery boxes at the foot with 3-frame flashes + plumes on the cues. | 2 |
| S10 | 0-44 | lake | Pond is a straight-edged polygon (hexagon) - reads as a bug. | Smooth outline (spline, noise edge, reed fringe) in the bake. | 2 |
| S10 | 43 | arrow | Lower next-morning arrow = an arrowhead with no shaft. | Check its pts/dur (shaft length 0 at that t). | 1 |
| S10 | 40-44 | dissolve | Next-morning jump is a plaque change, no dissolve (known). | 0.8 s dissolve with a grade shift. | 1 |
| S10 | all | camera | Camera ~1.4x farther than v8, boxes ~2 % of width vs v8 ~3 %. | v8 keys/distances. | 1 |
| S11 | 15-27 | letter | Letter body text ~6 px high at 720p: unreadable. | Body x1.6 or fewer words. | 1 |
| S11 | 66 | cut | Quote card still up across the cut to the wide map. | Card out 0.4 s before the cut. | 1 |
| S12 | 21-39 | mine | Mine plume = static pale pink pillar for ~15 s. | Burst (dark earth + grey), then drifting grey smoke thinning in 6 s. | 2 |
| S12 | 42-51, 96 | newspaper | Newspaper columns are grey placeholder bars and the centre box is empty at 42 s before its text arrives. | Real tiny text texture (lorem in period type) and the excerpt typed in from the card's first frame. | 2 |
| S12 | 60-66 | labels | "Mexico, 1846-48" plate over the blue boxes. | Move up-left into open ground. | 1 |
| S12 | 120-128 | card | Grant card plate cut by the right frame edge. | Card x - 40 px (safe margin). | 2 |
| S12 | 99-140 | finale | River glow pale cyan, finale mean (61,63,52), dark share 0.55, no sunset (plan says sunset pull-up). | Glow #2c57b7, warm low-sun grade + lifted woods for the last 20 s. | 2 |

## Top 10 fixes (in order of viewer harm)
1. **Boxes never rotate** (engine, all scenes): pass a fixed upright orientation to `BX.set`/`T3`; facing only drives line offsets. Columns become clean stacks on the road.
2. **Wide town glyphs out of red** (all wide shots): neutral ink town marks, half size, so red means Confederates only.
3. **No world edges** (S01, S02, S05, S07, S09, S11, S12): fogged skirt per region + a frustum-inside-bounds check on every camera key.
4. **Fix the siege/Vicksburg water** (S11, S12): finer, weaker normals, capped specular - flat dark slate like v8.
5. **Battle smoke back to v7 curtains** (S05, S07, S09, S11): firing-line `smokeLine` curtains, no floating cotton puffs.
6. **Readable fights**: no red/blue interleaving (S05 47-49, S09 97-111), guns that flash on "massed guns", troops in Jackson + a real factory fire held >= 3 s (S08).
7. **Lift the wide map and the woods** (all wide; S09 close; S12 finale): +18-22 levels on woods, dark share toward 0.15, warm sunset finale.
8. **Arrows: v6 width/colour, inside the frame; no arrow through water without a bridge or through a burning bridge** (S05 57-63, S07 33-36, S02/S04/S06/S09 widths).
9. **Frame safety**: Grant/Bowen/Grant cards and banners inside a 6-10 % margin (S09 75-84/162-168, S12 120-128, S07 12-15, S05 40), no label over a name or a banner (S04 69-84, S05 48, S06 84-93, S12 60-66).
10. **Overlay discipline**: date plaque never leaves (S01 18-34, 50-55); quote cards <= 6-7 s over a live map, out before cuts; seals off the timeline labels; no dashed road (S04 30-35); S01 emergence camera at 48-52 deg tilt with no 90 deg yaw and no mid-montage hard cut.
