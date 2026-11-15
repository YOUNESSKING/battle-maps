## Maps (tools/bake_marion.sh; 2880 x 1620 map px, basemap image 5760 x 3240)

| map | zoom | centre | m / map px | lat .. lat, lon .. lon | baked for camera s |
|---|---|---|---|---|---|
| `lowcountry` | 10 | 33.55, -80.15 | 127.4 | 32.62 .. 34.45, -82.13 .. -78.17 | 0.8 (the opening framing Charleston - Camden needs s ~0.77) |
| `santee` | 13 | 33.47, -80.35 | 15.9 | 33.354 .. 33.586, -80.597 .. -80.103 | 1.6 |
| `blackriver` | 12 | **33.72, -80.12** (brief 33.70, -79.85) | 31.8 | 33.49 .. 33.95, -80.61 .. -79.63 | 1.3 |
| `blackmingo` | 13 | 33.63, -79.47 (**NEW map**) | 15.9 | 33.515 .. 33.745, -79.72 .. -79.22 | 1.6 |
| `congaree` | 13 | 33.75, -80.66 | 15.9 | 33.635 .. 33.865, -80.907 .. -80.413 | 1.6 |
| `edisto` | 13 | 32.86, -80.40 | 16.0 | 32.745 .. 32.975, -80.647 .. -80.153 | 1.6 |

- **blackriver moved west / blackmingo added:** a z12 map is 0.99 deg wide; Richardson's plantation (Rimini, -80.47; ~25 mi west of Ox Swamp, James) and
  Black Mingo (-79.43) are 1.04 deg apart, so one z12 map cannot hold both. `blackriver` now covers move 2 (Richardson's, Jack's Creek, Woodyard, Ox Swamp,
  Tearcoat, Benbow's Ferry, Kingstree); the new `blackmingo` z13 map covers m1-7 (Black Mingo Creek, Shepherd's Ferry, the plank bridge, Dollard's).
  Scene m1d must therefore be split: m1-7 on `blackmingo`, m1-8 / m1-9 on `blackriver` (or the lowcountry inset).
- `lowcountry` keeps the brief centre (Winnsborough 34.38,-81.09 is inside near the NW corner; Ninety Six 34.175,-82.02 at the west edge).

## THE 1780 SANTEE (how the pre-reservoir river was drawn)

- **Source = the TIGER county lines** (`kit/data/tiger_counties.json`, Census TIGERweb). South Carolina's county boundaries were fixed on the river
  channel long before the 1941-42 Santee-Cooper dams and still follow the OLD channel under Lake Marion. `kit/fetch_rivers.py` extracts the shared
  boundary runs: Santee = Sumter|Calhoun + Clarendon|Calhoun + Clarendon|Orangeburg + Clarendon|Berkeley + Williamsburg|Berkeley + Georgetown|Berkeley
  (then NHD North / South Santee in the delta); Congaree = Calhoun|Richland + Lexington|Richland; Wateree = Sumter|Richland (+ NHD Wateree above 33.98 N
  on `lowcountry`; Kershaw|Richland is a straight survey line, not used).
- **Checked against the pre-dam USGS quads** (topoView / TNM, GeoTIFF warped to web mercator): 1:48,000 Eutawville, Chicora, Manning, Mayesville,
  Bowman (all 1920), 1:62,500 Elloree (1946: the old channel is printed inside the new lake), Eastover (1943), Summerton (1971). The county line lies on
  the 1920 river channel to within the line width everywhere (proof: `build/santee_1780_proof.jpg`). NHD "Santee River" is never used (its artificial
  path runs through the reservoir).
- **Lake Marion, Lake Moultrie, Lake Wateree, Lake Murray are not water**: the land mask is elevation > 0.5 m (all four lakes are 20-110 m up); only
  the sea + the named rivers are water. No diversion / rediversion / tailrace canal is drawn (none is fetched), no dam, no I-95, no modern town.
- **Creeks under the lake**: Horse Creek traced from the 1920 Eutawville quad (`wet` in places.py, smooth curve). Scott's Lake (the oxbow at Fort Watson)
  is a hand polygon between the mound and the river channel, shape LOW (drowned since 1942; drawn as a narrow crescent like the oxbows on the 1920 quads).
- **Cypress swamp** (`kit/swamp.py`): floodplain from the DEM (height above the nearest story river <= 3-4 m, within 2.2-5.2 km) along the story rivers;
  under Lake Marion the flat lake surface comes back as swamp, then trimmed to the 1920 reality: the north (upland) edge of the Santee swamp traced
  on the 1920 Eutawville / Chicora / Manning quads (`SANTEE_N_EDGE`; the lake drowned ~1.5 km of upland beyond it) and no swamp on the bluff side south
  of the channel from Fort Watson to the coast road (`dry_south`; the 1920 river runs under the Eutaw / Vance bluffs). The Santee dam embankment strip
  (a modern ridge in the DEM) is forced to swamp (`SWAMP_DAM`). Scenes get the mask as `assets/<map>_m_swamp.png` (alpha) for "the swamps glow".

## Corrections against the relief, the river and the 1920 quads (2026-11-14)

- **Great Savannah (Sumter's house)**: brief 33.47,-80.25 (LOW) falls inside the 1920 Santee swamp. Moved to **33.4897,-80.3312**: the upland edge by
  "Savanna Branch" / Goodwill Church on the 1920 Eutawville quad, on the road ~6.8 km (~4 mi straight, ~6 mi by the road) above the ferry. Horse Creek
  runs through the swamp just south-east of it (PLACE `horse_creek_pass` 33.488,-80.305, LOW).
- **Nelson's Ferry**: 33.4307,-80.3256 confirmed (1920 quad "Nelson Ferry", where the Eutaw road meets the river); landings 33.4282 / 33.4352.
- **Eutaw Springs**: 33.408,-80.304 (1920 quad label "Eutaw Springs"; brief 33.407,-80.299).
- **Fort Watson**: 33.5391,-80.4376 confirmed on the north-bank swamp edge (Summerton 1971 "FORT WATSON"); Indian mound baked as a small relief bump.
- **Richardson's plantation**: brief ~33.70,-80.20 (LOW) contradicts its own "Rimini area" and James's distances (Tarleton chased ~25 mi from Jack's
  Creek to Ox Swamp). Placed at **33.672,-80.470** (Rimini, on the Nelson's Ferry - Camden road); Jack's Creek = the NHD Jacks Creek in Clarendon Co.
  (-80.44 .. -80.38; Richbourg's mill dam PLACE `jacks_creek_mill` 33.660,-80.420, LOW); Woodyard swamp not located (PLACE `woodyard_swamp` between, UNV).
- **Ox Swamp**: 33.716,-80.198 (HMdb marker), at the head of the NHD Ox Swamp creek; the Benbow's - Richardson's road runs past it through the swamp woods.
- **Benbow's Ferry**: brief ~33.75,-79.95 lies on Pudding Swamp, not the Black River. Snapped to the NHD Black River just below the Pocotaligo mouth, **33.6995,-80.0115** (~10.5 mi straight above Kingstree; the river runs W-E here): Marion's camp = the south (Kingstree) landing.
- **Shepherd's Ferry / plank bridge**: Shepherd's on the NHD Black Mingo Creek at 33.6225,-79.4350 (LOW); the creek runs N-S above it, so the plank
  (Willtown) bridge one mile upstream is at **33.6316,-79.4449** (1.6 km along the creek). Dollard's tavern (the Red House) 33.615,-79.440 on the south side.
- **Parker's Ferry**: 32.8595,-80.4015 on the NHD Edisto; landings 32.8605,-80.3985 / 32.8585,-80.4045; the road east of it runs on a causeway through
  the swamp (baked: pale raised bank under the ruts); ambush point PLACE `parkers_ambush` ~1 mile before the ferry, LOW.
- **Fort Motte**: the Motte house on the Buckhead bluff above the Congaree, **33.762,-80.6685** (1946 Elloree quad: the 200 ft hill over the river
  just west of Buckhead Creek; brief 33.761,-80.670). The old farmhouse "on the hill opposite" = across Buckhead Creek, 33.7549,-80.6565 (LOW).
- **McCord's Ferry** (Congaree, Fort Motte - Camden road) 33.758 / 33.776, -80.723 (LOW). **Murray's Ferry** (Santee, Kingstree - Monck's Corner road)
  33.462 / 33.446, -79.895 (LOW).
- Towns baked (1780 only): Charleston (city), Camden, Georgetown (towns), Kingstree, Jacksonborough, Monck's Corner (villages); plantation houses as single
  house sprites: Great Savannah, Eutaw Springs (santee), Richardson's (blackriver), Dollard's (blackmingo), the Motte house + farmhouse (congaree).
