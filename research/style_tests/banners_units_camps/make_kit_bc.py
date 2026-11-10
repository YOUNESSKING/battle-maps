"""test kit for s12d_bc ONLY (grant/tools/vx_bc_kit.js): vx_kit.js with pinPortrait -> general's banner (banner.js) + troop formations (units.js)."""
D = "/home/user/battle-maps/research/style_tests/banners_units_camps"
k = open("/home/user/battle-maps/grant/tools/vx_kit.js").read()
i0 = k.index("const pinPortrait = "); i1 = k.index("return w; };", i0) + len("return w; };")
bn = open(f"{D}/banners/banner.js").read() + "\nconst pinPortrait = pinBanner;\n"
for a, b in [("background:radial-gradient(ellipse 75% 62% at 50% 38%,var(--bn-hi) 0%,var(--bn-cloth) 62%,var(--bn-lo) 100%);",
              "background:radial-gradient(ellipse 75% 62% at 50% 38%,#cdb486 0%,#8c7149 62%,#3c2e1e 100%);"),   # critic: sepia studio backdrop (2e cards), no blue/red duotone
             ("filter:grayscale(1) sepia(.62) contrast(1.3) brightness(.86) saturate(1.15)", "filter:grayscale(1) sepia(.55) contrast(1.32) brightness(.95) saturate(1.05)"),
             ("height:${L.peH - 6}px;object-fit:cover;", "height:${L.peH - 6}px;object-fit:fill;")]:   # pennant shows the whole flag (13-star circle)
    assert bn.count(a) == 1, a
    bn = bn.replace(a, b)
un = open(f"{D}/units/units.js").read()
open("/home/user/battle-maps/grant/tools/vx_bc_kit.js", "w").write("// TEST COPY for s12d_bc only (make_kit_bc.py): vx_kit.js + banner.js (units.js dropped: owner)\n" + k[:i0] + bn + k[i1:] + "\n")
