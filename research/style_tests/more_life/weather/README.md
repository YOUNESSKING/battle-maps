# Weather looks for Style W (TEST, not approved yet)

Visual only. There are NO sounds: `weather.js` never calls `SFX()`, and no rain, wind or thunder audio is added (STYLE_LOCK 2c item 5: no synthesized sounds). Use weather **only where a source documents it** (table below), and only on that day's shots. Nothing here touches scene files, the kit or the locked basemaps.

Preview: `preview.jpg`. Top: the same 960x540 crop of a 1080p frame for each look (clear, rain, mud, snow, fog, rain + mud), shown 1:1. Bottom: the six full frames at 480 px. Live page: `preview.html` (the grid), or `preview.html?w=snow&t=7` (one stage at 1:1). Base: `vicksburg_w` with the 2e living-map layers (rivers, roads, towns, texture), rendered from `grant/scenes/s12d_rt` with the camera at cx 1560, cy 772, s 1.9. The two unit boxes and the Vicksburg/Jackson labels sit on top to check readability.

## Files
| File | What |
|---|---|
| `weather.js` | `W.init / W.rain / W.mud / W.snow / W.fog / W.clear` (GSAP, deterministic when seeking) |
| `make_weather_assets.py` | builds the per-basemap overlays + ripple seeds (run once per map) |
| `assets/vicksburg_w_*` | `snow.png` (2880x1620), `mud.png` and `fog.png` (1440x810, soft), `puddles.png`, `data.js` (8,000 river ripple seeds + 93 puddle points) |
| `preview.html`, `render.js`, `compose_preview.py`, `preview.jpg` | the test sheet (Playwright Chromium) |
| `preview_assets/`, `vendor/gsap.min.js` | base frame, two label PNGs, and a GSAP copy, so the page works on its own |

Rebuild:
```
M=research/style_tests/roads_towns
python3 make_weather_assets.py vicksburg_w grant/assets/vicksburg_w.jpg $M/exclusion_masks $M/rivers/rivers_w.png
NODE_PATH=/opt/node-tools/node_modules node render.js <scratch dir> 7 && python3 compose_preview.py <scratch dir>
```
Other maps: `python3 make_weather_assets.py <key> <video>/assets/<map>_w.jpg`. If a map has no 2e masks, the script finds the water from the basemap's pale-blue river pixels and the woods from its dark ink, but it cannot keep roads and towns clear. For those, build masks first (`roads_towns/masks.py`). The close basemap (`_close.jpg`) can get its own set the same way (`<key>` = `<map>_close`).

## What each look does
- **W.rain**: fine diagonal streaks on screen (about 13 degrees, two depths, alpha up to ~0.36), expanding rings on the rivers (map-registered, so they stay on the water as the camera moves), and a slight darker, cooler, less saturated map. Rings also appear in puddles when mud is on.
- **W.mud**: a brown, wetter multiply grade on the ground (wetter near rivers, churned darker ruts on the roads) plus small, dull puddle glints on the roads. The puddles were kept sparse and dark on purpose: a dense bright row of them read like a dashed line, and dashed lines are banned.
- **W.snow**: slow flakes on screen (two depths, light wind sway) plus a **dusting**, not a blanket, on the open grass (patchy, grain, grass tone shows through). Roads stay as dark trodden ruts and rivers stay blue with a thin pale ice rim. Towns and woods only get a light dusting. Cool, lifted light.
- **W.fog**: soft low haze in the bottoms along the rivers (capped so the river blue still reads), two layers drifting slowly, a faint milky veil.
- **W.clear(t, dur = 2)**: fades out every effect still running from `t`, over `dur` seconds.

## Integration (when a video adopts it)
```html
<script src="weather/weather.js"></script>
<script src="weather/assets/vicksburg_w_data.js"></script>
```
```js
W.init({ tl: B.tl, key: "vicksburg_w", assets: "weather/assets/" });   // after the map + kit are built, before B.finish()
const sn = W.snow({ t0: T_FEB13, intensity: 0.6 });                     // falling flakes + ground dusting
sn.to(T_FEB15, 0.35, 2);                                                 // ease to light snow (ground keeps the level)
W.fog({ t0: 0, t1: T_10AM, intensity: 0.7, fadeOut: 4 });               // Fredericksburg: fog lifting about 10 am
W.rain({ t0: T_NIGHT, intensity: 0.5 }); W.mud({ t0: T_NIGHT + 1 });    // rain, then the ground turns to mud
W.clear(T_DAWN, 3);
```
- Options for every effect: `t0`, `t1` (optional: until `W.clear` or the scene end), `intensity` 0..1, `fadeIn`, `fadeOut`. More options: rain `angle`, `ripples`, `grade`; mud `puddles`; snow `fall`, `ground`, `groundIn` (seconds for the ground to whiten), `wind`; fog `drift`. `handle.to(t, intensity, dur)` changes the intensity, and `handle.end(t, dur)` ends one effect.
- Layers: the map overlays go inside `#world`, just under `#overlay`. So hatching, arrows, units, cards and labels stay above them and are never greyed. The rain/snow canvas sits just under `#fx`, so big cards and stamps stay clean. The holder has no z-index, opacity or transform, so the blend modes reach the basemap.
- Determinism: each effect adds one tween to `tl`. Every redraw is a pure function of `tl.time()`: seeded particles and no `Math.random` or clocks. Tested: seeking 7 -> 10.5 -> 2 -> 7 gives a pixel-identical frame. The redraw runs in a microtask after the seek, so it reads the camera's final position for that frame.
- Label hook: while snow or fog is on, `W` sets `#scene[data-wx~="snow"|"fog"]`. A video then gives the ivory town names a slightly darker halo (CSS in `preview.html`, line `#scene[data-wx~="snow"] .lbl ...`). Without it they still read, but with less contrast.
- Territory hatching, Form 2 stripes and the time-of-day light all draw above or beside the weather. Night plus rain works: the night wash sits on top.
- The defaults are subtle. Snow at 0.6 and fog at 0.7 are the most that keeps labels readable at 480 px (see the strip). Avoid snow above 0.8.
- Check render cost with one `hyperframes snapshot` before a full render. The canvas draws up to ~1,100 streaks, 520 flakes and ~4,000 ring checks per frame.

## Which battles in our videos had which weather
Only rows marked DOCUMENTED may get a weather look. Everything else stays clear.

| Video | Battle / date | Weather | Status and source |
|---|---|---|---|
| Grant #16 | **Fort Donelson, 13-16 Feb 1862** | **Snow + hard cold**: ~3 in. of snow on the night of the 13th; "rain and snow, thawing and freezing alternately"; ground frozen solid on the night of the 14th-15th; men had thrown away blankets and overcoats | **DOCUMENTED** (Grant's Memoirs; Buckner's report "heavy snow-storm"; `grant/research/FACTCHECK_A` #16, FACT_NOTES). **NOT sleet**, and **NOT "men froze to death"** (both corrected). Look: `W.snow` from the 13th evening (flakes 13th-14th, ground dusting through the 16th), no rain. |
| Grant #16 | Fort Henry, 6 Feb 1862 / the march out, 7-12 Feb | High water: the fort was partly 2 ft under water; on 8 Feb the roads were "washed out" | DOCUMENTED (Memoirs; FACTCHECK_A #7, #26). Look: `W.mud` (no rain streaks) on the road shots of 7-11 Feb. No rain on the day of the battle itself is in our notes. |
| Grant #16 | Jan 1862 reconnaissance (McClernand, 10+ days) | snow and rain | DOCUMENTED in FACTCHECK_A #3. Only if a shot shows it. |
| Grant #16 | Shiloh, night of 6-7 Apr 1862 | rain (Grant under a tree in the rain) | DOCUMENTED (FACTCHECK_B #32). Look: `W.rain` + `W.mud` on the night shot. |
| Grant #16 | Champion Hill (16 May 1863), its eve, and Big Black (17 May) | none in our notes | **UNVERIFIED**. Do not add rain. |
| Grant #16 | Cold Harbor / crossing the James / Petersburg, 3-18 Jun 1864 | none in our notes (heat and dust are often described, but nothing was fact-checked) | **UNVERIFIED**. Clear. Check before any dust or heat look. |
| Meade #12 | **Fredericksburg, 13 Dec 1862** | **Morning fog, lifting ~10 am** ("About 10 o'clock ... the lifting of the fog", A.P. Hill, OR); Meade moved out "in the mist" ~8:30 am (NPS) | **DOCUMENTED** (`meade/research/FACT_NOTES.md`). Look: `W.fog` until ~10 am, then a slow fadeOut (~4 s). |
| Meade #12 | Gettysburg, night of 4 Jul 1863 | rain | Listed in Meade FACT_NOTES (standard-facts line). Look: `W.rain` + `W.mud` on the retreat night. |
| Arnold | Kennebec march, 21-22 Oct 1775 | storm; river rose 8-10 ft overnight | DOCUMENTED (Dearborn, Senter). `W.rain` + `W.mud`, plus high water. |
| Arnold | Quebec, 31 Dec 1775 | blizzard | DOCUMENTED (Arnold FACT_NOTES). `W.snow` at high intensity (0.8) + `W.fog` 0.3 for poor visibility. |
| Arnold | Crown Point / Valcour aftermath, 2 Nov 1776 | first snow | DOCUMENTED (Digby). Light `W.snow`. |
| Sherman | Carolinas, Feb 1865 (Salkehatchie, Rivers' Bridge) | winter rain; rivers swollen "to the breadth of a full mile" | DOCUMENTED (Sherman's Memoirs). "Heaviest rains in twenty years" was NOT FOUND, so don't say it. `W.mud` + light `W.rain`. |
| Peng | Third Phase, 31 Dec 1950 | cold (losses to cold are documented); "snowstorm" UNSUPPORTED | Cold yes, snowfall **UNVERIFIED**. At most a ground dusting (`W.snow({ fall: false, intensity: 0.4 })`), no falling snow. |
| Patton #15 | Bastogne relief, Dec 1944 | freezing (Verdun barracks) | Snow is **UNVERIFIED** in our FACT_NOTES (commonly reported, not checked). Check before using. Patton #15 keeps its old look anyway. |

Rule of thumb: the weather starts when the narration reaches that day, eases in over 2-3 s, and is never in the first second of a video (clean first frame, STYLE_LOCK 1c). It is not a mood filter: no weather on any day the sources don't describe.
