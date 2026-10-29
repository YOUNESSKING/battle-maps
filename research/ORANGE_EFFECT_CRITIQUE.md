# The orange effect: critique of test F1 against the reference (agent 2, 2026-10-29)

Status: UNDER CONSIDERATION, not approved. This is a critique only: nothing here changes STYLE_LOCK.

Sources:
- the reference analysis (`research/ORANGE_EFFECT_ANALYSIS.md`);
- our code (`sherman/scenes-src/test-F1-ref.js`: `capture()` lines 291-306, layer calls 311-316, fronts 349 and 364);
- all 17 frames in `research/orange_frames/` (1280x720 grabs);
- STYLE_LOCK 0b (E1 tone-down and E2 paler-before-loss).

**Units.** Percentages are of the frame width. The camera scale `s` maps world px to 1920-frame px 1:1 (the whole 2880 world fits at s ≈ 0.67).
- So **world px = % x 1920 / s**.
- In capture 1, s ≈ 1.35-1.4. In capture 2, s ≈ 1.5-1.6.
- I measured our frames at 1280 px wide.

## Verdict in one paragraph
Test F1 is a **radar ring, not a fire front**:
- It is a perfect circle clipped to the lost ground.
- It is one flat #FFAA00 colour and does not flicker.
- It **accelerates** (`power1.in`) and stops dead at full speed.
- The fill behind it is low-contrast, and the front lines do not take part.

The front lines are actually the worst part:
- In capture 1 the new front is already in place before the fire reaches it, and two fronts show at once.
- In capture 2 the front **disappears completely** at the end (17.8 s and 18.2 s show no front line at all), which breaks the "every map shows the front" rule.

The burst is the closest to the reference, but it leaves a grey smoke stain on the captured ground for 2 s. **Overall: 3.4 / 10.** The good news: the clip to the real lost-ground mask and our two-colour fronts are better foundations than the reference has. The concept is sound; the execution needs a rebuild of `capture()`, not tweaks.

## Scores (against the reference)
| Item | Score | One-line reason |
|---|---|---|
| Burst | 5 | A real fireball with sound, but no white core or shock ring of the right size, and smoke stains, plus a shake of 6 px |
| Flood shape | 3 | A geometric circle that shows as separate arcs; it ignores terrain, roads and the river |
| Speed curve | 2 | `power1.in` is the exact opposite of the reference's ease-out; it has no inertia |
| Edge | 3 | 0.6 % wide, one colour (#FFAA00), no ramp, no flicker, a muddy inset glow |
| Settle / ending | 3 | It fades at full speed, with no thinning into a line and no lock beat |
| Fill behind the edge | 4 | A one-sided muted wash (rejected by the owner); the gain barely reads in capture 1 |
| Front-line handover | 2 | The front leads the fire, shows double, then vanishes (capture 2) |
| Camera | 5 | Moves during the flood but does not follow it; the scale bar jumps mid-flood |
| Sound | 3 | Only the explosion: no fire bed under the flood and no lock thump |
| Phone readability | 4 | The burst reads; the 0.6 % ring and the shrunken counters do not |
| Fit with E2 and the locked fronts | 2 | E2's paler stage is skipped entirely, and the fronts are not tied to the flood |
| **Overall** | **3.4** | |

## Frame by frame

### Capture 1: the Chattahoochee (T_GONE ≈ 5.15 s; flood 5.15-6.55 s, ring fade 6.35-6.75 s)
**4.8 s.** The pre-capture state.
- The Union ground is at full strength.
- **There is no E2 paler stage:** the strip about to change hands looks the same as the rest of the Confederate ground.
- So when the fire comes, it has nothing "doomed" to burn. It is missing a beat the owner already approved.

**5.0 s.** The burst: a K.impact fireball on the SURPRISE CROSSING marker.
- Its core radius is about 1.7 % (the reference: a ring to about 4 %).
- It is an orange disc with no white-hot centre.
- It sits on top of the "SURPRISE CROSSING" label and the Schofield counter and hides them. It is on the right event, though, which is good.

**5.2 s.** A filled orange blob of about 2.5 %. This is a fireball, not a shockwave.
- There is no expanding ring, so it does not "announce" a capture; it reads as one more shell hit.
- The flood has not visibly started (`power1.in` gives r ≈ 2 % of rmax at +0.05 s).

**5.4 s.** The ring is a thin #FFAA00 circle, about 8 px at 1280 (0.6 %), centred on the crossing.
- The inside of the ring is a brown-orange haze (the `inset` box-shadow plus smoke), which reads as a "dirty donut".
- **The new front F1 is already at the river** (created at T_GONE + 0.4 on the final jul10 points), while the old front F0 is still sliding. You see two fronts.

**5.6 s.** The ring now shows as **two separate arcs**: one top right at about (780, 185) and one bottom left at about (620, 375).
- They read as two orange "smiles", not as one fire front.
- Two fronts are fully visible: the old one in the middle of the ground, the new one along the river.
- The fill gain behind the arcs is hard to see (blue wash rgb(63,74,97) over dark relief).

**5.8 s.** The arcs are far apart (the top one at the legend, the bottom one at the river label).
- The circle is now so big that the edge sits across terrain that has already flipped. Nothing ties it to the ground.
- The Union counters slide through the zone mid-flood.

**6.0 s.**
- The bottom-left arc is the brightest it has been (8-10 px, #FFAA00 plus glow), at full speed.
- A stray orange speck sits at the top edge of the frame (≈ 885, 0).
- **The scale bar jumps from 10 KM to 5 KM** in the middle of the effect.
- Old and new fronts still overlap near Johnston.

**6.3 s.**
- An orange smudge is left on the far-left edge (≈ 120, 430): the ring fading at full speed.
- A **dark smoke stain** sits above Schofield (≈ 700, 250). It is K.impact's 4 smoke puffs (life 2.4 s), sitting on brand-new Union ground.

**6.6 s and 7.0 s.** Settled.
- The new front is correct and locked-style. The fill is fine but low in contrast.
- The smoke stain is still visible at 7.0 s.
- There is no lock beat: nothing marks "this ground is now Union".

### Capture 2: the advance on Atlanta (L2M ≈ 16.65 s; flood 16.65-18.05 s)
**16.2 s.** The pre-state. Again **no E2 paler stage** on the ground that is about to fall.

**16.5 s.** The burst: the best frame of the test.
- A bright orange core with a yellow glow, radius about 3 % with glow, so close to the reference size.
- **But it is on unnamed ground** between Thomas and Johnston (world 1440, 478). Nothing tells the viewer what was taken.
- The reference bursts on a **named town pin**, then pops its flag.

**16.8 s.**
- The ring is a 0.6 % #FFAA00 circle, partly clipped (a "C" shape).
- Its centre is a **brown smoke smudge** with an orange inset haze.
- The river label and the CS flag dim at the same moment, which is fine.

**17.1 s.** The worst frame for the front.
- The ring is a big arc (≈ 640-800 px) heading to Decatur, and the fill has reached x ≈ 790.
- **The front is still back near Thomas**, about 200 px behind the fire.
- The counters are shrunk to 0.4 scale (about 12 px tall: unreadable on a phone).
- A US flag pops on top of the Thomas counter.
- The grey smoke stain is at (600, 245).

**17.4 s.**
- The ring is at the right edge, partly behind the HOOD card (≈ 960, 0-330). It competes with the card.
- **The front has faded to a faint pink line** (F1 `until` = T_ONCE + 0.6).

**17.8 s and 18.2 s.**
- The flood is done, and **there is no front line anywhere on screen**. This breaks the rule.
- The smoke stain is still at (610, 190).
- The gain itself reads well here (a big blue bulge to Decatur).

## What is already better than the reference (keep it)
1. **Clipping to the real lost-ground mask.** The flood stops exactly on the historical line. The reference's wave is organic but approximate. Keep the mask as the hard outer limit of any new field.
2. **Our locked two-colour fronts.**
   - The reference ends on a single red 3 px line (or a dashed yellow line).
   - Ours shows both sides and their glow, and it reads better on a phone.
   - **Do not copy the reference's dashed-yellow or solid-red line.**
3. **Pace.** The reference's 4.5-5.5 s region floods would drag under our narration ("something new every 2-4 s"). Our short timing is closer to right. It needs the right curve, not 5 s.
4. **The burst on the crossing marker** (capture 1) is tied to the narrated event. The reference sometimes bursts on a pin with no on-screen story.
5. **Relief stays visible under the fill** (multiply layers). The reference needs a darker settle (#4A1010) to get the same effect. With E1 we already have it.

## Fixes (exact numbers)

### 1. Order of events (one capture = 3.0-4.0 s, all relative to the capture cue t0)
| Time | Event |
|---|---|
| t0 - 1.3 → t0 | **E2 unchanged:** the lost layer (`lostR_mx`) fades to 40 % opacity, `sine.inOut` |
| t0 | Burst (fix 2) + SFX |
| t0 + 0.35 | Town label / flag pop: scale 1.2 → 1.0 over 0.2 s, `back.out(2)`, `SFX("ref:pop")` |
| t0 + 0.45 | Flood starts: progress p 0 → 1 over D, `power3.out` (fixes 3-5) |
| t0 + 0.45 + D | Edge stops; settle (fix 6); new front lands (fix 7) |

- **D = 2.0 s** for a local capture (capture 1, the river strip).
- **D = 3.0 s** for a regional one (capture 2, to Decatur).
- Never more than 3.5 s.

This *replaces* E2's plain 1.0 s cross-fade with the flood for the moment of loss. That is a change to a locked item, so it needs the owner's explicit OK as part of approving this effect. Show both side by side.

### 2. Burst (replace `K.impact(x, y, t - 0.15, { r: 24, puffs: 4 })`)
**Shock ring:**
- Its radius goes 0 → **4.0 %** (77 / s world px) in **0.40 s**, `expo.out`.
- Stroke: 1.0 % at the start, thinning to 0.3 %.
- Colour: #FFCC00 with an outer glow of #FF4500 at 60 %, blur 0.8 %.
- Opacity: 1 → 0 over the last 0.25 s.

**Core:**
- A radial gradient: #FFFFFF 0 % → #FFCC00 35 % → #FF4500 65 % → transparent 100 %.
- Radius 1.8 %, held for 0.12 s, then scaled to 1.4x and faded over 0.30 s.

**Flash:** a local (not full-frame) radial #FFF6C8, radius 12 %, `mix-blend-mode: screen`, opacity 0.35 for **2 frames**. It is not a white-out, so it stays clear of the hook's "no white flash" rule.

**Smoke:** **0 puffs**, or 2 puffs with life ≤ 0.8 s. The 2.4 s stains at 6.3-7.0 s and 17.1-18.2 s must go.

**Shake:** 2 px for 0.2 s, or none. The reference has none; K.impact's r ≥ 20 gives 6 px. This is not a bombing run, so the `K.bombRun` shake lock does not apply.

**Placement:**
- Always on a **named** place: a town pin or the event marker.
- Offset the burst 0.6 % off the label so the text is never covered (capture 1 hid SURPRISE CROSSING).
- Capture 2: move it from world (1440, 478) to the Peachtree Creek / Decatur pin and show its label.

### 3. Flood shape: an arrival-time field instead of a circle
New tool, `sherman/tools/make_flood_field.py` (Sonnet task):
- **Inputs:** the lost mask PNG, the town xy, the DEM slope from the HD bake, and the LN roads, rails and rivers.
- **Method:** fast marching (`scikit-fmm`) from the town, limited to the lost mask.
- **Speed (relative):**
  - base 1.0;
  - **1.4** within 20 world px of a rail or road;
  - **0.6** where slope is above the 70th percentile;
  - **0.35** across a major river, unless the capture *is* that crossing (then 1.0).
- **Noise:** multiply the arrival time by 1 ± 0.06 (2-octave value noise, 120 and 40 world-px cells), so the edge is organic and not a polygon offset.
- **Output:** arrival time T normalised to 0..1, written as a **16-bit PNG**. 8-bit shows 1-step banding over 90 frames.

In the scene, a `<canvas>` (2880x1620 at half resolution, 1440x810, scaled 2x; the band is soft anyway) is redrawn from the timeline:
`tl.to(st, { p: 1, duration: D, ease: "power3.out", onUpdate: draw })`. This keeps it deterministic.
- For each pixel inside the lost bounding box, d = p − T.
- **Fill alpha** = clamp(d / 0.012, 0, 1). This is crisp: about 0.5 % feather, against the current FE = 60 world px ≈ 4 % mush.
- **Band** = where 0 ≤ d ≤ w_T. Colour it from the ramp in fix 5, using d / w_T as the lookup.
- Pick w_T so the band is **2.2 % wide on screen** where it is moving at mid-speed. Measure it once on a test frame: if the median band is too thin, raise w_T.

### 4. Speed curve
- Use `power3.out`, which is close to the reference's cubic-bezier(0.2, 0.8, 0.2, 1). A CustomEase is not needed. **Never `power1.in`.**
- Because the field is time-of-arrival, the far corners fill last and slowest. That is the "inertia over rough ground" the reference has, for free.
- **Capture 2, multi-town (optional):** pulse up to 3 towns 0.3 s apart (fix 2 at 60 % size), then one field seeded from all of them with start offsets of 0 / 0.3 / 0.6 s.

### 5. Edge: band width, colour ramp, flicker
**Band, from the fill outward (direction of travel):**

| Layer | Width | Colour | Note |
|---|---|---|---|
| Char line | 0.3 % | #3A0E06 at 60 % | Stops Union blue from mixing with orange into grey |
| Ember | 0.7 % | #C4300A | |
| Orange | 0.6 % | #FF5A00 | |
| Gold | 0.4 % | #FFD200 | |
| White-hot rim | 0.2 % | #FFF6C8 | |

- **Total: 2.2 %** (42 px on 1920; about 9 px on a 390 px phone, against today's 2.4 px).
- **Outer glow:** #FF6B00 at 35 %, blur 1.2 %, `screen` blend.
- Use the same ramp for both sides. On a Confederate gain the ember blends into the red fill naturally.

**Flicker (deterministic):**
- Band opacity = 0.88 + 0.12 x sin(2π·12·t) x sin(2π·3.1·t + 1).
- Band width x (1 + 0.08 x sin(2π·7.3·t + x·0.01)).
- No particles. Stay at or below 12-13 Hz: H.264 smears anything faster into grey on a phone.

**Drop the `inset` box-shadow.** It is the cause of the dirty orange haze inside the ring.

**Keep the band clear of the HUD:**
- Mask the band out under the HUD cards (legend, the HOOD card, the caption bar), with a 1 % margin.
- Or keep captures at least 15 % from a card. At 17.4 s the band runs behind the HOOD card.

### 6. Settle and ending
1. **The edge stops at p = 1.**
2. **Over 0.6 s (`power2.in`):**
   - the band shrinks from 2.2 % to 0.5 %;
   - its opacity goes 1 → 0;
   - the rim fades first: hold the white rim 0.1 s, then fade it over 0.2 s.
3. **The fill settles:** trail a warm afterglow behind the edge. Use #FF5A00 at 22 % `screen`, which decays over 0.8 s per pixel (alpha x clamp(1 − (p − T) / 0.25)).
   - Then the fill is exactly the locked multiply layer.
   - **No darkening and no saturation change (E1).**
4. **The flood layer and the final layer must be pixel-identical** at the hand-off. They look seamless now (6.6 vs 7.0 s): keep the `fl()` swap at t0 + 0.45 + D + 0.6, after the band is gone.

### 7. Front-line handover (the biggest fix)
- **The old front is burned away, not slid.** Mask the old `frontS` with the inverse fill alpha from fix 3, so it disappears exactly where the edge passes.
  - Delete the `to:` / `moveT` morph during a capture.
  - Never create the new front on its final points before the flood (the F1 at T_GONE + 0.4 bug).
- **The new front is laid by the fire.**
  - `frontS` on the new points, draw-on from the end nearest the town outward, over 0.5 s `power2.out`.
  - It starts at t0 + 0.45 + D − 0.3, so it rises out of the dying band.
  - Locked width 15 / s and glow 0.47, unchanged.
- **Capture 2 bug:** F1 `until: T_ONCE + 0.6` leaves no front at all from about 17.5 s on.
  - Any front's `until` must be ≥ the next front's start + 0.3.
  - Add the jul22 front at the time above.
- **Do not use** the reference's dashed-yellow then solid-red line. Our two-colour front *is* the "perimeter line" the reference fades into.

### 8. Camera
Inside the window t0 → t0 + 0.45 + D + 0.6:
- **Only one camera move:**
  - push-in **1.05x**, `power2.out`, over D + 0.45;
  - pan from the town toward the lost area's centroid, by **25-30 %** of that distance.
- No other `B.camera` key may fall inside the window. Today the keys at T_GONE + 0.8 and T_ONCE − 0.4 fight the flood.
- **Freeze the scale bar** during the window (`LV.scaleBar` must not change step): the 10 KM → 5 KM jump at 6.0 s.
- Frame the shot so the **whole lost area is in view at p = 0.6**. The reference pans to keep the edge on screen; at 6.0 s ours sends the arc off the left edge.
- Units: do not shrink counters during a capture (capture 2 uses 0.4x, about 12 px). Use a minimum of 0.7x, or move them after the settle.

### 9. Sound (test with `assemble_full.py --audio-only`, owner approval before anything touches the lock)
| When | Sound | Level |
|---|---|---|
| t0 | Burst: keep the locked `explosion` (it reads as the reference's sub-boom) | As locked |
| t0 + 0.45 → +D | **New fire bed**: low rush / burning-paper, fade in 0.15 s, fade out over the last 0.4 s | −24 dB (under narration and music) |
| p = 1 | **Lock thump**: the locked `impact` | −26 dB |

- Fire bed, two candidates for the owner:
  - (a) `zoom_whoosh.wav` low-passed at 400 Hz and stretched to D;
  - (b) one new "fire whoosh" file from the sound agent.
- New SFX keys: `ref:fire` and `ref:lock`.
- Re-run `tools/check_sound_lock.py`: the new keys must not change the locked files.

### 10. Phone readability checklist (check at 390 px wide)
- Band ≥ 8 px on the phone (2.2 % ✓ with fix 5). Burst ring ≥ 15 px (4 % ✓).
- The captured town label stays on screen for ≥ 1.5 s after the settle.
- No smoke stain: it reads as dirt at phone size.
- At most **one** capture effect on screen at a time, and **no more than 2 captures per minute**. More than that and it stops being special.

## Fit with E2 and the locked fronts (summary)
- **E2:** the paler stage must come back (t0 − 1.3 s, lost ground → 40 %). It is the best possible set-up for the effect: the orange edge then burns across pale, "doomed" ground, and the strong new colour behind it reads as the result. The flood replaces only E2's 1.0 s cross-fade. That needs the owner's OK because E2 is locked.
- **E1:** the fill is the locked multiply layer with saturate 0.8, A4 red. **No 70 % → darker settle, no hatching, no sepia, no one-sided wash.** The test F1 one-sided wash was rejected by the owner.
- **Fronts:** unchanged look (width 15 / s, glow 0.47, two colours). Only the timing changes: burned away under the edge, laid when the edge dies.
- **Territory option 2** (close-ups with glowing fronts only, no territory colour): **no flood.** There is no fill to flood. Use the burst plus the front draw-on only.
