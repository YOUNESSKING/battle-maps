"""Build the YouTube upload sheet PDF from youtube/youtube_metadata.md (format: see research/PACKAGING_GUIDE.md).

usage (from <name>/): python3 tools/make_upload_pdf.py "Daniel Morgan" Morgan
reads youtube/youtube_metadata.md + youtube/thumbnail*.jpg, writes youtube/<Short>-YouTube-upload.pdf
"""
import glob, re, sys
from xml.sax.saxutils import escape
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak

general, short = sys.argv[1], sys.argv[2]
s = open("youtube/youtube_metadata.md").read()
m = re.search(r"\*\*Locked title \(vidIQ (\d+)\):\*\* (.+)", s)
score, title = m.group(1), m.group(2).strip()
alts = [l[2:] for l in s.split("## Alternative titles (for Test & compare)\n", 1)[1].split("\n\n", 1)[0].strip().split("\n")]
desc = s.split("## Description\n", 1)[1].split("\n## Tags", 1)[0].strip().replace("📩 ", "")
tagline = s.split("## Tags (paste into YouTube's tag box)\n", 1)[1].split("\n", 1)[0]
checklist = [l for l in s.split("## Checklist", 1)[1].split("\n") if l.startswith("- [")]
video = re.search(r"\*\*Video:\*\* (.+)", s)

ss = getSampleStyleSheet()
H1 = ParagraphStyle("h1", parent=ss["Title"], fontSize=20, leading=24, textColor=colors.HexColor("#7a1414"))
H2 = ParagraphStyle("h2", parent=ss["Heading2"], fontSize=13, spaceBefore=8, textColor=colors.HexColor("#222222"))
B = ParagraphStyle("b", parent=ss["BodyText"], fontSize=9.5, leading=13)
SM = ParagraphStyle("s", parent=B, fontSize=8.5, leading=11, alignment=1)
BOX = ParagraphStyle("box", parent=B, backColor=colors.HexColor("#f3efe6"), borderColor=colors.HexColor("#c9bfa6"),
                     borderWidth=0.6, borderPadding=7, spaceBefore=4, spaceAfter=8)
box = lambda t: Paragraph(escape(t).replace("\n", "<br/>"), BOX)


def grid(rows, widths):
    t = Table(rows, colWidths=widths)
    t.setStyle(TableStyle([("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#c9bfa6")), ("VALIGN", (0, 0), (-1, -1), "TOP"),
                           ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#f3efe6"))]))
    return t


thumbs = sorted(glob.glob("youtube/thumbnail*.jpg"))
w = min(56, 170 / max(1, len(thumbs)) - 2) * mm
labels = ["A (main)" if f.endswith("thumbnail.jpg") else f.split("_")[-1][0] for f in thumbs]
tt = Table([[Image(f, w, w * 9 / 16) for f in thumbs],
            [Paragraph(f"{l}: {f.split('/')[-1].replace('.jpg', '.png')}", SM) for l, f in zip(labels, thumbs)]],
           colWidths=[w + 2 * mm] * len(thumbs))
settings = [["Category", "Education"], ["Audience", "No, it's not made for kids"], ["Language", "English"],
            ["Altered or synthetic content", "Yes: AI-generated narration voice (Kokoro TTS). Maps are animations; paintings are real historical artworks."],
            ["Licence", "Standard YouTube Licence"], ["Thumbnail test", "Studio → Test & compare: upload all thumbnail options"],
            ["Business email", "Replace [email to fill in] in the description before publishing"]]
st = [Paragraph(f"YouTube upload sheet: {general}", H1),
      Paragraph((video.group(1) + " · " if video else "") + "written with research/PACKAGING_GUIDE.md", B), Spacer(1, 6),
      tt, Paragraph(f"Title (locked, vidIQ score {score})", H2), box(title),
      Paragraph(f"{len(title)} of 100 characters.", B),
      Paragraph("Alternative titles (for Test & compare)", H2)] + [box(a) for a in alts] + [
      Paragraph("Upload settings", H2), grid([[Paragraph(f"<b>{a}</b>", B), Paragraph(escape(b), B)] for a, b in settings], [45 * mm, 129 * mm]),
      PageBreak(), Paragraph("Description (copy everything in the box)", H2), box(desc),
      Paragraph("Tags (paste into YouTube's tag box)", H2), box(tagline),
      Paragraph(f"{len(tagline.split(', '))} tags · {len(tagline)} of 500 characters.", B),
      Paragraph("Checklist (packaging guide §7)", H2)] + \
     [Paragraph(escape(l.replace("- [x]", "DONE ·").replace("- [ ]", "TO DO ·")), B) for l in checklist]
out = f"youtube/{short}-YouTube-upload.pdf"
SimpleDocTemplate(out, pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm, topMargin=14 * mm, bottomMargin=14 * mm,
                  title=f"YouTube upload sheet: {general}", author="battle-maps").build(st)
print("wrote", out)
