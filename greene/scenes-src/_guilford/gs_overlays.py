import math, numpy as np
from PIL import Image, ImageDraw, ImageFilter
A="/home/user/battle-maps/greene/assets/"
O=(16709,25369)
def G(lat,lon):
    n=256*2**8; r=math.radians(lat)
    return ((lon+180)/360*n-O[0],(1-math.asinh(math.tan(r))/math.pi)/2*n-O[1])
base=np.asarray(Image.open(A+"greene_south.jpg"),float)
land=(base[...,0]>base[...,2]+12)
landm=Image.fromarray((land*255).astype(np.uint8)).filter(ImageFilter.MaxFilter(3))
W,H=2880,1620
# British-held SC + GA tint
poly=[(30.62,-84.86),(30.7,-84.87),(31.1,-85.0),(32.0,-85.06),(32.8,-85.18),(34.99,-85.61),(35.0,-84.32),(35.0,-83.11),(35.2,-83.11),(35.17,-82.3),(35.2,-81.04),(35.15,-80.93),(34.81,-79.67),(33.85,-78.54),(33.6,-78.0),(30.5,-80.5),(30.55,-82.0)]
m=Image.new("L",(W,H),0); ImageDraw.Draw(m).polygon([G(*p) for p in poly],fill=255)
m=Image.fromarray(np.minimum(np.asarray(m),np.asarray(landm))).filter(ImageFilter.GaussianBlur(2))
tint=Image.new("RGBA",(W,H),(196,18,31,0)); tint.putalpha(m.point(lambda v:int(v*0.30)))
# border of the tint
edge=Image.fromarray(np.asarray(m.filter(ImageFilter.MaxFilter(7))).astype(int).__sub__(np.asarray(m.filter(ImageFilter.MinFilter(7))).astype(int)).clip(0,255).astype(np.uint8))
t2=Image.new("RGBA",(W,H),(196,18,31,0)); t2.putalpha(edge.point(lambda v:int(v*0.8)))
tint.alpha_composite(t2); tint.save(A+"gs_brit.png")
# state borders, dashed
lines=[[(36.55,-75.87),(36.54,-81.68),(36.6,-83.68),(36.62,-88.2)],
 [(36.59,-81.68),(36.34,-81.73),(36.1,-82.05),(35.95,-82.6),(35.75,-83.1),(35.52,-83.9),(35.0,-84.32)],
 [(33.85,-78.54),(34.81,-79.67),(35.15,-80.93),(35.2,-81.04),(35.17,-82.3),(35.2,-83.11),(35.0,-83.11),(35.0,-84.32),(34.99,-85.61),(35.0,-88.2)],
 [(32.03,-80.88),(32.1,-81.12),(32.5,-81.3),(33.0,-81.5),(33.47,-81.95),(33.9,-82.4),(34.3,-82.75),(34.7,-83.1),(35.0,-83.11)],
 [(30.72,-81.45),(30.55,-82.0),(30.62,-84.86),(30.7,-84.87),(31.1,-85.0),(32.0,-85.06),(32.8,-85.18),(34.99,-85.61)]]
b=Image.new("L",(W,H),0); d=ImageDraw.Draw(b)
for ln in lines:
    pts=[G(*p) for p in ln]; acc=0
    for (x0,y0),(x1,y1) in zip(pts,pts[1:]):
        L=math.hypot(x1-x0,y1-y0); s=0
        while s<L:
            ph=(acc+s)%26
            if ph<16:
                e=min(s+16-ph,L); d.line([(x0+(x1-x0)*s/L,y0+(y1-y0)*s/L),(x0+(x1-x0)*e/L,y0+(y1-y0)*e/L)],fill=255,width=4); s=e
            else: s=min(s+26-ph,L)
        acc+=L
b=Image.fromarray(np.minimum(np.asarray(b),np.asarray(landm)))
out=Image.new("RGBA",(W,H),(60,48,34,0)); out.putalpha(b.point(lambda v:int(v*0.55))); out.save(A+"gs_borders.png")
print("ok")
