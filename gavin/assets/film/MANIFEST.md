# Gavin / 82nd Airborne archival film clip manifest

All clips are cut from public-domain WWII film on archive.org: US Army Signal Corps / Army Pictorial Service
and US Navy (NARA holdings, "wwIIarchive"/FedFlix uploads whose `licenseurl` is the Public Domain Mark 1.0),
OWI "United News" newsreels (NARA, PDM 1.0), and Universal Newsreels released to the public domain
(`licenseurl` creativecommons.org/licenses/publicdomain/). Excluded by rule: British Pathe, Critical Past, IWM,
modern documentaries, colourised edits. No modern logos, watermarks, burned-in captions or narrator faces appear
in the cut ranges (opening title cards and the RTC timecode strip on NPC-1913 are excluded/cropped).

Regenerate everything with `bash cut_clips.sh` (downloads sources into `src/`, cuts into `clips/`; both are
git-ignored, only this manifest, the script and `.gitignore` are committed). Download ~1.5 GB, clips ~350 MB.

Format: 1920x1080 (scale + pad; 4:3 originals pillarboxed), 30 fps, H.264 crf 20, yuv420p, NO audio, 6-8 s each.
Footage is black and white and low resolution (480p or less), expect grain; letterbox bars are black.

## Sources

| id | archive.org identifier | title | licence evidence |
|---|---|---|---|
| A | `1946-01-14_82nd_Airborne_Parades_for_GI_Victory` | 82nd Airborne Parades for GI Victory (Universal Newsreel, 14 Jan 1946) | collection `universal_newsreels`; licenseurl creativecommons.org/licenses/publicdomain/ |
| B | `ADC-9948` | Newsreel: 82nd Airborne Victory Parade 5th Ave., NYC, 1/12/1946 (Signal Corps, NARA 111-ADC-9948; shows Gen. Gavin per NARA summary) | licenseurl PDM 1.0; US Army film |
| C | `ARC-38910` | June 1942 Newsreel (United News/OWI): Roosevelt-Churchill mass parachute drop, etc. | licenseurl PDM 1.0; NARA OWI film |
| D | `ARC-38922` | Sept 1942 Newsreel (United News/OWI): Airborne Troops in Mock Attack | licenseurl PDM 1.0 |
| E | `ARC-39014` | June 1944 Newsreel (United News/OWI): Airborne Forces Play Big Role (practice jumps/gliders) | licenseurl PDM 1.0 |
| F | `ARC-39048` | Feb 1945 Newsreel (United News/OWI): Air Assault Tactics (gliders, mass jump) | licenseurl PDM 1.0 |
| G | `ADC-2325` | 101st Airborne, England, Holland (Market Garden), 09/16/1944 (Signal Corps, NARA 16129) | licenseurl PDM 1.0 |
| H | `ADC-2342c` | Airborne Landing (Probably Holland WWII) (Signal Corps, from 111-ADC-2342) | licenseurl PDM 1.0 |
| I | `ADC-2043` | Pre-Invasion Glider & Paratroops, Greenham Common, England, 1944 (US Army) | licenseurl PDM 1.0 |
| J | `DDayMinu1945` | D-Day Minus One (Army Air Forces Special Film Project, 1945; 82nd and 101st Airborne, Normandy) | collection `prelinger`; licenseurl creativecommons.org/licenses/publicdomain/; US government film |
| K | `ADC-1577b` | Fire in Carentan, 06/11/1944 (Signal Corps, NARA 15384) | licenseurl PDM 1.0 |
| L | `ADC-1577d` | 82nd Airborne, Near Amfreville, 06/11/1944 (Signal Corps, NARA 15384) | licenseurl PDM 1.0 |
| M | `CB-22` | Combat Bulletin #22 (US Army Pictorial Service, Sept 1944), incl. "Airborne Operations" (Market Garden) | licenseurl PDM 1.0; US Army newsreel |
| N | `CB-28` | Combat Bulletin #28 (Oct 1944): Battle of the Netherlands (Hertogenbosch), Glider Pick-up at Eindhoven | licenseurl PDM 1.0; US Army newsreel |
| O | `1944-09-28_Battle_Rages_Along_Nazi_Wall` | Battle Rages Along Nazi Wall (Universal Newsreel, 28 Sept 1944; Eindhoven air train) | collection `universal_newsreels`; licenseurl creativecommons.org/licenses/publicdomain/ |
| P | `NPC-15676` | Invasion At Gela, Sicily: Mediterranean Amphibious Activities, 1943 (US Navy NPC film, Samuel Chase) | licenseurl PDM 1.0 |
| Q | `NPC-1913` | Bomb Damage In Harbor & City: Palermo, Sicily, 08/03/1943 (US Navy NPC) | licenseurl PDM 1.0 |
| R | `428-npc-981` | U.S. Invasion Convoy Lands: Air Raid, Licata, Sicily (NARA 428-NPC, 1943) | FedFlix/NARA US Navy film (no licenseurl set; US government work) |
| S | `428-npc-1088` | Convoy En Route, Invasion Licata, Sicily (NARA 428-NPC, July 1943) | FedFlix/NARA US Navy film (no licenseurl set; US government work) |
| T | `NPC-15743` | "D-Day, Normandy Beachhead" 06/06/1944 (US Navy NPC) | licenseurl PDM 1.0 |

## Clips

| file | source | in-out | what is visible |
|---|---|---|---|
| `airborne_training_01.mp4` | C | 1:20–1:27 | Three C-47s over open country with the first paratroopers dropping from the nearest plane (mass-drop demonstration, June 1942) |
| `airborne_training_02.mp4` | C | 1:28–1:35 | Close-up of paratroopers descending under open canopies, a C-47 passing overhead |
| `airborne_training_03.mp4` | C | 0:40–0:47 | Column of paratroopers marching in review past the camera, rifles at shoulder, dust and pines behind |
| `airborne_training_04.mp4` | E | 7:00–7:07 | Paratroopers in helmets and chutes crouching at the tail of a C-47 waiting to emplane |
| `airborne_training_05.mp4` | E | 7:55–8:02 | Group of white canopies descending over a field edge, jumpers just above the ground |
| `airborne_training_06.mp4` | E | 8:34–8:41 | Waco glider running along the airfield close to the camera on its landing roll |
| `airborne_training_07.mp4` | D | 7:42–7:49 | Line of fully-equipped paratroopers marching under the wing and past the landing gear of a C-47 |
| `airborne_training_08.mp4` | D | 7:58–8:05 | Rows of C-47s lined up on the flight line, a trooper boarding the nearest plane |
| `airborne_training_09.mp4` | F | 0:32–0:39 | Glider on tow taking off from a grass field, jeep in the foreground |
| `airborne_training_10.mp4` | F | 1:26–1:33 | Waco glider with its nose section up/forward passing close to the camera (CG-4A in flight) |
| `airborne_training_11.mp4` | F | 1:36–1:43 | Sky full of parachutes over pine trees, jumpers dropping into the zone |
| `airborne_training_12.mp4` | D | 8:36–8:43 | Troopers running from a C-47 across the airfield in a mock assault (blur of motion) |
| `sicily_ships_01.mp4` | R | 2:12–2:19 | Rapid-fire AA guns and gun crews on the deck of a US cruiser underway in the Mediterranean (1943) |
| `sicily_ships_02.mp4` | R | 2:24–2:31 | US cruiser with escorts steaming in line off a coast, deck guns in the foreground |
| `sicily_smoke_01.mp4` | R | 3:12–3:19 | Black smoke column rising over a Mediterranean harbour with ships alongside the mole (air-raid/bombardment aftermath) |
| `sicily_smoke_02.mp4` | R | 4:12–4:19 | Battleship/cruiser in foreground with huge oil-fire smoke clouds over the harbour behind |
| `sicily_convoy_01.mp4` | S | 2:05–2:12 | LST/landing ship packed with troops and vehicles ploughing through the sea, invasion convoy 1943 |
| `sicily_convoy_02.mp4` | S | 2:12–2:19 | Side of an LST at sea: deck crowded with trucks, half-tracks and troops |
| `sicily_convoy_03.mp4` | S | 3:24–3:31 | Troops lined along the rail of a transport/LST, vehicles under camouflage nets |
| `sicily_shore_01.mp4` | S | 5:20–5:27 | Distant hills with a burning oil/fuel smoke column on the Sicilian shore seen across the water |
| `sicily_troops_01.mp4` | P | 6:12–6:19 | Helmeted soldiers and sailors crowded on a transport deck, a casualty being handled (Samuel Chase, Gela/Sicily film) |
| `sicily_landingcraft_01.mp4` | P | 6:36–6:43 | Landing craft full of troops leaving the transport, wake churning (Samuel Chase, Sicily) |
| `sicily_landingcraft_02.mp4` | P | 7:24–7:31 | LCVP/landing craft seen from above heading for the beach, bow wave foaming |
| `sicily_palermo_01.mp4` | Q | 3:00–3:07 | US half-track/tank passing bomb-damaged apartment blocks in Palermo (3 Aug 1943); timecode strip cropped out |
| `sicily_palermo_02.mp4` | Q | 4:12–4:19 | Collapsed and shell-pocked buildings and wrecked street, Palermo; timecode cropped out |
| `sicily_palermo_03.mp4` | Q | 6:48–6:55 | Sunken/overturned ships and wrecked harbour installations in Palermo harbour; timecode cropped out |
| `normandy_c47_01.mp4` | J | 5:00–5:07 | Paratrooper in jump gear beside a C-47 with black-and-white invasion stripes writing on a pad before boarding (5 June 1944) |
| `normandy_ike_01.mp4` | J | 6:00–6:07 | Gen. Eisenhower in cap talking with face-blackened 101st Airborne paratroopers among tents, evening of 5 June 1944 |
| `normandy_march_01.mp4` | J | 6:40–6:47 | Paratroopers in full kit walking out to the aircraft on the airfield |
| `normandy_march_02.mp4` | J | 7:00–7:07 | Stick of paratroopers marching past the wing of a C-47 onto the dispersal |
| `normandy_faces_01.mp4` | J | 7:30–7:37 | 101st paratrooper being blackened/painted on the face before the jump, grinning |
| `normandy_boarding_01.mp4` | J | 7:56–8:03 | Paratroopers in chutes and Mae Wests lining up and climbing aboard a C-47 |
| `normandy_dusk_01.mp4` | J | 8:36–8:43 | C-47 silhouetted at dusk with troopers seated under the wing; |
| `normandy_dusk_02.mp4` | J | 9:10–9:17 | Low C-47 silhouette against the dusk sky on take-off roll |
| `normandy_drop_01.mp4` | J | 10:19–10:26 | Dark sky filled with C-47s and hundreds of parachutes drifting down (night/dawn jump, staged/actual) |
| `normandy_planes_01.mp4` | J | 10:36–10:43 | Formation of C-47 troop carriers flying among clouds |
| `normandy_aerial_01.mp4` | J | 11:40–11:47 | Aerial view of dozens of C-47s and gliders parked wing-to-wing at an English airfield |
| `normandy_glider_01.mp4` | J | 11:58–12:05 | Glider number 15 rolling on its tow, taking off on the runway |
| `normandy_gliders_air_01.mp4` | J | 12:40–12:47 | Aerial view of gliders in flight over the water under tow |
| `normandy_gliders_air_02.mp4` | J | 14:28–14:35 | Gliders in flight seen from the tow plane, field patterns below |
| `normandy_glider_wreck_01.mp4` | J | 15:00–15:07 | Wrecked Waco glider tipped on its nose after landing, invasion stripes on wings, Normandy hedgerow field |
| `normandy_glider_wreck_02.mp4` | J | 15:16–15:23 | Crashed glider with broken wing in a hedgerow-bounded Normandy field, smoke drifting |
| `normandy_roadsign_01.mp4` | J | 16:06–16:12 | Road signs for Ste-Marie-du-Mont/Carentan with GI graffiti, then US column entering a village with church tower (Utah Beach hinterland) |
| `normandy_amfreville_01.mp4` | L | 0:05–0:12 | Knocked-out tank and wrecked vehicle on a Normandy road near Amfreville (82nd Airborne sector, 11 June 1944) |
| `normandy_amfreville_02.mp4` | L | 0:24–0:31 | 82nd Airborne paratroopers marching in file along a hedgerow road near Amfreville, 11 June 1944 |
| `normandy_carentan_01.mp4` | K | 0:00–0:07 | Jeeps and mounted soldiers on horseback on a wet Normandy road, Carentan area, 11 June 1944 |
| `normandy_carentan_02.mp4` | K | 0:09–0:16 | Jeep and truck of paratroopers on a Normandy road, trees overhead |
| `normandy_beach_01.mp4` | T | 1:40–1:48 | Vehicle driving off an LST ramp onto the beach, Normandy (NPC beachhead film) |
| `normandy_beach_02.mp4` | T | 4:40–4:47 | Beached LST (US-numbered) with its bow doors open on the Normandy shore |
| `normandy_beach_03.mp4` | T | 1:54–2:01 | LST with open bow doors on the beach, tank rolling off and troops walking on the sand |
| `normandy_greenham_01.mp4` | I | 0:00–0:07 | Convoy of trucks loaded with 101st Airborne paratroopers at Greenham Common, England, before the invasion |
| `normandy_greenham_02.mp4` | I | 0:20–0:27 | Paratroopers in the back of a truck laughing, 101st patch visible, Greenham Common |
| `mg_gliders_01.mp4` | G | 0:33–0:40 | Crew loading a jeep and gun into a Waco glider on the flight line (101st Airborne, England, 16 Sept 1944) |
| `mg_gliders_02.mp4` | G | 1:24–1:31 | Glider nose art ("Bob Dunn, South Carolina, Flak Bait, Herman No Motor") close-up |
| `mg_paras_march_01.mp4` | G | 2:36–2:43 | Long column of paratroopers with full gear marching onto the airfield beside a hangar |
| `mg_c47_01.mp4` | G | 3:02–3:09 | Paratroopers walking past a C-47 painted "Aurora Dora" (Q7), tail number visible |
| `mg_c47_02.mp4` | G | 3:20–3:27 | Wide shot of paratroopers and C-47s on the airfield before Market Garden |
| `mg_flight_01.mp4` | G | 4:18–4:25 | C-47 formation in the air seen from inside another plane, cloud deck below |
| `mg_flight_02.mp4` | G | 4:30–4:37 | C-47s flying over a cloud layer on the way to Holland |
| `mg_flight_03.mp4` | G | 6:58–7:05 | Dutch patchwork fields seen from the C-47 door, first parachutes dotting the ground |
| `mg_landing_01.mp4` | H | 0:24–0:31 | Paratroopers running across a flat Dutch field after the drop; smoke on the horizon |
| `mg_drop_01.mp4` | H | 0:42–0:49 | Sky full of transports and gliders over the drop zone (Holland, 17 Sept 1944) |
| `mg_drop_02.mp4` | H | 0:52–0:59 | Hundreds of planes and parachutes over a flat Dutch landscape |
| `mg_landing_02.mp4` | H | 1:03–1:10 | Troopers dashing through a field and past a hedge after landing |
| `mg_assemble_01.mp4` | M | 20:32–20:39 | Paratroopers gathered round a jeep receiving orders, England, Sept 1944 (title card excluded) |
| `mg_c47_03.mp4` | M | 21:03–21:10 | Paratroopers climbing into a C-47 (white "W7"/"V" markings, invasion stripes) |
| `mg_takeoff_01.mp4` | M | 21:29–21:36 | C-47 taxiing and taking off with a glider line behind it |
| `mg_flight_04.mp4` | M | 22:02–22:09 | Formation of troop carriers over the Channel, Eindhoven air train |
| `mg_gliders_03.mp4` | M | 23:29–23:36 | Long line of gliders parked on the grass at an English airfield, dawn of Market Garden |
| `mg_gliders_04.mp4` | M | 23:46–23:53 | Glider on tow lifting off the runway in front of the camera |
| `mg_flight_05.mp4` | M | 23:58–24:05 | C-47 with invasion stripes seen from the wing of the lead aircraft over the coast |
| `mg_glider_landing_01.mp4` | M | 25:02–25:09 | Glider touching down on a field and another gliding in behind it |
| `mg_landing_03.mp4` | M | 25:24–25:31 | Paratrooper in helmet moving through tall grass and hedge after landing in Holland |
| `mg_landing_04.mp4` | M | 25:31–25:38 | Paratroopers with weapons and a Dutch crowd/jeep on a village road |
| `mg_airtrain_01.mp4` | O | 0:05–0:12 | Gliders and tow planes in the sky over the North Sea, airborne army air train (Eindhoven) |
| `mg_airtrain_02.mp4` | O | 0:27–0:33 | Glider under tow behind a C-47, seen against the sky (darker footage after the first seconds) |
| `mg_chutes_01.mp4` | O | 0:38–0:45 | Parachutes opening beneath the aircraft over Holland (dark, grainy) |
| `mg_sherman_01.mp4` | O | 0:44–0:51 | British Sherman tank moving through a Dutch town street (Seizure of Eindhoven) |
| `mg_sherman_02.mp4` | N | 0:35–0:42 | Column of British Shermans with crews on a Dutch street, Hertogenbosch, Oct 1944 |
| `mg_sherman_03.mp4` | N | 0:55–1:02 | Sherman Firefly with crew in a Dutch village, ammunition laid out |
| `mg_gun_01.mp4` | N | 1:05–1:12 | British 6-pounder/anti-tank gun crew firing from behind a hedge, Netherlands |
| `mg_boats_01.mp4` | N | 1:38–1:45 | British infantry crossing a canal/river in canvas assault boats, Netherlands, Oct 1944 |
| `mg_gliders_05.mp4` | N | 3:34–3:41 | Field of Waco gliders from the air, Eindhoven glider pick-up site |
| `mg_gliders_06.mp4` | N | 4:17–4:24 | Waco glider on the ground with a vehicle next to it, glider pick-up at Eindhoven |
| `gavin_parade_01.mp4` | B | 0:06–0:13 | GEN. JAMES GAVIN (two-star helmet) with other officers at Washington Square before the parade; close-up of Gavin, Washington Arch and newsreel camera behind (12 Jan 1946). Title card excluded |
| `gavin_parade_02.mp4` | B | 0:13–0:20 | Gavin standing in front of the division formation giving the order to start the march, ranks of paratroopers behind (Washington Square, NYC) |
| `gavin_parade_03.mp4` | B | 0:25–0:32 | Front rank of 82nd Airborne generals/officers marching in step down Fifth Avenue |
| `gavin_parade_04.mp4` | B | 0:35–0:42 | High angle: division massed in columns at Washington Square with the Arch in the background |
| `gavin_parade_05.mp4` | B | 0:45–0:52 | Jeeps towing howitzers along the avenue past dense crowds, aerial view |
| `gavin_parade_06.mp4` | B | 0:55–1:02 | Crowd lining the route cheering and saluting, general officers in the front, child in foreground |
| `gavin_parade_07.mp4` | B | 1:43–1:50 | Head-on shot of the lead rank of marching paratroopers on Fifth Avenue in jump boots and helmets |
| `gavin_parade_08.mp4` | B | 2:08–2:15 | Tanks with white stars rolling down Fifth Avenue |
| `gavin_parade_09.mp4` | B | 2:18–2:25 | Self-propelled guns of the division passing buildings on Fifth Avenue, crowds behind |
| `gavin_parade_10.mp4` | B | 2:45–2:52 | Reviewing stand with officials and officers saluting, AIRBORNE division banner, helmets in the foreground |
| `gavin_parade_11.mp4` | A | 0:05–0:12 | Paratroopers with colours marching up Fifth Avenue between skyscrapers (Universal newsreel; pillarboxed) |
| `gavin_parade_12.mp4` | A | 0:14–0:21 | Aerial view of the 82nd Airborne columns marching down Fifth Avenue, crowds both sides |
| `gavin_parade_13.mp4` | A | 0:20–0:27 | Colour guard carrying American flag and division flags in the parade |
| `gavin_parade_14.mp4` | A | 1:04–1:11 | Overhead view of the division columns, mounted officers and band moving down the avenue |
| `gavin_parade_15.mp4` | A | 1:09–1:16 | Close-up of marching paratroopers' faces, ticker-tape confetti falling |
| `gavin_parade_16.mp4` | A | 1:25–1:32 | Division mascot dog trotting down the avenue ahead of the marching troops |

## Notes and gaps

- **Gavin himself:** only source B (ADC-9948) is documented (NARA summary) as showing Gen. Gavin: `gavin_parade_01` (close-up, two stars, Washington Square) and `_02` (he gives the order to march). The other parade clips are the 82nd's columns; Gavin is not individually identified in them. No wartime (Sicily/Normandy/Holland) footage clearly showing Gavin was found.
- **Normandy:** the airborne boarding/Eisenhower/glider material (source J) is mostly 101st Airborne (Ike with face-blackened 101st men; 101st patches); Amfreville clips (L) are the 82nd. No 82nd drop footage as such exists.
- **Sicily:** thin. No paratrooper/C-47 night footage and no Tiger tanks found in PD sources. Clips are Navy convoy/landing-craft/cruiser material (R, S, P: harbour and location labels are approximate, "Licata/Gela" film) and bombed Palermo (Q). NPC-2020 (mislabelled Sicily/Normandy, burned-in timecode) was rejected.
- **Utah Beach / Sainte-Mere-Eglise:** no dedicated footage; `normandy_beach_*` are NPC-15743 LST beaching shots (Omaha-area, USCG), `normandy_roadsign_01` shows signs for Ste-Marie-du-Mont/Carentan and a column entering a village.
- **Nijmegen / Waal bridge:** not found in PD sources (only Hertogenbosch/Eindhoven footage). British Shermans, assault boats (river/canal crossing) and the Eindhoven glider sites stand in.
- Several Market Garden shots (mg_flight_03/04, mg_chutes_01, mg_airtrain_02, mg_landing_01/02) are dark or grainy originals.
