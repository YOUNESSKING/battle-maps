# FACT NOTES: Kursk map (move 2) — control map log (front lines per date) + scene facts

Map: `kursk` basemap (z9, centre 52.35 N 36.3 E; covers ~50.97-53.69 N, 32.34-40.25 E). Belgorod (50.6 N) is just OFF the
bottom edge, so the southern pincer enters from the bottom edge with a "FROM BELGOROD" label. Lines are in
`tools/make_kursk_control.py` (lat, lon, north -> south, German ground west/north of the line). They are APPROXIMATE
(drawn from standard situation maps at operational scale, ±3-5 km), good for a z9 map, not for a tactical study.

## Places (Nominatim / OSM, checked 2026-10-07)
Ponyri 52.319 N 36.302 E · Olkhovatka 52.256 N 36.125 E · Teploye 52.273 N 36.006 E · Soborovka 52.321 N 36.087 E ·
Podsoborovka 52.318 N 36.099 E · Glazunovka 52.499 N 36.322 E · Trosna 52.448 N 35.780 E · Maloarkhangelsk 52.40 N 36.50 E ·
Orel 52.967 N 36.069 E · Kursk 51.730 N 36.193 E · Fatezh 52.09 N 35.86 E · Kromy 52.687 N 35.79 E.
Orel-Kursk railway drawn through Zmievka, Glazunovka, Ponyri, Zolotukhino (approximate course).

## Control map per date
| Date | Line | Basis |
|---|---|---|
| 4 Jul 1943 (eve of Citadel) | Orel bulge German: front east of Bolkhov and Mtsensk (both German-held until 29 / 20 Jul 1943), west of Novosil (Soviet), north of Maloarkhangelsk (Soviet), south of Glazunovka (German), south of Trosna (German) and Dmitrovsk (German, freed 12 Aug 1943), east of Sevsk (German, freed 27 Aug 1943), then south along the west face of the salient east of Rylsk (German) and west of Lgov (Soviet). In the 13th Army sector the line runs ~52.40 N. | Liberation dates (Soviet "Ministry of Defence" / standard city histories); Glantz & House, *The Battle of Kursk* (1999) maps; matches `make_europe_control.py` "jul43" (coarser). |
| ~7 Jul | 9th Army dent ~8-10 km deep between Maloarkhangelsk (held) and the Trosna road: northern part of Ponyri, Soborovka/Podsoborovka line. | Wikipedia "Battle of Kursk" (northern face): XLVII Pz Corps got ~9.7 km on day 1; attack frontage narrowed to 40 km then 15 km; warhistory.org "Breaking into the Northern Kursk Salient II" (Ponyri north taken 5-6 Jul, Samodurovka/Kashara gap 7 Jul). |
| ~11 Jul (furthest) | Dent ~12-15 km: Teploye (taken), Samodurovka, short of Olkhovatka heights; Ponyri station contested (line through the village). | FACT_NOTES.md "~10-15 km"; Teploye seesaw 3 days then taken (warhistory.org / Zetterling & Frankson); Olkhovatka never taken. |
| 12 Jul | Same line + Operation Kutuzov arrows: 11th Guards Army from the north (from the Kozelsk side, off the top edge) toward Khotynets, 61st Army toward Bolkhov, 3rd + 63rd Armies from the Novosil side toward Orel. | Wikipedia "Operation Kutuzov" / "Battle of Kursk": Kutuzov began 12 July against the Orel salient. |

## Units shown
- Soviet Central Front (Rokossovsky): 13th Army (Pukhov) in the ~40 km Ponyri-Olkhovatka sector + 4th Artillery Breakthrough
  Corps; 48th Army (east flank, Maloarkhangelsk), 70th Army (west flank, Teploye side); 2nd Tank Army in reserve behind (Fatezh side).
- German 9th Army (Model): XXIII Corps (east, vs Maloarkhangelsk), XLI Pz Corps (railway, Ponyri) with the Ferdinands
  (sPzJgAbt 653/654, 83-90 vehicles), XLVII Pz Corps (Olkhovatka) with the Tigers of sPzAbt 505, XLVI Pz Corps (west, Teploye side).
- Voronezh Front (south) only as a label at the bottom edge.

## Numbers on screen (all from FACT_NOTES.md)
711,575 (Central Front) vs ~335,000 (9th Army); front ~300 km; 13th Army sector ~40 km; three defensive belts; 02:20 on 5 July
(counter-preparation ordered ~02:00-02:20); advance 10-15 km; 12 July Kutuzov; casualties: Central Front 15,336 killed/missing +
18,561 wounded/sick = 33,897 (Krivosheev); 9th Army ~20,000-23,000 (5-11/12 July; FACT_NOTES says "double-check").

## Not verified / approximations
- Exact trace of the 4 July line between Trosna and Sevsk and on the west face (±5 km), and the north face of the Orel bulge
  (drawn at the top edge, east of the Zhizdra/Ulyanovo sector).
- The ~7 July line is an interpolation between the day-1 penetration and the 11 July furthest line.
- Belt positions (1st belt at the front, 2nd on the Ponyri-Olkhovatka-Teploye heights, 3rd ~52.16 N) are schematic.
- Railway course between stations is approximate.
