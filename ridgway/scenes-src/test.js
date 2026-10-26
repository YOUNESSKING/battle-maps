// Ridgway style-match test: Korea, Nov 1950 - Mar 1951. UN = blue ("carth"), Chinese = red ("rome").
const B = Battle();
const { P, at } = B;
const END = B.T.duration;

// ---------- projection (assets/korea.json: zoom 8, origin_world_px) ----------
const G = (lat, lon) => {
  const n = 256 * 2 ** 8, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 54556).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 24399).toFixed(1)];
};
const GL = (arr) => arr.map(([la, lo]) => G(la, lo));

const S1 = P("shot-1"), S2 = P("shot-2"), S3 = P("shot-3");
const T_SHATTER = at("shot-1", "shattered"), T_STREAM = at("shot-1", "streaming south");
const T_EVAC = at("shot-1", "take the entire army");
const T_CMD = at("shot-3", "He took command"), T_STOP = at("shot-3", "stopping the Chinese"), T_DRIVE = at("shot-3", "driving the front");
const T_OUT1 = S2 + 0.2; // shot-1 layer cleared under the dimmer

// ---------- camera: shot 1 one slow push-in; shot 2 drift; shot 3 zooms and pans ----------
B.camera([
  [0, 1440, 810, 0.667],
  [B.end("shot-1"), 1400, 940, 0.84],
  [S3, 1400, 960, 0.88],
  [S3 + 2.4, 1400, 1010, 2.3],
  [S3 + 5.4, 1490, 990, 1.95],
  [T_STOP + 0.6, 1500, 1000, 2.1],
  [T_DRIVE, 1500, 990, 2.0],
  [T_DRIVE + 3.6, 1480, 935, 1.95],
  [END, 1470, 950, 2.3],
]);

// ---------- base layers ----------
B.image("assets/korea_north.png", 0, 0, 2880, 1620, { t: 0.4, dur: 1.6 });
B.image("assets/korea_south.png", 0, 0, 2880, 1620, { t: 0.7, dur: 1.6 });
B.river(GL([[39.86, 124.2], [40.1, 124.42], [40.3, 124.72], [40.46, 124.96], [40.7, 125.35], [40.95, 125.85], [41.15, 126.29], [41.45, 126.55], [41.75, 126.85]]), 7);
B.line([[860, 880], [1705, 880]], { dash: "34 22", width: 7, t: 1.4, dur: 2.0 });
B.label("38TH PARALLEL", 1722, 880, { cls: "tg", size: 36, t: 2.6, until: S3, anchor: [0, -50] });

// ---------- shot 1 labels ----------
B.showDate(0.3);
B.date("NOVEMBER 1950", 0.5, T_STREAM - 3.4);
B.date("DECEMBER 1950", T_STREAM - 3.1, S2 + 0.4);
B.label("CHINA", ...G(41.15, 123.2), { cls: "country", size: 66, t: 1.0, until: S3 });
B.label("NORTH KOREA", ...G(39.35, 127.0), { cls: "country", size: 50, t: 1.4, until: T_STREAM - 0.2 });
B.label("SOUTH KOREA", ...G(36.15, 128.05), { cls: "country", size: 50, t: 1.8, until: S2 + 0.4 });
B.label("SEA OF JAPAN", ...G(38.9, 131.1), { cls: "sea", size: 44, t: 2.2, until: S3 });
B.label("YELLOW SEA", ...G(36.4, 124.0), { cls: "sea", size: 44, t: 2.4, until: S3 });
const yalu = B.label("YALU RIVER", ...G(40.72, 124.95), { cls: "river", size: 30, t: at("shot-1", "Yalu River") - 0.6, until: S2 + 0.4 });
gsap.set(yalu, { xPercent: -50, yPercent: -50, rotation: -35 });
B.city("PYONGYANG", ...G(39.03, 125.75), { left: true, size: 30, t: 2.8, until: S2 + 0.4 });
B.city("SEOUL", ...G(37.57, 126.98), { left: true, size: 30, t: 3.0, until: S2 + 0.4 });

// ---------- shot 1: UN forces far north ----------
const blueStart = [[39.65, 125.2], [39.75, 125.6], [39.6, 126.0], [39.75, 126.4], [39.55, 126.8], [39.95, 127.3], [40.05, 127.65], [40.2, 128.05]];
const blueEnd = [[37.2, 126.9], [37.3, 127.35], [36.95, 127.6], [37.2, 127.95], [37.45, 128.4], null, null, null]; // east three evacuate via Hungnam
const hungnam = [[39.93, 127.47], [39.97, 127.72], [40.06, 127.58]];
blueStart.forEach(([la, lo], i) => {
  B.unit({ id: "b1_" + i, side: "carth", kind: "inf", x: G(la, lo)[0], y: G(la, lo)[1], w: 40, h: 40, t: at("shot-1", "almost won") + i * 0.12 });
  B.move("b1_" + i, T_SHATTER + 0.2 + i * 0.05, 1.6, ...G(la - 0.15, lo)); // knocked back
});
blueEnd.forEach((e, i) => {
  if (e) B.move("b1_" + i, T_STREAM + 0.3 + i * 0.25, 5.2, ...G(...e), "power2.inOut");
  else B.move("b1_" + i, T_STREAM - 2.2 + (i - 5) * 0.3, 3.2, ...G(...hungnam[i - 5]), "power2.inOut");
});
B.hideUnits(["b1_5", "b1_6", "b1_7"], T_EVAC + 1.6, 0.8);
B.hideUnits([0, 1, 2, 3, 4].map((i) => "b1_" + i), T_OUT1, 0.6);

// ---------- shot 1: the Chinese strike ----------
const red1 = [[40.25, 124.9], [40.45, 125.3], [40.35, 125.8], [40.65, 125.7], [40.6, 126.2], [40.9, 126.5], [40.5, 126.7], [40.8, 127.0], [41.1, 127.3],
  [40.6, 127.3], [41.0, 127.8], [40.7, 127.8], [41.25, 128.3], [40.9, 128.3], [40.5, 128.1], [40.3, 126.3], [40.85, 126.0], [41.2, 126.8]];
const FIN = [];
red1.forEach(([la, lo], i) => FIN.push([38.2 + (la - 40.25) * 0.85, 125.95 + (lo - 124.9) * 0.7]));
FIN[12] = [38.25, 127.6]; FIN[13] = [38.3, 128.0]; FIN[14] = [38.62, 128.12];
const T300 = at("shot-1", "three hundred thousand");
red1.forEach(([la, lo], i) => {
  const id = "r1_" + i;
  B.unit({ id, side: "rome", kind: "inf", x: G(la, lo)[0], y: G(la, lo)[1], w: 40, h: 40, t: T300 + (i % 9) * 0.14 + Math.floor(i / 9) * 0.07 });
  const mid = i === 14 ? [40.3, 128.2] : [la - 0.4, lo];
  B.move(id, T_SHATTER + 0.1 + (i % 6) * 0.08, 1.8, ...G(...mid));
  const fin = FIN[i];
  B.move(id, T_STREAM + 1.2 + (i % 7) * 0.2, 6.2, ...G(...fin), "power2.inOut");
});
B.hideUnits(red1.map((_, i) => "r1_" + i), T_OUT1, 0.6);
const wave1 = [
  [[40.45, 125.05], [40.1, 125.35], [39.72, 125.55]],
  [[41.0, 126.35], [40.5, 126.45], [39.85, 126.45]],
  [[41.15, 127.55], [40.75, 127.45], [40.25, 127.35]],
];
wave1.forEach((pts, i) => B.arrow({ side: "rome", pts: GL(pts), width: 22, t: at("shot-1", "struck without") + i * 0.35, dur: 1.6, until: T_STREAM + 0.4 }));
const wave2 = [
  [[39.45, 125.7], [38.75, 126.3], [38.12, 126.75]],
  [[39.45, 126.75], [38.75, 127.2], [38.15, 127.5]],
  [[39.25, 127.5], [38.7, 127.9], [38.2, 128.15]],
];
wave2.forEach((pts, i) => B.arrow({ side: "rome", pts: GL(pts), width: 22, t: T_STREAM + 0.6 + i * 0.35, dur: 2.2, until: T_OUT1 }));
B.caption("300,000 CHINESE TROOPS", T300 + 0.6, T_STREAM - 0.4, "rome");
B.caption("THE LONGEST RETREAT IN U.S. ARMY HISTORY", at("shot-1", "longest retreat"), at("shot-1", "In Tokyo") + 0.6, "carth");

// ---------- shot 1: evacuation by sea ----------
B.city("HUNGNAM", ...G(39.83, 127.62), { size: 28, t: T_EVAC - 2.4, until: T_OUT1 });
B.city("BUSAN", ...G(35.1, 129.04), { left: true, size: 28, t: T_EVAC - 0.6, until: T_OUT1 });
B.arrow({ side: "white", pts: [[1462, 462], [1610, 520], [1800, 660], [1905, 930], [1880, 1250], [1800, 1455], [1728, 1522]], width: 18, t: T_EVAC - 1.8, dur: 3.2, until: T_OUT1 });
B.label("EVACUATION BY SEA?", 2100, 1020, { cls: "tg", size: 34, t: T_EVAC + 0.4, until: T_OUT1 });

// ---------- shot 2: Ridgway ----------
B.dim(S2 - 0.2, S3 + 0.1);
B.dateBox(S2 - 0.1, null, S3 + 0.2);
B.bio({
  photo: "assets/media/ridgway_full.png",
  name: "MATTHEW RIDGWAY",
  rows: ["Lieutenant General, U.S. Army", "82nd Airborne · Normandy, June 1944", "Took command of Eighth Army · 26 Dec 1950", "Known for the grenade strapped to his chest"],
  rowT: [at("shot-2", "Lieutenant"), at("shot-2", "Normandy") - 1.0, at("shot-2", "Eighty-Second") + 1.0, at("shot-2", "hand grenade") - 0.2],
  t: S2 + 0.1,
  until: B.end("shot-2") + 0.1,
});

// ---------- shot 3: holding and turning the front ----------
B.date("JANUARY – MARCH 1951", S3 + 0.3, null, 32);
B.portraitStake({ img: "assets/media/ridgway_head.png", flag: "assets/media/us_flag_48star.png", name: "RIDGWAY", x: G(36.93, 127.4)[0], y: G(36.93, 127.4)[1], size: 0.62, t: S3 + 0.9 });
B.label("38TH PARALLEL", 1100, 864, { cls: "tg", size: 22, t: S3 + 3.0, anchor: [0, -100] });
B.city("SEOUL", ...G(37.57, 126.98), { size: 18, r: 6, t: S3 + 3.2 });

const frontA = [[36.98, 126.75], [37.02, 127.15], [37.1, 127.55], [37.25, 128.0], [37.4, 128.6], [37.5, 129.15]];
const frontB = [[37.75, 126.6], [37.85, 127.0], [37.95, 127.45], [38.05, 127.9], [38.15, 128.3], [38.3, 128.62]];
B.front({ pts: GL(frontA), to: GL(frontB), width: 11, t: T_CMD + 1.2, dur: 1.8, moveT: T_DRIVE + 0.2, moveDur: 3.6 });
const blue3 = [[36.93, 126.95], [37.02, 127.7], [37.12, 128.1], [37.27, 128.5], [37.4, 128.95]];
const blue3b = [[37.68, 126.8], [37.85, 127.6], [37.93, 127.95], [38.05, 128.3], [38.18, 128.52]];
blue3.forEach(([la, lo], i) => {
  B.unit({ id: "b3_" + i, side: "carth", kind: "inf", x: G(la, lo)[0], y: G(la, lo)[1], w: 30, h: 30, label: i === 1 ? "EIGHTH ARMY" : null, t: T_CMD + 2.0 + i * 0.18 });
  B.move("b3_" + i, T_DRIVE + 0.3 + i * 0.12, 3.4, ...G(...blue3b[i]));
});
B.units.b3_1.el.querySelector(".tag").style.fontSize = "13px";

const red3 = [[38.35, 126.9], [38.55, 127.05], [38.4, 127.6], [38.6, 127.8], [38.45, 127.95], [38.3, 128.3]];
const red3b = [[37.2, 126.9], [37.38, 127.02], [37.33, 127.62], [37.5, 127.8], [37.42, 128.05], [37.55, 128.45]];
const T_PUSH = at("shot-3", "the day after");
red3.forEach(([la, lo], i) => {
  const id = "r3_" + i;
  B.unit({ id, side: "rome", kind: "inf", x: G(la, lo)[0], y: G(la, lo)[1], w: 30, h: 30, t: S3 + 2.6 + i * 0.12 });
  B.move(id, T_PUSH + (i % 3) * 0.25, 3.8, ...G(...red3b[i]), "power1.out");
  B.move(id, T_DRIVE + 0.1, 3.2, ...G(red3[i][0] + 0.25, red3[i][1]));
});
B.grey(red3.map((_, i) => "r3_" + i), T_STOP, 0.8);
B.hideUnits(red3.map((_, i) => "r3_" + i), T_DRIVE + 2.4, 1.0);
const red3Arrows = [
  [[38.45, 126.72], [37.9, 126.74], [37.3, 126.78]],
  [[38.6, 127.62], [38.0, 127.66], [37.55, 127.72]],
  [[38.45, 128.18], [38.0, 128.2], [37.62, 128.25]],
].map((pts, i) => B.arrow({ side: "rome", pts: GL(pts), width: 13, t: T_PUSH + 0.2 + i * 0.3, dur: 2.6 }));
red3Arrows.forEach((g) => B.greyArrow(g, T_STOP, T_DRIVE - 0.2));
[
  [[37.1, 126.85], [37.4, 126.82], [37.68, 126.78]],
  [[37.25, 127.8], [37.55, 127.77], [37.82, 127.75]],
  [[37.4, 128.3], [37.7, 128.3], [37.98, 128.33]],
].forEach((pts, i) => B.arrow({ side: "carth", pts: GL(pts), width: 13, t: T_DRIVE + 0.4 + i * 0.3, dur: 2.2, until: at("shot-3", "So how") + 1.2 }));
B.caption("CHINESE OFFENSIVES HALTED", T_STOP + 0.2, T_DRIVE - 0.3, "carth");
B.caption("FRONT PUSHED BACK TO THE 38TH PARALLEL", T_DRIVE + 0.8, at("shot-3", "So how") + 0.4, "carth");
B.finish();
