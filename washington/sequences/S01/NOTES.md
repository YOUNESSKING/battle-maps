# S01 HOOK (D 74.04 s): notes (author A)

Regions: colonies (z9 wide), crossing (z12, winter, night), trenton (z11, winter), brooklyn (z11, night snap), princeton (z11, winter).
Structure, cards, dive profile (`DOFF` = Jackson S01 round 3), title, banner reveal, snap-cut recipe copied from `ajackson/sequences/S01`.
One cloud dive (colonies -> crossing, `overTo` in crossing units). Dissolves (0.9 s) at 19.9, 39.5, 46.2; hard cuts at 30.06 and the snaps.
Scene folder 33 MB (5 regions; Jackson S01 was 34 MB with 4). Sequence folder < 1 MB.

## Shot list (local times; word = what triggers it)
| t | shot / event | word |
| --- | --- | --- |
| 0.0 | colonies from altitude (dist 420), winter grade as Jackson; red lines already walking into their posts (Trenton, Bordentown, Princeton, New Brunswick, Perth Amboy), two blue lines walking up to the PA bank, separate boats pulled down the Delaware | clean first frame |
| 1.65 | plate DECEMBER 1776 (month-only) | "seventeen seventy-six" |
| 6.48 | tag NEW YEAR'S EVE / most of the army can go home (at the blue army) | "On New Year's Eve" |
| 10.5-14.5 | dive push onto McConkey's Ferry; night creeps in (0.15 -> 0.35) | |
| 12.6 | the Delaware glows gold down to the ferry + DELAWARE RIVER (italic) | "Delaware" |
| 13.9 | plate DECEMBER 1776 / 25 | "Christmas night" |
| 14.05-15.0 | white-out (Jackson profile, ~1 s) -> crossing at night (NI 0.85), sleet streaks (`VX.rain` 0.8), ice floes, shore ice | |
| 15.0-19.9 | 7 separate Durham boats (barge + lantern, own lane / speed / start, 2 coming back), blue lines waiting on the PA bank (one walks down to the water), a gun, a line landed on the NJ bank walking up | |
| 15.86 | 2,400 (gold number, counts in hundreds) | "two thousand four hundred" |
| 19.9 | dissolve: Trenton grey dawn (night 0.22, sleet 0.45: FACT_NOTES_jersey C3 / table: sleet through the battle) | "At dawn" |
| 20.4-23.8 | Greene's line down the Pennington road, Sullivan's down the River road, a third line closes the Princeton road; Knox's guns at the head of King/Queen St fire down the streets (20.7, 21.7, 22.8, 23.7, 24.4); musket volleys 22.0-24.6 | "fell on the Hessians" |
| 21.3 | tag HESSIANS; three red lines spill out of the town east toward the Princeton road and halt | "Hessians" |
| 21.9 | TRENTON | "Trenton" |
| 24.64 | 900 (gold, counts); the red lines turn grey (captured) 25.5-25.8 | "nine hundred" / "prisoners" |
| 25.6 / 26.76 | HESSIAN PRISONERS / NOT ONE AMERICAN KILLED, in the fight | "prisoners" / "not one American" |
| 30.06 | HARD CUT: colonies, summer light: blue at Brooklyn, red lines closing from Long Island, British ships in the Upper Bay; plate unchanged | "And the strangest part?" |
| 34.7 | three red arrows close the ring on the Heights | "trapped" |
| 36.2 / 36.74 | gold pulse on the Heights / BROOKLYN | "hill" / "Brooklyn" |
| 37.7 | the East River glows behind the Heights | "a river at its back" |
| 39.5 | dissolve: Trenton by day (2 Jan): three red lines down the Princeton road (+ red arrow on "British army" 43.1, tag BRITISH ARMY), three blue lines settle behind the Assunpink line | "a week after Trenton" |
| 41.6 | the stone bridge pulses gold | "trapped again" |
| 44.74 | DELAWARE RIVER (italic) | "the river behind" |
| 46.2 | dissolve: colonies over the PA bank (McConkey's) | "A week before Christmas" |
| 48.3 | the general's banner, NO portrait ("?" silhouette, plaque "?") | "its general" |
| 49.4-52.5 | map dimmed; letter card (Jackson `letter` recipe): A WEEK BEFORE CHRISTMAS / TO HIS BROTHER; "I think the game is pretty near up." typed from 50.5 (cps 24); no date line | "brother" / "I think..." |
| 53.8-55.2 | 3D gold GEORGE WASHINGTON (Cinzel), portrait revealed on the banner (Peale 1776, plaque WASHINGTON) at 54.22 | "George Washington" |
| 55.46 | SNAP 1: brooklyn night: 9 separate boats (1 sloop) shuttling Brooklyn ferry <-> Peck Slip, blue line at the landing, Washington banner; plate 1776 - 1777 | "He would steal his army" |
| 58.81 | SNAP 2: the Delaware in the storm (sleet, ice, 7 separate boats), blue lines on both banks, banner on the NJ bank | "cross a frozen river" |
| 63.64 | SNAP 3: Princeton orchard, clear cold day: red (Mawhood) and blue (Mercer) lines firing, a gun, smoke, banner; quiet from 68.0 | "slip away" |
| 70.24 | THREE GREATEST / TACTICAL MOVES (out 72.2) | "three" |
| 73.44 | 0.6 s dissolve into S02 (map alive) | |

## Facts
2,400 (FACT_NOTES_jersey C1/C4), "about nine hundred" prisoners (D table, HEDGE), no American killed in the fight (spoken; card says "in the fight"),
sleet at dawn (C3 + weather table), letter quote = the 5-word core + "I think" exactly as FACT_NOTES A2 ("I think the game is pretty near up.").
No Washington name or portrait before "His name was George Washington".

## Image sources
`washington.png` = `washington/assets/generals/washington.png` (Charles Willson Peale 1776, Brooklyn Museum, see `washington/assets/portraits/SOURCES.md`);
flags copied from `washington/assets/flags/` (Grand Union, 1707 Union Flag - unused here, kept for consistency).

## Troop motion (`check_troops_motion.mjs`, 0-74.04)
- colonies, trenton, brooklyn, princeton: no overlaps, no pops, no shape change, screen long-side-normal <= 15 deg.
- crossing: world front-vs-velocity 20-37 deg on the NJ landing line (u3/u7) and the PA line's short walk; on screen 7-11 deg (the engine's
  on-screen heading correction, as Jackson S01 neworleans); u0 16 deg on screen for 2 frames at the end of its 1.3-unit walk. Accepted.
- Hard cuts / dissolves show as "turn" spikes at the cut frame only.

## Open issues
- The colonies world is summer-baked: the winter opening (0-14 s) and F (46-55 s) look green; grade kept = Jackson (as asked).
- E (39.5-46 s): the red lines at the top of the frame are small at dist 51-56; the arrow + BRITISH ARMY tag carry the beat.
- Boats show big dotted wakes at night (engine wake look); Durham boats are drawn at ~2x true size for readability.
- `VX.rain` streaks are a 2D canvas: during the 19.9 dissolve the streak density drops at the cut (0.8 -> 0.45) rather than crossfading.
- Brooklyn ferry points: the research landing points lie in the river; boats use the 1776 waterline (2479.4, 1146.4) / (2467.6, 1131.6).

## Round 1 fixes (critics A 6 / B 7.5 on S01; lead: re-voiced "an icy river", D 73.98, region `colonieswinter`)
- T re-timed from scene_times (washington 54.24, trap 57.14, storm2 60.78 ... these 68.38, moves 71.56; `frozen` -> `icy2`).
- Date plate hidden over the August flashback and 2 January (`plaque.hide` at 29.96); the snap-cut plate 1776 - 1777 brings it back at 55.46.
- Letter card held to 53.72 (T.george - 0.1), typed at cps 40 (complete ~51.5); dim to the same time.
- NEW YEAR'S EVE tag without the early sub (the sub was on screen 3 s before "go home").
- Trenton guns moved into word gaps: 20.0, 22.4, 23.95 (booms +0.45); no gun on "the Hessians at Trenton".
- Orchard (G3): one volley line 63.6-64.2 (start of the shot) + one at 67.7-68.33 (gap after "behind it."), gun at 67.8; no fire under "strike behind it".
- Troop motion: every visible move now runs straight down or across the screen (Greene south, Sullivan east, Hessians east, British army
  south on 2 Jan, colonies posts from due north); the NE line on the Princeton road, the PA waiting lines and the NJ landed lines are
  formed in place (no crab walks). Perth Amboy post dropped (off frame on the closer opening).
- Bigger readable troops on the wide shots: opening camera 30 % closer (dist 330 -> 270 at the push), colonies lines bw 1.4-1.45; Brooklyn ring bw 0.6.
- Night crossing: Durham boats x1.45 (size 0.9-1.0); 2,400 shot 15 % closer (dive `to` dist 26, key 23). Lamp glow size / floes = engine + world (not changed here).
- Trenton 2 Jan camera 20 % closer (dist 45 -> 41).
- Wide clouds: colonies `scatter { seed 3, n 10, med 18 }`, keepClear only on McConkey's (50) and the Brooklyn Heights (85: a cloud sat on the flashback at r 40).
- Checks: check_troops_motion all regions: no overlaps / pops; one 20-deg world FvV for 4 frames at the end of the New Brunswick post's walk
  (screen 14 deg); hard-cut / dissolve frames only. check_side_gap: 0 pairs in every region.
- Not done here (lead / engine): dive whoosh level (assemble.py), floe density + lamp glow size (world / engine).

## Round 2 fixes (critics A 7 / B 8 on S01)
- Trenton fire only in word gaps: field shots 22.45 + 26.15 (impact delay 0.3), one volley per line 22.45-22.95; nothing on "dawn",
  "In about", "some" (no gun before Trenton is on screen).
- Orchard: field shot dropped; volleys 63.6-64.2 and 67.7-67.98 (end `T.these - 0.4`): "These" is clear.
- Dive whoosh cue at 12.65 via the new `dives[].whooshAt` (engine seqlib, default unchanged); the dive look is unchanged.
- Plate: "25 / Christmas night" on "Christmas night"; "December 1776 / dawn" (no day) on "At dawn" over Trenton; hidden over the flashbacks.
- Crossing boats = S05's `durham` boats (men aboard when loaded, size 0.75, `lampK 0.5` = lamp glow -50 %, wl 6.85); brooklyn boats lampK 0.5.
- Wide clouds: the dive's default `diveClear` (118 units) emptied the whole opening frame -> `diveClear: 36`, `scatter { n 34, med 12 }`,
  small keepClear; 3-6 clouds in the opening frames; Brooklyn flashback kept clear (r 70) with 3 far-side `extra` clouds.
- Checks: units unchanged since round 1 (motion + side gap clean).

## Round 3 fixes (critics A 7.5 / B 8.5 on S01)
- Plate over Trenton: month-only "December 1776" on "dawn" (20.12; no empty day cell, no unspoken day, not over the crossing).
- Trenton gun 26.15 dropped (it fired under the 900 / Hessian prisoners card); only the 22.45 gun + volleys remain.
- Whoosh cue 12.45 (`whooshAt`, 0.2 s earlier) so its tail clears "On".
- Negative-time audit (engine lesson, S07): every overlay call / card tween in S01 is at t >= 0.35 s; only unit / boat data use t0 -1. OK.

## V2 (owner decision 22, `washington/V2_LOOK_RECIPE.md`)
- Troops = v14: `troopsOpts { lineblocks, size 1.44, depthK 0.44, steel-blue pal }`; troopScale colonieswinter 6.5 (0.022 x the opening
  dist 270-330; recipe table 2.4 was for the 98-130 framings and left the hook's posts invisible), crossing 1.0, trenton 1.7, brooklyn 1.3,
  princeton 0.9; fxScale 6.6 / 11 / 8.4 / 5.6. All `bw` overrides removed; every v1 multi-block unit = single-block units 1.25 block
  widths apart (the `U` helper); the orchard lines are 3 blocks a side.
- Musketry = v14 SMK scaled (KF = dist / 28.7); each volley line 2.3 s with ONE volley at its word-gap time (22.45-22.55, 63.6, 67.7).
- Night: NI 1.0, `grade.night` (dark blue veil), boats `wake: false` + lamps; rain x0.5 with n x2; cloud shadows off on the storm / night close regions.
- Grade v8 (`wide ct 0.96 sat 0.95`); colonieswinter clouds `scatter { seed 11, n 24, med 14 }` (+ diveClear 36, Brooklyn keepClear + far-side extras).
- Overlays: THE ARMIES legend 1.9 s -> the letter card (no subs: the general is not named before the name slam); the wax-seal timeline from
  1.4 s at December, `go` to August on "Four months earlier", 2 Jan on "a week after Trenton", 18 Dec on "A week before Christmas"; both step
  out for the letter card. The 2,400 / 900 / NOT ONE AMERICAN KILLED hook tags stay. Arrows: colonies 0.34, Trenton 0.43.
- Trenton 2 Jan camera re-framed (at y 2067, tilt 54): the blue line sits above the timeline, the British army in the upper third.
- Kept from v1: whooshAt, cues in word gaps, all overlay times >= 0.35 s.
- Checks: check_troops_motion all 5 regions clean except one 20-deg world FvV for 3 frames at the end of the New Brunswick post's walk
  (screen 14 deg); check_side_gap 0 pairs everywhere.
- Open: at the opening dist (270-330) the posts are ~25 px wide (v8 wide size); red over brown roads reads weakly.
