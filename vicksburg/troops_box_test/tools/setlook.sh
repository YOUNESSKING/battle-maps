#!/bin/bash
# usage: setlook.sh <scene S09_gm|S10_gm> <lineblocks|A|B|C>
set -e
V=/home/user/battle-maps/vicksburg; SCN=$V/scenes/$1
cp $V/engine/troops3d.js $SCN/engine/troops3d.js
sed -i '/__TBX__/d' $SCN/seq/seq.js
if [ "$2" != lineblocks ]; then echo "window.SEQ.troopsOpts = { ...window.SEQ.troopsOpts, look: \"counter\", counter: \"$2\" };   // __TBX__" >> $SCN/seq/seq.js; fi
