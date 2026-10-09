"""Encode the approved photographs for delivery; keep WebP originals and framing."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from PIL import Image
import json

ROOT = Path(__file__).resolve().parents[1]
FOLDER = ROOT / 'src/hero-live'
photos = json.loads((FOLDER / 'manifest.json').read_text())

def encode(photo):
    records = []
    for variant in photo['variants']:
        source = FOLDER / variant['file']
        target = source.with_suffix('.avif')
        with Image.open(source) as image:
            image.save(target, quality=65, speed=6, max_threads=2)
        records.append({**variant, 'file': target.name})
    # A closer step for high-density screens avoids jumping from 2560 to 4608.
    with Image.open(FOLDER / photo['variants'][-1]['file']) as image:
        height = round(image.height * 3840 / image.width)
        name = photo['key'] + '-v1-3840.avif'
        image.resize((3840, height), Image.Resampling.LANCZOS).save(FOLDER/name, quality=65, speed=6, max_threads=2)
        records.append({'file': name, 'width': 3840, 'height': height})
    photo['avif_variants'] = sorted(records, key=lambda v: v['width'])
    print(photo['key'], 'encoded', flush=True)
    return photo

if __name__ == '__main__':
    with ThreadPoolExecutor(max_workers=2) as pool:
        updated = list(pool.map(encode, photos))
    (FOLDER/'manifest.json').write_text(json.dumps(updated, ensure_ascii=False, indent=2)+'\n')
    before = sum((FOLDER/p['variants'][-1]['file']).stat().st_size for p in updated)
    after = sum((FOLDER/p['avif_variants'][-1]['file']).stat().st_size for p in updated)
    print(f'4608px originals: {before} bytes; AVIF: {after} bytes; saved {100*(1-after/before):.1f}%')
