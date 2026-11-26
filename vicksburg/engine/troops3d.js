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
const GREY = { coat: 0x75726e, pale: 0xbab7b1, plate: 0x8c8984 };   // v11: a clear mid grey (critic: captured looked washed out)

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
  const ts = o.troopScale || 1, H = (x, y) => heightAt(x, y), SIZE = (o.size ?? 1.2) * (o.look === "counter" ? (o.counterOpts || {}).scale ?? 1 : 1);   /* troops-box test: counterOpts.scale (bigger counters = bigger formation) */   // owner: blocks ~20 % bigger (GM)
  const S = { lift: 0.004 * ts, shadowK: 1.0, shadowA: 0.42, ...o.style };
  const SUNG = (() => { const s = o.sun || [-0.7, 0.48, -0.4], l = Math.hypot(s[0], s[2]); return [-s[0] / l, -s[2] / l]; })();
  const shots = (o.shots || []).slice().sort((a, b) => a.t - b.t);
  const DK = o.depthK ?? 0.44, NF = 72, INF = DK < 0.38 ? gridLayout(18, 4) : gridLayout(12, 6), CAV = gridLayout(12, 2);   // v15: o.depthK (block depth / width; < 0.38 = 18 files x 4 ranks)
  const XV = 1.4 * (o.troopScale || 1), XDT = 0.055, XP = 0.3, rotP = (c, h, la, lb) => { const fx = Math.cos(h), fy = Math.sin(h); return [c[0] - fy * la + fx * lb, c[1] + fx * la + fy * lb]; };   /* v12: bridge crossing (men file across) */
  const SQUARE = (() => { const P = []; for (let k = 0; k < NF; k++) { const side = k / 15 | 0, f = (k % 15 + 0.5) / 15 - 0.5, e = 0.5 - 0.06;
    P.push(side === 0 ? [f, e] : side === 1 ? [e, -f] : side === 2 ? [-f, -e] : [-e, f]); } return P; })();
  const BOXV = o.look === "box", CTR = o.look === "counter", BOXL = BOXV || o.look === "lineblocks" || CTR;   /* troops-box test 2026-11-26: counter = 3D bevelled unit counters on the lineblocks motion */   /* v11: lineblocks = the GM soldier blocks driven by the v10 rectangle motion */   /* v9 (owner 2026-11-18): Style W map boxes, one formation (the rectangle), long side leading */
  // v15 (2026-11-23, Battle 20 round 1): o.retreatTurn = retreats (backward runs, road escapes) turn the WHOLE block about in place
  // (<= ~36 deg/s peak), walk front first, and (runs) turn back to face the enemy at the halt; the men face with the plate (no abk flip).
  // Off by default (Vicksburg keeps the plate-faces-the-enemy + men-about-face look); scene.js turns it on outside the Vicksburg frame.
  const RT = !!o.retreatTurn, RTT = o.retreatTurnTime ?? 6.5;
  // v15: near-180 deg turns pick a FIXED side (the on-screen correction moves the target a little every frame; plain angDiff would flip
  // between +-180 and snap): about-face counter-clockwise, turn back clockwise
  // the side is fixed per run / escape from the UNcorrected geometry (sg = +1 ccw, -1 cw); only turns > ~29 deg the 'wrong' way are wrapped
  const adS = (a, b, sg) => { const d = angDiff(a, b); if (!RT || !sg) return d; return sg > 0 && d < -0.5 ? d + 2 * Math.PI : sg < 0 && d > 0.5 ? d - 2 * Math.PI : d; };
  const sgOf = (from, to) => { const d = angDiff(from, to); return Math.abs(d) < 1.9 ? 0 : d >= 0 ? 1 : -1; };   // only big (about-face) turns get a fixed side
  const RF = BOXL ? 1.0 : o.reform ?? 2.0, VPK = (o.vmax ?? 1.0) * ts, VESC = (o.vesc ?? 1.25) * ts, RAMP = 1.0;   // peak march speed, retreat speed, ease seconds
  // trapezoid progress (0..1) at normalised time x, ramp fraction r at each end (constant cruise between: no darting)
  const trap = (x, r) => { x = clamp(x); if (r <= 1e-4) return x; const vm = 1 / (1 - r); if (x < r) return 0.5 * vm * x * x / r; if (x > 1 - r) { const y = 1 - x; return 1 - 0.5 * vm * y * y / r; } return 0.5 * vm * r + vm * (x - r); };
  const ang = (x, y) => Math.atan2(y, x), uv = (a) => [Math.cos(a), Math.sin(a)];
  const axisTo = (a0, a1) => { let d = angDiff(a0, a1); if (d > Math.PI / 2) d -= Math.PI; if (d < -Math.PI / 2) d += Math.PI; return a0 + d; };   // nearest of a1 / a1+pi

  // ---------- per unit: shape, path, moves (trapezoid), column runs, escape queue ----------
  const UD = new Map(), blocks = [];
  for (const u of units) {
    // GM has about half as many, bigger blocks: infantry n boxes -> round(2n/3) blocks, each 20 % bigger than a v2 block (owner), so a
    // brigade's frontage SHRINKS a little (fewer collisions on a crowded field); guns stay one piece per box
    const SZU = SIZE * (u.size ?? (u.type === "art" ? 1 : 0.96 + 0.08 * hash(units.indexOf(u) + 3, 7))), art = u.type === "art", gapB = BOXV ? u.gap : (art ? u.gap * 1.6 : u.gap * 1.3) * SIZE, nb = BOXV || art ? u.n : Math.max(1, Math.round(u.n * 2 / 3));
    const bw = BOXV ? u.bw : art ? u.bw * 0.78 * SIZE : (u.n * u.bw + (u.n - 1) * u.gap - (u.n - 1) * u.gap * 1.3) / u.n * SZU, span = art && !BOXV ? (u.n * u.bw + (u.n - 1) * u.gap) * SIZE : nb * bw + (nb - 1) * gapB;
    const bd = BOXV ? u.bd : art ? u.bd * 0.8 * SIZE : bw * DK; /* v4: ranks ~30 % deeper (chunkier, GM) */ u._bpb = u.n / nb;   // boxes per block (escape `from`, `capN` are in boxes)
    const fa = u.face, slots = Array.from({ length: nb }, (_, i) => -span / 2 + bw / 2 + i * (bw + (art ? (span - nb * bw) / Math.max(1, nb - 1) : gapB)));
    const K = u.keys, P = K.map((k) => [k[1], k[2]]), cum = [0]; for (let i = 1; i < P.length; i++) cum.push(cum[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
    // moves: a chain of "lin" keys (VX.march) is ONE move; any other moving segment is one move; holds between them
    const moves = []; for (let i = 1; i < K.length; i++) { const d = cum[i] - cum[i - 1]; if (d < 0.02 * ts) continue; const last = moves[moves.length - 1];
      if (!BOXL && K[i][3] === "lin" && last && last.lin && last.i1 === i - 1) { last.i1 = i; last.t1 = K[i][0]; last.s1 = cum[i]; continue; }
      moves.push({ i0: i, i1: i, t0: K[i - 1][0], t1: K[i][0], s0: cum[i - 1], s1: cum[i], lin: K[i][3] === "lin" }); }
    for (let m = 0; m < moves.length; m++) { const M = moves[m], L = M.s1 - M.s0, prevEnd = m ? moves[m - 1].t1 : -1e9;
      const dir = (() => { const a = P[M.i0 - 1], b = P[M.i1]; const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; })();
      const cf = dir[0] * Math.cos(fa) + dir[1] * Math.sin(fa);
      M.col = BOXL ? L > 0.3 * ts : !art && u.column !== false && (u.march || M.lin || cf < 0.94 || L > 3.0);   // v7: only a short straight advance stays in line; everything else = march column
      // calm pace: leave earlier from the preceding hold so the cruise speed stays <= VPK (arrival time unchanged)
      if (L / Math.max(1e-3, M.t1 - M.t0 - RAMP) > VPK && !(o.keepTimes || u.keepTimes)) M.t0 = Math.min(M.t0, Math.max(prevEnd + 0.3, M.t0 - 5, M.t1 - (L / VPK + RAMP)));
      M.r = Math.min(0.45, RAMP / Math.max(1e-3, M.t1 - M.t0)); M.dir = dir; }
    if (BOXL) for (let m = 1; m < moves.length; m++) { const A = moves[m - 1], M = moves[m], Fv = [Math.cos(fa), Math.sin(fa)];   /* v9: a corner = stop, turn in place, then walk */
      const hd = (Mv) => ang(Mv.dir[0], Mv.dir[1]) + (Mv.dir[0] * Fv[0] + Mv.dir[1] * Fv[1] < -0.05 ? Math.PI : 0), dA = Math.abs(angDiff(hd(A), hd(M)));
      if (dA > 0.09) { M.noMerge = true; const Tn = (dA + 0.3) / 0.44 + 0.5, dl = A.t1 + Tn - M.t0; if (dl > 0) for (let k = m; k < moves.length; k++) { if (k > m && moves[k].t0 >= moves[k - 1].t1 + 0.05) break; moves[k].t0 += dl; moves[k].t1 += dl; } } }   /* the later moves shift (never squeezed) */
    // a move that follows a column move within 1.6 s stays in column (no deploy-on-the-move), deploying once at the real halt
    const tailEst = clamp((nb - 1) * (bw + gapB) / VPK + 0.6, 1.4, 4);
    for (let m = 1; m < moves.length; m++) if (moves[m - 1].col && !moves[m].col && moves[m].t0 - moves[m - 1].t1 < 2 * RF + 0.4 && u.column !== false && !art) moves[m].col = true;
    // column runs: consecutive column moves (short holds between them stay in column)
    const runs = []; for (const M of moves) { if (!M.col) continue; const R = runs[runs.length - 1]; if (R && !M.noMerge && R.mLast.t1 > M.t0 - (BOXL ? 3.2 : 2 * RF + 0.4) && R.mLast === moves[moves.indexOf(M) - 1]) { R.mLast = M; R.t1 = M.t1; R.s1 = M.s1; R.i1 = M.i1; continue; }
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
    const csp = bw * 0.96 / 12, cw = 3 * csp * 1.1, cl = 24 * csp * 0.55;   // v8: compact march column, 3 files x 24 ranks, ranks ~half the file spacing (reads as a column)
    // v7: blocks whose march lanes coincide (a flank march) cannot re-form in place side by side: the ones behind wait until the one
    // ahead has walked a column length + gap away (they re-form and step off in order, nose to tail)
    for (const R of runs) { const d0 = R.mFirst.dir, L0 = [-Math.sin(fa), Math.cos(fa)], vR = Math.max(0.3, (R.s1 - R.s0) / Math.max(0.5, R.t1 - R.t0));
      const B = slots.map((s0, i) => ({ i, a: s0 * (L0[0] * d0[0] + L0[1] * d0[1]), p: s0 * (-L0[0] * d0[1] + L0[1] * d0[0]), ex: 0 })).sort((x, y) => y.a - x.a);
      for (let k = 1; k < B.length; k++) for (let m = 0; m < k; m++) { if (Math.abs(B[k].p - B[m].p) > cw + gapB) continue; const need = cl + gapB - (B[m].a - B[k].a);
        if (need > 0) B[k].ex = Math.max(B[k].ex, B[m].ex + RF + 0.3 + need / vR + 1.4); }
      R.ex = []; for (const q of B) R.ex[q.i] = BOXL ? 0 : q.ex;
      if (BOXL) { /* turn in place before / after the run at <= ~26 deg/s mean (smoothstep peak <= ~40 deg/s) */
        const a0 = ang(R.mFirst.dir[0], R.mFirst.dir[1]), a1 = ang(R.mLast.dir[0], R.mLast.dir[1]), md = [R.mFirst.dir[0] + R.mLast.dir[0], R.mFirst.dir[1] + R.mLast.dir[1]];
        R.back = md[0] * Math.cos(fa) + md[1] * Math.sin(fa) < -0.05;   /* a retreat: the box walks back, front still toward the enemy */
        const dA = (a) => Math.abs(angDiff(fa, a + (R.back ? Math.PI : 0)));
        R.tin = clamp((dA(a0) + 0.3) / 0.44 + 0.2, 1.2, 6); R.tout = clamp((dA(a1) + 0.3) / 0.44 + 0.2, 1.2, 6); } }   /* +0.45 rad headroom: the on-screen correction can add ~25 deg */
    UD.set(u, { art, nb, span, bw, bd, slots, P, cum, moves, runs, L: cum[cum.length - 1], spacing: bw + gapB, cw, cl, cspacing: cl + gapB });
    for (let i = 0; i < nb; i++) blocks.push({ u, i });
  }
  const infBlocks = blocks.filter((b) => b.u.type !== "art"), artBlocks = blocks.filter((b) => b.u.type === "art");
  const NS = o.skirmishers ?? 5, nFig = infBlocks.length * (NF + NS + 1) + artBlocks.length * 4;

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
      let j = 0, bd = 1e9; if (BOXL && BRIDGES.length) {   /* v9: boxes cross the fields on one gentle curve to the bridge mouth (roads don't constrain a map symbol) */
        let bj = -1, bdist = 1e9; for (const B of BRIDGES) road.forEach((p, k) => { const d = Math.hypot(p[0] - B.x, p[1] - B.z); if (d < bdist) { bdist = d; bj = k; } });
        const B = BRIDGES.reduce((m, Bq) => Math.hypot(road[bj][0] - Bq.x, road[bj][1] - Bq.z) < Math.hypot(road[bj][0] - m.x, road[bj][1] - m.z) ? Bq : m, BRIDGES[0]);
        let kb = bj; while (kb > 0 && Math.hypot(road[kb][0] - B.x, road[kb][1] - B.z) < B.len / 2 + 3.0) kb--; j = kb; bd = 0; }
      const jMouth = j; if (BOXL && BRIDGES.length) { j = 0; bd = 1e9; }   /* the mouth, unless the block is already nearer the bridge than it */
      road.forEach((p, k) => { const d = Math.hypot(p[0] - back[0], p[1] - back[1]) - k * 1e-3; if (d < bd && (k === road.length - 1 || ((road[k + 1][0] - p[0]) * (p[0] - back[0]) + (road[k + 1][1] - p[1]) * (p[1] - back[1])) >= -1e-6)) { bd = d; j = k; } });
      if (BOXL && BRIDGES.length) j = Math.max(j, jMouth);
      // approach = a cubic curve: straight back out of the line, bending smoothly onto the road's direction at the join (no corners)
      const J = road[j], Jn = road[Math.min(j + 1, road.length - 1)], rl = Math.hypot(Jn[0] - J[0], Jn[1] - J[1]) || 1, rd = [(Jn[0] - J[0]) / rl, (Jn[1] - J[1]) / rl];
      const dJ = Math.max(D.bw, Math.hypot(J[0] - sl[0], J[1] - sl[1])), c1 = [sl[0] - F[0] * dJ * (BOXL ? 0.4 : 0.65), sl[1] - F[1] * dJ * (BOXL ? 0.4 : 0.65)], c2 = [J[0] - rd[0] * dJ * 0.4, J[1] - rd[1] * dJ * 0.4];
      const app = []; for (let k = 0; k <= 16; k++) { const tt = k / 16, m = 1 - tt; app.push([m * m * m * sl[0] + 3 * m * m * tt * c1[0] + 3 * m * tt * tt * c2[0] + tt * tt * tt * J[0], m * m * m * sl[1] + 3 * m * m * tt * c1[1] + 3 * m * tt * tt * c2[1] + tt * tt * tt * J[1]]); }
      let path = [...app]; for (const p of road.slice(j + 1)) { const q = path[path.length - 1], d = Math.hypot(p[0] - q[0], p[1] - q[1]), n = Math.max(1, Math.ceil(d / 0.25)); for (let k = 1; k <= n; k++) path.push([q[0] + (p[0] - q[0]) * k / n, q[1] + (p[1] - q[1]) * k / n]); }
      for (const B of BRIDGES) { const ax = [Math.cos(B.angle), Math.sin(B.angle)], hl = B.len / 2;   // v5: on a bridge the column walks the deck's centreline
        let arc = 0; path = path.map((p, k0) => { if (k0) arc += Math.hypot(p[0] - path[k0 - 1][0], p[1] - path[k0 - 1][1]);   // (never moves the start: the block's own slot)
          const dx = p[0] - B.x, dy = p[1] - B.z, al = dx * ax[0] + dy * ax[1], lt = -dx * ax[1] + dy * ax[0]; if (Math.abs(lt) > 1.6 || Math.abs(al) > hl + 4.2) return p;
          const k = (1 - sstep(hl + 0.1, hl + 4.2, Math.abs(al))) * sstep(0.8, 2.2, arc); /* v7: a long blend (calm turn onto the deck) */ return [p[0] + ax[1] * lt * k, p[1] - ax[0] * lt * k]; }); }
      for (let it = 0; it < 3; it++) { const N = [path[0]]; for (let k = 0; k < path.length - 1; k++) { const p0 = path[k], p1 = path[k + 1];
        N.push([0.75 * p0[0] + 0.25 * p1[0], 0.75 * p0[1] + 0.25 * p1[1]], [0.25 * p0[0] + 0.75 * p1[0], 0.25 * p0[1] + 0.75 * p1[1]]); } N.push(path[path.length - 1]); path = N; }
      { // v5: resample every 0.05 u and smooth (moving average +-0.9 u, start pinned) so bends near the bridge are gentle curves, not kinks
        const L = pathLen(path), R = []; for (let w = 0; w <= L; w += 0.05) { const g = along(path, w); R.push([g[0], g[1]]); } R.push(path[path.length - 1]);
        for (let pass = 0; pass < 3; pass++) { const Hn = 60, S2 = R.map((p, k) => { if (k < 2) return p; const h = Math.min(Hn, k); let x = 0, y = 0, n = 0; for (let q = k - h; q <= Math.min(R.length - 1, k + h); q++) { x += R[q][0]; y += R[q][1]; n++; } return [x / n, y / n]; });
          for (let k = 0; k < R.length; k++) R[k] = S2[k]; } path = R;
        if (BOXL) { const L1 = Math.max(0.1, Math.min(0.8, 0.3 * Math.hypot(J[0] - sl[0], J[1] - sl[1]))), n0 = Math.min(path.length - 2, Math.max(1, Math.round(L1 / 0.05))), P1 = path[n0], st2 = []; for (let k = 0; k <= n0; k++) st2.push([lerp(path[0][0], P1[0], k / n0), lerp(path[0][1], P1[1], k / n0)]); path = st2.concat(path.slice(n0 + 1)); } }   /* v9: a straight first step (the box turns in place to it, then walks) */
      let SEG = null;   /* v10 (critics on v9): straight legs only: slot -> near deck end -> far deck end -> the road's end (turn in place, then walk; the deck turn is hidden by the fade) */
      if (BOXL && BRIDGES.length) { const B = BRIDGES.reduce((m, Bq) => { let d = 1e9; for (const p of road) d = Math.min(d, Math.hypot(p[0] - Bq.x, p[1] - Bq.z)); return d < m.d ? { d, B: Bq } : m; }, { d: 1e9, B: null }).B;
        const ax = [Math.cos(B.angle), Math.sin(B.angle)], hl = B.len / 2 + 0.05, e1 = [B.x + ax[0] * hl, B.z + ax[1] * hl], e2 = [B.x - ax[0] * hl, B.z - ax[1] * hl];
        const near = Math.hypot(e1[0] - sl[0], e1[1] - sl[1]) < Math.hypot(e2[0] - sl[0], e2[1] - sl[1]) ? e1 : e2, far = near === e1 ? e2 : e1, ex = road[road.length - 1];
        const P4 = [sl, near, far, ex], NP = [P4[0]]; for (let k = 1; k < 4; k++) { const a0 = P4[k - 1], a1 = P4[k], n = Math.max(1, Math.ceil(Math.hypot(a1[0] - a0[0], a1[1] - a0[1]) / 0.05)); for (let m = 1; m <= n; m++) NP.push([a0[0] + (a1[0] - a0[0]) * m / n, a0[1] + (a1[1] - a0[1]) * m / n]); }
        path = NP; const aA = Math.hypot(near[0] - sl[0], near[1] - sl[1]), fB = aA + Math.hypot(far[0] - near[0], far[1] - near[1]);
        const axF = [far[0] - near[0], far[1] - near[1]]; let kf = 0; road.forEach((p, k) => { if (Math.hypot(p[0] - far[0], p[1] - far[1]) < Math.hypot(road[kf][0] - far[0], road[kf][1] - far[1])) kf = k; });
        const trail = [far, ...road.slice(kf).filter((p) => (p[0] - far[0]) * axF[0] + (p[1] - far[1]) * axF[1] > 0.15)];   /* the trail (road) beyond the bridge */
        SEG = { aA, fB, far, near, ex, trail, hA: ang(near[0] - sl[0], near[1] - sl[1]) + Math.PI, hC: ang(ex[0] - far[0], ex[1] - far[1]) + Math.PI }; SEG.hC = SEG.hA + angDiff(SEG.hA, SEG.hC); }
      let kj = 0, dj = 1e9; path.forEach((p, k) => { const d = Math.hypot(p[0] - J[0], p[1] - J[1]); if (d < dj) { dj = d; kj = k; } });
      const a = pathLen(path.slice(0, kj + 1));
      // the path's tangent angle, UNWRAPPED along its length (the plate turns exactly as the path bends: no flips, no snaps)
      const angs = []; let prevA = null; for (let w = 0; w <= pathLen(path) + 40; w += 0.1) { const g0 = along(path, Math.max(0, w - 0.25)), g1 = along(path, w + 0.25), raw = Math.atan2(g1[1] - g0[1], g1[0] - g0[0]); prevA = prevA === null ? raw : prevA + angDiff(prevA, raw); angs.push(prevA); }   // v7: tangent over +-0.35 u (no quantisation jitter)
      // curvature warp (v8): in a bend the column slows so its turn rate stays <= ~40 deg/s (walked "effective" distance e(w) = integral (1 + kappa * KC) dw)
      const KC = VESC / ((o.turnMax ?? 0.7) * (BOXL ? 0.75 : 1)), eff = [0]; let cst = [1]; for (let k = 1; k < angs.length; k++) cst.push(1 + Math.abs(angs[k] - angs[k - 1]) / 0.1 * KC);
          for (let pass = 0; pass < 2; pass++) cst = cst.map((_, k) => { let s2 = 0, n2 = 0; for (let m = Math.max(1, k - 8); m <= Math.min(cst.length - 1, k + 8); m++) { if (pass) s2 += cst[m]; else s2 = Math.max(s2, cst[m]); n2++; } return pass ? s2 / n2 : Math.max(1, s2); });   /* v8: smoothed slow-down on bends (no speed lurch) */
          for (let k = 1; k < angs.length; k++) eff.push(eff[k - 1] + 0.1 * cst[k]);
      const e2w = (ev) => { if (ev <= 0) return ev; let lo = 0, hi = eff.length - 1; if (ev >= eff[hi]) return hi * 0.1 + (ev - eff[hi]); while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (eff[mid] < ev) lo = mid; else hi = mid; }
        return (lo + (ev - eff[lo]) / Math.max(1e-6, eff[hi] - eff[lo])) * 0.1; };
      const jn = road[Math.min(j + 1, road.length - 1)], dd = ang(jn[0] - road[j][0], jn[1] - road[j][1]) || 0;
      const thr = angs[Math.min(angs.length - 1, Math.round((a + 1) / 0.1))] - angs[0], poff = Math.abs(thr + Math.PI / 2) < Math.abs(thr - Math.PI / 2) ? Math.PI / 2 : -Math.PI / 2;
      const aE = SEG ? SEG.aA : BOXL ? eff[Math.min(eff.length - 1, Math.round(a / 0.1))] : a;   /* v9: queue by the EFFECTIVE (bend-slowed) approach, so arrivals at the join keep their spacing */
      if (SEG) { const dT = Math.abs(angDiff(fa, SEG.hA + ((u.escape || {}).front ? Math.PI : 0))); SEG.tt = Math.max(0.9, (dT + (BOXV ? 0.1 : 0.6)) / 0.44 + 0.3); }
      const q = { u, i, path, a: aE, angs, seg: SEG, poff, e2w: SEG ? ((ev) => ev) : e2w, rj: SEG ? 0 : rc[j], t0: E.t0, len: BOXL ? D.bw * 1.2 : D.cl, gap: D.spacing - D.bw, off: Math.abs(angDiff(fa, dd + Math.PI / 2)) <= Math.abs(angDiff(fa, dd - Math.PI / 2)) ? Math.PI / 2 : -Math.PI / 2 };
      (QUEUES.get(key) || QUEUES.set(key, []).get(key)).push(q); ESCB.set(`${units.indexOf(u)}:${i}`, q); } }
  for (const Q of QUEUES.values()) { Q.sort((p, q) => p.t0 - q.t0 || q.rj - p.rj || p.i - q.i); }   // first to leave, then the one further down the road
  const ramp = (tau, V) => tau <= 0 ? 0 : tau < RAMP ? V * tau * tau / (2 * RAMP) : V * (tau - RAMP / 2);
  // road coordinate (arc from the road start) of every queued block's centre at t: own walk, never closer than one spacing behind the block ahead
  // queue schedule (pure, built once): block k sets off at T_k, never before its unit's escape time and never before the block ahead
  // is one spacing further down the road; all walk the same ramp + cruise, so the gap only ever opens (no catching up, no braking)
  const invRamp = (d, V) => d <= 0 ? 0 : d < V * RAMP / 2 ? Math.sqrt(2 * d * RAMP / V) : d / V + RAMP / 2;
  for (const Q of QUEUES.values()) { const V = Math.min(...Q.map((q) => Math.min(VESC, q.u.esc.v ?? VESC))); let prev = null;
    for (const q of Q) { q.V = V; q.T = q.t0 + (q.seg ? q.seg.tt : 0.5 + RF + (RT && BOXL ? RTT - 1.5 : 0));   // v15: time to turn the block about   // v7: the men turn about and re-form into a march column first
      if (prev) { const need = (q.rj - q.a) + (prev.len / 2 + q.len / 2 + Math.max(prev.gap, q.gap) + 0.3 * q.len + 0.13 * q.len * hash(q.i + 3 * units.indexOf(q.u), 21)) - (prev.rj - prev.a); /* v8: 0-13 % spacing jitter */ q.T = Math.max(q.T, prev.T + invRamp(need, V), prev.T + 0.5); }   // v4: a clear gap + front-to-back stagger
      prev = q; } }
  // v13 (owner on v12: "break rank gradually, then pass, then vanish"): a routing block walks broadside straight at the bridge WITHOUT
  // stopping; over the last ~1.3 s its men drift out of their ranks toward the deck mouth (the flanks funnel inward, the plate fades) and
  // enter the deck one row of 3 at a time; the stream crosses straight and evenly spaced, runs on a short way and fades out man by man.
  // One block funnels at a time (the next starts funnelling when the previous one's last row is on the deck).
  for (const Q of QUEUES.values()) { let prev = null;
    for (const q of Q) { if (!q.seg || BOXV || q.u.type === "art") continue; const S2 = q.seg, D = UD.get(q.u), sl = q.path[0];
      const ax0 = [S2.far[0] - S2.near[0], S2.far[1] - S2.near[1]], al = Math.hypot(ax0[0], ax0[1]) || 1, ax = [ax0[0] / al, ax0[1] / al], nrm = [-ax[1], ax[0]];
      const PA = [S2.near[0] - ax[0] * (D.bd / 2 + 0.1 * ts), S2.near[1] - ax[1] * (D.bd / 2 + 0.1 * ts)], dA = [PA[0] - sl[0], PA[1] - sl[1]], LA = Math.max(0.05, Math.hypot(dA[0], dA[1])), hA = ang(dA[0], dA[1]) + Math.PI;
      const men = INF.map((L, j) => { const sA = rotP(PA, hA, L[0] * D.bw * 0.96, L[1] * D.bd * 0.9); return { j, dE: Math.hypot(sA[0] - S2.near[0], sA[1] - S2.near[1]) }; }).sort((a, b) => a.dE - b.dE);
      const ord = []; men.forEach((m, k) => { ord[m.j] = k; });
      const tWalk = LA / q.V + RAMP / 2; let tA = q.T + tWalk + (q.u.escDelay || 0);   /* escDelay: hold the walk (the block keeps its queue place) */ if (prev) tA = Math.max(tA, prev.cr.tLast + 0.4 + 0.8);   /* v14: no deceleration at the mouth (flows straight in) */
      q.T = tA - tWalk; const tLast = tA - 0.35 + 23 * XDT;
      q.cr = { PA, hA, LA, tWalk, tA, f0: tA - 0.8, ord, ax, nrm, near: S2.near, far: S2.far, al, trail: S2.trail, tLast, van: (q.u.escape || {}).vanish, front: !!(q.u.escape || {}).front, tEnd: tLast + al / XV + 4.3 * ts / (XV * 0.88) + 0.2 };
      prev = q; } }
  // troops-box test round 5 ("A5", owner: "at the bridge the boxes must NOT break rank; each unit STAYS A BOX"): the counter walks to the mouth
  // (trapezoid, no overshoot), turns in place onto the deck axis while its frontage narrows to the deck (0.18 u, depth x1.35), crosses as that
  // narrow box straight along the bridge, widens back over ~1 s past the far end and fades 1.5-4 u beyond it. Queue: a box reaches the mouth
  // only once the one ahead has stepped off it by >= 1.8 s (even gaps, no squeeze). No men in this look.
  const A5 = CTR && ["A5", "A6", "A7", "A7b"].includes(o.counter), A6N = CTR && ["A6", "A7", "A7b"].includes(o.counter), A7F = CTR && (o.counter === "A7" || o.counter === "A7b"), CK_DK = 0.40;   /* A6: same bridge path, the box keeps its shape */
  if (A5) for (const Q of QUEUES.values()) { let prev = null;
    for (const q of Q) { if (!q.cr) continue; const C = q.cr, sl = q.path[0], tWalk = C.LA / q.V + RAMP;
      const trav = ang(C.PA[0] - sl[0], C.PA[1] - sl[1]), hDeckT = ang(C.ax[0], C.ax[1]), Tt = clamp(Math.abs(angDiff(trav, hDeckT)) / 0.5 + 0.25, 0.8, 3.0);
      let tArr = q.T + tWalk; if (prev && tArr < prev.a5.tC + 1.3) { const dl = prev.a5.tC + 1.3 - tArr; q.T += dl; tArr += dl; }
      const D5 = UD.get(q.u), dX = Math.hypot(C.far[0] - C.PA[0], C.far[1] - C.PA[1]) + D5.bw * CK_DK * 1.35 / 2 + 0.15 * ts, F2 = [C.PA[0] + C.ax[0] * dX, C.PA[1] + C.ax[1] * dX];
      const tg = C.trail.length > 1 ? along(C.trail, 3 * ts) : [F2[0] + C.ax[0], F2[1] + C.ax[1]], tr0 = ang(tg[0] - F2[0], tg[1] - F2[1]), trA = Math.abs(angDiff(hDeckT, tr0)) < 0.09 ? hDeckT : tr0;
      const tC = tArr + Tt, tX = tC + dX / q.V + RAMP, Tt2 = trA === hDeckT ? 0 : clamp(Math.abs(angDiff(hDeckT, trA)) / 0.5 + 0.25, 0.6, 3.0);
      const Bq = BRIDGES.reduce((m, B) => Math.hypot(B.x - C.near[0], B.z - C.near[1]) < Math.hypot(m.x - C.near[0], m.z - C.near[1]) ? B : m, BRIDGES[0]);
      q.a5 = { tArr, Tt, tC, tX, Tt2, tW: tX + Tt2, dX, F2, trA, hDeckT, van: C.van, dH: Bq.deck != null ? Bq.deck * (o.ys || 0) + 0.025 : -1e9 };
      if (prev && q.a5.tX < prev.a5.tW + 1.4) { const dl = prev.a5.tW + 1.4 - q.a5.tX; q.T += dl; for (const k2 of ["tArr", "tC", "tX", "tW"]) q.a5[k2] += dl; }   // the one ahead has turned and walked off up the trail
      prev = q; } }
  // A5: deck height with a soft ramp onto / off the bridge ends ([height, weight]; weight 0 off the deck)
  const deckSoft = (x, y) => { let h = -1e9, w = 0; for (const B of BRIDGES) { if (B.deck == null) continue; const ax = [Math.cos(B.angle), Math.sin(B.angle)], dx = x - B.x, dy = y - B.z, al = Math.abs(dx * ax[0] + dy * ax[1]), lt = Math.abs(-dx * ax[1] + dy * ax[0]);
    if (lt > 0.3) continue; const k = 1 - sstep(B.len / 2, B.len / 2 + 0.8 * ts, al); if (k > w) { w = k; h = B.deck * (o.ys || 0) + 0.025; } } return [h, w]; };
  const queueAt = (t) => { const out = new Map(); for (const Q of QUEUES.values()) for (const q of Q) out.set(q, q.rj - q.a + ramp(t - q.T, q.V)); return out; };

  // block base state at t: position, plate axis angle (forward of the plate), soldiers' facing angle, column share, escape share
  let QC = { t: NaN, m: null };
  function base(u, i, t) {
    if (BOXL) return baseBox(u, i, t);
    // v7 (owner: no sideways glide): a block moves only along its formation's FRONT normal. Short straight advances: the line turns
    // (<= 20 deg) and walks forward. Everything else: the men RE-FORM in place into a narrow march column (4 x 18) facing the march
    // (~1.4 s, plate fades through), the column walks head first along the unit's path (each block on its own parallel lane, offset by its
    // line slot), then re-forms into line at its slot. Escapes: the men turn about, re-form into a column whose head moves off first.
    const D = UD.get(u), lag = i ? 0.25 + 0.35 * hash(units.indexOf(u) * 7 + i, 5) : 0, tl = t - lag, fa = u.face, F = uv(fa), L0 = [-F[1], F[0]];
    const c0 = ptAt(u, sAt(u, tl));
    let x = c0[0] + L0[0] * D.slots[i], y = c0[1] + L0[1] * D.slots[i], lpa = fa, cpa = fa, f = 0, e = 0, EQ = null, EW = 0, ab = 0, inRun = false;
    let lx = x, ly = y;
    for (const M of D.moves) { if (M.col || tl < M.t0 - 1.1 || tl > M.t1 + 1.1) continue;   // short straight advance: turn (<= 20 deg) first, back after
      const k = sstep(M.t0 - 1.0, M.t0 - 0.05, tl) * (1 - sstep(M.t1 + 0.05, M.t1 + 1.0, tl)); lpa = fa + angDiff(fa, ang(M.dir[0], M.dir[1])) * k; }
    for (const R of D.runs) { const tl = t - lag - (R.ex ? R.ex[i] : 0); if (t - lag < R.t0 - RF - 0.1 || tl > R.t1 + RF + 0.1) continue;
      // the column forms AHEAD of the line spot (its head steps off as the men file in) and ends with its head on the new spot, the
      // tail closing up as it re-forms into line: the centre only ever moves forward (front first)
      const fOn = sstep(R.t0 - RF, R.t0, tl), fOff = 1 - sstep(R.t1, R.t1 + RF, tl), Lr = R.s1 - R.s0, dl = Math.min((D.cl - D.bd) / 2, Lr / 2);
      // the men file into a column whose head is ahead of the line spot (they walk there), it marches, and its head ends on the new spot
      const sl = clamp(sAt(u, tl), R.s0, R.s1), sC = R.s0 + dl + (sl - R.s0) * (Lr - 2 * dl) / Math.max(1e-6, Lr), lp = runPt(u, R, sl <= R.s0 + 1e-6 ? R.s0 : R.s1);
      const p = runPt(u, R, sC), tg = runTan(u, R, Math.min(Math.max(sC, R.s0 + 0.3), R.s1 - 0.3), 0.3);
      lx = lp[0] + L0[0] * D.slots[i]; ly = lp[1] + L0[1] * D.slots[i]; x = p[0] + L0[0] * D.slots[i]; y = p[1] + L0[1] * D.slots[i]; cpa = ang(tg[0], tg[1]); inRun = true;
      f = Math.max(f, fOn * fOff); }
    if (u.esc && i >= Math.round(u.esc.from / u._bpb) && t > u.esc.t0 - 0.1) { const q = ESCB.get(`${units.indexOf(u)}:${i}`);
      if (q) { if (QC.t !== t) QC = { t, m: queueAt(t) }; const rho = QC.m.get(q), w = q.e2w(rho - (q.rj - q.a));
        ab = sstep(0, 0.5, t - q.t0);   // the men turn about
        const fr = sstep(q.t0 + 0.3, q.t0 + 0.3 + RF, t), shift = D.cl / 2 - D.bd / 2;   // the men file into a column whose head is ahead (away from the enemy)
        const w2 = Math.max(0, w) + shift, g = along(q.path, w2); lx = q.path[0][0]; ly = q.path[0][1]; x = g[0]; y = g[1]; inRun = true; { const fi = Math.min(q.angs.length - 1.001, w2 / 0.1), i0 = Math.floor(fi); cpa = lerp(q.angs[i0], q.angs[i0 + 1], fi - i0); }
        f = Math.max(f, fr); e = fr; if (w > 0) { EQ = q; EW = w2; } } }
    const ar = u.t0 > 1 && u.arrive !== false ? (o.arrive ?? 1.6) * ts * (1 - trap((t - u.t0) / 3.0, 0.4)) : 0;   // walks in (forward) while fading in
    const pa = f < 0.5 ? lpa : cpa, sa = f < 0.5 ? lpa + Math.PI * ab : cpa, colC = inRun || e > 0 || f > 0;
    if (!colC) { lx = x; ly = y; }
    const ox = -F[0] * ar, oy = -F[1] * ar;
    return { x: (f < 0.5 ? lx : x) + ox, y: (f < 0.5 ? ly : y) + oy, lx: lx + ox, ly: ly + oy, cx: x + ox, cy: y + oy, pa, sa, lpa, cpa, f, c: f, e, eq: EQ, ew: EW, ab };
  }

  // ---------- v9 box look (owner 2026-11-18: "when they move they should move like a rectangle ... just not move sideways") ----------
  // corr(a, x, y): the world angle of a box's FRONT NORMAL for travel direction a such that ON SCREEN the box's long side is exactly
  // perpendicular to its on-screen travel (the oblique camera foreshortens the ground; a world-perpendicular box can look up to ~25 deg off)
  // the box's height: terrain smoothed over ~1 u (a flat map symbol must not jump over parapets and ditches: on screen that reads as a sideways drift)
  const RING = [[0, 0, 1]]; for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; RING.push([0.5 * Math.cos(a), 0.5 * Math.sin(a), 0.7], [1.0 * Math.cos(a + 0.39), 1.0 * Math.sin(a + 0.39), 0.4]); }
  const RW = RING.reduce((s0, r) => s0 + r[2], 0), Hs = (x, y) => { let s0 = 0; for (const [dx, dy, w] of RING) s0 += H(x + dx * ts, y + dy * ts) * w; return s0 / RW; };
  const corr = (a, x, y) => { if (!o.proj || (BOXV && o.camera)) return a;   /* billboard boxes: the on-screen normal IS the projected heading */
    const e = 0.3, h0 = Hs(x, y) + 0.02, P = (X, Y) => o.proj(X, Y, h0 - H(X, Y)), p0 = P(x - e, y - e), px = P(x + e, y - e), py = P(x - e, y + e), p1 = P(x + e, y + e);   /* the box is a FLAT quad at its centre's height: project at that height */
    const ax = (px.x - p0.x + p1.x - py.x) / (4 * e), ay = (px.y - p0.y + p1.y - py.y) / (4 * e), bx = (py.x - p0.x + p1.x - px.x) / (4 * e), by = (py.y - p0.y + p1.y - px.y) / (4 * e), det = ax * by - bx * ay; if (Math.abs(det) < 1e-9) return a;
    const vx = Math.cos(a), vy = Math.sin(a), sx = ax * vx + bx * vy, sy = ay * vx + by * vy, lsx = -sy, lsy = sx;
    const lx = (by * lsx - bx * lsy) / det, ly = (-ay * lsx + ax * lsy) / det; let nx = -ly, ny = lx; if (nx * vx + ny * vy < 0) { nx = -nx; ny = -ny; }
    /* minimal correction: the world-perpendicular box's on-screen error err0; rotate only enough to bring it to <= 9 deg */
    const qx = ax * -vy + bx * vx, qy = ay * -vy + by * vx, err0 = Math.acos(Math.min(1, Math.abs(sx * -qy + sy * qx) / (Math.hypot(sx, sy) * Math.hypot(qx, qy) + 1e-9))), kk = Math.max(0, 1 - 0.05 / Math.max(1e-6, err0));
    return a + angDiff(a, Math.atan2(ny, nx)) * kk; };
  const runHead = (u, R, s, x, y) => { const tg = runTan(u, R, s, 0.25); return corr(ang(tg[0], tg[1]), x, y) + (R.back && !RT ? Math.PI : 0); };
  function baseBox(u, i, t) {
    const D = UD.get(u), lag = i ? 0.08 + 0.14 * hash(units.indexOf(u) * 7 + i, 5) : 0, tl = t - lag, fa = u.face, F = uv(fa), L0 = [-F[1], F[0]];
    const sl = sAt(u, tl), c0 = ptAt(u, sl); let x = c0[0] + L0[0] * D.slots[i], y = c0[1] + L0[1] * D.slots[i], h = fa, e = 0, EQ = null, EW = 0, bf, stB, abk = 0, crq = null, gone = false, a5n = 0, a5f = 1, a5d = 0, q5dH = -1e9, a5y = null;
    for (const R of D.runs) {   // in time order: turn in place, walk long side first along the smoothed path, turn back to the unit's facing
      const pS = runPt(u, R, R.s0), hS = runHead(u, R, R.s0, pS[0], pS[1]), tinD = BOXV ? R.tin : clamp(Math.abs(angDiff(h, hS)) / 0.44 + 0.25, 0.8, RT ? 9 : 6);   /* v11: turn time from the real (on-screen corrected) angle */
      if (tl < R.t0 - tinD) break;
      if (R.back && !RT) abk = Math.max(abk, sstep(R.t0 - 1.1, R.t0 - 0.1, tl) * (1 - sstep(R.t1 + 0.1, R.t1 + 1.1, tl)));   /* retreat: the men about-face in place */
      if (R.sg === undefined) R.sg = sgOf(fa, ang(R.mFirst.dir[0], R.mFirst.dir[1]));
      if (tl <= R.t0) { h = h + adS(h, hS, R.sg) * sstep(R.t0 - tinD, R.t0, tl); break; }
      if (tl <= R.t1) { const ss = clamp(sl, R.s0, R.s1), p = runPt(u, R, ss); x = p[0] + L0[0] * D.slots[i]; y = p[1] + L0[1] * D.slots[i]; h = runHead(u, R, ss, x, y); break; }
      const p = runPt(u, R, R.s1), he = runHead(u, R, R.s1, p[0], p[1]), toutD = BOXV ? R.tout : clamp(Math.abs(angDiff(he, fa)) / 0.44 + 0.25, 0.8, RT ? 9 : 6); h = he + adS(he, fa, -R.sg) * sstep(R.t1, R.t1 + toutD, tl); }
    if (u.esc && i >= Math.round(u.esc.from / u._bpb) && t > u.esc.t0 - 0.1) { const q = ESCB.get(`${units.indexOf(u)}:${i}`);
      if (q && q.cr && q.a5) { const C = q.cr, A = q.a5; q5dH = A.dH; const s0 = q.path[0], fo = C.front ? 0 : Math.PI; e = Math.max(0.001, sstep(q.t0, q.t0 + 1.0, t)); if (!C.front) abk = Math.max(abk, sstep(q.T - 1.1, q.T - 0.1, t));
        const hApp = corr(C.hA - Math.PI, C.PA[0], C.PA[1]) + fo, hDk = hApp + angDiff(hApp, corr(A.hDeckT, C.PA[0], C.PA[1]) + fo);
        if (t <= A.tArr) { const Tw = A.tArr - q.T, k = trap((t - q.T) / Tw, Math.min(0.45, RAMP / Tw)); x = s0[0] + (C.PA[0] - s0[0]) * k; y = s0[1] + (C.PA[1] - s0[1]) * k;
          const hT = corr(C.hA - Math.PI, x, y) + fo; h = h + angDiff(h, hT) * sstep(Math.max(q.t0, q.T - q.seg.tt), q.T - 0.15, t); }
        else if (t <= A.tC) { x = C.PA[0]; y = C.PA[1]; h = hApp + angDiff(hApp, hDk) * sstep(A.tArr + 0.05, A.tC - 0.05, t); a5d = sstep(A.tArr, A.tC, t); }   // steps up to the deck level while turning (no rise on the move)   // turn in place onto the deck axis
        else if (t <= A.tX) { const k = trap((t - A.tC) / (A.tX - A.tC), Math.min(0.45, RAMP / (A.tX - A.tC))); x = C.PA[0] + C.ax[0] * A.dX * k; y = C.PA[1] + C.ax[1] * A.dX * k; h = hDk + angDiff(hDk, corr(A.hDeckT, x, y) + fo); a5n = 1; a5d = 1; if (A7F) a5y = lerp(Hs(C.PA[0], C.PA[1]), Hs(A.F2[0], A.F2[1]), k); }   /* A7: level, at the bank heights blended across the river */   /* on-screen corrected along the deck (as the approach leg) */   // across the deck, straight, front first
        else { const hX = hDk + angDiff(hDk, corr(A.hDeckT, A.F2[0], A.F2[1]) + fo), hTr = hX + angDiff(hX, corr(A.trA, A.F2[0], A.F2[1]) + fo); a5n = 1;
          if (t <= A.tW) { x = A.F2[0]; y = A.F2[1]; h = hX + angDiff(hX, hTr) * sstep(A.tX + 0.05, A.tW - 0.05, t); a5d = 1 - sstep(A.tX, A.tW, t); }   // past the deck: turn in place onto the trail
          else { const sc = ramp(t - A.tW, q.V); x = A.F2[0] + Math.cos(A.trA) * sc; y = A.F2[1] + Math.sin(A.trA) * sc; h = hTr; a5n = 1 - sstep(0.8 * ts, 0.8 * ts + q.V * 1.0, sc);   // widens back over ~1 s, walks up the trail, fades
            a5f = 1 - (A.van ? sstep(A.van[0], A.van[1], sc) : sstep(1.0 * ts, 3.5 * ts, sc)); if (a5f <= 0) gone = true; } }
        if (t <= A.tC) a5n = sstep(A.tArr - 0.4, A.tC, t);
      } else
      if (q && q.cr) { const C = q.cr, s0 = q.path[0]; e = Math.max(0.001, sstep(q.t0, q.t0 + 1.0, t)); if (!C.front) abk = Math.max(abk, sstep(q.T - 1.1, q.T - 0.1, t));   /* Battle 21: escape.front = a march (to the boats), not a rout: the block turns to the deck and walks front first */
        if (t > C.tEnd) gone = true;
        let sw = ramp(t - q.T, q.V); if (sw > C.LA) sw = C.LA + 0.35 * ts * (1 - Math.exp(-(sw - C.LA) / (0.35 * ts)));   /* full pace to the mouth, then a soft ease (no stop) */
        x = s0[0] + (C.PA[0] - s0[0]) * sw / C.LA; y = s0[1] + (C.PA[1] - s0[1]) * sw / C.LA;
        const hT = corr(C.hA - Math.PI, x, y) + (C.front ? 0 : Math.PI); h = h + angDiff(h, hT) * sstep(Math.max(q.t0, q.T - q.seg.tt), q.T - 0.15, t);
        if (t > C.f0) { crq = { ...C, cx: x, cy: y, hc: h }; stB = sstep(C.f0, C.f0 + 0.8, t); }
      } else
      if (q) { if (QC.t !== t) QC = { t, m: queueAt(t) }; const rho = QC.m.get(q), w = Math.max(0, q.e2w(rho - (q.rj - q.a))), g = along(q.path, w);
        x = g[0]; y = g[1]; let hE;
        if (q.seg) { const S2 = q.seg; hE = w <= S2.aA ? S2.hA : w >= S2.fB ? S2.hC : lerp(S2.hA, S2.hC, (w - S2.aA) / Math.max(1e-6, S2.fB - S2.aA)); if (!BOXV) { const p0 = q.path[0]; const cp2 = [x, y]; hE = corr(hE - Math.PI, cp2[0], cp2[1]) + Math.PI; }   /* blocks: on-screen corrected (fixed per leg from its start) */
          if (BOXV) bf = Math.min(1, 1 - sstep(S2.aA - 1.25, S2.aA - 0.05, w) + sstep(S2.fB + 0.05, S2.fB + 1.25, w));
          else stB = sstep(S2.aA - 1.8, S2.aA - 0.1, w) * (1 - sstep(S2.fB + 0.2, S2.fB + 3.2, w)); }   /* blocks: break ranks before the deck, re-form over ~2 s past it */   /* ~0.5 s fade out at the near end, ~0.5 s back in past the far end */
        else { const fi = Math.min(q.angs.length - 1.001, w / 0.1), i0 = Math.floor(fi), tA = lerp(q.angs[i0], q.angs[i0 + 1], fi - i0), g0 = along(q.path, Math.max(0, w - 0.15)), g1 = along(q.path, w + 0.15), ta = tA + angDiff(tA, Math.atan2(g1[1] - g0[1], g1[0] - g0[0]));
          hE = corr(ta, x, y) + (RT ? 0 : Math.PI); }   // the box walks BACK (front still toward the enemy), long side leading; v15 RT: turned about, front first
        if (q.sg === undefined) { const a0 = q.path[0], a1 = q.path[Math.min(q.path.length - 1, 3)]; q.sg = sgOf(fa, Math.atan2(a1[1] - a0[1], a1[0] - a0[0])); }
        h = h + adS(h, hE, q.sg) * sstep(q.t0, q.T - 0.15, t); e = Math.max(0.001, sstep(q.t0, q.t0 + 1.0, t)); if (!RT || q.seg) abk = Math.max(abk, sstep(q.T - 1.1, q.T - 0.1, t));   /* the men about-face before the block walks back */ if (w > 0) { EQ = q; EW = w; } } }
    const ar = u.t0 > 1 && u.arrive !== false ? (o.arrive ?? 1.6) * ts * (1 - trap((t - u.t0) / 3.0, 0.4)) : 0, ox = -Math.cos(h) * ar, oy = -Math.sin(h) * ar;   // walks in along its front normal
    return { x: x + ox, y: y + oy, lx: x + ox, ly: y + oy, cx: x + ox, cy: y + oy, pa: h, sa: h + Math.PI * abk, lpa: h, cpa: h, f: 0, c: 0, e, eq: EQ, ew: EW, ab: abk, bf, st: stB, cr: crq, gone, nw: A6N ? 0 : a5n, fk: a5f, br: a5d, dk: A7F ? 0 : a5d, dH: a5d > 0 ? q5dH : -1e9, yA: a5y };
  }
  // one man of a block funnelling over a bridge: his rank spot (moving with the block) -> drifts to his lane at the deck mouth -> straight
  // across the deck -> a short straight run past it, fading out. Returns [x, y, facing, moving 0/1, opacity]
  const crossMan = (C, j, la, lb, t) => { const k = C.ord[j], row = Math.floor(k / 3), off = (k % 3 - 1) * 0.075 * ts, tau = C.tA - 0.35 + row * XDT;
    const R = rotP([C.cx, C.cy], C.hc, la, lb), E = [C.near[0] + C.nrm[0] * off, C.near[1] + C.nrm[1] * off];
    if (t < tau) { const dE = Math.hypot(R[0] - E[0], R[1] - E[1]), d = (tau - t) * XV, base = C.hc + (C.front ? 0 : Math.PI);   /* v14: queue feed: he peels off just in time to reach the mouth at his slot, at stream pace (even spacing, no clump) */
      if (d >= dE || dE < 1e-6) return [R[0], R[1], base, 1, 1];
      const k2 = d / dE, fa2 = Math.atan2(E[1] - R[1], E[0] - R[0]); return [E[0] + (R[0] - E[0]) * k2, E[1] + (R[1] - E[1]) * k2, base + angDiff(base, fa2) * sstep(1, 0.6, k2), 1, 1]; }
    const sd = (t - tau) * XV; if (sd <= C.al || C.trail.length < 2) return [E[0] + C.ax[0] * sd, E[1] + C.ax[1] * sd, Math.atan2(C.ax[1], C.ax[0]), 1, 1];
    // up the trail: each man at his own pace (a loosening stream), drifting a little in his lane, fading out over ~2 s
    const vj = 0.9 + 0.2 * hash(k + 17, 31), s2 = (sd - C.al) * vj, g = along(C.trail, s2), lo = off * (1 + 0.8 * Math.min(1, s2 / (2 * ts))) + (hash(k + 5, 33) - 0.5) * 0.06 * ts * Math.min(1, s2 / ts);
    return [g[0] - g[3] * lo, g[1] + g[2] * lo, Math.atan2(g[3], g[2]), 1, 1 - (C.van ? sstep(C.van[0], C.van[1], s2) : sstep(1.5 * ts, 4.0 * ts, s2))]; };   /* Battle 21: escape.vanish [a, b] (units past the deck) */
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
  const shadows = mkIM(shG, shMat, blocks.length * 2, false); shadows.receiveShadow = false; shadows.renderOrder = 1;
  // v4 (critic): a faint pale halo under every block keeps it readable over dark woods
  const haloMat = shMat.clone(); haloMat.color = new THREE.Color(0xffffff); haloMat.onBeforeCompile = shMat.onBeforeCompile; haloMat.customProgramCacheKey = () => "t3halo";
  const halos = mkIM(shG, haloMat, blocks.length * 2, false); halos.receiveShadow = false; halos.renderOrder = 1.05;
  /* v8: the dust wake needs a WHITE-rgb soft texture (stex is black rgb + alpha, so anything drawn with it comes out dark) */
  const WC = document.createElement("canvas"); WC.width = 64; WC.height = 64; { const g = WC.getContext("2d"), im = g.createImageData(64, 64);
    for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) { const uu = Math.abs(x / 63 - 0.5) * 2, v = Math.abs(y / 63 - 0.5) * 2, k = (y * 64 + x) * 4;
      im.data[k] = im.data[k + 1] = im.data[k + 2] = 255; im.data[k + 3] = Math.round(255 * (1 - sstep(0.3, 1, uu)) * (1 - sstep(0.2, 1, v))); }
    g.putImageData(im, 0, 0); }
  const wakeMat = shMat.clone(); wakeMat.map = new THREE.CanvasTexture(WC); wakeMat.color = new THREE.Color(0xffffff); wakeMat.onBeforeCompile = shMat.onBeforeCompile; wakeMat.customProgramCacheKey = () => "t3wake";
  const wakes = mkIM(shG, wakeMat, blocks.length, false); wakes.receiveShadow = false; wakes.renderOrder = 1.06; let nwk = 0;
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
  const poleM = mkIM(box(0.04, 1.6, 0.04, 0, 0.8, 0), lam({ color: 0x2a2018 }), infBlocks.length, false);   // v8: colour-bearer's staff + colour at a column's head
  const flagG = new THREE.PlaneGeometry(0.62, 0.42); flagG.translate(0.31, 1.35, 0); const flagM = mkIM(flagG, lam({ side: THREE.DoubleSide }), infBlocks.length, false);
  const limber = mkIM(merge([box(0.27, 0.18, 0.32, 0, 0.18, 0), box(0.29, 0.04, 0.34, 0, 0.29, 0)], [0xffffff, 0xd8cfbc]), lam({ vertexColors: true }), artBlocks.length);

  const M4 = new THREE.Matrix4(), col = new THREE.Color(), GREYC = new THREE.Color(GREY.coat), GREYP = new THREE.Color(GREY.pale), GREYL = new THREE.Color(GREY.plate);
  const setM = (im, k, x, y, z, fx, fy, sx, sy, sz, sL = 0, sF = 0) => { M4.set(-fy * sx, 0, -fx * sz, x, sL * sx, sy, -sF * sz, y, fx * sx, 0, -fy * sz, z, 0, 0, 0, 1); im.setMatrixAt(k, M4); };
  const pal = (u) => PAL[u.side] || PAL.u;
  const fade = (u, t) => t >= u.t0 && t < u.t1 ? Math.min(sstep(u.t0, u.t0 + 1.2, t), 1 - sstep(u.t1 - 0.8, u.t1, t)) : 0;
  // heading low-pass over +-0.6 s (wheels and turns take ~1 s, never snap)
  const smooth = (u, i, t, key) => vecAvg([[base(u, i, t)[key], 1], [base(u, i, t - 0.15)[key], 0.5], [base(u, i, t + 0.15)[key], 0.5], [base(u, i, t - 0.3)[key], 0.0], [base(u, i, t + 0.3)[key], 0.4]]);

  const BBX = BOXV && !!o.camera, asp = (ty) => { const u = units.find((q) => (q.type || "inf") === ty); return u ? u.bw / u.bd : undefined; };
  const BXI = BOXV ? createBoxes3D({ THREE, scene, sun: o.sun, camera: o.camera, billboard: BBX, aspect: { inf: asp("inf"), art: asp("art"), cav: asp("cav"), eng: asp("eng") }, ...(o.boxOpts || {}) }) : null;
  function update(t, hide = 0) {
    let nf = 0, nh = 0, np = 0, ns = 0, ng = 0, nq = 0, nfl = 0; nwk = 0; const ST = [];
    for (const b of blocks) { const u = b.u, op0 = fade(u, t) * (1 - hide); if (op0 <= 0.001) continue;
      const D = UD.get(u), q = base(u, b.i, t); if (q.gone) continue; const qa = base(u, b.i, t - 0.2), qb = base(u, b.i, t + 0.2);
      const vx = (qb.x - qa.x) / 0.4, vy = (qb.y - qa.y) / 0.4, spd = Math.hypot(vx, vy);
      let op = op0; if (q.e > 0 && u.esc.fade && o.proj && o.edgeFade) op *= BOXL ? o.edgeFade(u.esc.fade, o.proj(q.x, q.y), -20, 300) : o.edgeFade(u.esc.fade, o.proj(q.x, q.y), -10, 140);   // v4: fades out over ~1.5-2 s at walking pace, gone at the edge   // a long gradual fade at the frame edge
      if (op <= 0.001) continue;
      const capd = u.caps ? Math.max(0, ...u.caps.map(([a, z]) => sstep(a, a + 0.8, t) * (1 - sstep(z - 0.9, z, t))))   // caps: [[taken, retaken], ...]
        : u.cap != null && b.i * u._bpb < u.capN ? sstep(u.cap, u.cap + 0.8, t) * (u.t1 < 1e8 ? 1 - sstep(u.t1 - 1.8, u.t1 - 0.9, t) : 1) : 0;
      ST.push({ b, u, D, ...q, vx, vy, spd, op, capd }); }
    if (BOXV) {   // v9: Style W map boxes (flat side-colour rectangle, ink border, cream X / gun dot), rotated with the block's heading
      const SC = o.sideCol || { u: "#2c57b7", r: "#be3a2a" }, list = [];
      for (const Q of ST) { const bk = Q.e > 0 ? onBridge(Q.x, Q.y) * Q.e : 0, cp = Q.capd, sd = Q.u.side === "u";   /* only the routing boxes fade over their bridge */
        list.push({ x: Q.x, y: Q.y, fx: Math.cos(Q.pa), fy: Math.sin(Q.pa), bw: Q.D.bw, bd: Q.D.bd, art: Q.u.type === "art", sym: Q.u.type || "inf", op: Q.op * (1 - 0.25 * cp) * (Q.bf ?? (1 - bk)), h: Hs(Q.x, Q.y),
          color: cp > 0 ? `rgb(${Math.round(lerp(sd ? 44 : 190, 138, cp))},${Math.round(lerp(sd ? 87 : 58, 133, cp))},${Math.round(lerp(sd ? 183 : 42, 122, cp))})` : SC[Q.u.side] }); }
      BXI.set(list); for (const m of ALL) m.count = 0;
      API.last = ST.map((q) => ({ k: blocks.indexOf(q.b), u: units.indexOf(q.u), x: q.x, y: q.y, hx: Math.cos(q.pa), hy: Math.sin(q.pa), sx: Math.cos(q.sa), sy: Math.sin(q.sa),
        w: q.D.bw, d: q.D.bd, f: 0, c: 0, e: q.e, op: q.op * (q.bf ?? (q.e > 0 ? 1 - onBridge(q.x, q.y) * q.e : 1)), art: q.u.type === "art", cap: q.capd }));
      return { blocks: list.length }; }
    const HH = BOXL ? Hs : H;   /* v11: lineblocks stand on the smoothed ground (no jump over parapets / ditches) */
    if (CTR) return updCounter(ST, t);
    for (const Q of ST) {
      const { b, u, D, x: bx, y: by, pa, sa, c, e, spd, op, capd, f: fq, lpa, cpa, ab } = Q, i = b.i, seed = (blocks.indexOf(b) + 1) * 7.31;
      const colK = fq >= 0.5, pf = sstep(0, 1, Math.abs(1 - 2 * fq));   // v7: plate in the current formation's shape; it fades through the re-forming
      const fx = Math.cos(pa), fy = Math.sin(pa), px = -fy, py = fx, sfx = Math.cos(sa), sfy = Math.sin(sa);
      const isArt = u.type === "art", isCav = u.type === "cav", P = pal(u), W = colK && !isArt ? D.cw : D.bw, Dp = colK && !isArt ? D.cl : D.bd, Wl = D.bw, Dl = D.bd;
      const hb = HH(bx, by), sL = (HH(bx + px * W * 0.5, by + py * W * 0.5) - HH(bx - px * W * 0.5, by - py * W * 0.5)) / Math.max(W, 1e-3);
      const sF = (HH(bx + fx * Dp * 0.5, by + fy * Dp * 0.5) - HH(bx - fx * Dp * 0.5, by - fy * Dp * 0.5)) / Math.max(Dp, 1e-3);
      const mv = sstep(0.04 * ts, 0.3 * ts, spd);
      // v4 (critic: one consistent shadow direction): a soft CENTRED contact shadow (the real shadow map gives the sun's direction) + pale halo
      const wk = WM ? WM(bx, by) : 0, sink = wk * (S.woodSink ?? 0.55) * (W * 0.92 / 12) * 1.9, bk = Q.st != null ? Q.st : onBridge(bx, by), st = Q.st != null ? (isArt ? 0 : Q.st) : Q.eq && !isArt ? bk : 0;   // v5: only the rear ranks sink (below)
      { const hs = hb + 0.012 * ts, sw = W * (isArt ? 0.5 : 1.0) + 0.12 * ts, sd = Dp * (isArt ? 0.6 : 1.0) + 0.12 * ts;
        setM(shadows, ns, bx, hs, by, fx, fy, sw, 1, sd); setOp(shadows, ns, 0.27 * op * pf * (1 - 0.5 * wk) * (1 - bk));
        setM(halos, ns, bx, hs + 0.002 * ts, by, fx, fy, sw + 0.32 * ts, 1, sd + 0.32 * ts); halos.setColorAt(ns, col.setHex(0xf1ecd8).lerp(new THREE.Color(P.plate), 0.55 * wk).lerp(GREYP, capd)); setOp(halos, ns++, (0.1 + 0.12 * wk) * op * pf * (1 - bk));
        if (colK && !isArt) { const dx = bx - Math.cos(pa) * Dp * 0.75, dy = by - Math.sin(pa) * Dp * 0.75;   // v8: a faint dust wake behind a marching column
          setM(wakes, nwk, dx, Math.max(HH(dx, dy), hb) + 0.014 * ts, dy, fx, fy, W * 2.2, 1, Dp * 1.1); wakes.setColorAt(nwk, col.setHex(0xcdbb92)); setOp(wakes, nwk++, 0.32 * op * mv * pf * (1 - bk)); } }   // in a wood the halo carries the side colour (the plate is under the canopy)
      const pT = 0.006 * ts, ry = hb + S.lift, ip = np++, pk = isArt ? 0 : 1;   // v4: thin plate (no saturated base bar); guns have none
      setM(plateRim, ip, bx, ry, by, fx, fy, (W * 0.99 + 0.012 * ts) * pk, pT, (Dp * 0.86 + 0.012 * ts) * pk, sL, sF);   // v5: the men cover the plate but a ~2 px tint
      setM(plateFill, ip, bx, ry + 0.001 * ts, by, fx, fy, W * 0.99 * pk, pT * 1.15, Dp * 0.86 * pk, sL, sF);
      const fr = Dp * 0.022, fo = Dp * 0.43 - fr / 2; setM(plateFront, ip, bx + fx * fo, ry + 0.0015 * ts + sF * fo, by + fy * fo, fx, fy, (W + 0.014 * ts) * pk, pT * 1.3, fr * pk, sL, 0);
      plateFill.setColorAt(ip, col.setHex(P.plate).lerp(new THREE.Color(P.coat), colK ? 0.1 : 0.35).lerp(GREYL, capd)); plateRim.setColorAt(ip, col.setHex(P.plate).multiplyScalar(0.5).lerp(GREYC, capd)); plateFront.setColorAt(ip, col.setHex(P.rim).lerp(GREYP, capd * 0.7));
      for (const m of [plateRim, plateFill, plateFront]) setOp(m, ip, op * pf * (1 - bk));   // on a bridge deck the men file narrow, no plate
      if (isArt) {
        const k = ng++, gk = W * 0.75 / 0.78 * 1.27, lmb = Math.max(c, mv);   // v6: +30 %   // v4: guns ~30 % smaller
        let rec = 0; for (const s of shots) { if (s.t > t) break; if (Math.hypot(s.x - bx, s.y - by) < D.span * 0.6 + 0.5 * ts && i === 0) rec = Math.max(rec, Math.exp(-(t - s.t) * 7) * (t - s.t < 1.2 ? 1 : 0)); }
        const ga = Math.atan2(fy, fx) + Math.PI * sstep(0.2, 0.8, lmb), gfx = Math.cos(ga), gfy = Math.sin(ga);
        const gx = bx - fx * (rec * 0.08 * gk) - fx * lmb * 0.15 * gk, gy = by - fy * (rec * 0.08 * gk) - fy * lmb * 0.15 * gk, hg = HH(gx, gy) + S.lift - sink;
        const cg = col.setHex(0x6a5a3e).lerp(GREYC, capd); carriage.setColorAt(k, cg); limber.setColorAt(k, cg);
        setM(carriage, k, gx, hg, gy, gfx, gfy, gk, gk, gk); setM(barrel, k, gx, hg, gy, gfx, gfy, gk, gk, gk); setM(wheels, k, gx, hg, gy, gfx, gfy, gk, gk, gk);
        const lf = lerp(-0.55, 0.5, sstep(0.1, 0.9, lmb)) * gk, lx = bx + fx * lf, ly = by + fy * lf; setM(limber, k, lx, HH(lx, ly) + S.lift - sink, ly, fx, fy, gk, gk, gk);
        for (const m of [carriage, barrel, wheels, limber]) setOp(m, k, op);
        const fs = gk * 0.11;
        for (let j = 0; j < 4; j++) { const a = (j < 2 ? -1 : 1) * (0.2 + 0.05 * (j % 2)) * gk, d = ((j % 2 ? 0.28 : 0.05) + 0.03 * Math.sin(t * 3 + j) * rec - 0.2 * lmb) * gk;
          const x = gx + px * a - fx * d, y = gy + py * a - fy * d;
          setM(coats, nf, x, HH(x, y) + S.lift - sink, y, fx, fy, fs * 0.55, fs * 1.9, fs * 0.5); coats.setColorAt(nf, col.setHex(P.coat).lerp(GREYC, capd));
          setM(pales, nf, x, HH(x, y) + S.lift - sink, y, fx, fy, fs * 0.55, fs * 1.9, fs * 0.5); pales.setColorAt(nf, col.setHex(P.pale).lerp(GREYP, capd)); setOp(coats, nf, op); setOp(pales, nf, op); nf++; }
        continue;
      }
      if (u.form === "square") { setM(holes, nq, bx, ry + 0.004 * ts, by, fx, fy, W * 0.6, pT * 1.3, W * 0.6, sL, sF); setOp(holes, nq++, op); }
      const LINE = isCav ? CAV : u.form === "square" ? SQUARE : INF, nFigs = LINE.length;
      const sp = Wl * 0.92 / 12, fw = sp * 0.42, fd = sp * 0.4, fh = sp * 1.9, walk = mv, csp = Wl * 0.96 / 12;
      const lfx = Math.cos(lpa), lfy = Math.sin(lpa), cfx = Math.cos(cpa), cfy = Math.sin(cpa), lsa = lpa + Math.PI * ab;
      for (let j = 0; j < nFigs; j++) {
        const L = LINE[j]; let la = L[0] * (u.form === "square" ? Wl * 0.75 : Wl * 0.96), lb = L[1] * (u.form === "square" ? Wl * 0.75 : Dl * 0.9);
        la += (hash(seed + j, 1) - 0.5) * 0.12 * sp; lb += (hash(seed + j, 2) - 0.5) * 0.12 * sp;   // tidy ranks, a hair of irregularity
        // v7: line spot (frame lpa) and march-column spot (4 files x 18 ranks, frame cpa); each man walks between them on his own clock
        const cfi = j % 3, cra = Math.floor(j / 3), sway = 0.06 * sp * Math.sin(t * 2.2 + cra * 0.5 + seed) * walk, ca = (cfi - 1) * csp * 1.1 + (hash(seed + j, 14) - 0.5) * 0.1 * sp + sway, cb = D.cl / 2 - (cra + 0.5) * csp * 0.55;
        const dj = 0.22 * ((L[0] + 0.5) * 0.6 + hash(seed + j, 15) * 0.4), kj = fq <= 0 ? 0 : fq >= 1 ? 1 : sstep(0, 1, clamp((fq - dj) / 0.76));   // v8: file by file (0.1-0.45 s apart), each man walks
        const lx = Q.lx - lfy * la + lfx * lb, ly = Q.ly + lfx * la + lfy * lb, cx2 = Q.cx - cfy * ca + cfx * cb, cy2 = Q.cy + cfx * ca + cfy * cb;
        let x = lerp(lx, cx2, kj), y = lerp(ly, cy2, kj), ma = lsa + angDiff(lsa, cpa) * sstep(0, 0.35, kj);
        // v6 (owner): at a bridge the block BREAKS RANKS: each man walks the escape path in a stream 3 abreast (natural jitter, no plate),
        // the men leave / re-take their rank spots over ~1-1.5 s as the block enters / leaves the bridge zone
        let crW = 0, mOp = 1; if (Q.cr) { const m = crossMan(Q.cr, j, la, lb, t); x = m[0]; y = m[1]; ma = m[2]; crW = m[3]; mOp = m[4]; }
        else if (st > 0.001 && Q.eq) { const row = Math.floor(j / 3), cc = j % 3, sw = Q.ew - (row - 11.5) * csp * 0.55 - (hash(seed + j, 11) - 0.5) * 0.02, g = along(Q.eq.path, Math.max(0, sw));
          const off = (cc - 1) * Math.min(csp * 1.1, 0.055) + (hash(seed + j, 12) - 0.5) * 0.015, sx2 = g[0] - g[3] * off, sy2 = g[1] + g[2] * off, kj = sstep(0, 1, clamp(st * 1.25 - 0.25 * hash(seed + j, 13)));
          x = lerp(x, sx2, kj); y = lerp(y, sy2, kj); ma = sa + angDiff(sa, Math.atan2(g[3], g[2])) * kj; }
        const bob = (Q.cr ? crW : walk) * (0.12 + 0.1 * kj) * fh * Math.abs(Math.sin(t * 6 + j * 0.9 + seed)), rear = sstep(-0.1, -0.42, L[1]) * (1 - kj), hy = Math.max(HH(x, y), deckTop(x, y)) + S.lift + pT * 1.15 * (1 - st) + bob - sink * rear * (1 - st), lift = isCav ? fh * 0.55 : 0;
        const jh = 0.93 + 0.14 * hash(seed + j, 6), ja = (hash(seed + j, 8) - 0.5) * 0.35, jfx = Math.cos(ma + ja), jfy = Math.sin(ma + ja), jc = 0.9 + 0.2 * hash(seed + j, 9);   // v5: men not identical
        if (isCav) { setM(horses, nh, x, hy, y, sfx, sfy, fw * 1.5, fh * 0.7, fd * 2.2); setOp(horses, nh++, op); }
        setM(coats, nf, x, hy + lift, y, jfx, jfy, fw, fh * jh, fd); setM(pales, nf, x, hy + lift, y, jfx, jfy, fw, fh * jh, fd);
        coats.setColorAt(nf, col.setHex(P.coat).lerp(new THREE.Color(P.plate), 0.45).multiplyScalar(jc).lerp(GREYC, capd)); /* v11: coats 45 % toward the unit colour */ pales.setColorAt(nf, col.setHex(P.pale).lerp(GREYP, capd)); setOp(coats, nf, op * mOp); setOp(pales, nf, op * mOp); nf++;
      }
      { // v8: colour-bearer at the head of a column (shows which way it is going)
        const vb = sstep(0.6, 1, fq) * (1 - st), hx = Q.cx + cfx * (D.cl / 2 + 0.9 * sp), hy2 = Q.cy + cfy * (D.cl / 2 + 0.9 * sp), hh = Math.max(HH(hx, hy2), deckTop(hx, hy2)) + S.lift + walk * 0.1 * fh * Math.abs(Math.sin(t * 6 + seed));
        setM(coats, nf, hx, hh, hy2, cfx, cfy, fw, fh, fd); setM(pales, nf, hx, hh, hy2, cfx, cfy, fw, fh, fd); coats.setColorAt(nf, col.setHex(P.coat).lerp(new THREE.Color(P.plate), 0.3)); pales.setColorAt(nf, col.setHex(P.pale)); setOp(coats, nf, op * vb); setOp(pales, nf, op * vb); nf++;
        const fs2 = sp * 1.15, kf = nfl++; setM(poleM, kf, hx + cfy * 0.3 * sp, hh, hy2 - cfx * 0.3 * sp, cfx, cfy, fs2, fs2, fs2); setOp(poleM, kf, op * vb);
        setM(flagM, kf, hx + cfy * 0.3 * sp, hh, hy2 - cfx * 0.3 * sp, -cfy, cfx, fs2, fs2 * (1 + 0.06 * Math.sin(t * 5 + seed)), fs2); flagM.setColorAt(kf, col.setHex(P.flag)); setOp(flagM, kf, op * vb); }
      // skirmishers: a few men a little ahead of a halted line; they walk back into the front rank (same size) when it moves, routs or is taken
      const ks = (1 - fq) * (1 - capd) * (1 - e) * (1 - sstep(0.15 * ts, 0.6 * ts, spd)) * (u.skirmish === false || isCav ? 0 : 1);
      for (let j = 0; j < NS; j++) { const h1 = hash(seed + 91 + j, 1), h2 = hash(seed + 91 + j, 2), fj = Math.min(11, Math.round(((j + 0.5) / NS) * 12 - 0.5));
        const la0 = INF[fj][0] * Wl * 0.92, lb0 = INF[fj][1] * Dl * 0.84;   // its place in the front rank
        const la = lerp(la0, ((j + 0.5) / NS - 0.5) * Wl * 0.95 + (h1 - 0.5) * Wl * 0.12, ks), lb = lerp(lb0, Dl / 2 + Dl * (0.6 + 1.4 * h2), ks);
        const x = Q.lx - lfy * la + lfx * lb, y = Q.ly + lfx * la + lfy * lb;
        setM(coats, nf, x, HH(x, y) + S.lift + pT * ks - sink, y, sfx, sfy, fw, fh, fd); setM(pales, nf, x, HH(x, y) + S.lift + pT * ks - sink, y, sfx, sfy, fw, fh, fd);
        coats.setColorAt(nf, col.setHex(P.coat).lerp(GREYC, capd)); pales.setColorAt(nf, col.setHex(P.pale).lerp(GREYP, capd)); setOp(coats, nf, op * (1 - st) * (1 - sstep(0, 0.3, fq))); setOp(pales, nf, op * (1 - st) * (1 - sstep(0, 0.3, fq))); nf++; }
    }
    holes.count = nq; poleM.count = flagM.count = nfl; coats.count = pales.count = nf; plateFill.count = plateRim.count = plateFront.count = np; shadows.count = halos.count = ns; wakes.count = nwk;
    carriage.count = barrel.count = wheels.count = limber.count = ng; if (horses) horses.count = nh;
    for (const m of ALL) { m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true; m.geometry.attributes.iOp.needsUpdate = true; }
    API.last = ST.map((q) => ({ k: blocks.indexOf(q.b), u: units.indexOf(q.u), x: q.x, y: q.y, hx: Math.cos(q.pa), hy: Math.sin(q.pa), sx: Math.cos(q.sa), sy: Math.sin(q.sa), str: q.st || 0,
      w: q.u.type === "art" ? q.D.bw * 0.62 : q.f >= 0.5 ? q.D.cw : q.D.bw, d: q.u.type === "art" ? q.D.bd * 0.7 : q.f >= 0.5 ? q.D.cl : q.D.bd, f: q.f, c: q.c, e: q.e, op: q.op * (q.cr ? 1 - (q.st || 0) : 1), art: q.u.type === "art", cap: q.capd }));
    return { figures: nf, blocks: np, guns: ng };
  }
  // ---------- troops-box test (2026-11-26, owner: "the soldiers as boxes again, PROFESSIONAL this time"): look "counter" ----------
  // Each block = a solid 3D unit counter (bevelled slab with real thickness, darker side faces, lit by the sun, fogged, under smoke)
  // whose top face carries the side colour, a frame and a crisp unit-type symbol. Motion = the lineblocks motion untouched (base /
  // baseBox / crossMan); the counter only replaces the plate + men. At a bridge the counter dissolves into its men (the same v13/v14
  // stream). Variants (o.counter): round 1 "A" raised enamel, "B" bevelled slab + gold frame + pennant, "C" thin tile + drop shadow;
  // round 2 "A2" (critics' pick, rebuilt: matte painted top, screen-space ink edge, cream front band, cream symbol plate with an ink X,
  // light catch / dark inset on the top edges by the sun, crisp low bevel, tight AO, depth-tested against the terrain but pulled toward the
  // camera so tree crowns never clip it, faded at the frame edge, guns = the v14 gun models). Other looks never reach this code.
  function mkCounter() {
    const V = ({ A: { dk: 0.31, h: 0.075, bev: 0.018, ao: 0.5, drop: 0, cast: true, phong: true, pen: false, tex: "A" },
      B: { dk: 0.30, h: 0.10, bev: 0.034, ao: 0.46, drop: 0, cast: true, phong: false, pen: true, tex: "B" },
      C: { dk: 0.32, h: 0.028, bev: 0.008, ao: 0.3, drop: 0.5, cast: false, phong: false, pen: false, tex: "C" },
      A2: { dk: 0.40, wk: 1.06, h: 0.06, bev: 0.012, ao: 0.35, aoM: 0.055, drop: 0, cast: true, phong: false, pen: false, tex: "A2", edgePx: 1.8, capPx: 2.3, grain: 0.06, pull: 1.2,
        top: { u: "#3a5a94", r: "#a8432f" }, wall: { u: "#243b63", r: "#6e2a1f" }, capC: "#6e6a62", ink: "#2a1d16", guns: true, edgeFade: 26 } })[["A3", "A4", "A5", "A6", "A7", "A7b"].includes(o.counter) ? "A2" : o.counter || "A"] || null;
    // round 3 "A3" (critics on A2: it read as FLAGS - saltires / bunting): no cream anywhere; facing = a thicker ink front edge + a slim
    // darker-side-colour front strip + the lighter front wall; NATO symbol = a small plate in the lightened side colour, thin ink outline,
    // thin crossed lines (drawn in the shader in screen px); edge width grows with the counter's size on screen; guns: side-colour crew,
    // a flat side-colour ground disc, x1.3; captured = fully grey top, side-colour edge, held grey
    if (["A3", "A4", "A5", "A6", "A7", "A7b"].includes(o.counter)) Object.assign(V, { tex: "A3", capPx: 2.5, edgeMax: 3.0, frontK: 1.4, gunK: 1.3, stripD: 0.17, plateW: 0.31, plateD: 0.5,
      plate: { u: "#8ea2c6", r: "#d39a8c" }, strip: { u: "#2a4472", r: "#7f2f22" }, capPlate: "#9a968e", capStrip: "#55524b", xInk: 0.85, xPx: 1.5 });
    // round 4 "A4" (critics on A3: 8 / 7.5): guns x1.0 in dark ink bronze, no ground disc, bigger saturated side-colour crews; a LIGHTER
    // saturated front strip (the dark one merged with the near wall); blue top / walls lifted for dark woods; crossed lines 100 % ink, 1.8 px
    if (["A4", "A5", "A6", "A7", "A7b"].includes(o.counter)) Object.assign(V, { gunK: 1.0, noDisc: true, crewK: 1.6, gunBronze: { barrel: "#4a3a2c", carriage: "#5a4432" }, stripD: 0.22,
      strip: { u: "#5b80d0", r: "#e0614c" }, top: { u: "#4466a6", r: "#a8432f" }, wall: { u: "#2a4577", r: "#6e2a1f" }, xInk: 1.0, xPx: 1.8 });
    // round 5 "A5" (owner: boxes stay boxes at the bridge): A4 + crews in the counter's WALL colour at 1.3x (critic 1); the bridge narrowing is in baseBox / updCounter
    if (["A5", "A6", "A7", "A7b"].includes(o.counter)) Object.assign(V, { crewK: 1.3, crewWall: true, flipTop: true });
    // round 6 "A6" (owner: at the bridge the box keeps its shape; critic 2: guns need their side): no narrowing / widening, a side-colour ground
    // disc under each gun (#2c57b7 / #be3a2a, 0.35, thin ink rim), crews back in the side colour; guns x1.0 bronze as A4
    if (["A6", "A7", "A7b"].includes(o.counter)) Object.assign(V, { crewWall: false, crewSide: true, noDisc: false, noNarrow: true, discCol: { u: "#2c57b7", r: "#be3a2a" } });
    // round 7 "A7" (owner: never elevated at the bridge): the box stays at its walking height, the bank heights blended across the river (no
    // step up / down to the deck); a tight soft 40 % contact shadow right under the box wherever it is (pulled like the box, so it shows on the
    // deck / water / bank); gun discs at 0.55
    if (o.counter === "A7" || o.counter === "A7b") Object.assign(V, { flatBridge: true, ao: 0.4, aoPull: true, discA: 0.55 });
    // "A7b" (critic: the deck's planks / rails drew over the box): at the bridge (turn at the mouth, crossing, turn past the far end) the box's
    // camera-ward depth pull grows to bridgePull x the normal 1.2 u, so it always draws over the deck; elsewhere unchanged (hills still hide it)
    if (o.counter === "A7b") Object.assign(V, { bridgePull: 4.0 });
    const CV = { ...V, ...(o.counterOpts || {}) }, ART = { dk: 0.46 }, A3 = CV.tex === "A3", A2 = CV.tex === "A2" || A3;   /* A2 = the A2 family (A2, A3) */
    const slabG = (dk, h, bev, skirt) => { const P = [], N = [], C = [], hw = 0.5, hd = dk / 2, iw = hw - bev, id = hd - bev, yc = h - bev * 0.8, yb = -skirt;
      const tri = (a, b, c, sh) => { const u1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], u2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
        let n = [u1[1] * u2[2] - u1[2] * u2[1], u1[2] * u2[0] - u1[0] * u2[2], u1[0] * u2[1] - u1[1] * u2[0]]; const m = [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3 - h * 0.4, (a[2] + b[2] + c[2]) / 3];
        if (n[0] * m[0] + n[1] * m[1] + n[2] * m[2] < 0) { n = n.map((v) => -v); [b, c] = [c, b]; } const l = Math.hypot(...n) || 1; n = n.map((v) => v / l);
        for (const p of [a, b, c]) { P.push(...p); N.push(...n); C.push(sh, sh, sh); } };
      const quad = (a, b, c, d, sh) => { tri(a, b, c, sh); tri(a, c, d, sh); };
      // A2: the body is coloured with the WALL colour: the bevel lifts toward the top's value, the front wall (s = -1, local -z) 15 % lighter than the back
      const shC = A2 ? 1.45 : 0.9, shW = (s) => A2 ? (s < 0 ? 1.15 : 1.0) : 0.66, shS = A2 ? 1.06 : 0.66;
      for (const s of [-1, 1]) { quad([-iw, h, s * id], [iw, h, s * id], [hw, yc, s * hd], [-hw, yc, s * hd], shC);   // front / back chamfer
        quad([s * iw, h, -id], [s * iw, h, id], [s * hw, yc, hd], [s * hw, yc, -hd], shC);                            // side chamfers
        quad([-hw, yc, s * hd], [hw, yc, s * hd], [hw, yb, s * hd], [-hw, yb, s * hd], shW(s));                       // front / back walls
        quad([s * hw, yc, -hd], [s * hw, yc, hd], [s * hw, yb, hd], [s * hw, yb, -hd], shS); }                        // end walls
      const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(P, 3)); g.setAttribute("normal", new THREE.Float32BufferAttribute(N, 3));
      g.setAttribute("color", new THREE.Float32BufferAttribute(C, 3)); return g; };
    const topG = (dk, h, bev) => { const g = new THREE.PlaneGeometry(1 - 2 * bev, dk - 2 * bev); g.rotateX(-Math.PI / 2); g.translate(0, h, 0); return g; };
    // top-face mask: R = fill, G = cream, B = gold (A2: the front band), the rest = ink. Canvas top row = the FRONT edge.
    const gunPath = (g) => { g.save(); g.translate(44, 50); g.rotate(-22 * Math.PI / 180); g.translate(-44, -50); g.beginPath(); g.roundRect ? g.roundRect(40, 31, 56, 8, 3) : g.rect(40, 31, 56, 8); g.fill(); g.restore();
      g.fill(new Path2D("M30 42 L52 36 L56 52 L34 58 Z")); g.strokeStyle = g.fillStyle; g.lineWidth = 6; g.beginPath(); g.arc(36, 66, 13, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.arc(36, 66, 3.5, 0, Math.PI * 2); g.fill(); g.fill(new Path2D("M33 60 L6 84 L12 89 L40 66 Z")); };
    const texA2 = (sym, aspect) => { const Wc = 768, Hc = Math.round(768 / aspect), c = document.createElement("canvas"); c.width = Wc; c.height = Hc; const g = c.getContext("2d");
      // matte painted fill with a faint paper / linen grain (multiplied, ~6 %): R = 1 - grain * noise (value noise, 2 octaves)
      const im = g.createImageData(Wc, Hc), nz = (x, y, s, k) => { const xi = Math.floor(x / s), yi = Math.floor(y / s), fx2 = x / s - xi, fy2 = y / s - yi, h2 = (a, b) => hash(a * 7.13 + k, b * 3.71 + k);
        const a = lerp(h2(xi, yi), h2(xi + 1, yi), fx2), b = lerp(h2(xi, yi + 1), h2(xi + 1, yi + 1), fx2); return lerp(a, b, fy2); };
      for (let y = 0; y < Hc; y++) for (let x = 0; x < Wc; x++) { const n = 0.55 * nz(x, y, 3, 1) + 0.3 * nz(x, y, 9, 2) + 0.15 * (hash(x, y * 1.7) > 0.5 ? 1 : 0), k = (y * Wc + x) * 4;
        im.data[k] = Math.round(255 * (1 - CV.grain * n)); im.data[k + 1] = 0; im.data[k + 2] = 0; im.data[k + 3] = 255; }
      g.putImageData(im, 0, 0);
      g.fillStyle = "#0000ff"; g.fillRect(0, 0, Wc, Hc * 0.22);                     // cream front band (the outer ~9 % is covered by the screen-space ink edge)
      const pw = Wc * 0.40, ph = Hc * 0.56, px0 = (Wc - pw) / 2, py0 = Hc * 0.33, INK = "#000000";
      g.fillStyle = "#00ff00"; g.fillRect(px0, py0, pw, ph);                           // filled cream symbol plate
      g.strokeStyle = INK; g.fillStyle = INK; g.lineCap = "butt"; const lw = Hc * 0.115, ins = lw * 0.5;
      if (sym === "inf") { g.lineWidth = lw; g.beginPath(); g.moveTo(px0 + ins, py0 + ins); g.lineTo(px0 + pw - ins, py0 + ph - ins); g.moveTo(px0 + pw - ins, py0 + ins); g.lineTo(px0 + ins, py0 + ph - ins); g.stroke(); }
      else if (sym === "cav") { g.lineWidth = lw; g.beginPath(); g.moveTo(px0 + ins, py0 + ph - ins); g.lineTo(px0 + pw - ins, py0 + ins); g.stroke(); }
      else if (sym === "eng") { const r = ph * 0.27; g.save(); g.translate(Wc / 2, py0 + ph / 2); g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.fill();
        for (let k = 0; k < 8; k++) { g.save(); g.rotate(k * Math.PI / 4); g.fillRect(-r * 0.25, -r * 1.42, r * 0.5, r * 0.55); g.restore(); } g.fillStyle = "#00ff00"; g.beginPath(); g.arc(0, 0, r * 0.4, 0, Math.PI * 2); g.fill(); g.restore(); }
      else if (sym === "art") { const hh = ph * 0.8, ww = hh * 96 / 78, s2 = hh / 78; g.save(); g.translate(Wc / 2 - ww / 2 - 2 * s2, py0 + (ph - hh) / 2 - 18 * s2); g.scale(s2, s2); gunPath(g); g.restore(); }
      const t3 = new THREE.CanvasTexture(c); t3.colorSpace = THREE.NoColorSpace; t3.anisotropy = 8; t3.generateMipmaps = true; t3.minFilter = THREE.LinearMipmapLinearFilter; return t3; };
    // A3: the painted fill (grain, R) + the slim darker front strip (B); the plate, outline and crossed lines are drawn in the shader (screen px)
    const texA3 = (aspect) => { const Wc = 768, Hc = Math.round(768 / aspect), c = document.createElement("canvas"); c.width = Wc; c.height = Hc; const g = c.getContext("2d");
      const im = g.createImageData(Wc, Hc), nz = (x, y, s2, k) => { const xi = Math.floor(x / s2), yi = Math.floor(y / s2), fx2 = x / s2 - xi, fy2 = y / s2 - yi, h2 = (a, b) => hash(a * 7.13 + k, b * 3.71 + k);
        const a = lerp(h2(xi, yi), h2(xi + 1, yi), fx2), b = lerp(h2(xi, yi + 1), h2(xi + 1, yi + 1), fx2); return lerp(a, b, fy2); };
      const sh = Math.round(Hc * CV.stripD);
      for (let y = 0; y < Hc; y++) for (let x = 0; x < Wc; x++) { const n = 0.55 * nz(x, y, 3, 1) + 0.3 * nz(x, y, 9, 2) + 0.15 * (hash(x, y * 1.7) > 0.5 ? 1 : 0), k = (y * Wc + x) * 4, v = Math.round(255 * (1 - CV.grain * n));
        im.data[k] = y < sh ? 0 : v; im.data[k + 1] = 0; im.data[k + 2] = y < sh ? v : 0; im.data[k + 3] = 255; }
      g.putImageData(im, 0, 0); const t3 = new THREE.CanvasTexture(c); t3.colorSpace = THREE.NoColorSpace; t3.anisotropy = 8; t3.generateMipmaps = true; t3.minFilter = THREE.LinearMipmapLinearFilter; return t3; };
    const tex = (sym, aspect) => { if (A3) return texA3(aspect); if (A2) return texA2(sym, aspect); const Wc = 512, Hc = Math.round(512 / aspect), c = document.createElement("canvas"); c.width = Wc; c.height = Hc; const g = c.getContext("2d"), m = Math.min(Wc, Hc);
      const R = (k = 1) => `rgb(${Math.round(255 * k)},0,0)`, CR = "#00ff00", GD = "#0000ff", INK = "#000000";
      g.fillStyle = INK; g.fillRect(0, 0, Wc, Hc);
      const T = CV.tex, eI = T === "C" ? 0.045 * m : 0.022 * m; const gr = g.createLinearGradient(0, 0, Wc * 0.3, Hc); gr.addColorStop(0, R(1)); gr.addColorStop(1, R(T === "A" ? 0.9 : 0.95));
      g.fillStyle = gr; g.fillRect(eI, eI, Wc - 2 * eI, Hc - 2 * eI);
      if (T !== "C") { const e2 = T === "B" ? 0.075 * m : 0.085 * m, lw = T === "B" ? 0.05 * m : 0.032 * m; g.strokeStyle = GD; g.lineWidth = lw; g.strokeRect(e2, e2, Wc - 2 * e2, Hc - 2 * e2);
        if (T === "A") { g.fillStyle = GD; g.fillRect(e2 - lw / 2, e2 - lw / 2, Wc - 2 * e2 + lw, lw * 1.9); } }   // the front side of the frame twice as strong (shows the facing)
      else { g.fillStyle = CR; g.fillRect(eI, eI, Wc - 2 * eI, 0.06 * m); }                                            // C: a cream front band
      const bh = Hc * (sym === "art" ? 0.66 : 0.56), bw = sym === "art" ? bh * 1.5 : bh * 1.55, bx = (Wc - bw) / 2, by = (Hc - bh) / 2, plate = T === "B", sc = plate ? INK : CR, lw2 = Math.max(3, Hc * 0.065);
      if (sym !== "art") { if (plate) { g.fillStyle = CR; g.fillRect(bx - lw2 * 0.3, by - lw2 * 0.3, bw + lw2 * 0.6, bh + lw2 * 0.6); g.strokeStyle = GD; g.lineWidth = lw2 * 0.45; g.strokeRect(bx - lw2 * 0.3, by - lw2 * 0.3, bw + lw2 * 0.6, bh + lw2 * 0.6); }
        else { g.strokeStyle = CR; g.lineWidth = lw2; g.strokeRect(bx, by, bw, bh); } }
      g.strokeStyle = sc; g.fillStyle = sc; g.lineWidth = lw2 * 0.95; g.lineCap = "butt";
      const ix = bx + lw2 * 0.15, iy = by + lw2 * 0.15, iw2 = bw - lw2 * 0.3, ih = bh - lw2 * 0.3;
      if (sym === "inf") { g.beginPath(); g.moveTo(ix, iy); g.lineTo(ix + iw2, iy + ih); g.moveTo(ix + iw2, iy); g.lineTo(ix, iy + ih); g.stroke(); }
      else if (sym === "cav") { g.beginPath(); g.moveTo(ix, iy + ih); g.lineTo(ix + iw2, iy); g.stroke(); }
      else if (sym === "eng") { const r = bh * 0.26; g.save(); g.translate(Wc / 2, Hc / 2); g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.fill();
        for (let k = 0; k < 8; k++) { g.save(); g.rotate(k * Math.PI / 4); g.fillRect(-r * 0.25, -r * 1.42, r * 0.5, r * 0.55); g.restore(); } g.fillStyle = plate ? CR : R(1); g.beginPath(); g.arc(0, 0, r * 0.4, 0, Math.PI * 2); g.fill(); g.restore(); }
      else if (sym === "art") { if (plate) { g.fillStyle = CR; g.fillRect(bx, by, bw, bh); g.fillStyle = INK; }   // the kit's approved gun box (fx.js art_gun, viewBox 2 18 96 78)
        const hh = bh * 0.86, ww = hh * 96 / 78, s2 = hh / 78; g.save(); g.translate((Wc - ww) / 2 - 2 * s2, (Hc - hh) / 2 - 18 * s2); g.scale(s2, s2); gunPath(g); g.restore(); }
      const t3 = new THREE.CanvasTexture(c); t3.colorSpace = THREE.NoColorSpace; t3.anisotropy = 8; t3.generateMipmaps = true; t3.minFilter = THREE.LinearMipmapLinearFilter; return t3; };
    // A2: depth test ON (hills hide counters) but the counter's depth is pulled `pull` units toward the camera (screen position unchanged),
    // so tree crowns standing right round / in front of it never clip it
    const pullU = { value: (CV.pull ?? 0) * ts };
    const opHook = (sh) => { sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nattribute float iOp; varying float vOp;" + (A2 ? "\nattribute vec4 iEdge; attribute vec2 iSun; varying vec4 vEdge; varying vec2 vSun; uniform float uPull;" + (CV.bridgePull ? " attribute float iPl;" : "") : "") + (A3 ? "\nattribute vec3 iPlt; attribute vec3 iStr; varying vec3 vPlt; varying vec3 vStr;" : ""))
        .replace("#include <begin_vertex>", "#include <begin_vertex>\nvOp = iOp;");
      if (A2) { sh.uniforms.uPull = pullU; sh.vertexShader = sh.vertexShader.replace("#include <project_vertex>", "#include <project_vertex>\n{ float Lm = length(mvPosition.xyz); vec4 pp = projectionMatrix * vec4(mvPosition.xyz * max(0.05, 1.0 - uPull" + (CV.bridgePull ? " * iPl" : "") + " / Lm), 1.0); gl_Position.z = pp.z / pp.w * gl_Position.w; }"); }
      sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying float vOp;").replace("#include <dithering_fragment>", "#include <dithering_fragment>\ngl_FragColor.a *= vOp;"); };
    const topMat = (map) => { const m = CV.phong ? new THREE.MeshPhongMaterial({ map, transparent: true, shininess: 38, specular: 0x2a2826 }) : new THREE.MeshLambertMaterial({ map, transparent: true });
      m.onBeforeCompile = (sh) => { opHook(sh); sh.uniforms.uCream = { value: new THREE.Color(A2 ? "#e9dfc6" : "#f3ecd8") }; sh.uniforms.uGold = { value: new THREE.Color(A2 ? "#efe6cf" : "#d4ab55") }; sh.uniforms.uInk = { value: new THREE.Color(A2 ? "#1e1a16" : "#16130f") };
        if (A2) sh.vertexShader = sh.vertexShader.replace("vOp = iOp;", "vOp = iOp; vEdge = iEdge; vSun = iSun;" + (A3 ? " vPlt = iPlt; vStr = iStr;" : ""));
        if (A3) sh.uniforms.uSym = { value: m.userData.sym || 0 };
        const edge = A2 ? `
vec2 fwd = max(fwidth(vMapUv), vec2(1e-6)); vec2 dLo = vMapUv / fwd, dHi = (1.0 - vMapUv) / fwd; float EB = vEdge.a;
#define BND(d) (smoothstep(EB - 0.3, EB + 0.2, d) * (1.0 - smoothstep(EB + 0.9, EB + 1.4, d)))
float lit = vSun.x * (BND(dHi.x) - BND(dLo.x)) + vSun.y * (BND(dHi.y) - BND(dLo.y));
diffuseColor.rgb *= 1.0 + max(lit, 0.0) * 0.18 + min(lit, 0.0) * 0.3;
float dmn = min(min(dLo.x, dLo.y), min(dHi.x, dHi.y)); diffuseColor.rgb = mix(diffuseColor.rgb, vEdge.rgb, 1.0 - smoothstep(EB - 0.5, EB + 0.5, dmn));` : "";
        const a3 = `vec4 mk = texture2D( map, vMapUv );
#ifdef USE_COLOR
vec3 fillC = vColor.rgb;
#else
vec3 fillC = diffuse;
#endif
float gr = mk.r + mk.b; vec3 c = mk.r * fillC + mk.b * vStr;
vec2 fwd = max(fwidth(vMapUv), vec2(1e-6)); vec2 dLo = vMapUv / fwd, dHi = (1.0 - vMapUv) / fwd; float EB = vEdge.a, EF = EB * ${CV.frontK.toFixed(2)};
vec2 p0 = vec2(${(0.5 - CV.plateW / 2).toFixed(4)}, ${((1 - CV.stripD - CV.plateD) / 2).toFixed(4)}), p1 = vec2(${(0.5 + CV.plateW / 2).toFixed(4)}, ${((1 - CV.stripD + CV.plateD) / 2).toFixed(4)});
vec2 q = (vMapUv - p0) / fwd, qs = (p1 - p0) / fwd; float bd = min(min(q.x, q.y), min(qs.x - q.x, qs.y - q.y)), ins = smoothstep(-0.5, 0.5, bd)${CV.flipTop ? " * smoothstep(8.0, 12.0, qs.x)" : ""};
c = mix(c, vPlt * gr, ins);
float ol = ins * (1.0 - smoothstep(0.85, 1.85, bd));
float Ld = length(qs), d1 = abs(q.x * qs.y - q.y * qs.x) / Ld, d2 = abs(q.x * qs.y + q.y * qs.x - qs.x * qs.y) / Ld, dx = uSym < 0.5 ? min(d1, d2) : uSym < 1.5 ? d1 : 1e3;
float xl = ins * (1.0 - smoothstep(${(CV.xPx / 2 - 0.5).toFixed(2)}, ${(CV.xPx / 2 + 0.5).toFixed(2)}, dx)) * ${CV.xInk.toFixed(2)};
c = mix(c, uInk, max(ol, xl));
#define BND(d) (smoothstep(EB - 0.3, EB + 0.2, d) * (1.0 - smoothstep(EB + 0.9, EB + 1.4, d)))
float lit = vSun.x * (BND(dHi.x) - BND(dLo.x)) + vSun.y * (smoothstep(EF - 0.3, EF + 0.2, dHi.y) * (1.0 - smoothstep(EF + 0.9, EF + 1.4, dHi.y)) - BND(dLo.y));
c *= 1.0 + max(lit, 0.0) * 0.18 + min(lit, 0.0) * 0.3;
float e1 = 1.0 - smoothstep(EB - 0.5, EB + 0.5, min(min(dLo.x, dLo.y), dHi.x)), e2 = 1.0 - smoothstep(EF - 0.5, EF + 0.5, dHi.y);
diffuseColor.rgb = mix(c, vEdge.rgb, max(e1, e2));`;
        sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nuniform vec3 uCream; uniform vec3 uGold; uniform vec3 uInk;" + (A2 ? "\nvarying vec4 vEdge; varying vec2 vSun;" : "") + (A3 ? "\nvarying vec3 vPlt; varying vec3 vStr; uniform float uSym;" : ""))
          .replace("#include <map_fragment>", A3 ? a3 : "vec4 mk = texture2D( map, vMapUv ); float mi = clamp(1.0 - mk.r - mk.g - mk.b, 0.0, 1.0);\n#ifdef USE_COLOR\nvec3 fillC = vColor.rgb;\n#else\nvec3 fillC = diffuse;\n#endif\ndiffuseColor.rgb = mk.r * fillC + mk.g * uCream + mk.b * uGold + mi * uInk;" + edge)
          .replace("#include <color_fragment>", ""); };
      m.customProgramCacheKey = () => "ctrTop" + (CV.phong ? 1 : 0) + (A2 ? "a2" : "") + (A3 ? "a3" + (m.userData.sym || 0) : ""); return m; };
    const bodyMat = () => { const m = new THREE.MeshLambertMaterial({ vertexColors: true, transparent: true }); m.onBeforeCompile = opHook; m.customProgramCacheKey = () => "ctrBody" + (A2 ? "a2" : "") + (A3 ? "a3" : ""); return m; };
    // round 1: a counter is CONVEX: with back faces culled it draws correctly without a depth test (never cut by tree crowns); A2 depth-tests (pulled)
    const mk = (geo, mat, n, cast, recv = true, ro = 2) => { if (!A2) { mat.depthTest = false; mat.depthWrite = false; } const N = Math.max(1, n), g = geo.clone(); g.setAttribute("iOp", new THREE.InstancedBufferAttribute(new Float32Array(N).fill(1), 1));
      if (A2 && CV.bridgePull) g.setAttribute("iPl", new THREE.InstancedBufferAttribute(new Float32Array(N).fill(1), 1));
      if (A2) { g.setAttribute("iEdge", new THREE.InstancedBufferAttribute(new Float32Array(N * 4), 4)); g.setAttribute("iSun", new THREE.InstancedBufferAttribute(new Float32Array(N * 2), 2)); }
      if (A3) { g.setAttribute("iPlt", new THREE.InstancedBufferAttribute(new Float32Array(N * 3), 3)); g.setAttribute("iStr", new THREE.InstancedBufferAttribute(new Float32Array(N * 3), 3)); }
      const m = new THREE.InstancedMesh(g, mat, N); m.castShadow = cast; m.receiveShadow = recv; m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); m.frustumCulled = false; m.count = 0; m.renderOrder = ro;   /* walls: no shadow acne stripes */
      m.setColorAt(0, new THREE.Color()); scene.add(m); ALL.push(m); return m; };
    // A2: tight contact AO, its own texture per footprint: opaque under the counter, a ~3-4 px soft falloff round it
    const aoTex = (qw, qd, mw, md) => { const Wc = 256, Hc = Math.max(32, Math.round(256 * qd / qw)), c = document.createElement("canvas"); c.width = Wc; c.height = Hc; const g = c.getContext("2d"), im = g.createImageData(Wc, Hc);
      for (let y = 0; y < Hc; y++) for (let x = 0; x < Wc; x++) { const ux = Math.max(0, Math.abs((x + 0.5) / Wc - 0.5) * qw - (qw / 2 - mw)) / mw, uy = Math.max(0, Math.abs((y + 0.5) / Hc - 0.5) * qd - (qd / 2 - md)) / md;
        const d = Math.min(1, Math.hypot(ux, uy)), a = Math.pow(1 - d, 1.6), k = (y * Wc + x) * 4; im.data[k] = im.data[k + 1] = im.data[k + 2] = 0; im.data[k + 3] = Math.round(255 * a); }
      g.putImageData(im, 0, 0); const t3 = new THREE.CanvasTexture(c); return t3; };
    const K = {}, nI = infBlocks.length, nA = artBlocks.length, symOf = (u) => u.type === "art" ? "art" : u.type === "cav" ? "cav" : u.type === "eng" ? "eng" : "inf";
    const need = new Set(blocks.map((b) => symOf(b.u)).filter((s2) => !(CV.guns && s2 === "art")));
    for (const sym of need) { const dk = sym === "art" ? ART.dk : CV.dk, n = blocks.filter((b) => symOf(b.u) === sym).length;
      K[sym] = { dk, body: mk(slabG(dk, CV.h, CV.bev, 0), bodyMat(), n, CV.cast, false), top: mk(topG(dk, CV.h, CV.bev), (() => { const m3 = topMat(tex(sym, (1 - 2 * CV.bev) / (dk - 2 * CV.bev))); m3.userData.sym = sym === "inf" ? 0 : sym === "cav" ? 1 : 2; return m3; })(), n, false, !CV.bridgePull, 2.02), n: 0, nf: 0 };   /* A7b: the top takes no shadow-map shadows (the deck's shadow read as the planks crossing the box) */
      if (CV.flipTop) K[sym].topF = mk(topG(dk, CV.h, CV.bev), K[sym].top.material, n, false, !CV.bridgePull, 2.025);   // A5: the markings turned about (crossfaded over the about-face) so the front strip leads a retreat
      if (A2) { const m2 = CV.aoM, qw = 1 + 2 * m2, qd = dk + 2 * m2, am = new THREE.MeshBasicMaterial({ map: aoTex(qw, qd, m2, m2), color: 0x0b0806, transparent: true, depthWrite: false, fog: true });
        am.onBeforeCompile = (sh) => { sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nattribute float iOp; varying float vOp;" + (CV.aoPull ? " uniform float uPull;" : "")).replace("#include <begin_vertex>", "#include <begin_vertex>\nvOp = iOp;");
          if (CV.aoPull) { sh.uniforms.uPull = { value: pullU.value * 0.98 }; sh.vertexShader = sh.vertexShader.replace("#include <project_vertex>", "#include <project_vertex>\n{ float Lm = length(mvPosition.xyz); vec4 pp = projectionMatrix * vec4(mvPosition.xyz * max(0.05, 1.0 - uPull / Lm), 1.0); gl_Position.z = pp.z / pp.w * gl_Position.w; }"); }   // A7: the contact shadow is pulled like the box (shows on deck / water / bank)
          sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying float vOp;").replace("#include <dithering_fragment>", "#include <dithering_fragment>\ngl_FragColor.a *= vOp;"); };
        am.customProgramCacheKey = () => "ctrAO" + (CV.aoPull ? "p" : ""); const qg = new THREE.PlaneGeometry(1, 1); qg.rotateX(-Math.PI / 2);
        K[sym].ao = mk(qg, am, n, false, false, 1.95); K[sym].ao.material.depthTest = true; K[sym].qw = qw; K[sym].qd = qd; } }
    // a small regimental pennant on a staff at the rear-left corner (variant B)
    const pen = CV.pen ? (() => { const pole = mk(box(0.014, 0.34, 0.014, 0, 0.17, 0), (() => { const m = new THREE.MeshLambertMaterial({ color: 0x2a2018, transparent: true }); m.onBeforeCompile = opHook; m.customProgramCacheKey = () => "ctrPole"; return m; })(), nI + nA, false, true, 2.03);
      const fg = new THREE.BufferGeometry(); fg.setAttribute("position", new THREE.Float32BufferAttribute([0, 0.34, 0, 0.24, 0.34, 0, 0.17, 0.285, 0, 0, 0.34, 0, 0.17, 0.285, 0, 0, 0.23, 0, 0, 0.23, 0, 0.17, 0.285, 0, 0.24, 0.23, 0], 3)); fg.computeVertexNormals();
      const fm = new THREE.MeshLambertMaterial({ side: THREE.DoubleSide, transparent: true, emissive: 0x303030 }); fm.onBeforeCompile = opHook; fm.customProgramCacheKey = () => "ctrFlag";
      return { pole, flag: mk(fg, fm, nI + nA, false, true, 2.04) }; })() : null;
    // A3: a flat side-colour ground disc under each gun (0.35 opacity, thin ink rim) so a battery reads as a unit of its side
    const disc = A3 && CV.guns && nA && !CV.noDisc ? (() => { const c = document.createElement("canvas"); c.width = c.height = 128; const g = c.getContext("2d"); g.fillStyle = "#000"; g.fillRect(0, 0, 128, 128);
      g.fillStyle = "#ff0000"; g.beginPath(); g.arc(64, 64, 61, 0, Math.PI * 2); g.fill(); g.strokeStyle = "#00ff00"; g.lineWidth = 2.6; g.beginPath(); g.arc(64, 64, 61.5, 0, Math.PI * 2); g.stroke();
      const t3 = new THREE.CanvasTexture(c); t3.colorSpace = THREE.NoColorSpace; const dm = new THREE.MeshBasicMaterial({ map: t3, transparent: true, depthWrite: false, fog: true });
      dm.onBeforeCompile = (sh) => { sh.uniforms.uInk = { value: new THREE.Color("#2a1d16") }; sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nattribute float iOp; varying float vOp;").replace("#include <begin_vertex>", "#include <begin_vertex>\nvOp = iOp;");
        sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying float vOp; uniform vec3 uInk;").replace("#include <map_fragment>", "vec4 mk = texture2D( map, vMapUv ); float rim = mk.g;\n#ifdef USE_COLOR\nvec3 fc = vColor.rgb;\n#else\nvec3 fc = diffuse;\n#endif\ndiffuseColor = vec4(mix(fc, uInk, rim), clamp(mk.r * " + (CV.discA ?? 0.35).toFixed(2) + " + rim * 0.9, 0.0, 1.0));").replace("#include <color_fragment>", "")
          .replace("#include <dithering_fragment>", "#include <dithering_fragment>\ngl_FragColor.a *= vOp;"); };
      dm.customProgramCacheKey = () => "ctrDisc"; const qg = new THREE.PlaneGeometry(1, 1); qg.rotateX(-Math.PI / 2); const m = mk(qg, dm, nA, false, false, 1.9); m.material.depthTest = true; return m; })() : null;
    return { CV, K, pen, symOf, A2, A3, disc };
  }
  const CK = CTR ? mkCounter() : null;
  const FRM = o.frame || [1280, 720];
  function updCounter(ST, t) {
    const { CV, K, pen, symOf, A2, A3, disc } = CK, SC = A2 ? CV.top : (o.sideCol || { u: "#2c57b7", r: "#be3a2a" }), FILL = { u: new THREE.Color(SC.u), r: new THREE.Color(SC.r) }, GRY = new THREE.Color(A2 ? CV.capC : 0x8b877e);
    const WALL = A2 ? { u: new THREE.Color(CV.wall.u), r: new THREE.Color(CV.wall.r) } : null, INKC = new THREE.Color(CV.ink || "#000000"), ec = new THREE.Color(), ePx = CV.edgePx ?? 1.8;
    const DSC = CV.discCol ? { u: new THREE.Color(CV.discCol.u), r: new THREE.Color(CV.discCol.r) } : null;
    const PLT = A3 ? { u: new THREE.Color(CV.plate.u), r: new THREE.Color(CV.plate.r) } : null, STR = A3 ? { u: new THREE.Color(CV.strip.u), r: new THREE.Color(CV.strip.r) } : null, CPL = A3 ? new THREE.Color(CV.capPlate) : null, CST = A3 ? new THREE.Color(CV.capStrip) : null;
    let nf = 0, ns = 0, np = 0, ng = 0, nd = 0; for (const k in K) K[k].n = K[k].nf = 0;
    for (const Q of ST) {
      const { b, u, D, x: bx, y: by, pa, op } = Q;
      // A3: captured = held grey (round 2 faded back toward the side colour before the unit's own fade: it read as pink)
      const capd = A3 && !u.caps ? (u.cap != null && b.i * u._bpb < u.capN ? sstep(u.cap, u.cap + 0.8, t) : 0) : Q.capd;
      const i = b.i, seed = (blocks.indexOf(b) + 1) * 7.31, isArt = u.type === "art", P = pal(u), sym = symOf(u), KK = K[sym];
      const bk = Q.st != null ? Q.st : onBridge(bx, by), st = Q.st != null ? (isArt ? 0 : Q.st) : Q.eq && !isArt ? bk : 0;
      const fx = Math.cos(pa), fy = Math.sin(pa), px = -fy, py = fx, W = D.bw, hb = Hs(bx, by);
      if (isArt && CV.guns) {   // A2: artillery keeps the v14 gun models (carriage, barrel, wheels, limber, 4 crew; recoil per shot)
        const spd = Q.spd, mv = sstep(0.04 * ts, 0.3 * ts, spd), wk = WM ? WM(bx, by) : 0, sink = wk * (S.woodSink ?? 0.55) * (W * 0.92 / 12) * 1.9, cq = Q.c;
        { const hs = hb + 0.012 * ts, sw = W * 0.5 + 0.12 * ts, sd = D.bd * 0.6 + 0.12 * ts; setM(shadows, ns, bx, hs, by, fx, fy, sw, 1, sd); setOp(shadows, ns++, 0.27 * op * (1 - 0.5 * wk)); }
        const k = ng++, gk = W * 0.75 / 0.78 * 1.27 * (CV.gunK ?? 1), lmb = Math.max(cq, mv);
        if (disc) { const dd = gk * 1.2; setM(disc, nd, bx - fx * 0.1 * gk, hb + 0.006 * ts, by - fy * 0.1 * gk, fx, fy, dd, 1, dd); disc.setColorAt(nd, col.copy((CV.discCol ? DSC : FILL)[u.side] || FILL.u).lerp(GRY, capd)); setOp(disc, nd++, op); }
        let rec = 0; for (const s of shots) { if (s.t > t) break; if (Math.hypot(s.x - bx, s.y - by) < D.span * 0.6 + 0.5 * ts && i === 0) rec = Math.max(rec, Math.exp(-(t - s.t) * 7) * (t - s.t < 1.2 ? 1 : 0)); }
        const ga = Math.atan2(fy, fx) + Math.PI * sstep(0.2, 0.8, lmb), gfx = Math.cos(ga), gfy = Math.sin(ga);
        const gx = bx - fx * (rec * 0.08 * gk) - fx * lmb * 0.15 * gk, gy = by - fy * (rec * 0.08 * gk) - fy * lmb * 0.15 * gk, hg = Hs(gx, gy) + S.lift - sink;
        const cg = CV.gunBronze ? col.set(CV.gunBronze.carriage).lerp(GREYC, capd) : col.setHex(0x6a5a3e).lerp(GREYC, capd); carriage.setColorAt(k, cg); limber.setColorAt(k, cg);
        if (CV.gunBronze) { const bc = new THREE.Color(CV.gunBronze.barrel).lerp(GREYC, capd), bm = barrel.material.color; barrel.setColorAt(k, bc.setRGB(bc.r / bm.r, bc.g / bm.g, bc.b / bm.b)); }   /* A4: dark bronze barrel (instance colour x the material's pale grey) */
        setM(carriage, k, gx, hg, gy, gfx, gfy, gk, gk, gk); setM(barrel, k, gx, hg, gy, gfx, gfy, gk, gk, gk); setM(wheels, k, gx, hg, gy, gfx, gfy, gk, gk, gk);
        const lf = lerp(-0.55, 0.5, sstep(0.1, 0.9, lmb)) * gk, lx = bx + fx * lf, ly = by + fy * lf; setM(limber, k, lx, Hs(lx, ly) + S.lift - sink, ly, fx, fy, gk, gk, gk);
        for (const m of [carriage, barrel, wheels, limber]) setOp(m, k, op);
        const fs = gk * 0.11 * (CV.crewK ?? 1);
        for (let j = 0; j < 4; j++) { const a = (j < 2 ? -1 : 1) * (0.2 + 0.05 * (j % 2)) * gk, d = ((j % 2 ? 0.28 : 0.05) + 0.03 * Math.sin(t * 3 + j) * rec - 0.2 * lmb) * gk;
          const x = gx + px * a - fx * d, y = gy + py * a - fy * d;
          setM(coats, nf, x, Hs(x, y) + S.lift - sink, y, fx, fy, fs * 0.55, fs * 1.9, fs * 0.5); coats.setColorAt(nf, A3 ? col.copy(((CV.crewSide ? DSC : CV.crewWall ? WALL : CV.crewK ? STR : FILL)[u.side]) || FILL.u).lerp(GREYC, capd) : col.setHex(P.coat).lerp(GREYC, capd));   /* A3: crew in the side colour */
          setM(pales, nf, x, Hs(x, y) + S.lift - sink, y, fx, fy, fs * 0.55, fs * 1.9, fs * 0.5); pales.setColorAt(nf, col.setHex(P.pale).lerp(GREYP, capd)); setOp(coats, nf, op); setOp(pales, nf, op); nf++; }
        continue; }
      const nw = CV.flipTop ? (Q.nw || 0) : 0, WK = lerp(W * (CV.wk ?? 1), 0.18 * ts, nw), Dd0 = W * KK.dk;   // A5: frontage narrows to the deck at a bridge
      // A2 bridge (critics round 1): the counter shrinks from its REAR edge (the edge at the bridge mouth: a routing block walks back) as the
      // ranks peel off and is gone within ~0.35 s; the men only appear once it is below half opacity
      let dS = 1, cOp = 1 - st, mOn = sstep(0, 0.5, st);
      if (A2 && Q.cr) { const f0 = Q.cr.f0; dS = 1 - 0.55 * sstep(f0, f0 + 0.45, t); cOp = 1 - sstep(f0 + 0.1, f0 + 0.45, t); mOn = sstep(f0 + 0.27, f0 + 0.45, t); }
      else if (A2) { cOp = 1 - sstep(0, 0.45, st); mOn = sstep(0.22, 0.45, st); dS = 1 - 0.55 * sstep(0, 0.45, st); }
      if (CV.flipTop) { dS = 1 + 0.35 * nw; cOp = Q.fk ?? 1; mOn = 0; }   // A5: no men ever; depth grows a little as it narrows; fades past the bridge
      const Dd = Dd0 * dS, cx = CV.flipTop ? bx : bx + fx * (Dd0 - Dd) / 2, cy = CV.flipTop ? by : by + fy * (Dd0 - Dd) / 2;   // front edge fixed
      const sL = clamp((Hs(cx + px * W * 0.5, cy + py * W * 0.5) - Hs(cx - px * W * 0.5, cy - py * W * 0.5)) / W, -0.2, 0.2), sF = clamp((Hs(cx + fx * Dd0 * 0.5, cy + fy * Dd0 * 0.5) - Hs(cx - fx * Dd0 * 0.5, cy - fy * Dd0 * 0.5)) / Dd0, -0.2, 0.2);
      const wk = !A2 && WM ? Math.max(WM(bx, by), ...[[1, 1], [1, -1], [-1, 1], [-1, -1]].map(([a, c]) => WM(bx + px * W * 0.5 * a + fx * Dd * 0.5 * c, by + py * W * 0.5 * a + fy * Dd * 0.5 * c))) : 0;
      // A2: fade out at the frame edge (never a half-cut counter): every top corner >= edgeFade px inside the frame for full opacity
      let ef = 1; if (A2 && CV.edgeFade && o.proj) { let m = 1e9; for (const [a, c] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) { const X = cx + px * WK * 0.5 * a + fx * Dd * 0.5 * c, Y = cy + py * WK * 0.5 * a + fy * Dd * 0.5 * c, s2 = o.proj(X, Y, hb + CV.h * W - H(X, Y));
          m = Math.min(m, s2.x, FRM[0] - s2.x, s2.y, FRM[1] - s2.y); } ef = sstep(0, CV.edgeFade, m); }
      const dk5 = CV.flipTop && Q.dk ? [Q.dH, Q.dk] : null, onDk = !!dk5 && dk5[1] > 0.001;   // A5: on (and blending onto) the deck the narrow box stands level on the planks
      const oc = op * cOp * ef, y0 = Q.yA != null ? Q.yA + S.lift : onDk ? lerp(hb + S.lift, Math.max(hb + S.lift, dk5[0]), dk5[1]) : hb + S.lift + wk * Math.max(0, (CV.wood ?? 0) - CV.h) * W;   // counterOpts.wood: lift onto the canopy in woods (round 1 only)
      Q._zh = y0 - S.lift;   // A5: the drawn base height (on the deck: the planks) for the motion checker
      if (oc > 0.002) { const k = KK.n++; col.copy(FILL[u.side] || FILL.u).lerp(GRY, capd);
        const ab = CV.flipTop ? (Q.ab || 0) : 0, bfx = ab > 0.5 ? -fx : fx, bfy = ab > 0.5 ? -fy : fy, sL2 = onDk ? 0 : sL, sF2 = onDk ? 0 : sF;
        setM(KK.body, k, cx, y0, cy, bfx, bfy, WK, W, W * dS, ab > 0.5 ? -sL2 : sL2, ab > 0.5 ? -sF2 : sF2); KK.top.setColorAt(k, col); setOp(KK.body, k, oc);
        const plK = CV.bridgePull ? 1 + (CV.bridgePull - 1) * (Q.br || 0) : 1; if (CV.bridgePull) { KK.body.geometry.attributes.iPl.array[k] = plK; KK.top.geometry.attributes.iPl.array[k] = plK; }
        if (A2) KK.body.setColorAt(k, ec.copy(WALL[u.side] || WALL.u).lerp(GRY, capd)); else KK.body.setColorAt(k, col);
        setM(KK.top, k, cx, y0, cy, fx, fy, WK, W, W * dS, sL2, sF2); setOp(KK.top, k, ab < 0.999 ? oc : 0);
        if (KK.topF && ab > 0.001) { const kf = KK.nf++; setM(KK.topF, kf, cx, y0, cy, -fx, -fy, WK, W, W * dS, -sL2, -sF2); KK.topF.setColorAt(kf, col); setOp(KK.topF, kf, oc * ab); if (CV.bridgePull) KK.topF.geometry.attributes.iPl.array[kf] = plK; Q._kf = kf; } else Q._kf = -1;
        if (A2) { ec.copy(INKC).lerp(FILL[u.side] || FILL.u, capd); let eW = ePx;
          if (A3 && o.proj) { const hT = hb + CV.h * W, a1 = o.proj(cx + px * WK / 2, cy + py * WK / 2, hT - H(cx + px * WK / 2, cy + py * WK / 2)), a2 = o.proj(cx - px * WK / 2, cy - py * WK / 2, hT - H(cx - px * WK / 2, cy - py * WK / 2));
            eW = clamp(ePx + (Math.hypot(a1.x - a2.x, a1.y - a2.y) - 70) * 0.015, ePx, CV.edgeMax); }   // A3: 1.8 px on the wide shot -> ~3 px on the close camera
          const pxw = lerp(eW, Math.max(eW, CV.capPx), capd);
          if (A3) { const cp = col.copy(PLT[u.side] || PLT.u).lerp(CPL, capd); KK.top.geometry.attributes.iPlt.array.set([cp.r, cp.g, cp.b], k * 3); const cs = col.copy(STR[u.side] || STR.u).lerp(CST, capd); KK.top.geometry.attributes.iStr.array.set([cs.r, cs.g, cs.b], k * 3); col.copy(FILL[u.side] || FILL.u).lerp(GRY, capd); }
          for (const m of [KK.body, KK.top]) { m.geometry.attributes.iEdge.array.set([ec.r, ec.g, ec.b, pxw], k * 4);
            const sx2 = -SUNG[0], sy2 = -SUNG[1]; m.geometry.attributes.iSun.array.set([sx2 * px + sy2 * py, sx2 * fx + sy2 * fy], k * 2); }
          if (Q._kf >= 0) { const g2 = KK.topF.geometry.attributes, kf = Q._kf, sx2 = -SUNG[0], sy2 = -SUNG[1]; g2.iEdge.array.set([ec.r, ec.g, ec.b, pxw], kf * 4); g2.iSun.array.set([-(sx2 * px + sy2 * py), -(sx2 * fx + sy2 * fy)], kf * 2);
            g2.iPlt.array.set(KK.top.geometry.attributes.iPlt.array.subarray(k * 3, k * 3 + 3), kf * 3); g2.iStr.array.set(KK.top.geometry.attributes.iStr.array.subarray(k * 3, k * 3 + 3), kf * 3); }
          setM(KK.ao, k, cx, (CV.aoPull ? y0 - S.lift : hb) + 0.008 * ts, cy, fx, fy, WK + W * (KK.qw - 1), 1, W * (KK.qd - KK.dk + KK.dk * dS)); setOp(KK.ao, k, CV.ao * oc); }
        else {   // contact shadow / ambient occlusion: a soft dark rim just round the footprint; C adds a long soft drop shadow away from the sun
          setM(shadows, ns, bx, hb + 0.01 * ts, by, fx, fy, W * 1.1 + 0.06 * ts, 1, Dd * 1.45 + 0.06 * ts); setOp(shadows, ns++, CV.ao * oc);
          if (CV.drop) { const dd = W * 0.09; setM(shadows, ns, bx + SUNG[0] * dd, hb + 0.009 * ts, by + SUNG[1] * dd, fx, fy, W * 1.16 + 0.1 * ts, 1, Dd * 1.9 + 0.1 * ts); setOp(shadows, ns++, CV.drop * oc); } }
        if (pen) { const la = -0.42 * W, lb = -(Dd / 2 - 0.03 * W), x = bx + px * la + fx * lb, y = by + py * la + fy * lb, sw = 1 + 0.08 * Math.sin(t * 4.3 + seed);
          setM(pen.pole, np, x, y0 + CV.h * W * 0.9, y, fx, fy, W, W, W); setOp(pen.pole, np, oc);
          setM(pen.flag, np, x, y0 + CV.h * W * 0.9, y, fx, fy, W * sw, W, W); pen.flag.setColorAt(np, col.copy(FILL[u.side] || FILL.u).lerp(new THREE.Color(0xffffff), 0.25).lerp(GRY, capd)); setOp(pen.flag, np++, oc); } }
      // the men only exist while the counter breaks ranks (the v13/v14 crossing, unchanged): they appear in its footprint as it dissolves
      if (isArt || st <= 0.001 || mOn <= 0.001) continue;
      const Wl = D.bw, Dl = D.bd, sp = Wl * 0.92 / 12, fw = sp * 0.42, fd = sp * 0.4, fh = sp * 1.9, csp = Wl * 0.96 / 12;
      for (let j = 0; j < INF.length; j++) { const L = INF[j]; let la = L[0] * Wl * 0.96, lb = L[1] * Dl * 0.9;
        la += (hash(seed + j, 1) - 0.5) * 0.12 * sp; lb += (hash(seed + j, 2) - 0.5) * 0.12 * sp;
        let x, y, ma, crW = 0, mOp = 1;
        if (Q.cr) { const m = crossMan(Q.cr, j, la, lb, t); x = m[0]; y = m[1]; ma = m[2]; crW = m[3]; mOp = m[4]; }
        else { const row = Math.floor(j / 3), cc = j % 3, sw = Q.ew - (row - 11.5) * csp * 0.55 - (hash(seed + j, 11) - 0.5) * 0.02, g = along(Q.eq.path, Math.max(0, sw));
          const off = (cc - 1) * Math.min(csp * 1.1, 0.055) + (hash(seed + j, 12) - 0.5) * 0.015; x = g[0] - g[3] * off; y = g[1] + g[2] * off; ma = Math.atan2(g[3], g[2]); crW = 1; }
        const bob = crW * 0.12 * fh * Math.abs(Math.sin(t * 6 + j * 0.9 + seed)), hy = Math.max(Hs(x, y), deckTop(x, y)) + S.lift + bob;
        const jh = 0.93 + 0.14 * hash(seed + j, 6), ja = (hash(seed + j, 8) - 0.5) * 0.35, jfx = Math.cos(ma + ja), jfy = Math.sin(ma + ja);
        setM(coats, nf, x, hy, y, jfx, jfy, fw, fh * jh, fd); setM(pales, nf, x, hy, y, jfx, jfy, fw, fh * jh, fd);
        coats.setColorAt(nf, col.copy(FILL[u.side] || FILL.u).lerp(GRY, capd)); pales.setColorAt(nf, col.setHex(P.pale)); setOp(coats, nf, op * mOp * mOn); setOp(pales, nf, op * mOp * mOn); nf++; }
    }
    for (const m of ALL) m.count = 0;
    for (const k in K) { K[k].body.count = K[k].top.count = K[k].n; if (K[k].ao) K[k].ao.count = K[k].n; if (K[k].topF) K[k].topF.count = K[k].nf; }
    if (disc) disc.count = nd;
    if (pen) pen.pole.count = pen.flag.count = np;
    coats.count = pales.count = nf; shadows.count = ns; carriage.count = barrel.count = wheels.count = limber.count = ng;
    for (const m of ALL) { m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true; m.geometry.attributes.iOp.needsUpdate = true;
      if (m.geometry.attributes.iEdge) { m.geometry.attributes.iEdge.needsUpdate = true; m.geometry.attributes.iSun.needsUpdate = true; }
      if (m.geometry.attributes.iPl) m.geometry.attributes.iPl.needsUpdate = true;
      if (m.geometry.attributes.iPlt) { m.geometry.attributes.iPlt.needsUpdate = true; m.geometry.attributes.iStr.needsUpdate = true; } }
    // the motion checker measures what is drawn: A2 reports the counter's own footprint (frontage x wk, depth dk); guns keep the v14 nominal box
    // (0.62 x block width: the A3 x1.3 gun model is 0.39 x gk = 0.62 x W across the wheels, i.e. the same width; its ground disc is a flat decal)
    API.last = ST.map((q) => ({ k: blocks.indexOf(q.b), u: units.indexOf(q.u), x: q.x, y: q.y, hx: Math.cos(q.pa), hy: Math.sin(q.pa), sx: Math.cos(q.sa), sy: Math.sin(q.sa), str: q.st || 0,
      w: q.u.type === "art" ? q.D.bw * 0.62 : A2 ? lerp(q.D.bw * (CV.wk ?? 1), 0.18 * ts, CV.flipTop ? q.nw || 0 : 0) : q.f >= 0.5 ? q.D.cw : q.D.bw, d: q.u.type === "art" ? q.D.bd * 0.7 : A2 ? q.D.bw * CV.dk * (1 + 0.35 * (CV.flipTop ? q.nw || 0 : 0)) : q.f >= 0.5 ? q.D.cl : q.D.bd, f: q.f, c: q.c, e: q.e, op: q.op * (q.cr ? 1 - (q.st || 0) : 1), art: q.u.type === "art", cap: q.capd, ...(CV.flipTop && q._zh != null ? { zh: q._zh } : {}) }));
    return { figures: nf, blocks: ST.length, guns: ng };
  }
  const API = { update, blocks, base, queues: QUEUES, xv: XV, billboard: BOXV && !!o.camera, boxH: BOXL ? (x, y) => Hs(x, y) : null, meshes: { coats, pales, plateFill, plateRim, plateFront, shadows, carriage, barrel, wheels, limber, horses } };
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
  // v10 (critics on v9): billboard boxes get a clean mask (fill + symbol only; the ink border is drawn in the shader at a fixed ~2 px)
  // symbols: infantry X (kit), artillery = the kit's approved gun box (fx.js art_gun, viewBox 2 18 96 78), cavalry = one slash, engineers = the gear
  const mask2 = (sym, aspect) => { const W = 256, H = Math.max(48, Math.round(256 / Math.max(0.5, aspect))), c = document.createElement("canvas"); c.width = W; c.height = H; const g = c.getContext("2d");
    g.fillStyle = "#ff0000"; g.fillRect(0, 0, W, H); g.fillStyle = "#00ff00"; g.strokeStyle = "#00ff00";
    const ix = W * 0.06, iy = H * 0.1;
    if (sym === "inf") { g.lineWidth = Math.min(W, H) * 0.075; g.lineCap = "butt"; g.beginPath(); g.moveTo(ix, iy); g.lineTo(W - ix, H - iy); g.moveTo(W - ix, iy); g.lineTo(ix, H - iy); g.stroke(); }
    else if (sym === "cav") { g.lineWidth = Math.min(W, H) * 0.075; g.beginPath(); g.moveTo(ix, H - iy); g.lineTo(W - ix, iy); g.stroke(); }
    else if (sym === "art") { const hh = H * 0.8, ww = hh * 96 / 78, sc = hh / 78; g.save(); g.translate((W - ww) / 2 - 2 * sc, (H - hh) / 2 - 18 * sc); g.scale(sc, sc);
      g.save(); g.translate(44, 50); g.rotate(-22 * Math.PI / 180); g.translate(-44, -50); g.beginPath(); g.roundRect ? g.roundRect(40, 31, 56, 8, 3) : g.rect(40, 31, 56, 8); g.fill(); g.restore();
      g.fill(new Path2D("M30 42 L52 36 L56 52 L34 58 Z")); g.lineWidth = 6; g.beginPath(); g.arc(36, 66, 13, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.arc(36, 66, 3.5, 0, Math.PI * 2); g.fill(); g.fill(new Path2D("M33 60 L6 84 L12 89 L40 66 Z")); g.restore(); }
    else if (sym === "eng") { const r = H * 0.26; g.save(); g.translate(W / 2, H / 2); g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.fill();
      for (let k = 0; k < 8; k++) { g.save(); g.rotate(k * Math.PI / 4); g.fillRect(-r * 0.25, -r * 1.42, r * 0.5, r * 0.55); g.restore(); } g.fillStyle = "#ff0000"; g.beginPath(); g.arc(0, 0, r * 0.4, 0, Math.PI * 2); g.fill(); g.restore(); }
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
  const BB = !!(o.billboard && o.camera), BW = o.borderPx ?? 2.0;
  const boxMat2 = (sym, aspect) => withOp(new THREE.MeshBasicMaterial({ map: mask2(sym, aspect), transparent: true, depthTest: false, depthWrite: false, fog: true, side: THREE.DoubleSide }),
    (fs) => fs.replace("#include <map_fragment>", `vec4 mk = texture2D( map, vMapUv ); mk.rgb /= max(mk.r + mk.g, 1e-3);
#ifdef USE_COLOR
vec3 fillC = vColor;
#else
vec3 fillC = diffuse;
#endif
vec2 fw = max(fwidth(vMapUv), vec2(1e-5)); vec2 ed = min(vMapUv, 1.0 - vMapUv) / fw; float eb = 1.0 - smoothstep(${(BW - 0.6).toFixed(2)}, ${(BW + 0.6).toFixed(2)}, min(ed.x, ed.y));
float aa = smoothstep(0.0, 1.0, min(ed.x, ed.y));
diffuseColor.rgb = mix(mk.r * fillC + mk.g * uCream, uInk, eb); diffuseColor.a *= aa;`).replace("#include <color_fragment>", ""));
  const boxMat2k = (sym, aspect) => { const m = boxMat2(sym, aspect); m.customProgramCacheKey = () => "box3dbb"; return m; };
  const AS = o.aspect || {};
  const inf = mkIM(BB ? boxMat2k("inf", AS.inf ?? 2.33) : boxMat("inf"), 3.1), art = mkIM(BB ? boxMat2k("art", AS.art ?? 1.31) : boxMat("art"), 3.1);
  const cav = BB ? mkIM(boxMat2k("cav", AS.cav ?? 2.33), 3.1) : null, eng = BB ? mkIM(boxMat2k("eng", AS.eng ?? 2.33), 3.1) : null;
  const shd = mkIM(withOp(new THREE.MeshBasicMaterial({ color: 0x0b0a08, map: shadowTex, transparent: true, opacity: o.shadowA ?? (o.billboard ? 0.25 : 0.42), depthTest: false, depthWrite: false, fog: true, side: THREE.DoubleSide })), 3.0);
  for (const m of [inf, art, cav, eng]) if (m) m.setColorAt(0, new THREE.Color());
  const M4 = new THREE.Matrix4(), C = new THREE.Color(), lift = o.lift ?? 0.03, shOff = o.shadowOff ?? 0.075;
  // list: [{x, y, fx, fy, bw, bd, art, op, color: '#rrggbb' | THREE.Color, h}] (map plane, fx/fy = facing, bw along the line, bd along the facing)
  const VR = new THREE.Vector3(), VU = new THREE.Vector3(), VF = new THREE.Vector3(), Q0 = new THREE.Vector3();
  function setBB(list) {   // v10: each box a clean screen-plane rectangle (no shear), turned to its heading's on-screen direction
    const cam = o.camera; cam.updateMatrixWorld(); VR.set(1, 0, 0).applyQuaternion(cam.quaternion); VU.set(0, 1, 0).applyQuaternion(cam.quaternion); VF.set(0, 0, 1).applyQuaternion(cam.quaternion);
    const tanH = Math.tan((cam.fov * Math.PI) / 360), HPX = o.screenH ?? 1080, KT = o.tiltK ?? 0.8, C = { inf: 0, art: 0, cav: 0, eng: 0 }; let ns = 0;
    for (const b of list) { if (b.op <= 0.002) continue;
      const m = b.sym === "art" ? art : b.sym === "cav" && cav ? cav : b.sym === "eng" && eng ? eng : inf, key = m === art ? "art" : m === cav ? "cav" : m === eng ? "eng" : "inf", k = C[key]++;
      const y = b.h + lift, dxw = b.fx, dzw = b.fy, sx = dxw * VR.x + dzw * VR.z, sy = dxw * VU.x + dzw * VU.z, th = Math.atan2(sy, sx), c = Math.cos(th), s = Math.sin(th);
      const Nx = VR.x * c + VU.x * s, Ny = VR.y * c + VU.y * s, Nz = VR.z * c + VU.z * s, Lx = -VR.x * s + VU.x * c, Ly = -VR.y * s + VU.y * c, Lz = -VR.z * s + VU.z * c, bd = b.bd * KT;
      M4.set(Lx * b.bw, VF.x, -Nx * bd, b.x, Ly * b.bw, VF.y, -Ny * bd, y, Lz * b.bw, VF.z, -Nz * bd, b.y, 0, 0, 0, 1); m.setMatrixAt(k, M4);
      m.setColorAt(k, b.color.isColor ? b.color : C0.setStyle(b.color)); m.geometry.attributes.iOp.array[k] = b.op;
      Q0.set(b.x, y, b.y); const dist = Q0.distanceTo(cam.position), wpp = 2 * tanH * dist / HPX, ox = (VR.x - VU.x) * 3 * wpp, oy = (VR.y - VU.y) * 3 * wpp, oz = (VR.z - VU.z) * 3 * wpp, gw = 4 * wpp;
      M4.set(Lx * (b.bw + gw), VF.x, -Nx * (bd + gw), b.x + ox, Ly * (b.bw + gw), VF.y, -Ny * (bd + gw), y + oy, Lz * (b.bw + gw), VF.z, -Nz * (bd + gw), b.y + oz, 0, 0, 0, 1); shd.setMatrixAt(ns, M4);
      shd.geometry.attributes.iOp.array[ns++] = b.op; }
    inf.count = C.inf; art.count = C.art; if (cav) cav.count = C.cav; if (eng) eng.count = C.eng; shd.count = ns;
    for (const m of [inf, art, cav, eng, shd]) if (m) { m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true; m.geometry.attributes.iOp.needsUpdate = true; } }
  const C0 = new THREE.Color();
  function set(list) {
    if (BB) return setBB(list);
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
    const A = { pts, glow: mk(10.15, 0xf2f4f0, 0.16), glow2: mk(10.14, 0xf2f4f0, 0.07), glow3: mk(10.13, 0xf2f4f0, 0.04), out: mk(10.2, 0x0e0c08, 0.45), rim: mk(10.25, rim, 1), body: mk(10.3, color, 1) }; arrows.push(A); return A; }   // v10: the pale edge fades out in three steps (no hard white rim)
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
    const vis = op > 0.002 && k > 0.001; A.glow.visible = A.out.visible = A.rim.visible = A.body.visible = vis; if (A.glow2) A.glow2.visible = A.glow3.visible = vis; if (!vis) return;
    if (A.gm) { A.glow.material.opacity = 0.12 * op; A.out.material.opacity = 0.6 * op; A.rim.material.opacity = 0.3 * op; A.body.material.opacity = 0.8 * op; }
    else { A.glow.material.opacity = 0.09 * op; A.glow2.material.opacity = 0.06 * op; A.glow3.material.opacity = 0.04 * op; A.out.material.opacity = 0.45 * op; A.rim.material.opacity = op; A.body.material.opacity = op; }
    const pts = A.pts, seg = []; let L = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; }
    // round 2 (critic A S06 63 s): while the drawn length is shorter than ~2 heads, the head grows with it (no lone arrowhead before its shaft)
    const gk = Math.min(1, k * L / (w * 4.2)), hl = w * 2.1 * gk, hw = w * 1.5 * gk, end = Math.max(0, k * L - hl), P = [];   // the shaft stops where the head starts
    const at = (s) => { let i = 0; while (i < seg.length - 1 && s > seg[i]) { s -= seg[i]; i++; } const f = seg[i] ? Math.min(1, s / seg[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]; };
    const n = Math.max(2, Math.min(N, Math.ceil(end / 0.08) + 1)); for (let i = 0; i < n; i++) P.push(at(end * i / (n - 1)));
    if (end < 1e-3) { const d = at(Math.min(L, 0.01)); P[1] = [P[0][0] + (d[0] - P[0][0]) * 0.01 + 1e-4, P[0][1] + (d[1] - P[0][1]) * 0.01]; }
    const HS = smoothH(P);
    if (A.gm) { const sh = [0, 0]; fill(A.glow, P, w, hl, hw, w * 0.18, HS, sh); fill(A.out, P, w, hl, hw, w * 0.07, HS); fill(A.rim, P, w, hl, hw, w * 0.0, HS); fill(A.body, P, w, hl, hw, -w * 0.09, HS); return; }
    fill(A.glow, P, w, hl, hw, 0.09, HS); fill(A.glow2, P, w, hl, hw, 0.12, HS); fill(A.glow3, P, w, hl, hw, 0.15, HS); fill(A.out, P, w, hl, hw, 0.07, HS); fill(A.rim, P, w, hl, hw, 0.045, HS); fill(A.body, P, w, hl, hw, 0, HS); }
  return { add, draw, arrows };
}
