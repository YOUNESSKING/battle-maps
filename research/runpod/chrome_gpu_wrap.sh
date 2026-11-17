#!/bin/bash
# HYPERFRAMES_BROWSER_PATH wrapper: logs Chrome's args and swaps any SwiftShader flags for the NVIDIA EGL path.
REAL=$(find /root/.cache/hyperframes/chrome -name chrome-headless-shell -type f | head -1)
echo "$(date +%T) IN: $*" >> /work/out/chrome_args.log
args=()
for a in "$@"; do case "$a" in
  --use-angle=swiftshader) args+=(--use-angle=gl-egl);;
  --enable-unsafe-swiftshader|--disable-gpu-compositing|--disable-gpu|--use-vulkan=swiftshader) ;;
  *) args+=("$a");;
esac; done
exec "$REAL" "${args[@]}"
