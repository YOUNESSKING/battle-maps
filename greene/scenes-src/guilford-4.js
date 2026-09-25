// guilford-4: the battle of Guilford Courthouse. Volleys at the fence, the fight in the woods,
// the Guards broken at the third line, grapeshot into the melee, Greene's orderly retreat, losses.
const B = Battle();
const { P, at, tl } = B;
const END = B.T.duration;
const NS = "http://www.w3.org/2000/svg";
const SVG = document.getElementById("overlay"), PINS = document.getElementById("pins");
const st = document.createElement("style");
st.textContent = `.unit .tag{font-size:23px} .gfx{position:absolute;border-radius:50%;pointer-events:none}
.gfx.flash{width:64px;height:64px;margin:-32px 0 0 -32px;background:radial-gradient(circle,#fffbe8 0%,#ffd66b 30%,rgba(255,128,20,0.85) 55%,rgba(255,80,0,0) 72%)}
.gfx.smoke{width:90px;height:90px;margin:-45px 0 0 -45px;background:radial-gradient(circle,rgba(236,234,226,0.8) 0%,rgba(236,234,226,0.45) 45%,rgba(236,234,226,0) 70%)}
.gfx.hit{width:80px;height:80px;margin:-40px 0 0 -40px;border:6px solid #fff4d0;box-shadow:0 0 12px rgba(255,200,80,0.9)}`;
document.head.appendChild(st);
const svgEl = (tag, attrs, parent = SVG) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; };
const fadeIn = (el, t, d = 0.5) => { gsap.set(el, { autoAlpha: 0 }); tl.to(el, { autoAlpha: 1, duration: d }, t); };
const fadeOut = (el, t, d = 0.5) => tl.to(el, { autoAlpha: 0, duration: d }, t);
const rnd = (() => { let s = 1781; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; })();
const label2 = (a, b, x, y, o = {}) => {
  const el = B.label(a, x, y, { cls: "tg", size: o.size || 38, t: o.t, until: o.until, anchor: o.anchor || [-50, 0], instant: o.instant });
  el.innerHTML = `${a}<br><span style="font-size:0.72em;letter-spacing:0.08em">${b}</span>`;
  el.style.textAlign = "center"; el.style.lineHeight = "1.1";
  return el;
};
const fx = (cls, x, y) => { const d = document.createElement("div"); d.className = "gfx " + cls; d.style.left = x + "px"; d.style.top = y + "px"; PINS.appendChild(d); gsap.set(d, { autoAlpha: 0 }); return d; };
const flash = (x, y, t, s = 1) => {
  const f = fx("flash", x, y);
  tl.fromTo(f, { autoAlpha: 0, scale: 0.3 * s }, { autoAlpha: 1, scale: 1.1 * s, duration: 0.1 }, t);
  tl.to(f, { autoAlpha: 0, scale: 1.6 * s, duration: 0.4 }, t + 0.12);
  const sm = fx("smoke", x + 10, y);
  tl.fromTo(sm, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 0.9, scale: 1.2, duration: 0.5 }, t + 0.05);
  tl.to(sm, { autoAlpha: 0, scale: 2.0, x: -30, duration: 2.4, ease: "sine.out" }, t + 0.6);
};
const volley = (pts, t) => pts.forEach(([x, y], i) => flash(x + (rnd() - 0.5) * 12, y + (rnd() - 0.5) * 14, t + i * 0.05));
const hit = (id, t) => { // ring + shake on a unit
  const u = B.units[id], el = u.el;
  const h = fx("hit", 0, 0);
  tl.set(h, { left: () => parseFloat(el.style.left) + u.w / 2, top: () => parseFloat(el.style.top) + u.h / 2 }, t);
  tl.fromTo(h, { autoAlpha: 1, scale: 0.4 }, { autoAlpha: 0, scale: 1.4, duration: 0.6, ease: "power2.out" }, t);
  tl.fromTo(el.querySelector(".blk"), { x: 0 }, { x: 5, duration: 0.05, yoyo: true, repeat: 7, ease: "none", immediateRender: false }, t);
};
const weaken = (id, t, k) => { // grey edges eat into the block
  const blk = B.units[id].el.querySelector(".blk");
  tl.to(blk, { boxShadow: `inset 0 0 0 ${k}px rgba(176,172,160,0.95), 0 4px 6px rgba(0,0,0,0.35)`, duration: 0.6 }, t);
};
const unit = (o) => { // unit present from the start of the scene (after an archive cut)
  const el = B.unit(o);
  gsap.set(el.querySelector(".blk"), { boxShadow: "inset 0 0 0 0px rgba(176,172,160,0.95), 0 4px 6px rgba(0,0,0,0.35)" });
  if (o.t == null) gsap.set(el, { autoAlpha: 1 });
  return el;
};

const G4 = P("guilford-4"), G5 = P("guilford-5"), G6 = P("guilford-6"), G7 = P("guilford-7"), G8 = P("guilford-8");

// ---------- camera ----------
B.camera([
  [0, 820, 880, 1.2],
  [G5 - 1.0, 860, 880, 1.2],
  [G5 + 3.0, 1330, 880, 1.12],
  [G6 - 0.5, 1380, 860, 1.12],
  [G6 + 3.0, 1880, 760, 1.25],
  [G7 + 0.5, 1880, 760, 1.25],
  [G7 + 3.0, 1800, 800, 1.15],
  [G8 + 0.5, 1800, 800, 1.15],
  [G8 + 4.0, 1870, 640, 0.98],
  [END, 1870, 650, 1.0],
]);
B.showDate(0);
B.date("15 MARCH 1781", 0.1, null, 36);

// ---------- static battlefield ----------
const ch = svgEl("g", { transform: "translate(2473 600) scale(1.5) translate(-2473 -600)" });
ch.innerHTML = `<rect x="2445" y="572" width="56" height="40" fill="#8a6a44" stroke="#2a241b" stroke-width="4"/>
  <polygon points="2438,574 2473,548 2508,574" fill="#5b3d22" stroke="#2a241b" stroke-width="4" stroke-linejoin="round"/>`;
const chLab = label2("GUILFORD", "COURTHOUSE", 2473, 510, { anchor: [-50, -100], instant: true });
const fz = []; for (let y = 670, k = 0; y <= 1130; y += 18, k++) fz.push(`${k % 2 ? 944 : 962} ${y}`);
svgEl("path", { d: "M " + fz.join(" L "), fill: "none", stroke: "rgba(0,0,0,0.45)", "stroke-width": 12 });
svgEl("path", { d: "M " + fz.join(" L "), fill: "none", stroke: "#6b4a2b", "stroke-width": 7 });

// ---------- American lines (in place) ----------
const L1 = [730, 800, 960, 1030], L2 = [690, 760, 910, 980];
L1.forEach((y, i) => unit({ id: "l1_" + i, side: "carth", x: 1000, y, w: 84, h: 40 }));
L2.forEach((y, i) => unit({ id: "l2_" + i, side: "carth", x: 1440, y, w: 84, h: 40 }));
unit({ id: "va4", side: "carth", x: 1990, y: 540, w: 96, h: 40 });
unit({ id: "va5", side: "carth", x: 1990, y: 610, w: 96, h: 40 });
unit({ id: "md1", side: "carth", x: 1990, y: 680, w: 96, h: 40, label: "1ST MARYLAND" });
unit({ id: "md2", side: "carth", x: 1990, y: 820, w: 96, h: 40, label: "2ND MARYLAND" });
unit({ id: "wash", side: "carth", kind: "cav", x: 1000, y: 650, w: 76, h: 34 });
unit({ id: "lee", side: "carth", kind: "cav", x: 1000, y: 1110, w: 76, h: 34, label: "LEE" });
const washL = B.label("WASHINGTON", 1050, 650, { cls: "tg", size: 26, instant: true, anchor: [0, -50] });
const l1L = label2("1ST LINE", "N. CAROLINA MILITIA", 1000, 600, { anchor: [-50, -100], instant: true });
const l2L = label2("2ND LINE", "VIRGINIA MILITIA", 1440, 656, { anchor: [-50, -100], instant: true });
const l3L = label2("3RD LINE", "CONTINENTALS", 1990, 506, { anchor: [-50, -100], instant: true });
B.portraitStake({ img: "assets/media/greene_head.png", flag: "assets/media/us_flag_13star.png", name: "GREENE", x: 2330, y: 1030, size: 1.35, t: 0, until: at("guilford-8", "ordered a retreat") + 1.5 });
// two American guns beside the 2nd Maryland
const guns = [[2072, 790], [2072, 850]].map(([x, y]) => {
  const g = svgEl("g", { transform: `translate(${x} ${y})` });
  g.innerHTML = `<rect x="-4" y="-7" width="34" height="10" rx="3" fill="#1f4fc4" stroke="#1b1812" stroke-width="3"/><circle cx="0" cy="4" r="11" fill="#1f4fc4" stroke="#1b1812" stroke-width="3"/>`;
  return g;
});

// ---------- British ----------
const BR = [["b33", "33RD", 620, 720], ["b23", "23RD", 620, 805], ["b71", "71ST", 620, 1010], ["bbo", "VON BOSE", 620, 1095], ["bg2", "2ND GUARDS", 460, 865], ["bg1", "1ST GUARDS", 460, 1060]];
BR.forEach(([id, label, x, y]) => unit({ id, side: "rome", x, y, w: 96, h: 44, label }));
const art = unit({ id: "art", side: "rome", x: 380, y: 925, w: 60, h: 34 });
art.querySelector("svg").innerHTML = `<circle cx="50" cy="50" r="22" fill="#f7f3ea"/>`;

// ================= guilford-4: the fence =================
const T_V1 = at("guilford-4", "The volley") + 1.4, T_V2 = T_V1 + 2.6;
const T_HALF = at("guilford-4", "half of the Highlanders"), T_FB = at("guilford-4", "Most of the militia"), T_RUN = at("guilford-4", "some did not stop");
const T_TREES = at("guilford-4", "The British had paid");
["b33", "b23", "b71", "bbo"].forEach((id, i) => B.move(id, 0, T_V1 - 0.1, 860, B.units[id].y, "none"));
["bg2", "bg1"].forEach((id) => B.move(id, 0, T_V1 + 1, 690, B.units[id].y, "none"));
const fencePts = L1.map((y) => [975, y]);
volley(fencePts.concat(L1.map((y) => [975, y + 30])), T_V1);
volley(fencePts.concat(L1.map((y) => [975, y - 25])), T_V2);
["b33", "b23", "b71", "bbo"].forEach((id, i) => { hit(id, T_V1 + 0.15 + i * 0.05); weaken(id, T_V1 + 0.2, 7); hit(id, T_V2 + 0.15 + i * 0.05); weaken(id, T_V2 + 0.2, 11); });
B.caption("TWO VOLLEYS", T_V1 + 0.2, T_FB - 0.3, "carth");
hit("b71", T_HALF); weaken("b71", T_HALF, 17);
B.label("HALF THE 71ST DOWN", 760, 1190, { cls: "tg", size: 30, t: T_HALF + 0.2, until: T_TREES, anchor: [-50, -50] });
// militia fall back through the woods; some keep running
fadeOut(l1L, T_FB - 0.2);
B.move("l1_1", T_FB, 2.4, 1230, 640); B.move("l1_2", T_FB + 0.2, 2.4, 1230, 1090);
B.move("l1_0", T_FB + 0.1, 2.0, 1300, 560); B.move("l1_3", T_FB + 0.3, 2.0, 1300, 1160);
B.move("l1_0", T_RUN, 3.0, 1700, 330); B.move("l1_3", T_RUN, 3.0, 1700, 1380);
B.hideUnits(["l1_0", "l1_3"], T_RUN + 1.8, 1.2);
B.hideUnits(["l1_1", "l1_2"], T_TREES, 1.2);
B.move("wash", T_FB + 0.4, 3.0, 1540, 600); fadeOut(washL, T_FB);
B.move("lee", T_FB + 0.4, 3.0, 1250, 1180);
// the British reach the trees
["b33", "b23", "b71", "bbo"].forEach((id, i) => B.move(id, T_TREES - 1.5 + i * 0.1, 2.5, 1010, B.units[id].y));
["bg2", "bg1"].forEach((id) => B.move(id, T_TREES - 1.2, 2.5, 860, B.units[id].y));
B.move("art", T_TREES - 1.0, 2.5, 760, 896);

// ================= guilford-5: the woods =================
const T_PIECES = at("guilford-5", "broke into pieces"), T_TREE = at("guilford-5", "tree to tree"), T_APART = at("guilford-5", "pulled apart");
const T_EMERGE = at("guilford-5", "By the time they emerged");
B.caption("FIGHT IN THE WOODS", G5 + 0.3, T_EMERGE - 0.3, "rome");
fadeOut(l2L, T_PIECES + 0.5);
// the line breaks up: left wing drifts north, right wing wheels south after Lee
B.move("b33", T_PIECES, 3.0, 1270, 590); B.move("b23", T_PIECES + 0.3, 3.0, 1300, 740);
B.move("b71", T_PIECES + 0.2, 3.0, 1290, 950); B.move("bg2", T_PIECES + 0.5, 3.2, 1170, 850);
B.move("bbo", T_PIECES + 0.1, 3.0, 1170, 1130); B.move("bg1", T_APART, 3.0, 1000, 1150);
B.move("lee", T_PIECES, 3.0, 1370, 1140);
B.move("art", T_PIECES + 1.0, 4.0, 1060, 876);
B.arrow({ side: "rome", pts: [[1040, 700], [1110, 610], [1200, 560]], width: 16, t: T_APART, dur: 1.2, until: T_EMERGE });
B.arrow({ side: "rome", pts: [[1030, 1010], [1080, 1050], [1110, 1100]], width: 16, t: T_APART + 0.4, dur: 1.2, until: T_EMERGE });
// tree-to-tree firing
for (let i = 0; i < 16; i++) {
  const id = "l2_" + (i % 4), y = L2[i % 4];
  flash(1400 + (rnd() - 0.5) * 40, y + (rnd() - 0.5) * 50, T_TREE - 1.2 + i * 0.55, 0.8);
  if (i % 3 === 0) flash(1300 + (rnd() - 0.5) * 60, 600 + rnd() * 400, T_TREE - 0.9 + i * 0.55, 0.7);
}
flash(1250, 1140, T_APART + 1.5); flash(1320, 1150, T_APART + 2.0); flash(1230, 1120, T_APART + 3.2);
["b33", "b23", "b71", "bg2"].forEach((id, i) => { hit(id, T_TREE + i * 0.6); weaken(id, T_TREE + i * 0.6, id === "bg2" ? 6 : 14); });
// the Virginians fall back; the British come out on the far side, scattered
L2.forEach((y, i) => B.move("l2_" + i, T_EMERGE - 1.5 + i * 0.2, 3.0, 1660, y > 850 ? y + 150 : y - 160));
B.hideUnits(["l2_0", "l2_1", "l2_2", "l2_3"], T_EMERGE + 1.2, 1.0);
B.move("wash", T_EMERGE - 1.0, 3.0, 2120, 560);
B.move("b33", T_EMERGE, 3.0, 1700, 520); B.move("b23", T_EMERGE + 0.3, 3.0, 1690, 630);
B.move("b71", T_EMERGE + 0.2, 3.0, 1680, 900); B.move("bg2", T_EMERGE + 0.5, 3.0, 1650, 790);
["b33", "b23", "b71"].forEach((id) => weaken(id, T_EMERGE + 2, 17));
B.hideUnits(["bbo", "bg1", "lee"], G6 + 1.0, 1.0);

// ================= guilford-6: the third line =================
const T_SLOPE = at("guilford-6", "up the slope"), T_BROKE = at("guilford-6", "broke a newly"), T_CAPT = at("guilford-6", "captured two cannon");
const T_WHEEL = at("guilford-6", "First Maryland wheeled"), T_CAV = at("guilford-6", "cavalry crashed"), T_CUT = at("guilford-6", "cut to pieces");
fadeOut(l3L, G6 + 2.0);
B.move("bg2", T_SLOPE - 0.5, 2.5, 1870, 825);
B.move("b23", T_SLOPE, 2.2, 1850, 620); B.move("b33", T_SLOPE + 0.2, 2.2, 1850, 530);
volley([[1942, 540], [1942, 610], [1942, 680], [1942, 520], [1942, 640]], T_SLOPE + 2.3);
hit("b23", T_SLOPE + 2.5); hit("b33", T_SLOPE + 2.6);
B.move("b33", T_SLOPE + 3.0, 2.0, 1720, 500); B.move("b23", T_SLOPE + 3.0, 2.0, 1700, 600);
B.move("b71", T_SLOPE + 1.0, 2.5, 1700, 700);
// the Guards break the 2nd Maryland and take the guns
B.move("bg2", T_BROKE - 1.0, 1.6, 1985, 828);
flash(1945, 820, T_BROKE - 0.6); flash(1950, 845, T_BROKE - 0.3);
hit("md2", T_BROKE);
B.move("md2", T_BROKE + 0.2, 2.5, 2200, 990); B.grey(["md2"], T_BROKE + 0.4);
B.hideUnits(["md2"], T_WHEEL, 0.8);
guns.forEach((g, i) => {
  tl.to(g.querySelectorAll("rect,circle"), { fill: "#c4121f", duration: 0.4 }, T_CAPT + 0.6 + i * 0.2);
  tl.fromTo(g, { scale: 1 }, { scale: 1.4, svgOrigin: "0 0", duration: 0.25, yoyo: true, repeat: 1 }, T_CAPT + 0.6 + i * 0.2);
});
B.label("2 GUNS TAKEN", 2090, 880, { cls: "tg", size: 28, t: T_CAPT + 0.8, until: T_WHEEL + 1.5, anchor: [-50, 0] });
// counter-attack: 1st Maryland into the flank, Washington from behind
B.arrow({ side: "carth", pts: [[2010, 690], [1960, 715], [1920, 745]], width: 16, t: T_WHEEL, dur: 0.8, until: T_CUT + 1.0 });
B.move("md1", T_WHEEL + 0.3, 1.6, 1880, 745);
B.arrow({ side: "carth", pts: [[2110, 540], [1860, 610], [1810, 780], [1880, 848]], width: 18, t: T_CAV - 0.6, dur: 1.6, until: T_CUT + 1.0 });
B.move("wash", T_CAV - 0.2, 2.0, 1880, 892);
flash(1935, 800, T_CAV + 1.2); flash(1990, 860, T_CAV + 1.4); flash(1960, 830, T_CAV + 1.8);
hit("bg2", T_CAV + 1.3); hit("bg2", T_CUT);
B.grey(["bg2"], T_CUT, 1.0);
B.caption("THE GUARDS CUT TO PIECES", T_CUT, G7 - 0.3, "carth");

// ================= guilford-7: grapeshot =================
const T_TRAD = at("guilford-7", "According to tradition"), T_GRAPE = at("guilford-7", "fire grapeshot"), T_OWN = at("guilford-7", "his own Guardsmen");
const T_WORK = at("guilford-7", "It worked"), T_BREAK = at("guilford-7", "The melee broke");
B.move("art", G6 + 2.0, 6.0, 1700, 806);
B.portraitStake({ img: "assets/media/cornwallis_head.png", flag: "assets/media/gb_flag_1606.png", name: "CORNWALLIS", x: 1560, y: 1040, size: 1.3, t: T_TRAD + 0.3, until: G8 + 1.0 });
B.label("BRITISH GUNS", 1700, 770, { cls: "tg", size: 26, t: T_TRAD + 1.0, until: G8, anchor: [-50, -100] });
// the cone
const defs = svgEl("defs", {});
defs.innerHTML = `<radialGradient id="gfGrape" cx="0" cy="0.5" r="1"><stop offset="0" stop-color="#fff3c4" stop-opacity="0.95"/><stop offset="0.5" stop-color="#ffb347" stop-opacity="0.55"/><stop offset="1" stop-color="#ff6a00" stop-opacity="0"/></radialGradient>`;
const AX = 1735, AY = 806, TX = 1945, TY = 815;
const ang = Math.atan2(TY - AY, TX - AX), len = Math.hypot(TX - AX, TY - AY) + 90, half = 0.32;
const cone = svgEl("path", { d: `M ${AX} ${AY} L ${(AX + len * Math.cos(ang - half)).toFixed(1)} ${(AY + len * Math.sin(ang - half)).toFixed(1)} Q ${(AX + len * 1.08 * Math.cos(ang)).toFixed(1)} ${(AY + len * 1.08 * Math.sin(ang)).toFixed(1)} ${(AX + len * Math.cos(ang + half)).toFixed(1)} ${(AY + len * Math.sin(ang + half)).toFixed(1)} Z`, fill: "rgba(255,190,90,0.55)", stroke: "#fff1c8", "stroke-width": 3 });
gsap.set(cone, { autoAlpha: 0 });
const blast = (t) => {
  tl.fromTo(cone, { autoAlpha: 0, scale: 0.2, svgOrigin: `${AX} ${AY}` }, { autoAlpha: 1, scale: 1, svgOrigin: `${AX} ${AY}`, duration: 0.25, ease: "power3.out" }, t);
  tl.to(cone, { autoAlpha: 0, duration: 1.0 }, t + 0.5);
  flash(AX + 10, AY, t, 1.3);
  for (let i = 0; i < 22; i++) {
    const a = ang + (rnd() * 2 - 1) * half * 0.9, r = len * (0.55 + rnd() * 0.45);
    const c = svgEl("circle", { cx: AX, cy: AY, r: 4.5, fill: "#2a241b" });
    gsap.set(c, { autoAlpha: 0 });
    tl.fromTo(c, { autoAlpha: 1, attr: { cx: AX, cy: AY } }, { attr: { cx: AX + r * Math.cos(a), cy: AY + r * Math.sin(a) }, duration: 0.35, ease: "power1.out" }, t + rnd() * 0.1);
    tl.to(c, { autoAlpha: 0, duration: 0.4 }, t + 0.7);
  }
};
blast(T_GRAPE + 0.2); blast(T_GRAPE + 1.9);
B.caption("GRAPESHOT INTO THE MELEE", T_GRAPE + 0.2, T_WORK - 0.2, "rome");
["bg2", "md1", "wash"].forEach((id, i) => { hit(id, T_GRAPE + 0.45 + i * 0.08); hit(id, T_GRAPE + 2.15 + i * 0.08); });
weaken("md1", T_GRAPE + 0.6, 10); weaken("wash", T_GRAPE + 0.6, 10); weaken("md1", T_OWN, 14); weaken("wash", T_OWN, 14);
B.label("BOTH SIDES HIT", 1930, 950, { cls: "tg", size: 30, t: T_OWN, until: T_BREAK + 1.0, anchor: [-50, -50] });
// the melee breaks apart
B.move("bg2", T_BREAK, 2.5, 1790, 930); B.move("md1", T_BREAK, 2.5, 1990, 680); B.move("wash", T_BREAK + 0.2, 2.5, 2080, 470);
tl.to(B.units.bg2.el, { opacity: 0.45, duration: 1 }, T_BREAK + 1);

// ================= guilford-8: the retreat and the cost =================
const T_RET = at("guilford-8", "ordered a retreat"), T_FIELD = at("guilford-8", "He left the field"), T_PAPER = at("guilford-8", "On paper");
const T_LOST = at("guilford-8", "But he had lost");
B.arrow({ side: "carth", pts: [[2400, 600], [2330, 460], [2220, 300], [2110, 130]], width: 22, t: T_RET - 0.4, dur: 1.8 });
const rf = B.label("REEDY FORK ROAD", 2040, 380, { cls: "tg", size: 30, t: T_RET, anchor: [-50, -50] });
gsap.set(rf, { rotation: -56 });
[["va4", 2345, 490], ["va5", 2275, 390], ["md1", 2205, 290], ["wash", 2140, 195]].forEach(([id, x, y], i) => B.move(id, T_RET + 0.4 + i * 0.3, 3.2, x, y));
tl.to(B.units.md1.el.querySelector(".tag"), { autoAlpha: 0, duration: 0.4 }, T_RET + 0.4);
fadeOut(chLab, T_RET - 0.4); fadeOut(ch, T_RET - 0.4);
B.caption("AN ORDERLY RETREAT", T_RET + 0.3, T_FIELD - 0.2, "carth");
// the British hold the field
B.move("b23", T_FIELD, 3.5, 2120, 640); B.move("b33", T_FIELD + 0.2, 3.5, 2020, 700); B.move("b71", T_FIELD + 0.4, 3.5, 2200, 770);
B.move("art", T_FIELD + 0.4, 3.5, 1900, 790);
B.caption("THE BRITISH HOLD THE FIELD", T_FIELD + 0.2, T_LOST - 0.4, "rome");
["b23", "b33", "b71"].forEach((id, i) => hit(id, T_LOST + 0.3 + i * 0.2));
B.stat([`<span style="color:#9fc0ea">US ~260 KILLED &amp; WOUNDED</span>`, `<span style="color:#f0a89f">BRITISH 532 · 27% OF HIS ARMY</span>`], T_LOST, END - 0.2, "rome");
