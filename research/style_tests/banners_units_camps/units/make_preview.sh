#!/bin/bash
# renders preview.html at t = 0 / 3 / 6 s with Playwright Chromium and builds preview.jpg
set -e; U=$(cd "$(dirname "$0")" && pwd); T=$(mktemp -d)
node "$U/shot.js" "$U/preview.html" "$T" 0 3 6
python3 "$U/sheet.py" "$T" "$U/preview.jpg"
rm -rf "$T"
