# Francis Marion #18 packaging (PACKAGING_GUIDE 0b) — draft 2026-11-14

Not scored with vidIQ (no external services for this draft): the owner scores the titles (target >= 85) before upload.
Every claim below is checked against `marion/research/FACT_NOTES.md` (row named in the last column). The Patriot (2000) is never referenced.

## Titles
| | Title | Chars | Claims -> FACT_NOTES row |
|---|---|---|---|
| **A** (locked format, recommended main) | Francis Marion's Top 3 Legendary Tactical Moves \| The Swamp Fox Tarleton Couldn't Catch | 87 | Move 2: "8 Nov: Tarleton followed seven hours, through swamps and defiles" + "Tarleton halted at Ox Swamp" (C) + "Tarleton's own account: an express from Cornwallis recalled him" (C). "Swamp Fox": "Swamp Fox first in print in the 1840s (Simms 1844)" (C; the video says the nickname came later) |
| **B** (famous name / curiosity) | How the Swamp Fox Escaped Tarleton Through the Swamps of South Carolina | 71 | Move 2: "Marion fell back over the Woodyard swamp in the most profound darkness" (C, James); "Marion rode thirty-five miles, through woods, and swamps and bogs" (C, James); Tarleton's pursuit "seven hours" (C, Tarleton 1787) |
| **C** (hybrid: name + the three moves) | Francis Marion, the Swamp Fox: Night Raids, a Swamp Chase and a Fort Taken Without Cannon | 89 | Move 1: Black Mingo 28-29 Sept + Tearcoat 24-25 Oct night attacks (C, James). Move 2: 8 Nov chase (C). Move 3: "No cannon on either side (the six-pounder Greene sent arrived too late)" at Fort Watson + "Lt. McKay surrendered 23 Apr" (C, Lee; Marion) |

A alternatives (same format, also true): "| The Man Tarleton Couldn't Catch" (same rows); "| The Man Who Freed 150 Prisoners With 70 Riders" (Stakes rows: "Marion had seventy men" FIX, "~150 Maryland Continentals freed" C).
Avoid (not sourced / false): "the devil himself could not catch him" as a fact (TRAD, James 1821, no witness); "40-foot tower" (no height stated: FIX); "Saved the Revolution / won the South" (not in FACT_NOTES); "Tarleton gave him the name" (nickname first in print 1844); any Patriot/Mel Gibson reference; "never lost" (Parker's Ferry withdrawal, Eutaw militia fell back).

## Thumbnails (`thumb/`, tool `marion/tools/make_thumb_marion.py`, sheet `thumb/sheet.jpg`)
Face in all three = Marion from John Blake White's painting (1810, MFA Boston, PD), cut out and given the face pop (contrast/colour + faint warm rim). It is the only colour image of Marion we have; no life portrait exists (FACT_NOTES "Honest ledger": "No portrait made in his lifetime is known"). The description says so. No AI images; all images from `marion/assets/media` (CREDITS.md) or our own map frames.

| | File | Context image | Words | Fits titles | Claim -> FACT_NOTES |
|---|---|---|---|---|---|
| **1 (recommended MAIN)** | `marion-thumb-A_SWAMP_FOX.jpg` | Ranney, *Marion Crossing the Pee Dee* (1850, PD), darkened/desaturated | SWAMP FOX (+ small FRANCIS MARION) | A, C (B ok) | nickname row (C, Simms 1844); Ranney label in CREDITS ("PAINTED IN 1850") |
| 2 | `marion-thumb-B_INTO_THE_SWAMP.jpg` | our map, 8 Nov 1780 chase (scene m2b at 21 s): Tarleton's red route, Marion's blue route, both banners | INTO THE SWAMP | B, C (A ok) | Woodyard swamp / "swamps and defiles" (C) |
| 3 | `marion-thumb-C_NO_CANNON.jpg` | our map, Fort Watson 23 Apr 1781 (scene m3b at 56 s): Maham's log tower over the stockade, riflemen firing down | NO CANNON (+ small FORT WATSON, 1781) | C, A | "No cannon on either side" + tower + surrender 23 Apr (C) |

Recommendation: **title A + thumbnail 1 (SWAMP FOX) as main**; Test & Compare thumbnails 2 and 3 (and title B/C as the title test). Why: the Arnold lesson (CHANNEL_LOG 2026-11-04) is that big thumbnails on a famous figure write the famous NAME/handle in big text on a warm image; "Swamp Fox" is the handle everyone searches, and the Ranney painting is the best-known Marion image. Thumbnails 2/3 are the DATA_RULES 3 sidebar play (our map, the only map tile among dark paintings).

Checks done (0b item 3):
- Spelling: SWAMP FOX, FRANCIS MARION, INTO THE SWAMP, NO CANNON, FORT WATSON, 1781 — all correct.
- Flags: the map scenes' small British flags (Tarleton's banner pennant in m2b, the Fort Watson flag in m3b) render with St Patrick's red saltire (the post-1801 Union Flag). **On the thumbnails both are covered with our 1606 Union flag (`gb_flag_1606.png`).** Americans show the Moultrie crescent pennant (Marion) and the blue unit boxes; no 13-star flag needed on these crops. No stray insignia.
- Map labels on the crops: "Banastre Tarleton", "Francis Marion" (banners, small), "RIFLEMEN" — right side, nothing hidden by the face. Thumbnail 3: Marion's small map banner (its 1876 lithograph head) was painted out so only one Marion face shows; on thumbnail 2 it stays (patching would cut the river) and is unreadable at feed size.
- The whole face is inside the frame (helmet crest touches the top on 2/3, face clear). Feed strip: 360 px and 168x94 on `thumb/sheet.jpg`; all three words read at 168 px.
- Picture matches the video: map frames are from our own scenes at those moments; the arrows on 2/3 follow the routes/fire drawn in the scene.

## End screen (0b item 5)
- From the busiest video to Marion: **Thomas** has the most views (125k, CHANNEL_LOG 2026-11-02) but is Civil War; **Morgan** (48k, the guide's named "busiest", same era, Tarleton again at Cowpens) is the natural feeder. Put the Marion end-screen element on **Morgan** (and on Thomas if the owner wants both); last ~20 s, + subscribe.
- Marion's own end screen (last ~20 s): **Morgan** (Tarleton's next defeat, Cowpens, Jan 1781) + subscribe. Expect little (channel end-screen CTR 0.6%).

## After upload (0b item 6)
Log in `research/CHANNEL_LOG.md`: winning title + thumbnail, CTR, impressions days 1-3 by traffic source (DATA_RULES standard prompt), separately from retention at 0:30 / 0:40 / AVD.

## Open questions for the owner
1. Main title: A (locked format) or B (curiosity, "Swamp Fox" first)? vidIQ scores still to run.
2. Busiest-video end screen: Morgan (same era) or Thomas (most views), or both?
3. The face is a crop from White's 1810 painting (the sweet-potato dinner scene, a Weems tradition); only the head and coat are used, so the thumbnail does not show the myth. OK?
4. Map scenes m2b/m3b: their small Union flags show the post-1801 St Patrick's saltire (wrong for 1780-81, STYLE rule). Fixed on the thumbnails only; the scene kit should be checked before the final render.

## OWNER DECISION (2026-11-14: "Approved")
- Main title: **A** — "Francis Marion's Top 3 Legendary Tactical Moves | The Swamp Fox Tarleton Couldn't Catch". B and C go into Test & Compare.
- Main thumbnail: **marion-thumb-A_SWAMP_FOX.jpg**; B and C as Test & Compare alternatives.
- Face crop from John Blake White's 1810 painting: OK (head + coat only; the Weems dinner scene is not shown).
- End screen: the Morgan video carries the Marion element (same war, Tarleton at Cowpens); Marion's own end screen points to Morgan.
- Uploaded 2026-11-16 (owner request): https://gofile.io/d/rTp8nCJm — 1080p master (md5 d57c5bf9cab09b4e4593096e7c371008), 720p preview, publishing guide PDF, thumbnails A/B/C + sheet.
- Uploaded 2026-11-17 (owner request, FINAL with the HE RAN. thumbnails): https://gofile.io/d/IvCRssSR — 1080p master (md5 d57c5bf9cab09b4e4593096e7c371008), 720p preview, publishing guide PDF (HE RAN.), thumbnail MAIN (Back Door style) + ALT (Grand Maneuver style).
