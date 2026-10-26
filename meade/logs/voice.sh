cd /home/user/battle-maps/tts
python3 /home/user/battle-maps/meade/tools/narrate.py > /home/user/battle-maps/meade/logs/narrate.log 2>&1 && touch /home/user/battle-maps/meade/logs/narrate.done || exit 1
while [ ! -f /home/user/battle-maps/meade/logs/clone.done ]; do sleep 20; done
bash /home/user/battle-maps/meade/logs/voiceA.sh
