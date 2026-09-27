# 오프닝 서체 비교 시안

선택 전 로컬 시안. 운영 홈페이지의 로고·문구·오프닝 코드는 변경하지 않았습니다.

- 주소: http://127.0.0.1:8872/previews/opening-type-v1/
- 생성: `python3 website/scripts/build_opening_type_study.py`
- 01 정밀한 균형: Noto Sans KR 600 + Manrope 600
- 02 여유 있는 절제: Noto Sans KR 300 + Montserrat 400
- 03 클래식한 신뢰: Noto Serif KR 500 + Cormorant Garamond 500
- 04 현대적인 클래식: Noto Sans KR 500 + Cormorant Garamond 500
- 05 따뜻한 품격: Gowun Batang 700 + Manrope 600
- 06 영문 중심의 인상: Noto Sans KR 500 + Manrope 500

큰 미리보기의 '현재'는 운영 CSS를 그대로 사용합니다. 각 시안은 완성 장면으로 정지하거나 실제 오프닝 애니메이션을 4.5초로 재생할 수 있습니다. 리뷰용 iframe에서만 서체를 바꾸며, 본 사이트의 방문·재생 기록에 영향을 주지 않습니다.

공식 Google Fonts 저장소에서 받은 서체를 회사명 글자만 포함하도록 줄였습니다. 웹폰트 6개 합계 48,220바이트. 원본 출처·SHA256·SIL OFL 라이선스는 fonts/에 보존했고, 수정된 폰트의 내부 family 이름은 별도 이름으로 바꿨습니다.

검수: 6개 한글·영문 글리프 포함 확인. 비교 카드 6개 및 현재 버전 전환, 4.5초 재생 완료·히어로 전환, 모바일 미리보기에서 모든 시안의 가로·세로 잘림 없음. 390px 비교 페이지에 가로 넘침 없음. 브라우저 콘솔 오류 없음.
