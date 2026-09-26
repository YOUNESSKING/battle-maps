# Morgan: map scenes

Each scene = one contiguous run of `[MAP: ...]` paragraphs in script.md (no ARCHIVE paragraph inside a scene).
Build: `cd /home/user/battle-maps/morgan && python3 tools/build_scene.py SCENE BASEMAP FIRST_TAG LAST_TAG`
→ `scenes/SCENE/` (lint: `cd scenes/SCENE && hyperframes lint .`; snapshots: `hyperframes snapshot . --at 1,5,...`; render: `hyperframes render . -o renders/SCENE.mp4`, check the log for "Render complete").

| Scene | Basemap (assets/NAME.jpg, zoom) | Paragraphs | Notes |
|---|---|---|---|
| hook1 | east (z7) | hook-1 | Carolinas 1780 disaster; Charleston, Camden, Waxhaws |
| hook2 | east (z7) | hook-2 … hook-3 | bio card (morgan_full.png) over dimmed map; then Morgan stake + 3 battle markers |
| saratoga1 | hudson (z8) | sar-1 | Burgoyne's advance from Canada; title card MOVE 1 |
| saratoga2 | saratoga (z15) | sar-2 … sar-10 | Bemis Heights / Freeman's Farm battlefield; range rings; method card |
| cowpens1 | carolinas (z8) | cow-1 … cow-3 | Greene splits army; Tarleton sent; chase to the Cowpens; title card MOVE 2 |
| cowpens2 | cowpens (z16) | cow-4 … cow-6 | position, three lines, bait order |
| cowpens3 | cowpens (z16) | cow-7 … cow-15 | the battle, double envelopment, stats, method card |
| guilford1 | carolinas (z8) | gui-1 … gui-2 | escape with prisoners; race to the Dan; title card MOVE 3 |
| guilford2 | guilford (z16) | gui-3 … gui-7 | Greene's three lines; the battle; stats |
| guilford3 | carolinas (z8) | gui-8 … gui-9 | Wilmington → Yorktown; method card |
| ending | east (z7) | ending-1 | stake + 3 markers, slow pull-out |

Projection: `assets/NAME.json` has zoom and origin_world_px; pixel of (lat, lon) = world_px(lat, lon, zoom) − origin (see the `G()` helper at the top of ridgway/scenes-src/test.js; the constants differ per basemap).
Colors: Americans = side "carth" (blue), British = side "rome" (red).
Media (assets/media/): morgan_full.png, *_head.png portraits (morgan, tarleton, burgoyne, gates, greene, cornwallis, howard, maybe fraser/pickens/washington_w), us_flag_13star.png, gb_flag_1707.png. Check what exists before using; fall back to the flag alone or a plaque if a portrait is missing.
Method line: STRIKE THE OFFICERS · BAIT THE ENEMY WITH WHAT HE EXPECTS · SPRING THE TRAP.
