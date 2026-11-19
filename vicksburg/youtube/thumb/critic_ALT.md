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
