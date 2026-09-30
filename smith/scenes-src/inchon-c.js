// Inchon C (locked style): night beachhead front + territory, casualty card, Seoul, method card + subscribe cue.
// Inchon C: beachhead, Seoul retaken, method card. Basemap inchon (zoom 12). Marines = blue ("carth"), North Koreans = red ("rome").
const B = Battle();
const { P, at, tl } = B;
const END = B.T.duration;
const K = FXK(B);
// sound: whoosh on big camera zooms (scale x1.6 or more within 6 s), at the fastest point of the move
const camSfx = (keys) => { for (let i = 1; i < keys.length; i++) { const r = keys[i][3] / keys[i - 1][3], d = keys[i][0] - keys[i - 1][0];
  /* no zoom sound on ordinary camera moves (owner 2026-09-30: only the biggest moves) */ } return keys; };

const CITY = [1179, 921], WOLMI = [1060, 906], SEOUL = [2192, 568], KIMPO = [1645, 598];
const I8 = P("inchon-8"), I9 = P("inchon-9");
const T_MID = I8 + 0.2, T_COST = at("inchon-8", "The cost"), T_EXP = at("inchon-8", "for a landing");
const T_SEOUL = at("inchon-8", "Two weeks later"), T_CUT = at("inchon-8", "With its supply"), T_WON = at("inchon-8", "Within a month");
const T_R1 = at("inchon-9", "Build the lifeline"), T_R2 = at("inchon-9", "Refuse to be"), T_R3 = at("inchon-9", "And keep the");
const T_TIDE = at("inchon-9", "At Inchon, he"), T_NORTH = at("inchon-9", "Because in the mountains"), T_SUBS = at("inchon-9", "consider subscribing"), T_PLAN = at("inchon-9", "Smith's planning");

// ---------- camera ----------
B.camera(camSfx([
  [0, 1200, 900, 1.75],
  [T_COST, 1230, 805, 1.55],
  [T_SEOUL - 0.6, 1240, 810, 1.5],
  [T_SEOUL + 1.5, 1500, 820, 0.95],
  [T_CUT + 1, 1560, 860, 0.85],
  [I9, 1560, 860, 0.82],
  [T_NORTH, 1520, 840, 0.9],
  [END, 1500, 700, 0.95],
]));

// ---------- scene-local helpers ----------
const WORLD = document.getElementById("world"), OVL = document.getElementById("overlay");
const MASK = "assets/inchon_land.png";
const G = (lat, lon) => {
  const n = 256 * 2 ** 12, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 891946).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 405497).toFixed(1)];
};
K.grid(G, 37.2, 37.8, 126.2, 127.3, 0.1, 0);
// night overlay (goosegreen move1.js G.night): dark blue wash + stars, under the overlay
const nightLayer = (t, until, o = {}) => {
  let seed = 7; const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  let stars = "";
  for (let i = 0; i < 170; i++) {
    const x = r() * 2880, y = r() * 1620, sz = 1.5 + r() * 2.5;
    stars += `<div style="position:absolute;left:${x.toFixed(0)}px;top:${y.toFixed(0)}px;width:${sz.toFixed(1)}px;height:${sz.toFixed(1)}px;border-radius:50%;background:#e8eeff;opacity:${(0.35 + r() * 0.55).toFixed(2)}"></div>`;
  }
  const el = document.createElement("div");
  el.style.cssText = "position:absolute;left:0;top:0;width:2880px;height:1620px;pointer-events:none;background: radial-gradient(ellipse 70% 60% at 55% 50%, rgba(10,18,44,0.62), rgba(4,8,22,0.82));";
  el.innerHTML = stars; WORLD.insertBefore(el, OVL);
  gsap.set(el, { autoAlpha: 0 });
  tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: o.dur || 0.8, ease: "sine.inOut" }, t);
  if (until != null) tl.to(el, { autoAlpha: 0, duration: o.outDur || 3.5, ease: "sine.inOut" }, until);
  return el;
};
const U = (id, side, x, y, t, o = {}) => {
  B.unit({ id, side, x, y, w: o.w || 28, h: o.h || 20, label: o.label, t });
  if (o.label) B.units[id].el.querySelector(".tag").style.cssText += `font-size:${o.fs || 10}px;padding:0 4px;margin-top:2px;white-space:nowrap`;
  K.counter(id, { icon: "infantry", flag: side === "carth" ? "us" : "kpa", size: o.size });
};

// ---------- inchon-8: night, the beachhead pushed inland ----------
const T_DAWN = T_COST + 5.5;
nightLayer(0, T_DAWN);
B.showDate(0.2);
B.date("15 SEPT · MIDNIGHT", 0.4, T_DAWN);
B.date("16 SEPT · DAWN", T_DAWN + 0.2, T_SEOUL - 0.2);
B.city("INCHON", ...CITY, { size: 22, t: 0.3, until: T_SEOUL + 1.5 });
B.label("WOLMI-DO", WOLMI[0] - 36, WOLMI[1] - 10, { cls: "city", size: 18, t: 0.3, until: T_SEOUL, anchor: [-100, -50] });
// drawn north -> south round the city: sideA = left = outside = North Korean red, sideB = right = inside = Marine blue
const beachA = [[1102, 842], [1170, 830], [1250, 870], [1275, 950], [1250, 1020], [1212, 1046]];
const beachB = [[1102, 842], [1210, 800], [1320, 860], [1350, 960], [1300, 1040], [1212, 1046]];
const T_PUSH = 1.6, PUSH = 3.0;
const bfront = K.front({ pts: beachA, to: beachB, sideA: "rome", sideB: "carth", width: 15, t: 0.2, dur: 1.2, moveT: T_PUSH, moveDur: PUSH, until: T_SEOUL + 0.6 });
K.frontTint({ pts: beachA, to: beachB, dir: 1, depth: 170, color: "#4a6a9a", alpha: 0.34, mask: MASK, t: 0.1, moveT: T_PUSH, moveDur: PUSH, until: T_SEOUL + 0.6 });
const fwdRed = K.frontTint({ pts: beachA.slice(1, -1), dir: -1, depth: 95, color: "#a8503c", alpha: 0.34, mask: MASK, t: 0.3, until: T_SEOUL + 0.6 });
fwdRed.forEach((pl) => K.lose(pl, T_PUSH - 0.3));
K.frontTint({ pts: beachB.slice(1, -1), dir: -1, depth: 170, color: "#a8503c", alpha: 0.34, mask: MASK, t: T_PUSH + 1.2, until: T_SEOUL + 0.6 });
K.night({ lines: [bfront], tOn: 0, tOff: T_DAWN });
U("m5", "carth", 1160, 875, 0.6, { size: "III", label: "5TH MAR" });
U("m1", "carth", 1205, 990, 0.8, { size: "III", label: "1ST MAR" });
B.move("m5", T_PUSH, PUSH, 1235, 875);
B.move("m1", T_PUSH, PUSH, 1262, 978);
U("k0", "rome", 1300, 845, 0.7, { size: "II" });
U("k1", "rome", 1325, 1000, 0.9, { size: "II" });
B.move("k0", T_PUSH, PUSH, 1385, 822);
B.move("k1", T_PUSH, PUSH, 1405, 1010);
B.grey(["k0", "k1"], T_PUSH + PUSH, 1.0);
SFX("tick", 0.6); // counters drop in
B.caption("BY MIDNIGHT: BEACHHEAD SECURE", 0.9, T_COST - 0.1, "carth");
// casualty card, landing day (single column: no sourced North Korean landing-day figure in smith/research)
const card = K.casualties({ headA: "U.S. MARINES", flagA: "us", flagB: "kpa", rows: [["killed", "~20", ""], ["wounded", "~175", ""]], t: T_COST + 0.1, until: T_SEOUL - 0.3 });
const cin = card.firstElementChild;
cin.children[1].remove();
cin.style.flexDirection = "column"; cin.style.gap = "10px"; cin.style.alignItems = "center";
const kick = document.createElement("div");
kick.style.cssText = "font-size:24px;letter-spacing:0.36em;color:#c9b48a;font-weight:500";
kick.textContent = "LANDING DAY · 15 SEPT";
cin.insertBefore(kick, cin.firstChild);

// ---------- Seoul retaken ----------
B.date("28 SEPTEMBER 1950", T_SEOUL, null, 34);
B.city("KIMPO", ...KIMPO, { size: 30, t: T_SEOUL + 0.2 });
B.city("SEOUL", ...SEOUL, { left: true, size: 38, t: T_SEOUL + 0.4 });
B.label("HAN RIVER", 1740, 470, { cls: "river", size: 28, t: T_SEOUL + 0.6, rot: -18 });
B.hideUnits(["m5", "m1", "k0", "k1"], T_SEOUL + 0.4, 0.6);
B.arrow({ side: "carth", pts: [[1280, 860], [1450, 700], [1620, 610]], width: 20, t: T_SEOUL + 0.6, dur: 2.2 });
B.arrow({ side: "carth", pts: [[1300, 940], [1650, 820], [1980, 660], [2150, 590]], width: 24, t: T_SEOUL + 1.2, dur: 3.0 });
B.caption("SEOUL BACK IN U.N. HANDS", T_SEOUL + 2.0, T_CUT - 0.2, "carth");
// supply lines south, cut
const sup = [[[2230, 300], [2210, 560], [2150, 900], [2080, 1300], [2020, 1620]], [[2600, 300], [2400, 560], [2350, 1000], [2400, 1620]]];
const supEls = sup.map((pts, i) => B.line(pts, { color: "var(--rome)", dash: "22 12", width: 10, t: T_SEOUL + 2.8 + i * 0.4, dur: 2.0, until: I9 + 0.5 }));
[[2175, 760], [2375, 800]].forEach(([x, y], i) => {
  const X = document.createElement("div");
  X.textContent = "✕";
  X.style.cssText = `position:absolute;left:${x - 36}px;top:${y - 60}px;font-size:90px;font-weight:700;color:#1f4fc4;text-shadow:0 0 4px #fff,0 0 2px #fff;`;
  document.getElementById("pins").appendChild(X);
  gsap.set(X, { autoAlpha: 0 });
  tl.fromTo(X, { autoAlpha: 0, scale: 2.5 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power3.in" }, T_CUT + 0.2 + i * 0.35);
  tl.to(X, { autoAlpha: 0, duration: 0.5 }, I9 + 0.5);
});
// the North Korean army in the south collapses and flees north
const reds = [[1900, 1220], [2150, 1250], [2400, 1200], [2650, 1240], [1700, 1260]];
reds.forEach(([x, y], i) => {
  B.unit({ id: "r" + i, side: "rome", x, y, w: 46, h: 32, t: T_SEOUL + 3.4 + i * 0.15 });
  K.counter("r" + i, { icon: "infantry", flag: "kpa", size: "XX" });
  B.move("r" + i, T_CUT + 1.4 + i * 0.2, 4.5, x + 60 - i * 20, y - 260, "power1.in");
});
B.grey(reds.map((_, i) => "r" + i), T_CUT + 2.0, 1.4);
B.label("NORTH KOREAN ARMY COLLAPSES", 2200, 1340, { cls: "tg", size: 36, t: T_CUT + 1.0, until: I9 + 0.3, anchor: [-50, -50] });
B.caption("WITHIN A MONTH, THE WAR SEEMED WON", T_WON, I9 - 0.1, "carth");
B.hideUnits(reds.map((_, i) => "r" + i), I9 + 0.3, 0.8);

// ---------- inchon-9: METHOD CARD (shared design: keep identical in inchon-9 / hagaru-9 / breakout-8 / ending-2) ----------
const methodCard = (o) => { // o = { t, until, rowT: [t1,t2,t3], hi: index to highlight or -1, hiT }
  const rows = ["BUILD THE LIFELINE FIRST", "REFUSE TO BE RUSHED", "KEEP THE DIVISION WHOLE"];
  const el = document.createElement("div");
  el.style.cssText = "position:absolute;left:50%;top:50%;translate:-50% -50%;width:1180px;padding:44px 64px 50px;background:rgba(16,15,13,0.86);border-top:6px solid #c9b48a;box-shadow:0 24px 50px rgba(0,0,0,0.55);color:#f4f1ea;";
  el.innerHTML = `<div style="font-size:30px;letter-spacing:0.42em;color:#c9b48a;font-weight:500;margin-bottom:20px">SMITH'S METHOD</div>` +
    rows.map((r, i) => `<div class="mrow" style="position:relative;display:flex;align-items:center;gap:30px;padding:14px 20px;margin:6px -20px;border-radius:4px">
      <div class="mhl" style="position:absolute;inset:0;background:rgba(196,18,31,0.28);border-left:8px solid #e3232f;border-radius:4px;opacity:0"></div>
      <div class="mnum" style="position:relative;width:74px;height:74px;flex:none;border-radius:50%;background:#1f4fc4;border:4px solid #f4f1ea;display:flex;align-items:center;justify-content:center;font-size:42px;font-weight:700">${i + 1}</div>
      <div style="position:relative;font-size:62px;font-weight:700;letter-spacing:0.06em;line-height:1.1">${r}</div></div>`).join("");
  document.getElementById("scene").insertBefore(el, document.getElementById("credit"));
  gsap.set(el, { autoAlpha: 0 });
  tl.fromTo(el, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" }, o.t);
  el.querySelectorAll(".mrow").forEach((r, i) => {
    gsap.set(r, { autoAlpha: 0 });
    tl.fromTo(r, { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 0.55, ease: "power3.out" }, o.rowT[i]);
    SFX("hit", o.rowT[i] + 0.1); // each method line slams in
  });
  if (o.hi >= 0) {
    const r = el.querySelectorAll(".mrow")[o.hi];
    tl.to(r.querySelector(".mhl"), { opacity: 1, duration: 0.6 }, o.hiT);
    tl.to(r.querySelector(".mnum"), { backgroundColor: "#c4121f", scale: 1.15, duration: 0.5, ease: "back.out(2)" }, o.hiT);
    el.querySelectorAll(".mrow").forEach((x, i) => { if (i !== o.hi) tl.to(x, { opacity: 0.45, duration: 0.6 }, o.hiT); });
  }
  if (o.until != null) tl.to(el, { autoAlpha: 0, duration: 0.6 }, o.until);
  return el;
};
B.dateBox(I9 - 0.2, null);
B.dim(T_R1 - 1.4, T_NORTH + 1.4, 0.75);
B.caption("MACARTHUR'S VISION · SMITH'S PLANNING", I9 + 0.6, T_R1 - 1.6, "carth");
K.badge({ name: "GEN. DOUGLAS MACARTHUR", role: "THE VISION", photo: "assets/media/macarthur_head.png", initials: "MAC", flag: "us", side: "carth", corner: "tl", t: I9 + 0.2, until: T_R1 - 1.6 });
K.badge({ name: "MAJ. GEN. O.P. SMITH", role: "THE PLANNING", photo: "assets/media/smith_head.png", initials: "OPS", flag: "us", side: "carth", corner: "tr", t: T_PLAN - 0.3, until: T_R1 - 1.6 });
const mcard = methodCard({ t: T_R1 - 1.2, until: T_NORTH + 1.2, rowT: [T_R1 - 0.3, T_R2 - 0.3, T_R3 - 0.1], hi: 2, hiT: T_TIDE - 0.4 });
// subscribe cue on the card: red pill with a bell slides in on "consider subscribing"
const subs = document.createElement("div");
subs.style.cssText = "position:absolute;right:48px;bottom:-30px;display:flex;align-items:center;gap:12px;padding:10px 26px 10px 18px;background:#c4121f;border:3px solid #f4f1ea;border-radius:36px;box-shadow:0 10px 22px rgba(0,0,0,0.5);color:#fff;font-size:30px;font-weight:700;letter-spacing:0.12em";
subs.innerHTML = `<svg class="bell" width="34" height="34" viewBox="0 0 100 100"><path d="M50 10 C33 10 24 24 24 40 L24 60 L14 74 L86 74 L76 60 L76 40 C76 24 67 10 50 10 Z" fill="#fff"/><circle cx="50" cy="84" r="9" fill="#fff"/></svg>SUBSCRIBE`;
mcard.appendChild(subs);
gsap.set(subs, { autoAlpha: 0 });
tl.fromTo(subs, { autoAlpha: 0, x: 60, scale: 0.8 }, { autoAlpha: 1, x: 0, scale: 1, duration: 0.5, ease: "back.out(2)" }, T_SUBS - 0.2);
const bell = subs.querySelector(".bell");
gsap.set(bell, { transformOrigin: "50% 10%" });
tl.to(bell, { rotation: 18, duration: 0.12, yoyo: true, repeat: 5, ease: "sine.inOut" }, T_SUBS + 0.3);
SFX("hit", T_SUBS - 0.1); // subscribe pill lands on the card
// looking north: the next move
B.arrow({ side: "carth", pts: [[1300, 880], [1420, 600], [1500, 330], [1540, 60]], width: 26, t: T_NORTH + 1.6, dur: 3.0 });
B.label("NEXT: THE FROZEN NORTH", 1900, 260, { cls: "tg", size: 40, t: T_NORTH + 2.8 });
// ---------- sound cues (locked kit, levels in tools/sfx_mix_lib.py): only on visible beats ----------
SFX("hit", T_CUT + 0.55);        // first blue X lands on the supply lines
K.raiseTerritory();
B.finish();
