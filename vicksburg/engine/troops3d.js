// troops3d.js: Grand Maneuver-style 3D formation blocks (EXPERIMENT, free of STYLE_LOCK). An OPTION next to our Style W boxes:
// index.html picks it with window.TROOPS = 'blocks' (or ?troops=blocks); default stays 'boxes'.
//
// What GM's blocks are (measured from gm_1814.mp4 at 515, 682-700, 925 s, 2-6x crops; see README):
//  - every battalion is a flat base plate in the side colour (French bright blue ~#2f5bc0) with a pale cream rim, brighter and wider on the
//    FRONT edge, and on it a dense grid of tiny standing 3D soldiers (coloured coat, pale trousers / belts / face, a dark musket sliver);
//  - in line ~12 files x 5 ranks, block ~2.3:1, ~4 % of frame width on his close shots, gaps ~1/6 of a block between battalions;
//  - on the march the plate narrows into a column of files (4 abreast, 15 deep, gaps between the files) pointing along the road, blocks one behind the other;
//  - long low-sun shadows: the figures throw a dark streak beside each block about as big as the block (we add a soft shadow quad on top
//    of the real shadow map, whose 38 deg sun is fixed by world.js);
//  - guns are separate pieces in the SIDE colour (long carriage + barrel + wheels, ~1/2 a block deep) with the limber behind, crew around, no plate;
//  - squares (form:'square') are hollow plates with figures on the four faces; cavalry ('cav') are two ranks of riders on long horse bodies;
//  - smoke: the blocks are real geometry in the close scene, so fx smoke sprites draw over them (sorted after the opaque pass).
// Driven by the SAME unit objects as the boxes ({side, type, keys:[[t,x,y]], face, n, bw, bd, gap, t0, t1, cap, capN}), pure function of t.
//
// usage: const T3 = createTroops3D({ THREE, scene, heightAt, units, posAt, shots:[{t,x,y}] }); per frame T3.update(t) before rendering.

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), lerp = (a, b, k) => a + (b - a) * k;
const sstep = (a, b, x) => { const k = clamp((x - a) / (b - a)); return k * k * (3 - 2 * k); };
const hash = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const angDiff = (a, b) => { let d = b - a; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return d; };

// colours (linear-ish hex; Lambert lit by world.js sun + hemisphere)
const PAL = {
  u: { coat: 0x24448e, pale: 0xcfd8e6, plate: 0x2f5bc0, rim: 0xe9edf2, flag: 0x1d2f7a, gun: 0x2f5bc0 },
  r: { coat: 0x8c8679, pale: 0xc9c0ac, plate: 0xb23a2c, rim: 0xeee6d8, flag: 0xb8261c, gun: 0xb23a2c },
};
const GREY = { coat: 0x8a8580, pale: 0xb4b0aa };   // captured / prisoners
const GREYC_HEX = 0x8a8580;

// layouts in block-local coords (a = lateral, b = forward), unit square [-0.5,0.5]^2 scaled by the footprint later
function gridLayout(cols, rows) { const P = []; for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) P.push([(c + 0.5) / cols - 0.5, 0.5 - (r + 0.5) / rows]); return P; }

export function createTroops3D(o) {
  const { THREE, scene, heightAt, units, posAt } = o;
  const S = { figH: 0.095, figW: 0.036, figD: 0.026, plateT: 0.014, lift: 0.004, shadowLen: 0.95, shadowA: 0.84, gunK: 2.8, ...o.style };   // v5: his low-sun shadows are about a block long and dark (0.55 / 0.72 before)
  const SUNG = (() => { const s = o.sun || [-0.7, 0.48, -0.4], l = Math.hypot(s[0], s[2]); return [-s[0] / l, -s[2] / l]; })();   // ground direction shadows fall
  const shots = (o.shots || []).slice().sort((a, b) => a.t - b.t);
  const NF = 60, INF_LINE = gridLayout(12, 5), INF_COL = gridLayout(4, 15), CAV_LINE = gridLayout(14, 2), CAV_COL = gridLayout(4, 7);
  const SQUARE = (() => { const P = []; for (let k = 0; k < NF; k++) { const side = k / 15 | 0, f = (k % 15 + 0.5) / 15 - 0.5, e = 0.5 - 0.06;
    P.push(side === 0 ? [f, e] : side === 1 ? [e, -f] : side === 2 ? [-f, -e] : [-e, f]); } return P; })();

  // ---------- per block bookkeeping ----------
  // GM's blocks are ~2x the size of our Style W boxes relative to the frame and there are ~half as many (15-20 per side on screen):
  // infantry merges every `merge` (default 2) boxes into one block over the same brigade frontage; guns stay one piece per box
  const MERGE = o.merge ?? 2, LAY = new Map();
  for (const u of units) { const k = u.type === "art" ? 1 : Math.min(MERGE, u.n), nb = Math.ceil(u.n / k), gap = u.gap * 1.6;
    const span = u.n * u.bw + (u.n - 1) * u.gap; LAY.set(u, { k, nb, gap, bw: (span - (nb - 1) * gap) / nb }); }
  const blocks = [];
  units.forEach((u, ui) => { for (let i = 0; i < LAY.get(u).nb; i++) blocks.push({ u, ui, i }); });
  const infBlocks = blocks.filter((b) => b.u.type !== "art"), artBlocks = blocks.filter((b) => b.u.type === "art");
  const nFig = infBlocks.length * NF + artBlocks.length * 4;

  // ---------- geometry ----------
  const box = (w, h, d, x = 0, y = 0, z = 0) => { const g = new THREE.BoxGeometry(w, h, d); g.translate(x, y, z); return g; };
  const merge = (gs, cols) => {   // tiny merge with per-part vertex colours (no addons needed)
    let n = 0; for (const g of gs) n += g.attributes.position.count;
    const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), col = new Float32Array(n * 3), idx = []; let off = 0;
    gs.forEach((g, gi) => { const p = g.attributes.position, nn = g.attributes.normal, c = new THREE.Color(cols[gi]);
      for (let k = 0; k < p.count; k++) { pos.set([p.getX(k), p.getY(k), p.getZ(k)], (off + k) * 3); nor.set([nn.getX(k), nn.getY(k), nn.getZ(k)], (off + k) * 3); col.set([c.r, c.g, c.b], (off + k) * 3); }
      for (let k = 0; k < g.index.count; k++) idx.push(g.index.getX(k) + off); off += p.count; });
    const m = new THREE.BufferGeometry(); m.setAttribute("position", new THREE.BufferAttribute(pos, 3)); m.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
    m.setAttribute("color", new THREE.BufferAttribute(col, 3)); m.setIndex(idx); return m; };
  // soldier in a unit cube (x lateral, y up, z back): coat (instance colour) and the pale parts (legs, belts, face/shako top) + musket
  const coatG = merge([box(1, 0.42, 1, 0, 0.62, 0), box(1.15, 0.12, 1.1, 0, 0.86, 0)], [0xffffff, 0xffffff]);
  const paleG = merge([box(0.8, 0.40, 0.8, 0, 0.21, 0), box(0.55, 0.20, 0.55, 0, 1.0, 0), box(0.6, 0.06, 0.05, 0, 0.98, -0.5), box(0.18, 0.62, 0.18, 0.62, 0.85, 0)],
    [0xffffff, 0xf2e2c8, 0x1a1712, 0x2a2420]);
  // horse (cav): long body + rider on top, same unit cube convention
  const horseG = merge([box(0.7, 0.45, 2.4, 0, 0.55, 0), box(0.45, 0.45, 0.6, 0, 0.85, -1.25)], [0x4a3524, 0x3c2a1c]);
  const lam = (p = {}) => new THREE.MeshLambertMaterial(p);
  const mkIM = (geo, mat, n, cast = true) => { const m = new THREE.InstancedMesh(geo, mat, Math.max(1, n)); m.castShadow = cast; m.receiveShadow = true;
    m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); m.frustumCulled = false; m.count = 0; m.renderOrder = 2; scene.add(m); return m; };
  const coats = mkIM(coatG, lam({ vertexColors: true }), nFig);
  const pales = mkIM(paleG, lam({ vertexColors: true }), nFig);
  const nCav = infBlocks.filter((b) => b.u.type === "cav").length * CAV_LINE.length;
  const horses = nCav ? mkIM(horseG, lam({ vertexColors: true }), nCav) : null;
  const plateFill = mkIM(box(1, 1, 1, 0, 0.5, 0), lam(), infBlocks.length, false);
  const plateRim = mkIM(box(1, 1, 1, 0, 0.5, 0), lam({ emissive: 0x2a2a2a }), infBlocks.length, false);
  const holes = mkIM(box(1, 1, 1, 0, 0.5, 0), lam({ color: 0x55574a }), Math.max(1, infBlocks.filter((b) => b.u.form === "square").length), false);   // square's inner court
  // soft low-sun shadow streak (GM's long shadows): one quad per block, gradient texture, multiplied over the ground
  // the texture is a MULTIPLY mask (white = no change): dark at the block, fading out along the streak and at its two sides
  const SC = document.createElement("canvas"); SC.width = 64; SC.height = 64; { const g = SC.getContext("2d"), im = g.createImageData(64, 64);
    for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) { const v = y / 63, u = Math.abs(x / 63 - 0.5) * 2;
      const a = S.shadowA * (1 - sstep(0.15, 1, v)) * (1 - 0.6 * sstep(0.8, 1, u)), c = Math.round(255 * (1 - a)), k = (y * 64 + x) * 4;
      im.data[k] = c; im.data[k + 1] = c; im.data[k + 2] = c * 0.98 + 5 * a; im.data[k + 3] = 255; }
    g.putImageData(im, 0, 0); }
  const stex = new THREE.CanvasTexture(SC); stex.colorSpace = THREE.SRGBColorSpace;   // so the multiply factor lands as drawn
  const shG = new THREE.PlaneGeometry(1, 1); shG.rotateX(-Math.PI / 2); shG.translate(0.5, 0, 0.5);   // unit square x,z in [0,1]: x along the edge, z along the shadow
  // drawn in the OPAQUE pass right after the ground (renderOrder 1, multiply blend) so plates and figures (renderOrder 2) cover it
  // and smoke draws over all; the flat quad floats a little above the highest ground under it (the coarse terrain mesh would swallow it) but stays under tree crowns
  const shadows = mkIM(shG, new THREE.MeshBasicMaterial({ map: stex, fog: false, side: THREE.DoubleSide, transparent: false, blending: THREE.CustomBlending, blendEquation: THREE.AddEquation,
    blendSrc: THREE.ZeroFactor, blendDst: THREE.SrcColorFactor, depthWrite: false, depthTest: true }), blocks.length * 2, false);
  shadows.receiveShadow = false; shadows.renderOrder = 1;
  // colour standards: thin pole + small flag per infantry block
  const poles = mkIM(box(0.004, 0.13, 0.004, 0, 0.065, 0), lam({ color: 0x2a2018 }), infBlocks.length, true);
  const flagG = new THREE.PlaneGeometry(0.055, 0.036); flagG.translate(0.0275, 0.11, 0);
  const flags = mkIM(flagG, lam({ side: THREE.DoubleSide }), infBlocks.length, true);
  // guns: carriage (side tint) + barrel (dark bronze) + 2 wheels; limber box behind
  const carriage = mkIM(box(0.05, 0.03, 0.16, 0, 0.03, 0.03), lam(), artBlocks.length);
  const barrel = mkIM((() => { const g = new THREE.CylinderGeometry(0.014, 0.018, 0.17, 8); g.rotateX(Math.PI / 2); g.translate(0, 0.055, -0.03); return g; })(), lam({ color: 0x4a3c28 }), artBlocks.length);
  const wheels = mkIM((() => { const a = new THREE.CylinderGeometry(0.035, 0.035, 0.012, 10); a.rotateZ(Math.PI / 2); const b = a.clone(); a.translate(-0.042, 0.035, 0.0); b.translate(0.042, 0.035, 0.0); return merge([a, b], [0x2a2018, 0x2a2018]); })(), lam({ vertexColors: true }), artBlocks.length);
  const limber = mkIM(merge([box(0.075, 0.05, 0.09, 0, 0.05, 0), box(0.08, 0.012, 0.095, 0, 0.081, 0)], [0xffffff, 0xd8cfbc]), lam({ vertexColors: true }), artBlocks.length);

  const GREYC = new THREE.Color(GREYC_HEX), M4 = new THREE.Matrix4(), col = new THREE.Color(), ZERO = new THREE.Matrix4().makeScale(0, 0, 0);
  // matrix from map-plane frame: lateral L=(-fy,fx), forward F=(fx,fy); local x->L, y->up, z->-F (keeps det > 0)
  const setM = (im, k, x, y, z, fx, fy, sx, sy, sz) => { M4.set(-fy * sx, 0, -fx * sz, x, 0, sy, 0, y, fx * sx, 0, -fy * sz, z, 0, 0, 0, 1); im.setMatrixAt(k, M4); };
  // pre-colour (static per instance); captured blocks get recoloured in update
  const pal = (b) => PAL[b.u.side] || PAL.u;
  infBlocks.forEach((b, k) => { plateFill.setColorAt(k, col.setHex(pal(b).plate)); plateRim.setColorAt(k, col.setHex(pal(b).rim)); flags.setColorAt(k, col.setHex(pal(b).flag)); });
  artBlocks.forEach((b, k) => { carriage.setColorAt(k, col.setHex(pal(b).gun)); limber.setColorAt(k, col.setHex(pal(b).gun)); });

  // ---------- motion state from the unit keys (deterministic in t) ----------
  // m: how much the unit is on the move; col: share in march column (long marches), rout: moving away from its facing (short retreats)
  function motion(u, t) {
    const K = u.keys; let best = { m: 0, vx: Math.cos(u.face), vy: Math.sin(u.face), dist: 0 };
    for (let i = 1; i < K.length; i++) { const dx = K[i][1] - K[i - 1][1], dy = K[i][2] - K[i - 1][2], d = Math.hypot(dx, dy), dur = K[i][0] - K[i - 1][0];
      if (d < 0.25 || dur <= 0) continue; const ramp = Math.min(0.9, dur * 0.3);
      const m = sstep(K[i - 1][0], K[i - 1][0] + ramp, t) * (1 - sstep(K[i][0] - ramp, K[i][0], t));
      if (m > best.m) best = { m, vx: dx / d, vy: dy / d, dist: d }; }
    const fx = Math.cos(u.face), fy = Math.sin(u.face), back = clamp(-(best.vx * fx + best.vy * fy) * 1.4);
    const longMarch = u.march != null ? +u.march : sstep(5.5, 7.0, best.dist);   // short moves = advance / fall back in line
    return { ...best, col: u.march ? 1 : best.m * longMarch * (1 - back), rout: u.march ? 0 : best.m * back };   // march: stays in column even when halted
  }
  const figAt = (b, j) => { const u = b.u; if (u.type === "cav") return [CAV_LINE[j], CAV_COL[j]]; if (u.form === "square") return [SQUARE[j], INF_COL[j]]; return [INF_LINE[j], INF_COL[j]]; };

  function update(t) {
    let nf = 0, nh = 0, np = 0, ns = 0, ng = 0, nq = 0; const ST = [];
    const H = (x, y) => heightAt(x, y);
    for (const u of units) {
      const on = t >= u.t0 && t < u.t1; const op = on ? Math.min(sstep(u.t0, u.t0 + 0.6, t), 1 - sstep(u.t1 - 0.6, u.t1, t)) : 0;
      u._op = op; if (op <= 0.001) continue;
      const [cx, cy] = posAt(u.keys, t), mo = motion(u, t);
      const fa = u.face, va = Math.atan2(mo.vy, mo.vx), th = fa + angDiff(fa, va) * mo.col;   // column turns to the road
      const fx = Math.cos(th), fy = Math.sin(th), px = -fy, py = fx;
      const isArt = u.type === "art", isCav = u.type === "cav";
      const LY = LAY.get(u), bw = LY.bw, gap = LY.gap, bd = isArt ? u.bd : bw * 0.42;   // GM block ~2.4:1
      const colW = bw * 0.42, colD = bd * 2.3;   // march column footprint: 4 files abreast with clear gaps, 15 deep (GM 515 s)
      const lineSpan = LY.nb * bw + (LY.nb - 1) * gap, colSpan = LY.nb * colD + (LY.nb - 1) * gap * 1.5;
      for (let i = 0; i < LY.nb; i++) {
        const b = { u, i }; const bi = blocks.findIndex((q) => q.u === u && q.i === i);
        // block centre: side by side in line, nose to tail in column
        const offL = -lineSpan / 2 + bw / 2 + i * (bw + gap), offC = colSpan / 2 - colD / 2 - i * (colD + gap * 1.5);
        const wob = (u.wob ?? 1) * 0.03 * Math.sin(t * 1.3 + i * 1.7 + cx) * (1 - mo.col);
        const bx = cx + px * offL * (1 - mo.col) + fx * (offC * mo.col + wob), by = cy + py * offL * (1 - mo.col) + fy * (offC * mo.col + wob);
        const W = lerp(bw, colW, mo.col), Dp = lerp(bd, colD, mo.col);
        const capd = u.cap != null && i * LY.k < u.capN ? sstep(u.cap, u.cap + 0.8, t) : 0;
        const rout = Math.max(mo.rout, capd * 0.6), seed = bi * 7.31;
        ST.push({ u, i, b, bi, bx, by, W, Dp, colW, colD, capd, rout, seed, fx, fy, px, py, mo, op, isArt, isCav, cx, cy });
      }
    }
    // crowd separation (deterministic, a pure function of this frame's positions): blocks of different units that the unit data puts
    // on top of each other (e.g. brigades piling up at the bridge) are pushed apart, as GM's blocks never overlap
    for (let it = 0; it < 4; it++) for (let a = 0; a < ST.length; a++) { const A = ST[a]; if (A.isArt) continue;
      for (let c = a + 1; c < ST.length; c++) { const B = ST[c]; if (B.isArt || B.u === A.u) continue;
        const dx = B.bx - A.bx, dy = B.by - A.by, d = Math.hypot(dx, dy) || 1e-3, rr = 0.55 * (Math.sqrt(A.W * A.Dp) + Math.sqrt(B.W * B.Dp));
        if (d >= rr) continue; const k = (rr - d) * 0.5 / d; A.bx -= dx * k; A.by -= dy * k; B.bx += dx * k; B.by += dy * k; } }
    for (const Q of ST) {
        const { u, i, b, bi, bx, by, W, Dp, colW, colD, capd, rout, seed, fx, fy, px, py, mo, op, isArt, isCav, cx, cy } = Q;
        const hb = H(bx, by);
        // low-sun shadow: the block footprint swept along the sun direction = its two downwind edges swept (two sheared quads; the plate covers the rest)
        { const len = (isArt ? 0.5 : 1) * S.shadowLen * op * (1 - 0.5 * rout), sx = SUNG[0] * len, sy = SUNG[1] * len;
          const sF = Math.sign(fx * SUNG[0] + fy * SUNG[1]) || 1, sL = Math.sign(px * SUNG[0] + py * SUNG[1]) || 1, hw = W / 2, hd = Dp / 2;
          let hs = hb; for (const [qx, qy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) hs = Math.max(hs, H(bx + px * hw * qx + fx * hd * qy, by + py * hw * qx + fy * hd * qy), H(bx + px * hw * qx + fx * hd * qy + sx, by + py * hw * qx + fy * hd * qy + sy));
          hs += 0.06;
          // edge 1: the lateral edge on the downwind side, edge 2: the short side edge on the downwind side
          for (const [ax, ay, ex, ey] of [[bx - px * hw + fx * hd * sF, by - py * hw + fy * hd * sF, px * W, py * W], [bx + px * hw * sL - fx * hd, by + py * hw * sL - fy * hd, fx * Dp, fy * Dp]]) {
            M4.set(ex, 0, sx, ax, 0, 1, 0, hs, ey, 0, sy, ay, 0, 0, 0, 1); shadows.setMatrixAt(ns++, M4); } }
        if (isArt) {
          const k = ng++; const ab = artBlocks.findIndex((q) => q.u === u && q.i === i);
          // limbered on the march: limber ahead of the gun, barrel trailing
          const G = S.gunK, lf = lerp(-0.13, 0.15, mo.m) * G;
          let rec = 0; for (const s of shots) { if (s.t > t) break; if (Math.hypot(s.x - cx, s.y - cy) < 0.9 && i === 0) rec = Math.max(rec, Math.exp(-(t - s.t) * 7) * (t - s.t < 1.2 ? 1 : 0)); }
          const gx = bx - fx * rec * 0.03 * G, gy = by - fy * rec * 0.03 * G, hg = H(gx, gy) + S.lift;
          const gf = mo.m > 0.5 ? -1 : 1;   // gun turned round when limbered
          const capd2 = u.cap != null && i < u.capN ? sstep(u.cap, u.cap + 0.8, t) : 0;   // captured guns turn grey (the boxes do the same)
          carriage.setColorAt(k, col.setHex(pal(b).gun).lerp(GREYC, capd2)); limber.setColorAt(k, col.setHex(pal(b).gun).lerp(GREYC, capd2));
          const og = op * G; setM(carriage, k, gx, hg, gy, fx * gf, fy * gf, og, og, og); setM(barrel, k, gx, hg, gy, fx * gf, fy * gf, og, og, og); setM(wheels, k, gx, hg, gy, fx, fy, og, og, og);
          const lx = bx + fx * lf, ly = by + fy * lf; setM(limber, k, lx, H(lx, ly) + S.lift, ly, fx, fy, og, og, og);
          // crew: four figures around the gun
          for (let j = 0; j < 4; j++) { const a = (j < 2 ? -1 : 1) * 0.07 * G, d = ((j % 2 ? 0.06 : -0.02) + 0.02 * Math.sin(t * 3 + j) * rec) * G;
            const x = gx + px * a + fx * -d, y = gy + py * a + fy * -d;
            setM(coats, nf, x, H(x, y) + S.lift, y, fx, fy, S.figW * op, S.figH * op, S.figD * op); coats.setColorAt(nf, col.setHex(pal(b).coat).lerp(GREYC, capd2));
            setM(pales, nf, x, H(x, y) + S.lift, y, fx, fy, S.figW * op, S.figH * op, S.figD * op); pales.setColorAt(nf, col.setHex(pal(b).pale)); nf++; }
          continue;
        }
        // ---- infantry / cavalry block ----
        const ip = np++;
        const pk = op * (1 - rout * 0.85);   // plate shrinks away when the block breaks
        const ry = hb + S.lift;
        setM(plateRim, ip, bx + fx * 0.006, ry, by + fy * 0.006, fx, fy, (W + 0.03) * pk, S.plateT * pk, (Dp + 0.042) * pk);
        if (u.form === "square") { setM(plateRim, ip, bx, ry, by, fx, fy, (W * 0.8 + 0.03) * pk, S.plateT * pk, (W * 0.8 + 0.03) * pk); setM(plateFill, ip, bx, ry + 0.001, by, fx, fy, W * 0.8 * pk, S.plateT * 1.1 * pk, W * 0.8 * pk);
          setM(holes, nq++, bx, ry + 0.002, by, fx, fy, W * 0.6 * pk, S.plateT * 1.2 * pk, W * 0.6 * pk); }
        else setM(plateFill, ip, bx - fx * 0.008, ry + 0.001, by - fy * 0.008, fx, fy, W * pk, S.plateT * 1.1 * pk, Dp * pk);
        // captured: plate fades to grey
        plateFill.setColorAt(ip, col.setHex(pal(b).plate).lerp(new THREE.Color(0x8a8580), capd));
        // standard at the centre of the second rank (dropped when broken)
        { const fk = op * (1 - rout); const sx = bx - fx * Dp * 0.12, sy = by - fy * Dp * 0.12, hs = H(sx, sy) + S.lift;
          setM(poles, ip, sx, hs, sy, fx, fy, fk, fk, fk); setM(flags, ip, sx, hs, sy, px, py, fk, fk * (1 + 0.08 * Math.sin(t * 5 + seed)), fk); }
        const nFigs = isCav ? CAV_LINE.length : NF, walk = mo.m;
        const sq = u.form === "square" ? W * 0.75 : 0;
        for (let j = 0; j < nFigs; j++) {
          const [L, C] = figAt(b, j);
          let la = lerp(L[0] * (sq || W * 0.92), C[0] * colW * 0.92, mo.col), lb = lerp(L[1] * (sq || Dp * 0.86), C[1] * colD * 0.92, mo.col);
          // tiny per-figure irregularity (GM's ranks are not ruler-straight), bigger when routing / captured
          const jit = 0.004 + rout * 0.09; la += (hash(seed + j, 1) - 0.5) * jit * 2; lb += (hash(seed + j, 2) - 0.5) * jit * 2 - rout * hash(seed + j, 3) * 0.12;
          const x = bx + px * la + fx * lb, y = by + py * la + fy * lb;
          const bob = walk * 0.006 * Math.abs(Math.sin(t * 7 + j * 0.9 + seed)), hy = H(x, y) + S.lift + S.plateT * pk + bob;
          const ff = rout > 0.3 && hash(seed + j, 4) < rout ? -1 : 1;   // routing men turn their backs
          const s = op; const ffx = fx * ff, ffy = fy * ff;
          if (isCav) { setM(horses, nh++, x, hy, y, ffx, ffy, S.figW * 1.5 * s, S.figH * 0.7 * s, S.figD * 2.2 * s); }
          const lift = isCav ? S.figH * 0.55 : 0;
          setM(coats, nf, x, hy + lift, y, ffx, ffy, S.figW * s, S.figH * s, S.figD * s);
          setM(pales, nf, x, hy + lift, y, ffx, ffy, S.figW * s, S.figH * s, S.figD * s);
          const gk = capd; const P = pal(b);
          coats.setColorAt(nf, col.setHex(P.coat).lerp(new THREE.Color(GREY.coat), gk)); pales.setColorAt(nf, col.setHex(P.pale).lerp(new THREE.Color(GREY.pale), gk)); nf++;
        }
    }
    holes.count = nq; coats.count = pales.count = nf; plateFill.count = plateRim.count = poles.count = flags.count = np; shadows.count = ns;
    carriage.count = barrel.count = wheels.count = limber.count = ng; if (horses) horses.count = nh;
    for (const m of [holes, coats, pales, plateFill, plateRim, poles, flags, shadows, carriage, barrel, wheels, limber, horses]) if (m) { m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true; }
    return { figures: nf, blocks: np, guns: ng };
  }
  // pre-index blocks so update() does not search (findIndex above stays O(n) but blocks are few hundred at most)
  return { update, blocks, meshes: { coats, pales, plateFill, plateRim, shadows, poles, flags, carriage, barrel, wheels, limber, horses } };
}

// =====================================================================================================================================
// v5 (critic B 5): our Style W boxes and arrows drawn IN the close scene instead of as DOM overlays, so they sit in the world like his
// blocks: the scene fog hazes them, the smoke sprites (renderOrder 10) and the cloud composite (10.5) draw OVER them, and each box throws
// a soft contact shadow toward the low sun. The look stays Style W: flat side-colour box, ink border, cream X (infantry) / dot (guns).
// They draw after the opaque world with depthTest off (no z-fighting with the coarse terrain, never cut by tree crowns), before the smoke.
// Box texture = a mask (R fill, G symbol, B ink border) so captured boxes can fade to grey per instance (instanceColor = fill colour).
export function createBoxes3D(o) {
  const { THREE, scene } = o, MAX = o.max ?? 256;
  const SUNG = (() => { const s = o.sun || [-0.7, 0.48, -0.4], l = Math.hypot(s[0], s[2]); return [-s[0] / l, -s[2] / l]; })();
  const mask = (sym) => { const c = document.createElement("canvas"); c.width = 256; c.height = 104; const g = c.getContext("2d"), W = 256, H = 104, bx = W * 0.07, by = H * 0.175;
    g.fillStyle = "#ff0000"; g.fillRect(0, 0, W, H);
    g.fillStyle = "#00ff00"; g.strokeStyle = "#00ff00"; g.lineCap = "butt";
    const cw = W - 2 * bx, ch = H - 2 * by;
    if (sym === "inf") { g.lineWidth = 0.06 * cw * 0.86 * 1.15; g.beginPath(); g.moveTo(bx, by); g.lineTo(W - bx, H - by); g.moveTo(W - bx, by); g.lineTo(bx, H - by); g.stroke(); }
    else { g.beginPath(); g.ellipse(W / 2, H / 2, cw * 0.11, ch * 0.275, 0, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = "#0000ff"; g.fillRect(0, 0, W, by); g.fillRect(0, H - by, W, by); g.fillRect(0, 0, bx, H); g.fillRect(W - bx, 0, bx, H);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.NoColorSpace; t.anisotropy = 8; t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; return t; };
  const shadowTex = (() => { const c = document.createElement("canvas"); c.width = 64; c.height = 32; const g = c.getContext("2d"), im = g.createImageData(64, 32);
    for (let y = 0; y < 32; y++) for (let x = 0; x < 64; x++) { const u = Math.abs(x / 63 - 0.5) * 2, v = Math.abs(y / 31 - 0.5) * 2, a = (1 - sstep(0.62, 1, u)) * (1 - sstep(0.35, 1, v)), k = (y * 64 + x) * 4;
      im.data[k] = im.data[k + 1] = im.data[k + 2] = 255; im.data[k + 3] = 255 * a; }
    g.putImageData(im, 0, 0); const t = new THREE.CanvasTexture(c); return t; })();
  const quad = () => { const g = new THREE.PlaneGeometry(1, 1); g.rotateX(-Math.PI / 2); g.setAttribute("iOp", new THREE.InstancedBufferAttribute(new Float32Array(MAX), 1)); return g; };
  const withOp = (m, extra) => { m.onBeforeCompile = (sh) => { sh.uniforms.uCream = { value: new THREE.Color("#f4eedd") }; sh.uniforms.uInk = { value: new THREE.Color("#15130f") };
      sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nattribute float iOp; varying float vOp;").replace("#include <begin_vertex>", "#include <begin_vertex>\nvOp = iOp;");
      sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying float vOp; uniform vec3 uCream; uniform vec3 uInk;");
      if (extra) sh.fragmentShader = extra(sh.fragmentShader);
      sh.fragmentShader = sh.fragmentShader.replace("#include <alphamap_fragment>", "#include <alphamap_fragment>\ndiffuseColor.a *= vOp;"); };
    m.customProgramCacheKey = () => "box3d" + (extra ? 1 : 0); return m; };
  const boxMat = (sym) => withOp(new THREE.MeshBasicMaterial({ map: mask(sym), transparent: true, depthTest: false, depthWrite: false, fog: true }),
    (fs) => fs.replace("#include <map_fragment>", "vec4 mk = texture2D( map, vMapUv ); mk.rgb /= max(mk.r + mk.g + mk.b, 1e-3);\n#ifdef USE_COLOR\nvec3 fillC = vColor;\n#else\nvec3 fillC = diffuse;\n#endif\ndiffuseColor.rgb = mk.r * fillC + mk.g * uCream + mk.b * uInk;").replace("#include <color_fragment>", ""));
  const mkIM = (mat, ro) => { const m = new THREE.InstancedMesh(quad(), mat, MAX); m.count = 0; m.frustumCulled = false; m.renderOrder = ro; m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); scene.add(m); return m; };
  const inf = mkIM(boxMat("inf"), 3.1), art = mkIM(boxMat("art"), 3.1);
  const shd = mkIM(withOp(new THREE.MeshBasicMaterial({ color: 0x0b0a08, map: shadowTex, transparent: true, opacity: o.shadowA ?? 0.42, depthTest: false, depthWrite: false, fog: true })), 3.0);
  for (const m of [inf, art]) m.setColorAt(0, new THREE.Color());
  const M4 = new THREE.Matrix4(), C = new THREE.Color(), lift = o.lift ?? 0.03, shOff = o.shadowOff ?? 0.075;
  // list: [{x, y, fx, fy, bw, bd, art, op, color: '#rrggbb' | THREE.Color, h}] (map plane, fx/fy = facing, bw along the line, bd along the facing)
  function set(list) {
    let ni = 0, na = 0, ns = 0;
    for (const b of list) { if (b.op <= 0.002) continue;
      const px = -b.fy, py = b.fx, y = b.h + lift, m = b.art ? art : inf, k = b.art ? na++ : ni++;
      // local x (quad width) -> lateral (bw), local z -> facing (bd)
      M4.set(px * b.bw, 0, -b.fx * b.bd, b.x, 0, 1, 0, y, py * b.bw, 0, -b.fy * b.bd, b.y, 0, 0, 0, 1); m.setMatrixAt(k, M4);   // z = -facing keeps det > 0 (front face up)
      m.setColorAt(k, b.color.isColor ? b.color : C.setStyle(b.color)); m.geometry.attributes.iOp.array[k] = b.op;
      M4.set(px * b.bw * 1.08, 0, -b.fx * b.bd * 1.3, b.x + SUNG[0] * shOff, 0, 1, 0, y - 0.002, py * b.bw * 1.08, 0, -b.fy * b.bd * 1.3, b.y + SUNG[1] * shOff, 0, 0, 0, 1); shd.setMatrixAt(ns, M4);
      shd.geometry.attributes.iOp.array[ns++] = b.op; }
    inf.count = ni; art.count = na; shd.count = ns;
    for (const m of [inf, art, shd]) { m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true; m.geometry.attributes.iOp.needsUpdate = true; }
  }
  return { set, meshes: { inf, art, shd } };
}

// Arrows as ground ribbons in the close scene (same Style W arrow: side colour body + head, ink outline at 60 %), draped on the terrain,
// fogged, under the smoke. pts in map units; grow = 0..1 drawn fraction; width w (units).
export function createArrows3D(o) {
  const { THREE, scene, heightAt } = o, N = 160;
  const mk = (ro, col, a) => { const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N * 2 * 3 + 9), 3).setUsage(THREE.DynamicDrawUsage));
    const idx = []; for (let i = 0; i < N - 1; i++) idx.push(2 * i, 2 * i + 1, 2 * i + 2, 2 * i + 1, 2 * i + 3, 2 * i + 2); idx.push(2 * N, 2 * N + 1, 2 * N + 2); g.setIndex(idx);
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: a, depthTest: false, depthWrite: false, fog: true, side: THREE.DoubleSide }));
    m.frustumCulled = false; m.renderOrder = ro; scene.add(m); return m; };
  const arrows = [];
  // GM's arrows ride OVER the battle smoke (684 s) but under the clouds (10.5) and in the fog: renderOrder 10.2 / 10.3
  // v7 (critic B 11): Style W arrow + a soft pale outer glow and a 2 px lighter rim inside the ink edge (GM's arrows have a light rim)
  function add(pts, color) { const rim = new THREE.Color(color).lerp(new THREE.Color(0xffffff), 0.5);
    const A = { pts, glow: mk(10.15, 0xf2f4f0, 0.16), out: mk(10.2, 0x0e0c08, 0.45), rim: mk(10.25, rim, 1), body: mk(10.3, color, 1) }; arrows.push(A); return A; }
  // heights: the ground under the line smoothed over ~1.5 units (raw heights made the flat ribbon wiggle on screen over every bump and the river bed)
  const smoothH = (P) => { const raw = P.map((p) => heightAt(p[0], p[1])), K = 9; return raw.map((_, i) => { let s = 0, c = 0; for (let j = Math.max(0, i - K); j <= Math.min(raw.length - 1, i + K); j++) { s += Math.max(raw[j], raw[i] - 0.02); c++; } return s / c; }); };
  function fill(mesh, P, w, hl, hw, ox, HS) {   // P: resampled centre line [[x,y]], ribbon half width w/2 + ox, head at the end
    const pa = mesh.geometry.attributes.position, a = pa.array, n = P.length, lift = 0.05;
    for (let i = 0; i < N; i++) { const j = Math.min(i, n - 1), p = P[j], q = P[Math.min(j + 1, n - 1)], r = P[Math.max(j - 1, 0)];
      let dx = q[0] - r[0], dy = q[1] - r[1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l; const hx = -dy * (w / 2 + ox), hy = dx * (w / 2 + ox);
      const h = HS[j] + lift; a.set([p[0] + hx, h, p[1] + hy, p[0] - hx, h, p[1] - hy], i * 6); }
    const e = P[n - 1], f = P[Math.max(0, n - 2)]; let dx = e[0] - f[0], dy = e[1] - f[1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
    const tip = [e[0] + dx * (hl + ox * 1.6), e[1] + dy * (hl + ox * 1.6)], h = HS[n - 1] + lift, hw2 = hw + ox * 1.4, bxp = e[0] - dx * ox, byp = e[1] - dy * ox;
    a.set([bxp - dy * hw2, h, byp + dx * hw2, bxp + dy * hw2, h, byp - dx * hw2, tip[0], h, tip[1]], N * 6);
    pa.needsUpdate = true; }
  // A, grow fraction k (0..1, eased by the caller), opacity op, shaft width w (units)
  function draw(A, k, op, w) {
    const vis = op > 0.002 && k > 0.001; A.glow.visible = A.out.visible = A.rim.visible = A.body.visible = vis; if (!vis) return;
    A.glow.material.opacity = 0.16 * op; A.out.material.opacity = 0.45 * op; A.rim.material.opacity = op; A.body.material.opacity = op;
    const pts = A.pts, seg = []; let L = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; }
    // round 2 (critic A S06 63 s): while the drawn length is shorter than ~2 heads, the head grows with it (no lone arrowhead before its shaft)
    const gk = Math.min(1, k * L / (w * 4.2)), hl = w * 2.1 * gk, hw = w * 1.5 * gk, end = Math.max(0, k * L - hl), P = [];   // the shaft stops where the head starts
    const at = (s) => { let i = 0; while (i < seg.length - 1 && s > seg[i]) { s -= seg[i]; i++; } const f = seg[i] ? Math.min(1, s / seg[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]; };
    const n = Math.max(2, Math.min(N, Math.ceil(end / 0.08) + 1)); for (let i = 0; i < n; i++) P.push(at(end * i / (n - 1)));
    if (end < 1e-3) { const d = at(Math.min(L, 0.01)); P[1] = [P[0][0] + (d[0] - P[0][0]) * 0.01 + 1e-4, P[0][1] + (d[1] - P[0][1]) * 0.01]; }
    const HS = smoothH(P); fill(A.glow, P, w, hl, hw, 0.11, HS); fill(A.out, P, w, hl, hw, 0.07, HS); fill(A.rim, P, w, hl, hw, 0.045, HS); fill(A.body, P, w, hl, hw, 0, HS); }
  return { add, draw, arrows };
}
