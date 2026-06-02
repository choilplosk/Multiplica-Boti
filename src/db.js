import { neon } from '@neondatabase/serverless';

const sql = neon(import.meta.env.VITE_DATABASE_URL);

export async function query(q, params = []) {
  try {
    const result = await sql(q, params);
    return { rows: result, error: null };
  } catch (e) {
    console.error("DB error:", e);
    return { rows: [], error: e.message };
  }
}

// ─── SEED inicial ─────────────────────────────────────────────────────────────
export async function seedDB() {
  // Lojas
  await query(`
    INSERT INTO lojas (nome) VALUES
      ('Shopping Plaza Niterói'),('Shopping Icaraí'),
      ('Pátio Alcântara'),('Shopping Partage Norte'),('Loja Centro Niterói')
    ON CONFLICT DO NOTHING
  `);
  // Admin
  const exists = await query(`SELECT id FROM usuarios WHERE email = $1`, ['admin@boticario.com']);
  if (exists.rows.length === 0) {
    await query(`
      INSERT INTO usuarios (nome, email, senha_hash, perfil, ativo)
      VALUES ($1,$2,$3,$4,$5)
    `, ['Multiplicadora', 'admin@boticario.com', 'hash_7a3f9b2c', 'multiplicadora', true]);
  }
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export async function loginUser(email, senhaHash) {
  const { rows } = await query(
    `SELECT * FROM usuarios WHERE email=$1 AND senha_hash=$2 AND ativo=true`,
    [email.toLowerCase().trim(), senhaHash]
  );
  return rows[0] || null;
}

// ─── LOJAS ────────────────────────────────────────────────────────────────────
export async function getLojas() {
  const { rows } = await query(`SELECT * FROM lojas WHERE ativo=true ORDER BY nome`);
  return rows;
}

// ─── TREINAMENTOS ─────────────────────────────────────────────────────────────
export async function getTreinamentos() {
  const { rows } = await query(`SELECT * FROM treinamentos ORDER BY data_evento ASC`);
  return rows;
}

export async function insertTreinamento(data) {
  const { rows } = await query(`
    INSERT INTO treinamentos (titulo, descricao, data_evento, hora_inicio, local, status, criado_por)
    VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *
  `, [data.titulo, data.descricao||null, data.data_evento, data.hora_inicio||null, data.local||null, data.status, data.criado_por||null]);
  return rows[0];
}

export async function deleteTreinamento(id) {
  await query(`DELETE FROM treinamentos WHERE id=$1`, [id]);
}

// ─── QUESTIONÁRIOS ────────────────────────────────────────────────────────────
export async function getQuestionarios() {
  const { rows } = await query(`SELECT * FROM questionarios ORDER BY criado_em DESC`);
  return rows;
}

export async function getQuestionarioByToken(token) {
  const { rows } = await query(`SELECT * FROM questionarios WHERE link_token=$1 AND ativo=true`, [token]);
  return rows[0] || null;
}

export async function insertQuestionario(data) {
  const { rows } = await query(`
    INSERT INTO questionarios (titulo, tipo_perguntas, quantidade_perguntas, direcionamento, link_token, criado_por, ativo)
    VALUES ($1,$2,$3,$4,$5,$6,true) RETURNING *
  `, [data.titulo, data.tipo_perguntas, data.quantidade_perguntas, data.direcionamento||null, data.link_token, data.criado_por||null]);
  return rows[0];
}

export async function deleteQuestionario(id) {
  await query(`DELETE FROM respostas_consultor WHERE questionario_id=$1`, [id]);
  await query(`DELETE FROM perguntas WHERE questionario_id=$1`, [id]);
  await query(`DELETE FROM questionarios WHERE id=$1`, [id]);
}

// ─── PERGUNTAS ────────────────────────────────────────────────────────────────
export async function getPerguntasByQuiz(quizId) {
  const { rows } = await query(`SELECT * FROM perguntas WHERE questionario_id=$1 ORDER BY ordem`, [quizId]);
  return rows;
}

export async function insertPerguntas(perguntas, quizId) {
  for (const p of perguntas) {
    await query(`
      INSERT INTO perguntas (questionario_id, ordem, tipo, enunciado, opcao_a, opcao_b, opcao_c, opcao_d, resposta_correta)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    `, [quizId, p.ordem, p.tipo||'multipla_escolha', p.enunciado, p.opcao_a||'', p.opcao_b||'', p.opcao_c||'', p.opcao_d||'', p.resposta_correta]);
  }
}

// ─── RESPOSTAS ────────────────────────────────────────────────────────────────
export async function getRespostas(quizId = null) {
  if (quizId) {
    const { rows } = await query(`SELECT * FROM respostas_consultor WHERE questionario_id=$1 ORDER BY respondido_em DESC`, [quizId]);
    return rows;
  }
  const { rows } = await query(`SELECT * FROM respostas_consultor ORDER BY respondido_em DESC`);
  return rows;
}

export async function insertResposta(data) {
  const { rows } = await query(`
    INSERT INTO respostas_consultor (questionario_id, nome_consultor, loja, respostas, total_perguntas, total_acertos, nota, aprovado, respondido_em)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW()) RETURNING *
  `, [data.questionario_id, data.nome_consultor, data.loja||null, JSON.stringify(data.respostas), data.total_perguntas, data.total_acertos, data.nota, data.aprovado]);
  return rows[0];
}

export async function jaRespondeu(quizId, nomeConsultor) {
  const { rows } = await query(
    `SELECT id FROM respostas_consultor WHERE questionario_id=$1 AND LOWER(nome_consultor)=LOWER($2)`,
    [quizId, nomeConsultor]
  );
  return rows.length > 0;
}

// ─── USUARIOS ─────────────────────────────────────────────────────────────────
export async function getUsuarios() {
  const { rows } = await query(`SELECT id, nome, email, perfil, loja_id, ativo, criado_em FROM usuarios ORDER BY nome`);
  return rows;
}

export async function insertUsuario(data) {
  const { rows } = await query(`
    INSERT INTO usuarios (nome, email, senha_hash, perfil, loja_id, ativo)
    VALUES ($1,$2,$3,$4,$5,true) RETURNING id, nome, email, perfil, loja_id
  `, [data.nome, data.email.toLowerCase(), data.senha_hash, data.perfil, data.loja_id||null]);
  return rows[0];
}

export async function emailExiste(email) {
  const { rows } = await query(`SELECT id FROM usuarios WHERE email=$1`, [email.toLowerCase()]);
  return rows.length > 0;
}
