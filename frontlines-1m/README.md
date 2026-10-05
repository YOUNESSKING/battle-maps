# Frontlines-style 1-minute test (owner request 2026-10-05)
"WWII: From the Frontlines" (Netflix) style, made from scratch: new script (script.md), new voice (Kokoro bm_george, British, speed 0.9),
new scenes, new music choice, Frontlines sound design.
- `globe` (lib/globe.js): NASA Blue Marble Earth (Sept 2004, public domain) graded dark, clouds, atmosphere glow, series title, dive through the clouds.
- `terrain` (lib/flyover.js, extended): out of the clouds over Nijmegen, tilt north up 3D Holland; glowing road, red German-held bridge.
- `f-1`, `f-2` (tools/build_film.py): restored + tinted public-domain film, date card, depth-parallax Gavin portrait.
- `river` (lib/board.js): dark 3D tactical board, glowing boats crossing the Waal, tracers, water impacts with screen shake.
- Music: Kevin MacLeod "Five Armies" (CC BY 4.0) from 1:00, ducked under the voice. Mix + master: tools/assemble_fl.py (-14 LUFS).
Rebuild: narrate (tools/narrate_fl.py, run from ../tts), tools/build_film.py, tools/render_all.sh "globe holland g-1 g-1" "terrain holland g-2 g-2" "river nijmegen m-1 m-2", tools/assemble_fl.py.
