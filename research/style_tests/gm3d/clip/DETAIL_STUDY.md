# GM3D clip: close detail study vs Grand Maneuver (v2 -> v3)

EXPERIMENT (free of STYLE_LOCK). Reference = the GM "1814" video (local only, `/home/user/gm_ref/`, never committed).
Ours = `gm3d_clip_v2_share.mp4` (v2) and snapshots of the v3 scene. Comparison images are local and git-ignored
(`compare_gm.jpg`, `dive_compare.jpg`); `dive_ours.jpg` and `contact_sheet.jpg` are ours only.

## 0. How the frames were chosen (owner: "use more frames, not irrelevant ones")

All 619 frames of `/home/user/gm_ref/f2s` (one every 2 s) were put on 11 contact sheets (60 each) and classified,
plus a brightness/contrast scan of every frame to catch every white-out.

| Shot type | GM time (s) | Used? |
| --- | --- | --- |
| Flat 2D Europe map (blue / grey states, medallions, arrows) | 0-12, 60-160, 1200-1236 | no (we do not build it) |
| Candle table (parchment map, candle) | 24-60, 406-414 | no |
| Archive painting / oval insets / quote cards | 146-148, 290-300 quote, 436-450, 600 | no |
| Cloud dive / white-out transitions | 12-22, 160-166, 198, 280-284, 454, 464, 478, 606, 636, 754, 768, 842, 902, 1036 | yes: all 14 found, 4 battle entries measured at 15 fps |
| Snowy close battlefield, 3D troops + smoke (La Rothiere) | 200-280 | yes (dive target) |
| Night wide / close 3D (Brienne, Champaubert night, Vauchamps night) | 166-196, 360-402, 430-452, 560-604, 990-1034 | partly (our night flashback) |
| Green wide tilted 3D terrain with cumulus, towns, banners | 284-358, 416-428, 608-634, 756-766, 844-858, 1038-1198 | yes |
| Close 3D battlefield, day: troops, smoke, villages, roads | 480-560, 638-752, 770-840, 904-990 | yes |
| River + bridge + towns close (Marne at Chateau-Thierry) | 790-830 | yes |

**Study frames (28 + 1 fps runs)**, each matched to one of our shots:

| GM t (s) | What | Matches our shot (v2 t) | Why |
| --- | --- | --- | --- |
| 11.0, 12.4, 16.2 | first dive: push-in with 3D numbers, cumulus deck, emergence | 15.0, 17.2, 18.2 | the dive itself |
| 200, 240 | snowy close battlefield after the first dive | 18.2 | what emerges from the fog |
| 500, 520, 540 | Champaubert close, cumulus + shadows, town | 25 (Bovina), 30 | close day battlefield with clouds over it |
| 640-700 (every 10 s) + 664-675 at 1 fps | Montmirail close: troop blocks, grey smoke, villages, roads, banners, plaque | 24-34 | our main battle shot |
| 780, 790, 800, 820 + 794-805 at 1 fps | Chateau-Thierry: river, bridge, towns, labels | 35-40 (bridge burns) | river + bridge |
| 910, 930, 950 | Vauchamps close, cloud shadows, arrows | 30, 40 | arrows, overlays |
| 290, 330, 420, 620, 760, 850, 1050, 1090, 1140 | wide tilted terrain + cumulus + towns + banners | 0-15 | our wide opening |
| 560 | overlay-heavy frame (plaque, pill label, medallion, oval inset) | 40.5 | overlays |

## 1. The cloud dive: what every GM dive shares (measured at 15 fps)

Four wide-map -> battlefield dives measured frame by frame (`/home/user/gm_ref/dl/gm_1814.mp4`, windows c-5..c+5 s):

| Phase | 478 s | 636 s | 768 s | 902 s | Shared |
| --- | --- | --- | --- | --- | --- |
| push-in on the wide 3D map (HUD stays) | 2.0 s | 4.8 s | 4.4 s | 3.4 s | slow push, then accelerates |
| clouds appear -> frame filled | 4.9-5.6 | 4.9-5.6 | 4.6-5.4 | 4.5-5.3 | **~0.7-0.8 s**, dense cumulus with map gaps, cloud shadows on the ground |
| cool cloud interior (flat) | 5.7-6.3 | 5.7-6.3 | 5.4-5.9 | 5.5-5.9 | **~0.5-0.6 s**, RGB ~(205-212, 208-215, 200-207), almost no vignette |
| the cut (tiny darkening dip, ~195) | 6.5 | 6.5 | 6.1 | 5.9 | hidden inside the white |
| warm cream + dark wisps | 6.7-7.2 | 6.7-7.4 | 6.3-7.3 | 6.1-6.7 | **~0.6-0.9 s**, centre ~(215-220, 212-216, 195-203), edge ~(195, 193, 176) warm vignette; grey-brown cloud undersides rush past |
| battlefield in | 7.3-7.5 | 7.5-7.7 | 7.5 | 6.9-7.1 | **snaps in within ~0.2-0.4 s**, contrast nearly full at once, thin haze |
| white total | 1.6 s | 1.7 s | 1.9 s | 1.4 s | **~1.4-1.9 s** |

The very first dive (9-24 s) is the special case: snow battlefield, so the scene stays pale (mean ~165, std ~17) after the
white-out; the white-out there is (207, 210, 204) textured cloud for 0.8 s then flat (218, 218, 209) centre / (190, 192, 181)
edge for 1.2 s, emergence 15.7-16.6. His gold 3D numbers (blue face, gold bevelled rim, extruded, cast shadow on the map)
float in world space and fly off the top of frame during the push-in; clouds pop in within ~0.4 s once the camera is close.
Other transitions: 1036 s and 282 s run the other way (white -> clouds part -> wide map), 164/198/454/464 are shorter
night variants (white ~0.8-1.5 s).

**v3 dive (ours), built from the shared pattern** (`index.html`, `DV`):
push 11.3 (3D gold title in world space from 11.66, flies over the lens ~13.5-14.5, its shadow on the map) -> deck fades in
14.85 (0.25 s) -> frame filled ~15.4 -> cool white 15.45-15.85 ramp, flat to 16.35 -> swap to the close map at 16.4 inside it ->
warm cream 16.35-17.2 with six dark wisps rushing outward -> battlefield in 17.2-17.6 (white 1 -> 0.14), last haze gone by 18.7;
plaque back with the clock at 19.46. White total ~1.75 s (15.45-17.2).

## 2. Region-by-region tables (3x3 crops at 2x, his vs ours v2)

### A. Dive start (GM 11.0 s vs ours 15.0 s)

| Region | His | Ours (v2) | Fix |
| --- | --- | --- | --- |
| Map | strategic map pushed in and tilted ~25-30 deg from vertical | wide relief map at 42-46 deg, static until 16 s | v3: push-in 11.3-15.2 with ease-in, tilt 44 -> 28 |
| Numbers / title | 3D gold numbers in world space, extruded, cast shadow, parallax | 2D GM title card glued to the screen | v3: 3D gold title (10 extruded layers) in the wide scene, shadow on the ground, flies past |
| Clouds | none until the camera is close, then a deck pops in | a few soft blurry blobs from frame 1 | v3: sprite cumulus, deck pops in at 14.85 |
| Plaque | stays during the push, gone in the cloud | stays through the dive | v3: plaque hides at 15.15, clock plaque returns after the fog |

### B. Mid-cloud (GM 12.4 s / 636+5.3 s vs ours 17.2 s)

| Region | His | Ours (v2) | Fix |
| --- | --- | --- | --- |
| Cloud shape | cauliflower cumulus, dozens of rounded lobes, flat-ish base, crisp silhouette, soft rim | smooth featureless fog blobs, blurry (half-res raymarch), grainy | v3: lit puff-sprite cumulus with a dedicated lobed cloud atlas, 26-46 puffs per cloud |
| Cloud shading | bright lit tops, grey-blue creases and undersides | flat grey-white, no creases | v3: lower lobes darker, own shade colour (0.40, 0.45, 0.55), 1.7x lighting contrast |
| Cloud shadows | dark soft shadows on the map next to each cloud | weak volumetric shadow | v3: one shadow disc per cloud (noisy edge) projected on the ground |
| Gaps | map clearly visible between clouds | haze everywhere | v3: deck coverage 86 % near the bridge -> 42 % at the rim |
| Speed | first cloud -> full frame 0.8 s | ~2 s of slow creep | v3: 0.25 s fade + fast descent, filled by ~15.4 |

### C. Emergence (GM 16.2 s and 636+7.6 s vs ours 18.2 s)

| Region | His | Ours (v2) | Fix |
| --- | --- | --- | --- |
| White-out | 1.4-1.9 s, cool off-white then warm cream with vignette, never #fff | no full white-out, half-cloud frames then a near cut | v3: two-layer white-out (cool / warm radial), 1.75 s |
| Wisps | dark grey-brown undersides rush past just before the scene | none | v3: six blurred wisps scale outward in the warm phase |
| Battlefield in | snaps in ~0.3 s, thin haze, far ground lighter | hard switch at full contrast | v3: overlay 1 -> 0.14 in 0.4 s, close fog (near 0.15 d, far 1.7 d, cream) relaxes by 18.7 |
| Units at emergence | thin flat blue bars + tiny figures visible through the haze | Style W boxes pop in | kept our Style W boxes; they fade in at 17.0 under the haze |

### D. Close battlefield with troops and smoke (GM 640-700 s, 670 at 1 fps vs ours 30 s)

| Region | His | Ours (v2) | Fix |
| --- | --- | --- | --- |
| Ground | sand / ochre / olive fields, low contrast, faint furrows, slight blur | crisp strip fields rust/green, sandpaper grain | grain 0.14 -> 0.08 (v3); ground palette left (not cheap) |
| Forests | dense dark-green clumps, jagged noisy edge | rows of round crowns, "string of pearls" hedgerows | not cheap (bake); noted |
| Rivers | thin grey-blue line, small trees along it | wide grey-blue river | left (ours is the Big Black, wide is right) |
| Roads | thick red-brown dirt roads, clearly readable | faint thin pinkish line | v3 bake: close road 0.15 -> 0.24 units wide, colour #7a5940; wide 0.7 -> 0.9 |
| Towns | 20-40 small red-roofed houses with walls along the road, label beside | Bovina small; farmsteads read as **red crosses / aeroplanes** | v3 bake: farmsteads are courtyards (houses tangential on four sides) |
| Units | dense blocks of tiny 3D soldiers in ranks; long thin bars | Style W boxes with X | kept (owner: our troops stay Style W) |
| Smoke | big grey-blue billows, village-sized, semi-opaque, drifting | small white puffs | v3: musketry smoke size 1.0 -> 1.35, alpha 0.10 -> 0.15, bluer grey |
| Banners | small flag + dark name plate, portrait medallion on a pole | flag + plain caps name | left (Style W banners) |
| Labels | place names in serif with strong drop shadow | similar | ok |
| Plaque / HUD | clock plaque, legend, day timeline with wax seal | same layout | ok (matches) |
| Camera | ~50-55 deg from vertical, horizon haze at the top | 38-44 deg, flat | not changed in v3 (would move every pinned overlay) |
| Grade / vignette | warm olive, mild vignette | similar, flatter | ok |

### E. Wide tilted map (GM 620, 760, 1050 s vs ours 6 s)

| Region | His | Ours (v2) | Fix |
| --- | --- | --- | --- |
| Relief | strongly sun-lit valleys, bright slopes, dark shadows | low relief contrast | left (v2 already raised it) |
| Clouds | small crisp white cumulus with lit tops and shadows | soft blurry blobs | v3: sprite cumulus (sparse layer, 14-30 unit clouds) |
| Towns | star-shaped red street clusters | small red smudges | left |
| Labels | many small caps names with dark shadow | few names | left |
| Grain | fine | coarse | v3: grain 0.08 |

### F. Overlays (GM 560 s vs ours 40.5 s)

| Region | His | Ours (v2) | Fix |
| --- | --- | --- | --- |
| Plaque | ivory, notched, watch | same | ok |
| Pill label | white pill caps with a leader to a medallion | dark GM label card | ok (both GM styles) |
| Ledger | (not in this video) | ivory ledger | ok |
| Oval inset | gold oval frame with caption plaque | inset photo | left |

## 3. Still different after v3

- GM troops are 3D soldier blocks; ours stay Style W boxes (by design).
- ~~GM camera is more oblique with horizon haze~~ v4: close tilt 50-54 deg, fov 30, haze 0.85 d-2.6 d #b2bec4.
- ~~GM forests are dense jagged clumps~~ v4: canopy blanket + merged crown clusters, jagged edge, clearings; hedgerows continuous. Still: his canopy grain is finer and flatter; our edge crowns can still show round silhouettes up close.
- ~~GM towns are much denser~~ v4: Bovina street plan with packed rows, church, gardens; farm courtyards. Still: Bovina sits at the left edge of most close shots, so his town-in-the-middle look is rarer here; his towns are bigger.
- v4 ground: palette/mottle matched, but his close fields still show more crisp tracks and strip boundaries; his wide relief has brighter, broader sunlit valley sides.
- Our dive deck is sprite cumulus: up close the lobes are a little more regular than his volumetric clouds.
