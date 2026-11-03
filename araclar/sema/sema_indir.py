# Figürleri GitHub raw'dan indirir, 900 px genişliğe küçültüp JPEG (q=80) olarak kaydeder; <hedef>/dizin.json'a ekler.
# kullanım: python3 -I sema_indir.py <dizin_ham.json> <hedef klasör> <github repo adı> <dosya öneki>
import json, sys, os, io, urllib.request, urllib.parse, concurrent.futures as cf
from PIL import Image
dizin, hedef, repo, onek = sys.argv[1:5]
os.makedirs(hedef, exist_ok=True)
l = json.load(open(dizin, encoding='utf-8'))
TABAN = 'https://raw.githubusercontent.com/openstax/' + repo + '/main/media/'
def is_(i_e):
    i, e = i_e
    ad = '%s%03d.jpg' % (onek, i); yol = os.path.join(hedef, ad)
    if os.path.exists(yol): return i, ad, None
    hata = None
    for deneme in range(3):
        try:
            r = urllib.request.urlopen(urllib.request.Request(TABAN + urllib.parse.quote(e['d']), headers={'User-Agent': 'CarvisStudy/1.0'}), timeout=60).read()
            im = Image.open(io.BytesIO(r))
            if im.mode in ('RGBA', 'LA', 'P'):
                im = im.convert('RGBA'); zemin = Image.new('RGB', im.size, (255, 255, 255)); zemin.paste(im, mask=im.split()[-1]); im = zemin
            else: im = im.convert('RGB')
            if im.width > 900: im = im.resize((900, round(im.height * 900 / im.width)), Image.LANCZOS)
            im.save(yol, 'JPEG', quality=80, optimize=True, progressive=True)
            return i, ad, (im.width, im.height)
        except Exception as x:
            hata = x
    return i, None, str(hata)
sonuc = {}
with cf.ThreadPoolExecutor(8) as ex:
    for i, ad, bilgi in ex.map(is_, list(enumerate(l))):
        sonuc[i] = (ad, bilgi)
dp = os.path.join(hedef, 'dizin.json')
eski = json.load(open(dp, encoding='utf-8')) if os.path.exists(dp) else []
eski = [x for x in eski if not x['f'].startswith(onek)]
for i, e in enumerate(l):
    ad, bilgi = sonuc[i]
    if not ad: print('olmadı', e['d'], bilgi); continue
    if not isinstance(bilgi, tuple):
        with Image.open(os.path.join(hedef, ad)) as im: bilgi = im.size
    eski.append({'f': ad, 't': e['t'], 'c': e['c'], 'a': e['a'], 'b': e['b'], 'm': e['m'], 'k': e.get('k', ''), 'w': bilgi[0], 'h': bilgi[1]})
json.dump(eski, open(dp, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print(len(eski), 'görsel dizinde')
