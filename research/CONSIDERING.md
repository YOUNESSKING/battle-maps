# Under consideration (NOT in the rules)

Ideas the owner likes but has NOT approved for STYLE_LOCK / HANDOVER. Never apply them to a real video until the owner says so.

## The orange effect (owner 2026-10-29)
The territory-capture effect from the reference video (YouTube H2xV6FnbSkQ, 10:12-12:40): a burst on the place, then the new
owner's colour floods outward from it with a burning orange edge (~1-1.5 s). The owner liked ONLY this effect from test F
(not the sepia base, not the one-sided fill; our front-line colours stay as they are).
- First build: test F (`sherman/scenes-src/test-F1-ref.js`, `test-F2-ref.js`, video `sherman/build/test-video-F.mp4`).
- Owner 2026-10-29 after the video test (`sherman/build/test-video-O.mp4`: O2 ember, O3 burn line, O5 tide): "I do like it"; still not in the rules.
- Deep analysis + 3-agent study: `research/ORANGE_EFFECT_*.md`, sheet `sherman/build/sheet-orange.jpg`.

## Territory colour strength (owner 2026-10-29: "the colours are kind of strong")
Sheet `sherman/build/sheet-tone.jpg`: NOW (E1 saturate 0.8) vs V1-V6 = `img.terr{filter:saturate(S) opacity(O)}`: V1 0.8/0.8 · V2 0.6/0.65 · V3 0.5/0.5 · V4 0.4/0.4 · V5 0.35/0.3 · V6 0.3/0.2 (opacity must be a FILTER: GSAP writes inline opacity, which overrides CSS opacity; the first T1-T5 sheet was wrong for that reason). Waiting for the owner's pick.
