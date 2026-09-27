// Move 2 opener: the fleet sails from Constantinople to Africa, 533 AD. Romans = blue ("carth"), Vandals = red ("rome"). Basemap: med (z6).
const B = Battle();
const { P, at } = B;
const END = B.T.duration;
// ---- shared scene kit (pasted into each scene; no lib changes) ----
const SVGNS = "http://www.w3.org/2000/svg", OV = document.getElementById("overlay"), PINS = document.getElementById("pins");
const mkG = (z, ox, oy) => (lat, lon) => {
  const n = 256 * 2 ** z, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - ox).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - oy).toFixed(1)];
};
const COL = { rome: "#c4121f", carth: "#1f4fc4" }; // rome = red side (enemy), carth = blue side (Romans of Belisarius)
function region(pts, o) { // tinted territory polygon (world px)
  const p = document.createElementNS(SVGNS, "path");
  p.setAttribute("d", "M " + pts.map((q) => q.join(" ")).join(" L ") + " Z");
  p.setAttribute("fill", COL[o.side || "rome"]); p.setAttribute("fill-opacity", o.op || 0.28);
  p.setAttribute("stroke", COL[o.side || "rome"]); p.setAttribute("stroke-width", o.sw || 6); p.setAttribute("stroke-dasharray", "16 10");
  p.setAttribute("stroke-linejoin", "round");
  OV.insertBefore(p, OV.firstChild);
  gsap.set(p, { autoAlpha: 0 });
  B.tl.to(p, { autoAlpha: 1, duration: o.dur || 1.2 }, o.t);
  if (o.until != null) B.tl.to(p, { autoAlpha: 0, duration: 0.8 }, o.until);
  return p;
}
function counter(text, x, y, side, t, until, size = 30) { // bold side-coloured counter box centred on (x,y)
  const el = document.createElement("div");
  el.textContent = text;
  el.style.cssText = `position:absolute;left:${x}px;top:${y}px;padding:4px 16px;font-size:${size}px;font-weight:700;letter-spacing:0.06em;white-space:nowrap;color:#fff;
    background:${side === "ink" ? "rgba(24,20,14,0.86)" : COL[side]};border:3px solid #f7f3ea;border-radius:4px;box-shadow:0 4px 10px rgba(0,0,0,0.45);`;
  PINS.appendChild(el);
  gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
  B.tl.fromTo(el, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(2)" }, t);
  if (until != null) B.tl.to(el, { autoAlpha: 0, duration: 0.4 }, until);
  return el;
}
function burst(x, y, t, until, r = 70) { // melee star that throbs
  const g = document.createElementNS(SVGNS, "g");
  let pts = [];
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2, rr = i % 2 ? r * 0.45 : r; pts.push(`${(Math.cos(a) * rr).toFixed(1)},${(Math.sin(a) * rr).toFixed(1)}`); }
  g.innerHTML = `<polygon points="${pts.join(" ")}" fill="#f2c230" stroke="#b3261e" stroke-width="7" stroke-linejoin="round"/>
    <polygon points="${pts.join(" ")}" fill="#fff4c9" transform="scale(0.45)"/>`;
  g.setAttribute("transform", `translate(${x} ${y})`);
  const inner = document.createElementNS(SVGNS, "g"); inner.innerHTML = g.innerHTML; g.innerHTML = ""; g.appendChild(inner);
  OV.appendChild(g);
  gsap.set(inner, { scale: 0, transformOrigin: "50% 50%", autoAlpha: 0 });
  B.tl.to(inner, { scale: 1, autoAlpha: 1, duration: 0.35, ease: "back.out(3)" }, t);
  const reps = Math.max(Math.floor((until - t - 0.8) / 0.7), 0);
  B.tl.to(inner, { scale: 0.78, rotation: 12, duration: 0.35, yoyo: true, repeat: reps * 2 + 1, ease: "sine.inOut" }, t + 0.4);
  B.tl.to(inner, { scale: 0, autoAlpha: 0, duration: 0.3 }, until);
  return g;
}
const flagSVG = (c) => "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 28"><rect width="46" height="28" fill="${c}"/><rect x="3" y="3" width="40" height="22" fill="none" stroke="#f2c230" stroke-width="2"/><circle cx="23" cy="14" r="5" fill="#f2c230"/></svg>`);
function person(o) { // portrait stake if the image exists (o.img), else a plain plaque. (x,y) = foot of the pole
  if (o.img) return B.portraitStake({ img: o.img, flag: flagSVG(COL[o.side]), name: o.name, x: o.x, y: o.y, size: o.size || 1, t: o.t, until: o.until });
  return B.plaque({ name: o.name, role: o.role, side: o.side, x: o.x, y: o.y, t: o.t, until: o.until });
}
function tintPortrait(el, side) { const f = el.querySelector(".face"); if (f) f.style.boxShadow = `0 0 0 3px ${COL[side]}, 0 6px 12px rgba(0,0,0,0.5)`; const n = el.querySelector(".nm"); if (n) n.style.background = COL[side]; }

// ================= scene =================
const G = mkG(6, 7753, 5567), GL = (a) => a.map(([la, lo]) => G(la, lo));
const K = "tricam-1";
const T_FLEET = at(K, "A Roman fleet"), T_500 = at(K, "five hundred transports"), T_15 = at(K, "fifteen thousand");
const T_VK = at(K, "Vandal kingdom"), T_CARTH = at(K, "seized Carthage"), T_RICH = at(K, "richest provinces");

B.camera([
  [0, 1440, 810, 0.667],
  [T_FLEET, 1420, 790, 0.72],
  [T_15 + 1.0, 1300, 780, 0.9],
  [T_VK + 0.5, 1120, 820, 1.1],
  [END, 1000, 840, 1.38],
]);

B.title("MOVE 2", "TRICAMARUM", "DECEMBER 533 AD", 0.2, T_FLEET - 0.3);
B.showDate(0.3);
B.date("533 AD", 0.5);

B.label("MEDITERRANEAN SEA", ...G(34.2, 20.8), { cls: "sea", size: 40, t: 1.0, until: T_VK });
B.city("CONSTANTINOPLE", ...G(41.01, 28.98), { size: 30, t: T_FLEET });
B.label("PELOPONNESE", ...G(37.5, 22.3), { cls: "tg", size: 24, t: T_FLEET + 1.2 });
B.label("SICILY", ...G(37.55, 14.2), { cls: "tg", size: 26, t: T_FLEET + 2.2 });
B.label("NORTH AFRICA", ...G(32.4, 5.2), { cls: "country", size: 40, t: T_FLEET + 3.0, until: T_VK - 0.2 });

// the fleet's route: Dardanelles, round the Peloponnese (Methone), Zakynthos, Sicily (Catania / Syracuse), Malta, Caput Vada
const route = GL([[40.98, 28.7], [40.3, 26.5], [39.0, 25.6], [37.4, 24.4], [36.25, 23.2], [36.6, 21.5], [37.55, 20.55], [37.25, 18.0], [37.15, 15.6], [36.3, 14.9], [35.75, 13.3], [35.35, 11.6], [35.25, 11.28]]);
B.arrow({ side: "carth", pts: route, width: 16, t: T_FLEET, dur: T_15 - T_FLEET + 0.6 });
counter("500 TRANSPORTS", ...G(38.9, 19.9), "carth", T_500, T_VK, 26);
B.city("CAPUT VADA", ...G(35.24, 11.15), { size: 26, t: T_15 - 0.4, dy: 26 });
B.unit({ id: "army", side: "carth", kind: "inf", x: G(35.24, 11.15)[0] - 62, y: G(35.24, 11.15)[1] - 14, w: 58, h: 40, label: "~15,000", t: T_15 + 0.5 });

// the Vandal kingdom: North African coast + Sardinia
const vk = GL([[36.55, 0.6], [36.85, 3.0], [37.1, 6.0], [37.35, 8.8], [37.4, 10.2], [37.2, 11.2], [36.4, 10.75], [35.8, 10.8], [35.45, 11.2], [34.7, 10.95], [33.9, 10.3], [33.75, 11.0], [32.95, 13.2], [32.55, 14.5], [32.2, 15.3],
  [31.3, 15.2], [31.6, 12.5], [32.6, 9.8], [33.6, 7.4], [34.4, 4.5], [34.8, 1.8], [35.2, 0.4]]);
region(vk, { side: "rome", t: T_VK - 0.3, op: 0.3 });
region(GL([[41.25, 9.25], [40.9, 9.85], [39.2, 9.75], [38.85, 8.55], [39.9, 8.3], [40.95, 8.15]]), { side: "rome", t: T_VK + 0.1, op: 0.3, sw: 4 });
B.label("VANDAL KINGDOM", ...G(34.0, 5.6), { cls: "country", size: 42, t: T_VK + 0.2 });
B.label("SARDINIA", ...G(40.05, 7.1), { cls: "tg", size: 22, t: T_VK + 0.5, anchor: [-100, -50] });
B.city("CARTHAGE", ...G(36.85, 10.32), { left: true, size: 32, t: T_CARTH - 0.3 });
B.caption("THE VANDAL KINGDOM · RICHEST PROVINCES OF THE WEST", T_RICH - 0.4, END - 0.2, "rome");
