// Move 1 opener: Burgoyne comes down from Canada, summer 1777. Hudson map (z8). British = red ("rome").
const B = Battle();
const { P, at } = B;
const END = B.T.duration;

// ---------- projection (assets/hudson.json: zoom 8, origin 17929, 23045) ----------
const G = (lat, lon) => {
  const n = 256 * 2 ** 8, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 17929).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 23045).toFixed(1)];
};
const GL = (arr) => arr.map(([la, lo]) => G(la, lo));

const T_ARMY = at("sar-1", "A British army"), T_7000 = at("sar-1", "seven thousand"), T_BURG = at("sar-1", "General John Burgoyne");
const T_CAN = at("sar-1", "out of Canada"), T_LAKE = at("sar-1", "along Lake Champlain"), T_HUD = at("sar-1", "toward the Hudson");
const T_ALB = at("sar-1", "Its goal is Albany"), T_IF = at("sar-1", "If Burgoyne"), T_NE = at("sar-1", "New England"), T_SPLIT = at("sar-1", "split in two");

const STJ = G(45.31, -73.26), TIC = G(43.84, -73.39), SKN = G(43.55, -73.40), FED = G(43.27, -73.58), SAR = G(43.0, -73.63), ALB = G(42.65, -73.75), MTL = G(45.5, -73.57);

// ---------- camera ----------
B.camera([
  [0, 1440, 810, 0.72],
  [T_ARMY - 0.3, 1440, 760, 0.8],
  [T_7000 + 0.4, 1480, 560, 1.45],
  [T_CAN + 0.6, 1470, 620, 1.45],
  [T_HUD + 0.6, 1455, 860, 1.4],
  [T_ALB + 1.2, 1440, 960, 1.45],
  [T_NE + 0.6, 1520, 930, 0.9],
  [END, 1510, 920, 0.95],
]);

// ---------- base ----------
B.image("assets/hudson_water.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
B.title("MOVE 1", "SARATOGA", "September 1777", 0.3, T_ARMY + 0.4);
B.showDate(0.5);
B.date("SUMMER 1777", 0.7);

B.label("BRITISH CANADA", 1720, 330, { cls: "country", size: 44, t: 1.2, until: T_BURG - 0.4 });
B.city("MONTREAL", MTL[0], MTL[1], { left: true, size: 30, r: 8, t: 1.6, until: T_ALB });
B.label("LAKE CHAMPLAIN", 1452, 690, { cls: "river", size: 26, rot: -90, t: T_LAKE - 0.8, until: T_NE, anchor: [-50, -50] });
B.label("LAKE GEORGE", 1410, 880, { cls: "river", size: 18, rot: -62, t: T_HUD - 1.0, until: T_NE, anchor: [-50, -50] });
B.label("HUDSON RIVER", 1396, 1210, { cls: "river", size: 22, rot: -84, t: T_HUD, anchor: [-50, -50] });

// ---------- Burgoyne's army comes down the lake ----------
const route = [STJ, [STJ[0] - 10, 560], [1492, 700], [TIC[0] + 6, TIC[1] - 20], [SKN[0] + 2, SKN[1]], [FED[0] + 2, FED[1] + 4], [SAR[0] + 4, SAR[1] + 10], [ALB[0] + 8, ALB[1] - 12]];
const arrow = B.arrow({ side: "rome", pts: route, width: 20, t: T_CAN - 0.4, dur: T_ALB - T_CAN + 0.8 });
B.highlight(GL([[45.05, -73.35], [44.7, -73.35], [44.3, -73.33], [43.95, -73.4], [43.6, -73.41]]), T_LAKE - 0.2, T_ALB, 34);
B.highlight(GL([[43.3, -73.6], [43.05, -73.62], [42.8, -73.68], [42.65, -73.75], [42.3, -73.8]]), T_HUD - 0.1, T_ALB, 30);
const army = [[-40, 0], [0, 0], [40, 0]];
army.forEach(([dx, dy], i) => {
  B.unit({ id: "bg" + i, side: "rome", x: STJ[0] + dx + 30, y: STJ[1] - 30 + dy, w: 36, h: 24, t: T_7000 - 0.4 + i * 0.2 });
});
B.label("~7,000 MEN", STJ[0] + 100, STJ[1] - 30, { cls: "tg", size: 22, t: T_7000 + 0.2, until: T_BURG, anchor: [0, -50] });
// the column slides down Lake Champlain and stops short of Albany, at Saratoga
const stops = [[TIC[0] + 44, TIC[1] - 30], [FED[0] + 44, FED[1] - 10], [SAR[0] + 46, SAR[1]]];
stops.forEach((p, k) => army.forEach(([dx], i) => {
  const T0 = [T_CAN + 0.8, T_CAN + 3.4, T_CAN + 5.5][k] + i * 0.12;
  B.move("bg" + i, T0, [2.4, 2.0, 2.0][k], p[0] + (i - 1) * 14, p[1] + (i - 1) * 20);
}));

// commander: portrait stake if the image exists, else a plaque
const hasHead = true, hasFlag = true;
if (hasHead) {
  const st = B.portraitStake({ img: "assets/media/burgoyne_head.png", flag: hasFlag ? "assets/media/gb_flag_1707.png" : "", name: "BURGOYNE · ~7,000", x: STJ[0] + 150, y: STJ[1] + 130, size: 0.9, t: T_BURG - 0.2, until: T_HUD });
  st.querySelector(".face").style.boxShadow = "0 0 0 3px #c4121f, 0 6px 12px rgba(0,0,0,0.5)";
  st.querySelector(".nm").style.background = "#c4121f";
  if (!hasFlag) st.querySelector(".flag").remove();
} else {
  B.plaque({ side: "rome", name: "GEN. JOHN BURGOYNE", role: "~7,000 British & German troops", x: STJ[0] + 110, y: STJ[1] + 200, t: T_BURG - 0.2, until: T_HUD });
}

// ---------- places along the way ----------
B.city("FORT TICONDEROGA", TIC[0], TIC[1], { left: true, size: 24, r: 7, t: T_LAKE + 0.6, until: T_NE, dy: -14 });
B.city("SARATOGA", SAR[0], SAR[1], { left: true, size: 30, r: 7, t: T_HUD + 0.6 });
B.city("ALBANY", ALB[0], ALB[1], { left: true, size: 34, r: 10, t: T_ALB - 0.4 });
// Albany: goal ring
const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
ring.setAttribute("cx", ALB[0]); ring.setAttribute("cy", ALB[1]); ring.setAttribute("r", 30);
ring.setAttribute("fill", "none"); ring.setAttribute("stroke", "#c4121f"); ring.setAttribute("stroke-width", 6); ring.setAttribute("stroke-dasharray", "12 8");
document.getElementById("overlay").appendChild(ring);
gsap.set(ring, { autoAlpha: 0, transformOrigin: "50% 50%" });
B.tl.fromTo(ring, { autoAlpha: 0, scale: 2.2 }, { autoAlpha: 1, scale: 1, duration: 0.7, ease: "power2.out" }, T_ALB);
B.tl.to(ring, { rotation: 90, duration: END - T_ALB, ease: "none" }, T_ALB);
B.caption("THE GOAL: ALBANY", T_ALB + 0.2, T_IF - 0.1, "rome");

// ---------- New England cut off ----------
B.image("assets/hudson_newengland.png", 0, 0, 2880, 1620, { t: T_NE - 0.3, dur: 1.0 });
B.label("NEW ENGLAND", ...G(43.9, -71.4), { cls: "country", size: 52, t: T_NE });
B.label("REST OF THE COLONIES", ...G(42.75, -76.2), { cls: "country", size: 40, t: T_NE + 1.0 });
B.city("NEW YORK", ...G(40.71, -74.0), { left: true, size: 26, r: 7, t: T_NE + 0.4 });
B.city("BOSTON", ...G(42.36, -71.06), { size: 26, r: 7, t: T_NE + 0.6 });
// the cut: a red dashed line down the Champlain-Hudson corridor
const cut = B.arrow({ side: "rome", pts: GL([[45.2, -73.3], [44.3, -73.34], [43.6, -73.42], [43.1, -73.6], [42.4, -73.77], [41.6, -73.95], [40.95, -73.92]]), width: 10, dash: "26 16", head: false, t: T_NE + 0.2 });
B.tl.fromTo(cut, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, immediateRender: false }, T_NE + 0.21);
B.caption("NEW ENGLAND CUT OFF · THE REBELLION SPLIT IN TWO", T_NE + 1.2, END, "rome");
B.finish();
