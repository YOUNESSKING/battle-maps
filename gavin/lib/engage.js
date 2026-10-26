// Engagement beats (owner test 2026-10-14): corner subscribe button, "what would you do?" decision card, final 1-2-3 question.
// const E = EngageK(B); E.subscribe(t, until); E.decide({...}); E.final({...})
function EngageK(B) {
  const tl = B.tl, scene = document.getElementById("scene");
  const mk = (html, css) => { const el = document.createElement("div"); el.style.cssText = "position:absolute;font-family:Oswald;color:#f7f3ea;" + css;
    el.innerHTML = html; scene.insertBefore(el, document.getElementById("credit")); tl.set(el, { autoAlpha: 0 }, 0); return el; };
  const BELL = `<svg class="bell" width="40" height="40" viewBox="0 0 24 24"><path fill="#f7f3ea" d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22zm7-6V11a7 7 0 0 0-5.5-6.84V3.5a1.5 1.5 0 0 0-3 0v.66A7 7 0 0 0 5 11v5l-2 2v1h18v-1l-2-2z"/></svg>`;
  const CURSOR = `<svg class="cur" width="34" height="44" viewBox="0 0 17 22" style="position:absolute;left:0;top:0"><path d="M1 1 L1 17 L5 13 L8 20 L11 19 L8 12 L14 12 Z" fill="#fff" stroke="#111" stroke-width="1.3"/></svg>`;
  const E = {};
  // small subscribe button bottom-right: slides in, a cursor clicks it (SUBSCRIBED), bell rings, slides out. No full-screen card.
  E.subscribe = (t, until) => {
    const el = mk(`<div style="display:flex;align-items:center;gap:14px;background:rgba(10,12,16,0.82);border:1px solid rgba(201,180,138,0.5);border-radius:12px;padding:12px 18px;box-shadow:0 6px 24px rgba(0,0,0,0.5)">
      <div class="btn" style="position:relative;background:#c4121f;font-size:30px;font-weight:700;letter-spacing:0.1em;padding:8px 24px;border-radius:6px"><span class="lab">SUBSCRIBE</span></div>${BELL}</div>${CURSOR}`,
      "right:80px;bottom:150px;");
    const btn = el.querySelector(".btn"), lab = el.querySelector(".lab"), cur = el.querySelector(".cur"), bell = el.querySelector(".bell");
    tl.fromTo(el, { autoAlpha: 0, x: 120 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, t);
    SFX("ref:pop", t + 0.1);
    tl.fromTo(cur, { x: 300, y: 120, autoAlpha: 0 }, { x: 110, y: 30, autoAlpha: 1, duration: 0.7, ease: "power2.out", immediateRender: false }, t + 0.5);
    tl.to(btn, { scale: 0.9, duration: 0.08, yoyo: true, repeat: 1 }, t + 1.25);
    tl.set(btn, { backgroundColor: "#55524b" }, t + 1.3); tl.call(() => { lab.textContent = "SUBSCRIBED"; }, null, t + 1.3);
    SFX("tick", t + 1.28);
    tl.to(bell, { rotation: 18, transformOrigin: "50% 10%", duration: 0.12, yoyo: true, repeat: 7, ease: "sine.inOut" }, t + 1.6);
    SFX("tick", t + 1.6); SFX("tick", t + 1.85);
    tl.to(cur, { autoAlpha: 0, duration: 0.3 }, t + 2.4);
    tl.to(el, { autoAlpha: 0, x: 120, duration: 0.5, ease: "power2.in" }, until);
    // seek-safe label: SUBSCRIBE before the click, SUBSCRIBED after
    tl.eventCallback("onUpdate", ((prev) => function () { if (prev) prev.apply(this, arguments); lab.textContent = tl.time() >= t + 1.3 ? "SUBSCRIBED" : "SUBSCRIBE"; })(tl.eventCallback("onUpdate")));
    return el;
  };
  // "what would you do?" duel card: question, two options, a 3-2-1 countdown, then the real choice lights and the other greys.
  E.decide = ({ title = "WHAT WOULD YOU DO?", sub = "", a, b, real = 1, t, tCount, tReveal, until, note = "TELL US IN THE COMMENTS" }) => {
    const opt = (txt, i) => `<div class="o o${i}" style="flex:1;text-align:center;border:3px solid #c9b48a;border-radius:10px;padding:18px 26px;background:rgba(16,18,24,0.97)">
      <div style="font-size:24px;letter-spacing:0.3em;color:#c9b48a">${i === 0 ? "A" : "B"}</div><div style="font-size:60px;font-weight:700;letter-spacing:0.06em">${txt}</div></div>`;
    const el = mk(`<div style="text-align:center;font-size:30px;letter-spacing:0.45em;color:#c9b48a">${sub}</div>
      <div style="text-align:center;font-size:86px;font-weight:700;letter-spacing:0.05em;margin:4px 0 22px;text-shadow:0 4px 18px rgba(0,0,0,0.8)">${title}</div>
      <div style="display:flex;gap:46px;align-items:stretch">${opt(a, 0)}<div style="align-self:center;font-size:40px;color:#c9b48a">OR</div>${opt(b, 1)}</div>
      <div class="cd" style="text-align:center;font-size:30px;letter-spacing:0.3em;margin-top:22px;color:#f7f3ea">${note}</div>`,
      "left:50%;top:230px;width:1180px;margin-left:-590px;");
    const back = mk("", "left:0;top:0;width:1920px;height:1080px;background:rgba(6,8,12,0.78);");
    scene.insertBefore(back, el);
    tl.to(back, { autoAlpha: 1, duration: 0.5 }, t); tl.to(back, { autoAlpha: 0, duration: 0.6 }, until);
    tl.fromTo(el, { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "power3.out", immediateRender: false }, t);
    SFX("hit", t + 0.05);
    const os = [el.querySelector(".o0"), el.querySelector(".o1")];
    os.forEach((o, i) => { tl.fromTo(o, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.4, immediateRender: false }, t + 0.5 + i * 0.35); SFX("ref:pop", t + 0.5 + i * 0.35); });
    if (tCount != null) [0, 1, 2].forEach((k) => { tl.to(el.querySelector(".cd"), { scale: 1.12, duration: 0.1, yoyo: true, repeat: 1 }, tCount + k * 0.8); SFX("tick", tCount + k * 0.8); });
    const win = os[real], lose = os[1 - real];
    tl.to(win, { borderColor: "#2e5cb2", backgroundColor: "rgba(31,79,196,0.55)", scale: 1.06, duration: 0.35 }, tReveal);
    tl.to(lose, { autoAlpha: 0.35, filter: "grayscale(1)", duration: 0.35 }, tReveal);
    SFX("hit", tReveal);
    tl.to(el, { autoAlpha: 0, duration: 0.6 }, until);
    return el;
  };
  // final question: the three moves as numbered cards, "1, 2 OR 3?", family-story line, small subscribe button.
  E.final = ({ moves, tShow, tNums = [], tAsk, tFamily, tSub, until, family = "FAMILY SERVED IN KOREA?" }) => {
    const card = (m, i) => `<div class="m m${i}" style="width:330px;text-align:center;background:rgba(14,16,22,0.88);border:2px solid rgba(201,180,138,0.6);border-radius:12px;padding:16px 10px">
      <div style="width:84px;height:84px;margin:0 auto 8px;border-radius:50%;border:4px solid #c9b48a;font-size:56px;font-weight:700;line-height:76px">${i + 1}</div>
      <div style="font-size:34px;font-weight:700;letter-spacing:0.06em">${m[0]}</div><div style="font-size:22px;letter-spacing:0.25em;color:#c9b48a">${m[1]}</div></div>`;
    const el = mk(`<div style="text-align:center;font-size:30px;letter-spacing:0.45em;color:#c9b48a">TELL US IN THE COMMENTS</div>
      <div class="q" style="text-align:center;font-size:84px;font-weight:700;letter-spacing:0.05em;margin:2px 0 22px">WHICH WAS HIS GREATEST MOVE?</div>
      <div style="display:flex;gap:34px;justify-content:center">${moves.map(card).join("")}</div>
      <div class="ans" style="text-align:center;font-size:58px;font-weight:700;letter-spacing:0.12em;margin-top:20px;color:#ffd54a">1, 2 OR 3?</div>
      <div class="fam" style="text-align:center;font-size:30px;letter-spacing:0.12em;margin-top:14px">${family} <span style="color:#c9b48a">TELL US THEIR STORY · WE READ EVERY ONE</span></div>`,
      "left:50%;top:150px;width:1300px;margin-left:-650px;");
    const back = mk("", "left:0;top:0;width:1920px;height:1080px;background:rgba(6,8,12,0.6);");
    scene.insertBefore(back, el);
    tl.to(back, { autoAlpha: 1, duration: 0.6 }, tShow); tl.to(el, { autoAlpha: 1, duration: 0.5 }, tShow);
    tl.set([el.querySelector(".ans"), el.querySelector(".fam")], { autoAlpha: 0 }, 0);
    SFX("ref:boom", tShow + 0.1);
    moves.forEach((m, i) => { const c = el.querySelector(".m" + i); tl.fromTo(c, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.4, immediateRender: false }, tNums[i] ?? tShow + 0.3 + i * 0.3);
      tl.to(c, { borderColor: "#ffd54a", scale: 1.05, duration: 0.2, yoyo: true, repeat: 1 }, (tNums[i] ?? tShow) + 0.4); SFX("hit", tNums[i] ?? tShow + 0.3 + i * 0.3); });
    tl.fromTo(el.querySelector(".ans"), { autoAlpha: 0, scale: 1.3 }, { autoAlpha: 1, scale: 1, duration: 0.35, immediateRender: false }, tAsk); SFX("hit", tAsk);
    tl.fromTo(el.querySelector(".fam"), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5, immediateRender: false }, tFamily); SFX("ref:pop", tFamily);
    E.subscribe(tSub, until + 2);
    return el;
  };
  return E;
}
