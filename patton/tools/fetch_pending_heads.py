#!/usr/bin/env python3
"""Fetch the badge sources that Wikimedia's 429 block stopped on 2026-10-31 (eddy, kluge, felber, eisenhower). Run later from anywhere:
  python3 patton/tools/fetch_pending_heads.py   (pauses 20 s between requests, standard 1280 px width through weserv, then direct)
Then add a crop box per name to make_heads_patton.py BOXES (look at the _src first), run it, and cutout_heads_patton.py only if the background is white.
Licences were checked on the Commons API on 2026-10-31 (see ../assets/media/CREDITS.md)."""
import hashlib, os, time, urllib.parse, urllib.request
UA = "battle-maps-research/1.0 (contact: younessfakiri123@gmail.com)"
M = "/home/user/battle-maps/patton/assets/media/"
FILES = {
    "eddy": "Manton S. Eddy.jpg",
    "kluge": "Bundesarchiv Bild 101I-299-1823-12, Günther v. Kluge.jpg",
    "felber": "General der Infanterie Hans-Gustav Felber.jpg",
    "eisenhower": "(Photograph of General Dwight D. Eisenhower, Supreme Commander, Allied Forces) - DPLA - 88a664419789e13fe43c658886a3ae95.jpg",
}
for k, name in FILES.items():
    dst = M + k + "_src.jpg"
    if os.path.exists(dst): continue
    s = name.replace(" ", "_"); h = hashlib.md5(s.encode()).hexdigest()
    raw = f"upload.wikimedia.org/wikipedia/commons/{h[0]}/{h[:2]}/{urllib.parse.quote(s)}"
    for url in ("https://images.weserv.nl/?w=1280&we&url=" + urllib.parse.quote(raw, safe=""), "https://" + raw):
        try:
            d = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=60).read()
            if len(d) > 3000: open(dst, "wb").write(d); print("ok", k, len(d)); break
        except Exception as e: print("fail", k, e)
        time.sleep(20)
