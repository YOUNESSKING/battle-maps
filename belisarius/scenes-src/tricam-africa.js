// Move 2: landing, Ad Decimum, Carthage taken; Gelimer regroups with Tzazon. Basemap: africa (z9). Romans blue ("carth"), Vandals red ("rome").
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
  if (o.img) {
    const el = B.portraitStake({ img: o.img, flag: flagSVG(COL[o.side]), name: o.name, x: o.x, y: o.y, size: o.size || 1, t: o.t, until: o.until });
    if (o.crop) { // [scale, fx, fy]: zoom the portrait onto the face at fraction (fx, fy) of the image
      const [sc, fx, fy] = o.crop, im = el.querySelector(".face img");
      im.style.transformOrigin = `${fx * 100}% ${fy * 100}%`;
      im.style.transform = `translate(${(0.5 - fx) * 100}%, ${(0.5 - fy) * 100}%) scale(${sc})`;
    }
    tintPortrait(el, o.side);
    return el;
  }
  return B.plaque({ name: o.name, role: o.role, side: o.side, x: o.x, y: o.y, t: o.t, until: o.until });
}
function tintPortrait(el, side) { const f = el.querySelector(".face"); if (f) f.style.boxShadow = `0 0 0 3px ${COL[side]}, 0 6px 12px rgba(0,0,0,0.5)`; const n = el.querySelector(".nm"); if (n) n.style.background = COL[side]; }

// ================= scene =================
const G = mkG(9, 67846, 50615), GL = (a) => a.map(([la, lo]) => G(la, lo));
const K = "tricam-2";
const IMG = { gelimer: true, tzazon: true }; // set true when assets/media/NAME.png exists
const T_LAND = P(K, 0.3), T_MARCH = at(K, "marched on Carthage"), T_AD = at(K, "Ad Decimum"), T_DEF = at(K, "defeated the Vandal");
const T_OPEN = at(K, "Carthage opened"), T_ESC = at(K, "But Gelimer escaped"), T_3M = at(K, "Over the next three months");
const T_TZ = at(K, "called his brother Tzazon"), T_AGAIN = at(K, "marched on Carthage again");
const CAPUT = G(35.24, 11.15), CARTH = G(36.85, 10.32), ADD = G(36.75, 10.2), BULLA = G(36.56, 8.75);

B.camera([
  [0, 1560, 900, 0.95],
  [T_MARCH + 0.4, 1520, 820, 1.0],
  [T_AD + 0.3, 1400, 640, 1.45],
  [T_OPEN + 1.2, 1400, 620, 1.5],
  [T_ESC + 0.6, 1160, 560, 1.12],
  [T_TZ + 0.2, 1120, 480, 1.15],
  [END, 1150, 480, 1.22],
]);

B.showDate(0.2);
B.date("SEPTEMBER 533", 0.3, T_3M);
B.date("DECEMBER 533", T_3M + 0.35);
B.label("AFRICA", 900, 1150, { cls: "country", size: 60, t: 0.6, until: T_AD });
B.label("MEDITERRANEAN SEA", 2250, 700, { cls: "sea", size: 40, t: 0.8, until: T_AD });

// landing and march up the coast
B.city("CAPUT VADA", ...CAPUT, { left: true, size: 30, t: 0.4, until: T_ESC });
B.unit({ id: "rom", side: "carth", kind: "inf", x: CAPUT[0] - 75, y: CAPUT[1] - 40, w: 54, h: 38, label: "~15,000", t: T_LAND });
const march = [[1720, 1110], [1680, 1000], [1600, 900], [1540, 800], [1490, 700], [1455, 620], [1428, 560]];
B.arrow({ side: "carth", pts: march, width: 18, t: T_MARCH, dur: T_AD - T_MARCH + 0.3, until: T_ESC + 0.5 });
const segT = (T_AD - T_MARCH) / (march.length - 1);
march.forEach(([x, y], i) => i > 0 && B.move("rom", T_MARCH + (i - 1) * segT, segT, x + 40, y + 10, "none"));

// Ad Decimum
B.city("AD DECIMUM", ...ADD, { left: true, size: 26, r: 7, t: T_AD - 0.4, until: T_ESC + 1.5 });
B.city("CARTHAGE", ...CARTH, { size: 32, t: T_AD - 0.2 });
B.unit({ id: "van1", side: "rome", kind: "cav", x: 1340, y: 575, w: 46, h: 32, t: T_AD + 0.2 });
B.unit({ id: "van2", side: "rome", kind: "inf", x: 1390, y: 612, w: 46, h: 32, t: T_AD + 0.4 });
burst(ADD[0] + 10, ADD[1] + 40, T_DEF, T_OPEN - 0.2, 38);
const gel = person({ name: "GELIMER", role: "King of the Vandals", side: "rome", img: IMG.gelimer && "assets/media/gelimer.png", crop: [1.25, 0.5, 0.42], size: 0.8, x: 1180, y: 800, t: T_DEF - 0.4 });
if (IMG.gelimer) tintPortrait(gel, "rome");
B.move("van1", T_DEF + 1.2, 1.4, 1250, 560);
B.move("van2", T_DEF + 1.2, 1.4, 1290, 610);
B.hideUnits(["van1", "van2"], T_OPEN + 0.4);

// Carthage taken
B.arrow({ side: "carth", pts: [[1428, 530], [1436, 500], [1442, 488]], width: 14, t: T_OPEN - 0.3, dur: 0.6, until: T_ESC + 0.5 });
B.move("rom", T_OPEN, 1.2, 1440, 505);
B.caption("SEPTEMBER 533 · CARTHAGE TAKEN", T_OPEN, T_ESC + 1.8, "carth");

// Gelimer escapes west and regroups
B.city("BULLA REGIA", ...BULLA, { left: true, size: 26, t: T_ESC + 0.4 });
B.arrow({ side: "rome", pts: [[1240, 700], [1120, 700], [990, 660], [935, 628]], width: 12, dash: "22 14", t: T_ESC, dur: 1.8 });
B.tl.to(gel, { x: IMG.gelimer ? -170 : -150, y: IMG.gelimer ? -50 : 140, duration: 2.6, ease: "power2.inOut" }, T_ESC + 0.2);
const gather = [[720, 665], [800, 705], [870, 668], [715, 740], [800, 780], [640, 705]];
gather.forEach(([x, y], i) => B.unit({ id: "g" + i, side: "rome", kind: i % 3 ? "inf" : "cav", x, y, w: 48, h: 32, t: T_3M + 0.3 + i * 0.35 }));
counter("EVERY VANDAL WARRIOR", 720, 870, "rome", T_3M + 1.4, T_TZ + 0.2, 26);

// Tzazon returns from Sardinia
B.label("▲ SARDINIA", 1020, 60, { cls: "tg", size: 26, t: T_TZ - 0.6, anchor: [-50, 0] });
B.arrow({ side: "rome", pts: [[1020, 120], [990, 260], [950, 420], [905, 575]], width: 18, t: T_TZ, dur: 2.0 });
counter("TZAZON + HIS VETERANS", 1250, 230, "rome", T_TZ + 0.4, null, 26);
B.unit({ id: "tz", side: "rome", kind: "inf", x: 950, y: 610, w: 52, h: 34, t: T_TZ + 2.0 });

// marching on Carthage again
B.arrow({ side: "rome", pts: [[960, 660], [1100, 650], [1220, 600], [1300, 560]], width: 22, t: T_AGAIN, dur: 1.8 });
