# Grand Maneuver overlays: measured spec

**Source: measured from REAL frames** of Grand Maneuver's "Napoleon's Last Masterpiece: 4 Battles in 5 Days | France 1814" (1280x720, 24 fps, 20:37), frames every 2 s (`/home/user/gm_ref/f2s/f_NNNN.jpg`, time = (N-1)*2 s; not in the repo). Positions/sizes below are converted to our **1920x1080 stage** (x1.5). Colours are k-means/median samples (`tools/gm_frames.py color`) of the 1280 frames, so they include their grade and compression (+/- ~6 per channel). Fonts are identified by eye from 2.5-3x zooms.
- Borodino-only items (ledger + REFUSED stamps, casualty counter, original-language quote line) were **not** in the France 1814 frames; they stay **[vidIQ AI]** (critic A, GM_STUDY) and are styled in the measured family.
- No vidIQ credits were spent for this spec (the coordinator stopped the vidIQ passes; the video file arrived instead).

## Type system (all OFL, in `assets/fonts/`)
| Role | Their face (by eye) | Ours |
|---|---|---|
| Names on dark plates, legend army names, letter-card title, title card | Cinzel-like flared Roman caps, bold | **Cinzel 700/600** (lowercase sets as small caps, which is exactly how their title "Napoleon's Last Masterpiece" reads) |
| Everything else: times, day numbers, italics, tracked caps | Cormorant Garamond-like (high contrast, narrow italic, old-style figures "9:04", "4:14") | **Cormorant Garamond 500/600/700 + italics** (latin, latin-ext, cyrillic for Russian quotes) |
| Tracked caps ("FEBRUARY 1814", "IN THE AFTERNOON", "THE ARMIES", attributions) | Garamond caps, letter-spacing ~0.26-0.32 em | Cormorant 600 uppercase, 0.2-0.32 em |

## 1. Top-left plaque (two modes)
Frames: date f_0241 (10 Feb), f_0223, f_0300 (night); clock f_0270/f_0274 (4:14, 4:27 PM), f_0141 (9:04 PM, snow).
- **Date mode** (no watch): plaque at x 58, y 63; height 93-96; width hugs content (227-300). Ivory card `#D8D0B4` median (light `#E4DCC2` top to `#D2C6A3`), **concave notched corners** (r ~8), outer rule dark `#4E4532` ~1.5 px, inner hairline `#7D7158` 4.5 px inside. Row 1: month + year in tracked caps 13.5 px `#6A5D45`, a 1.3 px rule `#5E5440` under it. Row 2: day number big (42 px Cormorant 500, `#1E180E`), 1.3 px vertical divider, weekday tracked caps 13 px `#5A4F3A`, italic note 18.5 px `#2B2210` ("day one · fog · thaw", "night · Napoleon at Champaubert").
- **Clock mode** (battle days): **pocket watch** centre (105, 110), case r 44, gold case (`#D2A866`/`#A9783D`), bow ring above (centre y 49, r 9), white enamel dial `#D1D0C8`, small numerals, **blued breguet hands** (`#2F4470`). Plaque x 132-450, y 63-160 (318x97), watch overlaps its left end; **scroll curls** in both right corners. Text: time ~42 px Cormorant 500 with old-style figures (glyph height ~19 px), text block sits low in the plaque, "IN THE AFTERNOON" tracked caps 14.5 px, italic weather line 20 px ("Overcast · thaw · +11 °C", "Night · heavy snow"). Optional date header above the time ("1 FEBRUARY 1814", f_0141).
- **Clock behaviour:** minute-precise, not 15-min steps (4:14 -> 4:27 two frames apart): the time runs continuously with the narration. Part-of-day words: IN THE MORNING / IN THE AFTERNOON / IN THE EVENING / AT NIGHT.
- **Grade:** at night the plaque is dimmed and warmed with the scene (median `#AB8964` at 9:04 PM vs `#D8CEB0` by day).

## 2. Bottom timeline (calendar bar)
Frames f_0241, f_0300, f_0331, f_0420.
- Bar x 442-1478 (1036 wide), y 978-1037 (58 high); same ivory notched card (cell bg `#E5DAC4`, edge `#CDCCB9`).
- Left cell 99 wide: "FEBRUARY" / small diamond ornament rule / "1814", tracked caps 13 px `#5A4F3A`, divider `#B9AE92`.
- **Day cells** (6 shown: 10-15), ~156 px each, thin dividers; day number 27 px Cormorant 500, **past/current dark `#1E180E`, future grey `#A39A82`**; the battle name in small bold italic under the number ("Champaubert", "Montmirail", "Château-Thierry").
- **Progress**: a thin dark-red line `#8E2B22` (~1.6 px) along the bottom of the cells from the first day to "now", ending in a dot.
- **Wax seal** per battle won: dark red disc r ~26 (`#692C2A` median, highlights to `#B0463A`), impressed ring, **two gold ribbon tails** hanging below the bar; it sits on the right edge of the battle's day cell, centred ~1005 y.
- No casualty counter in this video; Borodino's "CASUALTIES 0 -> 70,000+ est., both armies" counter is **[vidIQ AI]** and is an option (`counter`) styled in the same bar.

## 3. "THE ARMIES" legend (bottom-left)
Frames f_0106, f_0241, f_0331. Flat panel `#DFDBC8`, no visible border, soft shadow; x 50, bottom edge y ~1030; ~250-395 wide. Title "THE ARMIES" tracked caps 14 px `#6A6455`. Each entry: a short curved arrow (French `#3C576E`/`#3C6E9E`, Russians `#456448`, Austrians `#A7845D`, Prussians `#333`), army name Cinzel 700 18 px `#1E1C14`, commanders italic 16 px `#5A5545` ("Napoleon · Ney, Mortier").

## 4. Commander medallions (two kinds)
- **Ivory card** (battle maps; f_0106 Napoleon/Blücher, f_0088): round portrait 142 px with a gold-brown ring (`#D19A6C` -> `#6E4A22`) and a cream inner line; below it a notched ivory plaque (same family as the date plaque): role tracked caps 11.5 px ("EMPEROR", "FIELD MARSHAL"), name 31 px Cormorant 600 title case, diamond ornament, italic sub ("in command on the field"), "c. **85,000** men · 200 guns" with the number bold old-style. **Leader line**: thin dark line (~1.6 px, `#1E1E1A` at 75 %) from the portrait rim to the general's map marker (a dot / small round portrait pin).
- **Dark plate** (strategic maps + candle desk; f_0043 Wellington, f_0022 Marmont, f_0169 Blücher): portrait 134 px with a **side-coloured ring** (British red `#9C4A3A`, gold for French marshals) overlapping the left end of a navy plate `#151E25` (inner hairline `#81898D`-ish 4 px in). A 3.5 px **flag stripe** runs along the top (French blue/white/red, measured `#2C3F54`/`#DEE6E3`/`#7C2D3E`). Text: role tracked caps 12.5 px `#B9B4A4`, name either Cinzel 700 gold `#C9B27A` caps ("WELLINGTON", "ARMY OF SILESIA · BLÜCHER") or Cormorant 600 title case cream ("Marmont"), italic sub 21 px `#D8D3C4`, "c. **69,000** men" with a 40 px lining number. Plate ~400x130 at (412-815, 705-836) in f_0043.
- Animation (from consecutive frames): fade + small rise, ~0.5 s; the line draws first on battle maps.

## 5. Oval painting insets
f_0043, f_0080, f_0276. Oval up to 480x358 (x 70-549, y 360-717 in f_0043), **thin cream frame** (~3 px `#E8E0CB`) + dark hairline + shadow. **Ribbon caption** under the oval: cream band with notched (swallow-tail) ends, italic 15.5 px dark ("Into France, Oct. 1813 · W. Heath", "Bonaparte at the military school of Brienne"). **Place card** variant (f_0088 "The château of Brienne", f_0276 "Combat de Champaubert, dans la soirée"): small oval (~92x112) in a copper-gold ring sitting on top of an ivory notched plaque with a 31 px title, ornament and italic sub.

## 6. Event / place labels
f_0080 (BRIENNE), f_0300 ("NAPOLEON'S LAST ARTILLERY..."). Navy plate `#151E25`, inner hairline, **flag stripe on the right ~68 % of the top edge**, name Cinzel 700 21 px gold `#C9B27A`, italic sub 19.5 px `#D8D3C4`. Map marker: red dot `#B3282B` in a cream ring with a thin compass ring and 4 ticks; the label sits ~32 px to its right. Small variant (unit tags on the battle maps) uses 16/15 px.

## 7. Letter card ("NAPOLEON TO CLARKE", "BLÜCHER")
f_0169, f_0223. **Full-width** cream band y 693-907 (214 high), fill `#DED5B8`, double rules top and bottom (2 px `#5D5F4C` + 1 px `#9A917D`). Centred: header "— 2 FEBRUARY 1814 · PINEY —" tracked caps 14 px `#5D5640` between two short rules; title Cinzel 700 ~52 px `#1E1A12` letter-spaced; italic sub 20 px ("five days before Nogent"); ornament; quote in small bold italic 18 px that **types on** ("... or to come back and manoeuvre against Blücher,"). The map stays visible above and below.

## 8. Centred italic quote on a darkened map
f_0017 (candle desk), f_0300, f_0480s. No card: Cormorant italic ~43 px cream `#EEE7D6` with a soft dark shadow, up to 4 centred lines in a ~1200 px measure, block centred near y 645-870; attribution tracked caps ~15.5 px gold-grey `#B79E6A` ("NAPOLEON · CHAMPAUBERT, 10 FEBRUARY 1814 · AFTER MARSHAL MARMONT"). The map is darkened under it (night grade or a dim). For Borodino an original-language line in smaller italic sits above **[vidIQ AI]**.

## 9. Title card and big numbers
- Title (f_0025): Cinzel 600 caps with small-cap lowercase, **gold gradient** (`#F6E7BF` -> `#C09F6C` -> `#9A774A`), letter-spacing ~0.2 em, 3 centred lines (cap height ~90 px), a thin cream rule (~960 px) and a tracked Cinzel subtitle "THE SIX DAYS' CAMPAIGN · FEBRUARY 1814" in cream. Over the candle-lit desk map, no scrim.
- **3D numbers** (f_0006): "200,000" in gold extruded Cinzel ~110 px with a soft cast shadow on the map; the French count "70,000" in blue-grey with a gold edge. They count up near the armies.

## 10. Opening candle-lit desk scene (f_0013-f_0025)
A 3D tabletop: Cassini-style sepia sheet maps on a dark desk, a lit candle in a copper chamberstick, coloured map pins (green / blue) and red wax seals on the battle sites, a pair of dividers. Warm low-angle candle light with falloff to dark edges. The quote (8), a dark plate medallion (Marmont) and the title (9) are shown over it. This is a scene for the 3D world agent; the overlay supplies the **candle grade** (`film.grade(t, "candle", d, {at:[x,y]})`, deterministic flicker).

## 11. Film look
Light vignette (dark edges ~60 % at the corners), fine grain, paper texture on cards; day = clean, night = blue-black multiply with the HUD warmed and dimmed, dusk = warm-grey.

## Not measurable here / open
- Exact animation curves (2 s sampling): fades ~0.5 s are an estimate.
- Ledger + REFUSED stamp, casualty counter, original-language quote line, "EARLIER THAT DAY" flashback banner: Borodino only, [vidIQ AI].
