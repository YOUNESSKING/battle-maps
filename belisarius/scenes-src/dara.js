// Move 1: the battle of Dara, 530 AD. Romans = blue ("carth"), Persians = red ("rome").
// Map: assets/dara.jpg (zoom 14, 7.6 m/px). Dara town at (1475, 489); the plain lies to the south.
// Both armies face north-south: the Roman LEFT and the Persian RIGHT are on the EAST (screen right).
const B = Battle();
const { P, at } = B;
const END = B.T.duration;
const NS = "http://www.w3.org/2000/svg";
const svg = document.getElementById("overlay");
const pins = document.getElementById("pins");
const scene = document.getElementById("scene");

// portraits (assets/media) — set true only if the file exists at build time
const HAS = { belisarius: true, perozes: true };  // perozes.png is a Sasanian coin (Kavad I), used as the Persian emblem

// ---------- scene styles: small tags for a close battlefield ----------
const st = document.createElement("style");
st.textContent = `
  .unit .tag { font-size: 12px; padding: 0 6px; margin-top: 3px; border: 1.5px solid rgba(247,243,234,0.85); }
  .unit .blk { border-width: 2.5px; }
  .unit.up .tag { position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); margin: 0 0 4px 0; }
  .ctr { position: absolute; padding: 6px 22px 8px; color: #fff; font-weight: 700; font-size: 38px; letter-spacing: 0.06em;
         border: 3px solid #f3eee2; box-shadow: 0 8px 18px rgba(0,0,0,0.5); white-space: nowrap; }
  .ctr small { font-size: 24px; font-weight: 500; letter-spacing: 0.12em; margin-right: 12px; opacity: 0.9; }
  .ctr.rome { background: var(--rome); } .ctr.carth { background: var(--carth); }
  .sunbox { position: absolute; left: 1560px; top: 70px; width: 280px; height: 170px; }
`;
document.head.appendChild(st);

// ---------- scene-local helpers ----------
const counter = (html, side, left, top, t, until) => {
  const el = document.createElement("div");
  el.className = "ctr " + side; el.innerHTML = html;
  el.style.left = left + "px"; el.style.top = top + "px";
  scene.insertBefore(el, document.getElementById("credit"));
  gsap.set(el, { autoAlpha: 0 });
  B.tl.fromTo(el, { autoAlpha: 0, y: -50, scale: 1.25 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: "bounce.out" }, t);
  if (until != null) B.tl.to(el, { autoAlpha: 0, duration: 0.4 }, until);
  return el;
};
const U = (o) => { // unit with optional tag above
  const el = B.unit(o);
  if (o.up) el.classList.add("up");
  return el;
};
const tagOff = (keys, t) => keys.forEach((k) => { const g = B.units[k].el.querySelector(".tag"); if (g) B.tl.to(g, { autoAlpha: 0, duration: 0.4 }, t); });
const tagOn = (keys, t) => keys.forEach((k) => { const g = B.units[k].el.querySelector(".tag"); if (g) B.tl.to(g, { autoAlpha: 1, duration: 0.4 }, t); });
const stakeRed = (el) => { // Persian stake: red ring + red name tag
  el.querySelector(".face").style.boxShadow = "0 0 0 3px #c4121f, 0 6px 12px rgba(0,0,0,0.5)";
  const nm = el.querySelector(".nm"); if (nm) nm.style.background = "#c4121f";
  return el;
};
const plaque = (o, s = 0.6) => { // world plaque, scaled down for the close zoom
  const el = B.plaque(o);
  gsap.set(el, { scale: s, transformOrigin: "19px 240px" });
  return el;
};
const svgEl = (html, t, dur = 0.6, until) => {
  const g = document.createElementNS(NS, "g");
  g.innerHTML = html; svg.appendChild(g);
  gsap.set(g, { autoAlpha: 0 });
  B.tl.to(g, { autoAlpha: 1, duration: dur }, t);
  if (until != null) B.tl.to(g, { autoAlpha: 0, duration: 0.6 }, until);
  return g;
};
const ditch = (a, b, t, dur, gap) => { // one straight trench section drawing itself
  const g = document.createElementNS(NS, "g");
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const mk = (c, w) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${c}" stroke-width="${w}" stroke-linecap="butt" stroke-dasharray="${len} ${len}" stroke-dashoffset="${len}"/>`;
  g.innerHTML = mk("rgba(28,22,14,0.8)", 13) + mk("#f7f3ea", 7);
  svg.appendChild(g);
  B.tl.to(g.querySelectorAll("line"), { attr: { "stroke-dashoffset": 0 }, duration: dur, ease: "none" }, t);
  return g;
};
const swords = (x, y, s, t, until) => { // crossed-swords duel icon
  const blade = (r) => `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-2.5" y="${-s}" width="5" height="${s * 1.45}" rx="2" fill="#f7f3ea" stroke="#1b1812" stroke-width="2"/>
    <rect x="${-s * 0.3}" y="${s * 0.42}" width="${s * 0.6}" height="5" fill="#1b1812"/><rect x="-2.5" y="${s * 0.47}" width="5" height="${s * 0.3}" fill="#6b4a2b" stroke="#1b1812" stroke-width="1.5"/></g>`;
  const g = svgEl(blade(40) + blade(-40), t, 0.3, until);
  B.tl.fromTo(g, { scale: 0.3, svgOrigin: `${x} ${y}` }, { scale: 1, duration: 0.5, ease: "back.out(3)", svgOrigin: `${x} ${y}` }, t);
  return g;
};

// ---------- geometry (map px) ----------
const CY = 640, FY = 725, XR = 1400, XL = 1560, WR = 1200, WL = 1760; // centre-trench y, forward-trench y, cross-trench x, wing ends
const WALL = [[1418, 440], [1470, 425], [1528, 438], [1550, 478], [1532, 522], [1478, 534], [1428, 518], [1408, 480]];
const HILL = [1815, 702];

// ---------- timing anchors ----------
const A = (k, ph, off = 0) => at(k, ph, off);
const D2 = P("dara-2"), D3 = P("dara-3"), D4 = P("dara-4"), D5 = P("dara-5"), D6 = P("dara-6"), D7 = P("dara-7"),
  D8 = P("dara-8"), D9 = P("dara-9"), D10 = P("dara-10"), D11 = P("dara-11"), D12 = P("dara-12"), D13 = P("dara-13");
const T_40K = A("dara-2", "forty thousand"), T_10K = A("dara-2", "ten thousand more"), T_25K = A("dara-2", "twenty-five thousand,"),
  T_RAW = A("dara-2", "raw recruits"), T_BEL = A("dara-2", "Its commander is Belisarius");
const T_WEAP = A("dara-3", "great weapon"), T_ARM = A("dara-3", "Armoured riders"), T_IMM = A("dara-3", "the Immortals"),
  T_SMASH = A("dara-3", "smash an infantry"), T_OPEN = A("dara-3", "And the plain");
const T_WON = A("dara-4", "already won"), T_DIG = A("dara-4", "They were digging"), T_MSG = A("dara-4", "Perozes sent");
const T_FUN = A("dara-5", "as a funnel"), T_DUG = A("dara-5", "he dug a long ditch"), T_CROSS = A("dara-5", "crossings left open"),
  T_FWD = A("dara-5", "The two outer sections"), T_BACK = A("dara-5", "The center section"), T_INF = A("dara-5", "Behind the center"),
  T_CAV = A("dara-5", "Behind the forward wings");
const T_CORN = A("dara-6", "in the corners"), T_HUNS = A("dara-6", "Hunnic horse archers"), T_LR = A("dara-6", "strike left or right"),
  T_FAR = A("dara-6", "on the far left"), T_HER = A("dara-6", "three hundred Herulian"), T_HILL = A("dara-6", "behind a low hill"),
  T_ANY = A("dara-6", "Any Persian charge"), T_XF = A("dara-6", "crossfire");
const T_YOUNG = A("dara-7", "A young Persian rider"), T_ANSW = A("dara-7", "The man who answered"), T_ANDR = A("dara-7", "named Andreas"),
  T_KNOCK = A("dara-7", "He knocked"), T_SEC = A("dara-7", "When a second champion"), T_TOO = A("dara-7", "Andreas killed him too"),
  T_ROAR = A("dara-7", "The Roman army roared");
const T_REIN = A("dara-8", "reinforcements arrived"), T_AFT = A("dara-8", "waited until the afternoon"), T_EAT = A("dara-8", "Persians ate"),
  T_HUNG = A("dara-8", "catch the enemy hungry"), T_CHG = A("dara-8", "Then the Persian right wing");
const T_HIT = A("dara-9", "It hit the Roman left"), T_SPRANG = A("dara-9", "Then the trap sprang"), T_HERU = A("dara-9", "From behind the hill"),
  T_HUNS2 = A("dara-9", "At the same moment"), T_TWO = A("dara-9", "Hit from two directions"), T_FLED = A("dara-9", "broke and fled");
const T_NOT = A("dara-10", "had not given up"), T_IMMS = A("dara-10", "moved his Immortals"), T_THREW = A("dara-10", "threw his heaviest"),
  T_DRIVEN = A("dara-10", "were driven back"), T_MOMENT = A("dara-10", "For a moment");
const T_DEEP = A("dara-11", "deep into the funnel"), T_SENT = A("dara-11", "He sent the Huns"), T_JOIN = A("dara-11", "to join those on the right"),
  T_GUARD = A("dara-11", "together with his own guard"), T_SLAM = A("dara-11", "They slammed"), T_TWO2 = A("dara-11", "cut it in two"),
  T_STD = A("dara-11", "The Persian standard-bearer"), T_COLL = A("dara-11", "His cavalry, separated");
const T_INFC = A("dara-12", "The Persian infantry"), T_SHIELD = A("dara-12", "threw down their shields"), T_5K = A("dara-12", "Around five thousand"),
  T_STOP = A("dara-12", "Belisarius stopped"), T_VICT = A("dara-12", "A victory was worth");
const T_FIRST = A("dara-13", "It was the first great"), T_SHAPE = A("dara-13", "He shaped the battlefield"),
  T_STRUCK = A("dara-13", "He struck what held"), T_TIME = A("dara-13", "And he made time");

// ---------- camera ----------
B.camera([
  [0, 1490, 700, 1.05],
  [D2 + 6, 1520, 720, 1.6],
  [D3 - 0.5, 1520, 740, 1.6],
  [T_WEAP + 1.5, 1490, 900, 1.9],
  [T_OPEN, 1490, 870, 1.8],
  [D4 + 1.5, 1620, 960, 1.8],
  [D5 + 0.5, 1600, 930, 1.8],
  [T_DUG - 0.5, 1480, 690, 2.2],
  [T_INF, 1480, 685, 2.25],
  [D6 + 1, 1500, 690, 2.1],
  [T_FAR, 1560, 690, 2.1],
  [T_HER + 1.2, 1690, 680, 2.4],
  [T_ANY, 1660, 690, 2.3],
  [T_XF, 1480, 730, 2.1],
  [D7, 1480, 750, 2.1],
  [T_YOUNG + 0.5, 1480, 840, 2.6],
  [T_ROAR, 1480, 835, 2.5],
  [D8 + 0.5, 1490, 820, 2.2],
  [T_REIN + 1.5, 1560, 900, 1.7],
  [T_CHG, 1620, 840, 1.9],
  [T_HIT + 1, 1700, 740, 2.2],
  [T_HUNS2 + 1, 1710, 745, 2.25],
  [T_FLED + 1, 1690, 820, 1.9],
  [D10 + 0.5, 1560, 840, 1.8],
  [T_THREW, 1330, 840, 1.9],
  [T_MOMENT, 1330, 760, 2.1],
  [D11 + 1, 1380, 700, 2.3],
  [T_SLAM, 1330, 730, 2.5],
  [T_COLL + 1.5, 1330, 740, 2.4],
  [D12 + 1, 1470, 860, 1.65],
  [T_STOP, 1480, 850, 1.65],
  [D13, 1480, 790, 1.65],
  [T_SHAPE, 1480, 775, 1.7],
  [END, 1480, 770, 1.75],
]);

// ---------- Dara: the town wall ----------
svgEl(`<polygon points="${WALL.map((p) => p.join(",")).join(" ")}" fill="rgba(239,227,196,0.55)" stroke="#2a241b" stroke-width="7" stroke-linejoin="round"/>` +
  WALL.map(([x, y]) => `<rect x="${x - 8}" y="${y - 8}" width="16" height="16" fill="#efe3c4" stroke="#2a241b" stroke-width="4"/>`).join(""), 0.3, 0.8);
B.label("DARA", 1480, 480, { cls: "country", size: 34, t: 0.6 });
B.showDate(0.4);
B.date("SUMMER 530 AD", 0.6, D7 - 0.3);

// ---------- 2: the odds ----------
counter("<small>PERSIANS</small>40,000", "rome", 1240, 80, T_40K, D4);
counter("+10,000", "rome", 1640, 80, T_10K + 0.4, D4);
counter("<small>ROMANS</small>~25,000", "carth", 1240, 166, T_25K, D4);
B.arrow({ side: "rome", pts: [[2200, 1100], [2040, 1010], [1890, 965]], width: 16, dash: "30 18", t: T_10K + 0.2, dur: 1.4, until: D3 + 0.5 });
B.label("FROM NISIBIS", 2010, 935, { cls: "tg", size: 20, t: T_10K + 0.6, until: D3 + 0.5 });
B.caption("MANY OF THEM RAW RECRUITS", T_RAW - 0.2, T_BEL - 0.1, "carth");
if (HAS.perozes) stakeRed(B.portraitStake({ img: "assets/media/perozes.png", flag: "assets/flag_persia.png", name: "PEROZES", x: 1660, y: 1010, size: 0.9, t: D2 + 1.0, until: D3 }));
else plaque({ name: "PEROZES", role: "Persian commander", side: "rome", x: 1640, y: 1000, t: D2 + 1.0, until: D3 }, 0.75);
if (HAS.belisarius) B.portraitStake({ img: "assets/media/belisarius.png", flag: "assets/flag_rome.png", name: "BELISARIUS · AGE 25", x: 1290, y: 740, size: 0.9, t: T_BEL, until: D3 + 0.3 });
else plaque({ name: "BELISARIUS", role: "Age 25 · first great battle", side: "carth", x: 1300, y: 730, t: T_BEL, until: D3 + 0.3 }, 0.75);
plaque({ name: "HERMOGENES", role: "Co-commander", side: "carth", x: 1370, y: 860, t: T_BEL + 1.6, until: D3 + 0.3 }, 0.6);
B.label("VS", 1545, 830, { cls: "country", size: 60, t: T_BEL + 0.8, until: D3 + 0.3 });

// ---------- 3: the Persian army ----------
U({ id: "PL", side: "rome", kind: "cav", x: 1270, y: 945, w: 100, h: 30, label: "CATAPHRACTS", t: T_WEAP + 0.2 });
U({ id: "PC", side: "rome", kind: "inf", x: 1480, y: 950, w: 150, h: 30, label: "INFANTRY", t: T_WEAP + 0.5 });
U({ id: "PR", side: "rome", kind: "cav", x: 1690, y: 945, w: 100, h: 30, label: "CATAPHRACTS", t: T_WEAP + 0.8 });
U({ id: "IM", side: "rome", kind: "cav", x: 1480, y: 1025, w: 90, h: 28, label: "IMMORTALS", t: T_IMM + 0.2 });
B.caption("CATAPHRACTS · IMMORTALS", T_ARM, T_OPEN - 0.3, "rome");
const ghost = B.arrow({ side: "rome", pts: [[1480, 925], [1480, 800], [1480, 660]], width: 18, dash: "30 18", t: T_SMASH, dur: 1.4, until: D4 + 0.5 });
B.label("OPEN PLAIN", 1610, 790, { cls: "tg", size: 26, t: T_OPEN + 0.3, until: D5 + 0.5 });
B.caption("OPEN COUNTRY: CAVALRY COUNTRY", T_OPEN + 0.4, D4 - 0.2, "rome");

// ---------- 4: Perozes: "prepare my bath" ----------
if (HAS.perozes) stakeRed(B.portraitStake({ img: "assets/media/perozes.png", flag: "assets/flag_persia.png", name: "PEROZES", x: 1640, y: 1170, size: 0.8, t: D4 + 0.4, until: D5 + 0.4 }));
else plaque({ name: "PEROZES", role: "Sure of victory", side: "rome", x: 1560, y: 1160, t: D4 + 0.4, until: D5 + 0.4 }, 0.62);
B.caption("THE ROMANS ARE DIGGING", T_DIG, T_MSG - 0.2, "carth");
const bub = B.bubble("“PREPARE MY BATH IN DARA.”", 1760, 1025, T_MSG, D5 + 0.4);
bub.style.fontSize = "20px"; bub.style.padding = "10px 16px"; bub.style.borderWidth = "3px";
B.caption("— PEROZES TO BELISARIUS (PROCOPIUS)", T_MSG + 1.2, D5 - 0.2, "rome");

// ---------- 5: the trench ----------
B.caption("NOT A WALL · A FUNNEL", T_FUN - 0.2, T_DUG + 0.2, "carth");
const G = 9; // half-width of the open crossings
const secs = [
  [[WR, FY], [1290 - G, FY]], [[1290 + G, FY], [XR, FY]],
  [[XR, FY], [XR, CY]],
  [[XR, CY], [1480 - G, CY]], [[1480 + G, CY], [XL, CY]],
  [[XL, CY], [XL, FY]],
  [[XL, FY], [1670 - G, FY]], [[1670 + G, FY], [WL, FY]],
];
let tt = T_DUG + 0.1;
secs.forEach(([a, b]) => { const d = Math.hypot(b[0] - a[0], b[1] - a[1]) / 170; ditch(a, b, tt, d); tt += d + 0.05; });
const FUNNEL = [[XR + 6, CY + 6], [XL - 6, CY + 6], [XL - 6, FY + 70], [XR + 6, FY + 70]];
svgEl(`<polygon points="${FUNNEL.map((p) => p.join(",")).join(" ")}" fill="rgba(247,243,234,0.2)" stroke="rgba(247,243,234,0.7)" stroke-width="3" stroke-dasharray="10 8"/>`, T_BACK + 1.2, 0.8, D7);
[1290, 1480, 1670].forEach((x, i) => B.label("▲", x, (i === 1 ? CY : FY) + 16, { cls: "tg", size: 14, anchor: [-50, 0], t: T_CROSS + i * 0.15, until: D6 }));
const hl1 = B.highlight([[WR, FY], [XR, FY]], T_FWD, D6, 30);
const hl2 = B.highlight([[XL, FY], [WL, FY]], T_FWD, D6, 30);
B.label("FORWARD", 1715, FY + 30, { cls: "tg", size: 16, anchor: [-50, 0], t: T_FWD + 0.3, until: D6 });
B.label("FORWARD", 1245, FY + 30, { cls: "tg", size: 16, anchor: [-50, 0], t: T_FWD + 0.4, until: D6 });
const hl3 = B.highlight([[XR, CY], [XL, CY]], T_BACK, D6, 30);
B.tl.to([hl1, hl2, hl3], { opacity: 0, duration: 0.8 }, D6 + 0.5);
B.label("REFUSED CENTRE", 1480, CY + 58, { cls: "tg", size: 16, t: T_BACK + 0.4, until: D6 + 0.5 });
U({ id: "INF", side: "carth", kind: "inf", x: 1480, y: 600, w: 120, h: 24, label: "INFANTRY", t: T_INF + 0.8 });
U({ id: "RC", side: "carth", kind: "cav", x: 1275, y: 682, w: 70, h: 26, label: "ROMAN CAVALRY", t: T_CAV + 0.6 });
U({ id: "LC", side: "carth", kind: "cav", x: 1690, y: 682, w: 70, h: 26, label: "BOUZES · CAVALRY", t: T_CAV + 0.9 });
B.caption("CROSSINGS LEFT OPEN", T_CROSS, T_FWD - 0.1, "carth");
B.caption("WEAKEST TROOPS IN THE CENTRE", T_INF + 0.6, T_CAV + 2.4, "carth");

// ---------- 6: Huns in the corners, Heruli behind the hill ----------
U({ id: "HR", side: "carth", kind: "light", x: 1372, y: 702, w: 36, h: 22, label: "SIMMAS · ASCAN", up: true, t: T_CORN + 0.4 });
U({ id: "HL", side: "carth", kind: "light", x: 1588, y: 702, w: 36, h: 22, label: "SUNICAS · AIGAN", up: true, t: T_CORN + 0.7 });
U({ id: "GUARD", side: "carth", kind: "cav", x: 1340, y: 590, w: 44, h: 22, label: "BELISARIUS", t: D6 + 0.8 });
B.caption("HUN HORSE ARCHERS · 600 IN EACH CORNER", T_HUNS, T_FAR - 0.2, "carth");
[[[1385, 690], [1418, 670]], [[1360, 715], [1330, 745]], [[1575, 690], [1542, 670]], [[1600, 715], [1630, 745]]].forEach((pts, i) =>
  B.arrow({ side: "carth", pts, width: 6, t: T_LR + (i % 2) * 0.25, dur: 0.6, until: T_FAR }));
svgEl(`<defs><radialGradient id="hillg" cx="50%" cy="45%" r="55%"><stop offset="0%" stop-color="rgba(92,64,34,0.62)"/><stop offset="70%" stop-color="rgba(107,74,43,0.35)"/><stop offset="100%" stop-color="rgba(107,74,43,0)"/></radialGradient></defs>
  <ellipse cx="${HILL[0]}" cy="${HILL[1]}" rx="78" ry="36" fill="url(#hillg)"/>
  <ellipse cx="${HILL[0]}" cy="${HILL[1]}" rx="62" ry="26" fill="none" stroke="rgba(76,50,25,0.75)" stroke-width="2.5"/>
  <ellipse cx="${HILL[0] - 4}" cy="${HILL[1] - 3}" rx="38" ry="15" fill="none" stroke="rgba(76,50,25,0.75)" stroke-width="2.5"/>
  <ellipse cx="${HILL[0] - 6}" cy="${HILL[1] - 5}" rx="15" ry="6" fill="rgba(76,50,25,0.5)" stroke="rgba(76,50,25,0.8)" stroke-width="2"/>`, T_FAR, 0.8);
B.label("HILL", HILL[0], HILL[1] + 38, { cls: "tg", size: 16, t: T_FAR + 0.4, until: D8 });
U({ id: "HER", side: "carth", kind: "cav", x: 1790, y: 612, w: 44, h: 22, label: "300 HERULI · PHARAS", up: true, t: T_HER + 0.2 });
B.move("HER", T_HILL, 1.8, 1826, 666);
B.tl.to(B.units.HER.el, { opacity: 0.45, duration: 1.0 }, T_HILL + 1.4);
B.caption("300 HERULI · HIDDEN BEHIND THE HILL", T_HILL + 0.2, T_ANY - 0.2, "carth");
B.arrow({ side: "rome", pts: [[1480, 925], [1480, 800], [1480, 680]], width: 16, dash: "26 16", t: T_ANY + 0.4, dur: 1.2, until: D7 });
[[[1392, 700], [1440, 700]], [[1568, 700], [1520, 700]], [[1455, 612], [1462, 655]], [[1505, 612], [1498, 655]]].forEach((pts, i) =>
  B.arrow({ side: "carth", pts, width: 7, t: T_XF + i * 0.12, dur: 0.5, until: D7 }));
B.caption("A CHARGE INTO A CROSSFIRE", T_XF, D7 - 0.2, "carth");

// ---------- 7: day one, the champions ----------
B.date("DAY ONE", D7, D8 - 0.3);
tagOff(["PL", "PC", "PR", "IM", "INF", "RC", "LC", "HR", "HL", "GUARD", "HER"], D7 + 0.2);
B.caption("DAY ONE · CHAMPIONS", D7 + 0.3, T_ANSW - 0.2);
swords(1470, 768, 20, T_YOUNG + 0.6, D8);
U({ id: "CH1", side: "rome", kind: "cav", x: 1560, y: 925, w: 28, h: 18, label: "PERSIAN CHAMPION", up: true, t: T_YOUNG + 0.2 });
B.move("CH1", T_YOUNG + 0.9, 1.6, 1522, 812);
U({ id: "AND", side: "carth", kind: "inf", x: 1478, y: 690, w: 26, h: 18, label: "ANDREAS", t: T_ANDR - 1.6 });
B.move("AND", T_ANDR - 1.0, 1.8, 1430, 800);
B.caption("ANDREAS · A WRESTLING TRAINER FROM THE BATHS", T_ANSW + 0.3, T_TOO - 0.3, "carth");
tagOff(["CH1"], T_KNOCK - 0.8);
B.move("CH1", T_KNOCK - 0.6, 0.6, 1456, 802, "power2.in");
B.grey(["CH1"], T_KNOCK + 0.2, 0.5);
B.move("CH1", T_KNOCK + 0.2, 0.5, 1492, 824);
B.hideUnits(["CH1"], T_KNOCK + 1.6, 0.6);
U({ id: "CH2", side: "rome", kind: "cav", x: 1600, y: 925, w: 28, h: 18, label: "SECOND CHAMPION", up: true, t: T_SEC + 0.2 });
B.move("CH2", T_SEC + 0.8, 1.4, 1522, 812);
tagOff(["CH2"], T_TOO - 1.0);
B.move("CH2", T_TOO - 0.8, 0.6, 1456, 802, "power2.in");
B.grey(["CH2"], T_TOO + 0.1, 0.5);
B.move("CH2", T_TOO + 0.1, 0.5, 1492, 824);
B.hideUnits(["CH2"], T_TOO + 1.6, 0.6);
B.caption("THE ROMAN ARMY ROARS", T_ROAR, D8 - 0.2, "carth");
B.tl.fromTo(B.units.INF.el, { scale: 1 }, { scale: 1.18, duration: 0.25, yoyo: true, repeat: 3, ease: "sine.inOut" }, T_ROAR + 0.2);
B.hideUnits(["AND"], D8 + 0.2, 0.6);

// ---------- 8: day two, the afternoon attack ----------
B.date("DAY TWO", D8, D13 - 0.3);
tagOn(["PL", "PC", "PR", "IM", "INF", "RC", "LC", "HR", "HL", "GUARD", "HER"], D8 + 0.4);
U({ id: "R10", side: "rome", kind: "cav", x: 1800, y: 1040, w: 110, h: 28, label: "+10,000", t: T_REIN + 1.4 });
B.arrow({ side: "rome", pts: [[2260, 1300], [2080, 1160], [1880, 1070]], width: 20, t: T_REIN, dur: 1.6, until: T_CHG });
{ // sun: noon -> afternoon
  const box = document.createElement("div");
  box.className = "sunbox";
  box.innerHTML = `<svg width="280" height="170" viewBox="0 0 280 170" style="position:absolute;left:0;top:0">
      <path d="M 20 150 A 120 120 0 0 1 260 150" fill="none" stroke="rgba(247,243,234,0.85)" stroke-width="4" stroke-dasharray="10 8"/>
      <line x1="10" y1="152" x2="270" y2="152" stroke="rgba(247,243,234,0.9)" stroke-width="4"/></svg>
    <div class="arm" style="position:absolute;left:140px;top:150px;width:0;height:0;">
      <div style="position:absolute;left:-24px;top:-144px;width:48px;height:48px;border-radius:50%;background:#ffcf4a;border:4px solid #1b1812;box-shadow:0 0 22px 8px rgba(255,200,60,0.7)"></div></div>
    <div class="t1" style="position:absolute;left:0;right:0;top:92px;text-align:center;font-size:30px;font-weight:700;letter-spacing:0.12em;color:#fbfaf6;text-shadow:0 2px 5px #000">NOON</div>
    <div class="t2" style="position:absolute;left:0;right:0;top:92px;text-align:center;font-size:30px;font-weight:700;letter-spacing:0.12em;color:#fbfaf6;text-shadow:0 2px 5px #000">AFTERNOON</div>`;
  scene.insertBefore(box, document.getElementById("credit"));
  gsap.set(box, { autoAlpha: 0 }); gsap.set(box.querySelector(".t2"), { autoAlpha: 0 });
  gsap.set(box.querySelector(".arm"), { rotation: -5 });
  B.tl.to(box, { autoAlpha: 1, duration: 0.5 }, T_AFT - 0.6);
  B.tl.to(box.querySelector(".arm"), { rotation: 52, duration: 2.6, ease: "power1.inOut" }, T_AFT + 0.2);
  B.tl.to(box.querySelector(".t1"), { autoAlpha: 0, duration: 0.4 }, T_AFT + 1.6);
  B.tl.to(box.querySelector(".t2"), { autoAlpha: 1, duration: 0.4 }, T_AFT + 1.8);
  B.tl.to(box, { autoAlpha: 0, duration: 0.5 }, D9 + 0.5);
}
B.caption("PERSIANS EAT LATE · ROMANS HUNGRY", T_EAT, T_CHG - 0.2, "rome");

// ---------- 9: the Persian right wing, and the trap ----------
const aPR = B.arrow({ side: "rome", pts: [[1690, 920], [1695, 830], [1700, 740]], width: 20, t: T_CHG + 0.3, dur: 1.6 });
B.move("PR", T_HIT - 0.4, 3.2, 1700, 708);
B.move("LC", T_HIT + 0.4, 2.8, 1700, 608);
B.caption("THE ROMAN LEFT IS PUSHED BACK", T_HIT + 0.5, T_SPRANG - 0.2, "rome");
B.tl.to(B.units.HER.el, { opacity: 1, duration: 0.4 }, T_HERU);
tagOff(["HER"], T_HERU);
B.arrow({ side: "carth", pts: [[1830, 676], [1812, 722], [1778, 758], [1748, 766]], width: 14, t: T_HERU + 0.1, dur: 1.2, until: D10 + 0.5 });
B.move("HER", T_HERU + 0.3, 1.4, 1782, 770);
B.arrow({ side: "carth", pts: [[1602, 704], [1622, 706], [1640, 706]], width: 9, t: T_HUNS2 + 0.3, dur: 0.7, until: D10 + 0.5 });
tagOff(["HL"], T_HUNS2);
B.move("HL", T_HUNS2 + 0.5, 1.0, 1622, 730);
B.caption("THE TRAP SPRINGS", T_SPRANG, T_TWO - 0.2, "carth");
B.caption("HIT FROM TWO DIRECTIONS", T_TWO, T_FLED + 0.1, "carth");
B.move("PR", T_FLED, 3.6, 1800, 1120, "power2.in");
B.grey(["PR"], T_FLED, 1.0);
B.greyArrow(aPR, T_FLED, D10);
B.hideUnits(["PR"], T_FLED + 3.2, 0.8);
B.caption("PERSIAN RIGHT WING BREAKS", T_FLED + 0.5, D10 - 0.2, "carth");
// the Romans re-form on the left
B.move("LC", D10 + 0.5, 2.0, 1690, 682);
B.move("HL", D10 + 0.3, 1.6, 1588, 702);
tagOn(["HL", "HER"], D10 + 2.2);
B.move("HER", D10 + 0.6, 2.2, 1800, 612);

// ---------- 10: the Immortals shift to the Persian left ----------
if (HAS.perozes) stakeRed(B.portraitStake({ img: "assets/media/perozes.png", flag: "assets/flag_persia.png", name: "PEROZES", x: 1060, y: 1110, size: 0.8, t: T_NOT - 0.8, until: T_THREW + 0.2 }));
else plaque({ name: "PEROZES", role: "Not finished yet", side: "rome", x: 1000, y: 1110, t: T_NOT - 0.8, until: T_THREW + 0.2 }, 0.62);
B.arrow({ side: "rome", pts: [[1430, 1030], [1350, 1037], [1300, 1033]], width: 10, dash: "16 10", t: T_IMMS, dur: 1.4, until: T_THREW + 1 });
B.move("IM", T_IMMS + 0.2, 2.4, 1265, 1025);
const aIM = B.arrow({ side: "rome", pts: [[1265, 1000], [1262, 870], [1265, 740]], width: 24, t: T_THREW, dur: 1.8 });
B.move("PL", T_THREW + 0.3, 3.0, 1265, 705);
B.move("IM", T_THREW + 0.5, 3.0, 1265, 800);
B.move("RC", T_THREW + 1.2, 2.4, 1230, 592);
B.caption("THE IMMORTALS HIT THE ROMAN RIGHT", T_THREW + 0.4, T_MOMENT - 0.2, "rome");
B.caption("HAS THE BATTLE TURNED?", T_MOMENT, D11 - 0.2, "rome");

// ---------- 11: the Huns cross behind the centre and cut the column ----------
const route = B.arrow({ side: "carth", pts: [[1590, 688], [1592, 650], [1545, 627], [1430, 627], [1392, 650]], width: 9, dash: "14 9", t: T_SENT + 0.2, dur: 2.2, until: T_SLAM });
tagOff(["HL", "HR", "GUARD", "INF"], T_SENT);
B.move("HL", T_SENT + 0.3, 0.7, 1592, 648);
B.move("HL", T_SENT + 1.0, 1.4, 1430, 627, "none");
B.move("HL", T_SENT + 2.4, 0.8, 1392, 662);
B.move("GUARD", T_GUARD, 1.4, 1330, 668);
B.caption("HUNS FROM THE LEFT + BELISARIUS'S GUARD", T_JOIN, T_SLAM - 0.2, "carth");
// the standard
const std = svgEl(`<line x1="1250" y1="${772}" x2="1250" y2="${728}" stroke="#2a241b" stroke-width="4"/>
  <polygon points="1252,729 1282,733 1276,742 1282,751 1252,748" fill="#c4121f" stroke="#f7f3ea" stroke-width="2"/>`, T_DEEP, 0.4);
B.tl.to(std, { rotation: 100, svgOrigin: "1250 772", duration: 0.9, ease: "power2.in" }, T_STD + 0.6);
B.tl.to(std, { autoAlpha: 0, duration: 0.6 }, T_STD + 2.4);
const aCut = B.arrow({ side: "carth", pts: [[1390, 700], [1350, 752], [1170, 758]], width: 22, t: T_SLAM, dur: 1.4, until: D12 + 1 });
B.move("HR", T_SLAM + 0.2, 1.3, 1335, 760);
B.move("HL", T_SLAM + 0.3, 1.3, 1296, 766);
B.move("GUARD", T_SLAM + 0.4, 1.3, 1352, 732);
B.move("PL", T_TWO2, 1.4, 1245, 682);
B.move("IM", T_TWO2, 1.4, 1268, 826);
B.caption("CUT IN TWO", T_TWO2, T_STD - 0.2, "carth");
B.caption("STANDARD-BEARER KILLED", T_STD, D12 - 0.2, "carth");
B.move("RC", T_TWO2 + 0.4, 1.8, 1230, 640);
B.grey(["PL", "IM"], T_COLL, 1.2);
B.greyArrow(aIM, T_COLL, D12 + 0.5);

// ---------- 12: the rout, and no reckless pursuit ----------
tagOff(["PL", "IM", "PC", "INF", "RC", "LC", "HER"], D12 + 0.2);
B.move("PL", D12 + 0.4, 4.0, 1150, 1180, "power2.in");
B.move("IM", D12 + 0.4, 4.0, 1230, 1210, "power2.in");
B.hideUnits(["PL", "IM"], D12 + 3.8, 0.8);
B.caption("THE PERSIAN LEFT COLLAPSES", D12 + 0.2, T_SHIELD - 0.5, "carth");
[[[1250, 720], [1215, 900], [1170, 1080]], [[1270, 840], [1250, 980], [1230, 1120]]].forEach((pts, i) =>
  B.arrow({ side: "rome", pts, width: 14, dash: "20 12", t: D12 + 0.5 + i * 0.3, dur: 1.6, until: T_STOP }));
B.arrow({ side: "rome", pts: [[1480, 975], [1480, 1060], [1480, 1150]], width: 14, dash: "20 12", t: T_SHIELD + 0.2, dur: 1.4, until: T_STOP });
B.grey(["PC", "R10"], T_SHIELD - 0.3, 1.0);
B.move("PC", T_SHIELD, 4.0, 1480, 1180, "power2.in");
B.move("R10", T_SHIELD, 4.0, 1900, 1260, "power2.in");
B.hideUnits(["PC", "R10"], T_SHIELD + 3.6, 0.8);
B.caption("THE PERSIAN CENTRE THROWS DOWN ITS SHIELDS", T_SHIELD - 0.2, T_5K - 0.2, "rome");
B.stat(["~5,000 PERSIANS KILLED", "IN THE ROUT OF THE LEFT WING ALONE"], T_5K, T_STOP - 0.3, "rome");
B.line([[1120, 905], [1860, 905]], { dash: "26 16", width: 6, t: T_STOP - 0.2, dur: 1.4, until: D13 + 0.4 });
[["RC", 1250], ["GUARD", 1335], ["HR", 1400], ["HL", 1560], ["LC", 1690], ["HER", 1790]].forEach(([k, x], i) =>
  B.move(k, T_STOP - 1.4 + i * 0.12, 2.4, x, 872, "power2.out"));
B.caption("NO RECKLESS PURSUIT", T_STOP + 0.4, D13 - 0.2, "carth");

// ---------- 13: recap ----------
B.dateBox(D13 - 0.2, null);
B.hideUnits(["RC", "GUARD", "HR", "HL", "LC", "HER", "INF"], D13 + 0.2, 0.8);
B.highlight([[WR, FY], [XR, FY], [XR, CY], [XL, CY], [XL, FY], [WL, FY]], T_SHAPE, D13 + 99, 34);
svgEl(`<polygon points="${FUNNEL.map((p) => p.join(",")).join(" ")}" fill="rgba(196,18,31,0.22)" stroke="rgba(247,243,234,0.8)" stroke-width="3" stroke-dasharray="10 8"/>`, T_SHAPE + 0.4, 0.8);
B.label("FUNNEL", 1480, 668, { cls: "tg", size: 20, t: T_SHAPE + 0.6 });
B.arrow({ side: "rome", pts: [[1480, 900], [1480, 820], [1480, 740]], width: 14, dash: "22 14", t: T_SHAPE + 0.8, dur: 1.0 });
B.arrow({ side: "carth", pts: [[1830, 676], [1812, 722], [1778, 758], [1748, 766]], width: 11, t: T_STRUCK, dur: 1.0 });
B.arrow({ side: "carth", pts: [[1600, 706], [1640, 706]], width: 8, t: T_STRUCK + 0.3, dur: 0.5 });
B.arrow({ side: "carth", pts: [[1390, 700], [1350, 752], [1190, 758]], width: 14, t: T_STRUCK + 0.6, dur: 1.0 });
B.label("RIGHT WING", 1705, 782, { cls: "tg", size: 16, t: T_STRUCK + 0.4, anchor: [-50, 0] });
B.label("STANDARD", 1210, 780, { cls: "tg", size: 16, t: T_STRUCK + 0.9, anchor: [-50, 0] });
const card = B.method(T_SHAPE - 0.2, null, [T_SHAPE, T_STRUCK, T_TIME]);
card.style.top = "640px";
B.finish();
