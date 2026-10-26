# Pronunciation dictionary (shared by every video)

Owner rule (2026-10-26, after the Morgan comments about "Nathanael Greene"): **check every name before voicing.**

## Check before every narration
1. List every person, place and unit name in `script.md`.
2. Phonemize each one (no listening needed), from `/home/user/battle-maps/tts`:
   ```
   python3 -c "from kokoro_onnx import Kokoro; k=Kokoro('kokoro-v1.0.onnx','voices-v1.0.bin'); [print(w,'->',k.tokenizer.phonemize(w,'en-us')) for w in ['Nathanael Greene','Tarleton']]"
   ```
3. Anything wrong or unsure: find a respelling that phonemizes right, add it to the table below AND to the `SAY` dict in the video's `tools/narrate.py` (the script text stays correct; only the spoken text changes).
4. Voice a **20-second names clip** (each name said once, in a short sentence) and send it to the owner. Record the full narration only after the owner approves it.

## Dictionary
| Written | Say (SAY respelling) | Kokoro before → after | Video |
|---|---|---|---|
| Nathanael (Greene) | Nathaniel | `nˈæθɐnˌeɪl` ("NATH-an-ail", wrong) → `nɐθˈænjəl` | Morgan (fixed after viewer comments) |
| Tarleton | Tarlton | `tˈɑːɹɹəltən` → `tˈɑːɹltən` | Morgan |
| Banastre | Bannister | `bˈænæstɚ` → `bˈænɪstɚ` | Morgan |
| Bemis (Heights) | Beemis | → "BEE-mis" | Morgan |
| Burgoyne | (as written) | `bˈɜːɡɔɪn`, fine | Morgan |
| Cowpens, Saratoga | (as written) | `kˈaʊpənz`, `sˌæɹɐtˈoʊɡə`, fine | Morgan |

Add new rows for every video. Names from earlier videos with known fixes: see each video's `tools/narrate.py` `SAY` dict (e.g. Goose Green: Piaggi, Estévez).
