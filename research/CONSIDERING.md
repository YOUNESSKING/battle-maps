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
Sheet `sherman/build/sheet-tone.jpg`: NOW (E1 saturate 0.8) vs V1-V6 = `img.terr{filter:saturate(S) opacity(O)}`: V1 0.8/0.8 · V2 0.6/0.65 · V3 0.5/0.5 · V4 0.4/0.4 · V5 0.35/0.3 · V6 0.3/0.2 (opacity must be a FILTER: GSAP writes inline opacity, which overrides CSS opacity; the first T1-T5 sheet was wrong for that reason). **Owner 2026-10-29: none approved; keep our current colours (E1).** Competitor study: `research/territory_study/MEASUREMENTS.md`, sheet `sherman/build/sheet-competitor-colour.jpg` (C1-C4, none chosen).

## Use territory colours less often (owner 2026-10-31, "not a rule yet")
Owner: use the red/blue territory colours less and less: only where they actually help, otherwise leave them off (not "softer", fewer).
Draft of where they help: wide shots when the ground changes hands or a new date/front is introduced, and the opening overview;
everywhere else (close-ups, quotes, decision cards, captions over a stable front) the map can go without the fill (option 2 front lines
or plain map + flags). Note it touches the locked rule "every map shows who controls the ground" (STYLE_LOCK 2): needs the owner's OK
before it changes. Strength test sheet (not what the owner meant, kept for reference): `cleburne/build/sheet-territory-strength.jpg`.

## Packaging test rules: PROMOTED TO RULES 2026-11-01 (research/PACKAGING_GUIDE.md section 0b). Original draft below.
Source: Studio AI "reignite" advice for Collins, checked against our data in research/CHANNEL_LOG.md (2026-11-01).
1. **Title A/B with Test & Compare at launch:** A = our locked format (`<Name>'s Top 3 Legendary Tactical Moves | The Man Who <result>`);
   B = curiosity title that leads with the famous conflict/stakes casual fans know (e.g. "How One American General Broke the Normandy
   Stalemate"); optional C = nickname/stakes hybrid. Let YouTube pick the winner; log the result per video in CHANNEL_LOG.
2. **Every title claim is true and sourced** (FACT_NOTES): no invented "in 1 hour", "saved D-Day", "forgotten" unless the sources say it.
   Concrete + time-bound + famous enemy works (Morgan: "Destroyed Britain's Elite in 1 Hour") ONLY when it is literally true.
3. **Thumbnail with instant context:** the commander's face (face pop, STYLE_LOCK 6) + one image casual fans recognise at once
   (beach landing, snow + tanks, the battle's iconic place) or a clear map graphic with the battle shape; high contrast; 1-3 words.
   Test 2-3 variants in Test & Compare.
4. **End screen from the channel's busiest video to the new one** (free; expect little: our end-screen click rate is 0.6%).
5. Packaging never fixes retention: the opening rule (STYLE_LOCK 1a, 2026-10-31) still decides 0:30. Judge the test on CTR and
   impressions day 1-3, separately from retention.

## The 40-second formula (Studio AI 2026-11-01; owner testing it on Patton #15, NOT a rule yet)
0:00-0:10 the impossible stakes, no statistics; 0:10-0:25 the impending catastrophe (what is lost if it fails); 0:25-0:40 the commander enters
WITH his unconventional move (the twist), named by ~0:40. Everything else from the 2026-10-31 opening rule stays (one continuous story, no CV
in the first two minutes, background <= 20 s before move 1). Judge it on Patton's retention at 0:30 and 0:40 vs Cleburne v3. Data: CHANNEL_LOG.

## Fewer territory colours + the old narration voice (owner 2026-11-02; testing on Cleburne v4, NOT a rule yet)
Owner noticed the hits (Thomas, Morgan, 2 Para) used almost no territory colours and the old plain narration (Kokoro am_michael, before
voice A was locked on 2026-10-06). Repo check: Thomas 0/14 scenes with territory, Morgan 0/11, 2 Para 4/15; Gavin 8/13, Collins 10/11,
Cleburne 11/11. Caveat: those hits also differ in topic, opening style and date, so this is a correlation to test, not proof.
Cleburne v4 test: territory overlays hidden everywhere (lib/battle.css `html:not(.terr-on) img[src*="_mx"]`) except the wide scenes
where ground changes hands (bg-a siege + Missionary Ridge collapse, move2a retreat, move3a 1864 theatre); no colours in the opening;
narration = the plain Kokoro take (audio/voice.wav, same timing as voice A). Judge on Cleburne's retention at 0:30/0:40 after upload.

## Checklist for picking and packaging new commanders (draft from Patton #15 data, 2026-11-02; NOT a rule yet)
1. The opening fix works (Patton 48% at 0:40 vs Collins 36%): keep the stay-in-the-story opening.
2. Prefer high-stakes stories that few big channels cover well (Thomas, Morgan pattern). For a saturated name (Patton, Bulge, D-Day,
   Rommel...), we only win if the packaging is clearly different from the big documentaries: check the Suggested-sidebar competition first
   (who else ranks for the name, what their thumbnails look like) and pick the angle they don't own.
3. Thumbnail = OUR advantage: the animated-map manoeuvre (bold arrow, the turn, the trap) + the face, not a painting or a B&W photo that
   blends into every other video on the topic. 2-3 high-contrast words that are TRUE and sourced (no invented "90 degrees" / "72 hours").
4. Read Browse CTR and Suggested CTR separately after 3 days; if Suggested CTR < ~2%, test a new thumbnail (Test & Compare) before anything else.
