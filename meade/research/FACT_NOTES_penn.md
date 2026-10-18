# `penn` overview map: control overlays (+ geo layer) — HOOK/BG/ENDING agent. READY: other agents reuse read-only.

Basemap `penn_hd_ref` (z9, centre 39.40N 77.60W; covers 37.66-41.10N, 81.56-73.65W: Ohio corner to New York harbour, Fredericksburg
and Culpeper near the bottom, Richmond just off the bottom edge). Projection in scenes: `GG.proj(9, 35842, 49095)`. 236 m/px.

## Files (assets/media, made by tools/make_penn_control.py; geo by tools/make_penn_geo.py)
- `penn_ctl_<date>_mx.png` (2880x1620, `mixBlendMode: multiply`, option 1). **Union = blue (110,160,255), Confederate = red
  (232,52,52)** with the bright rim on the red side where they meet (Meade video: sides reversed vs jackson).
- `penn_geo_ref.png` (5760x3240 shown at 2880x1620, place ABOVE the territory) + `penn_rivers.json` (map px, for `LV.shimmer`):
  DEM-traced rivers, big 1860 towns only, water names. Story places = white-box labels in the scenes.
- No state borders drawn. Confederate-held = 1861 Virginia minus the Union pockets of that date + the ground Lee's army held north of
  the Potomac on that date; all other land = Union.

## Control per date (plain, ~3-5 km)
| date | Confederate-held | Union pockets inside Virginia | sources |
|---|---|---|---|
| jun63 (~28 Jun 1863, Meade takes command) | Virginia incl. the lower Valley (2nd Winchester 14-15 Jun) + the strip Lee's army occupied: Potomac crossings (Williamsport/Shepherdstown) - Hagerstown - Greencastle - Chambersburg (Longstreet, Hill) - Shippensburg - Carlisle (Rodes, Johnson, 27 Jun) - Jenkins' cavalry to Mechanicsburg/Oyster Point opposite Harrisburg (28-29 Jun) - McConnellsburg (raids); Early's route Cashtown - Gettysburg (26 Jun) - York (28 Jun) - Wrightsville on the Susquehanna (28 Jun, bridge burned). Drawn as one plain zone (the occupation was transient). Stuart's ride (Rockville 28 Jun) is NOT filled: cavalry icon + arrow in scenes. | Washington's defences to Fairfax; Harpers Ferry/Maryland Heights (French; evacuated 30 Jun); Union West Virginia (NW_63), Eastern Shore, Norfolk/Suffolk, lower Peninsula, Gloucester (shared polygons from make_virginia_control.py) | NPS Gettysburg campaign; ABT "Gettysburg Campaign" (York, Wrightsville, Carlisle, Oyster Point); OR 27 |
| jul12 (7-13 Jul 1863, trapped at the flooded Potomac) | Virginia + Lee's entrenched bridgehead in Maryland: Potomac near Downsville - St James College - just west of Hagerstown - Conococheague Creek - Williamsport (~6 x 8 km) | as jun63 (Maryland Heights reoccupied 7 Jul) | NPS/ABT Williamsport & Falling Waters; Meade's council 12 Jul |
| jul63 (~15 Jul 1863, after Lee crossed at Williamsport/Falling Waters on the night of 13-14 Jul) | Virginia only (lower Valley still Confederate) | as above (Union crossed back into Loudoun 17-18 Jul: not shown) | ABT Falling Waters |

## Shared Virginia overlay (for bg-1)
- `virginia_ctl_jun62u_mx.png` on `virginia_hd_ref` (tools/make_virginia_ctlu.py): **30 June 1862 (Glendale), Union = blue**. Union
  ground in Virginia as jackson's jun62 (north of the Rappahannock, lower Valley to Luray/Mount Jackson, Norfolk, Eastern Shore,
  NW Virginia) but McClellan's pocket redrawn for 30 Jun: north bank of the Chickahominy and White House abandoned after Gaines' Mill
  (27 Jun); the army between White Oak Swamp, Glendale (Frayser's Farm) and Malvern Hill, falling back to the James (Harrison's
  Landing 1-2 Jul); lower Peninsula (Williamsburg - Fort Monroe) Union. Sources: NPS Richmond NB (Glendale, Malvern Hill), ABT Seven Days.
