# Portrait card v2 (test, 2026-11-10)

Elegant replacement for the Style W general's card (STYLE_LOCK 2d item 6: flag strip + sepia photo + name, on a stake).
Owner palette of the R&R cards: ivory `#efe3c8`, antique gold `#c8a86a` / `#ead39a`, warm charcoal `#15110c`; Cinzel 700 nameplate.

- `portrait_card.js`: `PC` (CSS + builder) and a `pinPortrait` with the **same signature and behaviour** as the kit's.
- `preview.html` / `preview.jpg`: old vs new over `grant/assets/vicksburg_w.jpg`, 1080p frame + 2x crops + phone sizes
  (Grant, Pemberton, mystery "?" on a side stake, after the name reveal, long name, `PC.MYST`).
  Rebuild: `OUT=<scratch dir> node render_preview.js && python3 compose_preview.py <scratch dir>`.

## What changed
Soft two-layer drop shadow down-right + elliptical contact shadow at the stake foot; 3 px bevelled gold frame (metallic gradient)
with a dark + gold inner keyline and four tiny gold corner studs; flag strip inset with a gold hairline; photo warm sepia on a
studio-sepia backdrop (the `*_head.png` cut-outs are transparent) with a faint vignette; nameplate ivory Cinzel on charcoal under a
gold hairline, auto-fitted to the name (8.5-11.5 px, measured Cinzel advances); dark-wood stake (3 px, highlight) with a drop shadow.
Footprint 86 x 119 px (old 79 x ~118).

## Swap into a scene (integrator)
1. Fonts: copy `research/style_tests/rr_cards/fonts/cinzel-latin-700-normal.woff2` (and `-600-`) into the scene's `assets/fonts/`
   (the R&R cards already need them there). Other folder: set `var PC_FONT_BASE = "path/";` before the code.
2. In the kit (`grant/tools/vx_kit.js`, section "BATCH 3 (a)"), **replace the whole `const pinPortrait = ...` statement** (from
   `const pinPortrait` to its `return w; };`) with the contents of `portrait_card.js` (the `PC` block + its `pinPortrait`). Do not
   append it next to the old one: two `const pinPortrait` are a SyntaxError. Rebuild the scenes with `tools/s12_inline.py` as usual.
3. Scene bodies need no change. The DOM contract is kept: `w.firstElementChild` = card (the reveal's scale pop),
   `card.querySelectorAll("img")[1]` = photo (the reveal swaps its `src`), `card.lastElementChild` = name (the old reveal copies its
   `cssText` into an appended div; CSS styles that div as a nameplate too, overriding its inline `font-size:13px`).
   All sides work: `"up"`, `"right"`, `"left"`, `"west"`, `"ne"`.
4. Optional:
   - cleaner reveal: replace the two reveal lines (`ph` src swap + `n2` block) with `PC.reveal(GW, PHOTO("grant"), "Ulysses Grant", T_UG - 0.1);`
     (fits the font to the new name; keep the scene's scale pop + `SFX("hit", ...)`).
   - `PC.MYST`: a mystery "?" image in the card palette (gold "?", warm backdrop) instead of the scene's own `MYST`.

No new sounds, no timing changes (fade-in 0.35 s with 8 px rise, tag hide/show, z-index 40 all as before).
