# Move 2 maps (move2a nwkorea / move2b kunuri / move2c korea): control map log + sources
Owner: the MOVE 2 map agent. Generators: `tools/make_nwk2_control.py` (nwk2_ctl_nov24/nov26/nov28_mx.png + nwk2_fronts.json),
`tools/make_kunuri_osm.py` + `tools/make_kunuri_geo.py` (kunuri_geo_ref.png + kunuri_data.json), `tools/make_nwk2_inline.py` (inlines
the data into scenes-src/move2a/b/c.js; re-run after any generator). move2c reuses the hook agent's korea_ctl_nov24 / dec15 (read-only).
Accuracy: ~3-5 km on nwkorea (z9), ~0.5 km on kunuri (z12). Main source: Mossman, *Ebb and Flow* (CMH), ch. IV-VIII, OCR text
archive.org DTIC_ADA232745.

## Place positions
- **Kunu-ri = modern Kaechon (39.70N 125.90E, OSM 군우동 quarter of Kaechon).** Checks: Mossman "Pugwon, on the lower bank of the
  Ch'ongch'on five miles above Kunu-ri" (Pugwon/Pongchon station 39.78N 125.94E); "Wa-won, about ten miles east of Kunu-ri" (Wawon 39.72N
  126.07E); Kunu-ri-Sunch'on road ~20+ mi. NOTE: hook-a.js labels KUNU-RI at 39.50N 125.93E (the kunuri basemap centre) = ~22 km too far
  south; the hook agent should move it to 39.70N 125.90E.
- Gauntlet road = OSM Kaechon -> Sunchon road (follows the 1950 valley road, 26 mi incl. modern bends). Division CP "six miles below
  Kunu-ri"; the fire block "centered in a pass four miles south [of the CP] just above the village and railroad station of Yongwon"
  (Mossman p. 115) -> the pass = highest point of the road 8-12 mi below Kunu-ri = 10.8 mi (computed from the elevation).
- Fire block drawn 6.3 -> 12.3 mi below Kunu-ri ("about six miles", Appleman 1989 via Wikipedia); Mossman: the 113th Division's two
  regiments "strengthening their elongated fire block. The heaviest fire fell in the pass"; fire started "no more than a half mile south
  of division headquarters".
- 23rd Infantry: "Kunu-ri-Sinanju-Sukch'on route" (Mossman p. 118-126) -> the western arrow Kunu-ri -> Anju -> Sinanju -> Sukchon.
- Peng's HQ (25 Nov air strike) drawn generically in the mountains north of the front (40.22N 125.55E), NO place name (Taeyu-dong position unverified).

## Fronts per date (nwkorea, option 1; WEST -> EAST, communist side north)
| date | line | source |
|---|---|---|
| 24 Nov | I Corps on Route 1 half-way to Chongju, ROK 1st Div 4 mi short of Taechon; 25th Div astride the Kuryong ~4 mi SE of Unsan; 2nd Div on the Paengnyong River in the Chongchon valley (its 15-mi front ~20 mi N of Kunu-ri on the 25th); ROK II Corps (7th, 8th Divs) in the mountains N of Tokchon; the empty Taebaek gap (dips to ~39.35N); X Corps Yudam-ni -> Hyesanjin -> NE coast | Mossman ch. IV p. 62-64 |
| 26 Nov noon | as 24 Nov in the west (Chongju taken 25th); the ROK II Corps front folded, Chinese in Tokchon by late morning; the line bends back SW from the 2nd Div's right | Mossman ch. IV-V ("near noon of the 26th, the ROK II Corps front folded"; Tokch'on blocked) |
| 28 Nov | I Corps back toward the Chongchon bridgehead (Pakchon), 25th Div on the Ipsok line, 2nd Div below Pugwon (lost night 27-28), Turks thrown back from Wawon to Sinnim-ni; 38th Army toward Kunu-ri / Samso-ri, 42nd Army toward Sunchon via Pukchang | Mossman ch. V-VI |
| 30 Nov (kunuri, option 2) | fire-block lines both sides of the road + a northern front arc on the Kunu-ri rear guard (40th Army) | Mossman ch. VI |
| 24 Nov -> 15 Dec (korea) | hook agent's korea_front_nov24 / dec15 | FACT_NOTES_korea.md |

## Unsure / approximate
- The 24/26/28 Nov fronts are smoothed sketches (no unit-level accuracy); the 26 Nov bend through Tokchon is drawn from the text.
- The road is the modern road (OSM); the 1950 road ran the same valley but may differ in detail; the pass point is computed, not mapped.
- "HUNDREDS OF TRUCKS LOST" shown as a pictogram row (12 icons), no number (Mossman: "hundreds of trucks and trailers").
- X Corps evacuation tag "TO 24 DEC" (Hungnam evacuation completed 24 Dec, FACT_NOTES_korea).
