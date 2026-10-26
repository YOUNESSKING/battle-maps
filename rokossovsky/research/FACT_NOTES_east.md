# East overview map: control maps + facts (scenes hook-b, bg, ending)

Generator: `tools/make_east_control.py` (fronts as lon/lat polylines, north to south; Axis-held = west of the line) and
`tools/make_east_geo.py` (lakes, rivers, towns). Output: `assets/media/east_ctl_<state>_mx.png` (+ plain `east_ctl_<state>.png`).
Accuracy: overview scale (z6, 1 px ~ 1.5 km); lines drawn by hand to within ~10-30 km. Sources for every line: the standard
situation maps in the USMA (West Point) Department of History *Atlas for the Second World War, Europe* (Eastern Front plates),
Glantz & House *When Titans Clashed* (maps for each operation), and the Wikipedia articles on each operation (their maps). They were
drawn from those maps as I know them, NOT re-checked online this session (Overpass/web access was limited): **owner check suggested**,
especially the Baltic line of Aug 1944 and the Finnish front of June 1944.
Borders: world_1938 (aourednik/historical-basemaps, GPL-3) for neutrals only. Lakes/rivers: Natural Earth 10m (public domain);
post-1941 Soviet reservoirs (Rybinsk, Kiev, Kakhovka, Kremenchuk, Kuibyshev...) left out. Town names in period form
(Leningrad, Kalinin, Stalino, Gorky, Kuibyshev, Königsberg, Danzig, Breslau, Krakau, Vilnius, Kishinev, Lvov).

Colours: blue = Soviet-held, red = Germany and allies (Finland, Romania, Hungary, Slovakia, Italy, Bulgaria, occupied countries),
plain terrain = neutral (Sweden, Switzerland, Turkey, Spain, Portugal, Ireland). UK uncoloured (kept off-screen).

## Fronts per date
| State | Date | Line (north to south) | Notes |
|---|---|---|---|
| jun41 | 22 Jun 1941 | 1940 Soviet-Finnish border (Moscow Peace) - Gulf of Finland - Baltic coast at the Memel border - East Prussia - 1939 demarcation line (Narew area, Bug past Brest, San at Przemyśl) - Carpathians (Hungarian border) - N. Bukovina - Prut - Danube (Kilia) | Baltics, eastern Poland, Bessarabia, N. Bukovina, Karelian Isthmus shown Soviet (annexed 1939-40). Finland shown with the Axis (German troops already in Lapland; Finland at war from 25-26 Jun 1941; Hungary from 27 Jun). |
| oct41 | ~10 Oct 1941 | Finns on the Svir and Onega (Petrozavodsk taken 1 Oct) and on the old 1939 border N of Leningrad - siege ring Strelna-Pulkovo-Kolpino-Neva-Shlisselburg (closed 8 Sep) - Mga - Kirishi - Volkhov - Novgorod - Ilmen - Demyansk/Seliger - Rzhev (still Soviet) - Sychevka/Gzhatsk - Medyn/Kaluga approaches - Mtsensk - Orel (taken 3 Oct) - Kursk approaches (Kursk still Soviet) - Sumy (10 Oct) - Krasnograd - Pavlograd - Mariupol (8 Oct) - Perekop | Soviet pockets: Vyazma (closed 7 Oct), Bryansk north (50th Army) and Trubchevsk (3rd + 13th Armies), Oranienbaum, Odessa (evacuated 16 Oct). Crimea still Soviet (Ishun positions held to 18 Oct). |
| dec41 | 5 Dec 1941 | Svir/Onega (Medvezhyegorsk taken 5-6 Dec) - Leningrad siege ring - Tikhvin bulge (Tikhvin German 8 Nov - 9 Dec) - Volkhov - Novgorod - Ilmen - Demyansk/Seliger - Kalinin (German 14 Oct - 16 Dec) - Moscow-Volga canal at Yakhroma - Krasnaya Polyana / Kryukovo (~30 km from the Kremlin) - Istra - Zvenigorod (Soviet) - Naro-Fominsk - Serpukhov (Soviet) - Aleksin - Tula held on three sides - Venev/Mikhailov - Yefremov - Yelets (taken 4-5 Dec) - Kursk (German since 2 Nov) - Belgorod - Donets - Mius (Rostov retaken 29 Nov) - Kerch strait | Soviet pockets: Oranienbaum, Sevastopol. All other Crimea German (Kerch taken 16 Nov). FACT_NOTES "1941-11 Kalinin-Volokolamsk-Ruza-Naro-Fominsk-Tula": the dec41 line runs east of that (the November gains). |
| jul43 | 4 Jul 1943 | Svir/Onega - Isthmus - Leningrad land corridor along Ladoga (Iskra, Jan 1943; Sinyavino still German) - Kirishi - Volkhov - Novgorod - Staraya Russa - Kholm - Velikiye Luki (Soviet) - Velizh - Dukhovshchina - Spas-Demensk - Kirov - Zhizdra - Orel bulge (Mtsensk, Zusha) - Maloarkhangelsk / Ponyri axis - Kursk salient (Sevsk, Rylsk, Sumy German; Sudzha, Lgov, Fatezh Soviet) - Tomarovka/Belgorod - N. Donets - Izyum - Lisichansk - Mius - Taganrog Gulf | Axis pocket: Kuban bridgehead (Taman to the "Blue Line", evacuated Sep-Oct 1943). Rzhev and Demyansk salients gone (Mar 1943). Soviet pocket: Oranienbaum. Fatezh treated as Soviet (liberated Feb 1943) - double-check. |
| jun44 | 22 Jun 1944 | Svir/Onega (Soviet Svir crossing 21 Jun not shown) - Karelian Isthmus after the Vyborg fall (20 Jun): VKT line Tali-Vuoksi-Taipale - Narva (city German, bridgeheads) - Peipus - Pskov - Ostrov - Idritsa - Polotsk - Vitebsk - Orsha - Mogilev (all German, the "Belarus balcony") - Rogachev bridgehead - Zhlobin - Parichi - Pripyat marshes - Kovel (German) - Lutsk (Soviet) - Brody - Ternopol (Soviet) - Kolomyia - Carpathians - Târgu Frumos / north of Iași - Dniester - Black Sea | Crimea Soviet (freed May 1944). Leningrad freed Jan 1944. |
| aug44 | ~31 Aug 1944 | Karelia near the U line / Isthmus VKT line (Finnish ceasefire 4 Sep) - Narva (Tannenberg line) - Peipus - Tartu (Soviet 25 Aug) - Võru/Valga - Madona - Daugava east of Riga - Bauska (German) / Jelgava (Soviet, 31 Jul) - Courland corridor at Tukums (restored by Doppelkopf, 20 Aug) - Šiauliai (Soviet) - East Prussian border at Vilkaviškis - Augustów - Osowiec (Soviet 14 Aug) - Narew east of Łomża - Radzymin - Praga suburbs (Warsaw Uprising since 1 Aug; Praga taken 14 Sep) - Vistula with Magnuszew, Puławy and Baranów-Sandomierz bridgeheads - Dębica/Jasło - Krosno - Carpathians - 1940 Hungarian-Romanian border in Transylvania - Danube | Romania changed sides 23 Aug 1944: shown blue (with the Soviet side); legend still reads SOVIET UNION. Bulgaria shown neutral (declared neutrality 26 Aug; Soviet invasion 8 Sep). Least certain line: Latvia/Lithuania. |

## Numbers / text on screen (all from script.md + research/FACT_NOTES.md)
- 9th Mechanized Corps 316 -> 64 tanks (FACT_NOTES: 316 -> 64 by 7 Jul 1941).
- OVER HALF A MILLION ENCIRCLED (Vyazma + Bryansk): script says "more than half a million". Standard figures: Soviet losses in
  the double encirclement ~1 million total, ~600,000-670,000 captured (German claim 673,000; Glantz & House; Wikipedia "Battle of
  Vyazma"). "Over half a million encircled" is a safe statement. Not in FACT_NOTES.md: **main session please confirm and log**.
- Army Groups North / Centre / South on 22 Jun 1941 (standard).
- The Luftwaffe bombing the 9th MC column and the ambush artillery under "ambushed, worn down, made to bleed" are illustrative
  (Luftwaffe air strikes on the Soviet mechanized counter-attack at Dubno/Brody are standard; no specific raid is claimed).
- Rokossovsky's HQ escaping the Vyazma ring and being sent to Volokolamsk: FACT_NOTES move 1 (16th Army HQ to the Volokolamsk axis).
- Ending badge "MARSHAL OF THE SOVIET UNION" (promoted 29 Jun 1944, FACT_NOTES: double-check).
