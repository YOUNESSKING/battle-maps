# Style critique: Sherman #13 as it actually plays (2026-10-29)

What I looked at: `sherman/build/sherman-720p.mp4` (15:46). The first 90 s at 1 frame per 3 s, 25 frames over the rest, dense
2 s sampling of 7:38-7:56, 9:32-9:48 and 15:20-15:48, and a motion scan of the whole video (64x36 frame difference over 6 s windows).
I compared it with `reference/style-reference-rokossovsky-v8.mp4` (the locked reference) and `reference/hook-reference-meade-v3.mp4`, read
STYLE_LOCK.md and HANDOVER §1b/§10, and checked the loudness with ebur128.
Note: `Sherman-Top3-1080p.mp4` was built a day after the 720p file (same length). If anything changed in between, re-check the timestamps.
The evidence frames are in `research/critique_frames/`. The working frames (not committed) are in `/tmp/claude-0/critic_frames/`.

Bottom line: the hook and the packaging rules are working. The main body has drifted away from the locked reference in ways
that matter on a phone. Units and labels are tiny, frames are mostly one dark-red wash, archive photos almost disappear after 1:47,
and two long cards sit still at the decision point and at the end. Most fixes are about matching the locked reference more closely,
not restyling.

---

## 1. What is strong: keep it

| Strength | Evidence | Why it works |
|---|---|---|
| **Hook structure follows the lock.** Map with units at frame 0, a stamp in the first second, a continuous zoom to ATLANTA by ~0:09, the number card on its words, "BREAKS THE CONFEDERACY" (the title promise) spoken at ~0:15, ATLANTA FALLS / LINCOLN RE-ELECTED / LARGEST SURRENDER payoff by 0:30-0:42, twist, name, three moves by ~1:20 | `k01_strengths.jpg` (0:03), hook frames 0:00-0:42 | It is the first video built fully to the post-Morgan rules. The promise is paid in the first 30 s, which Morgan and Thomas never did. |
| **The Kentucky "INSANE" twist** (dark map, Kentucky lit in gold, red stamps one per detail, then the newspaper headline with INSANE in red) | `k01_strengths.jpg` (1:00), 0:45-1:03 | It is the best-designed sequence in the video: one idea per beat, high contrast, reads at any size. It is a model for every twist. |
| **Bottom caption bars** ("BEHIND JOHNSTON'S BACK, ON THE RAILROAD") | `k01_strengths.jpg` (3:25), 2:50, 4:00, 5:10 | They are big white Oswald on a solid black bar. This is the most phone-legible element in the video and tells the viewer what to look at. |
| **Commander badges with real photos + name plates** (Howard, Hardee, Grant, Thomas, Johnston) | 8:05, 8:40, 10:25, 11:35 | Faces give the map a human anchor. The plates are large and readable. |
| **Big double-line manoeuvre arrows** (the swing around Atlanta, the march route) | 0:24-0:27, 8:40 | When the arrow is big, the move reads in one glance. This is the channel's core promise ("tactical moves"). |
| **Engagement cards** (WHAT WOULD YOU DO?, 1-2-3 final question, the small SUBSCRIBED pill) | 7:42, 15:24, 6:55 | They are clean, large and on-brand, and the subscribe pill is small and does not stop the story. |
| **Night beat at Savannah** | 11:00 | The muted blue palette is a welcome change of mood and the fronts stay readable. |
| **Consistent frame furniture** (date scroll top-left, legend top-centre, N arrow, scale bar) | every map | The viewer always knows when and who. Keep it. |
| **Loudness** -14.1 LUFS integrated | ebur128 | It is exactly on target. |

---

## 2. Problems, ranked by likely cost to retention or to how professional the video looks

### P1. Units and story labels are too small to read on a phone (likely the largest hidden retention cost)
- **Evidence:** `p01_units_vs_reference.jpg`, `p01_phone_width_s0520.jpg`. On Sherman maps a unit counter is about 14-16 px wide at 720p and the corps text under it ("XX", "XVII", "XIV") is about 5-6 px.
  At the same crop the Rokossovsky reference counters are about 32-40 px with readable names (XLVI PZ, 13TH ARMY). At phone width (390 px wide) a Sherman
  counter is about 5 px, a dot. Whole armies (Thomas, Howard, Schofield) are one tiny chip each (0:18, 8:40), so 100,000 men on screen look like four specks.
- **Why it matters:** this is a *tactical moves* channel. If the viewer can't see who moves where, the map turns into wallpaper and the voice
  carries everything alone. Most views are on phones (browse/Home is 85-97 % of traffic, §10). The flat 38 % plateau on Morgan shows that maps can hold people, but only when they read.
- **Fix (within the lock):** the lock fixes the *symbols*, not their screen size. Render counters at the reference's on-screen size: about 2x now, about 36 px
  at 720p / 54 px at 1080p, with unit names at least 12 px at 720p. When a counter would be too small on a wide shot, either cut it, or push the camera in, or
  show a commander tag ("SHERMAN · 98,000") instead of a sub-pixel chip. Use more counters per army on close-ups (the reference shows 15-25 counters
  in a battle; Sherman close-ups show 3-6). Keep the **geography** layer small (that rule is locked). Only the story layer (units, story places, arrows) gets bigger.

### P2. Archive photos almost disappear: about 22 s in 15:46 (about 2 %, against the 20 % target), all of it before 1:47
- **Evidence:** `p02_archive.jpg`, `sherman/archive.json` (one block, "4"). The motion/saturation scan finds photo footage only at 1:24-1:47. After that there are 14 minutes
  with no photograph, headline card, projector frame or date card. In that one block, the same portrait (`sherman_wide.jpg`) is used twice (1:25 and 1:46).
  The upright photos are pillarboxed with grey blurred side bars (1:25, 1:46), which looks like a phone screenshot rather than the Netflix depth look.
- **Why it matters:** photos give visual contrast and texture against maps and act as a reset every few minutes ("now see the real thing").
  The locked reference ends its moves on film in a projector frame (r_084-r_096). Without them, 14 minutes of similar dark maps pile up into fatigue
  (see P3). The archive is also where the human cost lands (burnt Atlanta, twisted rails, Savannah, Columbia). This video *talks* about those things but never *shows* them.
- **Fix (within the lock; STYLE_LOCK 0b item 8 and 2a archive):** add 3-4 archive blocks of 12-20 s each: the start of move 1 (Barnard's Atlanta fortifications),
  the end of move 1 (Atlanta's roundhouse ruins, the destroyed rails, "Sherman's neckties"), move 2 (Savannah, the Fort McAllister guns),
  move 3 (Columbia in ruins), and a headline card for Lincoln's re-election (Harper's Weekly page). There is no motion film for 1864, so use
  Barnard's *Photographic Views of Sherman's Campaign* and the LoC Brady collection (PD) with `depth: True`, a headline date card per block and the projector frame on a
  slow pan. Never reuse a still, and fill a portrait-shaped photo with a blurred-zoom of *itself* (or a darker frame), not flat grey bars.

### P3. One-colour red wash and artificial territory shapes: frames all look alike, and some look fake
- **Evidence:** `p03_red_wash_shapes.jpg`. Confederate red fills about 60-90 % of the frame in most wide shots (0:00-0:21, 2:15, 8:40, 9:50, 11:35, 15:05). On the
  march the Union-held ground is a smooth blue **capsule** (9:32-9:48, 9:50; 13:20 "Fayetteville" sausage), and at 14:28 the Union zone ends in a **perfectly straight
  vertical edge**. At 14:30 two maps of different scale cross-fade, giving doubled flags, two CONFEDERATE STATES labels and a seam (`s_0870` in p03).
- **Why it matters:** (a) When 70 % of every frame is the same dark red, cuts stop reading as cuts and the eye has nowhere to land. That is the "it all looks the same"
  feeling that slowly bleeds viewers between minute 2 and 12. (b) History viewers know a moving army controls a strip, not a pill shape. Geometric blobs and ruler-straight
  borders look like a placeholder and cost credibility in the comments.
- **Fix:** (1) Per STYLE_LOCK 2a, the territory option is chosen by eye. For the march and the Carolinas (an army moving through enemy country, no real front), use
  **option 2 or no fill**, plus a *swath* drawn from the real routes (feathered and irregular, with burning-town markers). Do not draw a Union "territory" blob.
  (2) Keep option-1 fill for the theatre overviews only. (3) Never cross-fade two maps of different scale. Use one camera move, or cut on a whoosh.
  (4) Generate control edges from traced lines (`make_front_lines.py`) instead of hand rectangles/ellipses. All of this is within the lock.
  Lowering the fill alpha (0.46-0.66) *would* need the owner's approval. I don't think it is needed if the march maps stop using fill.

### P4. Long frozen stretches at the two moments built for engagement
- **Evidence:** `p05_static_and_endscreen.jpg`. The motion scan shows almost no change at 7:40-7:54 (WHAT WOULD YOU DO?, 14 s, the only changes are the boxes lighting at 7:54),
  15:22-15:46 (final 1-2-3 card, 24 s), 9:33-9:47 (the march corridor, 14 s, only tiny orange dots), 11:13-11:21, 12:56-13:05, and in the hook 0:48-0:57 (Kentucky).
  Also in the hook, the map does not move at 0:09-0:21 while three text cards stack on it (a 12 s locked-off camera).
- **Why it matters:** the lock itself says "never more than 4 s without a change". A dimmed, frozen card is where a phone viewer thumbs away, and the 14 s decision card
  sits right in the middle of the video where the Morgan/Thomas curves already dip at the subscribe ask.
- **Fix (within the lock):** under every card, keep the map *living* (units marching, a slow 3-5 % push-in, clouds) instead of a dimmed still. Add one beat every 3 s on the card itself
  (each option box slams in on its words, a tick counter, a red ring around Hood's route when "chase Hood" is spoken). Cut the card down to the spoken length plus 1 s.
  On the march, show foragers fanning out, smoke columns on Milledgeville/Millen and the rails being torn up, instead of dots.

### P5. The ending fights YouTube's end screen
- **Evidence:** `p05_static_and_endscreen.jpg` (15:44). The 1-2-3 card fills the upper-middle until the last frame, the "NEXT: GEORGE THOMAS AT NASHVILLE" chip is bottom-left
  and the subscribe pill is bottom-right. Those are exactly the zones YouTube's end-screen video tile and subscribe circle cover.
- **Why it matters:** the end screen is the only "next video" click (Thomas lost 6.4 points in an ending with no next video offered). Overlapping elements look
  sloppy, and the viewer sees two "next" offers fighting each other.
- **Fix (respects STYLE_LOCK 1b: "the last ~20 s leave room for the end screen, map stays on screen"):** at -20 s, fade the card out (or shrink it to a top band),
  leave a clean, slowly moving map, and keep the left-middle and right-middle empty for the end-screen elements. The spoken next-video pitch stays. The on-screen chip
  should go before -20 s, and the end-screen tile replaces it.

### P6. Hook: the right skeleton, but text overload and a weak "three moves" preview
- **Evidence:** `p06_hook.jpg`. At 0:21 five text blocks are on screen at once (98,797 card, STILL HOLDING, 4 MONTHS, THEIR GENERAL plate, legend/date), and the 98,797
  card covers the N arrow and the map's top-right. The three snap cuts at 1:12-1:18 (move 3) are a pale, empty grey-green map with two specks and a dotted line, with no action and no impact.
  The "?" mystery badge loses its flag at 1:03 (empty dark circle) after showing the US flag in every earlier frame. The title card at 1:21 is ghosted (see P8).
- **Why it matters:** the first minute is where 40+ points were lost on Morgan/Thomas. Stacked text makes the viewer *read* instead of *watch*, and the move preview is the
  moment that should make them think "I need to see that". An empty map undersells move 3.
- **Fix (within the hook lock):** one text card at a time: each new stamp replaces the previous one, and the number card shrinks to a corner chip after its beat. Move the camera (a slow push
  toward Atlanta) during 0:09-0:21. Make each snap cut an *action* frame from that move (Atlanta: the swing arrow + rails twisting; March: the burning route; Carolinas:
  columns crossing the flooded swamp with corduroy roads drawing on, plus one impact). Keep the badge's flag on the "?" all the way to the name slam.

### P7. Front lines thinner than the locked width on several close-ups
- **Evidence:** `p04_front_width.jpg` (4:35 vs the reference). Sherman's two-colour fronts at 3:25, 4:35 and 5:45 read as thin 4-6 px lines with little glow. The reference bands
  (r_040-r_060) are thick glowing ribbons. The lock says "width 15, glow 0.47, never thinner". The cause is probably the scene being drawn at a zoomed-out camera scale.
- **Why it matters:** the front is the one thing that tells a casual viewer who is winning. Thin lines vanish on a phone, especially red on red.
- **Fix (enforces the lock):** set the width in *screen* pixels (compensate for camera zoom), or check on the snapshot sheet that the band is at least as thick as in the reference.

### P8. Transitions: text dissolving through text, maps through maps
- **Evidence:** `p07_transitions.jpg`. At 15:20 the method card dissolves over a ghosted "WAR IS ALL HELL" quote card (both half-visible). At 1:21 "3 GREATEST TACTICAL MOVES" fades
  in over a busy map. At 14:30 two different maps cross-fade (P3).
- **Why it matters:** a half-transparent text-on-text frame reads as a render glitch and is the most "amateur" look in the video. Pro edits *cut* text or wipe it.
- **Fix:** text cards cut in/out (or scale-pop in 0.2 s), never cross-dissolve over another text card. Map-to-map changes use the camera or a hard cut on a whoosh.

### P9. Tiny secondary text everywhere (sub-captions, stamp sub-lines, credit)
- **Evidence:** `p09_tiny_subcaptions.jpg` (0:06: "BY HIS CABINET", the sealed-note text). Stamp sub-lines ("ATLANTA · AUGUST 1864", "MAY - AUGUST 1864"), card footers
  ("PRESENT FOR DUTY · 1 MAY 1864 · SHERMAN'S MEMOIRS"), quote attributions and the terrain credit are all about 6-8 px at 720p, about 2-3 px on a phone.
- **Why it matters:** illegible text is noise. It adds clutter to every frame without adding information, and it competes with the one line that matters.
- **Fix:** either make secondary lines at least 60 % of the headline size or drop them (sources belong in the description, which the channel already does). The terrain
  credit can move into the description plus the end credits if its licence allows that (Mapzen/AWS Terrain Tiles attribution: check before removing).

### P10. Colour/grade: the grey-green close-ups look washed out next to the dark wide maps
- **Evidence:** the option-2 close-ups at 3:25, 9:15 and 12:10 are pale grey-green with low contrast; the option-1 wide maps are dark navy/red. The reference's close-ups (r_052) are dark navy with
  glowing fronts, so they sit in the same family as its wide shots.
- **Why it matters:** cutting between a dark red frame and a pale grey-green frame feels like two different videos. The pale frames also lower the contrast of the small
  counters (P1).
- **Fix:** use the dark `<map>_hd_ref` grade on the close-ups as well (STYLE_LOCK 0b item 2: "dark HD maps everywhere"). This is the lock, not a change.

### P11. Thumbnails: good text and face, weak battlefield
- **Evidence:** `p08_thumbs_168px.png`, `p08_thumb_label_cutoff.jpg`. Both thumbnails use a *video frame* as the battlefield instead of the locked vidIQ dark aerial battlefield
  (the notes say vidIQ had 0 credits until 22 Nov). Labels are cut off ("MACON & WESTERN RR · LAST LINE INTO"), with a stray "STATES" fragment top-left and a hidden
  "JONESBORO". There is no fire or smoke, so the map reads as two flat blobs at 168x94. The face cutout has a rough white fringe and is plain grey (the "face pop" rule asks for extra contrast + a rim light).
  A and B differ only in the banner text. That is fine for a text test, but nothing else is being tested.
- **Why it matters:** CTR is the biggest lever (§10: 0.9 % → 3.8-4.2 %). At small size, the left two-thirds currently contribute nothing.
- **Fix (within the lock):** remove every map label except ATLANTA and SHERMAN. Add smoke and a fire glow over Atlanta plus a burning rail line. Darken and blur the map edges.
  Clean the cutout edge, add a warm rim light and contrast on the face. When credits return, replace the battlefield with the vidIQ image as the lock says.
  "MAKE GEORGIA HOWL" is the stronger text (it reads at 168 px, has menace and a verbatim quote). "CUT LOOSE" needs context.

### P12 (minor). Audio dynamics
- Integrated loudness is -14.1 LUFS, but the loudness range is only **2.7 LU**. Booms barely rise above the voice bed. This is a mix-chain consequence (locked levels),
  so it is noted rather than proposed. If the owner ever wants more punch, testing a gentler limiter would need his approval (sound lock).

---

## 3. Scorecard (0-10, as it plays on a phone)

| Area | Score | One-line reason |
|---|---|---|
| Hook (structure + pacing) | **8** | Follows the lock, promise by 0:15, strong twist; loses points for text stacking and empty snap cuts |
| Hook (visual clarity) | 6 | 0:09-0:21 static camera under 3-5 text blocks |
| Map legibility at phone size | **4** | Counters and unit names about 5 px on a phone; front thin on close-ups |
| Visual hierarchy | 5 | Captions and badges lead the eye well; the action itself is too small to be the focus |
| Pacing (body) | 6 | Mostly lively; 14-24 s frozen cards at the engagement points |
| Consistency between scenes | 5 | Dark red wide maps vs pale green close-ups; badge flag lost; mixed stamp colours |
| Territory / map credibility | 5 | Red wash; capsule and straight-edge zones; doubled-map cross-fade |
| Archive section | **2** | 22 s total, one block, a reused portrait, grey pillarbox |
| Transitions | 5 | Text-through-text dissolves look like glitches |
| Typography | 6 | Main captions excellent; secondary text unreadable |
| Colour / grade | 6 | Good dark theatre maps; washed-out close-ups |
| Ending / end-screen space | 4 | Card and chips sit in the end-screen zones until the last frame |
| Engagement cards | 7 | Clear design, but frozen for too long |
| Thumbnails | 6 | Good text and face; flat, cluttered battlefield with cut-off labels |
| Sound (levels) | 8 | On target; very compressed |

**The three fixes that would move retention most:** P1 (story layer at the reference's size), P2 (3-4 archive blocks of Barnard photos), and
P4 + P5 (keep the map alive under the cards, clear the last 20 s for the end screen). None of them needs a locked rule changed.
