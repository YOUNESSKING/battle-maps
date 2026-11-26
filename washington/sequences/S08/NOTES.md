# S08 ENDING (D 65.72 s): notes (author A)

One region: colonies (z9). Structure copied from `ajackson/sequences/S08` (card callback -> method letter -> engage.final -> living map, fade
over the last 1.5 s). Colonies is summer-baked: grade kept = Jackson's (`grade.wide`). Road-bridge meshes hidden (`features.colonies.bridges`).
Scene folder 16.6 MB. No fx / no sound cues.

| t | on screen | word |
| --- | --- | --- |
| 0-0.35 | colonies over central New Jersey, clean living map; blue line already walking north | |
| 0.35 | plate JANUARY 1777 (month-only, as the tag; Jackson S08 also set its plate at 0.35) | |
| 0.85 | Washington banner (Peale) walks with the blue line Pluckemin -> Morristown; blue arrow Princeton -> Pluckemin -> Morristown | "Washington led his army" |
| 0.2-1.2 / 6-16 | soft red tint over the British-held belt (Hackensack - Trenton, Dec 1776), shrinking to the New Brunswick - Perth Amboy - Paulus Hook corridor (Jackson S02 land-tint recipe, red) | "pulled back" |
| 4.19 | MORRISTOWN | "Morristown" |
| 5.7-15.6 | four red lines pull back (front first) from Kingston, Somerset, Elizabeth Town, Newark to New Brunswick, Perth Amboy, Paulus Hook | "the British pulled back" |
| 8.25 | NEW JERSEY | "New Jersey" |
| 10.6-14.7 | map dimmed; S01's letter card returns (A WEEK BEFORE CHRISTMAS / TO HIS BROTHER, "I think the game is pretty near up." typed fast) | "he wrote that the game was pretty near up" |
| 14.7-22.4 | slow push over the map, banner leaves 22.0 | "the Revolution was alive again" |
| 22.7-29.3 | method letter THE WASHINGTON METHOD (header George Washington): 1. Save the army first / 2. Hit them where they rest / 3. Go where they are not, typed on their words (cps 17 from 24.26) | "save ... rest ... not" |
| 29.5 | engage.final: WHICH WAS HIS GREATEST MOVE? (no "tell us" header before it is said) | "which was" |
| 32.78 / 35.04 / 38.12 | cards 1 BROOKLYN 29-30 AUGUST 1776 / 2 TRENTON 26 DECEMBER 1776 / 3 PRINCETON 3 JANUARY 1777 | "One / Two / three" |
| 41.37 | 1, 2 OR 3? | after "Princeton?" |
| 41.90 | italic line "Tell us in the comments, and which commander we should cover next" | "Tell us" |
| 45.37-48.4 | corner subscribe, click on "Subscribe" (46.62); final cards out 46.4 | "Subscribe" |
| 48.4-65.7 | the living map alone (clouds, water, slow drift east), ~17.3 s clean; fade 64.2-65.7 | |

## Troop motion (`check_troops_motion.mjs` 0-65.72 colonies)
No overlaps, no pops, no shape change, screen long-side-normal <= 4 deg, turn <= 21 deg/s.
(The checker's "pop" = > 0.5 units per sample; on this z9 map keep moves under ~5 u/s.)

## Open issues
- The clean end window is ~17.3 s (narration ends 47.9 s), not 19 s.
- The red-held tint polygons are approximate (a belt along the post roads, not a surveyed boundary).
- The banner + MORRISTOWN sit in the top third of the frame (Morristown is far north of the posts); label moved right of the banner.

## Round 1 fixes (critics A 6 / B 8 on S08; lead: region `colonieswinter`)
- Subscribe button on its word (`tSub: T.subscribe - 0.1`).
- Clouds: `scatter { seed 7, n 10, med 18 }`, keepClear only on Morristown / New Brunswick and the lower-right quarter (end-screen tiles).
- Bigger lines (bw 1.6); New Brunswick targets spread (two red lines overlapped there from 14.7 s). MORRISTOWN label right of the banner.
- Checks: check_troops_motion clean (no overlaps, no pops); check_side_gap 0 pairs.
