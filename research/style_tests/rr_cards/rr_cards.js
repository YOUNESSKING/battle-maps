// R&R-STYLE CARDS (TEST, 2026-11-08; research/style_tests/rr_cards/). Recreates the date card + statement cards of the Redcoats & Rebels
// Gettysburg video (5REtz7sDS2k) as described by vidIQ (RR_CARDS_STUDY.md), adapted to our Style W rules (1c + 2d):
//   - nothing before the narrator says it (every call takes the spoken-word time), one big card at a time, captions <= 3.5 s,
//   - the date is ALWAYS on screen: R&R's date card is NOT permanent, so here the big centred date card (on a date change) settles
//     into a small permanent date plate top-left that replaces the parchment scroll.
// Look (from the study): serif type (bold caps titles, italic mixed-case sub-lines), white/cream on deep black, a thin red rule or red
// left bar as the only ornament, amber/gold kicker with wide tracking, a giant red hanging quotation mark on verbatim quotes, the
// background darkened by a heavy radial vignette, a 0.5 s fade with a slow ~2 % push, fade out. No new sound (no ref:* sounds, 2c.5).
// Needs (from the scene kit): tl (GSAP timeline), gsap, SCN (#scene). Fonts: assets/fonts/EBGaramond-400/700.woff2 (+ system Liberation Serif italic).
// API:
//   RR.datePlate(text0)                         -> permanent plate (top-left, where the scroll was), showing text0 from frame 0
//   RR.dateRoll(text, t)                        -> the plate rolls to a new date at t (small change, e.g. the day-by-day clock)
//   RR.dateCard(text, t, hold = 1.3, o)         -> BIG centred date card at t (the date change), then flies into the plate (plate shows text)
//   RR.statement({kick, lines, sub, subT, t, until, accent})   -> centred statement card over a vignette (kicker / big serif lines / red rule / italic sub)
//   RR.quote({lines, who, whoSub, t, until, marks})            -> quote card (red hanging mark only when marks=true, i.e. verbatim)
// Every card returns its root element; cards leave at `until` (callers keep it <= t + 3.5).
const RR = ((tl, gsap, SCN) => {
  const C = { ink: "#0e0d0b", white: "#f6f1e6", cream: "#e9dfc6", amber: "#e0a24a", red: "#c62828", mute: "#b9ad93" };
  const SERIF = '"EB Garamond", "Liberation Serif", Georgia, serif', ITAL = '"Liberation Serif", "EB Garamond", Georgia, serif';
  { const st = document.createElement("style");
    st.textContent = `@font-face{font-family:"EB Garamond";font-weight:400;src:url("assets/fonts/EBGaramond-400.woff2") format("woff2")}
@font-face{font-family:"EB Garamond";font-weight:700;src:url("assets/fonts/EBGaramond-700.woff2") format("woff2")}
.rr-k{font-family:${SERIF};font-weight:700;text-transform:uppercase;letter-spacing:.34em;color:${C.amber}}
.rr-t{font-family:${SERIF};font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:${C.white};line-height:1.02;text-shadow:0 2px 14px rgba(0,0,0,.6)}
.rr-s{font-family:${ITAL};font-style:italic;font-weight:400;color:${C.cream};letter-spacing:.01em}
.rr-rule{height:3px;background:${C.red};margin:18px auto 16px;transform-origin:50% 50%}`;
    document.head.appendChild(st); }
  const cred = () => document.getElementById("credit");
  const add = (el) => { SCN.insertBefore(el, cred()); gsap.set(el, { autoAlpha: 0 }); return el; };
  // full-frame dim: heavy radial vignette (R&R darkens the art 70-85 %); our map stays visible at ~35-45 % round the card
  const dim = (t, until, k = 1) => { const d = document.createElement("div");
    d.style.cssText = `position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 62% 58% at 50% 50%, rgba(8,8,7,${0.72 * k}) 0%, rgba(8,8,7,${0.78 * k}) 55%, rgba(4,4,3,${0.90 * k}) 100%);z-index:60`; add(d);
    tl.fromTo(d, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, immediateRender: false }, t - 0.05); tl.to(d, { autoAlpha: 0, duration: 0.45 }, until); return d; };
  const enter = (el, t, until) => {   // R&R: 0.5 s fade + slow ~2 % push; fade out 0.45 s
    tl.fromTo(el, { autoAlpha: 0, scale: 0.985 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "power2.out", immediateRender: false }, t);
    tl.to(el, { scale: 1.02, duration: Math.max(until - t, 0.5), ease: "none" }, t + 0.5);
    tl.to(el, { autoAlpha: 0, duration: 0.45 }, until); return el; };
  const ruleIn = (r, t, w = 120) => { gsap.set(r, { width: w, scaleX: 0 }); tl.to(r, { scaleX: 1, duration: 0.45, ease: "power2.out" }, t); };
  const lateIn = (el, t) => { gsap.set(el, { autoAlpha: 0 }); tl.fromTo(el, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35, immediateRender: false }, t); };
  const centre = (html, top) => { const el = document.createElement("div");
    el.style.cssText = `position:absolute;left:0;right:0;${top != null ? `top:${top}px` : "top:0;bottom:0"};display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;pointer-events:none;transform-origin:50% 50%;z-index:61`;
    el.innerHTML = html; return add(el); };

  // ---------- the permanent date plate (replaces the parchment scroll; never leaves) ----------
  let plate = null, cur = null;
  const PL = { left: 90, top: 80, h: 92 };
  const datePlate = (text0) => {
    const sc = document.getElementById("date"); if (sc) sc.style.display = "none";
    plate = document.createElement("div");
    plate.style.cssText = `position:absolute;left:${PL.left}px;top:${PL.top}px;height:${PL.h}px;min-width:330px;padding:0 34px 0 30px;box-sizing:border-box;overflow:hidden;
      background:linear-gradient(90deg, rgba(14,13,11,.90) 0%, rgba(14,13,11,.80) 100%);border-left:6px solid ${C.red};box-shadow:0 10px 26px rgba(0,0,0,.45);z-index:62`;
    SCN.insertBefore(plate, cred());
    cur = plateLine(text0); gsap.set(cur, { autoAlpha: 1, y: 0 }); return plate; };
  const plateLine = (text) => { const d = document.createElement("div");
    d.className = "rr-t"; d.textContent = text;
    d.style.cssText = `position:relative;height:${PL.h}px;display:flex;align-items:center;font-size:44px;letter-spacing:.09em;white-space:nowrap;text-shadow:none;margin-bottom:-${PL.h}px`;
    plate.appendChild(d); gsap.set(d, { autoAlpha: 0, y: PL.h * 0.6 }); return d; };
  const dateRoll = (text, t) => {   // old date rolls up and out, new one rolls up into place (0.35 s), the red bar flicks amber
    const old = cur, nw = plateLine(text); cur = nw;
    tl.to(old, { autoAlpha: 0, y: -PL.h * 0.6, duration: 0.3, ease: "power2.in" }, t);
    tl.to(nw, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" }, t + 0.08);
    tl.fromTo(plate, { borderLeftColor: C.amber }, { borderLeftColor: C.red, duration: 0.6, immediateRender: false }, t);
    return nw; };
  // ---------- the BIG date card (R&R chapter date card) that settles into the plate ----------
  const dateCard = (text, t, hold = 1.3, o = {}) => {
    const until = t + hold;
    const d = dim(t, until + 0.15, o.dim ?? 0.85);
    const el = centre(`${o.kick ? `<div class="rr-k" style="font-size:26px;margin-bottom:10px">${o.kick}</div>` : ""}<div class="rr-t big" style="font-size:132px;letter-spacing:.07em">${text}</div><div class="rr-rule"></div>${o.sub ? `<div class="rr-s" style="font-size:40px">${o.sub}</div>` : ""}`);
    tl.fromTo(el, { autoAlpha: 0, scale: 0.985 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "power2.out", immediateRender: false }, t);
    tl.to(el, { scale: 1.015, duration: hold - 0.45, ease: "none" }, t + 0.45);
    ruleIn(el.querySelector(".rr-rule"), t + 0.25, 150);
    if (o.sub && o.subT != null) lateIn(el.querySelector(".rr-s"), o.subT);
    // settle: the big date flies to the plate (shrink + move to top-left) while the plate rolls to the same date
    const big = el.querySelector(".big");
    tl.to(el.querySelector(".rr-rule"), { autoAlpha: 0, duration: 0.2 }, until);
    if (o.sub) tl.to(el.querySelector(".rr-s"), { autoAlpha: 0, duration: 0.2 }, until);
    tl.to(big, { x: PL.left + 30 + 150 - 960, y: PL.top + PL.h / 2 - 540, scale: 44 / 132, transformOrigin: "50% 50%", duration: 0.5, ease: "power2.inOut" }, until);
    tl.to(el, { autoAlpha: 0, duration: 0.15 }, until + 0.42);
    dateRoll(text, until + 0.3);
    return el; };

  // ---------- statement card ----------
  // lines: [[text, t]] -> each big serif line lands on its own spoken time (first line at card time t)
  const statement = (o) => {
    const t = o.t, until = Math.min(o.until, t + 3.5);
    dim(t, until, o.dimK ?? 1);
    const size = o.size || 84;
    const html = `${o.kick ? `<div class="rr-k" style="font-size:${o.kickSize || 26}px;margin-bottom:14px;color:${o.kickCol || C.amber}">${o.kick}</div>` : ""}`
      + o.lines.map(([tx], i) => `<div class="rr-t ln${i}" style="font-size:${o.sizes?.[i] || size}px;${o.lineCol?.[i] ? `color:${o.lineCol[i]};` : ""}">${tx}</div>`).join("")
      + `<div class="rr-rule"></div>${o.sub ? `<div class="rr-s" style="font-size:${o.subSize || 38}px">${o.sub}</div>` : ""}`;
    const el = enter(centre(html, o.top), t, until);
    o.lines.forEach(([, lt], i) => { if (lt != null && lt > t + 0.05) lateIn(el.querySelector(".ln" + i), lt); });
    ruleIn(el.querySelector(".rr-rule"), t + 0.3, o.ruleW || 120);
    if (o.sub && o.subT != null) lateIn(el.querySelector(".rr-s"), o.subT);
    return el; };

  // ---------- quote card (R&R: giant red hanging quote mark, white italic serif, attribution lower-left with a red bar) ----------
  const quote = (o) => {
    const t = o.t, until = Math.min(o.until, t + 3.5);
    dim(t, until, 1);
    const el = document.createElement("div");
    el.style.cssText = "position:absolute;left:0;right:0;top:0;bottom:0;display:flex;align-items:center;justify-content:center;pointer-events:none;transform-origin:50% 50%;z-index:61";
    el.innerHTML = `<div style="position:relative;max-width:1250px;padding:0 0 0 120px">
      ${o.marks ? `<div style="position:absolute;left:-6px;top:-74px;font-family:${SERIF};font-weight:700;font-size:250px;line-height:1;color:${C.red}">&ldquo;</div>` : ""}
      ${o.photo ? `<div style="position:absolute;left:-150px;top:6px;width:150px;height:150px;border-radius:50%;overflow:hidden;border:3px solid ${C.cream};box-shadow:0 0 0 2px ${C.red}"><img src="${o.photo}" style="width:100%;height:100%;object-fit:cover;filter:grayscale(1) sepia(.25) contrast(1.05)"></div>` : ""}
      ${o.lines.map(([tx], i) => `<div class="rr-s q${i}" style="font-size:${o.size || 66}px;line-height:1.16;color:${C.white};text-shadow:0 2px 14px rgba(0,0,0,.6)">${tx}</div>`).join("")}
      <div style="display:flex;align-items:stretch;gap:16px;margin-top:30px"><div style="width:5px;background:${C.red}"></div>
        <div><div class="rr-t" style="font-size:30px;letter-spacing:.2em">${o.who}</div>${o.whoSub ? `<div class="rr-s" style="font-size:26px;color:${C.mute};margin-top:2px">${o.whoSub}</div>` : ""}</div></div></div>`;
    enter(add(el), t, until);
    o.lines.forEach(([, lt], i) => { if (lt != null && lt > t + 0.05) lateIn(el.querySelector(".q" + i), lt); });
    return el; };

  return { datePlate, dateRoll, dateCard, statement, quote, C };
})(tl, gsap, SCN);
