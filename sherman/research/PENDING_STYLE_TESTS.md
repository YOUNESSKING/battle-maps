# Pending style tests (NOT in the style yet)

Owner 2026-10-29: liked these on the stills, but they go into STYLE_LOCK/HANDOVER only after the owner sees the FULL test in motion.

**LIKED ON STILLS, WAITING FOR THE FULL TEST (2026-10-29, Sherman #13; reference scenes in `sherman/scenes-src/test-*.js`, images `sherman/build/approve/`):**
- A1 bigger units: counters ~54 px and names ~19 px on screen (constant at any camera scale), corps counters on close-ups; the OLD
  counter look (no keyline, no dark layer). `test-A1-units.js`.
- A2 bigger labels: town labels ~36 px, story-place labels ~32 px, constant on screen; BUT they must never cover the fighting: once
  the battle starts, shrink (or fade) the labels that sit on the action. `test-A2-labels.js`.
- A4 lighter Confederate red: territory multiply colour (232,52,52) -> (240,105,95) (with E1's saturate 0.8). `test-A4-red.js`.
- B1 march maps: during a march/raid deep in enemy land, no enemy fill: own ground + the army's band coloured, a faint enemy glow
  only where the sides touch, enemy ground named by labels. `test-B1-march.js`.
- B2 overview framing: pull the overview out until both sides' ground is clearly visible (not 85 % one colour). `test-B2-frame.js`.
- B3 decision card keeps moving: lighter dim, slow camera push, arrows keep drawing, options pulse on their words (a beat every
  <= 2.5 s), and a BLACK OUTLINE on the white card text (2 px stroke + soft shadow). `test-B3-decide.js`.
- C1 the first-second stamp states the STAKES (not a date). `test-C1-stamp.js`.
- C2 hook: one big text block on screen at a time (each new card replaces the last; map labels, date, legend stay). `test-C2-onetext.js`.
- C3 last 20 s: the final-question card shrinks to the top band so YouTube end-screen elements fit; the map stays alive under
  it. `test-C3-endscreen.js`.
- REJECTED (never apply): A3 legend chips in the on-map colours (too strong), A5 dark edge on the red front band, E3 colour that
  fades away from the front, cream keylines on counters, the navy/blue day grade.
