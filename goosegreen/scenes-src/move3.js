// MOVE 3: the Goose Green bluff, 28-29 May 1982 (move3-1 .. move3-10, incl. one ARCHIVE paragraph after move3-9).
// Sides: British (2 PARA) = blue = engine side "carth"; Argentine = red = engine side "rome".
// Basemap: assets/darwin.jpg (z14). G(lat, lon) -> map px. Places verified against OSM / Wikipedia:
//   Goose Green -51.8277,-58.9728 · Darwin -51.8069,-58.9587 · Goose Green airfield -51.8196,-58.9802
//   Schoolhouse, dairy and community hall placed from period maps (Middlebrook / Fitz-Gibbon), approximate.
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
  const flag = arg ? "arg_flag.png" : "uk_flag.png";
  if (HAVE[flag]) el.querySelector(".board").insertAdjacentHTML("afterbegin", `<img src="assets/media/${flag}" alt="" style="float:right;width:54px;height:32px;margin:2px 0 4px 10px;box-shadow:0 2px 4px rgba(0,0,0,0.4)">`);
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

// ---------- move3-only styles ----------
const st3 = document.createElement("style");
st3.textContent = `
.gg-night { position:absolute; inset:0; background: radial-gradient(ellipse 80% 70% at 50% 45%, rgba(12,20,48,0.32), rgba(6,10,26,0.6)); }
.gg-dawn { position:absolute; inset:0; background: linear-gradient(180deg, rgba(255,160,80,0.42) 0%, rgba(255,200,140,0.18) 45%, rgba(255,210,160,0) 80%); mix-blend-mode: screen; }
.gg-note { position:absolute; left:0; right:0; top: 170px; display:flex; justify-content:center; }
.gg-note .paper { width: 1040px; padding: 34px 56px 38px; background: linear-gradient(180deg, #f3ead2, #e6d8b4); color:#231d14; font-family: "Special Elite", monospace;
  box-shadow: 0 22px 44px rgba(0,0,0,0.55); border: 2px solid #b39c6c; rotate: -1.2deg; }
.gg-note .hd { font-size: 26px; letter-spacing: 0.3em; color: #6b5a3a; margin-bottom: 16px; }
.gg-note .ln { font-size: 40px; line-height: 1.4; }
.gg-note .ln.sm { font-size: 30px; color: #3b3222; margin-top: 12px; }
.gg-note .ln b { color: #a3141d; font-weight: 400; }
.gg-count { position:absolute; right: 90px; top: 80px; padding: 16px 34px 18px; background: rgba(18,16,12,0.9); border-top: 6px solid #e3232f; text-align:center; color:#f7f3ea; box-shadow: 0 14px 30px rgba(0,0,0,0.5); }
.gg-count .n { font-size: 110px; font-weight: 700; line-height: 1; letter-spacing: 0.02em; }
.gg-count .l { font-size: 32px; font-weight: 700; letter-spacing: 0.3em; color: #e8a39c; }
.gg-chip { position:absolute; white-space:nowrap; font-weight:700; letter-spacing:0.05em; color:#1b1812; background:#f7f3ea; border:2px solid #1f4fc4; border-radius: 3px; padding: 0 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.4); }
.gg-hall { position:absolute; border: 3px solid #ffd54a; background: rgba(255,213,74,0.25); box-shadow: 0 0 10px rgba(255,213,74,0.9); }
`;
document.head.appendChild(st3);
const FX = document.getElementById("fx");
const fxLayer = (cls) => { const el = document.createElement("div"); el.className = cls; FX.appendChild(el); gsap.set(el, { autoAlpha: 0 }); return el; };
const chip = (text, x, y, t, until, fs = 9) => {
  const el = document.createElement("div"); el.className = "gg-chip"; el.textContent = text;
  Object.assign(el.style, { left: x + "px", top: y + "px", fontSize: fs + "px" });
  PINS.appendChild(el); gsap.set(el, { autoAlpha: 0, xPercent: -50, yPercent: -50 });
  tl.fromTo(el, { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, t);
  if (until != null) tl.to(el, { autoAlpha: 0, duration: 0.4 }, until);
  return el;
};

// ---------- places (map px) ----------
const GG = G(-51.82768, -58.97281), DARWIN = G(-51.80703, -58.95878), AIRF = G(-51.81962, -58.98017);
const SCHOOL = [1497, 978];        // schoolhouse, at the head of the inlet north of the settlement
const DAIRY = [1432, 1022];        // dairy, between the airfield and the settlement
const HALL = [GG[0] + 22, GG[1] + 24]; // community hall, in the settlement beside the green
const LZ = [1318, 1262];           // helicopter landing area south-west of the settlement (Combat Team Solari)
const AA = [[1420, 1064], [1488, 1052]]; // Argentine anti-aircraft guns firing flat along the ground

// ---------- camera ----------
const P1 = P("move3-1"), P2 = P("move3-2"), P3 = P("move3-3"), P4 = P("move3-4"), P5 = P("move3-5"), P6 = P("move3-6");
const P7 = P("move3-7"), P8 = P("move3-8"), P9 = P("move3-9"), P10 = P("move3-10");
const ARCH0 = B.end("move3-9"), ARCH1 = P10;
B.camera([
  [0, 1450, 900, 1.2],
  [6.5, 1440, 960, 1.45],
  [at("move3-1", "The fighting was") , 1440, 990, 1.9],
  [P2, 1440, 1000, 1.9],
  [P2 + 3, 1420, 1060, 1.55],
  [P3 + 1, 1420, 1060, 1.55],
  [P3 + 4, 1440, 1010, 1.65],
  [P4 + 0.5, 1450, 1060, 1.9],
  [P4 + 4, 1478, 1105, 3.2],
  [B.end("move3-4"), 1478, 1105, 3.3],
  [P5 + 3, 1450, 1060, 1.35],
  [P6, 1450, 1050, 1.35],
  [P7, 1450, 1000, 1.25],
  [P7 + 3, 1440, 820, 1.0],
  [at("move3-7", "Then, soon after midnight"), 1440, 880, 1.2],
  [at("move3-7", "They were simple"), 1470, 1020, 1.9],
  [P8, 1470, 1020, 1.9],
  [P8 + 3, 1450, 820, 1.1],
  [P9, 1450, 900, 1.3],
  [at("move3-9", "column after column") - 2, 1420, 1010, 2.0],
  [ARCH0, 1420, 1010, 2.1],
  [ARCH1, 1430, 1000, 1.9],                        // archive covers this: slow calm drift
  [END, 1440, 980, 1.7],
]);

// ---------- static map furniture ----------
L("BRENTON LOCH", 1150, 520, { cls: "sea", size: 22, instant: true });
L("DARWIN HARBOUR", 1668, 935, { cls: "sea", size: 20, instant: true });
L("CHOISEUL SOUND", 1700, 1330, { cls: "sea", size: 20, instant: true });
B.city("DARWIN", ...DARWIN, { size: 16, r: 5, t: 0.6 });
B.city("GOOSE GREEN", ...GG, { size: 16, r: 5, t: 0.9 });
L("DARWIN HILL", 1498, 752, { size: 13, t: 0.8 });
// grass airstrip
const strip = document.createElementNS(NS, "g");
strip.innerHTML = `<line x1="1336" y1="930" x2="1424" y2="978" stroke="rgba(90,110,60,0.55)" stroke-width="16" stroke-linecap="round"/><line x1="1336" y1="930" x2="1424" y2="978" stroke="rgba(247,243,234,0.8)" stroke-width="1.5" stroke-dasharray="6 5"/>`;
OV.appendChild(strip); gsap.set(strip, { autoAlpha: 0 }); tl.to(strip, { autoAlpha: 1, duration: 0.8 }, 1.2);
L("AIRFIELD", 1325, 902, { size: 13, t: 1.3 });
B.city("SCHOOLHOUSE", ...SCHOOL, { size: 10, r: 3.5, t: at("move3-1", "the schoolhouse") - 1 });
B.city("DAIRY", ...DAIRY, { size: 10, r: 3.5, left: true, t: 1.8, until: P9 + 1 });

// ---------- move3-1: afternoon, airfield and schoolhouse ----------
B.title("MOVE 3", "GOOSE GREEN", "28 – 29 May 1982", 0.3, 6.2);
B.showDate(0.5);
B.date("28 MAY · AFTERNOON", 0.7, P2 + 1, 32);
const tPush = at("move3-1", "C and D Companies");
U({ id: "dcoy", side: "carth", x: 1340, y: 800, w: 28, h: 19, label: "D COY", fs: 9, t: tPush - 0.6 });
U({ id: "ccoy", side: "carth", x: 1500, y: 800, w: 28, h: 19, label: "C COY", fs: 9, t: tPush - 0.4 });
U({ id: "acoy", side: "carth", x: 1515, y: 715, w: 24, h: 16, label: "A COY", fs: 8, t: tPush - 0.2 });
B.move("dcoy", tPush + 0.4, 4.0, 1332, 900);
B.move("ccoy", tPush + 0.6, 4.0, 1482, 920);
B.arrow({ side: "carth", pts: [[1345, 770], [1335, 840], [1330, 890]], width: 7, t: tPush + 0.2, dur: 2.2, until: P2 + 2 });
B.arrow({ side: "carth", pts: [[1510, 770], [1495, 850], [1486, 905]], width: 7, t: tPush + 0.4, dur: 2.2, until: P2 + 2 });
U({ id: "gar", side: "rome", x: GG[0] - 36, y: GG[1] + 6, w: 30, h: 20, label: "GARRISON", fs: 9, t: 2.0 });
AA.forEach((p, i) => U({ id: "aa" + i, side: "rome", x: p[0], y: p[1], w: 20, h: 13, label: "AA GUNS", fs: 7, t: at("move3-1", "Anti-aircraft") - 0.6 + i * 0.2 }));
const tAA = at("move3-1", "fired flat");
for (let k = 0; k < 3; k++) {
  B.arrow({ side: "rome", pts: [[AA[0][0] - 6, AA[0][1] - 10], [1350 + k * 8, 915]], width: 2.5, head: false, t: tAA + k * 0.6, dur: 0.35, until: tAA + k * 0.6 + 1.0 });
  B.arrow({ side: "rome", pts: [[AA[1][0], AA[1][1] - 10], [1480 + k * 6, 935]], width: 2.5, head: false, t: tAA + 0.3 + k * 0.6, dur: 0.35, until: tAA + 0.3 + k * 0.6 + 1.0 });
}
// the schoolhouse burns
const FIRE = `<g><path d="M50 96 C20 96 14 70 26 52 C30 64 38 66 40 58 C36 40 46 22 58 6 C60 26 76 34 78 54 C84 48 84 40 82 34 C94 50 92 96 50 96 Z" fill="#e8491d" stroke="#fff3c4" stroke-width="4"/><path d="M50 92 C36 92 32 78 40 68 C44 74 50 72 50 64 C58 72 66 78 60 92 Z" fill="#ffd54a"/></g>`;
const fire = icon(FIRE, SCHOOL[0] + 2, SCHOOL[1] - 10, 22, 22, at("move3-1", "burned") - 0.4, P2 + 6);
tl.to(fire, { scale: 1.15, duration: 0.35, yoyo: true, repeat: 17, ease: "sine.inOut" }, at("move3-1", "burned") + 0.2);
// jets and Pucarás attack; two shot down
const PLANE = `<g fill="#c4121f" stroke="#f7f3ea" stroke-width="3" stroke-linejoin="round"><path d="M50 4 L55 30 L96 46 L96 54 L55 50 L53 78 L66 88 L66 94 L50 90 L34 94 L34 88 L47 78 L45 50 L4 54 L4 46 L45 30 Z"/></g>`;
const tJets = at("move3-1", "Argentine jets");
[[1180, 1150, 1600, 760, 40], [1640, 1180, 1250, 800, -40]].forEach(([x0, y0, x1, y1, rot], i) => {
  const pl = icon(PLANE, x0, y0, 40, 40, tJets + i * 0.8, null);
  gsap.set(pl, { rotation: rot + (i ? -90 : 90) - 45 });
  moveEl(pl, tJets + i * 0.8, 4.2, x1, y1, 40, 40, "none");
  const hitT = at("move3-1", "Two of the aircraft") + 0.4 + i * 0.7;
  burst(x0 + (x1 - x0) * 0.75, y0 + (y1 - y0) * 0.75, hitT, 22);
  tl.to(pl, { autoAlpha: 0, duration: 0.3 }, hitT + 0.1);
});
B.caption("TWO ARGENTINE AIRCRAFT SHOT DOWN", at("move3-1", "Two of the aircraft"), P2 - 0.2, "carth");

// ---------- move3-2: nightfall, reinforcements by helicopter ----------
const night = fxLayer("gg-night");
tl.to(night, { autoAlpha: 1, duration: 3 }, at("move3-2", "By nightfall") - 0.5);
B.date("28 MAY · NIGHTFALL", P2 + 1.3, at("move3-7", "soon after midnight"), 32);
U({ id: "bcoy", side: "carth", x: 1300, y: 1060, w: 28, h: 19, label: "B COY", fs: 9, t: P2 + 0.6 });
B.move("dcoy", P2 + 0.8, 2.0, 1350, 948);
B.move("ccoy", P2 + 0.8, 2.0, 1470, 955);
B.caption("GOOSE GREEN SURROUNDED · NOT TAKEN", at("move3-2", "surrounded"), at("move3-2", "And just after dark") + 0.2, "carth");
const HELI = `<g fill="#c4121f" stroke="#f7f3ea" stroke-width="3"><ellipse cx="40" cy="36" rx="22" ry="13"/><rect x="58" y="31" width="36" height="7" rx="3"/><rect x="88" y="22" width="6" height="18"/></g><line x1="4" y1="18" x2="78" y2="18" stroke="#1b1812" stroke-width="4"/><line x1="40" y1="18" x2="40" y2="24" stroke="#1b1812" stroke-width="4"/><line x1="28" y1="52" x2="56" y2="52" stroke="#1b1812" stroke-width="3"/>`;
const tHeli = at("move3-2", "Argentine helicopters");
[0, 1, 2].forEach((i) => {
  const h = icon(HELI, 1720 + i * 30, 1420 + i * 25, 46, 28, tHeli - 0.6 + i * 0.3, tHeli + 5.5, "0 0 100 60");
  gsap.set(h, { scaleX: -1 });
  moveEl(h, tHeli - 0.6 + i * 0.3, 3.4, LZ[0] + i * 26 - 20, LZ[1] - i * 16, 46, 28, "power2.out");
});
U({ id: "solari", side: "rome", x: LZ[0], y: LZ[1] + 20, w: 28, h: 19, label: "COMBAT TEAM SOLARI", fs: 8, t: tHeli + 3.0 });
B.move("solari", at("move3-2", "Inside the settlement"), 3.0, 1368, 1122);
tl.to(B.units.solari.el.querySelector(".tag"), { autoAlpha: 0, duration: 0.4 }, at("move3-2", "Inside the settlement") + 2.6);
B.caption("GARRISON: STILL ~1,000 STRONG", at("move3-2", "the garrison"), P3 - 0.2, "rome");

// ---------- move3-3: 2 PARA's state ----------
const tState = at("move3-3", "They were soaked");
chip("15+ HOURS FIGHTING", 1420, 905, at("move3-3", "fifteen hours"), P4, 9);
chip("NO WATER", 1530, 952, at("move3-3", "There was no water"), P4, 9);
chip("1 RATION PER 2 MEN", 1282, 948, at("move3-3", "one ration pack") - 0.3, P4, 9);
chip("LOW AMMUNITION", 1240, 1060, at("move3-3", "ammunition was running low") - 0.3, P4, 9);
const THERMO = `<rect x="40" y="6" width="20" height="66" rx="10" fill="#f7f3ea" stroke="#1b1812" stroke-width="4"/><circle cx="50" cy="80" r="16" fill="#2f7fd8" stroke="#1b1812" stroke-width="4"/><rect x="46" y="44" width="8" height="34" fill="#2f7fd8"/>`;
icon(THERMO, 1570, 895, 30, 30, tState, P4);
L("FREEZING", 1570, 921, { size: 10, cls: "tg", t: tState + 0.3, until: P4 });
B.caption("SOME COMPANIES OUT OF CONTACT", at("move3-3", "Some companies"), at("move3-3", "Keeble fully expected") + 0.3, "carth");
B.caption("KEEBLE EXPECTS A COUNTER-ATTACK AT DAWN", at("move3-3", "Keeble fully expected") + 0.4, P4 - 0.2, "carth");

// ---------- move3-4: 114 civilians in the community hall ----------
const hall = document.createElement("div"); hall.className = "gg-hall";
Object.assign(hall.style, { left: HALL[0] - 12 + "px", top: HALL[1] - 8 + "px", width: "24px", height: "16px", borderWidth: "2px" });
PINS.appendChild(hall); gsap.set(hall, { autoAlpha: 0 });
tl.to(hall, { autoAlpha: 1, duration: 0.5 }, at("move3-4", "community hall") - 0.5);
tl.to(hall, { boxShadow: "0 0 22px rgba(255,213,74,1)", duration: 0.6, yoyo: true, repeat: 9 }, at("move3-4", "community hall"));
tl.to(hall, { autoAlpha: 0.5, duration: 0.6 }, P5 + 1);
tl.to(hall, { autoAlpha: 0, duration: 0.6 }, P7);
L("COMMUNITY HALL", HALL[0] + 16, HALL[1] + 1, { size: 8, t: at("move3-4", "community hall"), until: P5 + 1, anchor: [0, -50] });
B.caption("114 CIVILIANS LOCKED INSIDE", at("move3-4", "one hundred and fourteen"), P5 - 0.2, "rome");
B.caption("AN ASSAULT MIGHT KILL THEM", at("move3-4", "A full assault") , P5 - 0.2, "carth");

// ---------- move3-5: what Piaggi imagined ----------
const pStake = stake({ side: "arg", img: "piaggi_head.png", name: "LT. COL. ÍTALO PIAGGI", role: "TASK FORCE MERCEDES", x: 1575, y: 1290, size: 0.95, fs: 11, plqScale: 0.75, t: P5 + 0.8, until: P6 + 1 });
const ghosts = [[1280, 860], [1440, 830], [1590, 900], [1215, 1000], [1330, 1268], [1665, 1000]];
const tImag = at("move3-5", "He believed");
ghosts.forEach((p, i) => {
  const el = U({ id: "g" + i, side: "carth", x: p[0], y: p[1], w: 70, h: 46, label: "?", fs: 14, alpha: 0.5, t: tImag + i * 0.25 });
  Object.assign(el.querySelector(".blk").style, { borderStyle: "dashed", borderWidth: "3px" });
});
B.hideUnits(ghosts.map((_, i) => "g" + i), P6 + 1, 0.8);
const bub = B.bubble("A BRIGADE IS OUTSIDE", 1215, 1172, tImag - 0.4, P6 + 0.5);
Object.assign(bub.style, { fontSize: "19px", padding: "8px 14px", borderWidth: "3px", borderRadius: "14px" });
const HARR = `<g fill="#1f4fc4" stroke="#f7f3ea" stroke-width="3" stroke-linejoin="round"><path d="M50 2 L56 34 L92 52 L92 60 L56 56 L54 80 L68 90 L68 96 L50 92 L32 96 L32 90 L46 80 L44 56 L8 60 L8 52 L44 34 Z"/></g>`;
const tHar = at("move3-5", "Harrier jets");
[0, 1].forEach((i) => {
  const h = icon(HARR, 1200, 700 + i * 60, 44, 44, tHar - 0.8 + i * 0.4, null);
  gsap.set(h, { rotation: 125 });
  moveEl(h, tHar - 0.8 + i * 0.4, 3.0, 1700, 1300 + i * 40, 44, 44, "none");
  tl.to(h, { autoAlpha: 0, duration: 0.3 }, tHar + 2.4 + i * 0.4);
  burst(1440 + i * 30, 1060 + i * 20, tHar + 0.5 + i * 0.4, 20);
});
B.caption("HARRIER STRIKES THAT AFTERNOON", tHar, at("move3-5", "He believed") - 0.2, "carth");
B.caption("NO RESCUE HE COULD COUNT ON", at("move3-5", "no rescue"), P6 - 0.2, "rome");

// ---------- move3-6: Keeble's insight ----------
const kStake = stake({ side: "uk", img: "keeble_head.png", name: "MAJ. CHRIS KEEBLE", role: "COMMANDING 2 PARA", x: 1690, y: 1200, size: 1.0, fs: 12, plqScale: 0.75, t: P6 + 0.3, until: P7 + 1 });
insight(["HE CANNOT SEE MY EMPTY POUCHES"], at("move3-6", "It was the other man's mind") - 0.3, at("move3-6", "If Keeble") + 0.3);
B.caption("MAKE HIM BELIEVE TOMORROW WILL BE WORSE", at("move3-6", "If Keeble") + 0.4, P7 - 0.2, "carth");

// ---------- move3-7: talk before attacking ----------
const tRadio = at("move3-7", "civilian radio") - 0.8;
B.line([[1452, 380], [1470, 640], [GG[0], GG[1] - 10]], { dash: "10 8", width: 4, color: "#ffd54a", t: tRadio, dur: 2.2, until: at("move3-7", "Then, soon after midnight") + 0.5 });
L("▲ FROM SAN CARLOS", 1482, 440, { size: 17, cls: "tg", anchor: [0, -50], t: tRadio, until: at("move3-7", "Then, soon after midnight") + 0.5 });
chip("CB RADIO · ERIC GOSS, FARM MANAGER", 1660, 1150, at("move3-7", "farm manager") - 0.6, at("move3-7", "Then, soon after midnight") + 0.5, 13);
B.date("29 MAY · AFTER MIDNIGHT", at("move3-7", "soon after midnight"), P9 + 0.5, 30);
const POW = `<circle cx="50" cy="18" r="13" fill="#c4121f" stroke="#f7f3ea" stroke-width="4"/><path d="M28 96 L34 44 Q50 34 66 44 L72 96 Z" fill="#c4121f" stroke="#f7f3ea" stroke-width="4"/>`;
const WFLAG = `<line x1="20" y1="100" x2="20" y2="0" stroke="#3a2a18" stroke-width="7"/><path d="M22 4 Q48 -2 70 8 Q88 16 96 10 L96 44 Q82 52 66 42 Q46 32 22 40 Z" fill="#fbfaf6" stroke="#1b1812" stroke-width="3"/>`;
const tPow = at("move3-7", "two captured Argentine");
const pows = [0, 1].map((i) => icon(POW, 1462 + i * 20, 950, 22, 28, tPow - 0.8, at("move3-7", "They were simple") + 3));
const pflag = icon(WFLAG, 1492, 930, 26, 26, tPow - 0.6, at("move3-7", "They were simple") + 3);
pows.forEach((el, i) => moveEl(el, tPow, 5.0, GG[0] - 8 + i * 20, GG[1] - 36, 22, 28, "none"));
moveEl(pflag, tPow, 5.0, GG[0] + 22, GG[1] - 52, 26, 26, "none");
chip("2 ARGENTINE POWs CARRY THE TERMS", 1610, 1040, tPow + 0.4, at("move3-7", "They were simple") + 0.6, 10);
const note = screenBox(`<div class="paper"><div class="hd">KEEBLE'S TERMS · 29 MAY 1982 (PARAPHRASED)</div>
  <div class="ln">1. SURRENDER. <b>MARCH OUT WITHOUT WEAPONS.</b></div>
  <div class="ln">2. OR REFUSE, AND FACE THE CONSEQUENCES.</div>
  <div class="ln sm">· The Argentine commander is held responsible for the civilians.</div>
  <div class="ln sm">· The British intend to bombard Darwin and Goose Green.</div></div>`, "gg-note");
const tNote = at("move3-7", "They were simple") - 0.3;
tl.fromTo(note, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, tNote);
note.querySelectorAll(".ln").forEach((r, i) => tl.fromTo(r, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, [tNote + 0.4, at("move3-7", "Or refuse"), at("move3-7", "The note warned") + 0.3, at("move3-7", "bombard Darwin") - 0.6][i]));
tl.to(note, { autoAlpha: 0, duration: 0.5 }, P8 - 0.2);

// ---------- move3-8: not a pure bluff ----------
const tFly = at("move3-8", "Through the night");
const HELIB = HELI.replace('fill="#c4121f"', 'fill="#1f4fc4"');
[0, 1, 2].forEach((i) => {
  const h = icon(HELIB, 1400 + i * 70, 280, 50, 30, tFly - 0.6 + i * 0.35, tFly + 4.4, "0 0 100 60");
  moveEl(h, tFly - 0.6 + i * 0.35, 3.4, 1440 + i * 60, 560 + i * 20, 50, 30, "power2.out");
});
U({ id: "jcoy", side: "carth", x: 1450, y: 590, w: 30, h: 20, label: "J COY 42 COMMANDO", fs: 9, t: tFly + 2.6 });
U({ id: "guns2", side: "carth", x: 1540, y: 610, w: 24, h: 16, label: "MORE GUNS", fs: 8, t: tFly + 3.0 });
U({ id: "mort2", side: "carth", x: 1600, y: 640, w: 24, h: 16, label: "MORE MORTARS", fs: 8, t: tFly + 3.3 });
const tPlan = at("move3-8", "a plan to pound");
const tgt = document.createElementNS(NS, "g");
tgt.innerHTML = `<circle cx="${GG[0]}" cy="${GG[1]}" r="70" fill="rgba(196,18,31,0.12)" stroke="#c4121f" stroke-width="4" stroke-dasharray="12 8"/><line x1="${GG[0] - 90}" y1="${GG[1]}" x2="${GG[0] + 90}" y2="${GG[1]}" stroke="#c4121f" stroke-width="3"/><line x1="${GG[0]}" y1="${GG[1] - 90}" x2="${GG[0]}" y2="${GG[1] + 90}" stroke="#c4121f" stroke-width="3"/>`;
OV.appendChild(tgt); gsap.set(tgt, { autoAlpha: 0, svgOrigin: `${GG[0]} ${GG[1]}`, scale: 1.6 });
tl.to(tgt, { autoAlpha: 1, scale: 1, duration: 0.8, ease: "power2.out" }, tPlan);
tl.to(tgt, { rotation: 45, duration: 6, ease: "none" }, tPlan);
tl.to(tgt, { autoAlpha: 0, duration: 0.6 }, P9 + 0.5);
B.caption("PLAN B: FLATTEN GOOSE GREEN", tPlan + 0.4, at("move3-8", "But his men") + 0.2, "carth");
B.caption("EVERYTHING DEPENDS ON WHAT PIAGGI BELIEVES", at("move3-8", "Everything depended") - 0.3, P9 - 0.2, "carth");
B.hideUnits(["guns2", "mort2"], P9 + 1);

// ---------- move3-9: dawn surrender, 961 prisoners ----------
const dawn = fxLayer("gg-dawn");
const tDawn = at("move3-9", "On the morning");
tl.to(night, { autoAlpha: 0, duration: 3.5 }, tDawn - 0.5);
tl.to(dawn, { autoAlpha: 1, duration: 2.5 }, tDawn);
tl.to(dawn, { autoAlpha: 0, duration: 3 }, tDawn + 7);
B.date("29 MAY 1982 · DAWN", P9 + 0.6, END - 0.4, 30);
B.caption("ARGENTINE ARMY DAY · THE GARRISON SURRENDERS", at("move3-9", "the Argentine National Army Day") - 0.4, at("move3-9", "The paratroopers watched") + 0.4, "rome");
B.caption("EXPECTED: A FEW HUNDRED", at("move3-9", "They had expected"), at("move3-9", "column after column") - 0.2, "carth");
B.hideUnits(["gar", "solari", "aa0", "aa1"], at("move3-9", "column after column") - 1.2);
B.move("dcoy", P9 + 1, 2.0, 1288, 962);
const tCol = at("move3-9", "column after column") - 1.0;
const cols = 3, per = 7;
for (let c = 0; c < cols; c++) for (let k = 0; k < per; k++) {
  const id = `p${c}_${k}`, t0 = tCol + c * 0.9 + k * 0.28;
  const x0 = GG[0] - 20 - c * 12, y0 = GG[1] - 30 - c * 6;
  const x1 = 1346 - c * 8.6 + k * 11.4, y1 = 948 + c * 15.8 + k * 6.2;
  U({ id, side: "rome", x: x0, y: y0, w: 13, h: 9, bw: 1.5, t: t0 });
  B.move(id, t0 + 0.2, 3.2, x1, y1, "power1.out");
  B.grey([id], t0 + 2.4, 0.8);
}
const PILE = `<g stroke="#1b1812" stroke-width="3"><rect x="8" y="58" width="84" height="12" rx="3" fill="#6d5a3c" transform="rotate(-14 50 64)"/><rect x="8" y="58" width="84" height="12" rx="3" fill="#7c6848" transform="rotate(12 50 64)"/><rect x="10" y="70" width="80" height="12" rx="3" fill="#5c4a30"/></g>`;
icon(PILE, 1445, 1030, 36, 36, at("move3-9", "laid down their weapons") - 0.6, END - 0.4);
L("WEAPONS LAID DOWN", 1445, 1054, { size: 10, cls: "tg", t: at("move3-9", "laid down their weapons"), until: END - 0.4 });
const cnt = screenBox(`<div class="n">0</div><div class="l">PRISONERS</div>`, "gg-count");
const tCnt = at("move3-9", "column after column");
tl.fromTo(cnt, { autoAlpha: 0, y: -20 }, { autoAlpha: 1, y: 0, duration: 0.6 }, tCnt);
const cv = { v: 0 }, cn = cnt.querySelector(".n");
tl.to(cv, { v: 961, duration: at("move3-9", "nine hundred and sixty-one") + 1.2 - tCnt, ease: "power1.inOut", onUpdate: () => { cn.textContent = String(Math.round(cv.v)); } }, tCnt);
tl.to(cnt, { scale: 1.08, duration: 0.3, yoyo: true, repeat: 1 }, at("move3-9", "nine hundred and sixty-one") + 1.2);
tl.to(cnt, { autoAlpha: 0, duration: 0.5 }, P10 - 0.3);
B.stat(["2 PARA: ABOUT 1 IN 6 KILLED OR WOUNDED"], at("move3-9", "to a battalion that had lost"), ARCH0 + 0.3, "carth");
// ARCHIVE paragraph (ARCH0..ARCH1): map holds, only the slow camera drift above

// ---------- move3-10: the method ----------
B.dim(P10 - 0.2, END, 0.6);
method(3, 2, P10 + 0.3, at("move3-10", "Attack the mind"), null);
B.finish();
