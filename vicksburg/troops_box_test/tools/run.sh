#!/bin/bash
# run.sh <tag> <variants...>: stills of S09 (4 moments) + S10 (3) per variant into /tmp/tbx/<variant>_<tag>_S09 ...
cd /home/user/battle-maps; T=$1; shift
for v in "$@"; do
  /tmp/tbx/setlook.sh S09_gm $v; bash vicksburg/tools/snap.sh vicksburg/scenes/S09_gm 59.5,65,86.2,103.5 /tmp/tbx/$( [ $v = lineblocks ] && echo LB || echo $v )_${T}_S09 >/dev/null 2>&1 || echo FAIL S09 $v
  /tmp/tbx/setlook.sh S10_gm $v; bash vicksburg/tools/snap.sh vicksburg/scenes/S10_gm 22,25,28.5 /tmp/tbx/$( [ $v = lineblocks ] && echo LB || echo $v )_${T}_S10 >/dev/null 2>&1 || echo FAIL S10 $v
  rm -f /tmp/tbx/$( [ $v = lineblocks ] && echo LB || echo $v )_${T}_S*/contact-sheet.jpg
done; echo done
