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
    gameId: row.game_id,
    questionId: row.question_id,
    playerId: row.player_id,
    playerName: row.player_name,
    text: row.text,
  };
}

module.exports.createGame = async function createGame(quiz) {
  const { id: quiz_id, ...quiz_json } = quiz;
  const id = shortid();
  const sql = `INSERT INTO qm_game(id, quiz_id, quiz_json) VALUES ($1, $2, $3)`;
  await client.query(sql, [id, quiz_id, quiz_json]);

  return mapRow({ id, quiz_id, quiz_json });
};

module.exports.getGameById = async function getGameById(id) {
  const sql = `SELECT id, quiz_json FROM qm_game WHERE id = $1`;
  const { rows } = await client.query(sql, [id]);
  if (rows.length === 0) {
    return null;
  }

  return mapRow(rows[0]);
};

module.exports.getAnswers = async function getAnswers(id) {
  const sql = `
SELECT
  qm_answer.id,
  qm_answer.text,
  qm_answer.question_id,
  qm_answer.id,
  qm_answer.player_id,
  qm_player.name as player_name
FROM
  qm_answer 
  JOIN qm_player ON 
    qm_player.id = qm_answer.player_id AND 
    qm_player.game_id = qm_answer.game_id
WHERE
  qm_answer.game_id = $1;
  `;

  const { rows } = await client.query(sql, [id]);

  return rows.map(mapAnswerRow);
};

module.exports.getPlayerAnswers = async function getPlayerAnswers(
  id,
  playerId
) {
  const sql = `
SELECT
  qm_answer.id,
  qm_answer.text,
  qm_answer.question_id,
  qm_answer.id,
  qm_answer.player_id,
  qm_player.name as player_name
FROM
  qm_answer 
  JOIN qm_player ON 
    qm_player.id = qm_answer.player_id AND 
    qm_player.game_id = qm_answer.game_id
WHERE
  qm_answer.game_id = $1
  AND qm_answer.player_id = $2;
  `;

  const { rows } = await client.query(sql, [id, playerId]);

  return rows.map(mapAnswerRow);
};

module.exports.saveAnswer = async function saveAnswer({
  gameId,
  questionId,
  playerId,
  text,
}) {
  const sql = `INSERT INTO qm_answer(game_id, question_id, player_id, text) VALUES ($1, $2, $3, $4);`;
  await client.query(sql, [gameId, questionId, playerId, text]);
};

module.exports.savePlayer = async function savePlayer({
  gameId,
  playerId,
  name,
}) {
  const sql = `INSERT INTO qm_player(id, game_id, name) VALUES ($1, $2, $3);`;
  await client.query(sql, [playerId, gameId, name]);
};
