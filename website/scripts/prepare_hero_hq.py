"""Create high-quality responsive web assets from a verified master, without upsampling.

Usage: python3 scripts/prepare_hero_hq.py /absolute/path/to/master.png
The master is kept outside the public site. Each encoded derivative is at or below
its real input dimensions; the manifest records the source and encoding settings.
"""
from pathlib import Path
from PIL import Image
import argparse, hashlib, json

ROOT=Path(__file__).resolve().parents[1]
WIDTHS=(768,1152,1536,1920,2560,3072,3840,5120,6144)

def main():
    parser=argparse.ArgumentParser();parser.add_argument('source',type=Path)
    args=parser.parse_args();source=args.source.resolve()
    out=ROOT/'src/hero';out.mkdir(exist_ok=True)
    with Image.open(source) as original:
        image=original.convert('RGB')
        if image.width<3072:raise SystemExit('A master at least 3072 pixels wide is required; do not disguise a small source as a high-resolution master.')
        if abs(image.width/image.height-1.5)>.005:raise SystemExit('The approved hero uses a 3:2 composition.')
        widths=sorted(set(w for w in WIDTHS if w<=image.width)|{min(image.width,6144)})
        manifest={'source':str(source),'source_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'width':image.width,'height':image.height,'format':'WebP','quality':96,'method':6,'assets':[]}
        for width in widths:
            height=round(image.height*width/image.width)
            encoded=image if width==image.width else image.resize((width,height),Image.Resampling.LANCZOS)
            file=out/f'product-collection-blue-v4-{width}.webp'
            encoded.save(file,'WEBP',quality=96,method=6)
            item={'file':file.name,'width':width,'height':height,'bytes':file.stat().st_size}
            manifest['assets'].append(item)
            print(json.dumps(item))
        (out/'hero-v4-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
if __name__=='__main__':main()
