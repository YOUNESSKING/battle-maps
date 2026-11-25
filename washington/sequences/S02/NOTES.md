# S02 BACKGROUND: NEW YORK, 1776 (D 44.74 s): notes (author A)

## HAND-OVER (S02 last frame = S03 first camera)
S02 ends with a 0.9 s dissolve (at local 42.75 s) from the brooklyn close shot to the colonies wide map, then HOLDS this camera exactly
(two identical keys, 42.75 -> D 44.74; the last 0.6 s dissolve into S03):
```js
const BF = VX.place("Fulton Ferry landing (Brooklyn ferry)", "colonies");   // = [619.4, 285.3] in colonies (z9) units
{ region: "colonies", at: [BF[0], BF[1] + 4], dist: 260, tilt: 40, yaw: 0, fov: 30 }
```
S03 (author B): start keys[0] (t 0) on exactly this camera, then dive colonies -> brooklyn (`overTo` in brooklyn units).
Clouds on colonies in S02: `scatter: { seed: 3 }` with `keepClear: [[619, 285, 60, 1, 0.9]]` (use the same in S03 so the first frame matches).
Grade: `grade: { wide: { toe: 14, ct: 1.03, sat: 1.04 } }` (Jackson). Date plate at the end of S02: "27 August 1776" (day plate).
