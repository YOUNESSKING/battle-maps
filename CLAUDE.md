# battle-maps

Faceless military-history YouTube channel ("[General]'s Top 3 Legendary Tactical Moves", Tactical Genius style).
**Read HANDOVER.md first**: it has the plan, the pipeline, the commands and the lessons learned.
**Then read STYLE_LOCK.md**: the owner-approved look, sound effects, music and levels. Use it as-is on every video; never re-search or restyle.
**SOUND LOCK:** the artillery, ship-gun, bombing and aircraft sounds + levels + music are locked and checked on every build (`tools/check_sound_lock.py`; reference `reference/style-reference-30s.mp4`). If it says SOUND LOCK BROKEN, restore goosegreen's files; never edit the lock without the owner's approval.

- Setup runs automatically in the background at session start (`setup.sh`). Before voice or render steps, wait until `/tmp/battle-maps-setup.done` exists (log: `/tmp/battle-maps-setup.log`). If it's missing after ~10 min, run `bash setup.sh` in the foreground.
- The repo must live at `/home/user/battle-maps` (scripts use absolute paths there).
- Research for new videos comes from Gemini (`research/GEMINI_BRIEF_v2.md`); the user attaches the result.
- Keep the conversation lean: use subagents (Sonnet for search/download/sound, Opus for maps), and commit + push work as you go.
- **Every video opens on an animated map, never a photo** (owner rule). The first script paragraph must be `[MAP: ...]` with units on screen in the first second; archive photos only after the hook.
- Hooks follow the **hook formula** in HANDOVER.md section 1 (stakes-first line, flash-forward to the payoff, a change every 3-5 s, SFX on every beat). Every map blast calls `SFX(kind, t)` so the build adds its sound.
- The visual + sound style is **locked** in HANDOVER.md section 1b (front lines, territory, night mode, real impact sounds, aircraft sounds, quiet music). Use the `lib/fx.js` defaults; don't restyle.
- **Test before applying**: show any new look/sound as snapshots or a 1-minute clip first; apply only after the owner approves. Sound-only changes: `assemble_full.py --audio-only`, never a re-render.
