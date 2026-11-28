import puppeteer from "/opt/node22/lib/node_modules/hyperframes/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js";
import http from "http"; import fs from "fs"; import path from "path";
const [dir, out, ...TS] = process.argv.slice(2);
const srv = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split("?")[0]); const f = path.join(dir, u === "/" ? "index.html" : u);
  fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } const ext = path.extname(f); r.writeHead(200, { "content-type": { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".ttf": "font/ttf", ".css": "text/css" }[ext] || "application/octet-stream" }); r.end(d); }); }).listen(0);
const exe = fs.readdirSync("/root/.cache/hyperframes/chrome/chrome-headless-shell").map((v) => `/root/.cache/hyperframes/chrome/chrome-headless-shell/${v}/chrome-headless-shell-linux64/chrome-headless-shell`)[0];
const b = await puppeteer.launch({ executablePath: exe, args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await b.newPage(); await p.setViewport({ width: +(process.env.VW || 1920), height: +(process.env.VH || 1080) });
await p.evaluateOnNewDocument(() => {  });
p.on("pageerror", (e) => console.log("pageerror:", e.message));
await p.goto(`http://localhost:${srv.address().port}/`, { waitUntil: "load", timeout: 180000 });
await p.evaluate(async () => { await document.fonts.ready; const br = window.__hf && window.__hf.buildReady ? Object.values(window.__hf.buildReady) : []; await Promise.all(br); });
const N0 = +(process.env.N0 || 0), N1 = +(process.env.N1 || 276);
for (let n = N0; n < N1; n++) { const t = n / 30;
  await p.evaluate(async (t) => { const tl = window.__timelines.main; tl.seek(t, false); await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); }, t);
  await p.screenshot({ path: `${out}/f${String(n).padStart(4, "0")}.jpg`, type: "jpeg", quality: 93 }); if (n % 20 === 0) console.log("frame", n); }
await b.close(); srv.close();
