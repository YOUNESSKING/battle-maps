# Cleburne #14 -- vidIQ thumbnails (WarfareGeniuss formula)

All generated whole by `vidiq_generate_thumbnail` (no compositing), referenceImages = the 4 WarfareGeniuss thumbs
(p_V3yGhn_bA PUNISHED, grexKARuDQw HOPELESS, IGUBHrfd5iA A DECOY, Uqu_W3RQN1s BETRAYED), title = video #14 title.
Common prompt: Cleburne portrait right (grey CS frock coat, brass buttons, wreath+stars collar, binoculars, looking off-frame),
3D diorama left 2/3 (wooded ridge + railroad tunnel, small BLUE block army on hilltop, ~4x larger RED army climbing,
one white curved arrow, fire + black smoke, tag "TUNNEL HILL", framed portrait pin on a stake by the blue army),
NO flags, one word in quotes on red brush banner bottom-left.

Prompt v1 (cand 01-03): face described generically (lean face, dark hair swept back, full beard).
Attempted v1b: passed the real Cleburne photo (Wikimedia Patrick_Cleburne.jpg, full + 500px thumb) as 5th reference ->
4 jobs FAILED "Thumbnail image is unavailable" (vidIQ cannot fetch Wikimedia), all refunded, no images.
Prompt v2 (cand 04-08): face spelled out from the Oppenheimer photo (long thin gaunt face, narrow jaw, hollow cheeks,
deep-set eyes, long nose, high forehead, FLAT hair parted left and combed straight back, close full beard, thick moustache,
unglamorous); v2b (07-08) also forces the pin to show the same general.

| File | Word | Verdict | Why |
|---|---|---|---|
| cand_01_OUTNUMBERED.png | "OUTNUMBERED" | reject | Face too handsome/wavy-haired (actor, not Cleburne); no tunnel visible. Spelling OK, no flags. |
| cand_02_UNBREAKABLE.png | "UNBREAKABLE" | backup | Good diorama with tunnel, arrow red->blue; face v1 (wavy hair, not quite Cleburne). |
| cand_03_SILENCED.png | "SILENCED" | reject | Mismatched quotes (straight '' opening, curly closing); face v1; arrow points at tunnel not the hill. |
| cand_04_OUTNUMBERED.png | "OUTNUMBERED" | **KEEP** | Lean face + flat swept-back hair close to the photo; tunnel + rail, clear small blue vs big red, pin is bearded general. River at right (Tennessee River plausible). |
| cand_05_SILENCED.png | "SILENCED" | reject | Pin shows a different clean-shaven man in a suit. |
| cand_06_4TO1.png | "4 TO 1" | **KEEP** | Best Cleburne likeness (gaunt, high forehead, parted hair); tunnel, rail, two smoke columns, clean; matching curly quotes. |
| cand_07_UNBREAKABLE.png | "UNBREAKABLE" | backup | Good face, but blue army drawn almost as big as red and spread over the crest (weakens the 4:1 read); some red blocks on far crest. |
| cand_08_SILENCED.png | "SILENCED" | **KEEP** | Good likeness, pin = same general, tunnel, red clearly larger, fire + smoke, clean quotes. |

Checks on the 3 keeps: spelling exact, no stray/garbled text beyond "TUNNEL HILL", no flags of any kind,
collar = gold stars in wreath (AI approximation; real MG insignia is 3 stars in wreath).
Facts: 4,000 vs ~16,000 (FACT_NOTES: Wikipedia/NPS) -> "4 TO 1"/"OUTNUMBERED" true; "SILENCED" = Davis ordered the
Dalton memorandum suppressed (FACT_NOTES, BOFT) -- the image shows Tunnel Hill, so the word refers to the story, not the battle.

Credits: 8 successful generations x 22 = 176 credits (4 failed Wikimedia-reference jobs refunded).
