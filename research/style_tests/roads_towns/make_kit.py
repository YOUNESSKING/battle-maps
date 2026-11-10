"""test copy of the kit for s12d_rt ONLY (grant/tools/vx_rt_kit.js): vx_kit.js with pinPortrait swapped for portrait card v2. The shared kit is never edited."""
import re
k = open("/home/user/battle-maps/grant/tools/vx_kit.js").read()
i0 = k.index("const pinPortrait = ")
i1 = k.index("return w; };", i0) + len("return w; };")
pc = open("/home/user/battle-maps/research/style_tests/roads_towns/portraits/portrait_card.js").read()
# polish 2026-11-10 (test copy only): Cinzel 700 names ~22 % larger with tighter tracking (plate 2 px taller), more photo contrast
for a, b in [("Math.max(8.5, Math.min(11.5, room / Math.max(em, 1)))", "Math.max(10.4, Math.min(14, 1.22 * room / Math.max(em * 1.06, 1)))"),
             ('.02em"}`; };', '-.01em"}`; };'), ("(0.02 * f - Math.min(0.9, over / n))", "(-0.01 * f - Math.min(1.1, over / n))"),
             ("height:17px;line-height:16px", "height:19px;line-height:18px"),
             ("filter:grayscale(1) sepia(.62) contrast(1.12) brightness(.96) saturate(1.05)", "filter:grayscale(1) sepia(.55) contrast(1.32) brightness(.9) saturate(1.05)")]:
    assert pc.count(a) == 1, a
    pc = pc.replace(a, b)
open("/home/user/battle-maps/grant/tools/vx_rt_kit.js", "w").write("// TEST COPY for s12d_rt only (make_kit.py): vx_kit.js + portrait card v2\n" + k[:i0] + pc + k[i1:])
