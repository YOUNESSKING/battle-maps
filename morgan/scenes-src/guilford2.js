// Guilford Courthouse, 15 March 1781: Greene's three lines, the British advance, Maryland and Washington's counterattack, grapeshot, a costly British victory.
const B = Battle();
const { P, at } = B;
const END = B.T.duration;
// ---------- projection (assets/guilford.json: zoom 16, origin 4666261, 6579752; 1.93 m/px) ----------
const G0 = (lat, lon) => {
  const n = 256 * 2 ** 16, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 4666261).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 6579752).toFixed(1)];
};
// battlefield drawn with north-south distances compressed to 62 % so all three lines fit on screen
const G = (lat, lon) => G0(36.1318 + (lat - 36.1318) * 0.62, lon);
const GL = (arr) => arr.map(([la, lo]) => G(la, lo));
const NS = "http://www.w3.org/2000/svg";
const svgEl = document.getElementById("overlay"), pinsEl = document.getElementById("pins");
const U = (o) => {
  const el = B.unit(o);
  const tg = el.querySelector(".tag");
  if (tg) Object.assign(tg.style, { fontSize: (o.fs || 16) + "px", padding: "0 6px", marginTop: "3px" });
  return el;
};
const STK = (o) => {
  const el = B.portraitStake(o);
  const nm = el.querySelector(".nm");
  if (nm) nm.style.fontSize = (o.fs || 14) + "px";
  if (o.side === "rome") { el.querySelector(".face").style.boxShadow = "0 0 0 3px #c4121f, 0 6px 12px rgba(0,0,0,0.5)"; if (nm) nm.style.background = "#c4121f"; }
  return el;
};

// ---------- times ----------
const T_GREENE = at("gui-3", "Greene turned to fight"), T_4400 = at("gui-3", "He had around"), T_2000 = at("gui-3", "Cornwallis had around");
const T_FINEST = at("gui-3", "finest regulars"), T_ADV = at("gui-3", "just as Morgan"), T_3L = at("gui-3", "three lines"), T_FLK = at("gui-3", "riflemen and cavalry");
const S4 = P("gui-4"), T_FLUKE = at("gui-4", "a fluke"), T_FORM = at("gui-4", "He formed his regulars"), T_MARCH = at("gui-4", "marched them straight");
const S5 = P("gui-5"), T_TWO = at("gui-5", "two volleys"), T_FIRED = at("gui-5", "Most of them fired"), T_BROKE = at("gui-5", "broke for the rear");
const T_RIFLE = at("gui-5", "But the riflemen"), T_WOODS = at("gui-5", "the second line");
const S6 = P("gui-6"), T_OUT = at("gui-6", "came out of the woods"), T_EXH = at("gui-6", "exhausted and disorganized");
const T_MD = at("gui-6", "The veteran First Maryland"), T_WASH = at("gui-6", "William Washington"), T_GUARDS = at("gui-6", "British Guards");
const T_GRAPE = at("gui-6", "grapeshot"), T_OWN = at("gui-6", "killing some");
const S7 = P("gui-7"), T_WITH = at("gui-7", "withdrew in good order"), T_HELD = at("gui-7", "Cornwallis held the field"), T_PAPER = at("gui-7", "On paper");
const T_QUART = at("gui-7", "more than a quarter"), T_LONDON = at("gui-7", "In London"), T_RUIN = at("gui-7", "another such victory");

// ---------- camera ----------
B.camera([
  [0, 1080, 810, 1.0],
  [T_GREENE + 2, 1100, 800, 1.2],
  [T_2000, 1030, 810, 1.3],
  [T_3L - 1, 1180, 800, 1.35],
  [S4 - 0.3, 1170, 800, 1.35],
  [T_FORM, 1010, 810, 1.5],
  [S5, 1080, 810, 1.6],
  [T_BROKE, 1140, 810, 1.6],
  [T_WOODS, 1220, 800, 1.6],
  [S6 + 1, 1320, 790, 1.8],
  [T_MD, 1370, 790, 2.1],
  [T_WASH + 2, 1360, 790, 2.15],
  [T_GRAPE + 1, 1310, 800, 1.95],
  [S7 + 0.5, 1320, 720, 1.45],
  [T_QUART, 1280, 740, 1.35],
  [END, 1260, 740, 1.3],
]);

// ---------- terrain: woods, road, fence ----------
svgEl.insertAdjacentHTML("afterbegin", `<defs><pattern id="trees" width="34" height="30" patternUnits="userSpaceOnUse">
  <circle cx="9" cy="9" r="7" fill="rgba(58,78,40,0.34)"/><circle cx="26" cy="22" r="6.5" fill="rgba(58,78,40,0.3)"/><circle cx="25" cy="5" r="4" fill="rgba(58,78,40,0.22)"/></pattern></defs>`);
const WOODS = GL([[36.1412, -79.8502], [36.1406, -79.8470], [36.1413, -79.8441], [36.1386, -79.8437], [36.1362, -79.8442], [36.1326, -79.8438], [36.1292, -79.8443], [36.1252, -79.8436], [36.1206, -79.8446], [36.1210, -79.8476], [36.1205, -79.8503], [36.1240, -79.8498], [36.1280, -79.8501], [36.1322, -79.8496], [36.1362, -79.8500]]);
const wpoly = WOODS.map((p) => p.join(",")).join(" ");
const woodsG = document.createElementNS(NS, "g");
woodsG.innerHTML = `<polygon points="${wpoly}" fill="rgba(86,104,58,0.20)"/><polygon points="${wpoly}" fill="url(#trees)" stroke="rgba(58,78,40,0.45)" stroke-width="3" stroke-dasharray="10 6"/>`;
svgEl.insertBefore(woodsG, svgEl.children[1]);
const ROAD = GL([[36.1262, -79.8700], [36.1282, -79.8620], [36.1298, -79.8545], [36.1310, -79.8495], [36.1321, -79.8455], [36.1330, -79.8425], [36.1336, -79.8405], [36.1348, -79.8360], [36.1372, -79.8290]]);
const REEDY = GL([[36.1336, -79.8405], [36.1375, -79.8393], [36.1430, -79.8376], [36.1500, -79.8362], [36.1560, -79.8350]]);
const roadPath = (pts) => { // simple polyline road: dark casing + light core
  const d = "M " + pts.map((p) => p.join(" ")).join(" L ");
  const g = document.createElementNS(NS, "g");
  g.innerHTML = `<path d="${d}" fill="none" stroke="rgba(92,66,38,0.75)" stroke-width="13" stroke-linejoin="round" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#dcc9a0" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>`;
  svgEl.insertBefore(g, svgEl.children[2]);
};
roadPath(ROAD); roadPath(REEDY);
// rail fence in front of the first line
const FENCE = GL([[36.1250, -79.8500], [36.1290, -79.8502], [36.1330, -79.8499], [36.1370, -79.8503]]);
const fence = document.createElementNS(NS, "path");
fence.setAttribute("d", "M " + FENCE.map((p) => p.join(" ")).join(" L "));
Object.entries({ fill: "none", stroke: "#5c4226", "stroke-width": 5, "stroke-dasharray": "14 6" }).forEach(([k, v]) => fence.setAttribute(k, v));
svgEl.appendChild(fence);
gsap.set(fence, { autoAlpha: 0 }); B.tl.to(fence, { autoAlpha: 1, duration: 0.8 }, T_3L);

B.label("NEW GARDEN ROAD", ...G(36.1268, -79.8645), { cls: "tg", size: 20, rot: -14, t: 1.0, anchor: [-50, -50] });
B.label("OPEN FIELDS", ...G(36.1345, -79.8565), { cls: "tg", size: 26, t: 1.4, until: T_FORM, anchor: [-50, -50] });
B.label("HOSKINS FARM", ...G(36.1283, -79.8538), { cls: "tg", size: 17, t: 1.6, until: T_FORM, anchor: [-50, -50] });
B.label("THICK WOODS", ...G(36.1300, -79.8472), { cls: "tg", size: 24, t: 1.8, until: T_3L - 0.3, anchor: [-50, -50] });
B.label("TO REEDY FORK", ...G(36.1455, -79.8352), { cls: "tg", size: 16, t: 2.0, rot: -75, anchor: [-50, -50] });
// the courthouse
const CH = G(36.1336, -79.8405);
const house = document.createElement("div");
house.style.cssText = `position:absolute;left:${CH[0] - 14}px;top:${CH[1] - 14}px;width:28px;height:28px;background:#5a3d22;border:3px solid #f3eee2;box-shadow:0 3px 6px rgba(0,0,0,.5)`;
pinsEl.appendChild(house); gsap.set(house, { autoAlpha: 0 }); B.tl.to(house, { autoAlpha: 1, duration: 0.5 }, 0.8);
B.label("GUILFORD COURTHOUSE", CH[0] + 22, CH[1] + 4, { cls: "tg", size: 20, t: 0.8, anchor: [0, -50] });

// ---------- title, date, forces ----------
B.title("NORTH CAROLINA", "GUILFORD COURTHOUSE", "15 March 1781", 0.3, 4.6);
B.showDate(0.3);
B.date("15 MARCH 1781", 0.5);
B.stat([`<span style="color:var(--carth-light)">GREENE ~4,400</span> &nbsp;·&nbsp; <span style="color:#f08a84">CORNWALLIS ~2,000</span>`], T_4400 + 0.6, T_ADV - 0.4);
B.caption("AMONG THE FINEST REGULARS IN THE BRITISH ARMY", T_FINEST - 0.2, T_ADV - 0.2, "rome");

// ---------- stakes ----------
const sGreene = STK({ img: "assets/media/greene_head.png", flag: "assets/media/us_flag_13star.png", name: "GREENE", ...{ x: G(36.1362, -79.8402)[0], y: G(36.1362, -79.8402)[1] }, size: 0.75, fs: 15, t: T_4400 - 0.3 });
const CST = G(36.1235, -79.8590);
const sCorn = STK({ img: "assets/media/cornwallis_head.png", flag: "assets/media/gb_flag_1707.png", name: "CORNWALLIS", side: "rome", x: CST[0], y: CST[1], size: 0.75, fs: 15, t: T_2000 - 0.2 });

// ---------- American lines ----------
const V = { w: 30, h: 48 };
const AM = {
  nc1: { p: [36.1334, -79.8493], label: "N.C. MILITIA", t: T_3L + 0.2 },
  nc2: { p: [36.1283, -79.8493], label: "N.C. MILITIA", t: T_3L + 0.4 },
  va1: { p: [36.1346, -79.8455], label: "VA MILITIA", t: T_3L + 1.3 },
  va2: { p: [36.1296, -79.8455], label: "VA MILITIA", t: T_3L + 1.5 },
  md2: { p: [36.1316, -79.8431], label: "2ND MD", t: T_3L + 2.4 },
  md1: { p: [36.1342, -79.8428], label: "1ST MARYLAND", t: T_3L + 2.6 },
  vc1: { p: [36.1366, -79.8427], label: "VIRGINIA CONT.", t: T_3L + 2.8 },
  vc2: { p: [36.1390, -79.8429], label: "VIRGINIA CONT.", t: T_3L + 3.0 },
  wash: { p: [36.1378, -79.8480], label: "WASHINGTON", kind: "cav", w: 50, h: 32, t: T_FLK + 0.6 },
  lynch: { p: [36.1360, -79.8492], label: "LYNCH · DELAWARE", kind: "light", w: 44, h: 30, t: T_FLK + 0.3 },
  lee: { p: [36.1244, -79.8480], label: "LEE'S LEGION", kind: "cav", w: 50, h: 32, t: T_FLK + 0.9 },
  camp: { p: [36.1262, -79.8491], label: "CAMPBELL'S RIFLES", kind: "light", w: 44, h: 30, t: T_FLK + 0.1 },
};
Object.entries(AM).forEach(([id, u]) => U({ id, side: "carth", kind: u.kind || "inf", x: G(...u.p)[0], y: G(...u.p)[1], w: u.w || V.w, h: u.h || V.h, label: u.label, fs: 16, t: u.t }));
const LAB = (txt, lat, lon, t, until) => B.label(txt, ...G(lat, lon), { cls: "tg", size: 20, t, until, anchor: [-50, -50] });
LAB("1ST LINE", 36.1396, -79.8493, T_3L + 0.2, S5 + 2);
LAB("2ND LINE", 36.1368, -79.8455, T_3L + 1.3, T_RIFLE);
LAB("3RD LINE", 36.1412, -79.8428, T_3L + 2.4, S6);
B.caption("THREE LINES · RIFLEMEN AND CAVALRY ON THE FLANKS", T_3L + 0.4, S4 - 0.2, "carth");

// ---------- British ----------
const BR = {
  r33: { p0: [36.1300, -79.8615], p: [36.1342, -79.8545], label: "33RD" },
  r23: { p0: [36.1296, -79.8603], p: [36.1320, -79.8545], label: "23RD" },
  r71: { p0: [36.1292, -79.8591], p: [36.1278, -79.8545], label: "71ST" },
  bose: { p0: [36.1288, -79.8579], p: [36.1256, -79.8545], label: "VON BOSE" },
  guards: { p0: [36.1303, -79.8633], p: [36.1304, -79.8574], label: "GUARDS", w: 70, h: 34 },
};
Object.entries(BR).forEach(([id, u], i) => U({ id, side: "rome", kind: "inf", x: G(...u.p0)[0], y: G(...u.p0)[1], w: u.w || 30, h: u.h || 30, label: u.label, fs: 16, t: T_2000 + 0.2 + i * 0.15 }));
U({ id: "guns", side: "rome", kind: "light", x: G(36.1289, -79.8580)[0], y: G(36.1289, -79.8580)[1], w: 30, h: 20, label: "GUNS", fs: 14, t: T_2000 + 1.0 });
// deploy into lines in the open fields (lines are north-south: tall blocks)
Object.entries(BR).forEach(([id, u], i) => {
  const [x, y] = G(...u.p);
  B.move(id, T_FORM - 1.2 + i * 0.12, 2.4, x, y);
  if (id !== "guards") B.tl.to(B.units[id].el.querySelector(".blk"), { height: 48, duration: 1.0 }, T_FORM + 0.4);
});
B.move("guns", T_FORM, 2.0, ...G(36.1302, -79.8530));
B.caption("REGULARS FORMED IN THE OPEN FIELDS", T_FORM, S5 - 0.2, "rome");
const bub = B.bubble("“COWPENS WAS A FLUKE.”", CST[0] - 150, CST[1] - 340, T_FLUKE - 0.8, T_FORM + 0.3);
bub.style.fontSize = "24px";
// advance to the fence line
const ADV1 = { r33: [36.1342, -79.8515], r23: [36.1320, -79.8515], r71: [36.1278, -79.8515], bose: [36.1256, -79.8515], guards: [36.1305, -79.8548] };
Object.entries(ADV1).forEach(([id, p], i) => B.move(id, T_MARCH + i * 0.1, S5 + 5.5 - T_MARCH, ...G(...p), "sine.inOut"));
B.move("guns", T_MARCH + 0.3, 4, ...G(36.1305, -79.8520));
const redArrows1 = false &&  [[36.1331, -79.8538], [36.1267, -79.8538]].map(([la, lo], i) =>
  B.arrow({ side: "rome", pts: GL([[la, lo], [la, lo + 0.0019]]), width: 16, t: T_MARCH + 0.2 + i * 0.3, dur: 1.4, until: T_BROKE + 1 }));

// ---------- volleys / fire helpers ----------
const flashes = (pts, t, reps = 2) => pts.forEach(([x, y], i) => {
  const f = document.createElement("div");
  f.style.cssText = `position:absolute;left:${x - 18}px;top:${y - 18}px;width:36px;height:36px;border-radius:50%;background:radial-gradient(circle, #fff6c8 0%, #ffb640 40%, rgba(255,120,20,0) 72%)`;
  pinsEl.appendChild(f); gsap.set(f, { autoAlpha: 0 });
  for (let k = 0; k < reps; k++) {
    const tt = t + k * 0.9 + (i % 3) * 0.08;
    B.tl.fromTo(f, { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1.3, duration: 0.15, immediateRender: false }, tt);
    B.tl.to(f, { autoAlpha: 0, scale: 0.8, duration: 0.45 }, tt + 0.15);
  }
});
const lineFlash = (lat0, lat1, lon, t, n = 5, reps = 2) => flashes(Array.from({ length: n }, (_, i) => G(lat0 + (lat1 - lat0) * i / (n - 1), lon)), t, reps);
const fire = (a, b, t, until) => B.line(GL([a, b]), { color: "#ffb640", width: 4, dash: "12 8", t, dur: 0.6, until });
const shrink = (ids, t, s) => ids.forEach((id) => B.tl.to(B.units[id].el, { scale: s, duration: 1.2 }, t));

// ---------- gui-5: militia volley, withdraw; riflemen; the woods ----------
B.caption("“TWO VOLLEYS, AND THEN YOU CAN GO”", T_TWO - 0.5, T_FIRED - 0.1, "carth");
lineFlash(36.1270, 36.1348, -79.8500, T_FIRED - 0.2, 6, 2);
shrink(["r33", "r23", "r71", "bose"], T_FIRED + 0.4, 0.9);
// most of the militia break for the rear through the woods
["nc1", "nc2"].forEach((id, i) => { B.move(id, T_BROKE + i * 0.2, 3.2, ...G(i ? 36.1262 : 36.1350, -79.8410)); B.show(id, T_BROKE + 1.8, 0.0); });
B.caption("MOST FIRE ONCE · THEN BREAK FOR THE REAR", T_FIRED + 0.3, T_RIFLE - 0.1);
// British push into the woods towards the second line
const ADV2 = { r33: [36.1348, -79.8474], r23: [36.1322, -79.8474], r71: [36.1284, -79.8474], bose: [36.1262, -79.8474], guards: [36.1308, -79.8505] };
Object.entries(ADV2).forEach(([id, p], i) => B.move(id, T_BROKE + 0.8 + i * 0.1, S6 - T_BROKE - 1.2, ...G(...p), "sine.inOut"));
B.move("guns", T_BROKE + 1.0, 5, ...G(36.1310, -79.8495));
// flank riflemen keep shooting into the British flanks, falling back slowly
B.move("lynch", T_RIFLE, 8, ...G(36.1372, -79.8462)); B.move("wash", T_RIFLE, 8, ...G(36.1392, -79.8445));
B.move("camp", T_RIFLE, 8, ...G(36.1246, -79.8462)); B.move("lee", T_RIFLE, 8, ...G(36.1230, -79.8448));
[[T_RIFLE + 0.2, [36.1360, -79.8488], [36.1346, -79.8508]], [T_RIFLE + 0.5, [36.1262, -79.8487], [36.1266, -79.8508]],
 [T_RIFLE + 3.6, [36.1370, -79.8466], [36.1352, -79.8484]], [T_RIFLE + 3.9, [36.1248, -79.8466], [36.1258, -79.8484]]]
  .forEach(([t, a, b]) => fire(a, b, t, t + 2.6));
B.caption("RIFLEMEN ON THE FLANKS KEEP FIRING", T_RIFLE, T_WOODS - 0.1, "carth");
lineFlash(36.1285, 36.1355, -79.8458, T_WOODS + 0.3, 5, 3);
shrink(["r33", "r23", "r71", "bose"], T_WOODS + 0.5, 0.78);
shrink(["guards"], T_WOODS + 0.5, 0.9);
B.caption("THE SECOND LINE MAKES THEM FIGHT FOR EVERY YARD", T_WOODS + 0.2, S6 - 0.1, "carth");

// ---------- gui-6: out of the woods; Maryland and Washington; grapeshot ----------
["va1", "va2"].forEach((id, i) => { B.move(id, S6 + 0.2 + i * 0.2, 3.0, ...G(i ? 36.1270 : 36.1380, -79.8405)); B.show(id, S6 + 2.4, 0); });
B.hideUnits(["lynch", "camp"], S6 + 0.5, 1.0);
const OUT = { r33: [36.1360, -79.8446], r23: [36.1330, -79.8449], r71: [36.1290, -79.8444], bose: [36.1255, -79.8452], guards: [36.1316, -79.8449] };
Object.entries(OUT).forEach(([id, p], i) => {
  B.move(id, T_OUT + i * 0.15, 3.4, ...G(...p), "power1.out");
  B.tl.to(B.units[id].el.querySelector(".blk"), { rotate: [-14, 10, -8, 12, 6][i], duration: 1.4 }, T_OUT + 0.6);
});
B.move("guards", T_EXH, 2.0, ...G(36.1318, -79.8445));
B.caption("EXHAUSTED AND DISORGANIZED", T_EXH - 0.2, T_MD - 0.1, "rome");
// 1st Maryland counterattack with the bayonet; Washington's cavalry into the Guards
B.arrow({ side: "carth", pts: GL([[36.1342, -79.8424], [36.1330, -79.8431], [36.1322, -79.8440]]), width: 16, t: T_MD, dur: 1.2, until: T_GRAPE });
B.move("md1", T_MD + 0.3, 1.6, ...G(36.1330, -79.8432));
B.move("wash", T_MD - 1.5, 2.0, ...G(36.1372, -79.8432));
B.arrow({ side: "carth", pts: GL([[36.1368, -79.8432], [36.1345, -79.8438], [36.1326, -79.8442]]), width: 16, t: T_WASH + 0.3, dur: 1.3, until: T_GRAPE });
B.move("wash", T_WASH + 0.4, 1.6, ...G(36.1334, -79.8442));
lineFlash(36.1310, 36.1335, -79.8436, T_MD + 0.4, 3, 3);
B.caption("1ST MARYLAND AND WASHINGTON'S CAVALRY HIT THE GUARDS", T_MD + 0.3, T_GRAPE - 0.3, "carth");
shrink(["guards"], T_GUARDS, 0.72);
// grapeshot into the melee
const GUNP = G(36.1318, -79.8468);
B.move("guns", T_GRAPE - 2.4, 1.6, ...GUNP);
[[36.1336, -79.8440], [36.1326, -79.8438], [36.1316, -79.8440]].forEach((p, i) =>
  B.arrow({ side: "rome", pts: [[GUNP[0] + 18, GUNP[1] - 4 + (i - 1) * 6], G(...p)], width: 6, dash: "10 7", t: T_GRAPE + i * 0.15, dur: 0.6, until: S7 + 0.4 }));
flashes([[GUNP[0] + 16, GUNP[1]]], T_GRAPE - 0.1, 4);
flashes(GL([[36.1334, -79.8440], [36.1322, -79.8437], [36.1328, -79.8444]]), T_GRAPE + 0.5, 3);
B.caption("GRAPESHOT INTO HIS OWN MEN", T_GRAPE - 0.1, S7 - 0.2, "rome");
B.grey(["wash"], T_OWN + 0.6, 0.6); B.tl.to(B.units.wash.el, { opacity: 0, duration: 0.8 }, T_OWN + 2.5);
B.move("md1", T_OWN + 0.8, 2.0, ...G(36.1342, -79.8428));
{ const [x, y] = G(36.1296, -79.8488); B.tl.to(sCorn, { left: x - parseFloat(sCorn.style.width) / 2, top: y - parseFloat(sCorn.style.height), duration: 2.5 }, T_GRAPE - 3.5); }

// ---------- gui-7: Greene withdraws; Cornwallis holds the field ----------
["md1", "md2", "vc1", "vc2"].forEach((id, i) => B.move(id, T_WITH + 0.3 + i * 0.15, 5.5, ...G(36.1420 + i * 0.0022, -79.8378 + (i % 2) * 0.0012)));
B.hideUnits(["md1", "md2", "vc1", "vc2", "lee"], T_PAPER + 3, 1.2);
B.arrow({ side: "carth", pts: GL([[36.1350, -79.8420], [36.1400, -79.8388], [36.1470, -79.8368]]), width: 20, t: T_WITH - 0.2, dur: 2.2, until: END + 1 });
B.tl.to(sGreene, { left: G(36.1405, -79.8396)[0] - parseFloat(sGreene.style.width) / 2, top: G(36.1405, -79.8396)[1] - parseFloat(sGreene.style.height), duration: 5.5 }, T_WITH + 0.3);
B.caption("GREENE WITHDRAWS IN GOOD ORDER", T_WITH, T_HELD - 0.1, "carth");
const HOLD = { r33: [36.1372, -79.8425], r23: [36.1350, -79.8423], r71: [36.1300, -79.8426], bose: [36.1276, -79.8432], guards: [36.1325, -79.8424] };
Object.entries(HOLD).forEach(([id, p], i) => {
  B.move(id, T_HELD - 0.4 + i * 0.1, 3.0, ...G(...p));
  B.tl.to(B.units[id].el.querySelector(".blk"), { rotate: 0, duration: 1.0 }, T_HELD);
});
B.caption("CORNWALLIS HOLDS THE FIELD", T_HELD, T_QUART - 0.3, "rome");
B.stat([`BRITISH ~530 CASUALTIES`, `<span style="color:#f08a84">MORE THAN 1 IN 4</span>`], T_QUART - 0.2, T_LONDON + 0.3, "rome");
shrink(["r33", "r23", "r71", "bose", "guards"], T_QUART, 0.72);
B.caption("“ANOTHER SUCH VICTORY WOULD RUIN THE BRITISH ARMY”", T_RUIN - 0.3, END + 1, "rome");
