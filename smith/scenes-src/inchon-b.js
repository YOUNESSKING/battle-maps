// Inchon B: the harbor, the plan, Wolmi-do at dawn, Red + Blue Beach at dusk. Basemap inchon (zoom 12).
// Marines = blue ("carth"), North Koreans = red ("rome").
const B = Battle();
const { P, at, tl } = B;
const END = B.T.duration;
const NS = "http://www.w3.org/2000/svg";
// B.highlight inserts after svg.firstChild: make sure the overlay is not empty
document.getElementById("overlay").appendChild(document.createElementNS(NS, "g"));
document.getElementById("overlay").appendChild(document.createElementNS(NS, "g"));

// ---------- key places (pixels on assets/inchon.jpg) ----------
const CITY = [1179, 921], WOLMI = [1060, 906], RED = [1100, 862], BLUE = [1212, 1044], SEOUL = [2192, 568], KIMPO = [1645, 598];
const CHANNEL = [[0, 1330], [300, 1260], [560, 1150], [780, 1040], [930, 960], [1030, 915], [1058, 906]];

const I3 = P("inchon-3"), I4 = P("inchon-4"), I5 = P("inchon-5"), I6 = P("inchon-6"), I7 = P("inchon-7");
const T_CHAN = at("inchon-3", "single narrow channel"), T_TIDE = at("inchon-3", "The tides"), T_30 = at("inchon-3", "thirty feet");
const T_LOW = at("inchon-3", "At low tide"), T_HOURS = at("inchon-3", "only a few hours"), T_WALL = at("inchon-3", "stone seawalls");
const T_SANE = at("inchon-4", "No sane"), T_2000 = at("inchon-4", "couple of thousand"), T_SOUTH = at("inchon-4", "far to the south");
const T_3W = at("inchon-5", "three weeks"), T_PAC = at("inchon-5", "crossing the Pacific"), T_PUS = at("inchon-5", "pulled out");
const T_NAVY = at("inchon-5", "working with the Navy"), T_TIME = at("inchon-5", "timetable"), T_TWO = at("inchon-5", "two blows");
const T_STORM = at("inchon-6", "stormed"), T_POUND = at("inchon-6", "The Navy and"), T_TAKEN = at("inchon-6", "Within two hours"), T_OUT = at("inchon-6", "Then the tide");
const T_KNEW = at("inchon-7", "now knew"), T_REINF = at("inchon-7", "reinforcements"), T_1730 = at("inchon-7", "At five thirty"), T_HIT = at("inchon-7", "landing craft hit");

// ---------- camera ----------
B.camera([
  [0, 1000, 1000, 0.78],
  [T_CHAN + 3.0, 820, 1080, 0.86],
  [T_TIDE + 1.5, 980, 990, 1.15],
  [T_HOURS, 1040, 960, 1.3],
  [T_WALL - 0.4, 1110, 920, 2.1],
  [I4 + 0.2, 1110, 920, 2.2],
  [I4 + 4.0, 1300, 880, 1.05],
  [T_SOUTH + 1.5, 1350, 1000, 0.9],
  [I5 + 1.0, 960, 1060, 1.0],
  [T_NAVY, 980, 1040, 1.02],
  [I6 - 0.6, 1000, 980, 1.25],
  [I6 + 3.0, 1070, 920, 2.0],
  [T_OUT, 1075, 930, 2.1],
  [I7 + 2.0, 1110, 940, 1.6],
  [T_1730, 1130, 945, 1.75],
  [END, 1145, 950, 2.05],
]);

// ---------- helpers ----------
const mud = document.createElement("img");
mud.className = "wimg"; mud.src = "assets/inchon_mud.png"; mud.alt = "";
Object.assign(mud.style, { left: "0px", top: "0px", width: "2880px", height: "1620px" });
document.getElementById("world").insertBefore(mud, document.getElementById("overlay"));
gsap.set(mud, { autoAlpha: 0 });
const mudTo = (t, op, dur = 2.0) => tl.to(mud, { autoAlpha: op, duration: dur, ease: "sine.inOut" }, t);

// tide gauge (screen space, right side). level 0..1 = low..high water
const gauge = document.createElement("div");
gauge.style.cssText = "position:absolute;right:120px;top:210px;width:210px;height:560px;";
gauge.innerHTML = `<div style="position:absolute;inset:0;background:rgba(20,18,14,0.78);border-top:5px solid #9fc0ea;box-shadow:0 12px 26px rgba(0,0,0,0.5)"></div>
  <div style="position:absolute;left:0;right:0;top:14px;text-align:center;color:#f4f1ea;font-weight:700;font-size:28px;letter-spacing:0.2em">TIDE</div>
  <div style="position:absolute;left:34px;top:70px;width:64px;height:440px;background:#5b4c33;border:3px solid #e9dcb5;overflow:hidden">
    <div class="wl" style="position:absolute;left:0;right:0;bottom:0;height:100%;background:linear-gradient(180deg,#8fb6cf,#3f6f95)"></div></div>
  ${[32, 24, 16, 8, 0].map((v, i) => `<div style="position:absolute;left:110px;top:${70 + i * 110 - 14}px;color:#f4f1ea;font-size:24px;font-weight:500">— ${v} FT</div>`).join("")}
  <div class="tg-note" style="position:absolute;left:0;right:0;bottom:-58px;text-align:center;color:#f4f1ea;font-weight:700;font-size:30px;letter-spacing:0.08em;text-shadow:0 2px 5px #000"></div>`;
document.getElementById("scene").insertBefore(gauge, document.getElementById("credit"));
const wl = gauge.querySelector(".wl");
gsap.set(gauge, { autoAlpha: 0 });
const gaugeShow = (t, until) => { tl.fromTo(gauge, { autoAlpha: 0, x: 60 }, { autoAlpha: 1, x: 0, duration: 0.6, ease: "power2.out" }, t); tl.to(gauge, { autoAlpha: 0, duration: 0.5 }, until); };
const level = (t, v, dur = 2.0) => tl.to(wl, { height: v * 100 + "%", duration: dur, ease: "sine.inOut" }, t);

const ship = (x, y, t, until, s = 1) => {
  const g = document.createElementNS(NS, "g");
  g.setAttribute("transform", `translate(${x} ${y}) scale(${s})`);
  g.innerHTML = `<g class="sh"><path d="M-34 0 L26 0 L36 -10 L-38 -10 Z" fill="#3a4556" stroke="#f7f3ea" stroke-width="3"/><rect x="-14" y="-20" width="18" height="10" fill="#3a4556" stroke="#f7f3ea" stroke-width="2.5"/></g>`;
  document.getElementById("overlay").appendChild(g);
  const sh = g.querySelector(".sh");
  gsap.set(sh, { autoAlpha: 0 });
  tl.fromTo(sh, { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 1.0, ease: "power2.out" }, t);
  if (until != null) tl.to(sh, { autoAlpha: 0, duration: 0.6 }, until);
  return g;
};
const flash = (x, y, t, r = 26) => { // bombardment burst
  const c = document.createElementNS(NS, "circle");
  c.setAttribute("cx", x); c.setAttribute("cy", y); c.setAttribute("r", r);
  c.setAttribute("fill", "#ffd76a"); c.setAttribute("stroke", "#e0441c"); c.setAttribute("stroke-width", 5);
  document.getElementById("overlay").appendChild(c);
  gsap.set(c, { autoAlpha: 0, transformOrigin: "50% 50%" });
  tl.set(c, { autoAlpha: 0.95, scale: 0.2 }, t);
  tl.to(c, { autoAlpha: 0, scale: 1.6, duration: 0.7, ease: "power2.out" }, t + 0.01);
};

// ---------- inchon-3: the harbor ----------
B.showDate(0.3);
B.date("SEPTEMBER 1950", 0.5, I6 - 0.2);
B.label("YELLOW SEA", 420, 900, { cls: "sea", size: 44, t: 0.8, until: I6 });
B.city("INCHON", ...CITY, { size: 30, t: 1.0, until: T_HOURS + 1.0 });
B.city("SEOUL", ...SEOUL, { left: true, size: 34, t: 1.3, until: I5 });
B.label("HAN RIVER", 1740, 470, { cls: "river", size: 26, t: 1.6, until: I5, rot: -18 });

const chHi = B.highlight(CHANNEL, T_CHAN - 0.2, T_CHAN + 3, 34);
tl.to(chHi, { opacity: 0, duration: 1.0 }, I4 + 1.0);
B.line(CHANNEL, { color: "#9fc0ea", width: 10, dash: "20 12", t: T_CHAN, dur: 2.6, until: I4 });
B.label("FLYING FISH CHANNEL", 520, 1110, { cls: "tg", size: 30, t: T_CHAN + 0.8, until: T_TIDE + 2, rot: -22, anchor: [-50, -100] });
B.caption("ONE NARROW CHANNEL · EASY TO MINE", T_CHAN + 0.6, T_TIDE - 0.2, "rome");

gaugeShow(T_TIDE - 0.2, T_WALL - 0.4);
level(T_TIDE + 0.6, 0.08, 2.0); level(T_TIDE + 2.8, 1.0, 2.0); level(T_LOW - 0.2, 0.05, 2.6); level(T_HOURS + 0.2, 1.0, 2.4);
const note = gauge.querySelector(".tg-note");
note.textContent = "32 FT RANGE";
B.caption("TIDES OF MORE THAN 30 FEET", T_30 - 0.8, T_LOW - 0.2, "carth");
mudTo(T_LOW, 0.8, 2.6); mudTo(T_HOURS + 0.2, 0, 2.4);
B.label("MUDFLATS", 700, 1260, { cls: "tg", size: 36, t: T_LOW + 1.4, until: T_HOURS + 1.4 });
B.caption("LOW TIDE: MILES OF MUD", T_LOW + 0.6, T_HOURS - 0.2, "rome");
B.caption("ONLY A FEW HOURS A DAY TO LAND", T_HOURS + 0.3, T_WALL - 0.3, "carth");

const wall = [[1104, 842], [1086, 874], [1075, 912], [1072, 952], [1064, 994]];
const wHi = B.highlight(wall, T_WALL, T_WALL + 3, 14);
tl.to(wHi, { opacity: 0, duration: 1.0 }, I4 + 2.4);
B.line(wall, { color: "#f7f3ea", width: 6, t: T_WALL, dur: 1.4, until: I4 + 2.4 });
B.label("SEAWALLS", 1052, 960, { cls: "tg", size: 18, t: T_WALL + 0.5, until: I4 + 2.4, anchor: [-100, -50] });
B.caption("STONE SEAWALLS · TALLER THAN TWO MEN", T_WALL + 0.8, I4 - 0.1);

// ---------- inchon-4: the North Korean view ----------
B.city("INCHON", ...CITY, { size: 22, t: I4 + 3.2, until: I7 + 1 });
B.city("KIMPO", ...KIMPO, { size: 26, t: I4 + 3.6, until: I5 });
const garrison = [[1150, 900], [1200, 950], [1160, 985], [WOLMI[0] + 4, WOLMI[1]]];
garrison.forEach(([x, y], i) => B.unit({ id: "g" + i, side: "rome", x, y, w: 26, h: 26, t: T_2000 - 0.6 + i * 0.2 }));
B.bubble("NO ONE WILL LAND HERE", 1240, 760, T_SANE, I5 - 0.2);
B.caption("~2,000 DEFENDERS", T_2000 + 0.3, T_SOUTH - 0.2, "rome");
B.arrow({ side: "rome", pts: [[1500, 1080], [1540, 1300], [1560, 1560]], width: 22, t: T_SOUTH, dur: 1.6, until: I5 + 0.6 });
B.label("MAIN ARMY: AT PUSAN, 300 KM SOUTH", 1620, 1480, { cls: "tg", size: 34, t: T_SOUTH + 0.8, until: I5 + 0.6 });

// ---------- inchon-5: Smith plans ----------
B.portraitStake({ img: "assets/media/smith_head.png", flag: "assets/media/us_flag_48star.png", name: "SMITH", x: 660, y: 1185, size: 0.9, t: I5 + 0.6, until: I6 - 0.6 });
B.caption("3 WEEKS TO PLAN", T_3W - 0.3, T_PAC - 0.2, "carth");
const fleet = [[730, 1185], [810, 1212], [890, 1182], [760, 1255], [850, 1265], [950, 1232], [700, 1240]];
fleet.forEach(([x, y], i) => ship(x, y, I5 + 1.6 + i * 0.25, I6 - 0.5, 0.9));
B.arrow({ side: "carth", pts: [[0, 1250], [300, 1262], [620, 1240]], width: 20, t: T_PAC - 0.4, dur: 1.6, until: I6 - 0.6 });
B.label("1ST MARINES · FROM THE U.S.", 340, 1215, { cls: "tg", size: 26, t: T_PAC, until: I6 - 0.6 });
B.arrow({ side: "carth", pts: [[900, 1620], [880, 1440], [835, 1300]], width: 20, t: T_PUS - 0.2, dur: 1.6, until: I6 - 0.6 });
B.label("5TH MARINES · FROM PUSAN", 1130, 1440, { cls: "tg", size: 26, t: T_PUS + 0.4, until: I6 - 0.6 });
B.caption("TURN THE TIDE INTO A TIMETABLE", T_NAVY + 0.8, T_TWO - 0.6, "carth");
// the timetable: two high tides a day
const tt = document.createElement("div");
tt.style.cssText = "position:absolute;right:90px;top:170px;width:848px;height:208px;background:rgba(20,18,14,0.8);border-top:5px solid #9fc0ea;box-shadow:0 12px 26px rgba(0,0,0,0.5);";
tt.innerHTML = `<svg viewBox="0 0 1060 260" width="848" height="208" style="position:absolute;inset:0">
  <line x1="40" y1="200" x2="1020" y2="200" stroke="#e9dcb5" stroke-width="3"/>
  <path class="tc" d="M40 190 C 110 190, 140 50, 250 50 S 400 190, 500 190 S 650 50, 760 50 S 900 190, 1020 190" fill="none" stroke="#8fb6cf" stroke-width="8" stroke-linecap="round"/>
  <circle class="hi1" cx="250" cy="50" r="14" fill="#1f4fc4" stroke="#fff" stroke-width="4"/>
  <circle class="hi2" cx="760" cy="50" r="14" fill="#1f4fc4" stroke="#fff" stroke-width="4"/>
  <text x="250" y="238" fill="#f4f1ea" font-size="30" font-weight="700" text-anchor="middle" font-family="Oswald" class="l1">DAWN · WOLMI-DO</text>
  <text x="760" y="238" fill="#f4f1ea" font-size="30" font-weight="700" text-anchor="middle" font-family="Oswald" class="l2">DUSK · THE CITY</text>
  <text x="530" y="40" fill="#e9dcb5" font-size="26" text-anchor="middle" font-family="Oswald" letter-spacing="4">HIGH WATER, 15 SEPTEMBER</text></svg>`;
document.getElementById("scene").insertBefore(tt, document.getElementById("credit"));
gsap.set(tt, { autoAlpha: 0 });
const tc = tt.querySelector(".tc");
gsap.set(tc, { strokeDasharray: "1400 1400", strokeDashoffset: 1400 });
tl.fromTo(tt, { autoAlpha: 0, y: -30 }, { autoAlpha: 1, y: 0, duration: 0.6 }, T_TIME - 0.6);
tl.to(tc, { strokeDashoffset: 0, duration: 2.4, ease: "none" }, T_TIME - 0.2);
[[".hi1", ".l1", at("inchon-5", "one at dawn")], [".hi2", ".l2", at("inchon-5", "one at dusk")]].forEach(([c, l, t]) => {
  gsap.set([tt.querySelector(c), tt.querySelector(l)], { autoAlpha: 0 });
  tl.fromTo(tt.querySelector(c), { autoAlpha: 0, scale: 0, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(3)" }, t - 0.5);
  tl.to(tt.querySelector(l), { autoAlpha: 1, duration: 0.4 }, t - 0.4);
});
tl.to(tt, { autoAlpha: 0, duration: 0.5 }, I6 - 0.4);

// ---------- inchon-6: dawn, Wolmi-do ----------
B.date("15 SEPT · 06:33", I6 + 0.2, T_1730 - 0.2);
B.label("WOLMI-DO", WOLMI[0] - 30, WOLMI[1] - 8, { cls: "city", size: 18, t: I6 + 1.5, until: END, anchor: [-100, -50] });
B.label("GREEN BEACH", WOLMI[0] - 30, WOLMI[1] - 30, { cls: "tg", size: 14, t: T_STORM + 1.2, until: I7 + 1, anchor: [-100, -50] });
B.line([[WOLMI[0] + 12, WOLMI[1] + 2], [1075, 905]], { color: "#e9dcb5", width: 5, t: I6 + 1.2, dur: 0.6 }); // causeway
[[1048, 900], [1066, 912], [1058, 896], [1070, 902], [1052, 914], [1062, 904]].forEach(([x, y], i) => flash(x, y, I6 + 0.4 + i * 0.35, 14));
[[1052, 902], [1068, 910], [1060, 895], [1056, 914]].forEach(([x, y], i) => flash(x, y, T_POUND + i * 0.4, 16));
B.arrow({ side: "white", pts: [[930, 830], [990, 862], [1040, 890]], width: 5, t: T_POUND - 0.2, dur: 1.2, until: T_POUND + 3 });
B.arrow({ side: "white", pts: [[960, 1010], [1010, 965], [1045, 920]], width: 5, t: T_POUND + 0.3, dur: 1.2, until: T_POUND + 3 });
B.unit({ id: "w", side: "carth", x: 960, y: 945, w: 22, h: 22, label: "3/5 MARINES", t: T_STORM - 1.4 });
B.units.w.el.querySelector(".tag").style.cssText += "font-size:11px;padding:0 5px;margin-top:2px";
B.arrow({ side: "carth", pts: [[930, 955], [990, 935], [1044, 912]], width: 9, t: T_STORM - 0.4, dur: 1.2, until: I7 + 1 });
B.move("w", T_STORM + 0.8, 1.4, WOLMI[0] - 6, WOLMI[1] + 4);
B.grey(["g3"], T_TAKEN - 0.8, 1.0);
B.hideUnits(["g3"], T_TAKEN + 1.5, 0.6);
B.caption("WOLMI-DO TAKEN · NO MARINES KILLED", T_TAKEN + 0.2, T_OUT - 0.2, "carth");
gaugeShow(T_OUT - 0.4, T_HIT + 1.5);
level(T_OUT - 0.4, 1.0, 0.01);
level(T_OUT + 0.4, 0.05, 3.0);
mudTo(T_OUT + 0.4, 0.8, 3.0);
B.caption("ALONE ON THE ISLAND, SURROUNDED BY MUD", T_OUT + 2.0, I7 - 0.1);

// ---------- inchon-7: dusk, two beaches ----------
[[1300, 870], [1330, 960]].forEach(([x, y], i) => {
  B.unit({ id: "rr" + i, side: "rome", x, y, w: 24, h: 24, t: T_KNEW + i * 0.3 });
  B.move("rr" + i, T_KNEW + 0.6, 3.0, x - 70, y + 5);
});
B.caption("THE TIDE LOCKS EVERYONE IN PLACE", T_REINF - 1.6, T_1730 - 0.2);
B.date("15 SEPT · 17:30", T_1730, null);
level(T_1730 - 0.2, 1.0, 2.6);
mudTo(T_1730 - 0.2, 0, 2.6);
B.label("RED BEACH", RED[0] + 14, RED[1] - 20, { cls: "tg", size: 18, t: T_HIT - 0.6, anchor: [0, -50] });
B.label("BLUE BEACH", BLUE[0] + 16, BLUE[1] + 14, { cls: "tg", size: 18, t: T_HIT - 0.6, anchor: [0, -50] });
B.arrow({ side: "carth", pts: [[1072, 740], [1078, 800], [1098, 858]], width: 11, t: T_HIT - 0.4, dur: 1.4 });
B.arrow({ side: "carth", pts: [[1010, 1120], [1120, 1100], [1205, 1052]], width: 11, t: T_HIT - 0.4, dur: 1.4 });
B.caption("TWO BEACHES AT ONCE", T_HIT + 0.4, END - 0.2, "carth");
// defenders scatter
[0, 1, 2].forEach((i) => B.move("g" + i, T_HIT + 1.0 + i * 0.2, 2.6, garrison[i][0] + 110, garrison[i][1] - 20 + i * 20));
B.grey(["g0", "g1", "g2", "rr0", "rr1"], T_HIT + 1.6, 1.2);
B.finish();
