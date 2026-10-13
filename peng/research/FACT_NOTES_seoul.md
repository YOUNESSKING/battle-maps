# `seoul` basemap (z10): control maps + front lines per date (move 3)
Owner: the MOVE 3 map agent. Generator: `tools/make_seoul_control.py` -> `assets/media/seoul_ctl_<date>_mx.png` (option 1, multiply;
UN-held = red, Communist-held = blue) + `seoul_front_<date>.json` (option-2 polylines, map px). Geography: `tools/make_seoul_geo.py`
(DEM rivers + hand list of big towns, 1950 names; Overpass was down) -> `seoul_geo_ref.png`, `seoul_rivers.json`, `seoul_imjin.json`.
Scene data is inlined by `tools/make_seoul_inline.py` (re-run after changing the fronts). Source: Mossman, *Ebb and Flow* (CMH, DTIC
ADA232745), ch. VIII (line B/C/D definitions, p. 160-161), IX (dispositions 27 Dec, the 31 Dec attack), X (Seoul), XI (Line D).
Accuracy: ~2-5 km near Seoul / the Imjin, ~10-20 km east of Chunchon.

| date | line (lon, lat) | sources |
|---|---|---|
| 26-31 Dec 1950 (line B) | Kanghwa Island + Kimpo peninsula UN (Rangers, Turks); lower bank of the Imjin from its mouth past Munsan and Korangpo-ri to ~Jeongok (25th Div on Route 1, ROK 1st Div up to near Route 33); along ~38.0N: ROK 6th on Route 33, US 24th on Route 3 (IX Corps); ROK III Corps (2nd, 5th, 8th Divs) above Chunchon; dip for the North Korean salient near Hongchon; to the east coast just north of 38N | Mossman ch. VIII p. 160 (line B "traced the lower bank of the Imjin and Han"); ch. IX p. 181-182 (Map 15 dispositions) |
| 1 Jan 1951, daylight | as line B, with the V-shaped wedge driven by the 116th Div into the ROK 1st Div sector (deepest ~8 mi below the Imjin, between Routes 5Y and 11, just west of the I/IX boundary); small dents at the ROK 6th, the US 24th (2 mi back), ROK 5th/2nd | Mossman ch. IX p. 188-190 |
| 2-3 Jan (Seoul bridgehead) | Kanghwa + Kimpo tip given up; bridgehead arc north of Seoul (25th Div W, British 29th Bde E, 24th Div from Uijongbu to the Han); line C along the lower Han to the Pukhan junction, then NE toward Hongchon (ROK divisions in disarray; Chunchon lost 2 Jan) | Mossman ch. X p. 192-197 |
| 4 Jan (afternoon) | Seoul abandoned (order ~13:00 3 Jan; last Han bridge down ~14:00 4 Jan; Chinese patrols in Seoul within the hour); UN on the south bank (Kimpo, Yongdungpo) | Mossman ch. X p. 201-208 |
| 7 Jan (line D) | west-coast anchor below Pyongtaek - Pyongtaek - Ansong - Changhowon-ni - the Han beyond it - Wonju - NE toward Wonpo-ri (the east only approximate: NK forces around Hongchon/Wonju) | Mossman ch. VIII p. 161 (line D), ch. XI p. 210-214 |

Other placements: Chinese armies per Eighth Army intel 31 Dec (NK I Corps + 50th on Route 1, 39th between Routes 1 and 33, 38th astride
Route 33, 40th behind, 66th across Routes 3/17); 116th Div crossed the Imjin near Korangpo-ri after full dark behind a 30-min barrage;
~midnight 116th + 113th (38th Army) on the ROK 6th; ~2 h later 66th Army on the ROK 5th, ~05:00 ROK 2nd; US 25th "not touched"
(Mossman p. 188-189). Royal Ulster Rifles rear guard trapped "just before midnight" 3 Jan NW of Seoul, 250-300 men + 10 tanks lost
(p. 206) - placed at ~37.665N 126.905E (approximate). Han bridges: two I Corps spans directly below Seoul, one M2 bridge ~4 mi east.
~600,000 civilians went south (p. 204).

## Unsure / approximate
- Exact bridgehead trace and the line C / line D east of Chunchon / Wonju (sketched).
- The RUR ambush site (Happy Valley) position is approximate.
- Script order: rear guard told after the bridges; in fact it was cut off the night before the last bridge was blown.
