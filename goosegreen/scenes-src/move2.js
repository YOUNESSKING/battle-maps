// MOVE 2: Darwin Hill and Boca House, 28 May 1982 (move2-1 .. move2-12, incl. one ARCHIVE paragraph after move2-6).
// Sides: British (2 PARA) = blue = engine side "carth"; Argentine = red = engine side "rome".
// Basemap: assets/darwin.jpg (z14). G(lat, lon) -> map px. Places verified against OSM / Wikipedia:
//   Darwin -51.8069,-58.9587 · Goose Green -51.8277,-58.9728 · Boca House (ruin) -51.8009,-58.9847
//   H Jones memorial (where he fell, north slope of Darwin Hill) -51.8042,-58.9701 · Goose Green airfield -51.8196,-58.9802
const B = Battle();
const { P, at } = B;
const END = B.T.duration;
const tl = B.tl;

// ---------- projection (assets/darwin.json: zoom 14, origin_world_px) ----------
const G = (lat, lon) => {
  const n = 256 * 2 ** 14, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 1408603).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 2804501).toFixed(1)];
};

// ---------- photos present in assets/media (checked before render; missing -> plain plaque) ----------
const HAVE = { "jones_head.png": false, "keeble_head.png": false, "piaggi_head.png": true, "estevez_head.png": true, "uk_flag.png": true, "arg_flag.png": true };

// ================= scene-local helpers (no engine changes) =================
const NS = "http://www.w3.org/2000/svg";
const OV = document.getElementById("overlay"), PINS = document.getElementById("pins"), SCENE = document.getElementById("scene");
const st = document.createElement("style");
st.textContent = `
.gg-card { position:absolute; left:0; right:0; display:flex; justify-content:center; }
.gg-card .inner { background: rgba(18,16,12,0.9); color:#f7f3ea; padding: 26px 64px 32px; border-top: 6px solid #c9b48a; text-align:center; box-shadow: 0 18px 40px rgba(0,0,0,0.5); }
.gg-card .k { font-size: 28px; letter-spacing: 0.42em; color:#c9b48a; margin-bottom: 14px; }
.gg-insight { top: 290px; } .gg-insight .inner { border-top-color: #9fc0ea; }
.gg-insight .row { font-size: 58px; font-weight: 700; letter-spacing: 0.06em; line-height: 1.28; }
.gg-insight .row.sub { font-size: 44px; color: #e8a39c; }
.gg-method { top: 300px; }
.gg-method .row { position: relative; font-size: 56px; font-weight: 700; letter-spacing: 0.08em; line-height: 1.5; color: rgba(247,243,234,0.36); }
.gg-method .row .bar { position:absolute; left:0; right:0; bottom: 6px; height: 5px; background: #e3232f; transform-origin: 0 50%; }
.gg-radio { position:absolute; left:0; right:0; top: 830px; display:flex; justify-content:center; }
.gg-radio .inner { display:flex; align-items:center; gap: 34px; padding: 20px 44px; background: rgba(18,16,12,0.9); border-left: 10px solid #e3232f; box-shadow: 0 14px 30px rgba(0,0,0,0.5); }
.gg-radio .wave { display:flex; align-items:center; gap: 7px; height: 90px; }
.gg-radio .wave i { display:block; width: 9px; height: 90px; background: #f7f3ea; border-radius: 4px; transform: scaleY(0.15); }
.gg-radio .txt { font-family: "Special Elite", monospace; font-size: 58px; color: #f7f3ea; letter-spacing: 0.06em; }
.gg-radio .txt small { display:block; font-size: 26px; color: #c9b48a; letter-spacing: 0.2em; }
.gg-icon { position:absolute; }
.gg-icon svg { width:100%; height:100%; display:block; overflow: visible; }
.gg-burst { position:absolute; border-radius:50%; background: radial-gradient(circle, #fffbe0 0%, #ffc043 30%, rgba(222,82,24,0.75) 55%, rgba(222,82,24,0) 72%); }
.gg-ring { position:absolute; border-radius:50%; border: 3px solid #fff; box-shadow: 0 0 6px rgba(0,0,0,0.6); }
.gg-token { position:absolute; border-radius:50%; overflow:hidden; border: 3px solid #f3eee2; box-shadow: 0 0 0 2px #1f4fc4, 0 3px 6px rgba(0,0,0,0.5); background:#1f4fc4; }
.gg-token img { width:100%; height:100%; object-fit:cover; object-position: 50% 18%; display:block; }
.gg-ttag { position:absolute; transform: translateX(-50%); white-space:nowrap; font-weight:700; letter-spacing:0.06em; color:#fff; background:#1f4fc4; padding: 0 5px; border-radius: 2px; }
.gg-role { font-weight: 500; font-size: 0.72em; letter-spacing: 0.04em; opacity: 0.95; }
.stake.gg-plq .board { width: 250px; }
`;
document.head.appendChild(st);

const screenBox = (html, cls) => { // screen-space element, above the map, under the credit
  const el = document.createElement("div"); el.className = cls; el.innerHTML = html;
  SCENE.insertBefore(el, document.getElementById("credit"));
  gsap.set(el, { autoAlpha: 0 });
  return el;
};
const U = (o) => { // unit with world-scaled tag
  const el = B.unit(o);
  const tag = el.querySelector(".tag");
  if (tag) { tag.style.fontSize = (o.fs || 11) + "px"; tag.style.padding = "0 4px"; tag.style.marginTop = "2px"; }
  el.querySelector(".blk").style.borderWidth = (o.bw || 2) + "px";
  return el;
};
const L = (text, x, y, o = {}) => B.label(text, x, y, { size: o.size || 13, t: o.t || 0, until: o.until, cls: o.cls || "", anchor: o.anchor || [-50, -50], instant: o.instant });
const burst = (x, y, t, r = 14) => {
  const el = document.createElement("div"); el.className = "gg-burst";
  Object.assign(el.style, { left: x - r + "px", top: y - r + "px", width: 2 * r + "px", height: 2 * r + "px" });
  PINS.appendChild(el); gsap.set(el, { autoAlpha: 0 });
  tl.fromTo(el, { autoAlpha: 0, scale: 0.2 }, { autoAlpha: 1, scale: 1, duration: 0.22, ease: "power2.out" }, t);
  tl.to(el, { autoAlpha: 0, scale: 1.5, duration: 0.7, ease: "power1.in" }, t + 0.22);
};
const shell = (from, to, t, o = {}) => { // ballistic arc (artillery / mortar) + burst on impact
  const [x1, y1] = from, [x2, y2] = to, h = o.h || Math.hypot(x2 - x1, y2 - y1) * 0.35;
  const dl = Math.hypot(x2 - x1, y2 - y1) || 1, cx = (x1 + x2) / 2 + (y2 - y1) / dl * h * (o.side || 1), cy = (y1 + y2) / 2 - (x2 - x1) / dl * h * (o.side || 1);
  const p = document.createElementNS(NS, "path");
  p.setAttribute("d", `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`);
  p.setAttribute("fill", "none"); p.setAttribute("stroke", o.color || "#fff4d8"); p.setAttribute("stroke-width", o.w || 2.2);
  p.setAttribute("stroke-linecap", "round"); p.setAttribute("opacity", "0");
  OV.appendChild(p);
  const len = p.getTotalLength(), dur = o.dur || 1.0;
  gsap.set(p, { strokeDasharray: `${len * 0.3} ${len * 2}`, strokeDashoffset: len * 0.3 });
  tl.to(p, { opacity: 0.95, duration: 0.05 }, t);
  tl.to(p, { strokeDashoffset: -len, duration: dur, ease: "none" }, t);
  tl.to(p, { opacity: 0, duration: 0.05 }, t + dur);
  burst(x2, y2, t + dur * 0.93, o.r || 14);
};
const missile = (from, to, t, dur = 1.1) => { // straight wire-guided missile: wire line + flare + impact
  const [x1, y1] = from, [x2, y2] = to;
  const g = document.createElementNS(NS, "g");
  g.innerHTML = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgba(20,16,10,0.55)" stroke-width="4"/>
    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#fff8e0" stroke-width="2"/>
    <circle cx="${x1}" cy="${y1}" r="5" fill="#ffd54a" stroke="#fff" stroke-width="1.5"/>`;
  OV.appendChild(g);
  const lines = g.querySelectorAll("line"), c = g.querySelector("circle"), len = Math.hypot(x2 - x1, y2 - y1);
  gsap.set(lines, { strokeDasharray: `${len} ${len}`, strokeDashoffset: len });
  gsap.set(g, { autoAlpha: 0 });
  tl.to(g, { autoAlpha: 1, duration: 0.05 }, t);
  tl.to(lines, { strokeDashoffset: 0, duration: dur, ease: "none" }, t);
  tl.to(c, { attr: { cx: x2, cy: y2 }, duration: dur, ease: "none" }, t);
  tl.to(g, { autoAlpha: 0, duration: 0.5 }, t + dur + 0.5);
  burst(x2, y2, t + dur - 0.05, 18);
};
const cone = (x, y, ang, spread, len, t, until) => { // translucent field of fire from a trench
  const a0 = (ang - spread / 2) * Math.PI / 180, a1 = (ang + spread / 2) * Math.PI / 180;
  const p = document.createElementNS(NS, "path");
  p.setAttribute("d", `M ${x} ${y} L ${x + len * Math.cos(a0)} ${y + len * Math.sin(a0)} A ${len} ${len} 0 0 1 ${x + len * Math.cos(a1)} ${y + len * Math.sin(a1)} Z`);
  p.setAttribute("fill", "rgba(196,18,31,0.16)"); p.setAttribute("stroke", "rgba(196,18,31,0.75)");
  p.setAttribute("stroke-width", "1.6"); p.setAttribute("stroke-dasharray", "5 4");
  OV.insertBefore(p, OV.firstChild);
  gsap.set(p, { autoAlpha: 0, svgOrigin: `${x} ${y}`, scale: 0 });
  tl.to(p, { autoAlpha: 1, scale: 1, duration: 0.8, ease: "power2.out" }, t);
  if (until != null) tl.to(p, { autoAlpha: 0, duration: 0.6 }, until);
  return p;
};
const icon = (svg, x, y, w, h, t, until, vb = "0 0 100 100") => {
  const el = document.createElement("div"); el.className = "gg-icon";
  Object.assign(el.style, { left: x - w / 2 + "px", top: y - h / 2 + "px", width: w + "px", height: h + "px" });
  el.innerHTML = `<svg viewBox="${vb}">${svg}</svg>`;
  PINS.appendChild(el); gsap.set(el, { autoAlpha: 0 });
  tl.fromTo(el, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }, t);
  if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.5 }, until);
  return el;
};
const moveEl = (el, t, dur, x, y, w, h, ease = "power1.inOut") => tl.to(el, { left: x - w / 2, top: y - h / 2, duration: dur, ease }, t);
const ring = (x, y, r, t, reps = 3) => { // pulsing target ring
  const el = document.createElement("div"); el.className = "gg-ring";
  Object.assign(el.style, { left: x - r + "px", top: y - r + "px", width: 2 * r + "px", height: 2 * r + "px" });
  PINS.appendChild(el); gsap.set(el, { autoAlpha: 0 });
  tl.fromTo(el, { autoAlpha: 0, scale: 1.8 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: "power2.out", repeat: reps, repeatDelay: 0.25 }, t);
  tl.to(el, { autoAlpha: 0, duration: 0.4 }, t + (reps + 1) * 0.85);
};
const flicker = (ids, t, reps = 7) => ids.forEach((k, i) =>
  tl.to(B.units[k].el, { opacity: 0.35, duration: 0.14, yoyo: true, repeat: reps, ease: "none" }, t + i * 0.09));
const stake = (o) => { // portrait stake if the photo exists, else a scaled plain plaque. (x,y) = foot of the pole
  const arg = o.side === "arg";
  if (HAVE[o.img]) {
    const el = B.portraitStake({ img: "assets/media/" + o.img, flag: "assets/media/" + (arg ? "arg_flag.png" : "uk_flag.png"), name: o.name, x: o.x, y: o.y, size: o.size, t: o.t, until: o.until });
    if (!HAVE[arg ? "arg_flag.png" : "uk_flag.png"]) el.querySelector(".flag").style.display = "none";
    const nm = el.querySelector(".nm");
    nm.innerHTML = o.name + (o.role ? `<div class="gg-role">${o.role}</div>` : "");
    Object.assign(nm.style, { fontSize: (o.fs || 9) + "px", textAlign: "center", lineHeight: "1.15", padding: "1px 5px" });
    if (arg) { nm.style.background = "#c4121f"; el.querySelector(".face").style.boxShadow = "0 0 0 3px #c4121f, 0 6px 12px rgba(0,0,0,0.5)"; }
    return el;
  }
  const el = B.plaque({ name: o.name, role: o.role, side: arg ? "rome" : "carth", x: o.x, y: o.y, t: o.t, until: o.until });
  el.classList.add("gg-plq");
  Object.assign(el.style, { scale: String(o.plqScale || 0.4), transformOrigin: "19px 240px" });
  return el;
};
const token = (id, img, name, x, y, d, t, fs = 8) => { // round portrait counter that can move (B.move / B.grey compatible)
  const el = document.createElement("div");
  el.className = "unit carth";
  Object.assign(el.style, { left: x - d / 2 + "px", top: y - d / 2 + "px", width: d + "px" });
  el.innerHTML = `<div class="gg-token" style="position:relative;width:${d}px;height:${d}px;border-width:${Math.max(d / 14, 1.5)}px">` +
    (HAVE[img] ? `<img src="assets/media/${img}" alt="">` : `<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width:100%;height:100%"><line x1="0" y1="0" x2="100" y2="100" stroke="#f7f3ea" stroke-width="9"/><line x1="100" y1="0" x2="0" y2="100" stroke="#f7f3ea" stroke-width="9"/></svg>`) +
    `</div><div class="tag" style="font-size:${fs}px;padding:0 4px;margin-top:2px">${name}</div>`;
  PINS.appendChild(el);
  B.units[id] = { el, w: d, h: d, x, y };
  gsap.set(el, { autoAlpha: 0 });
  tl.fromTo(el, { autoAlpha: 0, y: -20, scale: 1.3 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: "bounce.out" }, t);
  return el;
};
const greyToken = (id, t) => {
  const el = B.units[id].el;
  tl.to(el.querySelector(".gg-token"), { filter: "grayscale(1) brightness(0.8)", boxShadow: "0 0 0 2px #77746c, 0 3px 6px rgba(0,0,0,0.5)", duration: 1 }, t);
  tl.to(el.querySelector(".tag"), { backgroundColor: "#77746c", duration: 1 }, t);
};
const insight = (rows, t, until) => {
  const el = screenBox(`<div class="inner"><div class="k">KEY INSIGHT</div>${rows.map((r, i) => `<div class="row ${i ? "sub" : ""}">${r}</div>`).join("")}</div>`, "gg-card gg-insight");
  tl.fromTo(el, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, t);
  el.querySelectorAll(".row").forEach((r, i) => tl.fromTo(r, { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power3.out" }, t + 0.3 + i * 1.0));
  tl.to(el, { autoAlpha: 0, duration: 0.5 }, until);
  return el;
};
const METHOD = ["OWN THE DARK", "MATCH THE WEAPON TO THE WALL", "ATTACK THE MIND, NOT THE MAN"];
const method = (n, lit, t, litT, until) => { // first n lines of the method, line `lit` (0-based) lit up at litT
  const el = screenBox(`<div class="inner"><div class="k">2 PARA'S METHOD</div>${METHOD.slice(0, n).map((r) => `<div class="row"><span>${r}</span><div class="bar"></div></div>`).join("")}</div>`, "gg-card gg-method");
  tl.fromTo(el, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, t);
  const rows = el.querySelectorAll(".row");
  rows.forEach((r, i) => {
    gsap.set(r.querySelector(".bar"), { scaleX: 0 });
    tl.fromTo(r, { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power3.out" }, t + 0.3 + i * 0.5);
    if (i < lit) tl.to(r, { color: "rgba(247,243,234,0.62)", duration: 0.4 }, t + 0.3 + i * 0.5);
  });
  tl.to(rows[lit], { color: "#ffffff", scale: 1.06, duration: 0.5, ease: "back.out(2)" }, litT);
  tl.to(rows[lit].querySelector(".bar"), { scaleX: 1, duration: 0.7, ease: "power2.out" }, litT + 0.1);
  if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.5 }, until);
  return el;
};
const clock = (text, t, until) => B.date(text, t, until, 34);
// ===========================================================================

// ---------- places (map px) ----------
const DARWIN = G(-51.80703, -58.95878), GG = G(-51.82768, -58.97281), BOCA = G(-51.80086, -58.98469);
const AIRF = G(-51.81962, -58.98017), JFALL = G(-51.80424, -58.97012);
const GULLY = [1556, 626];                      // A Company's gully at the NE foot of Darwin Hill
const TACHQ = [1585, 478];                      // 2 PARA tactical HQ, behind A Company
const MORT = [1540, 400];                       // British mortar line (north)
const GUNS = [1432, 1050];                      // Argentine 105 mm pack howitzers at Goose Green
const T1 = [1492, 686], T2 = [1535, 678];       // the trench Jones charged / the trench that shot him
const RIDGE = [[1432, 678], [1463, 695], T1, [1562, 700], [1592, 716]]; // Argentine trenches on Darwin Ridge
const BOCAPOS = [[1318, 624], [1348, 640], [1300, 652], [1372, 622]];   // Argentine positions around Boca House
const BCOY = [1392, 540], SUPP = [1398, 446];

// ---------- camera ----------
const P1 = P("move2-1"), P2 = P("move2-2"), P3 = P("move2-3"), P4 = P("move2-4"), P5 = P("move2-5"), P6 = P("move2-6");
const P7 = P("move2-7"), P8 = P("move2-8"), P9 = P("move2-9"), P10 = P("move2-10"), P11 = P("move2-11"), P12 = P("move2-12");
const ARCH0 = B.end("move2-6"), ARCH1 = P7;
B.camera([
  [0, 1480, 700, 1.25],
  [6.5, 1500, 680, 1.5],
  [at("move2-1", "Above them") + 0.5, 1520, 665, 2.3],
  [P2 + 1, 1520, 665, 2.3],
  [P2 + 4, 1500, 840, 1.3],
  [at("move2-2", "until he was killed"), 1505, 850, 1.3],
  [P3 + 0.5, 1500, 700, 1.9],
  [P3 + 3.5, 1380, 600, 2.2],
  [at("move2-3", "whole attack"), 1380, 600, 2.2],
  [P4 + 1.5, 1470, 640, 1.6],
  [P5, 1480, 640, 1.6],
  [P5 + 3, 1560, 560, 2.2],
  [at("move2-5", "Then Jones"), 1535, 620, 2.6],
  [P6, 1515, 660, 3.0],
  [at("move2-6", "Over the radio"), 1515, 660, 3.1],
  [at("move2-6", "A British helicopter"), 1560, 600, 2.3],
  [ARCH0 + 1, 1560, 610, 2.2],
  [ARCH1, 1530, 640, 1.9],                      // archive covers this: slow calm drift
  [P7 + 4.5, 1470, 740, 1.0],                   // bird's-eye pull-back over the whole isthmus
  [P8 + 1, 1470, 740, 1.0],
  [P8 + 12, 1510, 670, 1.7],
  [P9 + 1, 1515, 670, 2.2],
  [at("move2-9", "white T-shirt"), 1510, 680, 2.4],
  [P10, 1480, 640, 1.9],
  [P10 + 3.5, 1360, 545, 2.0],
  [at("move2-10", "B Company swept"), 1360, 560, 2.0],
  [P11 + 0.5, 1440, 700, 1.5],
  [P11 + 5, 1450, 870, 1.4],
  [P12, 1450, 870, 1.4],
  [END, 1460, 850, 1.55],
]);

// ---------- static map furniture ----------
L("BRENTON LOCH", 1150, 520, { cls: "sea", size: 22, instant: true });
L("DARWIN HARBOUR", 1668, 935, { cls: "sea", size: 20, instant: true });
B.city("DARWIN", ...DARWIN, { size: 14, r: 5, t: 0.8 });
B.city("GOOSE GREEN", ...GG, { size: 19, r: 6, t: 1.0 });
B.city("BOCA HOUSE", ...BOCA, { size: 12, r: 4, left: true, t: 1.2 });
L("DARWIN HILL", 1498, 752, { size: 14, t: 1.4 });
L("AIRFIELD", AIRF[0], AIRF[1] + 8, { size: 16, t: 1.6 });

// ---------- move2-1: pinned in the gully ----------
B.title("MOVE 2", "DARWIN HILL", "Morning · 28 May 1982", 0.3, 6.2);
B.showDate(0.5);
B.date("28 MAY 1982 · MORNING", 0.7, at("move2-9", "quarter past one") - 0.3, 30);
// red defensive line (the gorse line) from Boca House to Darwin Hill
const LINE = [[1318, 608], [1370, 628], [1420, 654], [1462, 680], [1500, 690], [1545, 684], [1592, 706]];
const redLine = B.front({ pts: LINE, color: "var(--rome)", width: 4, t: 2.0, dur: 2.2 });
L("GORSE LINE", 1395, 612, { size: 11, t: 3.6, until: P3 + 1 });
const gullyHi = B.highlight([[1530, 612], [1556, 626], [1580, 636]], at("move2-1", "gorse-filled gully"), P2, 16);
tl.to(gullyHi, { opacity: 0, duration: 0.6 }, P3);
L("GORSE GULLY", 1590, 652, { size: 10, t: at("move2-1", "gorse-filled gully"), until: P4 });
U({ id: "acoy", side: "carth", x: GULLY[0], y: GULLY[1], w: 30, h: 20, label: "A COY · ~100", fs: 8, t: at("move2-1", "A Company") });
RIDGE.forEach((p, i) => U({ id: "dr" + i, side: "rome", x: p[0], y: p[1], w: 20, h: 13, t: at("move2-1", "Argentine trenches") + i * 0.15 }));
const cones = RIDGE.map((p, i) => cone(p[0], p[1], [-60, -55, -65, -95, -115][i], 50, 85, at("move2-1", "Heavy machine guns") + i * 0.2, P5));
B.caption("EVERY YARD COVERED BY FIRE", at("move2-1", "covered every yard"), P2 - 0.2, "rome");

// ---------- move2-2: Estévez ----------
U({ id: "est", side: "rome", x: 1440, y: 880, w: 20, h: 13, label: "C COY 25th REGT", fs: 8, t: at("move2-2", "platoon led by") - 1.2 });
B.move("est", at("move2-2", "moved up in the dark"), 3.2, 1410, 668);
tl.to(B.units.est.el.querySelector(".tag"), { autoAlpha: 0, duration: 0.4 }, at("move2-2", "until he was killed"));
const estStake = stake({ side: "arg", img: "estevez_head.png", name: "2nd LT. ROBERTO ESTÉVEZ", role: "C COY · 25th REGIMENT", x: 1318, y: 915, size: 0.9, fs: 11, plqScale: 0.7, t: at("move2-2", "Second Lieutenant") - 0.4, until: P3 + 0.3 });
tl.to(estStake, { filter: "grayscale(1)", opacity: 0.7, duration: 1.2 }, at("move2-2", "until he was killed"));
U({ id: "guns", side: "rome", x: GUNS[0], y: GUNS[1], w: 26, h: 18, label: "ARG. GUNS", fs: 9, t: at("move2-2", "directing artillery") - 1.4 });
for (let i = 0; i < 7; i++) {
  const tx = GULLY[0] + [-18, 14, -4, 26, -26, 6, 18][i], ty = GULLY[1] + [-14, 10, -30, -6, 8, 18, -24][i];
  shell([GUNS[0] + 4, GUNS[1] - 8], [tx, ty], at("move2-2", "directing artillery") + i * 0.55, { h: 60 + (i % 3) * 25, side: i % 2 ? 1 : -1, dur: 1.3, r: 16 });
}
B.caption("HIS MEN HELD", at("move2-2", "His men held"), P3 + 0.2, "rome");
B.hideUnits(["guns"], P3 + 0.5);

// ---------- move2-3: B Company stopped at Boca House ----------
BOCAPOS.forEach((p, i) => U({ id: "bh" + i, side: "rome", x: p[0], y: p[1], w: 20, h: 13, t: at("move2-3", "Argentine positions") + i * 0.15 }));
BOCAPOS.forEach((p, i) => cone(p[0], p[1], [-50, -65, -55, -90][i], 50, 80, at("move2-3", "Argentine positions") + 0.4 + i * 0.15, P7));
U({ id: "bcoy", side: "carth", x: BCOY[0], y: BCOY[1], w: 30, h: 20, label: "B COY", fs: 9, t: at("move2-3", "B Company") });
B.caption("BOTH ATTACKS STOPPED", at("move2-3", "whole attack"), P4 - 0.2, "rome");

// ---------- move2-4: the defender's view ----------
const bub = B.bubble("THEY CANNOT CROSS THIS GROUND", 1330, 720, at("move2-4", "looked winnable") - 0.8, P5);
Object.assign(bub.style, { fontSize: "17px", padding: "8px 14px", borderWidth: "3px", borderRadius: "14px" });
B.stat(["NO NAVAL GUN", "ARTILLERY NEARLY OUT OF SHELLS", "JETS KEPT AWAY BY THE WEATHER"], at("move2-4", "The British had no"), at("move2-4", "The paratroopers could not") + 0.2, "rome");
flicker(["acoy", "bcoy"], at("move2-4", "The paratroopers could not"), 11);
B.caption("LOSING MEN EVERY HOUR", at("move2-4", "every hour"), P5 - 0.2, "carth");

// ---------- move2-5: Jones goes forward ----------
token("jones", "jones_head.png", "LT. COL. H JONES", TACHQ[0], TACHQ[1], 26, P5 + 0.6, 7);
L("TAC HQ", TACHQ[0] + 30, TACHQ[1] - 4, { size: 8, t: P5 + 0.8, until: P6, anchor: [0, -50] });
const tRun = at("move2-5", "ran forward");
B.move("jones", tRun, 3.2, GULLY[0] + 16, GULLY[1] - 22);
const fol = [[TACHQ[0] + 16, TACHQ[1] + 10], [TACHQ[0] - 14, TACHQ[1] + 8], [TACHQ[0] + 2, TACHQ[1] + 22]];
fol.forEach((p, i) => { U({ id: "f" + i, side: "carth", x: p[0], y: p[1], w: 12, h: 9, t: P5 + 1.0 + i * 0.1 }); B.move("f" + i, tRun + 0.4 + i * 0.2, 3.2, GULLY[0] + [30, 4, 18][i], GULLY[1] - [8, 10, 30][i]); });
const tCharge1 = at("move2-5", "up a small gully");
B.move("jones", tCharge1, 1.6, 1532, 650);
["f0", "f1", "f2"].forEach((k, i) => B.move(k, tCharge1 + 0.15 * i, 1.6, 1540 + i * 10, 656 - i * 4));
const a1 = B.arrow({ side: "carth", pts: [[1560, 636], [1545, 650], [1530, 668]], width: 5, t: tCharge1, dur: 1.2 });
B.greyArrow(a1, at("move2-5", "charge that failed"), P6);
B.grey(["f0", "f1"], at("move2-5", "his adjutant"), 0.8);
B.caption("ADJUTANT AND TWO OTHERS KILLED", at("move2-5", "his adjutant"), at("move2-5", "Then Jones") + 0.4, "carth");
B.move("jones", at("move2-5", "ran along the base"), 2.4, 1510, 640);
B.move("f2", at("move2-5", "ran along the base"), 2.0, 1545, 640);
ring(T1[0], T1[1], 12, at("move2-5", "charged up the slope") - 0.3, 5);
const tUp = at("move2-5", "charged up the slope");
B.move("jones", tUp, 3.6, JFALL[0] + 2, JFALL[1] - 14);
const a2 = B.arrow({ side: "carth", pts: [[1510, 646], [1498, 660], [T1[0] + 1, T1[1] - 12]], width: 4, dash: "7 5", t: tUp, dur: 1.2, until: P6 + 3 });

// ---------- move2-6: SUNRAY IS DOWN ----------
const tHit = at("move2-6", "second trench") - 0.6;
U({ id: "t2", side: "rome", x: T2[0], y: T2[1], w: 20, h: 13, t: tHit });
ring(T2[0], T2[1], 12, tHit + 0.2, 2);
[0, 0.35, 0.7].forEach((d) => B.arrow({ side: "rome", pts: [[T2[0] - 10, T2[1] - 4], [JFALL[0] + 8, JFALL[1] - 8]], width: 2.5, head: false, t: tHit + 0.8 + d, dur: 0.25, until: tHit + 2.2 }));
[0, 0.35].forEach((d) => B.arrow({ side: "rome", pts: [[T2[0] - 10, T2[1] - 4], [JFALL[0] + 8, JFALL[1] - 8]], width: 2.5, head: false, t: at("move2-6", "hit again") + d, dur: 0.2, until: at("move2-6", "hit again") + 1.3 }));
tl.to(B.units.jones.el.querySelector(".gg-token"), { rotation: 70, duration: 0.3, ease: "power2.in" }, at("move2-6", "fell"));
tl.to(B.units.jones.el.querySelector(".gg-token"), { rotation: 0, duration: 0.4 }, at("move2-6", "got up"));
tl.to(B.units.jones.el.querySelector(".gg-token"), { rotation: 160, y: 4, duration: 0.3, ease: "power2.in" }, at("move2-6", "hit again") + 0.2);
greyToken("jones", at("move2-6", "He died"));
const radio = screenBox(`<div class="inner"><div class="wave">${"<i></i>".repeat(18)}</div><div class="txt"><small>2 PARA RADIO NET · 28 MAY</small>"SUNRAY IS DOWN"</div></div>`, "gg-radio");
const tRadio = at("move2-6", "Over the radio");
tl.fromTo(radio, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.6 }, tRadio);
radio.querySelectorAll(".wave i").forEach((b, i) => tl.to(b, { scaleY: 0.3 + ((i * 7) % 11) / 12, duration: 0.18 + (i % 4) * 0.04, yoyo: true, repeat: 17, ease: "sine.inOut" }, tRadio + 0.3 + (i % 5) * 0.05));
tl.to(radio, { autoAlpha: 0, duration: 0.5 }, at("move2-6", "A British helicopter") + 0.4);
// the Scout sent to evacuate him is shot down by a Pucará
const HELI = `<g fill="#1f4fc4" stroke="#f7f3ea" stroke-width="3"><ellipse cx="40" cy="36" rx="22" ry="13"/><rect x="58" y="31" width="36" height="7" rx="3"/><rect x="88" y="22" width="6" height="18"/></g><line x1="4" y1="18" x2="78" y2="18" stroke="#1b1812" stroke-width="4"/><line x1="40" y1="18" x2="40" y2="24" stroke="#1b1812" stroke-width="4"/><line x1="28" y1="52" x2="56" y2="52" stroke="#1b1812" stroke-width="3"/>`;
const PLANE = `<g fill="#c4121f" stroke="#f7f3ea" stroke-width="3" stroke-linejoin="round"><path d="M50 4 L55 30 L96 46 L96 54 L55 50 L53 78 L66 88 L66 94 L50 90 L34 94 L34 88 L47 78 L45 50 L4 54 L4 46 L45 30 Z"/></g>`;
const tHeli = at("move2-6", "A British helicopter");
const heli = icon(HELI, 1660, 460, 64, 38, tHeli, null, "0 0 100 60");
moveEl(heli, tHeli + 0.3, 3.6, 1592, 560, 64, 38, "power1.out");
const plane = icon(PLANE, 1700, 700, 50, 50, at("move2-6", "Pucará") - 1.6, null);
gsap.set(plane, { rotation: -40 });
moveEl(plane, at("move2-6", "Pucará") - 1.4, 2.6, 1560, 520, 50, 50, "none");
tl.to(plane, { autoAlpha: 0, duration: 0.5 }, at("move2-6", "Pucará") + 1.4);
[0, 0.2, 0.4].forEach((d) => B.arrow({ side: "rome", pts: [[1640, 640], [1596, 566]], width: 2, head: false, t: at("move2-6", "shot down by") + 0.4 + d, dur: 0.2, until: at("move2-6", "shot down by") + 1.4 }));
burst(1592, 560, at("move2-6", "shot down by") + 0.9, 20);
tl.to(heli, { rotation: 120, y: 16, filter: "grayscale(1)", opacity: 0.55, duration: 1.2, ease: "power2.in" }, at("move2-6", "shot down by") + 0.9);
B.caption("SCOUT HELICOPTER SHOT DOWN · PILOT KILLED", at("move2-6", "shot down by"), ARCH0 + 0.2, "rome");
// ARCHIVE paragraph (ARCH0..ARCH1): map holds, only the slow camera drift above

// ---------- move2-7: command passes to Keeble ----------
tl.to(heli, { autoAlpha: 0, duration: 0.5 }, ARCH1 - 1);
B.hideUnits(["f2"], ARCH1 - 1);
const kStake = stake({ side: "uk", img: "keeble_head.png", name: "MAJ. CHRIS KEEBLE", role: "NOW COMMANDING 2 PARA", x: 1610, y: 500, size: 1.25, fs: 15, plqScale: 0.85, t: at("move2-7", "Major Chris Keeble") - 0.3, until: at("move2-8", "He let his company") });
B.caption("SUNRAY: MAJOR CHRIS KEEBLE", at("move2-7", "Major Chris Keeble"), P8 - 0.1, "carth");

// ---------- move2-8: key insight ----------
insight(["TRENCHES WERE BUILT TO STOP BULLETS", "NOT MISSILES · NOT MASSED MORTARS"], at("move2-8", "Keeble saw") + 0.2, at("move2-8", "What cracked") + 0.6);
U({ id: "mort", side: "carth", x: MORT[0], y: MORT[1], w: 26, h: 18, label: "MORTARS", fs: 9, t: at("move2-8", "concentrated firepower") - 1 });
for (let i = 0; i < 6; i++) shell([MORT[0], MORT[1] + 6], [RIDGE[i % 5][0] + [-10, 8, 0, -6, 12, 4][i], RIDGE[i % 5][1] + [6, -8, 10, 4, -6, 0][i]], at("move2-8", "concentrated firepower") + 0.4 + i * 0.45, { h: 45, side: i % 2 ? 1 : -1, dur: 1.1 });
B.caption("COMPANY COMMANDERS RUN THEIR OWN FIGHTS", at("move2-8", "He let his company"), at("move2-8", "put his effort") + 0.3, "carth");
B.caption("HEAVY WEAPONS TO THE POINTS THAT MATTER", at("move2-8", "put his effort") + 0.4, P9 - 0.2, "carth");

// ---------- move2-9: Darwin Hill taken, 13:13 ----------
const tBar = P9 + 0.5;
for (let i = 0; i < 16; i++) {
  const tgt = RIDGE[(i * 3) % 5];
  shell([MORT[0] + (i % 3) * 6, MORT[1] + 6], [tgt[0] + ((i * 13) % 21) - 10, tgt[1] + ((i * 7) % 15) - 7], tBar + i * 0.62, { h: 30 + (i % 3) * 12, side: i % 2 ? 1 : -1, dur: 1.1, r: 12 });
}
B.caption("MORE THAN 1,000 MORTAR BOMBS", at("move2-9", "more than a thousand"), at("move2-9", "A Company worked") + 0.5, "carth");
const tWork = at("move2-9", "one trench at a time");
const order = [4, 3, 2, 1, 0];                 // east to west up the ridge
const route = [[1590, 690], [1564, 682], [1520, 672], [1466, 682], [1436, 664]];
B.move("acoy", tWork - 0.8, 1.2, 1580, 660);
order.forEach((ri, k) => {
  const t0 = tWork + k * 1.7;
  B.move("acoy", t0, 1.2, route[k][0] + 4, route[k][1] - 30);
  burst(RIDGE[ri][0], RIDGE[ri][1], t0 + 0.9, 13);
  B.grey(["dr" + ri], t0 + 1.0, 0.6);
  tl.to(cones[ri], { autoAlpha: 0, duration: 0.4 }, t0 + 1.0);
});
B.grey(["t2"], tWork + 3.0, 0.6);
B.grey(["est"], tWork + 8.0, 0.6);
B.caption("66 MM ROCKETS (LAW) · GRENADES", at("move2-9", "sixty-six millimetre"), at("move2-9", "With their officers") + 0.4, "carth");
const FLAG = `<line x1="20" y1="100" x2="20" y2="0" stroke="#3a2a18" stroke-width="7"/><path d="M22 4 Q48 -2 70 8 Q88 16 96 10 L96 44 Q82 52 66 42 Q46 32 22 40 Z" fill="#fbfaf6" stroke="#1b1812" stroke-width="3"/>`;
icon(FLAG, 1534, 716, 26, 26, at("move2-9", "white T-shirt"), P11 + 2);
clock("28 MAY · 13:13", at("move2-9", "quarter past one"), at("move2-10", "Boca Hill fell") - 0.3);
B.caption("13:13 · DARWIN HILL TAKEN", at("move2-9", "reported Darwin Hill") - 0.3, P10 - 0.1, "carth");

// ---------- move2-10: MILAN at Boca House, 13:47 ----------
U({ id: "supp", side: "carth", x: SUPP[0], y: SUPP[1], w: 30, h: 20, label: "SUPPORT COY · MILAN", fs: 8, t: at("move2-10", "MILAN teams") - 0.6 });
B.caption("MILAN: A WIRE-GUIDED ANTI-TANK MISSILE", at("move2-10", "MILAN was"), at("move2-10", "There were no tanks") + 0.1, "carth");
B.caption("NO TANKS AT BOCA HOUSE", at("move2-10", "There were no tanks") + 0.2, at("move2-10", "But from long range") + 0.6, "rome");
const tMil = at("move2-10", "guided their missiles");
[0, 1, 2, 3].forEach((i) => {
  const tt = tMil - 1.2 + i * 1.45;
  missile([SUPP[0] - 6 + i * 4, SUPP[1] + 10], BOCAPOS[[3, 0, 1, 2][i]], tt, 1.2);
  B.grey(["bh" + [3, 0, 1, 2][i]], tt + 1.2, 0.6);
});
L("~1,000 M", 1372, 510, { size: 10, t: at("move2-10", "from long range"), until: P11, anchor: [0, -50] });
B.caption("POSITION AFTER POSITION SILENT", at("move2-10", "Position after position"), at("move2-10", "B Company swept") + 0.3, "carth");
const tSweep = at("move2-10", "B Company swept");
B.arrow({ side: "carth", pts: [[BCOY[0] - 4, BCOY[1] + 14], [1360, 590], [1336, 640]], width: 7, t: tSweep, dur: 1.6, until: P11 + 2 });
B.move("bcoy", tSweep + 0.3, 2.2, 1352, 660);
L("BOCA HILL", 1265, 690, { size: 11, t: tSweep + 0.8, until: END - 2 });
clock("28 MAY · 13:47", at("move2-10", "Boca Hill fell"), END - 0.5);
B.caption("13:47 · BOCA HILL FALLS", at("move2-10", "Boca Hill fell"), P11 - 0.1, "carth");

// ---------- move2-11: the line broken end to end ----------
const tBreak = at("move2-11", "broken from end to end") - 1.2;
B.front({ pts: LINE.slice().reverse(), color: "#8a877f", width: 5, t: tBreak, dur: 2.2 });
tl.to(redLine, { autoAlpha: 0, duration: 0.3 }, tBreak + 2.3);

B.caption("THE MAIN LINE IS BROKEN", tBreak + 0.6, P12 - 0.3, "carth");
const tSouth = at("move2-11", "The way south");
[[[1530, 715], [1500, 800], [1450, 900]], [[1352, 680], [1360, 780], [1372, 890]]].forEach((pts, i) =>
  B.arrow({ side: "carth", pts, width: 10, t: tSouth + i * 0.3, dur: 1.8, until: END - 0.3 }));
B.hideUnits(["mort"], P11 + 1);

// ---------- move2-12: the method ----------
B.dim(P12 - 0.2, END, 0.6);
method(2, 1, P12 + 0.3, at("move2-12", "Match the weapon"), null);
B.finish();
