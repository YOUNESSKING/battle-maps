# Map-scene brief: O.P. Smith video

Project: `/home/user/battle-maps/smith` (engine copied from `ridgway/`, which is the newest).
Read first: `/home/user/battle-maps/HANDOVER.md` (sections 5 + 6), `smith/script.md` (the [MAP] tags describe each shot),
`smith/lib/battle.js` (engine API), and `ridgway/scenes-src/test.js` (best example scene: portrait stake, bio card, front lines, image layers).
`smith/audio/timing.json` has every paragraph's start/end; use `B.at("para-id", "spoken phrase")` to hit words.

## Conventions
- UN / US Marines = blue = side `"carth"`. North Koreans + Chinese = red = side `"rome"`.
- Look: Tactical Genius style (parchment relief, bold counters, big red names, slow camera moves, never static for long). Snow particles for Chosin scenes.
- Winter scenes (hook, hagaru, breakout, ending-2): snow on. Captions short, uppercase.
- Method card (inchon-9, hagaru-9, breakout-8, ending-2): 3 lines "1. BUILD THE LIFELINE FIRST / 2. REFUSE TO BE RUSHED / 3. KEEP THE DIVISION WHOLE"; keep the same design in every scene (copy the code between scenes).
- Portraits / flags in `smith/assets/media/` (arriving from another agent: smith_full.png cut-out, smith_head.png, almond.jpg, us_flag_48star.png, pva_flag.png, kpa_flag.png, usmc_flag.png). If a file isn't there yet, build with a placeholder and swap before rendering; check `ls smith/assets/media` again before the final render.
- Camera must stay inside the 2880x1620 map (no black edges). No DOM measurement inside timeline callbacks.

## Basemaps (smith/assets/*.jpg + .json, 2880x1620; projection: `world_px(lat,lon,zoom) - origin_world_px`, see ridgway test.js `G()`)
| basemap | zoom | covers |
|---|---|---|
| korea | 8 | whole peninsula + south Manchuria + west Japan (also korea_north.png / korea_south.png overlays) |
| chosin | 11 | Chosin Reservoir → Hungnam coast (whole 78-mile road) |
| chosin_close | 12 | Yudam-ni, Hagaru-ri, Koto-ri, down to Funchilin |
| funchilin | 13 | Koto-ri plateau edge, Funchilin Pass, Chinhung-ni |
| inchon | 12 | Inchon harbor, Wolmi-do, Kimpo, Seoul |

Approximate coordinates (verify against the relief; the reservoir should be visible as flat water, place labels on the real shapes):
Hagaru-ri 40.385,127.253 · Yudam-ni 40.48,127.11 · Toktong Pass 40.43,127.18 · Koto-ri 40.285,127.30 · Funchilin Pass / bridge ~40.21,127.33 · Chinhung-ni 40.17,127.38 · Hamhung 39.92,127.54 · Hungnam 39.83,127.62 · east of reservoir (Army, Sinhung-ni) 40.46,127.30 ·
Inchon city 37.47,126.63 · Wolmi-do 37.475,126.598 · Red Beach 37.478,126.617 · Blue Beach 37.445,126.645 · Kimpo 37.558,126.79 · Seoul 37.566,126.978 ·
Pusan 35.10,129.04 · Taegu 35.87,128.60 · Naktong perimeter ~ from 35.1,128.3 north to 36.0,128.6 then east to 36.05,129.4 · Wonsan 39.15,127.44 · Yalu mouth 39.9,124.3 · Pyongyang 39.03,125.75.

## Scenes (build with `python3 tools/build_scene.py NAME BASEMAP FIRST_TAG LAST_TAG` from `smith/`)
| scene file | basemap | tags | notes |
|---|---|---|---|
| hook | chosin | hook-1 .. hook-3 | hook-3: Smith full-length cut-out + bio card (like ridgway shot-2) |
| inchon-a | korea | inchon-1 .. inchon-2 | |
| inchon-b | inchon | inchon-3 .. inchon-7 | Smith portrait stake in inchon-5; tide gauge graphic |
| inchon-c | inchon | inchon-8 .. inchon-9 | method card at the end |
| hagaru-a | korea | hagaru-1 | |
| hagaru-b | chosin | hagaru-2 | |
| hagaru-c | chosin_close | hagaru-3 .. hagaru-8 | contains no archive slot; Song Shilun + Smith stakes |
| hagaru-d | chosin_close | hagaru-9 | method card over the held perimeter |
| breakout-a | chosin | breakout-1 .. breakout-2 | |
| breakout-b | chosin_close | breakout-3 | |
| breakout-c | funchilin | breakout-4 .. breakout-6 | |
| breakout-d | chosin | breakout-7 .. breakout-8 | method card |
| ending-1 | korea | ending-1 | Ridgway stake (ridgway/assets/media/ridgway_head.png) |
| ending-2 | chosin | ending-2 | final title |

## Workflow per scene
write `scenes-src/NAME.js` → build_scene → `cd scenes/NAME && hyperframes lint . && hyperframes snapshot . --at t1,t2,...` → LOOK at every snapshot (Read the PNGs), fix overlaps / bunching / off-screen labels → render (`hyperframes render .`, check the log for "Render complete"; the mp4 lands in scenes/NAME/renders/NAME.mp4 — rename it if needed). Only 4 CPUs are shared by 3 agents: render one scene at a time.
Commit `scenes-src/*.js` (+ any new assets) and push after each finished scene (renders are git-ignored). If a push is rejected because the remote moved: `git pull --rebase` then push.
