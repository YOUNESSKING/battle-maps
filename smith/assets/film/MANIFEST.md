# Smith / Korea 1950 archival film clip manifest

All clips are cut from public-domain US-government film held by the US National Archives
(NARA), downloaded from archive.org's FedFlix / `opensource_movies` collections. All are
1950 combat/newsreel footage produced by the US Navy, Marine Corps or Army Signal Corps —
public domain (`licenseurl` on the ADC-9438/9439/10271/TheHungnamStory items is explicitly
`creativecommons.org/publicdomain/mark/1.0/`; the `111-adc-*` and `428-npc-*` items are
uncatalogued-license NARA/FedFlix uploads of the same US-government Signal Corps/Army
Pictorial Center film, also public domain as US government works). No modern logos,
watermarks or narrator text overlays appear in any of the cut ranges.

Regenerate all clips with `bash cut_clips.sh` (downloads sources into `src/`, cuts into
`clips/`; both are git-ignored — only this manifest, the script and `.gitignore` are
committed).

Format: 1920x1080 (scale + pad, letterboxed for the 4:3 originals), 30 fps, H.264 crf 20,
no audio.

## Sources

| id | title | archive.org identifier | duration | license |
|---|---|---|---|---|
| A | KOREAN WAR. INCHON; MACARTHUR GOES ASHORE, INCHON | `111-adc-8251` | 6:24 | US govt film (NARA/FedFlix) |
| B | Air Operations Aboard USS Valley Forge; Activities in Inchon Harbor (Invasion), Korea | `111-adc-8289` | 6:54 | US govt film (NARA/FedFlix) |
| C | KOREAN WAR. INCHON; MAJ GEN O.P. SMITH turning over city to S.K. officials; Capitol Bldg, Seoul; Kimpo Airfield | `111-adc-8328` | 10:33 | US govt film (NARA/FedFlix) |
| D | Withdrawal of 1st Marine, Hamhung/Hagaru-ri to Hamhung, Chosin Reservoir Area (Dec 8-10 1950) | `111-adc-8579` | 12:38 | US govt film (NARA/FedFlix) |
| E | WITHDRAWAL FIRST MARINES, 1ST MARINE DIV. FROM CHOSIN RESERVOIR AREA, KOTO-RI (Dec 10 1950) | `111-adc-8580` | 11:24 | US govt film (NARA/FedFlix) |
| F | EVACUATION, HUNGNAM, KOREA (Dec 24-25 1950 — includes port demolition) | `111-adc-8632` | 7:23 | US govt film (NARA/FedFlix) |
| G | BOMBARDMENT OF HUNGNAM, KOREA (Dec 9 1950) | `428-npc-173` | 9:48 | US govt film (NARA/FedFlix) |
| H | Marine Retreat Chosin Reservoir; C-119 Airdrop, Korean War (Dec 1950) | `ADC-10271` | 10:08 | CC PD Mark 1.0 |
| I | Remnants of 5th and 7th Regiments, 1st Marine Div, aboard transports after Chosin (12/11/1950) | `ADC-9438` | 5:24 | CC PD Mark 1.0 |
| J | Korean War Medical Air Evacuation; Gen. MacArthur (12/1950) | `ADC-9439` | 7:56 | CC PD Mark 1.0 |
| K | With the Marines: Chosin to Hungnam ("The Hungnam Story", US Navy, 1950/51) | `TheHungnamStory` | 10:58 | CC PD Mark 1.0 |

## Clips

| file | source | in–out | description |
|---|---|---|---|
| `inchon_wolmido_01.mp4` | B | 0:54–1:06 | US destroyer firing its deck guns during the pre-landing naval bombardment of Inchon/Wolmi-do |
| `inchon_wolmido_02.mp4` | B | 3:06–3:18 | Shell splashes and smoke over the water off Inchon during the naval bombardment |
| `inchon_ships_01.mp4` | B | 3:26–3:38 | LST beached at Inchon, bulldozer and men unloading materiel onto the beach |
| `inchon_seawall_01.mp4` | C | 0:06–0:18 | Marines climbing down cargo nets from a transport into a landing craft (embarkation for the landing; not a seawall-climb shot — none found in the PD sources reviewed) |
| `inchon_city_01.mp4` | C | 1:58–2:10 | Korean and American flags over the entrance to the Seoul Capitol building, crowds gathering for the turnover ceremony |
| `macarthur_01.mp4` | C | 7:02–7:14 | MacArthur and Korean/US dignitaries at the podium, Seoul Capitol turnover ceremony (Sept 29 1950) |
| `macarthur_02.mp4` | A | 1:00–1:12 | MacArthur ashore at Inchon, meeting Marine officers |
| `officers_01.mp4` | A | 2:20–2:32 | MacArthur and staff officers conferring outdoors near the Inchon front |
| `chosin_snow_march_01.mp4` | D | 2:58–3:10 | Large Marine column marching across open snowy terrain, mountains behind |
| `chosin_snow_march_02.mp4` | H | 0:32–0:44 | Marine column marching through a snowy valley, trucks alongside |
| `chosin_snow_march_03.mp4` | K | 9:28–9:40 | Marine column marching in snow, clean wide shot |
| `chosin_cold_01.mp4` | H | 9:38–9:48 | Marines prone in the snow with rifles, hunkered down against the cold |
| `chosin_cold_02.mp4` | D | 3:00–3:12 | Marines in heavy cold-weather gear, close-up |
| `hagaru_airstrip_01.mp4` | J | 1:48–2:00 | C-119/C-47 transport taxiing on the packed-snow airstrip at Hagaru-ri |
| `hagaru_airstrip_02.mp4` | J | 7:20–7:32 | Wounded Marine on a stretcher loaded through a transport plane's door |
| `hagaru_airstrip_03.mp4` | H | 2:48–3:00 | C-47 close-up, propeller spinning, another transport visible behind, Hagaru-ri airstrip |
| `corsair_01.mp4` | C | 7:28–7:40 | F4U Corsair (VMF-212) taxiing and taking off at Kimpo airfield |
| `corsair_02.mp4` | C | 7:46–7:58 | Corsairs parked close-up at Kimpo, propellers spinning, ground crew working |
| `airdrop_01.mp4` | H | 5:52–6:04 | C-119 crew silhouetted at the open cargo door, preparing an aerial resupply drop over the Chosin perimeter |
| `vehicles_dead_01.mp4` | E | 0:24–0:36 | Column of destroyed/wrecked vehicles and equipment half-buried in snow |
| `artillery_snow_01.mp4` | F | 0:08–0:20 | Marine howitzers firing in the snow near the Hungnam perimeter buildings |
| `foxholes_snow_01.mp4` | H | 1:36–1:48 | Marines in foxholes/trench positions in the snow |
| `hungnam_ships_01.mp4` | I | 0:24–0:36 | Transport/merchant ships at anchor in Hungnam harbor during the evacuation |
| `hungnam_ships_02.mp4` | I | 3:20–3:32 | LVTs/amtracs moving cargo at dockside, Hungnam |
| `hungnam_explosion_01.mp4` | F | 5:04–5:16 | Dockside "DUNNAGE" storage building erupting in smoke and flame during the demolition of Hungnam port facilities (Dec 24-25 1950) |
| `hungnam_explosion_02.mp4` | F | 5:52–6:04 | Cluster of explosions over the harbor near departing ships, Hungnam port demolition |
| `hungnam_explosion_03.mp4` | G | 4:08–4:20 | Mushroom-cloud explosion during the naval bombardment covering the Hungnam perimeter (Dec 9 1950) |

## Not found in this pass

- **Treadway bridge at Funchilin Pass** (engineers/vehicles crossing the airdropped Treadway
  bridge sections): no dedicated archive.org film identified. `111-adc-8580` ("WITHDRAWAL
  FIRST MARINES ... KOTO-RI", the area nearest the pass) was downloaded and screened at
  3s resolution through its convoy/road sections — only open-road convoy shots, no bridge
  structure visible. A finer pass through `111-adc-8579`/`111-adc-8580` in full, or a search
  for a dedicated Marine Corps engineer/combat-camera reel of the bridge, would be the next
  step.
- **Corsair napalm strike / strafing run** (aircraft-mounted or ground gun-camera view of an
  actual attack run): the Corsair footage found (`corsair_01/02`) is taxi/takeoff/ground
  shots at Kimpo, not an attack run. Close-air-support footage exists on archive.org
  (e.g. `NPC-15352`, "Close Air Support Of Marines (1st Division) Korea") but is dated
  05/27/1951, outside the 1950 window, so it was not downloaded.
- Dedicated **Wolmi-do**-labeled footage (vs. general "Inchon Harbor (Invasion)" footage
  which very likely includes the Wolmi-do bombardment but isn't captioned as such by NARA):
  used `inchon_wolmido_01/02` from `111-adc-8289` as the closest match.
