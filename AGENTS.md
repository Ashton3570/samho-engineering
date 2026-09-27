# 삼호엔지니어링 홈페이지 — 작업 안내 (Codex·에이전트용)

이 저장소는 맥북 로컬 폴더 `~/삼호엔지니어링 홈페이지 작업/`을 그대로 옮긴 것이다(2026-09-27).
원래 ChatGPT(Codex/Sites)로 만들었고, 원격이 없어 다른 PC에서 손댈 수 없던 것을 GitHub로 옮겼다.

## 폴더 구조

| 경로 | 내용 |
|---|---|
| `website/` | **실제 홈페이지 소스.** 커밋 이력 보존. `python3 build.py` → `dist/` 생성 |
| `website/src/` | 원본 콘텐츠(`products.json`, `materials.json`, HTML/CSS/JS 조각) |
| `website/dist/` | 배포되는 정적 사이트 결과물(`dist/designs/`는 보존용 스냅샷, 덮어쓰지 않음) |
| `website/docs/` | 기획·브로슈어 정리·오프닝 설계 문서 |
| `website/scripts/` | 이미지 준비, 오프닝/히어로 빌드, 점검(`check_site.py`) 스크립트 |
| `output/opening-type-site/` | 오프닝 타이포그래피 시안 검토용 별도 사이트(이력 보존) |
| `output/hero-*` | 히어로 이미지 시안들 |
| `output/site-audit/` | 2026-09-22 전체 점검 결과, 배포 기록 |
| `로고 복원/` | 로고 벡터 복원 작업물 |
| `베어링 AI 이미지/` | AI로 만든 베어링 이미지 원본 |
| `유스튜디오/` | 제품·공장 사진 147장의 **웹용 축소본**(긴 변 2560px, JPEG 80, 위치정보 제거). 원본 아님 |
| `Samho_Website_Plan.html` | 홈페이지 기획서 |
| `삼호엔지니어링 브로슈어.pdf`, `Samho.pdf` | 회사 제공 자료(콘텐츠 원천) |

## 빌드와 점검

```sh
cd website
python3 build.py                 # dist/ 재생성 (Python 3 표준 라이브러리)
python3 scripts/check_site.py    # 사이트 점검
python3 -m http.server -d dist 8000   # 로컬 미리보기
```

이미지 준비 스크립트(`scripts/prepare_*.py`, `hero_image.py`)는 Pillow가 필요하다.

## 저장소에 없는 것 (의도적으로 제외)

- **`유스튜디오/` 사진 원본(147장, 5.8GB, 최대 8192px)**: GitHub 용량 한도 때문에 원본 대신 같은 파일명의 **축소본**을 넣었다. 사진 선택·교체·시안 작업에는 충분하다.
  사이트에 쓰는 웹용 이미지는 이미 `website/dist/assets/`에 있어 빌드에는 사진 폴더가 필요 없다.
  `scripts/prepare_reference_assets.py`·`prepare_hero_*.py`는 이 폴더를 읽으므로 축소본으로 돌리면 해상도가 낮아진다. 히어로처럼 고해상도가 필요한 이미지는 원본(맥북)으로 다시 만들어야 한다고 사용자에게 알릴 것.
  원본 ZIP(`전경스케치.zip`, `제품군.zip`)도 제외했다.
- 원본 묶음 ZIP(`output/samho-source-files-*`, 12GB)과 그 중복본(`output/pdf`, `output/claude-transfer-*`).
- `website/tmp/`(로컬 검토 캐시).

## 배포 주의

- 실제 사이트: https://samhoengineering.com (ChatGPT Sites 호스팅, `website/.openai/hosting.json`).
- **이 GitHub 저장소에 push해도 라이브 사이트는 바뀌지 않는다.** 배포는 원래 ChatGPT Sites 쪽 원격으로 이루어졌다. 배포 방식을 바꾸려면 사용자와 먼저 상의할 것.

## 규칙

- API 키·토큰·비밀번호·`.env`는 절대 커밋하지 않는다(`.gitignore`에 있음).
- 사진 원본이나 100MB 넘는 파일을 커밋하지 않는다.
- `website/dist/designs/` 스냅샷은 수정하지 않는다.
