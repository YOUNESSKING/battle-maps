// P2A (sub, p2-1 .. p2-7), Yorktown 1781, PART 2 THE SEA. Main style (STYLE_LOCK 2d/2e/2f via the Yorktown map kit), 1b E.subscribe, 1c clean
// screen, 1d (enemy plan first, "in other words", "But... instead", day-by-day clock). Build: python3 kit/build_scene.py p2a chesapeake sub p2-7
// sub (`chesapeake` wide): frame 0 = the red fleet coming down from the north-east, a few French ships inside the capes; E.subscribe bottom-right on
//   the subscribing clause; NEXT: PART 2 · THE SEA on "Here's how the trap was closed".
// p2-1: title card PART 2 · THE SEA; date 5 SEP 1781 (from p1b); "Admiral Thomas Graves": banner on his flagship; "nineteen ships of the line":
//   number card, wind streaks; "only part of the French fleet": ghost ships inside the bay; "Destroy it": thin red arrow; "Cornwallis could be
//   supplied": Cornwallis banner at Yorktown, a red supply ship sails up into the York, "taken away": it sails out again.
// p2-2: ink trace from the open sea up the bay into the York, focus on the bay mouth; stamps HARBOR then PRISON (one at a time).
// p2-3 (medium on the mouth, morning light): "the British sails": focus on the red column; "De Grasse": banner; "twenty-eight ships": the French
//   fleet at anchor inside Cape Henry (label on the word); boats near the shore ("sailors were ashore"); "cut his anchor cables": the ships work
//   out one by one in a ragged line, the flood tide streaks against them.
// p2-4: wind streaks behind the red line; "could have fallen on the French ships": thin red arrow (fades on "But he did not"); "Instead ... a proper
//   line of battle, and waited": the red column slows and straightens into the line; "It took hours": afternoon light; "twenty-four French ships
//   ... open sea": the French line is out.
// p2-5 (close on the two lines): "two signals at once": two small signal flags on Graves's flagship + caption KEEP IN LINE / CLOSE WITH THE ENEMY;
//   "His leading ships turned in": the van turns in, broadsides (K.gun -> arc -> K.impact, boom on impact), powder smoke; "Admiral Samuel Hood":
//   banner on the rear, focus on the rear far back in line; "When darkness fell": dusk; "five British ships": five red boxes darken + smoke columns.
// p2-6 (wide, day-by-day): 6 SEP -> 9 SEP the fleets drift south-east off the map; 10 SEP "a second French squadron": Barras banner, eight blue
//   ships slip in from the north, the siege-gun box rides with them ("heavy siege guns"); "De Grasse came back in": his ships return; 11 SEP: the
//   red fleet off the capes, HMS TERRIBLE burns and sinks (label on the word); 13 SEP: Graves banner, the red fleet turns north and leaves.
// p2-7: casualty card (both spoken); "the door to the sea was shut": French ships across the bay mouth + FORM 1 blue hatching on the mouth water
//   (~3 s); "Cornwallis was on the wrong side of it": focus on Yorktown; quote card "...a temporary superiority at sea" (verbatim, Cornwallis);
//   method card THE TRAP · 2. CLOSE THE SEA. The last camera = p2b's frame 0 (chesapeake inset inside `east`).
const S0 = "sub", A1 = "p2-1", A2 = "p2-2", A3 = "p2-3", A4 = "p2-4", A5 = "p2-5", A6 = "p2-6", A7 = "p2-7";
const T_BEGIN = at(S0, "The march was only the beginning"), T_HOW = at(S0, "So how do you shut the sea"), T_NAVY = at(S0, "the strongest navy"),
  T_KIND = at(S0, "That's the kind of question"), T_SUBS = at(S0, "subscribing is how"), T_HERE = at(S0, "Here's how the trap was closed");
const T_PLAN = at(A1, "The British plan was simple again"), T_FNY = at(A1, "From New York"), T_GRAVES = at(A1, "Admiral Thomas Graves"), T_19 = at(A1, "nineteen ships of the line"),
  T_FIND = at(A1, "to find the French"), T_PART = at(A1, "He expected only part"), T_DESTROY = at(A1, "Destroy it"), T_OPEN = at(A1, "the sea would be open again"),
  T_CORN = at(A1, "Cornwallis could be supplied"), T_AWAY = at(A1, "or taken away");
const T_OW = at(A2, "In other words"), T_AFT = at(A2, "one afternoon at sea"), T_HARBOR = at(A2, "a harbor"), T_PRISON = at(A2, "a prison");
const T_930 = at(A3, "At about half past nine"), T_LOOK = at(A3, "French lookouts"), T_SAILS = at(A3, "the British sails"), T_DG = at(A3, "De Grasse had"),
  T_28 = at(A3, "twenty-eight ships of the line"), T_ANCHOR = at(A3, "at anchor"), T_HENRY = at(A3, "Cape Henry"), T_ASHORE = at(A3, "many of his sailors were ashore"),
  T_FERRY = at(A3, "ferrying troops"), T_WAIT = at(A3, "He did not wait"), T_CUT = at(A3, "He cut his anchor cables"), T_WORK = at(A3, "work their way out"),
  T_ONE = at(A3, "one by one"), T_RAGGED = at(A3, "in a ragged line");
const T_WIND = at(A4, "Graves had the wind behind him"), T_FALL = at(A4, "He could have fallen"), T_FEW = at(A4, "a few at a time"), T_DIDNOT = at(A4, "But he did not"),
  T_INST = at(A4, "Instead"), T_RULES = at(A4, "fighting rules"), T_LINE = at(A4, "a proper line of battle"), T_WAITED = at(A4, "and waited"), T_HOURS = at(A4, "It took hours"),
  T_FOUR = at(A4, "around four in the afternoon"), T_24 = at(A4, "twenty-four French ships"), T_OPENSEA = at(A4, "out in the open sea");
const T_MIST = at(A5, "Then came the mistake"), T_FLAG = at(A5, "On his flagship"), T_TWO = at(A5, "two signals at once"), T_KEEP = at(A5, "keep in line"),
  T_CLOSE = at(A5, "close with the enemy"), T_LEAD = at(A5, "His leading ships turned in"), T_RANGE = at(A5, "fought at close range"), T_REAR = at(A5, "His rear division"),
  T_HOOD = at(A5, "Admiral Samuel Hood"), T_STAYED = at(A5, "stayed in line"), T_HARDLY = at(A5, "hardly fought at all"), T_25H = at(A5, "two and a half hours"),
  T_HAMMER = at(A5, "hammered"), T_DARK = at(A5, "When darkness fell"), T_FIVE = at(A5, "five British ships");
const T_DAYS = at(A6, "For the next few days"), T_SOUTH = at(A6, "drifted south"), T_SIGHT = at(A6, "out of sight of land"), T_BEHIND = at(A6, "Behind them"),
  T_SQ = at(A6, "a second French squadron"), T_BARRAS = at(A6, "the Comte de Barras"), T_RI = at(A6, "from Rhode Island"), T_EIGHT = at(A6, "eight more ships"),
  T_GUNS = at(A6, "the heavy siege guns"), T_BACK = at(A6, "De Grasse came back in"), T_11 = at(A6, "eleventh of September"), T_BURN = at(A6, "the British burned"),
  T_TERR = at(A6, "HMS Terrible"), T_13 = at(A6, "On the thirteenth"), T_GAVE = at(A6, "Graves gave up"), T_NYB = at(A6, "sailed back to New York");
const T_LOST = at(A7, "The British lost about three hundred and thirty"), T_KW = at(A7, "killed and wounded"), T_FR210 = at(A7, "the French about two hundred and ten"),
  T_FAMOUS = at(A7, "It was not a famous victory"), T_WASH = at(A7, "Washington was not even there"), T_DOOR = at(A7, "But the door to the sea was shut"), T_SHUT = at(A7, "was shut"),
  T_WRONG = at(A7, "Cornwallis was on the wrong side"), T_WARN = at(A7, "exactly what he had warned about"), T_TEMP = at(A7, "a temporary superiority at sea"),
  T_SECOND = at(A7, "That was the second part"), T_CSEA = at(A7, "close the sea");
// ---------------------------------------------------------------------------------------------------------------------------------
// camera (one pure function of the timeline time) + living map
// ---------------------------------------------------------------------------------------------------------------------------------
LIVING({ clouds: 0.1 });
const SEGS = [], seg = (t0, t1, a, b, ease = "sine.inOut") => { SEGS.push({ t0, t1, a, b, e: gsap.parseEase(ease) }); SEGS.sort((p, q) => p.t0 - q.t0); };
const camAt = (t) => { let c = SEGS[0].a;
  for (const g of SEGS) { if (t < g.t0) break; const u = g.e(Math.min(1, (t - g.t0) / Math.max(g.t1 - g.t0, 1e-3))), a = g.a, b = g.b;
    c = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]; }
  return c; };
const camApply = () => { const c = camAt(tl.time()); CAM.cx = c[0]; CAM.cy = c[1]; CAM.s = c[2];
  const s = Math.max(CAM.s, 1920 / 2880), cx = Math.min(Math.max(CAM.cx, 960 / s), 2880 - 960 / s), cy = Math.min(Math.max(CAM.cy, 540 / s), 1620 - 540 / s);
  gsap.set(WORLD, { x: 960 - cx * s, y: 540 - cy * s, scale: s }); CAM_S = s; setInv(); lens(cx, cy, s); };
const CW0 = [1500, 830, 0.72], CW1 = [1490, 815, 0.75], CW2 = [1450, 805, 0.8], CB2 = [1390, 830, 0.92], CM = [1540, 880, 1.3], CM2 = [1585, 895, 1.28],
  CM3 = [1690, 915, 1.2], CL = [1890, 860, 1.03], CL2 = [1925, 925, 1.08], CC = [1980, 930, 1.25], CC2 = [1990, 936, 1.27], CWD = [1700, 820, 0.85], CWD2 = [1690, 815, 0.86],
  CE = [1400, 832, 1.12], CE2 = [1392, 826, 1.14];
camera([[0, ...CW0]]);
seg(0, T_PLAN, CW0, CW1); seg(T_PLAN, T_OW - 0.3, CW1, CW2); seg(T_OW - 0.2, T_930 - 0.3, CW2, CB2);
seg(T_930 - 0.2, T_930 + 2.6, CB2, CM, "power2.inOut"); seg(T_930 + 2.7, T_CUT, CM, CM2); seg(T_CUT + 0.1, T_RAGGED + 0.8, CM2, CM3);
seg(T_WIND - 0.2, T_WIND + 2.6, CM3, CL, "power2.inOut"); seg(T_WIND + 2.7, T_OPENSEA + 0.8, CL, CL2);
seg(T_MIST - 0.3, T_MIST + 2.4, CL2, CC, "power2.inOut"); seg(T_MIST + 2.5, T_DAYS - 0.5, CC, CC2);
seg(T_DAYS - 0.4, T_DAYS + 2.4, CC2, CWD, "power2.inOut"); seg(T_DAYS + 2.5, T_DOOR - 0.7, CWD, CWD2);
seg(T_DOOR - 0.6, T_DOOR + 1.8, CWD2, CE, "power2.inOut"); seg(T_DOOR + 1.9, END, CE, CE2);
CAM_KEYS = [...Array(Math.ceil(END * 4) + 1)].map((_, i) => { const t = i / 4, c = camAt(t); return [t, c[0], c[1], c[2], "none"]; });
tl.eventCallback("onUpdate", ((prev) => function () { if (prev) prev.apply(this, arguments); camApply(); })(tl.eventCallback("onUpdate")));
tl.fromTo({ k: 0 }, { k: 0 }, { k: 1, duration: END, ease: "none", immediateRender: false, onUpdate: camApply }, 0);
// ---------------------------------------------------------------------------------------------------------------------------------
// helpers: ship keyframes (one schedule per ship, POSAT for the shots), screen cards, streaks, banner stakes, water hatching
// ---------------------------------------------------------------------------------------------------------------------------------
const UNITF = (id, side, p, type, o = {}) => { UNIT(id, side, p, type, { ...o, t: 0 }); const el = B.units[id].el; gsap.set(el, { autoAlpha: 0 });
  if (o.t != null) tl.to(el, { autoAlpha: o.op ?? 1, duration: o.fade ?? 0.45 }, o.t); return id; };
const SHIP = (id, side, p, tIn, o = {}) => UNITF(id, side, p, "ship", { ech: "", t: tIn, ...o });
const KS = {};
const K0 = (id, p) => { KS[id] = [[0, p[0], p[1], "none"]]; };
const KEY = (id, t, p, ease = "power1.inOut") => { const ks = KS[id]; let i = ks.length; while (i > 0 && ks[i - 1][0] > t) i--; ks.splice(i, 0, [t, p[0], p[1], ease]); };
const KPATH = (id, pts, t, dur, n = 20, ease = "none") => { for (let k = 1; k <= n; k++) KEY(id, t + dur * k / n, posOn(pts, gsap.parseEase(ease)(k / n)), "none"); };
const POSAT = (id, t) => { const ks = KS[id]; let a = ks[0]; for (let i = 1; i < ks.length; i++) { const b = ks[i]; if (t < b[0]) {
    const u = gsap.parseEase(b[3])(Math.max(0, (t - a[0]) / Math.max(b[0] - a[0], 1e-3))); return [a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]; } a = b; } return [a[1], a[2]]; };
const FLUSH = () => Object.entries(KS).forEach(([id, ks]) => { ks.sort((p, q) => p[0] - q[0]);
  for (let i = 1; i < ks.length; i++) { const [t0] = ks[i - 1], [t1, x, y, e] = ks[i]; B.move(id, t0, Math.max(t1 - t0, 0.01), x, y, e); } });
const scr0 = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; SCN.insertBefore(el, document.getElementById("credit")); gsap.set(el, { autoAlpha: 0 }); return el; };
const CARD = (kick, big, col, t, until, o = {}) => { const el = scr0(`<div style="padding:12px 46px 16px;background:rgb(18,16,12);border-top:6px solid ${col};font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 20px 44px rgba(0,0,0,.6)">
    ${kick ? `<div class="k" style="font-size:24px;letter-spacing:.34em;color:#d8c9a3">${kick}</div>` : ""}<div class="b" style="font-size:${o.size || 72}px;letter-spacing:.05em;line-height:1.08">${big}</div></div>`,
    o.css || `left:0;right:0;top:${o.top ?? 150}px;display:flex;justify-content:center;transform-origin:50% 30%;`);
  slam(el, t, { from: o.from || 1.6, shake: o.shake ?? 4, until }); return el; };
const ADDLINE = (card, txt, t, col = "#d8c9a3", size = 30) => { const s = document.createElement("div"); s.style.cssText = `font-size:${size}px;letter-spacing:.2em;color:${col};margin-top:6px`; s.textContent = txt;
  card.firstElementChild.appendChild(s); gsap.set(s, { autoAlpha: 0 }); tl.fromTo(s, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.3, immediateRender: false }, t); SFX("tick", t + 0.05); return s; };
// light streaks on the water (wind / tide), constant ~1.6 px on screen, deterministic: o = { box:[x0,y0,x1,y1], dir:[dx,dy], len, move, n, per, t0, t1, op, col, seed }
const STREAKS = (o) => { const g = document.createElementNS(NSs, "g"); OVL.appendChild(g); const ls = []; let sd = o.seed || 3;
  const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647; const [x0, y0, x1, y1] = o.box, [dx, dy] = o.dir, L = o.len, M = o.move, per = o.per || 2.2;
  for (let k = 0; k < (o.n || 12); k++) { const l = document.createElementNS(NSs, "line");
    Object.entries({ stroke: o.col || "#eef3ea", "stroke-linecap": "round", opacity: 0 }).forEach(([a, v]) => l.setAttribute(a, v)); g.appendChild(l); ls.push(l);
    for (let tt = o.t0 + rnd() * per; tt < o.t1 - 0.6; tt += per * (0.8 + 0.4 * rnd())) { const x = x0 + (x1 - x0) * rnd(), y = y0 + (y1 - y0) * rnd(), d = per * 0.8;
      tl.fromTo(l, { attr: { x1: x, y1: y, x2: x + dx * L, y2: y + dy * L } }, { attr: { x1: x + dx * M, y1: y + dy * M, x2: x + dx * (L + M), y2: y + dy * (L + M) }, duration: d, ease: "none", immediateRender: false }, tt);
      tl.fromTo(l, { opacity: 0 }, { opacity: o.op ?? 0.45, duration: d * 0.35, yoyo: true, repeat: 1, ease: "sine.inOut", immediateRender: false }, tt); } }
  onCam((s) => ls.forEach((l) => l.setAttribute("stroke-width", ((o.w || 1.6) / s).toFixed(3)))); return g; };
// a banner's stake (screen px from the unit centre, as the kit's side offsets) + a slide to a new stake when the formation changes
const STAKE = (w, dx, dy) => { w.style.left = `calc(50% + ${dx}px)`; w.style.top = dy + "px"; return w; };
const RESTAKE = (w, ddx, ddy, t, dur = 1.0) => tl.to(w, { x: ddx, y: ddy, duration: dur, ease: "power2.inOut" }, t);
// FORM 1 hatching on WATER (the kit's HATCH cuts water out; the bay mouth is water): same pattern, masked by the water mask
const HATCHW = (polys, side, t, hold = 2.2) => { const id = "p2hw" + Math.round(t * 100), d = document.createElement("div"), col = side === "allies" ? "#2c57b7" : "#bc2528";
  d.style.cssText = `position:absolute;left:0;top:0;width:2880px;height:1620px;pointer-events:none;-webkit-mask-image:url(assets/${YT.BASE}_m_water.png);mask-image:url(assets/${YT.BASE}_m_water.png);-webkit-mask-size:2880px 1620px;mask-size:2880px 1620px`;
  d.innerHTML = `<svg width="2880" height="1620" viewBox="0 0 2880 1620" style="position:absolute;left:0;top:0;overflow:visible"><defs><pattern id="${id}" patternUnits="userSpaceOnUse" width="9" height="9" patternTransform="rotate(45)">
    <rect x="0" y="0" width="2" height="9" fill="${col}"/></pattern></defs>${polys.map((pl) => `<polygon points="${pl.map((q) => q.join(",")).join(" ")}" fill="url(#${id})" opacity="0.75"/>`).join("")}</svg>`;
  WORLD.insertBefore(d, OVL); const pat = d.querySelector("pattern"), rc = d.querySelector("rect");
  onCam((s) => { pat.setAttribute("width", (9 / s).toFixed(3)); pat.setAttribute("height", (9 / s).toFixed(3)); rc.setAttribute("width", (2 / s).toFixed(3)); rc.setAttribute("height", (9 / s).toFixed(3)); });
  gsap.set(d, { autoAlpha: 0 }); tl.to(d, { autoAlpha: 1, duration: 0.5 }, t); tl.to(d, { autoAlpha: 0, duration: 0.8, ease: "sine.inOut" }, t + 0.5 + hold); return d; };
const DARKEN = (id, t) => tl.to(B.units[id].el.querySelector(".blk"), { filter: "brightness(0.5) saturate(0.7)", duration: 0.8 }, t);
const SMOKECOL = (id, t0, t1, every = 0.45) => { for (let tt = t0; tt < t1; tt += every) { const q = POSAT(id, tt); K.smoke(q[0] + 2, q[1] - 8, tt, { n: 1, r: 12, rise: 34, life: 2.6, alpha: 0.7, drift: 12 }); } };
// ---------------------------------------------------------------------------------------------------------------------------------
// date scroll (5 SEP 1781 from p1b), title card PART 2 · THE SEA, subscribe (1b) + NEXT label
// ---------------------------------------------------------------------------------------------------------------------------------
dateNow("5 SEP 1781", T_DAYS - 0.05);
B.date("6 SEP 1781", T_DAYS, T_SIGHT - 0.08, 32); SFX("tick", T_DAYS + 0.1);
B.date("9 SEP 1781", T_SIGHT, T_SQ - 0.08, 32); SFX("tick", T_SIGHT + 0.1);
B.date("10 SEP 1781", T_SQ, T_11 - 0.08, 32); SFX("tick", T_SQ + 0.1);
B.date("11 SEP 1781", T_11, T_13 - 0.08, 32); SFX("tick", T_11 + 0.1);
B.date("13 SEP 1781", T_13, null, 32); SFX("tick", T_13 + 0.1);
E.subscribe(T_SUBS - 0.35, T_HERE + 0.1);
const NEXT = scr0(`<div style="padding:10px 26px 12px;background:rgba(14,12,10,0.92);border-left:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;letter-spacing:.14em;font-size:30px;box-shadow:0 10px 24px rgba(0,0,0,.5)">
  <span style="color:#c9b48a">NEXT:</span> PART 2 · THE SEA</div>`, "right:80px;bottom:156px;");
tl.fromTo(NEXT, { autoAlpha: 0, x: 60 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: "power3.out", immediateRender: false }, T_HERE + 0.6);
tl.to(NEXT, { autoAlpha: 0, duration: 0.35 }, T_PLAN - 0.6);
const TITLE = scr0(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:16px 64px 22px;background:rgb(14,12,10);border-top:7px solid #c9b48a;box-shadow:0 24px 50px rgba(0,0,0,.6)">
  <div style="font-size:30px;letter-spacing:0.42em;color:#c9b48a">PART 2</div><div style="font-size:104px;letter-spacing:0.08em;line-height:1.05;color:#f7f3ea">THE SEA</div></div>`,
  "left:0;right:0;top:350px;display:flex;justify-content:center;transform-origin:50% 40%;");
slam(TITLE, T_PLAN - 0.25, { from: 1.6, shake: 4, until: T_GRAVES - 0.3 });
// ---------------------------------------------------------------------------------------------------------------------------------
// the British fleet: one column coming down from the north-east with the wind, then (p2-4) the line of battle off the capes
// r0 = van ... r9 = rear; Graves's flagship r6 (centre), Hood r8 (rear division), HMS Terrible r2 (van); wide shots show the even boxes only
// ---------------------------------------------------------------------------------------------------------------------------------
const RP = [[3100, -150], [2560, 260], [1980, 650], [1790, 760], [2215, 1040]];
const RL = RP.slice(1).reduce((s, q, i) => s + Math.hypot(q[0] - RP[i][0], q[1] - RP[i][1]), 0), SPC = 56;
const T_LDONE = T_HOURS + 2.5;
const REM = [[0, 956], [T_GRAVES, 796], [T_SAILS, 656], [T_WIND, 546], [T_INST, 496], [T_LINE, 130], [T_LDONE, 0]];   // head: distance left to the van's place
const remAt = (t) => { for (let i = 1; i < REM.length; i++) if (t <= REM[i][0]) { const [a, b] = [REM[i - 1], REM[i]], u = (t - a[0]) / (b[0] - a[0]); return a[1] + (b[1] - a[1]) * gsap.parseEase("sine.inOut")(u); } return 0; };
const RED = [...Array(10)].map((_, i) => "r" + i);
const DRIFT1 = [26, 8], DRIFT2 = [36, 11];                               // the lines sail on slowly while they wait (p2-4) and fight (p2-5)
RED.forEach((id, i) => { const pos = (t) => posOn(RP, Math.max(0, Math.min(1, (RL - remAt(t) - i * SPC) / RL)));
  K0(id, pos(0)); for (let t = 0.5; t <= T_LDONE + 0.01; t += 0.5) KEY(id, t, pos(t), "none");
  const F = pos(T_LDONE); KEY(id, T_MIST, [F[0] + DRIFT1[0], F[1] + DRIFT1[1]], "none"); });
// frame-0 / drop-in visibility: even boxes from frame 0 (or when they come down into the frame), odd boxes join the column at the medium shot
const RIN = {}; RED.forEach((id, i) => { let t = 0; while (t < 60 && POSAT(id, t)[1] < 150) t += 0.25; RIN[id] = i % 2 ? Math.max(t, T_930 + 1.0) : t; });
RED.forEach((id) => SHIP(id, "british", KS[id][0].slice(1, 3), RIN[id] > 0.01 ? RIN[id] : null));
RED.forEach((id) => { if (RIN[id] <= 0.01) gsap.set(B.units[id].el, { autoAlpha: 1 }); });
const FL_GB = SIDEFLAG("gb", "r0", 0);
// "Admiral Thomas Graves": his banner on the flagship (west stake in the column, slides to the north-east stake when the line forms)
BANNER("graves", "Admiral Thomas Graves", "gb", "r6", T_GRAVES, { side: "west", until: T_930 - 0.2 });   // off before the medium shot (it would sit on the frame edge)
// "nineteen ships of the line": number card; wind streaks (NNE breeze, clear day) along the column
CARD("", "19 SHIPS OF THE LINE", "#c4121f", T_19 - 0.05, T_19 + 3.3, { size: 64, css: "right:130px;top:600px;transform-origin:50% 30%;" });
STREAKS({ box: [2000, 120, 2700, 620], dir: [-0.42, 0.91], len: 46, move: 70, n: 12, per: 2.4, t0: T_19 - 0.2, t1: T_PART + 2.0, op: 0.6, w: 2.2, seed: 5 });
// ---------------------------------------------------------------------------------------------------------------------------------
// the French: three ships inside the capes at frame 0 (sub); "only part of the French fleet": ghosts; p2-3: the whole fleet at anchor
// ---------------------------------------------------------------------------------------------------------------------------------
const SLOT = [[1565, 900], [1500, 900], [1540, 855], [1475, 945], [1430, 900], [1405, 945], [1470, 855], [1450, 810], [1360, 900], [1400, 855], [1370, 810], [1330, 855]];
["f0", "f1", "f2"].forEach((id, i) => { SHIP(id, "allies", [[1330, 830], [1490, 830], [1410, 885]][i], null); gsap.set(B.units[id].el, { autoAlpha: 1 }); });
const FL_FR = SIDEFLAG("fr", "f1", 0, T_PLAN - 0.2);
hideU(["f0", "f1", "f2"], T_PLAN - 0.3);
["g0", "g1", "g2"].forEach((id, i) => { SHIP(id, "allies", [[1330, 830], [1490, 830], [1410, 885]][i], T_PART + 0.3 + i * 0.25, { op: 0.42 });
  gsap.set(B.units[id].el.querySelector(".blk"), { outline: "2px dashed rgba(240,236,220,.85)", outlineOffset: "3px" }); });
// "Destroy it": a thin red arrow from the column at the ghosts; "the sea would be open again": the ghosts are gone
arw({ pts: [POSAT("r0", T_DESTROY), [1820, 790], [1600, 850], [1470, 862]], side: "rome", t: T_DESTROY - 0.05, dur: 0.9, width: AW(CW2[2], 9), until: T_OPEN + 1.0 });
hideU(["g0", "g1", "g2"], T_OPEN + 0.2);
// Cornwallis at Yorktown (red box on the town, banner on a stake over the Gloucester shore, off both carved names)
const CWP = NUDGE([1185, 760], { s: 0.72 });
UNIT("cw", "british", CWP, "infantry", { ech: "XX" });
BANNER("cornwallis", "Lord Cornwallis", "gb", [1152, 622], T_CORN - 0.05, { side: "up", until: T_930 + 0.3 });
// "Cornwallis could be supplied, reinforced, or taken away": a red ship sails up the bay into the York, then out again
const SUP = [[1700, 880], [1560, 862], [1400, 800], [1300, 752], [1248, 722]];
SHIP("sup", "british", SUP[0], T_CORN - 0.2); K0("sup", SUP[0]); KPATH("sup", SUP, T_CORN, 2.8, 16, "sine.out");
KPATH("sup", [...SUP].reverse(), T_AWAY + 0.1, 2.6, 16, "sine.in"); hideU(["sup"], T_AWAY + 2.4);
// ---------------------------------------------------------------------------------------------------------------------------------
// p2-2: "In other words, one afternoon at sea would decide whether Yorktown was a harbor or a prison"
// ---------------------------------------------------------------------------------------------------------------------------------
inkTrace([[2050, 900], [1800, 885], [1600, 878], [1470, 840], [1350, 780], [1262, 728], [1205, 700]], T_OW + 0.1, T_PRISON + 0.6, 2.6);
focus([1530, 870], 120, T_AFT, T_HARBOR - 0.2);
focus([1150, 700], 80, T_HARBOR - 0.1, T_PRISON + 1.4);
stampP("HARBOR", 980, 980, T_HARBOR - 0.05, T_PRISON - 0.12, 46);
stampP("PRISON", 980, 980, T_PRISON - 0.02, T_930 + 1.4, 46);
// ---------------------------------------------------------------------------------------------------------------------------------
// p2-3: 9:30 that morning; the British sails; de Grasse's fleet at anchor inside Cape Henry; sailors ashore; cut the cables, out one by one
// ---------------------------------------------------------------------------------------------------------------------------------
LIGHT("morning", T_930, 2.5);
focus(POSAT("r0", T_SAILS), 110, T_SAILS - 0.1, T_DG - 0.2);
const BLUE = [...Array(12)].map((_, j) => "b" + j);
BLUE.forEach((id, j) => { SHIP(id, "allies", SLOT[j], T_28 - 0.05 + j * 0.09); K0(id, SLOT[j]); });
// de Grasse's flagship = b5 (Ville de Paris, the centre of the line): banner on a south-west stake over the shore, slides under the ship in the line
const BDG = STAKE(BANNER("degrasse", "Comte de Grasse", "fr", "b5", T_DG + 0.05, { side: "sw", until: T_SIGHT + 0.5 }), -110, 200);
PLACE_LABEL("Cape Henry", PLACE("cape_henry"), T_HENRY - 0.05, { dx: 30, dy: 36, size: 24 });
focus([1440, 880], 120, T_ANCHOR - 0.1, T_HENRY + 1.2);
// "many of his sailors were ashore, ferrying troops": boats between the ships and the shore
[[[1470, 905], [1445, 958]], [[1395, 908], [1360, 962]], [[1525, 925], [1505, 968]]].forEach((pts, k) => BOAT(pts, T_ASHORE + k * 0.35, 2.6, { until: T_CUT + 1.2 + k * 0.3, px: 30 }));
// "He cut his anchor cables ... one by one, in a ragged line": ten ships work out past Cape Henry (b10, b11 stay inside: 24 of 28 got out)
const GL = (j) => [2200 - 56 * j, 1150 - 14 * j];                       // the French line, van G0 east
const EXIT = [[1535, 915], [1610, 975], [1690, 1022]];
const TD = [0, 1.2, 2.9, 3.6, 5.6, 6.5, 8.3, 9.1, 10.9, 11.8].map((d) => T_CUT + 0.25 + d);
BLUE.slice(0, 10).forEach((id, j) => { const pts = [SLOT[j], ...EXIT, GL(j)], ta = T_FOUR - 1.2 + j * 0.32;
  KEY(id, TD[j], SLOT[j], "none"); KPATH(id, pts, TD[j], ta - TD[j], 24, "sine.in");
  KEY(id, T_MIST, [GL(j)[0] + DRIFT1[0], GL(j)[1] + DRIFT1[1]], "none"); });
RESTAKE(BDG, 70, 30, T_24 - 1.0, 1.4);
// the flood tide runs into the bay against them
STREAKS({ box: [1520, 830, 1720, 1010], dir: [-0.93, -0.36], len: 30, move: 46, n: 10, per: 2.0, t0: T_CUT - 0.2, t1: T_FALL, op: 0.5, col: "#dfeef2", seed: 11 });
// ---------------------------------------------------------------------------------------------------------------------------------
// p2-4: the wind behind Graves; "could have fallen on the French ships ... a few at a time"; "But he did not. Instead ... line of battle, and waited"
// ---------------------------------------------------------------------------------------------------------------------------------
STREAKS({ box: [1900, 420, 2500, 800], dir: [-0.42, 0.91], len: 46, move: 60, n: 12, per: 2.4, t0: T_WIND - 0.3, t1: T_INST + 2.0, op: 0.6, w: 2.2, seed: 17 });
// "Graves had the wind behind him": his banner back on the flagship once the camera has the column in frame
const BG = BANNER("graves", "Admiral Thomas Graves", "gb", "r6", T_WIND + 2.7, { side: "west", until: T_SIGHT + 0.5 });
RESTAKE(BG, 156, -24, T_LDONE - 1.6, 1.4);
arw({ pts: [POSAT("r0", T_FALL), [1700, 880], [1625, 945]], side: "rome", t: T_FALL + 0.1, dur: 0.9, width: AW(CL[2], 9), until: T_DIDNOT + 0.15 });
focus([1600, 960], 100, T_FEW - 0.2, T_DIDNOT + 0.2);
LIGHT("afternoon", T_HOURS, 3.0);
focus([1950, 1090], 170, T_24 - 0.1, T_OPENSEA + 1.6);
// ---------------------------------------------------------------------------------------------------------------------------------
// p2-5: the battle of the Capes (5 Sep, ~4 PM to dark): signals, the van turns in and fights, Hood's rear stays far back
// ---------------------------------------------------------------------------------------------------------------------------------
const TURN = [8, 44];
RED.forEach((id, i) => { const F = POSAT(id, T_MIST); const vanTurn = i <= 4;
  if (vanTurn) { KEY(id, T_LEAD + 0.1, [F[0] + DRIFT2[0] * 0.3, F[1] + DRIFT2[1] * 0.3], "none");
    KEY(id, T_LEAD + 2.6, [F[0] + DRIFT2[0] * 0.45 + TURN[0] * (1 - i * 0.12), F[1] + DRIFT2[1] * 0.45 + TURN[1] * (1 - i * 0.12)], "power1.inOut");
    KEY(id, T_DAYS, [F[0] + DRIFT2[0] + TURN[0] * (1 - i * 0.12), F[1] + DRIFT2[1] + TURN[1] * (1 - i * 0.12)], "none"); }
  else KEY(id, T_DAYS, [F[0] + DRIFT2[0], F[1] + DRIFT2[1]], "none"); });
BLUE.slice(0, 10).forEach((id) => { const F = POSAT(id, T_MIST); KEY(id, T_DAYS, [F[0] + DRIFT2[0], F[1] + DRIFT2[1]], "none"); });
// "two signals at once": two small signal flags on Graves's flagship (left of the ship, off his banner) + the caption on the spoken words
{ const host = B.units.r6.el.firstElementChild, el = document.createElement("div");
  el.style.cssText = "position:absolute;left:-30px;top:-50px;width:0;height:0;pointer-events:none;z-index:2";
  el.innerHTML = `<div style="position:absolute;left:0;top:0;width:2px;height:46px;background:#3a2c1e"></div>
    <svg style="position:absolute;left:2px;top:1px" width="20" height="13" viewBox="0 0 20 13"><rect width="20" height="13" fill="#f4f0e4" stroke="#1a1712" stroke-width="1"/><rect x="0" y="0" width="10" height="6.5" fill="#1f4fc4"/><rect x="10" y="6.5" width="10" height="6.5" fill="#1f4fc4"/></svg>
    <svg style="position:absolute;left:2px;top:17px" width="20" height="13" viewBox="0 0 20 13"><rect width="20" height="13" fill="#d11f1f" stroke="#1a1712" stroke-width="1"/><rect x="0" y="4.5" width="20" height="4" fill="#f4f0e4"/></svg>`;
  host.appendChild(el); host.style.overflow = "visible"; gsap.set(el, { autoAlpha: 0 });
  tl.fromTo(el, { autoAlpha: 0, scaleY: 0.2, transformOrigin: "0% 100%" }, { autoAlpha: 1, scaleY: 1, duration: 0.35, immediateRender: false }, T_TWO);
  tl.to(el, { autoAlpha: 0, duration: 0.5 }, T_HARDLY); }
focus(POSAT("r6", T_FLAG), 70, T_FLAG - 0.1, T_KEEP - 0.2);
const SIG = CARD("", "KEEP IN LINE", "#c4121f", T_KEEP - 0.05, T_LEAD + 1.4, { size: 56, from: 1.4, shake: 3, css: "left:120px;top:820px;transform-origin:30% 30%;" });
ADDLINE(SIG, "CLOSE WITH THE ENEMY", T_CLOSE, "#f7f3ea", 40);
// "His leading ships turned in and fought at close range": broadsides both ways (gun quiet, boom on the impact), powder smoke
const FIRE = [["r1", "b1", T_RANGE + 0.15], ["b0", "r0", T_RANGE + 2.0], ["r3", "b3", T_HOOD - 0.2], ["b2", "r2", T_STAYED + 0.5], ["r0", "b0", T_HARDLY + 0.4],
  ["b4", "r4", T_25H + 0.2], ["r2", "b2", T_HAMMER - 0.3], ["b1", "r1", T_HAMMER + 1.6], ["r4", "b4", T_DARK + 0.1]];
FIRE.forEach(([a, b, t]) => { const p = POSAT(a, t), q = POSAT(b, t + 0.8), dir = [q[0] - p[0], q[1] - p[1]], n = Math.hypot(...dir);
  shoot([p[0] + dir[0] / n * 14, p[1] + dir[1] / n * 10], [q[0] - dir[0] / n * 6, q[1] - dir[1] / n * 6], t, { dur: 0.75, r: 7, h: 26 });
  smoke([[p[0] + dir[0] / n * 16, p[1] + dir[1] / n * 12], [p[0] + dir[0] / n * 26, p[1] + dir[1] / n * 18]], t + 0.05, 1.6);
  for (let k = 0; k < 3; k++) K.smoke(p[0] + dir[0] / n * (12 + 8 * k), p[1] + dir[1] / n * (10 + 6 * k), t + 0.05 + k * 0.12, { n: 1, r: 7, rise: 6, life: 2.8, alpha: 0.55, drift: 7 }); });
// the van lines facing each other at close range: the two-colour front between them (red toward the British), on "close range", gone with the dark
{ const FP = [0, 1, 2, 3, 4].map((i) => { const r = POSAT("r" + i, T_RANGE + 1.0), b = POSAT("b" + i, T_RANGE + 1.0); return [(r[0] + b[0]) / 2, (r[1] + b[1]) / 2]; }).sort((p, q) => p[0] - q[0]);
  FRONT(FP, T_RANGE, { enemy: POSAT("r2", T_RANGE + 1.0), dur: 1.0, until: T_DAYS - 0.6 }); }
// "His rear division, under Admiral Samuel Hood, stayed in line, far away": Hood's banner on the rear, focus there
STAKE(BANNER("hood", "Admiral Samuel Hood", "gb", "r8", T_HOOD + 0.1, { side: "ne", until: T_DAYS + 0.4 }), -40, -70);
focus(POSAT("r8", T_STAYED), 95, T_STAYED - 0.1, T_HARDLY + 1.4);
focus([2050, 1080], 150, T_HAMMER - 0.4, T_DARK - 0.2);
// "When darkness fell, five British ships were badly damaged"
LIGHT("dusk", T_DARK, 2.0);
["r0", "r1", "r2", "r3", "r4"].forEach((id, k) => DARKEN(id, T_FIVE + 0.1 + k * 0.15));
// ---------------------------------------------------------------------------------------------------------------------------------
// p2-6: the days after: both fleets drift south-east out of sight (6 -> 9 SEP), Barras slips in (10 SEP), de Grasse back, HMS Terrible (11 SEP),
// Graves leaves (13 SEP)
// ---------------------------------------------------------------------------------------------------------------------------------
LIGHT("day", T_DAYS, 2.0);
const DRIFTSE = [560, 600];
[...RED, ...BLUE.slice(0, 10)].forEach((id) => { const p = POSAT(id, T_DAYS); KEY(id, T_SIGHT + 1.6, [p[0] + DRIFTSE[0], p[1] + DRIFTSE[1]], "sine.in"); });
hideU([...RED, ...BLUE.slice(0, 10)], T_SIGHT + 0.5);
["r0", "r1", "r2", "r3", "r4"].forEach((id, k) => SMOKECOL(id, T_FIVE + 0.2 + k * 0.15, T_SIGHT + 0.4)); hideU(["b10", "b11"], T_MIST - 0.6);
tl.to(B.units.cw.el, { autoAlpha: 0, duration: 0.4 }, T_MIST - 0.6); tl.to(B.units.cw.el, { autoAlpha: 1, duration: 0.4 }, T_DAYS + 1.0);
// "a second French squadron ... the Comte de Barras, from Rhode Island, with eight more ships of the line, and the heavy siege guns"
// (wide shot: four boxes for the squadron + the siege-gun box, three for de Grasse's return; slots spaced for s 0.85)
const WSLOT = { x0: [1555, 870], x1: [1490, 870], x2: [1525, 925], x3: [1450, 925], xa: [1415, 870], b5: [1415, 815], b4: [1340, 870], b6: [1375, 925] };
const BP = [[2120, -70], [1960, 260], [1760, 620], [1600, 820], [1540, 880]];
const BAR = ["x0", "x1", "x2", "x3"];
BAR.forEach((id, j) => { const t0 = T_SQ - 0.4 + j * 1.0; SHIP(id, "allies", BP[0], t0 + 0.2); K0(id, BP[0]); KEY(id, t0, BP[0], "none");
  KPATH(id, [...BP, WSLOT[id]], t0, 8.2, 24, "sine.out"); });
STAKE(BANNER("barras", "Comte de Barras", "fr", "x0", T_BARRAS, { side: "east", until: T_13 + 0.3 }), 160, 80);
// the siege guns ride with the squadron (artillery box beside the third ship), dropping in on the spoken words
{ const t0 = T_SQ - 0.4 + 2 * 1.0, o = [58, 8], P0 = [BP[0][0] + o[0], BP[0][1] + o[1]];
  UNITF("xa", "allies", P0, "artillery", { ech: "", t: T_GUNS - 0.05 }); K0("xa", P0); KEY("xa", t0, P0, "none");
  KPATH("xa", [...BP.map(([x, y]) => [x + o[0], y + o[1]]), WSLOT.xa], t0, 8.4, 24, "sine.out"); }
// "De Grasse came back in to join him": three of his ships (flagship b5 with them) come back from the south-east into the bay
const RET = ["b5", "b4", "b6"];
RET.forEach((id, k) => { const s0 = [2240 + k * 70, 1400 - k * 40], t0 = T_BACK - 0.2 + k * 0.5;
  KEY(id, t0 - 0.05, s0, "none"); KPATH(id, [s0, [1760, 1060], [1610, 975], [1540, 905], WSLOT[id]], t0, 7.6, 24, "sine.out");
  tl.to(B.units[id].el, { autoAlpha: 1, duration: 0.5 }, t0); });
BANNER("degrasse", "Comte de Grasse", "fr", "b5", T_BACK + 0.2, { side: "up" });
// 11 SEP: the British fleet off the capes; "the British burned the wrecked HMS Terrible" (r2): fire, smoke, label, it sinks
const RS = { r2: [2235, 1330], r5: [2340, 1235], r6: [2440, 1290], r7: [2530, 1215] };
Object.entries(RS).forEach(([id, p]) => { KEY(id, T_11 - 0.3, p, "none"); KEY(id, T_13, [p[0] + 12, p[1] + 4], "none"); tl.to(B.units[id].el, { autoAlpha: 1, duration: 0.5 }, T_11 - 0.2); });
bonfire(RS.r2[0], RS.r2[1] - 4, T_BURN, T_TERR + 1.9, 44);
for (let tt = T_BURN + 0.1; tt < T_TERR + 2.0; tt += 0.3) K.smoke(RS.r2[0] + 3, RS.r2[1] - 10, tt, { n: 1, r: 14, rise: 40, life: 2.6, alpha: 0.7, drift: 14 });
PLACE_LABEL("HMS Terrible", RS.r2, T_TERR - 0.05, { dx: -10, dy: 30, size: 24, hold: 3.0 });
tl.to(B.units.r2.el, { autoAlpha: 0, scale: 0.35, duration: 1.4, ease: "power2.in" }, T_TERR + 0.7);
// 13 SEP: "Graves gave up and sailed back to New York": his banner, the red ships turn north and leave
const NORTH = { r5: [[2340, 1235], [2430, 900], [2520, 480]], r6: [[2440, 1290], [2520, 950], [2610, 540]], r7: [[2530, 1215], [2600, 880], [2690, 470]] };
Object.entries(NORTH).forEach(([id, pts]) => { KEY(id, T_13 + 0.2, [pts[0][0] + 12, pts[0][1] + 4], "none"); KPATH(id, pts, T_13 + 0.25, T_NYB + 2.0 - T_13, 16, "sine.in"); });
hideU(["r5", "r6", "r7"], T_NYB + 1.6);
BANNER("graves", "Admiral Thomas Graves", "gb", "r6", T_GAVE - 0.05, { side: "west", until: T_NYB + 1.6 });
trail([[2440, 1250], [2520, 900], [2610, 540]], SIDECOL("british"), 3.0 / CWD[2], T_NYB - 0.2, 1.4, T_NYB + 1.6);
// ---------------------------------------------------------------------------------------------------------------------------------
// p2-7: casualties; the door to the sea shut (French line across the bay mouth, FORM 1 blue hatching on the water); Cornwallis on the wrong side;
// the quote callback; method card THE TRAP · 2. CLOSE THE SEA
// ---------------------------------------------------------------------------------------------------------------------------------
{ const row = (flag, side, num, col) => `<div class="cr" style="display:flex;align-items:center;gap:20px;margin-top:10px"><img src="assets/media/${flag}" alt="" style="height:40px;border:1px solid #f7f3ea">
    <div style="font-size:40px;letter-spacing:.1em;min-width:190px">${side}</div><div style="font-size:64px;color:${col}">${num}</div></div>`;
  const CC_ = scr0(`<div style="padding:22px 54px 26px;background:rgb(18,16,12);border-top:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 20px 44px rgba(0,0,0,.6)">
    <div style="font-size:26px;letter-spacing:.34em;color:#d8c9a3;text-align:center">KILLED &amp; WOUNDED</div>${row("gb_flag_1606.png", "BRITISH", "~330", "#ff8a80")}${row("fr_royal_flag.png", "FRENCH", "~210", "#9fc0ea")}</div>`,
    "left:0;right:0;top:250px;display:flex;justify-content:center;transform-origin:50% 30%;");
  const rows = CC_.querySelectorAll(".cr"); gsap.set(rows[1], { autoAlpha: 0 });
  slam(CC_, T_LOST - 0.05, { from: 1.4, shake: 3, until: T_FAMOUS + 0.4 });
  tl.fromTo(rows[1], { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.3, immediateRender: false }, T_FR210 + 0.6); SFX("tick", T_FR210 + 0.65); }
// "But the door to the sea was shut": four French ships form a line across the mouth from Cape Henry to Cape Charles
const ARC = [[1548, 948], [1598, 912], [1626, 868], [1626, 820]];
["x3", "x2", "x0", "x1"].forEach((id, k) => { const p = POSAT(id, T_DOOR); KEY(id, T_DOOR - 0.3 + k * 0.15, p, "none"); KEY(id, T_DOOR + 1.6 + k * 0.15, ARC[k], "power2.inOut"); });
HATCHW([[[1500, 768], [1650, 760], [1700, 870], [1660, 1000], [1505, 990], [1470, 880]]], "allies", T_SHUT - 0.05, 2.3);
// "Cornwallis was on the wrong side of it": his banner back at Yorktown
BANNER("cornwallis", "Lord Cornwallis", "gb", [1152, 622], T_WRONG - 0.1, { side: "up" });
focus([1170, 720], 90, T_WRONG - 0.1, T_WARN - 0.1);
// "exactly what he had warned about: a temporary superiority at sea" (Cornwallis's own words, p1-1)
const Q = quote("&ldquo;&hellip;a temporary superiority at sea&rdquo;", "CORNWALLIS", T_TEMP - 0.15, T_SECOND - 0.25, { col: "#c4121f", size: 46, top: 800, mw: 1000 });
// method card THE TRAP · 2. CLOSE THE SEA (line 1 lit, line 2 lights on its words, line 3 still a bar)
GG.METHOD = ["FOOL NEW YORK", "CLOSE THE SEA", "CLOSE THE LAND"]; GG.METHOD_TITLE = "THE TRAP";
const MC = GG.method(2, T_SECOND - 0.1, null, [T_SECOND + 0.3, T_CSEA - 0.15]); MC.querySelector(".inner").style.background = "rgba(18,16,12,0.97)"; MC.style.top = "210px";
// ---------------------------------------------------------------------------------------------------------------------------------
// one flag per side: the kit (r5 FLAGSYNC) hides each side's flag while that side has a banner up
FLUSH();
camApply();
if (GD.var.audit) LABEL_AUDIT([2, 8, 14, 20, 26, 32, 38, 44, 50, 56, 62, 68, 74, 80, 86, 92, 98, 104, 110, 116, 122, 128, 134, 140, 146, 152, 158], { show: true });
