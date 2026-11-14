"""Writes kit/PLACES.md: every named place (kit/data/places.py PLACES) -> map px on each basemap (bake.py projection), land/water check,
and the corrections made against the relief. usage: python3 kit/places_report.py"""
import os, sys
import numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE); sys.path.insert(0, f"{HERE}/data")
from proj import ll2px  # noqa
from places import PLACES, MAPS  # noqa
MS = ["east", "chesapeake", "peninsula", "yorktown"]
WM = {}
for m in MS:
    p = f"{HERE}/../assets/{m}_m_water.png"
    WM[m] = np.asarray(Image.open(p))[..., 3] > 127 if os.path.exists(p) else None
L = ["# Yorktown map kit: places (lat/lon -> map px)", "",
     "Projection = tools/bake.py (web mercator; `x = (lon+180)/360*256*2^z - origin_x`, `y = (1-asinh(tan(lat))/pi)/2*256*2^z - origin_y`, origin from `assets/<map>.json`).",
     "In a scene use `LYT(lat, lon)` or `PLACE(\"name\")` (kit) instead of hard-coded px. Basemap image px = 2 x map px.", "",
     "## Corrections against the relief / water (2026-11-11)",
     "- **Redoubt 10**: dossier 37.2319,-76.4953 lies ~200 m out in the York River on our relief. Moved to **37.2319,-76.5000** (on the river bluff; matches the NPS site ~-76.500).",
     "- **Redoubt 9**: moved by the same ~0.0047 deg west to **37.2292,-76.5025** (~400 yd SW of R10, as the sources say).",
     "- **Fusiliers' Redoubt**: dossier 37.2464,-76.5261 lies in the river; moved ~270 m south onto the bluff edge, **37.2440,-76.5261**.",
     "- **Yorktown** town centre 37.2382,-76.5098 (on the bluff above the waterfront); the York ferry landings are snapped to the two banks by make_m.py (narrows ~720 m = ~800 yd).",
     "- The Bauman 1782 plan (`assets/archive/bauman_map.*`) was NOT yet delivered by the image agent: the siege works (parallels, redoubts, British line) are placed from the",
     "  brief + relief only. Re-check them against Bauman when it arrives (the first parallel / British line are LIVE in the scenes: only scene coordinates change, no re-bake).",
     "- Modern features removed from the water: piers/jetties (land opening), dredged cuts (water opening), spoil islands, ponds; reservoirs dried by hand boxes",
     "  (Diascund + Little Creek on `peninsula`, Lee Hall on `yorktown` + `peninsula`). New York harbour + the East River drawn by hand on `east` (the z8 land mask has no harbour).", "",
     "## Places", "", "| place | lat, lon | " + " | ".join(MS) + " |", "|---|---|" + "---|" * len(MS)]
for k, (la, lo) in PLACES.items():
    row = []
    for m in MS:
        x, y = ll2px(m, la, lo)
        if 0 <= x < 2880 and 0 <= y < 1620:
            w = WM[m]; wet = w is not None and w[int(y), int(x)]
            row.append(f"{x:.0f}, {y:.0f}" + (" **WATER**" if wet else ""))
        else: row.append("-")
    L.append(f"| {k} | {la}, {lo} | " + " | ".join(row) + " |")
L += ["", "## Baked towns (permanent painted towns; label = carved permanent name)", ""]
for m in MS:
    L.append(f"- `{m}` (baked for camera scale {MAPS[m]['s']}): " + ", ".join(f"{t[0]}{' (name)' if t[4] else ''}" for t in MAPS[m]["towns"].values()))
L += ["", "Roads, bridges, ferries and the dead-end check per map: `kit/data/<map>_bake.json` (`roads`, `crossings`, `ends`)."]
open(f"{HERE}/PLACES.md", "w").write("\n".join(L) + "\n"); print("PLACES.md", len(PLACES), "places")
