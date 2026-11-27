// TEST COPY of hook-b for the Style W borrow test (research/style_tests/stylew_borrow/NOTES.md); build with --borrow. Changes are marked BW.
// HOOK-B (hook-3, hook-4, hook-5), Francis Marion #18. THE LOCKED HOOK (STYLE_LOCK 1a: back INTO the danger, the general enters as the TURN
// with one human detail, name slam + 3 snap cuts + title; 1c clean screen; 2d/2e/2f main style via the Marion map kit).
// Build: python3 kit/build_scene.py hook-b lowcountry hook-3 hook-5 --inset santee --inset blackriver   (the insets only feed the snap-cut layers)
// hook-3 (`lowcountry` wide, frame 0 = hook-a's last frame): the militia boxes of hook-a fade (rewind); "hopeless": red posts pop up across the
//   state one by one (Camden, toward Ninety Six, Georgetown, Monck's Corner, Nelson's Ferry; unlabelled); "The British had captured ... at
//   Charleston": a blue army box in Charleston, red boxes close round it, on "captured" it is taken (fast fade) + red FORM 1 hatching + stamp
//   CAPTURED; "destroyed another at Camden": a blue army box comes down on Camden, the Camden garrison meets it (musket flashes), it is gone +
//   stamp DESTROYED; "And the man leading those seventy riders": camera in on the Santee swamp, the "?" banner on a pole; (no stamp: critic r1).
// hook-4 (the twist as action): hard cut to dark; "That spring": the date plate rolls back to SPRING 1780 (ticks); Charleston at night, besieged;
//   "in Charleston": a night vignette of a town house slams over the map (lit windows, guests); "locked his doors": a padlock slams on the door
//   (hit); "jumped": a small figure drops from the second-storey window (hit + shake); "ankle": stamp ANKLE; "Sent out of the city": the vignette
//   goes, a single blue box limps out of Charleston up the road (stop-start); "unfit": stamp UNFIT; "the surrender": the red siege boxes close
//   on the town, the garrison box goes, red hatching on Charleston.
// hook-5: hard cut back to the banner by the Santee swamp (day); "Francis Marion": BN.reveal (scale pop, hit + shake) + name card + the small
//   caption PAINTED LONG AFTER HIS DEATH under the banner (once, ~2.2 s); three snap cuts (black frame, whoosh + hit):
//   1 "he would strike only in the dark" (`santee` layer, night): riders out of the swamp onto the guard at Nelson's Ferry; stamp ONLY IN THE DARK
//   2 "a chase into the swamps" (`blackriver` layer): red cavalry chasing one blue box along the road into Ox Swamp; stamp A CHASE INTO THE SWAMPS
//   3 "take a British fort" (`santee` layer, Fort Watson): the stockade on the mound, a log tower rises beside it, fire from the tower, the fort
//     taken (blue); stamp WITHOUT FIRING A SINGLE CANNON
//   title card FRANCIS MARION / THREE GREATEST TACTICAL MOVES on "These are Francis Marion's three greatest tactical moves" (hit + shake).
{ // scene block (local names never clash with the kit)
const H3 = "hook-3", H4 = "hook-4", H5 = "hook-5";
const T_HOPE = at(H3, "hopeless", -0.15), T_BRIT = at(H3, "The British had captured"), T_CAPT = at(H3, "captured"), T_DESTR = at(H3, "destroyed another"),
  T_ATCAM = at(H3, "at Camden"), T_MAN = at(H3, "And the man"), T_WALK = at(H3, "still limping");
const T_SPRING = at(H4, "That spring"), T_INCHS = at(H4, "in Charleston"), T_HOST = at(H4, "a dinner host"), T_LOCK = at(H4, "locked his doors"),
  T_DRINK = at(H4, "guests drinking"), T_OFFICER = at(H4, "One officer"), T_JUMP = at(H4, "jumped"), T_WINDOW = at(H4, "second-story window"),
  T_ANKLE = at(H4, "ankle"), T_SENT = at(H4, "Sent out of the city"), T_UNFIT = at(H4, "unfit"), T_SURR = at(H4, "the surrender");
const T_NAME = at(H5, "His name was"), T_FM = at(H5, "Francis Marion"), T_ALIVE = at(H5, "To keep the war alive"), T_DARK = at(H5, "only in the dark"),
  T_LEAD = at(H5, "He would lead"), T_FEARED = at(H5, "most feared cavalry commander"), T_CHASE = at(H5, "a chase into the swamps"),
  T_TAKE = at(H5, "And he would take"), T_FORT = at(H5, "a British fort"), T_CANNON = at(H5, "without firing a single cannon"),
  T_THESE = at(H5, "These are"), T_FMS = at(H5, "Francis Marion's"), T_MOVES = at(H5, "three greatest tactical moves");
// ---------------------------------------------------------------------------------------------------------------------------------
// camera (one timeline-driven path; hard cuts are hidden by a black frame)
// ---------------------------------------------------------------------------------------------------------------------------------
LIVING({ clouds: 0.1 });
const SEGS = [], seg = (t0, t1, a, b, ease = "sine.inOut", path = null) => { SEGS.push({ t0, t1, a, b, e: gsap.parseEase(ease), path }); SEGS.sort((p, q) => p.t0 - q.t0); };
const camAt = (t) => { let c = SEGS[0].a;
  for (const g of SEGS) { if (t < g.t0) break; const u = g.e(Math.min(1, (t - g.t0) / Math.max(g.t1 - g.t0, 1e-3))), a = g.a, b = g.b;
    if (g.path) { const s = a[2] * (b[2] / a[2]) ** u, v = (1 / a[2] - 1 / s) / (1 / a[2] - 1 / b[2]), q = posOn(g.path, v); c = [q[0], q[1], s]; }
    else c = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]; }
  return c; };
const camKeys = () => { const ts = new Set(); for (let t = 0; t <= END + 1e-6; t += 0.05) ts.add(+t.toFixed(3));
  SEGS.forEach((g) => { ts.add(g.t0); if (g.t0 > 0.003) ts.add(+(g.t0 - 0.002).toFixed(4)); ts.add(Math.min(END, g.t1)); });
  return [...ts].filter((t) => t >= 0 && t <= END).sort((a, b) => a - b).map((t) => [t, ...camAt(t), "none"]); };
const CA = [1446, 776, 0.7548];                    // = hook-a's last camera
const CWB = [1345, 805, 0.72];                      // the whole state: Camden .. Charleston, Ninety Six side
const BANP = LYT(33.515, -80.375);                  // the "?" banner: on the edge of the Santee swamp above the Great Savannah
const CBAN = [BANP[0] + 18, BANP[1] - 10, 2.0], CBAN2 = [BANP[0] + 16, BANP[1] - 12, 2.25];
const CCH = [1565, 1320, 1.8], CCH2 = [1560, 1300, 1.72];
const T1 = T_ALIVE + 1.15, T2 = T_LEAD - 0.04, T3 = T_TAKE - 0.04, T4 = T_THESE;   // snap-cut times
seg(0, 0.2, CA, CA); seg(0.2, 2.3, CA, CWB);
seg(T_MAN, T_MAN + 2.0, CWB, CBAN, "power2.inOut");
seg(T_MAN + 2.02, T_SPRING - 0.05, CBAN, [CBAN[0] + 2, CBAN[1] - 2, CBAN[2] * 1.04]);
seg(T_SPRING, T_SENT, CCH, [CCH[0] + 3, CCH[1] + 3, CCH[2] * 1.05]);
seg(T_SENT + 0.02, T_NAME - 0.05, [CCH[0] + 3, CCH[1] + 3, CCH[2] * 1.05], CCH2);
seg(T_NAME, T1 - 0.05, CBAN2, [CBAN2[0] + 2, CBAN2[1] - 2, CBAN2[2] * 1.06]);
const C1 = [1545, 1005, 1.7], C2 = [880, 905, 1.25], C3 = [945, 345, 1.9];          // layer map px (santee / blackriver / santee)
const cseg = (t, c, until, d) => seg(t, until, c, [c[0] + d[0], c[1] + d[1], c[2] * d[2]], "sine.out");
cseg(T1, C1, T2 - 0.05, [10, -6, 1.05]); cseg(T2, C2, T3 - 0.05, [90, -15, 1.04]); cseg(T3, C3, END + 1, [4, 4, 1.06]);
camera(camKeys());
// clouds + water shimmer of `lowcountry` hidden while a snap-cut layer is up (their masks are lowcountry's)
const inCut = () => tl.time() >= T1 - 0.01;
onCam(() => { const k = inCut(); document.querySelectorAll(".lv-water,.lv-clouds,.lv-dust").forEach((l) => { l.style.visibility = k ? "hidden" : "visible"; }); });
// ---------------------------------------------------------------------------------------------------------------------------------
// date plate: 1780 (from hook-a); "That spring" -> SPRING 1780 (rolls back, ticks); back to 1780 at the name slam (the story's present)
// ---------------------------------------------------------------------------------------------------------------------------------
BW.dateNow("1780");   // BW: the pocket-watch plaque
B.date("SPRING 1780", T_SPRING + 0.05, null, 32); for (let k = 0; k < 4; k++) SFX("tick", T_SPRING + 0.1 + k * 0.13);
B.date("1780", T_NAME + 0.02, null, 32);
// ---------------------------------------------------------------------------------------------------------------------------------
// hook-3 on `lowcountry`
// ---------------------------------------------------------------------------------------------------------------------------------
SIDEFLAG("gb", LYT(32.98, -80.52), 0, T1 - 0.05); SIDEFLAG("sc", LYT(33.86, -79.55), 0, T1 - 0.05);
// hook-a's last frame: the militia risen between the rivers -> they fade (rewind to "that summer")
[[1395, 640], [1545, 820], [1700, 590], [1790, 790], [1560, 480], [1870, 655]].forEach((p, i) => { UNIT("m" + i, "allies", NUDGE(p, { s: CA[2] }), "cavalry", { ech: "" }); });
hideU(["m0", "m1", "m2", "m3", "m4", "m5"], 0.1);
// "hopeless": the British posts pop up across the state, one by one (unlabelled)
[["pK", NUDGE(LYT(34.12, -80.70)), "XX"], ["pG", NUDGE(LYT(33.43, -79.33)), "II"], ["pM", NUDGE(LYT(33.24, -80.08)), "II"],
  ["pN", NUDGE(LYT(33.40, -80.37)), "II"], ["pF", NUDGE(LYT(33.80, -80.66)), "II"]].forEach(([id, p, e], i) => UNIT(id, "british", p, "infantry", { ech: e, t: T_HOPE + 0.16 * i }));
// "captured one American army at Charleston": a blue army box in the town, red boxes close round it, it is taken
const CHS = [1600, 1452];
UNIT("bA", "allies", CHS, "infantry", { ech: "XX", t: T_BRIT });
const RING = [[1478, 1372], [1592, 1330], [1712, 1376]];
RING.forEach((p, i) => { const from = [p[0] + (p[0] - CHS[0]) * 0.9, p[1] - 90]; UNIT("rc" + i, "british", from, "infantry", { ech: "X", t: T_BRIT + 0.15 + 0.1 * i });
  B.move("rc" + i, T_BRIT + 0.5, T_CAPT - T_BRIT - 0.4, ...p); });
SFX("hit", T_CAPT + 0.05); K.shake(T_CAPT + 0.05, 3, 0.25);
tl.to(B.units.bA.el, { autoAlpha: 0, duration: 0.4 }, T_CAPT + 0.1);
const CHS_GROUND = [[1548, 1338], [1628, 1330], [1690, 1405], [1700, 1500], [1640, 1560], [1590, 1530], [1556, 1460], [1536, 1390]];   // the town + the neck
HATCH(CHS_GROUND, "british", T_CAPT + 0.15, { hold: 2.2 });
wstampL("CAPTURED", 1210, 1330, T_CAPT, T_DESTR - 0.2, null, 44);
// "destroyed another at Camden": a blue army box comes down on Camden, the garrison meets it, musket flashes, it is gone
const CAMP = LYT(34.12, -80.70);
UNIT("bB", "allies", [1210, 70], "infantry", { ech: "XX", t: T_CAPT + 1.2 });
march("bB", [[1210, 70], [1180, 120], [1150, 150]], T_CAPT + 1.4, T_DESTR - T_CAPT - 1.2, { dustSize: 70, dustOp: 0.45 });
B.move("pK", T_DESTR - 0.6, 0.7, CAMP[0] + 15, CAMP[1] - 45);
mg([CAMP[0] + 15, CAMP[1] - 45], [1150, 150], T_DESTR + 0.1, 5, 1.4 / CWB[2]);
tl.to(B.units.bB.el, { autoAlpha: 0, duration: 0.4 }, T_DESTR + 0.55);
wstampL("DESTROYED", 830, 430, T_DESTR + 0.35, T_MAN - 0.1, null, 44);
// "And the man leading those seventy riders": the "?" banner on a pole by the Santee swamp (revealed on the spoken name in hook-5)
const BAN = BANNER("marion", "Francis Marion", "sc", BANP, T_MAN + 0.25, { myst: T_FM, mystName: "?", side: "ne", pop: 1.3, bright: 1.12, until: T1 - 0.02 });   // (critic r1) no unspoken "GENERAL" plate
// (critic r1) no stamp on "still limping on an injured ankle" (the ankle detail is told, and stamped, in hook-4)
// ---------------------------------------------------------------------------------------------------------------------------------
// the hard cuts (black frame hides each camera jump)
// ---------------------------------------------------------------------------------------------------------------------------------
const scr0 = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; SCN.insertBefore(el, document.getElementById("credit")); gsap.set(el, { autoAlpha: 0 }); return el; };
const CUTB = scr0("", "inset:0;background:#030406;");
const PINS = document.getElementById("pins");
const cut = (t, o = {}) => { tl.fromTo(CUTB, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, immediateRender: false }, t - 0.06); tl.to(CUTB, { autoAlpha: 0, duration: o.slow || 0.16 }, t + 0.04);
  if (o.whoosh !== false) SFX("whoosh", t - 0.25); SFX("hit", t + 0.02); K.shake(t + 0.02, 3, 0.25); };
// ---------------------------------------------------------------------------------------------------------------------------------
// hook-4: Charleston, spring 1780, at night (besieged)
// ---------------------------------------------------------------------------------------------------------------------------------
cut(T_SPRING, { whoosh: false, slow: 0.35 });
LIGHT("night", T_SPRING - 0.01, 0.01, 0.8);
// the town before the surrender: the American garrison inside, the British siege boxes outside on the neck (rc0..rc2 already there)
tl.set(B.units.bA.el, { autoAlpha: 1 }, T_SPRING - 0.01);
tl.set(["pM", "pN", "pG", "pF"].map((id) => B.units[id].el), { autoAlpha: 0 }, T_SPRING - 0.01);
// the night vignette (screen space): a Charleston town house, lit windows, guests; the lock, the jump, the ankle
// (critic r1) painted 2e treatment: no black void (the darkened Charleston map shows round it), warm painted stucco + roof, Charleston-green
//   shutters, lit windows, filled silhouettes; the house stands over the town on the map
const VIG = scr0(`<div style="position:absolute;inset:0;background:radial-gradient(ellipse 46% 52% at 53% 58%, rgba(6,8,16,0) 0%, rgba(6,8,16,.18) 45%, rgba(4,5,10,.62) 100%)"></div>
<svg viewBox="0 0 400 280" width="760" height="532" style="position:absolute;left:586px;top:333px;overflow:visible;filter:drop-shadow(0 10px 18px rgba(0,0,0,.55))">
 <defs><filter id="hgl" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="3.2"/></filter>
  <filter id="hsoft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6"/></filter>
  <filter id="hn" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 .12  0 0 0 0 .08  0 0 0 0 .04  0 0 0 .9 -.28"/></filter>
  <linearGradient id="hwall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a87a52"/><stop offset=".55" stop-color="#8a5f3e"/><stop offset="1" stop-color="#5a3c26"/></linearGradient>
  <linearGradient id="hroof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8e4c2e"/><stop offset="1" stop-color="#4c2616"/></linearGradient>
  <radialGradient id="hlit" cx=".5" cy=".55" r=".7"><stop offset="0" stop-color="#ffe7a0"/><stop offset=".6" stop-color="#f6b955"/><stop offset="1" stop-color="#c9822e"/></radialGradient>
  <clipPath id="hclip"><path d="M96 70 L158 62 L150 64 L230 24 L310 64 L304 62 L304 246 L96 246 Z"/></clipPath></defs>
 <ellipse cx="205" cy="250" rx="150" ry="14" fill="rgba(0,0,0,.5)" filter="url(#hsoft)"/>
 ${[[176, 238], [256, 238], [230, 250]].map(([x, y]) => `<ellipse cx="${x + 13}" cy="${y}" rx="34" ry="8" fill="rgba(255,190,90,.22)" filter="url(#hsoft)"/>`).join("")}
 <g id="hpiazza"><rect x="96" y="70" width="62" height="176" fill="#2e2219"/><path d="M92 70 L160 66 L160 72 L92 74 Z" fill="#5e3a24"/>
  ${[100, 120, 140, 156].map((x) => `<rect x="${x - 1.6}" y="72" width="3.2" height="174" fill="#d4c39c" opacity=".72"/>`).join("")}
  <rect x="96" y="154" width="62" height="5" fill="#d4c39c" opacity=".55"/><rect x="96" y="240" width="62" height="6" fill="#5e4632"/></g>
 <rect x="276" y="30" width="12" height="30" fill="#5a3422" stroke="#2a160c" stroke-width="1"/>
 <path d="M150 64 L230 24 L310 64 Z" fill="url(#hroof)" stroke="#2a140a" stroke-width="1.4" stroke-linejoin="round"/>
 ${[36, 46, 56].map((y) => `<path d="M${230 - (y - 24) * 2} ${y} L${230 + (y - 24) * 2} ${y}" stroke="rgba(30,12,4,.35)" stroke-width="1"/>`).join("")}
 <rect x="158" y="62" width="146" height="184" fill="url(#hwall)" stroke="#2a1a10" stroke-width="1.4"/>
 <rect x="158" y="152" width="146" height="5" fill="#6e4a30"/>
 ${[[176, 84], [216, 84], [256, 84], [176, 176], [256, 176]].map(([x, y], i) => `<g class="hw${i}"><rect x="${x - 4}" y="${y - 4}" width="34" height="50" fill="#ffc45a" opacity=".55" filter="url(#hgl)"/>
   <rect x="${x}" y="${y}" width="26" height="42" fill="url(#hlit)" stroke="#2a1a0e" stroke-width="1.6"/><line x1="${x + 13}" y1="${y}" x2="${x + 13}" y2="${y + 42}" stroke="#8a6230" stroke-width="1"/><line x1="${x}" y1="${y + 21}" x2="${x + 26}" y2="${y + 21}" stroke="#8a6230" stroke-width="1"/>
   <rect x="${x - 9}" y="${y}" width="8" height="42" fill="#28382a" stroke="#141c14" stroke-width=".8"/><rect x="${x + 27}" y="${y}" width="8" height="42" fill="#28382a" stroke="#141c14" stroke-width=".8"/></g>`).join("")}
 ${[[186, 104], [226, 102], [236, 106], [266, 104]].map(([x, y], i) => `<g class="hg hg${i}" fill="#2a1608" opacity=".85"><ellipse cx="${x}" cy="${y}" rx="3.3" ry="3.8"/><path d="M${x - 7} ${y + 19} C${x - 7} ${y + 8} ${x - 4} ${y + 5} ${x} ${y + 5} C${x + 4} ${y + 5} ${x + 7} ${y + 8} ${x + 7} ${y + 19} Z"/></g>`).join("")}
 <rect x="216" y="184" width="28" height="62" fill="#24301f" stroke="#141a10" stroke-width="1.6"/><path d="M216 184 A14 10 0 0 1 244 184 Z" fill="url(#hlit)" opacity=".85"/><circle cx="238" cy="216" r="1.6" fill="#c9a46a"/>
 <rect x="92" y="20" width="222" height="228" clip-path="url(#hclip)" filter="url(#hn)" opacity=".9"/>
 <g id="hlock" transform="translate(230 206)"><path d="M-7 -4 L-7 -10 A7 7 0 0 1 7 -10 L7 -4" fill="none" stroke="#e8dca0" stroke-width="3"/><rect x="-10" y="-5" width="20" height="16" rx="2" fill="#c9a46a" stroke="#120c08" stroke-width="1.5"/><circle cx="0" cy="2" r="2.2" fill="#2a1a10"/></g>
 <g id="hfig" fill="#140b05"><ellipse cx="0" cy="-12" rx="3.4" ry="3.9"/><path d="M-6 6 C-6 -4 -4 -7 0 -7 C4 -7 6 -4 6 6 L3.5 6 L4.5 14 L1.5 14 L0 7 L-1.5 14 L-4.5 14 L-3.5 6 Z"/><path d="M-6 -3 L-10 3 L-8.5 4 L-5 0 Z M6 -3 L10 -8 L11.5 -7 L7 0 Z"/></g>
</svg>`, "inset:0;");
const svg = VIG.querySelector("svg"), LOCK = svg.querySelector("#hlock"), FIG = svg.querySelector("#hfig"), WIN2 = svg.querySelector(".hw2"), GUESTS = svg.querySelectorAll(".hg");
tl.to(VIG, { autoAlpha: 1, duration: 0.45 }, T_INCHS - 0.1);
// the guests sway in the lit windows (the party)
GUESTS.forEach((g, i) => tl.to(g, { x: i % 2 ? 3 : -3, duration: 0.55 + 0.1 * i, yoyo: true, repeat: Math.ceil((T_JUMP - T_INCHS) / 0.6), ease: "sine.inOut" }, T_INCHS + 0.1 * i));
svg.querySelectorAll("[class^=hw] rect:first-child").forEach((r, i) => tl.to(r, { opacity: 0.85, duration: 0.4 + 0.07 * i, yoyo: true, repeat: 18, ease: "sine.inOut" }, T_HOST + 0.1 * i));
// "locked his doors": the padlock slams on the door
gsap.set(LOCK, { autoAlpha: 0 });
tl.fromTo(LOCK, { autoAlpha: 0, scale: 2.6, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.22, ease: "power4.in", immediateRender: false }, T_LOCK);
SFX("hit", T_LOCK + 0.2); K.shake(T_LOCK + 0.2, 3, 0.25);
// "One officer": one guest steps to the upper right window; "jumped": he drops from the second-storey window, lands (hit + shake), falls over
gsap.set(FIG, { x: 268, y: 106, autoAlpha: 0 });
tl.to(svg.querySelector(".hg3"), { autoAlpha: 0, duration: 0.2 }, T_OFFICER);
tl.to(FIG, { autoAlpha: 1, duration: 0.2 }, T_OFFICER);
tl.to(WIN2.querySelector("rect:nth-child(2)"), { attr: { fill: "#3a2a18" }, duration: 0.15 }, T_JUMP - 0.1);
tl.to(FIG, { x: 296, y: 128, duration: 0.25, ease: "power1.out" }, T_JUMP);
tl.to(FIG, { y: 236, duration: 0.5, ease: "power2.in" }, T_JUMP + 0.25);
tl.to(FIG, { rotation: 74, svgOrigin: "296 236", duration: 0.25, ease: "power2.out" }, T_JUMP + 0.77);
SFX("hit", T_JUMP + 0.75); K.shake(T_JUMP + 0.75, 5, 0.3);
// "ankle": stamp ANKLE (cream on dark) beside him
{ const st = scr0(stampHTML("ANKLE", "#f0e6c8", 52, -6), "left:1190px;top:740px;");
  slam(st, T_ANKLE - 0.05, { from: 2.2, shake: 3, until: T_SENT - 0.1 }); }
tl.to(VIG, { autoAlpha: 0, duration: 0.45 }, T_SENT - 0.05);
// "Sent out of the city as unfit": a single blue box limps out of Charleston up the road (stop-start)
{ const R = GD.bake.roads.find((r) => r.id === "chs_nelson").paths[0], LIMP = sub(R, 0.02, 0.24, 30);
  UNIT("bM", "allies", LIMP[0], "infantry", { ech: "", t: 0 }); gsap.set(B.units.bM.el, { autoAlpha: 0 }); tl.to(B.units.bM.el, { autoAlpha: 1, duration: 0.3 }, T_SENT + 0.1);
  const steps = 6, t0 = T_SENT + 0.35, span = T_NAME - t0 - 0.2;
  for (let k = 0; k < steps; k++) { const a = Math.round(k * 30 / steps), b = Math.round((k + 1) * 30 / steps); along("bM", LIMP.slice(a, b + 1), t0 + k * span / steps, span / steps * 0.6, 6); } }
// "unfit": the stamp beside the limping box (critic r1), where the box is at that moment
{ const R = GD.bake.roads.find((r) => r.id === "chs_nelson").paths[0], LIMP = sub(R, 0.02, 0.24, 30), steps = 6, t0 = T_SENT + 0.35, span = T_NAME - t0 - 0.2, st = span / steps;
  const k = Math.max(0, Math.min(steps - 1, Math.floor((T_UNFIT - t0) / st))), pr = Math.max(0, Math.min(1, (T_UNFIT - t0 - k * st) / (st * 0.6)));
  const q = posOn(LIMP, (k + pr) / steps); wstampL("UNFIT", q[0] + 120 / CCH[2], q[1] - 34 / CCH[2], T_UNFIT, T_NAME - 0.2, null, 36); }
// "the surrender": the siege boxes close on the town, the garrison goes, red hatching on the town ground
RING.forEach((p, i) => B.move("rc" + i, T_SURR - 0.3, 0.7, p[0] + (CHS[0] - p[0]) * 0.35, p[1] + (CHS[1] - p[1]) * 0.35));
tl.to(B.units.bA.el, { autoAlpha: 0, duration: 0.4 }, T_SURR + 0.4);
SFX("hit", T_SURR + 0.4);
HATCH(CHS_GROUND, "british", T_SURR - 0.15, { hold: Math.max(1.0, T_NAME - T_SURR - 0.6) });   // (critic r1) up until the cut to the name (~1.9 s: the cut on "His name was" ends it)
// ---------------------------------------------------------------------------------------------------------------------------------
// hook-5: the name slam at the banner (day)
// ---------------------------------------------------------------------------------------------------------------------------------
cut(T_NAME, { whoosh: false, slow: 0.3 });
LIGHT("day", T_NAME - 0.01, 0.01);
tl.set(["bM", "rc0", "rc1", "rc2", "pK"].map((id) => B.units[id].el), { autoAlpha: 0 }, T_NAME - 0.01);
// the seventy riders by the banner
[[-30, 35], [40, 40]].forEach(([a, b], i) => { UNIT("rr" + i, "allies", [BANP[0] + a, BANP[1] + b], "cavalry", { ech: "", t: 0 }); gsap.set(B.units["rr" + i].el, { autoAlpha: 0 });
  tl.set(B.units["rr" + i].el, { autoAlpha: 1 }, T_NAME - 0.01); });
SFX("hit", T_FM + 0.05); K.shake(T_FM + 0.05, 5, 0.3);
const NAME = scr0(`<div style="padding:12px 46px 16px;background:rgb(18,16,12);border-top:7px solid #1f4fc4;color:#f7f3ea;font-family:Oswald;font-weight:700;text-align:center;box-shadow:0 16px 34px rgba(0,0,0,.6)"><div style="font-size:92px;letter-spacing:0.08em;line-height:1.1">FRANCIS MARION</div></div>`,
  "left:0;right:0;top:800px;display:flex;justify-content:center;transform-origin:50% 40%;");
// BW: the name card becomes the 3D gold title (extruded, painted bevel, shadow on the map), over the 2D map
gsap.set(NAME, { display: "none" }); BW.gold("FRANCIS MARION", T_FM - 0.12, T1 - 0.35, { y: 850, w: 1240, tGrow: T_FM + 0.7 });
const CAPDX = 130, CAPDY = -150;
// the caption on the Marion picture (MAP_BRIEF: once, here): small, under the banner, ~2.2 s
{ const el = scr0(`<div style="font-family:Oswald;font-weight:600;font-size:21px;letter-spacing:.2em;color:#efe3c8;background:rgba(21,17,12,.82);padding:5px 14px;border-left:3px solid #c8a86a">PAINTED LONG AFTER HIS DEATH</div>`, "left:0;top:0;");
  { const c = camAt(T_FM + 0.4), sx = 960 + (BANP[0] - c[0]) * c[2], sy = 540 + (BANP[1] - c[1]) * c[2]; gsap.set(el, { x: sx + CAPDX, y: sy + CAPDY }); }
  el.dataset.cap = "1"; window.__CAP = el; tl.to(el, { autoAlpha: 1, duration: 0.3 }, T_FM + 0.35); tl.to(el, { autoAlpha: 0, duration: 0.3 }, Math.min(T_FM + 2.6, T1 - 0.3)); }
// ---------------------------------------------------------------------------------------------------------------------------------
// the three snap cuts (layers of the nested maps, full frame; whoosh + hit)
// ---------------------------------------------------------------------------------------------------------------------------------
const OVL0 = [...OVL.children], PINS0 = [...PINS.children];
const hideAll = (t) => { const els = [...OVL0, ...PINS0].filter((e) => !["defs", "style"].includes(e.tagName.toLowerCase())); tl.set(els, { autoAlpha: 0 }, t - 0.01); };
const layer = (map) => { const im = document.createElement("img"); im.src = `assets/inset_${map}.jpg`; im.alt = "";
  im.style.cssText = "position:absolute;left:0;top:0;width:2880px;height:1620px;max-width:none;pointer-events:none"; WORLD.insertBefore(im, document.querySelector(".lv-water") || OVL); gsap.set(im, { autoAlpha: 0 }); return im; };
const UNITF = (id, side, p, type, o = {}) => { UNIT(id, side, p, type, { ...o, t: 0 }); const el = B.units[id].el; gsap.set(el, { autoAlpha: 0 });
  tl.set(el, { autoAlpha: 1 }, o.t); if (o.until != null) tl.set(el, { autoAlpha: 0 }, o.until); return id; };
// ---------- CUT 1 (santee layer, night): riders out of the swamp onto the guard at Nelson's Ferry ----------
hideAll(T1);
const LS1 = layer("santee"); tl.set(LS1, { autoAlpha: 1 }, T1 - 0.01); tl.set(LS1, { autoAlpha: 0 }, T2 - 0.01);
cut(T1);
LIGHT("night", T1 - 0.01, 0.01, 0.8);
UNITF("x1", "british", [1625, 1045], "infantry", { ech: "II", t: T1 - 0.02, until: T2 - 0.01 });
const R1 = [[[1380, 950], [1480, 1000], [1560, 1030]], [[1400, 1040], [1500, 1075], [1585, 1092]], [[1430, 885], [1520, 945], [1610, 985]]];
R1.forEach((P, i) => { UNITF("x" + (i + 2), "allies", P[0], "cavalry", { ech: "", t: T1 - 0.02, until: T2 - 0.01 });
  march("x" + (i + 2), P, T1 + 0.1 + 0.08 * i, T_DARK - T1 + 0.3, { trail: false, dust: false }); });
mg([1625, 1045], [1565, 1030], T_DARK + 0.15, 4, 1.3 / C1[2]);
tl.to(B.units.x1.el, { autoAlpha: 0, duration: 0.35 }, T_DARK + 0.75);
SIDEFLAG("sc", [1335, 940], T1 - 0.02, T2 - 0.01); SIDEFLAG("gb", [1700, 1000], T1 - 0.02, T2 - 0.01);   // ~48 px behind each side, not on a unit (critic r1)
wstampL("ONLY IN THE DARK", 1505, 1210, T_DARK - 0.05, T2 - 0.1, null, 36);
// ---------- CUT 2 (blackriver layer, day): Britain's most feared cavalry commander chases one blue box along the road into Ox Swamp ----------
const LB = layer("blackriver"); tl.set(LB, { autoAlpha: 1 }, T2 - 0.01); tl.set(LB, { autoAlpha: 0 }, T3 - 0.01);
cut(T2);
LIGHT("day", T2 - 0.01, 0.01);
const RD = [[424, 978], [524, 954], [634, 937], [740, 914], [856, 894], [969, 873], [1079, 854], [1194, 832], [1309, 806]];
UNITF("y0", "allies", posOn(RD, 0.42), "cavalry", { ech: "", t: T2 - 0.02, until: T3 - 0.01 });
march("y0", sub(RD, 0.42, 0.95, 20), T2 + 0.1, T3 - T2 - 0.4, { dustSize: 34, dustOp: 0.4 });
[0.22, 0.13, 0.04].forEach((f, i) => { UNITF("yr" + i, "british", posOn(RD, f), "cavalry", { ech: "II", t: T2 - 0.02, until: T3 - 0.01 });
  march("yr" + i, sub(RD, f, f + 0.48, 20), T2 + 0.25 + 0.05 * i, T3 - T2 - 0.5, { trail: i === 0, dustSize: 34, dustOp: 0.4 }); });
SIDEFLAG("gb", [395, 930], T2 - 0.02, T3 - 0.01); SIDEFLAG("sc", [1335, 765], T2 - 0.02, T3 - 0.01);
arw({ pts: sub(RD, 0.24, 0.62, 12), side: "rome", t: T_FEARED, dur: 1.2, width: 9 / C2[2] });
wstampL("A CHASE INTO THE SWAMPS", 1010, 1080, T_CHASE - 0.05, T3 - 0.1, null, 34);
// ---------- CUT 3 (santee layer, day): Fort Watson: the stockade on the mound, a log tower rises beside it, fire from the tower, taken ----------
const LS3 = layer("santee"); tl.set(LS3, { autoAlpha: 1 }, T3 - 0.01);
cut(T3);
const FW = [930, 328];
const FORT = REDOUBT("fw", FW, T3 - 0.02, { side: "british", px: 64 }); tl.set(FORT, { autoAlpha: 0 }, 0); tl.set(FORT, { autoAlpha: 1 }, T3 - 0.02);
UNITF("z0", "allies", [1030, 410], "engineers", { ech: "", t: T3 - 0.02 });
UNITF("z1", "allies", [835, 432], "cavalry", { ech: "", t: T3 - 0.02 });
UNITF("z2", "allies", [1042, 300], "infantry", { ech: "", t: T3 - 0.02 });
SIDEFLAG("sc", [1110, 365], T3 - 0.02); SIDEFLAG("gb", [FW[0] - 55, FW[1] - 62], T3 - 0.02);
// the log tower (constant on screen): rises from the ground beside the fort, log by log
const TOW = pinS(GG.pin(`<svg width="70" height="168" viewBox="0 0 46 110" style="display:block;overflow:visible;filter:drop-shadow(2px 3px 2px rgba(0,0,0,.55))">
  <g class="tw" style="transform-origin:23px 110px">${[...Array(11)].map((_, k) => `<rect x="${4 + (k % 2) * 1.5}" y="${100 - k * 9}" width="${37 - (k % 2) * 3}" height="8" rx="3" fill="${k % 2 ? "#7a5a36" : "#8e6a40"}" stroke="#2a1a0c" stroke-width="1.2"/>`).join("")}
  <rect x="2" y="4" width="42" height="6" fill="#5e4428" stroke="#2a1a0c" stroke-width="1.2"/></g></svg>`, 985, 300, {}));
gsap.set(TOW, { autoAlpha: 0 }); tl.set(TOW, { autoAlpha: 1 }, T3 - 0.02);
tl.fromTo(TOW.querySelector(".tw"), { scaleY: 0.05 }, { scaleY: 1, duration: T_CANNON - T3 - 0.4, ease: "steps(10)", immediateRender: false }, T3 + 0.2);
mg([985, 268], [FW[0] + 6, FW[1]], T_CANNON + 0.7, 5, 1.2 / C3[2]);
REDOUBT_TAKEN(FORT, T_CANNON + 1.4);
HATCH([[FW[0] - 34, FW[1] - 28], [FW[0] + 34, FW[1] - 30], [FW[0] + 36, FW[1] + 30], [FW[0] - 36, FW[1] + 28]], "allies", T_CANNON + 1.4, { hold: 1.0 });
SFX("hit", T_CANNON + 1.45);
wstampL("WITHOUT FIRING A SINGLE CANNON", 945, 520, T_CANNON - 0.05, T4 - 0.05, null, 30);
// ---------------------------------------------------------------------------------------------------------------------------------
// the title: the fort shot dims, FRANCIS MARION / THREE GREATEST TACTICAL MOVES
// ---------------------------------------------------------------------------------------------------------------------------------
const TDIM = scr0("", "inset:0;background:linear-gradient(0deg,rgba(5,7,13,0.3) 0%,rgba(5,7,13,0.72) 70%);"); SCN.insertBefore(TDIM, document.getElementById("date"));
tl.fromTo(TDIM, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, immediateRender: false }, T4);
const TITLE = scr0(`<div style="text-align:center;font-family:Oswald;font-weight:700;padding:18px 70px 24px;background:rgb(14,12,10);border-top:7px solid #c9b48a;box-shadow:0 24px 50px rgba(0,0,0,.6)">
  <div style="font-size:124px;letter-spacing:0.06em;line-height:1.05;color:#f7f3ea">FRANCIS MARION</div>
  <div class="sub" style="font-size:36px;letter-spacing:.3em;color:#c9b48a;margin-top:6px">THREE GREATEST TACTICAL MOVES</div></div>`, "left:0;right:0;top:330px;display:flex;justify-content:center;");
// BW: the title card becomes the 3D gold title + gold Cinzel subtitle on its words
gsap.set(TITLE, { display: "none" }); K.shake(T_FMS + 0.1, 6, 0.3); SFX("hit", T_FMS + 0.1);
BW.gold("FRANCIS MARION", T_FMS - 0.15, END + 5, { y: 470, w: 1420, tGrow: T_MOVES, sub: ["THREE GREATEST TACTICAL MOVES", T_MOVES] });
{ const sb = TITLE.querySelector(".sub"); gsap.set(sb, { autoAlpha: 0 }); tl.fromTo(sb, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.35, immediateRender: false }, T_MOVES); }
// BW: THE ARMIES (replaces the side-colour key plate); steps out for the title (one big thing at a time)
BW.legend(0, T4 - 0.3, [{ name: "Marion's men", sub: "South Carolina", color: "#2c57b7" }, { name: "British", sub: "and Loyalists", color: "#bc2528" }]);
BW.tilt([[0, 7, 1.1], [END, 9, 1.12]]);
}
