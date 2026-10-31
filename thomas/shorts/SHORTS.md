# George Thomas: YouTube Shorts

Built with `python3 tools/make_short.py shorts/<name>.json` (from `thomas/`). Each Short is cut from the long video's own scene renders
and narration (same voice as the posted video), re-framed to 1080x1920: blurred map behind, the map centre in the middle, a 2-line hook
title on top, word-by-word captions below. Output: `build/shorts/`.
**Sound = the LOCKED mix (STYLE_LOCK 3-5), redone 2026-10-31 at the owner's request:** the locked kit (`goosegreen/assets/media/sfx`, md5-checked by
`rokossovsky/tools/check_sound_lock.py`, which runs first) at the locked levels via `rokossovsky/tools/sfx_mix_lib.py`; cues come from the
scene's own timeline (`shorts/events_<scene>.json`: every gun flash = "fire", every shell burst = "impact" + a 3 px shake); "hit" on the
title and on stamps only; no zoom whoosh (biggest camera moves only). Music = the locked track for that part of the story (move 2 =
"Wounded"), -20 LUFS x MUSIC_VOL 0.08, ducked thr 0.03 ratio 6; SFX ducked thr 0.03 ratio 3; limiter 0.5; two-pass -14 LUFS.
**Text style = A, owner-approved 2026-10-31 ("I like the yellow one"):** title in white Oswald with ONE gold word (#F2C14E) and a soft
shadow, nothing under it; captions 1-3 words, white with the spoken word in gold, soft shadow; no extra text. Per-segment `"x"` moves the
map crop so labels are never cut off.
**No on-screen caption bar from the map** (owner 2026-10-31: it duplicated the Short's captions): copy each scene to
`scenes/<scene>_nocap/`, add `<style>.caption,#date,#credit{display:none!important}</style>` before `</head>` (caption bar, date scroll, terrain credit: the credit goes in the description); add `.bubble` too when a scene has a wide speech bubble (nash2), render it, and use `<scene>_nocap` in the
spec (copy `events_<scene>.json` to `events_<scene>_nocap.json`). Map labels and stamps stay.
The narration is the posted video's own voice (Kokoro am_michael), so the Short matches the long video.
Rules for descriptions are the channel's: **no links**; name the full video in words.

## S1: Nobody Ordered This Charge (TEST, ~72 s) — `s1_nobody_ordered.json`
Cut: Grant's order to stop at the rifle pits (9:37) → the death trap (10:05) → the men climb on their own (10:24) → Grant furious,
"I don't know. I did not." (painting, 10:44) → blue flags on the crest, Bragg's army flees (11:35).
On-screen hook: **NOBODY ORDERED / THIS CHARGE** (NOBODY in gold)

**Title:** Nobody Ordered This Charge. It Won the Battle. #shorts
**Alternatives:** "Grant Was Furious: Who Ordered Those Men Up the Ridge?"

**Description:**
```
November 25, 1863. Grant ordered George Thomas's men to take the rifle pits at the foot of Missionary Ridge and stop.
Under fire from the crest, they kept going, and nobody had ordered it. "Who ordered those men up the ridge?" Grant demanded.
"I don't know," Thomas answered. "I did not." Within the hour, Bragg's army was running into Georgia.

Full story on the channel: George Thomas's Top 3 Legendary Tactical Moves | The Man Who Saved the Union Army.

#shorts #civilwar #history #militaryhistory #ushistory #generalsonthemap
```
**Tags:** missionary ridge, battle of chattanooga, george thomas, ulysses grant, civil war, american civil war, civil war battles,
military history, battle maps, history shorts

## S2: Half the Army Ran. He Didn't. (~49 s, maps only) — `s2_half_ran.json`
Cut: the Union right ceases to exist, Rosecrans swept away (0:26) → "But one general does not leave the field... George Henry Thomas"
(0:47) → Horseshoe Ridge: "the army did not have to run" (5:07) → wave after wave, thrown back (5:28). Music: Long Note One (move 1).
**Title:** Half His Army Ran. He Didn't. #shorts
**Description:**
```
September 20, 1863, Chickamauga. A gap opens in the Union line, Longstreet's men pour through, and half the army runs, its commander
with it. One general stays. George Thomas gathers every unbroken regiment onto a ridge, and all afternoon the attacks break on it.

Full story on the channel: George Thomas's Top 3 Legendary Tactical Moves | The Man Who Saved the Union Army.

#shorts #civilwar #history #militaryhistory #chickamauga #generalsonthemap
```
**Tags:** chickamauga, battle of chickamauga, george thomas, horseshoe ridge, civil war, american civil war, military history, battle maps

## S3: Standing Like a Rock (~48 s, maps only) — `s3_like_a_rock.json`
Cut: wave after wave on Horseshoe Ridge, Steedman marches to the guns, bayonets (5:28) → Garfield finds Thomas still fighting,
"standing like a rock" (5:58, narration over the Rossville withdrawal map). Music: Long Note One.
**Title:** How George Thomas Got His Nickname #shorts
**Description:**
```
Horseshoe Ridge, Chickamauga, 1863. Wave after wave of Confederate infantry charged the hill; some Union regiments ran out of ammunition
and held the crest with bayonets. James Garfield, the future President, rode back and found Thomas still fighting. Thomas, he
reported, was standing like a rock. The name stuck: the Rock of Chickamauga.

Full story on the channel: George Thomas's Top 3 Legendary Tactical Moves | The Man Who Saved the Union Army.

#shorts #civilwar #history #militaryhistory #chickamauga #generalsonthemap
```
**Tags:** rock of chickamauga, george thomas, james garfield, chickamauga, horseshoe ridge, civil war, military history, battle maps

## S4: He Refused to Attack (~61 s, maps only) — `s4_not_on_ice.json`
Cut: telegrams demanding an attack, the ice storm, Thomas refuses, Grant draws up the removal order, "he would not attack on ice"
(14:07) → "a day or two left... the ice began to melt" (14:51) → Shy's Hill falls, Hood's army flees (16:38) → "one of the most complete
victories of the entire war" (17:23). Music: Long Note Two (move 3).
**Title:** Grant Told Him to Attack. He Refused. #shorts
**Description:**
```
Nashville, December 1864. Washington and Grant demanded that George Thomas attack at once. Then an ice storm turned the hills to glass,
and Thomas refused to move. Grant drew up the order to remove him. The ice melted, Thomas attacked, and Hood's army broke: one of the
most complete victories of the entire war.

Full story on the channel: George Thomas's Top 3 Legendary Tactical Moves | The Man Who Saved the Union Army.

#shorts #civilwar #history #militaryhistory #nashville #generalsonthemap
```
**Tags:** battle of nashville, george thomas, ulysses grant, john bell hood, civil war, american civil war, military history, battle maps

Map terrain credit for all descriptions (the map credit is hidden in Shorts): "Terrain: Mapzen / AWS Terrain Tiles (open data)."
Shorts use **maps only** (owner 2026-10-31): narration from an archive section plays over a map shot (`"pic_from"`).
Sound cues are read from each scene's timeline with `node tools/short_events.js` (flash = fire, burst = impact + shake, clash = hit).

## vidIQ auto-clips (2026-10-31, 171 credits, all 10 at 1080x1920 with "Loud & Clear" captions)
Layout: the whole 16:9 frame small in the middle of a blurred copy, karaoke captions, no hook title. Downloaded for comparison:
`build/shorts/vidiq/vidiq_death_trap.mp4` (577.5-623.7, same moment as S1) and `vidiq_nashville_end.mp4`. The links expire.
| Clip | Source | vidIQ score | vidIQ title |
|---|---|---|---|
| 1 | 0:07-0:46 | 92 | A Single Order, A Union Division Collapses! |
| 2 | 3:09-3:46 | 88 | Savage Woods: Thomas's Log Walls Hold Strong! |
| 3 | 3:46-4:23 | 95 | Confusing Order Creates a Quarter-Mile Gap! |
| 4 | 4:33-5:19 | 93 | Thomas Sees Opportunity in Chaos: Horseshoe Ridge |
| 5 | 6:48-7:25 | 90 | Thomas's Method: Calm in the Storm of Battle |
| 6 | 9:37-10:24 | 94 | Death Trap! Union Soldiers Charge the Mountain! |
| 7 | 11:05-11:45 | 93 | Confederate Blunder! The Collapse of Missionary Ridge |
| 8 | 14:40-15:26 | 93 | Ice Storm Siege: Thomas's Risky Refusal! |
| 9 | 15:27-16:15 | 95 | Nashville Decider: Thomas's Deceptive Wheel! |
| 10 | 16:48-17:27 | 96 | Nashville's End: Hood's Army Crumbles! |
