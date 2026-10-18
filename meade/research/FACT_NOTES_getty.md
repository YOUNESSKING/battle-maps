# Gettysburg maps (`getty` z14, `getty15` z15): shared assets + control-map notes (MOVE 2 agent, 2026-10-18)

## READY (shared, read-only for the other agents)
| file | what |
|---|---|
| `assets/media/getty_geo_ref.png`, `getty15_geo_ref.png` | geography layer (5760x3240, show at 2880x1620, ABOVE the territory): 1863 roads as thin dark lines, the 1858 railroad east of town, streams, the compact 1863 town + GETTYSBURG label. No story labels burnt in. |
| `assets/media/getty_roads.json`, `getty15_roads.json` | `{road: [[x,y]...]}` map px: chambersburg_pike, york_pike, mummasburg_road, carlisle_road, harrisburg_road, hanover_road, fairfield_road, baltimore_pike, taneytown_road, emmitsburg_road, wheatfield_road, granite_schoolhouse |
| `assets/media/getty_rivers.json`, `getty15_rivers.json` | named streams (map px) for the living-map shimmer |
| `assets/media/getty_places.json` | story places `{key: {name, ll, getty: [x,y], getty15: [x,y] or null}}` for the small white-box labels |
| `assets/media/{getty,getty15}_ctl_<date>_mx.png` | option-1 multiply overlays (Union blue / Confederate red + rim): `jul1am`, `jul1`, `jul2am`, `jul2s` (Sickles's salient ~3 pm), `jul2pm`, `jul3` |
| `assets/media/getty_fronts.json` | `fronts[date][map]` = the boundary through the battle area, **traced with the UNION ON THE LEFT** -> `K.front({ pts, sideA: "carth", sideB: "rome", width: 15, glow: 0.47 })`; jul2am/jul2s/jul2pm/jul3 have the same point count (use as `to` + `moveT`). `lines[name][map]` = one-colour unit lines: `union_hook_jul2`, `csa_arc_jul2`, `sickles_jul2`, `ridge_south`, `plum_run_line`, `chord`, `outer_arc` (directions in the tool docstring). |
Tools: `tools/make_getty_osm.py` (OSM API 0.6 fetch -> `assets/src/getty_osm.json`, Overpass was down), `tools/make_getty_geo.py`,
`tools/make_getty_control.py`. Data (c) OpenStreetMap contributors (ODbL).

## Coordinates (checked against the OSM historic nodes = NPS monument / farm-building positions)
Leister House 39.8145N 77.2321W (OSM building; NPS Meade HQ monument 39.8145, -77.2323; the brief's 39.8136/-77.2333 was ~120 m off).
The Angle 39.8134, -77.2364 (NPS memorial). Copse of Trees ~39.8127, -77.2357. Cemetery Hill 39.8217, -77.2295 (peak; Evergreen
gatehouse 39.8208, -77.2293). Culp's Hill 39.8198, -77.2211 (peak). Little Round Top 39.7918, -77.2362 (OSM node 39.7911/-77.2357,
Warren statue 39.7925/-77.2367, Vincent's brigade HQ monument 39.7909/-77.2366). Big Round Top 39.7867, -77.2394. Devil's Den
39.7914, -77.2426. Wheatfield ~39.7968, -77.2440 (north of Rose Woods 39.7952/-77.2446). Peach Orchard 39.8010, -77.2482 (Sherfy house
39.8038/-77.2491; McGilvery monument in the orchard 39.8009/-77.2476). Trostle farm 39.8017, -77.2421. Plum Run line (McGilvery's
guns, monument 39.8040/-77.2347; Willard killed 39.8064/-77.2391): label at 39.8040, -77.2385. Codori 39.8109, -77.2404. Spangler's
Spring 39.8145, -77.2173. Powers Hill 39.8060, -77.2211. Benner's Hill 39.8260, -77.2143. McPherson barn 39.8370, -77.2513.
Barlow's Knoll 39.8450, -77.2265. Lutheran Seminary ~39.8315, -77.2445. Town centre (the Diamond) 39.8309, -77.2311.

## Roads (1863)
Modern roads on the 1863 lines (Bachelder / Warren maps, NPS + ABT maps): Chambersburg Pike = US 30 W; York Pike = US 30 E; Carlisle
Road = PA 34 N; Harrisburg Road = Old Harrisburg Rd; Hanover Road = PA 116 E; Fairfield (Hagerstown) Road = PA 116 W; Baltimore Pike =
PA 97; Taneytown Road = PA 134 (joined to the Emmitsburg Road at the foot of Cemetery Hill); Emmitsburg Road = Steinwehr Ave + US 15
Bus; Wheatfield Road (+ Millerstown Road west of the Peach Orchard); Granite Schoolhouse Lane. Hand joins inside the town (one-way
streets). Railroad: only the Gettysburg Railroad east of the depot (the line through the western railroad cut was finished in the
1880s; modern US 15 bypass and the Gettysburg & Northern omitted). The quarry pit east of the Baltimore Pike in the relief is modern.

## Control map per date (boundary midway between the lines; Confederate ground north/west of it)
- `jul1am` (~10 am 1 Jul): Heth deploying on Herr Ridge astride the Chambersburg Pike, Buford on McPherson's Ridge (ABT/NPS 1 Jul maps).
  Ewell's divisions not yet on the field (arrive from the north early afternoon).
- `jul1` (evening): Confederates hold the town (Rodes, Early at the foot of Cemetery Hill), Seminary Ridge north of the Fairfield Road,
  the ground north/east; Union on Cemetery Hill + Culp's Hill (Wadsworth), the rest south of the line unoccupied (drawn Union).
  Johnson's division drawn east of Rock Creek although it arrived only late that night (simplification).
- `jul2am`: the fishhook (ABT "Culp's Hill, curving around Cemetery Hill and proceeding down Cemetery Ridge") vs Johnson east of Rock
  Creek, Early/Rodes in + below the town, Hill on Seminary Ridge; boundary near the Emmitsburg Road (Union pickets on it) and Pitzer's
  Woods. East edge: Gregg's Union cavalry on the Hanover Road (Brinkerhoff's Ridge), Confederates north of it.
- `jul2s` (~3 pm): Sickles's III Corps forward from southern Cemetery Ridge to the Peach Orchard - Wheatfield/Rose Woods - Devil's Den,
  Humphreys along the Emmitsburg Road north to the Klingle/Codori farms (Meade OR: "half a mile or three-quarters of a mile" in front of
  the II Corps line). Longstreet on Warfield Ridge.
- `jul2pm` (night): Peach Orchard, Wheatfield, Devil's Den, Houck's Ridge, Trostle farm lost; the line held on Plum Run (McGilvery,
  Willard, Lockwood, 1st Minnesota), Little Round Top and Big Round Top (Union on Big Round Top from the night of 2 Jul); Emmitsburg
  Road / Codori between the lines. Steuart's brigade (Johnson) in the empty lower Culp's Hill works near Spangler's Spring (XII Corps
  had been sent south). East Cemetery Hill attack repulsed (line unchanged).
- `jul3` (~1 pm): lower Culp's Hill retaken by the XII Corps in the morning fight; the south = `jul2pm`.
Accuracy ~100-200 m; the exact skirmish zone is a drawing choice. Not checked line-by-line against the Bachelder map image (TODO if
the owner wants regiment-level precision).
