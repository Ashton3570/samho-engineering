"""Reconstruct simple logo geometry from measurements of the supplied screenshot."""
from pathlib import Path
import math,json
root=Path(__file__).parent
shapes=[]
def pt(cx,cy,r,a):
 a=math.radians(a);return (cx+r*math.cos(a),cy+r*math.sin(a))
def arc(cx,cy,r,start,end):
 steps=math.ceil(abs(end-start)/75); out=[]
 for i in range(steps):
  a=math.radians(start+(end-start)*i/steps); b=math.radians(start+(end-start)*(i+1)/steps); k=4/3*math.tan((b-a)/4)
  x0,y0=cx+r*math.cos(a),cy+r*math.sin(a);x3,y3=cx+r*math.cos(b),cy+r*math.sin(b)
  out.append(['C',x0-k*r*math.sin(a),y0+k*r*math.cos(a),x3+k*r*math.sin(b),y3-k*r*math.cos(b),x3,y3])
 return out
cx,cy,ro,ri=571.08,574.17,571.05,448.46
end=-180-math.degrees(math.asin((635-cy)/ro)); inner_start=-180+math.degrees(math.asin((cy-510)/ri))
p=[['M',*pt(cx,cy,ro,-40)],*arc(cx,cy,ro,-40,end),['L',277,635],['L',277,510],['L',*pt(cx,cy,ri,inner_start)],*arc(cx,cy,ri,inner_start,-40),['Z']];shapes.append(p)
cx,cy,ro,ri=570.79,577.17,571.27,448.44
start=math.degrees(math.asin((510-cy)/ro));inner_end=math.degrees(math.asin((635-cy)/ri))
p=[['M',861,510],['L',*pt(cx,cy,ro,start)],*arc(cx,cy,ro,start,139.8),['L',*pt(cx,cy,ri,139.8)],*arc(cx,cy,ri,139.8,inner_end),['L',861,635],['Z']];shapes.append(p)
shapes.append([['M',354,289],['L',468,289],['L',468,520],['L',683,520],['L',683,289],['L',799,289],['L',799,870],['L',683,870],['L',683,635],['L',468,635],['L',468,870],['L',354,870],['Z']])
for cx,cy in [(106.32,767.46),(1036.09,378.82)]:shapes.append([['M',cx+77,cy],*arc(cx,cy,77,0,360),['Z']])
color='#1e2083'
svgpaths=[]
for commands in shapes:
 d=' '.join(c[0]+' '.join(f'{v:.4f}' for v in c[1:]) for c in commands)
 svgpaths.append(f'<path d="{d}"/>')
svg='<svg xmlns="http://www.w3.org/2000/svg" width="4096" height="4096" viewBox="-54 -54 1260 1260"><title>삼호엔지니어링 로고</title><g fill="'+color+'">'+''.join(svgpaths)+'</g></svg>'
(root/'samho-logo-indigo-vector.svg').write_text(svg)
(root/'geometry.json').write_text(json.dumps(shapes))
print('Vector paths saved. Source screenshot color median:',color)
