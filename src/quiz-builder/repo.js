const client = require("../db");
const shortid = require("shortid");

function mapRow(row) {
  return {
    id: row.id,
    ...row.quiz_json,
    questions: (row.quiz_json.questions || []).map((q, i) => ({ id: i, ...q })),
  };
}

module.exports.getQuizById = async function getQuizById(id) {
  const sql = `SELECT id, quiz_json FROM qm_quiz WHERE id = $1`;
  const { rows } = await client.query(sql, [id]);
  if (rows.length === 0) {
    return null;
  }

  return mapRow(rows[0]);
};

module.exports.getQuizzes = async function getQuizzes() {
  const sql = `SELECT id, quiz_json FROM qm_quiz`;
  const { rows } = await client.query(sql);
  return rows.map(mapRow);
};

module.exports.saveQuiz = async function saveQuiz(quiz) {
  const { id = shortid(), ...quiz_json } = quiz;
  if (quiz.id) {
    const sql = `UPDATE qm_quiz SET quiz_json = $2 WHERE id = $1`;
    await client.query(sql, [id, quiz_json]);
  } else {
    const sql = `INSERT INTO qm_quiz(id, quiz_json) VALUES ($1, $2)`;
    await client.query(sql, [id, quiz_json]);
  }

  return mapRow({ id, quiz_json });
};
