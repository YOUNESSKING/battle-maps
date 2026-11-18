#!/bin/bash
# Render all scenes on N pods in parallel (each pod gets a balanced share by scene length; each pod is terminated by its driver).
# usage: bash vicksburg/tools/render_all.sh OUTDIR NPODS [scenes...]   (default: all scenes with a built folder)
V=/home/user/battle-maps/vicksburg; OUT=$1; N=${2:-3}; shift 2
SCN=("$@"); [ ${#SCN[@]} -gt 0 ] || SCN=($(ls $V/scenes | grep -E '^S[0-9]+$'))
mapfile -t GROUPS_ < <(python3 - "$N" "${SCN[@]}" <<'PY'
import json, sys
n = int(sys.argv[1]); sc = sys.argv[2:]
D = {s: json.load(open(f"/home/user/battle-maps/vicksburg/scenes/{s}/cues.json"))["D"] for s in sc}
g = [[0, []] for _ in range(n)]
for s in sorted(sc, key=lambda s: -D[s]): b = min(g, key=lambda x: x[0]); b[0] += D[s]; b[1].append(s)
for tot, ss in g:
    if ss: print(" ".join(ss))
PY
)
i=0; for G in "${GROUPS_[@]}"; do i=$((i+1)); echo "pod $i: $G"; bash $V/tools/render_pod.sh "$OUT" $G > /tmp/vx_pod_all_$i.log 2>&1 & sleep 20; done
wait; echo ALL DONE; grep -h -E "^got|FAILED|timeout" /tmp/vx_pod_all_*.log
(cd /home/user/battle-maps/research/runpod && ./rp.sh 'query { myself { clientBalance pods { id } } }'); echo
