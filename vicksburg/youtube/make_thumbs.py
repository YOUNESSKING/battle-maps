import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance, ImageOps, ImageChops
import numpy as np
H=os.path.dirname(os.path.abspath(__file__)); T=H+"/thumb"; W=T+"/work"
ANTON="/home/user/battle-maps/marion/tools/Anton-Regular.ttf"
head=Image.open("/home/user/battle-maps/grant/assets/media/grant_head.png").convert("RGBA")
def colour_face():
    g=ImageOps.autocontrast(head.convert("L"),cutoff=1); a=np.asarray(g,float)/255
    lo=np.array([30,20,18]);mid=np.array([196,132,100]);hi=np.array([255,226,200])
    out=np.where(a[...,None]<.5,lo+(mid-lo)*(a[...,None]*2),mid+(hi-mid)*((a[...,None]-.5)*2))
    im=Image.fromarray(out.astype('uint8'));im=ImageEnhance.Contrast(im).enhance(1.12)
    r=im.convert("RGBA");r.putalpha(head.split()[3]);return r
face=colour_face()
def bg(path,box,dark=.55,sat=.55,tint=(0,0,0)):
    im=Image.open(path).convert("RGB").crop(box).resize((1280,720),Image.LANCZOS)
    im=ImageEnhance.Color(im).enhance(sat);im=ImageEnhance.Brightness(im).enhance(dark);im=ImageEnhance.Contrast(im).enhance(1.15)
    return im
def vignette(im,left=True):
    a=np.zeros((720,1280));x=np.linspace(0,1,1280)[None,:]
    a=np.clip((.75-x)*1.1,0,.7) if left else np.clip(x*1.3-.1,0,.85); a=np.repeat(a,720,0)
    dark=Image.new("RGB",im.size,(8,8,10));return Image.composite(dark,im,Image.fromarray((a*255).astype('uint8')))
def place_face(im,x,h=860):
    s=h/400;f=face.resize((int(400*s),h),Image.LANCZOS).filter(ImageFilter.UnsharpMask(2,90,3))
    y=720-h+70   # bleeds off the bottom
    # soft dark shadow/rim behind head
    sh=Image.new("RGBA",im.size,(0,0,0,0));sh.paste((0,0,0,255),(x,y),f.split()[3]);sh=sh.filter(ImageFilter.GaussianBlur(22))
    sh.putalpha(sh.split()[3].point(lambda v:int(v*.8)));im=Image.alpha_composite(im.convert("RGBA"),sh)
    rim=f.split()[3].filter(ImageFilter.MaxFilter(9));r=Image.new("RGBA",im.size,(0,0,0,0));r.paste((255,255,255,255),(x,y),rim)
    im=Image.alpha_composite(im,r);im.alpha_composite(f,(x,y));return im.convert("RGB")
def text(im,lines,sizes,cols,y0=110,x=48):
    d=ImageDraw.Draw(im);y=y0
    for t,s,c in zip(lines,sizes,cols):
        F=ImageFont.truetype(ANTON,s)
        for dx,dy in [(-6,-6),(6,-6),(-6,6),(6,6),(0,8),(0,-8),(8,0),(-8,0)]:d.text((x+dx,y+dy),t,font=F,fill=(0,0,0))
        d.text((x+7,y+9),t,font=F,fill=(0,0,0)); d.text((x,y),t,font=F,fill=c); y+=int(s*1.02)
    return im
GOLD=(255,206,40);WHITE=(255,255,255);RED=(235,48,40)
def mk(name,src,box,lines,sizes,cols,dark,sat,fx=735,fh=620):
    im=vignette(bg(W+"/"+src,box,dark,sat));im=place_face(im,fx,fh);im=text(im,lines,sizes,cols)
    im.save(f"{T}/{name}.jpg",quality=92);return im
A=mk("A_5battles","F_S09_4.png",(240,100,1220,651),["5 BATTLES","18 DAYS"],[158,158],[WHITE,GOLD],.8,.75)
B=mk("B_nosupply","F_S03_3.png",(330,80,1280,615),["NO SUPPLY","LINE"],[150,200],[WHITE,RED],.95,.9)
C=mk("C_split","F_S01_3.png",(330,0,1280,535),["SPLIT","IN TWO"],[210,210],[WHITE,GOLD],.9,.95)
# sheet
sh=Image.new("RGB",(1280+60,3*(720+50)+300),(24,24,26));d=ImageDraw.Draw(sh);f=ImageFont.truetype(ANTON,30)
y=20
for lab,im in [("A  5 BATTLES 18 DAYS  (main; title A / C)",A),("B  NO SUPPLY LINE  (title B)",B),("C  SPLIT IN TWO  (title A / C)",C)]:
    d.text((30,y),lab,font=f,fill=(230,230,230));sh.paste(im,(30,y+36));y+=720+50
d.text((30,y),"Feed size 168x94",font=f,fill=(230,230,230));x=30
for im in (A,B,C):sh.paste(im.resize((168,94),Image.LANCZOS),(x,y+40));x+=200
sh=sh.crop((0,0,1340,y+170));sh.save(T+"/sheet.jpg",quality=88)
for n in ("A_5battles","B_nosupply","C_split","sheet"):print(n,os.path.getsize(f"{T}/{n}.jpg")//1024,"KB")
