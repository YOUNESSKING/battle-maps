# Move 2 (Operation Cobra): control map / front lines log (map agent)
Approximate situation-map lines, not surveyed. Sources: Blumenson, *Breakout and Pursuit* (US Army green book) maps + text; FACT_NOTES.md (Move 2).

## Wide map (normandy z10, option 1): tools/make_nor_control.py -> nor_ctl_jul24_mx / jul31_mx, nor_front_jul24/31.json
- 24 July: Ay river north of Lessay, north of Periers, ~1,200 yd north of the Periers - St-Lo road (US pulled back for the bombing),
  south of St-Lo (US since 18-19 July), Caumont (US), British/Canadian line to the south edge of Caen (Goodwood), Orne to the coast.
- 31 July: Avranches taken 30 July, Pontaubault bridge 31 July; Brecey - Villedieu - Percy - Tessy-sur-Vire; British at
  St-Martin-des-Besaces (Bluecoat); Caen sector unchanged. Channel Islands German.

## Close-up (cobra z12, option 2 fronts only), defined in scenes-src/move2b.js
- F24 (24-25 July morning): nor_front_jul24 x4 (z10 -> z12), smoothed. Checks: 40-55 map px (1.0-1.4 km) north of the road between
  La Chapelle-en-Juger and Hebecrevon = the 1,200 yd withdrawal; Periers German, St-Lo US.
- F25 (evening 25 July): infantry 1-2 miles into the box (script: "gained only a mile or two"); objectives (Marigny, St-Gilles) not taken.
- F27 (evening 27 July): APPROXIMATE. Germans withdrawing from Lessay-Periers (VIII Corps occupied both 27 July); 1st Inf/CCB 3rd Armd
  through Marigny, held up west of it; 2nd Armd through St-Gilles and Canisy to Le Mesnil-Herman; east of the Vire unchanged.
  Double-check against Blumenson's 27 July map before publishing.
- Target box: ~6,000 x 2,200 yd drawn as 225 x 80 map px (25 m/px), north edge along the D 900 (1944 N 800) chord.

## Display choices (facts)
- Panzer Lehr ~2,200 combat troops, ~45 armoured vehicles; ~1,000 men lost to the bombing; "finally annihilated" 27 July (paraphrase, no quotes).
- 24 July short bombs 25 killed / 131 wounded; 25 July 1,500+ heavies / 3,300+ t, +380 mediums, +550 fighter-bombers, ~4,000 t total;
  111 killed / 490 wounded incl. McNair.
- RESULT card "Avranches reached 30 July, 5 days after the carpet" (25 -> 30 July). Culin card says only "US ARMY · NORMANDY 1944"
  (his unit, 102nd Cavalry Recon Sqn, is not in FACT_NOTES). "Hundreds" of cutters, no number shown.
