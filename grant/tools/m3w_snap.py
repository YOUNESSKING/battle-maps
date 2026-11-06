"""Move-3 Style W check: one snapshot run per scene into the scratchpad + a labelled sheet grant/build/sheetW-<scene>.jpg.
usage (from grant/): python3 tools/m3w_snap.py SCENE "t|what" "t|what" ...   (t in scene seconds; a second run wipes the folder)"""
import json, os, shutil, subprocess, sys, tempfile
SNAP = "/tmp/claude-0/-home-user-battle-maps/425685c4-6657-5109-8b39-25dbef768324/scratchpad/grant_snap4"
sc, items = sys.argv[1], [a.split("|", 1) for a in sys.argv[2:]]
t0 = json.loads(open(f"scenes/{sc}/timing.js").read().split("=", 1)[1].rstrip().rstrip(";"))["abs_start"]
out = f"{SNAP}/{sc}"; shutil.rmtree(out, ignore_errors=True); os.makedirs(out)
subprocess.run(["hyperframes", "snapshot", f"scenes/{sc}", "-o", out, "--no-end", "--at", ",".join(t for t, _ in items)], check=True, stdout=subprocess.DEVNULL, timeout=1500)
# make_sheet reads scenes/<scene>/snapshots: point it at the scratchpad folder through a temporary link
lk = f"scenes/{sc}/snapshots"; shutil.rmtree(lk, ignore_errors=True)
if os.path.islink(lk): os.unlink(lk)
os.symlink(out, lk)
fr = [[sc, float(t), "%d:%04.1f" % divmod(t0 + float(t), 60), w, ""] for t, w in items]
spec = {"title": f"Grant #16 · {sc} · STYLE W", "note": "STYLE_LOCK 2d: one green ink map, portraits on stakes, hatching only on hand-over, clean screen", "frames": fr}
f = tempfile.NamedTemporaryFile("w", suffix=".json", delete=False); json.dump(spec, f); f.close()
os.makedirs("build", exist_ok=True); subprocess.run([sys.executable, "tools/make_sheet.py", f.name, f"build/sheetW-{sc}.jpg"], check=True)
os.unlink(lk)
