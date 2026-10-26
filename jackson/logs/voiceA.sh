cd /home/user/battle-maps/jackson
REF=/home/user/battle-maps/tts/voices/owner_ref.wav
[ -f $REF ] || { [ -f /home/user/battle-maps/tts/voices/test_A_ref.wav ] || ffmpeg -v error -y -i /home/user/battle-maps/tts/voices/test_A_chatterbox.mp3 -ar 24000 -ac 1 /home/user/battle-maps/tts/voices/test_A_ref.wav; REF=/home/user/battle-maps/tts/voices/test_A_ref.wav; }
/home/user/cb-venv/bin/python /home/user/battle-maps/tts/convert_voice.py audio/voice.wav $REF audio/voice_owner.wav > logs/voiceA.log 2>&1 && touch logs/voiceA.done
