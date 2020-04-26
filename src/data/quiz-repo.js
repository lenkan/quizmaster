const client = require("./db");
const shortid = require("shortid");

function mapRow(row) {
  return {
    id: row.id,
    title: row.title,
    ...row.quiz_json,
    questions: (row.quiz_json.questions || []).map((q, i) => ({ id: i, ...q })),
  };
}

module.exports.getQuizById = async function getQuizById(id) {
  const sql = `SELECT id, quiz_json, title FROM qm_quiz WHERE id = $1`;
  const { rows } = await client.query(sql, [id]);
  if (rows.length === 0) {
    return null;
  }

  return mapRow(rows[0]);
};

module.exports.getQuizzes = async function getQuizzes() {
  const sql = `SELECT id, quiz_json, title FROM qm_quiz`;
  const { rows } = await client.query(sql);
  return rows.map(mapRow);
};

module.exports.saveQuiz = async function saveQuiz(quiz) {
  const { id = shortid(), title, ...quiz_json } = quiz;
  if (quiz.id) {
    const sql = `UPDATE qm_quiz SET title = $3, quiz_json = $2 WHERE id = $1`;
    await client.query(sql, [id, quiz_json, title]);
  } else {
    const sql = `INSERT INTO qm_quiz(id, quiz_json, title) VALUES ($1, $2, $3)`;
    await client.query(sql, [id, quiz_json, title]);
  }

  return mapRow({ id, quiz_json, title });
};
