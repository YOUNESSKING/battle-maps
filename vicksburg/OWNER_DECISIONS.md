# Decisions taken without the owner (pre-approved: "I approve everything from now")

| # | Date | Decision | Why |
| --- | --- | --- | --- |
| 1 | 2026-11-18 | Film built as 12 sequences, each its own HyperFrames scene, rendered separately and concatenated | the v8 clip is one 66 s scene; one 19-min scene would be too heavy to load/render and impossible to fix in parts |
| 2 | 2026-11-18 | One wide campaign world (Milliken's Bend - Bruinsburg - Jackson) + close worlds per battle, all from the same z11 DEM frame (`vicksburg_hd_lift`) | same map units as the v8 clip, so the Big Black close world and all coordinates carry over |
| 3 | 2026-11-18 | Rebuilt the missing DEM (`grant/assets/src/vicksburg_hd_elev.npy`, git-ignored) from AWS terrain tiles (`tools/fetch_dem.py`) | not in the fresh clone |
| 4 | 2026-11-18 | Model per agent job: Haiku trivial, Sonnet simple (search, checks, packaging), Opus complex (scenes, engine, critics); 3 agents in parallel | owner instruction relayed by the parent session (usage limits) |
| 5 | 2026-11-18 | If the RunPod balance runs out, render the remaining scenes locally (SwiftShader, ~1 min per film-second, chunked + resumable) | owner instruction in chat |
| 6 | 2026-11-18 | Round-1 critics: script and voice stay locked (no re-voicing); refrain / micro-story suggestions noted for the next film. Engine-wide fixes by the lead (boxes face the camera, arrow width cap, broad-river ripple 0.1, muted wide roofs, wide toe 22); per-scene fixes by 3 agents | re-voicing would shift every scene timing; the critics found the words fine |
| 7 | 2026-11-18 | Budget stop: RunPod balance floor $1.40 (parent session relay); local render fallback below that | parent session |
| 8 | 2026-11-18 | Final gate passed (critics round 3: A 7.2 "fit to publish", B 8.0 "fit to publish", no must-fix). Remaining severity-1/2 polish (S08 glaze oval, wide-river stair-step banks, a few arrows leaving the frame, soft smoke bars in S05/S07/S09) logged in critics/round3_*.md, not re-rendered | a re-render + second master encode for cosmetic items was not worth the delay |
| 9 | 2026-11-18 | Narration voice changed to the owner's own voice clone (Kokoro am_michael converted with tts/voices/owner_clone_test.mp3 as reference, same timing); audio re-muxed onto the same video, Gofile re-uploaded | owner in chat: "It should be using the other voice" -> picked "Your own voice clone" |
