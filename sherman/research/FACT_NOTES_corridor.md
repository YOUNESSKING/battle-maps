# FACT NOTES: `corridor` map (z10, 34.30N 84.85W; extent ~33.38N-35.21N, 86.83W-82.87W) - MOVE 1 agent
Built by `tools/make_m1_maps.py` (from sherman/). The hook agent may reuse these files read-only (hook-1 zoom target, hook-2).

## Files (ready 2026-10-28)
- Control overlays (multiply, `mixBlendMode = "multiply"`, place at 0,0,2880,1620): `assets/media/corridor_ctl_<date>_mx.png` for
  **may64, may13, may19, may25, jun15, jun27, jul10, aug64, sep64**. Union-held = blue (110,160,255); Confederate-held = red (232,52,52),
  brighter rim where the sides meet. Same convention as `south_ctl_*` (tools/make_south_control.py): Tennessee + north Alabama above the
  Tennessee River = Union on every date; Georgia = Union west/north of the line of the date (closed along the north); the rest = Confederate.
- Fronts (map px, 24 points each, Union on the LEFT of the travel direction -> `K.front({ pts, sideA: "carth", sideB: "rome" })`, and any two
  can morph with `to` + `moveT`): `assets/media/corridor_fronts.json` keys may64 may13 may19 may25 jun15 jun27 jul03 jul10 jul22 aug64 sep64
  jon31 jon01.
- Geography: `assets/media/corridor_geo_ref.png` (2x, 5760x3240, place at 0,0,2880,1620): state lines, streams traced from the HD elevation
  (tools/make_rivers_dem.py), the big rivers routed along Natural Earth (Tennessee, Chattahoochee, Etowah, Oostanaula, Coosawattee,
  Conasauga), the 1864 railroads (thin dark line + cross-ties: Western & Atlantic, Georgia RR, Macon & Western, Atlanta & West Point, East
  Tennessee & Georgia to Cleveland, Rome branch, Nashville & Chattanooga), 1860 big towns (CHATTANOOGA, CLEVELAND, ROME, MARIETTA,
  ATLANTA, GAINESVILLE, HUNTSVILLE) + water names. `corridor_lines.json`: {rail: {WA, GARR, MW, AWP, ETG, ROME, NC}, river: {...},
  ridge: {ROCKY_FACE, SNAKE_GAP, KENNESAW}} in map px for glows. `corridor_rivers.json`: LV.shimmer paths.

## Control per date (approximate, ~2-5 km at the contact line, coarser on the flanks; z10 = 126 m/px)
Sources: ABT battle pages (Rocky Face Ridge, Resaca, Adairsville, New Hope Church, Pickett's Mill, Dallas, Kennesaw Mountain, Peachtree
Creek, Atlanta, Ezra Church, Utoy Creek, Jonesboro), NPS Kennesaw Mountain NBP, Sherman's Memoirs vol. 2 + OR 38 (FACT_NOTES.md), the
LoC Atlanta campaign maps (positions known from them; not re-fetched: loc.gov 403). Places: Dalton 34.770N 84.970W, Mill Creek Gap 34.797N
85.008W (the low point in the ridge on the DEM, the W&A cut), Rocky Face Ridge crest traced on the HD elevation (34.70-34.88N, ~85.01-85.02W),
Snake Creek Gap 34.66-34.70N 85.05-85.10W (Villanow 34.716N 85.137W -> Sugar Valley -> Resaca), Resaca 34.578N 84.943W (Oostanaula bridge),
Lay's Ferry ~34.535N 84.98W (label only; name = double-check list), Cassville 34.245N 84.852W, Allatoona Pass 34.112N 84.711W, Dallas
33.924N 84.841W, New Hope Church 33.95N 84.80W, Pickett's Mill 33.975N 84.76W, Pine Mountain 34.00N 84.66W, Kennesaw Mountain 33.983N
84.578W, Cheatham Hill 33.945N 84.612W, Pigeon Hill 33.968N 84.600W, Marietta 33.953N 84.550W.
- may64 (7-12 May): front = Rocky Face Ridge (Johnston on the crest + Mill Creek Gap, Dalton behind) and the line north of Dalton (Crow
  Valley); Thomas at Tunnel Hill / in front of the ridge, Schofield north, McPherson coming via Villanow (west of the ridge = Union side).
- may13 (13-15 May): the Resaca line from the Oostanaula west of the town north along Camp Creek to the Conasauga (ABT Resaca).
- may19: Cassville (Johnston's line on the ridge east of the town, 19 May; Rome taken 18 May). Johnston crossed the Etowah 20 May.
- may25 (25 May - early Jun): Dallas - New Hope Church - Pickett's Mill; Allatoona Pass bypassed (Sherman left the railroad 23 May; Union
  cavalry at Allatoona 1 Jun).
- jun15: Lost Mountain - Pine Mountain - Brush Mountain (Polk killed on Pine Mountain 14 Jun; Johnston back to Kennesaw 18-19 Jun).
- jun27: the Kennesaw line: Big + Little Kennesaw, Pigeon Hill, Cheatham Hill, south to Olley's Creek (NPS).
- jul03 (fronts only): the Smyrna line (Johnston left Kennesaw the night of 2 Jul).
- jul10: the Chattahoochee (Johnston's river line evacuated 9 Jul; Union bridgeheads at Sope Creek (Schofield, 8 Jul) and Roswell).
- jul22 (fronts only here; overlay on the atlanta map): the arc north and east of Atlanta (Peachtree Creek 20 Jul, Bald Hill 22 Jul).
- aug64 (August, siege; the hook's Lincoln memo date 23 Aug): siege lines north, east and west of Atlanta (Ezra Church 28 Jul, Utoy
  Creek 6 Aug); Atlanta itself Confederate; NW Georgia behind the line filled as one Union zone (in reality garrisoned along the W&A,
  Confederate cavalry raided it) - same simplification as south_ctl_aug64.
- sep64 (2-5 Sep): Atlanta Union (surrendered 2 Sep; XX Corps from the river), the army south to Jonesboro and Lovejoy's Station, where
  Hood's army stood (Union back to Atlanta ~7-8 Sep). Front at Lovejoy's (33.43-33.44N). NOTE for the hook: south_ctl_sep64 shows the
  later state (Atlanta's south side only); for 2 Sep this one is right.
- East edge of the Union zone in Georgia (~84.2-84.6W) follows south_ctl (no Union presence in the NE Georgia mountains).
- Option 2 (close-ups): use the fronts JSON with `K.front` width 15, glow 0.47.
