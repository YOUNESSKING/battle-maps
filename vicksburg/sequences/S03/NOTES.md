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
