# Critic A: Vicksburg MAIN thumbnail vs the approved references (2026-11-19)

Judged: `vicksburg-v2-MAIN-BD-CUT_LOOSE.jpg` (and `vicksburg-v2-OPT3-BD-5_BATTLES.jpg`, the same image with a different word).
Against: `marion/youtube/thumb/marion-BD-HE_RAN.jpg` (approved MAIN, recipe 0c-A), `grant/youtube/grant-thumb-PUBLISHED_THE_BACK_DOOR.jpg` (origin of the recipe), TG Patton / Zhukov / Ridgway (`research/tg_thumbs/`).
Sheet: `critic_MAIN_sheet.jpg`. Measurements use 1280x720, Lab L 0-100, HSV S 0-100. Battlefield (BF) = x<780, y<520.

## Verdict: "Does it really look like the references?" Only partly.
The layout matches: band, word, parchment tags, sepia portrait on the right and the grunge arrow are in the right places. The picture does not match. The battlefield is cold, grey-green and actionless, while the references are warm and burning. The arrow goes straight up out of the band instead of sweeping out of the army. The blue blocks read as stickers. The portrait has two cheap tells that 0c names: a halo edge and a stray insignia box. The band runs into Grant's sleeve.

| Score | MAIN "CUT LOOSE." | OPT3 "5 BATTLES." |
|---|---|---|
| Looks like the approved reference | **5/10** | 5/10 |
| Would win the click | **5/10** (Marion ~7, Grant pub ~7) | 4/10 |

## Sector by sector

| Sector | Ours | Marion (approved) | Grant (published) | Verdict |
|---|---|---|---|---|
| Overall light | L42, sd27 | L44, sd25 | L38, sd27 | **matches** |
| BF colour | S15, R-B +9, b* +3.8 (cold grey-olive) | S50, R-B +64, b* +22.8 (golden) | S35, R-B +27, b* +9.6 (warm sepia) | **differs, worse**: half the saturation of Grant pub, a third of its warmth. At 168x94 it is olive mush |
| Sky / horizon | grey sky + pale river band y 0-95 (13% of frame, L61, the brightest area of the BF) | no sky | almost none | **differs**: wasted strip, makes it a landscape rather than a battlefield |
| Action focal (fire / smoke) | fire px 0.00% of BF, 1 smoke column, tiny flame | 0.43%, burning house + black column = clear focal | 0.03% but 6 fires spread over the bluff | **worse**: nothing is burning where the eye lands |
| Troop blocks | blue 2.4% of BF (4x Marion), saturated royal blue (35,63,129) in 3-row slabs sitting on trees, no road, no dust; red only 0.6%, small and far | blue 0.6%, red 1.9%: the enemy is big and close, on the road with dust trails | dense, desaturated navy (39,63,88) blocks woven into the terrain | **differs, worse**: "sticker slabs", the hero side dominates, no threat |
| Arrow | 62 to 42 px wide (OK). Rises vertically out of the band at x 610 and hooks left; it starts from no unit and splits the frame in half | starts at the blue troops and sweeps sideways into the objective | long S sweep through the army into the city | **differs**: same texture, wrong gesture |
| Distracting object | white plantation house at (430,400), the cleanest bright shape in the mid-field | none | none | **worse**: pulls the eye away from troops and arrow |
| Place tags | VICKSBURG at 44 px (the largest text after the word), CHAMPION HILL at 28 px | 30 / 28 px | about 30 px | **differs**: VICKSBURG too big, competes with the word |
| Banner | h185 (26%H), y 532-717, reaches x815 (64%W) | h181, reaches x611 (48%W) | h164, reaches x829 | height **matches**. The right end **collides** with the portrait sleeve at x ~790-815 (Marion leaves a 200 px gap) |
| Word | Anton 168, cap ~145 px (20%H), speckle matches | cap 163 (23%H) | cap 90 (12%H) | **matches**. Readable at 168x94 |
| Portrait size | brow-chin ~240 px (33%H), face centre x1075 | ~245 (34%H), x1060 | ~300 (42%H) | **matches Marion**, smaller than Grant pub |
| Portrait framing | ~65 px of empty black above the hair; black panel from x800, right column L21: a flat black box at feed size | hat cut by the top edge, battlefield shows behind (right column L34) | head almost touches the top, soft smoke behind | **differs**: floats in a black box |
| Portrait edge | soft light fringe or halo around the hair and coat (no erode/threshold; warm rim 0.6) | hard 2 px matte (erode 7 + threshold) | soft fade into smoke | **worse**: the 0c "halo edges" cheap tell |
| Insignia | cropped, MIRRORED shoulder strap at the right edge (x1215-1280, y530-600): white box with a black glyph, reads as a sticker or logo | none | none | **worse**: 0b item 3 "stray insignia" fail |
| Face tone | face L78, p95 92 (high-key photo, cheeks near blown) | L44 (dark oil) | L76 | matches Grant pub. Slightly hot |
| 360x202 / 168x94 | word and face read; left 2/3 = grey-green blur + one white hook; no fire, no clash | golden scene with burning house + red column chasing | warm city, fires, S arrow | **worse**: the weakest of the six on the strip; Patton/Zhukov win on contrast and pattern |

## Fix list (all in `vicksburg/tools/make_thumb_v2_backdoor.py` unless stated)

1. **Warm grade on the battlefield (biggest gap).** Replace `Color(0.72)` + `Contrast(1.08)` with: Color 1.0, then a soft-light or overlay blend of a sepia colorize (`ImageOps.colorize(gray, (30,22,14), (150,112,70), (240,220,180))`) at about 35-40%, then Contrast 1.12. Targets for BF: **S 30-35, R-B +25-30, b* +9-11, L 40-44** (Grant pub numbers; keep it moody, not Marion-golden). If the grade cannot warm the vidIQ greens, regenerate `work_v2/bg_vidiq_champion_v2.jpg` with "late afternoon, warm brown dust and gunsmoke, steep oblique top-down view, no sky, no horizon".
2. **Kill the sky band.** Reframe so there is no grey sky: crop about 70-90 px off the top of the bg before the resize, or regenerate with no horizon. Keep the Vicksburg town (now at y ~110-160) visible under its tag. Target: no region over 300x60 px with L>58 in the top 15%.
3. **Give it an action focal.** On the Champion Hill crest (x 560-800, y 185-235), add a fire glow under the black column (orange core about 40-60 px, additive) plus 3-4 musket-smoke puffs between the red line and the nearest blue columns. Add dust trails under the blue columns the way Marion has fog/dust ellipses (alpha ~30-40, blur 20-30). Target: fire px >= 0.3% of BF.
4. **Troop blocks.**
   - Cut the blue to about **1.0-1.3% of BF**: 2 rows instead of 3, 5-8 columns per formation, laid ALONG the visible roads (the dirt roads at about (330-560, 420-490) and the road east of the house), not on tree canopy.
   - Pull the blue from (38,78,168) to about **(40,66,135)**, or let the warm grade tone it.
   - Grow the red to about **1.5-2%**: bigger and nearer blocks (cw 11, ch 7 instead of 9/6), 2-3 more formations along the crest and down its slope. The enemy has to read as a threat.
5. **Arrow gesture.** Start it from the blue columns and sweep it over the red line into Vicksburg. The current line is a vertical hook from nowhere. Example: `grunge_arrow(im, [(230,600), (560,560), (720,300), (470,175)], 62, 44)`, so it rises from behind the band at the left, crosses the army, curls over Champion Hill and lands at the town under the tag. Keep the head below the VICKSBURG tag.
6. **Tone down the white house.** Multiply the patch around (395-470, 375-425) by about 0.7, or let a smoke puff drift over it. Target L 44 down to about 32, so nothing in the mid-field is brighter than the arrow or the troops.
7. **Tags.** VICKSBURG 44 to **32-34 px**, placed straight above the town. CHAMPION HILL stays at 28.
8. **Portrait matte.**
   - Apply Marion's hardening to `grant_sepia_cut.png`: erode 7x7, threshold 128, Gaussian 3x3.
   - Drop the warm rim from 0.6 to <= 0.2 with a 3 px edge (`MaxFilter(7)` becomes `MaxFilter(3)`), or remove it.
   - Target: no light ring wider than 1 px at the hair or coat when zoomed 4x.
9. **Insignia.** Paint out the mirrored shoulder strap at the right edge (x 1210-1280, y 520-610) with the coat tone, or shift or rotate the crop so it falls outside the frame.
10. **Portrait framing.**
    - Scale `s` 0.60 to **~0.66** and set the face centre y 300 to **~315**, so the hair is <= 15 px from the top edge (no black headroom) and brow-chin is ~265 px (37%H).
    - Panel: start at x 840 instead of 800, ramp over 180 px, max alpha about 0.85 (not 1.0) so smoke or terrain shows behind the head. Target right column **L 28-34** (Marion 34).
    - Optional: pull the face highlights from p95 92 to about 86 (gamma 1.1 on L).
11. **Band vs portrait.** Leave >= 40 px between the band's ragged end and the sleeve. Either set the Anton size for "CUT LOOSE." to **154** (cap ~133 px = 18.5%H, band end about x 760), or draw the portrait AFTER the band so the sleeve overlaps the band cleanly. The second keeps the word at 168 and the 20%H cap height.
12. **Re-check after the fixes:** run the 168x94 / 360x202 strip next to Marion, Grant pub, Patton and Zhukov. The left 2/3 should read as "warm battlefield + red line on fire + one sweep arrow" at 168 px.

## Notes on the words (not a style fix)
- **CUT LOOSE.** fits rule 0c-1 only weakly. It flips "armies need supply lines", but casual viewers do not hold that belief about Grant, and the picture does not show anything being cut. Fix 3 plus a burning wagon or supply depot at the band's left end would make the word land. Check FACT_NOTES for the "cut loose" wording (Grant's own phrase about his supply line; record the source).
- **5 BATTLES.** is a stakes number, not a contradiction, so it fails 0c-1 as a main word. It is fine as the Test & Compare option, and it is true: Port Gibson, Raymond, Jackson, Champion Hill, Big Black River. It needs a FACT_NOTES row.

---

## Round 2 (v3, 2026-11-19): `vicksburg-v3-MAIN-BD-CUT_LOOSE.jpg` / `vicksburg-v3-OPT3-BD-5_BATTLES.jpg`
I re-measured everything with my own script (`/tmp/vx_tcritA/measure.py`, same regions as round 1) plus 4x zooms and 168x94 / 360x202 strips. My numbers agree with `fixes_v3.md` to within about 1.

| Score | v2 | **v3 MAIN** | **v3 OPT3** |
|---|---|---|---|
| Looks like the approved reference | 5 | **8/10** | 8/10 |
| Would win the click | 5 | **7/10** (Marion ~7, Grant pub ~7) | 5/10 (the word, not the picture) |

### v2 findings: status
| # | Finding (v2) | v3 measured | Status |
|---|---|---|---|
| 1 | BF cold: S15, R-B +9, b* +3.8 | S30, R-B +30, b* +10.4, L42 (Grant pub 35 / +27 / +9.6 / 36) | **fixed** |
| 2 | Grey sky band y 0-95, L61 | no sky; top strip y 0-60 is a dark river band, L36 | **fixed** (reads as a far river, not sky) |
| 3 | No fire (0%) | fire 0.57% of BF (Marion 0.43), burning farmhouse + black column + gunsmoke on the crest | **fixed**: now the strongest focal on the strip |
| 4 | Blue 2.4%, saturated slabs on trees | blue 1.12%, colour (39,58,113), on the roads with dust | **mostly fixed**, but see R2-3: at 168x94 the 1-2-row strings read as dashed blue lines, not formations |
| 5 | Red 0.6%, small and far | red 2.01% (Marion 1.91), 9 formations on the crest + slope | **fixed** |
| 6 | Arrow: vertical hook from no unit | starts at the blue column (735,500), crosses the red line, head under the town | **partly**: right gesture, but almost straight (R2-1) and the head jams into the tag (R2-2) |
| 7 | White house mid-field | gone | **fixed** |
| 8 | VICKSBURG tag 44 px | 33 px | **fixed** |
| 9 | Band hits the sleeve at x815 | the portrait is drawn after the band; the sleeve overlaps the band end cleanly with a shadow | **fixed** |
| 10 | Halo around hair/coat | hard matte, no light ring at 4x zoom | **fixed** |
| 11 | Mirrored strap insignia box | painted out | **fixed**. A faint darker blotch stays beside the ear/cheek (x ~1190-1250, y 160-250) at 4x, invisible at 360 px (R2-5) |
| 12 | 65 px black headroom, flat black box | 15 px headroom, panel alpha 0.85, right column L27 (my x>=1240; theirs x>=1200 = 34) | **fixed** |
| 13 | Face hot (p95 92) | about p95 86 | **fixed** |
| 14 | Feed strip: weakest of the six | at 168x94: fire + red line + diagonal arrow + face + word all read; now on par with Grant pub, still behind Patton/Zhukov on contrast | **fixed / acceptable** |
| - | Overall L / sd | L46 sd25 (Marion 44/25) | matches (2 brighter, fine) |
| - | Word / band | cap 145 px (20%H), band h182 | matches |

### Remaining fixes (`vicksburg/tools/make_thumb_v3_backdoor.py`)
- **R2-1 Arrow curve.** It is close to a straight diagonal from (735,500) to (372,178); the references are clear sweeps.
  - Bulge the middle control points about 80-100 px to the right or down, so the sagitta is >= 60 px over the chord. Example: `[(735,505), (700,330), (520,250), (395,200)]`.
  - It must not cover the red block at about (490-520, 285-300). Move that block 30 px left or let the arrow pass beside it.
- **R2-2 Arrow head vs VICKSBURG tag.** The head tip sits on the tag's lower-right corner (0-5 px gap), so it reads as pointing at the label. Shift the tag left (x about 40-60) or up, so the head has >= 15 px clearance and its tip points into the town buildings (y <= 115).
- **R2-3 Blue formations at feed size.**
  - The thin 1-2-row strings at roughly 40° read as dashed lines at 168 px.
  - Use chunkier 2-row x 5-6-column blocks (cw 12-13, ch 8, gap 2), 6-7 formations, total blue 1.1-1.3% of BF.
  - Marion's block clusters are the model.
- **R2-4 (optional) Contrast at feed size.** The BF sd is 22 against Grant pub 24. A Contrast 1.06 on the BF only (not the portrait) would help it hold up next to TG on the strip.
- **R2-5 (minor) Ear blotch.** Clone the clean cheek and hair tone over the patch at x 1190-1250, y 160-250, or blur it 2 px.
- **OPT3 word:** unchanged verdict. "5 BATTLES." is a number, not a contradiction, so it stays the Test & Compare option and needs a FACT_NOTES row.
