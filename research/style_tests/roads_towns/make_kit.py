"""test copy of the kit for s12d_rt ONLY (grant/tools/vx_rt_kit.js): vx_kit.js with pinPortrait swapped for portrait card v2. The shared kit is never edited."""
import re
k = open("/home/user/battle-maps/grant/tools/vx_kit.js").read()
i0 = k.index("const pinPortrait = ")
i1 = k.index("return w; };", i0) + len("return w; };")
pc = open("/home/user/battle-maps/research/style_tests/roads_towns/portraits/portrait_card.js").read()
open("/home/user/battle-maps/grant/tools/vx_rt_kit.js", "w").write("// TEST COPY for s12d_rt only (make_kit.py): vx_kit.js + portrait card v2\n" + k[:i0] + pc + k[i1:])
