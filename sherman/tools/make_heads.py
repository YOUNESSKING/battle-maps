#!/usr/bin/env python3
"""Square face crops (400x400 RGB) from meade/assets/media/<name>_src.jpg.
Box = (left, top, right, bottom) in source pixels. Run: python3 meade/tools/make_heads.py [name ...]"""
import sys
from PIL import Image
M = "/home/user/battle-maps/sherman/assets/media/"
BOXES = {
    "grant":      ("grant_src.jpg",      (195, 170, 475, 450)),
    "jackson":    ("jackson_src.jpg",    (180, 80, 1000, 900)),
    "banks":      ("banks_src.jpg",      (318, 200, 482, 364)),
    "fremont":    ("fremont_src.jpg",    (110, 190, 390, 470)),
    "shields":    ("shields_src.jpg",    (277, 300, 444, 466)),
    "pope":       ("pope_src.jpg",       (218, 141, 397, 320)),
    "hooker":     ("hooker_src.jpg",     (281, 204, 447, 370)),
    "howard":     ("howard_src.jpg",     (192, 230, 448, 486)),
    "lee":        ("lee_src.jpg",        (205, 154, 486, 435)),
    "longstreet": ("longstreet_src.jpg", (270, 351, 540, 621)),
    "mcdowell":   ("mcdowell_src.jpg",   (390, 284, 646, 540)),
    "lincoln":    ("lincoln_src.jpg",    (197, 243, 376, 422)),
    "meade":      ("meade_src.jpg",      (165, 190, 505, 530)),
    "burnside":   ("burnside_src.jpg",   (170, 235, 500, 565)),
    "franklin":   ("franklin_src.jpg",   (240, 225, 520, 505)),
    "birney":     ("birney_src.jpg",     (150, 250, 510, 610)),
    "gibbon":     ("gibbon_src.jpg",     (185, 225, 485, 525)),
    "reynolds":   ("reynolds_src.jpg",   (500, 195, 800, 495)),
    "sickles":    ("sickles_src.jpg",    (165, 200, 475, 510)),
    "hancock":    ("hancock_src.jpg",    (300, 130, 610, 440)),
    "warren":     ("warren_src.jpg",     (175, 200, 485, 510)),
    "hunt":       ("hunt_src.jpg",       (205, 95, 425, 315)),
    "sykes":      ("sykes_src.jpg",      (185, 135, 465, 415)),
    "sedgwick":   ("sedgwick_src.jpg",   (160, 205, 520, 565)),
    "butterfield":("butterfield_src.jpg",(180, 110, 510, 440)),
    "vincent":    ("vincent_src.jpg",    (145, 230, 425, 510)),
    "pickett":    ("pickett_src.jpg",    (255, 200, 485, 430)),
    "trimble":    ("trimble_src.jpg",    (390, 165, 720, 495)),
    "aphill":     ("aphill_src.jpg",     (125, 205, 445, 525)),
    "armistead":  ("armistead_src.jpg",  (130, 70, 590, 530)),
    "gregg":      ("gregg_src.jpg",      (10, 15, 250, 255)),
    "pettigrew":  ("pettigrew_src.jpg",  (120, 50, 420, 350)),
    "early":      ("early_src.jpg",      (235, 275, 585, 625)),
}
for k in (sys.argv[1:] or BOXES):
    f, box = BOXES[k]
    im = Image.open(M + f).convert("RGB").crop(box).resize((400, 400), Image.LANCZOS)
    im.save(M + k + "_head.png")
    print(k, box)
