// ================= YORKTOWN BLOCK (yorktown/kit/js/yt_block.js): 1781 helpers on top of the Style W + 2e + 2f kit =================
// Data injected by kit/build_scene.py as GD = { base, maps: {name: {zoom, origin_world_px, meters_per_px}}, bake: kit/data/<base>_bake.json,
//   places: {name: [lat, lon]}, rivers: {name: [[x, y], ...] map px of the base map} }.
// The basemap (#relief = assets/<base>_m.jpg, #relief2 = <base>_m_close.jpg) already carries the towns, carved permanent names, rut roads,
// bridges, ferries, relief and texture (kit/make_m.py). Everything below is LIVE (timeline-driven, seekable).
const YT = (() => {
  const MAPS = GD.maps, BASE = GD.base;
  const L = (la, lo, map = BASE) => { const M = MAPS[map], n = 256 * 2 ** M.zoom, [ox, oy] = M.origin_world_px;
    return [(lo + 180) / 360 * n - ox, (1 - Math.asinh(Math.tan(la * Math.PI / 180)) / Math.PI) / 2 * n - oy]; };
  return { MAPS, BASE, L };
})();
const LYT = YT.L;                                                        // LYT(lat, lon) -> map px of this scene's basemap
const LLYT = (pts) => pts.map(([a, b]) => LYT(a, b));
const PLACE = (name) => { const p = GD.places[name]; if (!p) throw new Error("unknown place " + name); return LYT(p[0], p[1]); };
const MPP = YT.MAPS[YT.BASE].meters_per_px;                              // metres per map px
const onCam = (fn) => { CURV.push([{ setAttribute: () => fn(CAM_S) }, 1]); };   // called on every camera change (lens -> curvApply)

// ---------- units (STYLE_LOCK 2d.4 + 2f.2): Style W boxes, NO flags, type symbol in the box, echelon mark above ----------
// engineers (owner, 2f.2): a white GEAR centred in the box (8 teeth, ring with a hole), undistorted (copy of the s12d_full GEAR)
const GEAR = (id) => `<defs><mask id="gm_${id}"><rect x="0" y="0" width="150" height="100" fill="#fff"/><circle cx="75" cy="50" r="9" fill="#000"/></mask></defs>
  <g mask="url(#gm_${id})" fill="#f7f3ea"><g transform="translate(75 50)"><circle r="22"/>${[...Array(8)].map((_, i) => `<rect x="-5.5" y="-31" width="11" height="12" rx="1.5" transform="rotate(${i * 45})"/>`).join("")}</g></g>`;
const SYMS = {
  cavalry: { vb: "0 0 100 100", ar: "none", svg: `<line x1="2" y1="98" x2="98" y2="2" stroke="#f7f3ea" stroke-width="8"/>` },
  engineers: { vb: "0 0 150 100", ar: "xMidYMid meet", svg: GEAR },
  supply: { vb: "8 8 84 84", ar: "xMidYMid meet", svg: `<g fill="none" stroke="#f7f3ea" stroke-width="6"><circle cx="50" cy="50" r="30"/>${[0, 45, 90, 135].map((a) => `<line x1="${50 + 30 * Math.cos(a * Math.PI / 180)}" y1="${50 + 30 * Math.sin(a * Math.PI / 180)}" x2="${50 - 30 * Math.cos(a * Math.PI / 180)}" y2="${50 - 30 * Math.sin(a * Math.PI / 180)}"/>`).join("")}</g><circle cx="50" cy="50" r="7" fill="#f7f3ea"/>` },
  ship: { vb: "0 6 100 88", ar: "xMidYMid meet", svg: `<g fill="#f7f3ea"><path d="M10 66 L90 66 L80 80 L22 80 Z"/>
    <path d="M28 62 L28 24 L44 30 L44 58 Z"/><path d="M50 62 L50 14 L68 22 L68 58 Z"/><path d="M74 62 L74 30 L86 36 L86 58 Z"/>
    <rect x="27" y="20" width="2.4" height="46"/><rect x="49" y="10" width="2.4" height="56"/><rect x="73" y="26" width="2.4" height="40"/><path d="M8 62 L26 60 L26 64 Z"/></g>` },
};
// UNIT(id, side, p, type, o): type = infantry | cavalry | engineers | artillery | supply | ship;  side = "allies"/"carth" (blue) or "british"/"rome" (red)
//   o.ech = echelon mark ("II", "X", "XX", "XXX"; "" none), o.t = drop-in time (0 = on screen at frame 0), o.name + o.nameAt = tag text + its spoken time
const SIDEK = (s) => (s === "allies" || s === "carth" || s === "blue" ? "carth" : "rome");
const UNIT = (id, side, p, type = "infantry", o = {}) => {
  U(id, SIDEK(side), p, o.name || "", o.ech ?? "X", o.t ?? 0, { icon: type === "artillery" ? "artillery" : "infantry", tagAt: o.name ? (o.nameAt ?? o.t ?? 0) : null });
  const S = SYMS[type]; if (S) { const sv = B.units[id].el.querySelector(".blk svg"); sv.setAttribute("viewBox", S.vb); sv.setAttribute("preserveAspectRatio", S.ar); sv.innerHTML = typeof S.svg === "function" ? S.svg(id) : S.svg;
    sv.style.color = SIDEK(side) === "carth" ? "#1f4fc4" : "#c4121f"; }
  const sz = B.units[id].el.querySelector(".fxk-size"); if (sz && !(o.ech ?? "X")) sz.remove();
  return id; };
// march a unit along a polyline (map px) with dust behind it (2f.5): t..t+dur
let LV = null;   // LivingW instance (living())
const march = (id, pts, t, dur, o = {}) => { along(id, pts, t, dur, o.n || 24); if (o.dust !== false && LV) LV.dust(B.units[id].el, t, t + dur, { opacity: o.dustOp ?? 0.5, size: o.dustSize ?? 60 / CAM_S, every: 0.15 }); };

// ---------- generals = banners on poles (2f.1): side colour, sepia portrait, national-flag pennant; "?" mystery banner + reveal on the spoken name ----------
// BANNER(key, name, nation, at, t, o): key = portrait key (assets/media/<key>_head.png); nation = "us" | "fr" | "gb"; at = unit id or [x, y] map px;
//   o.until (default: stays, 2d.6), o.side = up|right|left|west|ne (offset from the unit, off the action), o.myst = reveal time (banner shows "?" until then)
//   A missing portrait shows the general's initials on the cloth (image agent may still be delivering).
const BANNERS = [];
const INITIALS = (name) => "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="76" height="100" viewBox="0 0 76 100"><rect width="76" height="100" fill="#3a3326"/><text x="38" y="60" text-anchor="middle" font-family="Georgia,serif" font-size="30" font-weight="700" fill="#e8dca0">${name.split(/\s+/).filter((w) => /^[A-Z]/.test(w)).map((w) => w[0]).join("").slice(0, 3)}</text></svg>`);
const BANNER = (key, name, nation, at, t, o = {}) => {
  let host = at; if (Array.isArray(at)) host = pinS(GG.pin(`<div style="position:relative;width:0;height:0"></div>`, at[0], at[1], { t: t > 0 ? t : null })).firstElementChild;
  if (Array.isArray(at) && !(t > 0)) gsap.set(host.parentElement, { autoAlpha: 1 });
  if (Array.isArray(at)) tl.set(host.parentElement, { autoAlpha: 1 }, Math.max(0, t - 0.01));
  const ph = o.photo || PHOTO(key), flag = BN.flagFor(nation);
  const w = pinBanner(host, o.myst != null ? BN.MYST : ph, flag, o.myst != null ? (o.mystName || (nation === "gb" ? "British General" : "General")) : name, Math.max(0, t), o.until ?? null, true, o.side || "up");
  const img = w.querySelectorAll("img")[1]; img.addEventListener("error", () => { img.src = INITIALS(name); }, { once: true });
  if (!(t > 0)) now(w);
  if (o.myst != null) { BN.reveal(w, ph, name, o.myst); tl.fromTo(w.firstElementChild, { scale: 1 }, { scale: 1.2, duration: 0.25, ease: "power2.out", immediateRender: false }, o.myst);
    tl.to(w.firstElementChild, { scale: 1, duration: 0.5, ease: "power2.inOut" }, o.myst + 1.2); }
  const rec = { w, side: nation === "gb" ? "rome" : "carth", t: Math.max(0, t), until: o.until ?? 1e9 }; BANNERS.push(rec);
  FLAGS.filter((f) => f.side === rec.side).forEach((f) => { tl.to(f.el, { autoAlpha: 0, duration: 0.3 }, rec.t); if (rec.until < 1e8) tl.to(f.el, { autoAlpha: 1, duration: 0.4 }, rec.until + 0.2); });
  return w; };
// ---------- the two nation flags (48 px behind each side's lines; hidden while that side has a banner up: one flag per side) ----------
const FLAGS = [];
const SIDEFLAG = (nation, p, t = 0, until = null) => { const el = flagS(BN.flagFor(nation), "", p[0], p[1], t > 0 ? t : 0, until); if (!(t > 0)) now(el);
  const rec = { el, side: nation === "gb" ? "rome" : "carth" }; FLAGS.push(rec);
  BANNERS.filter((b) => b.side === rec.side).forEach((b) => { tl.to(el, { autoAlpha: 0, duration: 0.3 }, b.t); }); return el; };

// ---------- 1781 siege works (live, drawn on their spoken word) ----------
// TRENCH(pts, t, o): a parallel / approach trench dug along pts (map px): dark ditch + pale parapet thrown up toward the enemy, drawn over o.dur s
//   (o.dur default 2.0; o.face = +1 / -1 which side the parapet is on; widths constant on screen)
const TRENCH = (pts, t, o = {}) => { const g = document.createElementNS(NSs, "g"), d = "M" + pts.map((q) => q.map((v) => v.toFixed(1)).join(" ")).join(" L");
  const mk = (col, w, op, off) => { const p = document.createElementNS(NSs, "path"); p.setAttribute("d", d); Object.entries({ fill: "none", stroke: col, "stroke-linecap": "round", "stroke-linejoin": "round", opacity: op }).forEach(([k, v]) => p.setAttribute(k, v)); p.__w = w; p.__off = off; g.appendChild(p); return p; };
  const ps = [mk("#2a2312", 9, 0.6, 0), mk("#d3c290", 3.6, 0.95, (o.face ?? -1) * 4.2), mk("#33280f", 4.4, 0.95, 0)];
  OVL.appendChild(g); gsap.set(g, { opacity: 0 });
  onCam((s) => ps.forEach((p) => { p.setAttribute("stroke-width", (p.__w / s).toFixed(3)); if (p.__off) p.setAttribute("transform", `translate(${(p.__off * 0.6 / s).toFixed(3)} ${(p.__off * 0.8 / s).toFixed(3)})`); }));
  if (t > 0) { tl.set(g, { opacity: 1 }, t); let Lt = 0; for (let j = 1; j < pts.length; j++) Lt += Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]);
    ps.forEach((p) => { gsap.set(p, { attr: { "stroke-dasharray": `${Lt} ${Lt + 10}`, "stroke-dashoffset": Lt } }); tl.to(p, { attr: { "stroke-dashoffset": 0 }, duration: o.dur ?? 2.0, ease: "power1.inOut" }, t); }); }
  else gsap.set(g, { opacity: 1 });
  if (o.until != null) tl.to(g, { opacity: 0, duration: 0.6 }, o.until); return g; };
// REDOUBT(id, p, t, o): a closed earthwork (pentagonal parapet + ditch), constant ~o.px screen px (default 30); o.side colours its garrison edge
//   (rome = British held); REDOUBT_TAKEN(el, t) flips it to the allies (blue edge) on the spoken capture word
const REDOUBT = (id, p, t = 0, o = {}) => { const s = o.px || 40, col = SIDEK(o.side || "rome") === "carth" ? "#2c57b7" : "#bc2528";
  const el = pinS(GG.pin(`<svg width="${s}" height="${s}" viewBox="-20 -20 40 40" style="display:block;overflow:visible;transform:rotate(${o.rot || 0}deg);filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.55))">
    <path d="M0 -16 L15 -5 L10 14 L-10 14 L-15 -5 Z" fill="none" stroke="#2a2312" stroke-width="6.5" opacity=".55"/>
    <path d="M0 -12 L11 -4 L7 10 L-7 10 L-11 -4 Z" fill="rgba(160,140,90,.55)" stroke="#d6c693" stroke-width="3.2"/>
    <path class="rd-edge" d="M0 -12 L11 -4 L7 10 L-7 10 L-11 -4 Z" fill="none" stroke="${col}" stroke-width="1.6"/></svg>`, p[0], p[1], { t: t > 0 ? t : null }));
  if (!(t > 0)) gsap.set(el, { autoAlpha: 1 }); el.dataset.rid = id; return el; };
const REDOUBT_TAKEN = (el, t) => tl.set(el.querySelector(".rd-edge"), { attr: { stroke: "#2c57b7" } }, t);

// ---------- territory (STYLE_LOCK 2d.3 / 3b) ----------
// FORM 1: HATCH(polys, side, t, o) ink line hatching ONLY on the ground taken, in the TAKER's colour (allied gains = blue), ~3 s then dissolves.
//   polys = [[x, y], ...] or a list of them (map px); 45 deg, 2 px lines every 9 px ON SCREEN, 75 %, water cut out (assets/<base>_m_land.png)
// FORM 2: STRIPES(blueP, redP, t, o) the whole map in two-side line stripes, ~2.8 px every 14 px on screen, 95 %, ~2.5 s (0.5 in, 1.5, 0.5 out); never in the first minute
let __HID = 0;
const HATCH_LAYER = (polys, col, lw, gap, op) => { const id = "yth" + (++__HID), d = document.createElement("div");
  d.style.cssText = `position:absolute;left:0;top:0;width:2880px;height:1620px;pointer-events:none;-webkit-mask-image:url(assets/${YT.BASE}_m_land.png);mask-image:url(assets/${YT.BASE}_m_land.png);-webkit-mask-size:2880px 1620px;mask-size:2880px 1620px`;
  const P = Array.isArray(polys[0][0]) ? polys : [polys];
  d.innerHTML = `<svg width="2880" height="1620" viewBox="0 0 2880 1620" style="position:absolute;left:0;top:0;overflow:visible"><defs><pattern id="${id}" patternUnits="userSpaceOnUse" width="${gap}" height="${gap}" patternTransform="rotate(45)">
    <rect x="0" y="0" width="${lw}" height="${gap}" fill="${col}"/></pattern></defs>${P.map((pl) => `<polygon points="${pl.map((q) => q.join(",")).join(" ")}" fill="url(#${id})" opacity="${op}"/>`).join("")}</svg>`;
  WORLD.insertBefore(d, OVL); const pat = d.querySelector("pattern"), rc = d.querySelector("rect");
  onCam((s) => { pat.setAttribute("width", (gap / s).toFixed(3)); pat.setAttribute("height", (gap / s).toFixed(3)); rc.setAttribute("width", (lw / s).toFixed(3)); rc.setAttribute("height", (gap / s).toFixed(3)); });
  gsap.set(d, { autoAlpha: 0 }); return d; };
const HATCH = (polys, side, t, o = {}) => { const d = HATCH_LAYER(polys, SIDEK(side) === "carth" ? "#2c57b7" : "#bc2528", 2, 9, 0.75);
  tl.to(d, { autoAlpha: 1, duration: 0.5 }, t); tl.to(d, { autoAlpha: 0, duration: 0.8, ease: "sine.inOut" }, t + 0.5 + (o.hold ?? 2.2)); return d; };
const STRIPES = (blueP, redP, t, o = {}) => [[blueP, "#2c57b7"], [redP, "#bc2528"]].filter(([p]) => p && p.length).map(([p, c]) => { const d = HATCH_LAYER(p, c, 2.8, 14, 0.95);
  tl.to(d, { autoAlpha: 1, duration: 0.5 }, t); tl.to(d, { autoAlpha: 0, duration: 0.5 }, t + 0.5 + (o.hold ?? 1.5)); return d; });

// ---------- living map (2f.5): clouds ~10 %, water shimmer along the flow, dust (march), time-of-day light ----------
// LIVING(o) once per scene: o.clouds (0.1), o.water (true), o.light = initial preset (day | morning | afternoon | dusk | night)
const LIVING = (o = {}) => { LV = LivingW({ tl, world: WORLD, before: OVL }); LV.clouds({ n: o.n || 6, opacity: o.clouds ?? 0.1, seed: o.seed || 7 });
  if (o.water !== false) LV.water(`assets/${YT.BASE}_m_water.png`, { opacity: o.waterOp ?? 0.18, paths: o.flow || [] });
  if (o.light && o.light !== "day") LV.light(o.light, 0, { dur: 0.01, k: o.lightK ?? 0.45 }); return LV; };
const LIGHT = (preset, t, dur = 2.0, k = 0.45) => LV && LV.light(preset, t, { dur, k });   // k 0.6: the kit presets at full strength drown the map in brown
// ---------- weather (2f.6): ONLY where FACT_NOTES confirm (6-7 Oct night rain; 16-17 Oct storm from ~midnight). Visual only, no sounds ----------
let __WX = false;
const WXI = () => { if (!__WX) { W.init({ tl, key: YT.BASE + "_m", assets: "assets/wx/" }); __WX = true; } };
const RAIN = (t0, t1, k = 0.5) => { WXI(); return W.rain({ t0, t1, intensity: k }); };
const STORM = (t0, t1, k = 1.0) => { WXI(); return W.rain({ t0, t1, intensity: k, angle: 28 }); };

// ---------- names on their spoken word ----------
// RIVER(name, text, t, o): carved italic river name along GD.rivers[name] (river_label.js), ~3.5 s, beside the water (o.side, o.near, o.hw, o.s = camera scale then)
riverLabel.fontUrl = "assets/fonts/eb-garamond-latin-500-italic.woff2";
const RIVER = (name, text, t, o = {}) => { const pts = GD.rivers[name]; if (!pts) throw new Error("no river line " + name); return riverLabel(name.replace(/\W/g, "") + (++__HID), text, pts, t, { s: o.s || CAM_S, ...o, tl }); };
// PLACE_LABEL(text, p, t, o): a story place that is not a permanent town: carved-look ivory serif, ~3.5 s (1c / 2d.8), o.size 24, o.dx/o.dy screen px
{ const st = document.createElement("style"); st.textContent = `@font-face{font-family:"YT Garamond";font-weight:600;src:url("assets/fonts/eb-garamond-latin-600-normal.ttf")}
.ytpl{font-family:"YT Garamond",Georgia,serif;font-weight:600;color:#e8dca0;white-space:nowrap;letter-spacing:.22em;text-shadow:-.6px -.6px 0 rgba(60,58,40,.75),.6px .8px 0 rgba(250,248,230,.35),0 1px 2px rgba(18,16,8,.85),0 0 6px rgba(18,16,8,.45)}`; document.head.appendChild(st); }
const PLACE_LABEL = (text, p, t, o = {}) => { const el = pinS(GG.pin(`<div style="position:relative;width:0;height:0"><div class="ytpl" style="position:absolute;left:${o.dx ?? 0}px;top:${o.dy ?? -38}px;transform:translate(-50%,0) rotate(${o.rot || 0}deg);font-size:${o.size || 24}px">${text}</div></div>`, p[0], p[1], { t }));
  tl.to(el, { autoAlpha: 0, duration: 0.5 }, Math.min(o.until ?? 1e9, t + (o.hold ?? 3.5))); return el; };

// ---------- inset map: a higher-zoom basemap placed inside this one (for the one continuous zoom east -> peninsula, 1a) ----------
// INSET(map, o): assets/inset_<map>.jpg (build_scene.py --inset map) in its true place; fades in as the camera scale passes o.s0 .. o.s1
//   (defaults: the inset fills the frame at s = 0.667 * 2^(dz)); feathered edge so there is no hard frame
const INSET = (map, o = {}) => { const A = YT.MAPS[YT.BASE], M = YT.MAPS[map], k = 2 ** (A.zoom - M.zoom);
  const x = M.origin_world_px[0] * k - A.origin_world_px[0], y = M.origin_world_px[1] * k - A.origin_world_px[1], w = 2880 * k, h = 1620 * k;
  const im = document.createElement("img"); im.src = `assets/inset_${map}.jpg`; im.alt = "";
  im.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;max-width:none;opacity:0;pointer-events:none;-webkit-mask-image:radial-gradient(ellipse 50% 50% at 50% 50%,#000 72%,transparent 100%);mask-image:radial-gradient(ellipse 50% 50% at 50% 50%,#000 72%,transparent 100%)`;
  document.getElementById("relief2").after(im);
  const sFill = 0.667 / k, s0 = o.s0 ?? sFill * 0.35, s1 = o.s1 ?? sFill * 0.75;
  onCam((s) => { im.style.opacity = Math.max(0, Math.min(1, (s - s0) / (s1 - s0))).toFixed(3); }); return { el: im, box: [x, y, w, h], k }; };
