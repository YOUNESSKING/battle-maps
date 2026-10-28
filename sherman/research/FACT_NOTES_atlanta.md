# FACT NOTES: `atlanta` map (z11, 33.64N 84.42W; extent ~33.17N-34.11N, 85.41W-83.43W) - MOVE 1 agent
Built by `tools/make_m1_maps.py` (from sherman/). The hook agent may reuse these files read-only (hook-1 zoom target, hook-2).

## Files (ready 2026-10-28)
- Control overlays (multiply, place at 0,0,2880,1620): `assets/media/atlanta_ctl_<date>_mx.png` for **jul10, jul22, aug64, sep64**
  (same rules as FACT_NOTES_corridor.md; same lat/lon lines, so a corridor -> atlanta zoom matches).
- Fronts (map px, 24 points, Union on the LEFT -> `sideA: "carth"`): `assets/media/atlanta_fronts.json` (same keys as corridor_fronts.json;
  jon31 / jon01 = Jonesboro close-up).
- Geography: `assets/media/atlanta_geo_ref.png` (2x), `atlanta_lines.json` (rail WA, GARR, MW, AWP, ...; river CHATTAHOOCHEE, FLINT),
  `atlanta_rivers.json` (shimmer). Towns: ATLANTA, MARIETTA, DECATUR, GRIFFIN, NEWNAN, COVINGTON.

## Places (checked; approx. +-300 m)
Atlanta (car shed / centre) 33.7525N 84.391W; city fortifications ~1.5 mi radius; Peachtree Creek battlefield 33.81-33.83N 84.37-84.43W
(Hood attacked north across the creek, 20 Jul); Bald Hill (Battle of Atlanta, 22 Jul, McPherson killed) 33.74N 84.34W, Decatur 33.774N
84.296W; Ezra Church 33.752N 84.444W (28 Jul); Utoy Creek ~33.715N 84.48W (6 Aug); W&A railroad bridge over the Chattahoochee ~33.838N
84.455W (XX Corps left there 25-26 Aug); Sope Creek mouth 33.92N 84.44W; East Point 33.679N 84.439W (M&W / A&WP junction); Red Oak 33.617N
84.497W + Fairburn 33.567N 84.581W (A&WP wrecked 28-29 Aug); Rough and Ready 33.632N 84.405W; Jonesboro 33.521N 84.354W; Flint River ~1.5 km
west of Jonesboro; Lovejoy's Station 33.437N 84.315W.

## Control per date
- jul10: the Chattahoochee line (see corridor notes). jul22: arc N + E of Atlanta (Thomas north of Peachtree Creek, McPherson + Schofield
  east via Decatur). aug64: siege lines N, E, W to Utoy Creek; Atlanta + the south (Macon & Western = the last line open) Confederate.
  sep64 (2-5 Sep): Atlanta Union down to Jonesboro/Lovejoy (Hood at Lovejoy's).
- 25-26 Aug night swing: no territory overlay of its own (armies moving: shown with arrows; XX Corps at the river bridge).
- Jonesboro 31 Aug: Howard's Army of the Tennessee across the Flint, entrenched west of the town; Hardee (his own + Lee's corps) attacked
  and was repulsed; Hood pulled Lee's corps back toward Atlanta that night (ABT: "Fearing a direct attack on Atlanta, Hood withdrew one
  corps from Hardee's force"); 1 Sep: Davis' XIV Corps broke the north end of Hardee's line (ABT; Union 1,149 / Confederate ~2,000).
  Night of 1 Sep: Hood blew up his ammunition trains (81 cars, count disputed: not shown) and left Atlanta; heard at Jonesboro.
