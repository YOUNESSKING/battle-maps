"""Yorktown publishing guide PDF -> build/Yorktown-publishing-guide.pdf (titles, thumbnails, description, tags, chapters, checklist)."""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak, Preformatted
ss = getSampleStyleSheet(); P = lambda t, s="BodyText": Paragraph(t, ss[s])
def table(rows, w):
    t = Table(rows, colWidths=[x * mm for x in w]); t.setStyle(TableStyle([("GRID", (0, 0), (-1, -1), 0.4, colors.grey), ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2b2b2b")), ("TEXTCOLOR", (0, 0), (-1, 0), colors.white), ("VALIGN", (0, 0), (-1, -1), "TOP"), ("FONTSIZE", (0, 0), (-1, -1), 8.5)]))
    return t
W = lambda s: [[P(c) for c in r] for r in s]
desc = open("youtube/description.txt").read()
tags = "Yorktown, Battle of Yorktown, Siege of Yorktown, Yorktown 1781, George Washington, Cornwallis, Rochambeau, de Grasse, Battle of the Chesapeake, Battle of the Capes, American Revolution, Revolutionary War, Alexander Hamilton, Redoubt 10, military history, animated battle map"
story = [P("Yorktown 1781: publishing guide", "Title"),
 table(W([["Item", "Details"], ["File", "build/yorktown_final.mp4 (1920x1080, 30 fps, H.264 + AAC; -14.2 LUFS, true peak -1.4 dB)"], ["Length", "16:02"], ["Voice", "owner clone (Chatterbox VC, ref tts/voices/owner_clone_test.mp3)"], ["Format", "single-battle story (first of the channel)"]]), [30, 140]), Spacer(1, 6),
 P("Titles (PACKAGING_GUIDE 0b; owner picks the main one, the others go into Test &amp; Compare)", "Heading2"),
 table(W([["", "Title", "vidIQ", "Claim check (FACT_NOTES)"],
  ["A", "Britain Thought Yorktown Was a Safe Harbor. Washington Turned It Into a Trap", "93", "Clinton/Cornwallis chose Yorktown as a naval station that relied on sea control; allied trap; surrender 19 Oct 1781"],
  ["B", "The Battle of Yorktown: How Washington Trapped Cornwallis's Army", "91", "Over 7,000 surrendered (7,073-7,247)"],
  ["C", "The Secret March and the Sea Battle That Trapped Cornwallis at Yorktown", "93", "Deception march Aug-Sep 1781 (Washington's diary 18 Aug); Battle of the Capes 5 Sep"]]), [8, 80, 12, 70]),
 P("Avoided: 'ended the war' (Treaty of Paris 1783), '450 miles' (sources: over 400 from the Hudson)."), PageBreak(),
 P("Thumbnails (our own map frame + C. W. Peale's public-domain portrait of Washington in colour + 1-3 words)", "Heading2"),
 Image("youtube/thumb/yorktown-thumb-A.jpg", 170 * mm, 95.6 * mm), P("A  THE TRAP — fits titles A, B, C"),
 Image("youtube/thumb/yorktown-thumb-B.jpg", 170 * mm, 95.6 * mm), P("B  SAFE HARBOR? — fits title A"), PageBreak(),
 Image("youtube/thumb/yorktown-thumb-C.jpg", 170 * mm, 95.6 * mm), P("C  SEALED — fits titles A, C"),
 Image("youtube/thumb/thumb_sheet.jpg", 170 * mm, 170 * mm * 554 / 2000), P("Feed-size strip (168x94) under each."), PageBreak(),
 P("Description (no links)", "Heading2"), Preformatted(desc, ss["Code"]), PageBreak(),
 P("Tags", "Heading2"), P(tags),
 P("Settings", "Heading2"), table(W([["Setting", "Value"], ["Category", "Education"], ["Made for kids", "No"], ["Altered content", "No (maps animated; no realistic AI people)"], ["Captions", "English auto-captions; check names (Rochambeau, de Grasse, Cornwallis, Barras, Lauzun, Gloucester, Tarleton)"], ["Pinned comment", "Which part won Yorktown: 1 the march, 2 the sea, or 3 the siege? And which battle should we tell next?"], ["End screen", "last ~20 s: the channel's busiest video (Morgan) + subscribe"]]), [35, 135]),
 P("Checklist", "Heading2"), P("Test &amp; Compare with the 3 thumbnails; log title/thumbnail winner, CTR and day 1-3 impressions per traffic source in research/CHANNEL_LOG.md (standard Studio prompt, DATA_RULES); retention at 0:30 and 1:00 logged separately."),
 P("Facts to double-check", "Heading2"), P("Chester hat-and-handkerchief scene (single eyewitness, von Closen); Washington firing the first American gun (reported); Nelson house (tradition, told as such); Rochambeau step in the sword hand-over (reported); Lord North quote (Wraxall, 'is said to'). Barras has no known portrait (banner shows initials); de Grasse and Hood portraits could not be downloaded (Wikimedia throttling) and show initials.")]
SimpleDocTemplate("build/Yorktown-publishing-guide.pdf", pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm).build(story); print("ok")
