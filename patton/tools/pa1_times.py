"""print B.at times for phrases: python3 tools/pa1_times.py SCENE 'tag|phrase' ..."""
import json, sys
T = json.loads(open(f"scenes/{sys.argv[1]}/timing.js").read().split("=", 1)[1].rstrip().rstrip(";"))
for a in sys.argv[2:]:
    k, ph = a.split("|"); s0, s1 = T["paras"][k]; tx = T["text"][k]; i = tx.find(ph)
    print(f"{s0 + (s1 - s0) * i / len(tx):.2f}" if i >= 0 else f"MISSING {a}", ph)
