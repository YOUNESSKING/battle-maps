#!/bin/bash
ps -eo pid,args | grep -E "chrome-headless|node .*hyperframes|nvidia-smi" | grep -v grep | awk '{print $1}' | xargs -r kill -9
sleep 1; ps aux | grep -E "chrome|hyperframes" | grep -v grep | wc -l
