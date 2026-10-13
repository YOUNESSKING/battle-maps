"""Inline the shared move-3 helper kit + map data into Peng's move-3 scenes (move3a/b/c), between the markers
`// @@KIT` ... `// @@END-KIT` and `// @@DATA` ... `// @@END-DATA` (re-run after editing the kit or the map data).
usage (from peng/): python3 tools/make_seoul_inline.py
Data: assets/media/seoul_front_<state>.json (tools/make_seoul_control.py), seoul_han.json / seoul_imjin.json / seoul_rivers.json
(tools/make_seoul_geo.py), korea_front_dec26/jan7.json (hook agent, read-only)."""
import json, os, re

KIT = r'''
// ---------- move-3 kit (tools/make_seoul_inline.py) ----------
const FL = { prc: "assets/media/prc_flag.png", nk: "assets/media/nk_flag.png", us: "assets/media/us_flag_48star.png", rok: "assets/media/rok_flag_1949.png",
  un: "assets/media/un_flag.png", uk: "assets/media/uk_flag.png", tr: "assets/media/turkey_flag.png" };
// stand-ins while the flag/photo agent is still fetching (TODO: drop once the real files exist)
const FALLBACK = { "prc_flag.png": "smith_pva_flag.png", "rok_flag_1949.png": "us_flag_48star.png", "un_flag.png": "us_flag_48star.png",
  "turkey_flag.png": "us_flag_48star.png", "ridgway_head.png": "smith_ridgway_head.png", "emblem_prc.png": "" };
const fixImgs = () => document.querySelectorAll("img").forEach((im) => im.addEventListener("error", () => {
  const f = (im.getAttribute("src") || "").split("/").pop(); if (!(f in FALLBACK)) return;
  if (FALLBACK[f]) im.src = "assets/media/" + FALLBACK[f]; else im.style.display = "none"; }, { once: true }));
const SCN = document.getElementById("scene");
const box = (txt, x, y, t, size = 16, until, o = {}) => { if (o.sfx !== false) SFX("ref:pop", t); return GG.pin(`<div style="background:${o.bg || "#f1eee6"};color:${o.col || "#111"};font-family:Oswald;font-weight:500;letter-spacing:.24em;padding:${(size * 0.2).toFixed(1)}px ${(size * 0.35).toFixed(1)}px ${(size * 0.2).toFixed(1)}px ${(size * 0.6).toFixed(1)}px;font-size:${size}px;white-space:nowrap;box-shadow:0 ${size * 0.1}px ${size * 0.4}px rgba(0,0,0,.6)">${txt}</div>`, x, y, { t, until }); };
const flag = (src, name, x, y, t, until, w = 76) => GG.pin(`<div style="display:flex;flex-direction:column;align-items:center;gap:${(w * 0.05).toFixed(1)}px"><img src="${src}" style="width:${w}px;display:block;border:${Math.max(0.6, w / 60).toFixed(1)}px solid #1a1712;box-shadow:0 ${w * 0.025}px ${w * 0.07}px rgba(0,0,0,0.55)"><div class="gg-lbl" style="position:relative;font-size:${(w / 4.4).toFixed(1)}px;color:#f7f3ea;text-shadow:0 ${w * 0.02}px ${w * 0.04}px #000;letter-spacing:0.08em;white-space:nowrap">${name}</div></div>`, x, y, { t, pop: true, until });
const unit = (id, side, p, icon, label, o = {}) => {
  const w = o.w || 22, h = o.h || 15;
  B.unit({ id, side, x: p[0], y: p[1], w, h, t: o.t, label });
  K.counter(id, { icon, flag: o.flag || (side === "carth" ? FL.prc : FL.us), size: o.size });
  const u = B.units[id]; u.el.querySelector(".blk").style.borderWidth = Math.max(0.6, w / 14).toFixed(2) + "px";
  const tg = u.el.querySelector(".tag"); if (tg) Object.assign(tg.style, { fontSize: (o.tag || h * 0.55).toFixed(1) + "px", padding: `0 ${(h * 0.22).toFixed(1)}px`, marginTop: (h * 0.12).toFixed(1) + "px", whiteSpace: "nowrap" });
  const sz = u.el.querySelector(".fxk-size"); if (sz) sz.style.fontSize = Math.max(3, h * 0.42).toFixed(1) + "px";
  if (o.until != null) B.hideUnits([id], o.until);
  return id;
};
const arw = (o) => { const g = B.arrow(o), w = o.width || 22, ps = g.querySelectorAll("path");   // casing scaled to the width
  ps[0].setAttribute("stroke-width", (w + Math.min(10, w * 0.6)).toFixed(1)); if (o.dash) ps[0].setAttribute("stroke-dasharray", o.dash);
  const hd = g.querySelector("polygon"); if (hd) hd.setAttribute("stroke-width", Math.min(5, w * 0.3).toFixed(1)); return g; };
const legend = (t, until, opt2) => GG.card(`<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2e5cb2", "#2c57b7", "CHINA + NORTH KOREA"], ["#be3a2a", "#bc2528", "UN COMMAND"]].map(([sq, ln, nm]) => `<span><b style="display:inline-block;width:20px;height:${opt2 ? 6 : 20}px;background:${opt2 ? ln : sq};${opt2 ? `box-shadow:0 0 8px ${ln};vertical-align:4px;` : "vertical-align:-3px;"}margin-right:8px;border:1px solid #f7f3ea"></b>${nm}</span>`).join("")}</div>`, "", 34, t, until);
const ctlImg = (file, t, until, dur = 1.0) => { const el = B.image(file, 0, 0, 2880, 1620, { t, dur, until }); el.style.mixBlendMode = "multiply"; return el; };
const posOn = (pts, f) => { let Lt = 0; const seg = []; for (let j = 1; j < pts.length; j++) { const d = Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]); seg.push(d); Lt += d; }
  let d = f * Lt; for (let j = 0; j < seg.length; j++) { if (d <= seg[j]) { const a = pts[j], b = pts[j + 1], k = d / seg[j]; return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; } d -= seg[j]; }
  return pts[pts.length - 1]; };
// US air attack: the locked K.bombRun with the glowing C-47 symbol in RED (UN side); bombs on the track 0.25 s apart, shake on the first
const bomber = (pts, t, n = 3, dur = 4.0, size = 30, alt = 9, jit = 4) => {
  const bombs = []; for (let k = 0; k < n; k++) bombs.push(posOn(pts, (1.55 + k * 0.25) / dur).map((v, i) => v + (i ? (k % 2 ? jit : -jit) : 0)));
  K.bombRun({ kind: "c47g", side: "rome", size, alt, dur, pts, t, bombs });
};
// artillery shot: the gun fires (quiet), shell arc, the impact carries the boom + the locked shake
const shoot = (from, to, t, o = {}) => {
  K.gun(from[0], from[1], t, { unit: o.unit, dx: o.dx || 0, dy: o.dy || -2 });
  const dur = o.dur || 1.0;
  GG.arc(from[0], from[1], to[0], to[1], t + 0.05, { dur, width: o.width || 1.2, h: o.h, impact: false, color: o.color });
  K.impact(to[0], to[1], t + 0.05 + dur, { r: o.r || 5, puffs: 2 });
};
const badge = (o) => {   // K.badge + initials under the photo (shown if the photo file is missing)
  const el = K.badge(o), ring = el.querySelector("div[style*='border-radius:50%']"), img = ring.querySelector("img");
  if (img) { const ini = document.createElement("div"); ini.style.cssText = "position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle, rgba(10,12,24,0.78) 0%, rgba(10,12,24,0.45) 100%);font-size:60px;font-weight:700;color:#f7f3ea;text-shadow:0 3px 6px #000";
    ini.textContent = o.initials || ""; ring.insertBefore(ini, img); img.addEventListener("error", () => { const f = (img.getAttribute("src") || "").split("/").pop(); if (FALLBACK[f]) img.src = "assets/media/" + FALLBACK[f]; else img.style.display = "none"; }); }
  return el;
};
const glowPath = (pts, col, w, t, until, pulses = 3, op = 0.95) => {   // glowing stroke (river, supply line), pulses then holds
  const p = document.createElementNS("http://www.w3.org/2000/svg", "path"), svg = document.getElementById("overlay");
  p.setAttribute("d", "M" + pts.map((q) => q.join(" ")).join(" L")); p.setAttribute("fill", "none"); p.setAttribute("stroke", col);
  p.setAttribute("stroke-width", w); p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round"); p.style.filter = `drop-shadow(0 0 ${w}px ${col})`;
  svg.insertBefore(p, svg.firstChild); gsap.set(p, { opacity: 0 });
  B.tl.to(p, { opacity: op, duration: 0.5 }, t); if (pulses) B.tl.to(p, { opacity: op * 0.45, duration: 0.5, yoyo: true, repeat: pulses, ease: "sine.inOut" }, t + 0.5);
  if (until != null) B.tl.to(p, { opacity: 0, duration: 0.6 }, until); return p;
};
const scr = (html, css, t, until, from = { autoAlpha: 0, y: 30 }) => {   // screen-space element (above the map, under the credit)
  const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html;
  SCN.insertBefore(el, document.getElementById("credit")); GG.hide(el);
  B.tl.fromTo(el, from, { autoAlpha: 1, y: 0, x: 0, duration: 0.5, ease: "power3.out" }, t); if (until != null) B.tl.to(el, { autoAlpha: 0, duration: 0.5 }, until); return el;
};
const xMark = (x, y, t, until, s = 40) => GG.pin(`<svg width="${s}" height="${s}" viewBox="0 0 40 40"><path d="M6 6 L34 34 M34 6 L6 34" stroke="#c4121f" stroke-width="7" stroke-linecap="round"/><path d="M6 6 L34 34 M34 6 L6 34" stroke="#f3eee2" stroke-width="2.5" stroke-linecap="round"/></svg>`, x, y, { t, pop: true, until });
// ---------- end of kit ----------
'''

def load(p):
    return json.load(open(p)) if os.path.exists(p) else []

DATA = "\n// map data (tools/make_seoul_inline.py; fronts from tools/make_seoul_control.py, rivers from tools/make_seoul_geo.py)\n"
for k in ("dec26", "jan1", "jan3", "jan4", "jan7"):
    DATA += f"const SF_{k.upper()} = {json.dumps(load(f'assets/media/seoul_front_{k}.json'))};\n"
DATA += f"const S_HAN = {json.dumps(load('assets/media/seoul_han.json'))};\n"
DATA += f"const S_IMJIN = {json.dumps(load('assets/media/seoul_imjin.json'))};\n"
DATA += f"const S_RIVERS = {json.dumps(load('assets/media/seoul_rivers.json'))};\n"
DATA += f"const KF_DEC26 = {json.dumps(load('assets/media/korea_front_dec26.json'))};\n"
DATA += f"const KF_JAN7 = {json.dumps(load('assets/media/korea_front_jan7.json'))};\n"

for name in ("move3a", "move3b", "move3c"):
    path = f"scenes-src/{name}.js"
    if not os.path.exists(path): continue
    s = open(path).read()
    s = re.sub(r"// @@KIT.*?// @@END-KIT", lambda m: "// @@KIT" + KIT + "// @@END-KIT", s, flags=re.S)
    s = re.sub(r"// @@DATA.*?// @@END-DATA", lambda m: "// @@DATA" + DATA + "// @@END-DATA", s, flags=re.S)
    open(path, "w").write(s); print("inlined", path)
