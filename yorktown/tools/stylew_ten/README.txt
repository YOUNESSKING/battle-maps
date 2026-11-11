Grant #16 Style W basemaps for move 1 (tennessee, henry, donelson), 2026-11-06.
The stock research/style_tests/make_style_w.py keeps the 2 longest skeleton pieces of <map>_det_rivS.png as "main rivers"; on these
maps that lost the Tennessee / Cumberland / Mississippi (flat reservoir surfaces in the DEM; Kentucky Lake and Lake Barkley did not
exist in 1862) and drew branchy creek networks instead. Fix (same idea as cleburne/tools/stylew_chatt):
  1. clean one-line river layers into tools/stylew_ten/assets/media/<map>_det_riv(S).png
       tennessee: python3 tools/stylew_ten/make_ten_rivers.py   (gh_tennessee_rivers.json + the Mississippi routed on the DEM streams)
       henry / donelson: python3 tools/stylew_ten/make_main_rivers.py henry|donelson   (rivers routed along the old river layer
       between hand-picked points; polylines in tools/stylew_ten/<map>_rivers.json, map px)
  2. msw_ten.py = make_style_w.py copy with the river pruning/count as keys, run FROM tools/stylew_ten (all from grant/):
       cd tools/stylew_ten && python3 msw_ten.py tennessee ../../assets/tennessee_w.jpg close=../../assets/tennessee_w_close.jpg green=1 tint=0 mult=1 mprune=20 mkeep=6
       cd tools/stylew_ten && python3 msw_ten.py henry ../../assets/henry_w.jpg close=../../assets/henry_w_close.jpg green=1 tint=0 mult=1 mprune=20 mkeep=6 cprune=6 cmin=40 cgap=10
       cd tools/stylew_ten && python3 msw_ten.py donelson ../../assets/donelson_w.jpg close=../../assets/donelson_w_close.jpg story=../../assets/src/donelson_story.json green=1 tint=0 mult=1 mprune=20 mkeep=6 cprune=6 cmin=40 cgap=10
     (henry has no named story ground: run without story=, the stock generator fails on an empty story)
  3. cp assets/<map>_hd_lift.json assets/<map>_w.json
Re-running the stock make_style_w.py on these maps brings the broken rivers back.
