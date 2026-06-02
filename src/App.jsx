import { useState, useEffect, useRef } from "react";

// ─── THEME & CONSTANTS ───────────────────────────────────────────────────────
const GREEN = "#3D9B7A";
const GREEN_DARK = "#2a6b54";
const GREEN_LIGHT = "#e8f5f0";
const CONN = "postgresql://neondb_owner:npg_UpSWbem3LY6B@ep-dawn-waterfall-ac4ixo7u-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const LOGO_B64 = "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";

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function genToken(len = 24) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function hashPassword(pw) {
  // Simple deterministic hash for demo (in production use bcrypt server-side)
  let h = 0;
  for (let i = 0; i < pw.length; i++) h = (Math.imul(31, h) + pw.charCodeAt(i)) | 0;
  return "hash_" + Math.abs(h).toString(16);
}

function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("pt-BR");
}

function fmtNota(n) {
  return Number(n).toFixed(1);
}

// ─── API CALL TO CLAUDE ───────────────────────────────────────────────────────
async function callClaude(prompt, systemPrompt = "") {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: systemPrompt || "Você é um assistente especializado em criar avaliações de treinamento corporativo de alto nível.",
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || "";
}

// ─── NEON DB VIA SERVERLESS (HTTP) ────────────────────────────────────────────
// Since direct TCP is blocked, we use Neon's HTTP API
async function neonQuery(sql, params = []) {
  const url = "https://ep-dawn-waterfall-ac4ixo7u-pooler.sa-east-1.aws.neon.tech/sql";
  // Neon doesn't expose an HTTP SQL endpoint by default on free tier
  // We'll use localStorage as our persistence layer for this demo
  // and structure it exactly like the DB schema
  return { rows: [], rowCount: 0 };
}

// ─── LOCAL STORAGE DB (mirrors Neon schema) ──────────────────────────────────
const DB = {
  get(table) {
    try { return JSON.parse(localStorage.getItem("mb_" + table) || "[]"); } catch { return []; }
  },
  set(table, data) {
    localStorage.setItem("mb_" + table, JSON.stringify(data));
  },
  insert(table, row) {
    const rows = DB.get(table);
    const id = rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1;
    const newRow = { ...row, id, criado_em: new Date().toISOString() };
    rows.push(newRow);
    DB.set(table, rows);
    return newRow;
  },
  update(table, id, updates) {
    const rows = DB.get(table);
    const idx = rows.findIndex(r => r.id === id);
    if (idx >= 0) { rows[idx] = { ...rows[idx], ...updates }; DB.set(table, rows); }
  },
  delete(table, id) {
    DB.set(table, DB.get(table).filter(r => r.id !== id));
  },
  findBy(table, field, value) {
    return DB.get(table).filter(r => r[field] === value);
  },
  findOne(table, field, value) {
    return DB.get(table).find(r => r[field] === value) || null;
  },
  seed() {
    // Seed lojas if empty
    if (DB.get("lojas").length === 0) {
      ["Shopping Plaza Niterói","Shopping Icaraí","Pátio Alcântara","Shopping Partage Norte","Loja Centro Niterói"]
        .forEach(nome => DB.insert("lojas", { nome, ativo: true }));
    }
    // Seed multiplicadora admin if empty
    if (DB.get("usuarios").length === 0) {
      DB.insert("usuarios", {
        nome: "Multiplicadora",
        email: "admin@boticario.com",
        senha_hash: hashPassword("boti2025"),
        perfil: "multiplicadora",
        loja_id: null,
        ativo: true,
      });
    }
  }
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  // Layout
  app: { fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "#f7faf9" },
  // Public home
  pubBg: { background: GREEN, minHeight: "100vh", color: "#fff", position: "relative", overflow: "hidden" },
  pubHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 28px 0" },
  pubLogo: { display: "flex", flexDirection: "column", alignItems: "center", gap: 2 },
  pubLogoImg: { width: 80, borderRadius: 6 },
  pubNiteroi: { fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.65)", fontWeight: 400 },
  pubHero: { padding: "32px 28px 20px" },
  pubEyebrow: { fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: 8, fontWeight: 500 },
  pubTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, lineHeight: 1.15, margin: "0 0 6px", color: "#fff" },
  pubTitleSpan: { fontWeight: 600, fontStyle: "italic" },
  pubSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 300, letterSpacing: 0.5 },
  pubDivider: { width: 40, height: 1, background: "rgba(255,255,255,0.3)", margin: "16px 28px" },
  pubSection: { padding: "0 28px 24px" },
  pubSectionLabel: { fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 12, fontWeight: 500 },
  pubCard: { background: "rgba(255,255,255,0.09)", border: "0.5px solid rgba(255,255,255,0.18)", borderRadius: 12, padding: "14px 16px", marginBottom: 10, display: "flex", alignItems: "center", gap: 14 },
  pubDateBox: { textAlign: "center", minWidth: 38 },
  pubDay: { fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 300, lineHeight: 1, color: "#fff" },
  pubMonth: { fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginTop: 2, fontWeight: 500 },
  pubSep: { width: "0.5px", height: 34, background: "rgba(255,255,255,0.2)" },
  pubEventTitle: { fontSize: 14, fontWeight: 500, color: "#fff", marginBottom: 3 },
  pubMeta: { fontSize: 12, color: "rgba(255,255,255,0.5)", display: "flex", gap: 10, flexWrap: "wrap" },
  pubBadge: (conf) => ({ fontSize: 10, fontWeight: 500, padding: "3px 10px", borderRadius: 20, background: conf ? "rgba(100,220,160,0.2)" : "rgba(255,255,255,0.15)", color: conf ? "#7DEBB0" : "rgba(255,255,255,0.8)", whiteSpace: "nowrap" }),
  pubFooter: { padding: "0 28px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  pubFooterText: { fontSize: 11, color: "rgba(255,255,255,0.3)" },
  // Buttons
  btnPrimary: { background: GREEN, color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, cursor: "pointer" },
  btnSecondary: { background: "#fff", color: GREEN, border: `1.5px solid ${GREEN}`, borderRadius: 8, padding: "10px 20px", fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, cursor: "pointer" },
  btnGhost: { background: "rgba(255,255,255,0.12)", border: "0.5px solid rgba(255,255,255,0.3)", color: "#fff", borderRadius: 24, padding: "8px 20px", fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 },
  btnDanger: { background: "#fff", color: "#c0392b", border: "1.5px solid #c0392b", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, cursor: "pointer" },
  // Forms
  input: { width: "100%", border: "0.5px solid #ccc", borderRadius: 8, padding: "10px 12px", fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: "#222", background: "#fafafa", boxSizing: "border-box", outline: "none" },
  label: { fontSize: 11, fontWeight: 500, letterSpacing: 1, textTransform: "uppercase", color: "#666", display: "block", marginBottom: 4 },
  // Layout panels
  sidebar: { width: 220, background: "#fff", borderRight: "0.5px solid #e0ece8", minHeight: "100vh", display: "flex", flexDirection: "column" },
  sidebarLogo: { padding: "20px 20px 16px", borderBottom: "0.5px solid #e8f0ed", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  sidebarLogoImg: { width: 70, borderRadius: 6 },
  sidebarNiteroi: { fontSize: 8, letterSpacing: 3, textTransform: "uppercase", color: GREEN, fontWeight: 500 },
  sidebarNav: { flex: 1, padding: "12px 0" },
  navItem: (active) => ({ display: "flex", alignItems: "center", gap: 10, padding: "11px 20px", fontSize: 14, color: active ? GREEN : "#555", background: active ? GREEN_LIGHT : "transparent", fontWeight: active ? 500 : 400, cursor: "pointer", borderLeft: active ? `3px solid ${GREEN}` : "3px solid transparent", transition: "all 0.15s" }),
  mainContent: { flex: 1, padding: "28px 32px", maxWidth: 900 },
  pageTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400, color: "#1a3d2b", marginBottom: 4 },
  pageSubtitle: { fontSize: 13, color: "#888", marginBottom: 24 },
  card: { background: "#fff", borderRadius: 12, border: "0.5px solid #e0ece8", padding: "20px 24px", marginBottom: 16 },
  cardTitle: { fontSize: 15, fontWeight: 500, color: "#1a3d2b", marginBottom: 4 },
  metricGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 24 },
  metricCard: (color) => ({ background: color || GREEN_LIGHT, borderRadius: 10, padding: "16px 18px", textAlign: "center" }),
  metricNum: { fontSize: 28, fontWeight: 500, color: GREEN, lineHeight: 1 },
  metricLabel: { fontSize: 12, color: "#666", marginTop: 4 },
  // Table
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  th: { padding: "10px 12px", textAlign: "left", borderBottom: "1.5px solid #e0ece8", color: "#888", fontSize: 12, fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase" },
  td: { padding: "12px 12px", borderBottom: "0.5px solid #f0f5f3", color: "#333", verticalAlign: "middle" },
  // Badge
  badge: (ok) => ({ display: "inline-block", fontSize: 11, fontWeight: 500, padding: "2px 10px", borderRadius: 20, background: ok ? "rgba(61,155,122,0.12)" : "rgba(192,57,43,0.1)", color: ok ? GREEN_DARK : "#c0392b" }),
  // Modal
  modalBg: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" },
  modalCard: { background: "#fff", borderRadius: 16, padding: "32px 28px", width: 480, maxWidth: "92vw", maxHeight: "85vh", overflowY: "auto" },
  // Quiz / consultor
  quizBg: { background: "#f7faf9", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 16px" },
  quizCard: { background: "#fff", borderRadius: 16, border: "0.5px solid #e0ece8", padding: "28px 28px", width: "100%", maxWidth: 600, marginBottom: 16 },
  quizHeader: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginBottom: 28 },
  quizNum: { fontSize: 12, fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase", color: GREEN, marginBottom: 4 },
  quizEnunciado: { fontSize: 16, fontWeight: 500, color: "#1a3d2b", lineHeight: 1.5, marginBottom: 20 },
  quizOpcao: (sel) => ({ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${sel ? GREEN : "#e0ece8"}`, background: sel ? GREEN_LIGHT : "#fff", cursor: "pointer", marginBottom: 10, transition: "all 0.15s" }),
  quizOpcaoLetter: (sel) => ({ width: 28, height: 28, borderRadius: "50%", background: sel ? GREEN : "#f0f5f3", color: sel ? "#fff" : "#888", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 500, flexShrink: 0 }),
  progressBar: (pct) => ({ height: 4, background: GREEN, borderRadius: 4, width: `${pct}%`, transition: "width 0.3s" }),
};

// ─── GOOGLE FONTS ─────────────────────────────────────────────────────────────
function FontLoader() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);
  return null;
}

// ─── LOGIN MODAL ──────────────────────────────────────────────────────────────
function LoginModal({ onClose, onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin() {
    setLoading(true); setErro("");
    setTimeout(() => {
      const user = DB.findOne("usuarios", "email", email.toLowerCase().trim());
      if (!user || user.senha_hash !== hashPassword(senha)) {
        setErro("E-mail ou senha incorretos."); setLoading(false); return;
      }
      onLogin(user); setLoading(false);
    }, 400);
  }

  return (
    <div style={S.modalBg} onClick={onClose}>
      <div style={S.modalCard} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, marginBottom: 24 }}>
          <img src={`data:image/jpeg;base64,${LOGO_B64}`} style={{ width: 80, borderRadius: 6 }} alt="oBoticário" />
          <span style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: GREEN, fontWeight: 500 }}>Niterói</span>
        </div>
        <p style={{ ...S.pageTitle, fontSize: 20, textAlign: "center", marginBottom: 20 }}>Acesso ao sistema</p>
        <div style={{ marginBottom: 14 }}>
          <label style={S.label}>E-mail</label>
          <input style={S.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label style={S.label}>Senha</label>
          <input style={S.input} type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handleLogin()} />
        </div>
        {erro && <p style={{ fontSize: 12, color: "#c0392b", marginBottom: 8 }}>{erro}</p>}
        <p style={{ fontSize: 11, color: "#aaa", marginBottom: 16 }}>Acesso padrão: admin@boticario.com / boti2025</p>
        <button style={{ ...S.btnPrimary, width: "100%" }} onClick={handleLogin} disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
        <button style={{ ...S.btnGhost, background: "none", color: "#aaa", border: "none", width: "100%", justifyContent: "center", marginTop: 8 }} onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}

// ─── PUBLIC HOME ──────────────────────────────────────────────────────────────
function PublicHome({ onLoginClick }) {
  const treinamentos = DB.get("treinamentos").filter(t => t.status !== "cancelado").sort((a, b) => new Date(a.data_evento) - new Date(b.data_evento)).slice(0, 5);

  const meses = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

  return (
    <div style={S.pubBg}>
      <div style={{ position: "absolute", width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.04)", top: -80, right: -60, pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.03)", bottom: 60, left: -40, pointerEvents: "none" }} />

      <div style={S.pubHeader}>
        <div style={S.pubLogo}>
          <img src={`data:image/jpeg;base64,${LOGO_B64}`} style={S.pubLogoImg} alt="oBoticário" />
          <span style={S.pubNiteroi}>Niterói</span>
        </div>
        <button style={S.btnGhost} onClick={onLoginClick}>
          🔒 Acesso restrito
        </button>
      </div>

      <div style={S.pubHero}>
        <p style={S.pubEyebrow}>Programa de desenvolvimento</p>
        <h1 style={S.pubTitle}>Multiplica<br /><span style={S.pubTitleSpan}>Boti</span></h1>
        <p style={S.pubSubtitle}>Agenda de treinamentos · Niterói</p>
      </div>

      <div style={S.pubDivider} />

      <div style={S.pubSection}>
        <p style={S.pubSectionLabel}>Próximos treinamentos</p>
        {treinamentos.length === 0 && (
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Nenhum treinamento agendado ainda.</p>
        )}
        {treinamentos.map(t => {
          const d = new Date(t.data_evento + "T12:00:00");
          return (
            <div key={t.id} style={S.pubCard}>
              <div style={S.pubDateBox}>
                <div style={S.pubDay}>{String(d.getDate()).padStart(2, "0")}</div>
                <div style={S.pubMonth}>{meses[d.getMonth()]}</div>
              </div>
              <div style={S.pubSep} />
              <div style={{ flex: 1 }}>
                <div style={S.pubEventTitle}>{t.titulo}</div>
                <div style={S.pubMeta}>
                  {t.hora_inicio && <span>🕐 {t.hora_inicio.slice(0,5)}</span>}
                  {t.local && <span>📍 {t.local}</span>}
                </div>
              </div>
              <span style={S.pubBadge(t.status === "confirmado")}>{t.status === "confirmado" ? "Confirmado" : t.status === "realizado" ? "Realizado" : "Previsto"}</span>
            </div>
          );
        })}
      </div>

      <div style={S.pubFooter}>
        <span style={S.pubFooterText}>Multiplica Boti © 2025 · O Boticário Niterói</span>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ user, page, setPage, onLogout }) {
  const isMulti = user.perfil === "multiplicadora";
  const navItems = isMulti ? [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "agenda", icon: "📅", label: "Agenda" },
    { id: "questionarios", icon: "📝", label: "Questionários" },
    { id: "resultados", icon: "🏆", label: "Resultados" },
    { id: "usuarios", icon: "👥", label: "Usuários" },
  ] : [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "resultados", icon: "🏆", label: "Resultados" },
  ];

  return (
    <div style={S.sidebar}>
      <div style={S.sidebarLogo}>
        <img src={`data:image/jpeg;base64,${LOGO_B64}`} style={S.sidebarLogoImg} alt="oBoticário" />
        <span style={S.sidebarNiteroi}>Niterói</span>
        <p style={{ fontSize: 11, color: "#3D9B7A", fontWeight: 500, marginTop: 4, textAlign: "center" }}>Multiplica Boti</p>
      </div>
      <div style={S.sidebarNav}>
        {navItems.map(item => (
          <div key={item.id} style={S.navItem(page === item.id)} onClick={() => setPage(item.id)}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
      <div style={{ padding: "16px 20px", borderTop: "0.5px solid #e0ece8" }}>
        <p style={{ fontSize: 12, color: "#888", marginBottom: 2 }}>{user.nome}</p>
        <p style={{ fontSize: 11, color: "#bbb", marginBottom: 10, textTransform: "capitalize" }}>{user.perfil}</p>
        <button style={{ ...S.btnSecondary, padding: "7px 16px", fontSize: 12, width: "100%" }} onClick={onLogout}>Sair</button>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ user }) {
  const quizzes = DB.get("questionarios");
  const respostas = DB.get("respostas_consultor");
  const treinamentos = DB.get("treinamentos");

  const myQuizzes = user.perfil === "multiplicadora" ? quizzes : quizzes;
  const totalRespostas = respostas.length;
  const aprovados = respostas.filter(r => r.aprovado).length;
  const txAprovacao = totalRespostas > 0 ? Math.round((aprovados / totalRespostas) * 100) : 0;
  const mediaNotas = totalRespostas > 0 ? (respostas.reduce((s, r) => s + Number(r.nota), 0) / totalRespostas).toFixed(1) : "-";

  const recentes = respostas.slice(-5).reverse();

  return (
    <div>
      <p style={S.pageTitle}>Dashboard</p>
      <p style={S.pageSubtitle}>Visão geral do programa de treinamentos</p>

      <div style={S.metricGrid}>
        <div style={S.metricCard()}>
          <div style={S.metricNum}>{myQuizzes.length}</div>
          <div style={S.metricLabel}>Questionários</div>
        </div>
        <div style={S.metricCard()}>
          <div style={S.metricNum}>{totalRespostas}</div>
          <div style={S.metricLabel}>Avaliações respondidas</div>
        </div>
        <div style={S.metricCard()}>
          <div style={S.metricNum}>{txAprovacao}%</div>
          <div style={S.metricLabel}>Taxa de aprovação</div>
        </div>
        <div style={S.metricCard()}>
          <div style={S.metricNum}>{mediaNotas}</div>
          <div style={S.metricLabel}>Média geral</div>
        </div>
        <div style={S.metricCard()}>
          <div style={S.metricNum}>{treinamentos.length}</div>
          <div style={S.metricLabel}>Treinamentos</div>
        </div>
      </div>

      {recentes.length > 0 && (
        <div style={S.card}>
          <p style={S.cardTitle}>Últimas avaliações</p>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Consultor</th>
                <th style={S.th}>Loja</th>
                <th style={S.th}>Nota</th>
                <th style={S.th}>Resultado</th>
                <th style={S.th}>Data</th>
              </tr>
            </thead>
            <tbody>
              {recentes.map(r => (
                <tr key={r.id}>
                  <td style={S.td}>{r.nome_consultor}</td>
                  <td style={S.td}>{r.loja || "—"}</td>
                  <td style={S.td}><strong>{fmtNota(r.nota)}</strong></td>
                  <td style={S.td}><span style={S.badge(r.aprovado)}>{r.aprovado ? "Aprovado" : "Reforço"}</span></td>
                  <td style={S.td}>{fmtDate(r.respondido_em)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {recentes.length === 0 && (
        <div style={{ ...S.card, textAlign: "center", padding: 40, color: "#aaa" }}>
          <p style={{ fontSize: 32, marginBottom: 8 }}>📊</p>
          <p>Nenhuma avaliação respondida ainda.</p>
          <p style={{ fontSize: 12 }}>Crie um questionário e compartilhe o link com os consultores.</p>
        </div>
      )}
    </div>
  );
}

// ─── AGENDA ───────────────────────────────────────────────────────────────────
function Agenda({ user }) {
  const [treinamentos, setTreinamentos] = useState(DB.get("treinamentos").sort((a,b) => new Date(a.data_evento)-new Date(b.data_evento)));
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ titulo: "", descricao: "", data_evento: "", hora_inicio: "", local: "", status: "previsto" });

  function salvar() {
    if (!form.titulo || !form.data_evento) return;
    DB.insert("treinamentos", { ...form, criado_por: user.id });
    setTreinamentos(DB.get("treinamentos").sort((a,b) => new Date(a.data_evento)-new Date(b.data_evento)));
    setShowModal(false);
    setForm({ titulo: "", descricao: "", data_evento: "", hora_inicio: "", local: "", status: "previsto" });
  }

  function excluir(id) {
    if (!confirm("Excluir treinamento?")) return;
    DB.delete("treinamentos", id);
    setTreinamentos(DB.get("treinamentos").sort((a,b) => new Date(a.data_evento)-new Date(b.data_evento)));
  }

  const statusColors = { previsto: "#f39c12", confirmado: GREEN, cancelado: "#c0392b", realizado: "#888" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <p style={S.pageTitle}>Agenda</p>
          <p style={S.pageSubtitle}>Gerencie os treinamentos — visível publicamente</p>
        </div>
        <button style={S.btnPrimary} onClick={() => setShowModal(true)}>+ Novo treinamento</button>
      </div>

      {treinamentos.length === 0 && (
        <div style={{ ...S.card, textAlign: "center", padding: 40, color: "#aaa" }}>
          <p style={{ fontSize: 32, marginBottom: 8 }}>📅</p>
          <p>Nenhum treinamento cadastrado.</p>
        </div>
      )}

      {treinamentos.map(t => (
        <div key={t.id} style={{ ...S.card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={S.cardTitle}>{t.titulo}</p>
            <p style={{ fontSize: 13, color: "#888", marginTop: 2 }}>
              📅 {fmtDate(t.data_evento)} {t.hora_inicio && `· 🕐 ${t.hora_inicio.slice(0,5)}`} {t.local && `· 📍 ${t.local}`}
            </p>
            {t.descricao && <p style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>{t.descricao}</p>}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: statusColors[t.status] + "22", color: statusColors[t.status], fontWeight: 500 }}>
              {t.status}
            </span>
            <button style={{ ...S.btnDanger, padding: "6px 12px", fontSize: 12 }} onClick={() => excluir(t.id)}>✕</button>
          </div>
        </div>
      ))}

      {showModal && (
        <div style={S.modalBg} onClick={() => setShowModal(false)}>
          <div style={S.modalCard} onClick={e => e.stopPropagation()}>
            <p style={{ ...S.pageTitle, fontSize: 20, marginBottom: 20 }}>Novo treinamento</p>
            {[["titulo","Título *","text"],["descricao","Descrição","text"],["data_evento","Data *","date"],["hora_inicio","Horário","time"],["local","Local","text"]].map(([k,l,t]) => (
              <div key={k} style={{ marginBottom: 12 }}>
                <label style={S.label}>{l}</label>
                <input style={S.input} type={t} value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} />
              </div>
            ))}
            <div style={{ marginBottom: 16 }}>
              <label style={S.label}>Status</label>
              <select style={S.input} value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                <option value="previsto">Previsto</option>
                <option value="confirmado">Confirmado</option>
                <option value="realizado">Realizado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ ...S.btnPrimary, flex: 1 }} onClick={salvar}>Salvar</button>
              <button style={{ ...S.btnSecondary, flex: 1 }} onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── QUESTIONÁRIOS ────────────────────────────────────────────────────────────
function Questionarios({ user }) {
  const [lista, setLista] = useState(DB.get("questionarios"));
  const [step, setStep] = useState("list"); // list | config | preview | done
  const [config, setConfig] = useState({ titulo: "", tipo_perguntas: "multipla_escolha", quantidade_perguntas: 10, direcionamento: "" });
  const [arquivo, setArquivo] = useState(null);
  const [conteudo, setConteudo] = useState("");
  const [perguntas, setPerguntas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quizAtual, setQuizAtual] = useState(null);
  const [showLink, setShowLink] = useState(null);
  const fileRef = useRef();

  async function extrairTexto(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        resolve(typeof text === "string" ? text.slice(0, 12000) : "Conteúdo não lido.");
      };
      reader.readAsText(file);
    });
  }

  async function gerarPerguntas() {
    if (!conteudo.trim() && !arquivo) { alert("Cole o conteúdo ou faça upload de um arquivo texto."); return; }
    setLoading(true);
    const texto = conteudo || (arquivo ? await extrairTexto(arquivo) : "");

    const tipoInstr = config.tipo_perguntas === "multipla_escolha"
      ? "todas de múltipla escolha (4 opções: a, b, c, d)"
      : config.tipo_perguntas === "verdadeiro_falso"
      ? "todas de verdadeiro/falso (opção a = Verdadeiro, opção b = Falso, resposta_correta: a ou b)"
      : "mistura de múltipla escolha e verdadeiro/falso";

    const prompt = `Você é um especialista em treinamento corporativo do setor de beleza e varejo. 
Analise o conteúdo abaixo e crie EXATAMENTE ${config.quantidade_perguntas} perguntas de avaliação de ALTO NÍVEL (difíceis, que exijam compreensão profunda, não memorização simples).
Tipo: ${tipoInstr}.
${config.direcionamento ? `Direcionamento especial: ${config.direcionamento}` : ""}

CONTEÚDO DO TREINAMENTO:
${texto.slice(0, 8000)}

Retorne APENAS um JSON válido, sem markdown, sem explicações, no formato:
{
  "perguntas": [
    {
      "ordem": 1,
      "tipo": "multipla_escolha",
      "enunciado": "texto da pergunta",
      "opcao_a": "texto",
      "opcao_b": "texto",
      "opcao_c": "texto",
      "opcao_d": "texto",
      "resposta_correta": "b"
    }
  ]
}
Para verdadeiro/falso, opcao_c e opcao_d ficam como strings vazias "".`;

    try {
      const raw = await callClaude(prompt);
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setPerguntas(parsed.perguntas || []);
      setStep("preview");
    } catch (e) {
      alert("Erro ao gerar perguntas. Tente novamente.");
      console.error(e);
    }
    setLoading(false);
  }

  function publicar() {
    const token = genToken();
    const quiz = DB.insert("questionarios", {
      titulo: config.titulo || "Avaliação de Treinamento",
      tipo_perguntas: config.tipo_perguntas,
      quantidade_perguntas: perguntas.length,
      direcionamento: config.direcionamento,
      link_token: token,
      criado_por: user.id,
      ativo: true,
    });
    perguntas.forEach(p => DB.insert("perguntas", { ...p, questionario_id: quiz.id }));
    setLista(DB.get("questionarios"));
    setQuizAtual(quiz);
    setStep("done");
  }

  function excluirQuiz(id) {
    if (!confirm("Excluir questionário e todas as respostas?")) return;
    DB.delete("questionarios", id);
    DB.get("perguntas").filter(p => p.questionario_id === id).forEach(p => DB.delete("perguntas", p.id));
    DB.get("respostas_consultor").filter(r => r.questionario_id === id).forEach(r => DB.delete("respostas_consultor", r.id));
    setLista(DB.get("questionarios"));
  }

  const linkBase = window.location.origin + window.location.pathname;

  if (step === "config") return (
    <div>
      <p style={S.pageTitle}>Novo questionário</p>
      <p style={S.pageSubtitle}>Configure e faça upload do conteúdo</p>

      <div style={S.card}>
        <p style={{ fontSize: 14, fontWeight: 500, color: "#1a3d2b", marginBottom: 16 }}>1. Configurações</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div>
            <label style={S.label}>Título do questionário</label>
            <input style={S.input} value={config.titulo} onChange={e => setConfig(p => ({ ...p, titulo: e.target.value }))} placeholder="Ex: Avaliação Módulo Fragrâncias" />
          </div>
          <div>
            <label style={S.label}>Tipo de perguntas</label>
            <select style={S.input} value={config.tipo_perguntas} onChange={e => setConfig(p => ({ ...p, tipo_perguntas: e.target.value }))}>
              <option value="multipla_escolha">Múltipla escolha</option>
              <option value="verdadeiro_falso">Verdadeiro / Falso</option>
              <option value="misto">Misto</option>
            </select>
          </div>
          <div>
            <label style={S.label}>Quantidade de perguntas</label>
            <select style={S.input} value={config.quantidade_perguntas} onChange={e => setConfig(p => ({ ...p, quantidade_perguntas: Number(e.target.value) }))}>
              {[10,11,12,13,14,15].map(n => <option key={n} value={n}>{n} perguntas</option>)}
            </select>
          </div>
        </div>
        <div>
          <label style={S.label}>Direcionamento especial (opcional)</label>
          <textarea style={{ ...S.input, height: 70, resize: "vertical" }} value={config.direcionamento} onChange={e => setConfig(p => ({ ...p, direcionamento: e.target.value }))} placeholder="Ex: Dê mais ênfase no módulo de objeções e técnicas de fechamento." />
        </div>
      </div>

      <div style={S.card}>
        <p style={{ fontSize: 14, fontWeight: 500, color: "#1a3d2b", marginBottom: 16 }}>2. Conteúdo do treinamento</p>
        <div style={{ marginBottom: 12 }}>
          <label style={S.label}>Upload de arquivo (TXT, MD — PDF e DOCX: cole o texto abaixo)</label>
          <input ref={fileRef} type="file" accept=".txt,.md,.csv" style={{ display: "none" }} onChange={e => setArquivo(e.target.files[0])} />
          <button style={{ ...S.btnSecondary, padding: "8px 16px", fontSize: 13 }} onClick={() => fileRef.current.click()}>
            📎 {arquivo ? arquivo.name : "Escolher arquivo"}
          </button>
        </div>
        <div>
          <label style={S.label}>Ou cole o conteúdo aqui</label>
          <textarea style={{ ...S.input, height: 160, resize: "vertical" }} value={conteudo} onChange={e => setConteudo(e.target.value)} placeholder="Cole o conteúdo do material de treinamento aqui..." />
        </div>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button style={{ ...S.btnPrimary, minWidth: 180 }} onClick={gerarPerguntas} disabled={loading}>
          {loading ? "🤖 Gerando perguntas..." : "🤖 Gerar com IA"}
        </button>
        <button style={S.btnSecondary} onClick={() => setStep("list")}>Cancelar</button>
      </div>
    </div>
  );

  if (step === "preview") return (
    <div>
      <p style={S.pageTitle}>Prévia das perguntas</p>
      <p style={S.pageSubtitle}>{perguntas.length} perguntas geradas — revise antes de publicar</p>

      {perguntas.map((p, i) => (
        <div key={i} style={S.card}>
          <p style={{ fontSize: 12, color: GREEN, fontWeight: 500, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Pergunta {i + 1} · {p.tipo === "verdadeiro_falso" ? "V/F" : "Múltipla escolha"}</p>
          <p style={{ fontSize: 15, fontWeight: 500, color: "#1a3d2b", marginBottom: 12 }}>{p.enunciado}</p>
          {["a","b","c","d"].filter(l => p[`opcao_${l}`]).map(l => (
            <div key={l} style={{ display: "flex", gap: 10, padding: "8px 12px", borderRadius: 8, background: p.resposta_correta === l ? GREEN_LIGHT : "#f9f9f9", border: `1px solid ${p.resposta_correta === l ? GREEN : "#eee"}`, marginBottom: 6 }}>
              <span style={{ fontWeight: 600, color: p.resposta_correta === l ? GREEN : "#999", minWidth: 16 }}>{l.toUpperCase()}</span>
              <span style={{ fontSize: 14, color: "#444" }}>{p[`opcao_${l}`]}</span>
              {p.resposta_correta === l && <span style={{ marginLeft: "auto", color: GREEN, fontSize: 12 }}>✓ correta</span>}
            </div>
          ))}
        </div>
      ))}

      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <button style={S.btnPrimary} onClick={publicar}>✅ Publicar e gerar link</button>
        <button style={S.btnSecondary} onClick={() => { setStep("config"); setPerguntas([]); }}>↩ Regenerar</button>
      </div>
    </div>
  );

  if (step === "done") return (
    <div>
      <p style={S.pageTitle}>Questionário publicado! 🎉</p>
      <p style={S.pageSubtitle}>Compartilhe o link abaixo com os consultores</p>
      <div style={{ ...S.card, background: GREEN_LIGHT, border: `1.5px solid ${GREEN}` }}>
        <p style={{ fontSize: 13, color: GREEN_DARK, fontWeight: 500, marginBottom: 8 }}>🔗 Link do questionário</p>
        <div style={{ background: "#fff", borderRadius: 8, padding: "12px 16px", fontSize: 14, fontFamily: "monospace", color: "#333", wordBreak: "break-all", marginBottom: 12 }}>
          {linkBase}?quiz={quizAtual?.link_token}
        </div>
        <button style={{ ...S.btnPrimary, fontSize: 13 }} onClick={() => { navigator.clipboard?.writeText(`${linkBase}?quiz=${quizAtual?.link_token}`); alert("Link copiado!"); }}>
          📋 Copiar link
        </button>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <button style={S.btnSecondary} onClick={() => { setStep("list"); setLista(DB.get("questionarios")); setConfig({ titulo: "", tipo_perguntas: "multipla_escolha", quantidade_perguntas: 10, direcionamento: "" }); setConteudo(""); setArquivo(null); }}>
          Ver todos os questionários
        </button>
      </div>
    </div>
  );

  // LIST
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <p style={S.pageTitle}>Questionários</p>
          <p style={S.pageSubtitle}>Avaliações geradas pela IA</p>
        </div>
        <button style={S.btnPrimary} onClick={() => setStep("config")}>+ Novo questionário</button>
      </div>

      {lista.length === 0 && (
        <div style={{ ...S.card, textAlign: "center", padding: 40, color: "#aaa" }}>
          <p style={{ fontSize: 32, marginBottom: 8 }}>📝</p>
          <p>Nenhum questionário criado ainda.</p>
        </div>
      )}

      {lista.map(q => {
        const qtdRespostas = DB.findBy("respostas_consultor", "questionario_id", q.id).length;
        return (
          <div key={q.id} style={{ ...S.card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={S.cardTitle}>{q.titulo}</p>
              <p style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>
                {q.quantidade_perguntas} perguntas · {qtdRespostas} resposta{qtdRespostas !== 1 ? "s" : ""} · criado em {fmtDate(q.criado_em)}
              </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ ...S.btnSecondary, padding: "6px 12px", fontSize: 12 }} onClick={() => setShowLink(q)}>🔗 Link</button>
              <button style={{ ...S.btnDanger, padding: "6px 12px", fontSize: 12 }} onClick={() => excluirQuiz(q.id)}>✕</button>
            </div>
          </div>
        );
      })}

      {showLink && (
        <div style={S.modalBg} onClick={() => setShowLink(null)}>
          <div style={S.modalCard} onClick={e => e.stopPropagation()}>
            <p style={{ ...S.pageTitle, fontSize: 18, marginBottom: 8 }}>{showLink.titulo}</p>
            <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>Compartilhe este link no WhatsApp da equipe</p>
            <div style={{ background: GREEN_LIGHT, borderRadius: 8, padding: "12px 16px", fontSize: 13, fontFamily: "monospace", color: "#333", wordBreak: "break-all", marginBottom: 12 }}>
              {linkBase}?quiz={showLink.link_token}
            </div>
            <button style={{ ...S.btnPrimary, width: "100%" }} onClick={() => { navigator.clipboard?.writeText(`${linkBase}?quiz=${showLink.link_token}`); alert("Link copiado!"); }}>
              📋 Copiar link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── RESULTADOS ───────────────────────────────────────────────────────────────
function Resultados({ user }) {
  const [quizSel, setQuizSel] = useState(null);
  const quizzes = DB.get("questionarios");
  const todasRespostas = DB.get("respostas_consultor");

  const respostas = quizSel
    ? todasRespostas.filter(r => r.questionario_id === quizSel)
    : todasRespostas;

  const aprovados = respostas.filter(r => r.aprovado).length;
  const reprovados = respostas.length - aprovados;

  return (
    <div>
      <p style={S.pageTitle}>Resultados</p>
      <p style={S.pageSubtitle}>Desempenho dos consultores</p>

      <div style={{ marginBottom: 20 }}>
        <label style={S.label}>Filtrar por questionário</label>
        <select style={{ ...S.input, maxWidth: 360 }} value={quizSel || ""} onChange={e => setQuizSel(e.target.value ? Number(e.target.value) : null)}>
          <option value="">Todos os questionários</option>
          {quizzes.map(q => <option key={q.id} value={q.id}>{q.titulo}</option>)}
        </select>
      </div>

      <div style={S.metricGrid}>
        <div style={S.metricCard()}><div style={S.metricNum}>{respostas.length}</div><div style={S.metricLabel}>Total respondido</div></div>
        <div style={S.metricCard()}><div style={{ ...S.metricNum, color: GREEN }}>{aprovados}</div><div style={S.metricLabel}>Aprovados ≥ 8,0</div></div>
        <div style={S.metricCard()}><div style={{ ...S.metricNum, color: "#c0392b" }}>{reprovados}</div><div style={S.metricLabel}>Precisam de reforço</div></div>
        <div style={S.metricCard()}>
          <div style={S.metricNum}>{respostas.length > 0 ? (respostas.reduce((s,r) => s+Number(r.nota),0)/respostas.length).toFixed(1) : "—"}</div>
          <div style={S.metricLabel}>Média</div>
        </div>
      </div>

      {respostas.length === 0 && (
        <div style={{ ...S.card, textAlign: "center", padding: 40, color: "#aaa" }}>
          <p style={{ fontSize: 32, marginBottom: 8 }}>🏆</p>
          <p>Nenhuma resposta registrada.</p>
        </div>
      )}

      {respostas.length > 0 && (
        <div style={S.card}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Consultor</th>
                <th style={S.th}>Loja</th>
                <th style={S.th}>Questionário</th>
                <th style={S.th}>Acertos</th>
                <th style={S.th}>Nota</th>
                <th style={S.th}>Resultado</th>
                <th style={S.th}>Data</th>
              </tr>
            </thead>
            <tbody>
              {respostas.sort((a,b) => new Date(b.respondido_em)-new Date(a.respondido_em)).map(r => {
                const q = quizzes.find(q => q.id === r.questionario_id);
                return (
                  <tr key={r.id}>
                    <td style={S.td}><strong>{r.nome_consultor}</strong></td>
                    <td style={S.td}>{r.loja || "—"}</td>
                    <td style={{ ...S.td, fontSize: 12, color: "#888" }}>{q?.titulo || "—"}</td>
                    <td style={S.td}>{r.total_acertos}/{r.total_perguntas}</td>
                    <td style={S.td}><strong style={{ color: r.aprovado ? GREEN : "#c0392b" }}>{fmtNota(r.nota)}</strong></td>
                    <td style={S.td}><span style={S.badge(r.aprovado)}>{r.aprovado ? "✓ Aprovado" : "⚠ Reforço"}</span></td>
                    <td style={{ ...S.td, fontSize: 12, color: "#aaa" }}>{fmtDate(r.respondido_em)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── USUÁRIOS ─────────────────────────────────────────────────────────────────
function Usuarios() {
  const [lista, setLista] = useState(DB.get("usuarios"));
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", senha: "", perfil: "gerencia", loja_id: "" });
  const lojas = DB.get("lojas");

  function salvar() {
    if (!form.nome || !form.email || !form.senha) { alert("Preencha nome, e-mail e senha."); return; }
    if (DB.findOne("usuarios", "email", form.email.toLowerCase())) { alert("E-mail já cadastrado."); return; }
    DB.insert("usuarios", { nome: form.nome, email: form.email.toLowerCase(), senha_hash: hashPassword(form.senha), perfil: form.perfil, loja_id: form.loja_id ? Number(form.loja_id) : null, ativo: true });
    setLista(DB.get("usuarios")); setShowModal(false);
    setForm({ nome: "", email: "", senha: "", perfil: "gerencia", loja_id: "" });
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div><p style={S.pageTitle}>Usuários</p><p style={S.pageSubtitle}>Multiplicadora e perfis de gerência</p></div>
        <button style={S.btnPrimary} onClick={() => setShowModal(true)}>+ Novo usuário</button>
      </div>
      <div style={S.card}>
        <table style={S.table}>
          <thead><tr><th style={S.th}>Nome</th><th style={S.th}>E-mail</th><th style={S.th}>Perfil</th><th style={S.th}>Loja</th></tr></thead>
          <tbody>
            {lista.map(u => (
              <tr key={u.id}>
                <td style={S.td}><strong>{u.nome}</strong></td>
                <td style={S.td}>{u.email}</td>
                <td style={S.td}><span style={S.badge(u.perfil === "multiplicadora")}>{u.perfil}</span></td>
                <td style={S.td}>{lojas.find(l => l.id === u.loja_id)?.nome || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div style={S.modalBg} onClick={() => setShowModal(false)}>
          <div style={S.modalCard} onClick={e => e.stopPropagation()}>
            <p style={{ ...S.pageTitle, fontSize: 20, marginBottom: 20 }}>Novo usuário</p>
            {[["nome","Nome *","text"],["email","E-mail *","email"],["senha","Senha *","password"]].map(([k,l,t]) => (
              <div key={k} style={{ marginBottom: 12 }}>
                <label style={S.label}>{l}</label>
                <input style={S.input} type={t} value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} />
              </div>
            ))}
            <div style={{ marginBottom: 12 }}>
              <label style={S.label}>Perfil</label>
              <select style={S.input} value={form.perfil} onChange={e => setForm(p => ({ ...p, perfil: e.target.value }))}>
                <option value="multiplicadora">Multiplicadora</option>
                <option value="gerencia">Gerência</option>
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={S.label}>Loja (opcional)</label>
              <select style={S.input} value={form.loja_id} onChange={e => setForm(p => ({ ...p, loja_id: e.target.value }))}>
                <option value="">Sem loja vinculada</option>
                {lojas.map(l => <option key={l.id} value={l.id}>{l.nome}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ ...S.btnPrimary, flex: 1 }} onClick={salvar}>Salvar</button>
              <button style={{ ...S.btnSecondary, flex: 1 }} onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── QUIZ DO CONSULTOR ────────────────────────────────────────────────────────
function QuizConsultor({ token }) {
  const [quiz, setQuiz] = useState(null);
  const [perguntas, setPerguntas] = useState([]);
  const [step, setStep] = useState("intro"); // intro | quiz | done | jaRespondeu | invalido
  const [nome, setNome] = useState("");
  const [loja, setLoja] = useState("");
  const [respostas, setRespostas] = useState({});
  const [atual, setAtual] = useState(0);
  const lojas = DB.get("lojas");

  useEffect(() => {
    const q = DB.findOne("questionarios", "link_token", token);
    if (!q || !q.ativo) { setStep("invalido"); return; }
    // Check if already answered from this session
    const jaRespondeu = sessionStorage.getItem("mb_respondeu_" + token);
    if (jaRespondeu) { setStep("jaRespondeu"); return; }
    const ps = DB.findBy("perguntas", "questionario_id", q.id).sort((a,b) => a.ordem - b.ordem);
    setQuiz(q); setPerguntas(ps);
  }, [token]);

  function iniciar() {
    if (!nome.trim()) { alert("Informe seu nome completo."); return; }
    setStep("quiz");
  }

  function selecionarResposta(letra) {
    setRespostas(p => ({ ...p, [atual]: letra }));
  }

  function avancar() {
    if (!respostas[atual]) { alert("Selecione uma resposta para continuar."); return; }
    if (atual < perguntas.length - 1) { setAtual(a => a + 1); }
    else { finalizar(); }
  }

  function finalizar() {
    const acertos = perguntas.filter((p, i) => respostas[i] === p.resposta_correta).length;
    const nota = (acertos / perguntas.length) * 10;
    const aprovado = nota >= 8;
    DB.insert("respostas_consultor", {
      questionario_id: quiz.id,
      nome_consultor: nome.trim(),
      loja: loja || null,
      respostas: JSON.stringify(respostas),
      total_perguntas: perguntas.length,
      total_acertos: acertos,
      nota,
      aprovado,
      respondido_em: new Date().toISOString(),
    });
    sessionStorage.setItem("mb_respondeu_" + token, "1");
    setStep("done");
  }

  if (step === "invalido") return (
    <div style={S.quizBg}>
      <div style={{ ...S.quizCard, textAlign: "center", padding: 48 }}>
        <p style={{ fontSize: 40, marginBottom: 12 }}>❌</p>
        <p style={{ fontSize: 18, fontWeight: 500, color: "#1a3d2b", marginBottom: 8 }}>Link inválido ou expirado</p>
        <p style={{ color: "#888", fontSize: 14 }}>Este questionário não está disponível.</p>
      </div>
    </div>
  );

  if (step === "jaRespondeu") return (
    <div style={S.quizBg}>
      <div style={{ ...S.quizCard, textAlign: "center", padding: 48 }}>
        <div style={S.quizHeader}>
          <img src={`data:image/jpeg;base64,${LOGO_B64}`} style={{ width: 70, borderRadius: 6 }} alt="oBoticário" />
          <span style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: GREEN }}>Niterói</span>
        </div>
        <p style={{ fontSize: 40, marginBottom: 12 }}>✅</p>
        <p style={{ fontSize: 18, fontWeight: 500, color: "#1a3d2b", marginBottom: 8 }}>Você já respondeu esta avaliação</p>
        <p style={{ color: "#888", fontSize: 14 }}>Suas respostas foram registradas. Obrigado!</p>
      </div>
    </div>
  );

  if (step === "done") return (
    <div style={S.quizBg}>
      <div style={{ ...S.quizCard, textAlign: "center", padding: 48 }}>
        <div style={S.quizHeader}>
          <img src={`data:image/jpeg;base64,${LOGO_B64}`} style={{ width: 70, borderRadius: 6 }} alt="oBoticário" />
          <span style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: GREEN }}>Niterói</span>
        </div>
        <p style={{ fontSize: 40, marginBottom: 12 }}>🎉</p>
        <p style={{ fontSize: 20, fontWeight: 500, color: "#1a3d2b", marginBottom: 8 }}>Obrigado, {nome.split(" ")[0]}!</p>
        <p style={{ color: "#888", fontSize: 14, lineHeight: 1.6 }}>Suas respostas foram registradas com sucesso.<br />Você pode fechar esta página.</p>
      </div>
    </div>
  );

  if (step === "intro") return (
    <div style={S.quizBg}>
      <div style={S.quizCard}>
        <div style={S.quizHeader}>
          <img src={`data:image/jpeg;base64,${LOGO_B64}`} style={{ width: 70, borderRadius: 6 }} alt="oBoticário" />
          <span style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: GREEN }}>Niterói</span>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#1a3d2b", fontWeight: 400, textAlign: "center", margin: "4px 0 0" }}>
            {quiz?.titulo}
          </p>
          <p style={{ fontSize: 13, color: "#888", textAlign: "center" }}>{perguntas.length} perguntas</p>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={S.label}>Nome completo *</label>
          <input style={S.input} value={nome} onChange={e => setNome(e.target.value)} placeholder="Digite seu nome completo" />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={S.label}>Sua loja (opcional)</label>
          <select style={S.input} value={loja} onChange={e => setLoja(e.target.value)}>
            <option value="">Prefiro não informar</option>
            {lojas.map(l => <option key={l.id} value={l.nome}>{l.nome}</option>)}
          </select>
        </div>
        <button style={{ ...S.btnPrimary, width: "100%", padding: "14px", fontSize: 16 }} onClick={iniciar}>
          Iniciar avaliação →
        </button>
      </div>
    </div>
  );

  // QUIZ
  const p = perguntas[atual];
  const pct = Math.round(((atual + (respostas[atual] ? 1 : 0)) / perguntas.length) * 100);
  const opcoes = ["a","b","c","d"].filter(l => p[`opcao_${l}`]);

  return (
    <div style={S.quizBg}>
      <div style={{ width: "100%", maxWidth: 600, marginBottom: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#888", marginBottom: 6 }}>
          <span>{quiz?.titulo}</span>
          <span>{atual + 1} / {perguntas.length}</span>
        </div>
        <div style={{ height: 4, background: "#e0ece8", borderRadius: 4 }}>
          <div style={S.progressBar(pct)} />
        </div>
      </div>

      <div style={S.quizCard}>
        <p style={S.quizNum}>Pergunta {atual + 1}</p>
        <p style={S.quizEnunciado}>{p.enunciado}</p>
        {opcoes.map(l => (
          <div key={l} style={S.quizOpcao(respostas[atual] === l)} onClick={() => selecionarResposta(l)}>
            <div style={S.quizOpcaoLetter(respostas[atual] === l)}>{l.toUpperCase()}</div>
            <span style={{ fontSize: 15, color: "#333", lineHeight: 1.4 }}>{p[`opcao_${l}`]}</span>
          </div>
        ))}
        <button
          style={{ ...S.btnPrimary, width: "100%", marginTop: 12, padding: 14, fontSize: 15, opacity: respostas[atual] ? 1 : 0.5 }}
          onClick={avancar}
        >
          {atual < perguntas.length - 1 ? "Próxima →" : "Finalizar avaliação ✓"}
        </button>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [showLogin, setShowLogin] = useState(false);

  // Check for quiz token in URL
  const urlParams = new URLSearchParams(window.location.search);
  const quizToken = urlParams.get("quiz");

  useEffect(() => { DB.seed(); }, []);

  // If quiz token present, show quiz
  if (quizToken) {
    return (
      <>
        <FontLoader />
        <QuizConsultor token={quizToken} />
      </>
    );
  }

  // If logged in, show admin panel
  if (user) {
    return (
      <>
        <FontLoader />
        <div style={{ display: "flex", minHeight: "100vh", background: "#f7faf9" }}>
          <Sidebar user={user} page={page} setPage={setPage} onLogout={() => { setUser(null); setPage("dashboard"); }} />
          <div style={S.mainContent}>
            {page === "dashboard" && <Dashboard user={user} />}
            {page === "agenda" && user.perfil === "multiplicadora" && <Agenda user={user} />}
            {page === "questionarios" && user.perfil === "multiplicadora" && <Questionarios user={user} />}
            {page === "resultados" && <Resultados user={user} />}
            {page === "usuarios" && user.perfil === "multiplicadora" && <Usuarios />}
          </div>
        </div>
      </>
    );
  }

  // Public home
  return (
    <>
      <FontLoader />
      <PublicHome onLoginClick={() => setShowLogin(true)} />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={(u) => { setUser(u); setShowLogin(false); }} />}
    </>
  );
}
