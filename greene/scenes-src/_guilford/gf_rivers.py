import shapefile, math, json
src = {'nena/ne_10m_rivers_north_america': ['Dan', 'Deep', 'Cape Fear', 'Tar', 'Neuse', 'York', 'Meherrin', 'Nottoway'],
       'nerl/ne_10m_rivers_lake_centerlines': ['Roanoke', 'Haw', 'Cape Fear', 'Yadkin', 'Great Pee Dee', 'James']}
segs = {}
for f, names in src.items():
    r = shapefile.Reader(f); flds = [x[0] for x in r.fields[1:]]; i = flds.index('name')
    for sr in r.iterShapeRecords():
        n = sr.record[i]
        if n in names and sr.shape.points:
            b = sr.shape.bbox
            if b[2] > -84 and b[0] < -75 and b[3] > 33 and b[1] < 39.5:
                parts = list(sr.shape.parts) + [len(sr.shape.points)]
                for a, c in zip(parts[:-1], parts[1:]):
                    segs.setdefault(n, []).append(sr.shape.points[a:c])
def chain(segs):
    segs = [list(s) for s in segs]
    d = lambda a, b: math.hypot(a[0]-b[0], a[1]-b[1])
    best = None
    for s in segs:
        for rev in (False, True):
            ss = s[::-1] if rev else s
            m = min([d(ss[0], p) for o in segs if o is not s for p in (o[0], o[-1])] or [9])
            if best is None or m > best[0]: best = (m, ss, s)
    line = list(best[1]); rest = [s for s in segs if s is not best[2]]
    while rest:
        e = line[-1]
        c1 = min(((d(e, s[0]), s, False) for s in rest), key=lambda x: x[0])
        c2 = min(((d(e, s[-1]), s, True) for s in rest), key=lambda x: x[0])
        c = c1 if c1[0] <= c2[0] else c2
        line += (c[1][::-1] if c[2] else c[1]); rest.remove(c[1])
    return line
maps = {'region': (9, 35260, 50502), 'south': (8, 16946, 24947)}
out = {}
for k, (z, ox, oy) in maps.items():
    n = 256 * 2 ** z
    G = lambda lat, lon: ((lon + 180) / 360 * n - ox, (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n - oy)
    out[k] = {}
    for name, ss in segs.items():
        line = chain(ss)
        px = [G(p[1], p[0]) for p in line]
        step = 14 if z == 9 else 9
        s = [px[0]]
        for p in px[1:]:
            if math.hypot(p[0]-s[-1][0], p[1]-s[-1][1]) >= step: s.append(p)
        s.append(px[-1])
        out[k][name] = [[round(a), round(b)] for a, b in s]
        print(k, name, len(ss), len(s), out[k][name][0], out[k][name][-1])
json.dump(out, open('gf_rivers.json', 'w'), separators=(',', ':'))
