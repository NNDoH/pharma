import { useState } from "react";

const STORAGE_KEY = "pharma_rep_data_v2";

const sampleData = {
  visits: [
    { id: 1, date: "2026-03-26", area: "강남구 피부과 클러스터", purpose: "PsO 신규 치료 옵션 디테일링 — IL-23 억제제 임상 데이터 중심", checklist: [{ text: "최신 PsO 임상 결과 출력본 지참", done: true }, { text: "PASI 점수 개선 시각 자료 준비", done: true }, { text: "이전 방문 피드백 내용 복기", done: true }] },
    { id: 2, date: "2026-03-25", area: "서초구 피부과 A구역", purpose: "PPP 질환 교육 자료 공유 및 처방 패턴 파악", checklist: [{ text: "PPP 질환 설명 브로슈어 준비", done: true }, { text: "경쟁 제품 비교 자료 검토", done: false }] },
    { id: 3, date: "2026-03-24", area: "송파구 피부과 B구역", purpose: "PsO 가이드라인 업데이트 학술 정보 공유", checklist: [{ text: "AAD 최신 가이드라인 출력", done: true }, { text: "예상 Q&A 항목 정리", done: true }, { text: "샘플 키트 준비", done: true }] },
    { id: 4, date: "2026-03-20", area: "강남구 피부과 클러스터", purpose: "후속 방문 — 처방 경험 및 환자 반응 청취", checklist: [{ text: "이상반응 프로파일 비교표 지참", done: true }, { text: "환자 사례 논문 출력본", done: false }] },
    { id: 5, date: "2026-03-18", area: "마포구 피부과 C구역", purpose: "신규 접점 초회 방문 — 면역질환 제품 라인업 소개", checklist: [{ text: "회사·제품 라인업 소개 자료", done: true }, { text: "J&J IM 파이프라인 브로슈어", done: true }, { text: "명함 충분히 준비", done: true }] },
    { id: 6, date: "2026-03-12", area: "강동구 피부과 D구역", purpose: "Q1 활동 결과 공유 및 Q2 협력 방향 논의", checklist: [{ text: "Q1 방문 활동 정리 메모", done: false }, { text: "Q2 학술 행사 일정 안내", done: false }] },
  ],
  insights: [
    { id: 1, date: "2026-03-26", tag: "제품 반응", content: "강남구 피부과 방문 후 메모 — PsO 중등증 이상 환자에서 IL-23 억제제의 피부 소견 개선 속도에 긍정적 반응 체감. 특히 PASI 90 도달 기간 데이터에 관심 높음. 다음 방문 시 장기 유지 반응률 자료도 함께 준비할 것." },
    { id: 2, date: "2026-03-25", tag: "시장 동향", content: "서초 A구역 방문 중 파악 — PPP는 PsO 대비 인지도가 낮아 질환 교육 단계부터 접근이 필요한 상황. 해당 지역 내 PPP 진단 경험 있는 피부과 비중 파악 필요. 사내 Medical Affairs 팀과 질환 교육 자료 공동 활용 방안 검토 예정." },
    { id: 3, date: "2026-03-24", tag: "개인 개선", content: "오늘 가이드라인 공유 미팅에서 생물학적 제제 급여 기준 관련 질문에 즉답하지 못함. 건강보험 급여 조건 및 투여 기준 내용 추가 학습 필요. 이번 주 내 급여 가이드 정리 완료 목표." },
    { id: 4, date: "2026-03-18", tag: "시장 동향", content: "마포구 초회 방문 메모 — 최근 아토피 피부염 환자 증가로 생물학적 제제 전반에 대한 관심이 높아지는 분위기 감지. PsO/PPP 외 면역 피부질환 전반에 대한 포트폴리오 이해도를 높여두면 대화 폭이 넓어질 것 같음." },
    { id: 5, date: "2026-03-10", tag: "공부 메모", content: "이번 주 자체 학습 정리 — PsO 병태생리 복습 완료 (IL-17/IL-23 축). 핵심: TNF 억제제 → IL-17 억제제 → IL-23 억제제 순으로 진화한 치료 패러다임 흐름 숙지. 경쟁 제품 MOA 비교표 직접 작성해 암기 중." },
  ],
  goals: {
    monthly: [
      { id: 1, text: "3월 피부과 방문 목표 달성 (20회)", target: 20, progress: 14 },
      { id: 2, text: "PPP 질환 접점 신규 개척 (마포·강동 중심)", target: 5, progress: 2 },
      { id: 3, text: "PsO/PPP 임상 자료 자체 학습 세션", target: 4, progress: 3 },
    ],
    quarterly: [
      { id: 4, text: "Q1 담당 Territory 전 지역 방문 완료", target: 6, progress: 5 },
      { id: 5, text: "인사이트 메모 분기 누적 20건", target: 20, progress: 5 },
    ],
  },
  territories: [
    { id: 1, name: "강남구 피부과 클러스터", visitTarget: 6, visits: [
      { date: "2026-03-26", score: 4, checklistDone: 3, checklistTotal: 3 },
      { date: "2026-03-20", score: 3, checklistDone: 1, checklistTotal: 2 },
      { date: "2026-02-28", score: 4, checklistDone: 2, checklistTotal: 2 },
      { date: "2026-02-14", score: 5, checklistDone: 3, checklistTotal: 3 },
    ]},
    { id: 2, name: "서초구 피부과 A구역", visitTarget: 4, visits: [
      { date: "2026-03-25", score: 4, checklistDone: 1, checklistTotal: 2 },
      { date: "2026-03-05", score: 3, checklistDone: 2, checklistTotal: 2 },
      { date: "2026-02-20", score: 4, checklistDone: 2, checklistTotal: 2 },
    ]},
    { id: 3, name: "송파구 피부과 B구역", visitTarget: 4, visits: [
      { date: "2026-03-24", score: 5, checklistDone: 3, checklistTotal: 3 },
      { date: "2026-03-08", score: 4, checklistDone: 2, checklistTotal: 2 },
    ]},
    { id: 4, name: "마포구 피부과 C구역", visitTarget: 4, visits: [
      { date: "2026-03-18", score: 3, checklistDone: 3, checklistTotal: 3 },
    ]},
    { id: 5, name: "강동구 피부과 D구역", visitTarget: 4, visits: [
      { date: "2026-03-12", score: 2, checklistDone: 0, checklistTotal: 2 },
    ]},
    { id: 6, name: "용산구 피부과 E구역", visitTarget: 3, visits: [] },
  ],
};

const defaultData = sampleData;

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultData;
  } catch {
    return defaultData;
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const Icon = ({ name, size = 18 }) => {
  const icons = {
    calendar: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>),
    note: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>),
    target: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>),
    map: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>),
    plus: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>),
    check: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>),
    trash: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>),
    activity: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>),
    close: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
  };
  return icons[name] || null;
};

const cardStyle = { background: "#ffffff", border: "1px solid #e2e6ec", borderRadius: 14, padding: "16px 18px", marginBottom: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" };
const labelStyle = { fontSize: 11, color: "#7a8a9a", display: "block", marginBottom: 6, letterSpacing: "0.06em", fontFamily: "'DM Mono', monospace" };
const inputStyle = { width: "100%", padding: "10px 12px", background: "#f8f9fb", border: "1px solid #dde2ea", borderRadius: 8, color: "#1a2d45", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
const primaryBtn = { padding: "8px 20px", background: "linear-gradient(135deg, #1a6fc4, #3a9ee0)", border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" };
const ghostBtn = { padding: "8px 16px", background: "#fff", border: "1px solid #dde2ea", borderRadius: 8, color: "#4a6070", fontSize: 13, cursor: "pointer" };
const iconBtn = { background: "transparent", border: "none", color: "#b0bcc8", cursor: "pointer", padding: 4, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" };
const emptyState = { textAlign: "center", color: "#b0bcc8", fontSize: 13, padding: "32px 0", border: "1px dashed #d0d8e4", borderRadius: 12, fontFamily: "'DM Mono', monospace" };

function getTerritoryScore(t) {
  if (!t.visits || t.visits.length === 0) return null;
  const avgScore = t.visits.reduce((s, v) => s + (v.score || 0), 0) / t.visits.length;
  const checkTotal = t.visits.reduce((s, v) => s + (v.checklistTotal || 0), 0);
  const checkDone = t.visits.reduce((s, v) => s + (v.checklistDone || 0), 0);
  const checkRate = checkTotal > 0 ? checkDone / checkTotal : 1;
  const visitCount = t.visits.length;
  const visitTarget = t.visitTarget || 1;
  const achieveRate = Math.min(visitCount / visitTarget, 1);
  const composite = (avgScore / 5) * 0.4 + checkRate * 0.3 + achieveRate * 0.3;
  return { composite, avgScore, checkRate, achieveRate, visitCount };
}

function getScoreColor(composite) {
  if (composite === null) return { bg: "#f0f2f5", border: "#e2e6ec", label: "미방문", labelColor: "#8a9aaa", glow: "none" };
  if (composite >= 0.75) return { bg: "rgba(29,196,122,0.07)", border: "#1dc47a55", label: "우수", labelColor: "#1dc47a", glow: "0 2px 12px rgba(29,196,122,0.15)" };
  if (composite >= 0.5)  return { bg: "rgba(26,111,196,0.06)", border: "#4db8ff44", label: "양호", labelColor: "#1a6fc4", glow: "0 2px 12px rgba(26,111,196,0.12)" };
  if (composite >= 0.3)  return { bg: "rgba(196,180,29,0.07)", border: "#c4b41d44", label: "보통", labelColor: "#c4b41d", glow: "0 2px 10px rgba(196,180,29,0.1)" };
  return { bg: "rgba(196,74,29,0.06)", border: "#c44a1d44", label: "집중필요", labelColor: "#c44a1d", glow: "0 2px 10px rgba(196,74,29,0.12)" };
}

function MiniBar({ value, color }) {
  return (
    <div style={{ height: 4, background: "#f0f2f5", borderRadius: 2 }}>
      <div style={{ height: "100%", width: `${Math.round(value * 100)}%`, background: color, borderRadius: 2, transition: "width 0.4s" }} />
    </div>
  );
}

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} onClick={() => onChange(i)} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)}
          style={{ cursor: "pointer", color: i <= (hover || value) ? "#f5c542" : "#d0d7e3", fontSize: 26, lineHeight: 1 }}>★</span>
      ))}
    </div>
  );
}

function TerritoryDetailModal({ territory, onClose, onAddVisit, onDelete }) {
  const [form, setForm] = useState({ date: new Date().toISOString().split("T")[0], score: 3, checklistDone: 0, checklistTotal: 0 });
  const score = getTerritoryScore(territory);
  const colors = getScoreColor(score?.composite ?? null);

  const submit = () => {
    onAddVisit(territory.id, { ...form, score: Number(form.score), checklistDone: Number(form.checklistDone), checklistTotal: Number(form.checklistTotal) });
    setForm({ date: new Date().toISOString().split("T")[0], score: 3, checklistDone: 0, checklistTotal: 0 });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: "#f8f9fb", border: "1px solid #1d3a5a", borderRadius: "20px 20px 0 0", padding: 24, width: "100%", maxWidth: 680, maxHeight: "85vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: colors.labelColor, fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", marginBottom: 4 }}>TERRITORY DETAIL</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#0f1c2e" }}>{territory.name}</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { onDelete(territory.id); }} style={iconBtn}><Icon name="trash" size={16} /></button>
            <button onClick={onClose} style={iconBtn}><Icon name="close" size={18} /></button>
          </div>
        </div>

        {score && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 20 }}>
            {[
              { label: "방문", value: `${score.visitCount}회`, sub: `목표 ${territory.visitTarget}회` },
              { label: "반응점수", value: score.avgScore.toFixed(1), sub: "/ 5.0" },
              { label: "체크완료", value: `${Math.round(score.checkRate * 100)}%`, sub: "준비도" },
              { label: "달성률", value: `${Math.round(score.achieveRate * 100)}%`, sub: "방문목표" },
            ].map((s, i) => (
              <div key={i} style={{ background: "#ffffff", borderRadius: 10, padding: "10px 12px", border: "1px solid #162840" }}>
                <div style={{ fontSize: 10, color: "#6a8090", fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: colors.labelColor, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 10, color: "#8a9aaa", marginTop: 2 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ background: "#ffffff", border: "1px solid #162840", borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "#1a6fc4", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", marginBottom: 14 }}>+ 방문 기록 추가</div>
          <div style={{ marginBottom: 12 }}><label style={labelStyle}>날짜</label><input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inputStyle} /></div>
          <div style={{ marginBottom: 14 }}><label style={labelStyle}>체감 반응 점수</label><StarRating value={form.score} onChange={v => setForm({ ...form, score: v })} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div><label style={labelStyle}>체크리스트 완료 수</label><input type="number" min="0" value={form.checklistDone} onChange={e => setForm({ ...form, checklistDone: e.target.value })} style={inputStyle} /></div>
            <div><label style={labelStyle}>체크리스트 전체 수</label><input type="number" min="0" value={form.checklistTotal} onChange={e => setForm({ ...form, checklistTotal: e.target.value })} style={inputStyle} /></div>
          </div>
          <button onClick={submit} style={primaryBtn}>기록 저장</button>
        </div>

        <div style={{ fontSize: 11, color: "#4a6070", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", marginBottom: 12 }}>VISIT HISTORY</div>
        {(!territory.visits || territory.visits.length === 0) && <div style={emptyState}>아직 방문 기록이 없어요</div>}
        {[...(territory.visits || [])].reverse().map((v, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #e8ecf0" }}>
            <span style={{ fontSize: 12, color: "#4a6070", fontFamily: "'DM Mono', monospace" }}>{v.date}</span>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <span style={{ fontSize: 14, color: "#f5c542", letterSpacing: 2 }}>{"★".repeat(v.score)}{"☆".repeat(5 - v.score)}</span>
              {v.checklistTotal > 0 && <span style={{ fontSize: 11, color: "#7a90a0", fontFamily: "'DM Mono', monospace" }}>{v.checklistDone}/{v.checklistTotal} done</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TerritoryTab({ data, setData }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", visitTarget: 4 });
  const [selected, setSelected] = useState(null);
  const [sortBy, setSortBy] = useState("score");

  const addTerritory = () => {
    if (!form.name.trim()) return;
    const t = { id: Date.now(), name: form.name, visitTarget: Number(form.visitTarget) || 4, visits: [] };
    const updated = { ...data, territories: [...(data.territories || []), t] };
    setData(updated); saveData(updated);
    setForm({ name: "", visitTarget: 4 });
    setShowAdd(false);
  };

  const addVisit = (tid, visit) => {
    const updatedTerritories = data.territories.map(t => t.id === tid ? { ...t, visits: [...(t.visits || []), visit] } : t);
    const updated = { ...data, territories: updatedTerritories };
    setData(updated); saveData(updated);
    setSelected(updatedTerritories.find(t => t.id === tid));
  };

  const deleteTerritory = (tid) => {
    const updated = { ...data, territories: data.territories.filter(t => t.id !== tid) };
    setData(updated); saveData(updated);
    setSelected(null);
  };

  const territories = data.territories || [];
  const sorted = [...territories].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "visits") return (b.visits?.length || 0) - (a.visits?.length || 0);
    const sa = getTerritoryScore(a);
    const sb = getTerritoryScore(b);
    return (sb ? sb.composite : -1) - (sa ? sa.composite : -1);
  });

  const legend = [
    { label: "우수 ≥75%", color: "#1dc47a" },
    { label: "양호 ≥50%", color: "#1a6fc4" },
    { label: "보통 ≥30%", color: "#c4b41d" },
    { label: "집중필요", color: "#c44a1d" },
    { label: "미방문", color: "#8a9aaa" },
  ];

  return (
    <div>
      {selected && (
        <TerritoryDetailModal territory={selected} onClose={() => setSelected(null)} onAddVisit={addVisit} onDelete={deleteTerritory} />
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, color: "#1a6fc4", letterSpacing: "0.12em", fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>TERRITORY MAP</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#0f1c2e" }}>지역 성과 현황</div>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: showAdd ? "#e8ecf2" : "linear-gradient(135deg, #1a6fc4, #3a9ee0)", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          <Icon name="plus" size={16} /> 지역 추가
        </button>
      </div>

      {showAdd && (
        <div style={{ background: "#f0f2f5", border: "1px solid #1d3a5a", borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginBottom: 14 }}>
            <div><label style={labelStyle}>지역명</label><input placeholder="예: 강남구, 서초 A구역" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} onKeyDown={e => e.key === "Enter" && addTerritory()} /></div>
            <div><label style={labelStyle}>월 방문 목표</label><input type="number" min="1" value={form.visitTarget} onChange={e => setForm({ ...form, visitTarget: e.target.value })} style={inputStyle} /></div>
          </div>
          <div style={{ display: "flex", gap: 10 }}><button onClick={addTerritory} style={primaryBtn}>추가</button><button onClick={() => setShowAdd(false)} style={ghostBtn}>취소</button></div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {legend.map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
              <span style={{ fontSize: 10, color: "#6a8090", fontFamily: "'DM Mono', monospace" }}>{l.label}</span>
            </div>
          ))}
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ ...inputStyle, width: "auto", fontSize: 11, padding: "5px 10px" }}>
          <option value="score">성과순</option>
          <option value="visits">방문순</option>
          <option value="name">이름순</option>
        </select>
      </div>

      {territories.length === 0 && <div style={emptyState}>담당 지역을 추가해보세요</div>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {sorted.map(t => {
          const score = getTerritoryScore(t);
          const c = getScoreColor(score?.composite ?? null);
          const pct = score ? Math.round(score.composite * 100) : null;

          return (
            <div key={t.id} onClick={() => setSelected(t)} style={{ background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: 14, padding: "16px 14px", cursor: "pointer", boxShadow: c.glow, transition: "transform 0.15s", position: "relative" }}>
              <div style={{ position: "absolute", top: 10, right: 10, fontSize: 10, fontWeight: 700, color: c.labelColor, fontFamily: "'DM Mono', monospace", background: `${c.labelColor}22`, border: `1px solid ${c.labelColor}44`, padding: "2px 8px", borderRadius: 20 }}>
                {c.label}
              </div>

              <div style={{ fontSize: 15, fontWeight: 800, color: "#0f1c2e", marginBottom: 3, paddingRight: 60, lineHeight: 1.3 }}>{t.name}</div>
              <div style={{ fontSize: 10, color: "#6a8090", fontFamily: "'DM Mono', monospace", marginBottom: 14 }}>목표 {t.visitTarget}회/월</div>

              {score ? (
                <>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 10, color: "#6a8090", fontFamily: "'DM Mono', monospace" }}>종합 성과</span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: c.labelColor, fontFamily: "'DM Mono', monospace" }}>{pct}%</span>
                    </div>
                    <div style={{ height: 5, background: "#f0f2f5", borderRadius: 3 }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: c.labelColor, borderRadius: 3, transition: "width 0.4s", opacity: 0.9 }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                        <span style={{ fontSize: 10, color: "#8a9aaa", fontFamily: "'DM Mono', monospace" }}>체감 반응</span>
                        <span style={{ fontSize: 10, color: "#5a7890", fontFamily: "'DM Mono', monospace" }}>{score.avgScore.toFixed(1)}/5</span>
                      </div>
                      <MiniBar value={score.avgScore / 5} color="#f5c542" />
                    </div>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                        <span style={{ fontSize: 10, color: "#8a9aaa", fontFamily: "'DM Mono', monospace" }}>체크 완료율</span>
                        <span style={{ fontSize: 10, color: "#5a7890", fontFamily: "'DM Mono', monospace" }}>{Math.round(score.checkRate * 100)}%</span>
                      </div>
                      <MiniBar value={score.checkRate} color="#1a6fc4" />
                    </div>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                        <span style={{ fontSize: 10, color: "#8a9aaa", fontFamily: "'DM Mono', monospace" }}>방문 달성</span>
                        <span style={{ fontSize: 10, color: "#5a7890", fontFamily: "'DM Mono', monospace" }}>{score.visitCount}/{t.visitTarget}회</span>
                      </div>
                      <MiniBar value={score.achieveRate} color="#1dc47a" />
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ fontSize: 12, color: "#d0d7e3", fontFamily: "'DM Mono', monospace", paddingTop: 8 }}>탭해서 방문 기록 추가 →</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HeatmapView({ visits }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(year, month - i, 1);
    months.push({ year: d.getFullYear(), month: d.getMonth() });
  }
  const countMap = {};
  visits.forEach(v => { countMap[v.date] = (countMap[v.date] || 0) + 1; });
  const maxCount = Math.max(...Object.values(countMap), 1);
  const getColor = c => {
    if (!c) return "#e8edf3";
    const intensity = c / maxCount;
    if (intensity < 0.33) return "#bdd4f0";
    if (intensity < 0.66) return "#1d6fc4";
    return "#1a6fc4";
  };
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {months.map(({ year: y, month: m }) => {
        const daysInMonth = new Date(y, m + 1, 0).getDate();
        const firstDay = new Date(y, m, 1).getDay();
        const cells = [];
        for (let i = 0; i < firstDay; i++) cells.push(null);
        for (let d = 1; d <= daysInMonth; d++) {
          const dateStr = `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
          cells.push({ day: d, dateStr, count: countMap[dateStr] || 0 });
        }
        const totalVisits = cells.filter(Boolean).reduce((s, c) => s + c.count, 0);
        return (
          <div key={`${y}-${m}`}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#4a6a8a", letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace" }}>{monthNames[m].toUpperCase()} {y}</span>
              <span style={{ fontSize: 12, color: "#1a6fc4", fontFamily: "'DM Mono', monospace" }}>{totalVisits} visits</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
              {["S","M","T","W","T","F","S"].map((d, i) => (
                <div key={i} style={{ textAlign: "center", fontSize: 10, color: "#6a8090", fontFamily: "'DM Mono', monospace", paddingBottom: 4 }}>{d}</div>
              ))}
              {cells.map((cell, i) => cell === null ? <div key={i} /> : (
                <div key={i} style={{ aspectRatio: "1", borderRadius: 4, backgroundColor: getColor(cell.count), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: cell.count ? "#1a3050" : "#b0bcc8", fontFamily: "'DM Mono', monospace" }}>
                  {cell.day}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function VisitTab({ data, setData }) {
  const [form, setForm] = useState({ date: new Date().toISOString().split("T")[0], area: "", purpose: "", checklist: "" });
  const [showForm, setShowForm] = useState(false);

  const addVisit = () => {
    if (!form.area) return;
    const visit = { id: Date.now(), date: form.date, area: form.area, purpose: form.purpose, checklist: form.checklist.split("\n").filter(Boolean).map(t => ({ text: t, done: false })) };
    const updated = { ...data, visits: [visit, ...data.visits] };
    setData(updated); saveData(updated);
    setForm({ date: new Date().toISOString().split("T")[0], area: "", purpose: "", checklist: "" });
    setShowForm(false);
  };

  const removeVisit = id => {
    const updated = { ...data, visits: data.visits.filter(v => v.id !== id) };
    setData(updated); saveData(updated);
  };

  const toggleCheck = (visitId, idx) => {
    const updated = { ...data, visits: data.visits.map(v => v.id === visitId ? { ...v, checklist: v.checklist.map((c, i) => i === idx ? { ...c, done: !c.done } : c) } : v) };
    setData(updated); saveData(updated);
  };

  const grouped = data.visits.reduce((acc, v) => { acc[v.date] = acc[v.date] || []; acc[v.date].push(v); return acc; }, {});
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, color: "#1a6fc4", letterSpacing: "0.12em", fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>SCHEDULE</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#0f1c2e" }}>방문 일정</div>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: showForm ? "#e8ecf2" : "linear-gradient(135deg, #1a6fc4, #3a9ee0)", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          <Icon name="plus" size={16} /> 추가
        </button>
      </div>
      {showForm && (
        <div style={{ background: "#f0f2f5", border: "1px solid #1d3a5a", borderRadius: 14, padding: 20, marginBottom: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div><label style={labelStyle}>날짜</label><input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inputStyle} /></div>
            <div><label style={labelStyle}>지역 / 병원 유형</label><input placeholder="예: 강남구 내과" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} style={inputStyle} /></div>
          </div>
          <div style={{ marginBottom: 12 }}><label style={labelStyle}>방문 목적</label><input placeholder="예: 신제품 소개" value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} style={inputStyle} /></div>
          <div style={{ marginBottom: 16 }}><label style={labelStyle}>체크리스트 (줄바꿈 구분)</label><textarea placeholder={"샘플 챙기기\n디테일러 준비\n이전 방문 복기"} value={form.checklist} onChange={e => setForm({ ...form, checklist: e.target.value })} rows={3} style={{ ...inputStyle, resize: "vertical" }} /></div>
          <div style={{ display: "flex", gap: 10 }}><button onClick={addVisit} style={primaryBtn}>저장</button><button onClick={() => setShowForm(false)} style={ghostBtn}>취소</button></div>
        </div>
      )}
      {sortedDates.length === 0 && <div style={emptyState}>방문 일정을 추가해보세요</div>}
      {sortedDates.map(date => (
        <div key={date} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: "#1a6fc4", fontFamily: "'DM Mono', monospace", marginBottom: 10 }}>{date}</div>
          {grouped[date].map(v => (
            <div key={v.id} style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #1a4a7a, #1d6fc4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#1a6fc4" }}><Icon name="map" size={16} /></div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#0f1c2e" }}>{v.area}</div>
                    {v.purpose && <div style={{ fontSize: 12, color: "#5a7890", marginTop: 2 }}>{v.purpose}</div>}
                  </div>
                </div>
                <button onClick={() => removeVisit(v.id)} style={iconBtn}><Icon name="trash" size={14} /></button>
              </div>
              {v.checklist.length > 0 && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #162840" }}>
                  {v.checklist.map((item, idx) => (
                    <div key={idx} onClick={() => toggleCheck(v.id, idx)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", cursor: "pointer" }}>
                      <div style={{ width: 18, height: 18, borderRadius: 5, border: item.done ? "none" : "1.5px solid #2a5a8a", background: item.done ? "linear-gradient(135deg, #1d6fc4, #4db8ff)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {item.done && <Icon name="check" size={11} />}
                      </div>
                      <span style={{ fontSize: 13, color: item.done ? "#7a90a0" : "#2d4a6a", textDecoration: item.done ? "line-through" : "none" }}>{item.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

const TAGS = ["제품 반응", "경쟁사", "시장 동향", "개인 개선", "공부 메모", "기타"];
const tagColor = tag => ({ "제품 반응": "#1d6fc4", "경쟁사": "#c44a1d", "시장 동향": "#1dc47a", "개인 개선": "#c4b41d", "공부 메모": "#9b1dc4", "기타": "#6a8090" }[tag] || "#6a8090");

function InsightTab({ data, setData }) {
  const [form, setForm] = useState({ date: new Date().toISOString().split("T")[0], content: "", tag: "기타" });
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("전체");

  const addInsight = () => {
    if (!form.content.trim()) return;
    const insight = { id: Date.now(), ...form };
    const updated = { ...data, insights: [insight, ...data.insights] };
    setData(updated); saveData(updated);
    setForm({ date: new Date().toISOString().split("T")[0], content: "", tag: "기타" });
    setShowForm(false);
  };

  const remove = id => {
    const updated = { ...data, insights: data.insights.filter(i => i.id !== id) };
    setData(updated); saveData(updated);
  };

  const filtered = filter === "전체" ? data.insights : data.insights.filter(i => i.tag === filter);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, color: "#1a6fc4", letterSpacing: "0.12em", fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>INSIGHTS</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#0f1c2e" }}>인사이트 메모</div>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: showForm ? "#e8ecf2" : "linear-gradient(135deg, #1a6fc4, #3a9ee0)", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          <Icon name="plus" size={16} /> 추가
        </button>
      </div>
      {showForm && (
        <div style={{ background: "#f0f2f5", border: "1px solid #1d3a5a", borderRadius: 14, padding: 20, marginBottom: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div><label style={labelStyle}>날짜</label><input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inputStyle} /></div>
            <div><label style={labelStyle}>태그</label><select value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} style={inputStyle}>{TAGS.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
          </div>
          <div style={{ marginBottom: 16 }}><label style={labelStyle}>메모 내용</label><textarea placeholder="방문 후 느낀 점, 시장 반응, 보완할 점 등" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={4} style={{ ...inputStyle, resize: "vertical" }} /></div>
          <div style={{ display: "flex", gap: 10 }}><button onClick={addInsight} style={primaryBtn}>저장</button><button onClick={() => setShowForm(false)} style={ghostBtn}>취소</button></div>
        </div>
      )}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["전체", ...TAGS].map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{ padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", background: filter === t ? tagColor(t) : "#f0f2f5", color: filter === t ? "#fff" : "#4a6070" }}>{t}</button>
        ))}
      </div>
      {filtered.length === 0 && <div style={emptyState}>인사이트를 기록해보세요</div>}
      {filtered.map(ins => (
        <div key={ins.id} style={{ ...cardStyle, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: tagColor(ins.tag) + "33", color: tagColor(ins.tag), border: `1px solid ${tagColor(ins.tag)}55` }}>{ins.tag}</span>
              <span style={{ fontSize: 11, color: "#6a8090", fontFamily: "'DM Mono', monospace" }}>{ins.date}</span>
            </div>
            <button onClick={() => remove(ins.id)} style={iconBtn}><Icon name="trash" size={14} /></button>
          </div>
          <p style={{ fontSize: 14, color: "#2d4a6a", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>{ins.content}</p>
        </div>
      ))}
    </div>
  );
}

function GoalsTab({ data, setData }) {
  const [form, setForm] = useState({ type: "monthly", text: "", target: "" });
  const [showForm, setShowForm] = useState(false);

  const addGoal = () => {
    if (!form.text.trim()) return;
    const goal = { id: Date.now(), text: form.text, target: Number(form.target) || 0, progress: 0 };
    const updated = { ...data, goals: { ...data.goals, [form.type]: [goal, ...data.goals[form.type]] } };
    setData(updated); saveData(updated);
    setForm({ type: "monthly", text: "", target: "" });
    setShowForm(false);
  };

  const updateProgress = (type, id, delta) => {
    const updated = { ...data, goals: { ...data.goals, [type]: data.goals[type].map(g => g.id === id ? { ...g, progress: Math.max(0, Math.min(g.target || 100, g.progress + delta)) } : g) } };
    setData(updated); saveData(updated);
  };

  const removeGoal = (type, id) => {
    const updated = { ...data, goals: { ...data.goals, [type]: data.goals[type].filter(g => g.id !== id) } };
    setData(updated); saveData(updated);
  };

  const GoalCard = ({ goal, type }) => {
    const pct = goal.target ? Math.round((goal.progress / goal.target) * 100) : 0;
    return (
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#1a2d45", flex: 1, paddingRight: 10 }}>{goal.text}</span>
          <button onClick={() => removeGoal(type, goal.id)} style={iconBtn}><Icon name="trash" size={14} /></button>
        </div>
        {goal.target > 0 && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "#4a6070" }}>진행도</span>
              <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: pct >= 100 ? "#1a6fc4" : "#4a6a8a" }}>{goal.progress} / {goal.target} ({pct}%)</span>
            </div>
            <div style={{ height: 6, background: "#f0f2f5", borderRadius: 3, marginBottom: 12 }}>
              <div style={{ height: "100%", borderRadius: 3, width: `${Math.min(pct, 100)}%`, background: pct >= 100 ? "linear-gradient(90deg, #1dc47a, #4dffd4)" : "linear-gradient(90deg, #1d6fc4, #4db8ff)" }} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => updateProgress(type, goal.id, -1)} style={ghostBtn}>−1</button>
              <button onClick={() => updateProgress(type, goal.id, 1)} style={primaryBtn}>+1</button>
              <button onClick={() => updateProgress(type, goal.id, 10)} style={{ ...ghostBtn, marginLeft: "auto" }}>+10</button>
            </div>
          </>
        )}
      </div>
    );
  };

  const thisMonth = new Date().toLocaleString("ko-KR", { month: "long" });
  const quarter = Math.ceil((new Date().getMonth() + 1) / 3);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, color: "#1a6fc4", letterSpacing: "0.12em", fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>GOALS</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#0f1c2e" }}>목표 트래킹</div>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: showForm ? "#e8ecf2" : "linear-gradient(135deg, #1a6fc4, #3a9ee0)", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          <Icon name="plus" size={16} /> 추가
        </button>
      </div>
      {showForm && (
        <div style={{ background: "#f0f2f5", border: "1px solid #1d3a5a", borderRadius: 14, padding: 20, marginBottom: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div><label style={labelStyle}>구분</label><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle}><option value="monthly">월간 목표</option><option value="quarterly">분기 목표</option></select></div>
            <div><label style={labelStyle}>목표 수치 (선택)</label><input type="number" placeholder="예: 20" value={form.target} onChange={e => setForm({ ...form, target: e.target.value })} style={inputStyle} /></div>
          </div>
          <div style={{ marginBottom: 16 }}><label style={labelStyle}>목표 내용</label><input placeholder="예: 이달 방문 20회 달성" value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} style={inputStyle} /></div>
          <div style={{ display: "flex", gap: 10 }}><button onClick={addGoal} style={primaryBtn}>저장</button><button onClick={() => setShowForm(false)} style={ghostBtn}>취소</button></div>
        </div>
      )}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, color: "#1a6fc4", fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 3, height: 14, background: "#1a6fc4", borderRadius: 2, display: "inline-block" }} />{thisMonth} 월간 목표
        </div>
        {data.goals.monthly.length === 0 && <div style={emptyState}>월간 목표를 추가해보세요</div>}
        {data.goals.monthly.map(g => <GoalCard key={g.id} goal={g} type="monthly" />)}
      </div>
      <div>
        <div style={{ fontSize: 13, color: "#c47a1d", fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 3, height: 14, background: "#c47a1d", borderRadius: 2, display: "inline-block" }} />Q{quarter} 분기 목표
        </div>
        {data.goals.quarterly.length === 0 && <div style={emptyState}>분기 목표를 추가해보세요</div>}
        {data.goals.quarterly.map(g => <GoalCard key={g.id} goal={g} type="quarterly" />)}
      </div>
    </div>
  );
}

function SummaryBar({ data }) {
  const today = new Date().toISOString().split("T")[0];
  const thisMonth = today.slice(0, 7);
  const todayVisits = data.visits.filter(v => v.date === today).length;
  const monthVisits = data.visits.filter(v => v.date.startsWith(thisMonth)).length;
  const territories = data.territories || [];
  const scores = territories.map(t => getTerritoryScore(t)).filter(Boolean);
  const avgPerf = scores.length > 0 ? Math.round(scores.reduce((s, c) => s + c.composite, 0) / scores.length * 100) : null;

  const stats = [
    { label: "오늘 방문", value: todayVisits, unit: "건" },
    { label: "이달 방문", value: monthVisits, unit: "건" },
    { label: "담당 지역", value: territories.length, unit: "곳" },
    { label: "평균 성과", value: avgPerf !== null ? avgPerf : "—", unit: avgPerf !== null ? "%" : "" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 28 }}>
      {stats.map((s, i) => (
        <div key={i} style={{ background: "#ffffff", border: "1px solid #162840", borderRadius: 12, padding: "14px 16px" }}>
          <div style={{ fontSize: 10, color: "#6a8090", letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace", marginBottom: 6 }}>{s.label}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#1a6fc4", fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>
            {s.value}<span style={{ fontSize: 12, color: "#5a7890", marginLeft: 2 }}>{s.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [data, setData] = useState(loadData);
  const [tab, setTab] = useState("territory");
  const [showHeatmap, setShowHeatmap] = useState(false);

  const tabs = [
    { id: "territory", label: "Territory", icon: "map" },
    { id: "visit", label: "방문 일정", icon: "calendar" },
    { id: "insight", label: "인사이트", icon: "note" },
    { id: "goals", label: "목표", icon: "target" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6f9", fontFamily: "'Pretendard', 'Apple SD Gothic Neo', -apple-system, sans-serif", color: "#1a2d45" }}>
      <div style={{ borderBottom: "1px solid #e8ecf0", padding: "0 20px", background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg, #1d6fc4, #4db8ff)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="activity" size={16} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#0f1c2e", letterSpacing: "-0.02em" }}>RepFlow</div>
              <div style={{ fontSize: 10, color: "#8a9aaa", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em" }}>PERSONAL TOOL</div>
            </div>
          </div>
          <button onClick={() => setShowHeatmap(!showHeatmap)} style={{ ...ghostBtn, fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="activity" size={13} /> 히트맵
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px" }}>
        <SummaryBar data={data} />

        {showHeatmap && (
          <div style={{ ...cardStyle, marginBottom: 24 }}>
            <div style={{ fontSize: 12, color: "#1a6fc4", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", marginBottom: 16 }}>VISIT HEATMAP</div>
            <HeatmapView visits={data.visits} />
          </div>
        )}

        <div style={{ display: "flex", background: "#ffffff", borderRadius: 12, padding: 4, marginBottom: 24, border: "1px solid #0d1f30" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "9px 4px", border: "none", borderRadius: 9, cursor: "pointer", background: tab === t.id ? "linear-gradient(135deg, #0d2a45, #1a4a7a)" : "transparent", color: tab === t.id ? "#1a6fc4" : "#8a9aaa", fontSize: 11, fontWeight: tab === t.id ? 700 : 500, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, transition: "all 0.2s" }}>
              <Icon name={t.icon} size={13} />{t.label}
            </button>
          ))}
        </div>

        {tab === "territory" && <TerritoryTab data={data} setData={setData} />}
        {tab === "visit" && <VisitTab data={data} setData={setData} />}
        {tab === "insight" && <InsightTab data={data} setData={setData} />}
        {tab === "goals" && <GoalsTab data={data} setData={setData} />}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        input, textarea, select { color: #1a2d45 !important; }
        input::placeholder, textarea::placeholder { color: #b0bcc8 !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #c8d0dc; border-radius: 2px; }
        button:hover { opacity: 0.85; }
        select option { background: #ffffff; color: #1a2d45; }
      `}</style>
    </div>
  );
}
