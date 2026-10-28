# FACT NOTES: `south` theatre map (z8, 34.50N 81.50W; extent 30.76N-38.09N, 89.41W-73.59W) - hook/bg/ending agent
Shared, read-only for the move agents. Built by `tools/make_south_geo.py` + `tools/make_south_control.py` (from sherman/).

## Files (ready, 2026-10-28)
- `assets/media/south_geo_ref.png` (2x, 5760x3240, place at 0,0,2880,1620): big rivers (Natural Earth 10m centerlines), state lines (thin,
  faint; Natural Earth admin-1; 1864 lines = today's here; West Virginia drawn as today: a Union state since 20 Jun 1863), faint state
  names, 1860 big towns: NASHVILLE, CHATTANOOGA, KNOXVILLE, ATLANTA, MACON, AUGUSTA, SAVANNAH, CHARLESTON, COLUMBIA, WILMINGTON, RALEIGH,
  PETERSBURG, RICHMOND, NORFOLK, LYNCHBURG, MONTGOMERY, COLUMBUS; ATLANTIC OCEAN, CHESAPEAKE BAY. Story places = white-box labels in scenes
  (don't repeat the towns above as boxes on the theatre map unless highlighting them).
- `assets/media/south_states.png` (2x): state lines only. `assets/media/south_rivers.json` (map px polylines for LV.shimmer).
- Control overlays (multiply, `mixBlendMode = "multiply"`, 2880x1620): `south_ctl_{may64,aug64,sep64,dec64,feb65,apr65}_mx.png`.
  Union-held = blue (110,160,255) 0.565; Confederate-held = red (232,52,52) 0.62-0.87, brighter rim where the sides meet.
- Sources: Natural Earth (public domain) for state shapes + rivers (assets/src/south_ne_states.geojson, south_ne_rivers.json).

## Control per date (approximate to ~5-10 km; z8 = 504 m/px). Common to all dates
- Union states: Kentucky, West Virginia, Missouri, Illinois, Indiana, Ohio, Maryland (all blue).
- Tennessee: Union-held (Nashville since Feb 1862, Chattanooga since Sep 1863, Knoxville since Sep 1863), EXCEPT upper East Tennessee
  (Bristol-Greeneville, east of ~Bull's Gap 83.1W) = Confederate in 1864 (Confederate forces there through 1864; Stoneman cleared it
  Dec 1864 / Mar 1865) -> blue from feb65 on. Hood's Nov-Dec 1864 invasion of Middle Tennessee is NOT shown as territory (army moves).
- North Alabama above the Tennessee River (Bridgeport-Huntsville-Decatur-Florence) = Union-held since 1863-64 (garrisoned railroad).
- Coast posts held since 1861-62: Fort Pulaski/Tybee (Apr 1862), Port Royal/Beaufort/Hilton Head + Sea Islands (Nov 1861), Morris and
  Folly Islands off Charleston (1863), New Bern/Beaufort NC (Mar 1862), Roanoke Island + Hatteras (1861-62), Norfolk/Portsmouth (May 1862),
  Fort Monroe + the lower Peninsula, Virginia's Eastern Shore (Nov 1861).

## Per date
- may64 (~7 May 1864, campaign opens): Georgia: only the north-west corner around Ringgold / Tunnel Hill (front before Dalton / Rocky Face).
  Virginia: Butler's Bermuda Hundred / City Point bridgehead (landed 5 May). Grant's Overland battles are north of the map edge.
- aug64 (~23 Aug 1864, Lincoln's memorandum): Georgia: the railroad corridor Chattanooga-Dalton-Allatoona-Marietta to the siege lines
  N/E/W of Atlanta (Atlanta itself Confederate); NW Georgia (Rome since 18 May) filled as one zone (in reality garrisoned along the W&A).
  Virginia: Petersburg siege lines east of the city to the Weldon RR (Globe Tavern 18-21 Aug), Bermuda Hundred, City Point.
- sep64 (2 Sep 1864 on): as aug64 + Atlanta and its south side (Union army pulled back from Lovejoy to Atlanta by ~8 Sep).
- dec64 (21 Dec 1864): Atlanta + the W&A south of Chattanooga abandoned in Nov (Sherman cut loose); Georgia = Chattanooga's fringe only +
  SAVANNAH (Hardee out 20 Dec, city surrendered 21 Dec) between the Savannah River and the Ogeechee (Fort McAllister 13 Dec).
  Plymouth NC Union again (31 Oct 1864). Virginia: lines extended to Peebles' Farm (30 Sep) and north of the James (Fort Harrison 29 Sep).
- feb65 (~22 Feb 1865): + SC coast Savannah River-Pocotaligo-Charleston (Charleston evacuated 17-18 Feb), + Wilmington/Cape Fear (Fort Fisher
  15 Jan, Wilmington 22 Feb), upper East Tennessee blue. Columbia (17 Feb) = the army passing, not territory.
- apr65 (~26 Apr 1865, Bennett Place): Virginia east of ~79.2W Union (Richmond + Petersburg 2-3 Apr, Appomattox 9 Apr, Lynchburg 12 Apr);
  North Carolina east of ~79.05W (Durham's Station - Raleigh 13 Apr - Goldsboro 21-23 Mar - Wilmington - coast); SC coast to Georgetown
  (25 Feb). OMITTED on purpose: Wilson's raid (Selma 2 Apr, Montgomery 12 Apr, Columbus 16 Apr, Macon 20 Apr) and Stoneman's raid (SW VA /
  western NC): raids, not held territory in the story; scenes may add an arrow if needed. Johnston's army near Greensboro = red until the
  surrender card.
- Caveat: during the March to the Sea and the Carolinas march the Union army's ground is a moving band (scenes draw it), not a fill.

## Hook-1 / hook-2 / bg / ending places used (checked)
- Atlanta 33.749N 84.388W; Jonesboro 33.521N 84.354W (Macon & Western RR); Petersburg 37.228N 77.402W; Chattanooga 35.046N 85.310W;
  Savannah 32.081N 81.091W; Bennett Place 36.03N 78.98W (Durham's Station); Columbus OH (ending caption only, off-map);
  Louisville KY (Sherman's HQ, Oct 1861; 38.25N 85.76W: just off the top edge -> hook-3 uses a Kentucky outline locator, no town dot).
