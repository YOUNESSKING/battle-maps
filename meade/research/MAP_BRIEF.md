# Map brief for the scene agents (George G. Meade #12)

Project folder: `/home/user/battle-maps/meade` (run every tool FROM this folder). Script: `script.md` (owner-approved; the
`[MAP: id | notes]` tags are your shot list; follow the notes, but judge by eye). Facts: `research/FACT_NOTES.md` (never show a number
that isn't there; quote marks only on the verbatim quotes listed there, with their attribution). Narration timing: `audio/timing.json`
(Kokoro take; wait for `logs/narrate.done`). Time every beat to the spoken words with `B.at("para-id", "spoken phrase")`.

## Read first (in this order, fully)
1. `/home/user/battle-maps/CLAUDE.md`, `/home/user/battle-maps/STYLE_LOCK.md` (sections 0b, 1a, 1b, 2, 2a, 3, 3a are binding), HANDOVER.md §1b + §6.
2. THE LOCKED REFERENCE VIDEO: STYLE_LOCK 0b (Rokossovsky #8) + 1a (the hook) + 1b (engagement beats). Inspect
   `reference/style-reference-rokossovsky-v8.mp4`, (hook agent) `reference/hook-reference-rokossovsky-v2.mp4` + `-sheet.jpg`, and
   `reference/engagement-test-peng.mp4` + `reference/engagement-examples/` by extracting frames with ffmpeg.
3. **The closest worked example = Stonewall Jackson #11, `/home/user/battle-maps/jackson/`** (same war, same Virginia maps, same
   pipeline): `scenes-src/*.js` (hook-a/b, bg-a/b, move1*-move3*, ending), `tools/make_virginia_*.py`, `make_nova_*.py`, `make_chanc_*.py`,
   `build/sheet-*.json/.jpg`, `research/FACT_NOTES_*.md`. Copy its structure, helpers and pacing. **BUT THE SIDES ARE REVERSED HERE**
   (see below): every Jackson overlay/counter that is blue = Confederate must be red here. Never copy a Jackson control overlay as-is;
   regenerate it with the colours swapped.
4. Engine = `lib/fx.js` (`const K = FXK(B)`), `lib/gg.js` (`const GG = GGK(B)`), `lib/living.js`, `lib/battle.js`, `lib/engage.js`
   (`const E = EngageK(B)`: `E.subscribe`, `E.decide`, `E.final`). Artillery to copy: `goosegreen/scenes-src/move1.js` (barrage),
   `rokossovsky/scenes-src/move2.js` (night barrage, rows of guns).

## This video
- Period: American Civil War, Dec 1862 (Fredericksburg) and Jun-Jul 1863 (Gettysburg campaign). Sides: **Meade / Union = hero = blue
  (`side: "carth"`); Confederates = red (`side: "rome"`)**. Territory option 1 multiply colours: Union-held ground = the blue/allied
  colour, Confederate-held = red. Legend top-centre: UNION (blue) / CONFEDERATE (red).
- **FLAGS (owner's pick 2026-10-18: option A1, on EVERY map incl. Gettysburg):** US 34-star `assets/media/us34_flag.png` for the Union;
  Confederate First National 13-star `assets/media/csa1_13_flag.png` for the Confederates. **Never the Confederate battle flag, never
  `csa2_flag.png`.** Flag ~115 px on screen with the name under it (UNITED STATES / CONFEDERATE STATES). No emblem (skip the emblem
  rule). Unit counters use the same two flags as chips (`flag: "assets/media/us34_flag.png"` etc.).
- Badges: real licensed photos `assets/media/<name>_head.png` (rembg cut-outs; `<name>_head_flat.png` = uncut). See
  `assets/media/CREDITS.md` and `build/heads-sheet.jpg` for who exists (meade, lee, longstreet, lincoln, hooker, jackson + the new
  ones: burnside, franklin, birney, gibbon, reynolds, sickles, hancock, warren, hunt, pickett, armistead, aphill, ...). Use initials /
  name plates only for anyone without a photo; never a fake face. Badge colours follow the sides (Union blue, Confederate red).
- **NO AIRCRAFT (1862-63): no planes, no `K.bombRun`, no c47g, no jet/prop sounds.** Artillery = `K.gun` -> arc -> `K.impact`
  (boom on impact, default shake on EVERY impact, never `shake: false`). Rifle volleys = `mg` kind, sparingly. Canister at close range
  (move 3) = guns firing with short flat arcs and big close impacts.
- Counters: infantry X, artillery howitzer silhouette, HQ flag, **cavalry = the owner-approved `scenes-src/cavalry_icon.js`** (copy its
  lines into your scene file, as jackson/scenes-src/move2a.js does). Size marks: brigade = X, division = XX, corps = XXX, army = XXXX;
  label in words where clearer ("MEADE'S DIVISION", "III CORPS", "PICKETT").
- Look: DAY on almost everything (dark HD relief `_hd_ref`, living map). Morning FOG over the Fredericksburg plain until ~10 am (move1-2/3,
  A.P. Hill's report; light drifting fog layer, then it lifts). `K.night` for: night 1-2 July (Meade arrives 1 a.m., move2-2), the
  evening of 2 July (move2-8 end), the council of war night 2 July (move3-1/2), and hook-3 (3 a.m. tent). Dusk tint at the end of 2 July.
- Option 1 territory (multiply `_mx` control overlays per date) on wide shots; option 2 glowing two-colour fronts (`K.front` width 15,
  glow 0.47) on close-ups. Wide -> push-in -> wide per move. Every map: flags of both sides + legend top-centre. Fact-check every front
  line / control area per date and log it in `research/FACT_NOTES_<map>.md` (sources: NPS + ABT battle maps, the OR, LoC period maps,
  e.g. the Bachelder / Warren Gettysburg maps and the Fredericksburg maps on loc.gov). Control is NOT a modern border: draw it plainly
  per date (e.g. June-July 1863: Confederate-held = Virginia south of the Rappahannock + the ground Lee's army occupies in the Valley,
  Maryland and Pennsylvania on that date; Union = the rest). State lines only Pennsylvania-Maryland (Mason-Dixon) and the Potomac.
- **Day 3 bombardment (move 3, STYLE_LOCK artillery):** rows of red `K.gun` along Seminary Ridge / the Emmitsburg Road ridge firing
  arcs onto and BEHIND Cemetery Ridge (most shells overshoot), shake on every impact; blue guns answer slowly, then fall silent one by
  one (Hunt), then open again on the advancing lines; canister at the stone wall.
- Labels: 1862-63 names, plain spelling matching the narration. Fredericksburg: Fredericksburg, Rappahannock, Marye's Heights, Prospect
  Hill, Hamilton's Crossing, Richmond Stage Road, RF&P Railroad, the Military Road, Massaponax, Deep Run, the Slaughter Pen (farm).
  Gettysburg: Gettysburg, Seminary Ridge, Cemetery Ridge, Cemetery Hill, Culp's Hill, Little Round Top, Big Round Top, the Peach
  Orchard, the Wheatfield, Devil's Den, Plum Run, Emmitsburg Road, Taneytown Road, Baltimore Pike, the Leister House, the Copse of
  Trees, the Angle. Overview: Gettysburg, Chambersburg, York, Harrisburg, Carlisle, Frederick, Hagerstown, Williamsport, Falling Waters,
  Washington, Baltimore, Winchester, Fredericksburg, Richmond, the Susquehanna, the Potomac, the Rappahannock. Big towns only + story
  places as small white-box labels. Roads/railroads of the period as thin dark lines where the story needs them (Gettysburg's road
  "spokes"; the RF&P at Fredericksburg). **Check every story-place coordinate against the sources** (NPS/ABT/LoC maps), not the basemap
  centre; Gettysburg reference points (approx., verify): Leister House 39.8136N 77.2333W, the Angle 39.8126N 77.2361W, Little Round
  Top 39.7917N 77.2367W, Culp's Hill 39.8195N 77.2190W, Peach Orchard 39.8003N 77.2478W, Prospect Hill / Meade's breakthrough 38.24N
  77.42W (NPS "Union Breakthrough" place).
- Casualty / RESULT cards and the method card exactly as the script + FACT_NOTES say (`GG.METHOD = ["FIND THE GAP", "HOLD THE INSIDE
  LINE", "READ THE NEXT BLOW"]`, `GG.METHOD_TITLE = "MEADE'S METHOD"`).
- Engagement beats (STYLE_LOCK 1b, examples in `reference/engagement-examples/`): `move1-sub` = `E.subscribe` (MOVE 1 agent),
  `move3-1` = `E.decide` (MOVE 3 agent: A = STAY ON THE HILLS AND WAIT FOR LEE, B = FALL BACK TO A STRONGER LINE NEARER THE SUPPLY BASE;
  reveal on "every general answered the same way"), `end-3` = `E.final` with "TELL US WHICH COMMANDER WE SHOULD COVER NEXT" instead of
  the family line (HOOK/ENDING agent).

## Basemaps (baked by the main session: `assets/<name>.json`, `<name>_hd.jpg`, dark `<name>_hd_ref.jpg` (USE THIS), `<name>_land.png`)
| name | centre, zoom | covers | used by |
|---|---|---|---|
| `virginia` | 38.55N 78.15W, z9 | Virginia + Maryland + Washington, Richmond (bottom), Gettysburg near the top edge | bg-1 (Glendale) |
| `penn` | 39.40N 77.60W, z9 | Fredericksburg/Culpeper (bottom) - Shenandoah - Potomac - Frederick - Gettysburg - Harrisburg/York/Susquehanna | move2-1, end-1, end-2, hook-4 cut |
| `nova` | 38.60N 77.70W, z10 | Rappahannock line, Fredericksburg, Washington (from jackson) | move1-1, move1-8 (wide) |
| `prospect` | 38.258N 77.432W, z14 | Fredericksburg town south to Hamilton's Crossing: Marye's Heights, the plain, Prospect Hill, the RR, Stage Road | move1-2..7, hook-4 cut |
| `getty` | 39.812N 77.235W, z14 | Gettysburg town + roads + the whole fishhook + Seminary Ridge | hook-1, move2-2..4, move2-8, move3-1..3, move3-8 |
| `getty15` | 39.804N 77.238W, z15 | close: Cemetery Ridge, the Angle, Plum Run, Wheatfield, Peach Orchard, Round Tops | hook-2, move2-5..7, move3-4..7, hook-4 cut |
Bakes: `logs/bake_all.sh` (done marker `logs/bake_all.done`); if yours is not there yet, start with research/geometry/control work.
Geography layers: OSM via fetch_osm.py + make_geo_layer.py with HIST names (no towns that did not exist in 1863), or a light per-map
Overpass fetch like jackson/tools/make_nova_geo.py. The jackson geo layers (`jackson/assets/media/virginia_geo_ref.png`,
`nova_geo_ref.png`, rivers json) can be copied read-only from jackson for `virginia` / `nova` (same basemaps).

## Shared files (ownership, to avoid two agents writing the same file)
- `virginia` + `penn` geo layers, rivers, control overlays (`virginia_ctl_jun62_mx.png` Union-blue version; `penn_ctl_<date>_mx.png` for
  jun63 (invasion), jul63 (after the battle)): the HOOK/BG/ENDING agent. Make them early and say so in `research/FACT_NOTES_penn.md`;
  the move-2 agent reuses `penn` read-only for move2-1.
- `nova` + `prospect`: MOVE 1 agent.
- `getty` + `getty15` geo layers, roads, rivers/streams (Plum Run, Rock Creek), control overlays per date (`getty_ctl_jul1`, `jul2am`,
  `jul2pm`, `jul3`) and the shared front-line JSON for 2-3 July: the MOVE 2 agent, FIRST (within its first ~20 minutes), logged in
  `research/FACT_NOTES_getty.md`. The MOVE 3 agent and the hook agent reuse them read-only (start with research/beat design until
  they exist; if you need a variant, make your own file with your prefix: `getty3_*`, `hook_*`).

## Rules for you
- Write ONLY your own files: `scenes-src/<your scenes>.js`, `tools/make_<your map/prefix>_*.py`, `assets/media/<your map/prefix>_*`,
  `assets/src/<your map/prefix>_*`, `research/FACT_NOTES_<your map>.md`. Do NOT edit `lib/`, `script.md`, other agents' files or shared
  tools. If the engine truly lacks something, put a helper in your scene file and say so in your report. Do NOT git commit.
- Scene names must match `tools/assemble_full.py` SCENES (provisional split; if you need a different split, say so in your report and
  the main session will update it): hook-a (hook-1..3), hook-b (hook-4), bg-a (bg-1), move1a (move1-1), move1b (move1-2..7), move1c
  (move1-8..move1-sub), move2a (move2-1), move2b (move2-2..4), move2c (move2-5..7), move2d (move2-8), move3a (move3-1..3), move3b
  (move3-4..7), move3c (move3-8), ending (end-1..3). A scene has ONE basemap: match camera hand-offs between scenes.
- NEVER render (`hyperframes render`) and never run `render_all.sh`. Only build (`python3 tools/build_scene.py SCENE BASE FIRST LAST`),
  `npx hyperframes lint scenes/SCENE`, and snapshot (`cd scenes/SCENE && npx hyperframes snapshot . --at t1,t2,...`; the frames land in
  `scenes/SCENE/.hyperframes/artifacts/snapshots/<id>/`: COPY them into `scenes/SCENE/snapshots/` before make_sheet.py).
  Look at every snapshot yourself and fix overlaps, off-screen flags, unreadable labels, wrong geography before finishing.
- Every blast/shot/stamp has its sound (`SFX(kind, t)`; K.impact/K.gun do it automatically). Never switch the shake off. Zoom whoosh
  only on the 2-3 biggest camera moves of the hook.
- The CPU is shared with the voice conversion: snapshot only the frames you need (no full-length preview renders).
- Deliverable: ONE labelled snapshot sheet per part: `python3 tools/make_sheet.py build/sheet-<id>.json build/sheet-<id>.jpg`
  (8-14 frames covering every paragraph, hook: a frame every ~2.5 s for the first 30 s; label = mm:ss in the video = abs_start + t, what
  happens, which sound). Keep the JSON spec too. Final reply: scene names + `build_scene.py` arguments (SCENE BASE FIRST LAST), the
  sheet path, open TODOs, any fact you were unsure of.
