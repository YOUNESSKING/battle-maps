#!/bin/bash
# Print the WebGL renderer chrome-headless-shell gets with several ANGLE backends (run on the pod).
H=$(find /root/.cache/hyperframes -name chrome-headless-shell -type f | head -1); echo "shell: $H"
cat > /tmp/probe.html <<'H'
<html><body><script>
const c=document.createElement('canvas');const g=c.getContext('webgl2')||c.getContext('webgl');
let r='NO WEBGL';if(g){const e=g.getExtension('WEBGL_debug_renderer_info');r=e?g.getParameter(e.UNMASKED_RENDERER_WEBGL):g.getParameter(g.RENDERER);}
document.body.innerHTML='<pre>RENDERER='+r+'</pre>';
</script></body></html>
H
COMMON="--no-sandbox --disable-dev-shm-usage --enable-webgl --ignore-gpu-blocklist --enable-gpu-rasterization --disable-software-rasterizer --virtual-time-budget=3000 --dump-dom"
for v in "--use-gl=angle --use-angle=gl-egl" "--use-angle=vulkan --enable-features=Vulkan" "--use-angle=vulkan --enable-features=Vulkan,DefaultANGLEVulkan,VulkanFromANGLE" "--use-gl=egl"; do
  echo "== $v"; timeout 40 $H $COMMON $v file:///tmp/probe.html 2>/tmp/probe_err.txt | grep -o 'RENDERER=[^<]*'; grep -iE "error|fail" /tmp/probe_err.txt | head -4 | cut -c1-200
done
which eglinfo && eglinfo -B 2>&1 | head -20; vulkaninfo --summary 2>&1 | grep -iE "deviceName|driverName|apiVersion" | head
