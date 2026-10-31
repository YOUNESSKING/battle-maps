# George Thomas: YouTube Shorts

Built with `python3 tools/make_short.py shorts/<name>.json` (from `thomas/`). Each Short is cut from the long video's own scene renders
and narration (same voice as the posted video), re-framed to 1080x1920: blurred map behind, the map centre in the middle, a 2-line hook
title on top, word-by-word captions below. Output: `build/shorts/`.
**Sound = the LOCKED mix (STYLE_LOCK 3-5), redone 2026-10-31 at the owner's request:** the locked kit (`goosegreen/assets/media/sfx`, md5-checked by
`rokossovsky/tools/check_sound_lock.py`, which runs first) at the locked levels via `rokossovsky/tools/sfx_mix_lib.py`; cues come from the
scene's own timeline (`shorts/events_<scene>.json`: every gun flash = "fire", every shell burst = "impact" + a 3 px shake); "hit" on the
title and on stamps only; no zoom whoosh (biggest camera moves only). Music = the locked track for that part of the story (move 2 =
"Wounded"), -20 LUFS x MUSIC_VOL 0.08, ducked thr 0.03 ratio 6; SFX ducked thr 0.03 ratio 3; limiter 0.5; two-pass -14 LUFS.
**No on-screen caption bar from the map** (owner 2026-10-31: it duplicated the Short's captions): copy each scene to
`scenes/<scene>_nocap/`, add `<style>.caption,#date,#credit{display:none!important}</style>` before `</head>` (caption bar, date scroll, terrain credit: the credit goes in the description), render it, and use `<scene>_nocap` in the
spec (copy `events_<scene>.json` to `events_<scene>_nocap.json`). Map labels and stamps stay.
The narration is the posted video's own voice (Kokoro am_michael), so the Short matches the long video.
Rules for descriptions are the channel's: **no links**; name the full video in words.

## S1: Nobody Ordered This Charge (TEST, ~72 s) — `s1_nobody_ordered.json`
Cut: Grant's order to stop at the rifle pits (9:37) → the death trap (10:05) → the men climb on their own (10:24) → Grant furious,
"I don't know. I did not." (painting, 10:44) → blue flags on the crest, Bragg's army flees (11:35).
On-screen hook: **NOBODY ORDERED / THIS CHARGE** (NOBODY in red) · MISSIONARY RIDGE · 1863

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

## Next Shorts (proposed, after the owner approves S1's format)
| # | Moment | Cut from | Hook text | Title idea |
|---|---|---|---|---|
| S2 | Half an army runs; one general stays | 0:26-0:58 (hook-1b, hook-2) + 4:53-5:15 (Horseshoe Ridge) | HALF THE ARMY RAN | Half His Army Ran. He Didn't. #shorts |
| S3 | The Rock of Chickamauga | 5:28-6:17 (wave after wave, bayonets, Garfield: "standing like a rock") | STANDING LIKE A ROCK | How George Thomas Got His Nickname #shorts |
| S4 | He would not attack on ice | 14:07-14:58 (telegrams, ice storm, "submit without a murmur") + Nashville result | NOT ON ICE | Grant Told Him to Attack. He Refused. #shorts |

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
