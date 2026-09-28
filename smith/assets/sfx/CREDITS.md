# SFX & Music Credits — smith (Korean War 1950: Inchon / Chosin Reservoir / Marine breakout)

All field-recording source files come from the **USC Sound Effect Archive**
("Red Library" and "Gold Tape" libraries, digitized from the USC Cinema /
Sunset Editorial Collection) on the Internet Archive, collection
[`usc-sound-effect-archive`](https://archive.org/details/usc-sound-effect-archive),
every item licensed **CC0 1.0 (Public Domain Dedication)**. One file
(`bugle.wav`) is a separate Internet Archive item marked **Public Domain**.
Music is **Kevin MacLeod, CC BY 4.0**. All were downloaded, trimmed to the
needed segment, converted to 48 kHz stereo WAV and peak-normalized to about
-1 dBFS with `ffmpeg` (see commands below). A handful of files had no
findable CC0/PD/CC BY recording and were synthesized locally with
`smith/tools/synth_sfx.py` (numpy/scipy) instead.

All processing: `ffmpeg -af "atrim=...,afade=...,aformat=stereo,aresample=48000"`
then a peak-normalize pass (`astats` → `volume=NdB`) targeting -1 dBFS.

## Field recordings (Internet Archive, CC0 / Public Domain)

| File | Source item | Original file | Source URL | Licence |
|---|---|---|---|---|
| `artillery_1.wav` | Red Library: Guns Artillery | R12-35-105mm Howitzer in Battle.mp3 | https://archive.org/details/Red_Library_Guns_Artillery | CC0 1.0 |
| `artillery_2.wav` | Red Library: Guns Artillery | R12-36-155mm Howitzer Fires.mp3 | https://archive.org/details/Red_Library_Guns_Artillery | CC0 1.0 |
| `artillery_3.wav` | Red Library: Guns Artillery | R12-37-75mm Gun Firing.mp3 | https://archive.org/details/Red_Library_Guns_Artillery | CC0 1.0 |
| `naval_barrage.wav` | Red Library: Guns Artillery | R12-19-Intense Artillery Fire.mp3 | https://archive.org/details/Red_Library_Guns_Artillery | CC0 1.0 |
| `mortar_1.wav` | Gold Tape 33: Explosions and War | G33-01-Mortar Firing.mp3 | https://archive.org/details/GOLD_TAPE_33_Explosions_and_War | CC0 1.0 |
| `mortar_2.wav` | Gold Tape 33: Explosions and War | G33-29-Mortar Gun.mp3 | https://archive.org/details/GOLD_TAPE_33_Explosions_and_War | CC0 1.0 |
| `explosion_big.wav` | Red Library: Explosions | R09-52-Huge Explosion with Long Decay.mp3 | https://archive.org/details/Red_Library_Explosions | CC0 1.0 |
| `explosion_med_1.wav` | Red Library: Explosions | R30-06-Big Crisp Explosions.mp3 | https://archive.org/details/Red_Library_Explosions | CC0 1.0 |
| `explosion_med_2.wav` | Red Library: Explosions | R29-33-Large Explosion with Metal and Glass Debris.mp3 | https://archive.org/details/Red_Library_Explosions | CC0 1.0 |
| `prop_flyby_1.wav` | Red Library: Aircraft Props | R02-36-Prop Plane Fly By.mp3 | https://archive.org/details/Red_Library_Aircraft_Props | CC0 1.0 |
| `prop_flyby_2.wav` | Gold Tape 04: Aircraft WWII Fighters | G04-15-Fighter Flies Overhead.mp3 | https://archive.org/details/GOLD_TAPE_04_Aircraft-WWII_Fighters | CC0 1.0 |
| `jet_flyby.wav` | Red Library: Aircraft Jets | R03-01-Military Jet Fly By.mp3 | https://archive.org/details/Red_Library_Aircraft_Jets | CC0 1.0 |
| `dive_bomb.wav` (layered) | Gold Tape 04: Aircraft WWII Fighters | G04-16-WWII Fighter Dives.mp3 | https://archive.org/details/GOLD_TAPE_04_Aircraft-WWII_Fighters | CC0 1.0 |
| `dive_bomb.wav` (layered) | Red Library: Explosions | R30-07-Big Explosions Some Debris.mp3 | https://archive.org/details/Red_Library_Explosions | CC0 1.0 |
| `transport_drone.wav` | Gold Tape 05/06: Aircraft 2-Engine Props | G05-13_2 Engine Prop Steady Engine Noise.mp3 (C-47/DC-3 class engine) | https://archive.org/details/GOLD_TAPE_05_06_Aircraft-2_Engine_Props | CC0 1.0 |
| `bugle.wav` | Taps Bugle Call | taps.mp3 | https://archive.org/details/TapsBugleCall | Public Domain |
| `whistle.wav` | Red Library: Bells, Horns, Whistles | R21-45-High-Pitched Whistle.mp3 | https://archive.org/details/Red_Library_Bells_Horns_Whistles | CC0 1.0 |
| `wind_blizzard.wav` | Gold Tape 55/56: Weather-Wind | G55-07-Howling wind.mp3 | https://archive.org/details/GOLD_TAPE_55_56_Weather-Wind | CC0 1.0 |
| `gunfire_distant.wav` | Gold Tape 33: Explosions and War | G33-06-A Soldier Under Fire.mp3 | https://archive.org/details/GOLD_TAPE_33_Explosions_and_War | CC0 1.0 |
| `surf_boats.wav` (layered) | Gold Tape 22: Boats | G22-17-Motor Boat Cruising By.mp3 | https://archive.org/details/GOLD_TAPE_22_Boats | CC0 1.0 |
| `surf_boats.wav` (layered) | Gold Tape 53/54: Water | G53-06-Medium to Heavy Surf.mp3 | https://archive.org/details/GOLD_TAPE_53_54_Water | CC0 1.0 |

No usable CC0/PD/CC BY recording of a parachute canopy opening/fluttering
was found, so `parachute.wav` was synthesized instead (see below).

## Music

| File | Track | Author | Source URL | Licence |
|---|---|---|---|---|
| `music.mp3` | "Darkest Child" | Kevin MacLeod (incompetech.com) | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Darkest%20Child.mp3 | CC BY 4.0 |

Required credit line:
> "Darkest Child" by Kevin MacLeod (incompetech.com)
> Licensed under Creative Commons: By Attribution 4.0 License
> http://creativecommons.org/licenses/by/4.0/

## Synthesized (numpy/scipy, `smith/tools/synth_sfx.py`)

No CC0/PD/CC BY source could be found (or, for `parachute`, none was found
at all), so these were generated locally — layered filtered noise + tonal
bursts with a simple room reverb, 48 kHz stereo, peak-normalized to -1 dBFS:

| File | Description |
|---|---|
| `whoosh_1.wav` | filtered noise swell, 1.2 s |
| `whoosh_2.wav` | filtered noise swell, 1.1 s |
| `thud_1.wav` / `thud_2.wav` / `thud_3.wav` | low wooden thump (units dropping on the map) |
| `drum_hit.wav` | single deep orchestral/taiko hit with long tail |
| `soft_hit.wav` | soft low hit for method-card lines |
| `war_drums.wav` | ~26 s slow ominous drum loop, ~70 bpm |
| `parachute.wav` | canopy snap + rush of air + flutter (no CC0/PD/CC BY source found) |

No attribution required (own synthesized work).
