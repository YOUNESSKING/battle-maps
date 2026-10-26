# Frontlines-1m: reference kit for the merged "Frontlines" look (LOCKED 2026-10-06, STYLE_LOCK section 2a)
Approved build = the D-Day 1-min test: scenes-src/europe_hd.js + normandy_hd.js, archive a-1/a-2 (tools/build_film_dday.py), `ONEMIN=1 python3 tools/assemble_dday.py` -> build/dday-1m-hd.mp4.
Detailed maps: tools/bake_hd.py, make_rivers_dem.py, fetch_osm.py, make_geo_layer.py; living map lib/living.js; glowing C-47 = `kind: "c47g"` in lib/fx.js.

## History: first Frontlines test (Waal crossing, 2026-10-05; globe + 3D were later dropped)
"WWII: From the Frontlines" (Netflix) style, made from scratch: new script (script.md), new voice (Kokoro bm_george, British, speed 0.9),
new scenes, new music choice, Frontlines sound design.
- `globe` (lib/globe.js): NASA Blue Marble Earth (Sept 2004, public domain) graded dark, clouds, atmosphere glow, series title, dive through the clouds.
- `terrain` (lib/flyover.js, extended): out of the clouds over Nijmegen, tilt north up 3D Holland; glowing road, red German-held bridge.
- `f-1`, `f-2` (tools/build_film.py): restored + tinted public-domain film, date card, depth-parallax Gavin portrait.
- `river` (lib/board.js): dark 3D tactical board, glowing boats crossing the Waal, tracers, water impacts with screen shake.
- Music: Kevin MacLeod "Five Armies" (CC BY 4.0) from 1:00, ducked under the voice. Mix + master: tools/assemble_fl.py (-14 LUFS).
Rebuild: narrate (tools/narrate_fl.py, run from ../tts), tools/build_film.py, tools/render_all.sh "globe holland g-1 g-1" "terrain holland g-2 g-2" "river nijmegen m-1 m-2", tools/assemble_fl.py.
