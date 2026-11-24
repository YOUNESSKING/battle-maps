# Jackson film: musket sound sources (v4, 2026-11-24)

Owner asked for real 1815 musket sound. Epidemic Sound has NO live-fire flintlock recording (its "Guns, Antique, Musket" set is handling +
dry fire only), so each musket shot is BUILT from real recordings, all Epidemic Sound (subscription licence, no attribution needed):
- the bang: "Guns, Antique, Rifle, Pattern-Enfield, 1853" at 5/10/20/30/60 m (35 real black-powder shots, `vicksburg/sound/shots/`)
- the flintlock lock: "Guns, Antique, Musket, Dry Fire 01 / 02" (ids d0d2903d-eb8d-4533-a110-bf18866db014, 15259d81-0242-438c-a291-ab9ddeb195ea):
  the flint striking + frizzen flying open, placed 65-85 ms before the bang (flintlock lock time)
- the priming-pan flash: "Fire, Ignite, Spray, Flash 01" (27215bdf-cdb0-4849-9633-3c33f501614d), cut to ~50 ms decays, 40-50 ms before the bang
Lock + pan scale with the recording distance (-16 dB under the bang at 5 m ... -40 dB at 60 m, low-passed with distance); the bang's attack
stays exactly on the visible muzzle-flash frame (checked on all 35). Files: `ajackson/sound/shots_flint/` (+ march/cheer copies).
Use: `TROOP_SHOTS=/home/user/battle-maps/ajackson/sound/shots_flint python3 ajackson/tools/troop_stem.py --no-export`.
Raw downloads are not kept in the repo (licence: do not redistribute raw files).
