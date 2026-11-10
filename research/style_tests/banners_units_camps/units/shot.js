// node shot.js <html> <outdir> t1 t2 ...  -> frame_<t>.png (1920x1080)
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
(async () => {
  const [html, out, ...ts] = process.argv.slice(2);
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome", args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", "--allow-file-access-from-files"] });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = []; p.on("crash", () => console.log("CRASH")); p.on("pageerror", (e) => errs.push(String(e))); p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  await p.goto("file://" + html, { waitUntil: "domcontentloaded", timeout: 20000 }); await p.waitForTimeout(500); await p.evaluate(() => document.fonts.ready);
  for (const t of ts) { await p.evaluate((t) => window.seek(t), parseFloat(t)); await p.waitForTimeout(100);
    await p.locator("#stage").screenshot({ path: `${out}/frame_${t}.png` }); }
  if (errs.length) console.log("ERR", errs.join("\n"));
  await b.close();
})();
