# Exclusion masks for the s12d_rt ground texture (vicksburg_w world box)

All PNGs are 5760x3240, 8-bit, 255 = keep the texture OFF here. 1 image px = 0.5 map px (GG.proj(10, 63513, 105473); map px 0..2880 x 0..1620), the same box as `grant/assets/vicksburg_w.jpg` / `vicksburg_w_close.jpg`.
At the test frame (camera s = 1.9) 1 image px is about 0.95 px on a 1080p screen.

- `rivers_w.png`, `rivers_close.png`: river / water pixels of each basemap (dilated 2 px).
- `woods_w.png`, `woods_close.png`: dark woods / ink / deep shade (luminance < 72) of each basemap.
- `roads.png`: every 1863 road (final routes incl. the dead-end fixes) with a 12 px corridor each side (covers the cleared woodland lanes), plus a 30 px circle round each bridge, ferry and landing. Same for both basemaps.
- `towns.png`: town sprites (1.5 x sprite radius). Same for both.
- `labels.png`: the town name labels' boxes (+ 20 px). Same for both.

Union for the texture: rivers_<key> | woods_<key> | roads | towns | labels.
Built by `masks.py` (scratch) from the s12d_rt build data (rt_meta.json + crossings.json). If roads change again, these will be rebuilt.
