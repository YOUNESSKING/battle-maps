#!/bin/bash
# Pod start script (passed base64-encoded in dockerArgs). Needs env CTL_TOKEN and HF_VERSION. Starts the control server first, then installs.
export DEBIAN_FRONTEND=noninteractive
mkdir -p /work/logs; exec > /work/logs/setup.log 2>&1
echo "boot $(date +%T)"
apt-get update -qq && apt-get install -y -qq python3 curl xz-utils ca-certificates >/dev/null
echo "$CTL_SERVER_B64" | base64 -d > /work/ctl_server.py
nohup python3 /work/ctl_server.py > /work/logs/server.log 2>&1 &
echo "server up $(date +%T)"
apt-get install -y -qq ffmpeg libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 \
  libxfixes3 libxrandr2 libgbm1 libasound2 libpango-1.0-0 libcairo2 libegl1 libgles2 libgl1 libvulkan1 vulkan-tools mesa-utils \
  fonts-liberation libxshmfence1 libx11-xcb1 >/dev/null; echo "apt done $(date +%T)"
curl -fsSL https://nodejs.org/dist/v22.12.0/node-v22.12.0-linux-x64.tar.xz | tar xJ -C /opt && ln -sf /opt/node-v22.12.0-linux-x64/bin/* /usr/local/bin/
npm i -g "hyperframes@$HF_VERSION" >/dev/null 2>&1; ln -sf /opt/node-v22.12.0-linux-x64/bin/* /usr/local/bin/
hyperframes browser ensure; echo "SETUP DONE $(date +%T)"
nvidia-smi; ls /usr/share/glvnd/egl_vendor.d/ /etc/vulkan/icd.d/ /usr/share/vulkan/icd.d/ 2>&1; ls /usr/lib/x86_64-linux-gnu/ | grep -i nvidia | head -40
sleep infinity
