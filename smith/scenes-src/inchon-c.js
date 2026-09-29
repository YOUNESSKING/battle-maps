// Inchon C: beachhead, Seoul retaken, method card. Basemap inchon (zoom 12). Marines = blue ("carth"), North Koreans = red ("rome").
const B = Battle();
const { P, at, tl } = B;
const END = B.T.duration;
// sound: whoosh on big camera zooms (scale x1.6 or more within 6 s), at the fastest point of the move
const camSfx = (keys) => { for (let i = 1; i < keys.length; i++) { const r = keys[i][3] / keys[i - 1][3], d = keys[i][0] - keys[i - 1][0];
  if ((r >= 1.6 || r <= 1 / 1.6) && d <= 6) SFX("whoosh", Math.max(0, keys[i - 1][0] + d / 2 - 0.5)); } return keys; };

const CITY = [1179, 921], WOLMI = [1060, 906], SEOUL = [2192, 568], KIMPO = [1645, 598];
const I8 = P("inchon-8"), I9 = P("inchon-9");
const T_MID = I8 + 0.2, T_COST = at("inchon-8", "The cost"), T_EXP = at("inchon-8", "for a landing");
const T_SEOUL = at("inchon-8", "Two weeks later"), T_CUT = at("inchon-8", "With its supply"), T_WON = at("inchon-8", "Within a month");
const T_R1 = at("inchon-9", "Build the lifeline"), T_R2 = at("inchon-9", "Refuse to be"), T_R3 = at("inchon-9", "And keep the");
const T_TIDE = at("inchon-9", "At Inchon, he"), T_NORTH = at("inchon-9", "In the mountains");

// ---------- camera ----------
B.camera(camSfx([
  [0, 1150, 930, 1.75],
  [T_COST, 1180, 915, 1.55],
  [T_SEOUL, 1500, 820, 0.95],
  [T_CUT + 1, 1560, 860, 0.85],
  [I9, 1560, 860, 0.82],
  [T_NORTH, 1520, 840, 0.9],
  [END, 1500, 700, 0.95],
]));

// ---------- inchon-8: beachhead ----------
B.showDate(0.2);
B.date("15 SEPT · MIDNIGHT", 0.4, T_SEOUL - 0.2);
B.city("INCHON", ...CITY, { size: 22, t: 0.3, until: T_SEOUL + 1.5 });
B.label("WOLMI-DO", WOLMI[0] - 30, WOLMI[1] - 8, { cls: "city", size: 18, t: 0.3, until: T_SEOUL, anchor: [-100, -50] });
const beachA = [[1102, 842], [1170, 830], [1250, 870], [1275, 950], [1250, 1020], [1212, 1046]];
const beachB = [[1102, 842], [1210, 800], [1320, 860], [1350, 960], [1300, 1040], [1212, 1046]];
B.front({ pts: beachA, to: beachB, width: 8, t: T_MID + 0.4, dur: 2.2, moveT: T_MID + 3.0, moveDur: 3.0, until: T_SEOUL + 0.6 });
[[1150, 870], [1220, 900], [1200, 990], [1150, 950]].forEach(([x, y], i) => {
  B.unit({ id: "m" + i, side: "carth", x, y, w: 24, h: 24, t: T_MID + 0.6 + i * 0.2 });
  B.move("m" + i, T_MID + 3.0, 3.0, x + 45, y + (i === 2 ? 20 : 0));
});
B.caption("BEACHHEAD SECURE", T_MID + 1.2, T_COST - 0.2, "carth");
B.stat(["DAY ONE: ~20 MARINES KILLED", "UNDER 200 WOUNDED"], T_COST + 0.2, T_SEOUL - 0.3, "carth");

// ---------- Seoul retaken ----------
B.date("28 SEPTEMBER 1950", T_SEOUL, null, 34);
B.city("KIMPO", ...KIMPO, { size: 30, t: T_SEOUL + 0.2 });
B.city("SEOUL", ...SEOUL, { left: true, size: 38, t: T_SEOUL + 0.4 });
B.label("HAN RIVER", 1740, 470, { cls: "river", size: 28, t: T_SEOUL + 0.6, rot: -18 });
B.hideUnits(["m0", "m1", "m2", "m3"], T_SEOUL + 0.4, 0.6);
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
const reds = [[1900, 1300], [2150, 1340], [2400, 1280], [2650, 1330], [1700, 1360]];
reds.forEach(([x, y], i) => {
  B.unit({ id: "r" + i, side: "rome", x, y, w: 36, h: 36, t: T_SEOUL + 3.4 + i * 0.15 });
  B.move("r" + i, T_CUT + 1.4 + i * 0.2, 4.5, x + 60 - i * 20, y - 260, "power1.in");
});
B.grey(reds.map((_, i) => "r" + i), T_CUT + 2.0, 1.4);
B.label("NORTH KOREAN ARMY COLLAPSES", 2200, 1420, { cls: "tg", size: 36, t: T_CUT + 1.0, until: I9 + 0.3, anchor: [-50, -50] });
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
B.dim(T_R1 - 1.4, T_NORTH - 0.2, 0.75);
B.caption("MACARTHUR'S VISION · SMITH'S PLANNING", I9 + 0.6, T_R1 - 1.6, "carth");
methodCard({ t: T_R1 - 1.2, until: T_NORTH - 0.6, rowT: [T_R1 - 0.3, T_R2 - 0.3, T_R3 - 0.1], hi: 2, hiT: T_TIDE - 0.4 });
// looking north: the next move
B.arrow({ side: "carth", pts: [[1300, 880], [1420, 600], [1500, 330], [1540, 60]], width: 26, t: T_NORTH + 0.2, dur: 3.0 });
B.label("NEXT: THE FROZEN NORTH", 1900, 260, { cls: "tg", size: 40, t: T_NORTH + 1.4 });
// ---------- sound cues (locked kit, levels in tools/sfx_mix_lib.py): only on visible beats ----------
SFX("hit", T_COST + 0.4);        // day-one casualty stat card
SFX("whoosh", T_SEOUL + 0.6);    // big blue arrows sweep to Seoul
SFX("hit", T_CUT + 0.55);        // first blue X lands on the supply lines
SFX("whoosh", T_NORTH + 0.2);    // big arrow north: next move
B.finish();
