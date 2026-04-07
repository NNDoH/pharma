import { useState, useMemo } from "react";
import "./index.css";
import { PARTS, CHAPTERS } from "./data/chapters";

// ── helpers ───────────────────────────────────────────────────────────────────
function getPartForChapter(chId) {
  return PARTS.find((p) => p.chapterIds.includes(chId));
}
function getAllChapters() {
  return Object.values(CHAPTERS);
}

// route 추론 (구형 데이터 호환)
function inferRoute(drug) {
  if (drug.route) return drug.route;
  const name = drug.name ?? "";
  const rank = drug.rank ?? "";
  if (rank === "외용제") return "외용";
  if (/패치|겔|크림|연고|로션|스프레이|파스/.test(name)) return "외용";
  if (/점안|안약/.test(name)) return "점안";
  if (/비강|코/.test(name)) return "비강";
  if (/좌약|질정/.test(name)) return "질내/항문";
  return "경구";
}

// 우선순위 숫자 추론
function inferPriority(drug) {
  if (drug.priority !== undefined) return drug.priority;
  if (drug.rank === "1차 선택") return 1;
  if (drug.rank === "2차 선택") return 2;
  if (drug.rank === "3차 선택") return 3;
  if (drug.rank?.startsWith("보조")) return 4;
  return 5;
}

const ROUTE_ORDER = ["경구", "외용", "비강", "점안", "질내/항문", "기타"];
const ROUTE_ICON  = { 경구: "💊", 외용: "🩹", 비강: "👃", 점안: "👁️", "질내/항문": "💊", 기타: "🔹" };
const PRIORITY_LABEL = { 1: "1차", 2: "2차", 3: "3차", 4: "보조" };
const PRIORITY_CLASS  = { 1: "first", 2: "second", 3: "third", 4: "supplement" };

// ── DrugCard ──────────────────────────────────────────────────────────────────
function DrugCard({ drug, showRoute = false }) {
  const priority = inferPriority(drug);
  const pLabel = PRIORITY_LABEL[priority] ?? drug.rank ?? "";
  const pClass = PRIORITY_CLASS[priority] ?? "alt";

  return (
    <div className="drug-card">
      <div className="drug-card-header">
        {pLabel && <span className={`drug-rank ${pClass}`}>{pLabel}</span>}
        {showRoute && (
          <span className="drug-route-badge">
            {ROUTE_ICON[inferRoute(drug)]} {inferRoute(drug)}
          </span>
        )}
        <div className="drug-name">{drug.name}</div>
      </div>
      {drug.examples?.length > 0 && (
        <div className="drug-examples">
          {drug.examples.map((e, i) => <span key={i}>{e}</span>)}
        </div>
      )}
      {drug.dosing && <div className="drug-dosing">{drug.dosing}</div>}
      {drug.cautions?.length > 0 && (
        <div className="drug-cautions">
          {drug.cautions.map((c, i) => <div className="drug-caution-item" key={i}>⚠ {c}</div>)}
        </div>
      )}
    </div>
  );
}

// ── DrugsByRoute — route별 그룹 렌더링 ────────────────────────────────────────
function DrugsByRoute({ drugs }) {
  const grouped = useMemo(() => {
    const map = {};
    drugs.forEach((d) => {
      const r = inferRoute(d);
      if (!map[r]) map[r] = [];
      map[r].push(d);
    });
    // 각 그룹 내 priority 정렬
    Object.values(map).forEach((arr) => arr.sort((a, b) => inferPriority(a) - inferPriority(b)));
    return map;
  }, [drugs]);

  const presentRoutes = ROUTE_ORDER.filter((r) => grouped[r]);
  // ROUTE_ORDER에 없는 route도 처리
  const extraRoutes = Object.keys(grouped).filter((r) => !ROUTE_ORDER.includes(r));

  return (
    <div className="drugs-by-route">
      {[...presentRoutes, ...extraRoutes].map((route) => (
        <div key={route} className="route-group">
          <div className="route-group-header">
            <span>{ROUTE_ICON[route] ?? "🔹"}</span>
            <span>{route}</span>
          </div>
          <div className="drug-list">
            {grouped[route].map((d, i) => <DrugCard key={i} drug={d} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Algorithm engine ──────────────────────────────────────────────────────────
function useAlgorithm(chapter) {
  const [history, setHistory] = useState([]);
  const [currentId, setCurrentId] = useState(chapter?.algorithm?.start ?? null);
  const currentNode = chapter?.algorithm?.nodes?.[currentId] ?? null;

  function choose(option) {
    setHistory((h) => [...h, { nodeId: currentId, choiceLabel: option.label }]);
    setCurrentId(option.next);
  }
  function back() {
    if (!history.length) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setCurrentId(prev.nodeId);
  }
  function reset() {
    setHistory([]);
    setCurrentId(chapter?.algorithm?.start ?? null);
  }
  function init(ch) {
    setHistory([]);
    setCurrentId(ch?.algorithm?.start ?? null);
  }
  return { currentNode, history, choose, back, reset, init };
}

// ── Algorithm node components ─────────────────────────────────────────────────
function QuestionNode({ node, onChoose }) {
  const labels = "ABCDEFGHIJ";
  return (
    <div className="algo-card question">
      <div className="algo-label">질문</div>
      <div className="algo-question">{node.text}</div>
      {node.subtext && <div className="algo-subtext">{node.subtext}</div>}
      <div className="options-list">
        {(node.options ?? []).map((opt, i) => (
          <button key={i} className="option-btn" onClick={() => onChoose(opt)}>
            <span className="option-icon">{labels[i]}</span>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function WarningNode({ node, onBack, onReset }) {
  return (
    <div className="algo-card warning">
      <div className="algo-label">⛔ 전문의 상담 필요</div>
      <div className="warning-title">{node.text}</div>
      {node.reasons?.length > 0 && (
        <ul className="warning-list">
          {node.reasons.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      )}
      {node.action && <div className="warning-action">{node.action}</div>}
      <div className="algo-nav" style={{ marginTop: 14 }}>
        {onBack && <button className="btn btn-ghost btn-sm" onClick={onBack}>← 이전</button>}
        <button className="btn btn-ghost btn-sm" onClick={onReset}>처음부터</button>
      </div>
    </div>
  );
}

function ResultNode({ node, onBack, onReset }) {
  return (
    <div className="algo-card result">
      <div className="algo-label">✓ 권장 치료</div>
      <div className="result-title">{node.title}</div>

      {node.drugs?.length > 0 && (
        <>
          <div className="section-label">약물 선택</div>
          <DrugsByRoute drugs={node.drugs} />
        </>
      )}

      {node.nonPharm?.length > 0 && (
        <>
          <div className="section-label">비약물 요법</div>
          <ul className="bullet-list">
            {node.nonPharm.map((x, i) => <li key={i}>{x}</li>)}
          </ul>
        </>
      )}

      {node.counseling?.length > 0 && (
        <>
          <div className="section-label">복약 지도 포인트</div>
          <ul className="bullet-list">
            {node.counseling.map((x, i) => <li key={i}>{x}</li>)}
          </ul>
        </>
      )}

      {node.referral && <div className="referral-box">{node.referral}</div>}

      <div className="algo-nav" style={{ marginTop: 14 }}>
        {onBack && <button className="btn btn-ghost btn-sm" onClick={onBack}>← 이전</button>}
        <button className="btn btn-ghost btn-sm" onClick={onReset}>처음부터</button>
      </div>
    </div>
  );
}

function AlgorithmView({ chapter }) {
  const algo = useAlgorithm(chapter);
  const [lastChapterId, setLastChapterId] = useState(chapter?.id);
  if (chapter?.id !== lastChapterId) {
    setLastChapterId(chapter.id);
    algo.init(chapter);
  }
  const { currentNode, history, choose, back, reset } = algo;

  return (
    <div className="algo-flow">
      {history.length > 0 && (
        <div className="path-trail">
          {history.map((h, i) => {
            const node = chapter.algorithm.nodes[h.nodeId];
            return (
              <span key={i} className="path-crumb">
                <span className="path-crumb-q">
                  {(node?.text?.length > 18) ? node.text.slice(0, 18) + "…" : node?.text}
                </span>
                <span className="path-arrow">→</span>
                <strong>{h.choiceLabel?.length > 14 ? h.choiceLabel.slice(0, 14) + "…" : h.choiceLabel}</strong>
              </span>
            );
          })}
        </div>
      )}

      {!currentNode && (
        <div className="algo-card">
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>알고리즘 데이터를 준비 중입니다.</p>
        </div>
      )}

      {currentNode?.type === "question" && <QuestionNode node={currentNode} onChoose={choose} />}
      {currentNode?.type === "warning" && (
        <WarningNode node={currentNode} onBack={history.length > 0 ? back : null} onReset={reset} />
      )}
      {currentNode?.type === "result" && (
        <ResultNode node={currentNode} onBack={history.length > 0 ? back : null} onReset={reset} />
      )}

      {currentNode?.type === "question" && history.length > 0 && (
        <div className="algo-nav">
          <button className="btn btn-ghost btn-sm" onClick={back}>← 이전</button>
          <button className="btn btn-ghost btn-sm" onClick={reset}>처음부터</button>
        </div>
      )}
    </div>
  );
}

// ── Quick Reference (약물 요약) ────────────────────────────────────────────────
function QuickReference({ chapter }) {
  const allDrugs = useMemo(() => {
    const seen = new Set();
    const drugs = [];
    if (!chapter?.algorithm?.nodes) return drugs;
    Object.values(chapter.algorithm.nodes).forEach((node) => {
      if (node.type === "result" && node.drugs) {
        node.drugs.forEach((d) => {
          if (!seen.has(d.name)) { seen.add(d.name); drugs.push(d); }
        });
      }
    });
    return drugs;
  }, [chapter]);

  const allCounseling = useMemo(() => {
    const pts = new Set();
    if (!chapter?.algorithm?.nodes) return [];
    Object.values(chapter.algorithm.nodes).forEach((node) => {
      if (node.type === "result") node.counseling?.forEach((c) => pts.add(c));
    });
    return [...pts];
  }, [chapter]);

  const referrals = useMemo(() => {
    const pts = new Set();
    if (!chapter?.algorithm?.nodes) return [];
    Object.values(chapter.algorithm.nodes).forEach((node) => {
      if (node.type === "result" && node.referral) pts.add(node.referral);
      if (node.type === "warning" && node.action) pts.add(node.action);
    });
    return [...pts];
  }, [chapter]);

  return (
    <div>
      {allDrugs.length > 0 && (
        <>
          <div className="section-label" style={{ marginTop: 0 }}>약물 전체 목록</div>
          <DrugsByRoute drugs={allDrugs} />
        </>
      )}
      {allCounseling.length > 0 && (
        <>
          <div className="section-label">복약 지도 포인트</div>
          <div className="info-box">
            <ul className="bullet-list">
              {allCounseling.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
        </>
      )}
      {referrals.length > 0 && (
        <>
          <div className="section-label">전문의 상담 기준</div>
          {referrals.map((r, i) => <div key={i} className="referral-box">{r}</div>)}
        </>
      )}
    </div>
  );
}

// ── Consultation Guide (상담 가이드) ──────────────────────────────────────────
function ConsultationGuide({ chapter }) {
  const c = chapter?.consultation;

  if (!c) {
    return (
      <div className="algo-card" style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
        이 챕터의 상담 가이드를 준비 중입니다.
      </div>
    );
  }

  return (
    <div className="consultation-guide">
      {/* 환자 표현 예시 */}
      {c.patientPhrases?.length > 0 && (
        <div className="consult-section">
          <div className="consult-section-title">
            <span className="consult-icon">💬</span> 환자 표현 예시
          </div>
          <div className="phrase-grid">
            {c.patientPhrases.map((p, i) => (
              <div key={i} className="phrase-chip">{p}</div>
            ))}
          </div>
        </div>
      )}

      {/* 약사 확인 질문 */}
      {c.keyQuestions?.length > 0 && (
        <div className="consult-section">
          <div className="consult-section-title">
            <span className="consult-icon">🩺</span> 약사 확인 질문
          </div>
          <div className="question-list">
            {c.keyQuestions.map((item, i) => (
              <div key={i} className="question-item">
                <div className="question-q">Q{i + 1}. {item.q}</div>
                {item.why && <div className="question-why">→ {item.why}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 즉시 의뢰 표현 */}
      {c.redFlagPhrases?.length > 0 && (
        <div className="consult-section">
          <div className="consult-section-title danger">
            <span className="consult-icon">🚨</span> 이 표현엔 즉시 병원 안내
          </div>
          <div className="red-flag-list">
            {c.redFlagPhrases.map((p, i) => (
              <div key={i} className="red-flag-phrase">{p}</div>
            ))}
          </div>
        </div>
      )}

      {/* 필수 확인 체크리스트 */}
      {c.checkItems?.length > 0 && (
        <div className="consult-section">
          <div className="consult-section-title">
            <span className="consult-icon">☑️</span> 필수 확인 체크리스트
          </div>
          <div className="check-list">
            {c.checkItems.map((item, i) => (
              <div key={i} className="check-item">
                <span className="check-box">☐</span> {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ activeChapterId, onSelectChapter, searchQuery, onSearchChange, openParts, onTogglePart }) {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">💊</div>
          <div>
            <div>OTC 약료 가이드</div>
            <div style={{ fontSize: "0.62rem", fontWeight: 400, color: "#64748B", marginTop: 1 }}>
              약사를 위한 임상 의사결정 도우미
            </div>
          </div>
        </div>
      </div>

      <div className="search-wrap">
        <input
          className="search-input"
          placeholder="챕터 검색..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="parts-list">
        {searchQuery.trim() ? (
          (() => {
            const q = searchQuery.toLowerCase();
            const results = getAllChapters().filter(
              (ch) =>
                ch.title.includes(q) ||
                (ch.keywords ?? []).some((k) => k.includes(q)) ||
                (ch.summary ?? "").includes(q)
            );
            if (!results.length)
              return <div style={{ padding: "12px 16px", fontSize: "0.78rem", color: "#475569" }}>검색 결과 없음</div>;
            return results.map((ch) => {
              const part = getPartForChapter(ch.id);
              return (
                <div
                  key={ch.id}
                  className={`chapter-item ${activeChapterId === ch.id ? "active" : ""}`}
                  style={{ paddingLeft: 16 }}
                  onClick={() => onSelectChapter(ch.id)}
                >
                  <span className="chapter-num" style={{ color: part?.color }}>{ch.id}장</span>
                  {ch.title}
                </div>
              );
            });
          })()
        ) : (
          PARTS.map((part) => {
            const isOpen = openParts.includes(part.id);
            return (
              <div key={part.id} className="part-item">
                <div className="part-header" onClick={() => onTogglePart(part.id)}>
                  <span className="part-dot" style={{ background: part.color }} />
                  <span>Part {part.id}. {part.subtitle}</span>
                  <span className={`part-chevron ${isOpen ? "open" : ""}`}>▼</span>
                </div>
                {isOpen && (
                  <div className="chapter-list">
                    {part.chapterIds.map((chId) => {
                      const ch = CHAPTERS[chId];
                      if (!ch) return null;
                      return (
                        <div
                          key={chId}
                          className={`chapter-item ${activeChapterId === chId ? "active" : ""}`}
                          onClick={() => onSelectChapter(chId)}
                        >
                          <span className="chapter-num">{chId}장</span>
                          {ch.title}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </nav>
  );
}

// ── Home ──────────────────────────────────────────────────────────────────────
function Home({ onSelectChapter }) {
  const totalChapters = Object.keys(CHAPTERS).length;
  return (
    <div className="home">
      <div className="home-hero">
        <h1>💊 OTC 약료 임상 가이드</h1>
        <p>환자 증상에 따른 단계별 의사결정 알고리즘으로<br />최적의 OTC 약물을 빠르게 찾아보세요.</p>
        <div className="home-stats">
          <div className="home-stat"><strong>10</strong>파트</div>
          <div className="home-stat"><strong>{totalChapters}</strong>챕터</div>
          <div className="home-stat"><strong>알고리즘</strong>기반 안내</div>
        </div>
      </div>

      <div className="parts-grid">
        {PARTS.map((part) => (
          <div key={part.id} className="part-card" style={{ borderTop: `3px solid ${part.color}` }}>
            <div className="part-card-header">
              <span className="part-card-badge" style={{ background: part.bg, color: part.color }}>
                Part {part.id}
              </span>
              <span className="part-card-title">{part.subtitle}</span>
            </div>
            <div className="part-card-chapters">
              {part.chapterIds.map((chId) => {
                const ch = CHAPTERS[chId];
                if (!ch) return (
                  <span key={chId} className="part-chapter-chip disabled">
                    {chId}장 준비중
                  </span>
                );
                return (
                  <span
                    key={chId}
                    className="part-chapter-chip"
                    onClick={() => onSelectChapter(chId)}
                  >
                    {chId}장 {ch.title}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Chapter Page ──────────────────────────────────────────────────────────────
function ChapterPage({ chapterId }) {
  const [tab, setTab] = useState("algo");
  const chapter = CHAPTERS[chapterId];
  const part = getPartForChapter(chapterId);

  if (!chapter) {
    return <div style={{ color: "var(--text-muted)", padding: 20 }}>챕터를 찾을 수 없습니다.</div>;
  }

  const hasConsultation = !!chapter.consultation;

  return (
    <div className="chapter-view">
      {/* Header */}
      <div className="chapter-header" style={{ borderLeft: `4px solid ${part?.color ?? "var(--primary)"}` }}>
        <div className="chapter-header-top">
          <span className="chapter-part-badge" style={{ background: part?.bg, color: part?.color }}>
            Part {part?.id}. {part?.subtitle}
          </span>
          <div>
            <div className="chapter-title">{chapterId}장. {chapter.title}</div>
            {chapter.summary && <div className="chapter-summary">{chapter.summary}</div>}
          </div>
        </div>

        {/* 환자 표현 태그 — 옵션 C */}
        {chapter.consultation?.patientPhrases?.length > 0 && (
          <div className="patient-phrases-bar">
            <span className="patient-phrases-label">환자 표현</span>
            <div className="patient-phrases-chips">
              {chapter.consultation.patientPhrases.slice(0, 4).map((p, i) => (
                <span key={i} className="patient-phrase-chip">💬 {p}</span>
              ))}
              {chapter.consultation.patientPhrases.length > 4 && (
                <span
                  className="patient-phrase-more"
                  onClick={() => setTab("consult")}
                >
                  +{chapter.consultation.patientPhrases.length - 4}개 더보기
                </span>
              )}
            </div>
          </div>
        )}

        {/* 키워드 */}
        {chapter.keywords?.length > 0 && (
          <div className="chapter-keywords">
            {chapter.keywords.map((k, i) => <span key={i} className="keyword-chip">{k}</span>)}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="algo-tabs">
        <button className={`algo-tab ${tab === "algo" ? "active" : ""}`} onClick={() => setTab("algo")}>
          🔀 증상 알고리즘
        </button>
        <button className={`algo-tab ${tab === "ref" ? "active" : ""}`} onClick={() => setTab("ref")}>
          📋 약물 요약
        </button>
        <button
          className={`algo-tab ${tab === "consult" ? "active" : ""} ${!hasConsultation ? "tab-dim" : ""}`}
          onClick={() => setTab("consult")}
        >
          🩺 상담 가이드
        </button>
      </div>

      {/* Tab content */}
      {tab === "algo"    && <AlgorithmView chapter={chapter} />}
      {tab === "ref"     && <QuickReference chapter={chapter} />}
      {tab === "consult" && <ConsultationGuide chapter={chapter} />}
    </div>
  );
}

// ── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [activeChapterId, setActiveChapterId] = useState(null);
  const [searchQuery, setSearchQuery]         = useState("");
  const [openParts, setOpenParts]             = useState([1]);
  const [sidebarOpen, setSidebarOpen]         = useState(false);

  function selectChapter(chId) {
    setActiveChapterId(chId);
    setSidebarOpen(false);
    const part = getPartForChapter(chId);
    if (part && !openParts.includes(part.id)) setOpenParts((p) => [...p, part.id]);
  }

  function togglePart(partId) {
    setOpenParts((prev) =>
      prev.includes(partId) ? prev.filter((p) => p !== partId) : [...prev, partId]
    );
  }

  const activeChapter = activeChapterId ? CHAPTERS[activeChapterId] : null;
  const activePart    = activeChapterId ? getPartForChapter(activeChapterId) : null;

  return (
    <div className="app">
      <div className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`} onClick={() => setSidebarOpen(false)} />

      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <Sidebar
          activeChapterId={activeChapterId}
          onSelectChapter={selectChapter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          openParts={openParts}
          onTogglePart={togglePart}
        />
      </div>

      <div className="main">
        <div className="topbar">
          <button className="menu-btn" onClick={() => setSidebarOpen((o) => !o)}>☰</button>
          <div className="breadcrumb">
            <span style={{ cursor: "pointer", color: "var(--primary)" }} onClick={() => setActiveChapterId(null)}>홈</span>
            {activePart && <><span className="breadcrumb-sep">›</span><span>Part {activePart.id}. {activePart.subtitle}</span></>}
            {activeChapter && <><span className="breadcrumb-sep">›</span><span className="breadcrumb-current">{activeChapterId}장. {activeChapter.title}</span></>}
          </div>
          {activeChapterId && (
            <button className="btn btn-ghost btn-sm" onClick={() => setActiveChapterId(null)}>홈</button>
          )}
        </div>

        <div className="content">
          {activeChapterId
            ? <ChapterPage key={activeChapterId} chapterId={activeChapterId} />
            : <Home onSelectChapter={selectChapter} />
          }
        </div>
      </div>
    </div>
  );
}
