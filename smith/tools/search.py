import json, sys, time, urllib.parse, urllib.request, urllib.error

UA = "BattleMapsDoc/1.0 (younessking research; https://github.com/younessking) python-urllib"


def api(params, retries=8):
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode({**params, "format": "json"})
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=30) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = int(e.headers.get("retry-after", 20)) + 5 * attempt
                print(f"429, sleeping {wait}s", file=sys.stderr)
                time.sleep(wait)
                continue
            raise
    raise SystemExit("rate limited after retries")


if __name__ == "__main__":
    for q in sys.argv[1:]:
        d = api({"action": "query", "generator": "search", "gsrnamespace": 6, "gsrlimit": 10, "gsrsearch": q,
                 "prop": "imageinfo", "iiprop": "url|size|extmetadata", "iiurlwidth": 1200})
        print("===", q)
        for p in d.get("query", {}).get("pages", {}).values():
            ii = p["imageinfo"][0]
            m = ii.get("extmetadata", {})
            lic = m.get("LicenseShortName", {}).get("value", "")
            print(f"  {ii.get('width')}x{ii.get('height')} | {lic} | {p['title'][5:100]}")
        time.sleep(3)
