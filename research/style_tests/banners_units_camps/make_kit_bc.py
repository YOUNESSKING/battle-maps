"""test kit for s12d_bc ONLY (grant/tools/vx_bc_kit.js): vx_kit.js with pinPortrait -> general's banner (banner.js) + troop formations (units.js)."""
D = "/home/user/battle-maps/research/style_tests/banners_units_camps"
k = open("/home/user/battle-maps/grant/tools/vx_kit.js").read()
i0 = k.index("const pinPortrait = "); i1 = k.index("return w; };", i0) + len("return w; };")
bn = open(f"{D}/banners/banner.js").read() + "\nconst pinPortrait = pinBanner;\n"
un = open(f"{D}/units/units.js").read()
open("/home/user/battle-maps/grant/tools/vx_bc_kit.js", "w").write("// TEST COPY for s12d_bc only (make_kit_bc.py): vx_kit.js + banner.js (units.js dropped: owner)\n" + k[:i0] + bn + k[i1:] + "\n")
