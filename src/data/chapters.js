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
    },
    consultation:{
      patientPhrases:["허리가 끊어질 것 같아요","무릎이 시큰거려요","운동하고 나서 몸이 뭉쳤어요","어깨가 결리고 뻐근해요","관절이 시려요","손목을 삐었어요"],
      keyQuestions:[
        {q:"어디가 얼마나 됐나요? 갑자기 다쳤나요, 서서히 아파진 건가요?", why:"부위 확인·급성 외상 vs 만성 구분"},
        {q:"붓기·발적·열감이 있나요?", why:"염증성 관절통 여부 — NSAIDs 적극 권장 여부"},
        {q:"다리 저림·방사통이 있나요?", why:"신경 압박(디스크/협착) → 즉시 의뢰"},
        {q:"현재 복용 중인 약이 있나요? 위장이 약하거나 궤양 병력이 있나요?", why:"NSAIDs 금기 여부 확인"},
        {q:"임신 중이거나 신장 기능에 문제가 있나요?", why:"NSAIDs 임신 3기 금기·신기능 저하 금기"}
      ],
      redFlagPhrases:["밤에 자다가도 아파서 깨요","다리가 저리고 힘이 빠져요","열이 나고 관절이 부어서 뜨거워요","체중이 갑자기 빠졌어요"],
      checkItems:["복용 중인 약물 목록","임신/수유 여부","소화성 궤양 또는 신장 질환 병력","증상 기간 및 외상 여부"]
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
    },
    consultation:{
      patientPhrases:["머리가 지끈거려요","머리가 쪼이는 느낌이에요","편두통이에요","구역질 나고 머리가 아파요","스트레스받으면 두통이 와요","진통제를 자주 먹어요"],
      keyQuestions:[
        {q:"두통이 갑자기 왔나요, 서서히 왔나요? 얼마나 됐나요?", why:"벼락두통(응급) vs 만성 패턴 구분"},
        {q:"한쪽인가요 양쪽인가요? 박동성인가요 압박감인가요?", why:"편두통(한쪽·박동) vs 긴장형(양쪽·압박) 감별"},
        {q:"구역·구토·빛이나 소리에 과민한가요?", why:"편두통 진단 기준"},
        {q:"진통제를 한 달에 며칠이나 드시나요?", why:"약물과용성 두통 스크리닝 (월 10일↑ 주의)"},
        {q:"현재 복용 중인 다른 약이 있나요?", why:"약물 상호작용·트립탄류 병용 확인"}
      ],
      redFlagPhrases:["갑자기 생애 최악의 두통이 왔어요","열이 나고 목이 뻣뻣해요","눈이 잘 안 보여요","팔다리에 힘이 빠져요","외상 후 두통"],
      checkItems:["두통 빈도·기간·강도","복용 중 약물(특히 혈압약·ACE억제제)","임신/수유 여부","진통제 월 복용 횟수"]
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
            {rank:"1차 선택", name:"구아이페네신", examples:["로비투신","화이투벤"], dosing:"성인 200–400 mg, 1일 4회, 충분한 수분 섭취 필수"},
            {rank:"1차 선택", name:"암브록솔", examples:["뮤코펙트","암브로콜"], dosing:"성인 30 mg, 1일 2–3회 — 기도 점막 수분 증가"},
            {rank:"2차 선택", name:"브롬헥신", examples:["비졸본","브롬헥신"], dosing:"성인 8–16 mg, 1일 3회"},
            {rank:"2차 선택", name:"아세틸시스테인", examples:["뮤코미스트","아세코"], dosing:"성인 200 mg, 1일 3회 — 객담 점도 낮춤"}
          ],
          nonPharm:["수분 섭취 1.5–2 L/일 이상","가습기 사용","스팀 흡입"],
          counseling:["거담제는 가래를 묽게 하므로 수분이 충분해야 효과","진해제(DM)와 동시 복용 시 주의 — 가래 배출 방해 가능"],
          referral:"황색·녹색 가래·고열 동반 시 의사 처방 항생제 필요"}
      }
    },
    consultation:{
      patientPhrases:["목이 간질간질해요","기침이 안 멈춰요","가래가 너무 많아요","밤에 기침이 심해요","감기 걸렸어요","목에 뭔가 걸린 것 같아요"],
      keyQuestions:[
        {q:"가래가 있나요, 없나요?", why:"진해제(마른기침) vs 거담제(습성기침) 선택의 핵심"},
        {q:"기침이 얼마나 됐나요?", why:"3주 미만 급성 → OTC 가능 / 3주 이상 → 진료 권고"},
        {q:"열이 있나요? 숨이 차거나 흉통이 있나요?", why:"폐렴·폐색전 등 응급 가능성"},
        {q:"혈압약(ACE억제제 계열)을 드시나요?", why:"ACE억제제 유발 기침 감별 — 진해제 효과 없음"},
        {q:"연령 확인, 임신 중인가요?", why:"소아 12세 미만 DXM 금기·임산부 주의"}
      ],
      redFlagPhrases:["피가 섞인 가래가 나와요","숨이 차요","3주 넘게 기침해요","야간 식은땀·체중 감소"],
      checkItems:["기침 성질(마른/습성)","기침 기간","동반 증상(발열·호흡곤란·혈담)","ACE억제제 복용 여부","흡연 여부"]
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
            {rank:"1차 선택", name:"크실로메타졸린 비강스프레이", examples:["오트리빈"], dosing:"1–2회 분무, 1일 3회, 최대 3일", cautions:["3일 초과 금지"]},
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
    },
    consultation:{
      patientPhrases:["코가 막혀서 숨을 못 쉬겠어요","콧물이 줄줄 흘러요","재채기가 멈추질 않아요","비염인지 감기인지 모르겠어요","코가 훌쩍훌쩍해요"],
      keyQuestions:[
        {q:"주된 증상이 코막힘인가요, 아니면 콧물·재채기인가요?", why:"충혈제거제(코막힘) vs 항히스타민(콧물·재채기) 선택 기준"},
        {q:"알레르기 비염 진단 받은 적 있나요? 계절성인가요?", why:"항히스타민 우선 고려"},
        {q:"고혈압·심장질환·전립선비대가 있나요?", why:"슈도에페드린·1세대 항히스타민 금기 확인"},
        {q:"임신 중인가요?", why:"슈도에페드린 임신 1기 신중"},
        {q:"수면에 지장이 있나요?", why:"1세대 항히스타민(졸음 유발) 야간 활용 여부"}
      ],
      redFlagPhrases:["누런 콧물에 얼굴이 아파요","한쪽에서만 냄새 나는 콧물이 나와요","코피가 자주 나요","눈이 붓고 시야가 흐려요"],
      checkItems:["고혈압/심장질환/전립선비대 여부","임신/수유 여부","알레르기 기왕력","증상 기간 (7일 이상이면 재평가)"]
    }
  },

  5: {
    id:5, partId:3, title:"무좀 (족부백선)",
    summary:"발가락 사이·발바닥의 피부 사상균 감염에 대한 OTC 항진균제 선택 가이드",
    keywords:["무좀","족부백선","발가락","각질","수포","가려움","항진균"],
    algorithm:{
      start:"q_redflag",
      nodes:{
        q_redflag:{type:"question", text:"다음 위험 신호가 있나요?", subtext:"당뇨·면역저하·림프부종·2차 세균감염(발적·화농·열감)",
          options:[
            {label:"예 — 해당 있음", next:"w_redflag"},
            {label:"아니오 — 해당 없음", next:"q_type"}
          ]},
        w_redflag:{type:"warning", text:"전문의 진료 권고",
          reasons:["당뇨·면역저하 환자: 세균감염 합병 위험 높음","화농·봉와직염 징후 → 항생제 필요 가능성","림프부종 동반 → 반복 감염 예방 관리 필요"],
          action:"피부과 진료 권고"},
        q_type:{type:"question", text:"무좀의 형태는?",
          options:[
            {label:"지간형 — 발가락 사이 짓무름·균열·인설", next:"q_severity"},
            {label:"소수포형 — 발바닥·발가락 수포·가려움", next:"q_severity"},
            {label:"각화형 — 발바닥 전체 두꺼운 각질·인설", next:"r_terbinafine"}
          ]},
        q_severity:{type:"question", text:"증상 범위와 기간은?",
          options:[
            {label:"국소적·초발 또는 재발 (6개월 이내)", next:"r_azole"},
            {label:"광범위하거나 치료 실패 반복", next:"r_terbinafine"}
          ]},
        r_azole:{type:"result", title:"무좀 1차 치료 — 아졸계",
          drugs:[
            {rank:"1차 선택", name:"클로트리마졸 1% 크림/액", examples:["카네스텐","클로트리신"], dosing:"1일 2–3회 환부 도포, 최소 2–4주 지속 (증상 소실 후 1–2주 더 적용)"},
            {rank:"1차 선택", name:"미코나졸 2% 크림/파우더", examples:["다이신","마이코나졸"], dosing:"1일 2회 도포, 2–4주 — 파우더 제형은 신발 내 적용 가능"},
            {rank:"1차 선택", name:"에코나졸 1% 크림", examples:["에코나졸크림"], dosing:"1일 1–2회, 최소 4주"}
          ],
          nonPharm:["발가락 사이 건조하게 유지","통기성 있는 면 양말 착용","공공 샤워실 슬리퍼 착용","감염된 양말·신발 소독"],
          counseling:["증상이 나아져도 최소 4주 완료 필수 — 재발 방지","아침 세족 후, 저녁 취침 전 2회 도포 권장","파우더 제형을 신발 안에도 적용하면 재발 예방 효과"],
          referral:"4주 치료 후 호전 없거나 손발톱 감염 동반 시 피부과 진료 (경구 항진균제 필요)"},
        r_terbinafine:{type:"result", title:"무좀 고효능 치료 — 테르비나핀",
          drugs:[
            {rank:"1차 선택", name:"테르비나핀 1% 크림/겔/스프레이", examples:["라미실","무좀라미실AT"], dosing:"지간형: 1일 1회, 1주 / 소수포·각화형: 1일 2회, 2–4주"},
            {rank:"보조", name:"클로트리마졸 + 베타메타손 복합", examples:["로트리손"], dosing:"염증·가려움 심할 때 단기(1–2주) 사용 — 스테로이드 포함이므로 장기 사용 금지"}
          ],
          nonPharm:["각화형은 각질 제거 후 항진균제 도포 효과 상승","요소크림 병행으로 각질 연화 가능"],
          counseling:["테르비나핀은 균진균 작용 — 아졸계보다 치료 기간 짧음","각화형 OTC 치료 실패율 높음 — 개선 없으면 경구 항진균제 처방 필요 안내"],
          referral:"2주 치료 후 호전 없거나 손발톱 침범 확인 시 피부과 진료 (경구 항진균제 필요)"}
      }
    },
    consultation:{
      patientPhrases:["발가락 사이가 짓무르고 가려워요","발바닥에 물집이 잡혀요","발이 냄새나고 각질이 심해요","무좀약을 발라도 계속 재발해요","발이 벗겨져요"],
      keyQuestions:[
        {q:"발가락 사이인가요, 발바닥인가요, 손발톱인가요?", why:"지간형/소수포형/각화형 구분 — 치료약 다름"},
        {q:"이전에 무좀 치료를 하신 적 있나요? 어떤 약을 쓰셨나요?", why:"치료 실패 이력 → 테르비나핀 우선 고려"},
        {q:"당뇨나 면역 질환이 있나요?", why:"합병증 위험 → 의뢰 여부 판단"},
        {q:"발이 붓거나 고름이 생겼나요?", why:"2차 세균감염 → 의뢰"}
      ],
      redFlagPhrases:["발이 빨갛게 붓고 뜨거워요","고름이 나와요","당뇨가 있는데 발에 상처가 났어요"],
      checkItems:["병변 부위 및 형태","당뇨/면역저하 여부","이전 항진균제 치료 여부","손발톱 침범 여부"]
    }
  },

  6: {
    id:6, partId:3, title:"손발톱무좀 (조갑진균증)",
    summary:"손·발톱의 피부사상균 감염에 대한 OTC 항진균 네일라커 선택 가이드",
    keywords:["조갑진균증","손발톱무좀","네일라커","아모롤핀","사이클로피록스","두꺼운손톱","변색"],
    algorithm:{
      start:"q_redflag",
      nodes:{
        q_redflag:{type:"question", text:"다음에 해당하나요?", subtext:"당뇨·면역저하·통증·화농·손톱 전체 침범 이상",
          options:[
            {label:"예 — 해당 있음", next:"w_redflag"},
            {label:"아니오 — 해당 없음", next:"q_extent"}
          ]},
        w_redflag:{type:"warning", text:"전문의 진료 권고",
          reasons:["당뇨·면역저하: 합병증 위험, 경구 항진균제 필요","손톱 뿌리(조갑기질) 침범 → OTC 치료 효과 낮음","화농·통증 → 세균 혼합 감염 가능성","손톱 전체 두꺼워짐+들뜸(전층 침범)"],
          action:"피부과 진료 — 경구 테르비나핀 또는 이트라코나졸 처방 필요"},
        q_extent:{type:"question", text:"손발톱 침범 범위는?",
          options:[
            {label:"손발톱 끝 1/2 이하 침범 (초기)", next:"r_lacquer"},
            {label:"1/2 이상 또는 뿌리 쪽까지 침범", next:"w_extensive"}
          ]},
        w_extensive:{type:"warning", text:"OTC 단독 치료 효과 제한적",
          reasons:["침범 범위 클수록 네일라커 단독 치료 성공률 낮음 (20–30%)","뿌리 침범 시 새 손톱이 자라야 완치 — 최소 6~12개월"],
          action:"피부과 진료 권고 — 경구 항진균제 병행 고려. OTC 네일라커는 보조 사용 가능"},
        r_lacquer:{type:"result", title:"조갑진균증 OTC 치료 — 항진균 네일라커",
          drugs:[
            {rank:"1차 선택", name:"아모롤핀 5% 네일라커", examples:["로세릴","아모롤핀라커"], dosing:"주 1–2회 도포. 발톱: 최소 6개월, 손톱: 최소 3개월"},
            {rank:"1차 선택", name:"사이클로피록스 8% 네일라커", examples:["로프록스","사이클로핀"], dosing:"초기 1개월: 매일 → 2개월: 격일 → 이후 주 2회. 총 6개월"}
          ],
          nonPharm:["감염된 손발톱 최대한 짧게 유지·줄로 갈기","적용 전 손발톱 표면 알코올로 닦기","도포 후 완전 건조 후 신발 착용","같은 손발톱깎이·줄 재사용 금지"],
          counseling:["완치까지 발톱 6~12개월, 손톱 3~6개월 — 장기 치료 미리 안내","증상 호전 후에도 새 손톱이 완전히 자랄 때까지 계속","치료 중 네일폴리시 사용 금지","OTC 성공률 약 30–50% — 치료 실패 시 처방 항진균제 안내"],
          referral:"3개월 치료 후 호전 없거나 악화 시 피부과 진료 (경구 항진균제 필요)"}
      }
    },
    consultation:{
      patientPhrases:["손발톱이 노랗게 변했어요","발톱이 두꺼워지고 부스러져요","발톱이 들뜨는 것 같아요","손톱 색이 이상해요"],
      keyQuestions:[
        {q:"손톱인가요, 발톱인가요? 몇 개나 침범했나요?", why:"치료 범위 결정"},
        {q:"침범 범위가 손발톱 끝 절반 이하인가요, 아니면 뿌리 쪽인가요?", why:"OTC 네일라커 적응 여부 판단"},
        {q:"당뇨나 면역 질환이 있나요?", why:"경구 항진균제 처방 필요 가능성"},
        {q:"이전에 치료해 본 적 있나요?", why:"재발 여부·경구 치료 필요성"}
      ],
      redFlagPhrases:["발톱 뿌리 쪽까지 다 변색됐어요","발톱이 다 들떴어요","당뇨가 있는데 발톱 주변에 염증이 생겼어요"],
      checkItems:["침범 손발톱 수·위치","침범 범위(끝 1/2 이하인지)","당뇨/면역저하 여부","이전 치료 여부"]
    }
  },

  7: {
    id:7, partId:3, title:"아토피 피부염",
    summary:"경증~중등도 아토피 피부염의 OTC 관리 — 보습제·저강도 스테로이드 외용제 선택 가이드",
    keywords:["아토피","습진","가려움","건조","스테로이드","보습","히드로코르티손"],
    algorithm:{
      start:"q_redflag",
      nodes:{
        q_redflag:{type:"question", text:"다음에 해당하나요?", subtext:"광범위한 피부 침범·진물·황색 가피·발열·6개월 미만 영아",
          options:[
            {label:"예 — 해당 있음", next:"w_redflag"},
            {label:"아니오 — 해당 없음", next:"q_severity"}
          ]},
        w_redflag:{type:"warning", text:"전문의 진료 권고",
          reasons:["광범위 침범(체표면 10% 이상) → 처방 스테로이드·면역조절제 필요","황색 가피·진물·발열 → 2차 세균감염(포도상구균) 가능성","6개월 미만 영아 → OTC 스테로이드 금기","눈 주위·얼굴 → 저강도 스테로이드도 신중 사용"],
          action:"피부과 또는 소아과 진료"},
        q_severity:{type:"question", text:"현재 증상 정도는?",
          options:[
            {label:"경증 — 건조·약간의 가려움, 붉은 기 약함", next:"q_location"},
            {label:"중등도 — 뚜렷한 홍반·태선화·지속 가려움", next:"r_steroid"}
          ]},
        q_location:{type:"question", text:"주요 발생 부위는?",
          options:[
            {label:"얼굴·눈 주위·생식기", next:"r_moisturizer_only"},
            {label:"몸통·팔다리 (얼굴 제외)", next:"r_mild_steroid"}
          ]},
        r_moisturizer_only:{type:"result", title:"경증 아토피 — 보습제 중심 관리",
          drugs:[
            {rank:"1차 선택", name:"세라마이드 함유 보습제", examples:["세타필","세라베","아토팜"], dosing:"목욕 직후 3분 이내 전신 도포, 1일 2회 이상"},
            {rank:"보조", name:"덱스판테놀 크림", examples:["비판텐","판테놀크림"], dosing:"1일 2~3회 도포 — 장벽 회복 보조"},
            {rank:"가려움 완화", name:"세티리진 또는 로라타딘 (경구)", examples:["지르텍","클라리틴"], dosing:"성인 1일 1회 — 야간 가려움 심할 때"}
          ],
          nonPharm:["미지근한 물로 10~15분 목욕 후 즉시 보습","면 소재 의류 착용","땀·먼지 자극 최소화","실내 습도 50~60% 유지"],
          counseling:["얼굴·눈 주위는 OTC 스테로이드 장기 사용 금지","보습제는 하루 최소 2회, 증상 없을 때도 지속","비누·세정제는 저자극·무향 제품 사용"],
          referral:"보습제만으로 2주 이상 호전 없으면 피부과 진료"},
        r_mild_steroid:{type:"result", title:"경증 아토피 (몸통·팔다리) — 히드로코르티손 외용",
          drugs:[
            {rank:"1차 선택", name:"히드로코르티손 1% 크림/연고", examples:["코르티존10","히드로코르티손크림"], dosing:"1일 1~2회 환부 도포, 1~2주 단기 사용 — 증상 호전 후 보습제로 전환"},
            {rank:"보습 병행", name:"세라마이드·유레아 보습제", examples:["세타필","아토팜"], dosing:"스테로이드 도포 후 또는 비염증 부위에 별도 적용"}
          ],
          nonPharm:["스테로이드 도포 후 밀폐 드레싱 금지 (흡수 과다)","증상 조절되면 격일 도포로 줄이다가 중단"],
          counseling:["히드로코르티손은 OTC 최저 역가 — 얼굴·피부 주름 부위 장기 사용 금지","연속 2주 이상 사용 금지 — 피부 위축 부작용","증상 없어지면 즉시 보습제로만 전환"],
          referral:"2주 사용 후 호전 없거나 재발 반복 시 피부과 진료"},
        r_steroid:{type:"result", title:"중등도 아토피 — OTC 한계 안내 + 보조 관리",
          drugs:[
            {rank:"보조", name:"히드로코르티손 1% 크림 (단기)", examples:["코르티존10"], dosing:"1일 2회, 최대 1주 — 단기 증상 완화만 목적"},
            {rank:"가려움 완화", name:"세티리진 경구", examples:["지르텍"], dosing:"성인 10 mg, 1일 1회 취침 전"}
          ],
          nonPharm:["냉찜질로 급성 가려움 완화","긁지 않도록 장갑 착용 (취침 시)"],
          counseling:["중등도 이상은 OTC로 장기 관리 어려움 — 처방 스테로이드·타크롤리무스 연고 필요","보습제는 반드시 지속 사용"],
          referral:"피부과 진료 권고 — 처방 외용제(중간 역가 스테로이드·타크롤리무스) 필요"}
      }
    },
    consultation:{
      patientPhrases:["피부가 너무 가려워요","긁으면 더 심해져요","피부가 건조하고 각질이 일어요","어릴 때부터 아토피가 있어요","보습제를 발라도 금방 건조해져요"],
      keyQuestions:[
        {q:"가려움이 얼마나 심한가요? 잠을 못 잘 정도인가요?", why:"중증도 평가 — OTC로 관리 가능 여부"},
        {q:"피부에 진물이나 황색 딱지가 있나요?", why:"2차 세균감염 가능성 → 의뢰"},
        {q:"환자 연령은? 6개월 미만 영아인가요?", why:"OTC 스테로이드 영아 금기"},
        {q:"얼굴이나 눈 주위인가요?", why:"스테로이드 부작용 위험 부위"},
        {q:"현재 어떤 보습제를 쓰고 있나요?", why:"보습 관리 수준 파악"}
      ],
      redFlagPhrases:["고름이 나고 피부가 뜨거워요","온몸에 번졌어요","열이 나요","아기인데 피부가 심하게 나빠졌어요"],
      checkItems:["연령(특히 6개월 미만)","병변 부위(얼굴 여부)","2차감염 징후","보습제 사용 여부","이전 치료 이력"]
    }
  },
};
