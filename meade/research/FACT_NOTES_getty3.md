# Gettysburg MOVE 3 map notes (getty3_*, move3a/b/c), checked 2026-10-18
Sources: NPS Gettysburg 3 July / Pickett's Charge maps + "The Angle" page; ABT "Pickett's Charge" and "July 3" maps; Bachelder 1876
isometric map (LoC); OSM monument nodes (assets/src/getty_osm.json: The Angle 39.8134N 77.2364W, Armistead KIA 39.8131/-77.2360,
Meade HQ marker 39.8145/-77.2323, Stannard HQ 39.8093/-77.2364, Hancock wounded 39.8088/-77.2370, Pickett/Garnett/Kemper/Armistead
brigade markers on West Confederate Ave, Pettigrew 39.8175/-77.2485); move-2 agent's getty_places.json (cross-check, within ~50 m).

## Places used
- Leister House 39.8143N 77.2325W (OSM HQ marker; brief's 39.8136/-77.2333 ~100 m off, corrected). Angle 39.8135/-77.2364. Copse of Trees
  39.8124/-77.2358. Stone wall: Hays's front (lon -77.2351) -> inner angle 39.8141 -> outer angle (the Angle) -> south past the copse.
- Emmitsburg Road + Taneytown Road: OSM ways (1863 alignments). Fences drawn along the Emmitsburg Road 39.8182-39.8095.
- Confederate gun line: Seminary Ridge just east of West Confederate Ave 39.827-39.810 + the Emmitsburg Road ridge (Rogers farm ->
  Peach Orchard, Alexander) 39.807-39.800. 27 icons stand for ~150 guns (Meade telegram / ABT "some 150").
- Union guns: II Corps front Ziegler's Grove -> McGilvery's line (13 icons = Hunt's 77), Cemetery Hill (3), Little Round Top (2).
- Start lines ~3 pm: Pettigrew (4 brigades) Seminary Ridge woods 39.8213-39.8159; Trimble behind his right; Pickett (Garnett, Kemper,
  Armistead behind) east of Spangler's Woods 39.810-39.812. Targets: Pettigrew/Trimble -> Hays + the Angle; Pickett obliques to the copse.
- Distance Pickett start -> copse on map ~1.17 km = 0.73 mi (script "three-quarters of a mile", ABT).
- Stannard's Vermonters south of the copse (39.809), swing out NW into Kemper's flank.
- Council of war (Gibbon, B&L III): Meade, Butterfield, Warren, Slocum, Williams, Howard, Newton, Hancock, Gibbon, Birney, Sedgwick, Sykes
  (12). Photos for 8; initials for Slocum, Howard, Newton, Williams (no licensed photo in assets).
- Meade's staff move: shown as a short move SE with "MEADE'S STAFF MOVES" (destination, Powers Hill per Sears, NOT claimed).

## Control / fronts
- Scenes use the move-2 agent's getty_ctl_jul2pm / jul3 overlays and getty_fronts.json (jul2pm, jul3 + csa_arc_jul2), read-only.
- Fallback (only if those files vanish): tools/make_getty3_control.py -> getty3_ctl_jul2n_mx.png / getty3_ctl_jul3_mx.png (no-man's
  land between the lines uncoloured; Johnson's lodgement in the lower Culp's Hill works on the night of 2 July).

## Text on screen (FACT_NOTES.md)
- Verbatim with quote marks: "not more than ten or twelve feet square" (Gibbon); "Such then is the decision" (Gibbon's recollection);
  the two Gibbon/Meade lines (B&L 1887); Hunt "Never before had such a sight been witnessed on this continent"; Lydia Leister "There was
  seventeen dead horses on my land" (1865); Lee "Never mind, General, all this has been my fault." (Fremantle).
- Paraphrase, no quote marks: Butterfield's questions 1-3; HUNT: FIRE SLOWLY · SAVE THE AMMUNITION; red belief card THE UNION GUNS ARE
  KNOCKED OUT (script tag's "Yankee guns are finished" has no verbatim source, so not quoted).
- Numbers: ~150 guns, 77 vs nearly 150 (Hunt), ~12,500 (ABT; NPS nearly 13,000 on the card sub-line), CONF ~6,000 ABOUT HALF
  (ABT 6,555 / NPS ~5,500), UNION ~1,500 (ABT; NPS nearly 1,700 not shown), battle 23,049 / 28,063 (ABT).
