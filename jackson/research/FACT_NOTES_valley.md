# `valley` + `portrep` maps: places, control and front lines (MOVE 1 agent, Jackson #11)

Basemaps: `valley_hd_ref` (z10, 118.9 m/px; `GG.proj(10, 72542, 99422)`), `portrep_hd_ref` (z12, 30 m/px; `GG.proj(12, 293268, 402433)`).
Tools: `tools/make_valley_osm.py` (rivers from OSM via Nominatim; Overpass was down), `tools/make_valley_geo.py [valley|portrep] [--check]`,
`tools/make_valley_control.py`, `tools/make_valley_inline.py` (pastes `scenes-src/move1_kit.js` + `cavalry_icon.js` + the JSON into the
move 1 scenes). Outputs in `assets/media/`: `valley_geo_ref.png`, `valley_geo.json`, `portrep_geo_ref.png`, `portrep_geo.json`,
`valley_ctl_<date>_mx.png`, `valley_fronts.json`. Rivers: (c) OpenStreetMap contributors, ODbL (credit with the map credits).

## Story places (lat, lon) and how they were checked
USGS GNIS town centres (standard coordinates), each placed on the HD relief with `make_valley_geo.py --check` and compared with the
relative layout of Hotchkiss/Humphreys' 1880 sheet (`assets/media/archive_hotchkiss_valley_campaign.jpg`: No. VI Winchester region,
No. V route Franklin/Swift Run Gap, No. IV McDowell, No. III Kernstown, No. VIII Cross Keys, No. IX Port Republic) and NPS / ABT maps.
| place | lat, lon | check |
|---|---|---|
| Winchester | 39.1857, -78.1633 | GNIS; on the Valley Pike, Hotchkiss VI |
| Kernstown (village) / battlefield (Pritchard's Hill - Sandy Ridge) | 39.1415, -78.1833 / ~39.148, -78.199 | GNIS; NPS/ABT Kernstown map: Union on Pritchard's Hill W of the Pike, Jackson's attack by Sandy Ridge to the west |
| Newtown (Stephens City), Middletown | 39.0834, -78.2181; 39.0276, -78.2803 | GNIS, on the Pike (Banks's retreat 24 May; Middletown = where his column was struck) |
| Strasburg | 38.9887, -78.3586 | GNIS; N end of the Massanutten, on the North Fork (Hotchkiss VI) |
| Front Royal | 38.9182, -78.1944 | GNIS; just S of the forks' confluence (OSM confluence 38.944, -78.188) |
| Cedarville | 38.989, -78.183 | GNIS; Front Royal - Winchester road |
| New Market | 38.6479, -78.6714 | GNIS; W foot of the Massanutten gap road |
| Luray | 38.6654, -78.4594 | GNIS; Luray (Page) valley, E of the mountain |
| Harrisonburg, Staunton | 38.4496, -78.8689; 38.1496, -79.0717 | GNIS |
| McDowell (village) | 38.3307, -79.4931 | GNIS; Bullpasture valley; Sitlington's Hill just SE (Hotchkiss IV) |
| Cross Keys / Union Church | 38.3557, -78.8364 / 38.360, -78.836 | GNIS; Ewell's line on the ridge S of Mill Creek (Hotchkiss VIII), ~4.5 mi NW of Port Republic |
| Port Republic | 38.2954, -78.8100 | GNIS; at the confluence of North River + South River = start of the South Fork (OSM) |
| The Coaling / Lewiston | 38.3005, -78.7875 | NPS/ABT Port Republic map: Tyler's left on the Coaling at the foot of the Blue Ridge, line to the river |
| Conrad's Store (Elkton) | 38.4079, -78.6236 | GNIS (Elkton) |
| Williamsport MD | 39.6006, -77.8205 | GNIS; Banks's Potomac crossing |
| Wardensville, Moorefield | 39.0759, -78.5944; 39.06, -78.97 | GNIS; Frémont's approach to Strasburg (Franklin - Moorefield - Wardensville) |
| White House bridge, Columbia bridge (South Fork) | ~38.656, -78.508; ~38.559, -78.580 | APPROXIMATE (Hotchkiss V shows both on the South Fork W/SW of Luray); scenes show fires without bridge names |
| North River bridge (Port Republic) | at the N edge of the town on the North River | Henderson: Jackson burned the North River bridge after crossing; NOT labelled by name on screen ("BRIDGE BURNED") |
- Massanutten crest: Signal Knob (38.95, -78.31) to the S end above Keezletown (38.47, -78.72), axis checked on the DEM (two parallel ridges
  with Fort Valley between them in the north; the glow follows the middle of the massif). ~40 mi straight, ~50 mi along the ridges = script.
- 1862 roads drawn faint: Valley Pike (Staunton - Winchester - Williamsport), New Market - Luray gap road (the one road over the mountain),
  Luray - Front Royal, Front Royal - Winchester, Front Royal - Strasburg, Luray - Conrad's Store - Port Republic, Harrisonburg - Cross Keys -
  Port Republic, Staunton - McDowell, Strasburg - Wardensville. Drawn through the towns they joined (not surveyed traces).

## Control map per date (`valley_ctl_<date>_mx.png`; Union-held = red, Confederate = blue; approximate 3-8 km)
The 1862 Valley had no continuous front: picket screens, garrisons and empty mountains. Lines are drawn plainly at the forward Union posts.
Maryland (north/east of the Potomac, real OSM river) is Union on every date. The Alleghenies W of the Valley (Frémont's Mountain
Department: Franklin, Moorefield, Romney) are drawn Union on every date, with their eastern edge per date below.
| date | Union-held | sources |
|---|---|---|
| mar23 (Kernstown) | lower Valley N of ~Strasburg (Shields at Winchester; cavalry to Strasburg 19-20 Mar); Alleghenies to Milroy's posts toward Monterey; N. Virginia S to the Rappahannock line (Johnston left Manassas 9 Mar; Fredericksburg Confederate until 18 Apr) | EVA Valley Campaign; Henderson ch. VII; NPS Valley timeline |
| may8 (McDowell) | Milroy/Schenck at McDowell; Banks around New Market (fell back to Strasburg by 13 May); Union in the Luray valley; McDowell's corps at Falmouth / Fredericksburg | Henderson; NPS Cedar Creek & Belle Grove timeline |
| may20 (the Massanutten beat) | Banks at Strasburg (works facing S), outposts toward Fisher's Hill; Kenly's 1st Maryland at Front Royal, pickets S of the town; Geary on the Manassas Gap RR; Frémont back at Franklin | Henderson; NPS; ABT Front Royal |
| may23 (evening, after Front Royal) | as may20 but Front Royal + the Luray valley Confederate; Union pickets toward Cedarville/Winchester | NPS/ABT Front Royal |
| may26 (after First Winchester) | Valley Confederate to the Potomac except the Harpers Ferry garrison (Saxton); Frémont still W of the Valley; N. Virginia Union | Henderson; ABT First Winchester |
| jun1 (Strasburg) | Frémont on the Wardensville road at the W edge of Strasburg; Shields at Front Royal (retaken 30 May) pushing W; Harpers Ferry Union; the Pike Strasburg -> S Confederate | Henderson; NPS timeline |
| jun7 (eve of Cross Keys) | Frémont at Harrisonburg (6 Jun) and everything N of him; Shields's division in the Luray valley to near Conrad's Store / Lewiston; Jackson around Port Republic / Cross Keys | NPS Cross Keys / Port Republic; Henderson |
Virginia-wide overlays for move1a/move1e are the HOOK agent's (`virginia_ctl_may62_mx`, `virginia_ctl_jun62_mx`; FACT_NOTES_virginia.md).

## Front lines drawn by hand in the close-ups (option 2, `K.front`, Confederate on the left of travel)
- Kernstown 23 Mar: E-W across the Pike just S of Kernstown; blue attack from the SW (Sandy Ridge), falls back S (schematic, ~2 km wide).
- McDowell 8 May: NE-SW line between the village and Sitlington's Hill; red thrown back N toward Franklin.
- Front Royal 23 May: S of the town, moving N past it as the garrison breaks (Kenly retreated N toward Cedarville).
- First Winchester 25 May: S of Winchester (Bowers Hill side), moving N as Banks's line breaks.
- Cross Keys 8 Jun: along Mill Creek between Union Church (N) and Ewell's ridge (S); red pushed back N.
- Port Republic 9 Jun: river (S Fork) - Coaling line facing SW; red breaks NE toward Conrad's Store.

## Numbers on screen (all from FACT_NOTES.md)
McClellan 100,000+ (script) · McDowell ~40,000 · Jackson + Ewell ~17,000 · Front Royal garrison ~1,000 (900-1,063; "most captured") ·
Winchester ~16,000 vs ~6,500 · 35 miles to the Potomac · 13 states call out militia · 20,000 men · Cross Keys ~5,800 vs ~11,500 ·
Tyler ~3,000 · RESULT: 6 battles (lost only the first) · ~650 miles · Union ~5,400 · Confederate ~2,800 (NPS sums, six battles, k+w+m).

## Unsure / to double-check
- Exact South Fork bridges burned 2-4 June (White House, Columbia, Conrad's Store?) and by whom (cavalry detachments; Ashby killed 6 Jun):
  scenes say only "CAVALRY" + "SOUTH FORK BRIDGES BURNED" (FACT_NOTES: "standard (Henderson); double-check").
- Union outposts S of Strasburg on 20-22 May and the Union presence in the Luray valley on 8 May are approximate.
- The "third force from the Potomac" arrow in move1-6 (Banks/Saxton/Sigel at Harpers Ferry - Williamsport) is schematic.
