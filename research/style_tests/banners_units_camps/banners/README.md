# General's banner on a pole (test, 2026-11-10)

The owner's Yarmouk reference banner (`../../roads_towns/owner_ref_yarmouk.png`, crops `../ref_banner_vahan.png`, `../ref_banner_khalid.png`)
adapted to 1863, as a drop-in for the portrait card (STYLE_LOCK 2d item 6 / 2e item 8). Not adopted by any scene yet.

- `banner.js`: `BN` (CSS + builder) and `pinBanner`, **same signature and behaviour as `pinPortrait`**.
- `preview.html` / `preview.jpg`: Grant + Pemberton over `grant/assets/vicksburg_w.jpg` at 1080p (real size), 2x crops, mystery "?" and
  after `BN.reveal`, long names, 35-star flag, four sway phases, 480 px downscale.
  Rebuild: `OUT=<scratch dir> node render_preview.js && python3 compose_preview.py <scratch dir>` (preview.html takes `?t=` to seek).

## Look
Rope-wrapped ivory pole planted at the general's position (iron foot, contact shadow + soft cast shadow down-right); gilt crest finial
(Union eagle, Confederate spear point); cream scroll-cornered plaque on two chains, dark Cinzel 700 name (13.5 px, never below 12 px; the
plaque widens to 150 px for long names); rope crossbar with gilt ends (Union balls, Confederate spear points); cloth in the side colour
(Union blue, Confederate red with grey streamers) with folds, gold fringe, the sepia portrait painted on it, two swallowtail streamers;
second crossbar + lower pennant carrying the national flag of the date. Footprint 124 x 200 px (+9 px finial tip), screen px.
Flags: `BN.flagFor("us", "1863-07-04")` -> `us35_flag.png` (from 4 Jul 1863), earlier -> `us34_flag.png`; `"cs"` -> `csa1_13_flag.png`
(First National, Stars and Bars). Never the battle flag. Side colour is guessed from the flag file name (`csa...` = Confederate).

## Sway
One linear tween of the card's CSS variable `--bn-sw` on the scene timeline (from `t` to `until`, or to `#root` `data-duration` when the
banner is kept); CSS `sin()` turns it into the cloth (+-0.9 deg), streamers (+-2.3 deg) and pennant (+-2.2 deg) poses, period 3.6 s.
Seekable and deterministic. It is never inserted at a negative time (that would shift the whole GSAP timeline).

## Swap into a scene (integrator)
1. Fonts: `research/style_tests/rr_cards/fonts/cinzel-latin-700-normal.woff2` (+ `-600-`) in the scene's `assets/fonts/`
   (or set `var BN_FONT_BASE = "path/";` before the code; it also honours `PC_FONT_BASE`).
2. In a **copy** of the kit (like `grant/tools/vx_rt_kit.js`), replace the whole `const pinPortrait = ...` statement with the contents of
   `banner.js` and rename `const pinBanner` to `const pinPortrait` (or keep both names: add `const pinPortrait = pinBanner;` after it, and
   delete the old one; two `const pinPortrait` are a SyntaxError). If the kit already holds `PC` (portrait card v2), `BN` sits beside it.
3. Scene bodies work unchanged. DOM contract kept: `w.firstElementChild` = banner (scale pops grow it from the pole foot),
   `card.querySelectorAll("img")[1]` = photo, `card.lastElementChild` = the plaque (an old-style reveal's appended div is styled as a
   plaque in the same place). Sides `"up"` (pole on the unit's top edge), `"right"`, `"left"`, `"west"`, `"ne"` (planted beside the unit).
4. Reveal: replace `PC.reveal(GW, ...)` with `BN.reveal(GW, PHOTO("grant"), "Ulysses Grant", T_UG - 0.1);` (photo + plaque swap, plaque
   refitted). Keep the scene's pop + `SFX("hit", ...)`, but **lower the pop from scale 1.6 to ~1.2**: the banner is 200 px tall, 1.6 would
   reach 320 px. Mystery: the scenes' opaque `MYST` works (dark panel on the cloth); `BN.MYST` is a transparent silhouette painted on the cloth.
5. Placement: the banner is taller than the card (200 vs 119 px); re-check the `side` per shot so it stays off the fight, the town names
   and the date scroll (STYLE_LOCK 2d item 6, 2e item 2). Flags per date: pass `BN.flagFor(side, iso)` instead of `FL.us` where the
   scene crosses 4 Jul 1863.

No sounds, no timing changes (fade-in 0.35 s with 8 px rise, tag hide/show, z-index 40 as before).
