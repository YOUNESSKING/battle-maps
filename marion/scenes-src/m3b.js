// M3B (m3-3, m3-4, m3-5), Francis Marion #18, MOVE 3 HIT THE CHAIN: the siege of Fort Watson, 15-23 Apr 1781. Main style (STYLE_LOCK
// 2d/2e/2f via the Marion kit), 1c clean screen, 1d ("But... instead" = Maham's tower). Build (from marion/):
//   python3 kit/build_scene.py m3b santee m3-3 m3-5
// FACT_NOTES: stockade on the Santee Indian Mound ("forty feet" Marion / "at least thirty" Lee: NO height on screen), invested 15 Apr evening,
//   posts between the fort and Scott's Lake cut the water, a well sunk on the third day, NO cannon on either side; Maham's "large strong oblong
//   pen" of logs floored on top, built the night of 22-23 Apr (NO tower height on screen); riflemen fire down, a party pulls away the abatis,
//   114 taken, Americans 2 killed 6 wounded. santee map px: Fort Watson 930,328 (the hook-b snap cut puts it there too), Scott's Lake ~865,340.
// The stockade + tower are LIVE painted art (scale with the map; the tower uses hook-b's stacked-log look, now crib by crib, crisscross).
// m3-3 (day, evening light on "evening"): frame 0 = Marion's and Lee's columns riding in along the road (from m3a's "break the chain below it"),
//   the stockade on its mound with the garrison inside (no name before it is spoken). "fifteenth of April": 15 APRIL 1781; "Marion": banner;
//   "Lee": banner; "surrounded": blue boxes ring the mound; "Fort Watson": label; "Indian mound": mound pulse; "Santee": carved river name;
//   "cleared ground": focus ring + loophole flashes; "no cannon": stamp NO CANNON; "cut the garrison off": two blue boxes step between the fort
//   and the lake, the water carriers' trail is cut; "at the lake": SCOTT'S LAKE; "a well": blue drop mark inside the walls.
// m3-4: "could not starve": the drop pulses; "could not batter it": a struck-out gun; "Hezekiah Maham": engineer box (white gear) + name tag;
//   "Instead of going through the walls": a short arrow stops at the wall; "go over them": an arrow arcs over the stockade; "twenty-second":
//   22 APRIL 1781 + NIGHT; "cut logs": logs carried from the wood; "borrowed axes": axes come in from the farms; "stacked them crisscross":
//   the tower rises crib by crib; "a floor of logs": the floor; "By morning": dawn light; "taller than its walls": a wall-top line + focus.
// m3-5 (day): "At dawn": 23 APRIL 1781 (spoken day-by-day, the dawn after the 22nd); riflemen climb, fire straight down (flashes + tracer
//   lines into the yard); "kept the defenders down": the garrison box shrinks; "a party crept up": a blue box to the wall foot, the stakes
//   are torn away; "white flag": the Union flag comes down, white flag up (hit); "A hundred and fourteen": the garrison goes, FORM 1 blue
//   hatching on the mound, casualty card row 1; "two killed": row 2; "Not one cannon": the card's last line.
{
const P3 = "m3-3", P4 = "m3-4", P5 = "m3-5";
const T_EVE = at(P3, "On the evening"), T_15 = at(P3, "fifteenth of April"), T_MAR = at(P3, "Marion and Lee"), T_LEE = at(P3, "Lee surrounded"),
  T_SURR = at(P3, "surrounded Fort Watson"), T_FW = at(P3, "Fort Watson"), T_STOCK = at(P3, "a log stockade"), T_MOUND = at(P3, "old Indian mound"),
  T_SANTEE = at(P3, "beside the Santee"), T_CLEAR = at(P3, "cleared ground"), T_NOCAN = at(P3, "They had no cannon"), T_CUT = at(P3, "cut the garrison off"),
  T_WATER = at(P3, "from its water"), T_LAKE = at(P3, "at the lake"), T_3DAYS = at(P3, "within three days"), T_WELL = at(P3, "dug a well");
const T_STARVE = at(P4, "could not starve the fort"), T_BATTER = at(P4, "could not batter it"), T_MILITIA = at(P4, "a militia officer"),
  T_MAHAM = at(P4, "Hezekiah Maham"), T_IDEA = at(P4, "had an idea"), T_THRU = at(P4, "Instead of going through the walls"), T_OVER = at(P4, "go over them"),
  T_NIGHT = at(P4, "On the night"), T_22 = at(P4, "twenty-second of April"), T_LOGS = at(P4, "cut logs"), T_AXES = at(P4, "borrowed axes"),
  T_STACK = at(P4, "stacked them crisscross"), T_FLOOR = at(P4, "a floor of logs"), T_MORN = at(P4, "By morning"), T_STOOD = at(P4, "a wooden tower stood"),
  T_TALLER = at(P4, "taller than its walls");
const T_DAWN = at(P5, "At dawn"), T_CLIMB = at(P5, "riflemen climbed the tower"), T_FIRED = at(P5, "fired straight down"), T_SWEEP = at(P5, "sweeping the ground"),
  T_KEPT = at(P5, "kept the defenders down"), T_PARTY = at(P5, "a party crept up"), T_TORE = at(P5, "tore away the sharpened stakes"),
  T_WHITE = at(P5, "raised a white flag"), T_114 = at(P5, "A hundred and fourteen"), T_TWO = at(P5, "two killed"), T_NOT = at(P5, "Not one cannon");
// ---------------------------------------------------------------------------------------------------------------------------------
LIVING({ clouds: 0.08 });
const FW = [930, 328];                         // the fort (stockade centre, on the baked mound)
const LK = [866, 342];                         // Scott's Lake (the oxbow west of the mound)
const C0 = [1000, 335, 2.2], C1 = [955, 332, 2.85], C2 = [962, 318, 3.35];
camera([[0, ...C0], [T_SURR - 0.2, 995, 335, 2.25], [T_SURR + 2.2, ...C1, "power2.inOut"], [T_WELL + 1.0, 950, 334, 2.95],
  [T_MAHAM - 0.3, 958, 330, 2.9], [T_STACK, 962, 320, 3.15, "sine.inOut"], [T_TALLER + 1.2, ...C2], [T_PARTY, 958, 322, 3.4],
  [T_114, 952, 328, 3.05], [END, 950, 330, 3.0]]);
// ---------------------------------------------------------------------------------------------------------------------------------
// date plate: m3a's SPRING 1781 -> 15 APRIL -> 22 APRIL -> 23 APRIL (the dawn after the 22nd night)
dateNow("SPRING 1781", T_15 - 0.05);
B.date("15 APRIL 1781", T_15, null, 32); SFX("tick", T_15 + 0.1);
B.date("22 APRIL 1781", T_22, null, 32); SFX("tick", T_22 + 0.1);
B.date("23 APRIL 1781", T_DAWN + 0.05, null, 32); SFX("tick", T_DAWN + 0.15);
// light: evening on "evening" (back to day for the siege days), the night of the 22nd, dawn, day
LIGHT("dusk", T_EVE + 0.2, 1.6, 0.35); LIGHT("day", T_NOCAN, 2.0);
LIGHT("night", T_NIGHT + 0.1, 1.6, 0.9); LIGHT("morning", T_MORN, 2.2, 0.45); LIGHT("day", T_DAWN + 0.8, 3.0);
// ---------------------------------------------------------------------------------------------------------------------------------
// scene-local helpers
const scr0 = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; SCN.insertBefore(el, document.getElementById("credit")); gsap.set(el, { autoAlpha: 0 }); return el; };
const FLASH = (p, t, k = 1) => { const el = pinS(GG.pin(`<div style="width:${54 * k}px;height:${54 * k}px;border-radius:50%;background:radial-gradient(circle,#fffbe6 0%,#ffe08a 20%,rgba(255,190,80,.5) 42%,rgba(255,160,60,0) 72%)"></div>`, p[0], p[1], {}));
  tl.fromTo(el, { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1.1, duration: 0.08, ease: "power2.out", immediateRender: false }, t);
  tl.to(el, { autoAlpha: 0, scale: 1.4, duration: 0.6, ease: "power1.in" }, t + 0.12); return el; };
const ARWL = (o) => { const g = arw(o), ps = g.querySelectorAll("path"); ps[0].setAttribute("stroke", "rgba(236,242,255,0.9)"); for (let i = 1; i < ps.length; i++) ps[i].setAttribute("stroke", "#6f9cff");
  const hd = g.querySelector("polygon"); if (hd) { hd.setAttribute("fill", "#6f9cff"); hd.setAttribute("stroke", "rgba(236,242,255,0.9)"); } return g; };
const ICON = (svg, p, t, until, o = {}) => { const el = pinS(GG.pin(svg, p[0], p[1], { t, pop: o.pop ?? true, until })); if (o.hit) SFX("hit", t + 0.15); return el; };
// ---------------------------------------------------------------------------------------------------------------------------------
// the painted fort (map px, scales with the map): the mound, the log stockade (oblique), the abatis ring, the flagpole
// ---------------------------------------------------------------------------------------------------------------------------------
const posts = (cx, cy, rx, ry, a0, a1, n, h, col) => { let s = ""; for (let k = 0; k <= n; k++) { const a = a0 + (a1 - a0) * k / n, x = cx + rx * Math.cos(a), y = cy + ry * Math.sin(a);
  s += `<path d="M${(x - 1.15).toFixed(2)} ${y.toFixed(2)} L${(x - 1.15).toFixed(2)} ${(y - h).toFixed(2)} L${x.toFixed(2)} ${(y - h - 1.4).toFixed(2)} L${(x + 1.15).toFixed(2)} ${(y - h).toFixed(2)} L${(x + 1.15).toFixed(2)} ${y.toFixed(2)} Z" fill="${k % 2 ? col[0] : col[1]}" stroke="#2a1a0c" stroke-width=".35"/>`; } return s; };
const stakes = (cx, cy, rx, ry, n) => { let s = ""; for (let k = 0; k < n; k++) { const a = (k + 0.5) / n * Math.PI * 2, x = cx + rx * Math.cos(a), y = cy + ry * Math.sin(a), dx = Math.cos(a) * 3.2, dy = Math.sin(a) * 2.2;
  s += `<g class="ab" data-a="${a.toFixed(3)}"><path d="M${(x - dx * 0.2).toFixed(2)} ${(y - dy * 0.2).toFixed(2)} L${(x + dx).toFixed(2)} ${(y + dy - 1.6).toFixed(2)}" stroke="#2a1a0c" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M${(x - dx * 0.2).toFixed(2)} ${(y - dy * 0.2).toFixed(2)} L${(x + dx).toFixed(2)} ${(y + dy - 1.6).toFixed(2)}" stroke="#b08a58" stroke-width=".7" stroke-linecap="round"/></g>`; } return s; };
const FORT = GG.pin(`<svg width="112" height="88" viewBox="-56 -52 112 88" style="display:block;overflow:visible">
  <defs><radialGradient id="fwm" cx=".42" cy=".38" r=".7"><stop offset="0" stop-color="#a59a5e"/><stop offset=".6" stop-color="#7f7a46"/><stop offset="1" stop-color="#55552e" stop-opacity="0"/></radialGradient>
   <radialGradient id="fwy" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#b9a571"/><stop offset="1" stop-color="#8b7a4c"/></radialGradient>
   <filter id="fwsh" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.4"/></filter></defs>
  <ellipse cx="3" cy="10" rx="52" ry="30" fill="rgba(30,26,10,.35)" filter="url(#fwsh)"/>
  <ellipse class="mound" cx="0" cy="4" rx="50" ry="29" fill="url(#fwm)"/>
  <path d="M-40 10 C-28 22 24 24 42 8" stroke="rgba(60,50,20,.35)" stroke-width="1.4" fill="none"/>
  <g class="abatis">${stakes(0, 2, 37, 21, 26)}</g>
  <g class="back">${posts(0, -2, 26, 14, Math.PI * 1.02, Math.PI * 1.98, 16, 11, ["#7a5a36", "#8e6a40"])}</g>
  <ellipse class="yard" cx="0" cy="-2" rx="25" ry="13.5" fill="url(#fwy)" stroke="#5a4428" stroke-width=".6"/>
  <g class="pole"><rect x="-15.6" y="-34" width="1.2" height="28" fill="#3a2614"/><g class="ujack"><rect x="-14.4" y="-33.5" width="13" height="8" fill="#1f3a8a" stroke="#f3eee2" stroke-width=".5"/>
    <path d="M-14.4 -33.5 L-1.4 -25.5 M-1.4 -33.5 L-14.4 -25.5" stroke="#f3eee2" stroke-width="1.6"/><path d="M-14.4 -33.5 L-1.4 -25.5 M-1.4 -33.5 L-14.4 -25.5" stroke="#c4121f" stroke-width=".6"/>
    <path d="M-7.9 -33.5 L-7.9 -25.5 M-14.4 -29.5 L-1.4 -29.5" stroke="#f3eee2" stroke-width="2.4"/><path d="M-7.9 -33.5 L-7.9 -25.5 M-14.4 -29.5 L-1.4 -29.5" stroke="#c4121f" stroke-width="1.3"/></g>
    <g class="wflag"><path d="M-14.4 -33.5 C-10 -35 -6 -32 -1.6 -33.2 L-1.6 -25.8 C-6 -24.6 -10 -27.4 -14.4 -25.6 Z" fill="#f7f4ec" stroke="#6a6250" stroke-width=".5"/></g></g>
  <g class="front">${posts(0, -2, 26, 14, Math.PI * 0.02, Math.PI * 0.98, 18, 11, ["#866238", "#9a7446"])}</g>
  <g class="loops" fill="#1a1008">${[0.18, 0.34, 0.5, 0.66, 0.82].map((f) => { const a = Math.PI * f; return `<rect x="${(26 * Math.cos(a) - 1).toFixed(2)}" y="${(-2 + 14 * Math.sin(a) - 6).toFixed(2)}" width="2" height="1.4"/>`; }).join("")}</g>
  <g class="well" opacity="0"><ellipse cx="9" cy="-3" rx="3.6" ry="2.2" fill="#3a2a16" stroke="#c9b48a" stroke-width=".5"/><ellipse cx="9" cy="-3.2" rx="2.2" ry="1.2" fill="#4a7ec0"/></g>
</svg>`, FW[0], FW[1] + 4, {});
now(FORT);
const FSV = FORT.querySelector("svg");
gsap.set(FSV.querySelector(".wflag"), { autoAlpha: 0 });
// the garrison inside the walls (red, frame 0) + the wood that will give the logs
UNIT("gar", "british", [FW[0] + 6, FW[1] + 2], "infantry", { ech: "" });
// ---------------------------------------------------------------------------------------------------------------------------------
// frame 0: Marion's and Lee's columns riding in along the road from the south-east (dust); the fort ahead
// ---------------------------------------------------------------------------------------------------------------------------------
const RD = [[1210, 445], [1150, 420], [1090, 392], [1040, 365], [1005, 345]];
UNIT("mar", "allies", RD[1], "cavalry", { ech: "" });
UNIT("lee", "allies", RD[2], "cavalry", { ech: "" });
UNIT("mi2", "allies", RD[0], "infantry", { ech: "" });
SIDEFLAG("sc", [1250, 470], 0, T_MAR + 0.2);
march("lee", [RD[2], [1040, 365], [1010, 342]], 0.1, T_SURR - 0.3, { dustSize: 34, dustOp: 0.38 });
march("mar", [RD[1], [1090, 392], [1052, 378]], 0.2, T_SURR - 0.2, { dustSize: 34, dustOp: 0.38 });
march("mi2", [RD[0], [1150, 420], [1110, 405]], 0.3, T_SURR - 0.1, { dustSize: 34, dustOp: 0.38 });
// "Marion and Lee": their banners (stakes off the fort, east)
BANNER("marion", "Francis Marion", "sc", [1072, 300], T_MAR + 0.1, { side: "up" });
BANNER("lee", "Henry Lee", "us", [1088, 392], T_LEE + 0.05, { side: "se" });
// "surrounded Fort Watson": the boxes ring the mound (north, east, south); the lake side stays open until "cut ... at the lake"
march("lee", [[1010, 342], [990, 300], [960, 278]], T_SURR + 0.1, 1.6, { dustSize: 28, dustOp: 0.3 });
march("mar", [[1052, 378], [1010, 360], [990, 344]], T_SURR + 0.2, 1.5, { dustSize: 28, dustOp: 0.3 });
march("mi2", [[1110, 405], [1020, 395], [950, 386]], T_SURR + 0.3, 1.7, { dustSize: 28, dustOp: 0.3 });
PLACE_LABEL("Fort Watson", FW, T_FW + 0.1, { dy: -112, size: 26 });
// "a log stockade": the walls tick; "old Indian mound": the mound swells (a pulse of light)
tl.fromTo(FSV.querySelectorAll(".front path, .back path"), { y: 0 }, { y: -1.4, duration: 0.18, yoyo: true, repeat: 1, stagger: 0.02, immediateRender: false }, T_STOCK + 0.1);
tl.fromTo(FSV.querySelector(".mound"), { attr: { rx: 50, ry: 29 } }, { attr: { rx: 55, ry: 32 }, duration: 0.45, yoyo: true, repeat: 1, ease: "sine.inOut", immediateRender: false }, T_MOUND + 0.05);
RIVER("santee", "Santee", T_SANTEE + 0.15, { s: C1[2], near: [800, 470], side: "below", hw: 6 });
// "cleared ground on every side": focus on the mound + musket flashes from the loopholes toward the blue ring
focus(FW, 110, T_CLEAR - 0.1, T_NOCAN - 0.2);
[[[FW[0] + 18, FW[1] + 4], [990, 344]], [[FW[0] + 4, FW[1] + 10], [950, 386]], [[FW[0] + 12, FW[1] - 8], [960, 278]]].forEach(([a, b], i) => {
  FLASH(a, T_CLEAR + 0.3 + i * 0.35, 0.55); mg(a, b, T_CLEAR + 0.32 + i * 0.35, 3, 1.0 / C1[2] * 2); });
// "They had no cannon": stamp
wstampL("NO CANNON", FW[0] + 100, FW[1] + 110, T_NOCAN + 0.05, T_CUT - 0.1, null, 30);
// the garrison's water: two red carriers walk the trail to the lake and back
const TRAIL = [[FW[0] - 22, FW[1] + 8], [902, 346], [884, 348], [LK[0] + 8, 346]];
const tr = document.createElementNS(NSs, "path"); tr.setAttribute("d", "M" + TRAIL.map((q) => q.join(" ")).join(" L"));
Object.entries({ fill: "none", stroke: "#8fc0ea", "stroke-width": 1.4, "stroke-dasharray": "2.4 2.2", "stroke-linecap": "round", opacity: 0 }).forEach(([k, v]) => tr.setAttribute(k, v)); OVL.appendChild(tr);
tl.to(tr, { opacity: 0.9, duration: 0.4 }, T_NOCAN + 0.6);
const CARRY = [0, 1].map((k) => { const el = GG.pin(`<div style="width:5px;height:5px;border-radius:50%;background:#c4121f;border:1px solid #f3eee2"></div>`, TRAIL[0][0], TRAIL[0][1], {});
  tl.set(el, { autoAlpha: 1 }, T_NOCAN + 0.6 + k * 0.5);
  for (let r = 0; r < 2; r++) { const t0 = T_NOCAN + 0.7 + k * 0.5 + r * 1.6; tl.to(el, { left: TRAIL[3][0], top: TRAIL[3][1], duration: 0.8, ease: "sine.inOut" }, t0); tl.to(el, { left: TRAIL[0][0], top: TRAIL[0][1], duration: 0.8, ease: "sine.inOut" }, t0 + 0.8); }
  return el; });
// "cut the garrison off from its water": two blue boxes step between the fort and the lake; the trail goes red-dashed and fades
march("mi2", [[950, 386], [912, 372], [892, 362]], T_CUT, 1.0, { dustSize: 24, dustOp: 0.3 });
UNIT("bw", "allies", [905, 262], "infantry", { ech: "", t: T_CUT - 0.1 });
march("bw", [[905, 262], [890, 300], [888, 326]], T_CUT + 0.1, 1.0, { dustSize: 24, dustOp: 0.3 });
CARRY.forEach((el) => tl.to(el, { left: TRAIL[0][0], top: TRAIL[0][1], autoAlpha: 0, duration: 0.5, overwrite: "auto" }, T_WATER + 0.1));
tl.to(tr, { attr: { stroke: "#c4121f" }, duration: 0.3 }, T_WATER + 0.2); tl.to(tr, { opacity: 0, duration: 0.8 }, T_LAKE + 1.2);
ICON(`<svg width="36" height="36" viewBox="-10 -10 20 20" style="display:block;overflow:visible;filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.7))"><path d="M-7 -7 L7 7 M7 -7 L-7 7" stroke="#f3eee2" stroke-width="4.4" stroke-linecap="round"/><path d="M-7 -7 L7 7 M7 -7 L-7 7" stroke="#c4121f" stroke-width="2.4" stroke-linecap="round"/></svg>`,
  [900, 347], T_WATER + 0.2, T_LAKE + 1.4, { hit: true });
PLACE_LABEL("Scott's Lake", [848, 392], T_LAKE + 0.1, { dy: 0, size: 22 });
// "But within three days ... a well inside the walls": the well is dug (drop mark, map art + a screen drop that pops)
tl.to(FSV.querySelector(".well"), { opacity: 1, duration: 0.4 }, T_WELL + 0.1);
const DROP = `<svg width="34" height="44" viewBox="-12 -18 24 30" style="display:block;overflow:visible;filter:drop-shadow(0 1px 2px rgba(0,0,0,.7))"><path d="M0 -16 C6 -6 10 -1 10 4 A10 10 0 0 1 -10 4 C-10 -1 -6 -6 0 -16 Z" fill="#4f8ee0" stroke="#f3eee2" stroke-width="2"/><path d="M-4 2 A5 5 0 0 0 1 8" stroke="#dff0ff" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>`;
const DR = ICON(DROP, [FW[0] + 9, FW[1] - 14], T_WELL + 0.15, T_BATTER + 0.2, { hit: true });
// ---------------------------------------------------------------------------------------------------------------------------------
// m3-4: "They could not starve the fort, and they could not batter it"
tl.to(DR.querySelector("svg"), { scale: 1.35, transformOrigin: "50% 60%", duration: 0.2, yoyo: true, repeat: 1, ease: "power2.out" }, T_STARVE + 0.1);
const GUNX = `<svg width="78" height="52" viewBox="-26 -17 52 34" style="display:block;overflow:visible;filter:drop-shadow(0 1px 2px rgba(0,0,0,.7))">
  <rect x="-24" y="-15" width="48" height="30" rx="3" fill="rgba(18,16,12,.9)" stroke="#c9b48a" stroke-width="1.4"/>
  <g fill="#9a9488" stroke="#2a2420" stroke-width="1"><path d="M-16 -2 L12 -6 L12 0 L-16 4 Z"/><circle cx="-6" cy="6" r="6" fill="none" stroke="#9a9488" stroke-width="2.2"/></g>
  <path d="M-20 -12 L20 12" stroke="#f3eee2" stroke-width="5" stroke-linecap="round"/><path d="M-20 -12 L20 12" stroke="#c4121f" stroke-width="3" stroke-linecap="round"/></svg>`;
ICON(GUNX, [1012, 286], T_BATTER + 0.05, T_MAHAM - 0.1, { hit: true });
// "a militia officer named Hezekiah Maham": the engineer box (white gear) + name tag; "had an idea": it pulses
UNIT("mah", "allies", [1018, 330], "engineers", { ech: "", t: T_MILITIA + 0.2, name: "HEZEKIAH MAHAM", nameAt: T_MAHAM + 0.05 });
SFX("hit", T_MAHAM + 0.1);
tl.to(B.units.mah.el.querySelector(".tag"), { autoAlpha: 0, duration: 0.4 }, T_TALLER + 2.4);   // the tag steps out before the riflemen climb
tl.fromTo(B.units.mah.el.querySelector(".blk"), { scale: 1 }, { scale: 1.3, duration: 0.22, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, T_IDEA + 0.1);
// "Instead of going through the walls": a short arrow stops at the wall (a red tick); "they would go over them": an arrow arcs over the stockade
ARWL({ pts: [[1000, 336], [975, 334], [960, 332]], side: "carth", t: T_THRU + 0.1, dur: 0.7, width: AW(C1[2], 11) });
ICON(`<svg width="30" height="30" viewBox="-10 -10 20 20" style="display:block;overflow:visible"><path d="M-6 -6 L6 6 M6 -6 L-6 6" stroke="#f3eee2" stroke-width="4" stroke-linecap="round"/><path d="M-6 -6 L6 6 M6 -6 L-6 6" stroke="#c4121f" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  [956, 322], T_THRU + 0.85, T_OVER + 0.3, { hit: false });
ARWL({ pts: [[1000, 330], [975, 296], [948, 282], [920, 290], [902, 312]], side: "carth", t: T_OVER + 0.05, dur: 1.1, width: AW(C1[2], 11) });
// ---------------------------------------------------------------------------------------------------------------------------------
// the night of the 22nd: logs from the wood, axes from the farms, the tower rises crib by crib (crisscross), a floor of logs on top
// ---------------------------------------------------------------------------------------------------------------------------------
const TW = [968, 330];                        // the tower's foot (east of the stockade, on the slope of the mound)
const WOOD = [1010, 262];                      // the wood's south edge (baked woods at 1000-1100, 210-310)
march("mah", [[1018, 330], [1012, 300], WOOD], T_LOGS - 0.6, 1.2, { trail: false, dust: false });
UNIT("eng2", "allies", [1046, 300], "engineers", { ech: "", t: T_NIGHT + 0.6 });
march("eng2", [[1046, 300], [1030, 276], [1028, 266]], T_LOGS - 0.4, 1.0, { trail: false, dust: false });
const LOG = `<svg width="46" height="16" viewBox="0 0 26 9" style="display:block;overflow:visible;filter:drop-shadow(0 1px 1px rgba(0,0,0,.7))"><rect x="1" y="1.5" width="24" height="6" rx="3" fill="#a07848" stroke="#f0e2c0" stroke-width="1.1"/><circle cx="23" cy="4.5" r="2.2" fill="#d8b884" stroke="#3a2610" stroke-width=".6"/></svg>`;
const NL = 7, LT0 = T_LOGS + 0.1, LT1 = T_FLOOR - 0.2;
for (let k = 0; k < NL; k++) { const s0 = [WOOD[0] + ((k * 13) % 26) - 13, WOOD[1] + 6], t0 = LT0 + k * (LT1 - LT0 - 1.2) / NL;
  const el = pinS(GG.pin(LOG, s0[0], s0[1], {})); tl.set(el, { autoAlpha: 1 }, t0);
  tl.to(el, { left: TW[0] + 4, top: TW[1] - 6, rotation: k % 2 ? 20 : -15, duration: 1.1, ease: "sine.inOut" }, t0); tl.to(el, { autoAlpha: 0, duration: 0.2 }, t0 + 1.05); }
const AXE = `<svg width="48" height="48" viewBox="-12 -12 24 24" style="display:block;overflow:visible;filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.8))"><path d="M-8 9 L5 -6" stroke="#f0e2c0" stroke-width="3.6" stroke-linecap="round"/><path d="M-8 9 L5 -6" stroke="#8a5f30" stroke-width="2" stroke-linecap="round"/><path d="M2 -10 C7 -11 11 -7 10 -2 L4 -4 Z" fill="#d9dde2" stroke="#2a2420" stroke-width="1"/></svg>`;
[[1180, 210], [1200, 430], [760, 210]].forEach((p, k) => { const el = pinS(GG.pin(AXE, p[0], p[1], {})); tl.set(el, { autoAlpha: 1 }, T_AXES + 0.1 + k * 0.2);
  tl.to(el, { left: WOOD[0] + 10 * (k - 1), top: WOOD[1] + 8, rotation: 360, duration: 1.4, ease: "sine.inOut" }, T_AXES + 0.1 + k * 0.2); tl.to(el, { autoAlpha: 0, duration: 0.3 }, T_AXES + 1.6 + k * 0.2); });
// the tower: oblique view like hook-b's stacked logs, crisscross (long logs / end-on logs alternate), crib by crib, then the floor
const NC = 12, TWW = 26, CH = 4.4;
const TOWER = GG.pin(`<svg width="${TWW + 8}" height="${NC * CH + 14}" viewBox="-4 ${-NC * CH - 10} ${TWW + 8} ${NC * CH + 14}" style="display:block;overflow:visible;filter:drop-shadow(1.5px 2px 1.4px rgba(0,0,0,.55))">
  <ellipse cx="${TWW / 2}" cy="1.5" rx="${TWW * 0.62}" ry="3" fill="rgba(30,22,8,.4)"/>
  ${[...Array(NC)].map((_, k) => { const y = -k * CH - CH; return k % 2 === 0
    ? `<g class="crib"><rect x="0" y="${y}" width="${TWW}" height="${CH - 0.4}" rx="${CH / 2}" fill="${k % 4 ? "#7a5a36" : "#8e6a40"}" stroke="#2a1a0c" stroke-width=".55"/><circle cx="1.6" cy="${y + CH / 2 - 0.2}" r="1.4" fill="#cdb07c" stroke="#3a2610" stroke-width=".3"/><circle cx="${TWW - 1.6}" cy="${y + CH / 2 - 0.2}" r="1.4" fill="#cdb07c" stroke="#3a2610" stroke-width=".3"/></g>`
    : `<g class="crib"><rect x="2.2" y="${y + 0.2}" width="${TWW - 4.4}" height="${CH - 0.8}" fill="#5e4428" stroke="#2a1a0c" stroke-width=".4"/>${[0.08, 0.36, 0.64, 0.92].map((f) => `<circle cx="${(2.2 + f * (TWW - 4.4)).toFixed(2)}" cy="${y + CH / 2 - 0.2}" r="${CH / 2 - 0.2}" fill="#c9a874" stroke="#3a2610" stroke-width=".4"/>`).join("")}</g>`; }).join("")}
  <g class="floor"><path d="M-2 ${-NC * CH - 0.4} L${TWW + 2} ${-NC * CH - 0.4} L${TWW - 1} ${-NC * CH - 5} L1 ${-NC * CH - 5} Z" fill="#b08a58" stroke="#2a1a0c" stroke-width=".6"/>
   ${[0.2, 0.4, 0.6, 0.8].map((f) => `<path d="M${(f * TWW).toFixed(1)} ${-NC * CH - 0.6} L${(f * TWW + 0.6).toFixed(1)} ${-NC * CH - 4.8}" stroke="#5e4428" stroke-width=".5"/>`).join("")}</g>
</svg>`, TW[0], TW[1] + 3, { anchor: [-50, -100] });
now(TOWER);
const CRIBS = TOWER.querySelectorAll(".crib"), TFLOOR = TOWER.querySelector(".floor");
gsap.set([...CRIBS, TFLOOR], { autoAlpha: 0 });
const ST0 = T_STACK - 0.3, ST1 = T_FLOOR - 0.15;
CRIBS.forEach((c, k) => { const t = ST0 + k * (ST1 - ST0) / NC; tl.fromTo(c, { autoAlpha: 0, y: -5 }, { autoAlpha: 1, y: 0, duration: 0.18, ease: "power2.in", immediateRender: false }, t); if (k % 3 === 0) SFX("tick", t + 0.15); });
tl.fromTo(TFLOOR, { autoAlpha: 0, y: -6 }, { autoAlpha: 1, y: 0, duration: 0.25, ease: "power2.in", immediateRender: false }, T_FLOOR + 0.2); SFX("hit", T_FLOOR + 0.42);
// the engineers come back to the foot of the tower when the floor is on
march("mah", [WOOD, [1000, 300], [990, 332]], T_FLOOR - 0.6, 1.4, { trail: false, dust: false });
march("eng2", [[1028, 266], [1010, 300], [1000, 352]], T_FLOOR - 0.4, 1.4, { trail: false, dust: false });
// "By morning, a wooden tower stood next to the fort, taller than its walls": the tower pulses; a wall-top line runs out to the tower
tl.fromTo(TOWER.firstElementChild, { scale: 1 }, { scale: 1.08, transformOrigin: "50% 100%", duration: 0.3, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, T_STOOD + 0.2);
{ const yTop = FW[1] + 4 - 13; const ln = document.createElementNS(NSs, "path"); ln.setAttribute("d", `M${FW[0] - 30} ${yTop} L${TW[0] + 22} ${yTop}`);
  Object.entries({ fill: "none", stroke: "#f0e6c8", "stroke-width": 0.9, "stroke-dasharray": "2.6 2", opacity: 0 }).forEach(([k, v]) => ln.setAttribute(k, v)); OVL.appendChild(ln);
  tl.to(ln, { opacity: 0.95, duration: 0.3 }, T_TALLER); tl.to(ln, { opacity: 0, duration: 0.5 }, T_TALLER + 2.6);
  const up = document.createElementNS(NSs, "path"); up.setAttribute("d", `M${TW[0] + 20} ${yTop} L${TW[0] + 20} ${TW[1] - NC * CH - 2}`);
  Object.entries({ fill: "none", stroke: "#f0e6c8", "stroke-width": 1.1, "marker-end": "", opacity: 0 }).forEach(([k, v]) => up.setAttribute(k, v)); OVL.appendChild(up);
  tl.to(up, { opacity: 0.95, duration: 0.3 }, T_TALLER + 0.3); tl.to(up, { opacity: 0, duration: 0.5 }, T_TALLER + 2.6); }
// ---------------------------------------------------------------------------------------------------------------------------------
// m3-5: at dawn the riflemen climb and fire straight down into the yard; the stakes are torn away; the white flag; surrender
// ---------------------------------------------------------------------------------------------------------------------------------
const TOP = [TW[0], TW[1] - NC * CH - 4];
UNIT("rif", "allies", [TW[0] + 2, TW[1] + 6], "infantry", { ech: "", t: T_DAWN + 0.2, name: "RIFLEMEN", nameAt: T_CLIMB + 0.1 });
B.move("rif", T_CLIMB + 0.2, 1.4, TOP[0], TOP[1] - 6);
tl.to(B.units.rif.el.querySelector(".tag"), { autoAlpha: 0, duration: 0.4 }, T_KEPT + 0.2);
const YARD = [[FW[0] - 10, FW[1] + 2], [FW[0] + 2, FW[1] - 2], [FW[0] + 10, FW[1] + 4], [FW[0] - 4, FW[1] + 6], [FW[0] + 14, FW[1] - 3]];
const MUZ = [TOP[0] - 12, TOP[1] - 4];
[0, 1, 2].forEach((k) => { FLASH(MUZ, T_FIRED + 0.1 + k * 0.45, 1.3); mg(MUZ, YARD[k], T_FIRED + 0.12 + k * 0.45, 3, 1.6); });
[3, 4, 0, 2].forEach((j, k) => { FLASH(MUZ, T_SWEEP + 0.1 + k * 0.4, 1.3); mg(MUZ, YARD[j], T_SWEEP + 0.12 + k * 0.4, 3, 1.6); });
smoke([[MUZ[0] + 2, MUZ[1] - 2]], T_FIRED + 0.3, 0.6); smoke([[MUZ[0], MUZ[1] - 3]], T_SWEEP + 0.4, 0.6);
// "kept the defenders down": the garrison box sinks and dims
tl.to(B.units.gar.el.querySelector(".blk"), { scale: 0.8, opacity: 0.6, filter: "brightness(.7)", duration: 0.5 }, T_KEPT + 0.1);
// "a party crept up and tore away the sharpened stakes": a blue box to the south foot; the stakes there are thrown aside
UNIT("pty", "allies", [1000, 372], "infantry", { ech: "", t: T_PARTY - 0.3 });
march("pty", [[1000, 372], [970, 362], [946, 352]], T_PARTY + 0.05, 1.4, { trail: false, dust: false });
{ const ab = [...FSV.querySelectorAll(".ab")].filter((g) => { const a = +g.dataset.a; return a > 0.15 && a < 1.9; });
  ab.forEach((g, i) => tl.to(g, { x: 8 + (i % 3) * 3, y: 6 + (i % 2) * 4, rotation: 70, transformOrigin: "50% 50%", autoAlpha: 0, duration: 0.45, ease: "power2.out" }, T_TORE + 0.15 + i * 0.12));
  SFX("tick", T_TORE + 0.2); SFX("tick", T_TORE + 0.6); }
// "The British commander raised a white flag": the Union flag comes down, the white flag goes up
tl.to(FSV.querySelector(".ujack"), { y: 10, autoAlpha: 0, duration: 0.35 }, T_WHITE - 0.1);
tl.fromTo(FSV.querySelector(".wflag"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out", immediateRender: false }, T_WHITE + 0.2);
SFX("hit", T_WHITE + 0.6); K.shake(T_WHITE + 0.6, 3, 0.25);
// "A hundred and fourteen men surrendered": the garrison goes (taken), FORM 1 blue hatching on the mound
tl.to(B.units.gar.el, { autoAlpha: 0, duration: 0.4 }, T_114 + 0.3);
HATCH([[FW[0] - 46, FW[1] - 6], [FW[0] - 30, FW[1] - 24], [FW[0] + 2, FW[1] - 30], [FW[0] + 34, FW[1] - 24], [FW[0] + 50, FW[1] - 4], [FW[0] + 40, FW[1] + 22],
  [FW[0] + 6, FW[1] + 32], [FW[0] - 30, FW[1] + 24]], "allies", T_114 + 0.2, { hold: 2.6 });
// the casualty card: rows on their words; the last line on "Not one cannon had been fired"
{ const row = (flag, side, txt, col) => `<div class="cr" style="display:flex;align-items:center;gap:20px;margin-top:10px"><img src="assets/media/${flag}" alt="" style="height:40px;border:1px solid #f7f3ea">
    <div style="font-size:38px;letter-spacing:.1em;min-width:250px">${side}</div><div style="font-size:46px;color:${col};letter-spacing:.04em">${txt}</div></div>`;
  const CC = scr0(`<div style="padding:20px 50px 24px;background:rgb(18,16,12);border-top:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 20px 44px rgba(0,0,0,.6)">
    <div style="font-size:26px;letter-spacing:.34em;color:#d8c9a3;text-align:center">FORT WATSON</div>
    ${row("gb_flag_1606.png", "BRITISH", "114 SURRENDERED", "#ff8a80")}${row("us_flag_13star.png", "AMERICANS", "2 KILLED &middot; 6 WOUNDED", "#9fc0ea")}
    <div class="cr" style="margin-top:14px;text-align:center;font-size:34px;letter-spacing:.2em;color:#c9b48a">NOT ONE CANNON FIRED</div></div>`,
    "left:0;right:0;top:700px;display:flex;justify-content:center;transform-origin:50% 30%;");
  const rows = CC.querySelectorAll(".cr"); gsap.set([rows[1], rows[2]], { autoAlpha: 0 });
  slam(CC, T_114 - 0.05, { from: 1.4, shake: 3 });
  tl.fromTo(rows[1], { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.3, immediateRender: false }, T_TWO); SFX("tick", T_TWO + 0.05);
  tl.fromTo(rows[2], { autoAlpha: 0, scale: 1.3 }, { autoAlpha: 1, scale: 1, duration: 0.25, ease: "power3.in", immediateRender: false }, T_NOT); SFX("hit", T_NOT + 0.22); }
if (GD.var.audit) LABEL_AUDIT([4, 12, 20, 30, 40, 50, 60, 70], { show: true });
}
