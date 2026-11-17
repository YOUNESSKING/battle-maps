#!/bin/bash
# Talk to the pod control server. usage: ctl.sh POD_ID ping|tail PATH [N]|get PATH OUT|put LOCAL REMOTE|run NAME 'cmd'
# Token read from $CTL_TOKEN_FILE.
P=$1; shift; U=https://$P-8000.proxy.runpod.net; T="X-Token: $(cat $CTL_TOKEN_FILE)"
case $1 in
  ping) curl -sS -m 20 -H "$T" $U/ping;;
  tail) curl -sS -m 30 -H "$T" "$U/tail?path=$2&n=${3:-40}";;
  get) curl -sS -f -H "$T" "$U/file?path=$2" -o "$3";;
  put) curl -sS -f -H "$T" -T "$2" "$U/upload?path=$3";;
  run) curl -sS -H "$T" --data-binary "$3" "$U/run?name=$2";;
esac
