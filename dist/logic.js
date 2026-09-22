(function(root){
'use strict';
const brochureDate='2025-10-01';
const products=[
  {
    "id": "trb-cage",
    "no": "01",
    "group": "cage",
    "english": "TRB CAGE",
    "title": "TRB 케이지",
    "short": "테이퍼 롤러 베어링용 케이지. Site-A의 주력 생산 품목입니다.",
    "description": "삼호엔지니어링은 1987년 TRB 케이지 생산을 시작했습니다. 2011년 원펀치 금형을 도입했으며, 영주 Site-A에서 TRB 케이지를 생산합니다.",
    "tags": [
      "TRB",
      "Site-A"
    ],
    "application": "테이퍼 롤러 베어링",
    "size": "50–200 mm",
    "keyword": "테이퍼 롤러 원펀치 taper roller cage",
    "page": 9
  },
  {
    "id": "dgbb-cage",
    "no": "02",
    "group": "cage",
    "english": "DGBB CAGE",
    "title": "DGBB 케이지",
    "short": "깊은 홈 볼 베어링용 케이지. Site-B에서 생산합니다.",
    "description": "1987년부터 생산해 온 깊은 홈 볼 베어링(DGBB)용 케이지입니다. 영주 Site-B에서 DGBB 케이지와 실드를 생산합니다.",
    "tags": [
      "DGBB",
      "Site-B"
    ],
    "application": "깊은 홈 볼 베어링",
    "size": "40–300 mm",
    "keyword": "볼 리테이너 deep groove ball cage",
    "page": 10
  },
  {
    "id": "dgbb-shield",
    "no": "03",
    "group": "shield",
    "english": "DGBB SHIELD",
    "title": "DGBB 실드",
    "short": "깊은 홈 볼 베어링용 실드. 케이지와 함께 Site-B에서 생산합니다.",
    "description": "삼호엔지니어링의 주요 생산 품목인 깊은 홈 볼 베어링(DGBB)용 실드입니다. 회사 소개서에 기재된 생산 외경 범위는 35–300 mm입니다.",
    "tags": [
      "DGBB",
      "Site-B"
    ],
    "application": "깊은 홈 볼 베어링",
    "size": "35–300 mm",
    "keyword": "쉴드 차폐판 shield deep groove ball",
    "page": 11
  },
  {
    "id": "pronged-cage",
    "no": "04",
    "group": "cage",
    "english": "PRONGED TYPE CAGE",
    "title": "프롱 타입 케이지",
    "short": "외경 20–40 mm 범위의 프롱 타입 케이지입니다.",
    "description": "회사 소개서에 수록된 Pronged type cage 제품입니다. 생산 외경 범위는 20–40 mm이며, 세부 형상과 요구 사양은 도면을 기준으로 확인합니다.",
    "tags": [
      "PRONGED TYPE",
      "케이지"
    ],
    "application": "프롱 타입 케이지",
    "size": "20–40 mm",
    "keyword": "프롱 프롱드 pronged type cage",
    "page": 12
  },
  {
    "id": "strut-raceway",
    "no": "05",
    "group": "raceway",
    "english": "RACEWAY FOR STRUT BEARING",
    "title": "스트럿 베어링 레이스웨이",
    "short": "스트럿 베어링에 적용되는 레이스웨이입니다.",
    "description": "스트럿 베어링용 레이스웨이입니다. 생산 외경 범위는 60–150 mm입니다.",
    "tags": [
      "STRUT BEARING",
      "레이스웨이"
    ],
    "application": "스트럿 베어링",
    "size": "60–150 mm",
    "keyword": "스트럿 스트러트 궤도륜 strut bearing raceway",
    "page": 13
  },
  {
    "id": "acbb-cage",
    "no": "06",
    "group": "cage",
    "english": "ACBB CAGE",
    "title": "중장비 베어링용 ACBB 케이지",
    "short": "중장비 베어링용 ACBB 케이지 제품입니다.",
    "description": "회사 소개서의 기타 제품군에 수록된 중장비 베어링용 ACBB 케이지입니다. 상세 규격은 별도 확인이 필요합니다.",
    "tags": [
      "ACBB",
      "중장비"
    ],
    "application": "중장비용 앵귤러 콘택트 볼 베어링",
    "size": "별도 문의",
    "keyword": "중장비 heavy equipment angular contact ball cage",
    "page": 14
  },
  {
    "id": "wheel-cover",
    "no": "07",
    "group": "shield",
    "english": "WHEEL BEARING COVER & CAP",
    "title": "휠 베어링 커버·캡",
    "short": "휠 베어링에 적용되는 커버와 캡입니다.",
    "description": "회사 소개서에 수록된 휠 베어링 커버 및 캡 제품입니다. 필요한 형상, 치수와 도면 정보를 정리해 상담할 수 있습니다.",
    "tags": [
      "WHEEL BEARING",
      "COVER & CAP"
    ],
    "application": "휠 베어링",
    "size": "별도 문의",
    "keyword": "휠 커버 캡 wheel bearing cover cap",
    "page": 15
  },
  {
    "id": "brass-cage",
    "no": "08",
    "group": "cage",
    "english": "BRASS CAGE FOR ACBB",
    "title": "ACBB 황동 케이지",
    "short": "ACBB용 황동 케이지 제품입니다.",
    "description": "회사 소개서에 수록된 ACBB용 황동 케이지입니다. 상세 생산 규격과 수량 조건은 별도 상담이 필요합니다.",
    "tags": [
      "ACBB",
      "황동"
    ],
    "application": "앵귤러 콘택트 볼 베어링",
    "size": "별도 문의",
    "keyword": "황동 brass angular contact ball cage",
    "page": 16
  },
  {
    "id": "stamped-raceway",
    "no": "09",
    "group": "raceway",
    "english": "STAMPED RACEWAY",
    "title": "프레스 성형 레이스웨이",
    "short": "프레스 성형 방식의 레이스웨이 제품입니다.",
    "description": "회사 소개서에 Stamped raceway로 소개된 제품입니다. 제품 형상과 치수, 적용 조건은 도면을 기준으로 확인합니다.",
    "tags": [
      "STAMPED",
      "레이스웨이"
    ],
    "application": "프레스 성형 레이스웨이",
    "size": "별도 문의",
    "keyword": "프레스 스탬핑 궤도륜 stamped raceway",
    "page": 16
  }
];
const questions=[
  {
    "title": "어떤 부품을 찾으시나요?",
    "help": "문의할 부품군을 선택하세요. 아직 정해지지 않았다면 전체 제품을 살펴볼 수 있습니다.",
    "options": [
      {
        "value": "cage",
        "title": "케이지",
        "sub": "TRB · DGBB · 프롱 타입 · ACBB"
      },
      {
        "value": "shield",
        "title": "실드 · 커버 · 캡",
        "sub": "DGBB 실드 · 휠 베어링 커버와 캡"
      },
      {
        "value": "raceway",
        "title": "레이스웨이",
        "sub": "스트럿 베어링용 · 프레스 성형"
      },
      {
        "value": "all",
        "title": "아직 확인 전",
        "sub": "전체 제품군을 비교하며 상담 준비"
      }
    ]
  },
  {
    "title": "현재 준비된 규격 정보는 무엇인가요?",
    "help": "이 정보는 상담 준비에만 사용되며, 제품 적합성을 자동으로 판정하지 않습니다.",
    "options": [
      {
        "value": "drawing",
        "title": "도면 · 품번이 있습니다",
        "sub": "도면 번호와 개정 정보, 요구 사양 정리"
      },
      {
        "value": "size",
        "title": "치수 · 샘플 정보가 있습니다",
        "sub": "외경과 주요 치수, 제품 형상 확인"
      },
      {
        "value": "unknown",
        "title": "아직 준비 중입니다",
        "sub": "필요한 부품군과 적용 제품부터 정리"
      }
    ]
  },
  {
    "title": "어떤 내용으로 상담하시나요?",
    "help": "필요 수량과 희망 일정은 견적 요청서에 직접 입력할 수 있습니다.",
    "options": [
      {
        "value": "new",
        "title": "신규 부품 검토",
        "sub": "도면과 재질, 품질 요구 사항 정리"
      },
      {
        "value": "production",
        "title": "양산 · 공급 상담",
        "sub": "연간 예상 물량과 공급 일정 정리"
      },
      {
        "value": "spec",
        "title": "규격 · 생산 범위 확인",
        "sub": "소개서의 외경 범위와 생산 품목 확인"
      }
    ]
  }
];

function filterProducts(query,group){const q=query.trim().toLocaleLowerCase().replace(/\s+/g,' ');return products.filter(p=>(group==='all'||p.group===group)&&(!q||[p.title,p.english,p.application,p.short,p.keyword].join(' ').toLocaleLowerCase().includes(q)));}
function recommend(answers){const [group,info,purpose]=answers;const ids=products.filter(p=>group==='all'||p.group===group).map(p=>p.id);const title=group==='all'?'문의할 제품군부터 확인해 주세요.':'선택한 부품군의 생산 품목입니다.';const reason='아래 제품은 회사 소개서에 수록된 품목입니다. 외경 범위와 제품 설명을 확인한 뒤 필요한 품목을 요청서에 담아 주세요.';const infoNote=info==='drawing'?'도면 번호·개정 정보와 재질, 공차 등 요구 사항을 준비해 주세요.':info==='size'?'외경과 주요 치수, 샘플의 형상 정보를 준비해 주세요.':'적용 베어링과 필요한 부품 종류부터 정리해 주세요.';const purposeNote=purpose==='production'?'연간 예상 수량과 회차별 공급 일정도 함께 적어 주세요.':purpose==='new'?'신규 제작 가능 여부와 개발 일정은 별도 검토가 필요합니다.':'소개서의 외경 범위는 참고 기준이며, 세부 사양은 별도 확인이 필요합니다.';const labels=answers.map((v,i)=>questions[i]?.options.find(o=>o.value===v)?.title||'확인 전');return{ids,title,reason,envNote:infoNote+' '+purposeNote,labels};}
function buildInquiry(items,fields,context,date){if(!items.length)throw new Error('제품을 담거나 품번을 직접 입력해 주세요.');items.forEach(item=>{if(!item.title.trim())throw new Error('직접 입력한 품목의 품번 또는 이름을 적어 주세요.');if(!Number.isInteger(Number(item.qty))||Number(item.qty)<1||Number(item.qty)>1000000)throw new Error('수량은 1~1,000,000 사이의 정수로 입력해 주세요.');});const value=v=>String(v||'미기재').trim()||'미기재';return ['삼호엔지니어링 | 견적 요청서','작성일: '+date,'','[요청 품목]',...items.map((p,i)=>(i+1)+'. '+p.title.trim()+' / '+Number(p.qty)+'개'),'','[상담 정보]','회사 / 담당자: '+value(fields.company),'회신 연락처: '+value(fields.contact),'적용 베어링 / 부품: '+value(fields.machine),'희망 납기: '+value(fields.date),'','[추가 요청 사항]',value(fields.notes),...(context?['','[상담 도우미에서 정리한 조건]',context]:[]),'','※ 견적 상담 준비용 문서입니다. 전송 또는 주문이 완료된 상태가 아닙니다.','※ 제작 가능 여부, 상세 규격, 공급 수량 및 납기는 별도 협의가 필요합니다.'].join('\n');}
const api={products,questions,brochureDate,filterProducts,recommend,buildInquiry};root.SamhoLogic=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
