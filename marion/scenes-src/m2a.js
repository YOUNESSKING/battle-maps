// M2A (m2-1 .. m2-5), Francis Marion #18, MOVE 2 LET THE SWAMP FIGHT, opening + the night at Richardson's. Main style (STYLE_LOCK 2d/2e/2f via the
// Marion kit), 1c clean screen, 1d (enemy plan first + "in other words" + "But... instead" + cliffhanger). Build (from marion/):
//   python3 kit/build_scene.py m2a blackriver m2-1 m2-5
// Map px of `blackriver`: Richardson's house 421,978 (baked plantation house on the Camden - Nelson's Ferry road, Rimini; LOW); the Camden road comes
//   in at the top edge (249,0) and runs down to the house; the Benbow's road runs east from the house; Tearcoat (Marion, 25 Oct, m1d2) 1426,519;
//   Woodyard swamp = a live wet patch EAST of Marion's halt (~702,1022; UNV; he turns back east, away from the house); the mill dam on Jack's Creek = the
//   head of the drawn creek ~664,1138 (Richbourg's mill, LOW).
// Frame 0 = cut from m1e (lowcountry, the "?" hunter riding toward the Santee, date 25 OCTOBER 1780). Here: blackriver wide, the Legion already riding
//   down the Camden road from the top edge (units moving), Marion's band at Tearcoat; title card MOVE 2 · LET THE SWAMP FIGHT slams at once (masks
//   the cut). The [MAP] line's "NOV 1780" is NOT shown in m2-1 (no November date is spoken there, MAP_BRIEF date rule): 25 OCTOBER 1780 until
//   "seventh of November".
// m2-1: "Banastre Tarleton": his banner on the lead box. "cavalry" / "light infantry": those boxes pulse; "two light guns": two kit gun boxes drop in at
//   the rear of the column. "Waxhaws" / "Fishing Creek": two stamps at the top edge (both lie north of the map). "Cornwallis sent him south": a thin
//   red arrow down the road; "get at Marion": Marion's banner. "Marion is cautious and vigilant": quote card (verbatim, Cornwallis to Tarleton).
// m2-2: "In other words": the Legion and Marion in one frame; "stand and fight in the open": a thin red ring closes round Marion's box; "just once":
//   it snaps tight (hit); "Against horsemen like these": the Legion's cavalry pulses; "a band of militia": the cypress swamps glow faintly (the answer).
// m2-3: "the seventh of November": night falls + 7 NOVEMBER 1780; Marion rides down from Tearcoat and west along the Benbow's road toward the house
//   (camera follows into the close look); "a great light in the sky": a big orange glow over the house; "General Richardson": label RICHARDSON'S;
//   the Legion boxes sit dark around the house (unseen), "were waiting at the plantation": they light up; "a rider came in out of the dark": a small
//   blue rider gallops in to Marion; card AT LEAST TWICE HIS NUMBERS / TWO FIELD GUNS on the spoken words; "deserted to guide them": one blue box
//   leaves Marion's band, turns red and walks to the Legion (unit size, critic r2).
// m2-4: E.decide on "put yourself in Marion's place" (A on "hit him in the dark", B on "vanish into the swamp", 3 ticks on "Tell us in the comments");
//   three small night-attack marks tick in under the title on "three night attacks in a row"; the camera keeps a slow push on the glow.
// m2-5: reveal B on the paragraph start (hit). "turned his men around": Marion's box turns back east, "the Woodyard swamp": a dark wet patch + label,
//   the box goes in (no trail); "profound darkness": the night deepens + verbatim caption; "Jack's Creek": mill dam mark + label, the box crosses;
//   "Now we are safe": quote card (verbatim); "trap was sprung": dawn, the Legion closes on the empty wood (red ring closes on nothing);
//   "burned the Richardson house": fire mark + smoke column on the house. Last frame = morning close on the burning house (m2b opens there).
const P1 = "m2-1", P2 = "m2-2", P3 = "m2-3", P4 = "m2-4", P5 = "m2-5";
const T_PLAN = at(P1, "The British plan this time was a hunt"), T_TARL = at(P1, "Lieutenant Colonel Banastre Tarleton"), T_LEG = at(P1, "commanded the British Legion"),
  T_CAV = at(P1, "cavalry and light infantry"), T_LI = at(P1, "light infantry, with"), T_GUNS = at(P1, "with two light guns"), T_WAX = at(P1, "at the Waxhaws"),
  T_FISH = at(P1, "at Fishing Creek"), T_SOUTH = at(P1, "Cornwallis sent him south"), T_GETM = at(P1, "to get at Marion"), T_WARN = at(P1, "warned him what he was up against"),
  T_CAUT = at(P1, "Marion is cautious and vigilant");
const T_OW = at(P2, "In other words"), T_OPEN = at(P2, "stand and fight in the open"), T_ONCE = at(P2, "just once"), T_HORSE = at(P2, "Against horsemen like these"),
  T_COUNTRY = at(P2, "in open country"), T_BAND = at(P2, "a band of militia"), T_PIECES = at(P2, "cut to pieces");
const T_NIGHT = at(P3, "On the night of the seventh of November"), T_7 = at(P3, "seventh of November"), T_UP = at(P3, "moving up the road"),
  T_LIGHT = at(P3, "a great light in the sky"), T_RICH = at(P3, "the late General Richardson"), T_RIDER = at(P3, "Then a rider came in"), T_SON = at(P3, "It was the general's son"),
  T_WAIT = at(P3, "were waiting at the plantation"), T_TWICE = at(P3, "at least twice Marion's numbers"), T_2G = at(P3, "with two field guns"),
  T_DES = at(P3, "one of Marion's own men had deserted"), T_GUIDE = at(P3, "to guide them");
const T_STOP = at(P4, "Now stop for a moment"), T_PUT = at(P4, "put yourself in Marion's place"), T_3N = at(P4, "three night attacks in a row"),
  T_FIRE = at(P4, "The enemy is somewhere around that fire"), T_HIT = at(P4, "Do you hit him in the dark"), T_VAN = at(P4, "Or do you turn around and vanish into the swamp"),
  T_TELL = at(P4, "Tell us in the comments"), T_LISTEN = at(P4, "And then listen");
const T_P5 = B.T.paras[P5][0], T_NOT = at(P5, "He did not attack"), T_TURN = at(P5, "Instead, he turned his men around"), T_WOOD = at(P5, "the Woodyard swamp"),
  T_DARK = at(P5, "the most profound darkness"), T_DAM = at(P5, "a mill dam on Jack's Creek"), T_JACK = at(P5, "Jack's Creek"), T_SIX = at(P5, "six miles away"),
  T_SAFE = at(P5, "Now we are safe"), T_TRAP = at(P5, "When Tarleton's trap was sprung"), T_NOTH = at(P5, "it closed on nothing"), T_ANGER = at(P5, "In his anger"),
  T_BURN = at(P5, "burned the Richardson house");
// ---------------------------------------------------------------------------------------------------------------------------------
LIVING({ clouds: 0.1 });
const HOUSE = [421, 978], HALT = [652, 936], DAM = [664, 1138], WOODY = [702, 1022];
const CW = [1200, 640, 0.8], CS = [1010, 640, 0.92], CO = [1000, 650, 0.95], CN = [560, 985, 2.3], CN2 = [520, 982, 2.5], C5 = [575, 1040, 2.2];
camera([[0, ...CW], [T_SOUTH - 0.3, ...CW], [T_SOUTH + 1.8, ...CS, "power2.inOut"], [T_OW + 0.2, ...CS], [T_OW + 2.4, ...CO, "power2.inOut"],
  [T_PIECES + 0.6, 1000, 652, 0.97], [T_NIGHT + 0.6, 1180, 760, 1.15, "power2.inOut"], [T_LIGHT + 0.2, ...CN, "power2.inOut"], [T_STOP, 548, 984, 2.36],
  [T_P5 + 0.2, ...CN2, "sine.inOut"], [T_DAM + 0.8, ...C5, "power2.inOut"], [T_TRAP + 1.5, 560, 1020, 2.25], [END, 525, 1000, 2.3, "sine.inOut"]]);
// ---------------------------------------------------------------------------------------------------------------------------------
// scene-local helpers
const NIGHTB = { pop: 1.4, bright: 1.18 };
const scr0 = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; SCN.insertBefore(el, document.getElementById("credit")); gsap.set(el, { autoAlpha: 0 }); return el; };
const pulse = (id, t, k = 1.25) => tl.fromTo(B.units[id].el.querySelector(".blk"), { scale: 1 }, { scale: k, duration: 0.25, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, t);
// a thin ring (constant ~3 px on screen) around p: closes from r0 to r1 (map px)
const RING = (p, r0, r1, t, dur, until, col = "#e0473f") => { const c = document.createElementNS(NS, "circle");
  Object.entries({ cx: p[0], cy: p[1], r: r0, fill: "none", stroke: col, opacity: 0 }).forEach(([k, v]) => c.setAttribute(k, v));
  c.style.filter = "drop-shadow(0 0 3px rgba(0,0,0,.8))"; OVL.appendChild(c); onCam((s) => c.setAttribute("stroke-width", (3.2 / s).toFixed(3)));
  tl.to(c, { opacity: 0.95, duration: 0.3 }, t); tl.fromTo(c, { attr: { r: r0 } }, { attr: { r: r1 }, duration: dur, ease: "power2.inOut", immediateRender: false }, t);
  tl.to(c, { opacity: 0, duration: 0.5 }, until); return c; };
// light-blue arrow with a pale outline (navy vanishes on the dark swamp at night)
const ARWL = (o) => { const g = arw(o), ps = g.querySelectorAll("path"); ps[0].setAttribute("stroke", "rgba(236,242,255,0.9)"); for (let i = 1; i < ps.length; i++) ps[i].setAttribute("stroke", "#6f9cff");
  const hd = g.querySelector("polygon"); if (hd) { hd.setAttribute("fill", "#6f9cff"); hd.setAttribute("stroke", "rgba(236,242,255,0.9)"); } return g; };
// ---------------------------------------------------------------------------------------------------------------------------------
// title card (frame 0, masks the cut from m1e) + date plate
// ---------------------------------------------------------------------------------------------------------------------------------
const TITLE = scr0(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:16px 64px 22px;background:rgb(14,12,10);border-top:7px solid #c9b48a;box-shadow:0 24px 50px rgba(0,0,0,.6)">
  <div style="font-size:30px;letter-spacing:0.42em;color:#c9b48a">MOVE 2</div><div style="font-size:96px;letter-spacing:0.08em;line-height:1.05;color:#f7f3ea">LET THE SWAMP FIGHT</div></div>`,
  "left:0;right:0;top:350px;display:flex;justify-content:center;transform-origin:50% 40%;");
slam(TITLE, 0.15, { from: 1.6, shake: 4, until: T_TARL - 0.35 });
dateNow("25 OCTOBER 1780", T_7 - 0.05);
B.date("7 NOVEMBER 1780", T_7, null, 32); SFX("tick", T_7 + 0.1);
// ---------------------------------------------------------------------------------------------------------------------------------
// m2-1: the Legion rides down the Camden road (frame 0: moving); Marion's band at Tearcoat
// ---------------------------------------------------------------------------------------------------------------------------------
const RNC = GD.bake.roads.find((r) => r.id === "nelson_camden").paths[0].slice().reverse();   // Camden (north, off the top edge) -> Nelson's Ferry
const iH = RNC.reduce((b, q, i) => (Math.hypot(q[0] - HOUSE[0], q[1] - HOUSE[1]) < Math.hypot(RNC[b][0] - HOUSE[0], RNC[b][1] - HOUSE[1]) ? i : b), 0);
const ROADN = RNC.slice(0, iH + 1).filter((q) => q[1] > -420);                                 // top part of the road down to the house
const LEN = (P) => P.reduce((a, q, i) => (i ? a + Math.hypot(q[0] - P[i - 1][0], q[1] - P[i - 1][1]) : 0), 0), LR = LEN(ROADN);
const at_d = (d) => posOn(ROADN, Math.max(0, Math.min(1, d / LR)));                            // point d map px down the road
// the column: lead cavalry (Tarleton), cavalry, light infantry, two guns; ~85 map px apart (~70 px on screen at s 0.8)
const COL = [["lg1", "cavalry", "II", 0], ["lg2", "cavalry", "II", 85], ["lg3", "infantry", "II", 170], ["lg4", "artillery", "", 255], ["lg5", "artillery", "", 335]];
const D0 = 820, D1 = LR - 60, TR0 = 0, TR1 = T_NIGHT - 1.0;                                    // head of the column: 560 px down the road at frame 0 -> near the house
COL.forEach(([id, type, ech, back]) => { const t = type === "artillery" ? T_GUNS + 0.35 + (id === "lg5" ? 0.3 : 0) : 0;
  UNIT(id, "british", at_d(D0 - back), type, { ech, t });
  const pts = []; for (let k = 0; k <= 24; k++) pts.push(at_d(D0 - back + (D1 - D0) * k / 24));
  march(id, pts, TR0 + (t ? t + 0.6 : 0.1), TR1 - (t ? t + 0.6 : 0.1), { trail: false, dustOp: 0.4, dustSize: 46 }); });
const TB = BANNER("tarleton", "Banastre Tarleton", "gb", "lg1", T_TARL + 0.25, { side: "se" });
pulse("lg1", T_CAV + 0.05); pulse("lg2", T_CAV + 0.2); pulse("lg3", T_LI + 0.1);
// Waxhaws + Fishing Creek: both lie north of this map (the stamps sit at the top edge, above the Camden road)
stampP("WAXHAWS", 1180, 110, T_WAX + 0.05, T_FISH + 1.9, 30);
stampP("FISHING CREEK", 1000, 235, T_FISH + 0.05, T_SOUTH + 0.6, 30);
// Marion's band at Tearcoat (as m1e left it); "to get at Marion": his banner; "sent him south": a thin red arrow down the road ahead of the column
UNIT("mb", "allies", [1426, 528], "cavalry", { ech: "" });
UNIT("mb2", "allies", [1392, 506], "cavalry", { ech: "" });
SIDEFLAG("sc", [1468, 570]); SIDEFLAG("gb", [300, 230]);
const MB = BANNER("marion", "Francis Marion", "sc", "mb", T_GETM + 0.2, { side: "ne" });
{ const tA = T_SOUTH + 0.2, dH = D0 + (D1 - D0) * (tA - 0.1) / (TR1 - 0.1), pts = []; for (let k = 0; k <= 10; k++) pts.push(at_d(dH + 40 + 330 * k / 10));
  arw({ pts, side: "rome", t: tA, dur: 1.2, width: AW(CS[2], 11) }); }
quote("&ldquo;Marion is cautious and vigilant&rdquo;", "CORNWALLIS TO TARLETON", T_CAUT - 0.1, B.T.paras[P2][0] - 0.1, { col: "#c4121f", size: 52, top: 760, mw: 1100 });
// ---------------------------------------------------------------------------------------------------------------------------------
// m2-2: "stand and fight in the open, just once": a red ring closes round Marion; the cavalry pulses; the swamps glow (the answer)
// ---------------------------------------------------------------------------------------------------------------------------------
RING([1410, 520], 330, 120, T_OPEN + 0.05, 1.6, T_PIECES + 1.0);
const RING2 = RING([1410, 520], 120, 62, T_ONCE + 0.05, 0.35, T_PIECES + 1.0); SFX("hit", T_ONCE + 0.3);
tl.to(RING2, { attr: { r: 50 }, duration: 0.25, ease: "power4.in" }, T_PIECES + 0.05); SFX("hit", T_PIECES + 0.25);
["lg1", "lg2"].forEach((id, i) => pulse(id, T_HORSE + 0.1 + i * 0.15));
{ const g = document.createElement("div");   // the cypress swamp mask, tinted pale green-cyan, faint
  g.style.cssText = `position:absolute;left:0;top:0;width:2880px;height:1620px;pointer-events:none;background:rgba(170,235,210,1);-webkit-mask-image:url(assets/blackriver_m_swamp.png);mask-image:url(assets/blackriver_m_swamp.png);-webkit-mask-size:100% 100%;mask-size:100% 100%;opacity:0`;
  WORLD.insertBefore(g, OVL);
  tl.to(g, { opacity: 0.26, duration: 1.0, ease: "sine.inOut" }, T_BAND - 0.1); tl.to(g, { opacity: 0.12, duration: 0.8, yoyo: true, repeat: 1, ease: "sine.inOut" }, T_BAND + 1.0);
  tl.to(g, { opacity: 0, duration: 1.2 }, T_NIGHT + 0.2); }
// ---------------------------------------------------------------------------------------------------------------------------------
// m2-3: night of 7 Nov; Marion rides down from Tearcoat and west along the Benbow's road toward the house
// ---------------------------------------------------------------------------------------------------------------------------------
LIGHT("night", T_7 - 0.4, 2.2, 0.85);
const RBR = GD.bake.roads.find((r) => r.id === "benbow_richardson").paths[0];   // Benbow's (east) -> Richardson's (west)
const ROX = GD.bake.roads.find((r) => r.id === "ox_north").paths[0];             // the Ox Swamp junction -> north
const jOX = ROX.reduce((b, q, i) => (Math.abs(q[1] - 528) < Math.abs(ROX[b][1] - 528) ? i : b), 0);
const iJ = RBR.reduce((b, q, i) => (Math.hypot(q[0] - ROX[0][0], q[1] - ROX[0][1]) < Math.hypot(RBR[b][0] - ROX[0][0], RBR[b][1] - ROX[0][1]) ? i : b), 0);
const iHL = RBR.reduce((b, q, i) => (Math.abs(q[0] - HALT[0]) < Math.abs(RBR[b][0] - HALT[0]) ? i : b), 0);
const DOWN = [[1426, 528], ROX[jOX], ...ROX.slice(0, jOX).reverse(), ...RBR.slice(iJ, iHL + 1)];
const tM0 = T_PIECES + 0.9, tM1 = T_LIGHT + 0.1;
hideU(["mb2"], tM0 - 0.2);
march("mb", DOWN, tM0, tM1 - tM0, { trail: false, dust: false });
// the Legion settles round the house (the trap), dark (unseen) until "were waiting at the plantation"
const TRAP = { lg1: [470, 905], lg2: [492, 1052], lg3: [360, 930], lg4: [486, 978], lg5: [372, 1040] };
Object.entries(TRAP).forEach(([id, p]) => { const u = B.units[id], x0 = u.x, y0 = u.y;
  march(id, [at_d(D1 - COL.find((c) => c[0] === id)[3]), p], TR1 + 0.1, 2.4, { trail: false, dust: false });
  tl.to(u.el, { opacity: 0.28, duration: 1.2 }, T_LIGHT - 0.6); tl.to(u.el, { opacity: 1, duration: 0.5 }, T_WAIT + 0.1); pulse(id, T_WAIT + 0.15 + 0.08 * Object.keys(TRAP).indexOf(id)); });
// Tarleton's banner rides on, dims with the Legion; the stake goes west-north of the house (off the glow)
tl.to(TB, { opacity: 0.35, duration: 1.2 }, T_LIGHT - 0.6); tl.to(TB, { opacity: 1, duration: 0.5 }, T_WAIT + 0.1);
// "a great light in the sky": the glow over the house (big, warm, flickering), then "General Richardson": label
const GLOW = fireGlow(HOUSE[0], HOUSE[1] - 10, 80, T_LIGHT + 0.05, null);
GLOW.firstElementChild.style.filter = "brightness(1.35)";
const GLOW2 = fireGlow(HOUSE[0], HOUSE[1] - 4, 30, T_LIGHT + 0.35, null);
PLACE_LABEL("Richardson's", HOUSE, T_RICH + 0.4, { dy: 150, size: 26 });
// "Then a rider came in out of the dark": one small blue rider gallops in from the south-west dark to Marion's box
UNIT("rd", "allies", [560, 1110], "cavalry", { ech: "", t: T_RIDER + 0.1 });
march("rd", [[560, 1110], [600, 1030], [632, 962]], T_RIDER + 0.4, 1.5, { trail: false, dust: false });
const BIG = (id) => { const b = B.units[id].el.querySelector(".blk"); gsap.set(b, { scale: 1.45, filter: "drop-shadow(0 0 6px rgba(236,242,255,.85))" }); return b; };   // critic r2: reads at night, phone size
{ const b = BIG("rd"); tl.fromTo(b, { filter: "drop-shadow(0 0 6px rgba(236,242,255,.85))" }, { filter: "drop-shadow(0 0 16px #9fc0ff)", duration: 0.4, yoyo: true, repeat: 3, immediateRender: false }, T_SON); }
hideU(["rd"], T_TWICE - 0.3);
// card on the spoken words: AT LEAST TWICE HIS NUMBERS / TWO FIELD GUNS
{ const C = scr0(`<div style="padding:16px 46px 18px;background:rgb(18,16,12);border-top:6px solid #c4121f;font-family:Oswald;font-weight:700;color:#f7f3ea;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,.55)">
    <div style="font-size:19px;letter-spacing:.32em;color:#ff8a80">AT THE PLANTATION</div><div class="a" style="font-size:52px;letter-spacing:.06em;margin-top:4px">AT LEAST TWICE HIS NUMBERS</div>
    <div class="b" style="font-size:44px;letter-spacing:.06em;color:#ffd9a0;margin-top:2px">TWO FIELD GUNS</div></div>`, "left:0;right:0;top:150px;display:flex;justify-content:center;");
  const b = C.querySelector(".b"); gsap.set(b, { autoAlpha: 0 });
  tl.fromTo(C, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out", immediateRender: false }, T_TWICE - 0.05); SFX("hit", T_TWICE + 0.1);
  tl.fromTo(b, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.35, immediateRender: false }, T_2G + 0.05); SFX("tick", T_2G + 0.1);
  ["lg4", "lg5"].forEach((id, i) => pulse(id, T_2G + 0.15 + i * 0.15, 1.35));
  tl.to(C, { autoAlpha: 0, duration: 0.35 }, Math.min(T_2G + 3.0, T_DES - 0.1)); }
// "one of Marion's own men had deserted to guide them": a blue dot leaves the band, turns red, walks to the Legion
{ const P0 = [HALT[0] - 6, HALT[1] + 40];   // critic r2: unit-size box (the dot was too small at night): leaves the band blue, turns red, walks to the Legion
  UNIT("ds", "allies", P0, "cavalry", { ech: "", t: T_DES + 0.1 }); BIG("ds"); march("ds", [P0, [P0[0] - 40, P0[1] + 4]], T_DES + 0.5, 0.5, { trail: false, dust: false }); hideU(["ds"], T_DES + 1.0);
  const Q0 = [P0[0] - 40, P0[1] + 4]; UNIT("dr", "british", Q0, "cavalry", { ech: "", t: T_DES + 1.0 }); BIG("dr");
  march("dr", [Q0, [560, 970], [520, 958]], T_DES + 1.4, 2.2, { trail: false, dust: false }); hideU(["dr"], T_GUIDE + 2.2); }
// ---------------------------------------------------------------------------------------------------------------------------------
// m2-4: the decision card (each option on its own spoken words; B revealed on the m2-5 start); the glow keeps flickering behind
// ---------------------------------------------------------------------------------------------------------------------------------
const DC = E.decide({ sub: "RICHARDSON'S · THE NIGHT OF 7 NOVEMBER", a: "ATTACK IN THE DARK", b: "VANISH INTO THE SWAMP", real: 1, t: T_PUT - 0.1, tCount: T_TELL + 0.2, tReveal: T_P5 + 0.25, until: T_P5 + 2.6 });
{ const os = [DC.querySelector(".o0"), DC.querySelector(".o1")];
  os.forEach((o) => tl.getTweensOf(o).filter((tw) => tw.startTime() < T_PUT + 1.5).forEach((tw) => tw.kill()));
  gsap.set(os, { autoAlpha: 0 });
  tl.fromTo(os[0], { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.4, immediateRender: false }, T_HIT + 0.1); SFX("tick", T_HIT + 0.15);
  tl.fromTo(os[1], { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.4, immediateRender: false }, T_VAN + 0.6); SFX("tick", T_VAN + 0.65);
  // "three night attacks in a row": three small crossed-sabre marks tick in under the title
  const row = document.createElement("div"); row.style.cssText = "display:flex;justify-content:center;gap:26px;margin:-10px 0 18px";
  const SAB = `<svg width="76" height="64" viewBox="-20 -17 40 34" style="display:block;overflow:visible"><path d="M2 -12.8 A13 13 0 1 0 2 12.8 A10 10 0 1 1 2 -12.8 Z" fill="#e3d3a6"/><g transform="translate(11 2)"><circle r="4.2" fill="#fff3c4"/><g stroke="#ff9a2e" stroke-width="2.2" stroke-linecap="round">${[0, 45, 90, 135, 180, 225, 270, 315].map((r) => `<line x1="6" y1="0" x2="${r % 90 ? 9.5 : 12}" y2="0" transform="rotate(${r})"/>`).join("")}</g></g></svg>`;   // critic r2: a night strike (moon + muzzle burst, no star), not a "wrong" tick
  for (let k = 0; k < 3; k++) { const s = document.createElement("div"); s.innerHTML = SAB; row.appendChild(s); gsap.set(s, { autoAlpha: 0 });
    tl.fromTo(s, { autoAlpha: 0, scale: 1.8 }, { autoAlpha: 1, scale: 1, duration: 0.22, ease: "power4.in", immediateRender: false }, T_3N + 0.3 + k * 0.45); SFX("tick", T_3N + 0.5 + k * 0.45); }
  DC.children[1].after(row);
  os.forEach((o) => { o.children[1].style.fontSize = "48px"; o.children[1].style.whiteSpace = "nowrap"; }); }
SCN.insertBefore(document.getElementById("date"), document.getElementById("credit"));   // the date scroll stays above the decision card's dim layer
// "The enemy is somewhere around that fire": the glow swells behind the card
tl.to(GLOW.firstElementChild, { scale: 1.3, duration: 1.2, ease: "sine.inOut" }, T_FIRE);
{ const [cx, cy, cs] = CAM_AT(T_FIRE + 0.5), x = 960 + (HOUSE[0] - cx) * cs, y = 540 + (HOUSE[1] - 10 - cy) * cs;   // critic r2: the fire flares up behind the card (above its dim layer, below the card)
  const F = document.createElement("div"); F.style.cssText = `position:absolute;left:${x - 330}px;top:${y - 330}px;width:660px;height:660px;border-radius:50%;pointer-events:none;background:radial-gradient(circle,rgba(255,200,90,.75) 0%,rgba(255,120,30,.45) 30%,rgba(200,50,0,.18) 55%,rgba(120,20,0,0) 72%);mix-blend-mode:screen`;
  SCN.insertBefore(F, DC); gsap.set(F, { autoAlpha: 0 });
  tl.fromTo(F, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.8, ease: "power2.out", immediateRender: false }, T_FIRE + 0.1);
  tl.to(F, { scale: 1.1, autoAlpha: 0.7, duration: 0.5, yoyo: true, repeat: 3, ease: "sine.inOut" }, T_FIRE + 0.9);
  tl.to(F, { autoAlpha: 0.35, duration: 1.0 }, T_HIT - 0.2); tl.to(F, { autoAlpha: 0, duration: 0.6 }, T_P5 + 2.0);
  // "And then listen to what Marion did": the card's title pulses (and the B option, still undecided, breathes once)
  const ti = DC.children[1]; tl.fromTo(ti, { scale: 1 }, { scale: 1.07, duration: 0.3, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, T_LISTEN + 0.1); SFX("tick", T_LISTEN + 0.15);
  tl.to(F, { autoAlpha: 0.8, duration: 0.4, yoyo: true, repeat: 1 }, T_LISTEN + 0.8); }
// ---------------------------------------------------------------------------------------------------------------------------------
// m2-5: he turns back east into the Woodyard swamp, over the mill dam on Jack's Creek; the trap closes on nothing; the house burns
// ---------------------------------------------------------------------------------------------------------------------------------
UNIT("mb3", "allies", [HALT[0] + 40, HALT[1] + 4], "cavalry", { ech: "", t: T_P5 - 0.6 });   // the band (two boxes) for the night march
const OUT = [HALT, [690, 958], [712, 1000], [700, 1050], [680, 1100], DAM, [690, 1176]];
const OUT2 = [[HALT[0] + 40, HALT[1] + 4], [712, 980], [722, 1020], [706, 1066], [684, 1108], [664, 1138]];
march("mb", OUT, T_TURN + 0.2, T_SIX + 0.6 - T_TURN, { trail: false, dust: false });
march("mb3", OUT2, T_TURN + 0.6, T_SIX + 0.8 - T_TURN, { trail: false, dust: false });
{ const p = document.createElementNS(NS, "ellipse");   // the Woodyard: a dark wet patch on the marsh ground (cypress swamp look, live)
  Object.entries({ cx: WOODY[0] - 6, cy: WOODY[1] + 4, rx: 70, ry: 44, fill: "rgba(14,32,30,0.62)", opacity: 0 }).forEach(([k, v]) => p.setAttribute(k, v));
  p.style.filter = "blur(7px)"; OVL.insertBefore(p, OVL.firstChild); tl.to(p, { opacity: 1, duration: 1.0 }, T_WOOD - 0.3);
  [[676, 1012], [712, 1034], [694, 1000], [728, 1018], [666, 1038]].forEach(([x, y], i) => { const g = document.createElementNS(NS, "line");
    Object.entries({ x1: x - 5, y1: y, x2: x + 5, y2: y, stroke: "#bfe0e4", "stroke-width": 1.4, "stroke-linecap": "round", opacity: 0 }).forEach(([k, v]) => g.setAttribute(k, v)); OVL.appendChild(g);
    tl.to(g, { opacity: 0.55, duration: 0.6 }, T_WOOD + 0.2 + i * 0.1); tl.to(g, { opacity: 0.25, duration: 1.4, yoyo: true, repeat: 5, ease: "sine.inOut" }, T_WOOD + 1.0 + i * 0.3); }); }
PLACE_LABEL("Woodyard swamp", WOODY, T_WOOD + 0.25, { dy: 40, size: 22 });
// "the most profound darkness": the night deepens; verbatim caption
LIGHT0("night", T_DARK, 1.6, 1.0);
quote("&ldquo;&hellip;the most profound darkness&rdquo;", "ONE OF MARION'S MEN", T_DARK + 0.05, Math.min(T_DARK + 3.3, T_DAM - 0.15), { size: 44, top: 150, mw: 1000 });
// "a mill dam on Jack's Creek": the dam bar across the creek head + label; the band crosses it
{ const g = pinS(GG.pin(`<svg width="40" height="18" viewBox="-20 -9 40 18" style="display:block;overflow:visible;filter:drop-shadow(0 1px 2px rgba(0,0,0,.8))"><g transform="rotate(-20)"><rect x="-17" y="-3.5" width="34" height="7" rx="1.5" fill="#8a6a44" stroke="#2a2014" stroke-width="1.6"/><path d="M-14 -3.5 V3.5 M-6 -3.5 V3.5 M2 -3.5 V3.5 M10 -3.5 V3.5" stroke="#2a2014" stroke-width="1"/></g></svg>`, DAM[0], DAM[1], { t: T_DAM + 0.1, pop: true })); }
PLACE_LABEL("Jack's Creek", DAM, T_JACK + 0.1, { dx: -100, dy: -6, size: 22 });
quote("&ldquo;Now we are safe!&rdquo;", "MARION", T_SAFE - 0.05, Math.min(T_SAFE + 3.0, T_TRAP - 0.15), { size: 52, top: 150, mw: 900 });
// "When Tarleton's trap was sprung, it closed on nothing": dawn; the Legion rides in on the empty wood; a red ring closes on nothing
LIGHT("morning", T_TRAP - 0.2, 2.6);
Object.entries({ lg1: [[470, 905], [536, 902]], lg2: [[492, 1052], [612, 990]], lg3: [[360, 930], [470, 925], [604, 948]], lg4: [[486, 978], [560, 966]] })
  .forEach(([id, pts], i) => march(id, pts, T_TRAP + 0.2 + i * 0.12, 2.2, { trail: i < 2, dust: true, dustOp: 0.4, dustSize: 20 }));
RING(HALT, 120, 26, T_TRAP + 0.6, 1.8, T_NOTH + 2.4);
// "In his anger, Tarleton burned the Richardson house to the ground": fire mark + smoke column on the house (the night glow gone at dawn)
tl.to([GLOW, GLOW2], { autoAlpha: 0, duration: 1.5 }, T_TRAP + 0.2);
const BURN = fireGlow(HOUSE[0], HOUSE[1] - 6, 38, T_BURN + 0.1, null);
{ const fl = pinS(GG.pin(`<svg width="44" height="52" viewBox="-11 -16 22 26" style="display:block;overflow:visible;filter:drop-shadow(0 0 6px rgba(255,140,40,.9))"><path d="M0 -15 C6 -7 9 -2 7 4 C5 9 -5 9 -7 4 C-9 -2 -4 -6 -2 -11 C-1 -6 1 -4 2 -6 C3 -9 1 -12 0 -15 Z" fill="#ff8a1e" stroke="#7a1d05" stroke-width="1.2"/><path d="M0 -6 C3 -2 4 1 2 4 C0 6 -3 5 -3 2 C-3 -1 -1 -3 0 -6 Z" fill="#ffe08a"/></svg>`, HOUSE[0], HOUSE[1] - 4, { t: T_BURN + 0.05, pop: true }));
  tl.to(fl.querySelectorAll("path"), { scaleY: 1.15, duration: 0.3, yoyo: true, repeat: 20, ease: "sine.inOut", transformOrigin: "50% 100%" }, T_BURN + 0.6); SFX("hit", T_BURN + 0.25); }
smoke([[HOUSE[0], HOUSE[1] - 14], [HOUSE[0] + 4, HOUSE[1] - 26], [HOUSE[0] + 8, HOUSE[1] - 38], [HOUSE[0] + 12, HOUSE[1] - 50]], T_BURN + 0.4, 1.4);
if (GD.var.audit) LABEL_AUDIT([2, 10, 20, 30, 45, 60, 95, 105], { show: true });
