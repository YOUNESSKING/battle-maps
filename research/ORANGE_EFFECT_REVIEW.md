# The orange effect: critique of the 7 ideas (REVIEW, UNDER CONSIDERATION, not approved)

Written by the critic of the ideas (agent 3), 2026-10-29.
- **Inputs:**
  - `ORANGE_EFFECT_ANALYSIS.md` (the reference + test F);
  - `ORANGE_EFFECT_IDEAS.md` (O1-O7);
  - STYLE_LOCK 0b (E1, E2, A4, rejected list);
  - `sherman/scenes-src/test-F1-ref.js` (`capture`) and `test-E2-lose.js` (`lay` / `loss`);
  - `sherman/lib/fx.js` (`K.impact`);
  - `sherman/tools/sfx_mix_lib.py` (KINDS, levels, min gaps);
  - frames `research/orange_frames/F1_*.jpg`.
- `ORANGE_EFFECT_CRITIQUE.md` (agent 2) did not exist when this was written.

Nothing here goes into a real video until the owner picks (CONSIDERING.md rule).

## 0. Five problems that cut across the ideas (fix these before any variant is built)

### 0.1 The owner liked something LOUDER than our "default" O2
- Look at what the owner actually saw and liked: test F (F1_5.4, F1_17.1).
  - It is a solid 9 px #FFAA00 ring with a 28 px glow.
  - At the push-in it is ~10 px solid + glow on the 1280 frame, so ~2 % of the frame width with its halo.
  - It is the brightest thing on the map, and it is what made the owner say yes.
- O2 "Ember" shrinks that to 0.8 % (15 px on 1920), burnt orange #D9822B, opacity 0.75, screen blend, on our grey-green lifted map.
  - On a phone (1920 frame shown ~390 css px wide) that is **a 3 px, low-contrast, brownish line**. Screen blend of #D9822B at 0.75
    over mid-grey land gives a dull tan, not a fire.
  - Most viewers will not notice it, so it fails the job it is meant to do (an event beat).
- Toning down must not throw away the thing the owner liked.
  - E1 / "never more saturated" is about the **territory fill**, not about a transient effect that is gone in 0.5 s.
  - `K.impact` fire is already bright orange and is locked.
  - So the band may be bright. It must be SHORT and NARROW-ish, not dull.

### 0.2 `whoosh` is the wrong sound for a flood
- `sfx_mix_lib.py` says `whoosh` = "locked zoom sound, only on the biggest camera moves".
- O1, O2, O3 and O5 put `whoosh` under every flood:
  - with O2 "on every territory change", that is 6-10 extra whooshes per video;
  - it breaks the lock's usage note;
  - it devalues the camera dives in the hook.
- **Rule for every kept variant: no `whoosh` on the flood.** The burst sound (`impact` / `explosion` via `K.impact`) carries it.
- A fire-rush bed is the only real fix, and it is a NEW file, so it needs owner approval (ask 1 in IDEAS section 9; I agree it is
  the right ask, but only AFTER the visual is approved).

### 0.3 Mixer min-gaps silently eat the planned sounds
- Min gaps from KINDS: `hit` 0.50 s, `impact` 0.25 s, `explosion` 0.20 s, `tick` 0.12 s.
- **O4** plans a `hit` on each later burst at 0.35 s spacing: every second `hit` is DROPPED by the mixer.
- **O7** has the defender's 2-3 hits "0.3 s apart" plus a `hit` on the stamp: same problem.
- Fix:
  - alternate `impact` / `explosion` (separate kinds, so separate gaps), or space `hit` >= 0.55 s;
  - and give every burst after the first `shake: false` (the default `K.impact` shakes 3, or 6 when r >= 20). Four shakes in
    1.5 s is jitter, not impact.

### 0.4 12-15 Hz flicker will not survive a 30 fps render + YouTube
- At 30 fps, 12-15 Hz is near the Nyquist limit. It renders as frame-to-frame strobing / beating, and YouTube's encoder smears it into
  blocky noise on the orange band (high-frequency change is exactly what it compresses worst).
- **Kept variants: flicker at most 5 Hz.** Better still, make the shimmer spatial only (the `13*T` phase term with a slow time term
  of ~3 Hz), so the band "crawls" rather than blinks.

### 0.5 Render-time traps in the shared `flood()` helper
Renders run ~7 s per video-second. The helper as written adds work on EVERY frame it exists.
- **A JS per-pixel loop over 1440x810 x 3 canvases** is ~3.5 M px/frame, plus `putImageData` and two 2880x1620 blended composites.
  That is roughly +60-120 ms/frame while active. Acceptable for 1.2 s, NOT acceptable if the canvases stay in the DOM.
  - **Mandatory:** each canvas is `display:none` outside [move - 0.05, move + dur + endFade]. Before and after, the existing static
    `lay()` PNGs show (identical pixels; that is how `loss` already swaps).
  - **Mandatory:** limit the loop to the lost-ground bounding box (in the Atlanta captures that is < 30 % of the frame).
- **Do not put `class terr` (`filter: saturate(0.8)`) on a full-size canvas.** That is a huge filtered layer re-rasterised every
  frame. Bake the saturate(0.8) into the lostB pixels at load time (or in `make_flood_field.py`), and give the canvas no filter.
- **Drop the SVG-filter fallback** (`feImage` + `feComponentTransfer` on a 2880x1620 layer, with an attribute animated per frame).
  It is the slowest path in Chromium, and it is exactly the "huge filtered layer" the brief warns against.
- **Better, if the 2D loop measures > 40 ms/frame:**
  - one THREE.js quad (three.js is already vendored for `flyover.js` / `board.js`);
  - a fragment shader reads the field + lostB + lostR textures;
  - it writes the fill/pale canvas (multiply) and the band canvas (screen);
  - the GPU cost is near zero.
- **Measure before the sheet:** render 2 s of the capture with and without `flood()`, compare s/frame. The budget is <= +10 % on
  the scene.
- **Seek safety:** draw from `onUpdate` on a tween in the master `tl` (as in test F) and read only the tween's progress + `tl.time()`,
  never `Date` / `performance.now`, so a seek to any frame draws the same picture.

### 0.6 Data that exists and data that does not
- **Exists:**
  - `atlanta_rivers.json`;
  - `atlanta_lines.json` (`river`, `rail`, `ridge`);
  - `atlanta_fronts.json` (per date: jul03, jul10, jul22, ...);
  - E2 layers `test_E2_*_lostR/lostB/rest_mx.png`.
- **Missing: there are NO road polylines.** "Roads x0.5" in O1-O5 means rails only (or new road data, which is extra research). Use
  `rail` + `ridge` (cost x1.5) + `river`. That is enough to break the circle.

## 1. Variant by variant

The scores are out of 10. **Retention** = will it hold a phone viewer's eye and add a beat. **Fit** = it keeps E1/E2, the unchanged
fronts and units, a history-channel tone, and the locked sound kit.

### O1 "Reference" (faithful copy): retention 7, fit 3. DROP (do not build)
- **Notice on phone?** Yes, instantly: 2 % band, a white-hot rim, a full-frame flash.
- **E2:** keeps the pale stage, but the gold #FFD200 / #FFF6C8 rim on our lifted map is brighter than anything else on screen, and
  next to the red front it blurs red vs orange.
- **Tone:**
  - the 1-frame white flash plus a 4-colour fire edge is the "other channel" look;
  - it is gamey on every capture;
  - the CLAUDE.md hook lock already bans white flashes in the opening zoom, a sign of the owner's taste.
- **Story time:** 0.5 s delay + 2.0-2.5 s flood + 0.5 s end, plus a camera push-and-pan. That is +1.5-2 s of visual per capture, and
  the camera move fights the shot's own planned camera.
- **Cost:** ~1 h on top of the shared helper, plus the heaviest band (4 stops, 13 Hz).
- **Sound:** `whoosh` misuse (0.2); `ref:boom` is silent in this skeleton.
- **Verdict:** pointless to build. **The comparison reference already exists: `sherman/build/test-video-F.mp4`.** Show that next to
  the sheet instead of spending an hour rebuilding a look we already know is too loud.

### O2 "Ember" (subtle, every capture): retention 4 as written, 7 after the fix; fit 9. KEEP (re-tuned)
- **Notice on phone?** As written, barely (see 0.1). After the re-tune below, yes: a short warm flash-line that runs and dies.
- **E2:** perfect. The pale ground is the fuse, and the flood only replaces E2's 1 s cross-fade (1.2 s instead of 1.0).
- **Fronts:** untouched. The band is under `#overlay`.
- **Tone:** right for a history channel, IF it is brief.
- **Story time:** +0.2 s over E2's cross-fade. It runs under the narration, so it adds no video seconds.
- **Cost:** shared helper (~4-5 h for bake tool + `flood()` + timing test), then ~0.5 h.
- **Sound:** locked `impact` only (drop the `whoosh`, see 0.2).
- **Exact changes for the sheet:**
  - band width 15 px -> **1.3 % of the frame (25 px on 1920) / camera scale**, including its soft falloff. The solid core is ~40 %
    of that, so the core stays front-width (family look) and the glow does the noticing;
  - colours `[winner, "#D9822B", "#F2C27A"]` -> **`[winner, "#FF8A2A", "#FFC85A"]`** (a real fire orange to amber, no white rim,
    no red-orange near the A4 red);
  - band opacity 0.75 -> **0.95**, screen blend;
  - flicker `{ f: 0.12, hz: 4 }` -> **`{ f: 0.15, hz: 3 }`, spatial phase on** (crawls, never strobes);
  - `dur: 1.2, ease: "power2.out"`: keep. `fillFrom: 0.7`: keep (lighter, never stronger).
  - `endFade: 0.4` -> **0.3**, so the bright band is on screen <= 1.5 s in total. That keeps it a flash of fire, not a new colour
    on the map;
  - burst `K.impact r 16`: keep (shake 3). `sfx: impact` only, no whoosh;
  - field: seed + `rail` (cost x0.6) + `river` (x3 within 6 px). Gaussian-smooth the field (sigma ~12 px) so the edge has no
    pixel-stair spikes.

### O3 "Burn line" (the front rides the edge): retention 8, fit 6 as written, 8 simplified. KEEP (simplified), one per move
- **Notice on phone?** Yes. The glowing front itself moves with fire behind it, and the eye already tracks the front.
- **E2:** fine (pale first).
- **Fronts: the risky part.** Re-sampling `frontS`'s `d` from field iso-lines has three problems:
  1. **The front is not the iso-line.** At a mid-point the real front = the parts of the OLD front not yet reached + the iso-line
     piece. The iso-line alone is an open arc that ends inside the old front.
  2. **Rail "tongues" make spiky iso-lines.** A glowing 15 px locked front with spikes looks broken, not organic.
  3. **The topology changes** (islands, pockets), so the d-morph jitters (the ideas doc admits this).
- **Tone:** the best history version. It explains WHY the ground fell (the railroad, the river).
- **Story time:** 2.2 s plus the settle. It belongs on the one key capture per move, not on every capture.
- **Cost:** high (bake + contours + front stitching), ~4-6 h on top of the helper. It is the most likely to need a second round.
- **Sound:**
  - `impact` / `explosion` at the burst;
  - `tick` per town passed is the counter sound: it says "number", not "town falls". Drop it and use the A2 label shrink alone;
  - `hit` at the stop: keep ONLY if no stamp/card lands within 0.5 s (min gap).
- **Exact changes for the sheet (simplified O3):**
  - **Do not stitch iso-lines into the front.** Keep the front's existing morph (`frontS` old `pts` -> new `pts`), timed with the
    SAME ease and duration as the flood (`power2.out`, 2.0 s, start = move).
  - Bake the field so that the old front is the seed line and the new front is the last arrival. Then the morphing front and the
    burning edge travel together by construction (close enough; the band is 25 px wide and covers the difference).
  - The "front IS the edge" read comes from the timing match + the band sitting on the winner's side.
  - Field: seed line = old front (from `atlanta_fronts.json`) + a delayed seed at the breakthrough point (delay 0) so it bulges
    there first; `rail` x0.6, `river` x3, `ridge` x1.5, Gaussian sigma 16 px.
  - Band: O2's re-tuned values. Width 1.3 % / camera scale. Flicker `{ f: 0.18, hz: 4 }`.
  - Duration 2.0 s (not 2.2), `endFade` 0.4.
  - Camera: no new pan. It rides the shot's existing push. A pan that follows the edge fights the locked
    "wide -> push-in -> close-up" camera plan.

### O4 "Domino" (staggered towns): retention 7, fit 6. RESERVE (not on the first sheet)
- **Notice on phone?** Yes, the rhythm is the point.
- **E2:** one pale stage over the whole area: fine.
- **Tone:**
  - 3-5 bursts + 3-5 bands + a "TOWNS TAKEN" counter is busy;
  - the counter is an extra text block, against C2 (one text block at a time) when a caption is up;
  - near units, A2 label shrinking makes it even busier.
- **Story time:** fine if the bursts sit on the spoken names. It is worthless if they do not, and only a few lines per video list
  towns.
- **Cost:** low once the helper exists (multi-seed field).
- **Sound:** the planned `hit` chain is eaten by the 0.5 s min gap (0.3). Every `K.impact` shakes by default.
- **If built later:**
  - drop the counter;
  - first burst `K.impact r 20` (explosion + shake 6), the rest r 14, `shake: false`, alternating `sfx: "impact"` / `"explosion"`;
  - spacing >= 0.4 s or on the words;
  - bands use O2's re-tuned values.
  - It is really "O2 with several seeds", so it does not need its own approval round.

### O5 "Tide" (wide overview, option 1): retention 6, fit 8. KEEP
- **Notice on phone?** Yes. It is a large area, and wide shots are where nothing else moves.
- **E2:** fine. **Fronts:** unchanged.
- **Tone:** calm and documentary: a slow tide, not an explosion.
- **Story time:** 3.5-4.5 s, but it runs UNDER narration on a shot that is otherwise static, so it adds no seconds. Tie the
  duration to the narration span (min 2.5 s, max 4 s).
- **Cost:** ~1 h after the helper. The seed line comes from `atlanta_fronts.json`, which exists.
- **Risks:**
  - band width at low camera scale (the doc already flags dividing by the camera scale);
  - the row of 3-5 small `K.impact r 10` along the old front each shakes: give them `shake: false`, and `sfx: false` except the
    first.
- **Exact changes for the sheet:**
  - burst row: 4 x `K.impact r 10`, 0.12 s apart, `shake: false`, `sfx` only on the first (`impact`);
  - flood `dur: 3.5, ease: "power2.out"` (power3.out leaves ~2 s of near-still band; power2 keeps it visibly moving);
  - band: O2's re-tuned colours, width **1.0 %** of the frame / camera scale (wide shots read finer), opacity 0.9, flicker
    `{ f: 0.12, hz: 3 }`, `endFade 0.6`;
  - the date card flips on the first burst;
  - no `whoosh`, no `hit` at the date card (cards use their own sound in the skeleton);
  - camera: the B2 framing with a slow push 1.00 -> 1.03, no pan.

### O6 "Scorch sweep" (close-up, option 2, band only): retention 5, fit 3. DROP
- **Notice on phone?** Yes, but as WHAT? A free-floating orange band with no fill behind it, next to a red glowing front, reads
  as a third front or a fire line. Close-ups already have `K.impact` fire, guns and smoke doing the "action" job.
- **Fronts:** its pale stage dims the losing front's glow 0.47 -> 0.30. That touches the locked front style (glow 0.47, "never
  thinner"). The owner said the fronts stay.
- **Tone:** the "scorched" afterglow is a new ground look on option 2, whose whole point is a clean map with only two colours.
- **Cost:** high (band-only field clipped to the strip between two fronts, plus O3's morph). It needs a new pale rule for option 2.
- **Sound:** fine (`explosion`, `mg`, `hit`).
- **Verdict:** drop. On close-ups use the existing locked kit: impacts on the strongpoint + the front morph.

### O7 "Stalled fire" (failed attack): retention 8, fit 5 as written, 7 with the fix. RESERVE (second round, after one success variant is approved)
- **Notice on phone?** Yes, and it is the best pattern break in the list.
- **E2: real conflict as written.** It pales ground the attacker only WANTED, then un-pales it. E2 was just locked as
  "pale = about to be lost". If pale sometimes means "maybe", the viewer can no longer read E2.
- **Fix:** no pale stage at all on a failed attack. The ground is NOT going to be lost, so it stays full colour. The fire runs
  onto full-colour ground, stalls at the river/ridge, recedes. The contrast with real captures (which always pale first) then
  becomes a cue in itself: "no pale = they won't get it".
- **Story time:** ~2.5 s, plus the stamp. That is fine on a twist beat.
- **Cost:** low after the helper (s tween forward then back).
- **Sound:** the defender's hits at 0.3 s collide with the `hit` min gap: use `impact` / `explosion` for the hits and keep `hit`
  for the "REPULSED" stamp only.
- **Constraint:** it only works after the viewer has seen at least one successful flood in the same video. The Atlanta test
  material has a candidate (Peachtree Creek, 20 July: Hood's failed attack). Build it as round 2.

## 2. Score table

| Variant | Retention /10 | Fit /10 | Seconds added per capture | Build (after helper) | New sound file? | Verdict |
|---|---|---|---|---|---|---|
| O1 Reference | 7 | 3 | +1.5-2 s visual | ~1 h | no (but whoosh misuse) | DROP; use test-video-F as the comparison |
| O2 Ember (re-tuned) | 7 (4 as written) | 9 | ~0 (+0.2 under narration) | ~0.5 h | no | **KEEP, sheet** |
| O3 Burn line (simplified) | 8 | 8 (6 as written) | ~+1 s visual, under narration | ~2 h simplified (4-6 h as written) | no | **KEEP, sheet**, one per move |
| O4 Domino | 7 | 6 | 0 if on the names | ~1 h | no | reserve, treat as O2 multi-seed |
| O5 Tide | 6 | 8 | 0 (fills a static shot) | ~1 h | no | **KEEP, sheet** |
| O6 Scorch sweep | 5 | 3 | +1.4 s | ~3 h | no | DROP (touches the front lock) |
| O7 Stalled fire | 8 | 7 (5 as written) | ~2.5 s on a twist | ~1.5 h | no | reserve, round 2, no pale stage |

The shared helper (`make_flood_field.py` + `flood()` + a timing check) costs ~4-5 h once, and every kept variant reuses it.

## 3. Final pick

**Build ONE owner sheet with three variants**, all on the Atlanta captures already used in tests E2/F (jul03 -> jul10 and
jul10 -> jul22), with the re-tuned values above.

1. **O2 Ember (re-tuned)**, the candidate default for every territory change:
   `flood({ w: 0.013*1920/cam, cols: [winner, "#FF8A2A", "#FFC85A"], bandOp: 0.95, flicker: { f: 0.15, hz: 3, spatial: true }, dur: 1.2, ease: "power2.out", fillFrom: 0.7, endFade: 0.3, burst: [x, y, 16], sfx: { burst: "impact" } })`.
   Field: seed + rail x0.6 + river x3 + Gaussian sigma 12.
2. **O3 Burn line (simplified)**, the key capture of each move:
   - the same band;
   - `dur: 2.0, ease: "power2.out"`;
   - the existing `frontS` morph on the identical start/ease/duration (NO iso-line stitching);
   - field seeded from the old front + the breakthrough point; rail x0.6, river x3, ridge x1.5, sigma 16;
   - `K.impact r 20` at the breakthrough (explosion + shake 6);
   - `hit` at the stop only if nothing else lands within 0.5 s.
3. **O5 Tide**, a wide option-1 overview:
   - 4 x `K.impact r 10` along the old front (`shake: false`, sound on the first only);
   - `dur: 3.5, ease: "power2.out"`, band 1.0 % / camera scale at opacity 0.9, `endFade: 0.6`;
   - slow push 1.00 -> 1.03, no pan, no whoosh.

- **Next to them:** play the existing `sherman/build/test-video-F.mp4` as "what you liked", so the owner can judge whether we kept
  the punch.
- **Snapshots:** t+0.2 / 0.6 / 1.0 / 1.6 per variant, plus each variant shown at phone size (a 480 px-wide downscale on the sheet).
  Noticeability on a phone is the main open question.
- **Then a ~1-minute clip** (CLAUDE.md "test before applying").
- **Gate before the sheet:** measure render s/frame with `flood()` on vs off. Accept <= +10 % on the scene, otherwise move the
  draw to the THREE.js shader path.

**Drop:**
- **O1:** the test-F video already shows the loud look.
- **O6:** it changes the locked front glow and adds a third colour on option-2 close-ups.

**Reserve (not on this sheet):**
- **O4:** it becomes "O2 with several seeds" once O2 is approved; no counter.
- **O7:** round 2, with NO pale stage on a failed attack, so E2 keeps meaning "this will be lost".

**Rules for every kept variant:**
- no `whoosh` on floods;
- flicker <= 5 Hz;
- bursts after the first use `shake: false`;
- respect the mixer min gaps (`hit` 0.5 s, `impact` 0.25 s, `explosion` 0.2 s);
- flood canvases exist in the DOM only during the flood, are drawn in the lost-ground bounding box, and have the saturate filter
  baked into their pixels (no CSS filter, no SVG filter);
- no new sound files. The fire-rush bed stays an owner ask, after the visual is approved.
