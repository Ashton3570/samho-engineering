"""Encode the approved blue collection image for the website, preserving its composition."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT.parent / 'output/hero-collection-blue-v3-hires/samho-collection-blue-6144x4096.png'
OUT = ROOT / 'src/hero'
OUT.mkdir(exist_ok=True)
with Image.open(SOURCE) as original:
    image = original.convert('RGB')
    for width in (768, 1152, 1536, 1920, 2560, 3840):
        height = round(image.height * width / image.width)
        derivative = image.resize((width, height), Image.Resampling.LANCZOS)
        path = OUT / f'product-collection-blue-v3-{width}.webp'
        derivative.save(path, 'WEBP', quality=90, method=6)
        print(f'{path.name}: {width}×{height}, {path.stat().st_size:,} bytes')
