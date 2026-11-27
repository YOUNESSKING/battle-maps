#!/bin/bash
# r13 full render + mux (launch only after the clouds pass): rebuild the 4 borrow scenes, render the 5 windows on ONE RunPod pod
# (render_pod_bw.sh: no RTX A4500 / 3090 / 4000 Ada; the pod is terminated at the end), join with 8-frame crossfades, mux the r13 audio
# (make_test_audio.py, the 3D-film mix). usage: render_r13_full.sh WORKDIR AUDIO.wav OUT.mp4
set -e; W=$1; A=$2; O=$3; R=/home/user/battle-maps; M=$R/marion; T=$R/research/style_tests/stylew_borrow/tools
cd $M && python3 kit/make_kit.py
for x in "test-bw-hook-a lowcountry hook-1 hook-2 --inset santee" "test-bw-hook-b lowcountry hook-3 hook-5 --inset santee --inset blackriver" \
         "test-bw-m3d congaree m3-7 m3-9" "test-bw-m3f edisto m3-11 m3-12"; do python3 kit/build_scene.py $x --borrow | tail -1; done
cd scenes && rm -rf test-bw-hook-b2 && cp -al test-bw-hook-b test-bw-hook-b2 && rm test-bw-hook-b2/index.html && cp test-bw-hook-b/index.html test-bw-hook-b2/
rm -rf /root/.cache/hyperframes/history/*; mkdir -p $W; cd $R
for i in $(seq 1 15); do SCENES_DIR=$M/scenes WORKERS=4 GPU="NVIDIA RTX A4000" bash $T/render_pod_bw.sh $W test-bw-hook-a:0-17.8 test-bw-hook-b:29.34-32.34 \
  test-bw-hook-b2:44.24-48.64 test-bw-m3d:40.0-54.6 test-bw-m3f:3.26-41.26 > $W/try$i.log 2>&1; grep -q "deploy failed" $W/try$i.log || break; sleep 60; done
grep -hE "got|FAILED" $W/try$i.log
S=/dev/shm/r13seg; mkdir -p $S; for p in "segA test-bw-hook-a" "segB test-bw-hook-b" "segB2 test-bw-hook-b2" "segD test-bw-m3d" "segC test-bw-m3f"; do set -- $p; ln -sf $W/$2.mp4 $S/$1.mp4; done
bash $T/finalize_xf5.sh $S $A $O 0.266667; rm -rf $S
ffmpeg -nostats -i $O -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|Peak:" | tail -2
