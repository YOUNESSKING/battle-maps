# battle-maps

Faceless military-history YouTube channel ("[General]'s Top 3 Legendary Tactical Moves", Tactical Genius style).
**Read HANDOVER.md first**: it has the plan, the pipeline, the commands and the lessons learned.

- Setup runs automatically in the background at session start (`setup.sh`). Before voice or render steps, wait until `/tmp/battle-maps-setup.done` exists (log: `/tmp/battle-maps-setup.log`). If it's missing after ~10 min, run `bash setup.sh` in the foreground.
- The repo must live at `/home/user/battle-maps` (scripts use absolute paths there).
- Research for new videos comes from Gemini (`research/GEMINI_BRIEF_v2.md`); the user attaches the result.
- Keep the conversation lean: use subagents (Sonnet for search/download/sound, Opus for maps), and commit + push work as you go.
- **Every video opens on an animated map, never a photo** (owner rule). The first script paragraph must be `[MAP: ...]` with units on screen in the first second; archive photos only after the hook.
