# Epidemic Sound library (downloaded once, reuse; owner subscription active 2026-11-01)
Licence: Epidemic Sound subscription. Safe on YouTube ONLY while the subscription is active and the channel is connected in Epidemic
Sound (otherwise Content ID claims are possible). Do not redistribute the files. Before downloading anything new, check this list.
Files are NOT in git (the repo is public): they live in library/epidemic/sfx|music on the machine (git-ignored). Files are stored as 48 kHz / 16-bit FLAC (SFX) and the original MP3 (music). The Epidemic id lets you find the asset again.

## SFX (`sfx/`)
| File | Epidemic title | Epidemic id | Use |
|---|---|---|---|
| cannon_fire_distant.flac | Guns, Artillery, Cannon, Fire, Distant | 3d428ea9-17af-4da1-aa9d-9f90782ad969 | cannon firing (fire) |
| cannon_fire_low01.flac | Guns, Artillery, Cannon, Fire, Low 01 | c5772663-2d12-4856-b250-128c80f84c3e | cannon firing |
| cannon_fire_low03.flac | Guns, Artillery, Cannon, Fire, Low 03 | 19048f06-a77e-4c1c-a0fd-fd28389e4bd2 | cannon firing |
| explosion_artillery_distant_deep.flac | Explosions, Designed, Artillery, Distant, Deep | c1e1910a-2482-4c45-a408-b0d5d95c1c94 | big explosion |
| impact_mortar_distant02.flac | Guns, Artillery, Designed, Mortar, 120mm, Distant 02 | 2bf3d2ff-05d7-42c6-a019-808a3e0190e9 | shell impact |
| impact_mortar_distant04.flac | Guns, Artillery, Designed, Mortar, 120mm, Distant 04 | 291d5908-a9fb-4157-9310-2af9463ce4fa | shell impact |
| rifle_enfield1853_60m01.flac | Guns, Antique, Rifle, Pattern-Enfield, 1853, 60m 01 | e998002b-7175-4fc2-b081-e57ac7c59484 | Civil War rifle-musket (volleys) |
| rifle_enfield1853_60m02.flac | Guns, Antique, Rifle, Pattern-Enfield, 1853, 60m 02 | 62ab20f6-7b90-44e4-8f9a-2bc8fc1d73b0 | volleys |
| rifle_enfield1853_30m01.flac | Guns, Antique, Rifle, Pattern-Enfield, 1853, 30m 01 | fa0d898b-e4ed-473f-9023-f876f8f4aadf | volleys |
| rifle_enfield1853_30m02.flac | Guns, Antique, Rifle, Pattern-Enfield, 1853, 30m 02 | a4732c7b-21c5-4092-a2f8-8e22068138c5 | volleys |
| cannon_fire_close.flac | Guns, Artillery, Cannon, Fire, Close | 3cfa4fb7-793b-4a29-9b4e-20288fefd178 | cannon firing, close |
| cannon_fire_low02.flac | Guns, Artillery, Cannon, Fire, Low 02 | 82395d55-7c64-44d0-8754-de9323a3412f | cannon firing |
| cannon_fire_low04.flac | Guns, Artillery, Cannon, Fire, Low 04 | 30ffdbd9-8f88-41e7-ac70-16c9f857a540 | cannon firing |
| impact_mortar_40m.flac | Guns, Artillery, Mortar, 120mm, Distance 40m | 05c8cb60-56a5-4662-a06c-f0e25a513612 | shell impact, close |
| impact_mortar_100m02.flac | Guns, Artillery, Mortar, 120mm, Distance 100m 02 | 6fa2414d-a238-4ca5-9615-6768c505ab75 | shell impact |
| impact_mortar_distant01.flac | Guns, Artillery, Designed, Mortar, 120mm, Distant 01 | 3ca7f2c9-c896-4f68-9ad7-d5c997b6a233 | shell impact, distant |
| impact_mortar_distant03.flac | Guns, Artillery, Designed, Mortar, 120mm, Distant 03 | 900da22f-8b81-411f-93ae-d9cc807f04e3 | shell impact, distant |
| explosion_small_bang02.flac | Explosions, Misc, Bomb, Explosion, Small, Bang, Detonation 02 | d855f778-e584-4b1d-8201-ab31dcea9700 | small explosion |
| explosion_small_bang04.flac | Explosions, Misc, Bomb, Explosion, Small, Bang, Detonation 04 | 94473817-86d4-47b8-8f63-e00cbdd904e3 | small explosion |
| rifle_enfield1853_10m.flac | Guns, Antique, Rifle, Pattern-Enfield, 1853, 10m | 1e35e44b-c629-46fc-9e53-8c305998a79f | rifle-musket, close |
| rifle_enfield1853_5m.flac | Guns, Antique, Rifle, Pattern-Enfield, 1853, 5m | 2f439aa1-5a67-47e0-833c-5dc00b84d769 | rifle-musket, very close |
| rifle_many_distant01.flac | Guns, Rifle, Military Base, Exterior Shots, Many, Distant 01 | 9785df0d-8916-4371-bc93-b35c31dc25bb | many rifles, distant (modern) |
| rifle_many_distant02.flac | Guns, Rifle, Military Base, Exterior Shots, Many, Distant 02 | a33a6f93-1d50-4925-a833-8f03df0616df | many rifles, distant (modern) |
| ambience_naval_bombardment_cannons.flac | Ambience, Warfare, Medieval, War, Naval Battle, Medium Bombardment, Cannons | 2a27471d-1426-4afe-a930-86e209beb8f3 | faint distant battle bed |

## Music (`music/`)
| File | Title / artist | Epidemic id | Mood |
|---|---|---|---|
| the_great_war__jon_bjork.mp3 | The Great War / Jon Björk (2:34) | c47590b2-ca0a-38f4-851d-407e65753702 | orchestral, epic, restless, no vocals |
| five_minutes_out__john_utah.mp3 | Five Minutes Out / John Utah (2:53) | 871c0526-0bcc-4298-99f4-f591671ad6cf | dark contemporary classical, no vocals |

## Tools
`tools/sfx_music_test.py`: 1-minute A/B test of a finished video's minute with these sounds (does not touch the lock).

## Sets used in the 1-minute tests (tools/sfx_music_test.py, SET=B|C|D|E; EPI=0 = locked)
B = distant cannon + distant mortar impacts + deep explosion + Enfield 60/30 m volley. C = close cannon + close impacts + small bangs + Enfield 10/5 m volley.
D = low/distant cannon + distant impacts + deep explosion + many distant rifles (modern recording). E = mix: low + close cannon, small bang + distant impact, deep explosion, Enfield 30/10 m volley.
