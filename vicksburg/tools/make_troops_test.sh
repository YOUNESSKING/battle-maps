#!/bin/bash
# GM troops test (owner 2026-11-18): build S09 twice from the same seq.js: scenes/S09_gm (troops "blocks" = GM-style 3D troops + GM arrows)
# and scenes/S09_box (the film's Style W boxes). Render the excerpt with pod_scene.sh NAME 3 START END (or snap.sh for stills).
set -e
V=/home/user/battle-maps/vicksburg
G=$V/sequences/${SEQ:-S09}_gm; [ -d $G ] || G=$V/sequences/${SEQ:-S09}   # the GM test copy of the data (re-spaced for the bigger blocks) when there is one
python3 $V/tools/make_scene.py $G --out $V/scenes/${SEQ:-S09}_gm
echo 'window.SEQ.troops = "blocks";' >> $V/scenes/${SEQ:-S09}_gm/seq/seq.js
python3 $V/tools/make_scene.py $V/sequences/${SEQ:-S09} --out $V/scenes/${SEQ:-S09}_box
rm -f $V/scenes/*/seq/sheet.jpg
