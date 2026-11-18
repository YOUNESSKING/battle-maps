# Fix brief (read fully). ROUND 3: use critics/round2_A.md + round2_B.md (renders in /tmp/vx_render2); round-1 notes below still apply

You fix existing scenes after the two round-1 critics. Read `vicksburg/SCENE_AGENT_BRIEF.md` (build/check loop, rules), the critics
`vicksburg/critics/round1_A.md` (look) and `vicksburg/critics/round1_B.md` (story/sync), `vicksburg/CRITIC_QUEUE.md`, and each of your
scenes' `NOTES.md` + `seq.js`. Fix EVERY finding for your scenes (severity 3 and 2 first), plus anything you notice on your own stills.

Already fixed in the engine by the lead (do not redo, but check your stills look right with it):
- every unit box now faces the camera (always an upright rectangle on screen; `S.boxFacing = "unit"` restores the old behaviour, do not use it);
- arrow width capped at 0.30 x troopScale (keep arrow colours to the side colours; the navy route may stay lighter blue);
- broad rivers in close worlds ripple 3.5x less; wide-map roofs are muted brown-slate and 0.65x; wide grade toe 14 -> 22.

Recurring scene-level fixes the critics asked for (apply where they hit your scenes):
1. World edge must never show: keep all four frame corners inside the region box at every camera key (pull in, lower the tilt, or move `at`);
   check with stills at the extremes of every camera move.
2. Battle smoke = v7/v8 battalion curtains along the firing lines (see `sequences/test_v8/seq.js` smokeLines `look: "gmTall"`, `cluster`,
   `fadeAfter`), not round white puffs.
3. Fights must read: blue and red boxes never interleaved; lines face each other with a clear gap; push-apart groups; visible gun flashes
   where the narration says guns.
4. Nothing cut by the frame edge; no overlaps between cards/labels/banners/units; one big card at a time; nothing before its word;
   quote cards must not freeze the picture: keep the camera and units moving under them.
5. Owner movement rules: cross water only on bridges (`node vicksburg/tools/check_paths.js SNN` must be OK or only list legit
   landings/fords you name in NOTES), never cross a bridge after its fire starts (arrows too), units leave over the frame edge as road
   columns, never vanish in mid-field. Territory/colour must change when ground changes hands (e.g. Jackson after the flag goes up).
6. Dead stretches > 5 s get something new (a move, a label, a camera beat).
7. Dashed lines are forbidden (locked style); text facts must match FACT_NOTES ("About 3,800", not "~3,800").

The script and the voice are LOCKED (decision 6): do not change words; fit the pictures to the existing word times.
Finish each scene with a new `sheet.jpg` + an updated NOTES.md section "Round 2 fixes" (finding -> what you did). Do not commit. Report.

## Round 3 additions (lead, 2026-11-18)
- Engine since round 2 (lead): arrow width cap 0.24; wide grade toe 30; wide rivers calmer; close-town roofs weathered brown/slate; timeline seals
  above the day labels. Check your stills with these.
- The vicksburg region was re-baked larger (box [1306,598,124,117]): anything that follows river points by index (boats via VX.river /
  riverAtY) may have moved: re-check every boat path in scenes using `vicksburg`.
- Write "Round 3 fixes" in NOTES.md. Run check_paths.js, check_edges.js and check_escapes.js (vicksburg/tools/) on every scene you touch.
- Budget: this is the last fix round before the final render; fix every severity 3 and 2, and severity 1 where cheap.
