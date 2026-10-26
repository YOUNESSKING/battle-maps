# Korea overview basemap (`korea`, z7): control maps (option 1) + front lines per date
Owner of these files: the HOOK/OVERVIEW map agent. Generator: `tools/make_korea_control.py` (re-run: `python3 tools/make_korea_control.py [date ...]`).
READY (read-only for other agents): `assets/media/korea_ctl_<date>_mx.png` (multiply overlay, 2880x1620, place with
`B.image(..., 0,0,2880,1620)` + `style.mixBlendMode = "multiply"`), `assets/media/korea_front_<date>.json` (front polyline in map px,
WEST -> EAST, communist side on the left = `K.front({ sideA: "carth", sideB: "rome" })`), `assets/media/korea_38th.json` (the parallel).
Dates: jun25, sep15, oct24, **nov24, dec15, dec26, jan7** (needed by move2c / move3 / ending), mar15, jul53.
Colours: communist-held (North Korea + PVA; China and USSR on the mainland, a little lighter) = blue (110,160,255); UN-held = red
(232,52,52) with the bright rim on the front; Japan untinted. Projection: `GG.proj(7, 26503, 11759)`.
Accuracy: ~5-10 km (z7 = ~1 km per map px); fronts are smoothed sketches of the official situation maps, not exact unit positions.

## Korea / China border
Yalu (mouth near Sinuiju 39.8N 124.3E -> Supung -> Chosan 40.83N 125.78E -> Manpojin 41.15N 126.29E -> Hyesanjin 41.40N 128.18E) then
the Tumen (Paektu -> Musan -> Hoeryong -> Onsong -> mouth 42.29N 130.66E). Hand-traced from the modern border (unchanged since 1950 at this scale).

## Front lines per date (lat, lon; sources)
| date | line | sources |
|---|---|---|
| 25 Jun 1950 | the 38th parallel (invasion line); Ongjin peninsula south of it = ROK | Appleman, *South to the Naktong*, ch. I-II; Wikipedia "Korean War" |
| ~15 Sep 1950 | Pusan perimeter: the Naktong from the south coast (Masan sector) north to Waegwan, then east across the mountains to Yongdok on the east coast | Appleman ch. XV-XXIV (perimeter map); Wikipedia "Battle of Pusan Perimeter" |
| 24 Oct 1950 | UN north of the Chongchon: Chongju - Pakchon - Unsan - Onjong, ROK 6th Div spearhead north to ~Kojang (reaches Chosan on the Yalu 26 Oct), across the Taebaek to the ROK I Corps on the NE coast (~Kimchaek/Songjin); Pyongyang UN since 19 Oct | Appleman ch. XXXIII-XXXIV; Wikipedia "UN offensive into North Korea" |
| 24 Nov 1950 | Eighth Army: Chongju - Ipsok - Tokchon (ROK II Corps on the right); the empty Taebaek gap (line dips to ~39.4N west of Wonsan); X Corps: Yudam-ni (Chosin) - north to Hyesanjin on the Yalu (US 7th Div 21 Nov); ROK I Corps up the coast to near Chongjin | Mossman, *Ebb and Flow*, ch. III-IV (map 3/4); Appleman ch. XXXVIII; Wikipedia "Battle of the Ch'ongch'on River", "Battle of Chosin Reservoir" |
| ~15 Dec 1950 | Eighth Army back near the 38th parallel (line ~38.0-38.25N from the Han estuary to the east coast); X Corps in the Hungnam-Hamhung perimeter (pocket, evacuated by sea until 24 Dec) | Mossman ch. VIII-IX; Wikipedia "Hungnam evacuation" |
| 26 Dec 1950 | Imjin / 38th parallel line north of Seoul: Han estuary - lower Imjin - ~38.1-38.2N across the centre - east coast just north of 38N | Mossman ch. IX (Ridgway arrives 26 Dec; the line he found) |
| 7 Jan 1951 | Line D: Pyongtaek - Ansong - Wonju - Samchok | Mossman ch. XI; FACT_NOTES.md (move 3) |
| ~15 Mar 1951 | Seoul retaken 14-15 Mar (Op. Ripper); UN line just north of the Han / Seoul to Hongchon and the east coast ~38N (approximate) | Mossman ch. XV-XVI; Wikipedia "Operation Ripper" |
| 27 Jul 1953 | armistice line: Han estuary - Panmunjom - Chorwon - Kumhwa - Punchbowl - east coast at ~38.6N (north of the parallel in the east, south of it in the west: Kaesong north) | Armistice Agreement map; Wikipedia "Korean Demilitarized Zone" |

## Unsure / approximate
- 24 Oct spearhead shape (drawn to ~40.6N at Kojang); the ROK I Corps NE coast position (~40.85N) is approximate.
- 24 Nov: the X Corps zone between Yudam-ni and Hyesanjin was a string of columns, not a continuous line; drawn as UN-held.
- 15 Dec vs 26 Dec differ only slightly in the west (both "near the 38th parallel").
- Mar 1951 line is a smoothed "Seoul retaken" picture (Line Idaho came 22-31 Mar).
