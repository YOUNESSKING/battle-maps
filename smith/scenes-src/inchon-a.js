// Inchon A: Korea, summer 1950 -> MacArthur's plan. UN = blue ("carth"), North Koreans = red ("rome"). Basemap korea (zoom 8).
// Locked style: K.grid, two-colour front (38th parallel -> Pusan perimeter), fade-from-the-front territory (korea_land mask),
// counters with flags + size marks, MacArthur badge.
const B = Battle();
const { P, at, tl } = B;
const END = B.T.duration;
const K = FXK(B);
// sound: whoosh on big camera zooms (scale x1.6 or more within 6 s), at the fastest point of the move
const camSfx = (keys) => { for (let i = 1; i < keys.length; i++) { const r = keys[i][3] / keys[i - 1][3], d = keys[i][0] - keys[i - 1][0];
  /* no zoom sound on ordinary camera moves (owner 2026-09-30: only the biggest moves) */ } return keys; };

const G = (lat, lon) => {
  const n = 256 * 2 ** 8, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 54556).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 24399).toFixed(1)];
};
const GL = (arr) => arr.map(([la, lo]) => G(la, lo));
const MASK = "assets/korea_land.png";

const I1 = P("inchon-1"), I2 = P("inchon-2");
const T_INV = at("inchon-1", "North Korea invaded"), T_OVER = at("inchon-1", "overran"), T_PIN = at("inchon-1", "pinned");
const T_MAC = at("inchon-2", "MacArthur"), T_LAND = at("inchon-2", "land an army"), T_INCH = at("inchon-2", "port of Inchon");
const T_SUP = at("inchon-2", "Every North Korean"), T_CUT = at("inchon-2", "Cut it"), T_TRAP = at("inchon-2", "trapped");

const SEOUL = G(37.566, 126.978), INCH = G(37.47, 126.63), PUSAN = G(35.10, 129.04), PYONG = G(39.03, 125.75);

// ---------- camera ----------
B.camera(camSfx([
  [0, 1450, 880, 0.72],
  [T_INV, 1440, 900, 0.78],
  [T_OVER, 1500, 1020, 0.9],
  [T_PIN + 1.2, 1640, 1190, 1.3],
  [I2 - 0.3, 1640, 1190, 1.32],
  [T_LAND - 0.4, 1720, 1140, 0.8],
  [T_INCH + 1.4, 1600, 1150, 0.82],
  [T_SUP + 0.2, 1420, 1030, 1.1],
  [END, 1400, 1010, 1.25],
]));

// ---------- title card ----------
B.dim(0, 4.6, 0.6);
B.title("MOVE 1", "INCHON", "SEPTEMBER 1950", 0.3, 4.4);
K.grid(G, 33, 43, 119, 136, 0.5, 0.2); // faint lat/long grid

B.line([[860, 880], [1705, 880]], { dash: "34 22", width: 7, t: 1.6, dur: 2.0, until: T_INV + 1.2 });
B.label("38TH PARALLEL", 1722, 880, { cls: "tg", size: 34, t: 2.8, until: T_OVER, anchor: [0, -50] });

B.showDate(4.6);
B.date("JUNE 1950", 4.8, T_OVER - 0.3);
B.date("AUGUST 1950", T_OVER, null);
B.dateBox(T_SUP - 0.4, null);

B.label("NORTH KOREA", ...G(39.45, 126.9), { cls: "country", size: 50, t: 4.8, until: T_SUP });
B.label("SOUTH KOREA", ...G(36.9, 127.55), { cls: "country", size: 50, t: 5.1, until: T_OVER });
B.label("JAPAN", 2560, 1540, { cls: "country", size: 56, t: 5.4 });
B.label("YELLOW SEA", 830, 1060, { cls: "sea", size: 44, t: 5.6 });
B.label("SEA OF JAPAN", 1900, 760, { cls: "sea", size: 44, t: 5.8 });
B.city("PYONGYANG", ...PYONG, { left: true, size: 30, t: 5.0, until: T_PIN });
B.city("PYONGYANG", ...PYONG, { left: true, size: 30, t: T_SUP - 0.2 });
B.city("SEOUL", ...SEOUL, { size: 30, t: 5.2 });
B.city("PUSAN", ...PUSAN, { left: true, size: 26, t: T_PIN + 0.4 });

// ---------- the front: 38th parallel in June, swept south to the Pusan perimeter by August ----------
// drawn west -> east (then north -> east on the perimeter): sideA = left = North Korean red, sideB = right = UN blue
const F38 = GL([[37.95, 125.35], [38.0, 126.15], [38.0, 127.0], [38.0, 127.8], [38.0, 128.55]]);
const FPUS = GL([[35.05, 128.33], [35.45, 128.42], [35.95, 128.42], [36.14, 128.8], [36.3, 129.38]]);
const T_FRONT = T_INV - 0.2, T_SWEEP = T_INV + 1.8, SWEEP = T_PIN + 0.9 - (T_INV + 1.8);
const front = K.front({ pts: F38, to: FPUS, sideA: "rome", sideB: "carth", width: 15, t: T_FRONT, dur: 1.4, moveT: T_SWEEP, moveDur: SWEEP, until: END + 1 });
// territory ("E" look): each side tinted behind the front, clipped to land; moves with the front
K.frontTint({ pts: F38, to: FPUS, dir: 1, depth: 170, color: "#4a6a9a", alpha: 0.34, mask: MASK, t: T_FRONT + 0.3, moveT: T_SWEEP, moveDur: SWEEP });
K.frontTint({ pts: F38, to: FPUS, dir: -1, depth: 170, color: "#a8503c", alpha: 0.34, mask: MASK, t: T_FRONT + 0.5, moveT: T_SWEEP, moveDur: SWEEP });

// ---------- inchon-1: invasion ----------
const inv = [
  [[38.45, 126.55], [37.6, 126.95], [36.6, 127.2], [35.7, 127.3]],
  [[38.55, 127.5], [37.6, 127.9], [36.7, 128.1]],
  [[38.5, 128.45], [37.5, 128.9], [36.6, 129.2]],
  [[36.9, 126.9], [35.9, 126.9], [35.1, 127.6], [35.15, 128.1]],
];
inv.forEach((pts, i) => B.arrow({ side: "rome", pts: GL(pts), width: 24, t: T_INV + 0.2 + i * 0.5 + (i === 3 ? 1.4 : 0), dur: 2.6, until: T_PIN + 1.4 }));
// North Korean divisions: start above the 38th, end outside the perimeter
const redStart = [[38.45, 126.4], [38.45, 127.0], [38.5, 127.6], [38.5, 128.15], [38.3, 128.5]];
const redPer = [[35.2, 127.95], [35.72, 127.98], [36.25, 128.15], [36.55, 128.72], [36.62, 129.18]];
redPer.forEach(([la, lo], i) => {
  const s = G(...redStart[i]);
  B.unit({ id: "r" + i, side: "rome", x: s[0], y: s[1], w: 46, h: 32, t: T_INV - 0.5 + i * 0.12 });
  K.counter("r" + i, { icon: "infantry", flag: "kpa", size: "XX" });
  B.move("r" + i, T_SWEEP + 0.2, SWEEP, ...G(la, lo));
});
// UN divisions: south of the 38th, pushed back into the perimeter
const blueStart = [[37.15, 126.95], [37.45, 127.75], [37.6, 128.55]];
const bluePer = [[35.3, 128.72], [35.82, 128.78], [36.0, 129.18]];
bluePer.forEach(([la, lo], i) => {
  const s = G(...blueStart[i]);
  B.unit({ id: "b" + i, side: "carth", x: s[0], y: s[1], w: 46, h: 32, t: 5.2 + i * 0.12 });
  K.counter("b" + i, { icon: "infantry", flag: "us", size: "XX" });
  B.move("b" + i, T_SWEEP, SWEEP, ...G(la, lo));
});
B.label("PUSAN PERIMETER", 1905, 1370, { cls: "tg", size: 38, t: T_PIN + 1.0, until: T_LAND + 0.8, anchor: [0, -50] });

// ---------- inchon-2: MacArthur's plan ----------
K.badge({ name: "GEN. DOUGLAS MACARTHUR", role: "U.N. COMMANDER", photo: "assets/media/macarthur_head.png", initials: "MAC", flag: "us", side: "carth", corner: "tr", t: T_MAC - 0.2, until: T_INCH + 1.2 });
B.caption("MACARTHUR'S PLAN: LAND BEHIND THE ENEMY", T_MAC + 0.3, T_LAND + 3.0, "carth");
B.label("OPERATION CHROMITE", 2050, 1330, { cls: "tg", size: 36, t: T_LAND + 1.6, until: T_SUP + 0.4, anchor: [-50, -50] });
B.arrow({ side: "carth", pts: [[2330, 1440], [2050, 1545], [1650, 1600], [1270, 1560], [1060, 1400], [1040, 1170], [1215, 1010]], width: 28, t: T_LAND - 0.2, dur: 4.2 });
B.city("INCHON", ...INCH, { left: true, size: 34, t: T_INCH - 0.2 });
// supply lines through Seoul
const sup = [
  [[39.0, 125.8], [38.3, 126.4], [37.62, 126.95], [36.8, 127.3], [36.0, 127.9], [35.6, 128.1]],
  [[38.9, 127.2], [38.2, 127.2], [37.62, 127.02], [36.9, 127.8], [36.45, 128.3]],
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
// ---------- sound cues (locked kit, levels in tools/sfx_mix_lib.py): only on visible beats ----------
SFX("hit", 0.5);                 // MOVE 1 title card
SFX("tick", 5.2);                // UN counters drop in
SFX("tick", T_INV - 0.5);        // North Korean counters drop in
SFX("hit", T_CUT + 0.45);        // blue X slams onto Seoul
K.raiseTerritory();
B.finish();
