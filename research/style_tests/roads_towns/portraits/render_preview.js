// node render_preview.js  -> preview_1x.png (1920x1080) + preview_2x.png (3840x2160); compose_preview.py builds preview.jpg
const { chromium } = require("playwright");
const path = require("path");
(async () => {
  const b = await chromium.launch();
  for (const s of [1, 2]) {
    const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: s });
    await p.goto("file://" + path.resolve(__dirname, "preview.html"));
    await p.waitForFunction(() => document.body.dataset.ready === "1"); await p.waitForTimeout(400);
    await p.locator("#stage").screenshot({ path: path.resolve(process.env.OUT || __dirname, `preview_${s}x.png`) });
  }
  await b.close();
})();
