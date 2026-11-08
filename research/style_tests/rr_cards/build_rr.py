"""R&R cards test: inline rr_cards.js into the TEST COPY body grant/tools/s12_body_s12d_rr.js, build grant/scenes/s12d_rr with the
unchanged s12 builder (tools/s12_inline.py vx ... 31.2 63.8, same cut as the approved s12d), then add the EB Garamond fonts.
The originals (s12d body/scene, kits, builders) are never touched. usage: python3 research/style_tests/rr_cards/build_rr.py"""
import os, shutil, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); G = "/home/user/battle-maps/grant"
body = f"{G}/tools/s12_body_s12d_rr.js"
src = open(body).read()
rr = open(f"{HERE}/rr_cards.js").read()
tmp = src.replace("// @@RR\n", "// @@RR (research/style_tests/rr_cards/rr_cards.js)\n" + rr + "// @@END-RR\n")
assert tmp != src, "no // @@RR marker"
# s12_inline.py reads tools/s12_body_<scene>.js: write the inlined version, build, restore the marker version
open(body, "w").write(tmp)
try:
    r = subprocess.run(["python3", "tools/s12_inline.py", "vx", "s12d_rr", "vicksburg_w", "s12-3", "s12-4", "31.2", "63.8"], cwd=G, capture_output=True, text=True)
    print(r.stdout.strip(), r.stderr.strip()[-800:])
finally:
    open(body, "w").write(src)
fd = f"{G}/scenes/s12d_rr/assets/fonts"
for f in ("cinzel-latin-600-normal.woff2", "cinzel-latin-700-normal.woff2", "eb-garamond-latin-400-italic.woff2", "eb-garamond-latin-500-italic.woff2"):
    shutil.copy(f"{HERE}/fonts/{f}", f"{fd}/{f}")
print("fonts ->", fd)
