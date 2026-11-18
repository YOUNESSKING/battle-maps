// troops3d.js: Grand Maneuver-style 3D troops (SEQ.troops = "blocks") next to our Style W boxes (createBoxes3D, "boxes").
// v3 motion (fixed shapes, calm trapezoid pace, flank-march columns, road queues, no push-apart): see the comment in createTroops3D.
// The v2 notes below describe the look (kept); its motion notes are superseded by v3.
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
const angDiff = (a, b) => { const T = 2 * Math.PI; return (((b - a + Math.PI) % T) + T) % T - Math.PI; };   // closed form (a loop never ends on a huge angle)

const PAL = {
  u: { coat: 0x3557a8, pale: 0xc9d7ea, plate: 0x4a78d6, rim: 0xe9e4d4, flag: 0x1d2f7a, gun: 0x2f5bc0 },   // v4 (critic): Union ~20 % lighter (navy vanished over the woods)
  r: { coat: 0x8d8574, pale: 0xd2c8b2, plate: 0xb23a2c, rim: 0xf3eee2, flag: 0xb8261c, gun: 0xb23a2c },
};
const GREY = { coat: 0x8a8580, pale: 0xb4b0aa, plate: 0x8e8a82 };

function gridLayout(cols, rows) { const P = []; for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) P.push([(c + 0.5) / cols - 0.5, 0.5 - (r + 0.5) / rows]); return P; }

export function createTroops3D(o) {
  // v3 (owner 2026-11-18 on v2: "they're stretching, colliding, then fleeing in a way I don't like; more professional"):
  //  - FIXED SHAPES: a block's plate and its 60 men never change size or shape. A column is the same block marching BY THE FLANK
  //    (the men face along the march, the plate's long side lies along the road); line <-> column = the men turn in place (~1 s),
  //    the plate wheels with them; nothing stretches or squashes, nothing shrinks (fades are real opacity).
  //  - CALM PACE: every move uses a trapezoid speed profile (ease in / cruise / ease out); infantry cruises at <= o.vmax (default
  //    1.0 x troopScale units/s ~ 4-5 % of a close frame per second), an over-fast move sets off earlier from its preceding hold (<= 5 s).
  //  - ORDER: forward / backward moves keep the line (rigid, the whole line together); sideways / oblique / road (`lin`) moves march
  //    by the flank nose to tail at a CONSTANT spacing behind the leading block and deploy into line at the halt.
  //  - RETREAT: escaping blocks step back out of the line, turn, and join ONE queue per road at a steady pace and constant spacing,
  //    units in order (first to leave = first on the road); they leave the frame or fade gradually at its edge; captured blocks stay put, grey, tidy.
  //  - no push-apart (it made blocks slide): overlaps are measured by tools/check_troops_motion.mjs and fixed in the scene data.
  const { THREE, scene, heightAt, units } = o;
  const ts = o.troopScale || 1, H = (x, y) => heightAt(x, y), SIZE = o.size ?? 1.2;   // owner: blocks ~20 % bigger (GM)
  const S = { lift: 0.004 * ts, shadowK: 1.0, shadowA: 0.42, ...o.style };
  const SUNG = (() => { const s = o.sun || [-0.7, 0.48, -0.4], l = Math.hypot(s[0], s[2]); return [-s[0] / l, -s[2] / l]; })();
  const shots = (o.shots || []).slice().sort((a, b) => a.t - b.t);
  const NF = 72, INF = gridLayout(12, 6), CAV = gridLayout(12, 2);
  const SQUARE = (() => { const P = []; for (let k = 0; k < NF; k++) { const side = k / 15 | 0, f = (k % 15 + 0.5) / 15 - 0.5, e = 0.5 - 0.06;
    P.push(side === 0 ? [f, e] : side === 1 ? [e, -f] : side === 2 ? [-f, -e] : [-e, f]); } return P; })();
  const VPK = (o.vmax ?? 1.0) * ts, VESC = (o.vesc ?? 1.25) * ts, RAMP = 1.0;   // peak march speed, retreat speed, ease seconds
  // trapezoid progress (0..1) at normalised time x, ramp fraction r at each end (constant cruise between: no darting)
  const trap = (x, r) => { x = clamp(x); if (r <= 1e-4) return x; const vm = 1 / (1 - r); if (x < r) return 0.5 * vm * x * x / r; if (x > 1 - r) { const y = 1 - x; return 1 - 0.5 * vm * y * y / r; } return 0.5 * vm * r + vm * (x - r); };
  const ang = (x, y) => Math.atan2(y, x), uv = (a) => [Math.cos(a), Math.sin(a)];
  const axisTo = (a0, a1) => { let d = angDiff(a0, a1); if (d > Math.PI / 2) d -= Math.PI; if (d < -Math.PI / 2) d += Math.PI; return a0 + d; };   // nearest of a1 / a1+pi

  // ---------- per unit: shape, path, moves (trapezoid), column runs, escape queue ----------
  const UD = new Map(), blocks = [];
  for (const u of units) {
    // GM has about half as many, bigger blocks: infantry n boxes -> round(2n/3) blocks, each 20 % bigger than a v2 block (owner), so a
    // brigade's frontage SHRINKS a little (fewer collisions on a crowded field); guns stay one piece per box
    const SZU = SIZE * (u.size ?? (u.type === "art" ? 1 : 0.96 + 0.08 * hash(units.indexOf(u) + 3, 7))), art = u.type === "art", gapB = (art ? u.gap * 1.6 : u.gap * 1.3) * SIZE, nb = art ? u.n : Math.max(1, Math.round(u.n * 2 / 3));
    const bw = art ? u.bw * 0.78 * SIZE : (u.n * u.bw + (u.n - 1) * u.gap - (u.n - 1) * u.gap * 1.3) / u.n * SZU, span = art ? (u.n * u.bw + (u.n - 1) * u.gap) * SIZE : nb * bw + (nb - 1) * gapB;
    const bd = art ? u.bd * 0.8 * SIZE : bw * 0.44; /* v4: ranks ~30 % deeper (chunkier, GM) */ u._bpb = u.n / nb;   // boxes per block (escape `from`, `capN` are in boxes)
    const fa = u.face, slots = Array.from({ length: nb }, (_, i) => -span / 2 + bw / 2 + i * (bw + (art ? (span - nb * bw) / Math.max(1, nb - 1) : gapB)));
    const K = u.keys, P = K.map((k) => [k[1], k[2]]), cum = [0]; for (let i = 1; i < P.length; i++) cum.push(cum[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
    // moves: a chain of "lin" keys (VX.march) is ONE move; any other moving segment is one move; holds between them
    const moves = []; for (let i = 1; i < K.length; i++) { const d = cum[i] - cum[i - 1]; if (d < 0.02 * ts) continue; const last = moves[moves.length - 1];
      if (K[i][3] === "lin" && last && last.lin && last.i1 === i - 1) { last.i1 = i; last.t1 = K[i][0]; last.s1 = cum[i]; continue; }
      moves.push({ i0: i, i1: i, t0: K[i - 1][0], t1: K[i][0], s0: cum[i - 1], s1: cum[i], lin: K[i][3] === "lin" }); }
    for (let m = 0; m < moves.length; m++) { const M = moves[m], L = M.s1 - M.s0, prevEnd = m ? moves[m - 1].t1 : -1e9;
      const dir = (() => { const a = P[M.i0 - 1], b = P[M.i1]; const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; })();
      const cf = dir[0] * Math.cos(fa) + dir[1] * Math.sin(fa);
      M.col = !art && (u.march || M.lin || Math.abs(cf) < 0.64) && u.column !== false && L > 0.5 * bw;   // sideways / oblique / road = by the flank
      // calm pace: leave earlier from the preceding hold so the cruise speed stays <= VPK (arrival time unchanged)
      if (L / Math.max(1e-3, M.t1 - M.t0 - RAMP) > VPK && !(o.keepTimes || u.keepTimes)) M.t0 = Math.min(M.t0, Math.max(prevEnd + 0.3, M.t0 - 5, M.t1 - (L / VPK + RAMP)));
      M.r = Math.min(0.45, RAMP / Math.max(1e-3, M.t1 - M.t0)); M.dir = dir; }
    // a move that follows a column move within 1.6 s stays in column (no deploy-on-the-move), deploying once at the real halt
    const tailEst = clamp((nb - 1) * (bw + gapB) / VPK + 0.6, 1.4, 4);
    for (let m = 1; m < moves.length; m++) if (moves[m - 1].col && !moves[m].col && moves[m].t0 - moves[m - 1].t1 < tailEst + 0.2 && u.column !== false && !art) moves[m].col = true;
    // column runs: consecutive column moves (short holds between them stay in column)
    const runs = []; for (const M of moves) { if (!M.col) continue; const R = runs[runs.length - 1]; if (R && R.mLast.t1 > M.t0 - 1.2 && R.mLast === moves[moves.indexOf(M) - 1]) { R.mLast = M; R.t1 = M.t1; R.s1 = M.s1; R.i1 = M.i1; continue; }
      runs.push({ mFirst: M, mLast: M, t0: M.t0, t1: M.t1, s0: M.s0, s1: M.s1, i0: M.i0, i1: M.i1 }); }
    for (const R of runs) { const d0 = R.mFirst.dir, L0 = [-Math.sin(fa), Math.cos(fa)];
      const ord = slots.map((s, i) => ({ i, k: -s * (L0[0] * d0[0] + L0[1] * d0[1]) + i * 1e-3 })).sort((a, b) => a.k - b.k); R.rank = []; ord.forEach((q, r) => { R.rank[q.i] = r; }); R.head = ord[0].i;
      // the plate's forward in column = the march direction turned 90 deg, to the side nearer the line's front (fixed for the whole run: no flips)
      const ta = ang(d0[0], d0[1]); R.off = Math.abs(angDiff(fa, ta + Math.PI / 2)) <= Math.abs(angDiff(fa, ta - Math.PI / 2)) ? Math.PI / 2 : -Math.PI / 2;
      R.tail = tailEst;
      // the column's road: the run's key polyline with rounded corners (Chaikin x4), re-parameterised by arc length (no hairpin snaps)
      let Q = P.slice(R.i0 - 1, R.i1 + 1); for (let it = 0; it < 4 && Q.length > 2; it++) { const N = [Q[0]]; for (let k = 0; k < Q.length - 1; k++) { const a = Q[k], b = Q[k + 1];
        N.push([0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]], [0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]]); } N.push(Q[Q.length - 1]); Q = N; }
      R.sm = Q; R.smL = 0; for (let k = 1; k < Q.length; k++) R.smL += Math.hypot(Q[k][0] - Q[k - 1][0], Q[k][1] - Q[k - 1][1]); }
    UD.set(u, { art, nb, span, bw, bd, slots, P, cum, moves, runs, L: cum[cum.length - 1], spacing: bw + gapB });
    for (let i = 0; i < nb; i++) blocks.push({ u, i });
  }
  const infBlocks = blocks.filter((b) => b.u.type !== "art"), artBlocks = blocks.filter((b) => b.u.type === "art");
  const NS = o.skirmishers ?? 5, nFig = infBlocks.length * (NF + NS) + artBlocks.length * 4;

  const sAt = (u, t) => { const D = UD.get(u); let s = 0; for (const M of D.moves) { if (t <= M.t0) return s; if (t >= M.t1) { s = M.s1; continue; } return M.s0 + (M.s1 - M.s0) * trap((t - M.t0) / (M.t1 - M.t0), M.r); } return s; };
  const ptAt = (u, s) => { const D = UD.get(u), P = D.P, c = D.cum; if (P.length === 1) return P[0].slice();
    let i = 1; while (i < P.length - 1 && s > c[i]) i++; const l = c[i] - c[i - 1], f = l > 1e-6 ? (s - c[i - 1]) / l : 1; return [lerp(P[i - 1][0], P[i][0], f), lerp(P[i - 1][1], P[i][1], f)]; };
  // a point of a run's path at arc s (outside the run: extended straight along its end directions)
  const runPt = (u, R, s) => { if (s <= R.s0) { const p = ptAt(u, R.s0), d = R.mFirst.dir; return [p[0] - d[0] * (R.s0 - s), p[1] - d[1] * (R.s0 - s)]; }
    if (s >= R.s1) { const p = ptAt(u, R.s1), d = R.mLast.dir; return [p[0] + d[0] * (s - R.s1), p[1] + d[1] * (s - R.s1)]; }
    const a = along(R.sm, (s - R.s0) / Math.max(1e-6, R.s1 - R.s0) * R.smL); return [a[0], a[1]]; };
  const runTan = (u, R, s, h) => { const a = runPt(u, R, s - h), b = runPt(u, R, s + h), l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[0] - a[0]) / l, (b[1] - a[1]) / l]; };

  // ---------- escape queues: every escaping block of every unit on the same road joins one queue ----------
  // block path: line slot -> 0.8 block-lengths straight back (clear of its neighbours) -> the road join -> along the road (extended past its end)
  const pathLen = (p) => { let L = 0; for (let i = 1; i < p.length; i++) L += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); return L; };
  const along = (p, s) => { let i = 1; while (i < p.length - 1 && s > Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1])) { s -= Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); i++; }
    const a = p[i - 1], b = p[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, f = i === p.length - 1 ? s / l : clamp(s / l); return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, (b[0] - a[0]) / l, (b[1] - a[1]) / l]; };
  const QUEUES = new Map(), ESCB = new Map(), BRIDGES = o.bridges || [];
  const onBridge = (x, y) => { let m = 0; for (const B of BRIDGES) { const ax = [Math.cos(B.angle), Math.sin(B.angle)], dx = x - B.x, dy = y - B.z, al = Math.abs(dx * ax[0] + dy * ax[1]), lt = Math.abs(-dx * ax[1] + dy * ax[0]);
    if (lt < 0.9) m = Math.max(m, 1 - sstep(B.len / 2 + 0.1, B.len / 2 + 2.6, al)); } return m; };
  const deckTop = (x, y) => { let h = -1e9; for (const B of BRIDGES) { const ax = [Math.cos(B.angle), Math.sin(B.angle)], dx = x - B.x, dy = y - B.z, al = Math.abs(dx * ax[0] + dy * ax[1]), lt = Math.abs(-dx * ax[1] + dy * ax[0]);
    if (lt < 0.14 && al < B.len / 2 + 0.02 && B.deck != null) h = Math.max(h, B.deck * (o.ys || 0) + 0.025); } return h; };
  for (const u of units) { if (!u.esc) continue; const D = UD.get(u), E = u.esc, road = E.path.slice(1), key = road[road.length - 1].map((v) => v.toFixed(1)).join(",");
    const fa = u.face, F = [Math.cos(fa), Math.sin(fa)], L0 = [-F[1], F[0]], c0 = o.posAt(u.keys, E.t0);
    const rc = [0]; for (let i = 1; i < road.length; i++) rc.push(rc[i - 1] + Math.hypot(road[i][0] - road[i - 1][0], road[i][1] - road[i - 1][1]));
    for (let i = Math.round(E.from / u._bpb); i < D.nb; i++) { const sl = [c0[0] + L0[0] * D.slots[i] * 1, c0[1] + L0[1] * D.slots[i]], back = [sl[0] - F[0] * (D.bw * 0.8), sl[1] - F[1] * (D.bw * 0.8)];
      let j = 0, bd = 1e9; road.forEach((p, k) => { const d = Math.hypot(p[0] - back[0], p[1] - back[1]) - k * 1e-3; if (d < bd && (k === road.length - 1 || ((road[k + 1][0] - p[0]) * (p[0] - back[0]) + (road[k + 1][1] - p[1]) * (p[1] - back[1])) >= -1e-6)) { bd = d; j = k; } });
      // approach = a cubic curve: straight back out of the line, bending smoothly onto the road's direction at the join (no corners)
      const J = road[j], Jn = road[Math.min(j + 1, road.length - 1)], rl = Math.hypot(Jn[0] - J[0], Jn[1] - J[1]) || 1, rd = [(Jn[0] - J[0]) / rl, (Jn[1] - J[1]) / rl];
      const dJ = Math.max(D.bw, Math.hypot(J[0] - sl[0], J[1] - sl[1])), c1 = [sl[0] - F[0] * dJ * 0.65, sl[1] - F[1] * dJ * 0.65], c2 = [J[0] - rd[0] * dJ * 0.4, J[1] - rd[1] * dJ * 0.4];
      const app = []; for (let k = 0; k <= 16; k++) { const tt = k / 16, m = 1 - tt; app.push([m * m * m * sl[0] + 3 * m * m * tt * c1[0] + 3 * m * tt * tt * c2[0] + tt * tt * tt * J[0], m * m * m * sl[1] + 3 * m * m * tt * c1[1] + 3 * m * tt * tt * c2[1] + tt * tt * tt * J[1]]); }
      let path = [...app]; for (const p of road.slice(j + 1)) { const q = path[path.length - 1], d = Math.hypot(p[0] - q[0], p[1] - q[1]), n = Math.max(1, Math.ceil(d / 0.25)); for (let k = 1; k <= n; k++) path.push([q[0] + (p[0] - q[0]) * k / n, q[1] + (p[1] - q[1]) * k / n]); }
      for (const B of BRIDGES) { const ax = [Math.cos(B.angle), Math.sin(B.angle)], hl = B.len / 2;   // v5: on a bridge the column walks the deck's centreline
        let arc = 0; path = path.map((p, k0) => { if (k0) arc += Math.hypot(p[0] - path[k0 - 1][0], p[1] - path[k0 - 1][1]);   // (never moves the start: the block's own slot)
          const dx = p[0] - B.x, dy = p[1] - B.z, al = dx * ax[0] + dy * ax[1], lt = -dx * ax[1] + dy * ax[0]; if (Math.abs(lt) > 1.4 || Math.abs(al) > hl + 2.2) return p;
          const k = (1 - sstep(hl + 0.2, hl + 2.2, Math.abs(al))) * sstep(0.8, 2.2, arc); return [p[0] + ax[1] * lt * k, p[1] - ax[0] * lt * k]; }); }
      for (let it = 0; it < 3; it++) { const N = [path[0]]; for (let k = 0; k < path.length - 1; k++) { const p0 = path[k], p1 = path[k + 1];
        N.push([0.75 * p0[0] + 0.25 * p1[0], 0.75 * p0[1] + 0.25 * p1[1]], [0.25 * p0[0] + 0.75 * p1[0], 0.25 * p0[1] + 0.75 * p1[1]]); } N.push(path[path.length - 1]); path = N; }
      { // v5: resample every 0.05 u and smooth (moving average +-0.9 u, start pinned) so bends near the bridge are gentle curves, not kinks
        const L = pathLen(path), R = []; for (let w = 0; w <= L; w += 0.05) { const g = along(path, w); R.push([g[0], g[1]]); } R.push(path[path.length - 1]);
        for (let pass = 0; pass < 3; pass++) { const Hn = 26, S2 = R.map((p, k) => { if (k < 2) return p; const h = Math.min(Hn, k); let x = 0, y = 0, n = 0; for (let q = k - h; q <= Math.min(R.length - 1, k + h); q++) { x += R[q][0]; y += R[q][1]; n++; } return [x / n, y / n]; });
          for (let k = 0; k < R.length; k++) R[k] = S2[k]; } path = R; }
      let kj = 0, dj = 1e9; path.forEach((p, k) => { const d = Math.hypot(p[0] - J[0], p[1] - J[1]); if (d < dj) { dj = d; kj = k; } });
      const a = pathLen(path.slice(0, kj + 1));
      // the path's tangent angle, UNWRAPPED along its length (the plate turns exactly as the path bends: no flips, no snaps)
      const angs = []; let prevA = null; for (let w = 0; w <= pathLen(path) + 40; w += 0.1) { const g = along(path, w), raw = Math.atan2(g[3], g[2]); prevA = prevA === null ? raw : prevA + angDiff(prevA, raw); angs.push(prevA); }
      const jn = road[Math.min(j + 1, road.length - 1)], dd = ang(jn[0] - road[j][0], jn[1] - road[j][1]) || 0;
      const thr = angs[Math.min(angs.length - 1, Math.round((a + 1) / 0.1))] - angs[0], poff = Math.abs(thr + Math.PI / 2) < Math.abs(thr - Math.PI / 2) ? Math.PI / 2 : -Math.PI / 2;
      const q = { u, i, path, a, angs, poff, rj: rc[j], t0: E.t0, len: D.bw, gap: D.spacing - D.bw, off: Math.abs(angDiff(fa, dd + Math.PI / 2)) <= Math.abs(angDiff(fa, dd - Math.PI / 2)) ? Math.PI / 2 : -Math.PI / 2 };
      (QUEUES.get(key) || QUEUES.set(key, []).get(key)).push(q); ESCB.set(`${units.indexOf(u)}:${i}`, q); } }
  for (const Q of QUEUES.values()) { Q.sort((p, q) => p.t0 - q.t0 || q.rj - p.rj || p.i - q.i); }   // first to leave, then the one further down the road
  const ramp = (tau, V) => tau <= 0 ? 0 : tau < RAMP ? V * tau * tau / (2 * RAMP) : V * (tau - RAMP / 2);
  // road coordinate (arc from the road start) of every queued block's centre at t: own walk, never closer than one spacing behind the block ahead
  // queue schedule (pure, built once): block k sets off at T_k, never before its unit's escape time and never before the block ahead
  // is one spacing further down the road; all walk the same ramp + cruise, so the gap only ever opens (no catching up, no braking)
  const invRamp = (d, V) => d <= 0 ? 0 : d < V * RAMP / 2 ? Math.sqrt(2 * d * RAMP / V) : d / V + RAMP / 2;
  for (const Q of QUEUES.values()) { const V = Math.min(...Q.map((q) => Math.min(VESC, q.u.esc.v ?? VESC))); let prev = null;
    for (const q of Q) { q.V = V; q.T = q.t0 + 0.6;   // the men turn about first
      if (prev) { const need = (q.rj - q.a) + (prev.len / 2 + q.len / 2 + Math.max(prev.gap, q.gap) + 0.3 * q.len) - (prev.rj - prev.a); q.T = Math.max(q.T, prev.T + invRamp(need, V), prev.T + 0.7); }   // v4: a clear gap + front-to-back stagger
      prev = q; } }
  const queueAt = (t) => { const out = new Map(); for (const Q of QUEUES.values()) for (const q of Q) out.set(q, q.rj - q.a + ramp(t - q.T, q.V)); return out; };

  // block base state at t: position, plate axis angle (forward of the plate), soldiers' facing angle, column share, escape share
  let QC = { t: NaN, m: null };
  function base(u, i, t) {
    const D = UD.get(u), s = sAt(u, t), lag = i ? 0.25 + 0.35 * hash(units.indexOf(u) * 7 + i, 5) : 0, c0 = ptAt(u, sAt(u, t - lag)), fa = u.face, F = uv(fa), L0 = [-F[1], F[0]];   // v5: blocks of a line do not move in lockstep
    let x = c0[0] + L0[0] * D.slots[i], y = c0[1] + L0[1] * D.slots[i], pa = fa, sa = fa, c = 0, e = 0, EQ = null, EW = 0;
    // falling back in line: the men turn about while the line walks backwards (the plate keeps facing the enemy)
    // line moves: every block turns to walk straight along the move (forward, or backward with the men turned about) - an oblique advance
    // in echelon, never a crab-walk - and turns back to its front after the halt
    for (const M of D.moves) { const tl = t - lag; if (M.col || tl < M.t0 - 1.1 || tl > M.t1 + 1.1) continue; const back = M.dir[0] * F[0] + M.dir[1] * F[1] < -0.3, k = sstep(M.t0 - 1.0, M.t0 - 0.05, tl) * (1 - sstep(M.t1 + 0.05, M.t1 + 1.0, tl));
      const md = ang(M.dir[0], M.dir[1]), ta = back ? md + Math.PI : md; pa = fa + angDiff(fa, ta) * k; sa = back ? pa + Math.PI * k : pa; }
    for (const R of D.runs) { const turn = 0.9, tail = R.tail; if (t < R.t0 - turn || t > R.t1 + tail + 1.4) continue;
      const ho = D.slots[R.head], hx = L0[0] * ho, hy = L0[1] * ho, a = ptAt(u, R.s0), S0 = [a[0] + L0[0] * D.slots[i], a[1] + L0[1] * D.slots[i]], P0 = [a[0] + hx, a[1] + hy];
      const Lc = Math.hypot(S0[0] - P0[0], S0[1] - P0[1]), g = Math.min(s, R.s1) - R.s0 - R.rank[i] * D.spacing;   // parked at the run's end, never extrapolated
      let q, tg;
      if (g >= 0) { const p = runPt(u, R, R.s0 + g); q = [p[0] + hx, p[1] + hy]; tg = runTan(u, R, R.s0 + g, 0.4 * D.bw); }
      else { const f = Lc > 1e-4 ? clamp((g + Lc) / Lc) : 1; q = [lerp(S0[0], P0[0], f), lerp(S0[1], P0[1], f)]; tg = Lc > 1e-4 ? [(P0[0] - S0[0]) / Lc, (P0[1] - S0[1]) / Lc] : R.mFirst.dir; }
      // the men face the march and the plate wheels to lie along it BEFORE anyone moves (turn), back to the line after the halt (deploy)
      // deploy at the halt in three clear steps: every block wheels in place to the line's front (blocks nose to tail have room to
      // turn), the men face where their block must go and it walks there (along its long side), then the men face the front
      const kOn = sstep(R.t0 - turn, R.t0, t), ud = clamp((t - R.t1 - 0.1) / (tail + 1.2)), w1 = sstep(0, 0.22, ud), mv = sstep(0.28, 0.8, ud), f1 = sstep(0.86, 1, ud);
      const ta = ang(tg[0], tg[1]), dv = [x - q[0], y - q[1]], dl = Math.hypot(dv[0], dv[1]), da = dl > 0.15 * D.bw ? ang(dv[0], dv[1]) : fa;
      const paCol = fa + angDiff(fa, ta + R.off) * kOn, saCol = fa + angDiff(fa, ta) * kOn;
      pa = paCol + angDiff(paCol, fa) * w1;
      const saMid = saCol + angDiff(saCol, da) * w1; sa = saMid + angDiff(saMid, fa) * f1;
      x = lerp(q[0], x, mv); y = lerp(q[1], y, mv); c = Math.max(c, kOn * (1 - w1)); }
    if (u.esc && i >= Math.round(u.esc.from / u._bpb) && t > u.esc.t0 - 1) { const q = ESCB.get(`${units.indexOf(u)}:${i}`);
      if (q) { if (QC.t !== t) QC = { t, m: queueAt(t) }; const rho = QC.m.get(q), w = rho - (q.rj - q.a);   // distance walked along its own path
        if (w > 0) { EQ = q; EW = w; const [ex, ey, dx, dy] = along(q.path, w), back = w < D.bw * 0.7;
          x = ex; y = ey; const ta = ang(dx, dy), turnK = sstep(D.bw * 0.5, D.bw * 1.4, w), fb = fa + Math.PI;
          const th = q.angs[Math.min(q.angs.length - 1, Math.round(w / 0.1))] - q.angs[0]; sa = fb + th; pa = fa + th + q.poff * turnK; e = 1; c = Math.max(c, turnK); }
        else { sa = fa + Math.PI * sstep(0, 0.6, t - q.t0); } } }   // about to go: the men turn about
    const ar = u.t0 > 1 && u.arrive !== false ? (o.arrive ?? 1.6) * ts * (1 - trap((t - u.t0) / 3.0, 0.4)) : 0;   // walks in while fading in
    return { x: x - F[0] * ar, y: y - F[1] * ar, pa, sa, c, e, eq: EQ, ew: EW };
  }
  const vecAvg = (list) => { let x = 0, y = 0; for (const [a, w] of list) { x += Math.cos(a) * w; y += Math.sin(a) * w; } return Math.atan2(y, x); };

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
  const coatG = merge([box(1, 0.42, 1, 0, 0.60, 0), box(1.12, 0.10, 1.05, 0, 0.84, 0)], [0xffffff, 0xffffff]);
  const paleG = merge([box(0.8, 0.40, 0.8, 0, 0.20, 0), box(0.55, 0.18, 0.55, 0, 0.98, 0), box(1.04, 0.07, 0.25, 0, 0.75, -0.42), box(0.16, 0.66, 0.16, 0.6, 0.86, -0.1)],
    [0xffffff, 0xf0e2c8, 0xf4f2ea, 0x2a2420]);
  const horseG = merge([box(0.7, 0.45, 2.4, 0, 0.55, 0), box(0.45, 0.45, 0.6, 0, 0.85, -1.25)], [0x4a3524, 0x3c2a1c]);
  // per-instance opacity (fades are real transparency now, never a shrink)
  const ALL = [];
  const lam = (p = {}) => { const m = new THREE.MeshLambertMaterial({ transparent: true, ...p });
    m.onBeforeCompile = (sh) => { sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nattribute float iOp; varying float vOp;").replace("#include <begin_vertex>", "#include <begin_vertex>\nvOp = iOp;");
      sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying float vOp;").replace("#include <dithering_fragment>", "#include <dithering_fragment>\ngl_FragColor.a *= vOp;"); };
    m.customProgramCacheKey = () => "t3op" + (p.vertexColors ? 1 : 0); return m; };
  const mkIM = (geo, mat, n, cast = true) => { const N = Math.max(1, n), g = geo.clone(); g.setAttribute("iOp", new THREE.InstancedBufferAttribute(new Float32Array(N).fill(1), 1));
    const m = new THREE.InstancedMesh(g, mat, N); m.castShadow = cast; m.receiveShadow = true;
    m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); m.frustumCulled = false; m.count = 0; m.renderOrder = 2; scene.add(m); ALL.push(m); return m; };
  const setOp = (m, k, a) => { m.geometry.attributes.iOp.array[k] = a; };
  const coats = mkIM(coatG, lam({ vertexColors: true }), nFig), pales = mkIM(paleG, lam({ vertexColors: true }), nFig);
  const nCav = infBlocks.filter((b) => b.u.type === "cav").length * CAV.length;
  const horses = nCav ? mkIM(horseG, lam({ vertexColors: true }), nCav) : null;
  const nPl = blocks.length;
  const plateFill = mkIM(box(1, 1, 1, 0, 0.5, 0), lam(), nPl, false);
  const plateRim = mkIM(box(1, 1, 1, 0, 0.5, 0), lam({ emissive: 0x262626 }), nPl, false);
  const plateFront = mkIM(box(1, 1, 1, 0, 0.5, 0), lam({ color: 0xffffff, emissive: 0x5a5a56 }), nPl, false);
  const holes = mkIM(box(1, 1, 1, 0, 0.5, 0), lam({ color: 0x55574a }), Math.max(1, infBlocks.filter((b) => b.u.form === "square").length), false);
  const SC = document.createElement("canvas"); SC.width = 64; SC.height = 64; { const g = SC.getContext("2d"), im = g.createImageData(64, 64);
    for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) { const uu = Math.abs(x / 63 - 0.5) * 2, v = Math.abs(y / 63 - 0.5) * 2;
      const a = (1 - sstep(0.55, 1, uu)) * (1 - sstep(0.35, 1, v)), k = (y * 64 + x) * 4; im.data[k] = im.data[k + 1] = im.data[k + 2] = 0; im.data[k + 3] = Math.round(255 * a); }
    g.putImageData(im, 0, 0); }
  const stex = new THREE.CanvasTexture(SC);
  const shG = new THREE.PlaneGeometry(1, 1); shG.rotateX(-Math.PI / 2);
  const shMat = new THREE.MeshBasicMaterial({ map: stex, color: 0x0b0a08, transparent: true, depthWrite: false, fog: true });
  shMat.onBeforeCompile = (sh) => { sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nattribute float iOp; varying float vOp;").replace("#include <begin_vertex>", "#include <begin_vertex>\nvOp = iOp;");
    sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying float vOp;").replace("#include <dithering_fragment>", "#include <dithering_fragment>\ngl_FragColor.a *= vOp;"); };
  shMat.customProgramCacheKey = () => "t3sh";
  const shadows = mkIM(shG, shMat, blocks.length, false); shadows.receiveShadow = false; shadows.renderOrder = 1;
  // v4 (critic): a faint pale halo under every block keeps it readable over dark woods
  const haloMat = shMat.clone(); haloMat.color = new THREE.Color(0xffffff); haloMat.onBeforeCompile = shMat.onBeforeCompile; haloMat.customProgramCacheKey = () => "t3halo";
  const halos = mkIM(shG, haloMat, blocks.length, false); halos.receiveShadow = false; halos.renderOrder = 1.05;
  // woods mask from the region's wood trees (kind 0): blocks in a wood stand IN it (sunk into the canopy blanket, heads and shoulders
  // showing between the crowns) instead of on top of the canopy
  const WM = (() => { const tr = (o.trees || []).filter((q) => (q[3] || 0) === 0); if (!tr.length) return null; let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const q of tr) { x0 = Math.min(x0, q[0]); y0 = Math.min(y0, q[1]); x1 = Math.max(x1, q[0]); y1 = Math.max(y1, q[1]); }
    const cs = 0.35, nx = Math.ceil((x1 - x0) / cs) + 3, ny = Math.ceil((y1 - y0) / cs) + 3, g = new Float32Array(nx * ny);
    for (const q of tr) g[(Math.floor((q[1] - y0) / cs) + 1) * nx + Math.floor((q[0] - x0) / cs) + 1] += 1;
    const b = new Float32Array(nx * ny); for (let j = 1; j < ny - 1; j++) for (let i = 1; i < nx - 1; i++) { let c = 0; for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) c += g[(j + dj) * nx + i + di] > 0 ? 1 : 0; b[j * nx + i] = c / 9; }
    return (x, y) => { const fx = (x - x0) / cs + 0.5, fy = (y - y0) / cs + 0.5, i = Math.floor(fx), j = Math.floor(fy); if (i < 0 || j < 0 || i >= nx - 1 || j >= ny - 1) return 0;
      const u = fx - i, v = fy - j; return sstep(0.45, 0.9, (b[j * nx + i] * (1 - u) + b[j * nx + i + 1] * u) * (1 - v) + (b[(j + 1) * nx + i] * (1 - u) + b[(j + 1) * nx + i + 1] * u) * v); }; })();
  const carriage = mkIM(box(0.18, 0.11, 0.55, 0, 0.11, 0.1), lam(), artBlocks.length);
  const barrel = mkIM((() => { const g = new THREE.CylinderGeometry(0.05, 0.065, 0.6, 8); g.rotateX(Math.PI / 2); g.translate(0, 0.2, -0.1); return g; })(), lam({ color: 0xb9b5ab }), artBlocks.length);   // v5: pale grey barrel line
  const wheels = mkIM((() => { const a = new THREE.CylinderGeometry(0.16, 0.16, 0.05, 12); a.rotateZ(Math.PI / 2); const b = a.clone(); a.translate(-0.17, 0.16, 0); b.translate(0.17, 0.16, 0); return merge([a, b], [0x7a5c3a, 0x7a5c3a]); })(), lam({ vertexColors: true }), artBlocks.length);
  const limber = mkIM(merge([box(0.27, 0.18, 0.32, 0, 0.18, 0), box(0.29, 0.04, 0.34, 0, 0.29, 0)], [0xffffff, 0xd8cfbc]), lam({ vertexColors: true }), artBlocks.length);

  const M4 = new THREE.Matrix4(), col = new THREE.Color(), GREYC = new THREE.Color(GREY.coat), GREYP = new THREE.Color(GREY.pale), GREYL = new THREE.Color(GREY.plate);
  const setM = (im, k, x, y, z, fx, fy, sx, sy, sz, sL = 0, sF = 0) => { M4.set(-fy * sx, 0, -fx * sz, x, sL * sx, sy, -sF * sz, y, fx * sx, 0, -fy * sz, z, 0, 0, 0, 1); im.setMatrixAt(k, M4); };
  const pal = (u) => PAL[u.side] || PAL.u;
  const fade = (u, t) => t >= u.t0 && t < u.t1 ? Math.min(sstep(u.t0, u.t0 + 1.2, t), 1 - sstep(u.t1 - 0.8, u.t1, t)) : 0;
  // heading low-pass over +-0.6 s (wheels and turns take ~1 s, never snap)
  const smooth = (u, i, t, key) => vecAvg([[base(u, i, t)[key], 1], [base(u, i, t - 0.15)[key], 0.5], [base(u, i, t + 0.15)[key], 0.5], [base(u, i, t - 0.3)[key], 0.0], [base(u, i, t + 0.3)[key], 0.4]]);

  function update(t, hide = 0) {
    let nf = 0, nh = 0, np = 0, ns = 0, ng = 0, nq = 0; const ST = [];
    for (const b of blocks) { const u = b.u, op0 = fade(u, t) * (1 - hide); if (op0 <= 0.001) continue;
      const D = UD.get(u), q = base(u, b.i, t), qa = base(u, b.i, t - 0.2), qb = base(u, b.i, t + 0.2);
      q.pa = smooth(u, b.i, t, "pa"); q.sa = smooth(u, b.i, t, "sa");
      const vx = (qb.x - qa.x) / 0.4, vy = (qb.y - qa.y) / 0.4, spd = Math.hypot(vx, vy);
      let op = op0; if (q.e > 0 && u.esc.fade && o.proj && o.edgeFade) op *= o.edgeFade(u.esc.fade, o.proj(q.x, q.y), -10, 140);   // v4: fades out over ~1.5-2 s at walking pace, gone at the edge   // a long gradual fade at the frame edge
      if (op <= 0.001) continue;
      const capd = u.caps ? Math.max(0, ...u.caps.map(([a, z]) => sstep(a, a + 0.8, t) * (1 - sstep(z - 0.9, z, t))))   // caps: [[taken, retaken], ...]
        : u.cap != null && b.i * u._bpb < u.capN ? sstep(u.cap, u.cap + 0.8, t) * (u.t1 < 1e8 ? 1 - sstep(u.t1 - 1.8, u.t1 - 0.9, t) : 1) : 0;
      ST.push({ b, u, D, ...q, vx, vy, spd, op, capd }); }
    for (const Q of ST) {
      const { b, u, D, x: bx, y: by, pa, sa, c, e, spd, op, capd } = Q, i = b.i, seed = (blocks.indexOf(b) + 1) * 7.31;
      const fx = Math.cos(pa), fy = Math.sin(pa), px = -fy, py = fx, sfx = Math.cos(sa), sfy = Math.sin(sa);
      const isArt = u.type === "art", isCav = u.type === "cav", P = pal(u), W = D.bw, Dp = D.bd;
      const hb = H(bx, by), sL = (H(bx + px * W * 0.5, by + py * W * 0.5) - H(bx - px * W * 0.5, by - py * W * 0.5)) / Math.max(W, 1e-3);
      const sF = (H(bx + fx * Dp * 0.5, by + fy * Dp * 0.5) - H(bx - fx * Dp * 0.5, by - fy * Dp * 0.5)) / Math.max(Dp, 1e-3);
      const mv = sstep(0.04 * ts, 0.3 * ts, spd);
      // v4 (critic: one consistent shadow direction): a soft CENTRED contact shadow (the real shadow map gives the sun's direction) + pale halo
      const wk = WM ? WM(bx, by) : 0, sink = wk * (S.woodSink ?? 0.55) * (W * 0.92 / 12) * 1.9, bk = onBridge(bx, by), st = Q.eq && !isArt ? bk : 0;   // v5: only the rear ranks sink (below)
      { const hs = hb + 0.012 * ts, sw = W * (isArt ? 0.5 : 1.0) + 0.12 * ts, sd = Dp * (isArt ? 0.6 : 1.0) + 0.12 * ts;
        setM(shadows, ns, bx, hs, by, fx, fy, sw, 1, sd); setOp(shadows, ns, 0.27 * op * (1 - 0.5 * wk) * (1 - bk));
        setM(halos, ns, bx, hs + 0.002 * ts, by, fx, fy, sw + 0.32 * ts, 1, sd + 0.32 * ts); halos.setColorAt(ns, col.setHex(0xf1ecd8).lerp(new THREE.Color(P.plate), 0.55 * wk).lerp(GREYP, capd)); setOp(halos, ns++, (0.1 + 0.12 * wk) * op * (1 - bk)); }   // in a wood the halo carries the side colour (the plate is under the canopy)
      const pT = 0.006 * ts, ry = hb + S.lift, ip = np++, pk = isArt ? 0 : 1;   // v4: thin plate (no saturated base bar); guns have none
      setM(plateRim, ip, bx, ry, by, fx, fy, (W * 0.99 + 0.012 * ts) * pk, pT, (Dp * 0.86 + 0.012 * ts) * pk, sL, sF);   // v5: the men cover the plate but a ~2 px tint
      setM(plateFill, ip, bx, ry + 0.001 * ts, by, fx, fy, W * 0.99 * pk, pT * 1.15, Dp * 0.86 * pk, sL, sF);
      const fr = Dp * 0.022, fo = Dp * 0.43 - fr / 2; setM(plateFront, ip, bx + fx * fo, ry + 0.0015 * ts + sF * fo, by + fy * fo, fx, fy, (W + 0.014 * ts) * pk, pT * 1.3, fr * pk, sL, 0);
      plateFill.setColorAt(ip, col.setHex(P.plate).lerp(new THREE.Color(P.coat), 0.35).lerp(GREYL, capd)); plateRim.setColorAt(ip, col.setHex(P.plate).multiplyScalar(0.5).lerp(GREYC, capd)); plateFront.setColorAt(ip, col.setHex(P.rim).lerp(GREYP, capd * 0.7));
      for (const m of [plateRim, plateFill, plateFront]) setOp(m, ip, op * (1 - bk));   // on a bridge deck the men file narrow, no plate
      if (isArt) {
        const k = ng++, gk = W * 0.75 / 0.78 * 1.27, lmb = Math.max(c, mv);   // v6: +30 %   // v4: guns ~30 % smaller
        let rec = 0; for (const s of shots) { if (s.t > t) break; if (Math.hypot(s.x - bx, s.y - by) < D.span * 0.6 + 0.5 * ts && i === 0) rec = Math.max(rec, Math.exp(-(t - s.t) * 7) * (t - s.t < 1.2 ? 1 : 0)); }
        const ga = Math.atan2(fy, fx) + Math.PI * sstep(0.2, 0.8, lmb), gfx = Math.cos(ga), gfy = Math.sin(ga);
        const gx = bx - fx * (rec * 0.08 * gk) - fx * lmb * 0.15 * gk, gy = by - fy * (rec * 0.08 * gk) - fy * lmb * 0.15 * gk, hg = H(gx, gy) + S.lift - sink;
        const cg = col.setHex(0x6a5a3e).lerp(GREYC, capd); carriage.setColorAt(k, cg); limber.setColorAt(k, cg);
        setM(carriage, k, gx, hg, gy, gfx, gfy, gk, gk, gk); setM(barrel, k, gx, hg, gy, gfx, gfy, gk, gk, gk); setM(wheels, k, gx, hg, gy, gfx, gfy, gk, gk, gk);
        const lf = lerp(-0.55, 0.5, sstep(0.1, 0.9, lmb)) * gk, lx = bx + fx * lf, ly = by + fy * lf; setM(limber, k, lx, H(lx, ly) + S.lift - sink, ly, fx, fy, gk, gk, gk);
        for (const m of [carriage, barrel, wheels, limber]) setOp(m, k, op);
        const fs = gk * 0.11;
        for (let j = 0; j < 4; j++) { const a = (j < 2 ? -1 : 1) * (0.2 + 0.05 * (j % 2)) * gk, d = ((j % 2 ? 0.28 : 0.05) + 0.03 * Math.sin(t * 3 + j) * rec - 0.2 * lmb) * gk;
          const x = gx + px * a - fx * d, y = gy + py * a - fy * d;
          setM(coats, nf, x, H(x, y) + S.lift - sink, y, fx, fy, fs * 0.55, fs * 1.9, fs * 0.5); coats.setColorAt(nf, col.setHex(P.coat).lerp(GREYC, capd));
          setM(pales, nf, x, H(x, y) + S.lift - sink, y, fx, fy, fs * 0.55, fs * 1.9, fs * 0.5); pales.setColorAt(nf, col.setHex(P.pale).lerp(GREYP, capd)); setOp(coats, nf, op); setOp(pales, nf, op); nf++; }
        continue;
      }
      if (u.form === "square") { setM(holes, nq, bx, ry + 0.004 * ts, by, fx, fy, W * 0.6, pT * 1.3, W * 0.6, sL, sF); setOp(holes, nq++, op); }
      const LINE = isCav ? CAV : u.form === "square" ? SQUARE : INF, nFigs = LINE.length;
      const sp = W * 0.92 / 12, fw = sp * 0.42, fd = sp * 0.4, fh = sp * 1.9, walk = mv;
      for (let j = 0; j < nFigs; j++) {
        const L = LINE[j]; let la = L[0] * (u.form === "square" ? W * 0.75 : W * 0.96), lb = L[1] * (u.form === "square" ? W * 0.75 : Dp * 0.9);
        la += (hash(seed + j, 1) - 0.5) * 0.12 * sp; lb += (hash(seed + j, 2) - 0.5) * 0.12 * sp;   // tidy ranks, a hair of irregularity
        let x = bx + px * la + fx * lb, y = by + py * la + fy * lb, ma = sa;
        // v6 (owner): at a bridge the block BREAKS RANKS: each man walks the escape path in a stream 3 abreast (natural jitter, no plate),
        // the men leave / re-take their rank spots over ~1-1.5 s as the block enters / leaves the bridge zone
        if (st > 0.001) { const row = Math.floor(j / 3), cc = j % 3, sw = Q.ew - (row - 12) * 0.06 - (hash(seed + j, 11) - 0.5) * 0.03, g = along(Q.eq.path, Math.max(0, sw));
          const off = (cc - 1) * 0.05 + (hash(seed + j, 12) - 0.5) * 0.02, sx2 = g[0] - g[3] * off, sy2 = g[1] + g[2] * off, kj = sstep(0, 1, clamp(st * 1.25 - 0.25 * hash(seed + j, 13)));
          x = lerp(x, sx2, kj); y = lerp(y, sy2, kj); ma = sa + angDiff(sa, Math.atan2(g[3], g[2])) * kj; }
        const bob = walk * 0.12 * fh * Math.abs(Math.sin(t * 6 + j * 0.9 + seed)), rear = sstep(-0.1, -0.42, L[1]), hy = Math.max(H(x, y), deckTop(x, y)) + S.lift + pT * 1.15 * (1 - st) + bob - sink * rear * (1 - st), lift = isCav ? fh * 0.55 : 0;
        const jh = 0.93 + 0.14 * hash(seed + j, 6), ja = (hash(seed + j, 8) - 0.5) * 0.35, jfx = Math.cos(ma + ja), jfy = Math.sin(ma + ja), jc = 0.9 + 0.2 * hash(seed + j, 9);   // v5: men not identical
        if (isCav) { setM(horses, nh, x, hy, y, sfx, sfy, fw * 1.5, fh * 0.7, fd * 2.2); setOp(horses, nh++, op); }
        setM(coats, nf, x, hy + lift, y, jfx, jfy, fw, fh * jh, fd); setM(pales, nf, x, hy + lift, y, jfx, jfy, fw, fh * jh, fd);
        coats.setColorAt(nf, col.setHex(P.coat).multiplyScalar(jc).lerp(GREYC, capd)); pales.setColorAt(nf, col.setHex(P.pale).lerp(GREYP, capd)); setOp(coats, nf, op); setOp(pales, nf, op); nf++;
      }
      // skirmishers: a few men a little ahead of a halted line; they walk back into the front rank (same size) when it moves, routs or is taken
      const ks = (1 - c) * (1 - capd) * (1 - e) * (1 - sstep(0.15 * ts, 0.6 * ts, spd)) * (u.skirmish === false || isCav ? 0 : 1);
      for (let j = 0; j < NS; j++) { const h1 = hash(seed + 91 + j, 1), h2 = hash(seed + 91 + j, 2), fj = Math.min(11, Math.round(((j + 0.5) / NS) * 12 - 0.5));
        const la0 = INF[fj][0] * W * 0.92, lb0 = INF[fj][1] * Dp * 0.84;   // its place in the front rank
        const la = lerp(la0, ((j + 0.5) / NS - 0.5) * W * 0.95 + (h1 - 0.5) * W * 0.12, ks), lb = lerp(lb0, Dp / 2 + Dp * (0.6 + 1.4 * h2), ks);
        const x = bx + px * la + fx * lb, y = by + py * la + fy * lb;
        setM(coats, nf, x, H(x, y) + S.lift + pT * ks - sink, y, sfx, sfy, fw, fh, fd); setM(pales, nf, x, H(x, y) + S.lift + pT * ks - sink, y, sfx, sfy, fw, fh, fd);
        coats.setColorAt(nf, col.setHex(P.coat).lerp(GREYC, capd)); pales.setColorAt(nf, col.setHex(P.pale).lerp(GREYP, capd)); setOp(coats, nf, op * (1 - st)); setOp(pales, nf, op * (1 - st)); nf++; }
    }
    holes.count = nq; coats.count = pales.count = nf; plateFill.count = plateRim.count = plateFront.count = np; shadows.count = halos.count = ns;
    carriage.count = barrel.count = wheels.count = limber.count = ng; if (horses) horses.count = nh;
    for (const m of ALL) { m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true; m.geometry.attributes.iOp.needsUpdate = true; }
    API.last = ST.map((q) => ({ k: blocks.indexOf(q.b), u: units.indexOf(q.u), x: q.x, y: q.y, hx: Math.cos(q.pa), hy: Math.sin(q.pa), sx: Math.cos(q.sa), sy: Math.sin(q.sa),
      w: q.D.bw * (q.u.type === "art" ? 0.62 : 1), d: q.D.bd * (q.u.type === "art" ? 0.7 : 1), c: q.c, e: q.e, op: q.op, art: q.u.type === "art", cap: q.capd }));
    return { figures: nf, blocks: np, guns: ng };
  }
  const API = { update, blocks, base, meshes: { coats, pales, plateFill, plateRim, plateFront, shadows, carriage, barrel, wheels, limber, horses } };
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
    if (GM) g.setAttribute("color", new THREE.BufferAttribute(new Float32Array((N * 2 + 3) * 4).fill(1), 4).setUsage(THREE.DynamicDrawUsage));   // v4: tail fade (vertex alpha)
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: a, depthTest: false, depthWrite: false, fog: true, side: THREE.DoubleSide, vertexColors: GM }));
    m.frustumCulled = false; m.renderOrder = ro; scene.add(m); return m; };
  const arrows = [], SUNG = (() => { const s = o.sun || [-0.7, 0.48, -0.4], l = Math.hypot(s[0], s[2]); return [-s[0] / l, -s[2] / l]; })();
  // GM's arrows ride OVER the battle smoke (684 s) but under the clouds (10.5) and in the fog: renderOrder 10.2 / 10.3
  // v7 (critic B 11): Style W arrow + a soft pale outer glow and a 2 px lighter rim inside the ink edge (GM's arrows have a light rim)
  function add(pts, color) { const rim = new THREE.Color(color).lerp(new THREE.Color(0xffffff), 0.5);
    if (GM) {   // v2 (GM study): pale side tint, thin darker edge with a pale highlight just inside it, soft drop shadow toward the sun's side
      const base = new THREE.Color(color), dark = base.clone().multiplyScalar(0.5);
      // v4 (critic): matte, ~80 % opacity, drawn UNDER the troops (renderOrder < the blocks' 2) so an arrow never hides its column
      const A = { pts, gm: true, glow: mk(1.6, 0x10140f, 0.12), out: mk(1.7, dark, 0.6), rim: mk(1.75, 0xf4f6f2, 0.3), body: mk(1.8, base, 0.8) }; arrows.push(A); return A; }
    const A = { pts, glow: mk(10.15, 0xf2f4f0, 0.16), out: mk(10.2, 0x0e0c08, 0.45), rim: mk(10.25, rim, 1), body: mk(10.3, color, 1) }; arrows.push(A); return A; }
  // heights: the ground under the line smoothed over ~1.5 units (raw heights made the flat ribbon wiggle on screen over every bump and the river bed)
  const smoothH = (P) => { const raw = P.map((p) => heightAt(p[0], p[1])), K = 9; return raw.map((_, i) => { let s = 0, c = 0; for (let j = Math.max(0, i - K); j <= Math.min(raw.length - 1, i + K); j++) { s += Math.max(raw[j], raw[i] - 0.02); c++; } return s / c; }); };
  function fill(mesh, P, w, hl, hw, ox, HS, sh = [0, 0]) {   // P: resampled centre line [[x,y]], ribbon half width w/2 + ox, head at the end
    const pa = mesh.geometry.attributes.position, a = pa.array, n = P.length, lift = 0.05;
    for (let i = 0; i < N; i++) { const j = Math.min(i, n - 1), p = P[j], q = P[Math.min(j + 1, n - 1)], r = P[Math.max(j - 1, 0)];
      let dx = q[0] - r[0], dy = q[1] - r[1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l; const hx = -dy * (w / 2 + ox), hy = dx * (w / 2 + ox);
      const h = HS[j] + lift; a.set([p[0] + hx + sh[0], h, p[1] + hy + sh[1], p[0] - hx + sh[0], h, p[1] - hy + sh[1]], i * 6);
      const ca = mesh.geometry.attributes.color; if (ca) { const al = sstep(0, 0.4, j / Math.max(1, n - 1)); ca.array[i * 8 + 3] = al; ca.array[i * 8 + 7] = al; } }
    const e = P[n - 1], f = P[Math.max(0, n - 2)]; let dx = e[0] - f[0], dy = e[1] - f[1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
    const tip = [e[0] + dx * (hl + ox * 1.6), e[1] + dy * (hl + ox * 1.6)], h = HS[n - 1] + lift, hw2 = hw + ox * 1.4, bxp = e[0] - dx * ox, byp = e[1] - dy * ox;
    a.set([bxp - dy * hw2 + sh[0], h, byp + dx * hw2 + sh[1], bxp + dy * hw2 + sh[0], h, byp - dx * hw2 + sh[1], tip[0] + sh[0], h, tip[1] + sh[1]], N * 6);
    pa.needsUpdate = true; if (mesh.geometry.attributes.color) mesh.geometry.attributes.color.needsUpdate = true; }
  // A, grow fraction k (0..1, eased by the caller), opacity op, shaft width w (units)
  function draw(A, k, op, w) {
    const vis = op > 0.002 && k > 0.001; A.glow.visible = A.out.visible = A.rim.visible = A.body.visible = vis; if (!vis) return;
    if (A.gm) { A.glow.material.opacity = 0.12 * op; A.out.material.opacity = 0.6 * op; A.rim.material.opacity = 0.3 * op; A.body.material.opacity = 0.8 * op; }
    else { A.glow.material.opacity = 0.16 * op; A.out.material.opacity = 0.45 * op; A.rim.material.opacity = op; A.body.material.opacity = op; }
    const pts = A.pts, seg = []; let L = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; }
    // round 2 (critic A S06 63 s): while the drawn length is shorter than ~2 heads, the head grows with it (no lone arrowhead before its shaft)
    const gk = Math.min(1, k * L / (w * 4.2)), hl = w * 2.1 * gk, hw = w * 1.5 * gk, end = Math.max(0, k * L - hl), P = [];   // the shaft stops where the head starts
    const at = (s) => { let i = 0; while (i < seg.length - 1 && s > seg[i]) { s -= seg[i]; i++; } const f = seg[i] ? Math.min(1, s / seg[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]; };
    const n = Math.max(2, Math.min(N, Math.ceil(end / 0.08) + 1)); for (let i = 0; i < n; i++) P.push(at(end * i / (n - 1)));
    if (end < 1e-3) { const d = at(Math.min(L, 0.01)); P[1] = [P[0][0] + (d[0] - P[0][0]) * 0.01 + 1e-4, P[0][1] + (d[1] - P[0][1]) * 0.01]; }
    const HS = smoothH(P);
    if (A.gm) { const sh = [0, 0]; fill(A.glow, P, w, hl, hw, w * 0.18, HS, sh); fill(A.out, P, w, hl, hw, w * 0.07, HS); fill(A.rim, P, w, hl, hw, w * 0.0, HS); fill(A.body, P, w, hl, hw, -w * 0.09, HS); return; }
    fill(A.glow, P, w, hl, hw, 0.11, HS); fill(A.out, P, w, hl, hw, 0.07, HS); fill(A.rim, P, w, hl, hw, 0.045, HS); fill(A.body, P, w, hl, hw, 0, HS); }
  return { add, draw, arrows };
}
