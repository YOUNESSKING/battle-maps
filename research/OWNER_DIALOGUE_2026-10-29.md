# Owner dialogue, 2026-10-29 (Sherman #13 session): what was decided
A short record of the owner conversation after Sherman #13 was delivered, for the next session. The binding rules are already in STYLE_LOCK.md / HANDOVER.md; this file explains WHY, and what is NOT approved.

## Approved and in the rules (STYLE_LOCK 0b / 1b, HANDOVER)
- **Map grade C1 "lifted Frontlines"**: bake every map with `LIFT=1 python3 tools/bake_hd.py <map>` → `<map>_hd_lift` (copy `sherman/tools/bake_hd.py`). Day is never navy/blue. Unit counters keep the OLD look (no cream keyline).
- **E1, territory toned down**: the multiply territory layers get `saturate(0.8)` through class `terr`.
  - `sherman/lib/battle.css` + the tagging line in `sherman/tools/scene_template.html`: copy both into the new skeleton.
  - NEVER use CSS attribute selectors on `style` (they made renders ~10x slower).
  - GSAP writes inline opacity: use `filter: opacity()` if you ever need to fade a whole layer by CSS.
- **E2, losing ground**: before the front moves, the ground about to be lost turns PALER for ~1.3 s, then changes colour. Tool: `sherman/tools/make_loss_layers.py`; pattern: `sherman/scenes-src/test-E2-lose.js`.
- **Archive length**: the style stays exactly as it is; only the amount changes. The background block after the hook + at most 3 short ~10 s blocks at the move ends, 2.5-3 s per photo, ~30 s in total.
- **Approved after the video test (A1-C3)**:
  - A1: bigger units (~54 px) and names (~19 px).
  - A2: bigger town labels (~36 px), but they SHRINK or FADE whenever troops are near the town or fighting starts there.
  - A4: lighter Confederate red (240,105,95).
  - B1: no enemy fill on deep marches.
  - B2: wide overviews show both sides.
  - B3: the decision card keeps the map moving, plus a black outline on the white text.
  - C1: the first-second stamp states the stakes.
  - C2: one big text block at a time in the hook.
  - C3: the final card moves to the top band in the last 20 s for the YouTube end screen.
  - Reference scenes: `sherman/scenes-src/test-*.js`; images: `sherman/build/approve/`.
- **Casualty card**: the OLD clean `K.casualties` card, NOT the Meade/Sherman-style "ranges" card.
- **No spoken next-video pitch** ("And next, watch...") unless the owner asks for it in that video.
- **Woven subscribe line = the "D2" pattern** (never an order):
  1. Close move 1.
  2. Ask the question that move 2 answers.
  3. "...that's the kind of question we answer here, and subscribing is how you catch the next one."
  4. Go straight back into the story ("Here's how <Name> did it.").
  - Write it fresh for each topic.

## Rejected (never apply)
- A3: legend chips in the on-map colours.
- A5: dark edge on the red front band.
- E3: colour that fades away from the front.
- The navy/blue day grade, and cream keylines on counters.
- Every "dial the colour down" sheet (T1-T5, V1-V6) and every competitor colour recipe (C1 no fill, C2 rim, C3 balanced, C4 enemy only). The owner keeps our current territory colours (E1).
- Test F's sepia base and one-sided fill.

## Under consideration (NOT in the rules; never use without the owner's OK): `research/CONSIDERING.md`
- **The orange effect**, a capture effect from a reference video: a burst, then the new colour floods out with a burning orange edge.
  - The owner liked the video test (`sherman/build/test-video-O.mp4`: O2 Ember, O3 Burn line, O5 Tide), but has not approved it for the rules.
  - Study: `research/ORANGE_EFFECT_*.md`.

## Still open
- Softening the very last line ("Subscribe, so you don't miss the next commander"). Proposed E1: "There are more commanders like him coming, and we'd be glad to have you with us for them." No answer yet.

## Process the owner insists on
- **Test before applying.** Show sheets and a short video test, and get approval label by label. Never change a file or a rule the owner did not approve.
- **Sheets no longer need approval**, but **rendering the full video needs an explicit OK**, and so does uploading to Gofile.
- **Thumbnails**: vidIQ generates the whole picture in ONE go: the hook battlefield, then the same image + a colour portrait + a torn red banner of 1-3 words. Make 2 variants (A/B), scored by vidIQ. Title: vidIQ score ≥ 85.
- **Deliver**: master + publishing PDF + both thumbnails in one Gofile folder; check the md5 of each file.
