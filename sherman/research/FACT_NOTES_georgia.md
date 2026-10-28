# FACT NOTES: MOVE 2 maps (`georgia` z9, `savannah` z11, + m2 overlays on `corridor`) - MOVE 2 agent (Sherman #13)
Built by `tools/make_georgia_geo.py` (geo layers), `tools/make_m2_control.py` (control overlays), scenes assembled by
`tools/make_m2_scenes.py` from `assets/src/m2_kit.js` + `assets/src/move2{a..e}_body.js`. Main facts: research/FACT_NOTES.md (Move 2).
Accuracy of the control overlays ~5-10 km (z9 = 257 m/px, z10 = 126 m/px).

## Control per date (option 1, multiply; Union blue / Confederate red)
Common: Tennessee Union-held (Chattanooga since Sep 1863); north Alabama above the Tennessee River (Bridgeport-Huntsville-Decatur)
Union-garrisoned; coast posts held since 1861-62: Cockspur Is. (Fort Pulaski, Apr 1862) + Tybee, Hilton Head + Port Royal/Beaufort + the
Sea Islands (Nov 1861), Morris + Folly Islands off Charleston (1863). Same rules as research/FACT_NOTES_south.md (hook agent).
- `m2_corridor_ctl_oct64_mx` (corridor, Sep-Oct 1864): Atlanta (Union from 2 Sep) + the W&A railroad garrisons Chattanooga-Dalton-Resaca-
  Kingston-Allatoona-Marietta-Atlanta (drawn as a ~16 km band along the line) + the Rome branch and Rome (Union since 18 May). Hood's
  October raid on the railroad (Big Shanty + Acworth 3-4 Oct, Allatoona repulsed 5 Oct, Dalton surrendered 13 Oct) is shown as ACTION
  (arrows, cut pulses), not as territory: the posts were back in Union hands within days.
- `georgia_ctl_oct64_mx` (to 15 Nov 1864): the same Union ground on the georgia map + coast posts.
- `georgia_ctl_nov64_mx` (from 15-16 Nov 1864): Sherman wrecked the railroad and abandoned Atlanta; the W&A garrisons south of
  Chattanooga were pulled back (Memoirs; south_ctl_dec64 shows Chattanooga's fringe only). Georgia = Confederate except the coast posts.
  THE ARMY ITSELF is drawn in the scenes as a moving blue band ~60 miles wide (ABT "Sherman's 60-mile wide column"; OR 44 "thirty miles
  on either side of a line from Atlanta to Savannah"), never as a front line across the state.
- `georgia_ctl_dec64_mx` (from 21 Dec 1864): + Savannah between the Savannah River and the Ogeechee.
- `savannah_ctl_dec10_mx` / `dec21` (savannah map): see the Savannah section below (when the basemap is baked).

## Railroads drawn (1864 lines, by town coordinates; standard)
- Western & Atlantic: Chattanooga - Ringgold - Tunnel Hill - Dalton - Resaca - Calhoun - Adairsville - Kingston - Cartersville - Allatoona
  Pass - Acworth - Big Shanty - Marietta - Chattahoochee bridge - Atlanta (+ Kingston - Rome branch).
- Macon & Western: Atlanta - East Point - Rough and Ready - Jonesboro - Lovejoy's - Griffin - Barnesville - Forsyth - Macon.
- Georgia Railroad: Atlanta - Decatur - Stone Mountain - Covington - Social Circle - Madison - Greensboro - Crawfordville - Thomson - Augusta.
- Central of Georgia: Macon - Griswoldville - Gordon - Tennille - Davisboro - Millen - Guyton - Savannah (+ Gordon - Milledgeville branch).
- Augusta & Savannah: Augusta - Waynesboro - Millen. Atlanta & West Point: Atlanta - Fairburn - Palmetto - Newnan - LaGrange - West Point.

## Story places (coordinates used)
Atlanta 33.749N 84.388W; Allatoona Pass 34.13N 84.71W; Big Shanty 34.023N 84.616W; Acworth 34.066N 84.678W; Dalton 34.77N 84.97W;
Resaca 34.58N 84.94W; Rome 34.257N 85.165W; Gadsden AL 34.01N 86.01W; Gaylesville AL 34.27N 85.56W (where Sherman stopped the chase,
late Oct 1864, standard); Palmetto 33.518N 84.669W; Lovejoy's Station 33.436N 84.315W; Rough and Ready 33.60N 84.41W (civilians passed
south through the lines here, Sep 1864, standard); Macon 32.841N 83.632W; Augusta 33.471N 81.975W; Milledgeville 33.080N 83.232W;
Griswoldville 32.87N 83.46W (brief); Millen 32.804N 81.949W; Ebenezer Creek crossing 32.38N 81.18W (brief); Savannah 32.081N 81.091W;
Fort McAllister 31.89N 81.19W (brief); Ossabaw Sound ~31.80N 81.07W.
Routes (standard; Memoirs/OR 44 order of march): Right wing (Howard: XV + XVII Corps) Atlanta - McDonough - Jackson - Monticello -
Clinton (feint at Macon) - Gordon - along the Central RR - Millen side - Savannah; Kilpatrick's cavalry toward Macon (Lovejoy - Macon
outskirts). Left wing (Slocum: XIV + XX Corps) Atlanta - Decatur - Covington - Madison (feint toward Augusta) - Eatonton - Milledgeville
(23 Nov) - Sandersville - Louisville - Millen - Springfield - Savannah.
Hood's October route (standard; Wikipedia "Franklin-Nashville Campaign"): crossed the Chattahoochee near Palmetto/Campbellton ~29 Sep -
Dallas - W&A at Big Shanty/Acworth 3-4 Oct - Allatoona 5 Oct (French repulsed) - west to Cedartown, across the Coosa below Rome -
Resaca (12 Oct) - Dalton (13 Oct) - LaFayette - Gadsden (20 Oct) - Decatur/Tuscumbia, Alabama (end Oct) -> Tennessee (Nov).

## Not shown / unsure
- Exact width per day of the march band: drawn as a constant ~60 miles (the sourced figure) for readability.
- Number of freed people following: not shown as a number (Wikipedia "a Confederate officer estimated 10,000"): small grey/gold figures only.
- Griswoldville: Walcutt's brigade (XV Corps) behind rails and logs; militia under Phillips charged three times (ABT); casualty card
  CONFEDERATE 523-1,100 · UNION 94 (Scaife & Bragg / ABT, as FACT_NOTES).
