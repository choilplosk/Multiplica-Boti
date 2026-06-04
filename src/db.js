import { neon } from '@neondatabase/serverless';

const sql = neon(import.meta.env.VITE_DATABASE_URL);

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export async function loginUser(login, senha) {
  try {
    const rows = await sql`SELECT * FROM usuarios WHERE (LOWER(email)=LOWER(${login}) OR LOWER(nome)=LOWER(${login})) AND senha_hash=${senha} AND ativo=true`;
    return rows[0] || null;
  } catch(e) { console.error("login error", e); return null; }
}

// ─── LOJAS ────────────────────────────────────────────────────────────────────
export async function getLojas() {
  try {
    return await sql`SELECT * FROM lojas WHERE ativo=true ORDER BY nome`;
  } catch(e) { return []; }
}

// ─── TREINAMENTOS ─────────────────────────────────────────────────────────────
export async function getTreinamentos() {
  try {
    return await sql`SELECT * FROM treinamentos ORDER BY data_evento ASC`;
  } catch(e) { return []; }
}

export async function insertTreinamento(data) {
  try {
    const rows = await sql`INSERT INTO treinamentos (titulo, descricao, data_evento, hora_inicio, local, status, criado_por) VALUES (${data.titulo}, ${data.descricao||null}, ${data.data_evento}, ${data.hora_inicio||null}, ${data.local||null}, ${data.status}, ${data.criado_por||null}) RETURNING *`;
    return rows[0];
  } catch(e) { console.error(e); }
}

export async function deleteTreinamento(id) {
  try { await sql`DELETE FROM treinamentos WHERE id=${id}`; } catch(e) { console.error(e); }
}

// ─── QUESTIONÁRIOS ────────────────────────────────────────────────────────────
export async function getQuestionarios() {
  try {
    return await sql`SELECT * FROM questionarios ORDER BY criado_em DESC`;
  } catch(e) { return []; }
}

export async function getQuestionarioByToken(token) {
  try {
    const rows = await sql`SELECT * FROM questionarios WHERE link_token=${token} AND ativo=true`;
    return rows[0] || null;
  } catch(e) { return null; }
}

export async function insertQuestionario(data) {
  try {
    const rows = await sql`INSERT INTO questionarios (titulo, tipo_perguntas, quantidade_perguntas, direcionamento, link_token, criado_por, ativo) VALUES (${data.titulo}, ${data.tipo_perguntas}, ${data.quantidade_perguntas}, ${data.direcionamento||null}, ${data.link_token}, ${data.criado_por||null}, true) RETURNING *`;
    return rows[0];
  } catch(e) { console.error(e); }
}

export async function deleteQuestionario(id) {
  try {
    await sql`DELETE FROM respostas_consultor WHERE questionario_id=${id}`;
    await sql`DELETE FROM perguntas WHERE questionario_id=${id}`;
    await sql`DELETE FROM questionarios WHERE id=${id}`;
  } catch(e) { console.error(e); }
}

// ─── PERGUNTAS ────────────────────────────────────────────────────────────────
export async function getPerguntasByQuiz(quizId) {
  try {
    return await sql`SELECT * FROM perguntas WHERE questionario_id=${quizId} ORDER BY ordem`;
  } catch(e) { return []; }
}

export async function insertPerguntas(perguntas, quizId) {
  try {
    for (const p of perguntas) {
      await sql`INSERT INTO perguntas (questionario_id, ordem, tipo, enunciado, opcao_a, opcao_b, opcao_c, opcao_d, resposta_correta) VALUES (${quizId}, ${p.ordem}, ${p.tipo||'multipla_escolha'}, ${p.enunciado}, ${p.opcao_a||''}, ${p.opcao_b||''}, ${p.opcao_c||''}, ${p.opcao_d||''}, ${p.resposta_correta})`;
    }
  } catch(e) { console.error(e); }
}

// ─── RESPOSTAS ────────────────────────────────────────────────────────────────
export async function getRespostas(quizId = null) {
  try {
    if (quizId) return await sql`SELECT * FROM respostas_consultor WHERE questionario_id=${quizId} ORDER BY respondido_em DESC`;
    return await sql`SELECT * FROM respostas_consultor ORDER BY respondido_em DESC`;
  } catch(e) { return []; }
}

export async function insertResposta(data) {
  try {
    const rows = await sql`INSERT INTO respostas_consultor (questionario_id, nome_consultor, loja, respostas, total_perguntas, total_acertos, nota, aprovado, respondido_em, device_id) VALUES (${data.questionario_id}, ${data.nome_consultor}, ${data.loja||null}, ${JSON.stringify(data.respostas)}, ${data.total_perguntas}, ${data.total_acertos}, ${data.nota}, ${data.aprovado}, NOW(), ${data.device_id||null}) RETURNING *`;
    return rows[0];
  } catch(e) { console.error(e); }
}

export async function jaRespondeu(quizId, nomeConsultor, deviceId) {
  try {
    const rows = await sql`SELECT id FROM respostas_consultor WHERE questionario_id=${quizId} AND (LOWER(nome_consultor)=LOWER(${nomeConsultor}) OR (device_id IS NOT NULL AND device_id=${deviceId}))`;
    return rows.length > 0;
  } catch(e) { return false; }
}

// ─── USUÁRIOS ─────────────────────────────────────────────────────────────────
export async function getUsuarios() {
  try {
    return await sql`SELECT id, nome, email, perfil, loja_id, ativo, criado_em FROM usuarios ORDER BY nome`;
  } catch(e) { return []; }
}

export async function insertUsuario(data) {
  try {
    const rows = await sql`INSERT INTO usuarios (nome, email, senha_hash, perfil, loja_id, ativo) VALUES (${data.nome}, ${data.email.toLowerCase()}, ${data.senha_hash}, ${data.perfil}, ${data.loja_id||null}, true) RETURNING id, nome, email, perfil, loja_id`;
    return rows[0];
  } catch(e) { console.error(e); }
}

export async function emailExiste(email) {
  try {
    const rows = await sql`SELECT id FROM usuarios WHERE email=${email.toLowerCase()}`;
    return rows.length > 0;
  } catch(e) { return false; }
}

export async function updateSenha(userId, novaSenha) {
  try {
    await sql`UPDATE usuarios SET senha_hash=${novaSenha} WHERE id=${userId}`;
    return true;
  } catch(e) { console.error(e); return false; }
}
