# Fix pass after the style audit (owner 2026-11-03: "check the whole video for mistakes and fix them, you did not respect the style lock")
Audit: build/AUDIT_STYLE.md (numbers # below). Audio/timing CHANGED: m1-8, m2-9, m3-4, m3-8 re-voiced (new text in script.md / audio/timing.json),
later paragraphs shifted; ~21 s of silent tail after end-2 for the end screen (timing.json duration = 940.89 s). Rebuild EVERY scene of yours
against the new timing.json and re-grep every B.at phrase (m3-4 lost "About fifteen hundred men, with cannon"; m1-8 now speaks ONLY method line 1;
m2-9 ends with method line 2 "let the ground and the weather fight for you"; m3-8 ends with method line 3 "lead from the front, at the point where it is decided").
Global rules for every fix (STYLE_LOCK 1c/2/2a): nothing before it is spoken; ONE big card at a time, ~2.5-3 s each, legend + corner badges step out
(filter:opacity) under every big card; date scroll never disappears (also on the first frame of each scene and above dim layers); both period flags
visible on EVERY map frame, fully inside the frame, on their own LAND (never on water, never under the legend/badges/date scroll, never on units);
labels never cut by the frame edge or hidden by the legend; artillery/ship fire only where clearly visible (max ~1 shot per 2 s, readable flashes),
no cues for unseen guns; the locked `whoosh` only on the hook dive + 2 biggest moves, no whoosh per arrow; method card lights ONE new line per move,
on its spoken words, all previous lines shown dim; badge rings: Continental Colours for 1775-76, 13-star for 1777.
Do NOT render. Rebuild with your inline builder, quick sheet per scene (tools/quick_sheet.py SCENE 3) and check every frame yourself.
