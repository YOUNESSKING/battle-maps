// TEST ("Frontlines" style, owner test 2026-10): 3D flyover over south-east Sicily that opens Move 1 (first ~9 s of move1-1).
// three.js terrain: assets/sicily_height.png (sqrt-scaled elevation) + darkened basemap texture; camera driven by the paused GSAP timeline.
const B = Battle();
const END = B.T.duration;
const GG = GGK(B);
document.getElementById("world").style.visibility = "hidden";
document.getElementById("date").style.display = "none";
const scene = document.getElementById("scene");
const cv = document.createElement("canvas"); cv.width = 1920; cv.height = 1080; cv.style.cssText = "position:absolute;inset:0;";
scene.insertBefore(cv, document.getElementById("fx"));
const R = new THREE.WebGLRenderer({ canvas: cv, antialias: true, preserveDrawingBuffer: true });
R.setPixelRatio(1); R.setSize(1920, 1080, false); R.setClearColor(0x0b0f17);
const S3 = new THREE.Scene(); S3.fog = new THREE.Fog(0x0b0f17, 700, 2100);
const cam = new THREE.PerspectiveCamera(38, 1920 / 1080, 1, 6000);
// terrain
const hImg = new Image(); hImg.src = "assets/sicily_height.png";
const tex = new THREE.TextureLoader().load("assets/media/sicily_dark.jpg");
const geo = new THREE.PlaneGeometry(2880, 1620, 480, 270); geo.rotateX(-Math.PI / 2);
const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 1, metalness: 0 });
const mesh = new THREE.Mesh(geo, mat); S3.add(mesh);
S3.add(new THREE.HemisphereLight(0xc8d4ff, 0x20180c, 0.65));
const sun = new THREE.DirectionalLight(0xffe2b8, 0.95); sun.position.set(-900, 700, -400); S3.add(sun);
let built = false;
const buildTerrain = () => {
  if (built || !hImg.complete || !hImg.naturalWidth) return;
  const c = document.createElement("canvas"); c.width = hImg.naturalWidth; c.height = hImg.naturalHeight;
  const g = c.getContext("2d"); g.drawImage(hImg, 0, 0); const d = g.getImageData(0, 0, c.width, c.height).data;
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i) + 1440, z = pos.getZ(i) + 810;
    const px = Math.min(c.width - 1, Math.round(x / 2880 * (c.width - 1))), py = Math.min(c.height - 1, Math.round(z / 1620 * (c.height - 1)));
    pos.setY(i, d[(py * c.width + px) * 4] / 255 * 95);
  }
  pos.needsUpdate = true; geo.computeVertexNormals(); built = true;
};
const P3 = (x, y, h = 6) => new THREE.Vector3(x - 1440, h, y - 810);
// glowing place labels (HTML, projected every frame)
const css = document.createElement("style");
css.textContent = `.fl-lbl{position:absolute;left:0;top:0;transform:translate(-50%,-100%);white-space:nowrap;font-family:Oswald;font-weight:500;letter-spacing:.22em;color:#f4efe2;font-size:22px;text-shadow:0 0 10px rgba(255,214,140,.55),0 2px 4px #000}
.fl-lbl:after{content:"";display:block;margin:6px auto 0;width:9px;height:9px;border-radius:50%;background:#ffd58a;box-shadow:0 0 12px 4px rgba(255,190,90,.75)}
.fl-title{position:absolute;left:0;right:0;text-align:center;font-family:Oswald;color:#f4efe2;text-shadow:0 3px 18px rgba(0,0,0,.9)}`;
document.head.appendChild(css);
const LBL = [["GELA", 1186, 750], ["SCOGLITTI", 1318, 911], ["BIAZZA RIDGE", 1309, 799], ["NISCEMI", 1289, 676], ["SYRACUSE", 1940, 742], ["CATANIA", 1797, 353], ["MOUNT ETNA", 1700, 250]];
const lbls = LBL.map(([t, x, y]) => { const el = document.createElement("div"); el.className = "fl-lbl"; el.textContent = t; scene.insertBefore(el, document.getElementById("credit")); el.style.opacity = 0; return { el, p: P3(x, y, 30) }; });
// camera path (progress k 0..1): high over the sea south of Sicily -> low over the Gela coast, looking north-east at Biazza Ridge
const C0 = new THREE.Vector3(150, 1150, 1500), C1 = new THREE.Vector3(-60, 260, 360), L0 = new THREE.Vector3(150, 0, -150), L1 = new THREE.Vector3(-125, 20, -20);
const st = { k: 0, lab: 0 };
const render = () => {
  buildTerrain();
  const e = st.k * st.k * (3 - 2 * st.k);
  cam.position.lerpVectors(C0, C1, e); cam.lookAt(new THREE.Vector3().lerpVectors(L0, L1, e));
  R.render(S3, cam);
  lbls.forEach(({ el, p }) => { const v = p.clone().project(cam); const on = v.z < 1 && Math.abs(v.x) < 1.1 && Math.abs(v.y) < 1.1;
    el.style.left = ((v.x + 1) / 2 * 1920) + "px"; el.style.top = ((1 - v.y) / 2 * 1080) + "px"; el.style.opacity = on ? st.lab : 0; });
};
B.tl.to(st, { k: 1, duration: 9.0, ease: "none", onUpdate: render }, 0);
B.tl.to(st, { lab: 1, duration: 1.2, onUpdate: render }, 3.2);
B.tl.eventCallback("onUpdate", render);
hImg.onload = render; render();
// series-style title: thin kicker, big name, date line
const t1 = document.createElement("div"); t1.className = "fl-title"; t1.style.top = "380px";
t1.innerHTML = `<div style="font-size:30px;letter-spacing:.6em;color:#d9c9a3">MOVE 1</div><div style="font-size:120px;font-weight:700;letter-spacing:.08em;line-height:1.1">BIAZZA RIDGE</div><div style="font-size:30px;letter-spacing:.4em;color:#d9c9a3">SICILY · JULY 1943</div>`;
scene.insertBefore(t1, document.getElementById("credit")); GG.hide(t1);
B.tl.fromTo(t1, { autoAlpha: 0, letterSpacing: "0.3em" }, { autoAlpha: 1, letterSpacing: "0em", duration: 1.4, ease: "power2.out" }, 0.4);
B.tl.to(t1, { autoAlpha: 0, duration: 0.8 }, 4.4);
SFX("whoosh", 0.2);
B.finish();
