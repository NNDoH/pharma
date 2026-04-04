export const PARTS = [
  { id: 1, subtitle: "통증 질환",           color: "#EF4444", bg: "#FEF2F2", chapterIds: [1,2] },
  { id: 2, subtitle: "감기 및 호흡기 질환", color: "#F97316", bg: "#FFF7ED", chapterIds: [3,4] },
  { id: 3, subtitle: "피부 질환",            color: "#EAB308", bg: "#FEFCE8", chapterIds: [5,6,7,8,9,10,11,12] },
  { id: 4, subtitle: "안과 질환",            color: "#22C55E", bg: "#F0FDF4", chapterIds: [13,14,15] },
  { id: 5, subtitle: "구강 질환",            color: "#06B6D4", bg: "#ECFEFF", chapterIds: [16,17] },
  { id: 6, subtitle: "위장 질환",            color: "#3B82F6", bg: "#EFF6FF", chapterIds: [18,19,20,21] },
  { id: 7, subtitle: "장 질환",              color: "#8B5CF6", bg: "#F5F3FF", chapterIds: [22,23,24,25] },
  { id: 8, subtitle: "여성 질환",            color: "#EC4899", bg: "#FDF2F8", chapterIds: [26,27,28,29,30] },
  { id: 9, subtitle: "그 밖의 질환",         color: "#6366F1", bg: "#EEF2FF", chapterIds: [31,32,33] },
  { id:10, subtitle: "영양요법 및 기능개선", color: "#14B8A6", bg: "#F0FDFA", chapterIds: [34,35,36,37,38] },
];

export const CHAPTERS = {
  1: {
    id:1, partId:1, title:"근골격계 통증",
    summary:"근육통·관절통·요통 등 근골격계 통증에 대한 OTC 약물 선택 가이드",
    keywords:["근육통","관절통","요통","염좌","타박상","몸살"],
    algorithm:{
      start:"q_redflag",
      nodes:{
        q_redflag:{type:"question", text:"다음 위험 신호가 있나요?", subtext:"골절 의심·발열 동반 관절통·야간통·하지 저림·마비",
          options:[
            {label:"예 — 위험 신호 있음", next:"w_redflag"},
            {label:"아니오 — 해당 없음", next:"q_type"}
          ]},
        w_redflag:{type:"warning", text:"즉시 전문의 진료가 필요합니다",
          reasons:["골절·인대파열 의심","발열 동반 → 감염성 관절염 가능성","신경학적 증상(저림·마비) → 디스크/척추관협착 가능성","원인불명 체중감소 동반"],
          action:"정형외과·신경외과 즉시 진료"},
        q_type:{type:"question", text:"주요 증상은?",
          options:[
            {label:"근육통 / 몸살 (운동 후, 과로)", next:"q_muscle_dur"},
            {label:"관절통 (무릎·어깨·손목 등)", next:"q_joint_inflam"},
            {label:"요통 / 허리 통증", next:"q_back_neuro"}
          ]},
        q_muscle_dur:{type:"question", text:"증상이 언제부터인가요?",
          options:[
            {label:"48시간 이내 (급성)", next:"q_contraindication"},
            {label:"48시간 이상 (반복·만성)", next:"r_muscle_chronic"}
          ]},
        q_contraindication:{type:"question", text:"다음에 해당하나요?", subtext:"소화성 궤양·신기능 저하·임신 3기·아스피린 과민",
          options:[
            {label:"해당 있음", next:"r_apap"},
            {label:"해당 없음", next:"r_nsaid_muscle"}
          ]},
        r_nsaid_muscle:{type:"result", title:"급성 근육통 — NSAIDs",
          drugs:[
            {rank:"1차 선택", name:"이부프로펜", examples:["애드빌","이지엔6","부루펜"], dosing:"성인 200–400 mg, 1일 3–4회 (4–6시간 간격), 식후 복용, 최대 5일"},
            {rank:"1차 선택", name:"덱시부프로펜", examples:["이지엔6 애니","이지엔6 이브"], dosing:"성인 150–300 mg, 1일 2–3회, 식후 복용 — 위장 부담 적음"},
            {rank:"외용제", name:"케토프로펜 패치/겔", examples:["케토톱","트라스트"], dosing:"환부에 1일 1–2회 부착/도포 — 광과민반응 주의"},
            {rank:"외용제", name:"디클로페낙 겔", examples:["볼타렌 겔","디클로겔"], dosing:"환부에 1일 3–4회, 상처 부위 금지"}
          ],
          nonPharm:["RICE 원칙 (안정·냉찜질·압박·거상)","48시간 후 온찜질로 전환"],
          counseling:["식후 복용으로 위장 자극 최소화","5일 이상 자의 복용 자제","음주 중 복용 금지"],
          referral:"5일 이상 지속·악화 시 전문의 상담"},
        r_apap:{type:"result", title:"아세트아미노펜 (NSAIDs 금기 시)",
          drugs:[
            {rank:"1차 선택", name:"아세트아미노펜", examples:["타이레놀","타이레놀 ER"], dosing:"성인 325–650 mg, 1일 3–4회 (4–6시간 간격), 최대 10일", cautions:["간질환·만성음주 금기","일일 최대 4 g 초과 금지"]}
          ],
          nonPharm:["충분한 휴식","온찜질 병행"],
          counseling:["음주 중·간질환 환자 사용 금지","공복 복용 가능"],
          referral:"10일 이상 지속 시 의사 상담"},
        r_muscle_chronic:{type:"result", title:"만성·반복성 근육통",
          drugs:[
            {rank:"1차 선택", name:"아세트아미노펜", examples:["타이레놀","타이레놀 ER"], dosing:"성인 325–650 mg, 1일 3–4회, 장기 복용 시 간기능 모니터링"},
            {rank:"외용제", name:"NSAIDs 외용제 (겔/패치)", examples:["케토톱","볼타렌 겔","이지이부 패치"], dosing:"환부에 1일 2–3회 — 전신 부작용 최소화"}
          ],
          nonPharm:["스트레칭·강화 운동","온찜질","자세 교정"],
          counseling:["근본 원인 파악 권고","장기간 경구 NSAIDs 자제"],
          referral:"3–4주 이상 지속 시 전문의 상담"},
        q_joint_inflam:{type:"question", text:"관절 부위에 붓기·발적·열감이 있나요?",
          options:[
            {label:"예 (염증 징후 있음)", next:"r_joint_inflam"},
            {label:"아니오 (통증만)", next:"r_joint_noninflam"}
          ]},
        r_joint_inflam:{type:"result", title:"염증성 관절통",
          drugs:[
            {rank:"1차 선택", name:"이부프로펜", examples:["애드빌","이지엔6"], dosing:"성인 200–400 mg, 1일 3–4회, 식후 복용, 최대 5일"},
            {rank:"1차 선택", name:"나프록센", examples:["탁센","낙센"], dosing:"성인 220 mg, 1일 2–3회 (반감기 길어 편리), 식후"},
            {rank:"외용제", name:"케토프로펜/디클로페낙 겔", examples:["케토톱 겔","볼타렌 겔"], dosing:"환부에 1일 3–4회"}
          ],
          nonPharm:["급성기: 냉찜질 15–20분, 하루 수회","붓기 감소 후 온찜질","관절 보호대 사용"],
          counseling:["항염 효과 위해 규칙적 복용 권장","2일 내 호전 없으면 상담"],
          referral:"48시간 내 개선 없거나 발열 동반 시 즉시 의사 상담"},
        r_joint_noninflam:{type:"result", title:"비염증성 관절통 (골관절염 등)",
          drugs:[
            {rank:"1차 선택", name:"아세트아미노펜", examples:["타이레놀","타이레놀 ER"], dosing:"성인 325–650 mg, 1일 3–4회 — 장기 복용 안전성 유리"},
            {rank:"보조요법", name:"글루코사민/콘드로이틴", examples:["조인트케어","관절엔"], dosing:"글루코사민 1,500 mg/일, 콘드로이틴 1,200 mg/일 — 효과까지 3–6개월"},
            {rank:"외용제", name:"캡사이신 크림", examples:["캡사이신 크림"], dosing:"환부에 1일 3–4회, 초기 작열감 발생 후 수주 후 효과"}
          ],
          nonPharm:["온찜질","저충격 운동 (수영·자전거)","과체중 시 체중 감량"],
          counseling:["글루코사민 효과 발현까지 최소 3개월 복용 필요","캡사이신 처음 사용 시 작열감 주의"],
          referral:"만성 통증·일상생활 지장 시 전문의 상담"},
        q_back_neuro:{type:"question", text:"다리 저림·방사통·방광·장 기능 이상이 있나요?",
          options:[
            {label:"예", next:"w_back_neuro"},
            {label:"아니오 — 단순 요통", next:"r_back"}
          ]},
        w_back_neuro:{type:"warning", text:"전문의 즉시 진료 필요",
          reasons:["하지 방사통 → 추간판 탈출·척추관협착 가능성","방광/장 기능 이상 → 마미총증후군 (응급)","외상 후 심한 요통 → 골절 가능성"],
          action:"정형외과 또는 신경외과 즉시 진료"},
        r_back:{type:"result", title:"단순 급성 요통",
          drugs:[
            {rank:"1차 선택", name:"이부프로펜", examples:["애드빌","이지엔6"], dosing:"성인 200–400 mg, 1일 3회, 3–5일"},
            {rank:"1차 선택", name:"나프록센", examples:["탁센","낙센"], dosing:"성인 220 mg, 1일 2–3회, 3–5일"},
            {rank:"외용제", name:"파스 (NSAIDs/캡사이신)", examples:["케토톱","신신파스","트라스트"], dosing:"환부에 1일 1–2회"}
          ],
          nonPharm:["안정은 2–3일만, 가능한 빨리 활동 재개","온찜질 또는 냉찜질","바른 자세 유지"],
          counseling:["장기 침상 안정은 오히려 악화","규칙적 복용이 효과적"],
          referral:"4–6주 이상 지속·보행 장애 시 전문의 상담"}
      }
    }
  },
  2: {
    id:2, partId:1, title:"두통",
    summary:"긴장형·편두통·군발두통의 감별과 적절한 OTC 진통제 선택 가이드",
    keywords:["두통","편두통","긴장형두통","군발두통","머리아픔"],
    algorithm:{
      start:"q_redflag",
      nodes:{
        q_redflag:{type:"question", text:"다음 위험 신호가 있나요?", subtext:"갑작스러운 '벼락 두통', 발열+경부 강직, 의식 변화, 시야 이상, 외상 후 두통",
          options:[
            {label:"예 — 위험 신호 있음", next:"w_redflag"},
            {label:"아니오", next:"q_type"}
          ]},
        w_redflag:{type:"warning", text:"즉각적인 응급 평가 필요",
          reasons:["벼락 두통 → 지주막하출혈 가능성","발열+경부 강직 → 뇌수막염 가능성","의식 변화·국소 신경 증상 → 뇌출혈/뇌종양 가능성","50세 이후 새로 발생한 두통","임신 중 심한 두통"],
          action:"응급실 즉시 방문"},
        q_type:{type:"question", text:"두통의 양상은?",
          options:[
            {label:"머리 전체를 조이는 느낌 (긴장형)", next:"q_tension_freq"},
            {label:"한쪽 박동성, 구역·빛 소리 과민 동반 (편두통)", next:"q_migraine"},
            {label:"한쪽 눈 주위 극심한 통증, 규칙적 발생 (군발두통)", next:"w_cluster"}
          ]},
        w_cluster:{type:"warning", text:"군발두통 — 전문의 상담 필요",
          reasons:["군발두통은 OTC로 조절이 어렵습니다","산소 흡입·수마트립탄 주사 등 전문 치료 필요"],
          action:"신경과 전문의 상담 권고"},
        q_tension_freq:{type:"question", text:"두통 빈도는?",
          options:[
            {label:"월 15일 미만 (삽화성)", next:"q_tension_med"},
            {label:"월 15일 이상 (만성)", next:"w_chronic"}
          ]},
        w_chronic:{type:"warning", text:"만성 두통 — 약물 과용성 두통 주의",
          reasons:["진통제를 월 10–15일 이상 복용하면 약물 과용성 두통 악화","만성 두통은 전문의 평가 필요"],
          action:"신경과 상담 권고"},
        q_tension_med:{type:"question", text:"아스피린/이부프로펜 복용에 금기가 있나요?", subtext:"위궤양·천식·임신 3기·신기능 저하",
          options:[
            {label:"금기 있음", next:"r_apap_tension"},
            {label:"금기 없음", next:"r_nsaid_tension"}
          ]},
        r_nsaid_tension:{type:"result", title:"긴장형 두통 — NSAIDs",
          drugs:[
            {rank:"1차 선택", name:"이부프로펜", examples:["애드빌","이지엔6"], dosing:"성인 200–400 mg, 증상 시작 즉시, 필요 시 4–6시간 후 반복, 1일 최대 1,200 mg"},
            {rank:"1차 선택", name:"아세트아미노펜", examples:["타이레놀","타이레놀 ER"], dosing:"성인 325–650 mg, 필요 시 4–6시간 간격"},
            {rank:"2차 선택", name:"아스피린", examples:["아스피린 500 mg"], dosing:"성인 500–1,000 mg, 1일 최대 3 g — 소아 금기"},
            {rank:"보조요법", name:"아세트아미노펜+이부프로펜 복합", examples:["게보린","사리돈"], dosing:"제품 용법에 따름"}
          ],
          nonPharm:["충분한 수면·규칙적 생활","스트레스 관리","목·어깨 스트레칭"],
          counseling:["카페인 함유 복합제는 카페인 의존 주의","두통 일기 작성 권장"],
          referral:"월 10회 이상 진통제 복용 시 약물과용성두통 위험 → 전문의 상담"},
        r_apap_tension:{type:"result", title:"긴장형 두통 — 아세트아미노펜",
          drugs:[
            {rank:"1차 선택", name:"아세트아미노펜", examples:["타이레놀","타이레놀 ER"], dosing:"성인 325–650 mg, 4–6시간 간격, 1일 최대 4 g", cautions:["간질환·음주 금기"]}
          ],
          nonPharm:["관자놀이 냉/온찜질","수분 충분히 섭취"],
          counseling:["공복 복용 가능","음주 중 사용 절대 금지"],
          referral:"10일 이상 지속 시 전문의 상담"},
        q_migraine:{type:"question", text:"구역·구토가 동반되나요?",
          options:[
            {label:"예 (구역/구토 심함)", next:"r_migraine_nausea"},
            {label:"아니오 (통증 위주)", next:"r_migraine_plain"}
          ]},
        r_migraine_plain:{type:"result", title:"편두통 — 통증 위주",
          drugs:[
            {rank:"1차 선택", name:"이부프로펜", examples:["애드빌","이지엔6"], dosing:"성인 400 mg, 증상 초기 복용 — 초기 복용일수록 효과 좋음"},
            {rank:"1차 선택", name:"나프록센", examples:["탁센","낙센"], dosing:"성인 440–550 mg, 초기 복용"},
            {rank:"2차 선택", name:"아세트아미노펜", examples:["타이레놀"], dosing:"성인 650–1,000 mg"}
          ],
          nonPharm:["조용하고 어두운 곳에서 안정","냉찜질 관자놀이·이마"],
          counseling:["전조 증상 시작 또는 두통 초기에 즉시 복용","카페인 음료 병용 시 흡수 촉진 (단, 의존 주의)"],
          referral:"월 3회 이상 발생·일상생활 지장 시 신경과 상담 (트립탄 처방 고려)"},
        r_migraine_nausea:{type:"result", title:"편두통 + 구역·구토",
          drugs:[
            {rank:"1차 선택", name:"이부프로펜", examples:["애드빌","이지엔6"], dosing:"성인 400 mg, 경구 — 구역으로 흡수 감소 가능"},
            {rank:"보조요법", name:"메토클로프라미드 (처방)", examples:["맥페란"], dosing:"구역 심하면 의사 처방 필요 — OTC 범위 초과"}
          ],
          nonPharm:["누운 자세 안정","냉찜질","밝은 빛·소음 차단"],
          counseling:["구역 심할 경우 구강 붕해 제형 또는 좌약 제형 문의","편두통 유발인자(수면부족·스트레스·음식) 파악"],
          referral:"구역·구토로 경구 복용 어려울 시, 또는 빈발 편두통 → 신경과 상담"}
      }
    }
  },
  3: {
    id:3, partId:2, title:"기침",
    summary:"건성·습성 기침 감별 및 진해제·거담제 선택 가이드",
    keywords:["기침","마른기침","가래","거담","진해","기관지"],
    algorithm:{
      start:"q_redflag",
      nodes:{
        q_redflag:{type:"question", text:"다음 위험 신호가 있나요?", subtext:"혈담·호흡곤란·고열(38.5℃↑)·3주 이상 지속·흉통",
          options:[
            {label:"예", next:"w_redflag"},
            {label:"아니오", next:"q_duration"}
          ]},
        w_redflag:{type:"warning", text:"전문의 진료 필요",
          reasons:["혈담 → 폐결핵·폐암 가능성","3주 이상 지속 만성기침 → 원인 불명","고열+기침 → 폐렴 가능성","호흡곤란 동반 → 심폐 질환 가능성"],
          action:"내과 또는 호흡기내과 진료 권고"},
        q_duration:{type:"question", text:"기침 기간은?",
          options:[
            {label:"3주 미만 (급성)", next:"q_type"},
            {label:"3주 이상 (아급성·만성)", next:"w_chronic"}
          ]},
        w_chronic:{type:"warning", text:"아급성·만성 기침 — 전문의 평가 필요",
          reasons:["3주 이상 기침의 흔한 원인: 후비루·천식·GERD","ACE 억제제 복용 중이면 기침 유발 가능 → 처방의 상담","결핵 배제 필요"],
          action:"내과 진료 권고 (3주 이상 지속 시)"},
        q_type:{type:"question", text:"기침 성질은?",
          options:[
            {label:"마른기침 (가래 없음, 자극성)", next:"q_dry_cause"},
            {label:"습성기침 (가래 동반)", next:"r_expectorant"}
          ]},
        q_dry_cause:{type:"question", text:"기침 유발 상황은?", subtext:"야간 악화, 운동 시, 감기 후",
          options:[
            {label:"감기 후 자극성 마른기침", next:"q_dry_age"},
            {label:"야간·운동 시 악화 (천식 의심)", next:"w_asthma"}
          ]},
        w_asthma:{type:"warning", text:"천식 가능성 — 전문의 상담",
          reasons:["야간·운동 시 악화되는 기침 → 기침형 천식 가능성","OTC 진해제로는 조절 어렵습니다"],
          action:"호흡기내과 진료 권고"},
        q_dry_age:{type:"question", text:"연령 및 금기 확인",
          options:[
            {label:"성인·12세 이상, 금기 없음", next:"r_dxm"},
            {label:"12세 미만 소아 또는 MAO억제제 복용", next:"w_dxm_ci"}
          ]},
        w_dxm_ci:{type:"warning", text:"덱스트로메토르판 금기",
          reasons:["6세 미만 소아 — OTC 진해제 사용 금지","12세 미만 — 사용 신중 (보호자 상담)","MAO억제제 병용 금기 (세로토닌 증후군 위험)"],
          action:"소아과 또는 의사 처방 권고"},
        r_dxm:{type:"result", title:"마른기침 — 진해제",
          drugs:[
            {rank:"1차 선택", name:"덱스트로메토르판 (DM)", examples:["로비투신DM","코대원DM","훼스탈골드DM"], dosing:"성인 15–30 mg, 1일 3–4회 (코데인 대용, 비마약성)"},
            {rank:"보조요법", name:"꿀 (성인·1세 이상)", examples:["천연 꿀"], dosing:"1–2 티스푼 직접 복용 또는 온음료에 타서 — 소아 1세 미만 절대 금지"}
          ],
          nonPharm:["가습기로 실내 습도 50–60% 유지","수분 충분히 섭취","금연"],
          counseling:["DM은 진해 효과가 있으나 근본 치료 아님","졸음 유발 있을 수 있음 — 운전 주의"],
          referral:"5–7일 이상 지속 시 전문의 상담"},
        r_expectorant:{type:"result", title:"습성기침 — 거담제",
          drugs:[
            {rank:"1차 선택", name:"구아이페네신", examples:["로비투신","화이투벤"), dosing:"성인 200–400 mg, 1일 4회, 충분한 수분 섭취 필수"},
            {rank:"1차 선택", name:"암브록솔", examples:["뮤코펙트","암브로콜"], dosing:"성인 30 mg, 1일 2–3회 — 기도 점막 수분 증가"},
            {rank:"2차 선택", name:"브롬헥신", examples:["비졸본","브롬헥신"], dosing:"성인 8–16 mg, 1일 3회"},
            {rank:"2차 선택", name:"아세틸시스테인", examples:["뮤코미스트","아세코"], dosing:"성인 200 mg, 1일 3회 — 객담 점도 낮춤"}
          ],
          nonPharm:["수분 섭취 1.5–2 L/일 이상","가습기 사용","스팀 흡입"],
          counseling:["거담제는 가래를 묽게 하므로 수분이 충분해야 효과","진해제(DM)와 동시 복용 시 주의 — 가래 배출 방해 가능"],
          referral:"황색·녹색 가래·고열 동반 시 의사 처방 항생제 필요"}
      }
    }
  },
  4: {
    id:4, partId:2, title:"코감기",
    summary:"비충혈·콧물·재채기의 주증상별 OTC 약물 선택 (알레르기 비염 포함)",
    keywords:["코막힘","콧물","재채기","비염","알레르기","코감기"],
    algorithm:{
      start:"q_type",
      nodes:{
        q_type:{type:"question", text:"주증상은?",
          options:[
            {label:"코막힘 (충혈)", next:"q_nasal_bp"},
            {label:"맑은 콧물·재채기 (알레르기 가능성)", next:"q_allergy"},
            {label:"콧물+코막힘 복합 (감기)", next:"q_cold_age"}
          ]},
        q_nasal_bp:{type:"question", text:"고혈압·심장질환·갑상선 질환이 있나요?",
          options:[
            {label:"예", next:"r_nasal_spray_only"},
            {label:"아니오", next:"r_nasal_full"}
          ]},
        r_nasal_full:{type:"result", title:"코막힘 치료",
          drugs:[
            {rank:"1차 선택", name:"옥시메타졸린 비강스프레이", examples:["아프린","나조넥스OTC"], dosing:"2–3회 분무, 1일 2회, 최대 3일 사용 — 약물성 비염 예방", cautions:["3일 초과 사용 금지 (반동성 충혈)","6세 미만 금기"]},
            {rank:"1차 선택", name:"크실로메타졸린 비강스프레이", examples:["오트리빈"], dosing:"1–2회 분무, 1일 3회, 최대 3일, cautions:["3일 초과 금지"]},
            {rank:"2차 선택", name:"슈도에페드린 경구", examples:["수다페드"], dosing:"성인 60 mg, 1일 3–4회 — 전신 충혈제거 효과", cautions:["고혈압·심장질환·갑상선항진·전립선비대 주의","불면·빈맥 부작용"]}
          ],
          nonPharm:["생리식염수 비강세척","습도 유지","수분 섭취"],
          counseling:["비강스프레이 3일 초과 사용 시 반동 충혈 위험 반드시 설명","슈도에페드린은 취침 전 복용 금지"],
          referral:"1주 이상 지속·황색 콧물+발열 → 부비동염 가능성, 의사 진료"},
        r_nasal_spray_only:{type:"result", title:"코막힘 — 고혈압·심혈관 질환 환자",
          drugs:[
            {rank:"1차 선택", name:"옥시메타졸린 비강스프레이 (국소)", examples:["아프린","오트리빈"], dosing:"2–3회 분무, 1일 2회, 최대 3일 — 전신 흡수 적음", cautions:["3일 초과 금지"]},
          ],
          nonPharm:["생리식염수 비강세척 (오래 사용 가능, 안전)","머리 높이 베개 사용"],
          counseling:["경구 충혈제거제(슈도에페드린)는 혈압 상승 위험으로 금기","3일 후에도 지속 시 의사 상담"],
          referral:"심혈관 질환자 증상 지속 시 의사 처방 권고"},
        q_allergy:{type:"question", text:"증상이 계절성이거나 특정 환경(꽃가루·먼지)에서 악화되나요?",
          options:[
            {label:"예 (알레르기 비염 가능성)", next:"q_allergy_sedation"},
            {label:"아니오 (감기로 판단)", next:"q_cold_age"}
          ]},
        q_allergy_sedation:{type:"question", text:"졸음을 피해야 하나요? (운전·업무)",
          options:[
            {label:"예 — 졸음 없어야 함", next:"r_nonsedating"},
            {label:"아니오 — 졸음 무관", next:"r_sedating"}
          ]},
        r_nonsedating:{type:"result", title:"알레르기 비염 — 비진정 항히스타민",
          drugs:[
            {rank:"1차 선택", name:"세티리진", examples:["지르텍","세티졸"], dosing:"성인 10 mg, 1일 1회 취침 전 — 경도 졸음 가능"},
            {rank:"1차 선택", name:"로라타딘", examples:["클라리틴","로라타딘"], dosing:"성인 10 mg, 1일 1회 — 거의 졸음 없음"},
            {rank:"1차 선택", name:"펙소페나딘", examples:["알레그라","페노펙"], dosing:"성인 60 mg, 1일 2회 또는 180 mg, 1일 1회 — 졸음 최소"}
          ],
          nonPharm:["알레르겐 회피 (마스크·공기청정기)","외출 후 세안·코 세척"],
          counseling:["알레르기 비염은 계절 시작 전 예방적 복용도 효과적","완치 아닌 증상 조절이 목적"],
          referral:"연중 지속·심한 경우 이비인후과 상담 (비강스테로이드 처방)"},
        r_sedating:{type:"result", title:"알레르기 비염 — 1세대 항히스타민 (취침 시 유리)",
          drugs:[
            {rank:"1차 선택", name:"클로르페니라민", examples:["페니라민","클로페닐"], dosing:"성인 4 mg, 1일 3–4회 — 졸음·구강건조 많음, 취침 전 유리"},
            {rank:"보조요법", name:"세티리진 (타협안)", examples:["지르텍"], dosing:"10 mg, 취침 전 1회"}
          ],
          nonPharm:["알레르겐 회피"],
          counseling:["1세대 항히스타민 복용 후 운전·기계 조작 금지","구강건조·소변 곤란 노인 주의"],
          referral:"증상 조절 불충분 시 이비인후과 상담"},
        q_cold_age:{type:"question", text:"소아(<12세) 또는 임산부인가요?",
          options:[
            {label:"예", next:"w_child_cold"},
            {label:"아니오 — 성인", next:"r_cold_adult"}
          ]},
        w_child_cold:{type:"warning", text:"소아·임산부 — 의사 또는 약사 상담 필수",
          reasons:["2세 미만 소아 OTC 감기약 사용 금지","4세 미만도 의사 처방 권고","임산부는 1기 슈도에페드린 신중 사용"],
          action:"소아과 또는 산부인과 처방 권고"},
        r_cold_adult:{type:"result", title:"감기 — 복합 증상 (성인)",
          drugs:[
            {rank:"1차 선택", name:"복합감기약 (항히스타민+충혈제거제+해열진통)", examples:["판피린","화이투벤","콜대원"], dosing:"제품 용법에 따름 (1일 3–4회)"},
            {rank:"외용제", name:"크실로메타졸린 비강스프레이", examples:["오트리빈"], dosing:"코막힘 심하면 병행 (최대 3일)"}
          ],
          nonPharm:["충분한 수면·수분 섭취","따뜻한 증기 흡입"],
          counseling:["복합감기약 성분 확인 — 중복 복용 주의 (타이레놀 등 이미 복용 중이면 아세트아미노펜 중복 확인)","7일 이상 지속 시 재방문"],
          referral:"고열(38.5℃↑)·황색 콧물+안면통 → 부비동염 가능성, 의사 진료"}
      }
    }
  },
