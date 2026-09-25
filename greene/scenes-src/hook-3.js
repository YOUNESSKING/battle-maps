// Hook 3: Greene vs Cornwallis across the Carolinas, 1780-81; ends on "three greatest tactical moves".
const B = Battle();
const { P, at, tl } = B;
const END = B.T.duration;
const K = "hook-3";
const pins = document.getElementById("pins"), svg = document.getElementById("overlay");

const G = (lat, lon) => { // assets/greene_south.json (zoom 8)
  const n = 256 * 2 ** 8, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 16709).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 25369).toFixed(1)];
};
const PL = {
  charleston: G(32.78, -79.93), camden: G(34.25, -80.61), ninety6: G(34.17, -82.02), augusta: G(33.47, -81.97),
  savannah: G(32.08, -81.09), charlotte: G(35.23, -80.84), wilmington: G(34.23, -77.94), georgetown: G(33.37, -79.28),
  winnsboro: G(34.38, -81.09), guilford: G(36.07, -79.84), dan: G(36.70, -78.90), eutaw: G(33.40, -80.30), cheraw: G(34.70, -79.88),
};

// ---------- helpers ----------
const glow = (x, y, t, until) => { // pulsing red halo under an outpost
  const el = document.createElement("div");
  el.style.cssText = `position:absolute;left:${x - 60}px;top:${y - 60}px;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle, rgba(230,40,40,0.75) 0%, rgba(230,40,40,0.25) 45%, rgba(230,40,40,0) 70%);`;
  pins.insertBefore(el, pins.firstChild);
  gsap.set(el, { autoAlpha: 0 });
  tl.to(el, { autoAlpha: 1, duration: 0.5 }, t);
  tl.fromTo(el, { scale: 0.7 }, { scale: 1.25, duration: 0.8, yoyo: true, repeat: 5, ease: "sine.inOut" }, t);
  tl.to(el, { autoAlpha: 0, duration: 0.5 }, until);
};
const battle = (x, y, t, until) => { // crossed-swords style marker: dark disc with a red X
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.innerHTML = `<circle cx="${x}" cy="${y}" r="19" fill="#1b1812" stroke="#f7f3ea" stroke-width="4"/>
    <path d="M ${x - 9} ${y - 9} L ${x + 9} ${y + 9} M ${x + 9} ${y - 9} L ${x - 9} ${y + 9}" stroke="#e3232f" stroke-width="6" stroke-linecap="round"/>`;
  svg.appendChild(g);
  gsap.set(g, { autoAlpha: 0, transformOrigin: `${x}px ${y}px` });
  tl.fromTo(g, { autoAlpha: 0, scale: 2.2 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(2)" }, t);
  tl.to(g, { autoAlpha: 0, duration: 0.5 }, until);
};
const numMark = (n, x, y, t) => { // numbered blue disc
  const el = document.createElement("div");
  el.textContent = n;
  el.style.cssText = `position:absolute;left:${x - 30}px;top:${y - 30}px;width:60px;height:60px;border-radius:50%;background:var(--carth);border:4px solid #f7f3ea;color:#fff;font-weight:700;font-size:36px;line-height:52px;text-align:center;box-shadow:0 4px 10px rgba(0,0,0,0.5);`;
  pins.appendChild(el);
  gsap.set(el, { autoAlpha: 0 });
  tl.fromTo(el, { autoAlpha: 0, scale: 2.4 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2.2)" }, t);
  return el;
};

// ---------- times ----------
const T_NINE = at(K, "Over the next"), T_CORN = at(K, "Cornwallis and his"), T_ACROSS = at(K, "across the Carolinas");
const T_LOSE = at(K, "lose almost"), T_BY = at(K, "And by the end"), T_DRIVEN = at(K, "driven out"), T_PENNED = at(K, "penned into");
const T_YORK = at(K, "Cornwallis himself"), T_SO = at(K, "So how"), T_THREE = at(K, "three greatest");

// ---------- camera ----------
B.camera([
  [0, 1330, 580, 1.35],
  [T_NINE, 1320, 570, 1.5],
  [T_CORN + 1.2, 1320, 580, 1.5],
  [T_ACROSS + 0.8, 1450, 620, 0.98],
  [T_LOSE + 1.6, 1450, 640, 0.95],
  [T_BY, 1440, 760, 0.94],
  [T_PENNED - 0.3, 1440, 900, 0.92],
  [T_YORK + 0.2, 1460, 880, 0.92],
  [T_YORK + 2.8, 1600, 640, 0.86],
  [T_SO + 1.0, 1540, 620, 0.86],
  [END, 1500, 600, 1.08],
]);

// ---------- base ----------
B.image("assets/gs_borders.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
const brit = B.image("assets/gs_brit.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
tl.to(brit, { opacity: 0.7, duration: 0.01 }, 0.02);
tl.to(brit, { opacity: 0, duration: 2.2 }, T_DRIVEN);
B.showDate(0.2);
B.date("DECEMBER 1780", 0.4, T_NINE + 0.6);
B.date("1781", T_NINE + 0.9);
B.label("NORTH CAROLINA", ...G(35.3, -77.55), { cls: "country", size: 46, t: T_ACROSS });
B.label("SOUTH CAROLINA", ...G(33.72, -80.55), { cls: "country", size: 42, t: 0.8, until: T_SO });
B.label("VIRGINIA", ...G(37.05, -79.6), { cls: "country", size: 46, t: 1.0 });

// ---------- the two commanders ----------
B.city("CHARLOTTE", ...PL.charlotte, { size: 24, r: 7, t: 0.3, until: T_ACROSS });
B.city("WINNSBORO", ...PL.winnsboro, { size: 24, r: 7, left: true, t: 1.8, until: T_ACROSS });
B.portraitStake({ img: "assets/media/greene_head.png", flag: "assets/media/us_flag_13star.png", name: "GREENE", x: PL.charlotte[0], y: PL.charlotte[1], size: 0.85, t: 0.6, until: T_ACROSS });
B.portraitStake({ img: "assets/media/cornwallis_head.png", flag: "assets/media/gb_flag_1606.png", name: "CORNWALLIS", x: PL.winnsboro[0], y: PL.winnsboro[1], size: 0.85, t: T_CORN - 0.5, until: T_ACROSS });
document.querySelectorAll(".gstake")[1].querySelectorAll(".face").forEach((f) => (f.style.boxShadow = "0 0 0 3px #c4121f, 0 6px 12px rgba(0,0,0,0.5)"));
document.querySelectorAll(".gstake")[1].querySelectorAll(".nm").forEach((f) => (f.style.background = "#c4121f"));

// ---------- British outposts glow ----------
const OUT = ["camden", "ninety6", "augusta", "georgetown", "charleston", "savannah", "wilmington"];
OUT.forEach((k, i) => {
  const [x, y] = PL[k];
  const inland = !["charleston", "savannah"].includes(k);
  B.unit({ id: "o_" + k, side: "rome", kind: "inf", x, y, w: 34, h: 34, t: 1.4 + i * 0.15 });
  glow(x, y, T_CORN + 0.4 + i * 0.12, inland ? T_BY : T_SO - 0.2);
});
B.label("BRITISH OUTPOSTS", ...G(33.0, -81.35), { cls: "tg", size: 30, t: T_ACROSS, until: T_LOSE, anchor: [-50, -50] });

// ---------- Greene's campaign: north to the Dan, then back south ----------
const aN = B.arrow({ side: "carth", pts: [[PL.cheraw[0], PL.cheraw[1] - 20], [1570, 520], [PL.guilford[0] + 50, PL.guilford[1] + 20], [PL.dan[0], PL.dan[1] + 30]], width: 16, t: T_ACROSS - 1.0, dur: 1.6, until: T_BY });
const aS = B.arrow({ side: "carth", pts: [[PL.guilford[0] - 30, PL.guilford[1] + 30], [1450, 520], [PL.camden[0] + 30, PL.camden[1] - 40], [PL.eutaw[0] + 10, PL.eutaw[1] - 40]], width: 16, t: T_ACROSS + 0.4, dur: 1.8, until: T_BY });
B.arrow({ side: "carth", pts: [[PL.camden[0] - 30, PL.camden[1] - 30], [1250, 700], [PL.ninety6[0] + 30, PL.ninety6[1] - 20]], width: 14, t: T_ACROSS + 1.0, dur: 1.2, until: T_BY });

// ---------- "lose almost every battle" ----------
const BAT = [["GUILFORD", PL.guilford, 1], ["HOBKIRK'S HILL", [PL.camden[0], PL.camden[1] - 60], 1], ["NINETY SIX", [PL.ninety6[0], PL.ninety6[1] - 60], -1], ["EUTAW SPRINGS", PL.eutaw, 1]];
BAT.forEach(([name, [x, y], side], i) => {
  const t = T_LOSE + 0.2 + i * 0.4;
  battle(x, y, t, T_BY + 0.2);
  B.label(name, x + side * 28, y, { cls: "city", size: 26, t, until: T_BY + 0.2, anchor: side > 0 ? [0, -50] : [-100, -50] });
});
B.caption("HE LOST ALMOST EVERY BATTLE", T_LOSE + 0.3, T_BY - 0.1, "rome");

// ---------- ... and the British are driven out of the interior ----------
["camden", "ninety6", "augusta", "georgetown", "wilmington"].forEach((k, i) => {
  B.grey(["o_" + k], T_DRIVEN - 0.4 + i * 0.25, 0.6);
  B.hideUnits(["o_" + k], T_DRIVEN + 1.6 + i * 0.25, 0.6);
});
["camden", "ninety6", "augusta"].forEach((k, i) => {
  const [x, y] = PL[k];
  B.unit({ id: "b_" + k, side: "carth", kind: "inf", x, y, w: 34, h: 34, t: T_DRIVEN + 2.3 + i * 0.2 });
  B.hideUnits(["b_" + k], T_SO, 0.6);
});
B.caption("BRITISH PENNED INTO CHARLESTON &amp; SAVANNAH", T_PENNED + 0.2, T_YORK + 1.6, "carth");
B.city("CHARLESTON", ...PL.charleston, { size: 28, t: T_PENNED, until: T_SO, dy: 0 });
B.label("SAVANNAH", PL.savannah[0] + 28, PL.savannah[1], { cls: "city", size: 28, t: T_PENNED + 0.2, until: T_SO, anchor: [0, -50] });

// ---------- Cornwallis marches north toward Yorktown ----------
B.city("WILMINGTON", ...PL.wilmington, { size: 26, t: T_YORK - 1.2, until: T_SO + 0.6 });
B.arrow({ side: "rome", pts: [[PL.wilmington[0] - 25, PL.wilmington[1] - 38], [1900, 560], [1950, 300], [1985, 70]], width: 20, t: T_YORK - 0.6, dur: 2.4, until: T_SO + 0.6 });
B.label("TO YORKTOWN", 2025, 150, { cls: "tg", size: 32, t: at(K, "Yorktown") - 0.3, until: T_SO + 0.6, anchor: [0, -50] });
B.hideUnits(["o_charleston", "o_savannah"], T_SO, 0.6);
glow(...PL.charleston, T_PENNED, T_SO - 0.2);
glow(...PL.savannah, T_PENNED + 0.2, T_SO - 0.2);

B.caption("LOSE THE BATTLES · WIN THE WAR?", T_SO + 0.4, T_THREE - 0.8);

// ---------- the three moves ----------
const MOVES = [["THE RACE TO THE DAN", PL.dan, 1], ["GUILFORD COURTHOUSE", PL.guilford, -1], ["THE RECONQUEST", PL.eutaw, 1]];
MOVES.forEach(([name, [x, y], side], i) => {
  const t = T_THREE - 0.2 + i * 0.55;
  numMark(i + 1, x, y, t);
  B.label(name, x + side * 42, y, { cls: "tg", size: 34, t: t + 0.1, anchor: side > 0 ? [0, -50] : [-100, -50] });
});
B.finish();
