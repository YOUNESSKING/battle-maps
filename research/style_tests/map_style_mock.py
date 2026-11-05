"""Style TEST (owner 2026-11-05: "can we copy this style of maps"): two mock frames on our Saratoga map data.
A = flat illustrated map (olive paper, white-edged light-blue rivers, grass tufts + pine clusters, serif labels, portrait cards with flags).
B = banner style (green textured map, rotated unit blocks with an X, commander banners on poles with portrait + name plate).
usage (from arnold/): python3 ../research/style_tests/map_style_mock.py  -> ../research/style_tests/style_A.jpg, style_B.jpg"""
import numpy as np, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance, ImageOps
from scipy import ndimage
W,H=1920,1080; rng=np.random.default_rng(4)
SER='/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf'
OUT='../research/style_tests/'
riv=np.asarray(Image.open('assets/media/saratoga_det_riv.png').resize((W,H),Image.BOX))[...,3]>25
big=np.asarray(Image.open('assets/media/saratoga_det_rivS.png').resize((W,H),Image.BOX))[...,3]>25
lab,n=ndimage.label(riv); sz=ndimage.sum(riv,lab,range(1,n+1)); riv=np.isin(lab,1+np.nonzero(sz>=900)[0])   # only the bigger streams, like the reference
creek=ndimage.binary_dilation(riv,iterations=1)
main=ndimage.binary_dilation(big,iterations=4)
water=creek|main
edge=ndimage.binary_dilation(water,iterations=3)&~water
def paper(rgb,amp=10):
    n=ndimage.gaussian_filter(rng.standard_normal((H,W)),1.2)*amp+ndimage.gaussian_filter(rng.standard_normal((H,W)),25)*amp*4
    a=np.zeros((H,W,3))+np.array(rgb,float); return np.clip(a+n[...,None],0,255)
def portrait_card(path,flag,name,col):
    p=Image.open(path).convert('RGBA'); p.thumbnail((110,130)); card=Image.new('RGBA',(120,170),(0,0,0,0)); d=ImageDraw.Draw(card)
    d.rectangle([0,28,119,169],fill=col+(255,),outline=(20,18,14,255),width=2)
    bg=Image.new('RGBA',(108,128),(225,215,190,255)); bg.alpha_composite(p,((108-p.width)//2,128-p.height)); card.paste(bg,(6,36))
    f=Image.open(flag).convert('RGBA').resize((70,40)); card.alpha_composite(f,(25,0))
    fn=ImageFont.truetype(SER,16); tw=d.textlength(name,font=fn); d.text(((120-tw)/2,148),name,font=fn,fill=(250,245,230))
    return card
# ---------------- A: flat illustrated ----------------
a=paper((158,153,98))
a[edge]=(238,240,236); a[water]=(176,203,214)
img=Image.fromarray(a.astype(np.uint8)).convert('RGBA'); d=ImageDraw.Draw(img)
def tuft(x,y,s=1.0):
    for k in range(5):
        dx=(k-2)*5*s; h=(10+rng.uniform(-3,6))*s; lean=rng.uniform(-3,3)*s
        d.line([(x+dx,y),(x+dx+lean,y-h)],fill=(52,48,30,255),width=2)
    d.line([(x-12*s,y),(x+12*s,y)],fill=(52,48,30,255),width=1)
def pines(x,y):
    for k in range(rng.integers(5,9)):
        px,py=x+rng.uniform(-22,22),y+rng.uniform(-18,18); s=rng.uniform(7,11)
        d.polygon([(px,py-s*1.6),(px-s*0.7,py+s*0.4),(px+s*0.7,py+s*0.4)],fill=(40,42,32,255))
dist=ndimage.distance_transform_edt(~water)
for _ in range(160):
    x,y=rng.uniform(40,W-40),rng.uniform(40,H-40)
    if dist[int(y),int(x)]<18: continue
    if rng.random()<0.8:
        for k in range(rng.integers(2,5)): tuft(x+rng.uniform(-30,30),y+rng.uniform(-20,20),rng.uniform(0.8,1.2))
    else: pines(x,y)
fl=ImageFont.truetype(SER,40); fs=ImageFont.truetype(SER,30)
def label(t,x,y,f=fs):
    d.text((x+2,y+2),t,font=f,fill=(30,28,20,200)); d.text((x,y),t,font=f,fill=(250,248,240,255))
d.text((W-470,22),"7 October 1777",font=fl,fill=(250,248,240,255),stroke_width=4,stroke_fill=(20,18,14,255))
ys,xs=np.nonzero(big); i=len(xs)//2; label("Hudson River",int(xs[i])+30,int(ys[i])-20)
img.alpha_composite(portrait_card('assets/media/arnold_head.png','assets/media/us_flag_13star.png','ARNOLD',(40,70,150)),(int(xs[i])-420,int(ys[i])-120))
img.alpha_composite(portrait_card('assets/media/burgoyne_head.png','assets/media/gb_flag_1707.png','BURGOYNE',(150,30,30)),(int(xs[i])-700,int(ys[i])-380))
d.text((30,H-50),"STYLE TEST A (flat illustrated) - not applied",font=ImageFont.truetype(SER,22),fill=(255,255,255,200))
img.convert('RGB').save(OUT+'style_A.jpg',quality=92)
# ---------------- B: banner style ----------------
relief=Image.open('assets/saratoga_hd_lift.jpg').convert('L').resize((W,H),Image.LANCZOS)
r=np.asarray(ImageOps.autocontrast(relief,cutoff=2)).astype(float)/255
g=np.stack([78+80*r,92+78*r,40+40*r],-1)   # muted olive green like the reference
g=g*(1+ndimage.gaussian_filter(rng.standard_normal((H,W)),2)[...,None]*0.05)
g[ndimage.binary_dilation(water,iterations=1)]=(70,95,95)
img=Image.fromarray(np.clip(g,0,255).astype(np.uint8)).convert('RGBA'); d=ImageDraw.Draw(img)
def block(cx,cy,ang,col):
    w,h=46,30; pts=[(-w/2,-h/2),(w/2,-h/2),(w/2,h/2),(-w/2,h/2)]
    ca,sa=math.cos(ang),math.sin(ang); P=[(cx+x*ca-y*sa,cy+x*sa+y*ca) for x,y in pts]
    d.polygon(P,fill=col,outline=(25,20,20,255)); d.line([P[0],P[2]],fill=(25,20,20,255),width=2); d.line([P[1],P[3]],fill=(25,20,20,255),width=2)
ang=math.radians(-62)
for k in range(10): block(760+k*24,240+k*58,ang+math.pi/2,(205,40,45,255))
for k in range(10): block(1030+k*24,240+k*58,ang+math.pi/2,(45,80,190,255))
def banner(cx,top,name,path,col,flag):
    d.line([(cx,top),(cx,top+520)],fill=(225,205,160,255),width=8)
    fl=Image.open(flag).convert('RGBA').resize((90,52)); img.alpha_composite(fl,(cx-45,top-40))
    fp=ImageFont.truetype('../cleburne/tools/oswald-latin-700-normal.ttf',34); tw=d.textlength(name,font=fp)
    d.rounded_rectangle([cx-tw/2-24,top+30,cx+tw/2+24,top+90],8,fill=(240,230,205,255),outline=(90,70,40,255),width=3); d.text((cx-tw/2,top+36),name,font=fp,fill=(40,30,20,255))
    d.line([(cx-110,top+110),(cx+110,top+110)],fill=(225,205,160,255),width=6)
    d.rectangle([cx-95,top+112,cx+95,top+372],fill=col)
    p=Image.open(path).convert('RGBA'); p.thumbnail((180,240)); img.alpha_composite(p,(cx-p.width//2,top+372-p.height))
    d.line([(cx-110,top+374),(cx+110,top+374)],fill=(225,205,160,255),width=6)
banner(420,230,'Burgoyne','assets/media/burgoyne_head.png',(130,25,35,255),'assets/media/gb_flag_1707.png')
banner(1520,230,'Arnold','assets/media/arnold_head.png',(30,45,100,255),'assets/media/us_flag_13star.png')
d.text((30,H-50),"STYLE TEST B (banner style) - not applied",font=ImageFont.truetype(SER,22),fill=(255,255,255,200))
img.convert('RGB').save(OUT+'style_B.jpg',quality=92)
print('ok')
