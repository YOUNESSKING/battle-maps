# Judge 2 "touch the idea": redesigned basemap (TEST, nothing locked changed, not committed)

Sheet: `cleburne/build/reflook/sheet-judge2.jpg`, which shows the reference, our G3, my H1 Tunnel (2300,1450) and H2 Ringgold (2893,1854), each with an overlay test. Script: `cleburne/tools/judge_ref2.py`. I did 3 review rounds.

**What changed in how the map is drawn:**
- **Terrain:** shaded from 3 smoothed versions of the elevation (σ 2/5/14 px, weights .18/.50/.32). Brightness is measured relative to flat ground, so flats are one calm sand tone. Light comes from the NW at 42°. Highlights are softened (tanh ×2.4) and the result is gradient-mapped from brown shadow through sand to sunlit orange. It adds slope warming, a ridge lift with valley shading (difference of Gaussians, σ 3−16) and ±1.6 % paper grain.
- **River:** the shape comes from the data mask, blurred and re-cut so the banks are smooth. Colour runs from the bank to the centre (grey-green edge to pale grey-blue), with a soft sand bank and a green meadow fringe. Mapped creeks are soft hairlines. Small DEM gullies are traced from the flow data (D8, numba) and smoothed into curves.
- **Trees:** 3D canopy made of bumpy domes. They are lit from the NW, shaded at the edges, cast shadows to the SE and are drawn at 2× then reduced. Each tree sits where the forest data has trees. The ribbon along a river gets wider as the river gets wider, and crowns never cover the water. Groves and creek rows are sparse.

**Runtime:** about 26 s per 1920×1080 crop. A full 5760×3240 bake would take about 3–4 min once per map (about 3 GB of memory, or work in tiles). Video render time does not change.

**Pipeline:** run per map (`<map>_ref_plain.jpg`) on the HD grid with no crop, from the same elev/riv/tree/swamp inputs.

**Overlay finding:** counters and the 15 px fronts stay readable. The multiply territory overlay shifts on warm sand, though: red turns orange and blue turns grey-teal. Before approval it needs retuned overlay colours, or a second, more neutral bake for wide option-1 shots. A 45 % desaturation did not fix it.
