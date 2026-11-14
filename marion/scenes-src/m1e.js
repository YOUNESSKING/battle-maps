// M1E (m1-10, sub), Francis Marion #18, end of MOVE 1 + the subscribe bridge (1b). Main style (STYLE_LOCK 2d/2e/2f via the Marion kit), 1c, 1d cliffhanger.
// Build: python3 kit/build_scene.py m1e lowcountry m1-10 sub
// Frame 0 = cut from m1d2's last frame: the method card THE SWAMP FOX METHOD (line 1 STRIKE IN THE DARK lit) still up over the lowcountry map;
//   it leaves at once (move 1 ends on the casualty card + the method card, both shown at the end of m1d2). Date plate 25 OCTOBER 1780 (from m1d2;
//   the [MAP] line's "NOV 1780" is NOT shown: no November date is spoken here, MAP_BRIEF date rule).
// m1-10 (cliffhanger): "Cornwallis": his banner at Camden (camera pushes in on Camden). "He needed a hunter": a red cavalry box drops in at Camden;
//   "the most feared one in America": a "?" tag pops on it and it rides out of Camden down the road toward the Santee (dust).
// sub (calm, wide): "Tearcoat was only the beginning": Marion's small blue box at Tearcoat (Black River) pulses; "the best cavalry": the "?" box keeps
//   riding; "hunting only them": a thin red arrow from it toward the blue box; E.subscribe on the subscribing clause; NEXT: THE CHASE on
//   "Here's how Marion did it".
const P10 = "m1-10", PS = "sub";
const T_CORN = at(P10, "Cornwallis had seen enough"), T_HUNTER = at(P10, "He needed a hunter"), T_FEARED = at(P10, "the most feared one in America");
const T_TEAR = at(PS, "Tearcoat was only the beginning"), T_FARM = at(PS, "a band of farmers on horseback"), T_BEST = at(PS, "the best cavalry in the British army"),
  T_HUNT = at(PS, "hunting only them"), T_KIND = at(PS, "That's the kind of question"), T_SUBS = at(PS, "subscribing is how you catch"),
  T_HERE = at(PS, "Here's how Marion did it");
// ---------------------------------------------------------------------------------------------------------------------------------
LIVING({ clouds: 0.1 });
const CW = [1290, 540, 0.78], CCAM = [1170, 420, 1.12], CW2 = [1290, 520, 0.84];
camera([[0, ...CW], [T_CORN + 0.4, ...CW], [T_CORN + 2.6, ...CCAM], [T_FEARED + 1.0, ...CCAM], [T_TEAR + 0.2, 1240, 470, 1.0], [T_FARM + 1.0, ...CW2], [END, 1295, 525, 0.85]]);
dateNow("25 OCTOBER 1780");
// the method card from m1d2, on screen at frame 0, leaves at once
GG.METHOD = ["STRIKE IN THE DARK", "LET THE SWAMP FIGHT", "HIT THE CHAIN WITH THE ARMY"]; GG.METHOD_TITLE = "THE SWAMP FOX METHOD";
{ const MC = GG.method(1, 0, 0.35, [0]); MC.querySelector(".inner").style.background = "rgba(18,16,12,0.97)"; MC.style.top = "210px";
  now(MC); MC.querySelectorAll(".row.lit").forEach((r) => now(r)); }
dropCues(0, 0.3);
// ---------------------------------------------------------------------------------------------------------------------------------
const scr0 = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;" + css; el.innerHTML = html; SCN.insertBefore(el, document.getElementById("credit")); gsap.set(el, { autoAlpha: 0 }); return el; };
// a "?" tag riding on a unit box (top-right corner of the box), pops on t
const QTAG = (id, t) => { const host = B.units[id].el.firstElementChild, el = document.createElement("div");
  el.style.cssText = "position:absolute;right:-20px;top:-24px;width:30px;height:30px;border-radius:50%;background:rgb(18,16,12);border:2.5px solid #f0e6c8;color:#f0e6c8;font:700 22px/26px Oswald;text-align:center;box-shadow:0 3px 8px rgba(0,0,0,.6);z-index:4";
  el.textContent = "?"; host.appendChild(el); host.style.overflow = "visible"; gsap.set(el, { autoAlpha: 0 });
  tl.fromTo(el, { autoAlpha: 0, scale: 1.9 }, { autoAlpha: 1, scale: 1, duration: 0.22, ease: "power4.in", immediateRender: false }, t); return el; };
// ---------------------------------------------------------------------------------------------------------------------------------
// frame 0: the red post at Camden; Marion's band at Tearcoat (Black River); the two side flags
UNIT("rc", "british", NUDGE(LYT(34.20, -80.64), { s: 0.8 }), "infantry", { ech: "XX" });
UNIT("mb", "allies", NUDGE(PLACE("tearcoat_swamp"), { s: 0.8 }), "cavalry", { ech: "" });
SIDEFLAG("sc", "mb"); SIDEFLAG("gb", "rc");
// "Cornwallis had seen enough": his banner on a stake south-east of Camden (off the carved name, the hunter's road and the date plate)
BANNER("cornwallis", "Lord Cornwallis", "gb", [1450, 345], T_CORN + 0.8, { side: "up" });
// "He needed a hunter": a red cavalry box drops in at Camden; "the most feared one in America": "?" pops, it rides out toward the Santee
const RIDE = LLYT([[34.155, -80.585], [34.05, -80.55], [33.92, -80.47], [33.80, -80.40], [33.69, -80.36], [33.58, -80.33]]);
UNIT("hx", "british", RIDE[0], "cavalry", { ech: "", t: T_HUNTER + 0.3 });
QTAG("hx", T_FEARED + 0.2);
march("hx", RIDE.slice(0, 4), T_FEARED + 0.4, T_TEAR - T_FEARED + 1.4, { dustOp: 0.45 });
march("hx", RIDE.slice(3), T_TEAR + 2.0, T_HUNT - T_TEAR - 0.6, { dustOp: 0.45 });
// sub: "Tearcoat was only the beginning": Marion's box pulses; "hunting only them": thin red arrow from the hunter toward Marion's box
tl.fromTo(B.units.mb.el.firstElementChild, { scale: 1 }, { scale: 1.25, duration: 0.25, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, T_TEAR + 0.2);
arw({ pts: [RIDE[5], [RIDE[5][0] + 60, RIDE[5][1] - 40], [B.units.mb.x - 34, B.units.mb.y + 14]], side: "rome", t: T_HUNT + 0.1, dur: 1.0, width: AW(CW2[2], 9) });
// subscribe bridge (1b): the button on the subscribing clause, then NEXT: THE CHASE
E.subscribe(T_SUBS - 0.35, T_HERE + 0.1);
const NEXT = scr0(`<div style="padding:10px 26px 12px;background:rgba(14,12,10,0.92);border-left:6px solid #c9b48a;font-family:Oswald;font-weight:700;color:#f7f3ea;letter-spacing:.14em;font-size:30px;box-shadow:0 10px 24px rgba(0,0,0,.5)">
  <span style="color:#c9b48a">NEXT:</span> THE CHASE</div>`, "right:80px;bottom:156px;");
tl.fromTo(NEXT, { autoAlpha: 0, x: 60 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: "power3.out", immediateRender: false }, T_HERE + 0.6);
if (GD.var.audit) LABEL_AUDIT([2, 6, 12, 20], { show: true });
