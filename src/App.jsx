import { useState, useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  loginUser, getLojas,
  getTreinamentos, insertTreinamento, deleteTreinamento,
  getQuestionarios, getQuestionarioByToken, insertQuestionario, deleteQuestionario,
  getPerguntasByQuiz, insertPerguntas,
  getRespostas, insertResposta, jaRespondeu,
  getUsuarios, insertUsuario, emailExiste, updateSenha
} from "./db.js";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const GREEN = "#3D9B7A";
const GREEN_DARK = "#2a6b54";
const GREEN_LIGHT = "#e8f5f0";
const LOGO_B64 = "/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCACGAOwDASIAAhEBAxEB/8QAGgABAAMBAQEAAAAAAAAAAAAAAAMEBQYBAv/EADcQAAICAgECAwYDBQkBAAAAAAABAgMEEQUSIRMxQQYiUWFxgRQVkTJSYoKhByMkMzQ1QpSx0f/EABoBAQEBAQEBAQAAAAAAAAAAAAACAwEFBAf/xAAkEQEAAgECBgIDAAAAAAAAAAAAAQIRAzEEEiFBUXEysROBof/aAAwDAQACEQMRAD8A+gAU/KgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB7GMpyUYRlKTekkttl58PnwqVl1UKIN6TvtjX3/maJeHnKnjeUvqm67oVVqE4vUo7mk9P6GXJuTbk22+7b9Q1xWsRMtKHEuUU/wAw41fL8VE+a+Iy7ZyhjvGvlFbarya5P9N7M7SPQ5zU8JMii7Hs8PIpsqnrfTOLT19yM0qLbL+Ay422SsjVbU6lJ76Nqe9fojNDl6xGMdwABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAsYOZfh2SlV0SjNdM4WRUoTXwaLtUcDPxctxwnjZFFLuUq7W4S1KKa6Zba8/iZdcZWWRrhFynJqMYpbbb9Eak4VcVj5FVlqnm31eFKuHeNS6k31P8Ae7eS8g205nHXZlGlhU4dXFTz8qizIl46phWrOiK91vb7bZmmjgW492BPjcmx0KVytqt1uKlprUvXXddwnS+SHKz7LaVj1U04+OpdXh1J93305N7cn39SoTZuLdh3eFfFRlpSTT2pJ+TTXmvmQhNpmZ6gACQAAAAAAAAAAAAAAAAAAAAAAAAAeugAPqmuy22NVUJWWTkoxjFbcm+ySXxLuRwvL49Vlt/FZtddf+ZKVEkoL5vXYNK6drbQkxWuO41Zi/1OS3Gh/uQXaU182+y+jMw0faHqhnwxnrpox6q12/gTf9W/1M7trew7qRMTyxtAB6ngZ9Wrx0nyGK+Ms962Kc8WT7tSS24fSX/ujLJaJXY8qs2EJahanCWuzlHT1v7r9SxztUaOZzKoxUVG6WkvRb2Glom1OaVIBAM8AADgAAAAAAAAAAAAAAAAAAAAAG77IVxf5rkxphdlY2BO7GjNJqMlKKlNJ9m4xcpL6bMIkxr7sa6N+PdZTbB7jOuTjJP5NBro6kad4tMOz4XpzOP4Tks2Slnx56qiq2Wuq2rUZS2/OSjLXd+XVovYEOOyP7RecxcP8VDkcizOqrlbKMqOp+I5daS309nr567M4S/kuQvyKci7NyLLqWnXOVjbg09rp+Hfv2J7uc5i2u2u3lMycLU1YndL30/PffuHoafHUrERjbH76e3Se1WXkYVXCXcVCMI5+FC62Sh1ePbvpcJbXvJJRXT5d/LuaVMqsH2s9qeM4y9/gcXjsq2itNONNqgpPp+DjJyXy0crHk+Sr4LGtw8/Kp8CbotVdril5uEtL105LfyRj4+VkY7tdF1lbtrlXY4ya64y84vXmmC3G1raLep/nZ0vBqrkeGybOTvk43cvhQuuk/ejBxtUnv091f0IfaPJz1zfL8WsWt4dE7Ywo8JKNEIy92Uda6XrXf8A5b774=";

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function genToken(len = 24) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}
function hashPassword(pw) {
  return pw; // plain text comparison - hash done server side in future
}
function fmtDate(d) {
  if (!d) return "";
  // Postgres pode retornar Date object ou string "2026-06-03" ou "2026-06-03T..."
  const s = (d instanceof Date ? d.toISOString() : String(d)).slice(0, 10);
  const parts = s.split("-").map(Number);
  if (parts.length < 3 || parts.some(isNaN)) return "";
  const [y, m, day] = parts;
  return new Date(y, m - 1, day).toLocaleDateString("pt-BR");
}
function fmtNota(n) { return Number(n).toFixed(1); }

// ─── CLAUDE API ───────────────────────────────────────────────────────────────
async function callClaude(prompt) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: "Você é especialista em treinamento corporativo do setor de beleza e varejo.",
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || "";
}

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

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  pubBg: { background: GREEN, minHeight: "100vh", color: "#fff", position: "relative", overflow: "hidden", fontFamily: "'DM Sans', sans-serif" },
  pubHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 28px 0" },
  pubLogo: { display: "flex", flexDirection: "column", alignItems: "center", gap: 2 },
  pubLogoImg: { width: 80, borderRadius: 6 },
  pubNiteroi: { fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.65)", fontWeight: 400 },
  pubHero: { padding: "32px 28px 20px" },
  pubEyebrow: { fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: 8, fontWeight: 500 },
  pubTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, lineHeight: 1.15, margin: "0 0 6px", color: "#fff" },
  pubSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 300 },
  pubDivider: { width: 40, height: 1, background: "rgba(255,255,255,0.3)", margin: "16px 28px" },
  pubSection: { padding: "0 28px 24px" },
  pubSectionLabel: { fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 12, fontWeight: 500 },
  pubCard: { background: "rgba(255,255,255,0.09)", border: "0.5px solid rgba(255,255,255,0.18)", borderRadius: 12, padding: "14px 16px", marginBottom: 10, display: "flex", alignItems: "center", gap: 14 },
  pubDay: { fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 300, lineHeight: 1, color: "#fff" },
  pubMonth: { fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginTop: 2, fontWeight: 500 },
  pubSep: { width: "0.5px", height: 34, background: "rgba(255,255,255,0.2)" },
  pubEventTitle: { fontSize: 14, fontWeight: 500, color: "#fff", marginBottom: 3 },
  pubMeta: { fontSize: 12, color: "rgba(255,255,255,0.5)", display: "flex", gap: 10, flexWrap: "wrap" },
  pubBadge: (ok) => ({ fontSize: 10, fontWeight: 500, padding: "3px 10px", borderRadius: 20, background: ok ? "rgba(100,220,160,0.2)" : "rgba(255,255,255,0.15)", color: ok ? "#7DEBB0" : "rgba(255,255,255,0.8)", whiteSpace: "nowrap" }),
  btnPrimary: { background: GREEN, color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, cursor: "pointer" },
  btnSecondary: { background: "#fff", color: GREEN, border: `1.5px solid ${GREEN}`, borderRadius: 8, padding: "10px 20px", fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, cursor: "pointer" },
  btnGhost: { background: "rgba(255,255,255,0.12)", border: "0.5px solid rgba(255,255,255,0.3)", color: "#fff", borderRadius: 24, padding: "8px 20px", fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 },
  btnDanger: { background: "#fff", color: "#c0392b", border: "1.5px solid #c0392b", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, cursor: "pointer" },
  input: { width: "100%", border: "0.5px solid #ccc", borderRadius: 8, padding: "10px 12px", fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: "#222", background: "#fafafa", boxSizing: "border-box", outline: "none" },
  label: { fontSize: 11, fontWeight: 500, letterSpacing: 1, textTransform: "uppercase", color: "#666", display: "block", marginBottom: 4 },
  sidebar: { width: 220, background: "#fff", borderRight: "0.5px solid #e0ece8", minHeight: "100vh", display: "flex", flexDirection: "column" },
  sidebarLogo: { padding: "20px 20px 16px", borderBottom: "0.5px solid #e8f0ed", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  navItem: (a) => ({ display: "flex", alignItems: "center", gap: 10, padding: "11px 20px", fontSize: 14, color: a ? GREEN : "#555", background: a ? GREEN_LIGHT : "transparent", fontWeight: a ? 500 : 400, cursor: "pointer", borderLeft: a ? `3px solid ${GREEN}` : "3px solid transparent" }),
  mainContent: { flex: 1, padding: "28px 32px", maxWidth: 900, fontFamily: "'DM Sans', sans-serif" },
  pageTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400, color: "#1a3d2b", marginBottom: 4 },
  pageSubtitle: { fontSize: 13, color: "#888", marginBottom: 24 },
  card: { background: "#fff", borderRadius: 12, border: "0.5px solid #e0ece8", padding: "20px 24px", marginBottom: 16 },
  cardTitle: { fontSize: 15, fontWeight: 500, color: "#1a3d2b", marginBottom: 4 },
  metricGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 24 },
  metricCard: { background: GREEN_LIGHT, borderRadius: 10, padding: "16px 18px", textAlign: "center" },
  metricNum: { fontSize: 28, fontWeight: 500, color: GREEN, lineHeight: 1 },
  metricLabel: { fontSize: 12, color: "#666", marginTop: 4 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  th: { padding: "10px 12px", textAlign: "left", borderBottom: "1.5px solid #e0ece8", color: "#888", fontSize: 12, fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase" },
  td: { padding: "12px 12px", borderBottom: "0.5px solid #f0f5f3", color: "#333", verticalAlign: "middle" },
  badge: (ok) => ({ display: "inline-block", fontSize: 11, fontWeight: 500, padding: "2px 10px", borderRadius: 20, background: ok ? "rgba(61,155,122,0.12)" : "rgba(192,57,43,0.1)", color: ok ? GREEN_DARK : "#c0392b" }),
  modalBg: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" },
  modalCard: { background: "#fff", borderRadius: 16, padding: "32px 28px", width: 480, maxWidth: "92vw", maxHeight: "85vh", overflowY: "auto", fontFamily: "'DM Sans', sans-serif" },
  quizBg: { background: "#f7faf9", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 16px", fontFamily: "'DM Sans', sans-serif" },
  quizCard: { background: "#fff", borderRadius: 16, border: "0.5px solid #e0ece8", padding: "28px 28px", width: "100%", maxWidth: 600, marginBottom: 16 },
  quizNum: { fontSize: 12, fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase", color: GREEN, marginBottom: 8, display: "block" },
  quizEnunciado: { fontSize: 16, fontWeight: 500, color: "#1a3d2b", lineHeight: 1.5, marginBottom: 20 },
  quizOpcao: (sel) => ({ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${sel ? GREEN : "#e0ece8"}`, background: sel ? GREEN_LIGHT : "#fff", cursor: "pointer", marginBottom: 10 }),
  quizOpcaoLetter: (sel) => ({ width: 28, height: 28, borderRadius: "50%", background: sel ? GREEN : "#f0f5f3", color: sel ? "#fff" : "#888", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 500, flexShrink: 0 }),
  progressBar: (pct) => ({ height: 4, background: GREEN, borderRadius: 4, width: `${pct}%`, transition: "width 0.3s" }),
  loading: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", flexDirection: "column", gap: 12, color: "#888", fontFamily: "'DM Sans', sans-serif" },
};

const LogoImg = ({ w = 80 }) => <img src={`data:image/jpeg;base64,${LOGO_B64}`} style={{ width: w, borderRadius: 6 }} alt="oBoticário" />;

// ─── LOGIN MODAL ──────────────────────────────────────────────────────────────
function LoginModal({ onClose, onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true); setErro("");
    const user = await loginUser(email, hashPassword(senha));
    if (!user) { setErro("Login ou senha incorretos."); setLoading(false); return; }
    onLogin(user); setLoading(false);
  }

  return (
    <div style={S.modalBg} onClick={onClose}>
      <div style={S.modalCard} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, marginBottom: 24 }}>
          <LogoImg w={80} />
          <span style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: GREEN, fontWeight: 500 }}>Niterói</span>
        </div>
        <p style={{ ...S.pageTitle, fontSize: 20, textAlign: "center", marginBottom: 20 }}>Acesso ao sistema</p>
        <div style={{ marginBottom: 14 }}>
          <label style={S.label}>Login</label>
          <input style={S.input} type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="Seu login ou e-mail" />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label style={S.label}>Senha</label>
          <input style={S.input} type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handleLogin()} />
        </div>
        {erro && <p style={{ fontSize: 12, color: "#c0392b", marginBottom: 8 }}>{erro}</p>}
        <p style={{ fontSize: 11, color: "#aaa", marginBottom: 16 }}></p>
        <button style={{ ...S.btnPrimary, width: "100%" }} onClick={handleLogin} disabled={loading}>
          {loading ? "Verificando..." : "Entrar"}
        </button>
        <button style={{ background: "none", border: "none", color: "#aaa", fontSize: 12, cursor: "pointer", width: "100%", marginTop: 8 }} onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}

// ─── PUBLIC HOME ──────────────────────────────────────────────────────────────
function PublicHome({ onLoginClick }) {
  const [treinamentos, setTreinamentos] = useState([]);
  const meses = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

  useEffect(() => {
    getTreinamentos().then(rows => setTreinamentos(rows.filter(t => t.status !== "cancelado").slice(0, 5)));
  }, []);

  // Calcula próximo treinamento futuro
  const hoje = new Date();
  const proxData = treinamentos.map(t => {
    const raw = (t.data_evento instanceof Date ? t.data_evento.toISOString() : String(t.data_evento || "")).slice(0,10);
    const [y,m,d] = raw.split("-").map(Number);
    return (y && m && d) ? new Date(y, m-1, d) : null;
  }).filter(d => d && d >= hoje).sort((a,b) => a-b)[0];
  const diasRestantes = proxData ? Math.ceil((proxData - hoje) / 86400000) : null;

  return (
    <div style={S.pubBg}>
      <div style={{ position: "absolute", width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.04)", top: -80, right: -60, pointerEvents: "none" }} />
      <div style={S.pubHeader}>
        <div style={S.pubLogo}>
          <span style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.9)", letterSpacing: 1 }}>oBoticário</span>
          <span style={{ ...S.pubNiteroi, fontSize: 11 }}>NITERÓI</span>
        </div>
        <button style={S.btnGhost} onClick={onLoginClick}>🔒 Acesso restrito</button>
      </div>
      <div style={{ ...S.pubHero, padding: "16px 28px 20px" }}>
        <p style={{ ...S.pubEyebrow, fontSize: 13, letterSpacing: 3 }}>Programa de desenvolvimento</p>
        <h1 style={{ ...S.pubTitle, fontSize: 56, marginBottom: 10 }}>Multiplica<br /><span style={{ fontWeight: 600, fontStyle: "italic" }}>Boti</span></h1>
        <p style={{ ...S.pubSubtitle, fontSize: 17, marginBottom: 16 }}>Agenda de treinamentos · Niterói</p>
        {diasRestantes !== null && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", border: "0.5px solid rgba(255,255,255,0.2)", borderRadius: 24, padding: "7px 16px", fontSize: 13, color: "rgba(255,255,255,0.85)" }}>
            📅 Próximo treinamento em <strong style={{ color: "#fff" }}>{diasRestantes === 0 ? "hoje!" : diasRestantes === 1 ? "1 dia" : `${diasRestantes} dias`}</strong>
          </div>
        )}
      </div>
      <div style={S.pubDivider} />
      <div style={S.pubSection}>
        <p style={S.pubSectionLabel}>Próximos treinamentos</p>
        {treinamentos.length === 0 && <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Nenhum treinamento agendado.</p>}
        {treinamentos.map(t => {
          const rawDate = (t.data_evento instanceof Date ? t.data_evento.toISOString() : String(t.data_evento || "")).slice(0, 10);
          const [dy, dm, dd] = rawDate.split("-").map(Number);
          const d = (dy && dm && dd && !isNaN(dy)) ? new Date(dy, dm - 1, dd) : new Date("invalid");
          return (
            <div key={t.id} style={{ ...S.pubCard, padding: "18px 20px", alignItems: "center" }}>
              <div style={{ textAlign: "center", minWidth: 48 }}>
                <div style={{ ...S.pubDay, fontSize: 32 }}>{isNaN(d.getDate()) ? "--" : String(d.getDate()).padStart(2,"0")}</div>
                <div style={S.pubMonth}>{isNaN(d.getMonth()) ? "" : meses[d.getMonth()]}</div>
              </div>
              <div style={{ ...S.pubSep, height: 44 }} />
              <div style={{ flex: 1 }}>
                <div style={{ ...S.pubEventTitle, fontSize: 16, marginBottom: 6 }}>{t.titulo}</div>
                <div style={S.pubMeta}>
                  {t.hora_inicio && <span>🕐 {String(t.hora_inicio).slice(0,5)}</span>}
                  {t.local && <span>📍 {t.local}</span>}
                </div>
              </div>
              <span style={S.pubBadge(t.status === "confirmado")}>{t.status === "confirmado" ? "Confirmado" : t.status === "realizado" ? "Realizado" : "Previsto"}</span>
            </div>
          );
        })}
      </div>
      <div style={{ padding: "16px 28px 32px", borderTop: "0.5px solid rgba(255,255,255,0.1)", marginTop: 8, textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: 0 }}>Dúvidas? Fale com sua multiplicadora</p>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ user, page, setPage, onLogout }) {
  const canEdit = user.perfil === "multiplicadora" || user.perfil === "diretor";
  const canManageUsers = user.perfil === "diretor";
  const items = canEdit
    ? [
        ["dashboard","📊","Dashboard"],
        ["agenda","📅","Agenda"],
        ["questionarios","📝","Questionários"],
        ["resultados","🏆","Resultados"],
        ["configuracoes","⚙️","Configurações"]
      ]
    : [["dashboard","📊","Dashboard"],["resultados","🏆","Resultados"],["configuracoes","⚙️","Configurações"]];
  return (
    <div style={S.sidebar}>
      <div style={S.sidebarLogo}>
        <LogoImg w={70} />
        <span style={{ fontSize: 8, letterSpacing: 3, textTransform: "uppercase", color: GREEN, fontWeight: 500 }}>Niterói</span>
        <p style={{ fontSize: 11, color: GREEN, fontWeight: 500, marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>Multiplica Boti</p>
      </div>
      <div style={{ flex: 1, padding: "12px 0" }}>
        {items.map(([id, icon, label]) => (
          <div key={id} style={S.navItem(page === id)} onClick={() => setPage(id)}>
            <span>{icon}</span><span>{label}</span>
          </div>
        ))}
      </div>
      <div style={{ padding: "16px 20px", borderTop: "0.5px solid #e0ece8", fontFamily: "'DM Sans', sans-serif" }}>
        <p style={{ fontSize: 12, color: "#888", marginBottom: 2 }}>{user.nome}</p>
        <p style={{ fontSize: 11, color: "#bbb", marginBottom: 10, textTransform: "capitalize" }}>{user.perfil}</p>
        <button style={{ ...S.btnSecondary, padding: "7px 16px", fontSize: 12, width: "100%" }} onClick={onLogout}>Sair</button>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard() {
  const [allRespostas, setAllRespostas] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [treinamentos, setTreinamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const now = new Date();
  const [mesSel, setMesSel] = useState(now.getMonth());
  const [anoSel, setAnoSel] = useState(now.getFullYear());

  useEffect(() => {
    Promise.all([getQuestionarios(), getRespostas(), getTreinamentos()]).then(([q, r, t]) => {
      setQuizzes(q); setAllRespostas(r); setTreinamentos(t); setLoading(false);
    });
  }, []);

  // Filtro mês
  const resMes = allRespostas.filter(r => {
    const raw = r.respondido_em;
    const s = raw instanceof Date ? raw.toISOString().slice(0,10) : String(raw).slice(0,10);
    const [y, m] = s.split("-").map(Number);
    return (m - 1) === mesSel && y === anoSel;
  });

  // Métricas
  function calcMetrics(resp) {
    const aprov = resp.filter(x => x.aprovado).length;
    const media = resp.length > 0 ? (resp.reduce((s,x) => s + Number(x.nota), 0) / resp.length).toFixed(1) : "—";
    const taxaAprov = resp.length > 0 ? Math.round(aprov / resp.length * 100) + "%" : "—";
    return { total: resp.length, aprov, media, taxaAprov };
  }
  const mMes = calcMetrics(resMes);
  const mAcum = calcMetrics(allRespostas);

  // Média por PDV no mês
  const porPdvMes = {};
  resMes.forEach(r => {
    const loja = r.loja || "Não definido";
    if (!porPdvMes[loja]) porPdvMes[loja] = [];
    porPdvMes[loja].push(Number(r.nota));
  });
  const pdvRows = Object.entries(porPdvMes)
    .map(([loja, notas]) => ({ loja, media: (notas.reduce((s,n)=>s+n,0)/notas.length).toFixed(1), total: notas.length }))
    .sort((a,b) => b.media - a.media);

  // Ranking consultoras no mês
  const porConsultor = {};
  resMes.forEach(r => {
    const k = r.nome_consultor;
    if (!porConsultor[k]) porConsultor[k] = { notas: [], aprov: 0 };
    porConsultor[k].notas.push(Number(r.nota));
    if (r.aprovado) porConsultor[k].aprov++;
  });
  const rankRows = Object.entries(porConsultor)
    .map(([nome, d]) => ({ nome, media: (d.notas.reduce((s,n)=>s+n,0)/d.notas.length).toFixed(1), total: d.notas.length, aprov: d.aprov }))
    .sort((a,b) => b.media - a.media)
    .slice(0, 8);

  // Taxa aprovação por quiz no mês
  const porQuiz = {};
  resMes.forEach(r => {
    const k = r.questionario_id;
    if (!porQuiz[k]) porQuiz[k] = { aprov: 0, total: 0 };
    porQuiz[k].total++;
    if (r.aprovado) porQuiz[k].aprov++;
  });
  const quizRows = Object.entries(porQuiz).map(([id, d]) => {
    const q = quizzes.find(x => x.id === Number(id));
    return { nome: q ? q.titulo : "Quiz #" + id, taxa: Math.round(d.aprov/d.total*100), aprov: d.aprov, total: d.total };
  }).sort((a,b) => a.taxa - b.taxa);

  // Evolução mensal (últimos 6 meses)
  const evolucao = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(anoSel, mesSel - i, 1);
    const m = d.getMonth(); const a = d.getFullYear();
    const resp = allRespostas.filter(r => { const raw2 = r.respondido_em; const s2 = raw2 instanceof Date ? raw2.toISOString().slice(0,10) : String(raw2).slice(0,10); const [ry,rm] = s2.split("-").map(Number); return (rm-1)===m && ry===a; });
    const media = resp.length > 0 ? (resp.reduce((s,x)=>s+Number(x.nota),0)/resp.length) : null;
    const meses = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
    evolucao.push({ label: meses[m] + "/" + String(a).slice(2), media, total: resp.length });
  }
  const maxMedia = 10;
  const chartH = 120;

  const mesesNomes = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  const anos = [...new Set(allRespostas.map(r => { const raw3 = r.respondido_em; const s3 = raw3 instanceof Date ? raw3.toISOString().slice(0,10) : String(raw3).slice(0,10); return Number(s3.split("-")[0]); }))].sort((a,b)=>b-a);
  if (!anos.includes(anoSel) && anos.length > 0) anos.unshift(anoSel);

  const cardStyle = { background:"#fff", borderRadius:12, border:"0.5px solid #e0ece8", padding:"20px 24px", marginBottom:16 };
  const sectionTitle = { fontSize:15, fontWeight:500, color:"#1a3d2b", marginBottom:14, marginTop:0 };
  const tagStyle = (ok) => ({ display:"inline-block", fontSize:11, fontWeight:500, padding:"2px 10px", borderRadius:20, background: ok ? "rgba(61,155,122,0.12)" : "rgba(192,57,43,0.1)", color: ok ? GREEN_DARK : "#c0392b" });

  if (loading) return <div style={S.loading}><div>⏳ Carregando...</div></div>;
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12, marginBottom:4 }}>
        <div>
          <p style={{ ...S.pageTitle, marginBottom:2 }}>Dashboard</p>
          <p style={S.pageSubtitle}>Visão geral do programa</p>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <select value={mesSel} onChange={e => setMesSel(Number(e.target.value))} style={{ border:"0.5px solid #cde5db", borderRadius:8, padding:"6px 12px", fontSize:13, color:"#1a3d2b", background:"#fff", cursor:"pointer" }}>
            {mesesNomes.map((m,i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <select value={anoSel} onChange={e => setAnoSel(Number(e.target.value))} style={{ border:"0.5px solid #cde5db", borderRadius:8, padding:"6px 12px", fontSize:13, color:"#1a3d2b", background:"#fff", cursor:"pointer" }}>
            {(anos.length > 0 ? anos : [anoSel]).map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      {/* Métricas lado a lado: mês vs acumulado */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
        <div style={{ ...cardStyle, marginBottom:0 }}>
          <p style={{ ...sectionTitle, marginBottom:12 }}>📅 {mesesNomes[mesSel]} {anoSel}</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {[["Avaliações",mMes.total],["Aprovados",mMes.aprov],["Média",mMes.media],["Taxa aprov.",mMes.taxaAprov]].map(([l,v]) => (
              <div key={l} style={{ background:GREEN_LIGHT, borderRadius:10, padding:"12px 14px", textAlign:"center" }}>
                <div style={{ fontSize:22, fontWeight:500, color:GREEN, lineHeight:1 }}>{v}</div>
                <div style={{ fontSize:11, color:"#666", marginTop:4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ ...cardStyle, marginBottom:0 }}>
          <p style={{ ...sectionTitle, marginBottom:12 }}>📈 Acumulado</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {[["Avaliações",mAcum.total],["Aprovados",mAcum.aprov],["Média",mAcum.media],["Taxa aprov.",mAcum.taxaAprov]].map(([l,v]) => (
              <div key={l} style={{ background:"#f0f5f3", borderRadius:10, padding:"12px 14px", textAlign:"center" }}>
                <div style={{ fontSize:22, fontWeight:500, color:"#2a6b54", lineHeight:1 }}>{v}</div>
                <div style={{ fontSize:11, color:"#666", marginTop:4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Evolução mensal */}
      <div style={cardStyle}>
        <p style={sectionTitle}>📉 Evolução da média (últimos 6 meses)</p>
        {evolucao.some(e => e.media !== null) ? (
          <div style={{ display:"flex", alignItems:"flex-end", gap:8, height: chartH + 32 }}>
            {evolucao.map((e, i) => {
              const h = e.media !== null ? Math.max(8, (e.media / maxMedia) * chartH) : 0;
              const isSelected = i === 5;
              return (
                <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                  <div style={{ fontSize:11, fontWeight:500, color: e.media !== null ? GREEN_DARK : "#ccc" }}>
                    {e.media !== null ? e.media : "—"}
                  </div>
                  <div style={{ width:"100%", height: h, background: isSelected ? GREEN : GREEN_LIGHT, borderRadius:"6px 6px 0 0", border: isSelected ? "none" : "0.5px solid #cde5db", transition:"height 0.3s" }} />
                  <div style={{ fontSize:10, color:"#888", textAlign:"center" }}>{e.label}</div>
                  <div style={{ fontSize:10, color:"#aaa" }}>{e.total > 0 ? e.total + " aval." : ""}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ color:"#aaa", fontSize:13 }}>Nenhum dado disponível.</p>
        )}
      </div>

      {/* Média por PDV */}
      {pdvRows.length > 0 && (
        <div style={cardStyle}>
          <p style={sectionTitle}>🏪 Média por PDV — {mesesNomes[mesSel]}</p>
          <table style={S.table}>
            <thead><tr><th style={S.th}>PDV</th><th style={S.th}>Avaliações</th><th style={S.th}>Média</th><th style={S.th}>Desempenho</th></tr></thead>
            <tbody>
              {pdvRows.map(row => (
                <tr key={row.loja}>
                  <td style={S.td}>{row.loja}</td>
                  <td style={S.td}>{row.total}</td>
                  <td style={S.td}><strong style={{ color: Number(row.media) >= 8 ? GREEN : "#c0392b" }}>{row.media}</strong></td>
                  <td style={S.td}>
                    <div style={{ background:"#f0f5f3", borderRadius:20, height:8, width:"100%", minWidth:80 }}>
                      <div style={{ background: Number(row.media) >= 8 ? GREEN : "#e67e22", borderRadius:20, height:8, width: (Number(row.media)/10*100) + "%" }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Ranking consultoras */}
      {rankRows.length > 0 && (
        <div style={cardStyle}>
          <p style={sectionTitle}>🏆 Ranking de consultoras — {mesesNomes[mesSel]}</p>
          <table style={S.table}>
            <thead><tr><th style={S.th}>#</th><th style={S.th}>Consultora</th><th style={S.th}>Avaliações</th><th style={S.th}>Aprovadas</th><th style={S.th}>Média</th></tr></thead>
            <tbody>
              {rankRows.map((row, i) => (
                <tr key={row.nome}>
                  <td style={S.td}><span style={{ fontWeight:600, color: i===0?"#f39c12": i===1?"#95a5a6": i===2?"#cd7f32":"#999" }}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":"#"+(i+1)}</span></td>
                  <td style={S.td}>{row.nome}</td>
                  <td style={S.td}>{row.total}</td>
                  <td style={S.td}><span style={tagStyle(row.aprov === row.total)}>{row.aprov}/{row.total}</span></td>
                  <td style={S.td}><strong style={{ color: Number(row.media) >= 8 ? GREEN : "#c0392b" }}>{row.media}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Taxa aprovação por quiz */}
      {quizRows.length > 0 && (
        <div style={cardStyle}>
          <p style={sectionTitle}>📝 Taxa de aprovação por quiz — {mesesNomes[mesSel]}</p>
          <table style={S.table}>
            <thead><tr><th style={S.th}>Quiz</th><th style={S.th}>Responderam</th><th style={S.th}>Aprovados</th><th style={S.th}>Taxa</th></tr></thead>
            <tbody>
              {quizRows.map(row => (
                <tr key={row.nome}>
                  <td style={S.td}>{row.nome}</td>
                  <td style={S.td}>{row.total}</td>
                  <td style={S.td}>{row.aprov}</td>
                  <td style={S.td}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ background:"#f0f5f3", borderRadius:20, height:8, flex:1, minWidth:60 }}>
                        <div style={{ background: row.taxa >= 80 ? GREEN : row.taxa >= 50 ? "#e67e22" : "#c0392b", borderRadius:20, height:8, width: row.taxa + "%" }} />
                      </div>
                      <span style={{ fontSize:12, fontWeight:500, color: row.taxa >= 80 ? GREEN_DARK : "#c0392b", minWidth:32 }}>{row.taxa}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {allRespostas.length === 0 && (
        <div style={{ ...cardStyle, textAlign:"center", padding:40, color:"#aaa" }}>
          <p style={{ fontSize:32, marginBottom:8 }}>📊</p>
          <p>Nenhuma avaliação respondida ainda.</p>
        </div>
      )}
    </div>
  );
}

// ─── AGENDA ───────────────────────────────────────────────────────────────────
function Agenda({ user }) {
  const [lista, setLista] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ titulo: "", descricao: "", data_evento: "", hora_inicio: "", local: "", status: "previsto" });
  const [saving, setSaving] = useState(false);
  useEffect(() => { getTreinamentos().then(setLista); }, []);
  const statusColors = { previsto: "#f39c12", confirmado: GREEN, cancelado: "#c0392b", realizado: "#888" };

  async function salvar() {
    if (!form.titulo || !form.data_evento) return;
    setSaving(true);
    await insertTreinamento({ ...form, criado_por: user.id });
    setLista(await getTreinamentos());
    setSaving(false); setShowModal(false);
    setForm({ titulo: "", descricao: "", data_evento: "", hora_inicio: "", local: "", status: "previsto" });
  }

  async function excluir(id) {
    if (!confirm("Excluir treinamento?")) return;
    await deleteTreinamento(id);
    setLista(await getTreinamentos());
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div><p style={S.pageTitle}>Agenda</p><p style={S.pageSubtitle}>Visível publicamente na tela inicial</p></div>
        <button style={S.btnPrimary} onClick={() => setShowModal(true)}>+ Novo treinamento</button>
      </div>
      {lista.length === 0 && <div style={{ ...S.card, textAlign: "center", padding: 40, color: "#aaa" }}><p style={{ fontSize: 32 }}>📅</p><p>Nenhum treinamento cadastrado.</p></div>}
      {lista.map(t => (
        <div key={t.id} style={{ ...S.card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={S.cardTitle}>{t.titulo}</p>
            <p style={{ fontSize: 13, color: "#888", marginTop: 2 }}>📅 {fmtDate(t.data_evento)} {t.hora_inicio && `· 🕐 ${String(t.hora_inicio).slice(0,5)}`} {t.local && `· 📍 ${t.local}`}</p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: statusColors[t.status] + "22", color: statusColors[t.status], fontWeight: 500 }}>{t.status}</span>
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
                {["previsto","confirmado","realizado","cancelado"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ ...S.btnPrimary, flex: 1 }} onClick={salvar} disabled={saving}>{saving ? "Salvando..." : "Salvar"}</button>
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
  const [lista, setLista] = useState([]);
  const [step, setStep] = useState("list");
  const [config, setConfig] = useState({ titulo: "", tipo_perguntas: "multipla_escolha", quantidade_perguntas: 10, direcionamento: "" });
  const [conteudo, setConteudo] = useState("");
  const [perguntas, setPerguntas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quizAtual, setQuizAtual] = useState(null);
  const [showLink, setShowLink] = useState(null);
  const fileRef = useRef();

  useEffect(() => { getQuestionarios().then(setLista); }, []);

  async function gerarPerguntas() {
    if (!conteudo.trim()) { alert("Cole o conteúdo do treinamento."); return; }
    setLoading(true);
    const tipoInstr = config.tipo_perguntas === "multipla_escolha" ? "todas de múltipla escolha (4 opções: a, b, c, d)"
      : config.tipo_perguntas === "verdadeiro_falso" ? "todas de verdadeiro/falso (a=Verdadeiro, b=Falso)"
      : "mistura de múltipla escolha e verdadeiro/falso";
    const prompt = `Crie EXATAMENTE ${config.quantidade_perguntas} perguntas de avaliação de ALTO NÍVEL sobre o conteúdo abaixo.
Tipo: ${tipoInstr}.
${config.direcionamento ? `Direcionamento: ${config.direcionamento}` : ""}
Cubra o conteúdo inteiro. Perguntas difíceis que exijam compreensão real, não memorização.

CONTEÚDO:
${conteudo.slice(0, 8000)}

IMPORTANTE: Distribua as respostas corretas de forma VARIADA entre as opções A, B, C e D. Não repita a mesma letra como resposta correta em perguntas consecutivas.
Retorne APENAS JSON válido, sem markdown:
{"perguntas":[{"ordem":1,"tipo":"multipla_escolha","enunciado":"...","opcao_a":"...","opcao_b":"...","opcao_c":"...","opcao_d":"...","resposta_correta":"a"}]}
Para verdadeiro/falso: opcao_c e opcao_d = "".`;
    try {
      const raw = await callClaude(prompt);
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setPerguntas(parsed.perguntas || []);
      setStep("preview");
    } catch (e) { alert("Erro ao gerar. Tente novamente."); }
    setLoading(false);
  }

  async function publicar() {
    const token = genToken();
    const quiz = await insertQuestionario({ titulo: config.titulo || "Avaliação de Treinamento", tipo_perguntas: config.tipo_perguntas, quantidade_perguntas: perguntas.length, direcionamento: config.direcionamento, link_token: token, criado_por: user.id });
    await insertPerguntas(perguntas, quiz.id);
    setLista(await getQuestionarios());
    setQuizAtual(quiz);
    setStep("done");
  }

  async function excluirQuiz(id) {
    if (!confirm("Excluir questionário e todas as respostas?")) return;
    await deleteQuestionario(id);
    setLista(await getQuestionarios());
  }

  const linkBase = `${window.location.origin}${window.location.pathname}`;

  if (step === "config") return (
    <div>
      <p style={S.pageTitle}>Novo questionário</p>
      <p style={S.pageSubtitle}>Configure e cole o conteúdo do treinamento</p>
      <div style={S.card}>
        <p style={{ fontSize: 14, fontWeight: 500, color: "#1a3d2b", marginBottom: 16 }}>1. Configurações</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div><label style={S.label}>Título</label><input style={S.input} value={config.titulo} onChange={e => setConfig(p => ({ ...p, titulo: e.target.value }))} placeholder="Ex: Avaliação Fragrâncias" /></div>
          <div><label style={S.label}>Tipo de perguntas</label>
            <select style={S.input} value={config.tipo_perguntas} onChange={e => setConfig(p => ({ ...p, tipo_perguntas: e.target.value }))}>
              <option value="multipla_escolha">Múltipla escolha</option>
              <option value="verdadeiro_falso">Verdadeiro / Falso</option>
              <option value="misto">Misto</option>
            </select>
          </div>
          <div><label style={S.label}>Quantidade</label>
            <select style={S.input} value={config.quantidade_perguntas} onChange={e => setConfig(p => ({ ...p, quantidade_perguntas: Number(e.target.value) }))}>
              {[10,11,12,13,14,15].map(n => <option key={n} value={n}>{n} perguntas</option>)}
            </select>
          </div>
        </div>
        <div><label style={S.label}>Direcionamento especial (opcional)</label>
          <textarea style={{ ...S.input, height: 70, resize: "vertical" }} value={config.direcionamento} onChange={e => setConfig(p => ({ ...p, direcionamento: e.target.value }))} placeholder="Ex: Dê mais ênfase em técnicas de fechamento." />
        </div>
      </div>
      <div style={S.card}>
        <p style={{ fontSize: 14, fontWeight: 500, color: "#1a3d2b", marginBottom: 12 }}>2. Conteúdo do treinamento</p>
        <div style={{ marginBottom: 10 }}>
          <input ref={fileRef} type="file" accept=".txt,.md,.pdf,.doc,.docx,.ppt,.pptx" style={{ display: "none" }} onChange={async e => {
            const f = e.target.files[0]; if (!f) return;
            const ext = f.name.split(".").pop().toLowerCase();
            const MAX_MB = 50;
            const fileMB = f.size / 1024 / 1024;

            if (fileMB > MAX_MB) {
              // Regra 3: acima do limite máximo — pedir ajuda ao Choil
              alert(
                `⚠️ Arquivo muito grande: ${fileMB.toFixed(1)} MB\n\n` +
                `O limite máximo é ${MAX_MB} MB. Mesmo após compressão, este arquivo pode ser um caso especial.\n\n` +
                `Por favor, procure o Choil para analisarmos juntos o melhor caminho.`
              );
              e.target.value = "";
              return;
            }

            if (fileMB > 25) {
              // Regra 2: entre 25–50 MB — orientar compressão por formato
              let instrucao = "";
              if (ext === "pptx" || ext === "ppt") {
                instrucao =
                  `📦 Arquivo grande detectado: ${fileMB.toFixed(1)} MB\n\n` +
                  `Dica: Para reduzir o tamanho no PowerPoint:\n` +
                  `1. Clique em qualquer imagem do arquivo\n` +
                  `2. Vá em "Formato da Imagem" → "Compactar Imagens"\n` +
                  `3. Marque "Aplicar a todas as imagens"\n` +
                  `4. Escolha resolução "Web (150 ppi)" ou "E-mail (96 ppi)"\n` +
                  `5. Salve como novo arquivo e suba a versão comprimida.\n\n` +
                  `O arquivo será carregado assim mesmo, mas pode demorar mais.`;
              } else if (ext === "pdf") {
                instrucao =
                  `📦 Arquivo grande detectado: ${fileMB.toFixed(1)} MB\n\n` +
                  `Dica: Para reduzir o tamanho do PDF, acesse:\n` +
                  `🔗 ilovepdf.com → "Comprimir PDF"\n` +
                  `ou\n` +
                  `🔗 smallpdf.com → "Compress PDF"\n\n` +
                  `Arraste o arquivo, baixe a versão comprimida e suba ela aqui.\n\n` +
                  `O arquivo será carregado assim mesmo, mas pode demorar mais.`;
              } else {
                instrucao =
                  `📦 Arquivo grande detectado: ${fileMB.toFixed(1)} MB\n\n` +
                  `O carregamento pode demorar alguns instantes. Se tiver problemas, tente reduzir o tamanho do arquivo antes de subir.`;
              }
              alert(instrucao);
              // Continua o processamento normalmente
            }
            setLoading(true);
            setConteudo("⏳ Lendo arquivo, aguarde...");
            try {
              if (ext === "txt" || ext === "md") {
                const text = await f.text(); setConteudo(text);
              } else if (ext === "pdf") {
                const pdfjsLib = await import("pdfjs-dist");
                pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
                const ab = await f.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: ab }).promise;
                let text = "";
                for (let i = 1; i <= pdf.numPages; i++) {
                  const page = await pdf.getPage(i);
                  const pageContent = await page.getTextContent();
                  text += pageContent.items.map(item => item.str).join(" ") + "\n";
                }

                // Se nao extraiu texto, o PDF e baseado em imagens — usar IA para ler visualmente
                if (!text.trim()) {
                  setConteudo("🔍 PDF baseado em imagens detectado. Analisando com IA...");
                  let aiText = "";
                  for (let i = 1; i <= pdf.numPages; i++) {
                    setConteudo(`🔍 Analisando página ${i} de ${pdf.numPages} com IA...`);
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 1.5 });
                    const canvas = document.createElement("canvas");
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    const ctx = canvas.getContext("2d");
                    await page.render({ canvasContext: ctx, viewport }).promise;
                    const imageData = canvas.toDataURL("image/jpeg", 0.85).split(",")[1];
                    try {
                      const resp = await fetch("https://multiplica-boti.vercel.app/api/analyze-slide", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ imageData, mediaType: "image/jpeg" })
                      });
                      const data = await resp.json();
                      const pageText = data.text?.trim() || "";
                      if (pageText) aiText += `Página ${i}:\n${pageText}\n\n`;
                    } catch(e) { console.error("Erro IA pagina", i, e); }
                  }
                  text = aiText;
                }

                setConteudo(text.trim() || "Não foi possível extrair texto deste arquivo.");
              } else if (ext === "docx" || ext === "doc") {
                const mammoth = await import("mammoth");
                const ab = await f.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer: ab });
                setConteudo(result.value.trim());
              } else if (ext === "pptx" || ext === "ppt") {
                const JSZip = (await import("jszip")).default;
                const ab = await f.arrayBuffer();
                const zip = await JSZip.loadAsync(ab);
                let text = "";
                const slideFiles = Object.keys(zip.files)
                  .filter(n => n.match(/ppt\/slides\/slide[0-9]+\.xml$/))
                  .sort((a, b) => {
                    const na = parseInt(a.match(/slide([0-9]+)/)[1]);
                    const nb = parseInt(b.match(/slide([0-9]+)/)[1]);
                    return na - nb;
                  });
                for (const name of slideFiles) {
                  const xml = await zip.files[name].async("string");
                  const matches = xml.match(/<a:t[^>]*>([\s\S]*?)<\/a:t>/g) || [];
                  const slideText = matches
                    .map(m => m.replace(/<[^>]+>/g, "").trim())
                    .filter(t => t.length > 0)
                    .join(" ");
                  if (slideText) text += slideText + "";
                }

                // Se não extraiu texto, os slides são imagens — usar IA para ler visualmente
                if (!text.trim()) {
                  setConteudo("🔍 Slides baseados em imagens detectados. Analisando com IA...");

                  // Extrair imagens de mídia do PPTX
                  const mediaFiles = Object.keys(zip.files)
                    .filter(n => n.match(/ppt\/media\/image[0-9]+\.(png|jpg|jpeg)/i))
                    .sort((a, b) => {
                      const na = parseInt(a.match(/image([0-9]+)/)[1]);
                      const nb = parseInt(b.match(/image([0-9]+)/)[1]);
                      return na - nb;
                    });

                  // Mapear imagens por slide via arquivos .rels
                  const slideImageMap = {};
                  for (const sf of slideFiles) {
                    const slideNum = parseInt(sf.match(/slide([0-9]+)/)[1]);
                    const relsPath = sf.replace("slides/slide", "slides/_rels/slide").replace(".xml", ".xml.rels");
                    if (zip.files[relsPath]) {
                      const relsXml = await zip.files[relsPath].async("string");
                      const imgRefs = [...relsXml.matchAll(/Target="\.\.\/media\/(image[0-9]+\.[a-z]+)"/gi)];
                      if (imgRefs.length > 0) {
                        slideImageMap[slideNum] = imgRefs.map(m => `ppt/media/${m[1]}`);
                      }
                    }
                  }

                  let aiText = "";
                  let slideCount = 0;

                  for (const [slideNumStr, imgPaths] of Object.entries(slideImageMap)) {
                    slideCount++;
                    setConteudo(`🔍 Analisando slide ${slideCount} de ${Object.keys(slideImageMap).length} com IA...`);

                    // Usar primeira imagem do slide
                    const imgPath = imgPaths[0];
                    if (!zip.files[imgPath]) continue;

                    const imgData = await zip.files[imgPath].async("base64");
                    const ext2 = imgPath.split(".").pop().toLowerCase();
                    const mediaType = ext2 === "jpg" || ext2 === "jpeg" ? "image/jpeg" : "image/png";

                    try {
                      const resp = await fetch("https://multiplica-boti.vercel.app/api/analyze-slide", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ imageData: imgData, mediaType })
                      });
                      const data = await resp.json();
                      const slideText = data.text?.trim() || "";
                      if (slideText) aiText += `Slide ${slideNumStr}:
${slideText}

`;
                    } catch(e) { console.error("Erro IA slide", slideNumStr, e); }
                  }

                  text = aiText;
                }

                setConteudo(text.trim() || "Não foi possível extrair texto deste arquivo.");
              }
            } catch (err) {
              alert("Erro ao ler arquivo. Tente copiar o conteúdo manualmente.");
              setConteudo("");
              console.error(err);
            } finally {
              setLoading(false);
            }
          }} />
          <button style={{ ...S.btnSecondary, padding: "8px 16px", fontSize: 13 }} onClick={() => fileRef.current.click()}>📎 Carregar arquivo (.txt, .pdf, .doc, .pptx)</button>
        </div>
        <label style={S.label}>Cole o conteúdo aqui</label>
        <textarea style={{ ...S.input, height: 200, resize: "vertical" }} value={conteudo} onChange={e => setConteudo(e.target.value)} placeholder="Cole o material do treinamento..." />
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <button style={{ ...S.btnPrimary, minWidth: 200 }} onClick={gerarPerguntas} disabled={loading}>{loading ? "🤖 Gerando perguntas..." : "🤖 Gerar com IA"}</button>
        <button style={S.btnSecondary} onClick={() => setStep("list")}>Cancelar</button>
      </div>
    </div>
  );

  if (step === "preview") return (
    <div>
      <p style={S.pageTitle}>Prévia das perguntas</p>
      <p style={S.pageSubtitle}>{perguntas.length} perguntas — revise antes de publicar</p>
      {perguntas.map((p, i) => (
        <div key={i} style={S.card}>
          <span style={S.quizNum}>Pergunta {i + 1} · {p.tipo === "verdadeiro_falso" ? "V/F" : "Múltipla escolha"}</span>
          <p style={{ fontSize: 15, fontWeight: 500, color: "#1a3d2b", marginBottom: 12 }}>{p.enunciado}</p>
          {["a","b","c","d"].filter(l => p[`opcao_${l}`]).map(l => (
            <div key={l} style={{ display: "flex", gap: 10, padding: "8px 12px", borderRadius: 8, background: p.resposta_correta === l ? GREEN_LIGHT : "#f9f9f9", border: `1px solid ${p.resposta_correta === l ? GREEN : "#eee"}`, marginBottom: 6 }}>
              <span style={{ fontWeight: 600, color: p.resposta_correta === l ? GREEN : "#999", minWidth: 16 }}>{l.toUpperCase()}</span>
              <span style={{ fontSize: 14, color: "#444" }}>{p[`opcao_${l}`]}</span>
              {p.resposta_correta === l && <span style={{ marginLeft: "auto", color: GREEN, fontSize: 12 }}>✓</span>}
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
      <p style={S.pageSubtitle}>Exiba o QR Code na tela — consultores escaneiam com o celular</p>
      <div style={{ ...S.card, textAlign: "center" }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: GREEN_DARK, marginBottom: 20 }}>{quizAtual?.titulo}</p>
        <div style={{ display: "inline-block", background: "#fff", padding: 20, borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.10)", marginBottom: 20 }}>
          <QRCodeSVG value={`${linkBase}?quiz=${quizAtual?.link_token}`} size={260} fgColor={GREEN_DARK} bgColor="#fff" level="H" />
        </div>
        <p style={{ fontSize: 12, color: "#aaa", marginBottom: 16 }}>ou compartilhe o link diretamente</p>
        <button style={{ ...S.btnPrimary, fontSize: 13, width: "100%" }} onClick={() => { navigator.clipboard?.writeText(`${linkBase}?quiz=${quizAtual?.link_token}`); alert("Link copiado!"); }}>
          📋 Copiar link
        </button>
      </div>
      <button style={{ ...S.btnSecondary, marginTop: 16 }} onClick={() => { setStep("list"); setConfig({ titulo: "", tipo_perguntas: "multipla_escolha", quantidade_perguntas: 10, direcionamento: "" }); setConteudo(""); setPerguntas([]); }}>
        Ver todos os questionários
      </button>
    </div>
  );

  // LIST
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div><p style={S.pageTitle}>Questionários</p><p style={S.pageSubtitle}>Avaliações geradas pela IA</p></div>
        <button style={S.btnPrimary} onClick={() => setStep("config")}>+ Novo questionário</button>
      </div>
      {lista.length === 0 && <div style={{ ...S.card, textAlign: "center", padding: 40, color: "#aaa" }}><p style={{ fontSize: 32 }}>📝</p><p>Nenhum questionário criado.</p></div>}
      {lista.map(q => (
        <div key={q.id} style={{ ...S.card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={S.cardTitle}>{q.titulo}</p>
            <p style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>{q.quantidade_perguntas} perguntas · criado em {fmtDate(q.criado_em)}</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ ...S.btnSecondary, padding: "6px 12px", fontSize: 12 }} onClick={() => setShowLink(q)}>🔗 Link</button>
            <button style={{ ...S.btnDanger, padding: "6px 12px", fontSize: 12 }} onClick={() => excluirQuiz(q.id)}>✕</button>
          </div>
        </div>
      ))}
      {showLink && (
        <div style={S.modalBg} onClick={() => setShowLink(null)}>
          <div style={{ ...S.modalCard, textAlign: "center" }} onClick={e => e.stopPropagation()}>
            <p style={{ ...S.pageTitle, fontSize: 18, marginBottom: 4 }}>{showLink.titulo}</p>
            <p style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>Exiba na tela — consultores escaneiam com o celular</p>
            <div style={{ display: "inline-block", background: "#fff", padding: 20, borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.10)", marginBottom: 20 }}>
              <QRCodeSVG value={`${linkBase}?quiz=${showLink.link_token}`} size={240} fgColor={GREEN_DARK} bgColor="#fff" level="H" />
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button style={{ ...S.btnPrimary, flex: 1 }} onClick={() => { navigator.clipboard?.writeText(`${linkBase}?quiz=${showLink.link_token}`); alert("Link copiado!"); }}>📋 Copiar link</button>
              <button style={{ ...S.btnSecondary, flex: 1 }} onClick={() => setShowLink(null)}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── RESULTADOS ───────────────────────────────────────────────────────────────
function Resultados() {
  const [quizzes, setQuizzes] = useState([]);
  const [respostas, setRespostas] = useState([]);
  const [quizSel, setQuizSel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRelatorio, setShowRelatorio] = useState(false);

  useEffect(() => {
    Promise.all([getQuestionarios(), getRespostas()]).then(([q, r]) => {
      setQuizzes(q); setRespostas(r); setLoading(false);
    });
  }, []);

  const filtradas = quizSel ? respostas.filter(r => r.questionario_id === Number(quizSel)) : respostas;
  const aprovados = filtradas.filter(r => r.aprovado).length;

  if (loading) return <div style={S.loading}><div>⏳ Carregando...</div></div>;

  return (
    <div>
      <p style={S.pageTitle}>Resultados</p>
      <p style={S.pageSubtitle}>Desempenho dos consultores</p>
      <div style={{ marginBottom: 20 }}>
        <label style={S.label}>Filtrar por questionário</label>
        <select style={{ ...S.input, maxWidth: 360 }} value={quizSel || ""} onChange={e => setQuizSel(e.target.value || null)}>
          <option value="">Todos</option>
          {quizzes.map(q => <option key={q.id} value={q.id}>{q.titulo}</option>)}
        </select>
      </div>
      <div style={S.metricGrid}>
        <div style={S.metricCard}><div style={S.metricNum}>{filtradas.length}</div><div style={S.metricLabel}>Total respondido</div></div>
        <div style={S.metricCard}><div style={{ ...S.metricNum, color: GREEN }}>{aprovados}</div><div style={S.metricLabel}>Aprovados ≥ 8,0</div></div>
        <div style={S.metricCard}><div style={{ ...S.metricNum, color: "#c0392b" }}>{filtradas.length - aprovados}</div><div style={S.metricLabel}>Precisam reforço</div></div>
        <div style={S.metricCard}><div style={S.metricNum}>{filtradas.length > 0 ? (filtradas.reduce((s,r) => s+Number(r.nota),0)/filtradas.length).toFixed(1) : "—"}</div><div style={S.metricLabel}>Média</div></div>
      </div>
      {filtradas.length === 0 && <div style={{ ...S.card, textAlign: "center", padding: 40, color: "#aaa" }}><p style={{ fontSize: 32 }}>🏆</p><p>Nenhuma resposta ainda.</p></div>}
      {filtradas.length > 0 && (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
            <button style={{ ...S.btnPrimary, fontSize: 13 }} onClick={() => setShowRelatorio(true)}>📊 Gerar relatório</button>
          </div>
          <div style={S.card}>
            <table style={S.table}>
              <thead><tr><th style={S.th}>Consultor</th><th style={S.th}>Loja</th><th style={S.th}>Questionário</th><th style={S.th}>Acertos</th><th style={S.th}>Nota</th><th style={S.th}>Resultado</th><th style={S.th}>Data</th></tr></thead>
              <tbody>
                {filtradas.map(r => {
                  const q = quizzes.find(x => x.id === r.questionario_id);
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
        </>
      )}
      {showRelatorio && (
        <div style={S.modalBg} onClick={() => setShowRelatorio(false)}>
          <div style={{ ...S.modalCard, maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <p style={{ ...S.pageTitle, fontSize: 18, marginBottom: 4 }}>📊 Relatório por loja</p>
            <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
              {quizSel ? `Questionário: ${quizzes.find(q=>q.id===Number(quizSel))?.titulo}` : "Todos os questionários"}
            </p>
            {(() => {
              const porLoja = {};
              filtradas.forEach(r => {
                const loja = r.loja || "Sem loja";
                if (!porLoja[loja]) porLoja[loja] = { total: 0, aprovados: 0, notas: [] };
                porLoja[loja].total++;
                if (r.aprovado) porLoja[loja].aprovados++;
                porLoja[loja].notas.push(Number(r.nota));
              });
              const linhas = Object.entries(porLoja).sort((a,b) => a[0].localeCompare(b[0]));
              const quizNome = quizSel ? (quizzes.find(q=>q.id===Number(quizSel))?.titulo || "") : "Todos os questionários";
              const linhasWhats = linhas.map(([loja, d]) => {
                const media = (d.notas.reduce((s,n)=>s+n,0)/d.notas.length).toFixed(1);
                const pct = Math.round(d.aprovados/d.total*100);
                return "*" + loja + "*\n✅ Aprovados: " + d.aprovados + "/" + d.total + " (" + pct + "%)\n📈 Média: " + media;
              });
              const sep = "─────────────────";
              const textoWhats = "*Relatório Multiplica Boti*\n📝 " + quizNome + "\n" + sep + "\n" + linhasWhats.join("\n" + sep + "\n") + "\n" + sep + "\n*Total geral: " + filtradas.length + " avaliações · " + filtradas.filter(r=>r.aprovado).length + " aprovados*";
              return (
                <>
                  {linhas.map(([loja, d]) => {
                    const media = (d.notas.reduce((s,n)=>s+n,0)/d.notas.length).toFixed(1);
                    const pct = Math.round(d.aprovados/d.total*100);
                    return (
                      <div key={loja} style={{ padding: "10px 14px", background: "#f7faf9", borderRadius: 8, marginBottom: 8, border: "1px solid #e0ece8" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <strong style={{ fontSize: 14, color: "#1a3d2b" }}>{loja}</strong>
                          <span style={S.badge(pct >= 80)}>{pct}% aprovação</span>
                        </div>
                        <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>
                          ✅ {d.aprovados}/{d.total} aprovados · 📈 Média {media}
                        </div>
                      </div>
                    );
                  })}
                  <div style={{ marginTop: 16, padding: "10px 14px", background: GREEN_LIGHT, borderRadius: 8, border: `1px solid ${GREEN}`, fontSize: 13, color: GREEN_DARK, fontWeight: 500 }}>
                    Total: {filtradas.length} avaliações · {filtradas.filter(r=>r.aprovado).length} aprovados
                  </div>
                  <button style={{ ...S.btnPrimary, width: "100%", marginTop: 16 }} onClick={() => { navigator.clipboard?.writeText(textoWhats); alert("Relatório copiado! Cole no WhatsApp."); }}>
                    📋 Copiar para WhatsApp
                  </button>
                  <button style={{ ...S.btnSecondary, width: "100%", marginTop: 8 }} onClick={() => setShowRelatorio(false)}>Fechar</button>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── USUÁRIOS ─────────────────────────────────────────────────────────────────
function Usuarios() {
  const [lista, setLista] = useState([]);
  const [lojas, setLojas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", senha: "", perfil: "leitor", loja_id: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { Promise.all([getUsuarios(), getLojas()]).then(([u,l]) => { setLista(u); setLojas(l); }); }, []);

  async function salvar() {
    if (!form.nome || !form.email || !form.senha) { alert("Preencha todos os campos obrigatórios."); return; }
    if (await emailExiste(form.email)) { alert("E-mail já cadastrado."); return; }
    setSaving(true);
    await insertUsuario({ ...form, senha_hash: hashPassword(form.senha) });
    setLista(await getUsuarios()); setSaving(false); setShowModal(false);
    setForm({ nome: "", email: "", senha: "", perfil: "leitor", loja_id: "" });
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
                <td style={S.td}><span style={S.badge(u.perfil === "multiplicadora" || user.perfil === "diretor")}>{u.perfil}</span></td>
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
              <div key={k} style={{ marginBottom: 12 }}><label style={S.label}>{l}</label><input style={S.input} type={t} value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} /></div>
            ))}
            <div style={{ marginBottom: 12 }}><label style={S.label}>Perfil</label>
              <select style={S.input} value={form.perfil} onChange={e => setForm(p => ({ ...p, perfil: e.target.value }))}>
                <option value="multiplicadora">Multiplicadora</option><option value="leitor">Leitor</option>
              </select>
            </div>
            <div style={{ marginBottom: 16 }}><label style={S.label}>Loja (opcional)</label>
              <select style={S.input} value={form.loja_id} onChange={e => setForm(p => ({ ...p, loja_id: e.target.value }))}>
                <option value="">Sem loja vinculada</option>
                {lojas.map(l => <option key={l.id} value={l.id}>{l.nome}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ ...S.btnPrimary, flex: 1 }} onClick={salvar} disabled={saving}>{saving ? "Salvando..." : "Salvar"}</button>
              <button style={{ ...S.btnSecondary, flex: 1 }} onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── QUIZ CONSULTOR ───────────────────────────────────────────────────────────
function QuizConsultor({ token }) {
  const [quiz, setQuiz] = useState(null);
  const [perguntas, setPerguntas] = useState([]);
  const [step, setStep] = useState("loading");
  const [nome, setNome] = useState("");
  const [loja, setLoja] = useState("");
  const [lojas, setLojas] = useState([]);
  const [respostas, setRespostas] = useState({});
  const [atual, setAtual] = useState(0);
  const [saving, setSaving] = useState(false);

  const [deviceId, setDeviceId] = useState("");

  useEffect(() => {
    // Gera ou recupera ID único do dispositivo
    let did = localStorage.getItem("boti_device_id");
    if (!did) {
      did = "d_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem("boti_device_id", did);
    }
    setDeviceId(did);

    async function init() {
      const [q, ls] = await Promise.all([getQuestionarioByToken(token), getLojas()]);
      setLojas(ls);
      if (!q) { setStep("invalido"); return; }
      // Bloqueia pelo dispositivo antes mesmo de mostrar o formulário
      const bloqueado = await jaRespondeu(q.id, "__device_check__", did);
      if (bloqueado) { setStep("jaRespondeu"); return; }
      const ps = await getPerguntasByQuiz(q.id);
      setQuiz(q); setPerguntas(ps); setStep("intro");
    }
    init();
  }, [token]);

  async function iniciar() {
    if (!nome.trim()) { alert("Informe seu nome completo."); return; }
    const jaresp = await jaRespondeu(quiz.id, nome.trim(), deviceId);
    if (jaresp) { setStep("jaRespondeu"); return; }
    setStep("quiz");
  }

  function selecionar(letra) { setRespostas(p => ({ ...p, [atual]: letra })); }

  async function avancar() {
    if (!respostas[atual]) { alert("Selecione uma resposta."); return; }
    if (atual < perguntas.length - 1) { setAtual(a => a + 1); return; }
    setSaving(true);
    const acertos = perguntas.filter((p, i) => respostas[i] === p.resposta_correta).length;
    const nota = (acertos / perguntas.length) * 10;
    await insertResposta({ questionario_id: quiz.id, nome_consultor: nome.trim(), loja: loja || null, respostas, total_perguntas: perguntas.length, total_acertos: acertos, nota, aprovado: nota >= 8, device_id: deviceId });
    setSaving(false); setStep("done");
  }

  const InfoTela = ({ emoji, titulo, sub }) => (
    <div style={S.quizBg}>
      <div style={{ ...S.quizCard, textAlign: "center", padding: 48 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, marginBottom: 24 }}>
          <LogoImg w={70} /><span style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: GREEN }}>Niterói</span>
        </div>
        <p style={{ fontSize: 40, marginBottom: 12 }}>{emoji}</p>
        <p style={{ fontSize: 18, fontWeight: 500, color: "#1a3d2b", marginBottom: 8 }}>{titulo}</p>
        <p style={{ color: "#888", fontSize: 14, lineHeight: 1.6 }}>{sub}</p>
      </div>
    </div>
  );

  if (step === "loading") return <div style={S.loading}><div>⏳ Carregando avaliação...</div></div>;
  if (step === "invalido") return <InfoTela emoji="❌" titulo="Link inválido ou expirado" sub="Este questionário não está disponível." />;
  if (step === "jaRespondeu") return <InfoTela emoji="✅" titulo="Você já respondeu esta avaliação" sub="Suas respostas foram registradas. Obrigado!" />;
  if (step === "done") return <InfoTela emoji="🎉" titulo={`Obrigado, ${nome.split(" ")[0]}!`} sub="Suas respostas foram registradas com sucesso. Você pode fechar esta página." />;

  if (step === "intro") return (
    <div style={S.quizBg}>
      <div style={S.quizCard}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, marginBottom: 20 }}>
          <LogoImg w={70} />
          <span style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: GREEN }}>Niterói</span>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#1a3d2b", fontWeight: 400, textAlign: "center", margin: "8px 0 0" }}>{quiz?.titulo}</p>
          <p style={{ fontSize: 13, color: "#888" }}>{perguntas.length} perguntas</p>
        </div>
        <div style={{ marginBottom: 14 }}><label style={S.label}>Nome completo *</label><input style={S.input} value={nome} onChange={e => setNome(e.target.value)} placeholder="Digite seu nome completo" /></div>
        <div style={{ marginBottom: 20 }}><label style={S.label}>Sua loja (opcional)</label>
          <select style={S.input} value={loja} onChange={e => setLoja(e.target.value)}>
            <option value="">Prefiro não informar</option>
            {lojas.map(l => <option key={l.id} value={l.nome}>{l.nome}</option>)}
          </select>
        </div>
        <button style={{ ...S.btnPrimary, width: "100%", padding: 14, fontSize: 16 }} onClick={iniciar}>Iniciar avaliação →</button>
      </div>
    </div>
  );

  // QUIZ
  const p = perguntas[atual];
  const pct = Math.round(((atual + (respostas[atual] ? 1 : 0)) / perguntas.length) * 100);
  return (
    <div style={S.quizBg}>
      <div style={{ width: "100%", maxWidth: 600, marginBottom: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#888", marginBottom: 6 }}>
          <span>{quiz?.titulo}</span><span>{atual + 1} / {perguntas.length}</span>
        </div>
        <div style={{ height: 4, background: "#e0ece8", borderRadius: 4 }}>
          <div style={S.progressBar(pct)} />
        </div>
      </div>
      <div style={S.quizCard}>
        <span style={S.quizNum}>Pergunta {atual + 1}</span>
        <p style={S.quizEnunciado}>{p.enunciado}</p>
        {["a","b","c","d"].filter(l => p[`opcao_${l}`]).map(l => (
          <div key={l} style={S.quizOpcao(respostas[atual] === l)} onClick={() => selecionar(l)}>
            <div style={S.quizOpcaoLetter(respostas[atual] === l)}>{l.toUpperCase()}</div>
            <span style={{ fontSize: 15, color: "#333", lineHeight: 1.4 }}>{p[`opcao_${l}`]}</span>
          </div>
        ))}
        <button style={{ ...S.btnPrimary, width: "100%", marginTop: 12, padding: 14, fontSize: 15, opacity: respostas[atual] ? 1 : 0.5 }} onClick={avancar} disabled={saving}>
          {saving ? "Registrando..." : atual < perguntas.length - 1 ? "Próxima →" : "Finalizar avaliação ✓"}
        </button>
      </div>
    </div>
  );
}

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────

function Configuracoes({ user }) {
  const [tab, setTab] = useState("senha");
  // --- troca de senha ---
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  // --- cadastro usuarios (diretor) ---
  const [lista, setLista] = useState([]);
  const [lojas, setLojas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", senha: "", perfil: "leitor", loja_id: "" });
  const [savingUser, setSavingUser] = useState(false);

  useEffect(() => {
    if (user.perfil === "diretor") {
      Promise.all([getUsuarios(), getLojas()]).then(([u, l]) => { setLista(u); setLojas(l); });
    }
  }, []);

  async function trocarSenha() {
    if (!senhaAtual || !novaSenha || !confirmar) { setMsg({ ok: false, txt: "Preencha todos os campos." }); return; }
    if (novaSenha !== confirmar) { setMsg({ ok: false, txt: "As senhas novas não coincidem." }); return; }
    if (novaSenha.length < 6) { setMsg({ ok: false, txt: "A nova senha deve ter pelo menos 6 caracteres." }); return; }
    setSaving(true); setMsg(null);
    try {
      const res = await loginUser(user.email, senhaAtual);
      if (!res) { setMsg({ ok: false, txt: "Senha atual incorreta." }); setSaving(false); return; }
      await updateSenha(user.id, novaSenha);
      setMsg({ ok: true, txt: "Senha alterada com sucesso!" });
      setSenhaAtual(""); setNovaSenha(""); setConfirmar("");
    } catch (e) {
      setMsg({ ok: false, txt: "Erro ao alterar senha." });
    }
    setSaving(false);
  }

  async function salvarUsuario() {
    if (!form.nome || !form.email || !form.senha) { alert("Preencha todos os campos obrigatórios."); return; }
    if (await emailExiste(form.email)) { alert("E-mail já cadastrado."); return; }
    setSavingUser(true);
    await insertUsuario({ ...form, senha_hash: form.senha });
    setLista(await getUsuarios()); setSavingUser(false); setShowModal(false);
    setForm({ nome: "", email: "", senha: "", perfil: "leitor", loja_id: "" });
  }

  const tabStyle = (t) => ({ padding: "8px 20px", fontSize: 13, fontWeight: tab === t ? 600 : 400, color: tab === t ? GREEN : "#888", borderBottom: tab === t ? `2px solid ${GREEN}` : "2px solid transparent", cursor: "pointer", background: "none", border: "none", borderBottom: tab === t ? `2px solid ${GREEN}` : "2px solid transparent" });

  return (
    <div>
      <p style={S.pageTitle}>Configurações</p>
      <p style={S.pageSubtitle}>Preferências e administração</p>
      {user.perfil === "diretor" && (
        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #e0ece8", marginBottom: 20 }}>
          <button style={tabStyle("senha")} onClick={() => setTab("senha")}>🔑 Trocar senha</button>
          <button style={tabStyle("usuarios")} onClick={() => setTab("usuarios")}>👥 Usuários</button>
        </div>
      )}
      {tab === "senha" && (
        <div style={{ ...S.card, maxWidth: 420 }}>
          <p style={{ fontSize: 15, fontWeight: 500, color: "#1a3d2b", marginBottom: 16 }}>🔑 Trocar senha</p>
          {[["senhaAtual","Senha atual",senhaAtual,setSenhaAtual],["novaSenha","Nova senha",novaSenha,setNovaSenha],["confirmar","Confirmar nova senha",confirmar,setConfirmar]].map(([k,l,v,set]) => (
            <div key={k} style={{ marginBottom: 12 }}>
              <label style={S.label}>{l}</label>
              <input style={S.input} type="password" value={v} onChange={e => set(e.target.value)} />
            </div>
          ))}
          {msg && <p style={{ fontSize: 13, color: msg.ok ? "#2d7a4f" : "#c0392b", marginBottom: 12 }}>{msg.txt}</p>}
          <button style={{ ...S.btnPrimary, width: "100%" }} onClick={trocarSenha} disabled={saving}>
            {saving ? "Salvando..." : "Alterar senha"}
          </button>
        </div>
      )}
      {tab === "usuarios" && user.perfil === "diretor" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: "#1a3d2b" }}>{lista.length} usuário(s) cadastrado(s)</p>
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
                    <td style={S.td}><span style={S.badge(u.perfil === "multiplicadora" || u.perfil === "diretor")}>{u.perfil}</span></td>
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
                  <div key={k} style={{ marginBottom: 12 }}><label style={S.label}>{l}</label><input style={S.input} type={t} value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} /></div>
                ))}
                <div style={{ marginBottom: 12 }}><label style={S.label}>Perfil</label>
                  <select style={S.input} value={form.perfil} onChange={e => setForm(p => ({ ...p, perfil: e.target.value }))}>
                    <option value="multiplicadora">Multiplicadora</option><option value="leitor">Leitor</option>
                  </select>
                </div>
                <div style={{ marginBottom: 16 }}><label style={S.label}>Loja (opcional)</label>
                  <select style={S.input} value={form.loja_id} onChange={e => setForm(p => ({ ...p, loja_id: e.target.value }))}>
                    <option value="">Sem loja vinculada</option>
                    {lojas.map(l => <option key={l.id} value={l.id}>{l.nome}</option>)}
                  </select>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button style={{ ...S.btnPrimary, flex: 1 }} onClick={salvarUsuario} disabled={savingUser}>{savingUser ? "Salvando..." : "Salvar"}</button>
                  <button style={{ ...S.btnSecondary, flex: 1 }} onClick={() => setShowModal(false)}>Cancelar</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [showLogin, setShowLogin] = useState(false);
  const [ready, setReady] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const quizToken = urlParams.get("quiz");
  const ssoToken = urlParams.get("sso");

  useEffect(() => {
    if (ssoToken) {
      async function validarSSO() {
        try {
          const res = await fetch("https://agregador-boti.vercel.app/api/sso/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: ssoToken, sistema: "multiplica_boti" })
          });
          const data = await res.json();
          if (data.valid && data.user) {
            // Usar perfil do token SSO (definido no Agregador) em vez do perfil do banco local
            setUser({ ...data.user, perfil: data.perfil || data.user.perfil || "leitor" });
            window.history.replaceState({}, "", window.location.pathname);
          }
        } catch (e) {
          console.error("SSO error", e);
        } finally {
          setReady(true);
        }
      }
      validarSSO();
    } else {
      setReady(true);
    }
  }, []);

  if (!ready) return <div style={S.loading}><div>🌿 Iniciando Multiplica Boti...</div></div>;

  if (quizToken) return (<><FontLoader /><QuizConsultor token={quizToken} /></>);

  if (user) return (
    <>
      <FontLoader />
      <div style={{ display: "flex", minHeight: "100vh", background: "#f7faf9" }}>
        <Sidebar user={user} page={page} setPage={setPage} onLogout={() => { setUser(null); setPage("dashboard"); }} />
        <div style={S.mainContent}>
          {page === "dashboard" && <Dashboard />}
          {page === "agenda" && (user.perfil === "multiplicadora" || user.perfil === "diretor") && <Agenda user={user} />}
          {page === "questionarios" && (user.perfil === "multiplicadora" || user.perfil === "diretor") && <Questionarios user={user} />}
          {page === "resultados" && <Resultados />}
          {page === "configuracoes" && <Configuracoes user={user} />}
        </div>
      </div>
    </>
  );

  return (
    <>
      <FontLoader />
      <PublicHome onLoginClick={() => setShowLogin(true)} />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={u => { setUser(u); setShowLogin(false); }} />}
    </>
  );
}
