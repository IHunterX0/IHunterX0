# OpenStax kitabının figürlerinden şema dizini çıkarır (yalnız XML okur; dış koddan hiçbir şey çalıştırılmaz).
# kullanım: python3 -I sema_dizin.py <repo> <collection.xml adı> <kitap etiketi> <cikti.json> [bölüm1;bölüm2;... | hepsi]
import re, json, sys, os, html
kok, kolAd, kitap, cikti = sys.argv[1:5]
izin = None if len(sys.argv) < 6 or sys.argv[5] == 'hepsi' else set(x.strip() for x in sys.argv[5].split(';') if x.strip())
kol = open(os.path.join(kok, 'collections', kolAd), encoding='utf-8').read()
# modül sırası + içinde bulunduğu en içteki bölüm başlığı
sira = []; bolum = ''
for m in re.finditer(r'<col:subcollection>\s*<md:title>([^<]+)</md:title>|<col:module document="(m\d+)"', kol):
    if m.group(1): bolum = html.unescape(m.group(1)).strip()
    else: sira.append((m.group(2), bolum))
def temiz(s): return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', s or ''))).strip()
liste = []; gor = set()
for mod, bol in sira:
    if izin is not None and bol not in izin: continue
    p = os.path.join(kok, 'modules', mod, 'index.cnxml')
    if not os.path.exists(p): continue
    x = open(p, encoding='utf-8').read()
    bas = re.search(r'<title>([^<]+)</title>', x); modAd = temiz(bas.group(1)) if bas else ''
    for f in re.finditer(r'<figure\b[^>]*>(.*?)</figure>', x, re.S):
        g = f.group(1)
        im = re.search(r'src="\.\./\.\./media/([^"]+\.(?:jpe?g|png))"', g, re.I)
        if not im or im.group(1) in gor: continue
        gor.add(im.group(1))
        t = re.search(r'<title>(.*?)</title>', g, re.S); c = re.search(r'<caption>(.*?)</caption>', g, re.S); a = re.search(r'alt="([^"]*)"', g)
        liste.append({'d': im.group(1), 't': temiz(t.group(1)) if t else '', 'c': temiz(c.group(1))[:260] if c else '', 'a': temiz(a.group(1))[:220] if a else '', 'b': bol, 'm': modAd, 'k': kitap})
json.dump(liste, open(cikti, 'w', encoding='utf-8'), ensure_ascii=False)
print(len(liste), 'figür', kitap)
