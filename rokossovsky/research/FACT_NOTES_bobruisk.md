# Bobruisk map (z9 Belarus): control map log (front lines per date) + map facts

Generator: `tools/make_bobruisk_control.py` (fronts as lon/lat, German-held = west of the line). Overlays:
`assets/media/bobruisk_ctl_{jun22,jul4,jul31}_mx.png` (option 1, multiply); polylines `assets/media/bobruisk_front_*.json`.
Close-up fronts (option 2) are drawn in `scenes-src/move3.js` / `hook-a.js` (F0P, F1P, POCKET).
Sources: Wikipedia "Operation Bagration" / "Bobruysk offensive"; ru.wikipedia "Бобруйская операция" (prongs, ring closed
27 June NW of Bobruisk, Bobruisk 29 June, 9th Army XXXV AK + XXXXI PzK, 20th Pz in reserve, ~50,000 killed / ~20,000 captured);
standard situation maps (Glantz & House, *When Titans Clashed*; Frieser in *Germany and the Second World War* vol. VIII).
All lines are APPROXIMATE (map scale ~184 m/px; drawn by eye from those maps). Items marked (memory) need a check.

| Date | Line (north -> south) | Notes / sources |
|---|---|---|
| 22 Jun 1944 (`jun22`) | east of Orsha (off-map) - Pronya river east of Mogilev - east of Bykhov - Soviet Rogachev bridgehead west of the Dnieper (Rogachev Soviet since 24 Feb 1944) - Zhlobin German (Dnieper) - SW to the Berezina N of Shatsilki - 65th Army bridgehead W of the Berezina S of Parichi (Parichi German) - Ozarichi Soviet (Mar 1944) - Ptich river - Pripyat river west past Turov - SW off-map towards Kovel | "Belorussian balcony" (ru.wiki Белорусская операция); Rogachev 24 Feb 1944, Ozarichi Mar 1944, Mozyr/Kalinkovichi Jan 1944 (memory). Pripyat segment the least certain. |
| 23 Jun (close-up F0) | same line, local segment Bykhov -> Ptich | |
| 24 Jun evening (F1) | south: ~10 km breach west of the Berezina near Parichi; north: barely moved | ru.wiki: southern group "wedged 10 km, ~50 villages"; north slow progress (FACT_NOTES move 3) |
| 27 Jun (POCKET ring) | ring E/SE of Bobruisk incl. the city: 53.24N 29.12E - 53.29/29.40 - 53.22/29.72 - 53.04/29.82 - 52.92/29.62 - 52.95/29.30 - 53.08/29.08 | ring closed 27 June (FACT_NOTES; ru.wiki); "east of the Berezina and in the city itself" (script). Shape schematic. |
| 29 Jun | pocket gone, Bobruisk Soviet | Bobruisk freed 29 June (FACT_NOTES) |
| 4 Jul 1944 (`jul4`) | W of Molodechno - W of Minsk - Stolbtsy - Nesvizh - E of Baranovichi - Pripyat W of Turov; German pocket E of Minsk (27.8-28.95E, 53.6-54.07N) | Minsk freed 3 July (Soviet date; en.wiki intro says 4 July); 4th Army pocket E of Minsk. Molodechno 5 Jul, Stolbtsy 6 Jul, Baranovichi 8 Jul, Luninets 10 Jul, Pinsk 14 Jul (memory) -> line is approximate for "early July". |
| end Jul 1944 (`jul31`) | whole map Soviet | Brest 28 Jul, Grodno 24 Jul, Pinsk 14 Jul (memory); front at the Vistula / Warsaw by Aug (FACT_NOTES) |

## Other map facts used on screen
- Prongs: north 3rd + 48th Armies + 9th Tank Corps from the Rogachev area; south 65th + 28th Armies + 1st Gds Tank Corps + Pliev's
  cavalry-mechanised group from S of Parichi (FACT_NOTES; ru.wiki). Routes drawn schematically (9th TC to the NE side of the ring,
  1st Gds TC round the west of Bobruisk, Pliev west towards Glusk/Slutsk).
- German 9th Army (Jordan), XXXV Corps (north/east), XXXXI Pz Corps (south), 20th Pz Div (reserve near Bobruisk) (ru.wiki).
- Busch relieved 28 June, replaced by Model (FACT_NOTES); Rokossovsky Marshal 29 June 1944 (FACT_NOTES, flagged "double-check").
- OKH expected the blow in Ukraine; armour moved to Army Group North Ukraine (FACT_NOTES). The two red arrows are schematic.
- Casualty card: Bobruisk ~50,000 killed, ~20,000 captured (FACT_NOTES); ~400,000 = whole operation (Frieser 399,102). No Soviet
  Bobruisk figure exists in FACT_NOTES -> shown as "—" with "no reliable figure".
- Hook-3 cards: arrested 17 Aug 1937, released 22 Mar 1940; family account = front teeth, ribs, two mock executions (FACT_NOTES).
- Stalin card: memoir account, quote verbatim from the memoir translation; Zhukov's differing account noted (FACT_NOTES).

## Marsh layer (`tools/make_bobruisk_marsh.py`)
OSM natural=wetland (today's bogs, many drained after the war) UNION low flat ground from the DEM (smoothed elevation < 145 m, slope
< 0.3 %) = an approximation of the 1944 marsh extent, not a historical survey. Corduroy roads, swamp-shoes and rafts are drawn
schematically in the Parichi sector.

## Geography layer (`tools/make_bobruisk_geo.py`)
OSM towns with 1944 Russian-style names (Bobruisk, Rogachev, Mogilev, Molodechno...); post-war towns left out (Soligorsk 1958,
Svetlogorsk = village Shatsilki in 1944, Zhodino, Desnogorsk, suburbs). Main rivers only (Polesie drainage canals omitted).
