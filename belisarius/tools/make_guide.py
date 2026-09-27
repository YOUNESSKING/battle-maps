"""Build the Belisarius publishing guide (PDF) + a copy-paste YouTube description.

usage (from belisarius/): python3 tools/make_guide.py
writes build/Belisarius-publishing-guide.pdf and youtube_description.txt
"""
import json, os
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Image, KeepTogether, PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

pdfmetrics.registerFont(TTFont("Oswald", "tools/oswald-latin-700-normal.ttf"))
pdfmetrics.registerFont(TTFont("Elite", "tools/special-elite-latin-400-normal.ttf"))

INK, PAPER, BLUE, RED, EDGE = (colors.HexColor(c) for c in ("#2a241b", "#f4ecd8", "#2f5fa8", "#b3261e", "#c9b48a"))
S = {
    "cover": ParagraphStyle("cover", fontName="Oswald", fontSize=32, leading=38, textColor=INK, alignment=TA_CENTER),
    "coversub": ParagraphStyle("coversub", fontName="Elite", fontSize=14, leading=20, textColor=INK, alignment=TA_CENTER),
    "h1": ParagraphStyle("h1", fontName="Oswald", fontSize=22, leading=28, textColor=BLUE, spaceBefore=6, spaceAfter=8),
    "h2": ParagraphStyle("h2", fontName="Oswald", fontSize=14, leading=18, textColor=INK, spaceBefore=10, spaceAfter=4),
    "body": ParagraphStyle("body", fontName="Helvetica", fontSize=10.5, leading=15, textColor=INK, spaceAfter=6),
    "mono": ParagraphStyle("mono", fontName="Courier", fontSize=8.6, leading=11.5, textColor=INK, backColor=colors.HexColor("#f7f3ea"),
                           borderColor=EDGE, borderWidth=0.6, borderPadding=6, spaceBefore=4, spaceAfter=10),
    "cell": ParagraphStyle("cell", fontName="Helvetica", fontSize=9, leading=11.5, textColor=INK),
    "cellb": ParagraphStyle("cellb", fontName="Helvetica-Bold", fontSize=9, leading=11.5, textColor=INK),
    "tip": ParagraphStyle("tip", fontName="Helvetica", fontSize=10, leading=14, textColor=INK, backColor=colors.HexColor("#e9f0fa"),
                          borderColor=BLUE, borderWidth=0.8, borderPadding=7, spaceBefore=6, spaceAfter=10),
    "warn": ParagraphStyle("warn", fontName="Helvetica", fontSize=10, leading=14, textColor=INK, backColor=colors.HexColor("#fbeceb"),
                           borderColor=RED, borderWidth=0.8, borderPadding=7, spaceBefore=6, spaceAfter=10),
}
P = lambda t, s="body": Paragraph(t, S[s])
bullets = lambda items: [P("&bull;&nbsp; " + i) for i in items]
esc = lambda t: t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\n", "<br/>")


def table(rows, widths, head=True):
    data = [[Paragraph(str(c), S["cellb" if (head and r == 0) else "cell"]) for c in row] for r, row in enumerate(rows)]
    t = Table(data, colWidths=[w * mm for w in widths], repeatRows=1 if head else 0)
    st = [("GRID", (0, 0), (-1, -1), 0.4, EDGE), ("VALIGN", (0, 0), (-1, -1), "TOP"),
          ("LEFTPADDING", (0, 0), (-1, -1), 5), ("RIGHTPADDING", (0, 0), (-1, -1), 5),
          ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4)]
    if head:
        st.append(("BACKGROUND", (0, 0), (-1, 0), PAPER))
    t.setStyle(TableStyle(st))
    return t


TJ = json.load(open("audio/timing.json"))
T = TJ["paragraphs"]
tc = lambda s: f"{int(s // 60)}:{int(s % 60):02d}"
first = lambda key: next(p for p in T if p["tag"].startswith("MAP: " + key))["start"]
CH = [(0, "Intro: Rome besieged"), (first("dara-1"), "Move 1: Dara, the trench that was a trap"),
      (first("tricam-1"), "Move 2: Tricamarum, strike the head"), (first("rome-1"), "Move 3: The Siege of Rome"),
      (first("ending-ravenna"), "The crown he refused, and Belisarius's legacy")]
chapters = "\n".join(f"{tc(t)} {name}" for t, name in CH)
GOFILE = "https://gofile.io/d/Hat5cclk"

description = f"""How did one general keep beating armies twice his size? Belisarius, the "Last of the Romans", defeated the Persians at Dara, destroyed the Vandal kingdom at Tricamarum, and held Rome with about 5,000 men against the entire Gothic nation. These are his three greatest tactical moves, told with animated battle maps.

Chapters
{chapters}

Belisarius's method: Shape the battlefield. Strike what holds them together. Make time fight for you.

Which commander should I cover next? Tell me in the comments.

Sources
- Procopius, History of the Wars, Books I (Persian War), III-IV (Vandal War), V-VI (Gothic War)
- Ian Hughes, Belisarius: The Last Roman General (Pen & Sword, 2009)
- Peter Heather, Rome Resurgent: War and Empire in the Age of Justinian (OUP, 2018)
Ancient numbers are uncertain; where sources disagree the video gives a range (e.g. the Gothic army at Rome: 150,000 per Procopius, 20,000-30,000 per modern estimates).

Music
"Crusade" and "The Pyre" by Kevin MacLeod (incompetech.com)
Licensed under Creative Commons: By Attribution 4.0 License
http://creativecommons.org/licenses/by/4.0/

Images
- Mosaic of Justinian I, San Vitale, Ravenna: photo by José Luiz, CC BY-SA 4.0 (Wikimedia Commons); Yorck Project reproduction, public domain
- Sasanian drachm of Kavad I: CC BY 2.0 (Wikimedia Commons)
- Quarter siliqua of Witigis: CC BY-SA 2.5 (Wikimedia Commons)
- Jacques-Louis David, Belisarius Begging for Alms; Hermann Knackfuss, King Gelimer captured by Belisarius; Madrid Skylitzes miniatures; solidus of Justinian I (LACMA): public domain
Terrain: Mapzen / AWS Terrain Tiles (open data)

#Belisarius #ByzantineEmpire #MilitaryHistory"""
open("youtube_description.txt", "w").write(description + "\n")

tags = ("Belisarius, Belisarius tactics, Byzantine Empire, Eastern Roman Empire, Justinian, Battle of Dara, Battle of Tricamarum, "
        "Siege of Rome 537, Vandal War, Gothic War, Procopius, last of the Romans, ancient warfare, military history, "
        "battle maps, animated battle map, greatest generals, military tactics, Roman history documentary")


def on_page(c, doc):
    c.saveState()
    c.setFillColor(EDGE); c.rect(0, A4[1] - 8 * mm, A4[0], 8 * mm, fill=1, stroke=0)
    c.setFont("Oswald", 8); c.setFillColor(INK)
    c.drawString(15 * mm, 8 * mm, "BELISARIUS · PUBLISHING GUIDE")
    c.drawRightString(A4[0] - 15 * mm, 8 * mm, f"page {doc.page}")
    c.restoreState()


story = []
# ---------------- cover ----------------
story += [Spacer(1, 45 * mm), P("BELISARIUS'S TOP 3<br/>LEGENDARY TACTICAL MOVES", "cover"), Spacer(1, 8 * mm),
          P("Video #2 · publishing guide", "coversub"), Spacer(1, 4 * mm),
          P(f"Final cut v2 · {tc(TJ['duration'])} · 1080p · -15 LUFS", "coversub"), Spacer(1, 12 * mm)]
if os.path.exists("build/thumbnail.jpg"):
    story += [Image("build/thumbnail.jpg", width=150 * mm, height=84.4 * mm)]
story += [PageBreak()]

# ---------------- 1. what you have ----------------
story += [P("1 · What is finished", "h1"),
          table([["Item", "Status", "Where"],
                 ["Final video, 1080p master (1.26 GB) + 720p", "done (mix v2: music 22-27 dB under the voice, Crusade replaces Killing Time)", f"Download: {GOFILE}"],
                 ["Script, 2,656 words, 46 paragraphs", "done", "belisarius/script.md"],
                 ["Fact notes (Gemini corrections)", "done", "belisarius/FACTS.md"],
                 ["Voice (Kokoro am_michael, speed 1.0)", "done", "belisarius/audio/"],
                 ["14 animated map scenes", "rendered", "belisarius/scenes-src/*.js (renders not in git)"],
                 ["6 archive shots (mosaic, David, Knackfuss, Skylitzes, coin)", "done", "belisarius/assets/archive/"],
                 ["Music + SFX, credits", "done", "belisarius/assets/audio/CREDITS.md"],
                 ["Thumbnail (vidIQ)", "done", "belisarius/build/thumbnail.jpg"],
                 ["YouTube description (copy-paste)", "done", "belisarius/youtube_description.txt"]], [62, 58, 60]),
          P("Gofile deletes guest uploads after a period without downloads: download the 1080p master soon and keep it.", "warn"),
          P("Rebuild from scratch", "h2"),
          P("1. Re-render the map scenes (see HANDOVER.md §5). 2. From belisarius/: <font face='Courier'>python3 tools/assemble_full.py</font> "
            "(video + mix, about 30 min) or <font face='Courier'>--mix-only</font> (audio changes only, about 10 min). "
            "The build fails on purpose if the music/SFX bed is less than 15 dB under the voice."),
          PageBreak()]

# ---------------- 2. upload ----------------
story += [P("2 · Upload to YouTube", "h1"),
          P("Title", "h2"), P("<b>Belisarius's Top 3 Legendary Tactical Moves</b> (keeps the channel format)."),
          P("Alternatives to A/B test later: <i>How 5,000 Men Held Rome Against 150,000</i> · <i>The General Who Rebuilt the Roman Empire</i> · "
            "<i>The Trench Trap That Destroyed a Persian Army</i>."),
          P("Chapters", "h2"), P(esc(chapters), "mono"),
          P("Tags", "h2"), P(tags),
          P("Settings", "h2")] + bullets([
              "Category: Education. Language: English. Not made for kids.",
              "Altered or synthetic content: <b>Yes</b> (AI narration voice and an AI-generated thumbnail).",
              "Paid promotion: No. Add an end screen (last 20 s over the method card) pointing to the Hannibal video.",
              "Pinned comment: <i>Belisarius or Hannibal: who was the better tactician? And which general should I cover next?</i>"]) + [
          PageBreak(),
          P("Description (copy-paste; also in youtube_description.txt)", "h2"), P(esc(description), "mono"),
          PageBreak()]

# ---------------- 3. fact sheet ----------------
story += [P("3 · Fact sheet (for comments and corrections)", "h1"),
          table([["Move", "Numbers used in the video", "Result"],
                 ["Dara, summer 530", "Romans ~25,000 vs Persians 40,000 + 10,000 reinforcements; 300 Heruli hidden behind a hill; Belisarius aged 25",
                  "Persian rout; ~5,000 killed on one wing alone"],
                 ["Tricamarum, Dec 533", "Roman cavalry ~5,000 (infantry hours behind) vs Vandals 15,000-30,000 (modern estimates)",
                  "Fewer than 50 Romans and ~800 Vandals killed (Procopius); Gelimer surrenders March 534"],
                 ["Siege of Rome, 537-538", "~5,000 defenders; Goths 150,000 (Procopius) or 20,000-30,000 (modern); walls 12 miles, 18 gates",
                  "Siege lifted after a year and nine days"]], [34, 90, 56]),
          Spacer(1, 4 * mm),
          P("Corrections made to the Gemini research (details in FACTS.md)", "h2")] + bullets([
              "Tricamarum Roman strength: ~5,000 cavalry, not 8,000.",
              "Dara Persian losses: ~5,000 on the left wing (Procopius), not 8,000 overall. The 'horses' faces' detail was dropped (not in Procopius).",
              "Gate locks at Rome were changed twice a month, not daily.",
              "Tricamarum sequence: the Vandals fell back to camp; Gelimer fled when Belisarius advanced with infantry in the evening.",
              "The blinding / begging story is presented as a later legend. Belisarius died at home in 565.",
              "The San Vitale figure is 'traditionally identified' as Belisarius, not certain."]) + [
          P("Likely comment: 'Byzantine, not Roman!' Answer: they called themselves Romans; 'Byzantine' is a later historians' term.", "tip"),
          PageBreak()]

# ---------------- 4. next ----------------
story += [P("4 · Known issues and next steps", "h1")] + bullets([
    "Dara scene: the DARA fortress label is clipped at the top edge in one shot; a '300' label touches the right edge.",
    "Rome scene: a small label nudge (PLAIN OF NERO) is in rome.js but was not re-rendered.",
    "Gelimer engraving is only 500 px wide (shown whole over a blurred background).",
    "SFX are synthesized (Wikimedia blocked downloads); swap in recorded SFX later if they sound thin.",
    "Loudness is -15.3 LUFS (YouTube target -14): fine, YouTube does not turn quieter videos up much, but you can raise it in a final pass.",
    "Next video candidates: research/VIDEO_IDEAS_v2.md. Start a fresh session per video (HANDOVER.md §0b)."])

doc = SimpleDocTemplate("build/Belisarius-publishing-guide.pdf", pagesize=A4, leftMargin=15 * mm, rightMargin=15 * mm,
                        topMargin=16 * mm, bottomMargin=16 * mm, title="Belisarius: publishing guide", author="Claude")
doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
print("wrote build/Belisarius-publishing-guide.pdf and youtube_description.txt")
