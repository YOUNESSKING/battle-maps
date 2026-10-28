# `carolinas` map: fact notes (MOVE 1 agent, Greene #2 remake)

Basemap `carolinas` (z9, centre 35.80N 80.20W, 248 m/px, covers 33.98-37.59N, 84.16-76.25W). Tools: `tools/make_carolinas_rivers.py`,
`make_carolinas_geo.py`, `make_carolinas_control.py`, `make_carolinas_inline.py`. Items marked **(memory)** = general knowledge, to list in
the publishing "facts to double-check" box.

## Places (map px = `L(lat, lon)` in the scenes; Nominatim 2026-10-27 unless noted)
| Place | lat, lon | check |
|---|---|---|
| Cowpens (battlefield) | 35.13, -81.82 | brief / NPS |
| Ramsour's Mill (Lincolnton) | 35.477, -81.267 | Nominatim "Battle of Ramsour's Mill" |
| Cowan's Ford | 35.435, -80.958 | Nominatim "Cowans Ford Dam" (the ford is under Lake Norman, at the dam) |
| Trading Ford (Yadkin) | 35.695, -80.372 | Nominatim "Trading Ford, Rowan County" |
| Salisbury | 35.671, -80.474 | Nominatim |
| Charlotte | 35.227, -80.843 | Nominatim |
| Cheraw (Greene's camp on the Pee Dee) | 34.698, -79.883 | Nominatim |
| Winnsboro (Cornwallis's winter camp) | 34.381, -81.086 | Nominatim |
| Shallow Ford (Yadkin) | ~36.05, -80.51 | **(memory)** |
| Salem (Moravian town) | ~36.09, -80.24 | **(memory)**, Old Salem |
| Guilford Courthouse | 36.131, -79.844 | Nominatim (NMP) |
| Hillsborough | 36.075, -79.100 | brief / Nominatim |
| Boyd's Ferry (Dan, South Boston VA) | ~36.698, -78.901 | **(memory)**: at South Boston; snapped onto the traced Dan |
| Irwin's Ferry (Dan) | ~36.68, -78.97 | **(memory)**: a few miles above Boyd's; snapped onto the traced Dan |
| Dix's Ferry (Dan, Danville) | ~36.58, -79.38 | brief: Danville area; snapped onto the traced Dan |
| Wilmington | 34.236, -77.946 | Nominatim |
| Halifax NC | 36.329, -77.590 | Nominatim |
| Petersburg VA | 37.228, -77.402 | Nominatim |
| Yorktown VA | 37.238, -76.510 | **(memory)**, at the right edge of the map |
| Camden SC | 34.246, -80.607 | Nominatim |

## Rivers (traced from the elevation, `make_carolinas_rivers.py`; checked on an overlay with the places above)
Followed downhill from a point on each upper course: Catawba (from Morganton; Cowan's Ford sits on it), South Fork Catawba (Ramsour's
Mill sits on it), Yadkin (from Wilkesboro; Trading Ford sits on it) -> Pee Dee below the Uwharrie mouth (Cheraw sits on it), Dan (from
below Hanging Rock; Dix's / Irwin's / Boyd's sit on it) -> Roanoke below the Staunton mouth, Haw -> Cape Fear below the Deep River mouth
(Wilmington), Deep, Broad, Wateree (Catawba below the Wateree dam site), Appomattox (Petersburg). Modern reservoirs (Lake Norman, High
Rock, Badin/Tillery, Kerr/Buggs Island) are drawn as the single river channel they were in 1781 (DEM voids filled before tracing).
Colony lines: Virginia - North Carolina (1728 / 1749 / 1779-80 surveys, ~36.55N) and North - South Carolina (1735-37 / 1772) drawn faint
and dashed, approximate to a few km.

## Control overlays (option 1, multiply; FACT_NOTES control table)
| File | Date shown | British (red) | American (blue) | Source / note |
|---|---|---|---|---|
| `carolinas_ctl_jan81_mx.png` | Jan 1781 (dan-1, dan-2 up to the burning) | South Carolina (the post line Camden - Ninety Six - Georgetown - Charleston; Cornwallis at Winnsboro) | NC, VA + Greene's camp at Cheraw Hill (26 Dec 1780 - 28 Jan 1781) | FACT_NOTES control table; Cheraw camp **(memory)** |
| `carolinas_ctl_feb81a_mx.png` | 25 Jan - 4 Feb (Ramsour's Mill -> Cowan's Ford -> Salisbury -> Trading Ford) | SC + the British column's moving zone (Winnsboro - Ramsour's Mill - Cowan's Ford - Salisbury, ~11 km either side, ending on the SW bank of the Yadkin) + Wilmington post | rest of NC, VA | Wilmington occupied by Maj. James Craig 29 Jan 1781 **(memory)**; route: FACT_NOTES move 1 |
| `carolinas_ctl_feb81b_mx.png` | 9-13 Feb (dan-6, dan-7) | SC + the column's zone Salisbury - Shallow Ford - Salem + Wilmington | rest of NC, VA | Shallow Ford crossing ~8 Feb, Salem 9-10 Feb **(memory)** |
| `carolinas_ctl_feb81d_mx.png` | 14-15 Feb (dan-8, dan-9) | SC + the zone extended Salem - north of Guilford - the south bank of the Dan at Irwin's/Boyd's + Wilmington | rest of NC, VA | British reach the Dan 15 Feb (FACT_NOTES) |
| `carolinas_ctl_feb81c_mx.png` | 20-26 Feb (move1c: Greene north of the Dan) | SC + Wilmington + Cornwallis's army at Hillsborough | rest of NC, VA | Cornwallis at Hillsborough 20-26 Feb, King's standard raised 20 Feb **(memory)** |
| `carolinas_ctl_mar81_mx.png` | Mar 1781 (guilford-1) | SC + Wilmington + Cornwallis's camp at the Deep River (11 km zone, SW of Guilford; Guilford itself stays outside) | NC interior, VA | FACT_NOTES control table (Mar-Apr) |
| `carolinas_ctl_apr81_mx.png` | Apr 1781 (guilford-9) | SC + Wilmington enclave (Cornwallis there 7-25 Apr) | NC interior, VA | Cornwallis reached Wilmington 7 Apr, left for Virginia 25 Apr **(memory)** |
"Control" in 1781 = posts and the country they dominated: drawn as soft zones, not trench lines. Hillsborough (Cornwallis 20-26 Feb)
appears as the arrow's end in dan-9 and as a red zone in move1c (feb81c).

## On-screen facts in move1a-c, move2a, move2d (all from research/FACT_NOTES.md)
- dan-1: split army (Greene east to Cheraw, Morgan west); Cowpens 17 JAN 1781; TARLETON'S LIGHT TROOPS DESTROYED (no numbers).
- dan-2: Ramsour's Mill 25-27 Jan 1781; BAGGAGE, TENTS, WAGONS, RUM: BURNED; ~2,500 BRITISH REGULARS (Buchanan).
- dan-3: TRAP THEM AGAINST THE RIVERS = paraphrase (no quote marks).
- dan-4: boats collected on the Dan (Carrington survey, Dec 1780 **(memory)**; shown as "EVERY BOAT ON THE DAN", no number).
- dan-5: Greene's ride ("a hundred miles" spoken; no number on screen); Cowan's Ford 1 FEB 1781; Davidson killed (initials badge).
- dan-5b: Yadkin at Trading Ford 3 FEB 1781, crossed by boat, river rose, British guns fire across.
- dan-6: reunion at Guilford Courthouse (date 9 FEB 1781: council of war **(memory)**); Williams's light corps ~700.
- dan-7: 40 MILES IN 24 HOURS (Lee's memoirs via Gemini); 6 HOURS' SLEEP IN 48 not shown as a quote.
- dan-8: 14 FEB crossing (Boyd's + Irwin's); British at the Dan 15 FEB; NO BOATS.
- dan-9 RESULT card: ~200 MILES · 0 BATTLES · NO TENTS, NO FOOD · CORNWALLIS TURNS BACK (no casualty figures).
- guilford-1: US ~4,400 vs BRITISH ~2,000 (FACT_NOTES move 2); Greene recrossed the Dan ~22-23 Feb **(memory)**.
- guilford-9: Wilmington (7 Apr), into Virginia (25 Apr -> Petersburg 20 May **(memory)**), Yorktown ring.
