# nwkorea (z9) + unsan (z12) maps: control maps, front lines, places (move 1 map agent)
Generators: `tools/make_nwkorea_geo.py` (geo layer + rivers), `tools/make_nwkorea_control.py` (control overlays + fronts),
`tools/make_unsan_geo.py` (close-up layer), `tools/make_nwkorea_inline.py` (inlines the JSON into scenes-src/move1a/b/c.js),
`tools/make_nwkorea_tmpflags.py` (TEMPORARY PRC/ROK/UN flags until the real files land).

## Shared, READY (read-only for move 2)
- `assets/media/nwkorea_geo_ref.png` (5760x3240, show at 2880x1620, above the territory layer): big towns only (Pyongyang, Sinuiju,
  Antung, Chinnampo, Kanggye, Hamhung, Hungnam, Wonsan, Chongju, Huichon, Songjin, Pukchong, Hyesanjin) + rotated river names
  YALU / CHONGCHON / TAEDONG. NOT in the layer (box them in scenes): Unsan, Onjong, Chosan, Kojang, Ipsok, Anju, Kunu-ri, Sunchon,
  Tokchon, Kujang-dong, Manpojin.
- `assets/media/nwkorea_rivers.json` {"yalu","chongchon","kuryong","taedong","taeryong"}: map px, source -> mouth. Real OSM geometry
  (Nominatim relations/ways, (c) OpenStreetMap contributors ODbL; raw: assets/src/nwkorea_rivers_osm.json).
- `assets/media/nwkorea_fronts.json`: places (map px) + base fronts per date (WEST -> EAST, communist side on the left =
  `K.front({ sideA: "carth", sideB: "rome" })`) + valley fingers.
- Projection: `GG.proj(9, 109971, 48858)`; unsan: `GG.proj(12, 889412, 396235)`.
- Colours as korea overlays: communist (110,160,255) a .565, China lighter .42; UN (232,52,52) + bright rim. Border = the OSM Yalu.

## Control map log (option 1 overlays `nwkorea_ctl_<date>_mx.png`)
| date | line | sources |
|---|---|---|
| 24 Oct 1950 | Base = the Chongchon line (Pakchon - S of Yongbyon - Kunu-ri - Tokchon area), then S of the Taebaek gap to the X Corps coastal strip Wonsan - Hamhung - Pukchong - Songjin (~40.85N). UN "fingers" = the separate columns: 27th Bde/24th Div at Pakchon; ROK 1st Div Yongbyon -> toward Unsan; ROK 6th/8th up the Chongchon valley to Huichon and W to Onjong; ROK 3rd Div NW of Hamhung toward Sudong. The mountains between are communist-held (KPA remnants, hidden PVA). | Appleman ch. XXXIII (ROK 6th at Huichon 23 Oct, 7th Regt through Onjong night 24-25, Kojang 25, Chosan 26; ROK 8th Kujang 25-26; 27th Bde crossed the Taeryong at Pakchon 25 Oct; ROK 1st to Unsan 25 Oct) |
| 1 Nov 1950 | High-water mark: 21st Inf at Chonggo-dong (18 air mi from Sinuiju), 5th RCT ~10 mi N of Kusong, Taechon; the Unsan salient; then the ROK II Corps collapse: line pivots S at Kunu-ri, ROK 7th Div pushed to Won-ni S of the Chongchon, open right flank; the Taebaek gap; X Corps as 24 Oct + Sudong. | Appleman ch. XXXIII ("On the West Coastal Road", "Chinese Strike the ROK II Corps": 29 Oct-1 Nov) |
| 6 Nov 1950 | Eighth Army behind the Chongchon with a bridgehead N of it (river mouth - Pakchon - S of Yongsan-dong/Ipsok - back to the river near Kunu-ri), then E along the south bank into the Taebaek; X Corps unchanged. | Mossman, Ebb and Flow ch. I/II (bridgehead "arching from the mouth of the river to a depth of ten miles and then returning to the Ch'ongch'on some thirty-five miles upstream" - described for mid-Nov, used for 6 Nov); Appleman ch. XXXIV (TF Allen covers the withdrawal S of the Chongchon) |

## Places (approximate, ~1-3 km)
- Unsan (1950 town) 39.968N 125.825E: NOT modern Unsan-up (40.11N, county seat moved). Fixed from Appleman's geometry against the
  real Kuryong (OSM) + DEM streams: Camel's Head Bend (loop with the Nammyon from the west) ~3 mi SW, Turtle Head Bend further S,
  Ipsok S of the Kuryong ~6 mi, the ford SE of the road fork. Hook agent used 39.96N 125.83E (consistent).
- Onjong 40.06N 125.99E ("ten air miles NE of Unsan"); Kojang 40.57N 125.92E (18 air mi S of Chosan); Chosan 40.83N 125.81E;
  Pukchin 40.20N 125.75E; Yongbyon 39.814N 125.805E; Kunu-ri 39.70N 125.90E; Chonggo-dong ~39.93N 124.68E (approximate).
- Unsan close-up (unsan px): road fork 1.5 mi S of town (1371,936); roadblock just E of the fork on the only exit road (Appleman:
  347th Regt, 116th Div; cut at 02:30); ford over the Kuryong (1464,950); Ipsok (1470,1133); 3rd Bn CP N of the Nammyon bridge at the
  nose of Camel's Head Bend (1276,980); Bugle Hill = ridge across the road S of Turtle Head Bend (1212,1150); 8th Cav arc: 1st Bn ~1 mi
  N, 2nd Bn ~3 mi W across the E-W road, 3rd Bn on the MSR ~3 mi S (Appleman "Unsan - Prelude"); ROK 15th E of the river.

## Unsure / deviations
- Script note "gap labelled ~50 MILES": no source in FACT_NOTES; Mossman gives "forty-mile gap" (late Nov). On screen: "NO FRONT · THE GAP"
  + TAEBAEK MOUNTAINS, no mileage.
- The trap behind the ROK 7th Regt (29 Oct, ~20 mi S of Kojang) was set by the CCF 125th Div per Appleman; the 40TH ARMY label is used
  only at Onjong (Wikipedia Onjong), not on the Kojang arrows.
- Wake quote on screen as "GREATEST SLAUGHTER" (Appleman's verbatim has no "the").
- Army labels in the night march (39th -> Unsan, 40th -> Onjong, 38th -> Huichon) are destinations only; crossing points not claimed.
- ~200,000 IN THE MOUNTAINS = XIII Army Group first wave (Mossman via FACT_NOTES); 0 SEEN FROM THE AIR = Appleman ch. XXXVIII.
