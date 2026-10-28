# `south` map (z8, 34.70N 79.60W): geography + control overlays (HOOK/SOUTH agent)

Tools: `tools/make_south_geo.py` (land mask, rivers, 1780 towns, labels), `tools/make_south_control.py` (control overlays),
`tools/make_south_inline.py` (river shimmer paths inlined into the scene files).

## Geography
- Rivers: Natural Earth 10m rivers_lake_centerlines + rivers_north_america (public domain), cached in `assets/src/south_rivers_ne.json`.
  The Virginia James is missing from NE 10m: drawn as a hand polyline through Lynchburg 37.42N 79.14W - Scottsville 37.79N 78.49W -
  Columbia 37.75N 78.16W - Richmond 37.53N 77.44W - City Point 37.31N 77.27W - Jamestown 37.21N 76.78W - Hampton Roads (approximate).
- Checked against the relief: the Dan passes Boyd's Ferry (36.69N 78.90W, South Boston VA) and the Catawba/Wateree passes Camden.
- Big 1780 towns in the layer: Charleston, Savannah, Augusta, Wilmington, Richmond, Petersburg, Williamsburg, Hillsborough, Halifax,
  Camden, Charlotte, Salisbury. Story places (white boxes in the scenes): Guilford Courthouse 36.131N 79.846W, Boyd's Ferry
  36.69N 78.90W, Yorktown 37.24N 76.51W, Hobkirk's Hill 34.265N 80.600W, Eutaw Springs 33.405N 80.290W, Ninety Six 34.146N 82.024W,
  Fort Watson 33.539N 80.433W (Scott's Lake), Fort Motte 33.737N 80.663W, Orangeburg 33.492N 80.856W, Cowpens 35.137N 81.817W,
  Kentish Guards / East Greenwich RI is off-map (caption only). No modern names (no Lake Marion label, no Greensboro).
- Colony names only as faint labels (VIRGINIA, NORTH CAROLINA, SOUTH CAROLINA, GEORGIA); no state lines drawn.

## Control overlays (option 1, `assets/media/south_ctl_<date>_mx.png`; red = British, blue = American)
Colonies east of ~83.1W only (soft fade west of it: Cherokee / Creek country is left untinted). SC/GA line = Savannah-Tugaloo river (NE);
NC/SC line = the colonial boundary (Little River - 34.82N 79.68W - west - Waxhaws notch - 35.19N), approximate (a few km).
| file | date shown | British (red) | basis |
|---|---|---|---|
| may80 | May 1780 (siege of Charleston, surrender 12 May) | Georgia (Savannah since Dec 1778, Augusta) + a ~30 km zone round Charleston (siege lines, islands) | FACT_NOTES control table + hook-1 tag |
| aug80 | Aug 1780 (after Camden) | Georgia + all South Carolina (posts Camden, Ninety Six, Augusta, Georgetown, Charleston, Savannah) | control table |
| dec80 | Dec 1780 (Greene at Charlotte) | same as aug80 (Cornwallis at Winnsboro, inside SC). Kings Mountain (Oct 1780) made the NW SC upcountry contested: not shown separately | control table |
| apr81 | Mar-Apr 1781 | SC + GA + Wilmington enclave (Craig's post 29 Jan - 18 Nov 1781, ~24 km zone) **(memory: dates)** | control table |
| jul81 | Jul 1781 | the low-country belt Orangeburg - Eutaw - Monck's Corner - Charleston between the Santee and the Edisto/Savannah, Beaufort, Savannah's environs; Wilmington enclave | control table (Camden evacuated 10 May, Orangeburg 11 May, Fort Motte 12 May, Georgetown ~late May, Augusta 5 Jun, Ninety Six evacuated July) |
| dec81 | Dec 1781 | Charleston (~24 km) + Savannah (~22 km) only (Wilmington evacuated Nov 1781) | control table |
Zones are soft areas round the posts (18th-century control), not fronts.
