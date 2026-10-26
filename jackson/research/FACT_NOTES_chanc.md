# FACT NOTES: Chancellorsville maps (MOVE 3: `chanc` close-up + the `nova3_` control overlays)
Checked 2026-10-16. Sources: Hotchkiss, *Map of the battle of Chancellorsville, Saturday, May 2nd 1863* (LoC, assets/media/archive_hotchkiss_chancellorsville_may2.jpg);
OpenStreetMap (historic=* nodes of the NPS battlefield markers + the modern roads that follow the 1863 roads; API 0.6, assets/src/chanc_osm.json);
NPS FRSP "The Flank Attack" / Civil War Series booklet (via research/FACT_NOTES.md); ABT Chancellorsville May 2 map (layout from memory,
not re-opened in this session). All numbers on screen come from research/FACT_NOTES.md.

## Story places (lat, lon) -> where they come from
| Place | Used | Source / check |
|---|---|---|
| Chancellorsville crossroads (Chancellor house) | 38.3085, -77.6343 | OSM locality 38.3085,-77.6344; Old Plank Rd (SR 610) leaves VA 3 at 38.3083,-77.6342; Hotchkiss: house at the Turnpike/Plank Rd fork |
| Fairview | 38.3072, -77.6431 | OSM historic=battlefield "Fairview" |
| Hazel Grove | 38.3033, -77.6520 | OSM historic=battlefield 38.3036,-77.6514 + neighbourhood 38.3029,-77.6533 |
| Catharine Furnace | 38.2887, -77.6482 | OSM ruins "Catharines Furnace Ruins" 38.28868,-77.64821; Jackson Trail East ends at it |
| Wilderness Church | 38.3117, -77.6707 | OSM Wilderness Baptist Church (on the historic church site, VA 3); Hotchkiss: church north of the pike, where the Plank Rd joins |
| Dowdall's Tavern | 38.3105, -77.6660 | APPROX: east of the church on the pike (Hotchkiss "Melzi Chancellor"); 154th NY monument at 38.3099,-77.6663 |
| Talley farm / von Gilsa's flank | 38.3186, -77.6922 | APPROX (+-200 m): west end of the XI Corps line on the pike (Hotchkiss "Talley"); NOT checked against the ABT map |
| Lee-Jackson bivouac (cracker boxes) | 38.2955, -77.6255 | APPROX: Plank Rd (SR 610) at the Furnace Rd fork (Hotchkiss "Lee and Jackson Friday night"); modern "Lee Jackson Circle" 38.2922,-77.6355 is a subdivision name, not used |
| Jackson's wounding site | 38.3107, -77.6499 | OSM "Jackson Monument" (the 1888 marker) 38.31074,-77.64991, by the Plank Rd; Mountain Road hand-drawn just north of it (APPROX) |
| Wilderness Tavern | 38.3246, -77.7228 | OSM ruins "Wilderness Tavern Site" |
| US Ford | 38.369, -77.610 | APPROX: Rappahannock ~1 mi below the Rapidan mouth (OSM river line); Kelly's 38.477,-77.765, Germanna 38.378,-77.788, Ely's 38.372,-77.692 (nova wide shot, APPROX) |
| Fredericksburg | 38.3032, -77.4605 | town centre |

## Roads (1863 roads <- modern roads on their line; tools/make_chanc_geo.py)
- Orange Turnpike = VA 20 (Constitution Hwy) west of Wilderness Tavern + VA 3 from the VA 20 junction to Chancellorsville and east.
  The Plank Road shared it from Wilderness Church/Dowdall's to Chancellorsville (Hotchkiss).
- Orange Plank Road = SR 621 west of Wilderness Church; Old Plank Road SR 610 east of Chancellorsville.
- Brock Road = SR 613 (north end meets VA 3 at 38.3229,-77.7091 = where the column reached the Turnpike).
- Furnace Road (bivouac -> Catharine Furnace): HAND-DRAWN, approximate.
- March route (chanc_route.json): Furnace Rd -> furnace -> Jackson Trail East (south) -> Brock Rd (brief, south) -> Jackson Trail West (the
  woods road, "Route of Second Corps" on Hotchkiss) -> Brock Rd north across the Orange Plank Road -> the Turnpike. NOT via the Plank Road.
  Drawn length from the bivouac = ~9.4 mi; the narration/ticker says "more than twelve miles" (FACT_NOTES: the corps' march from its camps);
  the ticker shows 12+ MILES as the narration does.
- Modern reservoirs (Lake Wilderness, Lake of the Woods, Fawn Lake) are NOT drawn (did not exist in 1863).

## Lines per time (chanc, option 2; tools/make_chanc_control.py)
- Night 1 May - 2 May afternoon: Union arc: Meade (V) from the Rappahannock south to the Turnpike east of Chancellorsville, Hancock (II)
  east of the crossroads, Slocum (XII) south of it (Fairview), Sickles (III) at Hazel Grove, Howard (XI) along the Turnpike west to Talley's.
  Two-colour only where Lee's men faced it (Hancock -> Hazel Grove); the XI Corps segment one-colour (nobody in front = "in the air").
- 2 May ~5:15 pm: Jackson's start line ~-77.703 (Rodes front, Colston ~500 m behind, A.P. Hill on the pike), 38.3035-38.3295 (~2 mi wide,
  narration "nearly two miles"), just east of the Brock Road junction.
- ~7:15 pm halt: Confederate line ~-77.6545 (about a mile west of Chancellorsville); Union west-facing line ~-77.6475 (Berry at Fairview /
  the Plank Road) joined to the old southern arc. Sweep distance drawn ~2.9 mi ("more than two miles").
- 18th North Carolina placed just west of the wounding site, astride/north of the Plank Road (APPROX); Union guns fire from Fairview.

## nova3 control (option 1; tools/make_nova3_control.py)
- 28 Apr / 6 May: Union = north/east of the Rappahannock from Rappahannock Station to below Fredericksburg (traced on the OSM river line),
  Stafford + King George to the Potomac, the Washington defences (outposts Centreville / Union Mills / Occoquan), the lower Valley
  (Winchester, Milroy, until 14 Jun 1863), Maryland, the Eastern Shore. Confederate/contested = everything else in Virginia incl.
  Loudoun/Fauquier (Mosby) and the Northern Neck east of the army's left. Approximate (5-10 km) away from the Rappahannock front.
- 30 Apr: + the Chancellorsville pocket south of the Rapidan/Rappahannock (Germanna / Ely's / US Ford to Chancellorsville) + Sedgwick's
  bridgehead below Fredericksburg (Franklin's Crossing, 29 Apr). King George County as Union-held is a simplification (patrolled, not held).

## Unsure / to double-check
Talley farm + von Gilsa's exact spot; Dowdall's Tavern; the bivouac + Furnace Road line; the Mountain Road line; US Ford exact point;
the 18th NC position; "~9-9:30 pm" (NPS 9:00, EVA 9:30, as FACT_NOTES); the amputation card says "~2 A.M., 3 MAY" (FACT_NOTES) with no place.
