import json, math, sys
d=json.load(open(sys.argv[1]+'/crossings.json')); meta=json.load(open(sys.argv[1]+'/rt_meta.json'))
T={k:(t['c'],t['R_u']/meta['S']) for k,t in meta['towns'].items()}
paths=[(r['id'],i,p) for r in d['roads'] for i,p in enumerate(r['paths'])]
land=[(c['x'],c['y'],c['kind']) for c in d['crossings'] if c['kind'] in('landing','ferry')]
for rid,i,p in paths:
  for e in (p[0],p[-1]):
    x,y=e; why=None
    for k,(c,R) in T.items():
      if math.hypot(x-c[0],y-c[1])<R*1.2: why='town '+k
    if not why and (x<8 or y<8 or x>2872 or y>1612): why='map edge'
    if not why:
      for lx,ly,kd in land:
        if math.hypot(x-lx,y-ly)<16: why=kd
    if not why:
      for rid2,j,q in paths:
        if (rid2,j)==(rid,i): continue
        if min(math.hypot(x-a,y-b) for a,b in q)<4: why='joins '+rid2
    print('OK ' if why else 'DEAD', rid, i, (round(x),round(y)), why or '')
