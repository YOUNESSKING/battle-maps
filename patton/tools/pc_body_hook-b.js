// HOOK-B (hook-3 .. hook-4), George S. Patton #15. THE LOCKED HOOK (STYLE_LOCK 1a: twist as action, name slam + 3 snap cuts + title).
// Map agent C. Built with: python3 tools/pc_inline.py hook-b europe_hd_lift hook-3 hook-4
// World = the `europe` map px (z7, the relief); three close maps (avranches z12, bastogne z11, oppenheim z13) are full-size layers at the
// world origin, each shown only inside its snap cut (a black frame hides every camera jump); the final pull-out is the europe map
// (option 1, 22-24 Mar 1945: tools/pc_make_control.py) with the three numbered rings and the title card.
// hook-3 (twist, hard cut to dark): the calendar rolls back 26 -> 19 DEC 1944; the "?" badge; the Verdun room (a freezing French army
//   barracks, one small coal stove; designed card, not a map) + the VERDUN locator card; one stamp per spoken detail (hit + small shake +
//   red pulse): A FREEZING BARRACKS / A COAL STOVE TOO SMALL / EISENHOWER: HOW SOON? / 22 DECEMBER (the calendar runs on) / THREE
//   DIVISIONS (4th Armd, 26th, 80th chips); the verbatim line "Some people thought I was boasting." (War As I Knew It, FACTCHECK_B).
// hook-4: the "?" becomes the real photo, GEORGE S. PATTON slams; cuts: 1 AVRANCHES 1944 (blue columns through the one highway, option 2
//   front of map agent A), 2 BASTOGNE 1944 (4th Armored tanks race up the road through Assenois into the town, option 2, 26 Dec),
//   3 THE RHINE 1945 (night, boats paddle over from Nierstein, MG fire; Montgomery badge on "a day before Montgomery"); pull-out to the
//   europe map (three rings), title card (riser + boom).
// OPENING v2 (2026-10-31, owner rule: stay in the story): hook-3 now starts with ~9 s IN THE DANGER on the Bastogne map (ring tightens, white-flag
//   surrender demand 22 DEC, the answer 'ONE WORD' without showing it), THEN the hard cut to dark + calendar (22 -> 19 DEC) + the Verdun room.
//   hook-4 adds 'Even he had misjudged the attack at first.' (Patton's 17 Dec diary) after the name slam; the plate no longer shows birth years.
// @@KIT
// @@DATA
const go = (id, t, dur, p, ease) => B.move(id, t, dur, p[0], p[1], ease || "power1.inOut");
const H3 = "hook-3", H4 = "hook-4", S4 = B.P(H4);
const T_ROOM = at(H3, "days earlier"), T_PROM = at(H3, "promise"), T_FREEZ = at(H3, "freezing"), T_VERD = at(H3, "Verdun,"), T_COAL = at(H3, "coal stove"),
  T_SMALL = at(H3, "too small"), T_IKE = at(H3, "Dwight Eisenhower"), T_SOON = at(H3, "how soon"), T_SAID = at(H3, "The general said"), T_22 = at(H3, "December twenty-second"),
  T_3DIV = at(H3, "three divisions"), T_WROTE = at(H3, "He wrote"), T_SOME = at(H3, "some thought"), T_BOAST = at(H3, "boasting");
const T_NAME = at(H4, "George S. Patton,"), T_BROKE = at(H4, "He broke out"), T_FRANCE = at(H4, "across France"), T_NORTH = at(H4, "He turned north"),
  T_RELV = at(H4, "relieved Bastogne"), T_RHINE = at(H4, "And he crossed"), T_DARK = at(H4, "in the dark"), T_MONTY = at(H4, "a day before Montgomery"),
  T_THESE = at(H4, "These are"), T_GREAT = at(H4, "three greatest");
const T_CLOSE = at(H3, "surrounded"), T_DEM = at(H3, "demanded"), T_ANS = at(H3, "The answer"), T_WORD = at(H3, "single word");
const TD0 = T_ROOM - 0.1;   // hard cut to dark
const T_MIS = at(H4, "even he");
// ---------- projections ----------
const EU = GG.proj(7, 15217, 10331), AVP = GG.proj(12, 518886, 360710), BAP = GG.proj(11, 269078, 177338), OPP = GG.proj(13, 1095661, 711514);
// ---------- the three close maps (full-size layers at the world origin), hidden until their cut ----------
const layer = (src) => { const g = document.createElement("div"); g.style.cssText = "position:absolute;left:0;top:0;width:2880px;height:1620px;isolation:isolate;";
  const i = document.createElement("img"); i.src = src; i.alt = ""; i.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;"; g.appendChild(i);
  WORLD.insertBefore(g, OVL); gsap.set(g, { autoAlpha: 0 }); return g; };
const ECTL = ctlImg("assets/media/pc_eur_ctl_mar45_mx.png", 0, null, 0.01);
const LAV = layer("assets/media/pc_avr_relief.jpg"), LBA = layer("assets/media/pc_bas_relief.jpg"), LOP = layer("assets/media/pc_opp_relief.jpg");
const LV = LivingK(B); const NA = LV.north(); gsap.set(NA, { autoAlpha: 0 });
// ---------- camera (all maps are 2880 x 1620: clamp inside) ----------
const cam = { cx: 1440, cy: 810, s: 1 };
const applyCam = () => { const s = Math.max(cam.s, 1920 / 2880), cx = Math.min(Math.max(cam.cx, 960 / s), 2880 - 960 / s), cy = Math.min(Math.max(cam.cy, 540 / s), 1620 - 540 / s);
  gsap.set(WORLD, { x: 960 - cx * s, y: 540 - cy * s, scale: s }); CAM_S = s; setInv(); };
const camTo = (t, dur, c, s, ease = "sine.inOut") => tl.to(cam, { cx: c[0], cy: c[1], s, duration: Math.max(dur, 0.01), ease, onUpdate: applyCam }, t);
applyCam();
const scr0 = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; SCN.insertBefore(el, document.getElementById("credit")); GG.hide(el); return el; };
// red edge pulse
const RED = scr0("", "inset:0;background:radial-gradient(ellipse at center, rgba(200,20,30,0) 40%, rgba(200,20,30,0.45) 100%);");
const pulse = (t) => { tl.fromTo(RED, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06, immediateRender: false }, t); tl.to(RED, { autoAlpha: 0, duration: 0.5 }, t + 0.08); };
// =====================================================================================================================
// hook-3: hard cut to dark (frame 0), the calendar rolls back, the Verdun room, one stamp per detail
// =====================================================================================================================
const DK = document.createElement("div"); DK.style.cssText = "position:absolute;inset:0;background:#05070d;"; SCN.insertBefore(DK, document.getElementById("credit")); gsap.set(DK, { autoAlpha: 0 }); tl.set(DK, { autoAlpha: 1 }, TD0 - 0.01);
const CAL = scr0(`<div style="text-align:center;font-family:Oswald;font-weight:700"><div class="k" style="font-size:22px;letter-spacing:0.4em;color:#c9b48a">THREE DAYS EARLIER</div><div class="y" style="font-size:120px;line-height:1;color:#f7f3ea;letter-spacing:0.05em">22 DEC</div><div style="font-size:30px;letter-spacing:0.4em;color:#c9b48a">1944</div></div>`,
  "left:0;right:0;top:250px;display:flex;justify-content:center;transform-origin:50% 0%;");
tl.fromTo(CAL, { autoAlpha: 0, scale: 1.3 }, { autoAlpha: 1, scale: 1, duration: 0.22, ease: "power3.out", immediateRender: false }, TD0 + 0.02);
SFX("hit", TD0 + 0.05);
const ye = CAL.querySelector(".y"), DAYS = ["22 DEC", "21 DEC", "20 DEC", "19 DEC"];
const dv = { v: 0 }; tl.to(dv, { v: 3, duration: 0.9, ease: "none", onUpdate: () => { ye.textContent = DAYS[Math.round(dv.v)]; } }, TD0 + 0.25);
for (let k = 1; k < 4; k++) SFX("tick", TD0 + 0.25 + (k - 0.5) * 0.3);
const TUP = T_PROM - 0.2;
tl.to(CAL, { top: 26, scale: 0.42, duration: 0.45, ease: "power3.inOut" }, TUP);
// the room: a long table, chairs, a frosted window, one small coal stove (designed card, not a map)
const ROOM = scr0(`<div style="position:relative;width:1920px;height:1080px;background:radial-gradient(ellipse 70% 60% at 50% 60%, #151b26, #05070d)">
  <div class="win" style="position:absolute;left:1260px;top:250px;width:260px;height:300px;border:10px solid #2a3140;background:linear-gradient(180deg,#1f3346,#0f1a26);box-shadow:inset 0 0 40px rgba(220,235,255,.25)">
    <div style="position:absolute;left:115px;top:0;width:10px;height:100%;background:#2a3140"></div><div style="position:absolute;left:0;top:140px;width:100%;height:10px;background:#2a3140"></div>
    <div class="frost" style="position:absolute;inset:0;background:radial-gradient(circle at 20% 20%, rgba(235,245,255,.75), rgba(235,245,255,0) 45%),radial-gradient(circle at 85% 80%, rgba(235,245,255,.7), rgba(235,245,255,0) 45%),radial-gradient(circle at 80% 15%, rgba(235,245,255,.55), rgba(235,245,255,0) 40%)"></div></div>
  <div style="position:absolute;left:380px;top:640px;width:900px;height:44px;background:#3a2c1f;border:3px solid #5a4632;border-radius:4px"></div>
  ${[440, 600, 760, 920, 1080].map((x) => `<div style="position:absolute;left:${x}px;top:590px;width:60px;height:56px;background:#1b1f28;border:3px solid #2e3442;border-radius:8px 8px 0 0"></div>`).join("")}
  <div style="position:absolute;left:400px;top:684px;width:12px;height:110px;background:#5a4632"></div><div style="position:absolute;left:1248px;top:684px;width:12px;height:110px;background:#5a4632"></div>
  <div class="stove" style="position:absolute;left:1580px;top:610px;width:120px;height:190px">
    <div style="position:absolute;left:44px;top:-180px;width:28px;height:200px;background:#20242c;border:3px solid #39404d"></div>
    <div style="position:absolute;left:10px;top:20px;width:100px;height:150px;border-radius:14px;background:#20242c;border:4px solid #39404d"></div>
    <div class="fire" style="position:absolute;left:36px;top:96px;width:48px;height:30px;border-radius:6px;background:radial-gradient(circle,#ffb347,#c4421f 60%,#3a1408)"></div>
    <div class="glow" style="position:absolute;left:-60px;top:20px;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle, rgba(255,150,60,.35), rgba(255,150,60,0) 65%)"></div></div>
  <div style="position:absolute;left:0;right:0;top:800px;height:280px;background:linear-gradient(180deg,#0b0e14,#05070d)"></div></div>`, "left:0;top:0;");
SCN.insertBefore(ROOM, CAL);
tl.fromTo(ROOM, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, immediateRender: false }, TUP + 0.1);
const FIRE = ROOM.querySelector(".fire"), GLW = ROOM.querySelector(".glow");
tl.fromTo(GLW, { opacity: 0.6 }, { opacity: 1, duration: 0.25, yoyo: true, repeat: 60, ease: "sine.inOut", immediateRender: false }, TUP + 0.2);
// cold breath / frost drifting across the room
for (let k = 0; k < 7; k++) { const f = document.createElement("div"); f.style.cssText = `position:absolute;left:${200 + k * 230}px;top:${300 + (k % 3) * 120}px;width:220px;height:120px;border-radius:50%;background:radial-gradient(ellipse, rgba(220,232,250,.10), rgba(220,232,250,0) 70%)`; ROOM.firstElementChild.appendChild(f);
  tl.fromTo(f, { x: 0, y: 0 }, { x: 80, y: -30, duration: 18, ease: "none", immediateRender: false }, TUP); }
// the "?" badge: the man who made the promise (the name comes in hook-4)
const BDG = scr0(`<div style="display:flex;flex-direction:column;align-items:center;gap:14px">
  <div style="position:relative;width:250px;height:250px;border-radius:50%;overflow:hidden;border:8px solid #f3e7c4;box-shadow:0 0 0 6px #1f4fc4,0 20px 40px rgba(0,0,0,0.75);background:url(${FL.us}) center/cover"><img src="${PHOTO("patton")}" style="position:absolute;left:0;right:0;bottom:0;margin:auto;height:112%;filter:grayscale(1) contrast(1.1)">
  <div class="q" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle, rgba(10,12,24,1), rgba(10,12,24,0.94));font-family:Oswald;font-weight:700;font-size:150px;color:#f7f3ea">?</div></div>
  <div class="pl" style="padding:10px 34px 12px;background:rgba(18,16,12,0.94);border-top:6px solid #1f4fc4;color:#f7f3ea;font-family:Oswald;font-weight:700;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.6)"><div class="nm" style="font-size:30px;letter-spacing:0.2em">THIRD ARMY</div><div class="rl" style="font-size:19px;letter-spacing:0.22em;color:#d8cfb8">ITS GENERAL: ?</div></div></div>`,
  "left:120px;top:250px;transform-origin:50% 30%;");
tl.fromTo(BDG, { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(1.6)", immediateRender: false }, T_ROOM + 0.3); SFX("ref:pop", T_ROOM + 0.35);
// the Verdun locator (designed card: a crop of the europe relief with the place dot; not a map shot)
const [vx, vy] = EU(49.16, 5.38), [bx, by] = EU(50.002, 5.717), CS = 1.25, CW0 = 520, CH0 = 300, ox = vx - CW0 / 2 / CS, oy = vy - CH0 * 0.6 / CS;
const LOC = scr(`<div style="position:relative;width:${CW0}px;height:${CH0}px;border-radius:12px;overflow:hidden;border:2px solid rgba(201,180,138,0.7);box-shadow:0 20px 40px rgba(0,0,0,.7);background:#06080e">
  <img src="assets/relief.jpg" style="position:absolute;left:${(-ox * CS).toFixed(1)}px;top:${(-oy * CS).toFixed(1)}px;width:${2880 * CS}px;height:${1620 * CS}px;filter:brightness(.55) saturate(.6)">
  <div style="position:absolute;left:${((bx - ox) * CS - 6).toFixed(1)}px;top:${((by - oy) * CS - 6).toFixed(1)}px;width:12px;height:12px;border-radius:50%;background:#f7f3ea"></div>
  <div style="position:absolute;left:${((bx - ox) * CS + 12).toFixed(1)}px;top:${((by - oy) * CS - 16).toFixed(1)}px;font-family:Oswald;font-weight:700;font-size:20px;letter-spacing:.14em;color:#d8cfb8;text-shadow:0 2px 4px #000">BASTOGNE</div>
  <div class="dot" style="position:absolute;left:${(CW0 / 2 - 11).toFixed(1)}px;top:${(CH0 * 0.6 - 11).toFixed(1)}px;width:22px;height:22px;border-radius:50%;background:#ffd54a;box-shadow:0 0 18px #ffd54a,0 0 0 4px rgba(10,12,16,.8)"></div>
  <div style="position:absolute;left:${(CW0 / 2 + 22).toFixed(1)}px;top:${(CH0 * 0.6 - 4).toFixed(1)}px;font-family:Oswald;font-weight:700;color:#f7f3ea;text-shadow:0 2px 6px #000"><div style="font-size:34px;letter-spacing:.12em">VERDUN</div><div style="font-size:17px;letter-spacing:.24em;color:#c9b48a">FRANCE · 19 DEC 1944 · 11:00</div></div></div>`,
  "right:90px;top:150px;", T_VERD - 0.25, T_IKE - 0.2, { autoAlpha: 0, x: 80 });
SFX("ref:pop", T_VERD - 0.2);
tl.fromTo(LOC.querySelector(".dot"), { scale: 0 }, { scale: 1, duration: 0.3, ease: "back.out(2.5)", immediateRender: false }, T_VERD); SFX("hit", T_VERD + 0.05);
// one stamp per spoken detail (hit + small shake + red pulse); each replaces the last (C2)
const STAMPS = [];
const sst = (txt, t, until, o = {}) => { pulse(t + 0.22); const el = scr(stampHTML(txt, o.color || "#e3232f", o.size || 66, o.rot || -4, o.sub), `left:0;right:0;top:${o.top || 820}px;display:flex;justify-content:center;`, t, null, { autoAlpha: 0 });
  STAMPS.push(el); return slam(el, t, { shake: 4, until }); };
sst("A FREEZING BARRACKS", T_FREEZ - 0.05, T_COAL - 0.15, { sub: "A FRENCH ARMY BARRACKS · VERDUN" });
tl.to(ROOM.querySelector(".frost"), { opacity: 1.6, scale: 1.05, duration: 0.6 }, T_FREEZ);
sst("A COAL STOVE TOO SMALL", T_COAL + 0.1, T_IKE - 0.15, { sub: "COATS KEPT ON" });
tl.to(ROOM.querySelector(".stove"), { scale: 1.12, duration: 0.25, yoyo: true, repeat: 1 }, T_SMALL); tl.to(GLW, { scale: 0.7, duration: 0.6 }, T_SMALL);
// Eisenhower: no licensed photo in the kit -> initials (DDE)
const IKE = badge({ name: "DWIGHT D. EISENHOWER", role: "SUPREME COMMANDER", photo: null, flag: FL.us, side: "carth", corner: "tr", initials: "DDE", t: T_IKE - 0.2, until: T_WROTE - 0.2 });
sst("EISENHOWER: HOW SOON?", T_SOON - 0.1, T_22 - 0.4, { size: 70 });
// "the morning of December twenty-second": the calendar runs on, the badge pulses
tl.to(BDG, { scale: 1.1, duration: 0.25, yoyo: true, repeat: 1 }, T_SAID); SFX("ref:pop", T_SAID + 0.05);
const DAYS2 = ["19 DEC", "20 DEC", "21 DEC", "22 DEC"], dv2 = { v: 0 };
tl.to(dv2, { v: 3, duration: 0.7, ease: "none", immediateRender: false, onUpdate: () => { ye.textContent = DAYS2[Math.round(dv2.v)]; } }, T_22 - 0.3);
for (let k = 1; k < 4; k++) SFX("tick", T_22 - 0.3 + (k - 0.5) * 0.23);
tl.to(CAL.querySelector(".k"), { autoAlpha: 0, duration: 0.2 }, T_22 - 0.3);
sst("22 DECEMBER", T_22 + 0.4, T_3DIV - 0.15, { color: "#9fc0ea", size: 84, sub: "THE ATTACK · IN THREE DAYS" });
// "with three divisions": three blue chips + THREE DIVISIONS
const CHIP = (nm, k) => `<div class="c${k}" style="display:flex;align-items:center;gap:10px;padding:8px 18px 8px 10px;background:rgba(18,16,12,0.92);border-left:6px solid #1f4fc4"><img src="${FL.us}" style="height:26px;border:1px solid #f7f3ea"><div style="width:58px;height:38px;background:#1f4fc4;border:3px solid #f7f3ea;display:flex;align-items:center;justify-content:center"><svg width="44" height="26" viewBox="0 0 44 26"><path d="M2 2 L42 24 M42 2 L2 24" stroke="#f7f3ea" stroke-width="3"/>${k === 0 ? '<ellipse cx="22" cy="13" rx="14" ry="7" fill="none" stroke="#f7f3ea" stroke-width="3"/>' : ""}</svg></div><div style="font-family:Oswald;font-weight:700;color:#f7f3ea;font-size:28px;letter-spacing:.1em">${nm}</div></div>`;
const DIVS = scr(`<div style="display:flex;gap:26px">${["4TH ARMORED", "26TH INFANTRY", "80TH INFANTRY"].map(CHIP).join("")}</div>`, "left:0;right:0;top:680px;display:flex;justify-content:center;", T_3DIV - 0.1, T_SOME - 0.4, { autoAlpha: 0 });
[0, 1, 2].forEach((k) => { tl.fromTo(DIVS.querySelector(".c" + k), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.25, immediateRender: false }, T_3DIV + k * 0.22); SFX("hit", T_3DIV + k * 0.22 + 0.1); });
sst("THREE DIVISIONS", T_3DIV + 0.7, T_SOME - 0.4, { color: "#9fc0ea", size: 74 });
// the verbatim line (War As I Knew It)
const QT = scr(`<div style="max-width:1300px;text-align:center;font-family:Oswald;font-weight:700;padding:18px 48px 20px;background:rgba(14,12,10,0.94);border-top:8px solid #c9b48a;color:#f7f3ea;box-shadow:0 18px 40px rgba(0,0,0,.6)"><div style="font-size:64px;letter-spacing:0.03em;line-height:1.1">“SOME PEOPLE THOUGHT I WAS BOASTING.”</div><div style="font-size:21px;letter-spacing:0.24em;color:#c9b48a;margin-top:10px">GEORGE S. PATTON · WAR AS I KNEW IT</div></div>`,
  "left:0;right:0;top:760px;display:flex;justify-content:center;transform-origin:50% 40%;", T_SOME - 0.3, null, { autoAlpha: 0 });
slam(QT, T_SOME - 0.3, { from: 1.6, shake: 4, until: S4 + 0.3 }); pulse(T_BOAST);
tl.to(ROOM, { autoAlpha: 0.45, duration: 0.6 }, T_BOAST - 0.3);
// =====================================================================================================================
// hook-4: the name slam
// =====================================================================================================================
tl.to(CAL, { autoAlpha: 0, duration: 0.3 }, S4 - 0.1);
tl.to(BDG, { x: 715, y: -80, scale: 1.25, duration: 0.5, ease: "power3.inOut" }, S4 + 0.1);
tl.to(ROOM, { autoAlpha: 0.2, duration: 0.5 }, S4 + 0.1);
tl.to(BDG.querySelector(".q"), { autoAlpha: 0, duration: 0.15 }, T_NAME - 0.25); SFX("ref:whoosh", T_NAME - 0.45);
tl.call(() => {}, null, T_NAME);
const PL = BDG.querySelector(".pl");
tl.to(PL, { autoAlpha: 0, duration: 0.1 }, T_NAME - 0.3);
const NAME = scr(`<div style="padding:12px 40px 14px;background:rgba(18,16,12,0.95);border-top:7px solid #1f4fc4;color:#f7f3ea;font-family:Oswald;font-weight:700;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.6)"><div style="font-size:84px;letter-spacing:0.08em;line-height:1.1">GEORGE S. PATTON</div><div style="font-size:24px;letter-spacing:0.24em;color:#d8cfb8">U.S. THIRD ARMY · 1944 - 1945</div></div>`,
  "left:0;right:0;top:560px;display:flex;justify-content:center;transform-origin:50% 40%;", T_NAME - 0.1, null, { autoAlpha: 0 });
slam(NAME, T_NAME - 0.1, { from: 1.9, shake: 6 }); pulse(T_NAME + 0.15);
sst("EVEN HE MISJUDGED IT", T_MIS - 0.05, T_BROKE - 0.3, { size: 60, sub: "HIS OWN DIARY · 17 DEC 1944" });
// hard CUTs: a black frame hides each camera jump (whoosh + hit)
const CUTB = document.createElement("div"); CUTB.style.cssText = "position:absolute;inset:0;background:#030406;"; SCN.insertBefore(CUTB, document.getElementById("credit")); gsap.set(CUTB, { autoAlpha: 0 });
const cut = (t, lay, until, c, s, drift) => {
  tl.fromTo(CUTB, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, immediateRender: false }, t - 0.06); tl.to(CUTB, { autoAlpha: 0, duration: 0.16 }, t + 0.04);
  if (lay) { tl.set(lay, { autoAlpha: 1 }, t - 0.01); tl.set(lay, { autoAlpha: 0 }, until - 0.01); }
  camTo(t, 0.01, c, s); camTo(t + 0.02, until - t - 0.05, [c[0] + drift[0], c[1] + drift[1]], s * (drift[2] || 1.06), "sine.out");
  SFX("ref:whoosh", t - 0.2); SFX("hit", t + 0.02); K.shake(t + 0.02, 3, 0.25); };
const T1 = T_BROKE - 0.1, T2 = T_NORTH - 0.1, T3 = T_RHINE - 0.1, T4 = T_THESE - 0.15;
tl.set([DK, ROOM, BDG, NAME, QT], { autoAlpha: 0 }, T1 - 0.01);
tl.set(NA, { autoAlpha: 1 }, T1);
// the badge returns small in the corner for the cuts
const PB = badge({ name: "GEORGE S. PATTON", role: "U.S. THIRD ARMY", photo: PHOTO("patton"), flag: FL.us, side: "carth", corner: "bl", initials: "GSP", t: T1 + 0.2, until: T4 - 0.1 });
B.showDate(T1); const dates = [["31 JULY 1944", T1, T2], ["26 DECEMBER 1944", T2, T3], ["22 MARCH 1945", T3, T4], ["1944 - 1945", T4, END + 1]];
dates.forEach(([d, a, b]) => { const el = document.createElement("div"); el.className = "d"; el.textContent = d; el.style.fontSize = "32px"; document.getElementById("date").appendChild(el); gsap.set(el, { autoAlpha: 0 }); tl.set(el, { autoAlpha: 1 }, a); if (b < END) tl.set(el, { autoAlpha: 0 }, b - 0.01); });
const LG2 = legend(T1, T4 - 0.01, true); tl.set(LG2, { autoAlpha: 1, y: 0 }, T1);
const ringN = (p, txt, n, t, until, dx, dy) => { K.target(p[0], p[1], t, { r: 34 / CAM_S0, until });
  const el = GG.pin(`<div style="display:flex;align-items:center;gap:8px;font-family:Oswald;font-weight:700;color:#ffd54a;text-shadow:0 2px 4px #000,0 0 3px #000"><span style="display:inline-flex;width:36px;height:36px;border-radius:50%;border:3px solid #ffd54a;align-items:center;justify-content:center;font-size:20px">${n}</span><span style="font-size:34px;letter-spacing:.1em;white-space:nowrap">${txt}</span></div>`, p[0] + dx, p[1] + dy, { t: t + 0.1, pop: true, until });
  pinS(el); SFX("ref:pop", t + 0.12); return el; };
let CAM_S0 = 1;
const PINS = document.getElementById("pins");
const snap = () => new Set([...OVL.children, ...PINS.children]);
const endScope = (s0, until) => { const els = [...OVL.children, ...PINS.children].filter((e) => !s0.has(e) && e.tagName.toLowerCase() !== "defs"); tl.set(els, { autoAlpha: 0 }, until - 0.01); };
const vis = (t0, t1) => (el) => { gsap.set(el, { autoAlpha: 0 }); tl.set(el, { autoAlpha: 1 }, t0); tl.set(el, { autoAlpha: 0 }, t1 - 0.01); return el; };
// ---------- OPENING v2: the first ~9 s of hook-3 stay IN THE DANGER (Bastogne map, 22 Dec 1944) ----------
{
  const BASd = BAP(50.0023, 5.7173), SD = 2.0, END_D = TD0 - 0.05;
  tl.set(LBA, { autoAlpha: 1 }, 0); tl.set(LBA, { autoAlpha: 0 }, TD0 - 0.01);
  cam.cx = BASd[0] + 30; cam.cy = BASd[1] + 15; cam.s = SD; applyCam(); CAM_S0 = SD;
  camTo(TD0 - 0.01, 0.01, [1440, 810], 1); tl.call(() => { CAM_S0 = 1; }, null, TD0);
  [flagS(FL.us, "UNITED STATES", BASd[0] - 330, BASd[1] + 190, 0, END_D), flagS(FL.de, "GERMANY", BASd[0] + 300, BASd[1] - 190, 0, END_D)].forEach(vis(0, END_D + 0.01));
  town("BASTOGNE", BASd, "l", 0, { until: END_D });
  unitS("dp101", "carth", [BASd[0] + 6, BASd[1] - 4], "infantry", "101ST AIRBORNE", { t: 0, until: END_D });
  const RING = [...Array(24)].map((_, k) => [BASd[0] + Math.cos(k / 24 * 6.2832) * 95, BASd[1] + Math.sin(k / 24 * 6.2832) * 70]); RING.push(RING[0]);
  front2(RING, SD, 0.1, { dur: 0.8, until: END_D, flip: true });
  [0, 1, 2, 3, 4, 5].forEach((k) => { const a = k / 6 * 6.2832 + 0.4, R0 = 190, R1 = 120, p0 = [BASd[0] + Math.cos(a) * R0, BASd[1] + Math.sin(a) * R0 * 0.75], p1 = [BASd[0] + Math.cos(a) * R1, BASd[1] + Math.sin(a) * R1 * 0.75];
    unitS("dpg" + k, "rome", p0, k % 3 === 0 ? "tank" : "infantry", "", { t: 0.1 + k * 0.1, until: END_D }); go("dpg" + k, Math.max(T_CLOSE - 0.2, 0.4) + k * 0.05, 1.6, p1); });
  [0.5, 1.8, 3.0].forEach((d, k) => K.impact(BASd[0] + 150 * Math.cos(k * 1.7), BASd[1] + 105 * Math.sin(k * 1.7), d, { r: 8 }));
  sst("THE RING TIGHTENS", T_CLOSE - 0.1, T_DEM - 0.25, { sub: "BASTOGNE · 21-22 DEC 1944" });
  sst("SURRENDER DEMAND", T_DEM - 0.05, T_ANS - 0.15, { color: "#ffd54a", sub: "22 DEC 1944 · UNDER A WHITE FLAG" });
  const WF = `<svg width="30" height="46" viewBox="0 0 30 46" style="display:block;overflow:visible"><circle cx="15" cy="9" r="6" fill="#1b1d22" stroke="#f7f3ea" stroke-width="2"/><path d="M15 15 L15 34 M15 21 L5 29 M15 21 L24 16 M15 34 L8 45 M15 34 L22 45" stroke="#f7f3ea" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M24 16 L24 -6" stroke="#cfcab9" stroke-width="2"/><path d="M24 -6 L38 -2 L24 3 Z" fill="#fff"/></svg>`;
  [0, 1, 2, 3].forEach((k) => { const a = [BASd[0] + 230 + k * 14, BASd[1] - 120 + k * 18], b = [BASd[0] + 95, BASd[1] - 40 + k * 10];
    const el = pinS(GG.pin(WF, a[0], a[1], {})); vis(T_DEM - 0.2 + k * 0.15, END_D)(el); tl.to(el, { left: b[0], top: b[1], duration: Math.max(T_ANS - T_DEM, 1.5), ease: "none" }, T_DEM - 0.2 + k * 0.15); });
  SFX("static", T_DEM);
  const ANSW = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:14px 56px 18px;background:rgba(14,12,10,0.95);border-top:8px solid #1f4fc4;color:#f7f3ea;box-shadow:0 18px 40px rgba(0,0,0,.6)"><div style="font-size:24px;letter-spacing:0.34em;color:#9fc0ea">THE AMERICAN ANSWER</div><div style="font-size:96px;letter-spacing:0.12em;line-height:1.05">ONE WORD</div></div>`,
    "left:0;right:0;top:640px;display:flex;justify-content:center;transform-origin:50% 40%;", T_WORD - 0.15, END_D, { autoAlpha: 0 });
  slam(ANSW, T_WORD - 0.15, { from: 1.7, shake: 5, until: END_D }); pulse(T_WORD + 0.1);
}
// ---------- CUT 1: AVRANCHES 1944 (avranches map, option 2): blue columns pour through the one highway ----------
const AV = AVP(48.684, -1.357), PBT = AVP(48.630, -1.355), S1 = 1.05;
cut(T1, LAV, T2, [1450, 930], S1, [10, -10, 1.07]);
const SC1 = snap();
const k1 = 1 / S1;
const FR1 = GD.F.pa1_avr_front[0];
front2(FR1, S1, T1, { dur: 0.01, until: T2 - 0.01, flip: true });
[flagS(FL.us, "UNITED STATES", 1130, 600, T1, T2), flagS(FL.de, "GERMANY", 1990, 1290, T1, T2)].forEach(vis(T1, T2));
const ROADS = [[[760, 120], [900, 300], [1150, 520], [1350, 690], AV, [1452, 860], [1458, 950], PBT, [1300, 1150], [1150, 1300], [1010, 1370]],
  [[1850, 110], [1760, 300], [1640, 480], [1530, 650], AV, [1452, 860], [1458, 950], PBT, [1520, 1250], [1557, 1500]]];
ROADS.forEach((pts) => glowPath(pts, "#9fc0ea", 6, T1, T2 - 0.01, 1, 0.55));
glowPath([AV, [1452, 860], [1458, 950], PBT], "#ffd54a", 9, T1, T2 - 0.01, 3, 1.0, { top: true });
ROADS.forEach((pts, r) => [0, 1, 2, 3, 4].forEach((k) => vehicle(sub(pts, 0.18 + k * 0.05 + r * 0.02, 0.92), T1 + k * 0.32 + r * 0.15, 3.4, T2 - 0.01, { s: 12, n: 24 })));
unitS("h4a", "carth", [1330, 1180], "tank", "4TH ARMORED", { t: T1, size: "XX", until: T2 - 0.01 }); go("h4a", T1 + 0.1, 3.5, [1180, 1290]);
unitS("hg1", "rome", [1880, 1240], "infantry", "", { t: T1, until: T2 - 0.01 });
arw({ pts: [PBT, [1300, 1180], [1080, 1380]], side: "carth", t: T1 + 0.4, dur: 1.2, width: AW(S1, 14), until: T2 - 0.01 });
arw({ pts: [PBT, [1530, 1260], [1580, 1480]], side: "carth", t: T1 + 0.6, dur: 1.2, width: AW(S1, 14), until: T2 - 0.01 });
town("AVRANCHES", AV, "l", T1, { until: T2 - 0.01 });
ringN(PBT, "AVRANCHES · 1944", 1, T1 + 0.5, T2 - 0.01, 60, 70);
shoot([1960, 1300], [1720, 1230], T1 + 0.8, { r: 10 }); shoot([1990, 1180], [1700, 1150], T_FRANCE, { r: 10 });
endScope(SC1, T2);
// ---------- CUT 2: BASTOGNE 1944 (bastogne map, option 2): the tanks race up the road through Assenois into the town ----------
const BAS = BAP(50.0023, 5.7173), ASS = BAP(49.958, 5.695), S2c = 1.9;
cut(T2, LBA, T3, [1370, 540], S2c, [0, -15, 1.06]);
const SC2 = snap();
CAM_S0 = S2c;
GD.F.m2b_bas_front_dec26.forEach((pts, k) => front2(pts, S2c, T2, { dur: 0.01, until: T3 - 0.01 }));
[flagS(FL.us, "UNITED STATES", 1110, 760, T2, T3), flagS(FL.de, "GERMANY", 1620, 400, T2, T3)].forEach(vis(T2, T3));
const RD = [BAP(49.87, 5.73), BAP(49.90, 5.715), BAP(49.93, 5.70), ASS, BAP(49.98, 5.705), [BAS[0] - 10, BAS[1] + 20]];
glowPath(RD, "#ffd54a", 5, T2, T3 - 0.01, 2, 0.9, { top: true });
[0, 1, 2].forEach((k) => vehicle(sub(RD, 0, 1), T2 + k * 0.35, 2.2, T3 - 0.01, { s: 13, n: 24 }));
unitS("h37", "carth", RD[1], "tank", "37TH TANK BN", { t: T2, until: T3 - 0.01 }); go("h37", T2 + 0.05, 2.4, ASS);
unitS("h101", "carth", [BAS[0] + 20, BAS[1] - 40], "infantry", "101ST AIRBORNE", { t: T2, until: T3 - 0.01 });
town("BASTOGNE", BAS, "l", T2, { until: T3 - 0.01 });
[0.3, 0.75, 1.2].forEach((d, k) => K.impact(ASS[0] - 18 + k * 18, ASS[1] - 10 + (k % 2) * 14, T2 + d, { r: 8 }));
ringN(BAS, "BASTOGNE · 1944", 2, T2 + 0.3, T3 - 0.01, 0, -70);
endScope(SC2, T3);
// ---------- CUT 3: THE RHINE 1945 (oppenheim map, night, option 2): boats paddle across from Nierstein ----------
const NIE = OPP(49.870, 8.337), OPN = OPP(49.856, 8.357), S3c = 1.55;
cut(T3, LOP, T4, [1600, 920], S3c, [-10, 10, 1.05]);
const SC3 = snap();
const RH = [[1480, 0], [1510, 260], [1520, 400], [1540, 600], [1525, 800], [1580, 920], [1700, 985], [1740, 1080], [1722, 1200], [1740, 1360], [1800, 1480], [1880, 1620]];
glowPath(RH, "#3d6f9e", 26, T3, null, 0, 0.9);
front2(RH, S3c, T3, { dur: 0.01, until: T4 - 0.01 });
const NW = document.createElement("div"); NW.style.cssText = "position:absolute;inset:0;background:rgba(6,10,30,0.5);pointer-events:none"; document.getElementById("fx").appendChild(NW); vis(T3, T4)(NW);
[flagS(FL.us, "UNITED STATES", 1180, 720, T3, T4), flagS(FL.de, "GERMANY", 1930, 760, T3, T4)].forEach(vis(T3, T4));
town("NIERSTEIN", NIE, "l", T3, { until: T4 - 0.01 }); town("OPPENHEIM", OPN, "l", T3, { until: T4 - 0.01 });
const BOAT = `<svg width="60" height="28" viewBox="0 0 34 16" style="display:block;overflow:visible;filter:drop-shadow(0 0 4px #6f9bff)"><path d="M1 4 L33 4 L28 14 L6 14 Z" fill="#e9eef8" stroke="#1f4fc4" stroke-width="2.4"/><circle cx="11" cy="4" r="2.6" fill="#1f4fc4"/><circle cx="18" cy="4" r="2.6" fill="#1f4fc4"/><circle cx="25" cy="4" r="2.6" fill="#1f4fc4"/></svg>`;
const XP = [[[1490, 840], [1585, 832]], [[1495, 875], [1595, 868]], [[1505, 910], [1608, 903]], [[1600, 1010], [1755, 1030]], [[1590, 1050], [1750, 1075]]];
XP.forEach((pts, k) => { const el = pinS(GG.pin(BOAT, pts[0][0], pts[0][1], {})); vis(T3 + 0.1 + k * 0.35, T4)(el); tl.to(el, { left: pts[1][0], top: pts[1][1], duration: 3.0, ease: "none" }, T3 + 0.1 + k * 0.35);
  trail(pts, "#9fc0ea", 2.5 / S3c, T3 + 0.1 + k * 0.35, 3.0, T4 - 0.01, "4 7"); });
unitS("hk", "carth", [1420, 880], "infantry", "11TH INFANTRY", { t: T3, until: T4 - 0.01 });
unitS("hgr", "rome", [1700, 860], "infantry", "", { t: T3, until: T4 - 0.01 });
mg([1800, 1020], [1660, 1030], T_DARK, 5, 1.6); mg([1690, 870], [1590, 880], T_DARK + 1.1, 5, 1.6);
ringN([1560, 860], "THE RHINE · 1945", 3, T3 + 0.4, T4 - 0.01, 180, -60);
badge({ name: "BERNARD MONTGOMERY", role: "HIS CROSSING: NIGHT OF 23 MARCH", photo: PHOTO("montgomery"), flag: "assets/media/uk_flag.png", side: "carth", corner: "tr", initials: "BM", t: T_MONTY - 0.3, until: T4 - 0.45 });
endScope(SC3, T4);
// ---------- PULL-OUT: the europe map (option 1, March 1945), the three rings, the title (riser + boom) ----------
const EC = EU(49.4, 5.0), SE = 1.45;
cut(T4, null, END + 0.2, EC, SE, [8, -4, 1.03]);
SFX("ref:riser", T4 + 0.1);
const A1 = EU(48.684, -1.357), A2 = EU(50.002, 5.717), A3 = EU(49.856, 8.357);
const VE = vis(T4, END + 5);
[flagS(FL.us, "UNITED STATES", ...EU(47.6, 1.6), T4, END + 1), flagS(FL.de, "GERMANY", ...EU(51.2, 10.6), T4, END + 1)].forEach(VE);
VE(emblem(...EU(48.55, 10.0), 34));
[["PARIS", 48.857, 2.352, "r"], ["BRUSSELS", 50.85, 4.35, "r"], ["LONDON", 51.507, -0.128, "r"]].forEach(([n, la, lo, sd]) => VE(town(n, EU(la, lo), sd, T4)));
const LGN = GG.card(`<div style="display:flex;gap:26px;font-size:20px;letter-spacing:0.1em;align-items:center">${[["#2e5cb2", "ALLIES"], ["#be3a2a", "GERMANY"], ["#9a968a", "NEUTRAL"]].map(([sq, nm]) => `<span><b style="display:inline-block;width:20px;height:20px;background:${sq};vertical-align:-3px;border:1px solid #f7f3ea;margin-right:8px"></b>${nm}</span>`).join("")}</div>`, "", 34, T4, null);
tl.set(LGN, { autoAlpha: 1, y: 0 }, T4);
CAM_S0 = SE;
[[A1, "AVRANCHES", 1, -40, 52], [A2, "BASTOGNE", 2, 0, -48], [A3, "THE RHINE", 3, 40, 52]].forEach(([p, nm, n, dx, dy], i) => ringN(p, nm, n, T4 + 0.25 + i * 0.25, END + 1, dx, dy));
arw({ pts: [A1, EU(48.3, 0.5), EU(48.95, 1.7), EU(48.9, 4.0), EU(48.95, 6.0), EU(49.3, 6.4), EU(49.75, 5.95), A2], side: "carth", t: T4 + 0.3, dur: 1.4, width: AW(SE, 9), dash: "12 9", until: END + 1 });
arw({ pts: [A2, EU(49.85, 6.6), EU(49.75, 7.6), A3], side: "carth", t: T4 + 1.5, dur: 0.7, width: AW(SE, 9), dash: "12 9", until: END + 1 });
const TDIM = scr("", "inset:0;background:linear-gradient(0deg,rgba(5,7,13,0) 55%,rgba(5,7,13,0.75) 85%);", T_GREAT - 0.6, null, { autoAlpha: 0 });
const TITLE = scr(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:16px 64px 22px;background:rgba(14,12,10,0.9);border-top:7px solid #c9b48a;box-shadow:0 24px 50px rgba(0,0,0,.6)">
  <div style="font-size:30px;letter-spacing:0.42em;color:#c9b48a">GEORGE S. PATTON'S</div>
  <div style="font-size:84px;letter-spacing:0.06em;line-height:1.08;color:#f7f3ea">3 GREATEST TACTICAL MOVES</div>
  <div style="font-size:28px;letter-spacing:0.3em;color:#ffd54a;margin-top:8px">1 AVRANCHES · 2 BASTOGNE · 3 THE RHINE</div></div>`, "left:0;right:0;top:132px;display:flex;justify-content:center;", T_GREAT - 0.26, null, { autoAlpha: 0 });
tl.fromTo(TITLE, { autoAlpha: 0, scale: 1.7 }, { autoAlpha: 1, scale: 1, duration: 0.26, ease: "power4.in", immediateRender: false }, T_GREAT - 0.26);
SFX("ref:boom", T_GREAT); K.shake(T_GREAT, 6, 0.4);
K.raiseTerritory();
B.finish();
