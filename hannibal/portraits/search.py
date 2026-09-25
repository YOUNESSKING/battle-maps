import json, sys, time, urllib.parse, urllib.request
UA = "HannibalHistoryVideo/1.0 (https://github.com/younessking; educational video research) python-urllib"
def api(params):
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode({**params, "format": "json"})
    for attempt in range(6):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=30) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code == 429:
                time.sleep(int(e.headers.get("retry-after", 5)) + 2 * attempt); continue
            raise
    raise SystemExit("rate limited")
if __name__ == "__main__":
  for q in sys.argv[1:]:
      d = api({"action": "query", "generator": "search", "gsrnamespace": 6, "gsrlimit": 8, "gsrsearch": q,
               "prop": "imageinfo", "iiprop": "url|size|extmetadata", "iiurlwidth": 1200})
      print("===", q)
      for p in d.get("query", {}).get("pages", {}).values():
          ii = p["imageinfo"][0]; m = ii.get("extmetadata", {})
          lic = m.get("LicenseShortName", {}).get("value", "")
          print(f"  {ii['width']}x{ii['height']} | {lic} | {p['title'][5:80]}")
      time.sleep(3)
