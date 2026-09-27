// Move 3 showpiece: the siege of Rome, 537-538. Romans blue ("carth"), Goths red ("rome"). Shared geometry: RomeKit (lib/battle.js).
const B = Battle();
const R = RomeKit(B);
const { P, at, tl } = B;
const END = B.T.duration;
const HAS = { belisarius: true, vitiges: false };
const G = R.G;
const GT = G.gates;

// evenly spaced points (+ heading in degrees) along a polyline
const along = (pts, n) => {
  const seg = [], L = [0];
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L.push(L[i - 1] + d); }
  const tot = L[L.length - 1], out = [];
  for (let k = 0; k < n; k++) {
    const s = (tot * k) / (n - 1); let i = 0;
    while (i < seg.length - 1 && L[i + 1] < s) i++;
    const f = (s - L[i]) / seg[i], a = pts[i], b = pts[i + 1];
    out.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI]);
  }
  return out;
};
const svgG = (html) => { const g = document.createElementNS("http://www.w3.org/2000/svg", "g"); g.innerHTML = html; document.getElementById("overlay").appendChild(g); return g; };
const fadeIn = (el, t, d = 0.5) => { gsap.set(el, { autoAlpha: 0 }); tl.to(el, { autoAlpha: 1, duration: d }, t); };
const fadeOut = (el, t, d = 0.5) => tl.to(el, { autoAlpha: 0, duration: d }, t);
const stake = (x, y, size, t, until) => {
  if (HAS.belisarius) {
    const st = B.portraitStake({ img: "assets/media/belisarius.png", flag: R.flag("#1f4fc4"), name: "BELISARIUS", x, y, size, t, until });
    Object.assign(st.querySelector(".face img").style, { width: "180%", height: "180%", maxWidth: "none", marginLeft: "-18%", marginTop: "-49%" });
    return st;
  }
  return R.scale(B.plaque({ side: "carth", name: "BELISARIUS", x, y, t, until }), size);
};

// ---------- key times ----------
const S3 = P("rome-3"), S4 = P("rome-4"), S5 = P("rome-5"), S6 = P("rome-6"), S7 = P("rome-7"), S8 = P("rome-8"), S9 = P("rome-9");
const T_12 = at("rome-2", "twelve miles"), T_18 = at("rome-2", "eighteen gates"), T_CAMPS = at("rome-2", "seven fortified"), T_VIT = at("rome-2", "Vitiges believed");
const T_STARVE = at("rome-2", "starved");
const T_CUT = at("rome-3", "cut the aqueducts"), T_MILLS = at("rome-3", "grain mills"), T_STOP = at("rome-3", "mills stopped"), T_BREAD = at("rome-3", "no bread");
const T_TIBER = at("rome-4", "Tiber had not"), T_BOATS = at("rome-4", "pairs of boats"), T_TURN = at("rome-4", "river turned"), T_LOGS = at("rome-4", "logs and bodies"), T_CHAIN = at("rome-4", "iron chains");
const T_ASSAULT = at("rome-5", "great assault"), T_SAL = at("rome-5", "Salarian Gate"), T_TOWERS = at("rome-5", "siege towers"), T_IF = at("rome-5", "If the towers");
const T_PANIC = at("rome-6", "panicked"), T_LAUGH = at("rome-6", "Belisarius laughed"), T_HOLD = at("rome-6", "hold"), T_ONE = at("rome-6", "one target");
const T_OXEN = at("rome-6", "the oxen"), T_DOWN = at("rome-6", "animals went down"), T_DEAD = at("rome-6", "stopped dead"), T_BURN = at("rome-6", "burned");
const T_HAD = at("rome-7", "tomb of Hadrian"), T_MARBLE = at("rome-7", "smashed the marble"), T_PRAE = at("rome-7", "Praenestine Gate"), T_BREACH = at("rome-7", "broke through");
const T_OTHER = at("rome-7", "another gate"), T_NIGHT = at("rome-7", "By nightfall");
const T_TRAITOR = at("rome-8", "traitor"), T_LOCKS = at("rome-8", "changed the locks"), T_TWICE = at("rome-8", "twice every month"), T_GUARDS = at("rome-8", "moved his guards");
const T_HORSE = at("rome-9", "horse archers"), T_BACK = at("rome-9", "dashing back"), T_REINF = at("rome-9", "Reinforcements"), T_SLOW = at("rome-9", "slowly");
const T_FOOD = at("rome-9", "ran out of food");

// ---------- camera ----------
B.camera([
  [0, 1420, 760, 0.86],
  [5.0, 1450, 780, 0.78],
  [T_CAMPS, 1509, 771, 0.7],
  [S3 + 2.6, 1509, 771, 0.7],
  [T_MILLS - 0.3, 880, 1030, 1.9],
  [S4, 900, 1020, 1.95],
  [S4 + 2.6, 1090, 870, 2.4],
  [T_LOGS - 1.5, 1080, 860, 2.55],
  [T_LOGS + 0.5, 1010, 815, 2.45],
  [S5, 1040, 830, 2.45],
  [S5 + 3.0, 1630, 300, 1.9],
  [T_TOWERS, 1640, 290, 2.1],
  [T_ONE, 1640, 280, 2.3],
  [S7, 1640, 290, 2.25],
  [T_HAD + 0.4, 900, 500, 2.0],
  [T_PRAE - 1.0, 880, 490, 2.1],
  [T_PRAE + 1.2, 2080, 740, 1.8],
  [T_NIGHT + 0.8, 2090, 720, 1.9],
  [S8 + 0.3, 1509, 771, 0.7],
  [T_GUARDS, 1480, 790, 0.76],
  [S9, 1509, 771, 0.7],
  [END, 1509, 771, 0.72],
]);

// ---------- rome-2: the walls, the camps ----------
R.tiber();
B.label("TIBER", 1236, 1005, { cls: "river", size: 34, t: 0.4, rot: -72, anchor: [-50, -50] });
R.walls({ t: 0.9, dur: 4.2 });
R.tomb(2.4);
B.label("TOMB OF HADRIAN", G.hadrian[0], G.hadrian[1] - 34, { cls: "tg", size: 24, t: 2.8, anchor: [-50, -100] });
B.showDate(0.2);
B.date("MARCH 537 AD", 0.4, S5 + 0.2);
stake(1470, 900, 1.15, 0.9, T_12 + 3.5);
B.label("AURELIAN WALLS", 1480, 1215, { cls: "tg", size: 40, t: T_12 - 0.4, until: T_STARVE - 0.3, anchor: [-50, -50] });
B.label("12 MILES · 18 GATES", 1480, 1268, { cls: "tg", size: 34, t: T_18, until: T_STARVE - 0.3, anchor: [-50, -50] });
R.gates(T_18, { stagger: 0.07 });
G.camps.forEach(([x, y], i) => R.camp(x, y, T_CAMPS + 0.2 + i * 0.45));
B.label("PLAIN OF NERO", G.camps[6][0], G.camps[6][1] + 66, { cls: "tg", size: 24, t: T_CAMPS + 3.2, until: S3 + 0.5, anchor: [-50, 0] });
const red = R.counter({ side: "red", title: "GOTHS", big: "150,000?", sub: "Procopius, eyewitness", left: 40, width: 340, top: 470, t: T_CAMPS + 1.0, until: S3 - 0.2 });
R.counterRow(red, "20,000–30,000 <span>(modern)</span>", T_CAMPS + 2.0);
R.counter({ side: "blue", title: "ROMANS", big: "5,000", left: 40, width: 340, top: 745, t: T_CAMPS + 2.8, until: S3 - 0.2 });
if (HAS.vitiges) {
  B.portraitStake({ img: "assets/media/vitiges.png", flag: R.flag("#c4121f"), name: "VITIGES", x: 2400, y: 470, size: 1.6, t: T_VIT, until: S3 + 0.3 });
} else {
  R.scale(B.plaque({ side: "rome", name: "VITIGES", role: "King of the Goths", x: 2330, y: 470, t: T_VIT, until: S3 + 0.3 }), 1.5);
}
B.caption("STARVE IT — OR STORM IT", T_STARVE, S3 - 0.1, "rome");

// ---------- rome-3: aqueducts cut, mills stop ----------
const aqOrder = [4, 0, 1, 3, 2];
const aqs = aqOrder.map((k, i) => R.aqueduct(G.aqueducts[k], S3 - 0.2 + i * 0.25, { dur: 1.5 }));
B.label("AQUEDUCTS", 2470, 1165, { cls: "tg", size: 34, t: S3 + 0.8, until: T_MILLS, rot: 24, anchor: [-50, -50] });
aqOrder.forEach((k, i) => {
  const t = T_CUT + 0.9 + i * 0.35;
  R.cutX(G.cuts[k][0], G.cuts[k][1], t, 1.5);
  tl.to(aqs[i].water, { stroke: "#8a877f", opacity: 0.5, duration: 0.8 }, t + 0.2);
});
B.caption("AQUEDUCTS CUT", T_CUT + 1.0, T_MILLS - 0.2, "rome");
const mills = G.mills.map(([x, y], i) => R.mill(x, y, T_MILLS + 0.2 + i * 0.25, 1.3));
mills.forEach((m) => {
  tl.fromTo(m.wheel, { rotation: 0 }, { rotation: 540, duration: T_STOP - T_MILLS + 0.6, ease: "none", transformOrigin: "50% 50%" }, T_MILLS + 0.2);
  tl.to(m.wheel, { rotation: "+=40", duration: 1.0, ease: "power2.out", transformOrigin: "50% 50%" }, T_STOP + 0.8);
  tl.to(m.wheel, { stroke: "#77746c", duration: 0.8 }, T_STOP + 1.0);
  tl.to(m.wheel.querySelector("circle"), { fill: "#9a968c", duration: 0.8 }, T_STOP + 1.0);
  tl.to(m.g, { opacity: 0.75, duration: 0.8 }, T_STOP + 1.0);
});
B.label("GRAIN MILLS", 945, 1018, { cls: "tg", size: 26, t: T_MILLS + 0.6, until: S4 + 0.6, anchor: [0, -50] });
B.caption("NO WATER · NO MILLS · NO BREAD", T_BREAD - 0.6, S4 - 0.1, "rome");

// ---------- rome-4: floating mills on the Tiber ----------
R.bridge(S4 + 1.0);
const flow = along([[830, 660], [860, 705], [900, 745], [960, 800], [1030, 850], [1100, 880], [1185, 915], [1195, 960]], 24);
for (let c = 0; c < 6; c++) {
  const g = svgG(`<path d="M-7 -7 L3 0 L-7 7" fill="none" stroke="#f7f3ea" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`);
  const shift = c * 4, path = flow.slice(shift).concat(flow.slice(0, shift));
  gsap.set(g, { x: path[0][0], y: path[0][1], rotation: path[0][2], autoAlpha: 0 });
  tl.to(g, { autoAlpha: 0.9, duration: 0.4 }, T_TIBER);
  const kf = path.slice(1).map(([x, y, a]) => ({ x, y, rotation: a, duration: 0.18, ease: "none" }));
  tl.to(g, { keyframes: kf, repeat: 4 }, T_TIBER);
  tl.to(g, { autoAlpha: 0, duration: 0.4 }, S5 - 0.2);
}
B.caption("THE TIBER STILL FLOWS", T_TIBER + 0.2, T_BOATS + 1.2, "carth");
const bm = G.boatMills.map(([x, y, a], i) => R.boatMill(x, y, a, T_BOATS + 0.4 + i * 0.4, 1.0));
bm.forEach((m) => tl.fromTo(m.wheel, { rotation: 0 }, { rotation: 720, duration: S5 - T_TURN, ease: "none", transformOrigin: "50% 50%" }, T_TURN));
B.caption("FLOATING MILLS", T_BOATS + 1.4, T_LOGS - 0.3, "carth");
// logs and bodies drift down and are caught by the chain
const logs = [[[860, 688], [1036, 848]], [[835, 650], [1043, 866]], [[880, 718], [1049, 842]], [[812, 612], [1030, 862]]];
logs.forEach(([a, b], i) => {
  const g = svgG(`<rect x="-10" y="-3" width="20" height="6" rx="2" fill="#5a3b1c" stroke="#1b1812" stroke-width="1.5"/>`);
  gsap.set(g, { x: a[0], y: a[1], rotation: 40 + i * 25, autoAlpha: 0 });
  tl.to(g, { autoAlpha: 1, duration: 0.4 }, T_LOGS + i * 0.3);
  tl.to(g, { keyframes: [{ x: (a[0] + 900) / 2 + 20, y: (a[1] + 745) / 2 + 10, duration: 1.4, ease: "none" }, { x: 960, y: 800, duration: 1.2, ease: "none" }, { x: b[0], y: b[1], rotation: 60, duration: 1.4, ease: "power1.out" }] }, T_LOGS + i * 0.3);
  fadeOut(g, S5 + 1.5);
});
B.label("LOGS · BODIES", 880, 690, { cls: "tg", size: 18, t: T_LOGS + 0.3, until: S5, anchor: [-100, -50] });
R.chain(T_CHAIN - 0.2);
B.caption("IRON CHAINS ACROSS THE RIVER", T_CHAIN + 0.1, S5 - 0.1, "carth");

// ---------- rome-5: day 18, the great assault on the Salarian Gate ----------
B.date("DAY 18 OF THE SIEGE", S5 + 0.3, S8, 34);
B.caption("DAY 18 · THE GREAT ASSAULT", S5 + 0.4, T_SAL + 3.5, "rome");
B.label("SALARIAN GATE", 1640, 262, { cls: "tg", size: 22, t: T_SAL, until: S7 + 0.5, anchor: [-50, 0] });
tl.fromTo(svgG(`<circle cx="${GT.SALARIAN[0]}" cy="${GT.SALARIAN[1]}" r="30" fill="none" stroke="#f7f3ea" stroke-width="5"/>`), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, yoyo: true, repeat: 3 }, T_SAL);
const TW = [[1560, 95], [1635, 80], [1708, 118], [1780, 150]];
const towers = [], oxen = [];
TW.forEach(([x, y], i) => {
  const t0 = T_TOWERS - 1.4 + i * 0.3;
  const tw = R.tower(x, y - 120, null, 1.15), ox = R.oxen(x, y - 72, null, 1.15);
  [tw, ox].forEach((g) => fadeIn(g, t0, 0.6));
  [tw, ox].forEach((g, j) => {
    const base = j ? y + 48 : y;
    tl.to(g, { y: base - 45, duration: S6 - t0, ease: "none" }, t0);
    tl.to(g, { y: base, duration: T_DOWN - S6, ease: "none" }, S6);
  });
  towers.push(tw); oxen.push(ox);
});
[[1520, 30], [1600, 20], [1680, 45], [1760, 65]].forEach(([x, y], i) => B.unit({ id: "gi" + i, side: "rome", kind: "inf", x, y: y - 40, w: 30, h: 30, t: T_TOWERS + 0.4 + i * 0.2 }));
[0, 1, 2, 3].forEach((i) => B.move("gi" + i, T_TOWERS + 1.0, T_DOWN - T_TOWERS - 1.0, [1520, 1600, 1680, 1760][i], [30, 20, 45, 65][i] + 40, "none"));
B.caption("SIEGE TOWERS PULLED BY OXEN", T_TOWERS + 0.3, T_IF, "rome");
B.caption("IF THEY REACH THE WALL…", T_IF + 0.2, S6 + 1.0, "rome");

// ---------- rome-6: shoot the oxen ----------
const DEF = [[1545, 262], [1600, 226], [1655, 238], [1720, 318], [1790, 360]];
DEF.forEach(([x, y], i) => {
  B.unit({ id: "d" + i, side: "carth", kind: "inf", x, y, w: 24, h: 24, t: S6 + 0.8 + i * 0.12 });
  tl.fromTo(B.units["d" + i].el, { x: -3 }, { x: 3, duration: 0.07, yoyo: true, repeat: 11, ease: "none" }, T_PANIC + i * 0.05);
  tl.set(B.units["d" + i].el, { x: 0 }, T_PANIC + 1.2);
});
stake(1552, 410, 0.55, T_LAUGH - 0.2, S7 + 0.4);
B.caption("BELISARIUS LAUGHED", T_LAUGH + 0.2, T_HOLD - 0.1, "carth");
B.caption("HOLD…", T_HOLD, T_ONE - 0.2, "carth");
R.scale(B.bubble("SHOOT THE OXEN", 1585, 300, T_ONE, T_DEAD + 1.5), 0.5, "0% 0%");
for (let v = 0; v < 3; v++) {
  DEF.forEach((d, i) => {
    const o = TW[i % 4];
    R.shot(d, [o[0] + (v - 1) * 6, o[1] + 48 + (v % 2) * 4], T_OXEN + v * 0.35 + i * 0.05, 0.3);
  });
}
oxen.forEach((g, i) => {
  tl.to(g, { rotation: 75, duration: 0.35, ease: "power2.in" }, T_DOWN + i * 0.12);
  tl.to(g.querySelectorAll("ellipse,circle"), { fill: "#77746c", duration: 0.5 }, T_DOWN + i * 0.12);
});
B.caption("STRANDED", T_DEAD, T_BURN - 0.6, "rome");
towers.forEach((g, i) => tl.to(g.querySelectorAll("rect"), { fill: "#77746c", duration: 0.6 }, T_DEAD + 0.2 + i * 0.1));
TW.forEach(([x, y], i) => {
  const f = svgG(`<circle cx="${x}" cy="${y - 6}" r="26" fill="#ff7a1a" opacity="0.75" filter="url(#rkGlowS)"/><circle cx="${x}" cy="${y - 10}" r="12" fill="#ffd36b"/>`);
  gsap.set(f, { autoAlpha: 0 });
  tl.to(f, { autoAlpha: 1, duration: 0.5 }, T_BURN - 1.4 + i * 0.2);
  tl.to(f, { autoAlpha: 0, duration: 0.8 }, S8 - 1);
});
B.hideUnits(["gi0", "gi1", "gi2", "gi3"], T_DEAD + 1.5, 1.2);
towers.concat(oxen).forEach((g) => fadeOut(g, S8 + 0.3, 1));

// ---------- rome-7: Hadrian's tomb, the Vivarium ----------
tl.fromTo(svgG(`<circle cx="${G.hadrian[0]}" cy="${G.hadrian[1]}" r="46" fill="none" stroke="#c4121f" stroke-width="7"/>`), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, yoyo: true, repeat: 5 }, T_HAD - 0.4);
B.arrow({ side: "rome", pts: [[690, 400], [770, 440], [826, 466]], width: 14, t: T_HAD, dur: 1.0, until: T_PRAE });
[[800, 420], [790, 470], [835, 415]].forEach(([x, y], i) => B.unit({ id: "h" + i, side: "rome", kind: "inf", x, y, w: 22, h: 22, t: T_HAD + 0.6 + i * 0.15 }));
for (let k = 0; k < 10; k++) {
  const tgt = [[800, 420], [790, 470], [835, 415]][k % 3];
  R.shot([G.hadrian[0] - 10, G.hadrian[1] - 5], [tgt[0] + ((k * 7) % 11) - 5, tgt[1] + ((k * 5) % 9) - 4], T_MARBLE + k * 0.22, 0.35, "#f7f3ea");
}
B.grey(["h0", "h1", "h2"], T_MARBLE + 2.4);
B.hideUnits(["h0", "h1", "h2"], T_PRAE, 0.5);
B.caption("STATUES THROWN DOWN", T_MARBLE, T_PRAE - 0.4, "carth");
// the Vivarium: an enclosure outside the wall near the Praenestine Gate
const viv = svgG(`<rect x="2044" y="690" width="84" height="112" fill="rgba(239,227,196,0.35)" stroke="#3b2f22" stroke-width="6" stroke-dasharray="12 6"/>`);
fadeIn(viv, T_PRAE);
B.label("VIVARIUM", 2140, 748, { cls: "tg", size: 22, t: T_PRAE + 0.3, until: S8 + 0.4, anchor: [0, -50] });
B.label("PRAENESTINE GATE", 2005, 868, { cls: "tg", size: 20, t: T_PRAE, until: S8 + 0.4, anchor: [-100, -50] });
B.arrow({ side: "rome", pts: [[2240, 700], [2170, 735], [2110, 748]], width: 14, t: T_BREACH - 0.3, dur: 1.0, until: T_OTHER + 1.4 });
const breach = svgG(`<circle cx="2128" cy="748" r="24" fill="#c4121f" opacity="0.7" filter="url(#rkGlowS)"/>`);
gsap.set(breach, { autoAlpha: 0 });
tl.to(breach, { autoAlpha: 1, duration: 0.3, yoyo: true, repeat: 3 }, T_BREACH + 0.4);
[[2075, 720], [2095, 770], [2070, 790]].forEach(([x, y], i) => B.unit({ id: "v" + i, side: "rome", kind: "inf", x, y, w: 22, h: 22, t: T_BREACH + 0.6 + i * 0.15 }));
B.arrow({ side: "carth", pts: [[2030, 570], [2120, 555], [2185, 620], [2165, 725]], width: 14, t: T_OTHER - 0.3, dur: 1.5, until: S8 + 0.3 });
B.grey(["v0", "v1", "v2"], T_NIGHT);
B.hideUnits(["v0", "v1", "v2"], S8, 0.6);
B.caption("THE ASSAULT FAILS EVERYWHERE", T_NIGHT + 0.2, S8 - 0.1, "carth");

// ---------- rome-8: locks and guards ----------
B.date("537 – 538 AD", S8 + 0.4, null, 34);
const LOCKG = ["FLAMINIAN", "PINCIAN", "SALARIAN", "NOMENTAN", "TIBURTINE", "PRAENESTINE", "ASINARIAN", "LATIN", "APPIAN", "OSTIAN", "PORTUENSIS", "AURELIAN"];
const inward = (k, d) => { const [x, y] = GT[k], dx = 1450 - x, dy = 800 - y, n = Math.hypot(dx, dy); return [x + (dx / n) * d, y + (dy / n) * d]; };
const locks = LOCKG.map((k, i) => R.lock(...inward(k, 0), T_TRAITOR + 1.2 + i * 0.08, 1.9));
const tr = svgG(`<circle cx="${GT.PINCIAN[0]}" cy="${GT.PINCIAN[1]}" r="48" fill="none" stroke="#c4121f" stroke-width="8"/>`);
tl.fromTo(tr, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, yoyo: true, repeat: 3 }, T_TRAITOR - 0.2);
B.label("TRAITOR?", GT.PINCIAN[0], GT.PINCIAN[1] - 70, { cls: "tg", size: 40, t: T_TRAITOR - 0.2, until: T_LOCKS + 0.2, anchor: [-50, -100] });
[T_LOCKS + 0.3, T_TWICE + 0.3].forEach((t, n) => locks.forEach((g, i) => {
  tl.to(g, { rotation: `+=360`, duration: 0.6, ease: "back.inOut(1.6)" }, t + i * 0.05);
  tl.to(g.querySelector("rect"), { fill: n ? "#e0b441" : "#9fc0ea", duration: 0.3 }, t + 0.3 + i * 0.05);
}));
B.caption("LOCKS CHANGED TWICE A MONTH", T_LOCKS, T_GUARDS + 0.4, "carth");
const GUARD = ["FLAMINIAN", "SALARIAN", "TIBURTINE", "PRAENESTINE", "APPIAN", "OSTIAN", "AURELIAN"];
const gp = GUARD.map((k) => inward(k, 75));
gp.forEach(([x, y], i) => B.unit({ id: "gd" + i, side: "carth", kind: "inf", x, y, w: 40, h: 40, t: S8 + 1.4 + i * 0.12 }));
[T_GUARDS + 0.4, T_GUARDS + 2.8].forEach((t, n) => gp.forEach((_, i) => {
  const [x, y] = gp[(i + 1 + n) % gp.length];
  B.move("gd" + i, t, 1.8, x, y, "power2.inOut");
}));
B.caption("GUARDS MOVED FROM POST TO POST", T_GUARDS + 0.5, S9 - 0.1, "carth");
locks.forEach((g) => fadeOut(g, S9 + 0.2));
B.hideUnits(gp.map((_, i) => "gd" + i), S9 + 0.2);

// ---------- rome-9: raids, reinforcements, famine ----------
const SALLY = [["SALARIAN", [1690, 40]], ["PRAENESTINE", [2500, 930]], ["APPIAN", [1860, 1560]], ["AURELIAN", [470, 1010]]];
SALLY.forEach(([k, f], i) => {
  const g0 = GT[k], t = T_HORSE + 0.8 + i * 0.6;
  B.unit({ id: "f" + i, side: "rome", kind: "inf", x: f[0], y: f[1], w: 40, h: 40, t: T_HORSE - 0.4 + i * 0.15 });
  const mid = [(g0[0] + f[0]) / 2 + (f[1] - g0[1]) * 0.12, (g0[1] + f[1]) / 2 - (f[0] - g0[0]) * 0.12];
  B.arrow({ side: "carth", pts: [g0, mid, [g0[0] + (f[0] - g0[0]) * 0.86, g0[1] + (f[1] - g0[1]) * 0.86]], width: 16, t, dur: 1.2, until: T_BACK + 0.6 });
  B.grey(["f" + i], t + 1.3, 0.6);
  B.hideUnits(["f" + i], T_BACK + 1.8, 0.8);
  const back = [g0[0] + (f[0] - g0[0]) * 0.8, g0[1] + (f[1] - g0[1]) * 0.8];
  B.arrow({ side: "carth", pts: [back, [(back[0] + g0[0]) / 2 - (f[1] - g0[1]) * 0.1, (back[1] + g0[1]) / 2 + (f[0] - g0[0]) * 0.1], inward(k, 30)], width: 9, t: T_BACK + 0.2 + i * 0.2, dur: 1.0, until: T_REINF + 0.8 });
});
B.caption("HORSE ARCHERS: HIT AND RUN", T_HORSE + 0.6, T_REINF - 0.2, "carth");
B.arrow({ side: "carth", pts: [[2860, 880], [2560, 875], [2300, 862], [2080, 856]], width: 24, t: T_REINF, dur: 2.2 });
B.label("REINFORCEMENTS", 2580, 830, { cls: "tg", size: 36, t: T_REINF + 0.8, until: T_FOOD, anchor: [-50, -100] });
R.dimCamps(T_SLOW + 1.5, 2.5, 0.32);
B.caption("THE SIEGE TURNS INSIDE OUT", T_SLOW + 1.6, T_FOOD - 0.3, "carth");
B.caption("GOTHS: FAMINE · PLAGUE", T_FOOD, END, "rome");
