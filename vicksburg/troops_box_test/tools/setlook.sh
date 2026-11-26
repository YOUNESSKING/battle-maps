#!/bin/bash
# usage: setlook.sh <scene S09_gm|S10_gm> <lineblocks|A|B|C|A2|A2L> : copies the engine into the built scene and sets the look
set -e
V=/home/user/battle-maps/vicksburg; SCN=$V/scenes/$1
for f in troops3d.js overlay.js scene.js; do cp $V/engine/$f $SCN/engine/$f; done
sed -i '/__TBX__/d' $SCN/seq/seq.js
S09SC=${S09SC:-1}; S09SCL=${S09SCL:-1.15}
case "$2" in
  lineblocks) ;;
  A2) SCL=1; [ "$1" = S09_gm ] && SCL=$S09SC; echo "window.SEQ.troopsOpts = { ...window.SEQ.troopsOpts, look: \"counter\", counter: \"A2\", counterOpts: { scale: $SCL } };   // __TBX__" >> $SCN/seq/seq.js ;;
  A2L) SCL=1; [ "$1" = S09_gm ] && SCL=$S09SCL; echo "window.SEQ.troopsOpts = { ...window.SEQ.troopsOpts, look: \"counter\", counter: \"A2\", counterOpts: { scale: $SCL } };   // __TBX__" >> $SCN/seq/seq.js ;;
  A3|A4|A5|A6|A7) SCL=1; [ "$1" = S09_gm ] && SCL=${S09SC3:-1}; echo "window.SEQ.troopsOpts = { ...window.SEQ.troopsOpts, look: \"counter\", counter: \"$2\", counterOpts: { scale: $SCL } };   // __TBX__" >> $SCN/seq/seq.js ;;
  *) echo "window.SEQ.troopsOpts = { ...window.SEQ.troopsOpts, look: \"counter\", counter: \"$2\" };   // __TBX__" >> $SCN/seq/seq.js ;;
esac
