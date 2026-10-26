# Map-scene brief (Belisarius video) — read fully before building

Project: /home/user/battle-maps/belisarius (engine: lib/battle.js + lib/battle.css; tools/). Narration is final:
audio/timing.json (paragraph start/end + text), audio/voice.wav. Script with every [MAP: id | notes] tag: script.md.
Facts: FACTS.md (use its numbers, not Gemini's). Read HANDOVER.md §5-6 (pipeline + lessons) first.

## How a scene is made
1. Look at the reference scenes: ../ridgway/scenes-src/test.js (newest style: portrait stakes, bio card, fronts) and
   ../hannibal/scenes-src/trebia.js (battle choreography). Read lib/battle.js to learn the helpers (B.at, B.unit, B.arrow,
   B.plaque, B.stat, B.title, B.caption, B.camera, B.method, B.portraitStake, B.line, B.front, B.city, B.river...).
2. Basemaps are already baked (assets/NAME.jpg 2880x1620 + NAME.json with origin_world_px and zoom). Convert lat/lon to
   map pixels with world_px() from tools/bake.py minus origin_world_px. Available: med (z6, whole Mediterranean),
   mesopotamia (z9, Dara/Nisibis), dara (z14, battlefield, Dara town is 37.177N 40.953E), africa (z9, Tunisia),
   tricamarum (z13, ~36.78N 9.95E; exact site unknown — schematic battlefield, draw the stream yourself),
   italy (z7), rome (z15, Rome city; draw the Aurelian Walls + Tiber from real coordinates).
   You may bake another basemap with tools/bake.py if really needed.
3. Write scenes-src/SCENE.js; time every animation to the words with B.at("para-id", "spoken phrase") so visuals land
   on the narration. Build: `cd /home/user/battle-maps/belisarius && python3 tools/build_scene.py SCENE BASEMAP FIRST_TAG LAST_TAG`
   (a scene covers consecutive MAP paragraphs FIRST..LAST and lasts until the next paragraph starts).
4. `cd scenes/SCENE && hyperframes lint .` then `hyperframes snapshot . --at t1,t2,...` at several key moments (every
   paragraph at least once). LOOK at every snapshot (Read the png). Fix overlaps, bunched units, off-map camera, unreadable
   labels, then re-snapshot. Only then render: `hyperframes render` (check the CLI help; output goes to
   scenes/SCENE/renders/SCENE.mp4 — rename to that path if needed). Rendering runs ~3-5x slower than real time: run it in
   the background and wait for "Render complete" in the log.
5. Do NOT git commit (the lead commits). Don't edit lib/ except to add a small new helper at the end of battle.js
   (other agents share it: never change existing helper behaviour). B.method already shows the Belisarius method:
   SHAPE THE BATTLEFIELD / STRIKE WHAT HOLDS THEM TOGETHER / MAKE TIME FIGHT FOR YOU (pass rowTimes from B.at so each
   row appears when it is spoken).

## Style
- Tactical Genius look: parchment relief, long slow camera moves, clean counters, big bold captions. 1920x1080 output.
- Sides: ROMANS / Byzantines = blue. Persians, Vandals, Goths = red. Neutral cities = ink.
- Every paragraph needs visible change within ~2 s of its start (no dead holds > 6 s). Camera pushes in for key moments.
- Numbers on screen must match the narration (ranges where disputed, e.g. "150,000? (Procopius)").
- Title cards for moves: B.title("MOVE 1", "DARA", "SUMMER 530 AD", ...).
- Portrait stakes / plaques: portrait images are being fetched in parallel into assets/media/ (may appear later):
  belisarius.png, justinian.png, perozes.png (Sasanian coin), gelimer.png (Gelimer coin), tzazon.png (Vandal coin),
  vitiges.png (Witiges coin), john.png (Justinian coin). Before your final build, check `ls assets/media`; use a file if
  present, otherwise a plaque without a photo. Re-run build_scene.py before rendering (it copies assets/media).
- Keep labels off each other and off the date box / captions. Clamp the camera inside the map.

## Report back (short)
Scenes built, their durations, render paths, anything you could not do, and any helper you added.
