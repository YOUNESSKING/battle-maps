// Hook: Chosin, 27 Nov 1950. Marines = blue ("carth"), Chinese = red ("rome"). Basemap chosin (zoom 11).
const B = Battle();
const { P, at, tl } = B;
const END = B.T.duration;

// ---------- projection (assets/chosin.json: zoom 11) ----------
const G = (lat, lon) => {
  const n = 256 * 2 ** 11, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 446141).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 197446).toFixed(1)];
};

// key places (pixels)
const HUNG = G(39.83, 127.62), HAM = G(39.92, 127.54), CHIN = G(40.17, 127.38), FUN = G(40.21, 127.33);
const KOTO = G(40.285, 127.30), HAG = G(40.385, 127.253), TOK = G(40.43, 127.18), YUD = G(40.48, 127.11);

const H2 = P("hook-2"), H3 = P("hook-3");
const T_BUGLE = at("hook-1", "bugles"), T_120 = at("hook-1", "one hundred and twenty"), T_POUR = at("hook-1", "came pouring");
const T_15 = at("hook-2", "fifteen thousand"), T_78 = at("hook-2", "seventy-eight miles"), T_CUT = at("hook-2", "that road was cut");
const T_SURR = at("hook-2", "surrounded"), T_TOKYO = at("hook-2", "In Tokyo");

// ---------- camera: wide push-in on the whole road, zoom on the reservoir, drift ----------
B.camera([
  [0, 1500, 790, 0.74],
  [T_POUR, 1470, 740, 0.84],
  [H2 - 0.4, 1430, 640, 0.9],
  [H2 + 3.6, 1275, 330, 1.75],
  [T_CUT, 1265, 320, 1.9],
  [T_TOKYO, 1270, 330, 1.95],
  [H3 + 0.6, 1300, 380, 1.7],
  [END, 1320, 420, 1.55],
]);

// ---------- base layers ----------
B.image("assets/chosin_water.png", 0, 0, 2880, 1620, { t: 0, dur: 0.01 });
B.snow(0.2, END - 0.3);
B.showDate(0.3);
B.date("27 NOVEMBER 1950", 0.5, H3 - 0.2, 38);
B.dateBox(H3 - 0.4, null);

// the road (MSR)
const ROAD = [HUNG, HAM, [1680, 1080], G(40.03, 127.43), G(40.08, 127.40), G(40.12, 127.39), CHIN, FUN, [1420, 570], KOTO, [1370, 400], HAG, TOK, YUD];
B.line(ROAD.slice().reverse(), { color: "#e9dcb5", width: 7, t: 1.2, dur: 3.2 });

// labels hook-1 (wide)
B.label("CHOSIN RESERVOIR", 1500, 110, { cls: "river", size: 30, t: 1.4, until: H2 + 2.0 });
B.label("SEA OF JAPAN", 2380, 1150, { cls: "sea", size: 44, t: 1.6, until: H3 });
B.city("HUNGNAM", ...HUNG, { size: 30, t: 2.2, until: H2 + 1.5 });
B.city("HAMHUNG", ...HAM, { size: 26, t: 2.6, until: H2 + 1.5 });
B.label("NORTH KOREA", 820, 1000, { cls: "country", size: 60, t: 1.8, until: H2 });

// blue Marines strung along the road
const blueRoad = [YUD, [1170, 160], TOK, HAG, [1375, 420], KOTO, [1425, 580], CHIN, G(40.08, 127.40), [1680, 1080], HAM];
blueRoad.forEach(([x, y], i) => B.unit({ id: "b" + i, side: "carth", x, y, w: 34, h: 34, t: 3.8 + i * 0.22 }));
B.caption("1ST MARINE DIVISION · ONE ROAD", 5.2, 9.2, "carth");

// cold
B.caption("−30°F", at("hook-1", "thirty degrees") - 0.2, T_BUGLE - 0.2, "carth");

// Chinese: counters appear on the ridges, then arrows pour down on the road
const redRidge = [[980, 60], [1010, 270], [1110, 330], [1230, 380], [1180, 520], [1300, 620], [1260, 760], [1600, 170], [1560, 330], [1520, 470],
  [1600, 560], [1330, 880], [1700, 740], [1760, 900], [1420, 1000], [1240, 90], [1080, 440], [1500, 40]];
redRidge.forEach(([x, y], i) => B.unit({ id: "r" + i, side: "rome", x, y, w: 30, h: 30, t: T_BUGLE + 0.3 + (i % 9) * 0.18 + Math.floor(i / 9) * 0.09 }));
B.caption("120,000 CHINESE SOLDIERS", T_120 - 0.1, T_POUR + 2.6, "rome");
const pour = [
  [[960, 40], [1060, 90], [1115, 118]], [[1010, 300], [1120, 240], [1195, 205]], [[1580, 150], [1450, 230], [1350, 290]],
  [[1180, 540], [1300, 500], [1375, 480]], [[1560, 470], [1470, 470], [1415, 490]], [[1250, 780], [1360, 740], [1490, 705]],
  [[1720, 720], [1620, 700], [1535, 712]], [[1300, 330], [1260, 280], [1240, 225]],
];
const pourArrows = pour.map((pts, i) => B.arrow({ side: "rome", pts, width: 14, t: T_POUR + (i % 4) * 0.3 + Math.floor(i / 4) * 0.15, dur: 1.3, until: H2 + 1.2 }));
B.hideUnits(redRidge.map((_, i) => "r" + i), H2 + 0.8, 0.8);
B.hideUnits(blueRoad.map((_, i) => "b" + i), H2 + 1.0, 0.8);

// ---------- hook-2: pockets, road cut, ENCIRCLED ----------
const ring = (x, y, r, t, until) => {
  const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  c.setAttribute("cx", x); c.setAttribute("cy", y); c.setAttribute("r", r);
  c.setAttribute("fill", "rgba(31,79,196,0.22)"); c.setAttribute("stroke", "var(--carth)"); c.setAttribute("stroke-width", 5); c.setAttribute("stroke-dasharray", "14 7");
  document.getElementById("overlay").appendChild(c);
  gsap.set(c, { autoAlpha: 0, scale: 0.4, transformOrigin: "50% 50%" });
  tl.to(c, { autoAlpha: 1, scale: 1, duration: 0.7, ease: "back.out(1.6)" }, t);
  if (until != null) tl.to(c, { autoAlpha: 0, duration: 0.5 }, until);
  return c;
};
const pockets = [["YUDAM-NI", YUD, 38, [12, -58]], ["HAGARU-RI", HAG, 34, [26, 8]], ["KOTO-RI", KOTO, 30, [26, 6]]];
pockets.forEach(([name, [x, y], r, [dx, dy]], i) => {
  const t = T_15 - 0.6 + i * 0.35;
  ring(x, y, r, t, H3 + 0.2);
  B.unit({ id: "p" + i, side: "carth", x, y, w: 22, h: 22, t: t + 0.2 });
  B.label(name, x + dx, y + dy, { cls: "city", size: 17, t: t + 0.3, until: H3 + 0.2, anchor: [0, -50] });
});
B.label("CHOSIN RESERVOIR", 1318, 150, { cls: "river", size: 15, t: H2 + 3.0, until: H3 + 0.2, rot: 62 });
B.caption("15,000 MARINES", T_15 + 0.2, T_78 - 0.3, "carth");
B.caption("78 MILES FROM THE SEA", T_78, T_CUT - 0.2, "carth");

// road cuts: red blocks + X marks between the pockets
const cuts = [[1170, 160], TOK, [1300, 270], [1360, 370], [1385, 445], [1412, 540], [1425, 600]];
cuts.forEach(([x, y], i) => {
  const t = T_CUT + 0.2 + i * 0.28;
  B.unit({ id: "c" + i, side: "rome", x, y, w: 20, h: 20, t });
});
[[1195, 185], [1340, 330], [1400, 515]].forEach(([x, y], i) => {
  const el = document.createElement("div");
  el.textContent = "✕";
  el.style.cssText = `position:absolute;left:${x - 14}px;top:${y - 22}px;font-size:34px;font-weight:700;color:#c4121f;text-shadow:0 0 3px #fff,0 0 2px #fff;`;
  document.getElementById("pins").appendChild(el);
  gsap.set(el, { autoAlpha: 0 });
  tl.fromTo(el, { autoAlpha: 0, scale: 2.2 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power3.in" }, T_CUT + 0.9 + i * 0.4);
  tl.to(el, { autoAlpha: 0, duration: 0.5 }, H3 + 0.2);
});
// encircling red arrows
[
  [[1050, 60], [1060, 180], [1110, 225]], [[1210, 420], [1300, 420], [1335, 395]], [[1520, 250], [1420, 280], [1370, 290]],
  [[1250, 560], [1330, 520], [1365, 505]], [[1540, 420], [1470, 430], [1425, 470]], [[1250, 60], [1210, 110], [1160, 140]],
].forEach((pts, i) => B.arrow({ side: "rome", pts, width: 9, t: T_SURR - 1.2 + i * 0.22, dur: 1.1, until: H3 + 0.2 }));
// ENCIRCLED stamp (screen)
const stamp = document.createElement("div");
stamp.textContent = "ENCIRCLED";
stamp.style.cssText = "position:absolute;left:50%;top:44%;translate:-50% -50%;padding:6px 34px;font-family:'Special Elite',monospace;font-size:120px;color:#c4121f;border:10px solid #c4121f;border-radius:12px;rotate:-8deg;opacity:0.9;letter-spacing:0.08em;background:rgba(239,227,196,0.25);mix-blend-mode:multiply;";
document.getElementById("scene").insertBefore(stamp, document.getElementById("credit"));
gsap.set(stamp, { autoAlpha: 0 });
tl.fromTo(stamp, { autoAlpha: 0, scale: 2.4 }, { autoAlpha: 0.92, scale: 1, duration: 0.3, ease: "power4.in" }, T_SURR + 0.2);
tl.to(stamp, { autoAlpha: 0, duration: 0.5 }, T_TOKYO + 1.2);
B.caption("OUTNUMBERED · SURROUNDED · FREEZING", T_TOKYO + 1.3, H3 - 0.2, "rome");

// ---------- hook-3: O.P. Smith ----------
B.dim(H3 - 0.2, END + 1);
B.bio({
  photo: "assets/media/smith_full.png",
  name: "OLIVER P. SMITH",
  rows: ["Major General, U.S. Marine Corps", "Born 1893 · California", "Commander, 1st Marine Division", "Nickname: “The Professor”"],
  rowT: [at("hook-3", "Major General"), at("hook-3", "fifty-seven"), at("hook-3", "Californian") + 0.6, at("hook-3", "the Professor") - 0.4],
  t: H3 + 0.1,
  until: END - 0.05,
});
B.finish();
