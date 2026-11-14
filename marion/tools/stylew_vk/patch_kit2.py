"""Grant #16 move 2, critic round 1 (2026-11-06): kit fixes on top of patch_kit.py (marker @@STYLEW2). run from grant/."""
import sys
for fn in ("tools/vk_kit.js", "tools/vx_kit.js"):
    s = open(fn).read()
    if "@@STYLEW2" in s: print(fn, "already"); continue
    L = s.split("\n")
    i = [i for i, l in enumerate(L) if l.startswith("const arw = ")][0]
    L[i:i + 3] = ['''const arw = (o) => { const w = (o.width || 22) * 0.5, un = o.t + (o.dur || 1.4) + 2.0;   // @@STYLEW2 critic r1: thin solid trail, no white casing, fades ~2 s after arrival
  const g = B.arrow({ ...o, dash: undefined, width: w, until: o.until == null ? un : Math.min(o.until, un) }), ps = g.querySelectorAll("path");
  ps[0].setAttribute("stroke", "rgba(24,20,10,0.55)"); ps[0].setAttribute("stroke-width", (w + Math.max(1.2 / CAM_S, w * 0.35)).toFixed(2));
  const hd = g.querySelector("polygon"); if (hd) { hd.setAttribute("stroke", "rgba(24,20,10,0.55)"); hd.setAttribute("stroke-width", (w * 0.25).toFixed(2)); } return g; };''']
    s = "\n".join(L)
    a = 'const stampHTML = (txt, c, size, rot, sub) => `<div style="transform:rotate(${rot}deg);'
    assert a in s, fn
    s = s.replace(a, 'const stampHTML = (txt, c, size, rot, sub) => `<div style="transform:rotate(0deg);')   # critic r1: stamps level
    a = 'tl.to(st, { x: to, duration: dur, ease: "none", onUpdate'
    assert a in s
    s = s.replace(a, 'tl.to(st, { x: to, duration: 0.05, ease: "none", onUpdate')   # critic r1: the number exactly as spoken (no counting reel)
    s += '''
// @@STYLEW2 critic r1: no grey arrows/units (side colours only): a failed/abandoned arrow simply fades out
B.greyArrow = (g, t, until) => { tl.to(g, { autoAlpha: 0, duration: 0.6 }, t); };
'''
    open(fn, "w").write(s); print(fn, "patched")
