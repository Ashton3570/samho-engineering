# 블루 제품 사진을 확대한 히어로 시안 4종

사용자 요청: 기존 25-02 블루 편집 이미지로 전체 화면 히어로와 다른 레이아웃을 비교할 수 있는 HTML 시안 제작.

- 비교 URL: /previews/hero-layouts-v1/
- 빌드: python3 website/scripts/build_hero_layouts.py
- 소스: src/hero-layouts/index.html, src/hero-layouts/layouts.css, scripts/build_hero_layouts.py
- 참고한 기존 SKF 시안: dist/designs/v4/index.html 및 designs/snapshots.json
- 동일한 이미지: /assets/hero/product-collection-blue-1535.webp
- 현재 홈페이지의 본문과 히어로 레이아웃은 변경하지 않음. 공개 배포 없음.
- 비교 페이지는 오프닝을 생략해 레이아웃을 바로 비교할 수 있게 함.

## 시안

01 immersive: 화면 전체 사진 + 투명 헤더 + 흰색 왼쪽 문구. 가독성을 위한 어두운 그라데이션.
02 gallery: 흰색 헤더 아래 전체 화면 사진 + 왼쪽 아래 흰색 문구 카드.
03 editorial: 흰색 상단 문구 영역 + 가로 전체를 채운 사진. 제품과 글자 겹침 최소화.
04 architectural: 데스크톱의 36:64 비율 문구/사진 분할 + 화면 높이 사진. 모바일은 세로 배치.

## 검토

- 1440×900 PC 및 390×844 모바일 뷰포트에서 각 4종을 스크린샷으로 확인.
- 모든 시안에서 가로 넘침 없음. 이미지 로드 확인.
- 공통 모바일 메뉴 열림 확인. 제품/회사/자료실/문의 링크는 현재 로컬 사이트 페이지로 연결.
- 모바일에서 숨긴 줄바꿈 때문에 붙던 단어 간격을 수정.
- 체크 스크립트 통과. 시안 선택/PC·모바일 전환은 비교 페이지에서 제공.
