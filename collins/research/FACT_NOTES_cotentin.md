# Control map log: MOVE 1 (Cotentin / Cherbourg, June 1944) + BG-1 (Western Front, mid-June 1944)
Generators: `tools/make_cot_control.py` (normandy z10 `cot_ctl_*_mx`, cherbourg z12 `cbg_ctl_*_mx`, fronts inlined as `CD` into
`scenes-src/move1a.js` / `move1b.js`), `tools/make_bgeu_control.py` (europe z6 `bgeu_ctl_jun44_mx`, `bgeu_geo`). Lines are approximate
(~1-2 km at z10/z12, ~10 km at z6). Main sources: Harrison, *Cross-Channel Attack* (USGPO, ch. IX-X, maps XVI-XIX); *Utah Beach to
Cherbourg* (American Forces in Action, 1947, maps); research/FACT_NOTES.md (dates, units).

| Date (overlay) | Line drawn | Basis |
|---|---|---|
| ~12-14 Jun (`bgeu_ctl_jun44`) | Lodgement: Quinéville ridge - Montebourg - Pont-l'Abbé - Carentan - Caumont - short of Caen; Channel Islands German | Utah + Omaha linked at Carentan 12 Jun, Caumont 13 Jun (Harrison) |
| 14 Jun (`cot_ctl_jun14`, `CD.n.jun14`) | North front Quinéville - Montebourg outskirts - Le Ham - west of Pont-l'Abbé; south face along the Douve/Prairies marécageuses to Carentan, then V Corps / British line | 4th Div held before Montebourg; 82nd Abn + 90th Div attacking west from the Merderet (Harrison ch. X) |
| 18 Jun (`cot_ctl_jun18`, `CD.n.jun18`) | Same north front east of the Merderet, then west across the peninsula Saint-Sauveur-le-Vicomte - Saint-Lô-d'Ourville - the sea at Barneville; VIII Corps south face Portbail - La Haye-du-Puits (north) - Douve | 9th Div reached the sea at Barneville 17/18 Jun (FACT_NOTES); 82nd took Saint-Sauveur 16 Jun |
| 21 Jun (`cot_ctl_jun21`, `CD.n.jun21`, `CD.c.jun21`) | Ring of the Cherbourg land front: Maupertus - Tourlaville heights - Le Mesnil-au-Val - south of Octeville - Sainte-Croix-Hague - Vauville | 4th, 79th, 9th Divs closed on the fortress belt 20-21 Jun; ultimatum 21 Jun, expiring 09:00 22 Jun |
| 22-24 Jun (`CD.c.jun24`) | Closing on the city: Tourlaville - foot of the Montagne du Roule - south of Octeville - Equeurdreville heights; Hague front unchanged | 79th at the Fort du Roule by 24 Jun; 9th on Octeville/Equeurdreville; 4th at Tourlaville (Harrison) |
| 26 Jun (`cbg_ctl_jun26`, `CD.c.arsenal`, `CD.c.hague`) | City American except the arsenal pocket on the west harbour; Hague still German west of a line Gréville - Vauville | Schlieben surrendered 26 Jun; arsenal (Sattler, ~400) 27 Jun with loudspeakers |
| 1 Jul (`cot_ctl_jul1`, `cbg_ctl_jul1`) | Whole peninsula north of the VIII Corps line (La Haye-du-Puits front) American | Cap de la Hague cleared 1 Jul (FACT_NOTES) |

Notes / simplifications:
- 79th Division shown on the north front from 14 Jun in move1-1 (it entered the line ~19 Jun); kept for readability of the three-division turn north.
- The 14 Jun north front is drawn only where it faced north (Quinéville to the Merderet); the south face is shown by the territory fill.
- Harbour forts (29 Jun) are not shown separately; the arsenal pocket stands for the last city strongpoints.
