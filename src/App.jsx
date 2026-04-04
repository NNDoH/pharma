import { useState, useMemo } from "react";
import "./index.css";
import { PARTS, CHAPTERS } from "./data/chapters";

// ── helpers ──────────────────────────────────────────────────────────────────
function getPartForChapter(chId) {
  return PARTS.find((p) => p.chapterIds.includes(chId));
}

function getAllChapters() {
  return Object.values(CHAPTERS);
}

// ── Algorithm engine ──────────────────────────────────────────────────────────
function useAlgorithm(chapter) {
  const [history, setHistory] = useState([]); // [{ nodeId, choiceLabel }]
  const [currentId, setCurrentId] = useState(chapter?.algorithm?.start ?? null);

  const currentNode = chapter?.algorithm?.nodes?.[currentId] ?? null;

  function choose(option) {
    setHistory((h) => [...h, { nodeId: currentId, choiceLabel: option.label }]);
    setCurrentId(option.next);
  }

  function back() {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setCurrentId(prev.nodeId);
  }

  function reset() {
    setHistory([]);
    setCurrentId(chapter?.algorithm?.start ?? null);
  }

  // Rebuild when chapter changes
  function init(ch) {
    setHistory([]);
    setCurrentId(ch?.algorithm?.start ?? null);
  }

  return { currentNode, history, choose, back, reset, init };
}

// ── Sub-components ────────────────────────────────────────────────────────────

function DrugCard({ drug }) {
  const rankClass =
    drug.rank === "1차 선택" ? "first"
    : drug.rank === "2차 선택" ? "second"
    : drug.rank === "3차 선택" ? "third"
    : drug.rank === "외용제" ? "topical"
    : drug.rank === "보조요법" ? "supplement"
    : "alt";

  return (
    <div className="drug-card">
      <span className={`drug-rank ${rankClass}`}>{drug.rank}</span>
      <div className="drug-name">{drug.name}</div>
      {drug.examples && drug.examples.length > 0 && (
        <div className="drug-examples">
          {drug.examples.map((e, i) => <span key={i}>{e}</span>)}
        </div>
      )}
      {drug.dosing && (
        <div className="drug-dosing">{drug.dosing}</div>
      )}
      {drug.cautions && drug.cautions.length > 0 && (
        <div className="drug-cautions">
          {drug.cautions.map((c, i) => (
            <div className="drug-caution-item" key={i}>{c}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function WarningNode({ node, onBack, onReset }) {
  return (
    <div className="algo-card warning">
      <div className="algo-label">⛔ 전문의 상담 필요</div>
      <div className="warning-title">{node.text}</div>
      {node.reasons && node.reasons.length > 0 && (
        <ul className="warning-list">
          {node.reasons.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      )}
      <div className="warning-action">{node.action}</div>
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

      {node.drugs && node.drugs.length > 0 && (
        <>
          <div className="section-label">약물 선택</div>
          <div className="drug-list">
            {node.drugs.map((d, i) => <DrugCard key={i} drug={d} />)}
          </div>
        </>
      )}

      {node.nonPharm && node.nonPharm.length > 0 && (
        <>
          <div className="section-label">비약물 요법</div>
          <ul className="bullet-list">
            {node.nonPharm.map((x, i) => <li key={i}>{x}</li>)}
          </ul>
        </>
      )}

      {node.counseling && node.counseling.length > 0 && (
        <>
          <div className="section-label">복약 지도 포인트</div>
          <ul className="bullet-list">
            {node.counseling.map((x, i) => <li key={i}>{x}</li>)}
          </ul>
        </>
      )}

      {node.referral && (
        <div className="referral-box">{node.referral}</div>
      )}

      <div className="algo-nav" style={{ marginTop: 14 }}>
        {onBack && <button className="btn btn-ghost btn-sm" onClick={onBack}>← 이전</button>}
        <button className="btn btn-ghost btn-sm" onClick={onReset}>처음부터</button>
      </div>
    </div>
  );
}

function QuestionNode({ node, onChoose }) {
  const labels = "ABCDEFGHIJKLMNOP";
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

function AlgorithmView({ chapter }) {
  const algo = useAlgorithm(chapter);
  const [key, setKey] = useState(0); // force remount on chapter change

  // When chapter prop changes, reinitialise
  const [lastChapterId, setLastChapterId] = useState(chapter?.id);
  if (chapter?.id !== lastChapterId) {
    setLastChapterId(chapter.id);
    algo.init(chapter);
  }

  const { currentNode, history, choose, back, reset } = algo;

  return (
    <div className="algo-flow">
      {/* Breadcrumb trail */}
      {history.length > 0 && (
        <div className="path-trail">
          {history.map((h, i) => {
            const node = chapter.algorithm.nodes[h.nodeId];
            return (
              <span key={i} className="path-crumb">
                <span className="path-crumb-q">
                  {node?.text?.length > 18 ? node.text.slice(0, 18) + "…" : node?.text}
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
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            알고리즘 데이터를 준비 중입니다.
          </p>
        </div>
      )}

      {currentNode?.type === "question" && (
        <QuestionNode node={currentNode} onChoose={choose} />
      )}
      {currentNode?.type === "warning" && (
        <WarningNode
          node={currentNode}
          onBack={history.length > 0 ? back : null}
          onReset={reset}
        />
      )}
      {currentNode?.type === "result" && (
        <ResultNode
          node={currentNode}
          onBack={history.length > 0 ? back : null}
          onReset={reset}
        />
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

// ── Sidebar ────────────────────────────────────────────────────────────────────
function Sidebar({ activeChapterId, onSelectChapter, searchQuery, onSearchChange, openParts, onTogglePart, onClose }) {
  const filteredChapters = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return getAllChapters().filter(
      (ch) =>
        ch.title.includes(q) ||
        (ch.keywords ?? []).some((k) => k.includes(q)) ||
        (ch.summary ?? "").includes(q)
    );
  }, [searchQuery]);

  return (
    <>
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
          {filteredChapters ? (
            /* Search results */
            filteredChapters.length === 0 ? (
              <div style={{ padding: "12px 16px", fontSize: "0.78rem", color: "#475569" }}>
                검색 결과 없음
              </div>
            ) : (
              filteredChapters.map((ch) => {
                const part = getPartForChapter(ch.id);
                return (
                  <div
                    key={ch.id}
                    className={`chapter-item ${activeChapterId === ch.id ? "active" : ""}`}
                    style={{ paddingLeft: 16 }}
                    onClick={() => { onSelectChapter(ch.id); onClose?.(); }}
                  >
                    <span className="chapter-num" style={{ color: part?.color }}>{ch.id}장</span>
                    {ch.title}
                  </div>
                );
              })
            )
          ) : (
            /* Normal part list */
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
                            onClick={() => { onSelectChapter(chId); onClose?.(); }}
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
    </>
  );
}

// ── Home ───────────────────────────────────────────────────────────────────────
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
              <span
                className="part-card-badge"
                style={{ background: part.bg, color: part.color }}
              >
                Part {part.id}
              </span>
              <span className="part-card-title">{part.subtitle}</span>
            </div>
            <div className="part-card-chapters">
              {part.chapterIds.map((chId) => {
                const ch = CHAPTERS[chId];
                if (!ch) return null;
                return (
                  <span
                    key={chId}
                    className="part-chapter-chip"
                    onClick={(e) => { e.stopPropagation(); onSelectChapter(chId); }}
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

// ── Chapter Page ───────────────────────────────────────────────────────────────
function ChapterPage({ chapterId }) {
  const [tab, setTab] = useState("algo");
  const chapter = CHAPTERS[chapterId];
  const part = getPartForChapter(chapterId);

  if (!chapter) {
    return <div style={{ color: "var(--text-muted)", padding: 20 }}>챕터를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="chapter-view">
      {/* Header */}
      <div className="chapter-header">
        <div className="chapter-header-top">
          <span
            className="chapter-part-badge"
            style={{ background: part?.bg, color: part?.color }}
          >
            Part {part?.id}. {part?.subtitle}
          </span>
          <div>
            <div className="chapter-title">{chapterId}장. {chapter.title}</div>
            {chapter.summary && <div className="chapter-summary">{chapter.summary}</div>}
          </div>
        </div>
        {chapter.keywords && chapter.keywords.length > 0 && (
          <div className="chapter-keywords">
            {chapter.keywords.map((k, i) => (
              <span key={i} className="keyword-chip">{k}</span>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="algo-tabs">
        <button
          className={`algo-tab ${tab === "algo" ? "active" : ""}`}
          onClick={() => setTab("algo")}
        >
          🔀 증상 알고리즘
        </button>
        <button
          className={`algo-tab ${tab === "ref" ? "active" : ""}`}
          onClick={() => setTab("ref")}
        >
          📋 약물 요약
        </button>
      </div>

      {/* Tab content */}
      {tab === "algo" ? (
        <AlgorithmView chapter={chapter} />
      ) : (
        <QuickReference chapter={chapter} part={part} />
      )}
    </div>
  );
}

// ── Quick Reference (flat drug table view) ─────────────────────────────────────
function QuickReference({ chapter, part }) {
  // Collect all drugs from all result nodes
  const allDrugs = useMemo(() => {
    const drugs = [];
    if (!chapter?.algorithm?.nodes) return drugs;
    Object.values(chapter.algorithm.nodes).forEach((node) => {
      if (node.type === "result" && node.drugs) {
        node.drugs.forEach((d) => {
          if (!drugs.find((x) => x.name === d.name)) drugs.push(d);
        });
      }
    });
    return drugs;
  }, [chapter]);

  // Collect all counseling points from result nodes
  const allCounseling = useMemo(() => {
    const pts = new Set();
    if (!chapter?.algorithm?.nodes) return [];
    Object.values(chapter.algorithm.nodes).forEach((node) => {
      if (node.type === "result" && node.counseling) {
        node.counseling.forEach((c) => pts.add(c));
      }
    });
    return [...pts];
  }, [chapter]);

  // Collect referral criteria
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
          <div className="section-label" style={{ marginTop: 0 }}>약물 목록</div>
          <div className="drug-list">
            {allDrugs.map((d, i) => <DrugCard key={i} drug={d} />)}
          </div>
        </>
      )}

      {allCounseling.length > 0 && (
        <>
          <div className="section-label">복약 지도 포인트</div>
          <div
            style={{
              background: "white",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: "12px 16px",
            }}
          >
            <ul className="bullet-list">
              {allCounseling.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
        </>
      )}

      {referrals.length > 0 && (
        <>
          <div className="section-label">전문의 상담 기준</div>
          {referrals.map((r, i) => (
            <div key={i} className="referral-box">{r}</div>
          ))}
        </>
      )}
    </div>
  );
}

// ── Root App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [activeChapterId, setActiveChapterId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [openParts, setOpenParts] = useState([1]); // Part 1 open by default
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function selectChapter(chId) {
    setActiveChapterId(chId);
    setSidebarOpen(false);
    // Auto-open the correct part in sidebar
    const part = getPartForChapter(chId);
    if (part && !openParts.includes(part.id)) {
      setOpenParts((p) => [...p, part.id]);
    }
  }

  function togglePart(partId) {
    setOpenParts((prev) =>
      prev.includes(partId) ? prev.filter((p) => p !== partId) : [...prev, partId]
    );
  }

  const activeChapter = activeChapterId ? CHAPTERS[activeChapterId] : null;
  const activePart = activeChapterId ? getPartForChapter(activeChapterId) : null;

  return (
    <div className="app">
      {/* Sidebar overlay for mobile */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      <div className={`sidebar ${sidebarOpen ? "open" : ""}`} style={{ position: undefined }}>
        {/* We render sidebar content inside the existing sidebar div */}
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
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="parts-list">
          {searchQuery.trim() ? (
            /* Search */
            (() => {
              const q = searchQuery.toLowerCase();
              const results = getAllChapters().filter(
                (ch) =>
                  ch.title.includes(q) ||
                  (ch.keywords ?? []).some((k) => k.includes(q)) ||
                  (ch.summary ?? "").includes(q)
              );
              if (results.length === 0) {
                return <div style={{ padding: "12px 16px", fontSize: "0.78rem", color: "#475569" }}>검색 결과 없음</div>;
              }
              return results.map((ch) => {
                const part = getPartForChapter(ch.id);
                return (
                  <div
                    key={ch.id}
                    className={`chapter-item ${activeChapterId === ch.id ? "active" : ""}`}
                    style={{ paddingLeft: 16 }}
                    onClick={() => selectChapter(ch.id)}
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
                  <div className="part-header" onClick={() => togglePart(part.id)}>
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
                            onClick={() => selectChapter(chId)}
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
      </div>

      {/* Main */}
      <div className="main">
        <div className="topbar">
          <button className="menu-btn" onClick={() => setSidebarOpen((o) => !o)}>☰</button>
          <div className="breadcrumb">
            <span
              style={{ cursor: "pointer", color: "var(--primary)" }}
              onClick={() => setActiveChapterId(null)}
            >
              홈
            </span>
            {activePart && (
              <>
                <span className="breadcrumb-sep">›</span>
                <span>Part {activePart.id}. {activePart.subtitle}</span>
              </>
            )}
            {activeChapter && (
              <>
                <span className="breadcrumb-sep">›</span>
                <span className="breadcrumb-current">
                  {activeChapterId}장. {activeChapter.title}
                </span>
              </>
            )}
          </div>
          {activeChapterId && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setActiveChapterId(null)}
            >
              홈
            </button>
          )}
        </div>

        <div className="content">
          {activeChapterId ? (
            <ChapterPage key={activeChapterId} chapterId={activeChapterId} />
          ) : (
            <Home onSelectChapter={selectChapter} />
          )}
        </div>
      </div>
    </div>
  );
}
