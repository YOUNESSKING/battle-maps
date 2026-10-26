// Move 2 recap: the three charges across the stream into the Vandal centre + the method card. Basemap: tricamarum (schematic).
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
const K = "tricam-11";
const T_SHAPE = at(K, "He shaped"), T_STRUCK = at(K, "He struck"), T_CENTRE = at(K, "but its center"), T_TIME = at(K, "And he made time"), T_NUM = at(K, "their numbers");

B.camera([
  [0, 1180, 860, 0.86],
  [T_STRUCK, 1150, 880, 0.92],
  [END, 1130, 890, 0.96],
]);
B.showDate(0.1);
B.date("TRICAMARUM", 0.2);

const STREAM = [[1410, -20], [1372, 220], [1402, 440], [1342, 660], [1372, 870], [1322, 1080], [1362, 1300], [1332, 1640]];
B.river(STREAM, 16);
const campG = document.createElementNS(SVGNS, "g");
campG.innerHTML = `<rect x="420" y="560" width="320" height="300" rx="18" fill="rgba(196,18,31,0.16)" stroke="#c4121f" stroke-width="9" stroke-dasharray="22 10"/>`;
OV.appendChild(campG);
B.label("VANDAL CAMP", 580, 545, { cls: "tg", size: 30, t: 0.3, anchor: [-50, -100] });
const RY = [470, 590, 710, 830, 950];
RY.forEach((y, i) => B.unit({ id: "r" + i, side: "rome", kind: "inf", x: 1150, y, w: 100, h: 58, t: 0.2 + i * 0.08 }));
[520, 640, 780, 900].forEach((y, i) => B.unit({ id: "b" + i, side: "carth", kind: "cav", x: 1640, y, w: 90, h: 52, t: 0.3 + i * 0.08 }));

// the three charges, each bigger than the last
[[16, 690, 0.8], [26, 710, 1.6], [40, 730, 2.4]].forEach(([w, y, t], i) => {
  B.arrow({ side: "carth", pts: [[1570, y + (i - 1) * 30], [1400, y + (i - 1) * 10], [1225, 710]], width: w, t, dur: 0.9 });
  counter(String(i + 1), 1560, y + (i - 1) * 30 - 55 + i * 30, "carth", t + 0.5, null, 30);
});

// row 1: shaped the battlefield - the stream and the missing infantry did not decide
B.highlight(STREAM, T_SHAPE + 0.2, T_STRUCK, 50);
counter("NO WAITING FOR INFANTRY", 1900, 1000, "carth", T_SHAPE + 1.5, T_STRUCK + 0.5, 26);
// row 2: struck what held them together - the centre and the royal brothers
burst(1180, 710, T_CENTRE - 0.3, END - 0.4, 70);
B.grey(["r0", "r1", "r3", "r4"], T_CENTRE + 0.6, 1.0);
counter("THE ROYAL BROTHERS", 900, 710, "rome", T_STRUCK + 1.4, null, 26);
// row 3: made time fight for him - struck before the numbers counted
counter("VANDALS · 15,000–30,000?", 1150, 398, "rome", T_TIME + 0.4, null, 26);
const numX = counter("NUMBERS NEVER USED", 1150, 1060, "ink", T_NUM - 0.2, null, 26);

const m = B.method(T_SHAPE - 0.7, END - 0.2, [T_SHAPE, T_STRUCK, T_TIME]);
m.style.top = "auto"; m.style.bottom = "70px";
m.querySelectorAll(".row").forEach((r) => (r.style.fontSize = "44px"));
