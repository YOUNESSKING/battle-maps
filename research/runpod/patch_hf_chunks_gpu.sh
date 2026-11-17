#!/bin/bash
# hyperframes 0.8.226: --start/--end renders go through the distributed chunk path, which locks SwiftShader and asserts it on worker 0.
# Disable only that assertion; chrome_gpu_wrap.sh (HYPERFRAMES_BROWSER_PATH) then swaps the SwiftShader flags for NVIDIA EGL.
D=$(npm root -g)/hyperframes/dist
grep -l 'return config?.browserGpuMode === "software" && workerId === 0;' $D/*.js | while read f; do
  sed -i 's/return config?.browserGpuMode === "software" \&\& workerId === 0;/return false;/' "$f"; echo "patched $f"; done
# Renders that start after 0 s also call assertSwiftShader from the chunk planner: make the assertion itself a no-op.
grep -l 'async function assertSwiftShader(page, readInfo = readWebGlVendorInfo) {$' $D/*.js | while read f; do
  sed -i 's/async function assertSwiftShader(page, readInfo = readWebGlVendorInfo) {$/async function assertSwiftShader(page, readInfo = readWebGlVendorInfo) { return;/' "$f"; echo "patched assert $f"; done
