// NODE_PATH=/opt/node-tools/node_modules node render.js [outdir] [t]  -> <outdir>/wx_<look>.png (1920x1080 each); then compose_preview.py
const { chromium } = require("playwright");
const path = require("path");
const OUT = process.argv[2] || __dirname, T = process.argv[3] || "7";
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on("pageerror", (e) => console.log("ERR", e.message));
  for (const w of ["clear", "rain", "mud", "snow", "fog", "rainmud"]) {
    await p.goto("file://" + path.resolve(__dirname, "preview.html") + `?w=${w}&t=${T}&notag=1`);
    await p.waitForFunction(() => document.body.dataset.ready === "1", null, { timeout: 60000 });
    await p.locator("#stage").screenshot({ path: path.join(OUT, `wx_${w}.png`) });
    console.log("ok", w);
  }
  await b.close();
})();
