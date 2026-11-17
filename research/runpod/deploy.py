#!/usr/bin/env python3
"""Print the GraphQL mutation that deploys the render pod. usage: deploy.py GPU_TYPE_ID CLOUD(COMMUNITY|SECURE) TOKEN_FILE HF_VERSION"""
import base64, json, sys, os
d = os.path.dirname(os.path.abspath(__file__))
gpu, cloud, tokf, ver = sys.argv[1:5]
b64 = lambda f: base64.b64encode(open(os.path.join(d, f), "rb").read()).decode()
env = {"CTL_TOKEN": open(tokf).read().strip(), "HF_VERSION": ver, "BOOT_B64": b64("pod_boot.sh"),
       "CTL_SERVER_B64": b64("ctl_server.py"), "NVIDIA_DRIVER_CAPABILITIES": "all"}
envs = ", ".join(f'{{key: {json.dumps(k)}, value: {json.dumps(v)}}}' for k, v in env.items())
args = 'bash -c "echo $BOOT_B64 | base64 -d > /b.sh && bash /b.sh"'
print(f'''mutation {{ podFindAndDeployOnDemand(input: {{ cloudType: {cloud}, gpuCount: 1, volumeInGb: 0, containerDiskInGb: 30,
 minVcpuCount: 8, minMemoryInGb: 30, gpuTypeId: {json.dumps(gpu)}, name: "hf-render-test", imageName: "nvidia/cuda:12.4.1-runtime-ubuntu22.04",
 dockerArgs: {json.dumps(args)}, ports: "8000/http", env: [{envs}] }}) {{ id machineId costPerHr gpus {{ id }} }} }}''')
