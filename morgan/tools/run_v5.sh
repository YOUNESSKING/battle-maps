cd /home/user/battle-maps/morgan
python3 tools/assemble.py --v6 > build/v5.log 2>&1 && python3 tools/cut.py >> build/v5.log 2>&1 && CUT=1 python3 tools/make_music_bed.py >> build/v5.log 2>&1 && CUT=1 python3 tools/mix.py >> build/v5.log 2>&1 && echo ALLDONE >> build/v5.log
