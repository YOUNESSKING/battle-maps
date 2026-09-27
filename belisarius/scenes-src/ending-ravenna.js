// Ending: Ravenna, 540. Belisarius takes the Gothic capital, is offered the western crown, and hands it to Justinian. Basemap: italy (z7).
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
const G = mkG(7, 16218, 11535), GL = (a) => a.map(([la, lo]) => G(la, lo));
const K = "ending-ravenna";
const T_TRAP = at(K, "were trapped"), T_OFFER = at(K, "extraordinary offer"), T_BETRAY = at(K, "betray Justinian"), T_PRET = at(K, "pretended to accept");
const T_GATES = at(K, "opened their gates"), T_MARCH = at(K, "He marched in"), T_HAND = at(K, "handed it to his emperor");
const RAV = G(44.42, 12.2), ROME = G(41.9, 12.5), CON = G(41.01, 28.98);
const BEL = [RAV[0] - 110, RAV[1] + 300], JUS = [RAV[0] + 540, RAV[1] + 330];

B.camera([
  [0, 1330, 560, 0.95],
  [T_TRAP + 0.4, 1290, 440, 1.45],
  [T_OFFER + 0.3, 1250, 400, 1.75],
  [T_MARCH + 0.2, 1250, 400, 1.75],
  [T_HAND - 1.6, 1480, 470, 1.3],
  [END, 1490, 480, 1.36],
]);
B.showDate(0.1);
B.date("540 AD", 0.2);
B.label("ITALY", ...G(41.2, 15.4), { cls: "country", size: 56, t: 0.4, until: T_TRAP + 0.5 });
B.city("ROME", ...ROME, { left: true, size: 28, t: 0.5, until: T_OFFER });
B.city("RAVENNA", ...RAV, { size: 34, t: 0.6 });

// the Roman advance north
[[[41.95, 12.7], [42.9, 12.55], [43.7, 12.35], [44.2, 12.22]], [[42.5, 14.1], [43.4, 13.7], [43.95, 12.85], [44.3, 12.4]], [[43.3, 11.3], [43.8, 11.6], [44.25, 12.02]]]
  .forEach((pts, i) => B.arrow({ side: "carth", pts: GL(pts), width: 16, t: 0.6 + i * 0.5, dur: 2.4, until: T_OFFER }));
// Goths shut in the city, Roman units ring it
const goth = [[-26, -14], [22, -18], [-4, 16]];
goth.forEach(([dx, dy], i) => B.unit({ id: "g" + i, side: "rome", kind: "inf", x: RAV[0] + dx, y: RAV[1] + dy, w: 34, h: 24, t: 1.2 + i * 0.15 }));
counter("GOTHS", RAV[0] - 150, RAV[1] - 20, "rome", 1.8, T_GATES, 22);
const ring = [[-80, 20], [-60, 75], [5, 95], [70, 70], [-75, -45]];
ring.forEach(([dx, dy], i) => B.unit({ id: "b" + i, side: "carth", kind: "cav", x: RAV[0] + dx, y: RAV[1] + dy, w: 30, h: 22, t: T_TRAP - 0.8 + i * 0.15 }));
const circ = document.createElementNS(SVGNS, "circle");
circ.setAttribute("cx", RAV[0]); circ.setAttribute("cy", RAV[1] + 20); circ.setAttribute("r", 120);
circ.setAttribute("fill", "none"); circ.setAttribute("stroke", COL.carth); circ.setAttribute("stroke-width", 6); circ.setAttribute("stroke-dasharray", "14 9");
OV.appendChild(circ);
gsap.set(circ, { autoAlpha: 0 });
B.tl.to(circ, { autoAlpha: 1, duration: 0.8 }, T_TRAP + 0.2);
B.tl.to(circ, { autoAlpha: 0, duration: 0.6 }, T_GATES + 0.6);
B.caption("THE GOTHS TRAPPED IN RAVENNA", T_TRAP + 0.3, T_OFFER - 0.2, "carth");

// Belisarius and the offered crown
person({ name: "BELISARIUS", side: "carth", img: "assets/media/belisarius.png", crop: [1.8, 0.38, 0.5], size: 0.95, x: BEL[0], y: BEL[1], t: T_TRAP + 1.0 });
const crown = document.createElement("div");
crown.innerHTML = `<svg viewBox="0 0 100 80" width="100%" height="100%"><path d="M8 70 L4 22 L28 44 L50 8 L72 44 L96 22 L92 70 Z" fill="#f2c230" stroke="#6b4a10" stroke-width="5" stroke-linejoin="round"/>
  <rect x="8" y="62" width="84" height="12" fill="#d9a520" stroke="#6b4a10" stroke-width="4"/><circle cx="50" cy="40" r="7" fill="#c4121f"/><circle cx="28" cy="52" r="5" fill="#1f4fc4"/><circle cx="72" cy="52" r="5" fill="#1f4fc4"/></svg>`;
crown.style.cssText = `position:absolute;left:${RAV[0] - 30}px;top:${RAV[1] - 80}px;width:60px;height:48px;filter:drop-shadow(0 4px 6px rgba(0,0,0,0.5));`;
PINS.appendChild(crown);
gsap.set(crown, { autoAlpha: 0 });
B.tl.fromTo(crown, { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: "back.out(2)" }, T_OFFER);
const faceTop = [BEL[0], BEL[1] - 0.95 * 268 + 0.95 * 64]; // top of the portrait circle
B.tl.to(crown, { left: faceTop[0] - 30, top: faceTop[1] - 40, duration: 1.8, ease: "power2.inOut" }, T_OFFER + 1.0);
B.bubble("BE EMPEROR OF THE WEST!", RAV[0] + 30, RAV[1] - 120, T_OFFER + 0.4, T_PRET - 0.2);
B.caption("BETRAY JUSTINIAN · RULE THE WEST", T_BETRAY - 0.2, T_PRET - 0.2, "rome");
B.caption("HE PRETENDED TO ACCEPT", T_PRET, T_GATES + 1.2, "carth");

// the gates open
B.hideUnits(["g0", "g1", "g2"], T_GATES + 0.2, 0.8);
ring.forEach(([dx, dy], i) => B.move("b" + i, T_MARCH - 0.3 + i * 0.1, 1.4, RAV[0] + dx * 0.25, RAV[1] + dy * 0.25));
B.caption("RAVENNA TAKEN · 540", T_MARCH, T_HAND - 0.4, "carth");

// ... and handed to the emperor
B.label("CONSTANTINOPLE ▶", JUS[0] + 90, JUS[1] - 150, { cls: "tg", size: 26, t: T_HAND - 1.6, anchor: [0, -50] });
person({ name: "JUSTINIAN", side: "carth", img: "assets/media/justinian.png", crop: [1.7, 0.52, 0.47], size: 1.2, x: JUS[0], y: JUS[1], t: T_HAND - 1.8 });
const jusTop = [JUS[0], JUS[1] - 1.2 * 268 + 1.2 * 64];
B.tl.to(crown, { left: jusTop[0] - 30, top: jusTop[1] - 44, scale: 1.25, duration: 1.8, ease: "power2.inOut" }, T_HAND - 0.9);
B.caption("HANDED TO HIS EMPEROR", T_HAND - 0.4, END - 0.1, "carth");
