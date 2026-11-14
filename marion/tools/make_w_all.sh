#!/bin/bash
# Marion: Style W green basemaps (kit/make_w.py) then the baked 2e layers (kit/make_m.py), one map at a time.
cd /home/user/battle-maps/marion
for m in "$@"; do
  python3 kit/make_w.py $m assets/${m}_w.jpg close=assets/${m}_w_close.jpg > logs/w_$m.log 2>&1 || { echo "FAIL make_w $m"; continue; }
  python3 kit/make_m.py $m > logs/m_$m.log 2>&1 || echo "FAIL make_m $m"
  echo "done $m $(date +%T)"
done
