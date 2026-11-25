# George Washington film: scene direction (read with script.md, the shot tags are the shot list)

Scene windows: `python3 washington/tools/scene_times.py SNN --words`. Worlds: `washington/worlds/README.md` (regions, key positions).
Example: `washington/sequences/_smoke/seq.js`. **REFERENCE = the Jackson v4 scenes `ajackson/sequences/S01`-`S08`: copy their overlay calls,
card recipes, banner set-up, camera habits, fx settings, troopsOpts and grade. Do not invent new looks** (owner's main worry: drift).

## Global rules (owner, binding)
- **Only 3 cloud dives in the whole film:** S01 (colonies -> crossing, night storm), S03 (colonies -> brooklyn), S05 (jersey -> crossing,
  night storm). Every other region change = a 0.9 s dissolve (`dissolve` on a cut key) or a hard cut where the script tag says "hard cut".
  Dives between regions of different zoom need `dives[].overTo`.
- **Troops = line blocks** exactly as Jackson (`troops: "blocks"`, `troopsOpts: { look: "lineblocks" }`, Jackson's retreatTurn/depthK
  defaults): WIDE rectangles that move only long side first (never lengthwise, no columns); stop -> turn in place -> walk straight;
  retreats = about-face then walk back (~7 s hold before a retreat key); hold >= 3.3 s between opposite moves; no stretching,
  collisions, pops, crab walk. Boat crossings / bridges / ferry landings: the men break rank gradually, stream onto the boats or the
  bridge, continue and vanish (v13/v14 rule). Run `node vicksburg/tools/check_troops_motion.mjs washington/scenes/SNN 0 D <region>`
  for every region with troops and fix every flag; `node vicksburg/tools/check_side_gap.mjs` for opposing blocks.
- **Owner fixes from Jackson (from the start):** no idle units during action shots (every unit takes part or is framed out); no blocks
  crossing each other; rich, detailed wide overhead maps; something new every 2-4 s; boats/ships always SEPARATE vessels with their own
  path, spacing and speed (East River shuttle, Durham boats on the Delaware) - never one column.
- **Muzzle flashes** on every musket volley and cannon shot at its exact time (engine default; `volleys`/`smokeLines` with `volley` +
  `roll`, `guns.shots`). Sound belongs only to something visible: no fire off screen (Cornwallis hearing Princeton = no gun sound).
- **Sides:** blue `u` = Americans; red `r` = British AND Hessians (no third colour; Hessian blocks labelled RALL / LOSSBERG /
  KNYPHAUSEN on their words). Banners on poles, one per side on screen: Washington (Peale 1776, `washington/assets/portraits/`), Howe
  (S03), Rall (S04-S05, Trumbull print: or initials if the cut-out is poor), Cornwallis (S05 end - S07), Mercer: NO PD likeness of the
  general exists -> banner with initials HM. Glover: label only (no banner; he is not a side commander). Flags: Grand Union
  `washington/assets/flags/grand_union_flag.png`, Union Flag 1707-1801 `washington/assets/flags/gb1707_union_flag.png` (pass `flag`
  explicitly; `date` alone picks a Civil War flag). Portraits cut to 400x400 RGBA like `ajackson/assets/generals/` (rembg isnet, clean matte).
- **Nothing on screen before its spoken word** (labels, cards, stamps, banners, numbers, dates). One big card at a time; labels leave after
  ~3.5 s. Date plaque rolls on each spoken date (year/month only until a day is spoken).
- Cards = the Jackson devices: `number`, `medallion`, `ledger` (result cards), `letter` (the 18 Dec letter + method cards), `quote`,
  `title`, `distance`. Method card "THE WASHINGTON METHOD" grows one line per move: S03 line 1 "1. Save the army first", S05 line 2
  "2. Hit them where they rest", S07 line 3 "3. Go where they are not" (Jackson recipe: earlier lines static in `sub`, the new line types
  on its word with `qAt`).
- Engagement (Jackson devices): S03 `engage.subscribe` with the click on "subscribing" + NEXT label; S06 `engage.decide` (A: HOLD THE
  CREEK AND FIGHT / B: SLIP AWAY IN THE NIGHT, real "b", reveal at the start of S07 on "He slipped away" -> put the reveal in S06's last
  seconds only if the word falls there, else S07 shows the B box lighting for ~1.5 s at its start); S08 `engage.final` (moves
  [["BROOKLYN", "29-30 AUGUST 1776"], ["TRENTON", "26 DECEMBER 1776"], ["PRINCETON", "3 JANUARY 1777"]]) + subscribe; ~19 s clean
  living map after the last word for the end screen.
- **Weather only where sourced:** S03 rain + NE wind 28-29 Aug (wind holds the ships), fog only from just before dawn 30 Aug; S01/S05
  storm: nor'easter, rain/hail/snow/sleet from ~11 p.m. 25 Dec (use `VX.rain` streaks + grey veil, ice floes on the river); S07 night
  2-3 Jan: clear, cold, ground freezing (frost); 3 Jan clear cold morning. Winter ground only on jersey / crossing / trenton / princeton.
- Respect: Hessians are soldiers, not caricatures (no drunk-Hessian imagery). No gore. Mercer's fall = the banner greys, no lingering.
- Readability at 1280x720: blocks ~2-4 % of frame width; labels not under clouds; never lose blocks in woods or fog.

## Per scene (beyond the shot tags)
- S01: frame 0 = colonies wide from altitude, red posts already marching/settling across New Jersey, blue boats being pulled to the PA bank;
  the dive lands on the crossing at night in the storm on "Christmas night"; dissolve to trenton grey dawn (two columns, guns firing down
  King + Queen streets, Hessians spilling out) for the number; hard cut colonies Aug (Brooklyn ring) for the twist; trenton 2 Jan (red
  army arrives, blue behind the Assunpink, bridge glows); letter card; gold 3D title GEORGE WASHINGTON (Cinzel) on "His name was George
  Washington"; 3 snap cuts: brooklyn night river (boats), crossing storm, princeton orchard smoke.
- S02: colonies summer (fleet as many separate ships off Staten Island), dissolve to brooklyn day: the flank march round the American left
  (red arrow), blue on the ridge about-face and fall back into the Heights works. Ends on a camera that S03's dive starts from (agree
  with the S03 author: S02 ends on colonies, S03 dives colonies -> brooklyn).
- S03: dive 2 onto Brooklyn Heights; Howe banner; siege trenches creeping (works/arrow growing); ships held at the river mouth in rain + wind;
  date plate 29 AUGUST; boats gather one by one at the ferry; night: blocks leave the works one at a time, stream onto boats; boats
  shuttle as separate vessels (rowing, then some under sail after the wind change); the covering force goes out and comes back; fog at
  dawn; the last boats; empty forts; result card; method line 1; colonies wide with the blue army up Manhattan; subscribe.
- S04: colonies: White Plains, Fort Washington (stamp + number), retreat arrow across NJ to the Delaware; dissolve jersey winter: boats
  pulled to the PA bank along the river (separate markers), red posts settle; Rall banner at Trenton; blue camp thinning.
- S05: jersey: the post chain, three crossing arrows; dive 3 into the crossing at night (storm, ice floes, Durham boats separate, guns and
  horses on flats); failed crossings as grey arrows stopping at the ice (jersey); the 9-mile march in the storm, the split at Birmingham;
  trenton grey dawn: picket fires, guns at the head of King/Queen streets, Hessians form in the streets, Rall banner falls, fields east of
  town, some red stream over the Assunpink bridge before it closes; result card; method line 2; colonies: Cornwallis arrow from NY.
- S06: jersey: boats back over (31 Dec), the 2 Jan march with Hand's riflemen fighting and falling back (repeated small volleys along the
  road); trenton dusk: blue line on the south bank, the bridge, 3 assaults thrown back (about-face retreats); night campfires both sides;
  decide card.
- S07: trenton night: 500 stay with fires + digging, the rest turn away; jersey night: the column on the back road, frost; dawn: Mawhood's
  column leaves Princeton SW on the post road; princeton: the orchard clash, Mercer banner falls, blue falls back, Washington banner rides
  forward between the lines, volleys, the British break, Nassau Hall surrender (block greys); result card; trenton dawn: Cornwallis faces
  empty works, arrow back NE (no sound); method line 3.
- S08: colonies winter: blue to Morristown, red posts pull back to New Brunswick + Perth Amboy (red ground shrinks); letter card callback;
  final cards + subscribe; the map stays alive for the end screen.
