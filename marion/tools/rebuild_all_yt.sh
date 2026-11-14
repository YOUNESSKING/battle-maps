#!/bin/bash
# Rebuild every Yorktown scene on the current kit (build commands from the top of each source).
cd /home/user/battle-maps/yorktown
for s in hook-a hook-b p1a p1b p2a p2b p3a p3b p3c p3d; do
  cmd=$(head -5 scenes-src/$s.js | grep -o "kit/build_scene.py [^\`']*" | head -1)
  python3 $cmd 2>&1 | tail -1
done
