# FACT NOTES: MOVE 3 maps (`carolinas` z9, `bentonville` z13, theatre variant on `south`) - MOVE 3 agent

## Files
- `tools/make_m3_rivers.py` -> `assets/src/{carolinas,bentonville}_m3_rivers.json`: named rivers traced DOWNHILL on the HD DEM (pysheds,
  copied from greene2/tools/make_carolinas_rivers.py). Checked by eye against the basemap: SAVANNAH (Augusta -> sea), SALKEHATCHIE
  (Barnwell area -> passes Rivers' Bridge 33.0565N 81.0941W -> cut at the Little Salkehatchie mouth ~32.80N 80.84W -> COMBAHEE), EDISTO
  (North Fork, past Orangeburg), CONGAREE (Broad above Columbia -> Columbia -> Wateree mouth -> SANTEE), PEE DEE (past Cheraw -> Winyah
  Bay), CAPE FEAR (Deep River mouth -> Fayetteville -> Wilmington), NEUSE, WATEREE. Natural Earth has no Salkehatchie, hence the DEM.
  Bentonville: MILL CREEK traced from the OSM stream head (35.2918N 78.4053W, Nominatim) - the DEM trace overlays the OSM way where OSM has it.
- `tools/make_m3_geo.py` -> `assets/media/{carolinas,bentonville}_geo_ref.png`, `_rivers.json` (shimmer), `_swamp.png` (flooded swamp:
  blurred mottled water along the low river courses, carolinas only below ~70 m elevation; SCHEMATIC, wider than the real flood plains at z9).
  Big 1860 towns on carolinas: Savannah, Augusta, Charleston, Columbia, Wilmington, Raleigh, New Bern. State lines = Natural Earth.
- `tools/make_m3_control.py` -> `assets/media/carolinas_ctl_{feb01,feb18,mar15,mar23}_mx.png`, `carolinas_ctl_band{1,2,2b,3,3b,4}_mx.png`,
  `m3_south_ctl_mar23_mx.png`. Polygons reuse tools/make_south_control.py (HOOK agent, read-only).

## Control per date (fixed Union ground; ~5-10 km)
- feb01 (~1 Feb 1865): Savannah (21 Dec 1864), Fort Pulaski/Tybee, Port Royal/Beaufort/Hilton Head + Sea Islands, the Pocotaligo
  bridgehead (Howard's XVII Corps by sea to Beaufort, Pocotaligo taken 14-15 Jan 1865), Morris/Folly Is.; NC: New Bern-Beaufort, Roanoke
  Is./Hatteras, Plymouth (31 Oct 1864), Fort Fisher / Federal Point (15 Jan 1865); Norfolk; Tennessee (incl. upper East TN, as south feb65).
- feb18: + SC coast to Charleston (evacuated night 17 Feb, occupied 18 Feb).
- mar15: + Wilmington (22 Feb), Georgetown (25 Feb, south's SC_APR65), Kinston (Schofield, 14 Mar).
- mar23: + Goldsboro (Schofield 21 Mar, Sherman 23 Mar) and the rail belt to Kinston/New Bern.
- The army's swath (band stages, ~45 km wide around a centre line Pocotaligo/Savannah - Rivers' Bridge - Orangeburg - Columbia - Cheraw -
  Fayetteville - Bentonville - Goldsboro): band1 to Orangeburg (~12 Feb), band2 to Columbia (17 Feb), band2b + Charleston (18 Feb), band3 to
  Fayetteville (11 Mar), band3b to Averasboro (16 Mar), band4 to Goldsboro (23 Mar). Like MOVE 2, the swath stays blue behind the army
  (a moving army, not a front). Width is illustrative (the wings were often 20-40 miles apart); no number shown.
- m3_south_ctl_mar23 (move3c start, 23 Mar - ~16 Apr): south feb65 + Georgetown + Kinston + Goldsboro + Pocotaligo + Federal Point.
  move3c cross-fades to the HOOK agent's south_ctl_apr65 at "On the seventeenth of April" (Raleigh 13 Apr, Durham's Station, Virginia
  after Appomattox).

## Story places (checked)
- Rivers' Bridge 33.0565N 81.0941W (Rivers Bridge State Historic Site, Nominatim); Pocotaligo 32.637N 80.863W; Sister's Ferry ~32.47N 81.27W
  (approx.); Orangeburg 33.49N 80.86W; Columbia 34.00N 81.035W; Cheraw 34.698N 79.883W; Fayetteville 35.0525N 78.878W; Averasboro (museum)
  35.266N 78.672W; Bentonville village 35.3488N 78.2969W; Goldsboro 35.385N 77.993W; Smithfield 35.511N 78.346W; Raleigh 35.78N 78.639W;
  Bennett Place 36.029N 78.976W (Nominatim) / Durham 35.997N 78.902W; Greensboro 36.073N 79.792W; Appomattox CH 37.377N 78.796W;
  Fort Sumter 32.752N 79.875W.
- Bentonville battlefield (OSM historic markers): Harper House 35.302N 78.3231W, Morris farm ("Confederate Assault/Morris Farm") 35.3084N
  78.309W, Cole plantation 35.3163N 78.3024W, Johnston's HQ 35.347N 78.2928W, Sherman's HQ 35.3305N 78.2721W, Hardee's Countercharge
  35.3466N 78.294W. MILL CREEK BRIDGE placed where the road north from Bentonville crosses Mill Creek, ~35.362N 78.290W (approx., ~1.5 km
  N of the village; the DEM/OSM creek loops north of the village there). TODO verify against the NC Historic Sites map.
- Lines: 19 Mar hook (Hoke across the Goldsboro road, Army of Tennessee bent back NW in the woods), Union left (Carlin) driven back to the
  Morris farm, Morgan + XX Corps hold: SCHEMATIC after ABT / NC Historic Sites maps. 21 Mar: Johnston's U-shaped line with Mill Creek behind;
  Mower (XVII Corps) from the east toward the village + bridge, overruns Johnston's HQ area; Hardee's countercharge near the village.
- Rivers' Bridge close-up: SCHEMATIC, ~2.4x enlarged around the real spot on the z9 map (no z13 bake). ~1,200 Confederates (SC Enc.);
  Mower's + G. A. Smith's divisions (Memoirs: water up to their shoulders).

## Numbers / captions used (all from FACT_NOTES.md)
60,079 men · 68 guns (1 Feb 1865, Memoirs); "a full mile" (Salkehatchie, Memoirs) -> A MILE WIDE; IMPASSABLE? (Sherman's own word, Memoirs);
~1,200 (Rivers' Bridge, SC Enc.); NEARLY EVERY MILE CORDUROYED · SHERMAN, MEMOIRS (paraphrase, no quote marks); NO SUCH ARMY SINCE THE DAYS
OF JULIUS CAESAR - ATTRIBUTED TO J. E. JOHNSTON (no quote marks); ABOUT ONE-THIRD OF THE CITY BURNED (SC Encyclopedia); WHO STARTED IT IS
STILL DISPUTED · BURNING COTTON · HIGH WIND · DRUNKEN SOLDIERS; CHARLESTON GIVEN UP · WITHOUT A FIGHT · 17-18 FEB 1865 (the script note's
"NOT A SHOT AT ITS FORTS" was NOT used: the forts had been under naval/Morris Island fire for two years); Johnston BACK IN COMMAND · 23 FEB
1865 (FACT_NOTES: 22-23 Feb, double-check); FAYETTEVILLE 11 MAR · ARSENAL DESTROYED; AVERASBORO 16 MAR; ~20,000 (NCpedia/ABT ~21,000);
CASUALTIES 1,527 / 2,606 (OR / ABT); "I THINK I MADE A MISTAKE THERE" - SHERMAN · MEMOIRS (1875); 88,948 on 10 Apr (Memoirs); 28,231 paroled
at Appomattox (NPS); Lincoln shot 14 Apr, died 15 Apr; 26 APRIL SURRENDER; 89,270 (NC Historic Sites).
