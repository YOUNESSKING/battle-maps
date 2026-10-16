# `virginia` overview map: geography + control maps (HOOK/OVERVIEW agent; READY, other agents reuse read-only)

Basemap `virginia_hd_ref` (z9, centre 38.55N 78.15W; covers 36.79-40.27N, 82.11-74.20W: Ohio/Kentucky corner to Philadelphia,
Gettysburg in, Richmond + Norfolk at the bottom). Projection in scenes: `GG.proj(9, 35642, 49493)`.

## Files (all in assets/media, made by tools/make_virginia_geo.py + tools/make_virginia_control.py)
- `virginia_geo_ref.png` (5760x3240, place at 2880x1620 ABOVE the territory): DEM-traced rivers (order 3 strong, order 2 faint),
  big 1860 towns only (Washington, Baltimore, Philadelphia, Richmond, Norfolk, Petersburg, Fredericksburg, Lynchburg, Winchester,
  Staunton, Wheeling, Wilmington, Frederick), water names POTOMAC / RAPPAHANNOCK / JAMES / CHESAPEAKE BAY. No modern towns.
  Story places (Front Royal, Strasburg, Manassas, Chancellorsville, Gettysburg...) = white-box labels in the scenes.
- `virginia_rivers.json`: map-px polylines for `LV.shimmer` (order-3 rivers).
- `virginia_ctl_<date>_mx.png` (multiply, option 1): Confederate = blue (110,160,255), Union = red (232,52,52), bright rim where they meet.
- `virginia_front_<date>.json`: the main northern-Virginia front, map px, Confederate on the LEFT of travel (K.front sideA "carth").
- No state borders are drawn (no 1863 West Virginia line); Union = every Union state on the map + the parts of 1861 Virginia it held.

## Control per date (approximate to ~2-5 km; z9 = 239 m/px)
| date | Union-held inside Virginia | sources / notes |
|---|---|---|
| jul61 (21 Jul 1861) | Arlington + Alexandria (occupied 24 May 1861); Fort Monroe-Hampton-Newport News; Patterson's Charlestown-Martinsburg area (Union crossed at Williamsport 2 Jul, at Charlestown 21 Jul); McClellan's north-west Virginia (Rich Mountain 11 Jul; Beverly/Grafton/Clarksburg). Kanawha still Confederate (Cox took Charleston 25 Jul). | NPS First Manassas; EVA; standard |
| mar62 (~23 Mar 1862) | North of a line Dumfries-Warrenton-Manassas Gap-Strasburg (Confederates left Manassas 9 Mar; Banks at Winchester 12 Mar; Kernstown 23 Mar); Mountain Department west of the Alleghenies; Fort Monroe; Eastern Shore (Union since Nov 1861). | EVA Valley Campaign; Henderson |
| may62 (~20 May 1862) | Banks dug in at Strasburg, Kenly's 1st Maryland at Front Royal, McDowell at Fredericksburg, Frémont at Franklin; McClellan on the Chickahominy, Norfolk (10 May). | NPS Valley timeline; Henderson |
| may62b (~26 May 1862) | As may62, but the Valley Confederate to the Potomac (Banks over at Williamsport 25-26 May; Harpers Ferry still Union under Saxton). | Henderson; NPS |
| jun62 (~12 Jun 1862) | North of the Rappahannock (Fredericksburg occupied 18 Apr) + lower Valley to Luray / Mount Jackson (Shields, Frémont after Port Republic); McClellan's Peninsula to the Chickahominy + White House; Norfolk/Portsmouth (10 May); Gloucester. | NPS Valley timeline; standard |
| aug62 (25 Aug 1862) | ALIGNED with nova_ctl_aug25 (move-2 agent): Pope's Rappahannock line (Kelly's Ford - Rappahannock Station - Waterloo), then the east foot of the Bull Run Mountains to the Potomac (the country between the Blue Ridge and the Bull Run Mountains, Jackson's route, is NOT Union); Burnside at Falmouth/Fredericksburg; lower Valley = separate Union pocket (White at Winchester, Miles at Harpers Ferry); lower Peninsula (McClellan gone by 16 Aug), Norfolk. | NPS Second Manassas |
| sep62 (~5 Sep 1862) | Only Washington's defences (Arlington/Alexandria) + Harpers Ferry (surrendered 15 Sep); lower Peninsula, Norfolk. Confederates not shown in Maryland (crossing 4-7 Sep: arrows in scenes). | NPS/ABT Antietam campaign |
| may63 (2 May 1863) | Hooker's base north of the Rappahannock (Falmouth), Fairfax/Centreville to the Bull Run line, lower Valley (Milroy at Winchester); Yorktown-Williamsburg, Gloucester, Norfolk/Suffolk (Longstreet's siege). | NPS Chancellorsville; EVA |
| jul63 (1 Jul 1863) | Washington's defences to Fairfax; lower Peninsula, Norfolk. Lower Valley Confederate (2nd Winchester 14-15 Jun). Lee's army in Pennsylvania is NOT filled (arrows only: occupation was transient). | NPS Gettysburg; ABT |
- North-west Virginia polygons are deliberately plain (NW_61 / NW_62 / NW_63 in the tool): Union-held mountain counties, contested
  edges (Romney, Moorefield, Lewisburg) simplified. Kentucky is drawn as Union for all dates (neutral until Sep 1861; off-camera corner).
- Potomac vertices snapped to the DEM-traced river so the colour edge sits on the drawn river.
