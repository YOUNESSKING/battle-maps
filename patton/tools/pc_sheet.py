"""Map agent C: snapshot a scene at the listed times and build its labelled sheet (tools/make_sheet.py).
usage (from patton/): python3 tools/pc_sheet.py SCENE   (frames listed in FR below)"""
import glob, json, os, shutil, subprocess, sys
FR = {
 "hook-a": [(0.4, "frame 0: Ardennes theatre 22 Dec, units moving, CUT OFF (stakes) slams", "hit + shake, fire/impact"), (2.5, "McAuliffe badge; HITLER'S LAST GREAT OFFENSIVE", "hit + shake, impacts"),
   (4.6, "'trapped': red arrows close round Bastogne, TRAPPED", "hit"), (6.5, "ONE continuous zoom (dive) starts on 'paratroopers'", "whoosh"), (7.4, "mid-zoom: ardennes fades, bastogne layers feathered (no cut)", "-"),
   (8.9, "lands on 'Bastogne': Bastogne map wide (option 1), ring, panzers", "fire, impact"), (11.0, "200,000+ card slams on its words, ticks", "hit + shake, ticks"), (13.5, "ABOUT 500 TANKS ticks", "ticks, impacts"),
   (15.5, "'burst out of the Ardennes forest': red arrows from the east", "whoosh, impact"), (17.2, "zoom-out to the theatre (19 Dec): the '?' badge", "whoosh"),
   (19.4, "FACING THE WRONG WAY: Third Army on the Saar, firing east", "hit + shake, impacts"), (21.8, "'turned his whole army': arrows north, counters follow", "hit"),
   (23.6, "TURNED 90 DEGREES (90° mark); impacts on the Saar", "hit + shake"), (25.6, "dive #2 onto Bastogne", "whoosh"), (26.7, "4th Armored up the Arlon road, the ring breaks at Assenois (26 Dec)", "-"),
   (27.9, "BROKE THROUGH · 26 DEC (payoff ~0:27)", "boom, hit + shake")],
 "hook-b": [(0.3, "hard cut to dark: the calendar rolls back 26 -> 19 DEC", "hit, ticks"), (1.4, "the '?' badge", "pop"), (3.0, "the Verdun room; A FREEZING BARRACKS", "hit + shake + red pulse"),
   (4.8, "VERDUN locator card", "pop, hit"), (6.4, "A COAL STOVE TOO SMALL", "hit + shake + red pulse"), (9.0, "Eisenhower (initials, no licensed photo); EISENHOWER: HOW SOON?", "hit + shake + red pulse"),
   (11.6, "'the morning of December twenty-second': the calendar runs to 22 DEC", "ticks"), (13.6, "22 DECEMBER", "hit + shake + red pulse"), (15.4, "THREE DIVISIONS: 4th Armd, 26th, 80th", "hits"),
   (17.6, "verbatim: 'Some people thought I was boasting.' (War As I Knew It)", "hit + shake"), (21.0, "hook-4: the badge comes forward", "whoosh"), (22.3, "GEORGE S. PATTON slams (real photo)", "hit + shake + red pulse"),
   (24.2, "CUT 1: AVRANCHES 1944 (option 2), columns through the one highway", "whoosh + hit, impacts"), (26.0, "the fan into Brittany and east", "impact"),
   (27.5, "CUT 2: BASTOGNE 1944 (option 2), tanks race up the road into the town", "whoosh + hit, impacts"), (29.8, "CUT 3: THE RHINE 1945, night, boats from Nierstein", "whoosh + hit"),
   (32.0, "MG fire; Montgomery badge on 'a day before Montgomery'", "mg"), (34.0, "pull-out: europe March 1945 (option 1), three rings", "whoosh + hit, riser"),
   (35.6, "title card (riser + boom)", "boom + shake"), (38.2, "hold into the background", "-")],
 "move1f": [(0.6, "ardennes 19 Dec (option 1); Third Army's road from Avranches", "fire"), (2.6, "FACING EAST (Third Army on the Saar); salient pushes west", "hit, impacts"),
   (5.2, "'turn a whole army around': the gold '?' path swings north", "whoosh, hit"), (7.6, "IN WINTER (snow)", "hit"), (9.0, "IN TIME? on Bastogne, ring pulses", "hit"),
   (11.6, "E.subscribe: button slides in, cursor", "pop"), (12.8, "SUBSCRIBED + bell (on 'subscribing')", "tick"), (15.3, "'Here's how Patton did it': Patton badge, NEXT: MOVE 2 · BASTOGNE", "hit"),
   (16.9, "push toward Bastogne (hand-off to move2a)", "-")],
 "ending": [(0.8, "europe March 1945 (option 1); rings 1-2-3 + Third Army's road", "pops, hits"), (3.0, "METHOD line 1 KEEP MOVING: the breakout fans out, Mortain stalls", "hit, impact"),
   (6.5, "line 2 PLAN THE TURN: the swing north to Bastogne", "hit, impact"), (9.5, "line 3 STRIKE: across the Rhine; method complete", "boom"), (12.8, "badge greys; SICILY · AUGUST 1943", "hit + shake"),
   (19.0, "the road lights and runs; NO ONE FASTER", "hit + shake, impacts"), (23.5, "dimmed (post-war): 21 DECEMBER 1945, MANNHEIM ring, badge greys", "ticks, hit"),
   (27.0, "E.final: three numbered cards", "boom"), (28.6, "C3: the card moves into the top band (last 20 s start ~28.5 s)", "whoosh"), (30.0, "1 AVRANCHES on its words, fight at Avranches", "hit, impacts"),
   (35.0, "1, 2 OR 3? + family-story line in the band", "hit, pop"), (44.5, "corner subscribe (SUBSCRIBED + bell); map alive", "ticks"), (48.2, "end", "-")],
}
scene = sys.argv[1]
abs0 = float(open(f"scenes/{scene}/timing.js").read().split('"abs_start": ')[1].split(",")[0])
times = [f for f, _, _ in FR[scene]]
d = f"scenes/{scene}"; shutil.rmtree(f"{d}/.hyperframes/artifacts/snapshots", ignore_errors=True); shutil.rmtree(f"{d}/snapshots", ignore_errors=True)
subprocess.run(["hyperframes", "snapshot", ".", "--at", ",".join(str(t) for t in times)], cwd=d, capture_output=True)
os.makedirs(f"{d}/snapshots", exist_ok=True)
for p in glob.glob(f"{d}/.hyperframes/artifacts/snapshots/*/frame-*.png"): shutil.copy(p, f"{d}/snapshots/")
mm = lambda s: f"{int(s // 60)}:{int(s % 60):02d}"
spec = {"title": f"Patton #15 · {scene} (map agent C)", "note": "both flags on every map frame (cards / dark twist excepted); option 1 wide, option 2 close-ups; times = scene s / video mm:ss",
        "frames": [[scene, t, mm(abs0 + t), w, snd] for t, w, snd in FR[scene]]}
json.dump(spec, open(f"build/pc_sheet_{scene}.json", "w"), indent=0)
print(subprocess.run(["python3", "tools/make_sheet.py", f"build/pc_sheet_{scene}.json", f"build/sheet-{scene}.jpg"], capture_output=True, text=True).stdout)
