# S09 Champion Hill (14-16 May 1863), D = 179.14 s

Regions `wide` (prelude, troopScale 8) -> cloud dive at 32.6 s (push 28.8, land 35.95) -> `champion` (troopScale 1.7, close arrows width 0.22).
Positions from data/geo.json (units "championhill") + FACT_NOTES section 8. Sheet: `sheet.jpg` (24 stills).

| t (s) | shot | on the words |
| --- | --- | --- |
| 0-13 | wide over Edwards/Bolton/Raymond; Pemberton banner at Edwards, three red groups, four blue groups east | plaque 14 MAY DAY 15; "council of war" label (3.75); plaque 15 MAY + red arrow SE toward Dillon's on "march south-east" (6.6); pale blue arrow + "Grant's supply line?" on "supply line" (8.9); both fade, label "Not there" on "not there" (12.5) |
| 14-28 | push to the Baker's Creek crossing; column stalls, red loop arrow; night dissolve 16.6-17.5 (campfires); day back 19.6-20.5 | "Baker's Creek" + "A day lost" on "flooded creek"; plaque 16 MAY DAY 17 on "sixteenth"; "Johnston's order, again"; about-turn arrow on "turned his army around"; "Wagons still turning" on "wagons" |
| 28-32.6 | three blue arrows on the Jackson / Middle / Raymond roads, Grant banner; red groups move east onto the ridge; push-in, deck | "Grant's army came at him from the east" |
| 32.6-53 | dive emerges over the red line on the ridge (Stevenson N, Bowen at the Middle road, Loring on the Raymond road), pan west to Baker's Creek | "Champion Hill" ground label (36.5); Grant quote card 39.9-45; three road names on "Three roads"; "Baker's Creek"; two "crossing" labels on "crossings" |
| 53-78 | Hovey up the Jackson road (red guns fire, smoke), crest + guns taken (guns grey 59.8); Logan swings round the north end, Barton recoils; pan SE to McClernand's four idle divisions; pull back: Grant banner, two thin order arrows | clock 11:00 on "eleven o'clock", runs to 1:00; Hovey / Logan / McClernand cards on their names; "McClernand did not come" |
| 78-117 | Bowen (Cockrell, Green) counterattack: crest retaken (fresh red battery), Hovey driven nearly to the Champion house; massed Union batteries (11 shots) + Crocker's two brigades up the slope, Bowen thrown back, battery lost again (grey) | Bowen card; clock to 2:30; "Contested for the third time" (Hovey's report); number 1,200 on "twelve hundred"; Hovey quote card "literally the hill of death" |
| 117-141 | north end: Logan's brigade astride the Jackson road west of the crossroads; pulled away east; road reopens | "The only road out"; Grant quote card "Neither Logan nor I knew..."; "The road is open again"; clock run to 3:30 on "between three and four" |
| 140-147 | rout: red columns west by the Jackson road (upper bridge) and the Ratliff-road line to the Raymond-road crossing (Pemberton's real escape), two red arrows; timeline seal "Champion Hill" | "broke and fled west" |
| 142-158 | Loring's division peels off south and fades over the frame edge; Tilghman's rearguard + battery near the Coker house; A. J. Smith's battery: the shell (impact 156.0) | Loring card; Tilghman card; clock to 5:20 (OR2: 5:20 p.m.) |
| 158-179 | pull up over the field; ledger: Union 2,441 (410 / 1,844 / 187), Confederates ~3,800 (most captured), Loring's division cut off; night dissolve 171.4-173, campfires, Grant banner on the hill | "That night" label on "porch" |

Sound cues (59): guns/booms only for the crest guns (Hovey's climb), the massed batteries, Tilghman's battery + the fatal shell; volleys only where the camera looks; dive whoosh.

Portraits (cut like engine/assets/generals, 400x400): Hovey = LoC cwpb.06985 (via Wikimedia Commons "Alvin P. Hovey LOC cwpb.06985.jpg"); Logan = LoC cwpb.07018 (Brady);
McClernand = LoC cwpb.06457; Bowen = LoC cwpb.07423; Loring = Wikimedia Commons "Portrait of Brigadier General William Wing Loring.png" (Wikipedia lead image;
period photograph, desaturated, flat crop without cut-out because rembg lost the grey coat); Tilghman = `grant/assets/media/tilghman_head.png` (existing project cut-out).

Open issues
- Champion region is heavily wooded: boxes in the woods read less well than on the crest clearings; the lower escape route runs through woods.
- The wide map's town glyphs (Edwards, Bolton, Raymond) are red crosses from the bake and sit near the red units.
- Loring portrait licence not re-checked on Commons (rate-limited): verify it is the public-domain period photograph before publishing.
- Clock runs on to 5:20 for Tilghman (sourced, OR2) rather than stopping at ~3:30.

## Round 2 fixes (critics A + B round 1)
| finding | what I did |
| --- | --- |
| B sev 3 / A sev 2: crest fight 88-112 s a tangle of red inside blue | Every crest unit is now keyed in FRONT coordinates (`FR(s, p)`: s along the attack axis Champion house -> crest, p across it). Hovey + Crocker always on the Union side, Lee + Bowen + Cumming on the other, a 3.5-5 unit gap that moves: crest taken (59) -> Bowen pushes Hovey nearly to the Champion house (91.5) -> Union line + massed guns at the foot -> the third push carries the crest again (105-108), the fresh red battery turns grey in front of the blue line. Camera turned ALONG the axis for 89-117 s (yaw -30..-42, tilt 37-40): Union line at the top, Confederate line below, gap across the frame. Lee / Cumming / Barton moved so they no longer sit inside Logan's lines (59-66, 121 s). |
| A: massed Union guns 97-104 show no flashes | The three batteries now stand IN FRONT of the rallied line (as the narration says) and fire 11 shots 99.8-108.2 with an explicit muzzle flash each (`flash`), impacts on Bowen's line low on the slope, then on the crest after "contested"; gun + boom cues come from fx.guns. |
| B sev 2: clock 12:14 "Hovey takes the crest" vs "eleven o'clock" | 11:00 holds from "eleven o'clock" (53.6) to "took it"; the hands spin 11:00 -> 13:00 between 58.6 and 59.7 (FACT: crest ~1 p.m.), note "Hovey takes the crest" on 59.1. |
| B sev 2: ledger "~3,800" | "Confederates about 3,800". |
| A sev 2: Grant banner cut by the top edge (75-78, 162-168), Bowen card at the bottom edge (81-84) | Grant banner moved down the slope (1650.6, 693.0), in on "sent order after order" (73.6) with a camera pulled north (keys 74.2 / 77.6); out before the camera turns along the crest axis (87.9); back 117.6-135.4 (out before it leaves the frame); not up during the ledger; back on the hill for "That night". Bowen card above-right of its unit (offset 150, -250). Order arrows shortened to stay inside the frame. |
| A sev 2: dark teal woods blanket (S09 close mean 70,79,72) | Scene grade `close: { toe: 34, bl: -6, gl: -1 }`: lifted, warmer canopy; close stills now mean ~(84-95, 90-99, 79-84). |
| A sev 3: world edge ~97-105 TR (and 62-66 TL, 72-80 TR found by the check) | All camera keys re-tilted / moved; frustum-corner check (`edges.js`, see report) OK at margin 1 except 0.5 s inside the night dissolve at 172.8 (haze). |
| A sev 2: smoke = round puffs | Volleys are engine smokeLines (`SMOKE_GM` curtains); all crest curtains redrawn along the new lines (front coordinates). |
| B sev 1: Logan arrow 2 s early | t0 120.1 (on "Logan's men" 120.19). |
| check_paths: wide groups crossed Baker's Creek | The wide-map Confederate groups now cross only near the lower bridge and stay east of the creek after the about-turn (26.6 / 28.6 keys); `check_paths S09` OK. |
| quote cards dim the map | `dim: 0.4` on the three quote cards (camera keeps moving under them). |
| rout / Loring arrows ran off the frame | shortened to end inside the frame. |
Open: wide-map cloud at the lower-left corner 1-12 s (unchanged); scene folder 25.5 MB (two regions, unchanged).

## Round 3 fixes (critics A + B round 2)
| Finding | Fix |
| --- | --- |
| B N7: McClernand card cut by the right edge 66-70 | card offset [-440, -150] (left of its anchor); the camera reaches McClernand's roads at 69.6 (was 70.8) |
| B N11: clock read 11:36 at 58.0 | the 13:00 run starts on "took it" (59.18) and lasts 0.95 s: 11:00 holds until the crest is taken |
| A: smoke puffs on the boxes 96-110 (and the crest guns 58) | volleys = dense v7 battalion curtains (rate x2.6, size 1.0, alpha 0.17, cluster [1.5, 0.8], seated 2.2); every gun (massed Union guns, crest guns, Tilghman / A. J. Smith) fires small forward-jetting plumes (`plume 0.45, puffs 7, jet 1.6`) instead of round puffs |
| A N6: wide clouds lower-left 0-12 | keepClear [1580, 790, 95] + [1625, 800, 70] |
| A: four furniture pieces 166-172; boxes over the timeline (172 on "18") | legend out at 161.25 before the ledger; the timeline now only shows 140.6-144.5 for the Champion Hill seal (hidden on "Loring"); legend also out for the crest fight 84.8-118.9 (red boxes sat under it); end camera nudged south (171.4 / 173 keys) so McClernand's columns are above the bottom edge (check_edges OK) |
| A N5: arrow at 87 (2x long, off the bottom edge, head on the Union boxes) | Bowen's two arrows short (s 3.4 -> -1.0), width 0.19, in front of each brigade, gone at 88.4 before the brigades reach them; the reinforcement arrows (104-109) start inside the frame (s -6.4 -> 1.6) |
| A N7: sheared boxes 100-110 | crest-fight keys 89-108.6 at fov 22, dist x1.36 (same framing, much less perspective shear: boxes are upright rectangles) |
| B N4 (engine, lead/other agent): boxes on the dive cloud 31-33 | engine diveHide + short white-out; checked on the stills at 31.9 / 33.2 |
Checks: check_paths OK, check_edges OK, check_escapes as round 2 (Loring's escapes have no bridge: they leave south-east by road).
