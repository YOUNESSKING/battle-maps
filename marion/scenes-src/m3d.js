// M3D (m3-7, m3-8, m3-9), Francis Marion #18, MOVE 3: the siege of Fort Motte, 8-12 May 1781. Main style (STYLE_LOCK 2d/2e/2f via the Marion
// kit), 1c clean screen (every name / card / stamp only on its spoken words). Build (from marion/):
//   python3 kit/build_scene.py m3d congaree m3-7 m3-9
// FACT_NOTES: Mrs. Motte's new mansion fortified with a trench and a parapet; ~150-165 under McPherson (no first name, NO Hessians: no name on
//   screen); Rawdon evacuated Camden 10 May, his campfires seen the night of 11-12 May; ~noon 12 May "the rays of the scorching sun had prepared
//   the shingle roof" (the only weather: bright warm noon light); Mrs. Motte gave Lee a bow (Lee's account: caption BY LEE'S ACCOUNT on the
//   spoken words; James's rival version = rosin ball, logged, not shown); the six-pounder drove the men off the roof (fires ONCE, visible, the
//   locked K.gun / K.impact sound); white flag; no blood shed; dinner for the officers of both sides; Marion protected a Loyalist prisoner.
// congaree map px: the Motte house 1391,726 (baked painted house: covered by the LIVE mansion + works here), the farmhouse 1459,775 (baked).
// Frame 0 = cut from m3c's last frame: its Greene quote card (2) is carried (payoff line, lesson 2e) and fades at ~2.2 s; date plate 24 APRIL 1781 (m3c).
// m3-7 (day): blue columns ride in on the farm road from the south-east; "Two weeks later": 8 MAY 1781 (24 Apr + 14 days; FACT_NOTES 8-12 May);
//   "Fort Motte": label; "big new mansion": the mansion pulses; "a trench": the ditch is dug round it; "a high wall of earth": the parapet rises;
//   "Rebecca Motte": a cream figure + name tag at the house; "an old farmhouse nearby": she walks to the farmhouse; "six-pounder": the kit gun
//   box (SIX-POUNDER tag) rolls in on Marion's side; "no time for a siege": stamp; "Lord Rawdon": pull back, red column from the top edge
//   (CAMDEN pointer on "Camden"), Rawdon banner; "marching to the rescue": red arrow; "eleventh of May": 11 MAY + night; "campfires": glows on
//   the hills across the Wateree, the garrison box glows (they see them).
// m3-8: "Lee went to Mrs. Motte": Lee banner, his box rides to the farmhouse; "her house had to burn": the mansion flickers; "By Lee's account":
//   caption; "a bow": bow icon at the farmhouse; "twelfth of May": 12 MAY + bright warm noon light; "the dry shingle roof caught fire": three
//   fire arrows arc onto the roof, the roof burns (flames + smoke); "British soldiers climbed up": red figures on the roof; "the six-pounder":
//   the gun fires once (gable impact), the figures drop; "a white flag": the Union flag down, the white flag up.
// m3-9: "About a hundred and fifty": the garrison marches out (prisoners, grey), FORM 1 blue hatching on the hill, result card row 1;
//   "not a drop of blood": the card's last line; "served dinner": two officer marks (red + blue) to the farmhouse, a dinner icon;
//   "Marion's own militia": Marion banner, blue militia close on one red prisoner; "burning his neighbors' houses": the accusation icon;
//   "Marion stepped in": his box moves next to the prisoner, the crowd backs off, a blue ring guards him.
{
const P7 = "m3-7", P8 = "m3-8", P9 = "m3-9";
const T_2W = at(P7, "Two weeks later"), T_FM = at(P7, "Fort Motte"), T_MANSION = at(P7, "a big new mansion"), T_FORT = at(P7, "into a fortress"),
  T_TRENCH = at(P7, "with a trench"), T_WALL = at(P7, "a high wall of earth"), T_OWNER = at(P7, "The owner"), T_REB = at(P7, "Rebecca Motte"),
  T_SENT = at(P7, "had been sent to live"), T_FARM = at(P7, "an old farmhouse nearby"), T_GREENE = at(P7, "This time Greene"), T_SIX = at(P7, "a six-pounder"),
  T_NOTIME = at(P7, "no time for a siege"), T_RAW = at(P7, "Lord Rawdon"), T_CAMDEN = at(P7, "abandoned Camden"), T_RESCUE = at(P7, "marching to the rescue"),
  T_NIGHT = at(P7, "On the night"), T_11 = at(P7, "eleventh of May"), T_SEE = at(P7, "the defenders could see"), T_FIRES = at(P7, "his campfires"),
  T_ACROSS = at(P7, "across the river");
const T_HARD = at(P8, "did something hard"), T_LEE = at(P8, "Lee went to Mrs. Motte"), T_BURN = at(P8, "her house had to burn"), T_ACC = at(P8, "By Lee's account"),
  T_AGREED = at(P8, "she not only agreed"), T_BOW = at(P8, "a bow and arrows"), T_NOON = at(P8, "At about noon"), T_12 = at(P8, "twelfth of May"),
  T_SUN = at(P8, "under a scorching sun"), T_ROOF = at(P8, "the dry shingle roof"), T_CAUGHT = at(P8, "caught fire"), T_CLIMB = at(P8, "British soldiers climbed up"),
  T_TEAR = at(P8, "tear the burning shingles away"), T_GUN = at(P8, "the six-pounder drove them"), T_OFF = at(P8, "off the roof"), T_WHITE = at(P8, "a white flag went up");
const T_150 = at(P9, "About a hundred and fifty"), T_BLOOD = at(P9, "not a drop of blood"), T_DINNER = at(P9, "served dinner"), T_BOTH = at(P9, "officers of both sides"),
  T_MIL = at(P9, "Marion's own militia"), T_HANG = at(P9, "wanted to hang"), T_ACCUSED = at(P9, "a man accused"), T_NEIGH = at(P9, "burning his neighbors' houses"),
  T_STEP = at(P9, "Marion stepped in"), T_SAFE = at(P9, "kept him safe");
// ---------------------------------------------------------------------------------------------------------------------------------
LIVING({ clouds: 0.08 });
const H = [1391, 726], FARM = [1459, 775];
const C0 = [1452, 764, 2.6], C1 = [1414, 750, 3.2], C2 = [1404, 744, 3.6], CW = [1790, 560, 0.92];
camera([[0, ...C0], [T_FM - 0.4, 1444, 760, 2.65], [T_FM + 1.6, ...C1, "power2.inOut"], [T_SENT, 1424, 756, 3.15], [T_NOTIME + 0.2, 1428, 752, 3.1],
  [T_RAW - 0.1, 1432, 750, 3.0], [T_RAW + 2.4, ...CW, "power2.inOut"], [T_FIRES + 0.4, 1810, 566, 0.95], [T_HARD + 0.2, 1820, 572, 0.96],
  [T_LEE + 2.2, 1430, 758, 3.05, "power2.inOut"], [T_NOON, 1424, 754, 3.1], [T_ROOF + 0.4, ...C2, "power2.inOut"], [T_WHITE + 0.6, 1400, 742, 3.6],
  [T_150 + 0.4, 1404, 760, 3.1], [T_MIL, 1394, 778, 3.15], [T_STEP + 0.5, 1384, 790, 3.4], [END, 1384, 790, 3.45]]);
// ---------------------------------------------------------------------------------------------------------------------------------
// date plate: m3c's 24 APRIL -> 8 MAY ("Two weeks later") -> 11 MAY (night) -> 12 MAY (noon)
dateNow("24 APRIL 1781", T_2W + 0.4);
B.date("8 MAY 1781", T_2W + 0.5, null, 32); SFX("tick", T_2W + 0.6);
B.date("11 MAY 1781", T_11, null, 32); SFX("tick", T_11 + 0.1);
B.date("12 MAY 1781", T_12, null, 32); SFX("tick", T_12 + 0.1);
// light: day -> the night of the 11th -> a bright, warm noon on the 12th (FACT_NOTES "scorching sun": the only weather)
LIGHT("night", T_NIGHT + 0.1, 1.6, 0.85);
LIGHT("afternoon", T_NOON - 0.1, 2.0, 0.6);
{ const mk = (bg, blend) => { const d = document.createElement("div"); d.style.cssText = `position:absolute;left:-3000px;top:-3000px;width:9000px;height:8000px;background:${bg};mix-blend-mode:${blend};opacity:0`; LV.layers.light.appendChild(d); return d; };
  const a = mk("rgba(255,226,150,.9)", "soft-light"), b = mk("rgba(255,222,160,1)", "screen");
  tl.to(a, { opacity: 0.38, duration: 2.0 }, T_NOON - 0.1); tl.to(b, { opacity: 0.1, duration: 2.0 }, T_NOON - 0.1); }
// ---------------------------------------------------------------------------------------------------------------------------------
// scene-local helpers
const scr0 = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; SCN.insertBefore(el, document.getElementById("credit")); gsap.set(el, { autoAlpha: 0 }); return el; };
const ICON = (svg, p, t, until, o = {}) => { const el = pinS(GG.pin(svg, p[0], p[1], { t, pop: o.pop ?? true, until })); if (o.hit) SFX("hit", t + 0.15); return el; };
const PULSE = (id, t, k = 1.3) => tl.fromTo(B.units[id].el.querySelector(".blk"), { scale: 1 }, { scale: k, duration: 0.22, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, t);
const ARWC = (o, col, edge) => { const g = arw(o), ps = g.querySelectorAll("path"); ps[0].setAttribute("stroke", edge); for (let i = 1; i < ps.length; i++) ps[i].setAttribute("stroke", col);
  const hd = g.querySelector("polygon"); if (hd) { hd.setAttribute("fill", col); hd.setAttribute("stroke", edge); } return g; };
const DOT = (p, col, t, r = 5, until) => { const el = GG.pin(`<div style="width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:${col};border:${(r * 0.32).toFixed(1)}px solid #f3eee2;box-shadow:0 0 2px rgba(0,0,0,.8)"></div>`, p[0], p[1], { t, until });
  if (!(t > 0)) gsap.set(el, { autoAlpha: 1 }); return el; };
// ---------------------------------------------------------------------------------------------------------------------------------
// frame 0: m3c's last quote card (continuity), leaves at once
{ const ln = (txt, gold) => `<div style="font-size:38px;font-weight:${gold ? 600 : 500};line-height:1.28;letter-spacing:.02em;${gold ? "color:#e8cf8a" : ""}">${txt}</div>`;
  const QC = scr0(`<div style="max-width:1560px;padding:24px 50px 22px;background:rgb(18,16,12);border-left:8px solid #1f4fc4;font-family:Oswald;color:#f7f3ea;box-shadow:0 20px 40px rgba(0,0,0,.55)">
    ${ln("&ldquo;To fight the enemy bravely with the prospect of victory is nothing,")}${ln("but to fight with intrepidity under the constant impression of a defeat &hellip;")}${ln("is a talent peculiar to yourself.&rdquo;", true)}
    <div style="font-size:19px;font-weight:700;letter-spacing:.24em;color:#9fc0ea;margin-top:12px">NATHANAEL GREENE TO MARION &middot; 24 APRIL 1781</div></div>`, "left:0;right:0;top:640px;display:flex;justify-content:center;");
  gsap.set(QC, { autoAlpha: 1 }); tl.to(QC, { autoAlpha: 0, duration: 0.4 }, 2.2); }
// ---------------------------------------------------------------------------------------------------------------------------------
// the LIVE mansion + works (map px, scale with the map). Oblique view: back parapet, the house, front parapet; ditch outside.
// ---------------------------------------------------------------------------------------------------------------------------------
const RX = 40, RY = 23, KM = 1.3;
const SV = (x, y) => [H[0] + x * KM, H[1] + 6 + (y + 10) * KM];   // mansion svg coords -> map px
const ell = (rx, ry, a0, a1, n = 40, cy = 0) => [...Array(n + 1)].map((_, k) => { const a = a0 + (a1 - a0) * k / n; return [rx * Math.cos(a), cy + ry * Math.sin(a)]; });
const pathOf = (pts) => "M" + pts.map((q) => q[0].toFixed(2) + " " + q[1].toFixed(2)).join(" L");
const BACK = pathOf(ell(RX, RY, Math.PI, Math.PI * 2)), FRONTP = pathOf(ell(RX, RY, 0, Math.PI)), DITCH = pathOf(ell(RX + 6, RY + 4.5, 0, Math.PI * 2, 64));
const WINS = [-12, -6, 0, 6, 12].map((x) => `<rect x="${x - 1.3}" y="-10.5" width="2.6" height="3.2" fill="#2a2216"/><rect x="${x - 1.3}" y="-5.4" width="2.6" height="3.2" fill="#2a2216"/>`).join("");
const MAN = GG.pin(`<svg width="${120 * KM}" height="${90 * KM}" viewBox="-60 -55 120 90" style="display:block;overflow:visible">
  <defs><filter id="fmsh" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2"/></filter>
   <radialGradient id="fmy" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#c2ad74"/><stop offset="1" stop-color="#97834e"/></radialGradient></defs>
  <ellipse cx="2" cy="6" rx="${RX + 8}" ry="${RY + 7}" fill="rgba(30,26,10,.28)" filter="url(#fmsh)"/>
  <path class="ditch" d="${DITCH}" fill="none" stroke="#2c2412" stroke-width="3.4" stroke-linecap="round" opacity=".9"/>
  <ellipse class="yard" cx="0" cy="0" rx="${RX - 3}" ry="${RY - 2}" fill="url(#fmy)"/>
  <pattern id="fmhp" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)"><rect x="0" y="0" width="1.2" height="5" fill="#2c57b7"/></pattern>
  <ellipse class="hyard" cx="0" cy="0" rx="${RX + 4}" ry="${RY + 3}" fill="url(#fmhp)" opacity="0"/>
  <g class="pback"><path d="${BACK}" fill="none" stroke="#5e4a26" stroke-width="5.6" stroke-linecap="round"/><path d="${BACK}" fill="none" stroke="#b39a62" stroke-width="3" stroke-linecap="round" transform="translate(0,-1.6)"/></g>
  <g class="house">
   <rect x="-17" y="-14" width="34" height="15" fill="#d8ccae" stroke="#3a2c18" stroke-width=".8"/>${WINS}
   <rect x="-1.8" y="-4.2" width="3.6" height="5.2" fill="#4a3620"/>
   <g class="roof"><path d="M-19 -14 L-12 -24 L12 -24 L19 -14 Z" fill="#6c5a44" stroke="#2a2014" stroke-width=".8"/>
    <path d="M-15.5 -18 L15.5 -18 M-13.5 -21 L13.5 -21" stroke="#4e4030" stroke-width=".5"/>
    <path class="gable" d="M12 -24 L19 -14 L12 -14 Z" fill="#c8bc9e" stroke="#2a2014" stroke-width=".6"/></g>
   <rect x="-9" y="-28" width="3" height="5" fill="#7a3a28" stroke="#2a1a10" stroke-width=".5"/><rect x="6" y="-28" width="3" height="5" fill="#7a3a28" stroke="#2a1a10" stroke-width=".5"/>
   <g class="char" opacity="0"><path d="M-12 -24 L12 -24 L19 -14 L-19 -14 Z" fill="#2a1c12"/><path d="M-8 -22 L-4 -16 M2 -23 L5 -15 M9 -22 L12 -16" stroke="#ff7a1e" stroke-width=".8" opacity=".8"/></g>
  </g>
  <g class="pole"><rect x="-27.6" y="-36" width="1.1" height="30" fill="#3a2614"/><g class="ujack"><rect x="-26.5" y="-35.5" width="12" height="7.4" fill="#1f3a8a" stroke="#f3eee2" stroke-width=".5"/>
    <path d="M-26.5 -35.5 L-14.5 -28.1 M-14.5 -35.5 L-26.5 -28.1" stroke="#f3eee2" stroke-width="1.5"/><path d="M-26.5 -35.5 L-14.5 -28.1 M-14.5 -35.5 L-26.5 -28.1" stroke="#c4121f" stroke-width=".6"/>
    <path d="M-20.5 -35.5 L-20.5 -28.1 M-26.5 -31.8 L-14.5 -31.8" stroke="#f3eee2" stroke-width="2.2"/><path d="M-20.5 -35.5 L-20.5 -28.1 M-26.5 -31.8 L-14.5 -31.8" stroke="#c4121f" stroke-width="1.2"/></g>
    <g class="wflag"><path d="M-26.5 -35.5 C-22.5 -37 -18.5 -34 -14.6 -35.2 L-14.6 -28.2 C-18.5 -27 -22.5 -29.6 -26.5 -28 Z" fill="#f7f4ec" stroke="#6a6250" stroke-width=".5"/></g></g>
  <g class="pfront"><path d="${FRONTP}" fill="none" stroke="#5e4a26" stroke-width="6" stroke-linecap="round"/><path d="${FRONTP}" fill="none" stroke="#c4ab70" stroke-width="3.2" stroke-linecap="round" transform="translate(0,-1.8)"/></g>
  <g class="rfig" opacity="0">${[-8, -2, 4, 10].map((x, i) => `<g class="rf" transform="translate(${x},${-24 + (i % 2) * 2.5})"><circle cx="0" cy="-5.2" r="1.3" fill="#e8c8a8" stroke="#2a1a10" stroke-width=".3"/><path d="M-1.5 -4 L1.5 -4 L1.6 0 L-1.6 0 Z" fill="#c4121f" stroke="#3a0a08" stroke-width=".35"/></g>`).join("")}</g>
</svg>`, H[0], H[1] + 6, {});
now(MAN);
const MSV = MAN.querySelector("svg");
const DL = (el) => { const L = el.getTotalLength ? el.getTotalLength() : 300; return L; };
// the works are drawn on their words: the ditch on "a trench", the parapet on "a high wall of earth"
{ const d = MSV.querySelector(".ditch"); const L = 2 * Math.PI * (RX + 6); gsap.set(d, { strokeDasharray: L, strokeDashoffset: L });
  tl.to(d, { strokeDashoffset: 0, duration: 1.4, ease: "power1.inOut" }, T_TRENCH + 0.1); SFX("tick", T_TRENCH + 0.2); }
gsap.set([MSV.querySelector(".pback"), MSV.querySelector(".pfront")], { autoAlpha: 0 });
tl.fromTo([MSV.querySelector(".pback"), MSV.querySelector(".pfront")], { autoAlpha: 0, y: 3 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power2.out", immediateRender: false }, T_WALL + 0.1);
SFX("hit", T_WALL + 0.5);
gsap.set(MSV.querySelector(".wflag"), { autoAlpha: 0 });
// the garrison inside the works (red, frame 0; no name, no number until spoken)
UNIT("gar", "british", SV(0, 10), "infantry", { ech: "" });
// ---------------------------------------------------------------------------------------------------------------------------------
// m3-7: the blue columns ride in on the farm road from the south-east and take post round the hill
// ---------------------------------------------------------------------------------------------------------------------------------
const RD = [[1640, 930], [1580, 880], [1530, 840], [1490, 808], [1462, 782]];
UNIT("b1", "allies", RD[2], "cavalry", { ech: "" });
UNIT("b2", "allies", RD[1], "infantry", { ech: "" });
UNIT("b3", "allies", RD[0], "infantry", { ech: "" });
SIDEFLAG("sc", [1530, 872]);
march("b1", [RD[2], RD[3], [1470, 770], [1452, 742]], 0.1, T_FM + 1.0, { dustSize: 30, dustOp: 0.38 });
march("b2", [RD[1], RD[2], RD[3], [1440, 800], [1405, 790]], 0.2, T_FM + 1.6, { dustSize: 30, dustOp: 0.38 });
march("b3", [RD[0], RD[1], [1500, 840], [1420, 830], [1345, 772]], 0.3, T_TRENCH + 0.4, { dustSize: 30, dustOp: 0.38 });
PLACE_LABEL("Fort Motte", H, T_FM + 0.1, { dy: -170, size: 26 });
// "a big new mansion on a hill": the house pulses; "into a fortress": the garrison glows
tl.fromTo(MSV.querySelector(".house"), { scale: 1 }, { scale: 1.1, transformOrigin: "50% 100%", duration: 0.3, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, T_MANSION + 0.1);
PULSE("gar", T_FORT + 0.1, 1.3);
// "The owner, the widow Rebecca Motte": a cream figure + name tag at the house; "had been sent to live in an old farmhouse nearby": she walks there
const RM = GG.pin(`<div style="position:relative;width:0;height:0"><div style="position:absolute;left:-6px;top:-6px;width:12px;height:12px;border-radius:50%;background:#efe3c4;border:2px solid #3a2c18;box-shadow:0 0 3px rgba(0,0,0,.8)"></div>
  <div class="rmt" style="position:absolute;left:0;top:10px;transform:translateX(-50%);white-space:nowrap;font-family:Oswald;font-weight:700;font-size:19px;letter-spacing:.06em;color:#f7f3ea;background:#6e5a32;border:1px solid #e8cf8a;border-radius:3px;padding:1px 9px">REBECCA MOTTE</div></div>`,
  ...SV(-24, 6), { t: T_REB - 0.05, pop: true });
pinS(RM); SFX("hit", T_REB + 0.1);
{ const W = [SV(-24, 6), SV(20, 32), LYT(33.758, -80.662), [FARM[0] - 4, FARM[1] + 8]];
  for (let k = 1; k < W.length; k++) tl.to(RM, { left: W[k][0], top: W[k][1], duration: (T_FARM + 1.0 - T_SENT) / (W.length - 1), ease: "none" }, T_SENT + 0.1 + (k - 1) * (T_FARM + 1.0 - T_SENT) / (W.length - 1));
  tl.to(RM.querySelector(".rmt"), { autoAlpha: 0, duration: 0.4 }, T_GREENE + 0.6); }
ICON(`<svg width="54" height="54" viewBox="-20 -20 40 40" style="display:block;overflow:visible"><circle r="15" fill="none" stroke="#e8cf8a" stroke-width="2.4" opacity=".9"/></svg>`, [FARM[0], FARM[1] - 2], T_FARM + 0.1, T_FARM + 1.8);
// "This time Greene had sent a six-pounder": the kit gun box rolls in on Marion's side (NE of the works, on the hill)
const GUN = [1452, 698];
UNIT("gun", "allies", [1500, 742], "artillery", { ech: "", t: T_SIX - 0.1, name: "SIX-POUNDER", nameAt: T_SIX + 0.05 });
march("gun", [[1500, 742], [1478, 718], GUN], T_SIX + 0.1, 1.4, { dustSize: 24, dustOp: 0.3 });
SFX("hit", T_SIX + 0.15);
tl.to(B.units.gun.el.querySelector(".tag"), { autoAlpha: 0, duration: 0.4 }, T_RAW);
// "but there was no time for a siege": stamp
wstampL("NO TIME FOR A SIEGE", 1290, 850, T_NOTIME + 0.05, T_RAW + 0.4, null, 30);
// "Lord Rawdon had abandoned Camden and was marching to the rescue": pull back; the red column comes down from the top edge (Camden is ~50 km N)
const RW = [[2310, 250], [2280, 320], [2245, 380], [2210, 420], [2190, 440]];
UNIT("raw", "british", RW[0], "infantry", { ech: "XX", t: T_RAW + 0.3 });
UNIT("raw2", "british", [2340, 170], "cavalry", { ech: "", t: T_CAMDEN + 0.4 });
BANNER("rawdon", "Lord Rawdon", "gb", "raw", T_RAW + 0.6, { side: "west", until: T_HARD + 0.6 });
PLACE_LABEL("&#9650; Camden", [2330, 70], T_CAMDEN + 0.1, { dy: 0, dx: -230, size: 26 });
march("raw", RW, T_CAMDEN + 0.3, T_FIRES - T_CAMDEN, { dustSize: 70, dustOp: 0.45 });
march("raw2", [[2340, 170], [2310, 250], [2280, 320], [2250, 370]], T_CAMDEN + 0.8, T_FIRES - T_CAMDEN - 0.4, { dustSize: 70, dustOp: 0.45 });
ARWC({ pts: [[2330, 30], [2300, 200], [2200, 440], [2030, 600]], side: "rome", t: T_RESCUE + 0.05, dur: 1.4, width: AW(CW[2], 11) }, "#e0473f", "rgba(255,236,230,.9)");
// "On the night of the eleventh of May, the defenders could see his campfires across the river": glows on the hills east of the Wateree
const FIRES = [[2130, 500], [2180, 520], [2232, 500], [2160, 560], [2266, 470], [2104, 548]];
FIRES.forEach((p, k) => { bonfire(p[0], p[1], T_FIRES + 0.05 + k * 0.18, T_LEE + 1.2, 30); fireGlowS(p[0], p[1], 46, T_FIRES + 0.1 + k * 0.18, T_LEE + 1.2); });
tl.fromTo(B.units.gar.el.querySelector(".blk"), { filter: "drop-shadow(0 0 0px rgba(255,200,120,0))" }, { filter: "drop-shadow(0 0 16px rgba(255,200,120,.95))", duration: 0.5, yoyo: true, repeat: 3, ease: "sine.inOut", immediateRender: false }, T_SEE + 0.1);
{ const ln = document.createElementNS(NSs, "path"); ln.setAttribute("d", `M${H[0] + 30} ${H[1] - 12} Q${(H[0] + 2140) / 2} ${H[1] - 260} 2120 ${500}`);
  Object.entries({ fill: "none", stroke: "#ffd890", "stroke-width": 2.6, "stroke-dasharray": "8 8", opacity: 0 }).forEach(([k, v]) => ln.setAttribute(k, v)); OVL.appendChild(ln);
  tl.to(ln, { opacity: 0.85, duration: 0.5 }, T_ACROSS - 0.1); tl.to(ln, { opacity: 0, duration: 0.6 }, T_ACROSS + 2.4); }
// ---------------------------------------------------------------------------------------------------------------------------------
// m3-8: Lee and Mrs. Motte; the bow; noon of the 12th; the roof burns; the six-pounder; the white flag
// ---------------------------------------------------------------------------------------------------------------------------------
// "So the Americans did something hard": the blue boxes round the hill pulse
["b1", "b2", "b3"].forEach((id, k) => PULSE(id, T_HARD + 0.1 + k * 0.12, 1.25));
// "Lee went to Mrs. Motte": Lee banner; his box rides to the farmhouse
march("b1", [[1452, 742], [1478, 760], [FARM[0] + 22, FARM[1] - 6]], T_LEE + 0.1, 1.4, { trail: false, dustSize: 24, dustOp: 0.3 });
BANNER("lee", "Henry Lee", "us", "b1", T_LEE + 0.2, { side: "east", pop: 1.4, bright: 1.18 });
tl.to(RM, { autoAlpha: 1, duration: 0.3 }, T_LEE);
// "told her that her house had to burn": the mansion flickers warm (what is coming)
tl.fromTo(MSV.querySelector(".roof"), { filter: "brightness(1)" }, { filter: "brightness(1.8) sepia(.6)", duration: 0.35, yoyo: true, repeat: 3, ease: "sine.inOut", immediateRender: false }, T_BURN + 0.2);
B.caption("BY LEE'S ACCOUNT", T_ACC, T_ACC + 3.2);
// "she brought him a bow and arrows": the bow icon at the farmhouse goes to Lee's box
const BOW = `<svg width="56" height="56" viewBox="-14 -14 28 28" style="display:block;overflow:visible;filter:drop-shadow(0 1px 2px rgba(0,0,0,.85))">
  <path d="M-6 -12 C6 -8 6 8 -6 12" fill="none" stroke="#f0e2c0" stroke-width="4" stroke-linecap="round"/><path d="M-6 -12 C6 -8 6 8 -6 12" fill="none" stroke="#8a5a2a" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M-6 -12 L-6 12" stroke="#f3eee2" stroke-width=".9"/><path d="M-11 0 L8 0" stroke="#f0e2c0" stroke-width="1.6"/><path d="M8 0 L4 -2.5 L4 2.5 Z" fill="#d9dde2" stroke="#2a2420" stroke-width=".5"/></svg>`;
const BW = ICON(BOW, [FARM[0] - 4, FARM[1] - 16], T_BOW + 0.05, T_ROOF + 0.2, { hit: true });
tl.to(BW, { left: FARM[0] + 18, top: FARM[1] - 22, duration: 0.8, ease: "sine.inOut" }, T_BOW + 1.2);
tl.to(RM, { autoAlpha: 0, duration: 0.4 }, T_NOON);
// "At about noon on the twelfth of May, under a scorching sun": a slow warm glint sweeps the hill (light only)
{ const g = pinS(GG.pin(`<div style="width:520px;height:520px;border-radius:50%;background:radial-gradient(circle,rgba(255,236,170,.32) 0%,rgba(255,210,120,.14) 40%,rgba(255,200,100,0) 70%);mix-blend-mode:screen"></div>`, H[0] + 10, H[1] - 10, {}));
  tl.fromTo(g, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2, immediateRender: false }, T_SUN); tl.to(g, { autoAlpha: 0, duration: 1.5 }, T_CLIMB); }
// "the dry shingle roof caught fire": three fire arrows arc from Lee's men onto the roof
const ROOF = [SV(-6, -20), SV(2, -21), SV(9, -20)];
const ARCF = (a, b, t, h) => { const p = document.createElementNS(NSs, "path"), m = [(a[0] + b[0]) / 2, Math.min(a[1], b[1]) - h];
  p.setAttribute("d", `M${a[0]} ${a[1]} Q${m[0]} ${m[1]} ${b[0]} ${b[1]}`); Object.entries({ fill: "none", stroke: "#ffcf7a", "stroke-width": 1.5, "stroke-linecap": "round" }).forEach(([k, v]) => p.setAttribute(k, v)); OVL.appendChild(p);
  const L = p.getTotalLength(); gsap.set(p, { strokeDasharray: L, strokeDashoffset: L, opacity: 0 });
  tl.set(p, { opacity: 0.95 }, t); tl.to(p, { strokeDashoffset: 0, duration: 0.6, ease: "none" }, t); tl.to(p, { opacity: 0, duration: 0.5 }, t + 0.9);
  const f = pinS(GG.pin(`<div style="width:24px;height:24px;border-radius:50%;background:radial-gradient(circle,#fff3b0 0%,#ffa030 45%,rgba(255,80,0,0) 75%)"></div>`, a[0], a[1], {}));
  tl.set(f, { autoAlpha: 1 }, t); const n = 12; for (let k = 1; k <= n; k++) { const u = k / n, x = (1 - u) * (1 - u) * a[0] + 2 * u * (1 - u) * m[0] + u * u * b[0], y = (1 - u) * (1 - u) * a[1] + 2 * u * (1 - u) * m[1] + u * u * b[1];
    tl.to(f, { left: x, top: y, duration: 0.6 / n, ease: "none" }, t + (k - 1) * 0.6 / n); } tl.to(f, { autoAlpha: 0, duration: 0.3 }, t + 0.65); };
const SHOOT_FROM = [[1442, 760], [1448, 766], [1436, 768]];
ROOF.forEach((r, k) => ARCF(SHOOT_FROM[k], r, T_ROOF + 0.1 + k * 0.4, 26));
// the roof burns: flames along the roof, the char spreads, a glow + smoke column
const T_IGN = T_ROOF + 0.9;
const FLAME = (k) => `<div><svg width="${26 * k}" height="${32 * k}" viewBox="-11 -16 22 26" style="display:block;overflow:visible;filter:drop-shadow(0 0 5px rgba(255,140,40,.9))"><path d="M0 -15 C6 -7 9 -2 7 4 C5 9 -5 9 -7 4 C-9 -2 -4 -6 -2 -11 C-1 -6 1 -4 2 -6 C3 -9 1 -12 0 -15 Z" fill="#ff8a1e" stroke="#7a1d05" stroke-width="1.2"/><path d="M0 -6 C3 -2 4 1 2 4 C0 6 -3 5 -3 2 C-3 -1 -1 -3 0 -6 Z" fill="#ffe08a"/></svg></div>`;
const FL = [];
[[...SV(-4, -21), 0, 1.2], [...SV(4, -22), 0.35, 1.4], [...SV(11, -19), 0.7, 1.1], [...SV(-11, -18), 1.2, 1.05], [...SV(15, -16), 1.6, 0.9]].forEach(([x, y, d, k]) => {
  const el = GG.pin(FLAME(k), x, y, {}); pinS(el); FL.push(el);
  tl.fromTo(el, { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(2)", immediateRender: false }, T_IGN + d);
  tl.to(el.querySelector("svg"), { scaleY: 1.18, transformOrigin: "50% 100%", duration: 0.28, yoyo: true, repeat: 24, ease: "sine.inOut" }, T_IGN + d + 0.4); });
tl.to(MSV.querySelector(".char"), { opacity: 0.7, duration: 2.5 }, T_IGN + 0.2);
const RGLOW = fireGlowS(...SV(2, -20), 36, T_IGN + 0.1, null);
{ const s0 = SV(0, -26); smoke([[s0[0], s0[1]], [s0[0] + 4, s0[1] - 12], [s0[0] + 9, s0[1] - 24], [s0[0] + 14, s0[1] - 36]], T_IGN + 0.5, 1.2);
  smoke([[s0[0] + 6, s0[1] - 2], [s0[0] + 11, s0[1] - 16], [s0[0] + 17, s0[1] - 30], [s0[0] + 22, s0[1] - 44]], T_CLIMB + 0.2, 1.2); }
SFX("hit", T_CAUGHT + 0.1);
// "When British soldiers climbed up to tear the burning shingles away": red figures on the roof
const RFIG = MSV.querySelector(".rfig");
tl.fromTo(RFIG, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", immediateRender: false }, T_CLIMB + 0.2);
tl.fromTo(RFIG.querySelectorAll(".rf"), { rotation: -8 }, { rotation: 8, transformOrigin: "50% 100%", duration: 0.25, yoyo: true, repeat: 7, stagger: 0.07, immediateRender: false }, T_TEAR);
// "the six-pounder drove them off the roof": the gun fires ONCE (visible: flash, shot arc, impact on the gable; locked K.gun / K.impact sound)
const GABLE = SV(15, -18);
shoot([GUN[0] - 6, GUN[1] - 2], GABLE, T_GUN + 0.15, { dur: 0.5, width: 1.0, h: 10, r: 6 });
smoke([[GUN[0] - 8, GUN[1] - 6], [GUN[0] - 12, GUN[1] - 10]], T_GUN + 0.2, 0.9);
PULSE("gun", T_GUN + 0.12, 1.25);
tl.to(RFIG, { opacity: 0, y: 8, duration: 0.35, ease: "power2.in" }, T_GUN + 0.72);
// "Soon, a white flag went up": the Union flag comes down, the white flag goes up
tl.to(MSV.querySelector(".ujack"), { y: 10, autoAlpha: 0, duration: 0.35 }, T_WHITE - 0.1);
tl.fromTo(MSV.querySelector(".wflag"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out", immediateRender: false }, T_WHITE + 0.2);
SFX("hit", T_WHITE + 0.6); K.shake(T_WHITE + 0.6, 3, 0.25);
// the fire is put out after the surrender (both sides fought it): flames die down through m3-9's opening
FL.forEach((el, k) => tl.to(el, { autoAlpha: 0, duration: 1.4 }, T_150 + 0.4 + k * 0.2)); tl.to(RGLOW, { autoAlpha: 0, duration: 1.6 }, T_150 + 0.5);
// ---------------------------------------------------------------------------------------------------------------------------------
// m3-9: surrender, FORM 1 hatching, result card; dinner; Marion keeps the Loyalist safe
// ---------------------------------------------------------------------------------------------------------------------------------
const PRIS = [1376, 790];
march("gar", [SV(0, 10), SV(4, 30), PRIS], T_150 + 0.2, 1.6, { trail: false, dust: false });
tl.to(B.units.gar.el.querySelector(".blk"), { backgroundColor: "#77746c", duration: 0.6 }, T_150 + 1.2);
HATCH([[H[0] - 96, H[1] + 4], [H[0] - 60, H[1] - 30], [H[0], H[1] - 40], [H[0] + 46, H[1] - 26], [H[0] + 66, H[1] + 4], [H[0] + 54, H[1] + 50],
  [H[0] + 6, H[1] + 64], [H[0] - 60, H[1] + 50]], "allies", T_150 + 0.3, { hold: 2.6 });
tl.to(MSV.querySelector(".hyard"), { opacity: 0.75, duration: 0.5 }, T_150 + 0.3); tl.to(MSV.querySelector(".hyard"), { opacity: 0, duration: 0.8, ease: "sine.inOut" }, T_150 + 3.4);
let CC;
{ const row = (flag, side, txt, col) => `<div class="cr" style="display:flex;align-items:center;gap:20px;margin-top:10px"><img src="assets/media/${flag}" alt="" style="height:40px;border:1px solid #f7f3ea">
    <div style="font-size:38px;letter-spacing:.1em;min-width:250px">${side}</div><div style="font-size:46px;color:${col};letter-spacing:.04em">${txt}</div></div>`;
  CC = scr0(`<div style="padding:20px 50px 24px;background:rgb(18,16,12);border-top:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;box-shadow:0 20px 44px rgba(0,0,0,.6)">
    <div style="font-size:26px;letter-spacing:.34em;color:#d8c9a3;text-align:center">FORT MOTTE &middot; 12 MAY 1781</div>
    ${row("gb_flag_1606.png", "BRITISH", "~150 PRISONERS", "#ff8a80")}
    <div class="cr" style="margin-top:14px;text-align:center;font-size:40px;letter-spacing:.2em;color:#c9b48a">NO BLOOD SHED</div></div>`,
    "left:0;right:0;top:700px;display:flex;justify-content:center;transform-origin:50% 30%;");
  const rows = CC.querySelectorAll(".cr"); gsap.set(rows[1], { autoAlpha: 0 });
  slam(CC, T_150 - 0.05, { from: 1.4, shake: 3 });
  tl.fromTo(rows[1], { autoAlpha: 0, scale: 1.3 }, { autoAlpha: 1, scale: 1, duration: 0.25, ease: "power3.in", immediateRender: false }, T_BLOOD); SFX("hit", T_BLOOD + 0.22);
  tl.to(CC, { autoAlpha: 0, duration: 0.4 }, T_DINNER - 0.1); }
// "Mrs. Motte then served dinner to the officers of both sides": she is back at the farmhouse; a red and a blue officer mark go to her table
tl.to(RM, { autoAlpha: 1, duration: 0.3 }, T_DINNER - 0.2);
const TABLE = `<svg width="58" height="44" viewBox="-16 -12 32 24" style="display:block;overflow:visible;filter:drop-shadow(0 1px 2px rgba(0,0,0,.85))">
  <ellipse cx="0" cy="2" rx="14" ry="6" fill="#8a6238" stroke="#f0e2c0" stroke-width="1.4"/><ellipse cx="-6" cy="1" rx="3.2" ry="1.6" fill="#f3eee2" stroke="#6a6250" stroke-width=".4"/>
  <ellipse cx="5" cy="3" rx="3.2" ry="1.6" fill="#f3eee2" stroke="#6a6250" stroke-width=".4"/><rect x="-1" y="-4" width="2" height="5" fill="#d8c08a" stroke="#5a4a2a" stroke-width=".3"/></svg>`;
ICON(TABLE, [FARM[0] - 2, FARM[1] - 20], T_DINNER + 0.05, T_MIL + 0.2, { hit: true });
{ const o1 = DOT([PRIS[0] + 6, PRIS[1] - 4], "#c4121f", T_BOTH - 0.2, 3.2, T_MIL + 0.4), o2 = DOT([1404, 790], "#1f4fc4", T_BOTH - 0.1, 3.2, T_MIL + 0.4);
  tl.to(o1, { left: FARM[0] - 10, top: FARM[1] - 10, duration: 1.4, ease: "sine.inOut" }, T_BOTH);
  tl.to(o2, { left: FARM[0] + 6, top: FARM[1] - 10, duration: 1.2, ease: "sine.inOut" }, T_BOTH + 0.1); }
// "When Marion's own militia wanted to hang one of the Loyalist prisoners": Marion banner; blue militia dots close on one red prisoner
UNIT("mar", "allies", [1600, 900], "cavalry", { ech: "", t: 0.4 });
march("mar", [[1600, 900], [1500, 860], [1420, 846]], 0.4, T_TRENCH + 1.0, { dustSize: 30, dustOp: 0.38 });
BANNER("marion", "Francis Marion", "sc", "mar", T_MIL + 0.05, { side: "east" });
const LOY = [PRIS[0] - 34, PRIS[1] + 34];
const LD = DOT([PRIS[0] - 8, PRIS[1] + 4], "#c4121f", T_MIL + 0.1, 4.2);
tl.to(LD, { left: LOY[0], top: LOY[1], duration: 0.7, ease: "sine.out" }, T_MIL + 0.3);
const CROWD = [[-26, -12], [-22, 14], [0, 24], [22, 16], [26, -6], [6, -22], [-12, -26]].map((d, k) => {
  const p0 = [LOY[0] + d[0] * 2.3, LOY[1] + d[1] * 2.3], el = DOT(p0, "#1f4fc4", T_HANG - 0.2 + k * 0.05, 3.4);
  tl.to(el, { left: LOY[0] + d[0] * 0.6, top: LOY[1] + d[1] * 0.6, duration: 1.4, ease: "power2.in" }, T_HANG);
  tl.to(el, { left: LOY[0] + d[0] * 2.0, top: LOY[1] + d[1] * 2.0, duration: 1.0, ease: "power2.out" }, T_STEP + 0.5);
  return el; });
tl.fromTo(LD.firstElementChild, { boxShadow: "0 0 0px rgba(255,80,60,0)" }, { boxShadow: "0 0 12px rgba(255,80,60,.95)", duration: 0.4, yoyo: true, repeat: 3, immediateRender: false }, T_HANG + 0.4);
// "a man accused of burning his neighbors' houses": the accusation (a small burning house) over him
ICON(`<svg width="44" height="44" viewBox="-12 -14 24 24" style="display:block;overflow:visible;filter:drop-shadow(0 1px 2px rgba(0,0,0,.85))">
  <path d="M-8 8 L-8 -1 L0 -7 L8 -1 L8 8 Z" fill="#d8ccae" stroke="#2a2014" stroke-width="1.2"/><path d="M2 -9 C5 -5 7 -2 5 2 C3 5 -1 4 -1 1 C-1 -2 1 -4 2 -9 Z" fill="#ff8a1e" stroke="#7a1d05" stroke-width=".8"/></svg>`,
  [LOY[0] + 2, LOY[1] - 34], T_ACCUSED + 0.1, T_STEP + 0.6, { hit: false });
// "Marion stepped in and kept him safe": his box rides next to the prisoner; a blue ring guards him
march("mar", [[1420, 846], [LOY[0] + 34, LOY[1] + 16], [LOY[0] + 15, LOY[1] + 3]], T_STEP - 0.1, 0.9, { trail: false, dustSize: 24, dustOp: 0.3 });
ICON(`<svg width="64" height="64" viewBox="-20 -20 40 40" style="display:block;overflow:visible"><circle r="16" fill="none" stroke="#f0e6c8" stroke-width="4.2"/><circle r="16" fill="none" stroke="#2c57b7" stroke-width="2.4"/></svg>`,
  LOY, T_SAFE - 0.05, null, { hit: true });
if (GD.var.audit) LABEL_AUDIT([2, 10, 20, 30, 40, 50, 60, 70], { show: true });
}
