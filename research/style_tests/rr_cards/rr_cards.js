// R&R-STYLE CARDS (TEST round 2, 2026-11-08; research/style_tests/rr_cards/). Recreated from vidIQ's AI description of the
// Redcoats & Rebels Gettysburg video (5REtz7sDS2k) + R&R's real thumbnail (RR_CARDS_STUDY.md), adapted to our Style W rules (1c + 2d):
// nothing before the narrator says it (every line takes its own spoken-word time), one big card at a time, the date ALWAYS on screen
// (R&R's is not: a big centred date card on the date change + a small permanent date plate top-left that replaces the parchment scroll).
// Look (round 4: R&R thumbnail COLOURS): Cinzel ivory titles with a light grain + warm shadow, EB Garamond Italic sub-lines/quotes, muted-gold kickers, gold
// hairline rules + bars (red ONLY for the big quote mark), warm charcoal plates with a gold hairline border. Earlier note: gold kicker with hairlines, thin red rule / red
// bar as the only ornaments, cream/white type; map dimmed lightly (green still reads) + a feathered dark plate right behind the text;
// map pins (units, flags, portrait cards, labels) under a card's text fade out while it is up (RR.guard). No new sounds (2c.5).
// Needs (scene kit): tl, gsap, SCN, CURV (per-camera-update hook). Fonts: assets/fonts/cinzel-latin-600/700-normal.woff2,
// eb-garamond-latin-400/500-italic.woff2 (OFL, research/style_tests/rr_cards/fonts/).
// API:
//   RR.datePlate(text0)                    permanent plate top-left showing text0 (use the YEAR only until a day is spoken)
//   RR.dateRoll(text, t)                   the plate rolls to a new date at t
//   RR.dateCard({t, big, sub, plate, hold, dimEnd, top})  big date card (Antietam style) in the upper third; the plate rolls to `plate` at t
//                                          (= no two different dates), the card fades out in place after ~0.7 s
//   RR.card({t, until, items, dim})        centred statement card; items = [{k:"kick"|"title"|"line"|"sub"|"rule"|"gap", text, t, size, col}]
//                                          every item lands on its own time (default = card time)
//   RR.lower({t, until, parts:[[text, t]], kick}) lower-third statement (bottom-left warm charcoal box + gold bar), NO map dim; o.fade = fade-out
//   RR.quote({t, until, pre:[text, t], verb:[text, t], who, photo})   quote card: narrator words + the VERBATIM part with a big red
//                                          hanging opening mark, attribution with a matched gold bar, darkened portrait behind on the left
//   RR.finish()                            call once at the end of the scene (adds the pin guard tween)
const RR = ((tl, gsap, SCN, CURV) => {
  // round 4 palette = R&R's thumbnail colours (sampled: title ivory ~#e6d1b4, gold kicker/rules ~#bda98a-#c8b48e, near-black warm bg; red only as an accent)
  const C = { ivory: "#efe3c8", ivory2: "#e4d3b0", white: "#efe3c8", cream: "#efe3c8", gold: "#c8a86a", goldHi: "#ead39a", goldLo: "#9a7a3e", ink: "rgba(21,17,12,.85)",
    red: "#c62828", mute: "#cbbd9c" };
  const GOLDRULE = `linear-gradient(90deg, rgba(200,168,106,0), ${C.gold} 16%, ${C.goldHi} 50%, ${C.gold} 84%, rgba(200,168,106,0))`;
  const CAPS = '"Cinzel", "EB Garamond", Georgia, serif', ITAL = '"EB Garamond", Georgia, serif';
  { const st = document.createElement("style");
    st.textContent = `@font-face{font-family:"Cinzel";font-weight:600;src:url("assets/fonts/cinzel-latin-600-normal.woff2") format("woff2")}
@font-face{font-family:"Cinzel";font-weight:700;src:url("assets/fonts/cinzel-latin-700-normal.woff2") format("woff2")}
@font-face{font-family:"EB Garamond";font-style:italic;font-weight:400;src:url("assets/fonts/eb-garamond-latin-400-italic.woff2") format("woff2")}
@font-face{font-family:"EB Garamond";font-style:italic;font-weight:500;src:url("assets/fonts/eb-garamond-latin-500-italic.woff2") format("woff2")}
.rr-kick{display:flex;align-items:center;justify-content:center;gap:24px;font-family:${CAPS};font-weight:600;letter-spacing:.28em;color:${C.gold};text-shadow:0 2px 8px rgba(18,10,4,.8)}
.rr-kick span{margin-right:-.28em}.rr-kick i{display:block;width:80px;height:1.5px;background:linear-gradient(90deg, rgba(200,168,106,0), ${C.gold})}.rr-kick i:last-child{background:linear-gradient(90deg, ${C.gold}, rgba(200,168,106,0))}
.rr-t{font-family:${CAPS};font-weight:700;letter-spacing:.05em;line-height:1.1;color:${C.ivory};
  background-image:linear-gradient(180deg, rgba(243,233,210,.86), rgba(226,209,172,.86)), url("assets/grain.png");background-size:100% 100%, 520px auto;
  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 2px 5px rgba(24,13,4,.85))}
.rr-s{font-family:${ITAL};font-style:italic;font-weight:500;color:${C.ivory};text-shadow:0 2px 10px rgba(24,13,4,.85)}
.rr-rule{height:4px;background:${GOLDRULE};margin:20px auto 18px;width:220px}
.rr-dia{display:flex;align-items:center;justify-content:center;gap:14px;margin:16px auto 12px}.rr-dia i{display:block;width:180px;height:2px;background:linear-gradient(90deg, rgba(200,168,106,0), ${C.gold})}
.rr-dia i:last-child{background:linear-gradient(90deg, ${C.gold}, rgba(200,168,106,0))}.rr-dia b{display:block;width:11px;height:11px;background:${C.goldHi};transform:rotate(45deg);box-shadow:0 0 6px rgba(234,211,154,.5)}`;
    document.head.appendChild(st); }
  const cred = () => document.getElementById("credit");
  const add = (el, z) => { el.style.zIndex = z; SCN.insertBefore(el, cred()); gsap.set(el, { autoAlpha: 0 }); return el; };
  const fadeIn = (el, t, d = 0.35, y = 8) => tl.fromTo(el, { autoAlpha: 0, y }, { autoAlpha: 1, y: 0, duration: d, ease: "power2.out", immediateRender: false }, t);
  const pre = (el) => gsap.set(el, { autoAlpha: 0 });
  // map dim: centre ~48 %, edges ~72 % (the green still reads); k scales it (date card: light)
  const dim = (t, until, k = 1) => { const d = document.createElement("div");
    d.style.cssText = `position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 70% 65% at 50% 50%, rgba(16,11,6,${0.48 * k}) 0%, rgba(16,11,6,${0.55 * k}) 55%, rgba(8,5,2,${0.72 * k}) 100%)`;
    add(d, 60); tl.fromTo(d, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, immediateRender: false }, t - 0.05); tl.to(d, { autoAlpha: 0, duration: 0.35 }, until); return d; };
  const feather = "background:radial-gradient(ellipse closest-side at 50% 50%, rgba(18,13,8,.70) 0%, rgba(18,13,8,.66) 58%, rgba(18,13,8,0) 100%)";

  // ---------- pin guard: units / flags / portrait cards / labels under a card's text fade out while it is up ----------
  const G = [];   // [t0, t1, el]
  const ramp = (t, a, b) => (t <= a - 0.35 || t >= b + 0.35) ? 0 : t < a ? (t - a + 0.35) / 0.35 : t > b ? 1 - (t - b) / 0.35 : 1;
  const guardApply = () => { const t = tl.time(), pins = document.getElementById("pins"); if (!pins) return;
    const act = G.map(([a, b, el]) => [ramp(t, a, b), el]).filter(([k]) => k > 0).map(([k, el]) => { const r = el.getBoundingClientRect(); return [k, r]; });
    for (const p of pins.children) {
      if (p.dataset.rrf0 == null) p.dataset.rrf0 = p.style.filter || "";
      let k = 0;
      if (act.length) { let r = p.getBoundingClientRect(); if (r.width < 2 && p.firstElementChild) r = p.firstElementChild.getBoundingClientRect();
        for (const [kk, R] of act) if (r.right > R.left - 26 && r.left < R.right + 26 && r.bottom > R.top - 22 && r.top < R.bottom + 22) k = Math.max(k, kk); }
      const f = p.dataset.rrf0; p.style.filter = k > 0 ? `${f} opacity(${(1 - k).toFixed(3)})`.trim() : f; } };
  const guard = (t0, t1, el) => { G.push([t0, t1, el]); return el; };
  if (CURV) CURV.push([{ setAttribute: () => guardApply() }, 1]);
  const finish = () => { tl.to({ v: 0 }, { v: 1, duration: tl.duration() + 1, ease: "none", onUpdate: guardApply }, 0); };

  // ---------- the permanent date plate (sized to its text: only the current line is in the flow) ----------
  let plate = null, cur = null; const PH = 100;
  const plateLine = (text) => { const d = document.createElement("div"); d.className = "rr-t"; d.textContent = text;
    d.style.cssText = `position:absolute;left:30px;top:0;height:${PH}px;display:flex;align-items:center;font-size:52px;letter-spacing:.07em;white-space:nowrap`;
    plate.appendChild(d); gsap.set(d, { autoAlpha: 0, y: PH * 0.6 }); return d; };
  const datePlate = (text0) => { const sc = document.getElementById("date"); if (sc) sc.style.display = "none";
    plate = document.createElement("div");
    plate.style.cssText = `position:absolute;left:90px;top:80px;height:${PH}px;padding:0 34px 0 30px;box-sizing:border-box;overflow:hidden;background:${C.ink};
      border:1px solid rgba(200,168,106,.55);border-left:5px solid ${C.gold};box-shadow:0 10px 26px rgba(10,6,2,.5);z-index:62`;
    SCN.insertBefore(plate, cred()); cur = plateLine(text0); gsap.set(cur, { autoAlpha: 1, y: 0, position: "relative", left: 0 }); return plate; };
  const dateRoll = (text, t) => { const old = cur, nw = plateLine(text); cur = nw;   // whole roll 0.3 s
    tl.set(old, { position: "absolute", left: 30 }, t); tl.set(nw, { position: "relative", left: 0 }, t);
    tl.to(old, { autoAlpha: 0, y: -PH * 0.6, duration: 0.22, ease: "power2.in" }, t);
    tl.to(nw, { autoAlpha: 1, y: 0, duration: 0.25, ease: "power2.out" }, t + 0.05);
    tl.fromTo(plate, { borderLeftColor: C.goldHi }, { borderLeftColor: C.gold, duration: 0.6, immediateRender: false }, t); return nw; };
  // big date card, Antietam-thumbnail style: ivory day line / gold rule with a centre diamond / month-year in gold; upper third, light top dim
  const dateCard = (o) => { const t = o.t, hold = o.hold ?? 0.7, out = t + 0.35 + hold;
    const d = document.createElement("div");
    d.style.cssText = "position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg, rgba(16,11,6,.38) 0%, rgba(16,11,6,.30) 36%, rgba(16,11,6,0) 62%)";
    add(d, 60); tl.fromTo(d, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, immediateRender: false }, t - 0.05); tl.to(d, { autoAlpha: 0, duration: 0.3 }, Math.min(out, o.dimEnd ?? 1e9) - 0.3);
    const el = document.createElement("div");
    el.style.cssText = `position:absolute;left:0;right:0;top:${o.top ?? 150}px;display:flex;justify-content:center;pointer-events:none`;
    el.innerHTML = `<div class="b" style="padding:30px 130px 34px;text-align:center;${feather}"><div class="rr-t" style="font-size:118px;letter-spacing:.06em">${o.big}</div>
      <div class="rr-dia"><i></i><b></b><i></i></div>${o.sub ? `<div class="rr-kick" style="font-size:52px;color:${C.goldHi}"><span>${o.sub}</span></div>` : ""}</div>`;
    add(el, 61);
    tl.fromTo(el, { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out", immediateRender: false }, t);
    const dia = el.querySelector(".rr-dia"); gsap.set(dia, { scaleX: 0 }); tl.to(dia, { scaleX: 1, duration: 0.35 }, t + 0.12);
    if (o.plate) dateRoll(o.plate, t);   // the plate rolls at the card's start: never two different dates
    tl.to(el, { autoAlpha: 0, duration: 0.3, ease: "power2.in" }, out);
    guard(t, out, el.querySelector(".b")); return el; };

  // ---------- centred statement card ----------
  const card = (o) => { const t = o.t, until = Math.min(o.until, t + (o.max || 3.5));
    if (o.dim !== false) dim(t, until, o.dim || 1);
    const el = document.createElement("div");
    el.style.cssText = "position:absolute;left:0;right:0;top:0;bottom:0;display:flex;align-items:center;justify-content:center;pointer-events:none;transform-origin:50% 50%";
    const box = document.createElement("div"); box.style.cssText = `padding:46px 150px;text-align:center;${feather}`; el.appendChild(box);
    o.items.forEach((it) => { const d = document.createElement("div");
      if (it.k === "kick") { d.className = "rr-kick"; d.style.fontSize = (it.size || 48) + "px"; d.innerHTML = `<i></i><span>${it.text}</span><i></i>`; d.style.marginBottom = "8px"; }
      else if (it.k === "title") { d.className = "rr-t"; d.style.fontSize = (it.size || 110) + "px"; d.textContent = it.text; }
      else if (it.k === "line") { d.className = "rr-t"; d.style.fontSize = (it.size || 54) + "px"; d.style.letterSpacing = ".14em"; d.textContent = it.text; }
      else if (it.k === "sub") { d.className = "rr-s"; d.style.fontSize = (it.size || 56) + "px"; d.textContent = it.text; }
      else if (it.k === "rule") { d.className = "rr-rule"; if (it.w) d.style.width = it.w + "px"; }
      else if (it.k === "gap") { d.style.height = (it.h || 26) + "px"; }
      box.appendChild(d);
      if (it.k === "rule") { gsap.set(d, { scaleX: 0 }); tl.to(d, { scaleX: 1, duration: 0.4, ease: "power2.out" }, (it.t ?? t) + 0.2); }
      else if (it.t != null && it.t > t + 0.05) { pre(d); fadeIn(d, it.t); } });
    add(el, 61);
    tl.fromTo(el, { autoAlpha: 0, scale: 0.985 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "power2.out", immediateRender: false }, t);
    tl.to(el, { scale: 1.015, duration: Math.max(until - t - 0.45, 0.3), ease: "none" }, t + 0.45);
    tl.to(el, { autoAlpha: 0, duration: 0.3 }, until);
    guard(t, until, box); return el; };

  // ---------- lower third (no dim): warm charcoal + gold hairline + gold bar; the box comes in with its first text and is sized to what is shown ----------
  const lower = (o) => { const t = o.t, until = Math.min(o.until, t + 3.5), fo = o.fade ?? 0.3;
    const el = document.createElement("div");
    el.style.cssText = `position:absolute;left:90px;bottom:96px;display:flex;align-items:stretch;background:${C.ink};border:1px solid rgba(200,168,106,.55);border-left:none;box-shadow:0 12px 30px rgba(10,6,2,.5);pointer-events:none`;
    el.innerHTML = `<div style="width:6px;flex:none;background:linear-gradient(180deg, ${C.goldHi}, ${C.gold} 40%, ${C.goldLo})"></div><div style="padding:16px 34px 18px 28px">${o.kick ? `<div class="rr-kick" style="justify-content:flex-start;font-size:${o.kickSize || 36}px;line-height:1.2;white-space:nowrap;flex:none;margin-bottom:2px"><span>${o.kick}</span></div>` : ""}
      <div class="rr-t" style="font-size:${o.size || 50}px;white-space:nowrap">${o.parts.map(([tx], i) => `<span class="p${i}">${tx}</span>`).join(" ")}</div></div>`;
    add(el, 61);
    o.parts.forEach(([, pt], i) => { if (pt != null && pt > t + 0.05) { const sp = el.querySelector(".p" + i); gsap.set(sp, { autoAlpha: 0, display: "none" });
      tl.set(sp, { display: "inline" }, pt); tl.fromTo(sp, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, immediateRender: false }, pt); } });
    tl.fromTo(el, { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: "power2.out", immediateRender: false }, t);
    tl.to(el, { autoAlpha: 0, duration: fo }, until);
    guard(t, until, el); return el; };

  // ---------- quote card ----------
  const quote = (o) => { const t = o.t, until = Math.min(o.until, t + 3.5);
    dim(t, until, 1.1);
    const el = document.createElement("div");
    el.style.cssText = "position:absolute;left:0;right:0;top:0;bottom:0;pointer-events:none";
    el.innerHTML = `${o.photo ? `<div style="position:absolute;left:150px;top:150px;width:560px;height:780px;-webkit-mask-image:radial-gradient(ellipse 50% 50% at 50% 45%, #000 50%, transparent 100%), linear-gradient(180deg, #000 38%, transparent 80%);-webkit-mask-composite:source-in;mask-image:radial-gradient(ellipse 50% 50% at 50% 45%, #000 50%, transparent 100%), linear-gradient(180deg, #000 38%, transparent 80%);mask-composite:intersect">
        <img src="${o.photo}" style="width:100%;height:100%;object-fit:cover;object-position:50% 25%;filter:grayscale(1) sepia(.15) brightness(.55) contrast(1.1);opacity:.85"></div>` : ""}
      <div class="qb" style="position:absolute;left:720px;top:50%;transform:translateY(-50%);width:1080px;padding:54px 60px 44px 180px;${feather}">
        ${o.pre ? `<div class="rr-s q0" style="font-size:${o.size || 66}px;line-height:1.18;color:${C.white}">${o.pre[0]}</div>` : ""}
        <div class="q1" style="position:relative"><div style="position:absolute;left:-166px;top:-62px;font-family:'EB Garamond',Georgia,serif;font-style:italic;font-weight:500;font-size:300px;line-height:1;color:${C.red}">&ldquo;</div>
          <div class="rr-s" style="font-size:${o.size || 66}px;line-height:1.18;color:${C.white}">${o.verb[0]}&rdquo;</div></div>
        <div class="at" style="display:flex;align-items:stretch;gap:18px;margin-top:30px"><div style="width:5px;background:linear-gradient(180deg, ${C.goldHi}, ${C.gold} 40%, ${C.goldLo})"></div><div class="rr-t" style="font-size:42px;letter-spacing:.16em;line-height:1.15;padding:2px 0">${o.who}</div></div></div>`;
    add(el, 61);
    if (o.pre && o.pre[1] > t + 0.05) { const q = el.querySelector(".q0"); pre(q); fadeIn(q, o.pre[1]); }
    if (o.verb[1] > t + 0.05) { const q = el.querySelector(".q1"); pre(q); fadeIn(q, o.verb[1]); }
    tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: "power2.out", immediateRender: false }, t);
    tl.to(el, { autoAlpha: 0, duration: 0.35 }, until);
    guard(t, until, el.querySelector(".qb")); if (o.photo) guard(t, until, el.firstElementChild); return el; };

  return { datePlate, dateRoll, dateCard, card, lower, quote, guard, finish, C };
})(tl, gsap, SCN, typeof CURV !== "undefined" ? CURV : null);
