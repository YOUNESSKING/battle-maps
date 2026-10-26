# FACT NOTES: `nova` + `bullrun` maps (MOVE 2 agent, Stonewall Jackson #11)
Geo layers READY for reuse (read-only): `assets/media/bullrun_geo_ref.png` + `bullrun_data.json` (tools/make_bullrun_geo.py),
`assets/media/nova_geo_ref.png` + `nova_data.json` (tools/make_nova_geo.py), control overlays `assets/media/nova_ctl_{aug25,aug27,sep02}_mx.png`
+ `nova_fronts.json` (tools/make_nova_control.py). Projections: nova = GG.proj(10, 73052, 99749); bullrun = GG.proj(13, 595316, 802062).
OSM via Nominatim (Overpass mirrors all failed on 2026-10-16: 500/504/reset). Small streams on bullrun = DEM-traced (make_rivers_dem.py).

## Story-place coordinates (checked)
Method: OpenStreetMap / Nominatim positions of the NPS-marked features (Manassas National Battlefield Park trails, houses, peaks) and the
modern towns on the 1862 sites, cross-checked against the NPS Second Manassas battle maps (Hennessy/NPS troop-movement maps) and the
ABT Second Manassas maps by relative position (Groveton crossroads - Dogan house - Deep Cut north of it - Brawner farm ~1 mi west -
Stone House at the Sudley Road crossroads - Henry Hill SE of it - Stone Bridge on Bull Run). Accuracy ~100-300 m.
| place | lat, lon | source / note |
|---|---|---|
| Groveton (crossroads, Warrenton Tpk x Groveton Rd) | 38.8126, -77.5483 | OSM locality "Groveton, Prince William Co."; Dogan house 38.8129,-77.5493 next to it (NPS) |
| Brawner farm (house) | 38.8160, -77.5655 | NPS Brawner Farm loop trails (38.813,-77.564 / 38.820,-77.560); ~1 mi W of Groveton, N of the pike (NPS/ABT maps). UNSURE ~300 m |
| Deep Cut | 38.8255, -77.5530 | NPS "Deep Cut" trailhead 38.8206,-77.5497 (Featherbed Lane) + "Unfinished Railroad" trailhead 38.8257,-77.5486; the cut itself ~0.6 mi NNW of Groveton on the RR bed. UNSURE ~300 m |
| Unfinished railroad | hand-traced, Gainesville area -> N of Brawner farm -> Deep Cut -> Sudley | NPS map (Jackson's line Sudley Church -> Deep Cut -> Brawner farm, ~2 mi of the RR bed + Stony Ridge behind it); OSM trailheads on the bed |
| Stony Ridge | 38.830, -77.580 (label) | wooded ridge NW of the RR bed above the Brawner farm (NPS); label only |
| Stone House | 38.8124, -77.5278 | NPS (Warrenton Tpk x Sudley Rd) |
| Henry Hill / Henry House | 38.8132,-77.5213 / 38.8148,-77.5227 | OSM peak + house (NPS) |
| Chinn Ridge | 38.8095, -77.5327 | OSM peak |
| Matthews Hill | 38.8252, -77.5321 | OSM peak |
| Stone Bridge | 38.8245, -77.5035 | OSM bridge "Stone Bridge" (NPS) |
| Sudley Church / Sudley Springs | 38.8407,-77.5380 / 38.8412,-77.5378 | OSM |
| Battery Heights | 38.8119, -77.5572 | OSM peak |
| Thoroughfare Gap | 38.8246, -77.7158 | OSM "Thoroughfare Gap" (Broad Run / Manassas Gap RR through the Bull Run Mts) |
| Salem (= today's Marshall) | 38.8647, -77.8580 | OSM town Marshall (renamed 1882; Salem in 1862) |
| Jeffersonton / Amissville / Orlean / The Plains | 38.6371,-77.9150 / 38.6715,-77.9956 / 38.7526,-77.9639 / 38.8625,-77.7741 | OSM hamlets |
| Hinson's Mill ford (Rappahannock) | ~38.680, -77.965 | approximate (~1.5 mi E of Amissville on the river); not in OSM. UNSURE ~1 km |
| Haymarket / Gainesville | 38.8121,-77.6368 / 38.7961,-77.6126 | OSM |
| Bristoe Station | 38.7225, -77.5405 | O&A RR at Broad Run (ABT Bristoe Station battlefield; OSM Bristow 38.731,-77.548 = the modern village) |
| Manassas Junction | 38.7509, -77.4753 | OSM Manassas city centre = the 1862 junction of the O&A and Manassas Gap RRs |
| Centreville | 38.8388, -77.4316 | OSM |
| Warrenton / Waterloo / Rappahannock Station (Remington) / Kelly's Ford / Catlett | 38.7135,-77.7954 / 38.696,-77.906 / 38.5337,-77.8081 / ~38.479,-77.781 / 38.6537,-77.6405 | OSM (Kelly's Ford approx.) |
| Aquia Landing / Falmouth / Fredericksburg / Alexandria / Washington | 38.396,-77.318 / 38.324,-77.468 / 38.3001,-77.4571 / 38.8051,-77.047 / 38.895,-77.0365 | OSM (Aquia Landing approx. at the creek mouth) |

## Roads / railroads (1862)
- Warrenton Turnpike = today's US 29 (Lee Hwy) Gainesville - Groveton - Stone House - Stone Bridge - Centreville (NPS). Hand-traced.
- Manassas-Sudley Road = VA 234 old alignment (Manassas - Stone House - Sudley Springs).
- Orange & Alexandria RR: Alexandria - Manassas Jct - Bristoe - Catlett - Warrenton Jct - Rappahannock Station - Culpeper - Orange - Gordonsville.
- Manassas Gap RR: Manassas Jct - Gainesville - Haymarket - Thoroughfare Gap - The Plains - Salem - Manassas Gap - Front Royal - Strasburg.
- RF&P: Aquia Landing - Falmouth/Fredericksburg - south. All three hand-traced through the stations (straight legs, ~1 km accuracy).

## Jackson's march (25-26 Aug 1862)
Route per NPS / FACT_NOTES: Jeffersonton - Hinson's Mill ford - Amissville - Orlean - Salem (night 25) - The Plains - Thoroughfare Gap -
Haymarket - Gainesville - Bristoe Station (sunset 26). Straight-leg length on the map = 42 mi; road distance ~55 mi (NPS "about 55 miles in
two days"); the on-screen counter is scaled to the drawn line and ends at 55 MILES (NPS figure, FACT_NOTES).

## Control map (option 1, nova)
| date | Union-held | source |
|---|---|---|
| aug25 | Maryland + Virginia north/east of Pope's Rappahannock line (Kelly's Ford - Rappahannock Station - Sulphur Springs - Waterloo), Fredericksburg/Falmouth (Burnside), above Waterloo along the Blue Ridge side to the lower Valley (Winchester garrison) = same line as virginia_ctl_aug62 | NPS Second Manassas; virginia agent |
| aug27 | as aug25 minus Jackson's corridor (Hinson's Mill - Salem - Thoroughfare Gap - Gainesville - Bristoe, ~7 km wide) and the Bristoe - Manassas Junction pocket | NPS (Ewell at Bristoe, Jackson/Hill/Taliaferro at the Junction 27 Aug) |
| sep02 | only the Washington defences (Arlington - Alexandria) + Harpers Ferry + Maryland (= virginia_ctl_sep62 polygons); Fredericksburg evacuated 31 Aug, Winchester 2 Sep | NPS/ABT; virginia agent |
Pope's Rappahannock positions approximate (corps not placed individually beyond ~3-5 km).

## Close-up fronts (option 2, bullrun), lat/lon in scenes-src/move2b.js
- 28 Aug evening, Brawner's Farm: Gibbon's brigade (+ Doubleday) of KING's division in line north of the turnpike facing the Brawner farm;
  Jackson's (Taliaferro's + Ewell's) line on the ridge NW of the farm; ~80-100 yds apart (NPS). Simplified to two parallel lines ~250 m.
- 29 Aug: Jackson on the unfinished railroad, Sudley Church - Deep Cut - Brawner farm area (NPS); Union attacks from the east (Sigel,
  Hooker, Kearny, Reno: piecemeal); Longstreet arrives ~noon via Thoroughfare Gap / Gainesville and deploys from the Brawner farm south
  across the turnpike towards the Manassas Gap RR, angled forward (the "jaw") (NPS).
- 30 Aug ~3 pm: Porter's attack (~6,000-8,000) across the Groveton/Dogan fields at the Deep Cut; ~4 pm Longstreet's ~25,000 east across
  the turnpike to Chinn Ridge and Henry Hill; dusk: Union rear guard on Henry Hill, retreat over Bull Run (Stone Bridge) to Centreville.

## On-screen items in move2a/b/c (where from)
- Union corps labels on the Rappahannock (SIGEL, McDOWELL, BANKS, RENO, BURNSIDE at Falmouth) and King's brigades (GIBBON, DOUBLEDAY,
  HATCH), the 29 Aug attackers (SIGEL, HOOKER, KEARNY, RENO), PORTER, McDOWELL, Longstreet's divisions (HOOD, KEMPER, JONES, WILCOX):
  standard order of battle (NPS/ABT); positions approximate. Trains wrecked at Bristoe the evening of 26 Aug (NPS/Henderson; no numbers shown).
- "POPE BELIEVES: JACKSON IS HEADED FOR THE SHENANDOAH VALLEY" = paraphrase card (no quote marks), as the narration.
- "BAG THE WHOLE CROWD" (phrase only, quoted), Pope to Halleck "THE ENEMY IS RETREATING TOWARDS THE MOUNTAINS" (Henderson's OR text; on
  the double-check list), eyewitness lobster quote (NPS), Worsham's list shown without quote marks ("A CONFEDERATE OF THE 21ST VIRGINIA").
- Brawner's Farm: "NEARLY ONE THIRD OF 7,000 ENGAGED HIT" (NPS). Porter "6,000+" (NPS 6,000-8,000). Longstreet "~25,000" (narration).
- Pope "REMOVED FROM COMMAND · WITHIN TWO WEEKS · SEPTEMBER 1862" (12 Sep date not shown: on the double-check list).
- Casualty card: UNION ~14,500 (incl. ~4,300 missing) · CONFEDERATE ~7,400 (campaign, ABT), FACT_NOTES.
- Mileage counter: scaled to the drawn route, ends at 55 (NPS "about 55 miles in two days").
