#!/bin/bash
# Render still frames of a built scene locally (SwiftShader) with the HyperFrames snapshot command (exact seek to each time).
# usage: bash vicksburg/tools/snap.sh <scene dir> <t1,t2,...> [out dir (default /tmp/vx_engine/snap_<scene>)]
# -> <out>/frame-NN-at-<t>s.png (+ contact sheets). ~6 s per still on 4 cores (plus ~20 s page build); the scene's .hyperframes/ cache is local only.
set -e
SC=$(cd "$1" && pwd); AT=$2; OUT=${3:-/tmp/vx_engine/snap_$(basename "$SC")}
mkdir -p "$OUT"
rm -rf /root/.cache/hyperframes/history/* 2>/dev/null || true
npx hyperframes snapshot "$SC" --at "$AT" --no-end --timeout 170000 -o "$OUT"
rm -rf /root/.cache/hyperframes/history/* 2>/dev/null || true
ls "$OUT"/frame-*.png
