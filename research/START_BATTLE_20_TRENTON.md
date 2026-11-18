# START HERE: Battle 20, Trenton-Princeton 1776-77 (3D campaign film, brief started 2026-11-18)

Topic order (owner, START_BATTLE_19): Vicksburg (done) -> **Trenton-Princeton** (publish 19-22 Dec for the anniversary) -> Saratoga.
Everything from Vicksburg carries over: read `vicksburg/README.md` (pipeline + lessons), `vicksburg/OWNER_DECISIONS.md`, `vicksburg/engine/README.md`.

## Film
- Working title shape (GM's proven one): "Washington's Ten Crucial Days: 3 Battles in 10 Days | Trenton-Princeton 1776" (check every word in
  FACT_NOTES: Trenton 26 Dec, Second Trenton / Assunpink Creek 2 Jan, Princeton 3 Jan = the "Ten Crucial Days" 25 Dec - 3 Jan).
- Story: the cause collapsing (New York lost, enlistments ending 31 Dec) -> the Delaware crossing in the storm (McConkey's Ferry, Christmas
  night) -> Trenton at dawn -> the risky second crossing -> Assunpink Creek (the trap, the bridge) -> the night march round Cornwallis's flank
  (fires left burning) -> Princeton (Mercer falls, Washington rides between the lines) -> Morristown.
- Same rules: stakes + cloud dive opening, nothing before its word, two critics x 3 rounds, RunPod cheap pods (budget per owner), voice A.

## Engineering to do
- New DEM frame for the Delaware valley (Trenton / Princeton / McConkey's Ferry / Morristown): copy `vicksburg/tools/fetch_dem.py` with a new
  lift json; worlds: `wide` (Delaware valley + Princeton), close `crossing` (McConkey's Ferry, winter), `trenton` (1776 town, King/Queen streets,
  Assunpink bridge), `princeton` (Clarke farm, Nassau Hall).
- Winter look: snow/sleet weather, bare trees, frozen fields (new ground palette in `gm_look.py` + fx snow) - test on stills first.
- Hessian units: a third colour is NOT allowed (red = enemy); British + Hessians both red, label Hessian regiments by name.

## Next step for the session
Research (FACT_NOTES + geo.json) with fact-check agents, as in `vicksburg/research/`.
