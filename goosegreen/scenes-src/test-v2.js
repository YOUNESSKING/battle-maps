// TEST v2 (1 min, move3-1..move3-3) with the FX kit: detailed aircraft, firing artillery, K&G-style counters.
// MOVE 3: the Goose Green bluff, 28-29 May 1982 (move3-1 .. move3-10, incl. one ARCHIVE paragraph after move3-9).
// Sides: British (2 PARA) = blue = engine side "carth"; Argentine = red = engine side "rome".
// Basemap: assets/darwin.jpg (z14). G(lat, lon) -> map px. Places verified against OSM / Wikipedia:
//   Goose Green -51.8277,-58.9728 · Darwin -51.8069,-58.9587 · Goose Green airfield -51.8196,-58.9802
//   Schoolhouse, dairy and community hall placed from period maps (Middlebrook / Fitz-Gibbon), approximate.
const B = Battle();
const { P, at } = B;
const END = B.T.duration;
const tl = B.tl;
const K = FXK(B);

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
const burst = (x, y, t, r = 14, snd) => {
  SFX(snd === undefined ? (r >= 18 ? "explosion" : "impact") : snd, t);
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
  SFX(o.snd === undefined ? "mortar" : o.snd, t);
  if (o.burst !== false) burst(x2, y2, t + dur * 0.93, o.r || 14);
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
  SFX("missile", t);
  burst(x2, y2, t + dur - 0.05, 18, false);
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
const P1 = P("move3-1"), P2 = P("move3-2"), P3 = P("move3-3"), P4 = END;
B.camera([
  [0, 1450, 900, 1.2],
  [6.5, 1440, 960, 1.45],
  [at("move3-1", "The fighting was") , 1440, 990, 1.9],
  [P2, 1440, 1000, 1.9],
  [P2 + 3, 1420, 1060, 1.55],
  [at("move3-2", "Argentine helicopters") - 1.5, 1460, 1250, 1.75],
  [at("move3-2", "Argentine helicopters") + 4.5, 1420, 1220, 1.75],
  [at("move3-2", "Inside the settlement"), 1420, 1100, 1.6],
  [P3 + 1, 1420, 1060, 1.55],
  [P3 + 4, 1440, 1010, 1.65],
  [END, 1440, 1010, 1.65],
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
B.city("DAIRY", ...DAIRY, { size: 10, r: 3.5, left: true, t: 1.8, until: null });

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
["dcoy", "ccoy", "acoy"].forEach((id) => K.counter(id, { icon: "infantry", flag: "uk", size: "I" }));
K.counter("gar", { icon: "infantry", flag: "arg", size: "II" });
[0, 1].forEach((i) => K.counter("aa" + i, { icon: "aa", flag: "arg" }));
// Argentine 105 mm guns at Goose Green firing on the advancing companies
const ARTY = [GG[0] + 30, GG[1] + 48];
U({ id: "arty", side: "rome", x: ARTY[0], y: ARTY[1], w: 32, h: 22, label: "105 mm GUNS", fs: 7, t: at("move3-1", "The fighting was") - 1.2 });
K.counter("arty", { icon: "artillery", flag: "arg", size: "I" });
const tFierce = at("move3-1", "The fighting was");
[[1336, 902], [1488, 925], [1350, 880], [1470, 900], [1320, 920]].forEach(([tx, ty], i) => {
  const tf = tFierce + 0.3 + i * 0.9;
  K.gun(ARTY[0], ARTY[1], tf, { unit: "arty", dx: -8, dy: -12 });
  shell([ARTY[0] - 8, ARTY[1] - 12], [tx, ty], tf + 0.05, { h: 70, dur: 1.1, burst: false, snd: false });
  K.impact(tx, ty, tf + 1.15, { r: 13 });
});
const tAA = at("move3-1", "fired flat");
for (let k = 0; k < 3; k++) {
  K.gun(AA[0][0] - 6, AA[0][1] - 10, tAA + k * 0.6, { dx: 0, dy: 0, sfx: "mg" }); K.gun(AA[1][0], AA[1][1] - 10, tAA + 0.3 + k * 0.6, { dx: 0, dy: 0, sfx: "mg" });
  B.arrow({ side: "rome", pts: [[AA[0][0] - 6, AA[0][1] - 10], [1350 + k * 8, 915]], width: 2.5, head: false, t: tAA + k * 0.6, dur: 0.35, until: tAA + k * 0.6 + 1.0 });
  B.arrow({ side: "rome", pts: [[AA[1][0], AA[1][1] - 10], [1480 + k * 6, 935]], width: 2.5, head: false, t: tAA + 0.3 + k * 0.6, dur: 0.35, until: tAA + 0.3 + k * 0.6 + 1.0 });
}
// the schoolhouse burns
const FIRE = `<g><path d="M50 96 C20 96 14 70 26 52 C30 64 38 66 40 58 C36 40 46 22 58 6 C60 26 76 34 78 54 C84 48 84 40 82 34 C94 50 92 96 50 96 Z" fill="#e8491d" stroke="#fff3c4" stroke-width="4"/><path d="M50 92 C36 92 32 78 40 68 C44 74 50 72 50 64 C58 72 66 78 60 92 Z" fill="#ffd54a"/></g>`;
const fire = icon(FIRE, SCHOOL[0] + 2, SCHOOL[1] - 10, 22, 22, at("move3-1", "burned") - 0.4, P2 + 6);
for (let i = 0; i < 10; i++) K.smoke(SCHOOL[0] + 2, SCHOOL[1] - 18, at("move3-1", "burned") + i * 1.2, { n: 1, r: 9, rise: 40, life: 3.2, alpha: 0.65 });
tl.to(fire, { scale: 1.15, duration: 0.35, yoyo: true, repeat: 17, ease: "sine.inOut" }, at("move3-1", "burned") + 0.2);
// jets and Pucarás attack; two shot down
const tJets = at("move3-1", "Argentine jets");
const tDown = at("move3-1", "Two of the aircraft");
K.aircraft({ kind: "jet", side: "rome", size: 84, pts: [[1080, 1250], [1330, 980], [1560, 760], [1760, 560]], t: tJets - 0.4, dur: 4.4, down: tDown + 0.4 });
K.aircraft({ kind: "turboprop", side: "rome", size: 84, pts: [[1760, 1260], [1560, 1060], [1400, 930], [1250, 820]], t: tJets + 0.4, dur: 6.0, down: tDown + 1.1 });
L("MB-339 JET", 1150, 1200, { size: 10, t: tJets, until: tJets + 3 });
L("PUCARÁ", 1700, 1215, { size: 10, t: tJets + 0.8, until: tJets + 3.6 });
B.caption("TWO ARGENTINE AIRCRAFT SHOT DOWN", at("move3-1", "Two of the aircraft"), P2 - 0.2, "carth");

// ---------- move3-2: nightfall, reinforcements by helicopter ----------
const night = fxLayer("gg-night");
tl.to(night, { autoAlpha: 1, duration: 3 }, at("move3-2", "By nightfall") - 0.5);
B.date("28 MAY · NIGHTFALL", P2 + 1.3, null, 32);
U({ id: "bcoy", side: "carth", x: 1300, y: 1060, w: 28, h: 19, label: "B COY", fs: 9, t: P2 + 0.6 });
K.counter("bcoy", { icon: "infantry", flag: "uk", size: "I" });
B.move("dcoy", P2 + 0.8, 2.0, 1350, 948);
B.move("ccoy", P2 + 0.8, 2.0, 1470, 955);
// the ring around Goose Green: glowing two-colour front (British side north-west, Argentine side south-east)
K.front({ pts: [[1235, 1175], [1300, 1102], [1362, 1038], [1422, 1012], [1482, 1006], [1536, 990]], sideA: "carth", sideB: "rome", width: 24,
  t: at("move3-2", "surrounded") - 0.6, dur: 2.2 });
B.caption("GOOSE GREEN SURROUNDED · NOT TAKEN", at("move3-2", "surrounded"), at("move3-2", "And just after dark") + 0.2, "carth");
const tHeli = at("move3-2", "Argentine helicopters");
[0, 1, 2].forEach((i) => K.aircraft({ kind: "heli", side: "rome", size: 76 - i * 6, alt: 26,
  pts: [[1760 + i * 40, 1480 + i * 20], [1560 + i * 20, 1360 + i * 10], [LZ[0] + i * 30 - 26, LZ[1] - i * 18]],
  t: tHeli - 0.8 + i * 0.35, dur: 3.8, land: true, until: tHeli + 6.5 }));
L("PUMA · CHINOOK · HUEYS", LZ[0] + 40, LZ[1] + 96, { size: 10, t: tHeli + 1.5, until: tHeli + 6.5 });
U({ id: "solari", side: "rome", x: LZ[0] - 50, y: LZ[1] + 40, w: 28, h: 19, label: "COMBAT TEAM SOLARI", fs: 8, t: tHeli + 3.0 });
K.counter("solari", { icon: "infantry", flag: "arg", size: "I" });
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


B.finish();
