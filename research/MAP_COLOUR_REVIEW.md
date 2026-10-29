# Map colour review: verdict on the proposals (2026-10-29)

Reviewer brief: judge the 6 grades in `MAP_COLOUR_IDEAS.md` (C0-C5) and the fixes in `MAP_COLOUR_CRITIQUE.md` (P1-P8), check their
evidence on real frames, and give the owner ONE recommendation plus the test that must come before it.
Evidence image: `research/map_colour/final-pick.jpg` (CURRENT vs the pick on the same 3 frames, full size and at 390 px phone width).
Nothing else was edited.

---

## 0. Short answer for the owner

- **Why did the navy test look like night?** Because navy *is* the night colour of the locked reference. Rokossovsky v8's only navy map is the
  Kursk night barrage. Its day close-ups are grey-green and bright. STYLE_CRITIQUE P10 and STYLE_IDEAS_REVIEW F7 misread a night frame as a day frame.
- **Why aren't the maps brighter?** For two reasons. (1) The wide shots (62 % of Sherman's frames) are dark because **61 % of each wide frame
  is red multiply territory**, which takes away about two thirds of the light. (2) The dark grade is a fixed ramp with no exposure control, so
  ridge country (the move-1 corridor) comes out ~20 % darker than flat country. Flat close-ups (5:55, 13:45) are already at the reference level.
- **Why this colour?** The dark sage grey-green is the owner-approved "Frontlines" grade (2a, 0b item 2). It is used on 7 published or
  finished videos (Rokossovsky, Collins, Peng, Jackson, Greene 2, Meade, Sherman). It works. It is just under-exposed on rugged terrain.
- **Pick:** **C1 "lifted Frontlines"** (same hue, brighter, exposure normalised per map) **+ 3 critique fixes**: P6 texture softening, P2
  counter keylines, and P1/P4 option choice for the red-heavy wides and the night shots. No hue change, no new palette, and night stays as locked.

---

## 1. My own measurements (frames extracted to `/tmp/claude-0/colour_review/`)

Method: ffmpeg frames at 1280x720. Rokossovsky v8 at 1 fps (98 frames). Sherman 720p every 10 s (95 frames) plus the named times.
Y = Rec.709 luma (0-255) of the whole frame. Shot type comes from a hue classifier (wide = red+blue territory >= 50 % of the frame;
close-up = >= 65 % low-saturation grey-green) and was checked against contact sheets.

| Frames | n | Mean Y (range) | Mean RGB | Verdict on the claims |
|---|---|---|---|---|
| Ref wide option 1 (0:00-0:19) | 20 | **76** (72-78) | (78,75,81) | Both docs say 76-77: **correct** |
| Ref Volokolamsk day close-up (0:21-0:37) | 17 | **117** (117-118) | (112,119,111), land median (113,127,116) | Grey-green, not navy: **confirmed** |
| Ref Kursk (0:39-1:00, "ATTACK AT DAWN", 02:20 clock) | 22 | **72** (70-77) | (67,72,82), blue cast | Navy = **night** beat (0b: "night counter-barrage"): **confirmed** |
| Ref Bobruisk day close-up (1:02-1:20) | 19 | **108** (108-110) | (102,110,107) | Grey-green: **confirmed**. "106-118" in both docs is right within 2 Y |
| Sherman wide option 1 | 59 | **64** (51-81) | red = 61 % of frame | Critique's 64 / 65 % red: **confirmed** |
| Sherman day close-ups | 19 | **104** (88-123) | grey-green | **"Sherman day close-ups Y ~92" is cherry-picked** (see E1). Only the corridor ones (2:55 = 94, 3:25 = 97) are that dark. 5:55 = 110 and 13:45 = 110 already match Bobruisk |
| Sherman night (5:30 / 11:00 / 13:00) | 3 | **45 / 37 / 48** | navy + maroon | Critique's 37-48: **confirmed**. Ref night is 72 |
| Night distribution | | Kursk median 54, 2-5 % of pixels < Y 30, 12 % > Y 120 | Sherman median 28-39, **40-61 % < Y 30**, 3-10 % > Y 120 | Explains the night gap (see E8) |

Competitor tiles in `competitor-frames.jpg`, re-measured by me per tile: TG Ridgway 133/145, Zhukov 165/179, Patton 150 (map) / 103;
Operations Room Carentan 209, Bulge 127; K&G 75-88; EHTV 77-117. **The numbers reproduce.** The sampling is weak (see E4).

---

## 2. Verdicts

### 2.1 Grades

| | Verdict | Reasons (day reads as day / night as night / red-blue incl. CVD / phone labels / option-1 territory / glow / wide-close consistency / catalogue / effort) |
|---|---|---|
| **C0 current `_hd_ref`** | **REJECT as-is** (keep as fallback; nothing is lost if C1 fails the test) | Day reads as day and night as night. But ridge-terrain close-ups are 94-97 against the reference's 108-117, so the owner's "why not brighter" is fair. There is no exposure control: the same grade gives 94 on the corridor and 110 at Bentonville. White labels are the best of all candidates (4.4:1 vs base). Glow is the strongest. |
| **C1 lifted Frontlines** | **TEST FIRST, then ADOPT** (the pick) | Same hue, so day still reads as the reference's day. The corridor close-up lands at **Y 117 with land median (113,123,114)**, essentially Volokolamsk's (113,127,116) on the locked reference. Night is unchanged (40 vs 38). Option-1 wide lifts 79 -> 91, and red ground lifts with it (multiply scales with the base), which partly answers P1. Lines and counters rise about 1.6x against the ground. Catalogue cost is near zero: it reads as "the same look, better exposed", not a restyle. Effort: about 6 lines in `bake_hd.py`, a re-bake (minutes per map), and a basemap rename in the scenes. **Risks:** micro-texture gets busier (high-pass 5.1 -> 6.8, reference 2.5), so it must ship with P6. Unboxed white text drops to 2.7:1 against the base (the geo halo and boxes cover it). |
| **C2 stone** | **REJECT** (as the default) | It is brighter and does read as day, but it solves a problem that does not exist. The owner rejected **navy + dark (Y 46-53)**, not grey-green, and the owner-approved reference's day close-ups ARE grey-green. A warm hue on new videos splits the catalogue (7 grey-green videos). On a single video it gives warm close-ups next to cold slate-blue Union ground on wides. Texture is the busiest of all (7.7). Red ground drifts orange. White text 2.5:1. It changes 0b item 2. |
| **C3 parchment HD** | **REJECT** | Pink territory, white text 1.57:1, glow gone, night 58, and it reverses 0b item 2. Both docs agree. |
| **C4 topo daylight** | **REJECT** | The light blue sea competes with the blue side. Blocky tiles. Furthest from the lock. White text 2.1:1. |
| **C5 stone + spotlight** | **REJECT** | It brightens the base and then darkens the frame back to 107, which cancels the point. The test vignette also darkened the date scroll and the corner UI. The lock already has a vignette. It inherits all of C2's problems. |
| Exposure normalisation (part of C1/C2/C4/C5) | **ADOPT through C1's test** | It is the real fix for "inconsistent / dull on ridge maps". It is independent of the hue. |

### 2.2 Critique fixes

| Fix | Verdict | Reasons |
|---|---|---|
| P1.1 option 2 / swath on the march maps, frame both sides on overviews | **ADOPT** (inside the lock, 2a "choose by eye") | This is the biggest brightness lever on the wides, which are 62 % of the frames, and it costs no lock change. A basemap grade cannot fix a frame that is 61 % red multiply. |
| P1.2 lighter axis multiply (240,105,95) | **TEST FIRST, later** | It changes the 2a `_mx` colour. The risk is pink or salmon red ground (the failure 2a warns about). Try it only if C1 + P1.1 still leave the wides too dark. |
| P2 cream keyline + dark edge on counters/tags, white size marks, offset from the ribbon | **ADOPT after a snapshot** | Colours are unchanged. It fixes red-on-red and protan counters on every grade, matches the reference counters, and costs little (`K.counter` style). |
| P3 labels >= 18 px wide / 15 px close-up | **TEST FIRST, owner decision** | The critique calls it "follows the reference", but **STYLE_LOCK 7 lists "big labels" as REJECTED** and 2a says "small labels". It is a real conflict, not a fix within the lock. It is outside the colour question, so keep it out of this test. |
| P4 lift night to Y ~70 by changing the night factor | **REJECT the mechanism; ADOPT the content fix** | `G.night` is **byte-identical** in `rokossovsky/lib/gg.js` and `sherman/lib/gg.js` (lines 135-142). Kursk is brighter because of what is under the wash (inland, option-2 fronts only, 6 glowing belts), not a different night. Changing the alpha would change the locked night. Instead: use option 2 at night (fronts glow, no maroon fill), keep labels white, frame less sea, and re-bake `savannah_hd_ref` to remove the tile seams. |
| P5.1 dark core edge on the fronts | **TEST FIRST** | Plausible for protan viewers, but it can dull the glow, which is locked. Show it on one close-up. |
| P5.2 lighter red front #d0453a | **REJECT for now** | It changes the locked front colour. P2's keylines and C1's lift (red line 1.25 -> 2.0:1) cover most of the gain. |
| P6 brighten + soften close-ups (top colour (160,176,160), `fine` 0.10 -> 0.04, smoothing sigma 1.0 -> 1.6 at zoom >= 11) | **ADOPT the softening with C1; REJECT the separate top-colour change** | C1 already sets exposure, with normalisation, which a fixed (160,176,160) does not give (corridor would stay darker than Bentonville). The softening is required because C1 makes the texture busier. |
| P7 legend chips in the multiplied colour | **ADOPT after a snapshot** (low priority) | Small and harmless. |
| P8 never select parchment `_hd` | **ADOPT** (no action) | |

---

## 3. Errors, overclaims and misread evidence

### In MAP_COLOUR_IDEAS.md
- **E1. "Sherman day close-ups Y 92" is cherry-picked.** That figure is the single darkest close-up (corridor, 2:55). Over 19 close-up frames
  the mean is **104** (88-123), and 5:55 / 13:45 are already at 110. The gap to the reference is ~10 % overall and ~20 % only on ridge maps.
  The doc's own table shows Bentonville 108, but the text and the competitor comparison use 92.
- **E2. "Night is unchanged (40 vs 38)" is listed as a pro.** The locked reference night is **Y 72**, and the doc's own table shows Kursk 70.
  Sherman's night is half as bright, and no grade addresses it. That is a gap left open, not a virtue.
- **E3. Contrast ratios are measured against the baked basemap median, not the screen.** On screen the ground is ~15-20 % darker (vignette,
  overlays): C0 base (104,116,107) vs frame land (85,96,88). The counter CRs use the fill colour only and ignore the white glyph and edge.
  The *relative* gains (about 1.6x for C1) hold. Absolute claims such as "counters at 1.2:1" overstate how invisible they are.
- **E4. Competitor sampling is thin and not representative.** It uses YouTube's `hq1/2/3.jpg` stills (one frame near 25/50/75 % of each video),
  hand-filtered to "map frames". For TG that is **5 map frames from 3 videos**. There is no committed script (`compose.py` does not compute
  them). Netflix "~70-90" was not measured at all. A Gulf War row in the sheet (Y 194-223) is missing from the table. The numbers reproduce,
  but they show that TG is brighter, not that brighter performs better. There is no CTR or retention link. TG also uses a different system
  (flat light maps, boxed labels), so its luma does not transfer to ours.
- **E5. "Warm = day, grey-green leans cool, so day must go warm" contradicts the locked evidence.** The owner-approved reference's day
  close-ups are grey-green and read as day. What failed in the navy test was **blue AND dark (Y 46-53)**. Day needs to be brighter and not blue.
  It does not need to be warm. This error is what makes C2 look necessary.
- **E6. The wide test frame is unrepresentative.** It uses 0:05: 44 % red, with a big quote card and the Lincoln badge covering a third of
  it. Typical Sherman wides are 60-90 % red. The grades' effect on the dominant red-heavy wides was not shown.
- **E7. The doc does not mention that C1/C2/C4 make the close-ups busier.** Median high-pass rises 5.1 -> 6.8 (C1) / 7.7 (C2) against
  the reference's 2.5, the same "too busy" problem the critique (P6) identified.
- Minor: Volokolamsk is 117, not 115, and Bobruisk 108, not 106.

### In MAP_COLOUR_CRITIQUE.md
- **E8. P4 claims "within the lock; it matches the locked reference".** The night code is identical in both projects. The 72-vs-45 gap is
  content: Sherman's night frames have **40-61 % of pixels below Y 30** (sea plus maroon territory under the wash), Kursk 2-5 %. Lifting
  the factor would change the locked night itself. The right fix is the shot content (option 2 at night).
- **E9. P3 labels "follow the reference" without saying that STYLE_LOCK section 7 rejects "big labels".** It flags only 2a "small labels".
- **E10. P6 proposes a fixed brighter top colour.** Without normalisation the terrain-driven spread (corridor 94 vs Bentonville 110)
  stays. The Ideas doc's normalisation is the better half of that fix.
- **E11. Section 0 overstates "the reference asks for brighter day close-ups" as a blanket statement.** It applies to the ridge maps only.
  Flat close-ups already match Bobruisk.
- The P10/F7 correction itself is **right**: r_052 at 1 fps is ~0:51, inside the Kursk night beat.

### In STYLE_CRITIQUE.md P10 and STYLE_IDEAS_REVIEW.md F7
- Both are **wrong**, as both new docs say. "The reference close-ups are dark navy/slate" rests on the Kursk *night* frame. Volokolamsk
  (117) and Bobruisk (108) are grey-green. F7 ("the critique's P10 is right"; "idea 10 must say dark close-ups") should be reversed. It
  caused the navy test that the owner rejected.

---

## 4. Final recommendation

**Adopt C1 "lifted Frontlines" (after the test below), together with:**
1. **P6 texture softening** in the same bake: `fine` weight 0.10 -> 0.04 and `gaussian_filter(le, 1.0)` -> 1.6 when zoom >= 11, so the
   brighter close-ups stay as calm as Volokolamsk.
2. **P2 counter keylines**: 1.5-2 px `#f7f3ea` keyline + 1 px dark edge on counters and name tags, white size marks on a dark chip, and
   counters offset from the ribbon.
3. **P1.1 + P4 content rule**: march-through-enemy maps and night beats use option 2 (glowing fronts, no maroon fill), and overviews are
   framed so both sides share the screen. Re-bake `savannah_hd_ref` to remove the tile seams.

Not in this change: hue changes (C2-C5), the axis-multiply colour (P1.2), label size (P3, which conflicts with section 7), the front colour (P5.2), and the night factor.

### What changes in STYLE_LOCK.md (only these lines, after the owner's OK)
- **Line 25** (0b, "Maps:"): `HD dark relief (bake.py then bake_hd.py -> use <map>_hd_ref)` ->
  `HD dark relief (bake.py then bake_hd.py -> use <map>_hd_lift: the Frontlines grey-green, exposure-normalised per map)`.
- **Line 45** (0b item 2): `**Dark HD maps everywhere** (<map>_hd_ref: ...)` -> keep the wording and add
  `; since 2026-11 baked as <map>_hd_lift (same hue, land ramp (24,31,31)->(190,202,184), every map normalised to land median 0.70, sea (18,33,44), close-up texture softened). Day close-ups land at Y ~110-118 like the reference; never navy on day shots (navy = night).`
- **Line 196** (2a, "Detailed maps"): add `fine texture (weight 0.04, smoothing 1.6 for zoom >= 11)`.
- **Line 185** (2, Night) is unchanged. Optionally add one clause to the option rules in 2a: `night beats and march-through-enemy maps: option 2`.
- `K.counter` keyline: a new bullet under section 2 "Unit symbols" once P2's snapshot is approved.
- Line 164 ("parchment shaded relief") is already out of date against 0b. Flag it to the owner, but it is outside this change.

### The test to run before adopting (owner rule: test before applying)
1. In `map-kit/tools/bake_hd.py`, add the C1 block from MAP_COLOUR_IDEAS 2/C1 plus the P6 softening, writing `<map>_hd_lift.jpg`. Bake
   `south`, `corridor`, `savannah` and `bentonville` for Sherman. Do not overwrite `_hd_ref`.
2. Scenes, in scratch copies (the shipped scenes stay untouched), with the counter keyline on in the TEST copy:
   - **Shot 1, wide option 1:** `hook-a` around 0:05 (south map: checks red-ground lift, flags and legend).
   - **Shot 2, day close-up option 2:** `move1b` at the "LET THEM ATTACK THE RIDGE" beat (2:55, corridor: the worst ridge case).
   - **Shot 3, night:** `move2d` at 11:00 (Savannah), switched to option 2 at night as rule 3 says.
   - Control still: Bentonville 13:45, to make sure normalisation does not over-brighten a flat map (target frame Y <= 120).
3. Render each with `tools/make_clip.py SCENE --from .. --to ..` (about 20 s each) and stack them into ONE **1-minute side-by-side clip**:
   CURRENT on the left, TEST on the right, same frames and same audio. Send the 960x540 `--small` version plus a phone-width (390 px) still sheet.
4. **What to look for (pass = all true):**
   - The day close-up reads as **day**, not blue. Frame Y 108-118, the same grey-green as Volokolamsk (`final-pick.jpg` middle column).
   - The night shot still reads as **night** (navy wash, stars), with white labels >= 4.5:1 and fronts clearly glowing.
   - Red and blue sides stay distinct, including a protan/deutan simulated still of the close-up. The red counter/front stays visible.
   - At 390 px, UNITED STATES / CONFEDERATE STATES, the counter names and the date scroll stay legible.
   - Option-1 territory on the wide still looks strong (not pink, not washed out).
   - The fronts still glow on the brighter close-up.
   - Relief texture is no busier than the current version.
   - The cut wide -> close -> wide feels like one video, and set next to a Rokossovsky frame it looks like the same channel.
   - Apply to Sherman and later videos only after the owner says yes. Published videos are not re-rendered.

`final-pick.jpg` shows C1 *without* the texture softening and keylines, so it is the conservative preview of the grade alone.
