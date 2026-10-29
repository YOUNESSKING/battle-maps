# Map colour / grade ideas (2026-10-29)

**Question from the owner:** "Why not brighter, why that specific colour?" A test that put a navy tint on the day close-ups was rejected because it read as night.
**What this file does:** it compares 6 basemap grades on the **same 3 real Sherman frames**. Each frame was re-rendered by `hyperframes snapshot`
from a scratch copy of the shipped scene, with only the basemap image swapped. Units, territory `_mx` overlays, the geography layer, fronts, night layer and cards are untouched.
Nothing shipped was edited.

- **Sheet:** `research/map_colour/ideas-sheet.jpg`. Each row is one candidate: wide option 1 (0:05, `hook-a` t=5.0), day close-up option 2 (2:55, `move1b` t=14.48), night (11:00, `move2d` t=46.5), then the same three again at **390 px phone width**.
- **Single images:** `research/map_colour/c{0..5}_{wide,dayclose,night}.jpg` (1280 px wide) and `..._phone390.jpg`.
- **Numbers:** `research/map_colour/metrics.json`. **Competitor frames:** `research/map_colour/competitor-frames.jpg`.
- **Reproduce:** `research/map_colour/grades.py BASE OUTDIR` (run from `sherman/`) builds the basemaps; `compose.py` builds the sheet and the metrics.
- **Labels in this file:** **[measured]** = computed by me on our frames. **[source]** = an external citation. **[judgement]** = my opinion as art director.

---

## 1. What the evidence says

### 1.1 Our own frames [measured]
| frame | mean luma (0-255) |
|---|---|
| Sherman wide option 1 (0:05) | 78 |
| Sherman day close-up, corridor (2:55) | 92 |
| Sherman day close-up, Bentonville (13:45) | 108 |
| Sherman night (11:00) | 36 |
| Rokossovsky v8 (locked reference): wide 0:05 | 77 |
| Rokossovsky v8: **Volokolamsk close-up (0:30)** | **115** |
| Rokossovsky v8: Kursk night (0:45) | 70 |
| Rokossovsky v8: **Bobruisk close-up (1:15)** | **106** |

- **The locked reference's day close-ups are not navy. They are the same grey-green as Sherman's, and brighter.**
  This contradicts the premise of critique P10 and review F7, which say "the reference close-ups are dark navy/slate". Only the Kursk beat is navy, and Kursk is the **night** beat.
  So the navy-tint test copied the night look onto day shots. That is why the owner read it as night.
- **Why Sherman's corridor close-up looks duller than the reference:** `bake_hd.py` uses one fixed ramp, `(16,22,22)->(138,154,140)`, gamma 1.15, with slope darkening and ambient occlusion.
  The Appalachian ridge-and-valley terrain is mostly slopes, so its shading drops. The land median of the shading value `a` is 0.71 on corridor, 0.74 on south and 0.78 on savannah.
  The same grade therefore gives a different exposure on every map. **Nothing normalises exposure between maps.** That is the "washed-out / inconsistent" feeling, not the hue.
- **Contrast of our story colours against the current base is very low** (WCAG ratios against the median colour of the close-up land, `metrics.json`):
  blue line `#2c57b7` 1.36:1, red line `#bc2528` 1.25:1, blue counter `#1f4fc4` 1.45:1, red counter `#c4121f` 1.24:1.
  These have almost the **same luminance as the ground**. They read only through hue, glow and white outlines. At phone size, hue is the first cue to fail.
  Unboxed white text (`#f7f3ea`) is 4.41:1, which is the one thing a dark base does well.
- **Colour-blind check** (Machado 2009 simulation, severity 1.0) [measured]:
  - The red and blue lines differ by only 1.09:1 in luminance for normal vision, and 1.35 (deutan) / 1.42 (protan) for colour-blind viewers. The pair is told apart **by hue only**.
  - The blue-yellow axis survives CVD, so the pair stays distinguishable. But **red turns olive** for colour-blind viewers. On today's grey-green base the protan red line is only ΔE 25 from the ground (deutan ΔE 39).
  - On a warm light base it rises to ΔE 34-47. A brighter base helps the ~8 % of male viewers with red-green CVD the most.

### 1.2 Competitors (YouTube's auto frames `hq1/2/3.jpg` = frames at about 25/50/75 % of each video; mean luma measured on the map frames) [measured + described]
| channel / video | what the map looks like | luma |
|---|---|---|
| **Tactical Genius** (our format model): Ridgway `tVpl949Nk0M` hq2/hq3, Zhukov `BvJN3pyPL6E` hq2/hq3, Patton `5EoX2EYJ_WI` hq2 | pale blue-white or tan shaded relief, saturated red/blue blocks, white boxed labels; daylight, high-key | 133-179 (Patton desert 101) |
| **The Operations Room**: Carentan `42Je15vVtlQ` hq2, Bulge `UoynTOzLD28` hq2, Iwo Jima `g9rMTlJNcIQ` hq2 | very light grey/white street-level map; light green-grey relief with a pink-red enemy zone; light satellite | 127-209 |
| **Epic History TV**: Austerlitz `bhQe2cjr5XQ` hq1, Waterloo `nDZGL1xsqzs` hq1, 1814 `l0zRU35sovQ` hq2 | saturated political pastels; dark olive campaign map; muted brown satellite terrain with red arrows | 77-114 |
| **Kings and Generals**: Stalingrad `Aupnv5n19K4` hq3, Six-Day War `hHqJ6pgdE-c` hq2 | flat, strongly saturated political fills; dark teal sea + orange land | 75-86 |
| **Netflix "WWII: From the Frontlines"** (our `frontlines-1m/` study) | dark desaturated relief, glowing fronts, premium "cinema" feel | dark (~70-90) |

Frame URLs follow the pattern `https://i.ytimg.com/vi/<id>/hq2.jpg`, e.g. https://i.ytimg.com/vi/tVpl949Nk0M/hq2.jpg, https://i.ytimg.com/vi/42Je15vVtlQ/hq2.jpg, https://i.ytimg.com/vi/bhQe2cjr5XQ/hq1.jpg, https://i.ytimg.com/vi/Aupnv5n19K4/hq3.jpg.
Video lists come from vidIQ `channel_videos` (most popular long-form).

[judgement] The channel whose format we copy (TG) and the most "tactical" one (Operations Room) use **bright, daylight maps (luma 130-180)**. The dark look belongs to Netflix and some K&G/EHTV episodes. Our day close-ups at 92 are darker than every tactical-map competitor.
"Brighter" is the genre norm. "Dark" is our premium differentiator. The sensible answer is in between: a **mid-key day base (~115-125)** that stays clearly separate from the blue night.

### 1.3 Principles [source] + how they apply [judgement]
- **Text contrast:** WCAG 2.1 SC 1.4.3 asks 4.5:1 for normal text and 3:1 for large text. SC 1.4.11 asks **3:1 for graphical objects** needed to understand the content, which on our maps means fronts, counters and arrows.
  https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html · https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html
  Our counters and lines are at 1.2-1.5:1 today. Brighter bases double that (2.0-4.1:1).
- **Polarity:** dark-on-light (positive polarity) gives better acuity and proofreading at every age, and the advantage **grows as characters get smaller**. That is our phone case.
  Piepenbrock, Mayr, Mund & Buchner, *Ergonomics* 2013, and *Human Factors* 2014 ("Positive display polarity is particularly advantageous for small character sizes"). Summary: NN/g https://www.nngroup.com/articles/dark-mode/
  [judgement] It applies to the map **symbols** (dark-outlined counters on a light ground). Our **white** labels need the opposite, so on a lighter base every white label must sit on a dark box or halo. The geography layer already has one (`make_geo_layer.py` halo `(10,14,16)`).
- **Colour-blind safety:** red/green is the problem pair. Red/blue is the recommended diverging alternative, but it is not safe for tritans and needs a second cue such as labels or shapes. Simulators such as Coblis can check a frame.
  https://data.europa.eu/apps/data-visualisation-guide/accessible-colour-palettes · https://knightlab.northwestern.edu/2016/07/18/three-tools-to-help-you-make-colorblind-friendly-graphics · https://nceas.ucsb.edu/sites/default/files/2022-06/Colorblind%20Safe%20Color%20Schemes.pdf
  Simulation method: Machado, Oliveira & Fernandes 2009, https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html
  We already have the second cue: flag chips and silhouettes on the counters.
- **Day vs night:** film codes night as **blue, darker and desaturated** ("day for night", https://en.wikipedia.org/wiki/Day_for_night). Our locked night (`GG.night` navy wash + muted `#4a6a9a`/`#a8503c`) follows that code.
  [judgement] Day therefore reads most clearly as **warm or neutral, not cool**. A grey-**green** day base already leans cool. Any blue in the day grade reads as night (the owner's reaction confirms this).
- **Base map hierarchy:** the base should be quiet and low-chroma so the thematic layer pops (standard cartographic figure-ground practice; Tom Patterson, https://shadedrelief.com/).
  All candidates keep the base low in saturation.

---

## 2. The candidates (exact values)

All grades except C3 are built from the same shading value `a` that `bake_hd.py` already computes:
`a = clip(light*0.85 + t*0.12, 0, 1) ** 1.15`. `grades.py` recovers `a` from the existing `_hd_ref.jpg`; in `bake_hd.py` you would use it directly.
**Exposure normalisation** (new, used by C1, C2, C4, C5): `med = median(a[land])`, `an = a ** (log(TARGET)/log(med))`. Every map then gets the same land median, whatever the terrain.
`ramp(an, D, L) = D + (L - D) * an`. Coast blend: `rgb = sea*(1-coast) + land*coast` (as in bake_hd). Territory `_mx` overlays, fronts, counters, `K.night`, `GG.night` and the geography layer are **unchanged** in every candidate (except the small changes noted per candidate).

Measured on the re-rendered frames (`metrics.json`). Contrast ratios (CR) are against the median colour of the close-up land.

| | basemap (land / sea) | close-up land median | white text CR | blue / red line CR | blue / red counter CR | frame luma wide / day / night |
|---|---|---|---|---|---|---|
| **C0 current** `_hd_ref` | `(16,22,22)->(138,154,140)`, gamma 1.15, no normalisation / sea `(16,27,34)` | (104,116,107) | **4.41** | 1.36 / 1.25 | 1.45 / 1.24 | 79 / 92 / 38 |
| **C1 lifted Frontlines** | `ramp(an, (24,31,31), (190,202,184))`, TARGET 0.70 / sea `(18,33,44)` | (141,151,138) | 2.74 | 2.20 / 2.02 | 2.33 / 2.01 | 91 / 117 / 40 |
| **C2 stone** | `ramp(an, (58,54,46), (222,214,194))`, TARGET 0.62 / sea `(44,62,72)` -> deep `(30,44,54)` by depth/2500 m | (161,154,138) | 2.53 | **2.38 / 2.19** | **2.52 / 2.17** | 97 / 121 / 42 |
| **C3 parchment HD** `_hd` (Goose Green palette: LOW `(226,212,176)`, HIGH `(146,140,100)`, PEAK `(236,232,220)`, SEA `(168,186,184)`) | as baked | (207,196,165) | 1.57 | 3.83 / 3.52 | 4.07 / 3.50 | 128 / 151 / 58 |
| **C4 topo daylight** | hypsometric by elevation fraction t: `(200,208,182)` at t=0 -> `(196,186,150)` at t=0.4 -> `(158,144,108)` at t=1, times `(0.50 + 0.62*an)`, TARGET 0.62 / sea `(112,152,176)` -> `(78,116,146)` | (175,172,144) | 2.08 | 2.89 / 2.66 | 3.07 / 2.64 | 112 / 134 / 49 |
| **C5 stone + spotlight** | C2 + a screen-space vignette: `r = ellipse((x-0.5w)/0.5w, (y-0.52h)/0.5h)`, `alpha = clip((r-0.55)/0.75, 0, 1)^1.4 * 0.50` toward `(10,12,14)` | (161,154,138) at the centre | 2.53 | 2.38 / 2.19 | 2.52 / 2.17 | 87 / 107 / 38 |

CVD, line against the ground (ΔE76 in Lab, simulated) [measured]:

| | protan, red line | deutan, red line |
|---|---|---|
| C0 | 25.3 | 39.4 |
| C1 | 33.9 | 40.4 |
| C2 | 34.1 | 37.5 |
| C3 | 46.6 | 42.3 |
| C4 | 37.9 | 36.8 |

Blue stays at 58-87 everywhere.

### C0. Current `_hd_ref` (dark grey-green): baseline
- **Why it was chosen:** the Netflix "Frontlines" premium look. The glow on fronts and planes reads best on dark, white labels pass 4.4:1, and it is consistent with the locked Rokossovsky video.
- **Pros:** the most cinematic; the strongest glow; white text works without boxes; no change.
- **Cons:**
  - Counters and lines sit at the ground's luminance (1.2-1.5:1).
  - Exposure varies by terrain (corridor 92 vs Volokolamsk 115), so close-ups look "washed out" or "dull" on ridge country.
  - Darker than every tactical-map competitor.
  - Protan red line is only ΔE 25 from the ground.
- **Rules:** keeps every lock.

### C1. Lifted Frontlines (same hue, +exposure, normalised)
- **Why:** it answers "why not brighter" with the **smallest possible change**: same grey-green family, same dark sea, and every map normalised to the same exposure.
  Close-ups go from 92 to 117, the reference's own Volokolamsk level. Line and counter contrast rises about 1.6x.
- **Pros:**
  - Looks like the locked video, only cleaner.
  - Fixes the map-to-map inconsistency.
  - The night is unchanged (frame luma 40 vs 38).
- **Cons:**
  - Unboxed white text drops to 2.7:1; it needs the existing halo and boxes.
  - Still a cool green. Day/night separation is better than with navy but not as clear as with warm.
  - Glow is a little less luminous.
- **Rules:** keeps the hue of STYLE_LOCK 0b item 2 / 2a "dark HD maps everywhere" but **lifts its exposure**. Tell the owner it is a brightness change to the locked grade. All colours, fronts, territory and night stay locked.
- **Apply:** in `bake_hd.py`, add after the `_hd_ref` block:
  ```python
  med = np.median(a[land]); an = a ** (np.log(0.70) / np.log(med))
  rgb = np.array([24,31,31.]) + (np.array([190,202,184.]) - np.array([24,31,31.])) * an[..., None]
  rgb = np.array([18,33,44.]) * (1 - coast) + rgb * coast
  finish(rgb, f"assets/{base}_hd_lift.jpg")
  ```
  Then point the scene's basemap to `<map>_hd_lift` (`build_scene.py NAME <map>_hd_lift ...`), and also any copy such as `assets/media/hook_south_hd_ref.jpg` in the hook. No scene code changes.

### C2. Stone (warm neutral mid-key, dark sea): **recommended**
- **Why:**
  1. **Warm/neutral = day, blue = night.** This fixes exactly what the owner disliked about the navy test. Day and night become two clearly different colour temperatures, not two shades of the same cool grey ([source] the day-for-night code; [judgement]).
  2. Mid-key (close-up 121, wide 97) sits between Netflix and TG. It is brighter, as the owner asked, but not a pale parchment that flattens the glow.
  3. The best day contrast for the story layer short of parchment: lines and counters 2.2-2.5:1, about 1.75x today.
  4. The **dark slate sea** keeps the premium Frontlines frame and a strong coastline.
  5. Territory `_mx` multiply stays deep brick red and slate blue on it, **not pink** (compare C3).
- **Pros:**
  - Rivers (blue) and rail lines (black) pop more.
  - Reads like a period staff map, which suits 1860-1945.
  - Normalised exposure on every map.
  - The night is unchanged (42 vs 38).
- **Cons:**
  - Unboxed white text drops to 2.5:1. Keep labels boxed or haloed (the geo layer has a halo). Flag names ("UNITED STATES") should get a stronger dark text-shadow, e.g. `0 0 6px rgba(0,0,0,.9)`.
  - Front glow is a little less "neon" than on near-black.
  - Lakes drawn by the geo layer (`water=(16,27,34)`) are darker than the new sea. Set the stone style's `water=(44,62,72,255)`.
- **Rules:**
  - **Changes STYLE_LOCK 0b item 2 / 2a "dark HD maps everywhere"** for **day land**: the land is no longer dark grey-green but warm stone. The sea stays dark. Needs owner approval through a test clip.
  - Keeps the territory colours and `_mx` multiply, the option 1 / option 2 choice, front width 15 / glow 0.47, LINE_DAY / LINE_NIGHT, GG.night and K.night, flags, emblem and labels.
- **Apply:**
  - `bake_hd.py`:
    ```python
    an = a ** (np.log(0.62) / np.log(np.median(a[land])))
    rgb = np.array([58,54,46.]) + (np.array([222,214,194.]) - np.array([58,54,46.])) * an[..., None]
    sea = np.array([44,62,72.]) * (1 - depth) + np.array([30,44,54.]) * depth   # depth = clip(-elev/2500, 0, 1)
    rgb = sea * (1 - coast) + rgb * coast
    finish(rgb, f"assets/{base}_hd_stone.jpg")
    ```
  - `make_geo_layer.py`: add a style `"stone"` that is `"ref"` with `water=(44,62,72,255)`.
  - Scenes: basemap `<map>_hd_stone`. Night beats need nothing (the navy `GG.night` wash covers the base).

### C3. Parchment HD (`_hd`, the Goose Green look)
- **Why consider it:** the brightest and most "classic" (K&G/EHTV and TG-like). It has the best counter/line contrast (3.5-4.1:1, passing WCAG 1.4.11) and the best CVD separation.
- **Cons (decisive):**
  - Territory `_mx` multiply on cream turns **salmon/pink**, and the "snow" peaks blotch pink (see `c3_wide.jpg`). That is the "turns pink" failure that 2a already warns about.
  - Unboxed white text falls to **1.57:1**.
  - The front glow nearly disappears; the "premium" feel is lost.
  - Night lifts to 58 (the sea reads mid-grey), so `GG.night` would need about +0.12 alpha.
  - The owner moved away from this look in 0b.
- **Rules:** reverses 0b item 2 and needs a new territory style (alpha around 0.6 or non-multiply fills). Listed for completeness; **not recommended**.
- **Apply:** basemap `<map>_hd` (it already exists) + the `parchment` geo style + territory alpha about 0.6.

### C4. Topo daylight (light hypsometric, blue sea; TG / Operations Room key)
- **Why:** the genre's daylight look. Bright (close-up 134), counters 2.6-3.1:1, and the elevation colour tells the viewer where the high ground is, which matters for tactical moves (ridges, passes).
- **Cons:**
  - The sea and lakes become a light saturated blue, which competes with the **blue side's** colour and its glow.
  - On flat coastal maps the elevation tiles show blocky artefacts (`c4_night.jpg`, savannah).
  - White text 2.1:1; night lifts to 49.
  - The furthest from the locked Frontlines feel.
- **Rules:** changes 0b item 2 and the sea colour. **Not recommended** as the default; possibly useful for one mountain-pass close-up.
- **Apply:** a `bake_hd.py` block with the hypsometric formula above (`_hd_topo`).

### C5. Stone + spotlight (C2 + stronger edge vignette)
- **Why:** it keeps C2's bright, readable centre where the action is and darkens the frame edges to near-black, the Netflix "spotlight" composition. The frame average (107) stays close to the reference, so cuts to archive film and cards are not a brightness jump.
- **Pros:** premium plus readable; it guides the eye to the centre.
- **Cons:**
  - Corner UI (date scroll, legend, badges) sits in the darkened zone. In a real build the vignette must go **under the UI layer**; my test applied it on top, as an approximation.
  - Flags or units near the frame edge get darker.
- **Rules:** like C2. The locked style already has "vignette + grain"; this only makes the vignette stronger.
- **Apply:** a screen-space div in the map stage, under the overlay/UI (not in the world, so it does not move with the camera):
  `background: radial-gradient(ellipse 60% 58% at 50% 52%, rgba(10,12,14,0) 55%, rgba(10,12,14,0.5) 100%)`.
  It could be a `GG.spot()` helper in `lib/gg.js`, applied on wide shots only.

---

## 3. Ranking and recommendation

1. **C2 Stone**: recommended default for day shots, wide and close. It is brighter, warm = day against blue = night, gives the best story-layer contrast that still keeps the dark premium frame, and the territory stays strong (not pink).
2. **C5 Stone + spotlight**: C2 plus a stronger vignette under the UI, for wide option-1 shots if C2 alone feels too "flat-light".
3. **C1 Lifted Frontlines**: the safe, minimal fix if the owner wants to keep the locked grey-green. Its exposure normalisation should be adopted **whatever the owner picks**.
4. **C0 Current**: approved and cinematic, but dim and inconsistent on rugged terrain, and the story colours sit at the ground's luminance.
5. **C4 Topo daylight**: genre-typical, but the blue sea fights the blue side and it is the furthest from the lock.
6. **C3 Parchment HD**: pink territory, failing white text, lost glow.

**Night stays the locked muted blue in every option.** With C1, C2 and C5 the night frames measure 38-42, against 38 now, so no change is needed. With C3 or C4, raise `GG.night` alpha by about 0.1.

**Before applying (owner rule "test before applying"):**
- Bake `_hd_stone` (and `_hd_lift` as the fallback) for one map.
- Rebuild one scene (e.g. `move1b` with corridor) and make a 1-minute clip with `make_clip.py` covering a day close-up, a wide option-1 shot and a night beat.
- Show it next to the current version. Apply only after the owner's OK, then add the chosen grade to STYLE_LOCK 0b/2a and `map-kit/tools/bake_hd.py`.

**Independent of the grade [judgement]:**
- The low contrast of counters and lines is mostly a **size** problem (critique P1). A brighter base roughly doubles their contrast, but bigger counters with dark outlines still matter more.
- Critique P10 / review F7 ("make close-ups navy like the reference") should be corrected. The reference's day close-ups are grey-green at luma 106-115, not navy.
