import json, re, time, urllib.parse, urllib.request
from search import api, UA
files = {"hannibal": "File:Hannibal Barca bust from Capua photo.jpg",
         "scipio": "File:Scipio Africanus the Elder.jpg",
         "sempronius": "File:P. Juventius Thalna, denarius, 179-170 BC, RRC 161-1.png",
         "mago": None}
d = api({"action": "query", "list": "search", "srnamespace": 6, "srsearch": "Carthago 213-210 BC silver shekel head of Melqart elefant", "srlimit": 1})
files["mago"] = d["query"]["search"][0]["title"]
credits = []
for key, title in files.items():
    time.sleep(2)
    d = api({"action": "query", "titles": title, "prop": "imageinfo", "iiprop": "url|extmetadata", "iiurlwidth": 1600})
    ii = next(iter(d["query"]["pages"].values()))["imageinfo"][0]
    m = ii["extmetadata"]
    strip = lambda s: re.sub("<[^>]+>", "", s or "").strip()
    url = ii.get("thumburl") or ii["url"]
    with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=60) as r:
        open(f"{key}.src" + (".png" if url.lower().endswith(".png") else ".jpg"), "wb").write(r.read())
    credits.append(f"- **{key}**: {title[5:]} | {strip(m.get('Artist', {}).get('value'))} | {m.get('LicenseShortName', {}).get('value')} | {ii['descriptionurl']}")
    print(credits[-1])
open("CREDITS.md", "w").write("# Portrait credits (Wikimedia Commons)\n\n" + "\n".join(credits) + "\n")
