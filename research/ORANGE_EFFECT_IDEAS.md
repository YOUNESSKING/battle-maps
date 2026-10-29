# The orange effect: 7 buildable variants for OUR style (IDEAS, UNDER CONSIDERATION, not approved)

Written by the ideas agent, 2026-10-29. Inputs: `ORANGE_EFFECT_ANALYSIS.md` (reference recipe + test F),
`CONSIDERING.md`, STYLE_LOCK 0b (lifted map, E1 saturate 0.8, E2 pale-before-loss LOCKED), `test-F1-ref.js` (`capture`),
`test-E2-lose.js` (`lay` / `loss`), frames `research/orange_frames/`.
Nothing here goes into a real video until the owner picks one (CONSIDERING.md rule).

## 0. What test F got wrong (from the frames), and the rules every variant keeps

What the frames show (F1_5.4, F1_17.1):
- **The ring is a perfect circle clipped to the lost ground.** In 17.1 it shows as a big floating yellow arc that cuts across hills
  and roads. It does not "eat" the ground, so the reference's best quality (it follows the terrain) is missing.
- **The speed is wrong.** The flood uses ease-in (`power1.in`): it starts slow and then slams. The reference is fast first, then eases out.
- **The edge is a single #FFAA00 stroke** (9 px, plus a box-shadow). It looks like a UI ring, not a burning edge.
- **Nothing ties the edge to the front.** The edge stops in empty space, and the front line moves separately.
- **It replaced E2.** Test F had no pale-first stage, and E2 is locked.

Rules every variant below keeps:
1. **E2 comes first and is never skipped.** On the narration cue, the doomed ground fades to 40 % over ~1.3 s (`loss` helper).
   The orange effect only replaces E2's second half: the plain 1 s cross-fade to the winner's colour becomes the flood.
   This reads well: the ground "drains" (pale), then the winner "burns in". The pale ground is also the fuse: the viewer already
   knows where the fire will run.
2. **E1 / never stronger colour.**
   - The fill behind the edge is the normal `_mx` multiply layer (`saturate(0.8)`, A4 red (240,105,95)).
   - It may enter LIGHTER (opacity 0.7 -> 1.0) but never darker or more saturated than its final state. The reference's
     "settle darker #4A1010" is dropped.
   - The orange lives ONLY in the moving edge band, and the band is gone within 0.4-0.8 s of stopping.
3. **The fronts never change.** `K.front` / `frontS`: blue Union / red Confederate, width 15, glow 0.47.
   - The band is drawn UNDER the overlay (`WORLD.insertBefore(band, overlay)`), so fronts, units and labels stay on top.
   - Test F's three-layer `frontF` is not used.
4. **Sound comes from the locked kit only.**
   - Locked kinds: `impact`, `explosion`, `hit`, `whoosh`, `tick`, `fire`, `mortar`.
   - Frontlines sound-design kinds (`ref:boom`, `ref:whoosh`, `ref:pop`, `ref:riser`) only work where the skeleton's assembler
     mixes them (`assemble_dday.py`); they are silent in the Rokossovsky skeleton (HANDOVER #7 lesson 6).
   - The reference's "sizzle / burning paper" bed would be a NEW file: not proposed without approval. It is listed as an optional
     ask in section 9.
5. **Burst = the locked `K.impact`.** It already gives the white-orange fire, ring, smoke, shake and the `impact`/`explosion` SFX.
   No new burst art: only size and timing are tuned per variant.
6. **On-screen sizes are constant.** Divide every band width by the camera scale at that moment, the same way `frontS` handles its
   width (width = 15 / camera scale).

## 1. Shared building block (all variants reuse it): the arrival-time field

The fix for "circle vs ground" is to bake, offline, **when each pixel of the lost ground gets captured** (an arrival-time map).
At render time, the flood is just a moving threshold on that map. That one map gives every shape the variants need: a circle,
following roads, stalling on rivers, several towns at once, or a whole front rolling.

**Bake: `sherman/tools/make_flood_field.py` (new tool, ~60 lines; scipy and scikit-image 0.26 are installed)**
- **Inputs:**
  - `<prefix>_<before>_mx.png` and `<after>_mx.png`. The lost mask is computed exactly like `make_loss_layers.py`: red->blue or blue->red.
  - one or more seeds `x,y[,delay_s]`: the captured towns, in world px.
  - optional speed modifiers:
    - roads/rails polylines (cost x0.5 = faster);
    - `<map>_rivers.json` (cost x3 within 6 px = the edge slows and bunches at a river; a river is never crossed before its bridge town
      if a seed sits there);
    - steep slope from the DEM (cost x1.5).
- **Method:** `skimage.graph.MCP_Geometric(cost)` with cost = inf outside the lost ground, multi-source.
  - Arrival time = min over seeds of (delay_i + geodesic distance_i).
  - Normalise to 0..1, write `<prefix>_<before>_<after>_field.png` as 8-bit grey (0 = first, 255 = last; alpha 0 outside the lost ground).
    256 steps over 1-5 s is smooth enough.
  - Also print the last-arrival point. That is where the camera should end and where the "lock" thump goes.

**Render: a `flood()` helper (canvas, deterministic on seek; the same pattern as `lib/flyover.js`, which already reads ImageData)**
- **Setup:** load `field.png`, `test_E2_<after>_lostB_mx.png` and `test_E2_<before>_lostR_mx.png` once into ImageData, at HALF
  resolution (1440x810, then CSS-scaled to 2880x1620). This is ~1.2 M px per frame, a few ms.
- **Three canvases per capture, all inserted before `#overlay`:**
  1. `fillC`: lostB pixels x a(T), `mix-blend-mode: multiply`, class `terr` so `saturate(0.8)` applies.
  2. `paleC`: lostR pixels x 0.4 x (1 - a(T)). It replaces E2's own fade-out of R, so the pale ground is eaten by the edge rather
     than cross-faded.
  3. `bandC`: the colour ramp by u = (s - T) / w, `mix-blend-mode: screen`. It is transparent where u<0 or u>1.
- **Formulas:** a(T) = smoothstep(s - feather, s, T) is the reveal. s = the animated progress (GSAP tween on `{s}` with
  `onUpdate: draw`).
- **Speed curve:** set by the GSAP ease on s (the reference's `cubic-bezier(0.2,0.8,0.2,1)` ~ `power3.out`). The field stays linear.
- **Flicker:** multiply band alpha by `1 - f * (0.5 + 0.5*sin(2*pi*hz*time + 13*T))`. The T term makes the shimmer travel along the
  edge instead of blinking as a whole. It uses timeline time, not `Date`, so renders are reproducible.
- **Signature:**
  `flood({ before, after, field, t, dur, ease, w, cols, flicker:{f,hz}, fillFrom:0.7, endFade:0.5, burst:[x,y,r], sfx:{...} })`.
- **Fallback if canvas is too slow on 4K bakes:** an SVG filter chain
  (`feImage(field)` -> `feColorMatrix` luminance->alpha -> `feComponentTransfer` alpha `linear slope=-k intercept=k*s`, with the
  intercept animated by GSAP `attr`) used as a mask on the lostB image. Two transfer tables give the band.

The circle from test F stays available: a field from one seed with flat cost is a circle clipped to the ground. So O1-O7 differ
only in the field, the curve, the band, the sound and the camera.

## 2. O1, "Reference" (faithful copy, for comparison only)

**What the viewer sees (t = the narration word of the capture):**
- **t-1.3 to t: E2 pale.** The doomed ground fades to 40 % (locked).
- **t+0.00: burst.** `K.impact(x, y, t, { r: 34, puffs: 4 })`: white core, orange ring out to ~4 % of the frame in 0.4 s, default
  shake 6, plus a 1-frame white flash (a full-frame `#fff` div at opacity 0.18 for 1/30 s).
- **t+0.35: the flag chip / unit counter pops** (scale 1.2 -> 1, 0.2 s).
- **t+0.5 to t+2.5: flood, two-stage.** A local bubble for the first ~25 % (seed-only field, flat cost within 120 px), then
  terrain-following over the rest of the lost ground. Ease `power3.out`, 2.0 s for a local capture (4.5 s for a region, see O5).
- **Edge band:**
  - Width 2 % of frame width (= 38 px on the 1920 output, / camera scale).
  - Colours from inside to outside: winner colour -> #FF5A00 -> #FFD200 -> rim #FFF6C8.
  - Flicker f 0.25 at 13 Hz.
- **t+2.5 to t+3.0: the end.** The band thins to 40 % width while fading. The new front (`frontS` morph, moveT = t+0.5,
  moveDur = 2.0) is already at the new line.
- **Sound:**
  - `explosion` at t (via K.impact r >= 20);
  - `whoosh` at t+0.5 (the rush under the wave);
  - `hit` at t+2.5 (the lock thump);
  - optional `ref:boom` at t on Frontlines-mix skeletons.
- **Camera:** a slight push-in (B.cam scale x1.05 over the flood), panning to follow the field's centroid.

**Retention:** the full four-beat layering (pulse, fire front, fill, line) is what vidIQ says makes it satisfying. It has the most
"event" per second.

**Risk:**
- It is the loudest version. The #FFD200 / #FFF6C8 rim on our lifted grey-green map reads brighter than anything else on screen,
  and the owner dislikes stronger colour.
- Gold next to the red Confederate front can blur the red/orange distinction.
- It is the version most likely to look like "the other channel".

**Build:** `flood()` with the values above. The field gets the seed + roads + rivers. Tune `w` per camera scale. ~1 hour from test F.

## 3. O2, "Ember" (the subtle version; my default pick)

**What the viewer sees:**
- **t-1.3 to t: E2 pale** (unchanged).
- **t: a small burst.** `K.impact(x, y, t, { r: 16, puffs: 3 })` (the size of a normal map hit, shake 3).
- **t+0.15 to t+1.35: the flood.** It follows the ground (seed + roads). 1.2 s with `power2.out`: about 60 % of the ground is
  covered in the first 0.4 s, then it glides.
- **Edge band:** narrow, 0.8 % of the frame (~15 px on screen, the same width as our front so they look like family).
  - Colours, muted and warm: winner colour -> #D9822B (burnt orange) -> #F2C27A (pale amber). No white rim.
  - Band opacity 0.75 with screen blend. No flicker: one slow 4 Hz breath (f 0.12).
- **The fill** enters at 0.7 and reaches 1.0 by t+1.8. It never overshoots.
- **t+1.35 to t+1.75: the end.** The band fades out where it stopped; the front sits on that edge.
- **Sound:** `impact` at t, `whoosh` at t+0.15. No lock thump; the next beat carries on.
- **Camera:** no extra move; it rides whatever push the shot already has.

**Retention:** it still gives the "something just happened here" beat every capture (a new event inside the 2-4 s rhythm), without
pulling the eye off the units. Because it is cheap and quiet, it can be used on EVERY territory change in a video. A loud O1 can
only be used 2-3 times before it tires.

**Risk:**
- It may be too quiet to notice on a phone. If so, raise the band opacity to 0.9 before making it wider.
- Burnt orange against A4 red is close: always check a Confederate-gain frame.

**Build:** `flood({ w: 15, cols: [winner, "#D9822B", "#F2C27A"], flicker: { f: 0.12, hz: 4 }, dur: 1.2, ease: "power2.out", fillFrom: 0.7, endFade: 0.4 })`.

## 4. O3, "Burn line" (follows the REAL lost ground; the front is the edge)

The point is that the orange edge IS the front moving. There are no longer two separate things (a flood plus a front morph).

**What the viewer sees:**
- **t-1.3 to t: E2 pale.**
- **t: burst** at the breakthrough point (where the attack actually broke in, which may not be a town). `K.impact r 20`.
- **t+0.2 to t+2.4: the edge advances along the real geography.** The field is built with roads/rails (fast tongues of fire running
  down the pike and the railroad), rivers (the edge bunches and slows at the Chattahoochee, then jumps at the bridge if a seed has
  a delay there) and hills (slower on ridges). The shape on screen is irregular and organic, never a circle.
- **The front follows the edge.** The `frontS` path is re-sampled each frame from the field's iso-line at value s:
  - bake 12 iso-lines in the bake step (`skimage.measure.find_contours(field, level)`, simplified to ~40 points, resampled to the
    same point count as the front's `pts`);
  - store them in JSON;
  - tween the front's `d` through them with GSAP (`attr: { d }` keyframes).
  - So the blue/red glowing front literally rides the burning edge, and the orange band sits just behind it, on the winner's side.
- **Edge band:** 1.2 % of the frame, winner colour -> #FF6A1A -> #FFC060. Flicker f 0.18 at 12 Hz, phase travelling along T.
- **t+2.4 to t+3.0: the end.** The band fades out; the front stops at its final `pts` (the last iso-line = the real new front).
- **Sound:**
  - `impact` at t;
  - `whoosh` at t+0.2;
  - `tick` each time the edge passes a named town (from the field: T at the town's pixel x dur);
  - `hit` at the stop.
- **Camera:** pan to follow the moving front's midpoint; settle on the last-arrival point.

**Retention:** this is the strongest storytelling version. The viewer SEES why the ground fell (the road was the highway in, the river
held them). It also gives a natural micro-beat every time the edge reaches a town label (ticks + A2 label shrink/fade).

**Risk:**
- It needs a correct new front at the end. The last iso-line must match `atlanta_ctl_<after>`, which it does by construction because
  the field covers exactly the lost ground.
- Morphing the front's `d` between iso-lines with different topology (islands, pockets) can jitter. Drop islands smaller than 2 % of
  the lost area in the bake and use only the main contour.
- It is the heaviest to build (bake + contour JSON).

**Build:** `make_flood_field.py ... --roads --rivers --isolines 12`, then `flood()` + `frontS({ pts: iso[0], ... })` + a keyframe
tween of `d` over `iso[1..11]` with the same ease as s.

## 5. O4, "Domino" (several towns, staggered captures)

For narration like "Cádiz, Jerez, Algeciras fell in a single afternoon" or "Decatur, then Jonesboro, then Lovejoy's Station".

**What the viewer sees:**
- **t-1.3 to t: E2 pale on the WHOLE area that will fall** (one pale stage, not one per town; it tells the viewer the scale up front).
- **t, t+0.35, t+0.7, ...: the towns burst one after the other**, on their names if the narration lists them, otherwise every 0.3-0.4 s.
  - Use `K.impact` r 14 for the small towns. The last or biggest gets r 22.
  - Each label does the A2 move (shrinks to the old small size or fades) the moment it is hit.
- **From each burst, a local pocket grows**, and the pockets join along the road between them. This is a multi-source field with
  delays = burst times and road cost x0.4: you see a corridor of fire link the towns, then the pockets fill out sideways.
- **Duration:** first burst to full cover = (n-1) x 0.35 + 1.6 s, with ease `power2.out` on each pocket. Run s as linear time and
  build the per-seed easing into the field: field = delay + ease^-1(distance).
- **Edge band:** O2 values (narrow, muted) so that 3-5 simultaneous fronts do not turn the map orange.
- **Optional counter:** the K.counter style top-right, "TOWNS TAKEN 1 / 2 / 3" ticking on each burst.
- **The end:** one fade of all bands 0.4 s after the last pocket closes.
- **Sound:** `impact` on the first burst; `hit` on each later burst (lighter than 4 impacts); one `whoosh` under the corridor; `tick`
  per counter step.
- **Camera:** pull out slightly (0.92x) across the sequence so the last town is in frame; this is the reference's Seville -> coast move.

**Retention:** the rhythm is the hook. 3-5 hits in ~1.5 s is the "something new every 2-4 s" rule compressed into a burst, and the
counter gives a number to read.

**Risk:**
- It gets busy with unit counters nearby, so hide or shrink the labels as A2 says.
- Four orange fronts at once need the muted band, or the map turns orange.
- Narration timing: the bursts must sit on the spoken names (`B.at(para, "Jonesboro")`), or it feels random.

**Build:** `make_flood_field.py ... --seed x1,y1,0 --seed x2,y2,0.35 --seed x3,y3,0.7 --roads`, then `flood({ dur: total, ease: "none" })`.
The bursts are a `forEach` over the seeds with `K.impact` and `SFX("hit")`.

## 6. O5, "Tide" (wide theatre map, option 1 territory)

For the overview shots: a whole region changes hands over a period (e.g. Atlanta to Savannah, or the Union gain from July to September).

**What the viewer sees:**
- **E2 pale, 1.3 s,** over the whole lost region.
- **The burst is not a town hit** but a line of 3-5 small `K.impact` r 10 along the OLD front, 0.12 s apart. They read as "the front
  breaks" at theatre scale. A single big town burst looks tiny on a wide map.
- **The flood rolls from the whole old front at once:** a multi-source field where every point of the old front line is a seed,
  plus roads x0.6. It moves like a tide across the region and finishes at the new front.
  - Duration 3.5-4.5 s, ease `power3.out`: half the ground is covered in the first second, then a long glide that leaves room for
    narration.
  - It can be paired with the date card changing (the date flips on the burst).
- **Edge band:** wide in world px, but kept at ~1.2 % of the frame on screen (divide by the low camera scale!). Muted colours (O2
  values). Flicker f 0.12 at 8 Hz.
- **The end:** the band fades over 0.8 s; the option-1 date layer for the new date takes over (identical pixels, a set swap like `loss`).
- **Sound:** `impact` x1 at the first burst, `whoosh` at the flood start (`ref:whoosh` on Frontlines-mix skeletons), `hit` when the
  date card lands. No sound per small burst.
- **Camera:** the B2 framing (both sides clearly visible), a slow push 1.00 -> 1.04 during the flood, never a pan (wide shots stay
  readable).

**Retention:** wide overview shots are where the map is most static and viewers drift. A 4 s tide gives the overview a moving thing to
follow while the narrator explains months of campaign. It replaces the plain 1 s cross-fade, which happens almost unseen.

**Risk:**
- The band at low camera scale can look like a thin hairline, or (if the world width is not divided) a fat orange river. Always
  compute width / camera scale.
- Big lost areas with holes (pockets still held) need the field's inf-cost outside, so the holes stay the old colour.
- 4 s is long if the narration is short: tie the duration to the paragraph gap.

**Build:** `make_flood_field.py ... --seed-line old_front.json --roads`, then
`flood({ dur: 4, ease: "power3.out", w: 22 / camScale })`. The old front's points come from the scene's existing front data.

## 7. O6, "Scorch sweep" (close-up battle, option 2: fronts only, no fill)

On close-ups there is NO territory fill to flood (STYLE_LOCK 2a option 2: only the two-colour glowing fronts). So the orange effect
there must not paint ground. It becomes a burning SWEEP that travels with the front and leaves nothing behind.

**What the viewer sees:**
- **E2 has no fill to pale on a close-up.** Instead the pale stage is the losing side's front glow dimming: K.front glow opacity
  0.47 -> 0.30 over 1.3 s on the cue. Never thinner; only less glow; width 15 is kept. **This needs an owner check, because it
  touches front styling (see risk).**
- **t: burst** on the strongpoint/town, `K.impact r 20` (shake 6).
- **t+0.15 to t+1.5: a band-only sweep.** The `bandC` canvas from the field (lost ground between the old and new front) shows ONLY
  the band (u in 0..1); behind it the ground returns to the plain map.
  - A faint warm afterglow (#FF8A3D at 10 % opacity, screen blend) lingers 0.6 s behind the band, then fades: "scorched".
  - Fire puffs: 2-3 `fireGlow` (from test F) at the places the band passes, for 2 s.
- **The front** morphs with the band, as in O3 (iso-line keyframes), so the winner's coloured front visibly pushes through.
- **Edge band:** 1 % of the frame, #FF5A00 -> #FFB347 (no winner colour, since there is no fill to blend into). Flicker f 0.2 at 12 Hz.
- **Sound:** `explosion` at t (via r >= 20), `mg` or `fire` under the sweep if troops are fighting there (locked kinds), `hit` at the stop.
- **Camera:** a small push-in 1.03 on the burst, a slight drift with the sweep.

**Retention:** close-ups are the action beats. A fire front sweeping the exact ground where the counters fight makes the advance
physical. Because it leaves no fill, it never breaks option 2's clean look.

**Risk:**
- Dimming the losing front's glow is a front-style change. If the owner says no, skip the pale stage on close-ups and keep a
  pure sweep: E2 stays the rule on option-1 shots only.
- Orange directly against the red front: keep the band on the WINNER's side of the front (u measured from the field, not from the line).

**Build:** `flood({ fill: false, pale: false, afterglow: { col: "#FF8A3D", op: 0.1, len: 0.6 } })` with the band only, plus the O3
front morph. The field is clipped to the strip between the old and new fronts (polygon from the two `pts` lists, rasterised in the bake).

## 8. O7, "Stalled fire" (a failed attack: the flood stops and dies)

Every flood so far is a success. Half our stories are about attacks that FAILED (Kennesaw, Peachtree Creek), so this is the same
effect used as a twist.

**What the viewer sees:**
- **E2 pale on the ground the attacker WANTED** (the narration sets it up as at stake).
- **Burst + flood starts as O2.** It runs fast toward the objective along the road.
- **At ~40-60 % it hits the river/ridge** (the field's slow cost there).
  - The edge bunches, the flicker doubles (f 0.35, as if fighting), and the defender's `K.impact` hits land ON the edge (2-3 hits,
    0.3 s apart).
- **The flood reverses:** s tweens back to ~0.15 over 0.8 s with `power2.in`. The band fades to 0 as it recedes.
- **The pale ground returns** to full colour (the E2 pale layer back to 1.0): the defender kept it.
- **A stamp** ("REPULSED" / the casualty number) slams in on the stop.
- **Sound:** `impact` at the burst, `whoosh` on the advance, `hit` x2-3 on the defender's hits, `hit` + shake on the stamp.
- **Camera:** push toward the stall point, hold.

**Retention:** a pattern break. After 2-3 successful floods the viewer expects the fire to win. Watching it stall at the river is the
twist shown as action, which the hook lock (1a) asks for.

**Risk:**
- It only works if the viewer has seen the effect succeed earlier in the video.
- E2 says "pale = will be lost". A pale that comes back must be clearly the attacker's hope, not a mistake: use it only when the
  narration says "they meant to take X".

**Build:** the same `flood()`, with a two-segment GSAP timeline on s (forward `power3.out` to 0.55, hold 0.4 s, back `power2.in`),
plus E2's lostR tween back to 1.0 on the reverse.

## 9. Comparison, recommendation, and the asks

| Variant | Shape | Duration | Band (on screen) | Loudness | Use |
|---|---|---|---|---|---|
| O1 Reference | bubble then terrain | 2.0-2.5 s | 2 %, 4 colours + white rim, 13 Hz | high | test only |
| O2 Ember | terrain (seed + roads) | 1.2 s | 0.8 %, muted, 4 Hz breath | low | every capture |
| O3 Burn line | real geography + front rides the edge | 2.2 s | 1.2 %, 12 Hz | medium | the key capture of each move |
| O4 Domino | multi-seed + road corridor | 1.5-3 s | O2 muted | medium (rhythm) | listed towns |
| O5 Tide | the whole old front as seed | 3.5-4.5 s | ~1.2 % (/ cam scale), muted | low-medium | option-1 wide overview |
| O6 Scorch sweep | band only, no fill | 1.4 s | 1 %, orange-amber | medium | option-2 close-ups |
| O7 Stalled fire | flood out, then back | ~2.5 s | O2, then doubled flicker | medium | failed attacks / twist |

**Recommendation:**
- **Build one test sheet** on the Atlanta jul03 -> jul10 / jul10 -> jul22 captures already in test F, with three of the variants:
  - **O2** as the default for every territory change;
  - **O3** for the one key capture per move;
  - **O5** for the wide overview.
- Add O6 if the video has an option-2 close-up capture.
- Keep O1 only as the side-by-side reference, so the owner can see we toned it down on purpose.
- Show it as snapshots at t+0.2 / 0.6 / 1.0 / 1.6 plus a 1-minute clip (CLAUDE.md "test before applying").
- Sound-only tuning afterwards: `assemble_full.py --audio-only`.

**Asks for the owner (later, only if they want more):**
1. A soft "fire rush / burning paper" bed under the advance, like the reference. This is a NEW sound file, so it needs approval first.
2. O6's dim-the-losing-front's-glow pale stage on close-ups (a front-style change).
3. Whether the effect may appear in the hook (an O4 domino or an O3 burn line is a strong first-6-seconds action).
