# Critic B: Vicksburg ALT "CUT LOOSE." vs the approved Grand Maneuver references (2026-11-19)

Compared: `vicksburg-v2-ALT-GM-CUT_LOOSE.jpg` (V) against `marion/youtube/thumb/marion-V10-gm-HE_RAN.jpg` (M). M is confirmed as the final GM ALT: `marion/tools/make_publish_guide_marion.py` line 38, `TB = ".../marion-V10-gm-HE_RAN.jpg"`. Also compared with `marion-FINAL-gm-HE_VANISHED.jpg` (F, an earlier version, not final) and with the Grand Maneuver "HE WON." panel in `compare_gm_v10.jpg` (G, read only).
Sector sheet: `critic_ALT_sheet.jpg`. It shows V and M only, so it holds no Grand Maneuver pixels.

## Verdict
**Does it look like the references? Partly.** The frame has the right parts: navy base, cream Anton word in the top-right slot, Cinzel line, red seal with sabres, glowing blue arrow, painted payoff, colour portrait on the left.

The two things that make the GM look are missing:
- **A heavy, fat word.**
- **One calm left-to-right story:** seal, then a straight arrow, then a big glowing payoff at the right end.

V instead has a thin condensed word and a busy loop diagram, and the arrow ends mid-frame pointing back at the portrait. At 168 px, V reads as an "infographic", while M and G read as "a word plus one move".

| Score | V |
|---|---|
| Looks like the approved reference | **5/10** |
| Would win the click (next to M and G in the feed) | **5/10** |

## Measurements (1280x720)
| Metric | V (Vicksburg) | M (Marion approved) | G (GM "HE WON.") | Status |
|---|---|---|---|---|
| Mean luminance | 75.5 | 74.6 | 74.8 | matches |
| Mean saturation (HSV, 0-255) | 143 | 140 | 132 | matches |
| Navy background mean RGB | 22,30,49 | 26,31,45 | 21,26,34 | matches (V slightly bluer) |
| Word height | 203 px (28.2 % H) | 214 px (29.7 %) | 200 px (27.8 %) | matches |
| Word width | 897 px (70 % W), x 366-1263 | 930 px (73 %) | 859 px (67 %) | matches |
| **Letter stem width** | **38 px = 19 % of word height** | **57 px = 27 %** | **66 px = 33 %** | **WORSE: V is 33 % thinner than M** |
| Word ink area | 12.6 % of frame | 13.1 % | 15.4 % | slightly lower |
| Subtitle cap height | 24 px, Cinzel 36, tracked | 24 px | similar | matches (font, size, colour) |
| Subtitle content | "5 BATTLES IN 18 DAYS" (stat) | "THEN TARLETON TURNED BACK" (twist) | "THEN MOSCOW BURNED" (twist) | differs from the recipe (0c item 3B: "completes the twist") |
| **Light-blue arrow area** | **2.42 %** | 0.89 % | 0.88 % | **WORSE: 2.7x** |
| Arrow shape | loop: east, then back west; head ends at x~905 pointing LEFT | one shallow arc, left to right | one straight arc, left to right | **differs** |
| **Payoff object** | 236 px wide, centred x=735, y~418 (under the word) | ~380 px, x=1090 (right end) | ~250 px, x~1050 (right end) | **WORSE: 38 % smaller, wrong place** |
| Warm accent (orange glow) | 0.34 % of frame, centroid x 748 | 0.40 %, x 1049 | 1.78 %, x 1047 | weak, in the wrong place |
| Seal radius | 58 | 66 | ~55 | slightly small |
| Place labels | 4 (34/38/24/24 px) + star | 2 (40 px) | 2 | **WORSE: clutter; the 24 px labels are illegible at 360 px** |
| Unit blocks | 4 (2 blue, 2 red) | 0 | 0 | not in the GM recipe |
| Portrait zone (x 0-420) mean L / sat | 73 / 156 | 69 / 162 | 75 / 120 | matches numerically |
| Portrait height | head top y~80 to bottom, 89 % H | 89 % H | ~65 % H | matches M |
| 168x94 luminance std | 75.5 | 73.2 | 80.5 | fine |

## Sector by sector
1. **Map background: matches.** It is the same navy gradient and noise recipe, copied from `gm()`. The hairline rivers in V come from a custom `walk()` and not from `v8["branch_rivers"](seed=9)`. They are sparser and more random-looking (curly ends near the top-left), but this is barely visible. Fine.
2. **Rivers: differs (acceptable).** V adds one glowing Mississippi (7 px core, 26 px glow). That is closer to G's glowing river than to M. It crowds the seal and the blocks at lower-left, though. Keep it, but thinner, and keep it away from the seal (see fix 3).
3. **Word block: worse.**
   - Position, height and colour match.
   - The weight does not. "CUT LOOSE." is 9 glyphs and is squeezed into a 900 px cap. The recipe line `resize((min(900, glyph.width*1.0), glyph.height*0.95))` actually compresses it, while M stretches 1.35x.
   - Result: stems 38 px against 57 (M) and 66 (G). It reads like F's Oswald-era look and not like "HE WON.". This is the single biggest "not the same style" tell.
4. **Subtitle: font matches, content differs.** Same Cinzel, 36 px, letter-spaced, same colour. It is a number line, not a "THEN ..." twist. (The comment in the recipe correctly avoids "THEN" for Port Gibson. A twist that is still true is "THEN VICKSBURG FELL", 4 July 1863.)
5. **Portrait: worse.**
   - It is a synthetic ramp-tinted photo (`make_thumb_v2_portrait.py`), with pale, flat skin and a saturated royal-blue coat. M and G use painterly oil portraits with warm skin and modelled light.
   - There is a visible **blue halo**. `make_thumb_v2_gm.py` composites the rim (`im.alpha_composite(rim, ...)`). M's `place()` builds a rim but never composites it, and uses a hard 2 px eroded matte.
   - There is a **blue fringe at the right ear**, where background bled into the cut-out.
   - There are **black dust specks** by the left ear.
   - The **cream shoulder-strap blob** cut by the left edge reads as a stray badge or "3" at feed size. It is the correct two-star major-general strap, but it is the brightest small object on the left.
   - The gaze is frontal, not toward the map. Size and placement match M.
6. **Seal: matches.** Same `glossy_seal`, R58 against 66. Its surroundings are crowded: two blue blocks, the Mississippi glow, and the BRUINSBURG label overlapping the portrait shadow.
7. **Arrow: worse.**
   - The GM recipe is ONE short arc from seal to payoff, reading left to right.
   - V draws a 2.7x larger loop out to x~1165 and back. It ends at Vicksburg pointing left, toward Grant. The eye finishes in the middle of the frame and no destination "pops".
   - The loop is historically right (Bruinsburg, then Jackson, then Vicksburg), but it is a diagram, not a thumbnail gesture.
8. **Payoff object: worse.** The painted Vicksburg on its bluff is a good choice of object, but:
   - At 236 px it is too small.
   - It sits at the centre under the word, not at the right end of the arrow.
   - It is lit like daylight (green and brick), with only a faint orange bloom.
   - G's burning Moscow and M's lantern island are the frame's hottest warm accent at the far right. V has no such accent.
   - At 168 px it reads as a green blob.
9. **Labels, blocks, star: worse.**
   - Four labels plus a star plus four unit blocks, against two labels and zero blocks in both references.
   - CHAMPION HILL and JACKSON (24 px) are unreadable at 360x202 and only add noise at 168x94.
   - The blocks belong to recipe A (Back Door), not to B.
10. **Palette and contrast: matches overall.** Luminance, saturation and the cream colour (245,234,212 against 243,234,215) are within 2 %.
11. **Feed size (360/168): differs.** At 168x94:
    - The word holds, but the strokes are visibly thinner than "HE RAN.".
    - The lower half becomes a tangle of a blue loop, small text and an unreadable payoff.
    - M and G read as three shapes: a red dot, an arrow, and a glowing object.

## Fix list (make it match the style, not copy the content)
All of these are in `vicksburg/tools/make_thumb_v2_gm.py` unless noted.

1. **Word weight** (top priority). Target stem width at least 55 px, which is 27 % of word height or more.
   - Option a (preferred): use a word of 6 glyphs or fewer, so that the M treatment fits: `resize((min(1000, glyph.width*1.35), glyph.height))` at `CX=790`. Run the candidates through the 0c item 1 contradiction test and FACT_NOTES; that is the owner's call.
   - Option b (keep "CUT LOOSE."): thicken the glyph mask before colouring with `glyph = glyph.filter(ImageFilter.MaxFilter(17))`, which adds about 16 px per stem. Keep the height at 1.0 (drop the 0.95 squash), widen the cap to 960 and set `CX=800`. Check that the letter gaps stay at least 8 px, especially in "OO" and "SE".
2. **One left-to-right arrow to a right-side payoff.**
   - Rotate the stylised map so north points up-right. The Mississippi then runs from lower-left to upper-right; Vicksburg really is NNE of Bruinsburg, so this stays honest.
   - Put the seal at about (560, 590), as in M (`sx, sy = 560, 585`).
   - Put the Vicksburg payoff at about (1080, 520).
   - Draw ONE `glow_arrow` arc that bows downward (east of the river, the inland march) from the seal to the payoff. Use widths 36 to 16 and `tmax` about 0.85, so the head stops about 150 px before the icon, as in M.
   - Target arrow area 0.9-1.2 % of the frame. Delete the Jackson detour.
3. **Payoff size, place and light.**
   - `ic.thumbnail((380, 380))`, centred at x 1060-1090. Feather the bottom as in M (`h0 = 0.66*h`, power 2.2).
   - Make it the hottest warm spot. Use a dusk or siege-fire relight, or regenerate the vidIQ icon as "Vicksburg on its bluff at dusk, lamplit windows, smoke from bombardment, no text". Add an orange bloom of `(255,138,42,150)` with blur 60 and a hot core of `(255,160,60,120)` with blur 30.
   - Target warm-accent area at least 1.0 % of the frame, centroid x > 1000.
4. **Declutter.**
   - Remove all four unit blocks, the JACKSON and CHAMPION HILL labels, and the star.
   - Keep exactly two labels: BRUINSBURG under the seal (centre about 560, 667) and VICKSBURG under the payoff (about 1080, 668). Both in Cinzel 40 with a warm glow, as in M.
   - Thin the Mississippi to a 5 px core and a 20 px glow at alpha 120, and route it so it does not pass within 70 px of the seal centre.
5. **Subtitle.** Use a twist line in the "THEN ..." form, for example "THEN VICKSBURG FELL" (true: 4 July 1863, after the cut-loose decision of 3 May). Keep "5 BATTLES IN 18 DAYS" for the main (BD) or OPT3 variant. Same font, size and position.
6. **Portrait clean-up** (rule 0c: "never halo edges").
   - Delete the rim composite line (`im.alpha_composite(rim, (x0, y0))`), or match M exactly: built but not drawn.
   - Apply M's hard matte: `cv2.erode` 7x7, threshold 128, `GaussianBlur` 3x3 on the alpha in `cutout`. This removes the blue ear fringe.
   - Clone or inpaint the black specks at the left ear (in `vicksburg/tools/make_thumb_v2_portrait.py`, after `col` is built).
   - Bring the strap down to the gold-button luminance (about 190) or slide the portrait 25 px left so the strap leaves the frame.
7. **Portrait tone** (matches the painterly references). Per 0c, use an oil repaint for a poor or flat source: a vidIQ repaint of LoC 2018666428 that keeps the face, warm grade, then a rembg isnet cut.
   - Fallback without regeneration: skin warmth +8 % red, coat saturation x0.8, `ImageEnhance.Contrast` 1.25, and `cv2.edgePreservingFilter(flags=1, sigma_s=40, sigma_r=0.3)` for a slight paint feel.
   - Target: skin mean around RGB (200,150,115). The coat should stay darker than the arrow blue, so the arrow is the only bright blue in the frame.
8. **Seal.** `glossy_seal(im, (560, 590), 66)` (from 58), to match M.
9. **Re-check.** Rebuild, make the 360/168 strip next to M and G, and repeat the measurements:
   - stem width at least 27 % of word height
   - arrow area at most 1.2 %
   - payoff at least 360 px and at x > 1000
   - 2 labels, 0 blocks
   - no halo pixels: no blue rim of 2 px or more around the hair at 400 % zoom

Do not commit Grand Maneuver frames. This file and `critic_ALT_sheet.jpg` contain only our own images. The thumbnails themselves were not edited.

---

## Round 2: v3 `vicksburg-v3-ALT-GM-CUT_LOOSE.jpg` (re-measured with my own detectors, 2026-11-19)

**Verdict.** It now reads as the Grand Maneuver recipe:
- word top-right
- "THEN ..." line
- a seal at the left
- one short arrow from left to right
- a big burning payoff at the right end
- a warm colour portrait on the left

At 168 px it breaks into the same three shapes as Marion: a red dot, an arrow and a glowing object. One clear tell remains: the word is smaller and heavier-looking than "HE RAN." and "HE WON.", and its O counters are slits.

| Score | v2 | **v3** |
|---|---|---|
| Looks like the approved reference | 5 | **8/10** |
| Would win the click | 5 | **7/10** |

| Metric | v2 | v3 (mine) | Marion M | GM G | Status |
|---|---|---|---|---|---|
| Mean L / sat | 75.5 / 143 | 74.9 / 129 | 74.6 / 140 | 74.8 / 132 | matches (between M and G) |
| Word height | 203 px (28 %) | **172 px (23.9 %)** | 214 (29.7 %) | 200 (27.8 %) | **20 % smaller than M** |
| Stem / height | 38 px, 19 % | **46 px, 26.7 %** | 27 % | 33 % | fixed (on target) |
| O counters (mid-row) | open | **8-16 px slits** | R/A counters open | open | new tell (fake-bold look) |
| Word ink | 12.6 % | 11.8 % | 13.1 % | 15.4 % | slightly light |
| Arrow-blue area | 2.42 % | **0.90 %** | 0.89 % | 0.88 % | fixed |
| Warm accent | 0.34 %, x 748 | **1.40 %, x 1048** | 0.40 %, x 1049 | 1.78 %, x 1047 | fixed |
| 168 px luminance std | 75.5 | 69.7 | 73.2 | 80.5 | slightly flatter, OK |

### v2 findings
1. **Thin word: PARTLY.**
   - The stem ratio is fixed (26.7 %).
   - It cost height: 172 px against 214, which is 24 % of the frame against 30 %.
   - The dilation turns both O's into slit counters 8-16 px wide, so the word looks like a heavy condensed display face rather than Anton. At 360 px it still reads; at 168 px "LOOSE" starts to look like solid blocks.
2. **Loop arrow: FIXED.** One arc from the seal to the payoff, reading left to right. Area 0.90 %.
3. **Payoff small and central: FIXED.** About 380 px at x≈1080, at dusk, burning, with bloom. I checked at 4x shadow boost: no plate edge or rectangle.
4. **Clutter: FIXED.** 2 labels (Cinzel 40), 0 blocks, no star.
5. **Portrait halo, fringe, specks and strap blob: FIXED.**
   - At 4x boost there is no blue ring.
   - The strap is toned to button level. Only one star shows; the second is cut by the frame edge. The photo's strap is the two-star major-general one (FACT_NOTES), so there is no wrong insignia.
6. **Subtitle: FIXED.** "THEN VICKSBURG FELL" (true: 4 July 1863).
7. **Seal size: FIXED.** R66.
8. **Mississippi: FIXED, with a new nit.** It is now thin and far from the seal, about 124 px away. That leaves Bruinsburg, the river crossing, visibly off the river. In G, Borodino sits on its river.

### Oil repaint: likeness check (against `work_v2/grant_loc06941_crop.png`, LoC 2018666428)
Good.
- **Matches the photo:** the same left parting and swept hair, the receding temples, the heavy brow, the straight nose, the full square-cut beard, the 3/4 head turn, and the double-breasted coat with gold buttons. It is recognisably the Brady Grant.
- **Differs (mild AI flattery):**
  - The beard is fuller and redder (ginger), where Grant's was sandy-brown.
  - The skin is smoother and the face slightly broader and younger.
  - The eyes are brighter blue-grey.

None of this is a likeness problem at thumbnail size. Fix 3 below brings the beard closer.

### Remaining fixes (`vicksburg/tools/make_thumb_v3_gm.py`)
1. **Word size, the GM way: lend the word the space above the portrait.** In G the word starts at about x 130, over the head, and the portrait sits low.
   - Lower Grant by about 70 px: head top from about y 110 to about y 180, portrait about 75-78 % of frame height. Keep the face fully in frame and the shoulders bleeding off the bottom.
   - Start the word slot at about x 200 (`CX` about 730, slot about 1060 px).
   - Then drop the dilation to `MaxFilter(7)` and tracking to +6, and scale up.
   - Targets:
     - word height ≥ 195 px (≥ 27 % of the frame)
     - stem ≥ 27 % of the word height
     - O counter ≥ 18 px at mid-row
     - letter gaps ≥ 8 px
     - no glyph over the face: the word bottom stays above the hair line, with a ≥ 12 px gap or a clean overlap behind the head.
2. **Bruinsburg on the river.** Re-route the Mississippi so it passes 75-90 px from the seal centre, just touching the seal's outer rim on its west/north side.
   - The arrow then visibly starts at the crossing.
   - Keep it at least 75 px from the centre so it doesn't crowd the seal (the earlier ≥ 70 px rule).
3. **Optional, likeness polish.** Beard hue toward sandy-brown: in the beard mask only, saturation x0.8 and red -6 %. Bring eye brightness down about 10 %.
4. **Optional.** Raise subtitle contrast a touch (fill 232,220,192 → 240,228,200) to win back the 168 px flatness (luminance std 69.7, target ≥ 72).

Everything else is on target. With fix 1, I expect "looks like the reference" at 9/10.

---

## Round 3: v5 `vicksburg-v5-ALT-GM-WRONG_WAY.jpg` against `reference/thumbnails/example-B-grandmaneuver-marion-HE_RAN.jpg` (harsh)

The reference is byte-identical to `marion-V10-gm-HE_RAN.jpg`, so the earlier M numbers still apply. My detectors: `/tmp/vx_tcritB/r3.py`.

**VERDICT: FAIL.** Two must-fixes:
1. The arrow does not show the "wrong way". It reads as a straight hop from Bruinsburg to Vicksburg, so the image contradicts its own word.
2. The word sits on top of Grant's head.

Everything else is close to the reference.

| Score | v3 | **v5** |
|---|---|---|
| Looks like the approved reference | 8 | **7/10** (head collision, slit counters) |
| Would win the click | 7 | **7/10** (stronger word, but the picture doesn't pay it off) |

### Sector by sector

**1. Word "WRONG WAY.": PARTLY.**

| Metric | v5 | Marion M | Target |
|---|---|---|---|
| Height | 191 px (26.5 % of H) | 30 % | 27-30 % |
| Ink | 16.3 % of the frame | 13.1 % | |
| Stem (my run measure) | 45 px = 23.6 % of height | 27 % | 27 % |

- Height is close to target, and the word dominates more than in M. Good for the feed.
- **Stem is below target.** The fixer's skeleton measure gives 24 %; both measures are under 27 %.
- **Counters:** O and G are slits about 10-12 px wide and R's bowl is a pinhole. That is the same fake-bold tell as v3.
- **Letter spacing:** mid-row gaps of 2 px and 4 px (W/A/Y diagonals), against the fixer's claim of 13 px or more.
- **Collision:** the W/R baseline (y≈213) overlaps the top of Grant's hair from x 150 to 330, so the word cuts off the crown. In G the word clears Napoleon's head. 0c says "hat/helmet fully in frame"; the same applies to a bare head.

**2. Twist line "THEN VICKSBURG FELL": MATCHES.** Cinzel, tracked, ivory, centred under the word. It completes the twist: wrong way, then the prize fell.

**3. Seal, arrow and payoff: the look matches, the story fails.**
- The seal (R66), glowing arrow (0.96 % area, M 0.89 %) and burning Vicksburg payoff (380 px; warm accent 1.40 % at x 1048) all match the recipe.
- **The arrow only sags about 70 px below the line from seal to town, then rises into Vicksburg.** At 360 and 168 px it reads as "Bruinsburg → straight to Vicksburg". Nothing goes east, nothing turns back, there is no Jackson. The thumbnail promises "WRONG WAY." and then shows the right way.
- **Geography:**
  - Physically plausible: the map is turned north up-right, the river runs past the seal and behind the town, and Vicksburg is NNE of Bruinsburg on the east bank.
  - But a viewer assumes north is up, so it reads as "Vicksburg lies east of Bruinsburg". That makes the inland detour even less visible.

**4. Portrait: OK, except the crown.**
- The oil repaint keeps the likeness and the face is fully lit.
- The two-star strap is toned (one star in frame, period-correct).
- Hard matte, no halo.
- The crown is hidden under the W and R (see sector 1).

**5. Clutter: MATCHES.** 2 labels, 0 blocks, 1 seal, 1 arrow, 1 payoff.

**6. Feed size: GOOD.**
- 168 px luminance std is 76.7 (M 73.2).
- At 168x94 it reads as word, red dot, short arrow, fire, like M.
- At that size the arrow is a short straight dash, so "WRONG WAY" has no visual payoff in the feed.

**7. 0c contradiction test: PASSES THE FLIP, BORDERLINE ON "LITERALLY TRUE".**
- *Belief it flips:* "you take a fortress by marching at it". Grant marched east, away from Vicksburg, to Jackson first. That gives strong curiosity.
- *Weak point:* "WRONG" is a judgement, and it was the right way. HE WON. and HE RAN. are literal facts. "WRONG WAY." is literal only as "away from the target". It survives only if the image and the video's first minutes show "away from Vicksburg" at once.
- So the arrow fix is what makes the word honest. Keep it only with that fix. If the owner wants strictly literal, "HE WENT EAST." is the backup (true, flips, needs the map to land), sourced in FACT_NOTES §7.

### Must-fix list (`vicksburg/tools/make_thumb_v5_gm.py`)

**1. Show the wrong way: ONE hooked arrow.** It is still one arrow, as 0c allows. Keep the north-up-right map.
- **Route:** from the seal's right side, run down-right (east) along the lower band, to an apex at about (1170-1200, 600-640). That apex is Jackson.
- **Turn back:** curl up and come back left (west), so the head enters the payoff's right flank pointing west or north-west. Head heading angle between 150° and 240°, where 0° is due right.
- **Payoff:** shrink to about 320-340 px and centre it at about (930-960, 440), so the hook has room on its right.
- **Jackson:** optionally a small burning dot at the apex (about 40 px painted flame, no plate), with at most a 26 px "JACKSON" label. Keep the two 40 px labels as the main labels.
- **Targets:**
  - the arrow's east extent passes the payoff centre by at least 200 px (at least 15 % of frame width)
  - the U-turn is readable at 168x94: at least 25 px of the 168 px width between the outbound and return legs' extremes
  - arrow area 1.1-1.5 %
  - arrow stays 70 px or more from both labels and the seal centre
  - VICKSBURG label at about (900, 560-575), under the town and above the outbound leg (leg y ≥ 620)
- **Check:** show the 168x94 strip to someone cold. They should say "went past it and came back".

**2. Clear the head.** Choose one:
- Shift the word slot right and up: top y ≤ 18, left x ≥ 360. Rebalance as needed: tracking +4, 1.05x stretch.
- Lower Grant about 30 px more.

Target: a gap of 12 px or more between the word baseline and the top of the hair, across the whole head width. No glyph over the hair or face.

**3. Word weight and counters.**
- Target stem ≥ 26 % of height by the run measure (≥ 50 px at 191 px).
- O/G counters ≥ 16 px wide at mid-row, R bowl visibly open at 360 px.
- Mid-row letter gaps ≥ 8 px, including the W-R and A-Y diagonals.
- If MaxFilter cannot do both, drop MaxFilter. Draw Anton with `stroke_width=4` in the cream (rounded joins) and stretch 1.15x, as M does, and accept a height of 185-195 px.

**4. Nice to have.** A faint geographic cue for the rotated map, so the viewer reads the river as the Mississippi: a 2 px brighter core, plus the river visibly continuing south past Bruinsburg off the bottom-left. Without it the "east" leg has no frame of reference.

Pass condition for Round 4: fixes 1-3 met, both scores ≥ 8.

---

## Round 4: v6 `vicksburg-v6-ALT-GM-WRONG_WAY.jpg` (harsh; against the Marion GM example and the round-3 must-fixes)

My measurements (`/tmp/vx_tcritB/r4.py`):

| Metric | v6 |
|---|---|
| Mean L / sat | 77.0 / 130 |
| Word | 159 px tall (22.1 % of H), stem 41 px = 25.8 %, ink 12.4 % (M 13.1 %) |
| O/G counters | open |
| Letter gaps | ≥ 8 px (the 3 px runs are inside the W) |
| Arrow-blue area | 1.42 % |
| Warm accent | 1.32 % |
| 168 px luminance std | 71.4 (M 73.2) |

**VERDICT: FAIL (narrow).** The thumbnail now works as a picture. Two must-fixes remain, both about Jackson.

| Score | v5 | **v6** |
|---|---|---|
| Looks like the approved reference | 7 | **8/10** |
| Would win the click | 7 | **7.5/10** |

### Round-3 must-fixes
1. **Hooked arrow: FIXED.**
   - Seal → east along the bottom → U-turn → head enters the town heading 207°.
   - At 360 and 168 px it reads as "went past, came back". "WRONG WAY." now has its visual payoff, and the word passes the 0c honesty test.
2. **Head clear of the word: FIXED.** The word bottom is at y 176-178 and the hair top at y 199, so 21 px clear.
3. **Word weight: PARTLY, waived.** Stems are 25.8 %, counters open, gaps ≥ 8 px.
   - Height is 159-162 px, 22 % of the frame, against 30 % in M. That costs about a quarter of the word's size.
   - I accept the fixer's finding: 10 Anton glyphs can't be both open and 27 % stem at 190 px. At 168 px the word is still the first thing read.
   - Cheap gain, not a must: let the word run 40 px further left (start x ≈ 115; Grant's head is now lower) and scale it to the extra width. Target height ≥ 170 px.
4. **Label clearances 58/57 px instead of 70: WAIVED.** At full size and at 360 px the leg passes cleanly between BRUINSBURG and VICKSBURG with no touch. The rule existed to stop crowding, and nothing is crowded.

### New must-fixes
**A. Jackson's position is wrong for a north-up reader.**
- Jackson is drawn at the bottom-right: y ≈ 630, at Bruinsburg's height (y ≈ 600) and about 190 px below Vicksburg (y ≈ 440).
- On the turned map (north up-right) that is technically "east". But nothing on the frame says north is turned, and every viewer reads north-up.
- To a north-up viewer it says "Jackson lies south-east of Vicksburg, level with Bruinsburg". In reality Jackson is about 40-45 miles due east of Vicksburg, on the same latitude (32.30° N against 32.35° N), linked by the east-west railroad.
- The Vicksburg campaign map (Bruinsburg in the south, the hook north-east to Jackson, then due west along the railroad to Vicksburg) is one of the most reproduced maps of the war. A Civil War viewer will see the error, and it invites "wrong map" comments on a video whose word already says "WRONG".

**B. Jackson is under YouTube's duration badge.**
- The JACKSON label (about x 1155-1270, y 680-700) and most of its flame sit in the bottom-right corner, which the timestamp covers. I simulated the badge at 360 and 168 px.
- In the feed, the turning point of the move is invisible.
- Marion's BENBOW'S FERRY is partly clipped there too, but it is the second label of a straight arrow. Here it is the thing that makes "WRONG WAY" make sense.

**Fix for both, in `vicksburg/tools/make_thumb_v6_gm.py`.** This is a reroute, not a redesign.
- **Jackson:** move it level with Vicksburg and to its right. Flame at about (1190, 440), within ±40 px of the town's y. Label above it at about (1190, 385), Cinzel 26-28, right-aligned to x ≤ 1262.
- **Arrow:** seal → east along the bottom (keep the current outbound leg) → turn north up the right side (x ≈ 1200, y 620 → 470), passing just under or beside the Jackson flame → hook back WEST into the town's right flank. Head heading 170-200°, tip at about (1110, 450).
  - In north-up terms that is: Bruinsburg → east and north-east → Jackson → due west to Vicksburg, which is the real campaign shape.
  - Arrow area target ≤ 1.6 %.
  - Nothing of the arrow, the flame or the label inside x > 1140 and y > 650 (badge zone).
- **Mississippi:** stop it running north-east past Vicksburg. Today it exits at the top-right (x 1280, y 300), which puts the river north of Jackson.
  - After the town, route it north or north-west up under the subtitle (the text mask hides it).
  - Target: no river pixel east of the Vicksburg centre + 60 px for any y < 440.
  - Keep it touching the seal's west rim as now.
- **Optional:** brighten the Jackson flame to about 60 px with a small bloom, so the turning point registers at 168 px.

Pass condition for Round 5:
- Jackson's y within ±40 px of Vicksburg's y, and ≥ 220 px to its right.
- Nothing in the badge zone.
- River west/north of the town only.
- The U-turn still reads at 168 px.

With that I score it 8.5 / 8 and PASS.

---

## Round 5: v7 `vicksburg-v7-ALT-GM-WRONG_WAY.jpg` (against the round-4 pass conditions and the Marion GM example)

My measurements (`/tmp/vx_tcritB/r5.py`):

| Metric | v7 |
|---|---|
| Mean L / sat | 79.5 / 128 |
| Word | 168 px tall (23.3 % of H), x 101-1263, stem 43 px = 25.6 %, ink 13.8 % (M 13.1 %) |
| O counter | 18 px |
| Letter gaps | ≥ 9 px (the 3-4 px runs are inside the W) |
| Arrow-blue area | 1.35 % |
| Warm accent | 1.35 %, centroid x 923 |
| 168 px luminance std | 73.6 (M 73.2) |

**VERDICT: PASS.**

| Score | v6 | **v7** |
|---|---|---|
| Looks like the approved reference | 8 | **8.5/10** |
| Would win the click | 7.5 | **8/10** |

### Round-4 pass conditions
| Condition | Result | Status |
|---|---|---|
| Jackson within ±40 px of Vicksburg's y, ≥ 220 px to its right | flame y ≈ 436 against town y 440, about 256 px east | met |
| Badge zone (x > 1140, y > 650) empty | empty; checked at 360 and 168 px with a simulated badge | met |
| River only west/north of the town | leaves the town to the north and fades under the subtitle; still touches Bruinsburg | met |
| U-turn readable at 168 px | yes | met |

**Geography now reads true north-up.** Bruinsburg is south on the river, Vicksburg north on the river, Jackson due east of Vicksburg. The arrow goes east and north-east, then due west into the town (head at 190°). A Civil War viewer sees the familiar campaign shape.

The word grew to 168-171 px and stays 14 px clear of the hair. Weight, counters and spacing were kept.

### Remaining issues (none blocking)
1. **Jackson flame reads as a brown smoke smudge more than fire.** At 168 px it is a dot that barely registers, so the U-turn carries the story alone, which is enough.
   - Optional: about 70 px, with a brighter orange core, so it is the clear second warm spot.
   - Optional: end the hook's apex 10-15 px nearer the flame, so the arrow visibly "touches" Jackson.
2. **The word is 23 % of frame height against 30 % in M.** This is the Anton/10-letter limit and stays waived. At 168 px it is still read first.

No must-fixes remain. Cleared from this critic's side for the sheet, the 0b item 3 checks and the owner.
