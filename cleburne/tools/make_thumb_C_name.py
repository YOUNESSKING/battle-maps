import numpy as np, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
from scipy import ndimage
D='/tmp/claude-0/-home-user-battle-maps/425685c4-6657-5109-8b39-25dbef768324/scratchpad/fr/'
FONT='/home/user/battle-maps/cleburne/tools/oswald-latin-700-normal.ttf'
OUT=sys.argv[1]
W,H=1280,720
X0,Y0=260,195
# --- background: Tunnel Hill counterattack frame, warmed + brightened
bg=Image.open(D+'bg_th.png').convert('RGB').crop((X0,Y0,X0+1573,Y0+885)).resize((W,H),Image.LANCZOS)
a=np.asarray(bg).astype(np.float32)/255
lum=a.mean(2,keepdims=True)
warm=np.array([1.0,0.80,0.45])  # golden
mx=a.max(2,keepdims=True);mn=a.min(2,keepdims=True);sat=(mx-mn)/(mx+1e-3)
k=np.clip(1.6-sat*3.2,0,1)*0.68   # tint only the dull ground, keep markers/arrows/rivers vivid
a=(1-k)*a+k*(lum*warm*1.9)
a=np.clip((a-0.04)*1.25,0,1)
# vignette light: brighter centre-left, darker edges
yy,xx=np.mgrid[0:H,0:W]
v=1-0.35*(((xx-470)/900)**2+((yy-330)/560)**2)
a=np.clip(a*v[...,None],0,1)
bg=Image.fromarray((a*255).astype(np.uint8))
bg=ImageEnhance.Contrast(bg).enhance(1.1)
# right side warm glow behind portrait
glow=Image.new('L',(W,H),0); gd=ImageDraw.Draw(glow); gd.ellipse((780,-40,1360,640),fill=200); glow=glow.filter(ImageFilter.GaussianBlur(90))
bg=Image.composite(Image.new('RGB',(W,H),(255,196,110)),bg,glow)
# --- portrait cutout
cut=Image.open(D+'cut_isnet-general-use.png')
al=np.asarray(cut)[...,3]
m=al>60; m=ndimage.binary_fill_holes(ndimage.binary_closing(m,iterations=8))
lab,n=ndimage.label(m); sizes=ndimage.sum(m,lab,range(1,n+1)); m=lab==(1+int(np.argmax(sizes)))
alpha=Image.fromarray((m*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2.5))
rgb=cut.convert('RGB')
g=np.asarray(rgb.convert('L')).astype(np.float32)/255
g=np.clip((g-0.12)/0.78,0,1)**1.05      # stretch contrast (face pop)
# warm duotone: shadows deep brown-grey, mids skin, highlights cream
lo=np.array([24,20,20]);mid=np.array([178,138,108]);hi=np.array([252,238,214])
t=g[...,None]
col=np.where(t<0.5, lo+(mid-lo)*(t/0.5), mid+(hi-mid)*((t-0.5)/0.5))
por=Image.fromarray(col.astype(np.uint8))
por=ImageEnhance.Sharpness(por).enhance(1.6)
por.putalpha(alpha)
# head is at roughly x 680-1270, y 0-800 of crop (1760x2350); scale so head height ~380px
s=0.52
por=por.resize((int(por.width*s),int(por.height*s)),Image.LANCZOS)
px,py=W-int(1290*s), 10
# rim light / dark outline for separation
A=np.asarray(por)[...,3]
edge=Image.fromarray(A).filter(ImageFilter.MaxFilter(15)).filter(ImageFilter.GaussianBlur(10))
rim=Image.new('RGBA',por.size,(255,226,160,0)); rim.putalpha(edge)
canvas=bg.convert('RGBA')
sh=Image.new('RGBA',por.size,(0,0,0,0)); sh.putalpha(Image.fromarray(A).filter(ImageFilter.GaussianBlur(18)).point(lambda v:int(v*0.7)))
canvas.alpha_composite(sh,(px-18,py+12))
canvas.alpha_composite(rim,(px,py))
canvas.alpha_composite(por,(px,py))
# --- text
d=ImageDraw.Draw(canvas)
def stroked(txt,size,xy,fill,stroke=10,sc=(0,0,0)):
    f=ImageFont.truetype(FONT,size)
    sl=Image.new('RGBA',(W,H),(0,0,0,0)); sd=ImageDraw.Draw(sl)
    sd.text((xy[0]+8,xy[1]+10),txt,font=f,fill=(0,0,0,200),stroke_width=stroke,stroke_fill=(0,0,0,200))
    canvas.alpha_composite(sl.filter(ImageFilter.GaussianBlur(6)))
    d.text(xy,txt,font=f,fill=fill,stroke_width=stroke,stroke_fill=sc)
    return d.textbbox(xy,txt,font=f,stroke_width=stroke)
bb=stroked('CLEBURNE',224,(30,404),(255,214,64),stroke=12)
# red tag top-left
f=ImageFont.truetype(FONT,78); txt='TOP 3 MOVES'
tb=d.textbbox((0,0),txt,font=f); tw,th=tb[2]-tb[0],tb[3]-tb[1]
tag=Image.new('RGBA',(tw+56,th+44),(0,0,0,0)); td=ImageDraw.Draw(tag)
td.rectangle((0,0,tag.width,tag.height),fill=(196,24,24,255))
td.text((28-tb[0],22-tb[1]),txt,font=f,fill=(255,255,255))
tag=tag.rotate(2.5,expand=True,resample=Image.BICUBIC)
sh2=Image.new('RGBA',tag.size,(0,0,0,0)); sh2.putalpha(tag.split()[3].filter(ImageFilter.GaussianBlur(8)).point(lambda v:int(v*0.6)))
canvas.alpha_composite(sh2,(48,40)); canvas.alpha_composite(tag,(40,30))
canvas.convert('RGB').save(OUT,quality=93)
print('ok',bb)
