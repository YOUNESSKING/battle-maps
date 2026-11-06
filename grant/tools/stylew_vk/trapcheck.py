"""Strict // comment trap check: strip string/template literals and regexes-ish, then flag any line whose // comment is followed by ';' + code."""
import re, sys, glob
files = sys.argv[1:] or sorted(glob.glob('tools/vk_body_m2*.js') + glob.glob('tools/vx_body_m2*.js') + ['tools/vk_kit.js', 'tools/vx_kit.js'])
bad = 0
for p in files:
    for i, l in enumerate(open(p).read().split('\n'), 1):
        s = re.sub(r'`(?:\\.|[^`\\])*`', '``', l); s = re.sub(r'"(?:\\.|[^"\\])*"', '""', s); s = re.sub(r"'(?:\\.|[^'\\])*'", "''", s)
        k = s.find('//')
        if k < 0 or s[:k].strip() == '': continue
        c = s[k:]
        if re.search(r';\s*\S', c) or re.search(r'\w\s*\(.*\)\s*;?\s*$', c) and re.search(r'[=(]', c[2:]) and ('(' in c and ')' in c and re.search(r'\b(tl|B|K|GG|gsap|const|let|hatch|pinPortrait|now|town|boxL|unitS|U|arw|SFX|focus)\b', c)):
            print(f'{p}:{i}: {c[:140]}'); bad += 1
print('TRAPS', bad)
