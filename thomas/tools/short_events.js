// usage: PWDIR=/opt/node-tools/node_modules node tools/short_events.js $PWD/scenes/<scene> > events.json  (first row = debug counts)
const { chromium } = require(process.env.PWDIR + "/playwright");
const path = require("path");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage(); await p.addInitScript(() => { window.__timelines = {}; }); p.on("pageerror", (e) => console.error("ERR", e.message)); p.on("requestfailed", (r) => console.error("FAIL", r.url()));
  const http = require("http"), fs = require("fs"), root = process.argv[2];
  const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split("?")[0])); fs.readFile(f.endsWith("/") ? f + "index.html" : f, (e, d) => { r.end(d); }); }).listen(8765);
  await p.goto("http://localhost:8765/index.html"); await p.waitForTimeout(3000);
  const ev = await p.evaluate(() => {
    const tls = Object.values(window.__timelines || {}); const out = [];
    const walk = (tl, off) => tl.getChildren(false, true, true).forEach((c) => {
      if (c.getChildren) return walk(c, off + c.startTime());
      const tg = c.targets ? c.targets() : [];
      tg.forEach((el) => { if (!el || !c.vars) return; const bg = el.style ? el.style.background : "";
        const html = (el.closest && el.closest("g") ? el.closest("g").outerHTML : (el.outerHTML || "")).slice(0, 600);
        const st = +(off + c.startTime()).toFixed(2), on = c.vars.autoAlpha === 1;
        if (on && (bg.includes("255, 246, 200") || bg.includes("#fff6c8"))) out.push([st, "flash"]);
        else if (on && (bg.includes("255, 243, 192") || bg.includes("#fff3c0"))) out.push([st, "burst"]);
        else if (on && html.includes("#fff1b0")) out.push([st, "flash"]);
        else if (c.vars.autoAlpha === 0 && c.duration() > 0.8 && html.includes("#ffb020")) out.push([st, "burst"]);
        else if (on && html.includes('class="fl"')) out.push([st, "flash"]);
        else if (on && html.includes("#fff6d0") && html.includes("polygon")) out.push([st, "clash"]);
      });
    });
    const dbg=[Object.keys(window.__timelines||{}).length, tls[0]?tls[0].getChildren(true,true,true).length:-1, document.querySelectorAll('div').length]; tls.forEach((tl) => walk(tl, 0)); out.unshift(dbg); return out.sort((a, b) => a[0] - b[0]);
  });
  console.log(JSON.stringify(ev)); srv.close(); await b.close();
})();
