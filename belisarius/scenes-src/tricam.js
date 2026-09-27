// Move 2 showpiece: the battle of Tricamarum, December 533. Schematic battlefield (exact site unknown). Romans blue ("carth"), Vandals red ("rome").
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
// Layout: Vandal camp west (left), Vandal line behind the stream, Roman cavalry east of it, Roman infantry far to the east (Carthage side).
const IMG = { gelimer: false, tzazon: false, belisarius: true, john: false }; // set true when assets/media/NAME.png exists
const K3 = "tricam-3", K4 = "tricam-4", K5 = "tricam-5", K6 = "tricam-6", K7 = "tricam-7", K8 = "tricam-8", K9 = "tricam-9", K10 = "tricam-10";
let seed = 533; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

// ---------- key times ----------
const T_STREAM = at(K3, "camped behind a small stream"), T_LARGER = at(K3, "far larger"), T_EST = at(K3, "modern estimates");
const T_AHEAD = at(K3, "Belisarius had come ahead"), T_5K = at(K3, "five thousand horsemen"), T_INF = at(K3, "His infantry was still");
const T_SANE = at(K4, "No sane general"), T_SWORD = at(K4, "fight with swords alone"), T_TZ = at(K4, "his brother Tzazon");
const T_ONE = at(K5, "held together by one thing"), T_FAM = at(K5, "its royal family"), T_ORDER = at(K5, "Every order"), T_HEAD = at(K5, "If the head was struck");
const T_MID = at(K6, "Around midday"), T_JOHN = at(K6, "John the Armenian"), T_C1 = at(K6, "straight at the Vandal center"), T_BACK1 = at(K6, "pushed them back easily"), T_NOFOL = at(K6, "did not follow them");
const T_WENT = at(K7, "John went back"), T_C2 = at(K7, "charged a second time"), T_BACK2 = at(K7, "threw him back"), T_FIRM = at(K7, "Tzazon and his men stood firm");
const T_C3 = at(K8, "charged a third time"), T_FIERCE = at(K8, "fierce fighting"), T_KILL = at(K8, "Tzazon was cut down"), T_LINE = at(K8, "the Roman line crossed"), T_BROKE = at(K8, "The Vandal center");
const T_FLED = at(K9, "fled to their camp"), T_LATE = at(K9, "By late afternoon"), T_ADV = at(K9, "Belisarius advanced on the camp"), T_NERVE = at(K9, "Gelimer lost his nerve");
const T_BRO = at(K9, "lost one brother"), T_RODE = at(K9, "Without a word"), T_GONE = at(K9, "realized their king was gone"), T_NIGHT = at(K9, "dissolved into the night");
const T_PROC = at(K10, "According to Procopius"), T_BUT = at(K10, "But what followed"), T_RANKS = at(K10, "broke ranks"), T_TREAS = at(K10, "treasure of a kingdom");
const T_LOOT = at(K10, "loot the Vandal camp"), T_IF = at(K10, "if the enemy had turned");

// ---------- camera ----------
B.camera([
  [0, 1440, 810, 0.667],
  [P(K3, 8), 1440, 800, 0.7],
  [T_AHEAD, 1560, 780, 0.74],
  [P(K4, 0.2), 1500, 760, 0.74],
  [P(K4, 3.5), 980, 780, 1.05],
  [T_SWORD, 960, 780, 1.1],
  [P(K5, 0.2), 960, 790, 1.12],
  [T_FAM, 940, 800, 1.22],
  [T_HEAD, 1080, 760, 1.42],
  [P(K6, 0.2), 1080, 740, 1.3],
  [T_JOHN + 0.5, 1350, 780, 1.28],
  [P(K7, 0.2), 1360, 780, 1.24],
  [T_FIRM, 1300, 770, 1.3],
  [P(K8, 0.2), 1400, 790, 1.08],
  [T_KILL, 1180, 760, 1.5],
  [T_LINE + 0.3, 1220, 770, 1.1],
  [P(K9, 0.4), 1300, 790, 0.78],
  [T_ADV + 1.0, 1150, 790, 0.8],
  [T_NERVE, 700, 860, 1.1],
  [T_RODE + 3.0, 700, 860, 1.05],
  [T_NIGHT, 1000, 800, 0.8],
  [P(K10, 0.3), 1000, 800, 0.82],
  [T_RANKS, 820, 770, 1.05],
  [T_LOOT + 1.0, 640, 760, 1.35],
  [T_IF + 0.5, 800, 780, 0.95],
  [END, 820, 780, 0.9],
]);

// ---------- terrain ----------
const STREAM = [[1410, -20], [1372, 220], [1402, 440], [1342, 660], [1372, 870], [1322, 1080], [1362, 1300], [1332, 1640]];
B.river(STREAM, 16);
const streamLbl = B.label("STREAM", 1418, 1200, { cls: "river", size: 30, t: T_STREAM, rot: -80 });
B.label("TRICAMARUM", 1440, 110, { cls: "country", size: 60, t: 0.4, until: P(K4, 3) });
B.label("CARTHAGE · 30 KM ▶", 2830, 250, { cls: "tg", size: 30, t: 1.2, anchor: [-100, -50], until: P(K4, 1) });
B.showDate(0.2);
B.date("DECEMBER 533", 0.3, T_MID);
B.date("MIDDAY", T_MID + 0.35, T_LATE);
B.date("LATE AFTERNOON", T_LATE + 0.35, T_NIGHT, 36);
B.date("NIGHT", T_NIGHT + 0.35);

// Vandal camp: palisade with tents
const CAMP = { x0: 380, y0: 600, x1: 740, y1: 920 };
const campG = document.createElementNS(SVGNS, "g");
let tents = "";
[[450, 660], [540, 650], [640, 670], [470, 860], [690, 840], [580, 880], [420, 760], [700, 740]].forEach(([x, y]) =>
  (tents += `<polygon points="${x - 18},${y + 14} ${x + 18},${y + 14} ${x},${y - 16}" fill="#8a4a32" stroke="#3a2416" stroke-width="3"/>`));
campG.innerHTML = `<rect x="${CAMP.x0}" y="${CAMP.y0}" width="${CAMP.x1 - CAMP.x0}" height="${CAMP.y1 - CAMP.y0}" rx="18" fill="rgba(196,18,31,0.16)" stroke="#c4121f" stroke-width="9" stroke-dasharray="22 10"/>${tents}`;
OV.appendChild(campG);
gsap.set(campG, { autoAlpha: 0 });
B.tl.to(campG, { autoAlpha: 1, duration: 0.8 }, T_STREAM + 0.4);
B.label("VANDAL CAMP", 560, 580, { cls: "tg", size: 30, t: T_STREAM + 0.6, anchor: [-50, -100] });

// ---------- the armies ----------
const RY = [370, 500, 630, 760, 890, 1020, 1150], RX = 1150;
RY.forEach((y, i) => B.unit({ id: "r" + i, side: "rome", kind: i === 0 || i === 6 ? "cav" : "inf", x: RX, y, w: 100, h: 58, t: T_LARGER + 0.2 + i * 0.13 }));
counter("VANDALS · 15,000–30,000?", RX, 1262, "rome", T_EST, T_MID, 30);
const BL = { b0: [1620, 540], b1: [1620, 660], b2: [1620, 860], b3: [1620, 980] };
Object.entries(BL).forEach(([k, [x, y]], i) => B.unit({ id: k, side: "carth", kind: "cav", x, y, w: 90, h: 52, t: T_AHEAD + 0.2 + i * 0.15 }));
B.unit({ id: "john", side: "carth", kind: "cav", x: 1560, y: 760, w: 64, h: 40, t: T_AHEAD + 0.8 });
counter("ROMAN CAVALRY · ~5,000", 1720, 1100, "carth", T_5K - 0.3, T_MID, 30);
B.unit({ id: "inf", side: "carth", kind: "inf", x: 2560, y: 780, w: 110, h: 62, label: "ROMAN INFANTRY", t: T_INF, alpha: 0.55 });
B.arrow({ side: "carth", pts: [[2880, 790], [2760, 785], [2650, 782]], width: 14, dash: "18 12", t: T_INF + 0.4, dur: 1.0, until: P(K4, 1) });
B.caption("ROMAN INFANTRY: STILL MARCHING", T_INF + 0.6, P(K4, 0.2), "carth");

// ---------- 4: what Gelimer believed ----------
const gel = person({ name: "GELIMER", role: "King of the Vandals", side: "rome", img: IMG.gelimer && "assets/media/gelimer.png", size: 0.8, x: 400, y: 1230, t: P(K4, 0.4) });
if (IMG.gelimer) tintPortrait(gel, "rome");
B.bubble("TIME IS ON MY SIDE.", 560, 1100, P(K4, 1.6), T_SANE - 0.2);
B.caption("NO SANE GENERAL ATTACKS ACROSS A STREAM WITHOUT INFANTRY", T_SANE, T_SWORD - 0.3, "rome");
B.highlight(STREAM, T_SANE + 0.4, P(K5), 50);
B.bubble("SWORDS ONLY!", 560, 1100, T_SWORD, P(K5, 0.5));
const tz = person({ name: "TZAZON", role: "Gelimer's brother · centre", side: "rome", img: IMG.tzazon && "assets/media/tzazon.png", size: 0.8, x: 770, y: 790, t: T_TZ });
if (IMG.tzazon) tintPortrait(tz, "rome");
B.tl.to(B.units.r3.el, { scale: 1.25, duration: 0.35, yoyo: true, repeat: 3, ease: "sine.inOut" }, T_TZ + 0.8);
counter("SARDINIA VETERANS", 1150, 700, "rome", T_TZ + 1.0, P(K5, 0.2), 22);

// ---------- 5: one family, one army ----------
const strings = [];
RY.forEach((y, i) => {
  const from = i < 4 ? [1071, 590] : [701, 1000];
  const [x1, y1] = from, x2 = RX - 52, y2 = y, len = Math.hypot(x2 - x1, y2 - y1);
  const g = document.createElementNS(SVGNS, "g");
  g.innerHTML = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgba(0,0,0,0.5)" stroke-width="8" stroke-linecap="round"/>
    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#f2c230" stroke-width="4" stroke-linecap="round"/>`;
  OV.appendChild(g);
  const ls = g.querySelectorAll("line");
  gsap.set(ls, { strokeDasharray: `${len} ${len}`, strokeDashoffset: len });
  B.tl.to(ls, { strokeDashoffset: 0, duration: 0.9, ease: "power2.out" }, T_ONE + 0.3 + i * 0.18);
  strings.push(g);
});
[gel, tz].forEach((el, i) => B.tl.to(el, { scale: 1.08, duration: 0.4, yoyo: true, repeat: 5, ease: "sine.inOut", transformOrigin: "10% 100%" }, T_FAM + i * 0.2));
B.caption("ONE FAMILY · ONE ARMY", T_ORDER - 0.4, P(K6, 0.2), "rome");
B.tl.to(B.units.r3.el, { scale: 1.3, duration: 0.4, yoyo: true, repeat: 5, ease: "sine.inOut" }, T_HEAD);
counter("STRIKE THE HEAD", 1150, 680, "carth", T_HEAD + 0.3, P(K6, 0.4), 24);

// ---------- 6: charge 1 ----------
const john = person({ name: "JOHN THE ARMENIAN", role: "Belisarius's officer", side: "carth", img: IMG.john && "assets/media/john.png", size: 0.7, x: 1760, y: 1180, t: T_JOHN - 0.3, until: T_C3 - 1.0 });
B.tl.to(B.units.john.el, { scale: 1.3, duration: 0.3, yoyo: true, repeat: 1 }, T_JOHN);
B.arrow({ side: "carth", pts: [[1510, 745], [1380, 740], [1250, 750]], width: 14, t: T_C1 - 0.2, dur: 1.0, until: T_BACK1 + 1.2 });
B.move("john", T_C1, 1.1, 1235, 760, "power2.in");
burst(1200, 760, T_C1 + 1.0, T_BACK1 + 0.2, 42);
B.move("john", T_BACK1, 1.4, 1560, 760, "power2.out");
B.caption("CHARGE 1", T_C1, T_NOFOL - 0.2, "carth");
B.highlight(STREAM, T_NOFOL, P(K7), 50);
B.caption("THE VANDALS DO NOT CROSS THE STREAM", T_NOFOL, P(K7, 0.2), "rome");

// ---------- 7: charge 2 ----------
B.tl.to(B.units.john.el, { scale: 1.6, duration: 0.8, ease: "back.out(2)" }, T_WENT + 0.3);
B.arrow({ side: "carth", pts: [[1500, 760], [1370, 752], [1240, 760]], width: 26, t: T_C2 - 0.3, dur: 1.0, until: T_BACK2 + 1.2 });
B.move("john", T_C2, 1.1, 1260, 760, "power2.in");
burst(1205, 760, T_C2 + 1.0, T_BACK2 + 0.3, 58);
B.move("john", T_BACK2, 1.4, 1560, 760, "power2.out");
B.caption("CHARGE 2", T_C2, T_FIRM - 0.2, "carth");
B.tl.to(tz, { scale: 1.1, duration: 0.35, yoyo: true, repeat: 3, transformOrigin: "10% 100%" }, T_FIRM);
B.caption("THE CENTRE HOLDS", T_FIRM + 0.3, P(K8, 0.1), "rome");

// ---------- 8: charge 3 - Tzazon killed, the centre breaks ----------
const bel = person({ name: "BELISARIUS", role: "His banner leads the guard", side: "carth", img: IMG.belisarius && "assets/media/belisarius.png", crop: [1.8, 0.38, 0.5], size: 1.05, x: 1725, y: 905, t: T_C3 - 0.6 });
B.tl.to(bel, { x: -220, duration: 3.0, ease: "power2.inOut" }, T_C3 + 0.6);
B.tl.to(bel, { autoAlpha: 0, duration: 0.5 }, T_FLED);
B.unit({ id: "g1", side: "carth", kind: "cav", x: 1600, y: 700, w: 64, h: 40, t: T_C3 - 0.2 });
B.unit({ id: "g2", side: "carth", kind: "cav", x: 1600, y: 820, w: 64, h: 40, t: T_C3 - 0.1 });
B.arrow({ side: "carth", pts: [[1510, 760], [1380, 760], [1250, 765]], width: 40, t: T_C3, dur: 1.2, until: T_LINE + 1.5 });
B.move("john", T_C3 + 0.4, 1.3, 1275, 760, "power2.in");
B.move("g1", T_C3 + 0.5, 1.3, 1265, 690, "power2.in");
B.move("g2", T_C3 + 0.5, 1.3, 1265, 830, "power2.in");
B.caption("CHARGE 3 · THE WHOLE GUARD", T_C3 + 0.2, T_KILL - 0.2, "carth");
burst(1195, 760, T_FIERCE, T_BROKE + 1.0, 80);
B.tl.fromTo(tz, { filter: "grayscale(0)" }, { filter: "grayscale(1)", opacity: 0.55, duration: 0.8 }, T_KILL + 0.2);
const killed = counter("KILLED", 911, 590, "ink", T_KILL + 0.4, T_FLED, 38); gsap.set(killed, { rotation: -8 });
B.caption("TZAZON KILLED", T_KILL + 0.2, T_LINE, "rome");
strings.forEach((g, i) => B.tl.to(g, { autoAlpha: 0, duration: 0.5 }, T_KILL + 0.4 + i * 0.08));
const LINE_ARROWS = [540, 660, 860, 980].map((y, i) => B.arrow({ side: "carth", pts: [[1570, y], [1420, y + 4], [1270, y]], width: 18, t: T_LINE + i * 0.12, dur: 1.1, until: T_FLED + 0.5 }));
Object.entries(BL).forEach(([k, [x, y]], i) => B.move(k, T_LINE + 0.3 + i * 0.1, 1.6, 1255, y));
B.caption("THE WHOLE LINE ATTACKS", T_LINE + 0.3, T_BROKE + 1.8, "carth");
[2, 3, 4].forEach((i) => B.move("r" + i, T_BROKE + 0.3, 1.5, RX - 150 + (i - 3) * 20, RY[i] + (i - 3) * 30));
B.grey(["r2", "r3", "r4"], T_BROKE + 0.6, 0.8);

// ---------- 9: flight to the camp, the king flees, the army dissolves ----------
const campSlots = [[470, 700], [600, 700], [700, 790], [470, 800], [590, 800], [480, 880], [620, 875]];
RY.forEach((_, i) => B.move("r" + i, T_FLED + i * 0.12, 3.2, ...campSlots[i]));
Object.entries(BL).forEach(([k, [x, y]], i) => B.move(k, T_FLED + 0.8 + i * 0.1, 3.0, 1020, 560 + i * 130));
B.move("john", T_FLED + 0.9, 3.0, 1080, 755); B.move("g1", T_FLED + 0.9, 3.0, 1100, 660); B.move("g2", T_FLED + 0.9, 3.0, 1100, 850);
B.tl.to(B.units.john.el, { scale: 1, duration: 1.0 }, T_FLED + 0.9);
B.arrow({ side: "rome", pts: [[1100, 760], [950, 770], [760, 770]], width: 22, t: T_FLED, dur: 1.6, until: T_ADV });
B.tl.to(B.units.inf.el, { autoAlpha: 1, duration: 0.6 }, T_LATE - 0.5);
B.move("inf", T_LATE, 4.0, 1250, 1020, "power1.inOut");
B.arrow({ side: "carth", pts: [[2480, 800], [2000, 900], [1500, 1000], [1320, 1020]], width: 20, t: T_LATE, dur: 3.6, until: T_NERVE });
B.caption("THE INFANTRY ARRIVES", T_LATE + 0.4, T_ADV + 1.0, "carth");
[[1000, 600, 800, 690], [1000, 760, 800, 770], [1000, 920, 800, 860]].forEach(([x1, y1, x2, y2], i) =>
  B.arrow({ side: "carth", pts: [[x1, y1], [(x1 + x2) / 2, (y1 + y2) / 2], [x2, y2]], width: 20, t: T_ADV + i * 0.2, dur: 1.2, until: T_NIGHT }));
B.tl.to(gel, { x: -8, duration: 0.08, yoyo: true, repeat: 11, ease: "none" }, T_NERVE);
B.caption("AMMATAS † AD DECIMUM · TZAZON † TRICAMARUM", T_BRO - 0.3, T_RODE - 0.2, "rome");
B.arrow({ side: "rome", pts: [[380, 820], [260, 900], [130, 950], [20, 970]], width: 12, dash: "20 12", t: T_RODE, dur: 2.2, until: T_NIGHT + 1 });
B.tl.to(gel, { x: -560, y: 0, duration: 3.2, ease: "power2.in" }, T_RODE + 0.4);
B.tl.to(gel, { autoAlpha: 0, duration: 0.5 }, T_RODE + 3.2);
B.caption("THE KING FLEES", T_RODE + 0.4, T_NIGHT - 0.2, "rome");
B.dim(T_NIGHT - 0.3, END, 0.55);
RY.forEach((_, i) => {
  const a = Math.PI * (0.55 + 0.9 * (i / 6)) + rnd() * 0.3, d = 380 + rnd() * 220;
  const [sx, sy] = campSlots[i];
  B.move("r" + i, T_NIGHT + i * 0.1, 3.0, sx + Math.cos(a) * d, sy - Math.sin(a) * d * 0.8, "power1.in");
});
B.hideUnits(RY.map((_, i) => "r" + i), T_NIGHT + 2.4, 1.0);
B.caption("THE VANDAL ARMY DISSOLVES", T_NIGHT + 0.4, P(K10, 0.1), "rome");
B.tl.to(tz, { autoAlpha: 0, duration: 0.6 }, T_FLED);

// ---------- 10: casualties, then the loot ----------
B.stat(["ROMANS KILLED: FEWER THAN 50", "VANDALS KILLED: ~800", "<span style=\"font-size:26px;opacity:.8\">(PROCOPIUS)</span>"], T_PROC, T_BUT - 0.2, "carth");
const bluePos = { b0: [1020, 560], b1: [1020, 690], b2: [1020, 820], b3: [1020, 950], john: [1080, 755], g1: [1100, 660], g2: [1100, 850], inf: [1250, 1020] };
const swarm = [];
Object.entries(bluePos).forEach(([k, [x, y]], j) => {
  for (let m = 0; m < 3; m++) {
    const id = `s${j}_${m}`, tx = CAMP.x0 + 40 + rnd() * (CAMP.x1 - CAMP.x0 - 80), ty = CAMP.y0 + 40 + rnd() * (CAMP.y1 - CAMP.y0 - 80);
    B.unit({ id, side: "carth", kind: "cav", x: x + (m - 1) * 14, y: y + (m - 1) * 10, w: 30, h: 22 });
    B.show(id, T_RANKS + 0.2, 1);
    B.move(id, T_RANKS + 0.4 + rnd() * 1.2, 2.4 + rnd(), tx, ty, "power2.inOut");
    B.move(id, T_LOOT + 1.2 + rnd() * 1.5, 1.2, tx + (rnd() - 0.5) * 80, ty + (rnd() - 0.5) * 60, "sine.inOut");
    swarm.push(id);
  }
});
B.hideUnits(Object.keys(bluePos), T_RANKS + 0.2, 0.4);
counter("THE TREASURE OF A KINGDOM", 560, 560, "ink", T_TREAS - 0.3, T_IF, 28);
B.caption("LOOT", T_LOOT - 0.3, T_IF - 0.2, "carth");
[[[80, 300], [260, 470], [400, 620]], [[80, 1350], [260, 1150], [410, 930]], [[40, 780], [200, 770], [360, 765]]].forEach((pts, i) =>
  B.arrow({ side: "rome", pts, width: 18, dash: "22 14", t: T_IF + 0.2 + i * 0.3, dur: 1.2 }));
B.caption("ONE COUNTERATTACK COULD HAVE DESTROYED THEM", T_IF + 0.8, END - 0.1, "rome");
