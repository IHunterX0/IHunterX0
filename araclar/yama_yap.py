# Carvis yaması (.zip) üretir: tam APK'nın derlendiği commit'ten (taban) bu yana değişen www/ dosyaları + istenen ek klasörler.
# Birikimlidir: her yama tabandan bu yana TÜM web değişikliklerini taşır → yamalar hangi sırayla kurulursa kurulsun son hâl doğru olur.
# kullanım:
#   python3 araclar/yama_yap.py <taban_commit> <surum> <cikti.zip> [--ek model/piper=<klasör>] [--ek veri/x=<klasör>] [--ad "…"] [--yeniden-yukleme-yok]
# Yalnız model içeren bir parça için taban yerine "-" verilir (www eklenmez).
import sys, os, json, subprocess, zipfile, argparse
ap = argparse.ArgumentParser()
ap.add_argument('taban'); ap.add_argument('surum'); ap.add_argument('cikti')
ap.add_argument('--ek', action='append', default=[], help='hedef=kaynak_klasör (hedef model/… ya da veri/… ya da www/…)')
ap.add_argument('--ad', default=''); ap.add_argument('--yeniden-yukleme-yok', action='store_true')
a = ap.parse_args()
kok = subprocess.check_output(['git', 'rev-parse', '--show-toplevel'], text=True).strip()
os.chdir(kok)
degisen, silinen = [], []
if a.taban != '-':
    for satir in subprocess.check_output(['git', 'diff', '--name-status', a.taban, 'HEAD', '--', 'www'], text=True).splitlines():
        p = satir.split('\t'); d = p[0]
        if d.startswith('R'): silinen.append(p[1]); degisen.append(p[2])
        elif d == 'D': silinen.append(p[1])
        else: degisen.append(p[1])
    degisen = [x for x in degisen if os.path.isfile(x) and not os.path.basename(x).startswith('ozel')]
manifest = {'uygulama': 'carvis', 'ad': a.ad or ('Carvis ' + a.surum), 'surum': a.surum, 'taban': a.taban, 'sil': silinen, 'yenidenYukle': not a.yeniden_yukleme_yok}
with zipfile.ZipFile(a.cikti, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as z:
    z.writestr('yama.json', json.dumps(manifest, ensure_ascii=False, indent=1))
    for f in degisen: z.write(f, f)
    for e in a.ek:
        hedef, kaynak = e.split('=', 1)
        assert hedef.split('/')[0] in ('www', 'model', 'veri') and '..' not in hedef, hedef
        for dk, _, dosyalar in os.walk(kaynak):
            for d in dosyalar:
                yol = os.path.join(dk, d); rel = os.path.relpath(yol, kaynak)
                tip = zipfile.ZIP_STORED if d.lower().endswith(('.jpg', '.png', '.webp', '.onnx', '.zip', '.mp3')) else zipfile.ZIP_DEFLATED
                z.write(yol, hedef.rstrip('/') + '/' + rel, compress_type=tip)
print(json.dumps({'dosya': len(degisen), 'silinen': silinen, 'boyut_mb': round(os.path.getsize(a.cikti) / 1048576, 2)}, ensure_ascii=False))
