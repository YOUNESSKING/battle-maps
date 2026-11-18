// troops3d.js: Grand Maneuver-style 3D troops (SEQ.troops = "blocks") next to our Style W boxes (createBoxes3D, "boxes").
//
// v2 (owner 2026-11-18: "copy GM's troops, drop our 2D boxes"; study vicksburg/TROOPS_GM_STUDY.md, measured on gm_1814.mp4 516-950 s):
//  - every battalion = a flat base plate in the side colour, tilted with the ground, a bright pale FRONT edge (GM's white line on the
//    front of each block), and on it a grid of tiny 3D soldiers (coat in the side colour, pale trousers / belts / face, a dark musket);
//    12 files x 5 ranks in line (~2.9:1), 4 files x 15 ranks in column; one block per box of the unit data (GM shows ~3 per brigade);
//  - blocks TURN WITH THEIR UNIT (GM's blocks sit at every angle): a line faces its unit's `face`, a column faces along its road;
//  - motion (pure function of t, from the same unit keys): short forward moves = the line advances (step bob), short backward moves
//    = the line falls back facing the enemy with the men turned about, long / oblique / sideways moves and every "lin" (VX.march) key
//    = the unit forms a COLUMN behind its leading block, marches nose to tail along its path (bends with the road, never slides
//    sideways), then deploys into line again (blocks fan out to their slots) when it halts; wheels are smooth turns, never pops;
//  - escape (routing to a road): blocks peel off one by one into a road column with loosened ranks and fade over the frame edge
//    (never vanish mid-field); captured blocks stay where they were taken, grey plate, grey loosened men;
//  - artillery: a small side-colour plate with a pale front, gun + limber + 4 crew; limbered (limber ahead, gun trailing) on the move,
//    unlimbered facing the enemy at a halt, recoil on each shot; cavalry: two ranks of riders; squares (form: "square");
//  - long low-sun shadows (block footprint swept along the sun) + the real shadow map; blocks of different units never overlap
//    (deterministic push-apart, road columns are never shoved off their road); smoke sprites draw over the blocks.
// usage: const T3 = createTroops3D({ THREE, scene, heightAt, units, posAt, escAt, proj, edgeFade, sun, shots, troopScale });
//        per frame T3.update(t, hide) before rendering (hide 0..1 = dive deck covering the frame).

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), lerp = (a, b, k) => a + (b - a) * k;
const sstep = (a, b, x) => { const k = clamp((x - a) / (b - a)); return k * k * (3 - 2 * k); };
const hash = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const angDiff = (a, b) => { let d = b - a; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return d; };

const PAL = {
  u: { coat: 0x1f3a80, pale: 0xb9c9e0, plate: 0x2f5bc0, rim: 0xf3f1e8, flag: 0x1d2f7a, gun: 0x2f5bc0 },
  r: { coat: 0x8d8574, pale: 0xd2c8b2, plate: 0xb23a2c, rim: 0xf3eee2, flag: 0xb8261c, gun: 0xb23a2c },
};
const GREY = { coat: 0x8a8580, pale: 0xb4b0aa, plate: 0x8e8a82 };

function gridLayout(cols, rows) { const P = []; for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) P.push([(c + 0.5) / cols - 0.5, 0.5 - (r + 0.5) / rows]); return P; }

export function createTroops3D(o) {
  const { THREE, scene, heightAt, units } = o;
  const ts = o.troopScale || 1, H = (x, y) => heightAt(x, y);
  const S = { lift: 0.004 * ts, shadowK: 1.0, shadowA: 0.5, ...o.style };
  const SUNG = (() => { const s = o.sun || [-0.7, 0.48, -0.4], l = Math.hypot(s[0], s[2]); return [-s[0] / l, -s[2] / l]; })();
  const shots = (o.shots || []).slice().sort((a, b) => a.t - b.t);
  const NF = 60, INF_LINE = gridLayout(12, 5), INF_COL = gridLayout(4, 15), CAV_LINE = gridLayout(12, 2), CAV_COL = gridLayout(4, 6);
  const SQUARE = (() => { const P = []; for (let k = 0; k < NF; k++) { const side = k / 15 | 0, f = (k % 15 + 0.5) / 15 - 0.5, e = 0.5 - 0.06;
    P.push(side === 0 ? [f, e] : side === 1 ? [e, -f] : side === 2 ? [-f, -e] : [-e, f]); } return P; })();

  // ---------- per unit: block layout, path (arc length), motion runs ----------
  // pace: a unit never covers ground faster than vmax on average (GM's battalions creep); an over-fast move leaves EARLIER from its
  // preceding hold (at most 3 s), so it still arrives on its word. Arrows / banners keep the authored keys.
  const VMAX = (o.vmax ?? 1.5) * ts;
  const retime = (K0) => { const K = K0.map((k) => k.slice());
    for (let i = 1; i < K.length; i++) { if (K[i][3] === "lin") continue; const d = Math.hypot(K[i][1] - K[i - 1][1], K[i][2] - K[i - 1][2]), dur = K[i][0] - K[i - 1][0], need = d / VMAX;
      if (d < 1e-3 || need <= dur) continue; const hold = i === 1 || Math.hypot(K[i - 1][1] - K[i - 2][1], K[i - 1][2] - K[i - 2][2]) < 1e-3;
      if (!hold) continue; const lo = i === 1 ? -1e9 : K[i - 2][0] + 0.2; K[i - 1][0] = Math.max(lo, K[i][0] - need, K[i - 1][0] - 3); }
    return K; };
  const posAt = (K, t) => o.posAt(K, t);
  const UD = new Map(), blocks = [];
  for (const u of units) { u.keysGM = retime(u.keys);
    const art = u.type === "art", nb = u.n, span = u.n * u.bw + (u.n - 1) * u.gap, gapB = art ? u.gap * 1.6 : u.gap * 1.3;
    const bw = art ? u.bw * 0.78 : (span - (nb - 1) * gapB) / nb, bd = art ? u.bd * 0.8 : bw * 0.34;
    const colW = art ? bw * 0.5 : bw * 0.34, colL = art ? bd * 2.6 : bw * 1.15, spacing = colL + gapB * 1.1;
    const fx0 = Math.cos(u.face), fy0 = Math.sin(u.face), px0 = -fy0, py0 = fx0;
    const slots = Array.from({ length: nb }, (_, i) => -span / 2 + bw / 2 + i * (bw + (art ? (span - nb * bw) / Math.max(1, nb - 1) : gapB)));
    // path of the unit centre through its keys (arc length per key)
    const K = u.keysGM, cum = [0]; for (let i = 1; i < K.length; i++) cum.push(cum[i - 1] + Math.hypot(K[i][1] - K[i - 1][1], K[i][2] - K[i - 1][2]));
    // classify each moving segment: line move (advance / fall back) or column (long, oblique, sideways, "lin" = road march)
    const segMode = K.map((k, i) => { if (!i) return 0; const dx = K[i][1] - K[i - 1][1], dy = K[i][2] - K[i - 1][2], d = Math.hypot(dx, dy);
      if (d < 0.05 * ts) return 0; if (u.column === false) return 1; if (u.march || K[i][3] === "lin") return 2;
      const c = (dx * fx0 + dy * fy0) / d; return Math.abs(c) >= 0.72 && d <= Math.max(6 * span, 14 * ts) ? 1 : d <= 0.6 * span ? 1 : 2; });
    // column runs = consecutive column segments (short holds < 1.2 s between them merge)
    const runs = []; for (let i = 1; i < K.length; i++) { if (segMode[i] !== 2) continue; const last = runs[runs.length - 1];
      if (last && (last.i1 === i - 1 || (last.i1 === i - 2 && segMode[i - 1] === 0 && K[i - 1][0] - K[i - 2][0] < 1.2))) last.i1 = i; else runs.push({ i0: i, i1: i }); }
    for (const R of runs) { R.t0 = K[R.i0 - 1][0]; R.t1 = K[R.i1][0]; R.s0 = cum[R.i0 - 1]; R.s1 = cum[R.i1];
      let j = R.i0; while (j < R.i1 && cum[j] - cum[j - 1] < 1e-4) j++; const dx = K[j][1] - K[j - 1][1], dy = K[j][2] - K[j - 1][2], l = Math.hypot(dx, dy) || 1;
      R.dir0 = [dx / l, dy / l]; let e = R.i1; while (e > R.i0 && cum[e] - cum[e - 1] < 1e-4) e--; const ex = K[e][1] - K[e - 1][1], ey = K[e][2] - K[e - 1][2], el = Math.hypot(ex, ey) || 1; R.dir1 = [ex / el, ey / el];
      // marching order: the block whose line slot is furthest forward along the march leads
      const ord = slots.map((s, i) => ({ i, k: -(s * (px0 * R.dir0[0] + py0 * R.dir0[1])) + i * 1e-3 })).sort((a, b) => a.k - b.k); R.rank = []; ord.forEach((q, r) => { R.rank[q.i] = r; }); R.head = ord[0].i; }
    UD.set(u, { art, nb, span, bw, bd, colW, colL, spacing, slots, cum, runs, segMode, L: cum[cum.length - 1] });
    for (let i = 0; i < nb; i++) blocks.push({ u, i });
  }
  const infBlocks = blocks.filter((b) => b.u.type !== "art"), artBlocks = blocks.filter((b) => b.u.type === "art");
  const nFig = infBlocks.length * NF + artBlocks.length * 4;

  // arc length of the unit centre at t (same easing as posAt: in-out per segment, "lin" constant)
  const sAt = (u, t) => { const K = u.keysGM, D = UD.get(u); if (t <= K[0][0]) return 0;
    for (let i = 1; i < K.length; i++) if (t < K[i][0]) { const k = K[i][3] === "lin" ? clamp((t - K[i - 1][0]) / (K[i][0] - K[i - 1][0])) : sstep(K[i - 1][0], K[i][0], t); return D.cum[i - 1] + k * (D.cum[i] - D.cum[i - 1]); }
    return D.L; };
  // point on the unit path at arc length s, restricted to a run (before its start: extended back along its first direction)
  const pathAt = (u, R, s) => { const K = u.keysGM, D = UD.get(u);
    if (s <= R.s0) { const p = K[R.i0 - 1]; return [p[1] - R.dir0[0] * (R.s0 - s), p[2] - R.dir0[1] * (R.s0 - s)]; }
    if (s >= R.s1) { const p = K[R.i1]; return [p[1] + R.dir1[0] * (s - R.s1), p[2] + R.dir1[1] * (s - R.s1)]; }
    for (let i = R.i0; i <= R.i1; i++) if (s <= D.cum[i]) { const l = D.cum[i] - D.cum[i - 1], f = l > 1e-6 ? (s - D.cum[i - 1]) / l : 1; return [lerp(K[i - 1][1], K[i][1], f), lerp(K[i - 1][2], K[i][2], f)]; }
    const p = K[R.i1]; return [p[1], p[2]]; };
  const tangent = (u, R, s, h) => { const a = pathAt(u, R, s - h), b = pathAt(u, R, s + h), l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[0] - a[0]) / l, (b[1] - a[1]) / l]; };
  // column weight of a run at t: forms just before the head moves off, deploys after the unit halts (long enough for the tail to close up)
  const runClose = (u, R) => { const D = UD.get(u), tail = (D.nb - 1) * D.spacing; return Math.min(2.6, 0.8 + tail / Math.max(0.6, (R.s1 - R.s0) / Math.max(0.5, R.t1 - R.t0))); };

  // block base state (no push-apart): position, heading, column share, escape share. Pure in t.
  function base(u, i, t) {
    const D = UD.get(u), [cx, cy] = posAt(u.keysGM, t), fx = Math.cos(u.face), fy = Math.sin(u.face), px = -fy, py = fx;
    // r1 critic B: a unit that appears mid-scene walks in from behind its line while it fades in (no pop on the spot)
    const ar = u.t0 > 1 && u.arrive !== false ? (o.arrive ?? 2.2) * ts * (1 - sstep(u.t0, u.t0 + 2.0, t)) : 0;
    let x = cx + px * D.slots[i], y = cy + py * D.slots[i], hx = fx, hy = fy, c = 0;
    // column runs: the leading block steps off first, the others wait in their line slots and file in one after another behind it
    // (nobody walks backwards), the column follows the path nose to tail, then every block deploys into its new line slot
    for (const R of D.runs) { const K = u.keysGM, close = runClose(u, R); if (t < R.t0 || t > R.t1 + close) continue;
      // the column path = the unit path shifted onto the leading block's slot (the head steps straight off); the others walk from their
      // slot to the start of the column path, timed so they reach it exactly when their place in the column passes it
      const ho = D.slots[R.head], ox = px * ho, oy = py * ho, a = K[R.i0 - 1], S0 = [a[1] + px * D.slots[i], a[2] + py * D.slots[i]], P0 = [a[1] + ox, a[2] + oy];
      const Lc = Math.hypot(S0[0] - P0[0], S0[1] - P0[1]), s = sAt(u, t), g = s - R.s0 - R.rank[i] * D.spacing, endK = u.march ? 1 : 1 - sstep(R.t1 + 0.1, R.t1 + close, t);
      let q, tg;
      if (g >= 0) { const p = pathAt(u, R, R.s0 + g); q = [p[0] + ox, p[1] + oy]; tg = tangent(u, R, Math.max(R.s0 + 0.35 * D.spacing, R.s0 + g), 0.35 * D.spacing); }
      else { const f = Lc > 1e-4 ? sstep(0, 1, clamp((g + Lc) / Lc)) : 1; q = [lerp(S0[0], P0[0], f), lerp(S0[1], P0[1], f)];
        const cd = Lc > 1e-4 ? [(P0[0] - S0[0]) / Lc, (P0[1] - S0[1]) / Lc] : R.dir0, wp = sstep(-0.5 * Lc, 0, g);   // connector dir, easing into the column's
        tg = [lerp(cd[0], R.dir0[0], wp), lerp(cd[1], R.dir0[1], wp)]; }
      const k1 = g >= 0 ? (Lc > 1e-4 ? 1 : sstep(0, 0.6 * D.spacing, g)) : Lc > 1e-4 ? sstep(-Lc, -Lc + Math.min(Lc, 0.5 * D.spacing), g) : 1;   // turning share: from the moment it steps off
      x = lerp(x, q[0], endK); y = lerp(y, q[1], endK);
      const kk = k1 * endK, a0 = Math.atan2(hy, hx), a1 = Math.atan2(tg[1], tg[0]), an = a0 + angDiff(a0, a1) * kk; hx = Math.cos(an); hy = Math.sin(an); c = Math.max(c, endK * (g >= 0 ? 1 : sstep(-Lc - 0.01, 0, g))); }
    let e = 0;
    if (u.esc && i >= u.escFrom && t > u.esc.t0) {   // routing to a road: peel off one by one, nose to tail, along the road
      const si = u.esc.s(t) - (i - u.escFrom) * D.spacing * 1.05;
      if (si > -0.6 * D.spacing) { const [ex, ey, dx, dy] = o.escAt(u.esc, Math.max(0, si)), k = sstep(-0.6 * D.spacing, 0.9 * D.spacing, si);
        x = lerp(x, ex, k); y = lerp(y, ey, k); const a0 = Math.atan2(hy, hx), a1 = Math.atan2(dy, dx), a = a0 + angDiff(a0, a1) * sstep(0, 0.6, k); hx = Math.cos(a); hy = Math.sin(a); c = Math.max(c, k); e = k; } }
    return { x: x - fx * ar, y: y - fy * ar, hx, hy, c, e };
  }

  // heading at t: the base heading turned toward where the block walks (no crab-walking); a line falling back keeps facing the enemy
  // but squares up to its line of retreat; guns and captured blocks keep theirs
  function headAt(u, i, t) { const q = base(u, i, t); if (u.type === "art" || (u.cap != null && i < u.capN && t > u.cap)) return [q.hx, q.hy];
    const qa = base(u, i, t - 0.3), qb = base(u, i, t + 0.3), vx = (qb.x - qa.x) / 0.6, vy = (qb.y - qa.y) / 0.6, spd = Math.hypot(vx, vy); if (spd < 1e-4) return [q.hx, q.hy];
    const dv = (vx * q.hx + vy * q.hy) / spd, w = 0.85 * sstep(0.2 * ts, 1.6 * ts, spd), wF = w * sstep(-0.45, 0.05, dv), wB = w * (1 - sstep(-0.8, -0.5, dv));
    const a0 = Math.atan2(q.hy, q.hx), va = Math.atan2(vy, vx), a = a0 + angDiff(a0, va) * wF + angDiff(a0, va + Math.PI) * wB; return [Math.cos(a), Math.sin(a)]; }

  // ---------- geometry ----------
  const box = (w, h, d, x = 0, y = 0, z = 0) => { const g = new THREE.BoxGeometry(w, h, d); g.translate(x, y, z); return g; };
  const merge = (gs, cols) => {
    let n = 0; for (const g of gs) n += g.attributes.position.count;
    const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), col = new Float32Array(n * 3), idx = []; let off = 0;
    gs.forEach((g, gi) => { const p = g.attributes.position, nn = g.attributes.normal, c = new THREE.Color(cols[gi]);
      for (let k = 0; k < p.count; k++) { pos.set([p.getX(k), p.getY(k), p.getZ(k)], (off + k) * 3); nor.set([nn.getX(k), nn.getY(k), nn.getZ(k)], (off + k) * 3); col.set([c.r, c.g, c.b], (off + k) * 3); }
      for (let k = 0; k < g.index.count; k++) idx.push(g.index.getX(k) + off); off += p.count; });
    const m = new THREE.BufferGeometry(); m.setAttribute("position", new THREE.BufferAttribute(pos, 3)); m.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
    m.setAttribute("color", new THREE.BufferAttribute(col, 3)); m.setIndex(idx); return m; };
  // soldier in a unit cube (x lateral, y up, z back): coat (instance colour) + the pale parts (trousers, cap / face, cross belts) + musket
  const coatG = merge([box(1, 0.42, 1, 0, 0.60, 0), box(1.12, 0.10, 1.05, 0, 0.84, 0)], [0xffffff, 0xffffff]);
  const paleG = merge([box(0.8, 0.40, 0.8, 0, 0.20, 0), box(0.55, 0.18, 0.55, 0, 0.98, 0), box(1.04, 0.07, 0.25, 0, 0.75, -0.42), box(0.16, 0.66, 0.16, 0.6, 0.86, -0.1)],
    [0xffffff, 0xf0e2c8, 0xf4f2ea, 0x2a2420]);
  const horseG = merge([box(0.7, 0.45, 2.4, 0, 0.55, 0), box(0.45, 0.45, 0.6, 0, 0.85, -1.25)], [0x4a3524, 0x3c2a1c]);
  const lam = (p = {}) => new THREE.MeshLambertMaterial(p);
  const mkIM = (geo, mat, n, cast = true) => { const m = new THREE.InstancedMesh(geo, mat, Math.max(1, n)); m.castShadow = cast; m.receiveShadow = true;
    m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); m.frustumCulled = false; m.count = 0; m.renderOrder = 2; scene.add(m); return m; };
  const coats = mkIM(coatG, lam({ vertexColors: true }), nFig), pales = mkIM(paleG, lam({ vertexColors: true }), nFig);
  const nCav = infBlocks.filter((b) => b.u.type === "cav").length * CAV_LINE.length;
  const horses = nCav ? mkIM(horseG, lam({ vertexColors: true }), nCav) : null;
  const nPl = blocks.length;
  const plateFill = mkIM(box(1, 1, 1, 0, 0.5, 0), lam(), nPl, false);
  const plateRim = mkIM(box(1, 1, 1, 0, 0.5, 0), lam({ emissive: 0x262626 }), nPl, false);   // a thin pale border round the plate
  const plateFront = mkIM(box(1, 1, 1, 0, 0.5, 0), lam({ color: 0xffffff, emissive: 0x5a5a56 }), nPl, false);   // GM's bright front edge
  const holes = mkIM(box(1, 1, 1, 0, 0.5, 0), lam({ color: 0x55574a }), Math.max(1, infBlocks.filter((b) => b.u.form === "square").length), false);
  const SC = document.createElement("canvas"); SC.width = 64; SC.height = 64; { const g = SC.getContext("2d"), im = g.createImageData(64, 64);
    for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) { const uu = Math.abs(x / 63 - 0.5) * 2, v = Math.abs(y / 63 - 0.5) * 2;
      const a = S.shadowA * (1 - sstep(0.55, 1, uu)) * (1 - sstep(0.35, 1, v)), c = Math.round(255 * (1 - a)), k = (y * 64 + x) * 4;
      im.data[k] = c; im.data[k + 1] = c; im.data[k + 2] = c * 0.98 + 5 * a; im.data[k + 3] = 255; }
    g.putImageData(im, 0, 0); }
  const stex = new THREE.CanvasTexture(SC); stex.colorSpace = THREE.SRGBColorSpace;
  const shG = new THREE.PlaneGeometry(1, 1); shG.rotateX(-Math.PI / 2);
  const shadows = mkIM(shG, new THREE.MeshBasicMaterial({ map: stex, fog: false, side: THREE.DoubleSide, transparent: false, blending: THREE.CustomBlending, blendEquation: THREE.AddEquation,
    blendSrc: THREE.ZeroFactor, blendDst: THREE.SrcColorFactor, depthWrite: false, depthTest: true }), blocks.length * 2, false);
  shadows.receiveShadow = false; shadows.renderOrder = 1;
  const poles = mkIM(box(0.04, 1.3, 0.04, 0, 0.65, 0), lam({ color: 0x2a2018 }), infBlocks.length, false);   // GM: no standards on the blocks (S.flags = true brings them back)
  const flagG = new THREE.PlaneGeometry(0.55, 0.36); flagG.translate(0.275, 1.1, 0);
  const flags = mkIM(flagG, lam({ side: THREE.DoubleSide }), infBlocks.length, false);
  // guns (unit cube = one gun section footprint scaled by gk): carriage (side tint), barrel, wheels, limber
  const carriage = mkIM(box(0.18, 0.11, 0.55, 0, 0.11, 0.1), lam(), artBlocks.length);
  const barrel = mkIM((() => { const g = new THREE.CylinderGeometry(0.05, 0.065, 0.6, 8); g.rotateX(Math.PI / 2); g.translate(0, 0.2, -0.1); return g; })(), lam({ color: 0x3a3022 }), artBlocks.length);
  const wheels = mkIM((() => { const a = new THREE.CylinderGeometry(0.13, 0.13, 0.04, 10); a.rotateZ(Math.PI / 2); const b = a.clone(); a.translate(-0.15, 0.13, 0); b.translate(0.15, 0.13, 0); return merge([a, b], [0x2a2018, 0x2a2018]); })(), lam({ vertexColors: true }), artBlocks.length);
  const limber = mkIM(merge([box(0.27, 0.18, 0.32, 0, 0.18, 0), box(0.29, 0.04, 0.34, 0, 0.29, 0)], [0xffffff, 0xd8cfbc]), lam({ vertexColors: true }), artBlocks.length);

  const M4 = new THREE.Matrix4(), col = new THREE.Color(), GREYC = new THREE.Color(GREY.coat), GREYP = new THREE.Color(GREY.pale), GREYL = new THREE.Color(GREY.plate);
  // map-plane frame -> matrix: lateral L = (-fy, fx), forward F = (fx, fy); local x -> L, y -> up, z -> -F; sL / sF = ground slope along L / F (plates tilt with the hill)
  const setM = (im, k, x, y, z, fx, fy, sx, sy, sz, sL = 0, sF = 0) => { M4.set(-fy * sx, 0, -fx * sz, x, sL * sx, sy, -sF * sz, y, fx * sx, 0, -fy * sz, z, 0, 0, 0, 1); im.setMatrixAt(k, M4); };
  const pal = (u) => PAL[u.side] || PAL.u;
  infBlocks.forEach((b, k) => { flags.setColorAt(k, col.setHex(pal(b.u).flag)); });
  const fade = (u, t) => t >= u.t0 && t < u.t1 ? Math.min(sstep(u.t0, u.t0 + 0.6, t), 1 - sstep(u.t1 - 0.6, u.t1, t)) : 0;

  function update(t, hide = 0) {
    let nf = 0, nh = 0, np = 0, ns = 0, ng = 0, nq = 0, nfl = 0; const ST = [];
    for (const b of blocks) { const u = b.u, op0 = fade(u, t) * (1 - hide); if (op0 <= 0.001) continue;
      const D = UD.get(u), q = base(u, b.i, t), qa = base(u, b.i, t - 0.45), qb = base(u, b.i, t + 0.45);
      { let hx = 0, hy = 0; for (const dt of [0, 0.3, 0.6, 0.9]) { const w = dt ? 1 - dt / 1.2 : 1; for (const z of dt ? [headAt(u, b.i, t - dt), headAt(u, b.i, t + dt)] : [headAt(u, b.i, t)]) { hx += z[0] * w; hy += z[1] * w; } }
        const l = Math.hypot(hx, hy); if (l > 1e-3) { q.hx = hx / l; q.hy = hy / l; } }   // heading low-pass over +-0.9 s: wheels take time, never snap
      const vx = (qb.x - qa.x) / 0.9, vy = (qb.y - qa.y) / 0.9, spd = Math.hypot(vx, vy);
      let op = op0; if (q.e > 0 && u.esc.fade && o.proj && o.edgeFade) op *= o.edgeFade(u.esc.fade, o.proj(q.x, q.y), -30, 170);
      if (op <= 0.001) continue;
      // r1 critic B: a captured battery that leaves the data (t1) is RE-taken: it turns back to its side colour before it hands over
      const capd = u.cap != null && b.i < u.capN ? sstep(u.cap, u.cap + 0.8, t) * (u.t1 < 1e8 ? 1 - sstep(u.t1 - 1.8, u.t1 - 0.9, t) : 1) : 0;
      ST.push({ b, u, D, ...q, vx, vy, spd, op, capd, fixed: q.c > 0.5 || q.e > 0.3 || u.type === "art" || capd > 0 }); }
    // push-apart between blocks of different units: ONE pass from the unpushed positions (continuous in t, so it never pops), each block
    // gives ground along its own heading (a pressed line steps back, it never slides sideways); road columns, escaping blocks, guns and
    // captured blocks are never shoved
    const PX = ST.map(() => [0, 0]);
    for (let a = 0; a < ST.length; a++) for (let c = a + 1; c < ST.length; c++) { const A = ST[a], B = ST[c];
      if (A.u === B.u || (A.u.group != null && A.u.group === B.u.group) || (A.fixed && B.fixed)) continue;
      const dx = B.x - A.x, dy = B.y - A.y, d = Math.hypot(dx, dy) || 1e-3, rr = 0.5 * (Math.sqrt(A.D.bw * A.D.bd * 2.2) + Math.sqrt(B.D.bw * B.D.bd * 2.2));
      if (d >= rr) continue; const k = (rr - d) / d * 0.6, wa = A.fixed ? 0 : B.fixed ? 1 : 0.5, wb = 1 - wa;
      const ka = (dx * A.hx + dy * A.hy) * k * wa, kb = (dx * B.hx + dy * B.hy) * k * wb;
      PX[a][0] -= A.hx * ka; PX[a][1] -= A.hy * ka; PX[c][0] += B.hx * kb; PX[c][1] += B.hy * kb; }
    ST.forEach((Q, k) => { Q.x += PX[k][0]; Q.y += PX[k][1]; });
    for (const Q of ST) {
      const { b, u, D, x: bx, y: by, hx: fx, hy: fy, c, e, vx, vy, spd, op, capd } = Q, px = -fy, py = fx, i = b.i, seed = (blocks.indexOf(b) + 1) * 7.31;
      const isArt = u.type === "art", isCav = u.type === "cav", P = pal(u);
      const W = lerp(D.bw, D.colW, c), Dp = lerp(D.bd, D.colL, c);
      const hb = H(bx, by), sL = (H(bx + px * W * 0.5, by + py * W * 0.5) - H(bx - px * W * 0.5, by - py * W * 0.5)) / Math.max(W, 1e-3);
      const sF = (H(bx + fx * Dp * 0.5, by + fy * Dp * 0.5) - H(bx - fx * Dp * 0.5, by - fy * Dp * 0.5)) / Math.max(Dp, 1e-3);
      const mv = sstep(0.04 * ts, 0.3 * ts, spd), back = mv * sstep(0.2, 0.6, -(vx * fx + vy * fy) / Math.max(spd, 1e-4)) * (1 - c);   // falling back in line: men turned about
      const loose = Math.max(capd, e * 0.7);
      // low-sun shadow (r1 critic A: the swept edge quads drew thin dark lines off the blocks): one soft dark footprint, pushed downwind
      { const len = S.shadowK * (isArt ? 0.6 : 1) * Math.max(Dp * 1.4, 0.3 * ts), ox = bx + SUNG[0] * len * 0.55, oy = by + SUNG[1] * len * 0.55;
        const hs = Math.max(hb, H(ox, oy)) + 0.012 * ts, sw = W * (isArt ? 0.7 : 1.06) + len * Math.abs(px * SUNG[0] + py * SUNG[1]), sd = Dp * (isArt ? 0.75 : 1.1) + len * Math.abs(fx * SUNG[0] + fy * SUNG[1]);
        M4.set(-fy * sw, 0, -fx * sd, ox, 0, 1, 0, hs, fx * sw, 0, -fy * sd, oy, 0, 0, 0, 1); shadows.setMatrixAt(ns++, M4); }
      // plate: side colour, tilted with the ground, pale border + bright front edge (grey when captured)
      const pT = 0.018 * ts, ry = hb + S.lift, ip = np++, pk = op * (1 - 0.15 * loose);
      const AW = isArt ? 0.62 : 1, AD = isArt ? 0.7 : 1;   // guns: a small plate just under the piece
      setM(plateRim, ip, bx, ry, by, fx, fy, (W * AW + 0.03 * ts) * pk, pT * pk, (Dp * AD + 0.03 * ts) * pk, sL, sF);
      setM(plateFill, ip, bx, ry + 0.002 * ts, by, fx, fy, W * AW * pk, pT * 1.15 * pk, Dp * AD * pk, sL, sF);
      const fr = Dp * AD * (isArt ? 0.12 : 0.075), fo = Dp * AD / 2 - fr / 2; setM(plateFront, ip, bx + fx * fo, ry + 0.003 * ts + sF * fo, by + fy * fo, fx, fy, (W * AW + 0.03 * ts) * pk, pT * 1.3 * pk, fr * pk, sL, 0);
      plateFill.setColorAt(ip, col.setHex(P.plate).lerp(GREYL, capd)); plateRim.setColorAt(ip, col.setHex(P.plate).multiplyScalar(0.55).lerp(GREYC, capd));   // r1 critic A: GM's border is dark, only the FRONT edge is bright plateFront.setColorAt(ip, col.setHex(P.rim).lerp(GREYP, capd * 0.7));
      if (isArt) {
        const k = ng++, gk = D.bw * 0.75, lmb = Math.max(c, mv);   // limbered while moving
        let rec = 0; for (const s of shots) { if (s.t > t) break; if (Math.hypot(s.x - bx, s.y - by) < D.span * 0.6 + 0.5 * ts && i === 0) rec = Math.max(rec, Math.exp(-(t - s.t) * 7) * (t - s.t < 1.2 ? 1 : 0)); }
        // the gun turns on its trail: muzzle to the front at a halt, trail first (towed) on the move
        const ga = Math.atan2(fy, fx) + Math.PI * sstep(0.2, 0.8, lmb), gfx = Math.cos(ga), gfy = Math.sin(ga);
        const gx = bx - fx * (rec * 0.08 * gk) - fx * lmb * 0.15 * gk, gy = by - fy * (rec * 0.08 * gk) - fy * lmb * 0.15 * gk, hg = H(gx, gy) + S.lift + pT;
        const cg = col.setHex(0x4a3a28).lerp(GREYC, capd); carriage.setColorAt(k, cg); limber.setColorAt(k, cg);
        const og = op * gk; setM(carriage, k, gx, hg, gy, gfx, gfy, og, og, og); setM(barrel, k, gx, hg, gy, gfx, gfy, og, og, og); setM(wheels, k, gx, hg, gy, gfx, gfy, og, og, og);
        const lf = lerp(-0.55, 0.5, sstep(0.1, 0.9, lmb)) * gk, lx = bx + fx * lf, ly = by + fy * lf; setM(limber, k, lx, H(lx, ly) + S.lift + pT, ly, fx, fy, og, og, og);
        const fs = gk * 0.11;   // crew: four men round the gun (walk beside the limber on the move)
        for (let j = 0; j < 4; j++) { const a = (j < 2 ? -1 : 1) * (0.2 + 0.05 * (j % 2)) * gk, d = ((j % 2 ? 0.28 : 0.05) + 0.03 * Math.sin(t * 3 + j) * rec - 0.2 * lmb) * gk;
          const x = gx + px * a - fx * d, y = gy + py * a - fy * d, s = op * fs;
          setM(coats, nf, x, H(x, y) + S.lift + pT, y, fx, fy, s * 0.55, s * 1.9, s * 0.5); coats.setColorAt(nf, col.setHex(P.coat).lerp(GREYC, capd));
          setM(pales, nf, x, H(x, y) + S.lift + pT, y, fx, fy, s * 0.55, s * 1.9, s * 0.5); pales.setColorAt(nf, col.setHex(P.pale).lerp(GREYP, capd)); nf++; }
        continue;
      }
      if (u.form === "square") setM(holes, nq++, bx, ry + 0.004 * ts, by, fx, fy, W * 0.6 * pk, pT * 1.3 * pk, W * 0.6 * pk, sL, sF);
      // standard: a small colour on a pole behind the second rank (lowered when captured)
      { const fk = op * (1 - capd), sp = D.bw * 0.92 / 12, sx = bx - fx * Dp * 0.1, sy = by - fy * Dp * 0.1, hs = H(sx, sy) + S.lift + pT, kf = nfl++, s = sp * 1.6 * fk;
        if (S.flags) { setM(poles, kf, sx, hs, sy, fx, fy, s, s, s); setM(flags, kf, sx, hs, sy, px, py, s, s * (1 + 0.08 * Math.sin(t * 5 + seed)), s); } else nfl--; }
      const LINE = isCav ? CAV_LINE : u.form === "square" ? SQUARE : INF_LINE, COL = isCav ? CAV_COL : INF_COL, nFigs = LINE.length;
      const sp = D.bw * 0.92 / 12, fw = sp * 0.42, fd = sp * 0.4, fh = sp * 1.9, walk = mv;   // r1 critic A: slimmer men, the plate colour shows between the files
      const sq = u.form === "square" ? W * 0.75 : 0;
      for (let j = 0; j < nFigs; j++) {
        const L = LINE[j], C = COL[j];
        let la = lerp(L[0] * (sq || D.bw * 0.92), C[0] * D.colW * 0.92, c), lb = lerp(L[1] * (sq || D.bd * 0.84), C[1] * D.colL * 0.94, c);
        const jit = 0.06 * sp + loose * 0.9 * sp; la += (hash(seed + j, 1) - 0.5) * jit * 2; lb += (hash(seed + j, 2) - 0.5) * jit * 2;
        const x = bx + px * la + fx * lb, y = by + fy * lb + py * la;
        const bob = walk * 0.12 * fh * Math.abs(Math.sin(t * 7 + j * 0.9 + seed)), hy = H(x, y) + S.lift + pT * 1.15 + bob;
        const turned = back > 0.5 || (capd > 0.5 && hash(seed + j, 4) < 0.45) ? -1 : 1, ffx = fx * turned, ffy = fy * turned, s = op;
        const lift = isCav ? fh * 0.55 : 0;
        if (isCav) setM(horses, nh++, x, hy, y, ffx, ffy, fw * 1.5 * s, fh * 0.7 * s, fd * 2.2 * s);
        setM(coats, nf, x, hy + lift, y, ffx, ffy, fw * s, fh * s, fd * s); setM(pales, nf, x, hy + lift, y, ffx, ffy, fw * s, fh * s, fd * s);
        coats.setColorAt(nf, col.setHex(P.coat).lerp(GREYC, capd)); pales.setColorAt(nf, col.setHex(P.pale).lerp(GREYP, capd)); nf++;
      }
    }
    holes.count = nq; coats.count = pales.count = nf; plateFill.count = plateRim.count = plateFront.count = np; poles.count = flags.count = nfl; shadows.count = ns;
    carriage.count = barrel.count = wheels.count = limber.count = ng; if (horses) horses.count = nh;
    for (const m of [holes, coats, pales, plateFill, plateRim, plateFront, poles, flags, shadows, carriage, barrel, wheels, limber, horses]) if (m) { m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true; }
    API.last = ST.map((q) => ({ k: blocks.indexOf(q.b), u: units.indexOf(q.u), x: q.x, y: q.y, hx: q.hx, hy: q.hy, c: q.c, e: q.e, op: q.op, art: q.u.type === "art" }));   // for tools/check_troops_motion.mjs
    return { figures: nf, blocks: np, guns: ng };
  }
  const API = { update, blocks, base, meshes: { coats, pales, plateFill, plateRim, plateFront, shadows, poles, flags, carriage, barrel, wheels, limber, horses } };
  return API;
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
  const { THREE, scene, heightAt } = o, N = 160, GM = o.style === "gm";
  const mk = (ro, col, a) => { const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N * 2 * 3 + 9), 3).setUsage(THREE.DynamicDrawUsage));
    const idx = []; for (let i = 0; i < N - 1; i++) idx.push(2 * i, 2 * i + 1, 2 * i + 2, 2 * i + 1, 2 * i + 3, 2 * i + 2); idx.push(2 * N, 2 * N + 1, 2 * N + 2); g.setIndex(idx);
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: a, depthTest: false, depthWrite: false, fog: true, side: THREE.DoubleSide }));
    m.frustumCulled = false; m.renderOrder = ro; scene.add(m); return m; };
  const arrows = [], SUNG = (() => { const s = o.sun || [-0.7, 0.48, -0.4], l = Math.hypot(s[0], s[2]); return [-s[0] / l, -s[2] / l]; })();
  // GM's arrows ride OVER the battle smoke (684 s) but under the clouds (10.5) and in the fog: renderOrder 10.2 / 10.3
  // v7 (critic B 11): Style W arrow + a soft pale outer glow and a 2 px lighter rim inside the ink edge (GM's arrows have a light rim)
  function add(pts, color) { const rim = new THREE.Color(color).lerp(new THREE.Color(0xffffff), 0.5);
    if (GM) {   // v2 (GM study): pale side tint, thin darker edge with a pale highlight just inside it, soft drop shadow toward the sun's side
      const base = new THREE.Color(color), dark = base.clone().multiplyScalar(0.5);
      const A = { pts, gm: true, glow: mk(10.12, 0x10140f, 0.22), out: mk(10.2, dark, 0.85), rim: mk(10.25, 0xf4f6f2, 0.9), body: mk(10.3, base, 0.93) }; arrows.push(A); return A; }
    const A = { pts, glow: mk(10.15, 0xf2f4f0, 0.16), out: mk(10.2, 0x0e0c08, 0.45), rim: mk(10.25, rim, 1), body: mk(10.3, color, 1) }; arrows.push(A); return A; }
  // heights: the ground under the line smoothed over ~1.5 units (raw heights made the flat ribbon wiggle on screen over every bump and the river bed)
  const smoothH = (P) => { const raw = P.map((p) => heightAt(p[0], p[1])), K = 9; return raw.map((_, i) => { let s = 0, c = 0; for (let j = Math.max(0, i - K); j <= Math.min(raw.length - 1, i + K); j++) { s += Math.max(raw[j], raw[i] - 0.02); c++; } return s / c; }); };
  function fill(mesh, P, w, hl, hw, ox, HS, sh = [0, 0]) {   // P: resampled centre line [[x,y]], ribbon half width w/2 + ox, head at the end
    const pa = mesh.geometry.attributes.position, a = pa.array, n = P.length, lift = 0.05;
    for (let i = 0; i < N; i++) { const j = Math.min(i, n - 1), p = P[j], q = P[Math.min(j + 1, n - 1)], r = P[Math.max(j - 1, 0)];
      let dx = q[0] - r[0], dy = q[1] - r[1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l; const hx = -dy * (w / 2 + ox), hy = dx * (w / 2 + ox);
      const h = HS[j] + lift; a.set([p[0] + hx + sh[0], h, p[1] + hy + sh[1], p[0] - hx + sh[0], h, p[1] - hy + sh[1]], i * 6); }
    const e = P[n - 1], f = P[Math.max(0, n - 2)]; let dx = e[0] - f[0], dy = e[1] - f[1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
    const tip = [e[0] + dx * (hl + ox * 1.6), e[1] + dy * (hl + ox * 1.6)], h = HS[n - 1] + lift, hw2 = hw + ox * 1.4, bxp = e[0] - dx * ox, byp = e[1] - dy * ox;
    a.set([bxp - dy * hw2 + sh[0], h, byp + dx * hw2 + sh[1], bxp + dy * hw2 + sh[0], h, byp - dx * hw2 + sh[1], tip[0] + sh[0], h, tip[1] + sh[1]], N * 6);
    pa.needsUpdate = true; }
  // A, grow fraction k (0..1, eased by the caller), opacity op, shaft width w (units)
  function draw(A, k, op, w) {
    const vis = op > 0.002 && k > 0.001; A.glow.visible = A.out.visible = A.rim.visible = A.body.visible = vis; if (!vis) return;
    if (A.gm) { A.glow.material.opacity = 0.22 * op; A.out.material.opacity = 0.85 * op; A.rim.material.opacity = 0.9 * op; A.body.material.opacity = 0.93 * op; }
    else { A.glow.material.opacity = 0.16 * op; A.out.material.opacity = 0.45 * op; A.rim.material.opacity = op; A.body.material.opacity = op; }
    const pts = A.pts, seg = []; let L = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; }
    // round 2 (critic A S06 63 s): while the drawn length is shorter than ~2 heads, the head grows with it (no lone arrowhead before its shaft)
    const gk = Math.min(1, k * L / (w * 4.2)), hl = w * 2.1 * gk, hw = w * 1.5 * gk, end = Math.max(0, k * L - hl), P = [];   // the shaft stops where the head starts
    const at = (s) => { let i = 0; while (i < seg.length - 1 && s > seg[i]) { s -= seg[i]; i++; } const f = seg[i] ? Math.min(1, s / seg[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]; };
    const n = Math.max(2, Math.min(N, Math.ceil(end / 0.08) + 1)); for (let i = 0; i < n; i++) P.push(at(end * i / (n - 1)));
    if (end < 1e-3) { const d = at(Math.min(L, 0.01)); P[1] = [P[0][0] + (d[0] - P[0][0]) * 0.01 + 1e-4, P[0][1] + (d[1] - P[0][1]) * 0.01]; }
    const HS = smoothH(P);
    if (A.gm) { const sh = [SUNG[0] * w * 0.35, SUNG[1] * w * 0.35]; fill(A.glow, P, w, hl, hw, w * 0.1, HS, sh); fill(A.out, P, w, hl, hw, w * 0.07, HS); fill(A.rim, P, w, hl, hw, w * 0.0, HS); fill(A.body, P, w, hl, hw, -w * 0.09, HS); return; }
    fill(A.glow, P, w, hl, hw, 0.11, HS); fill(A.out, P, w, hl, hw, 0.07, HS); fill(A.rim, P, w, hl, hw, 0.045, HS); fill(A.body, P, w, hl, hw, 0, HS); }
  return { add, draw, arrows };
}
