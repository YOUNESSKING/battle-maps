# battle-maps

Faceless military-history YouTube channel ("[General]'s Top 3 Legendary Tactical Moves", Tactical Genius style).
**Read HANDOVER.md first**: it has the plan, the pipeline, the commands and the lessons learned.

- Setup runs automatically in the background at session start (`setup.sh`). Before voice or render steps, wait until `/tmp/battle-maps-setup.done` exists (log: `/tmp/battle-maps-setup.log`). If it's missing after ~10 min, run `bash setup.sh` in the foreground.
- The repo must live at `/home/user/battle-maps` (scripts use absolute paths there).
- Research for new videos comes from Gemini (`research/GEMINI_BRIEF_v2.md`); the user attaches the result.
- Keep the conversation lean: use subagents (Sonnet for search/download/sound and simple regional maps, Opus only for main battlefield maps; max 3 at once; brief in templates/MAP_AGENT_BRIEF.md), and commit + push work as you go.
