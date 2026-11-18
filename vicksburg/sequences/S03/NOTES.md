# S03 the night of 16 April (D = 87.70 s): notes

Regions: `vicksburg` (night) -> cut + 1 s night->day dissolve at 64.55 (between the paragraphs) -> `wide` (dawn). Build: `python3 vicksburg/tools/make_scene.py vicksburg/sequences/S03` (24.1 MB). Contact sheet: `sheet.jpg`.

## The fleet
10 vessels in the usual order: Benton (lead), Lafayette, Louisville, Mound City, Pittsburg, Carondelet (gunboats); Silver Wave, Henry Clay,
Forest Queen (transports); Tuscumbia (last). Ran dark: no deck lamps; a faint cool sheen + pale wake sprite per hull so they read at night.
Lead schedule (arc length on the close river): at anchor to "cast off" 4.15, up the NE leg, through the hairpin 27-34 ("slowing for the bend"),
down the city front 34-44, then the gunboats hold and regroup below the city. Boats exaggerated (size 0.5) for readability.

## Shot list
| t | Picture | On its word |
| --- | --- | --- |
| 0-20 | night, camera behind the fleet on the NE leg looking up the bend | plaque 16 April 1863 (1.53); clock 10:00 at night on "ten o'clock" (3.15), runs to 10:30; boats cast off 4.15; Porter card (6.09-12.2); label "Benton · the flagship" following the boat (8.11); label "Three transports · boilers padded with cotton and hay" (13.09) |
| 20-37 | the whole bend, the city on the bluff | batteries open on "Guns opened" (22.31) and keep firing at the nearest boats until dawn (50 battery shots, each flash = gun cue, shot falls in the river near a boat); clock label "Night" + note "The batteries open"; 7 house fires on both banks from "houses" (25.35-29.5, fire cues) + bonfires at the foot of the bluff from "bonfires" (campfires), their light on the water; 7 return shots from the gunboats 29.4-40.6; note "Under fire for over two hours" on "two hours" |
| 37.5-43.4 | closer on the transports | oval inset "Running the batteries" (LoC, same image as v8) |
| 42.83-48.7 | the Henry Clay disabled (slows to the current) | label "Henry Clay · disabled · abandoned" following her |
| 47.47 | a shell bursts in her cotton: moving fire (flames, embers, glow on the water, smoke) | label "Henry Clay · a shell in her cotton" |
| 50.5-64.5 | she swings into the current and drifts down past the holding fleet, burning | "past the fleet" ~55-57 |
| 56.81-59.6 | | Grant card "watching from a transport above the city" |
| 59.87-64.3 | | quote "The sight was magnificent, but terrible." (Grant, Personal Memoirs), centred on a dim |
| 64.55-65.55 | cut to the wide map, night -> dawn dissolve; the fleet at anchor below the city near New Carthage; Vicksburg (red) still holds | plaque 17 April "by morning" (65.07); blue route arrow city -> anchorage on "fleet" (65.69); "Vicksburg" (66.55) |
| 65.7-86 | slow drift | ledger: Fleet below Vicksburg (66.19), 1 transport lost · the Henry Clay (68.51), None killed · on the transports · by Grant's count (71.17); plaque 22 April "six nights later" (74.53); route arrow leaves, six steamers run down the river (75.43); ledger "More steamers run the guns · with supplies · volunteer crews" (76.01); final stamp "Volunteers five times over" (84.65) |

Cues: 57 gun (50 battery + 7 gunboat), 7 fire (`scenes/S03/cues.json`).

## Sources
Facts: `research/FACT_NOTES.md` "Run of 16 Apr" (GM ch. XXXII; SM; FACTCHECK_B). Inset `inset_run.jpg` = the Library of Congress print used by the
approved v8 clip (copied from `sequences/test_v8/`). Quote: Grant, Personal Memoirs.

## Open issues
- Script vs facts: the narration says Porter led in the Benton "with five more gunboats" (6); FACT_NOTES lists SEVEN gunboats (+ the General Price
  lashed to the Lafayette). The picture shows 7 gunboats + 3 transports; the ledger avoids a gunboat count. The lead may want to fix the line.
- The night is the engine's moonlit grade; FACT_NOTES says no moonlight is documented for 16 April (no moon, no fog added).
- The clock does not give a time for the opening of the batteries (not in FACT_NOTES): it shows "Night" from 22.3.
- The Henry Clay's fire is a custom sprite fire (flames/embers/glow/smoke) that follows her; it reads as a bright flame blob at this distance,
  its smoke is faint at night. Her hull disappears at 55 s (burned to the waterline), the fire stays on the water to dawn.
- The disabled Henry Clay drifts faster than a real current (needed to pass the fleet within the narration).
- Coal barges and the General Price are not modelled.

## Round 2 fixes (critics round1_A / round1_B + lead queue)
| Finding | Fix |
| --- | --- |
| Fleet specks 0-15 (A/B sev 2) | First key dist 18 (was 30) behind the moored fleet, slow push down the line to 12 s; boats size 0.68 (was 0.5); hull sheen + wakes x2 (9 trail sprites). Still no deck lamps (they ran dark). |
| Gunboat count (lead) | Checked: Benton, Lafayette, Louisville, Mound City, Pittsburg, Carondelet + Tuscumbia = 7 gunboats, 3 transports (FACT_NOTES); unchanged. The wide anchored fleet now shows 9 (the Henry Clay is lost). |
| B 22-36 no battery flash (sev 2) | Battery flash 3.2 x size 1.5, flashLife 0.18; first shot 22.31 on "Guns opened"; the 20 s key turned so the bluff batteries are in frame. |
| B 22 plaque/clock mismatch (sev 1) | The "Night" label is gone: the watch stays at 10:30 at night (hands agree), notes "the batteries open" / "under fire for over two hours". |
| A 48-60 Henry Clay white blob (sev 2) | Bridge-fire look: orange tongues (peak ~(248,196,96), low additive alpha), orange water glow, a soft dark-grey smoke column lit orange at its foot (curtain sprites). |
| B 64.5 hard cut, no dawn shot; A plaque lingers (sev 2) | 1.0 s dissolve on the close world to DAWN: the fleet at anchor below the city in morning light ("Vicksburg" on its word 66.55), the date rolls to 17 April inside the dissolve; 0.7 s dissolve to the wide map at 69.55 (route arrow, ledger). Quote dim 0.5, out at 64.2 (before the dissolve). |
| A/B 70-86 static wide (sev 2) | The 22 April run animated: grade to night on "Six nights later", camera pushes to the city (dist 200) and follows south; six steamers (lamps) run down from the foot of the west loop past the city from "steamers" 75.4, the bluff batteries fire at them (wide flashes + splashes, gun cues), one (the Tigress) is hit and sinks below the city (~81-83, no unspoken name on screen). |
| B no Vicksburg label at 2 s | Not done: "Vicksburg" is not spoken before 66.55 (rule: nothing on screen before its word); the label sits on its word. |
Open: night far edge of the vicksburg bundle at the top of the 29-37 s frames is in deep haze (not flagged by A).

## Round 3 fixes (critics round 2)
- B N2 (sev 3, empty river 0-16.5): the re-baked region starts the river 28 units earlier in arc length; every fleet schedule value is old + 28 (SO).
  The moored line (Benton s 84 ... tail s 55) is mid-frame from frame 1 (camera dist 52); the Benton + Three transports labels sit on boats.
- A (comb of boats): 3.6 units apart at the moorings (~2.2 lengths), ~4.7 underway; no wakes while moored or at anchor (engine wake off, custom wake
  only while under way). Dawn: at anchor below the city 3.4 apart.
- B N3: battery flashes come from the town's river edge (between the bank and the first houses, `bluffEdge`), not the street grid; flash 2.0.
  The 47.2 shell bursts ON the Henry Clay (custom flash at her deck at water level + a boom cue).
- A (Henry Clay fire): flames x2.4, higher column, alpha up; camera keeps her mid-left 47-60.
- A N3 (22 April steamers): size 3.4 -> 1.4 (~x0.4), 10 units apart (~3.5 lengths), on the channel line; wide dawn fleet 2.2 -> 1.3, 9 apart.
- B N10: dawn graded "dusk" (warm low light) 64.55 -> day at the wide dissolve.
- Checks: check_paths OK, check_edges OK, arrows inside 5 %.
