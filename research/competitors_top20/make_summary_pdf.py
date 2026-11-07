"""Build COMPETITOR_STUDY_SUMMARY.pdf from SUMMARY.md + the overview thumbnail sheets. Run from this folder."""
import re, os
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import Image, PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle
INK = colors.HexColor("#222222"); BLUE = colors.HexColor("#2c57b7"); EDGE = colors.HexColor("#bbbbbb"); HEAD = colors.HexColor("#e8eefb")
S = {"h1": ParagraphStyle("h1", fontName="Helvetica-Bold", fontSize=17, leading=21, textColor=BLUE, spaceAfter=6),
     "h2": ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=12.5, leading=16, textColor=INK, spaceBefore=9, spaceAfter=4),
     "body": ParagraphStyle("body", fontName="Helvetica", fontSize=8.8, leading=11.6, textColor=INK, spaceAfter=3),
     "bul": ParagraphStyle("bul", fontName="Helvetica", fontSize=8.8, leading=11.6, textColor=INK, leftIndent=10, bulletIndent=0, spaceAfter=2),
     "cell": ParagraphStyle("cell", fontName="Helvetica", fontSize=7.4, leading=9, textColor=INK),
     "cellb": ParagraphStyle("cellb", fontName="Helvetica-Bold", fontSize=7.4, leading=9, textColor=INK)}
def fix(t):
    t = t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t); t = re.sub(r"`(.+?)`", r"<font face='Courier'>\1</font>", t)
    for a, b in (("—", "-"), ("→", "->"), ("≈", "~"), ("≥", ">="), ("“", '"'), ("”", '"'), ("’", "'")): t = t.replace(a, b)
    return t.encode("latin-1", "replace").decode("latin-1")
def img(p, w):
    from PIL import Image as PI
    iw, ih = PI.open(p).size; h = w * ih / iw
    if h > 172: w = w * 172 / h; h = 172
    return Image(p, width=w * mm, height=h * mm)
def table(rows, widths):
    data = [[Paragraph(fix(c.strip()), S["cellb" if r == 0 else "cell"]) for c in row] for r, row in enumerate(rows)]
    t = Table(data, colWidths=widths, repeatRows=1)
    t.setStyle(TableStyle([("GRID", (0, 0), (-1, -1), 0.3, EDGE), ("VALIGN", (0, 0), (-1, -1), "TOP"), ("BACKGROUND", (0, 0), (-1, 0), HEAD),
                           ("LEFTPADDING", (0, 0), (-1, -1), 3), ("RIGHTPADDING", (0, 0), (-1, -1), 3), ("TOPPADDING", (0, 0), (-1, -1), 2), ("BOTTOMPADDING", (0, 0), (-1, -1), 2)]))
    return t
lines = open("SUMMARY.md").read().split("\n"); story = []; i = 0; W = landscape(A4)[0] - 24 * mm
while i < len(lines):
    l = lines[i]
    if l.startswith("# "): story.append(Paragraph(fix(l[2:]), S["h1"]))
    elif l.startswith("## "):
        if "at a glance" in l: story.append(PageBreak())
        story.append(Paragraph(fix(l[3:]), S["h2"]))
        if "at a glance" in l: pass
    elif l.startswith("|"):
        rows = []
        while i < len(lines) and lines[i].startswith("|"):
            if not re.match(r"^\|[\s\-|]+\|$", lines[i]): rows.append(lines[i].strip().strip("|").split("|"))
            i += 1
        n = len(rows[0]); w = W / n
        ws = [W * x for x in ([0.035, 0.13, 0.05, 0.07, 0.17, 0.27, 0.275] if n == 7 else [1 / n] * n)]
        story.append(table(rows, ws)); story.append(Spacer(1, 4)); continue
    elif l.startswith("- ") or re.match(r"^\d+\. ", l): story.append(Paragraph(fix(re.sub(r"^(- |\d+\. )", "", l)), S["bul"], bulletText=("-" if l.startswith("- ") else l.split(".")[0] + ".")))
    elif l.strip(): story.append(Paragraph(fix(l), S["body"]))
    i += 1
story.append(PageBreak()); story.append(Paragraph("Overview: the top 3 thumbnails of each channel (views in M under each)", S["h2"])); story.append(img("thumbs/ALL_top3_per_channel.jpg", 255))
if os.path.exists("thumbs/commandersandtactics_sheet.jpg"):
    story.append(PageBreak()); story.append(Paragraph("Channel 21: Commanders and Tactics (our nearest rival), 9 long videos", S["h2"])); story.append(img("thumbs/commandersandtactics_sheet.jpg", 230))
def pg(c, d):
    c.saveState(); c.setFont("Helvetica", 7.5); c.setFillColor(colors.HexColor("#888888")); c.drawString(12 * mm, 7 * mm, "battle-maps - top-20 war-history competitor study, 2026-11-07"); c.drawRightString(landscape(A4)[0] - 12 * mm, 7 * mm, str(d.page)); c.restoreState()
SimpleDocTemplate("COMPETITOR_STUDY_SUMMARY.pdf", pagesize=landscape(A4), leftMargin=12 * mm, rightMargin=12 * mm, topMargin=11 * mm, bottomMargin=13 * mm, title="Competitor study summary").build(story, onFirstPage=pg, onLaterPages=pg)
print("ok")
