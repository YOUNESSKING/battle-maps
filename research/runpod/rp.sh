#!/bin/bash
# RunPod GraphQL helper. usage: rp.sh '<graphql query>'   (RUNPOD_API_KEY from env; never printed)
python3 -c 'import json,sys; print(json.dumps({"query": sys.argv[1]}))' "$1" | \
curl -sS https://api.runpod.io/graphql -H "Content-Type: application/json" -H "Authorization: Bearer $RUNPOD_API_KEY" -d @-
