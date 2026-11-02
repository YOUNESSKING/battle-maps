import numpy as np, cv2, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter
D='/home/user/battle-maps/patton/youtube/thumb/'
FONT='/home/user/battle-maps/cleburne/tools/oswald-latin-700-normal.ttf'
src=Image.open('/tmp/agentC_snaps/at-29s.png').convert('RGB')
# crop 1564x880 from (0,200)
S=1280/1538
base=src.crop((330,215,1868,1080)).resize((1280,720),Image.LANCZOS)
def T(x,y): return ((x-330)*S, (y-215)*S)
# paint out BASTOGNE label + overlapping icon region via inpaint
a=np.array(base)
mask=np.zeros(a.shape[:2],np.uint8)
x0,y0=T(645,392); x1,y1=T(850,432)

mask=np.zeros(a.shape[:2],np.uint8); cv2.rectangle(mask,(0,140),(115,228),255,-1); a=cv2.inpaint(a,mask,9,cv2.INPAINT_TELEA)
# contrast / saturation boost
im=Image.fromarray(a)
from PIL import ImageEnhance
im=ImageEnhance.Contrast(im).enhance(1.25); im=ImageEnhance.Color(im).enhance(1.3)
base=im.convert('RGBA')
bx,by=T(840,415)   # Bastogne point
# glow helper
def glow(layer_fn,color,blur,alpha=255):
    L=Image.new('RGBA',(1280,720),(0,0,0,0)); layer_fn(ImageDraw.Draw(L)); return L
def bez(p0,p1,p2,p3,n=80):
    pts=[]
    for i in range(n+1):
        t=i/n;u=1-t
        pts.append((u**3*p0[0]+3*u*u*t*p1[0]+3*u*t*t*p2[0]+t**3*p3[0], u**3*p0[1]+3*u*u*t*p1[1]+3*u*t*t*p2[1]+t**3*p3[1]))
    return pts
# red ring around Bastogne (the German ring), thick, with gap where blue breaks through (south side)
cx,cy=bx-3,by+8
R=46
red=Image.new('RGBA',(1280,720),(0,0,0,0)); dr=ImageDraw.Draw(red)
for ang in range(-80,260,3):  # leave gap at south (around 90deg screen = down)
    pass
bbox=(cx-R,cy-R,cx+R,cy+R)
dr.arc(bbox,start=140,end=400-0,fill=(235,30,30,255),width=14)   # gap between 40..140 (south)
rg=red.filter(ImageFilter.GaussianBlur(10))
base=Image.alpha_composite(base,rg); base=Image.alpha_composite(base,rg); base=Image.alpha_composite(base,red)
# blue route: faint east start (Saar) -> hairpin -> north to ring
start=(300,505); east_end=(470,505)
path=bez((470,505),(580,505),(600,430),(cx+4,cy+R+30) ,60)
# smoother: east leg then curve north
path=[(110+i*3.2,520) for i in range(0,66)]
path+=bez((320,520),(400,520),(420,480),(418,400),40)[1:]
path+=bez((418,400),(416,330),(420,270),(cx+2,cy+R-6),40)[1:]
# faint dashed east portion
fa=Image.new('RGBA',(1280,720),(0,0,0,0)); df=ImageDraw.Draw(fa)
for i in range(0,len(path[:60])-4,6):
    df.line([path[i],path[i+3]],fill=(150,210,255,230),width=12)
# bold part from hairpin on
bold=path[40:]
def stroke(d,pts,col,w):
    d.line(pts,fill=col,width=w,joint='curve')
    for p in (pts[0],pts[-1]): d.ellipse((p[0]-w/2,p[1]-w/2,p[0]+w/2,p[1]+w/2),fill=col)
bl=Image.new('RGBA',(1280,720),(0,0,0,0)); db=ImageDraw.Draw(bl)
# widen toward the head
n=len(bold)
for i in range(n-1):
    w=int(14+ (i/n)*8)
    db.line([bold[i],bold[i+1]],fill=(40,140,255,255),width=w)
    db.ellipse((bold[i][0]-w/2,bold[i][1]-w/2,bold[i][0]+w/2,bold[i][1]+w/2),fill=(40,140,255,255))
# arrowhead at end heading north
ex,ey=bold[-1]; dx,dy=bold[-1][0]-bold[-6][0],bold[-1][1]-bold[-6][1]; L=math.hypot(dx,dy); dx/=L;dy/=L
px,py=-dy,dx
tip=(ex+dx*34,ey+dy*34)
db.polygon([tip,(ex+px*32,ey+py*32),(ex-px*32,ey-py*32)],fill=(40,140,255,255))
white=Image.new('RGBA',(1280,720),(0,0,0,0)); dw=ImageDraw.Draw(white)
for i in range(n-1): dw.line([bold[i],bold[i+1]],fill=(200,230,255,230),width=4)
g=bl.filter(ImageFilter.GaussianBlur(14))
df.polygon([(112,500),(112,540),(70,520)][::-1] if False else [(40,520),(0,0),(0,0)],fill=None) if False else None
base=Image.alpha_composite(base,fa)
base=Image.alpha_composite(base,g);base=Image.alpha_composite(base,g)
base=Image.alpha_composite(base,bl);base=Image.alpha_composite(base,white)
# east-arrow head on faint start (attack east at the Saar) - arrow pointing east at (300..)
# vignette
vg=np.zeros((720,1280),np.float32)
yy,xx=np.mgrid[0:720,0:1280]; d=np.sqrt(((xx-560)/900)**2+((yy-330)/560)**2); vg=np.clip(d-0.55,0,1)*0.9
arr=np.array(base).astype(np.float32); arr[...,:3]*=(1-vg[...,None]*0.7); base=Image.fromarray(arr.astype(np.uint8)).convert('RGBA')
# portrait
pt=Image.open(D+'patton-thumb-MAP-broke-the-siege.jpg').convert('RGB').crop((820,0,1280,720)).resize((int(460*1.0),720))
pw,ph=pt.size
m=Image.new('L',(pw,ph),255); md=np.array(m).astype(np.float32)
fe=150
ramp=np.clip(np.arange(pw)/fe,0,1); md[:]=(ramp*255)[None,:]
m=Image.fromarray(md.astype(np.uint8))
px0=820
base.paste(pt,(px0,0),m)
# labels
def label(txt,xy,size=30,fg=(255,255,255),bg=(14,14,14,235),border=(230,200,120),anchor='lm'):
    f=ImageFont.truetype(FONT,size); L=Image.new('RGBA',(1280,720),(0,0,0,0)); d=ImageDraw.Draw(L)
    bb=d.textbbox(xy,txt,font=f,anchor=anchor); pad=9
    d.rectangle((bb[0]-pad,bb[1]-pad+2,bb[2]+pad,bb[3]+pad),fill=bg,outline=border,width=3)
    d.text(xy,txt,font=f,fill=fg,anchor=anchor); return L
base=Image.alpha_composite(base,label('BASTOGNE',(412,166),32,anchor='rm'))
base=Image.alpha_composite(base,label('ARLON',(385,350),28,anchor='rm'))
base=Image.alpha_composite(base,label('THIRD ARMY',(60,470),26,fg=(255,255,255),bg=(30,80,200,240),border=(150,200,255),anchor='lm'))
# banner
f=ImageFont.truetype(FONT,128)
txt='BROKE THE SIEGE'
bw=f.getlength(txt); 
top,bot=548,690
pts=[]
import random; random.seed(7)
x=0; 
upper=[(0,top)]; xs=list(range(0,int(bw)+130,22))
for x in xs: upper.append((x+10,top+random.choice([-6,0,5,10])))
tipx=xs[-1]+40
lower=[(x+10,bot+random.choice([-6,0,5,8])) for x in reversed(xs)]
poly=upper+[(tipx,(top+bot)//2)]+lower+[(0,bot)]
Bn=Image.new('RGBA',(1280,720),(0,0,0,0)); db=ImageDraw.Draw(Bn)
sh=Image.new('RGBA',(1280,720),(0,0,0,0)); ImageDraw.Draw(sh).polygon([(a+6,b+8) for a,b in poly],fill=(0,0,0,200)); sh=sh.filter(ImageFilter.GaussianBlur(8))
base=Image.alpha_composite(base,sh)
db.polygon(poly,fill=(196,18,28,255))
db.line(poly+[poly[0]],fill=(110,5,12,255),width=3)
base=Image.alpha_composite(base,Bn)
d=ImageDraw.Draw(base); ty=(top+bot)//2+6
d.text((46+4,ty+5),txt,font=f,fill=(60,0,0,255),anchor='lm')
d.text((46,ty),txt,font=f,fill=(250,244,228,255),anchor='lm')
out=base.convert('RGB')
out.save(D+'agentC/thumb_C.jpg',quality=94)
sm=out.resize((168,94),Image.LANCZOS)
card=Image.new('RGB',(200,120),(20,20,20)); card.paste(sm,(16,13)); card.save(D+'agentC/thumb_C_feed.jpg',quality=95)
print(bw, tipx)
