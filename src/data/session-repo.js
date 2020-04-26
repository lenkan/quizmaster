const client = require("./db");
const shortid = require("shortid");

function mapRow(row) {
  return {
    id: row.id,
    quizId: row.quiz_id,
    ...row.quiz_json,
    questions: (row.quiz_json.questions || []).map((q, i) => ({ id: i, ...q })),
  };
}

function mapAnswerRow(row) {
  return {
    id: row.id,
    sessionId: row.session_id,
    questionId: row.question_id,
    playerId: row.player_id,
    text: row.text,
  };
}

module.exports.createSession = async function createSession(quiz) {
  const { id: quiz_id, ...quiz_json } = quiz;
  const id = shortid();
  const sql = `INSERT INTO qm_session(id, quiz_id, quiz_json) VALUES ($1, $2, $3)`;
  await client.query(sql, [id, quiz_id, quiz_json]);

  return mapRow({ id, quiz_id, quiz_json });
};

module.exports.getSessionById = async function getSessionById(id) {
  const sql = `SELECT id, quiz_json FROM qm_session WHERE id = $1`;
  const { rows } = await client.query(sql, [id]);
  if (rows.length === 0) {
    return null;
  }

  return mapRow(rows[0]);
};

module.exports.getAnswers = async function getAnswers(id) {
  const sql = `
    SELECT * FROM qm_answer WHERE session_id = $1;
  `;

  const { rows } = await client.query(sql, [id]);

  return rows.map(mapAnswerRow);
};

module.exports.getPlayerAnswers = async function getPlayerAnswers(
  id,
  playerId
) {
  const sql = `
    SELECT * FROM qm_answer WHERE session_id = $1 AND player_id = $2;
  `;

  const { rows } = await client.query(sql, [id, playerId]);
  console.log(id, playerId, rows);

  return rows.map(mapAnswerRow);
};

module.exports.saveAnswer = async function saveAnswer({
  sessionId,
  questionId,
  playerId,
  text,
}) {
  const sql = `INSERT INTO qm_answer(session_id, question_id, player_id, text) VALUES ($1, $2, $3, $4);`;
  await client.query(sql, [sessionId, questionId, playerId, text]);
};
