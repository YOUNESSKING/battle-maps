# The orange effect: analysis of the reference (UNDER CONSIDERATION, not in the rules)

Reference: YouTube H2xV6FnbSkQ (Spanish Civil War), 10:12-12:40. The video could not be downloaded (YouTube bot check),
so this analysis comes from three vidIQ "watch" passes (2026-10-29): one overview, plus two slow passes at about 0.25 s steps.

## Capture 1: Melilla, then all of Spanish Morocco (10:31-10:44)
- **10:32.00 burst at the Melilla pin.**
  - Shape: concentric shockwave, white core #FFFFFF, yellow-orange ring #FFCC00, orange falloff #FF4500.
  - Size and timing: max radius about 4 % of the frame width; it lasts about 0.5 s.
  - Extras: a 1-frame brightness flash, no camera shake.
  - Sound (inferred): a low bass thud.
- **10:32.35 flags pop in on the town** (scale 120 % to 100 % over 0.2 s).
- **10:33.25-10:35.00 flood, local stage:** a semicircular bubble grows around the town.
- **10:35.50-10:44.00 flood, region-wide stage:** an irregular, organic wave.
  - It follows the borders and the coastline.
  - Speed eases out: fast at first, then slower over the rough ground.
  - It covers the whole protectorate in about 5.5 s.
- **The advancing edge:**
  - Band width: 1.5-2.2 % of the frame width.
  - Colours from inside to outside: dark red fill #8B1A1A, crimson #D62828, neon orange #FF6B00, yellow-white glow #FFE600.
  - A subtle shimmer or pulse, no sparks.
  - When it reaches the border it fades into a thinner, steady perimeter line.
- **Fill behind the edge:** enters at about 70 % opacity, then settles a little darker (#4A1010) so the relief still shows.
- **Old front line:** overwritten as the edge passes over it.
- **Camera:** a smooth pan that follows the wave, plus a slight push-in (about 105 %).
- **Sound (inferred):**
  - A low rushing whoosh or fire rumble under the wave.
  - A soft "lock" thump when the border settles.

## Capture 2: Seville, then Cádiz / Jerez / Algeciras (11:25-11:50)
- **Seville burst:**
  - A white flash pulse, then an inner orange shockwave ring, about 1.5 s in all.
  - The flood follows the terrain and the provincial borders.
  - It starts fast and eases out over about 4.5 s.
- **The advancing edge:**
  - Band width: 2.5-3 % of the frame width.
  - Colours from inside to outside: #7A1515, then #FF5A00, then gold #FFD200, then a white-hot rim #FFF6C8.
  - Ember flicker and faint heat haze.
  - It fades within 0.4 s of stopping.
- **Fill:** a ~40 % crimson wash with diagonal hatching.
- **New front line:** a glowing dashed yellow line traces the leading edge, then becomes a solid red 3 px line with a 1 px glow.
- **Several towns (Cádiz, Jerez, Algeciras):**
  - The towns pulse one after another, about 0.3 s apart.
  - Then a corridor wipe runs down the main road, with radial pockets around each town.
  - It speeds up down the coast and eases out at Gibraltar, in about 4.5 s.
- **Camera:** a slow push toward Seville (1.15x), then a pull-out (0.85x) for the southern advance. A slight micro-rumble on the bursts.
- **Sound (inferred):**
  - A sub-boom on the burst.
  - A sizzling fire or burning-paper layer plus hiss under the advance.
  - A thud when the border locks.

## Recipe (consolidated)
1. **0.00 s, burst:** a ring that expands to about 4 % of the frame over 0.4 s with ease-out, white core to orange, plus a 1-frame flash. Sound: our locked impact/boom.
2. **About 0.35 s, flags or units pop in:** 120 % to 100 % over 0.2 s.
3. **0.5 s, flood:**
   - Shape: the mask grows from the town, first as a bubble, then following the real lost-ground shape (borders, coast, roads).
   - Speed curve: cubic-bezier(0.2, 0.8, 0.2, 1), fast then easing out.
   - Duration: 1.5-2.5 s for a local capture, 4.5-5.5 s for a whole region.
4. **During the flood, the edge:**
   - Band width: 1.5-3 % of the frame.
   - Colours: the new owner's colour, then orange #FF5A00, then gold #FFD200, then a white-hot rim.
   - A light flicker at 12-15 Hz, no particles.
5. **The end:** the edge fades in 0.4-1.0 s and leaves the new front line. The fill settles slightly.

## What makes it satisfying (vidIQ)
- **The burning edge** makes a gain feel active and aggressive, not like a sterile mask.
- **The speed:** a fast start that eases out has real inertia.
- **The ground:** the flood follows the terrain, roads and coast instead of being a perfect circle.
- **The layering:** first the pulse, then the fire front, then the fill, then the line.

## Our first build (test F, 2026-10-29)
- **Files:** `sherman/scenes-src/test-F1-ref.js` and `test-F2-ref.js`; video `sherman/build/test-video-F.mp4`; frames in `research/orange_frames/`.
- **What it does:**
  - The flood is a circular soft mask clipped to the lost ground. It is 1.4 s long and speeds up (ease-in).
  - The glow is a single #FFAA00 ring.
  - The burst is our locked impact.
- **What the owner said:** they liked ONLY this effect. Not the sepia base, not the one-sided fill. Our front-line colours stay.
