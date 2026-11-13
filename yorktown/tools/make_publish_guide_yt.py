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
W = lambda s: [[P(f'<font color="white"><b>{c}</b></font>') if i == 0 else P(c) for c in r] for i, r in enumerate(s)]
desc = open("youtube/description.txt").read()
tags = "Yorktown, Battle of Yorktown, Siege of Yorktown, Yorktown 1781, George Washington, Cornwallis, Rochambeau, de Grasse, Battle of the Chesapeake, Battle of the Capes, American Revolution, Revolutionary War, Alexander Hamilton, Redoubt 10, military history, animated battle map"
story = [P("Yorktown 1781: publishing guide", "Title"),
 table(W([["Item", "Details"], ["File", "build/yorktown_final.mp4 (1920x1080, 30 fps, H.264 + AAC; -14.2 LUFS, true peak -1.4 dB)"], ["Download", "https://gofile.io/d/roGkUWAa (Yorktown-1781-1080p.mp4, md5 36ae371524c46487b28676a9d7a3ca65)"], ["Length", "16:02"], ["Voice", "owner clone (Chatterbox VC, ref tts/voices/owner_clone_test.mp3)"], ["Format", "single-battle story (first of the channel)"]]), [30, 140]), Spacer(1, 6),
 P("Titles (PACKAGING_GUIDE 0b; owner picks the main one, the others go into Test &amp; Compare)", "Heading2"),
 table(W([["", "Title", "vidIQ", "Claim check (FACT_NOTES)"],
  ["A", "Britain Thought Yorktown Was a Safe Harbor. Washington Turned It Into a Trap", "93", "Clinton/Cornwallis chose Yorktown as a naval station that relied on sea control; allied trap; surrender 19 Oct 1781"],
  ["B", "The Battle of Yorktown: How Washington Trapped Cornwallis's Army", "91", "Over 7,000 surrendered (7,073-7,247)"],
  ["C", "The Secret March and the Sea Battle That Trapped Cornwallis at Yorktown", "93", "Deception march Aug-Sep 1781 (Washington's diary 18 Aug); Battle of the Capes 5 Sep"]]), [8, 76, 16, 70]),
 P("Avoided: 'ended the war' (Treaty of Paris 1783), '450 miles' (sources: over 400 from the Hudson)."), PageBreak(),
 P("Thumbnails (owner's pick 2026-11-13; made with vidIQ from the channel's competitor study, research/competitors_top20/SUMMARY.md)", "Heading2"),
 Image("youtube/thumb/yorktown-thumb7-D2.jpg", 170 * mm, 95.6 * mm),
 P("<b>MAIN: D2 'Yorktown' map</b> (Eastory pattern: map + ONE big place name + arrows; reference Eastory 'Eastern Front 1944/45', 10.3M). Pair with title A. The only map thumbnail in the Yorktown sidebar. Corner plate '1781 MAPPED' (our own, no logo)."),
 P("Note: the small unit counters use a modern army symbol (XXXX); kept as the owner chose."), PageBreak(),
 P("Test &amp; Compare alternatives (optional)", "Heading2"),
 Image("youtube/thumb/yorktown-thumb6-E_KG.jpg", 120 * mm, 67.5 * mm), P("E 'THE TRAP AT YORKTOWN' (Kings and Generals pattern: illustration over a faded map + caps headline). Fits titles A, B."),
 Image("youtube/thumb/yorktown-thumb7-F2.jpg", 120 * mm, 67.5 * mm), P("F2 'YORKTOWN · 1781 · THE TRAP' (Epic History pattern + arrows on the map). The rider is a generic AI illustration: never describe him as Washington. Fits titles A, B."),
 Image("youtube/thumb/thumb7_D2_vs_ref.jpg", 170 * mm, 170 * mm * 420 / 1716), P("D2 next to its reference + feed-size check."), PageBreak(),
 P("Description (no links)", "Heading2")] + [P(l.replace("&", "&amp;").replace("<", "&lt;") if l.strip() else "&nbsp;") for l in desc.splitlines()] + [PageBreak(),
 P("Tags", "Heading2"), P(tags),
 P("Settings", "Heading2"), table(W([["Setting", "Value"], ["Category", "Education"], ["Made for kids", "No"], ["Altered content", "No (maps animated; no realistic AI people)"], ["Captions", "English auto-captions; check names (Rochambeau, de Grasse, Cornwallis, Barras, Lauzun, Gloucester, Tarleton)"], ["Pinned comment", "Which part won Yorktown: 1 the march, 2 the sea, or 3 the siege? And which battle should we tell next?"], ["End screen", "last ~20 s: the channel's busiest video (Morgan) + subscribe"]]), [35, 135]),
 P("Checklist", "Heading2"), P("Test &amp; Compare with the 3 thumbnails; log title/thumbnail winner, CTR and day 1-3 impressions per traffic source in research/CHANNEL_LOG.md (standard Studio prompt, DATA_RULES); retention at 0:30 and 1:00 logged separately."),
 P("Facts to double-check", "Heading2"), P("Chester hat-and-handkerchief scene (single eyewitness, von Closen); Washington firing the first American gun (reported); Nelson house (tradition, told as such); Rochambeau step in the sword hand-over (reported); Lord North quote (Wraxall, 'is said to'). Barras has no known portrait (banner shows initials); de Grasse and Hood portraits could not be downloaded (Wikimedia throttling) and show initials. The Battle of the Capes painting's author/licence (Commons says PD, US Navy art) should be checked on its file page before upload.")]
SimpleDocTemplate("build/Yorktown-publishing-guide.pdf", pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm).build(story); print("ok")
