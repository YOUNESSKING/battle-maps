#!/bin/bash
# usage: mk.sh NAME FIRST LAST  -> assembles scenes-src/NAME.js from dan_common.js + NAME.body.js, builds
S=/tmp/claude-0/-home-user-battle-maps/93ea7f31-a762-5d4b-b1ac-1683f6be4e94/scratchpad
cd /home/user/battle-maps/greene
python3 - "$1" <<PY
import os, json, sys
S="$S"; name=sys.argv[1]
has={k:os.path.exists(f"assets/media/{k}.png") for k in ["greene_head","cornwallis_head","williams_head","greene_full"]}
c=open(f"{S}/dan_common.js").read().replace("__RIV__",open(f"{S}/riv.js").read()).replace("__HAS__",json.dumps(has))
open(f"scenes-src/{name}.js","w").write(c+"\n"+open(f"{S}/{name}.body.js").read())
print(has)
PY
python3 tools/build_scene.py "$1" dan_region "$2" "$3"
