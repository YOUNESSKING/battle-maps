// Inchon A: Korea, summer 1950 -> MacArthur's plan. UN = blue ("carth"), North Koreans = red ("rome"). Basemap korea (zoom 8).
const B = Battle();
const { P, at, tl } = B;
const END = B.T.duration;

const G = (lat, lon) => {
  const n = 256 * 2 ** 8, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 54556).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 24399).toFixed(1)];
};
const GL = (arr) => arr.map(([la, lo]) => G(la, lo));

const I1 = P("inchon-1"), I2 = P("inchon-2");
const T_INV = at("inchon-1", "North Korea invaded"), T_OVER = at("inchon-1", "overran"), T_PIN = at("inchon-1", "pinned");
const T_MAC = at("inchon-2", "MacArthur"), T_LAND = at("inchon-2", "land an army"), T_INCH = at("inchon-2", "port of Inchon");
const T_SUP = at("inchon-2", "Every North Korean"), T_CUT = at("inchon-2", "Cut it"), T_TRAP = at("inchon-2", "trapped");

const SEOUL = G(37.566, 126.978), INCH = G(37.47, 126.63), PUSAN = G(35.10, 129.04), PYONG = G(39.03, 125.75);

// ---------- camera ----------
B.camera([
  [0, 1450, 880, 0.72],
  [T_INV, 1440, 900, 0.78],
  [T_PIN - 1.0, 1520, 1050, 0.95],
  [I2 - 0.3, 1590, 1170, 1.08],
  [T_LAND - 0.4, 1720, 1140, 0.8],
  [T_INCH + 1.4, 1600, 1150, 0.82],
  [T_SUP + 0.2, 1420, 1030, 1.1],
  [END, 1400, 1010, 1.25],
]);

// ---------- title card ----------
B.dim(0, 4.6, 0.6);
B.title("MOVE 1", "INCHON", "SEPTEMBER 1950", 0.3, 4.4);

// ---------- territory ----------
B.image("assets/korea_north.png", 0, 0, 2880, 1620, { t: 0.6, dur: 1.4 });
const south = B.image("assets/korea_south.png", 0, 0, 2880, 1620, { t: 0.9, dur: 1.4 });
tl.to(south, { autoAlpha: 0, duration: 1.4 }, T_PIN + 0.6);
const occ = B.image("assets/korea_occupied.png", 0, 0, 2880, 1620, { t: T_INV + 0.3, dur: 0.4 });
tl.fromTo(occ, { clipPath: "inset(0% 0% 46% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: T_PIN - T_INV + 0.6, ease: "power1.inOut" }, T_INV + 0.3);
B.image("assets/korea_perimeter.png", 0, 0, 2880, 1620, { t: T_PIN + 0.3, dur: 1.2 });

B.line([[860, 880], [1705, 880]], { dash: "34 22", width: 7, t: 1.6, dur: 2.0, until: T_PIN });
B.label("38TH PARALLEL", 1722, 880, { cls: "tg", size: 34, t: 2.8, until: T_PIN, anchor: [0, -50] });

B.showDate(4.6);
B.date("JUNE 1950", 4.8, T_OVER - 0.3);
B.date("AUGUST 1950", T_OVER, null);

B.label("NORTH KOREA", ...G(39.75, 126.6), { cls: "country", size: 50, t: 4.8, until: T_SUP });
B.label("SOUTH KOREA", ...G(36.3, 127.9), { cls: "country", size: 50, t: 5.1, until: T_OVER });
B.label("JAPAN", ...G(34.2, 132.2), { cls: "country", size: 56, t: 5.4 });
B.label("YELLOW SEA", ...G(36.6, 124.6), { cls: "sea", size: 44, t: 5.6 });
B.label("SEA OF JAPAN", ...G(38.2, 131.0), { cls: "sea", size: 44, t: 5.8 });
B.city("PYONGYANG", ...PYONG, { left: true, size: 30, t: 5.0 });
B.city("SEOUL", ...SEOUL, { size: 30, t: 5.2 });
B.city("PUSAN", ...PUSAN, { left: true, size: 30, t: T_PIN + 0.4 });

// ---------- inchon-1: invasion ----------
const inv = [
  [[38.45, 126.55], [37.6, 126.95], [36.6, 127.2], [35.7, 127.3]],
  [[38.55, 127.5], [37.6, 127.9], [36.7, 128.1]],
  [[38.5, 128.45], [37.5, 128.9], [36.6, 129.2]],
  [[36.9, 126.9], [35.9, 126.9], [35.1, 127.6], [35.15, 128.1]],
];
inv.forEach((pts, i) => B.arrow({ side: "rome", pts: GL(pts), width: 24, t: T_INV + 0.2 + i * 0.5 + (i === 3 ? 1.4 : 0), dur: 2.6, until: T_PIN + 1.4 }));
// North Korean divisions pressing on the perimeter
const redPer = [[35.25, 128.05], [35.55, 128.2], [35.85, 128.2], [36.2, 128.4], [36.3, 128.85], [36.45, 129.25]];
redPer.forEach(([la, lo], i) => {
  B.unit({ id: "r" + i, side: "rome", x: G(la + 0.9, lo - 0.6)[0], y: G(la + 0.9, lo - 0.6)[1], w: 40, h: 40, t: T_OVER + i * 0.15 });
  B.move("r" + i, T_OVER + 0.8, T_PIN - T_OVER + 0.6, ...G(la, lo));
});
const bluePer = [[35.3, 128.55], [35.6, 128.62], [35.9, 128.7], [36.0, 129.05], [35.35, 128.95]];
bluePer.forEach(([la, lo], i) => B.unit({ id: "b" + i, side: "carth", x: G(la, lo)[0], y: G(la, lo)[1], w: 40, h: 40, t: T_PIN + 0.6 + i * 0.15 }));
B.front({ pts: GL([[35.02, 128.34], [35.45, 128.44], [35.95, 128.44], [36.14, 128.8], [36.3, 129.35]]), width: 11, t: T_PIN + 0.3, dur: 1.8 });
B.caption("PUSAN PERIMETER", T_PIN + 1.0, I2 - 0.2, "carth");

// ---------- inchon-2: MacArthur's plan ----------
B.caption("MACARTHUR'S PLAN: LAND BEHIND THE ENEMY", T_MAC + 0.3, T_LAND + 3.0, "carth");
B.label("OPERATION CHROMITE", 2050, 1330, { cls: "tg", size: 36, t: T_LAND + 1.4, until: T_SUP + 0.4, anchor: [-50, -50] });
const sea = B.arrow({ side: "carth", pts: [[2330, 1440], [2050, 1545], [1650, 1600], [1270, 1560], [1060, 1400], [1040, 1170], [1215, 1010]], width: 28, t: T_LAND - 0.2, dur: 4.2 });
B.city("INCHON", ...INCH, { left: true, size: 34, t: T_INCH - 0.2 });
// supply lines through Seoul
const sup = [
  [[39.0, 125.8], [38.3, 126.4], [37.62, 126.95], [36.8, 127.3], [36.0, 127.9], [35.6, 128.15]],
  [[38.9, 127.2], [38.2, 127.2], [37.62, 127.02], [36.9, 127.8], [36.35, 128.4]],
];
sup.forEach((pts, i) => B.line(GL(pts), { color: "var(--rome)", dash: "22 12", width: 9, t: T_SUP + 0.1 + i * 0.5, dur: 2.2 }));
B.caption("EVERY SUPPLY LINE RUNS THROUGH SEOUL", T_SUP + 0.6, T_CUT - 0.2, "rome");
const X = document.createElement("div");
X.textContent = "✕";
X.style.cssText = `position:absolute;left:${SEOUL[0] - 34}px;top:${SEOUL[1] - 58}px;font-size:84px;font-weight:700;color:#1f4fc4;text-shadow:0 0 4px #fff,0 0 2px #fff;`;
document.getElementById("pins").appendChild(X);
gsap.set(X, { autoAlpha: 0 });
tl.fromTo(X, { autoAlpha: 0, scale: 2.5 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power3.in" }, T_CUT + 0.1);
redPer.forEach((_, i) => tl.to(B.units["r" + i].el, { scale: 0.85, opacity: 0.75, duration: 0.6, yoyo: true, repeat: 3 }, T_TRAP - 0.4));
B.caption("THE WHOLE INVADING ARMY TRAPPED", T_TRAP - 0.6, END - 0.2, "carth");
B.finish();
