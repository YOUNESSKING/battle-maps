# Decisions taken without the owner (pre-approved: "I approve everything from now")

| # | Date | Decision | Why |
| --- | --- | --- | --- |
| 1 | 2026-11-18 | Film built as 12 sequences, each its own HyperFrames scene, rendered separately and concatenated | the v8 clip is one 66 s scene; one 19-min scene would be too heavy to load/render and impossible to fix in parts |
| 2 | 2026-11-18 | One wide campaign world (Milliken's Bend - Bruinsburg - Jackson) + close worlds per battle, all from the same z11 DEM frame (`vicksburg_hd_lift`) | same map units as the v8 clip, so the Big Black close world and all coordinates carry over |
| 3 | 2026-11-18 | Rebuilt the missing DEM (`grant/assets/src/vicksburg_hd_elev.npy`, git-ignored) from AWS terrain tiles (`tools/fetch_dem.py`) | not in the fresh clone |
| 4 | 2026-11-18 | Model per agent job: Haiku trivial, Sonnet simple (search, checks, packaging), Opus complex (scenes, engine, critics); 3 agents in parallel | owner instruction relayed by the parent session (usage limits) |
