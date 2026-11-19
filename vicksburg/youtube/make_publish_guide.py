"""Build youtube/Marion-publishing-guide.pdf, same layout as grant/tools/make_publish_guide.py (LESSONS_PUBLISHING_AND_THUMBNAILS part 1). Run from marion/: python3 tools/make_publish_guide.py"""
import os, re
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import KeepTogether, Image, PageBreak, Paragraph, Preformatted, SimpleDocTemplate, Spacer, Table, TableStyle
os.chdir(os.path.dirname(os.path.abspath(__file__)))
pdfmetrics.registerFont(TTFont("Oswald", "/home/user/battle-maps/marion/tools/oswald-latin-700-normal.ttf"))
pdfmetrics.registerFont(TTFont("Elite", "/home/user/battle-maps/marion/tools/special-elite-latin-400-normal.ttf"))
INK, PAPER, BLUE, RED, EDGE = colors.HexColor("#2a241b"), colors.HexColor("#f4ecd8"), colors.HexColor("#2c57b7"), colors.HexColor("#bc2528"), colors.HexColor("#c9b48a")
S = {"cover": ParagraphStyle("cover", fontName="Oswald", fontSize=30, leading=36, textColor=INK, alignment=TA_CENTER),
     "coversub": ParagraphStyle("coversub", fontName="Elite", fontSize=12, leading=17, textColor=INK, alignment=TA_CENTER),
     "h1": ParagraphStyle("h1", fontName="Oswald", fontSize=20, leading=26, textColor=BLUE, spaceBefore=4, spaceAfter=8),
     "h2": ParagraphStyle("h2", fontName="Oswald", fontSize=13, leading=17, textColor=INK, spaceBefore=8, spaceAfter=4),
     "body": ParagraphStyle("body", fontName="Helvetica", fontSize=10.5, leading=15, textColor=INK, spaceAfter=6),
     "cell": ParagraphStyle("cell", fontName="Helvetica", fontSize=9, leading=11.5, textColor=INK),
     "cellb": ParagraphStyle("cellb", fontName="Helvetica-Bold", fontSize=9, leading=11.5, textColor=INK),
     "mono": ParagraphStyle("mono", fontName="Courier", fontSize=7.6, leading=9.6, textColor=INK),
     "warn": ParagraphStyle("warn", fontName="Helvetica", fontSize=10, leading=14, textColor=INK, backColor=colors.HexColor("#fbeceb"), borderColor=RED, borderWidth=0.8, borderPadding=7, spaceBefore=6, spaceAfter=10)}
P = lambda t, s="body": Paragraph(t, S[s])
bullets = lambda items: [P("&bull;&nbsp; " + i) for i in items]
def table(rows, widths):
    data = [[Paragraph(str(c), S["cellb" if r == 0 else "cell"]) for c in row] for r, row in enumerate(rows)]
    t = Table(data, colWidths=[w * mm for w in widths], repeatRows=1)
    t.setStyle(TableStyle([("GRID", (0, 0), (-1, -1), 0.4, EDGE), ("VALIGN", (0, 0), (-1, -1), "TOP"), ("BACKGROUND", (0, 0), (-1, 0), PAPER), ("LEFTPADDING", (0, 0), (-1, -1), 5), ("RIGHTPADDING", (0, 0), (-1, -1), 5)])); return t
def img(path, w):
    from PIL import Image as PI
    iw, ih = PI.open(path).size; return Image(path, width=w * mm, height=w * mm * ih / iw)
def page(c, d):
    c.saveState(); c.setFillColor(PAPER); c.rect(0, 0, A4[0], A4[1], fill=1, stroke=0); c.setFont("Helvetica", 8); c.setFillColor(colors.HexColor("#8a7f6a"))
    c.drawString(18 * mm, 10 * mm, "Vicksburg 1863  |  publishing guide"); c.drawRightString(A4[0] - 18 * mm, 10 * mm, str(d.page)); c.restoreState()

desc=open("description.txt").read().strip()
chapters=[l for l in desc.splitlines() if re.match(r"^\d+:\d\d\s",l)]
tags=open("tags.txt").read().strip()
TA,TB="thumb/vicksburg-v5-MAIN-BD-WRONG_WAY.jpg","thumb/vicksburg-v5-ALT-GM-WRONG_WAY.jpg"
TITLES=[("A","The Campaign That Split the Confederacy: 5 Battles in 18 Days | Vicksburg 1863","87","MAIN. 5 battles = Port Gibson, Raymond, Jackson, Champion Hill, Big Black, 30 Apr-17 May (Grant's Memoirs: five distinct battles)."),
("B","How Grant Took Vicksburg With No Supply Line | 1863","87","Test &amp; Compare (curiosity). Grant: cut loose from my base (the film notes wagon trains still followed for a time)."),
("C","Grant's Vicksburg Campaign: 5 Battles in 18 Days That Split the Confederacy","86","Test &amp; Compare (hybrid). Split the Confederacy = Mississippi opened (Vicksburg 4 Jul, Port Hudson 9 Jul).")]
story=[Spacer(1,18*mm),P("VICKSBURG 1863","cover"),P("5 BATTLES IN 18 DAYS","cover"),Spacer(1,4*mm),P("Publishing guide: everything you need to upload the finished video","coversub"),Spacer(1,8*mm),img(TA,150),Spacer(1,3*mm),
P("Main thumbnail (v5): WRONG WAY. (Back Door recipe, PACKAGING_GUIDE 0c). Same Grant portrait as our published Grant thumbnail; painted aerial of Vicksburg on its bluffs and the road east to Jackson made with AI (vidIQ); troops, arrow and tags are ours.","coversub"),PageBreak()]
story+=[P("1. The finished video","h1"),table([["Item","Details"],["Gofile link",__import__("os").environ.get("GOFILE","(added by the lead)")],["Final critic scores","Critic A (look vs Grand Maneuver) 7.2/10, Critic B (story + sync) 8.0/10, both: fit to publish (round 1 was 4.8 / 6.0)"],["Format","Vicksburg 1863, 3D campaign film (3D animated maps), chapters below"],["Voice","AI narration in the owner's own voice clone (Kokoro converted with owner_clone_test.mp3); 3 cloud dives (opening, Bruinsburg, Champion Hill)"]],[40,130]),Spacer(1,5*mm),P("Chapters","h2"),table([["Starts","Chapter"]]+[[c.split(" ",1)[0],c.split(" ",1)[1]] for c in chapters],[20,150])]
story+=[PageBreak(),P("2. Titles and thumbnails (Test &amp; Compare)","h1"),table([["","Title","vidIQ","Role / claim"]]+[[a,b,c,d] for a,b,c,d in TITLES],[8,78,12,72]),
P("Main: title A + thumbnail <b>MAIN 'WRONG WAY.'</b> (Back Door recipe). Test &amp; Compare: titles B and C, thumbnail <b>ALT 'WRONG WAY.' + 'THEN VICKSBURG FELL'</b> (Grand Maneuver recipe). The title states the result, the word gives the surprising how: viewers expect a general to march on the fortress; Grant marched EAST, away from Vicksburg, took Jackson, then turned back and shut the city in. v5 = owner feedback on v4 applied (published-Grant colours and portrait, new word); colour numbers in thumb/fixes_v5.md. Judge on CTR and impressions on days 1-3, SEPARATELY from retention at 0:30 and 1:00. Log the winner in research/CHANNEL_LOG.md.","warn"),
KeepTogether([P("MAIN: WRONG WAY. (Back Door recipe)","h2"),img(TA,150)]),KeepTogether([P("ALT: WRONG WAY. / THEN VICKSBURG FELL (Grand Maneuver recipe)","h2"),img(TB,150)]),
P("<b>Checked.</b> Words true (FACT_NOTES §19, WRONG WAY. row: Grant turned the whole army EAST toward Jackson, took it 14 May, then turned back west: Champion Hill 16 May, Big Black 17 May, Vicksburg invested 18-19 May; THEN VICKSBURG FELL = surrender 4 July 1863). WRONG WAY. flips the viewer's expectation, it does not claim the march was a mistake. MAIN: Vicksburg on its bluffs on the EAST bank of the Mississippi, the railroad east to Jackson; Jackson burning (Sherman burned its war industry 14-15 May); the Vicksburg fires illustrate the later siege. Pemberton's red between the towns, Grant's blue columns turning east, one arrow east and back into Vicksburg. ALT: map turned north up-right, Bruinsburg on the river, the arrow swings east (inland) before Vicksburg. Portraits: MAIN = the Grant of our published thumbnail (reused unchanged); ALT = AI oil repaint of LoC 2018666428 keeping the two-star strap. No flags, no painted soldiers. Words read at 168x94. AI disclosure: painted aerial (MAIN), Vicksburg vignette and the oil repaint (ALT).","warn"),KeepTogether([P("Side by side with the 3 locked references (full, 360 px, 168x94) and the v4 -> v5 strip","h2"),img("thumb/sheet_v5.jpg",165)]),KeepTogether([P("Sidebar mock: our MAIN among the top 'Vicksburg campaign' results","h2"),img("thumb/sidebar_v5.jpg",80)]),PageBreak()]
story+=[P("3. Description (copy and paste)","h1"),P("NO links (channel rule). Keep the sources and credits.","warn"),Preformatted(desc,S["mono"],maxLineLength=100),PageBreak()]
story+=[P("4. Upload settings","h1"),table([["Setting","Value"],["Tags",tags],["Category","Education"],["Audience","Not made for kids"],["Altered or synthetic content","Yes: AI voice narration; thumbnail images partly AI-made (painted aerial, Vicksburg vignette, oil repaint of the Grant photo on the ALT). Tick the box."],["Links","None in the description"],["Chapters","Automatic from the description (first at 0:00)"],["End screen","From the busiest video (Morgan) over the last ~20 s, plus subscribe"],["Schedule","Peak time; not right after a flop (DATA_RULES)"]],[45,125]),
P("Test &amp; Compare note","h2"),P("Upload with title A and the MAIN thumbnail (WRONG WAY., Back Door), then add the ALT (Grand Maneuver) (and titles B, C) in YouTube Test &amp; Compare. Let it finish, then log the winner, CTR and day 1-3 impressions per traffic source.","body"),
P("Owner reminders","h2"),*bullets(["Publish the finished <b>Sherman</b>, <b>Jackson</b> and <b>Meade</b> videos.","Fix three live titles missing a space: <b>\"TheSwamp\"</b>, <b>\"Confederacy'sWestern\"</b>, <b>\"theSouth\"</b>."]),
P("Upload checklist","h2"),*bullets(["Play the master once (sound, sync).","Upload; paste title A, description, tags; upload the MAIN thumbnail vicksburg-v5-MAIN-BD-WRONG_WAY.jpg (1280x720).","Tick altered/synthetic; add end screen; schedule; set up Test &amp; Compare."])]
SimpleDocTemplate("Vicksburg-publishing-guide.pdf",pagesize=A4,leftMargin=18*mm,rightMargin=18*mm,topMargin=16*mm,bottomMargin=18*mm,title="Vicksburg 1863 - publishing guide").build(story,onFirstPage=page,onLaterPages=page)
print("ok")
