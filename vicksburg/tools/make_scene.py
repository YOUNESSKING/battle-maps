"""Assemble a renderable HyperFrames project for one sequence.
usage: python3 vicksburg/tools/make_scene.py vicksburg/sequences/<name> [--out DIR]
  -> vicksburg/scenes/<SEQ.name or dir name>/ :
       index.html       (engine/template.html with the data scripts + duration filled in)
       hyperframes.json
       engine/          (a COPY of the runtime: scene.js world.js fx.js overlay.js banner.js troops3d.js seqlib.js vendor/ cloudtex/ assets/)
       worlds/          (geo.js + places.js (data/geo.json places, for VX.place) + only the region folders SEQ.regions uses, copied)
       seq/             (a copy of the sequence folder: seq.js + its own images, referenced as "seq/<file>")
       cues.json        ({D, T, CUES, regions}: the sound cues for assembly, evaluated from SEQ with node)
Everything is copied (never hard-linked), so the folder can be tarred for the GPU pod as-is:
  tar czf scene.tgz -C vicksburg/scenes <name>
"""
import json, os, shutil, subprocess, sys

REPO = "/home/user/battle-maps"
VX = f"{REPO}/vicksburg"
ENGINE = f"{VX}/engine"
WORLDS = f"{VX}/worlds"
ENGINE_FILES = ["scene.js", "world.js", "fx.js", "overlay.js", "banner.js", "troops3d.js", "seqlib.js"]
ENGINE_DIRS = ["vendor", "cloudtex", "assets"]
HF_JSON = {"$schema": "https://hyperframes.heygen.com/schema/hyperframes.json",
           "registry": "https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry",
           "paths": {"blocks": "compositions", "components": "compositions/components", "assets": "assets"}, "media": {"autoProxy": True}}

NODE_EVAL = r"""
const fs = require('fs'), vm = require('vm'), path = require('path');
const [worlds, engine, seqjs] = process.argv.slice(1);
const ctx = { console, Math, JSON }; ctx.window = ctx; ctx.globalThis = ctx; vm.createContext(ctx);
const run = (f) => vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f });
run(path.join(worlds, 'geo.js'));
const pf = path.join(worlds, '..', 'data', 'geo.json'); if (fs.existsSync(pf)) ctx.GM3D_PLACES = JSON.parse(fs.readFileSync(pf, 'utf8')).places || [];
for (const d of fs.readdirSync(worlds)) { const f = path.join(worlds, d, 'region.js'); if (fs.existsSync(f)) run(f); }
run(path.join(engine, 'seqlib.js')); run(seqjs);
const S = ctx.SEQ; if (!S) throw new Error('seq.js did not set window.SEQ');
for (const r of S.regions) if (!ctx.GM3D_REGIONS[r]) throw new Error('region ' + r + ' not found in ' + worlds);
console.log(JSON.stringify({ name: S.name, D: S.D, T: S.T || {}, regions: S.regions, CUES: ctx.VX.cues(S) }));
"""


def copy_tree(src, dst):
    if os.path.isdir(src):
        shutil.copytree(src, dst, copy_function=shutil.copyfile, ignore=shutil.ignore_patterns("*.mp4", "*.wav", ".hyperframes", "renders"))
    else:
        shutil.copyfile(src, dst)


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    seqdir = os.path.abspath(sys.argv[1])
    seqjs = f"{seqdir}/seq.js"
    r = subprocess.run(["node", "-e", NODE_EVAL, WORLDS, ENGINE, seqjs], capture_output=True, text=True)
    if r.returncode:
        sys.exit("seq.js evaluation failed:\n" + r.stderr[-3000:])
    info = json.loads(r.stdout)
    name = info["name"] or os.path.basename(seqdir)
    out = sys.argv[sys.argv.index("--out") + 1] if "--out" in sys.argv else f"{VX}/scenes/{name}"
    if os.path.exists(out):
        shutil.rmtree(out)   # generated folder: rebuilt from scratch every time
    os.makedirs(f"{out}/engine"); os.makedirs(f"{out}/worlds")
    for f in ENGINE_FILES:
        copy_tree(f"{ENGINE}/{f}", f"{out}/engine/{f}")
    for d in ENGINE_DIRS:
        copy_tree(f"{ENGINE}/{d}", f"{out}/engine/{d}")
    copy_tree(f"{WORLDS}/geo.js", f"{out}/worlds/geo.js")
    places = json.load(open(f"{VX}/data/geo.json")).get("places", []) if os.path.exists(f"{VX}/data/geo.json") else []
    open(f"{out}/worlds/places.js", "w").write("window.GM3D_PLACES = " + json.dumps(places, separators=(",", ":")) + ";\n")
    for reg in info["regions"]:
        copy_tree(f"{WORLDS}/{reg}", f"{out}/worlds/{reg}")
    copy_tree(seqdir, f"{out}/seq")
    scripts = ['<script src="worlds/geo.js"></script>', '<script src="worlds/places.js"></script>'] + [f'<script src="worlds/{reg}/region.js"></script>' for reg in info["regions"]]
    html = open(f"{ENGINE}/template.html").read()
    html = html.replace("{{TITLE}}", f"Vicksburg scene: {name}").replace("{{DURATION}}", f"{info['D']:g}").replace("{{DATA_SCRIPTS}}", "\n".join(scripts))
    open(f"{out}/index.html", "w").write(html)
    json.dump(HF_JSON, open(f"{out}/hyperframes.json", "w"), indent=2)
    json.dump({"D": info["D"], "T": info["T"], "regions": info["regions"], "CUES": info["CUES"]}, open(f"{out}/cues.json", "w"), indent=1)
    size = sum(os.path.getsize(os.path.join(dp, f)) for dp, _, fs in os.walk(out) for f in fs)
    print(f"scene {name}: {out}  D={info['D']}s  regions={info['regions']}  cues={len(info['CUES'])}  size={size / 1e6:.1f} MB")


if __name__ == "__main__":
    main()
