# GitHub 비밀정보 노출 점검 결과

점검일: 2026-09-23

접근 가능한 Ashton3570 소유 저장소 8개를 검사했습니다. 실제 API 키·토큰·비밀번호·개인키로 판단되는 노출 항목은 발견되지 않았습니다.

| 저장소 | 접근 가능한 커밋 | 노출 파일 위치 |
|---|---:|---|
| [Ashton3570/adpoint-website](https://github.com/Ashton3570/adpoint-website) | 42 | 미발견 |
| [Ashton3570/ashton1](https://github.com/Ashton3570/ashton1) | 1 | 미발견 |
| [Ashton3570/autopilot](https://github.com/Ashton3570/autopilot) | 205 | 미발견 |
| [Ashton3570/bybit-funding](https://github.com/Ashton3570/bybit-funding) | 2 | 미발견 |
| [Ashton3570/equity-research-pipeline](https://github.com/Ashton3570/equity-research-pipeline) | 142 | 미발견 |
| [Ashton3570/Equity-Research-Project](https://github.com/Ashton3570/Equity-Research-Project) | 4 | 미발견 |
| [Ashton3570/fart-predictor](https://github.com/Ashton3570/fart-predictor) | 3 | 미발견 |
| [Ashton3570/free](https://github.com/Ashton3570/free) | 0 | 파일·커밋 없음 |

현재 브랜치 12개의 파일, 커밋 399개, 중복을 제거한 파일 버전 2,244개와 커밋 메시지를 검사했습니다. 모든 저장소는 shallow clone이 아닌 전체 복사본으로 검사했고, 접근 가능한 PR 참조도 조회했지만 태그 및 PR 참조는 없었습니다. Git LFS 포인터와 하위 모듈도 발견되지 않았습니다.

[Gitleaks 공식 도구](https://github.com/gitleaks/gitleaks) 8.30.1의 기본 탐지 규칙과 별도 비밀번호·토큰 대입문 탐지를 사용했습니다. 파일 변경 기록 검사 외에 Git 파일 객체 전체를 따로 검사해 파일명에 따른 제외와 병합 차이를 보완했습니다. 탐지된 후보는 예시 키, 환경변수에서 읽는 값, 실행 중 계산하는 값, 패키지 버전으로 확인되어 제외했습니다.

비공개 저장소 6개는 GitHub 자체 Secret Scanning 알림 API가 404를 반환했습니다. 해당 저장소의 현재 파일과 커밋은 인증된 읽기 권한으로 내려받아 동일하게 검사했습니다. 공개 저장소 2개의 자체 알림 조회 결과는 0건이었습니다.

범위의 한계: Git에서 더 이상 접근할 수 없는 삭제 이력, 조직 명의 저장소, Actions 로그, 이슈·댓글, 릴리스 첨부파일, 암호화 파일 및 이미지 OCR은 포함하지 않았습니다. 패턴 검사에서 미발견이라는 결과가 모든 형태의 비밀정보 부재를 보장하지는 않습니다.

비밀 값은 보고서에 포함하지 않았고, 외부 서비스에 보내 유효성을 확인하지 않았습니다. GitHub 파일·커밋·설정은 변경하지 않았습니다. 검사에 사용한 임시 저장소와 파일 복사본은 결과 정리 후 삭제했습니다.
