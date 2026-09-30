// Inchon B (locked style): the harbor, the plan, Wolmi-do at dawn, Red + Blue Beach at dusk. Basemap inchon (zoom 12).
// Marines = blue ("carth"), North Koreans = red ("rome").
const B = Battle();
const { P, at, tl } = B;
const END = B.T.duration;
const K = FXK(B);
// sound: whoosh on big camera zooms (scale x1.6 or more within 6 s), at the fastest point of the move
const camSfx = (keys) => { for (let i = 1; i < keys.length; i++) { const r = keys[i][3] / keys[i - 1][3], d = keys[i][0] - keys[i - 1][0];
  /* no zoom sound on ordinary camera moves (owner 2026-09-30: only the biggest moves) */ } return keys; };
const NS = "http://www.w3.org/2000/svg";
// B.highlight inserts after svg.firstChild: make sure the overlay is not empty
document.getElementById("overlay").appendChild(document.createElementNS(NS, "g"));
document.getElementById("overlay").appendChild(document.createElementNS(NS, "g"));

// ---------- key places (pixels on assets/inchon.jpg) ----------
const CITY = [1179, 921], WOLMI = [1085, 905], RED = [1100, 862], BLUE = [1212, 1044], SEOUL = [2192, 568], KIMPO = [1645, 598];
const CHANNEL = [[0, 1330], [300, 1260], [560, 1150], [780, 1040], [930, 960], [1030, 912], [1068, 906]];

const I3 = P("inchon-3"), I4 = P("inchon-4"), I5 = P("inchon-5"), I6 = P("inchon-6"), I7 = P("inchon-7");
const T_CHAN = at("inchon-3", "single narrow channel"), T_TIDE = at("inchon-3", "The tides"), T_30 = at("inchon-3", "thirty feet");
const T_LOW = at("inchon-3", "At low tide"), T_HOURS = at("inchon-3", "only a few hours"), T_WALL = at("inchon-3", "stone seawalls");
const T_SANE = at("inchon-4", "No sane"), T_2000 = at("inchon-4", "couple of thousand"), T_SOUTH = at("inchon-4", "far to the south");
const T_3W = at("inchon-5", "three weeks"), T_PAC = at("inchon-5", "crossing the Pacific"), T_PUS = at("inchon-5", "pulled out");
const T_NAVY = at("inchon-5", "working with the Navy"), T_TIME = at("inchon-5", "timetable"), T_TWO = at("inchon-5", "two blows");
const T_STORM = at("inchon-6", "stormed"), T_POUND = at("inchon-6", "The Navy and"), T_TAKEN = at("inchon-6", "Within two hours"), T_OUT = at("inchon-6", "Then the tide");
const T_KNEW = at("inchon-7", "now knew"), T_REINF = at("inchon-7", "reinforcements"), T_1730 = at("inchon-7", "At five thirty"), T_HIT = at("inchon-7", "landing craft hit");

// ---------- camera ----------
B.camera(camSfx([
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
  [I6 + 3.0, 1010, 935, 2.0],
  [T_OUT, 1050, 930, 2.1],
  [I7 + 2.0, 1110, 940, 1.6],
  [T_1730, 1130, 945, 1.75],
  [END, 1145, 950, 2.05],
]));

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


// ---------- locked-kit helpers (scene-local) ----------
const PINS = document.getElementById("pins"), OVL = document.getElementById("overlay"), WORLD = document.getElementById("world");
// projection (assets/inchon.json: zoom 12) for the faint lat/long grid
const G = (lat, lon) => {
  const n = 256 * 2 ** 12, r = (lat * Math.PI) / 180;
  return [+((lon + 180) / 360 * n - 891946).toFixed(1), +((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2 * n - 405497).toFixed(1)];
};
K.grid(G, 37.2, 37.8, 126.2, 127.3, 0.1, 0.3);
// world-space pin centred on (x, y)
const pin = (html, x, y, o = {}) => {
  const el = document.createElement("div");
  el.style.cssText = `position:absolute;left:${x}px;top:${y}px;`; el.innerHTML = html; PINS.appendChild(el);
  gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
  if (o.t != null) tl.fromTo(el, { autoAlpha: 0, x: o.slide || 0 }, { autoAlpha: 1, x: 0, duration: o.slide ? 1.6 : 0.5, ease: "power2.out" }, o.t);
  if (o.until != null) tl.to(el, { autoAlpha: 0, duration: 0.6 }, o.until);
  return el;
};
// ship side silhouette (copied from goosegreen hook-atlantic G.ship); flip = bow to the right
const ship = (x, y, o = {}) => {
  const w = o.w || 60, col = o.color || "#1f4fc4";
  return pin(`<svg width="${w}" height="${w * 0.36}" viewBox="0 0 100 36" style="display:block;overflow:visible;${o.flip ? "transform:scaleX(-1)" : ""}">
    <path d="M2 22 L96 22 L88 33 L10 33 Z" fill="${col}" stroke="#f3eee2" stroke-width="2.5"/>
    <path d="M30 22 L30 13 L46 13 L46 7 L56 7 L56 13 L66 13 L66 22 Z" fill="${col}" stroke="#f3eee2" stroke-width="2.5"/>
    <line x1="51" y1="7" x2="51" y2="0" stroke="#f3eee2" stroke-width="2.5"/><line x1="12" y1="22" x2="4" y2="17" stroke="#f3eee2" stroke-width="3"/></svg>`, x, y, o);
};
// shell arc: dashed trail drawn from gun to target, then fades
const arc = (a, b, t, dur = 0.8) => {
  const p = document.createElementNS(NS, "path"), h = Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.3;
  p.setAttribute("d", `M ${a[0]} ${a[1]} Q ${(a[0] + b[0]) / 2} ${(a[1] + b[1]) / 2 - h} ${b[0]} ${b[1]}`);
  p.setAttribute("fill", "none"); p.setAttribute("stroke", "#fff4c2"); p.setAttribute("stroke-width", 2.2); p.setAttribute("opacity", 0);
  OVL.appendChild(p);
  const L = p.getTotalLength();
  gsap.set(p, { strokeDasharray: `${L} ${L}`, strokeDashoffset: L });
  tl.to(p, { opacity: 0.85, duration: 0.05 }, t);
  tl.to(p, { strokeDashoffset: 0, duration: dur, ease: "none" }, t);
  tl.to(p, { opacity: 0, duration: 0.4 }, t + dur);
};
// warship salvo: bow gun flash (no land-gun sound) + naval gun cue + shell arc + impact boom on land
const salvo = (s, target, t, r = 15) => {
  const g = [s.x + s.w * 0.4 * (s.flip ? 1 : -1), s.y - s.w * 0.05];
  K.gun(g[0], g[1], t, { dx: 0, dy: 0 }); // locked: ship guns = K.gun (quiet launch) -> K.impact (artillery boom)
  arc(g, target, t + 0.05, 0.8);
  K.impact(target[0], target[1], t + 0.85, { r });
};
// Corsair bombing run: exact Harrier recipe (size 84, alt 30, dur 3.2, stick of bombs 0.25 s apart just after the pass)
const corsairRun = (pts, bombs, t0) => {
  K.bombRun({ kind: "prop", pts, t: t0, bombs }); // locked: Corsair + bombs + SHAKE on the first bomb
};
const smokeColumn = (pts, t0, t1, gap = 1.1) => { for (let t = t0, i = 0; t < t1; t += gap, i++) { const p = pts[i % pts.length]; K.smoke(p[0], p[1], t, { n: 1, r: 9 + (i % 3), rise: 42, drift: 10, life: 3.2, alpha: 0.62 }); } };
// full-map tint layer (dawn / dusk), under the overlay
const layer = (style, t, until, o = {}) => {
  const el = document.createElement("div");
  el.style.cssText = `position:absolute;left:0;top:0;width:2880px;height:1620px;pointer-events:none;${style}`;
  WORLD.insertBefore(el, OVL); gsap.set(el, { autoAlpha: 0 });
  tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: o.dur || 3, ease: "sine.inOut" }, t);
  if (until != null) tl.to(el, { autoAlpha: 0, duration: o.outDur || 3, ease: "sine.inOut" }, until);
  return el;
};
const U = (id, side, x, y, t, o = {}) => { // counter with flag + size mark (+ small tag)
  B.unit({ id, side, x, y, w: o.w || 28, h: o.h || 20, label: o.label, t });
  if (o.label) B.units[id].el.querySelector(".tag").style.cssText += `font-size:${o.fs || 10}px;padding:0 4px;margin-top:2px;white-space:nowrap`;
  K.counter(id, { icon: o.icon || "infantry", flag: side === "carth" ? "us" : "kpa", size: o.size });
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
garrison.forEach(([x, y], i) => { B.unit({ id: "g" + i, side: "rome", x, y, w: 28, h: 20, t: T_2000 - 0.6 + i * 0.2 }); K.counter("g" + i, { icon: "infantry", flag: "kpa", size: "II" }); });
SFX("tick", T_2000 - 0.6);        // garrison counters drop in
B.bubble("NO ONE WILL LAND HERE", 1240, 760, T_SANE, I5 - 0.2);
B.caption("~2,000 DEFENDERS", T_2000 + 0.3, T_SOUTH - 0.2, "rome");
B.arrow({ side: "rome", pts: [[1500, 1080], [1540, 1300], [1560, 1560]], width: 22, t: T_SOUTH, dur: 1.6, until: I5 + 0.6 });
B.label("MAIN ARMY: AT PUSAN, 300 KM SOUTH", 1620, 1480, { cls: "tg", size: 34, t: T_SOUTH + 0.8, until: I5 + 0.6 });

// ---------- inchon-5: Smith plans ----------
K.badge({ name: "MAJ. GEN. OLIVER P. SMITH", role: "1ST MARINE DIVISION", photo: "assets/media/smith_head.png", initials: "OPS", flag: "us", side: "carth", corner: "bl", t: I5 + 0.6, until: I6 - 0.6 });
B.caption("3 WEEKS TO PLAN", T_3W - 0.3, T_PAC - 0.2, "carth");
const fleet = [[880, 1215], [975, 1182], [925, 1282], [1040, 1245], [1010, 1318]];
fleet.forEach(([x, y], i) => ship(x, y, { w: 64, flip: true, t: I5 + 1.6 + i * 0.25, slide: -50, until: I6 - 0.5 }));
B.arrow({ side: "carth", pts: [[0, 1180], [300, 1192], [640, 1185]], width: 20, t: T_PAC - 0.4, dur: 1.6, until: I6 - 0.6 });
B.label("FROM THE U.S.", 300, 1140, { cls: "tg", size: 26, t: T_PAC, until: I6 - 0.6 });
U("m1", "carth", 705, 1185, T_PAC + 1.0, { w: 44, h: 30, size: "III", label: "1ST MARINES", fs: 13 });
B.arrow({ side: "carth", pts: [[900, 1620], [885, 1480], [860, 1395]], width: 20, t: T_PUS - 0.2, dur: 1.6, until: I6 - 0.6 });
B.label("FROM PUSAN", 1010, 1470, { cls: "tg", size: 26, t: T_PUS + 0.4, until: I6 - 0.6 });
U("m5", "carth", 852, 1352, T_PUS + 1.2, { w: 44, h: 30, size: "III", label: "5TH MARINES", fs: 13 });
SFX("tick", T_PAC + 1.0); SFX("tick", T_PUS + 1.2); // regiment counters drop in
B.hideUnits(["m1", "m5"], I6 - 0.6, 0.5);
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


// ---------- inchon-6: dawn, Wolmi-do: bombardment, Corsair strikes, 3/5 Marines storm the island ----------
layer("background: linear-gradient(to left, rgba(255,160,80,0.34), rgba(255,190,130,0.14) 55%, rgba(255,210,160,0.04));", I6 - 0.4, T_TAKEN + 2, { dur: 3, outDur: 4 });
B.date("15 SEPT · 06:33", I6 + 0.2, T_1730 - 0.2);
B.label("WOLMI-DO", WOLMI[0] - 36, WOLMI[1] - 10, { cls: "city", size: 18, t: I6 + 1.5, until: END, anchor: [-100, -50] });
B.label("GREEN BEACH", WOLMI[0] - 36, WOLMI[1] - 32, { cls: "tg", size: 14, t: T_STORM + 1.2, until: I7 + 1, anchor: [-100, -50] });
// fire-support group: one cruiser + two destroyers, bows toward the island
const SHIPS = [{ x: 830, y: 1012, w: 66, flip: true }, { x: 905, y: 962, w: 46, flip: true }, { x: 905, y: 1082, w: 46, flip: true }];
SHIPS.forEach((s, i) => ship(s.x, s.y, { w: s.w, flip: true, color: "#1f4fc4", t: I6 + 0.3 + i * 0.3, slide: -60 }));
B.label("CRUISER", SHIPS[0].x, SHIPS[0].y + 22, { cls: "tg", size: 11, t: I6 + 1.4, until: T_STORM });
B.label("DESTROYERS", SHIPS[2].x, SHIPS[2].y + 22, { cls: "tg", size: 11, t: I6 + 1.6, until: T_STORM });
const WT = [[1082, 900], [1092, 912], [1078, 916], [1090, 896], [1084, 906]]; // targets on Wolmi-do
[[1, I6 + 2.0, 14], [0, I6 + 3.3, 17], [2, I6 + 4.6, 15], [1, T_STORM - 0.4, 13], [0, T_POUND - 1.0, 16], [2, T_POUND - 0.2, 14], [1, T_POUND + 2.4, 15], [0, T_POUND + 3.2, 17]]
  .forEach(([si, t, r], k) => salvo(SHIPS[si], WT[k % WT.length], t, r));
K.target(...WOLMI, T_STORM - 0.2, { r: 30, side: "#ffd54a", until: T_TAKEN + 0.6 });
// "The Navy and Marine aircraft had pounded it for days": two Corsair runs over the island
corsairRun([[700, 690], [WOLMI[0], WOLMI[1]], [1470, 1120]], [[1080, 900], [1096, 910]], T_POUND - 1.2);
corsairRun([[760, 1170], [WOLMI[0], WOLMI[1]], [1410, 640]], [[1078, 912], [1092, 897]], T_POUND + 0.3);
B.label("MARINE CORSAIRS", 1250, 820, { cls: "tg", size: 14, t: T_POUND - 0.4, until: T_POUND + 3.2 });
B.caption("NAVY GUNS + MARINE CORSAIRS POUND THE ISLAND", T_POUND - 0.2, T_TAKEN - 0.2, "carth");
smokeColumn([[1084, 898], [1094, 910], [1076, 912]], T_POUND + 0.6, T_OUT + 5); // Wolmi-do burning
// 3rd Battalion, 5th Marines storm Green Beach
U("w", "carth", 985, 942, T_STORM - 0.8, { size: "II", label: "3/5 MARINES", fs: 10 });
B.arrow({ side: "carth", pts: [[960, 950], [1020, 930], [1066, 912]], width: 8, t: T_STORM - 0.2, dur: 1.2, until: I7 + 1 });
B.grey(["g3"], T_TAKEN - 1.4, 1.0);
B.hideUnits(["g3"], T_TAKEN - 0.2, 0.5);
B.move("w", T_TAKEN - 0.8, 1.2, WOLMI[0] + 2, WOLMI[1] + 16);
SFX("mg", T_TAKEN - 1.2); // Marines close with the island garrison
B.caption("WOLMI-DO TAKEN · NO MARINES KILLED", T_TAKEN + 0.2, T_OUT - 0.2, "carth");
gaugeShow(T_OUT - 0.4, T_HIT + 1.5);
level(T_OUT - 0.4, 1.0, 0.01);
level(T_OUT + 0.4, 0.05, 3.0);
mudTo(T_OUT + 0.4, 0.8, 3.0);
B.caption("ALONE ON THE ISLAND, SURROUNDED BY MUD", T_OUT + 2.0, I7 - 0.1);

// ---------- inchon-7: dusk, two beaches ----------
layer("background: linear-gradient(to right, rgba(255,140,70,0.30), rgba(160,90,120,0.14) 60%, rgba(40,40,90,0.10));", T_1730 - 1.0, null, { dur: 3 });
[[1300, 870], [1330, 960]].forEach(([x, y], i) => {
  U("rr" + i, "rome", x, y, T_KNEW + i * 0.3, { size: "II" });
  B.move("rr" + i, T_KNEW + 0.6, 3.0, x - 70, y + 5);
});
SFX("tick", T_KNEW);
B.caption("THE TIDE LOCKS EVERYONE IN PLACE", T_REINF - 1.6, T_1730 - 0.2);
B.date("15 SEPT · 17:30", T_1730, null);
level(T_1730 - 0.2, 1.0, 2.6);
mudTo(T_1730 - 0.2, 0, 2.6);
// naval gunfire on the city front, then one Corsair run over Red Beach
const CT = [[1110, 866], [1206, 1030], [1124, 880], [1196, 1040]];
[[1, T_1730 - 0.6, 15], [2, T_1730 + 0.6, 14], [0, T_1730 + 2.0, 17], [2, T_1730 + 3.1, 13]].forEach(([si, t, r], k) => salvo(SHIPS[si], CT[k], t, r));
corsairRun([[820, 690], [1140, 880], [1460, 1070]], [[1138, 878], [1156, 889]], T_1730 + 0.8);
smokeColumn([[1150, 890], [1176, 906], [1136, 872], [1200, 1030]], T_1730 + 2.4, END, 0.9); // Inchon burning
B.label("RED BEACH", 1062, 834, { cls: "tg", size: 18, t: T_HIT - 0.6, anchor: [-100, -50] });
B.label("BLUE BEACH", 1215, 1068, { cls: "tg", size: 18, t: T_HIT - 0.6, anchor: [0, -50] });
B.arrow({ side: "carth", pts: [[1072, 740], [1078, 800], [1098, 858]], width: 11, t: T_HIT - 0.4, dur: 1.4 });
B.arrow({ side: "carth", pts: [[1010, 1120], [1120, 1100], [1205, 1052]], width: 11, t: T_HIT - 0.4, dur: 1.4 });
U("l5", "carth", 1066, 760, T_HIT - 0.6, { size: "III", label: "5TH MAR", fs: 10 });
U("l1", "carth", 1030, 1112, T_HIT - 0.6, { size: "III", label: "1ST MAR", fs: 10 });
B.move("l5", T_HIT + 0.2, 1.4, 1132, 848);
B.move("l1", T_HIT + 0.2, 1.4, 1240, 1012);
B.caption("TWO BEACHES AT ONCE", T_HIT + 0.4, END - 0.2, "carth");
// defenders scatter
[[1235, 800], [1320, 925], [1335, 1010]].forEach(([x, y], i) => B.move("g" + i, T_HIT + 1.0 + i * 0.2, 2.6, x, y));
B.grey(["g0", "g1", "g2", "rr0", "rr1"], T_HIT + 1.6, 1.2);
SFX("mg", T_HIT + 1.0);          // landing craft hit Red and Blue Beach, defenders scatter
K.raiseTerritory();
B.finish();
