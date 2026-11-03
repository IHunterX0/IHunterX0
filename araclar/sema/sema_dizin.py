# OpenStax A&P 2e figürlerinden şema dizini çıkarır (yalnız XML okur; dış koddan hiçbir şey çalıştırılmaz).
import re, json, sys, os, html
kok = sys.argv[1]; cikti = sys.argv[2]
kol = open(os.path.join(kok, 'collections', 'anatomy-and-physiology-2e.collection.xml'), encoding='utf-8').read()
# bölüm sırası: collection içindeki modül sırası + bölüm başlığı
sira = []; bolum = ''
for m in re.finditer(r'<col:subcollection>\s*<md:title>([^<]+)</md:title>|<col:module document="(m\d+)"', kol):
    if m.group(1): bolum = html.unescape(m.group(1)).strip()
    else: sira.append((m.group(2), bolum))
def temiz(s): return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', s or ''))).strip()
liste = []
for mod, bol in sira:
    p = os.path.join(kok, 'modules', mod, 'index.cnxml')
    if not os.path.exists(p): continue
    x = open(p, encoding='utf-8').read()
    bas = re.search(r'<title>([^<]+)</title>', x); modAd = temiz(bas.group(1)) if bas else ''
    for f in re.finditer(r'<figure\b[^>]*>(.*?)</figure>', x, re.S):
        g = f.group(1)
        im = re.search(r'src="\.\./\.\./media/([^"]+\.(?:jpe?g|png))"', g, re.I)
        if not im: continue
        t = re.search(r'<title>(.*?)</title>', g, re.S); c = re.search(r'<caption>(.*?)</caption>', g, re.S); a = re.search(r'alt="([^"]*)"', g)
        liste.append({'d': im.group(1), 't': temiz(t.group(1)) if t else '', 'c': temiz(c.group(1))[:260] if c else '', 'a': temiz(a.group(1))[:220] if a else '', 'b': bol, 'm': modAd})
# aynı dosya bir kez
gor = set(); son = []
for e in liste:
    if e['d'] in gor: continue
    gor.add(e['d']); son.append(e)
json.dump(son, open(cikti, 'w', encoding='utf-8'), ensure_ascii=False)
print(len(son), 'figür')
