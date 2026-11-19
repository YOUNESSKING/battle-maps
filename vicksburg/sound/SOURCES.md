# Troop sound test: sources and licences

Freesound and Pixabay were not reachable from the build machine (HTTP 403 through the proxy), so every new file comes from the owner's
Epidemic Sound account (Epidemic Sound MCP, WAV 96 kHz originals, converted to 48 kHz FLAC). Licence: Epidemic Sound subscription licence
(covers YouTube incl. monetisation for the channel(s) linked to the account while the subscription is active; no attribution needed; do not
redistribute the raw files). Nothing NC/ND, nothing of unknown licence. No BBC material.

| file(s) in `shots/` | Epidemic Sound title (ID) | what it is |
|---|---|---|
| `enf05_0..4` | Guns, Antique, Rifle, Pattern-Enfield, 1853, 5m (2f439aa1-5a67-47e0-833c-5dc00b84d769) | 5 real shots of the Civil War rifle-musket, mic at 5 m |
| `enf10_0..4` | ... Pattern-Enfield, 1853, 10m (1e35e44b-c629-46fc-9e53-8c305998a79f) | 5 shots, 10 m |
| `enf20_0..4` | ... Pattern-Enfield, 1853, 20m (e5bf717c-1029-4d26-9ec6-521500338bea) | 5 shots, 20 m |
| `enf30a_0..4`, `enf30b_0..4` | ... Pattern-Enfield, 1853, 30m 01 / 02 (fa0d898b-e4ed-473f-9023-f876f8f4aadf, a4732c7b-21c5-4092-a2f8-8e22068138c5) | 10 shots, 30 m |
| `enf60a_0..4`, `enf60b_0..4` | ... Pattern-Enfield, 1853, 60m 01 / 02 (e998002b-7175-4fc2-b081-e57ac7c59484, 62ab20f6-7b90-44e4-8f9a-2bc8fc1d73b0) | 10 shots, 60 m (long natural tails) |
| `march_loop.flac` | Objects, Bag, Backpack, Soldier, Movement, Marching (22e2ba50-cb54-4e66-92d6-aa3ae8930a7a) | 8.8 s accoutrement + footsteps; used low-passed and very quiet for marching columns and bridge planks |
| `cheer_charge.flac` | Crowds, Loop Group, Army Charging Into Battle, Positive, Cheering (67177d65-4196-482f-b0d0-21d929f8f224) | 6.6 s cheer; only 2.6 s slices, low-passed, at captures |

Each Enfield recording holds 5 separate shots; `tools/troop_sfx_lib.py` cuts them into 35 single shots (attack-aligned, 0.12 s fade-out).
Not found on Epidemic: musket volleys / ripple fire / skirmisher crackle as ready recordings (searched "musket volley", "rifle volley battle",
"flintlock", "black powder", "Springfield", "soldiers marching"; only handling/stock sounds and modern rifles). Volleys, ripples and crackle
are therefore built from the 35 real single shots by the tool.

Already in the repo (unchanged, used as before): goosegreen locked kit `cand1_hit.wav` (gun, -15 dB), `cand2_hit.wav` (boom, -19 dB),
USC heavy explosion (fire), Distant Warfare (CC0) ambience, Kevin MacLeod music (CC BY 4.0), and the old single volley
`greene/assets/media/sfx_musket_volley.mp3` (synthesized by us; removed from the test windows).
