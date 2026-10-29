# Map colour critique: Sherman #13 vs the locked reference (2026-10-29)

Scope: the map colours as they appear on screen. Covered: base relief grade, option-1 territory, option-2 glowing fronts, day vs night,
labels and counters against the map, consistency between shots, phone legibility and colour blindness.
Sources: `sherman/build/sherman-720p.mp4` (47 frames, one every 20 s, plus the named day close-ups 2:55 / 3:25 / 5:55 / 9:25 / 13:45 and
night shots 5:30 / 11:00 / 13:00); `reference/style-reference-rokossovsky-v8.mp4` (24 frames, the LOCKED reference);
`reference/hook-reference-meade-v3.mp4` (21 frames); the eight `sherman/assets/*_hd.jpg` / `*_hd_ref.jpg` basemaps; and the
navy-test sheets `sherman/build/sheet-legibility-test*.jpg`.
Everything below was measured with numpy on the decoded frames, not judged by eye. The method is at the end.
Evidence images: `research/map_colour/critique_01..08_*.jpg`.

---

## 0. The owner's two questions, answered first

**"Why did the day close-ups turn blue / look like night?"** In the locked reference, navy is the **night** colour. The only navy map in
Rokossovsky v8 is the Kursk night barrage (0:41-0:57, mean luma Y 71, navy cast). Its **day** close-ups (Volokolamsk 0:21-0:37 and
Bobruisk 1:05-1:17) are **grey-green and bright** (Y 107-118). The Meade hook's day close-ups are the same (grey-green, Y 95-104).
Section P10 of STYLE_CRITIQUE.md claimed that "the reference's close-ups (r_052) are dark navy". That frame was Kursk, a night shot, so
the premise was wrong. The navy test then pulled the day close-ups from Y 91-98 down to Y 46-53 with a blue cast. That is exactly our own
night level (Y 37-48), which is why it read as night. The follow-up "neutral" test (v2) is still at Y 60-65, so it is also darker than
the current build (Y 91-99) and far darker than the reference (Y 113). The owner's eye was right: **the reference asks for brighter day
close-ups, not darker ones.** Evidence: `critique_03_navy_is_night.jpg`.

**"Why aren't the maps brighter, and why this colour?"** There are three causes, and each one is measured:
1. **The base grade has a hard ceiling.** `bake_hd.py` builds the dark `_hd_ref` grade as a straight ramp from RGB (16,22,22) to
   (138,154,140), a desaturated sage grey-green that imitates the Netflix *Frontlines* map. Nothing on land can be brighter than about
   Y 150. Across the 8 basemaps, land averages Y 83-126, and the spread is narrow: Bentonville p5-p95 is only 119-132, which is 13 grey levels.
   The sea is fixed at a near-black teal, (16,27,34). This sage was chosen so that both multiply overlays (red and blue) read on it.
   It is a sound choice, but it was tuned dark.
2. **Red territory is a multiply with (232,52,52).** That removes about 80 % of the green and blue channels, so Confederate ground lands at
   about RGB (90,50,50), Y 59. Union ground with (110,160,255) lands at about (72,90,103), Y 87. On the same base, **red ground is a third
   darker than blue ground.** Across all wide frames, every +10 % of red coverage costs -2.3 Y (r = -0.61).
3. **Sherman is a red story.** His army moves deep inside Confederate land, so the wide shots average **65 % red** (20 of 30 sampled wide
   frames are over 60 % red). In the reference, red covers 27 % and blue 53 %. As a result, our wide shots average Y 64 against the
   reference's 76. That is not a different grade: it is the same grade with much more of the dark colour on screen.

---

## 1. What works and must be kept

| Kept | Evidence (measured) |
|---|---|
| **The red/blue pair itself.** It is the right pair for colour-blind viewers: blue stays blue under protanopia and deuteranopia, and red turns olive. | Counters #c4121f vs #1f4fc4: ΔE 114 normal, **91 protan / 116 deutan**. Front lines #bc2528 vs #2c57b7: ΔE 100, protan 78, deutan 101. For comparison, a red/green counter pair (#c4121f vs #3c8c32) falls from ΔE 107 to **13 under deuteranopia**. (`critique_05_cvd.jpg`) |
| **Option-1 multiply territory on wide shots.** The relief shows through the colour, and the cut between sides is clear. | Red vs blue territory ΔE 30. Relief texture stays visible under the fill (high-pass 2.8 on wide shots vs 3.25 in the reference). Saturation 0.40 vs 0.35 in the reference: same family. |
| **White labels on the wide maps.** They are high contrast on both territories. | Automatic glyph scan: median **9.6:1**, only 5.5 % under 4.5:1 (reference 7.2:1, 6.8 %). Spot checks: CONFEDERATE STATES 11.3:1, AUGUSTA 7.9:1, DECATUR 6.4:1, UNITED STATES 6.3:1. |
| **Dark teal sea.** It gives a crisp coastline with no extra line work. | Sea Y ≈ 22. Blue ground vs sea 2.5:1, ΔE 31. |
| **The grey-green option-2 close-ups with two-colour glowing fronts.** This is the reference's day look, and the fronts read well with normal vision. | Close-ups: saturation 0.14 vs 0.15 in the reference, 75 % grey-green coverage vs 80 %. Fronts vs base: red ΔE 74, blue ΔE 65. |
| **The wide-to-close brightness step.** It is by design, not a flaw. P10's "two different videos" is mostly not supported. | Wide → close-up luma: Sherman Y 64 → 101 (×1.58); reference Y 76 → 113 (×1.49); Meade 73 → 95. The reference makes the same jump. |
| **The dark grade over the parchment one.** Never go back to parchment. | Parchment `_hd` is Y 167-204 and clips the ridges to pure white (0.1-0.9 % of pixels over 245, the white blotches in `critique_08_basemaps.jpg`). The multiply colours on it would go pastel, and STYLE_LOCK 0b item 2 locks the dark maps. |
| **Night as a separate, cooler look.** | Night frames are clearly different from day (Y 37-48, navy/maroon). The idea is right. The level is the problem (P4 below). |

---

## 2. Problems, ranked by impact

### P1. The red wash: most wide frames are one dark maroon, so cuts stop reading (impact: retention plus professional look)
- **Evidence:** `critique_01_red_wash.jpg`. Wide frames average 65 % red coverage (max 88 % at 2:45; 84 % at 8:25 and 8:45; 78 % at 14:25),
  against 27 % (Rokossovsky) and 35 % (Meade). Mean frame colour on wide shots is RGB (82,59,59), a brown-maroon cast for about 9 of the 15 minutes.
  Red ground also renders as a muddy maroon (90,50,50), not the clean red of the legend chip (179,45,45): ΔE 45 between the legend and
  what is on the map.
- **Why it matters:** this is the main reason the video "feels dark" and samey (STYLE_CRITIQUE P3). The eye has no figure/ground, and the
  Union arrows are the only bright thing on the frame.
- **Fixes:**
  1. *Within the lock:* on the march maps (8:25-10:10, 12:00-13:30), where an army moves through enemy country and there is no front, use
     option 2 or a feathered "swath" instead of a full red fill (STYLE_LOCK 2a: choose the option by eye). Frame the overviews so both
     sides share the screen.
  2. *Needs owner approval (changes the STYLE_LOCK 2a `_mx` axis colour):* lighten the axis multiply from (232,52,52) to about (240,105,95).
     The red-ground brightness factor goes from about 0.35 to about 0.54, close to blue's 0.61. Red ground is then still clearly red, but no
     longer about a third darker than blue, and the frame lifts by roughly +10 Y without touching the base. Show it as a snapshot sheet first.

### P2. Red counters on red ground nearly disappear, and fully disappear for colour-blind viewers (impact: readability)
- **Evidence:** `critique_04_red_on_red_counters.jpg`. Measured counter body vs surrounding ground: Sherman red counters on red territory
  **ΔE 24-42 and WCAG 1.2-1.6:1**. Under protanopia this falls to **ΔE 4-14**: the Confederate garrisons at 8:45 vanish into the ground.
  The reference's counters sit at ΔE 54-95 and are about 2.5× larger, with a white tank silhouette, a white "+" chip and a dark keyline.
  On the close-ups, the red counter often sits on top of the red glowing front (JOHNSTON at 2:55: WCAG 1.24:1, ΔE 38). The black "XXX"
  size marks on dark red are invisible.
- **Fix (a look addition, so snapshot plus owner OK; colours unchanged):** give every counter and name tag a 1.5-2 px cream/white keyline
  (#f7f3ea) plus a 1 px dark outer edge, and keep the test-m1b counter size (~54 px). Draw size marks in white on a dark chip. Offset
  counters off the front ribbon by at least half a ribbon width.

### P3. Labels and counters are 2-2.5× smaller than the locked reference (impact: phone legibility, which is most of YouTube)
- **Evidence:** `critique_07_label_size.jpg`. Cap height at 720p: MARIETTA 11 px, ATLANTA/AUGUSTA 9 px, flag names 10 px. Reference:
  KIEV / LUBLIN 27 px, SHAKHOVSKAYA 19 px, GERMANY 15 px. The median glyph height across all Sherman map frames is 8-9 px; reference
  close-ups are 12 px. On a phone held upright (video 390 pt wide), our place names are **~3 pt tall**, against ~8 pt for the reference's
  wide labels. Unit name tags (JOHNSTON, SCHOFIELD) are about 5 px, about 1.5 pt.
- **Fix:** match the reference. Place labels cap ≥ 18 px at 720p (≥ 27 px at 1080p) on wide shots and ≥ 15 px on close-ups; tags ≥ 12 px.
  test-m1b already moves names to 19 px. *Lock note:* STYLE_LOCK 2a says "small labels", but the locked reference video uses these larger
  sizes, so this follows the reference. Confirm with the owner which one wins.

### P4. Night is too dark, and night place labels fall below 3:1 (impact: readability during key beats)
- **Evidence:** `critique_06_night.jpg`. Sherman night frames: mean **Y 45** (37-48). The reference night (Kursk): **Y 71**, with glowing
  ribbons pushing p95 to 186. Ours is about 38 % darker. Under `K.night`, place names are dimmed to grey: DECATUR **2.6:1**,
  ATLANTA 3.7:1, SAVANNAH **2.4:1**, the flag name UNITED STATES 3.5:1. The reference night keeps its labels white. At 11:00 the Savannah
  basemap also shows **rectangular tile seams**: column steps of 7.1 grey levels against a median of 0.07, and the night grade makes them
  visible as blocks.
- **Fix (within the lock; it matches the locked reference):** lift the night base to Y ≈ 65-75 (today the night layer cuts the day close-up level of about Y 100 to about Y 45, roughly ×0.45; aim for about ×0.7), keep labels at full white (≥ 4.5:1), and let the fronts and fires carry the glow. Re-bake `savannah_hd_ref`
  (fill or feather the mismatched tiles).

### P5. The red front line on grey-green has almost no lightness contrast, and fails for protanopes (impact: colour-blind viewers, about 1 in 12 men)
- **Evidence:** `critique_05_cvd.jpg`. The red front #bc2528 vs the grey-green base: WCAG **1.16:1**, so it separates from the base by hue
  only. Under protanopia it becomes olive (85,77,38) on grey (111,109,102), ΔE 24, and the Confederate front sinks into the relief at
  2:55. The blue front holds (protan ΔE 58). Red and blue are also the same lightness as each other (WCAG 1.09:1). In greyscale, or for a
  protanope, the two sides differ only by hue.
- **Fix:**
  - *Within the lock:* keep width 15 / glow 0.47 or wider (the lock says never thinner) and add a 1-2 px dark core edge on the outside of
    each band, which makes it legible on any base.
  - *Needs owner approval (a colour change):* separate the two sides by lightness too. Make the red band slightly lighter and warmer
    (about #d0453a), and keep the blue darker.

### P6. The day close-ups are a little dark and too busy, not too bright (impact: professional look plus counter legibility)
- **Evidence:** `critique_02_closeup_vs_ref.jpg`. Sherman day close-ups: Y 101 (90-111), p5 41. Reference: Y 113 (107-118), p5 57.
  Relief micro-texture (median high-pass): **4.6-5.7 on the move-1 close-ups (2:55-3:45)**, against 2.2-2.5 at Volokolamsk and 1.2-1.3
  in the Meade hook. Later close-ups (13:45: 1.7) are fine. The busy ridge-and-valley texture at z12 competes with the small counters.
  In the build, close-ups are about 15 % darker than their own basemap (bake Y 111-126 → screen Y 101), which comes from the vignette
  and overlays.
- **Fix (within the lock; it matches the reference):** drop the navy/neutral darkening idea entirely. For close-up basemaps, raise the
  grade's top colour to about (160,176,160), soften the micro-texture (in `bake_hd.py`, the `fine` weight 0.10 → 0.04 and smoothing
  σ 1.0 → 1.6 for zoom ≥ 11), and aim for a frame mean of Y 110-118 with the same grey-green hue.

### P7. The legend does not match the map (impact: small, polish)
- **Evidence:** the legend chips are saturated (48,92,174) / (179,45,45). On the map, Union ground is (72,90,103) and Confederate ground
  is (90,50,50), ΔE 42-45 apart. This is common, but a careful viewer sees two different reds.
- **Fix:** paint the option-1 legend squares with the multiplied territory colour (or a 50/50 mix), and keep the saturated colour for
  counters and fronts only.

### P8. The parchment `_hd` maps are unused but still baked (impact: none on screen; a risk)
- They clip white on the high ground and would wash out every overlay. Keep them only as a source. No action needed beyond never selecting them.

---

## 3. Measurements per shot type

Luma Y = Rec.709-weighted gamma luma, 0-255, mean of the whole frame. Saturation = mean HSV S. Red/blue % = share of pixels in the
territory/front hue bands (night "blue" includes the navy base). Texture = median high-pass |Y - blur(σ2)|. Label contrast = automatic
scan of white glyphs on map backgrounds (dark caption boxes excluded).

| Shot type | n | Luma Y mean (range) | p5 / p95 | Sat | Red % | Blue % | Grey-green % | Texture | Label contrast median / % < 4.5 | Glyph height (px @720p) |
|---|---|---|---|---|---|---|---|---|---|---|
| **Sherman wide day (option 1)** | 30 | **64** (50-78) | 25 / 135 | 0.40 | **65** (max 88) | 13 | 1 | 2.82 | 9.6:1 / 5.5 % | 8 |
| **Sherman close-up day (option 2)** | 11 | **101** (90-111) | 41 / 150 | 0.14 | 2 | 2 | 75 | 3.11 (move 1: 4.6-5.7) | 6.4:1 / 15.7 % | 9 |
| **Sherman night** | 5 | **45** (37-48) | 19 / 131 | 0.40 | 19 | 25 | 0 | 1.10 | spot labels 2.4-3.7:1 | 8 |
| Reference wide day | 5 | 76 (72-78) | 29 / 156 | 0.35 | 27 | 53 | 2 | 3.25 | 7.2:1 / 6.8 % | 8 (place names 27) |
| Reference close-up day | 9 | **113** (107-118) | 57 / 201 | 0.15 | 3 | 5 | 80 | 2.58 | 5.9:1 / 23 % | 12 |
| Reference night (Kursk) | 5 | **72** (71-74) | 33 / 186 | 0.28 | 4 | 59 | 2 | 0.89 | 7.9:1 / 14 % | 9 |
| Meade hook wide | 5 | 73 (70-75) | 23 / 127 | 0.35 | 35 | 46 | 1 | 3.17 | 7.4:1 / 8 % | 7 |
| Meade hook close-up | 8 | 95 (75-104) | 33 / 149 | 0.19 | 12 | 13 | 60 | 1.15 | 5.8:1 / 24 % | 7 |
| *Navy test v1 (day close-up)* | 4 | *46-53* (blue cast) | | | | | | | | |
| *"Neutral" test v2 (day close-up)* | 3 | *60-65* | | | | | | | | |

Basemaps, land plus sea (Y mean, p5-p95): parchment `_hd` 167-204 (149-232); dark `_hd_ref` 83-126 (24-137). Zero `_hd_ref` pixels are
over 245, because the grade ceiling is RGB (138,154,140).

Key colour pairs (ΔE76 CIELAB / WCAG; protan ΔE; deutan ΔE):

| Pair | Normal ΔE / WCAG | Protan ΔE | Deutan ΔE |
|---|---|---|---|
| Red vs blue territory (day) | 30 / 1.5 | 20 | 22 |
| Red vs blue counters | 114 / 1.2 | 91 | 116 |
| Red vs blue day fronts | 100 / 1.1 | 78 | 101 |
| Red counter on red territory | 60 (frames: 24-42) / 1.8 | 25 (frames: 4-14) | 43 |
| Blue counter on blue territory | 64 / 1.0 | 54 | 59 |
| Red front on grey-green | 74 / 1.16 | **24** | 40 |
| Blue front on grey-green | 65 / 1.26 | 58 | 62 |

---

## 4. Scores (0-10, honest, against the locked reference and pro channels)

| Aspect | Score | One line |
|---|---|---|
| Base relief grade (dark sage) | **6** | Right family and no clipping, but the ceiling is low (≤ Y 150), the tonal range is narrow, and the move-1 close-ups are too busy. |
| Territory colours (option 1) | **5** | The red/blue choice is correct, but red multiply is a third darker than blue, so red-heavy stories become a maroon wash (65 % of frame). |
| Glowing fronts (option 2) | **7** | They read well with normal vision and match the reference; the red band has no lightness contrast (1.16:1) and fades for protanopes. |
| Day look | **6** | Close-ups are 11 % darker than the reference and busier; the navy/neutral tests went the wrong way. |
| Night look | **4** | The idea is right, but it is 38 % darker than the reference night, labels drop below 3:1, and tile seams show. |
| Labels vs background (contrast) | **7** | Wide shots are excellent (9.6:1); close-ups are acceptable (6.4:1); night labels fail. |
| Label size / phone legibility | **3** | 2-2.5× smaller than the reference; about 3 pt on an upright phone. |
| Counters vs background | **4** | Too small, and red-on-red with no keyline (ΔE 24-42, 4-14 for protanopes). |
| Consistency between shots | **6** | The wide/close step matches the reference; the red-heavy wides and the very dark nights make the swings bigger. |
| Colour-blind safety | **6** | Red/blue is the right pair; red counters and red fronts need lightness or keyline help. |
| **Overall map colour** | **5.5/10** | The foundations are correct and locked for good reasons. The fixes are mostly to brighten and separate, not to restyle. |

**Order to fix (biggest gain first):**
1. P3 label/counter size plus P2 keylines (one snapshot sheet).
2. P6: brighten and smooth the day close-ups to the reference level (drop navy).
3. P4: lift night to Y ≈ 70 with white labels.
4. P1: option 2 / swath on the march maps, plus a test of the lighter axis multiply (owner approval).
5. P5 front edge.
6. P7 legend.

All of these should be shown as snapshots first (CLAUDE.md: test before applying).

---

### Method and limits
- Frames come from ffmpeg (`-ss`, JPEG q2) at 1280×720 (Sherman, Rokossovsky) and 960×540 (Meade; glyph heights there scale ×1.33 to
  compare with 720p). Measurement scripts are in the session scratch (`/tmp/claude-0/colour_critic/tools/*.py`, not committed).
- Luminance for WCAG uses the sRGB → linear formula (WCAG 2.x relative luminance). Label contrast takes the 88-90th percentile of the text
  pixels against the median of a ring around the label. Labels with shadows or halos score slightly high.
- The colour-blind simulation is Machado, Oliveira & Fernandes (2009) at severity 1.0, applied in linear RGB. ΔE is CIE76 in CIELAB (D65).
- Territory coverage is a hue classifier (red: H 330-20°, S > 0.30; blue: H 195-240°, S > 0.20, V > 0.20). Sea and black cards are
  excluded by brightness. Night "blue" counts the navy base too.
- Shot types were assigned by hand from the contact sheets: cards and archive photos are excluded, and so is the 0:45-1:45 portrait section.
