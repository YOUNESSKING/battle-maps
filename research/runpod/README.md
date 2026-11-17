# RunPod GPU render test (2026-11-17)

Goal: render the HyperFrames + three.js clip (`research/style_tests/gm3d/clip/`) on a rented NVIDIA GPU instead of
SwiftShader on our 4-core box. **Result: works, ~10x faster, pennies per minute of film.** No secrets in this folder:
the RunPod key stays in `$RUNPOD_API_KEY` here and is never sent to the pod; the control-server token is generated per run.

## Results (RTX A5000, community cloud, $0.27/h, 7.65 vCPU Xeon Gold 6342, driver 595)

| Chunk | Here (4 CPU, SwiftShader) | Pod, 3 workers | Pod, 6 workers |
| --- | --- | --- | --- |
| 0-11 s (opening, wide map) | ~10 min | **60 s** | 57 s |
| 11-22 s (cloud dive) | ~14 min | **84 s** | 80 s |
| 0-66 s whole clip (one render, 4 workers) | ~70 min (6 chunks) | **396 s (6.6 min)** | |

- GPU really used: WebGL renderer = `ANGLE (NVIDIA Corporation, NVIDIA RTX A5000/PCIe/SSE2, OpenGL ES 3.2)` (the
  render refuses with that string before the patch), ~950 MiB VRAM in use and 10-16 % GPU load during capture.
  The `[BrowserManager] ... gl=--use-angle=swiftshader` log line is what hyperframes *asks for*; the wrapper swaps it.
- Now CPU-bound (GPU 10-16 %): 6 workers barely beat 3. Pick pods by vCPU count, not GPU size.
- Output equals our local v8 render: PSNR vs `gm3d_clip_v8.mp4` 41-46 dB average over 0-22 s (dips to ~34 dB only on
  encoder keyframes every 62 frames); side-by-side frames at 3, 9, 15.5, 19 s look identical (`gpu_vs_local_frames.jpg`: left local v8, right pod). Same output with 3 or 6 workers (byte-identical).
- Whole clip: 66 s rendered in 396 s = **6 s of pod time per second of film**; PSNR vs v8 over all 1980 frames 42.5 dB avg, 30.6 dB worst.
- **Projection, 20-min 3D film:** 1200 s x 6 = ~2 h of A5000 pod = **~$0.55** (+ ~2 min setup). Split over 4 pods
  (e.g. 5-min parts) it is ~30 min wall time for the same money. Here it would take ~21 h.
- Cost of this whole test: ~$0.12 (A5000 ~23 min + ~$0.02 for six pods created by mistake, see the warning below).
- Setup: pod boots + apt + node 22 + hyperframes + Chrome in ~70 s (`nvidia/cuda:12.4.1-runtime-ubuntu22.04`).

## Recipe

1. `tar czf clip.tgz index.html *.js hyperframes.json assets cloudtex vendor` in the clip folder (19 MB; no mp4/jpg sheets/build).
2. `python3 deploy.py "NVIDIA RTX A5000" COMMUNITY token.txt 0.8.226 > m.gql; ./rp.sh "$(cat m.gql)"`
   (pod env `NVIDIA_DRIVER_CAPABILITIES=all` mounts libEGL_nvidia + the Vulkan ICD; port 8000/http; the boot script
   `pod_boot.sh` + `ctl_server.py` travel base64 in env, started by `dockerArgs`).
   **WARNING:** `podFindAndDeployOnDemand` can return an INTERNAL error yet still create the pod (it happened when the
   response asked for `gpus { id }`; that field is removed now). After every deploy attempt run
   `./rp.sh 'query { myself { pods { id costPerHr } } }'` and terminate strays: `./rp.sh 'mutation { podTerminate(input: {podId: "ID"}) }'`.
3. `CTL_TOKEN_FILE=token.txt ./ctl.sh POD ping` until `pong` (https://POD-8000.proxy.runpod.net), then
   `./ctl.sh POD put clip.tgz /work/clip.tgz`, wait for `SETUP DONE` in `./ctl.sh POD tail /work/logs/setup.log`.
4. On the pod (`./ctl.sh POD run NAME 'cmd'`): untar to `/work/clip`, `bash /work/patch_hf_chunks_gpu.sh`, then
   `HYPERFRAMES_BROWSER_PATH=/work/chrome_gpu_wrap.sh bash /work/pod_render.sh START END 3 TAG` -> `/work/out/TAG.mp4`
   (+ `.log`, `.gpu.csv` nvidia-smi samples). Download with `./ctl.sh POD get /work/out/TAG.mp4 TAG.mp4`.
5. Terminate the pod and check `myself { pods { id } }` is empty.

## Why the patch + wrapper (hyperframes 0.8.226)

- `--browser-gpu` alone is NOT enough: any `--start/--end` render goes through the distributed chunk path, which hard-codes
  `browserGpuMode: "software"` (SwiftShader flags) and asserts SwiftShader (`assertSwiftShader`) for pixel-identical retries.
- `chrome_gpu_wrap.sh` (set as `HYPERFRAMES_BROWSER_PATH`) replaces `--use-angle=swiftshader` with `--use-angle=gl-egl` and drops
  `--enable-unsafe-swiftshader/--disable-gpu-compositing/--disable-gpu`; `patch_hf_chunks_gpu.sh` turns the two SwiftShader
  assertions into no-ops. Re-check both after a hyperframes upgrade.
- `gpu_probe.sh` prints the WebGL renderer per ANGLE backend: on RunPod both `gl-egl` and `--use-angle=vulkan --enable-features=Vulkan` reach the NVIDIA GPU.

## Files

`deploy.py` (mutation), `rp.sh` (GraphQL helper, reads `$RUNPOD_API_KEY`), `ctl.sh` (client), `ctl_server.py` (token-protected
PUT/POST/GET server on the pod), `pod_boot.sh` (pod setup), `gpu_probe.sh`, `pod_render.sh`, `chrome_gpu_wrap.sh`,
`patch_hf_chunks_gpu.sh`, `killall.sh` (stop renders on the pod).
