const express = require("express");
const gameRepo = require("../data/game-repo");
const router = express.Router();
const render = require("./render");
const config = require("../config");
const datefns = require("../date-fns");

function renderQuestion(question) {
  return `
    <div id="question-${question.id}" style="margin: 10px;">
      <div class="ui fluid card">
        <div class="content">
          <div class="right floated">
            <div class="ui icon buttons tiny">
              <button 
                class="ui button start-question"
                data-question-id="${question.id}"
              >
                <i class="play icon"></i>
              </button>
            </div>
          </div>
          <div class="header">Question ${question.index + 1}</div>
          <div class="description">${question.text}</div>
        </div>
        <div class="content">
          <ul>
            ${(question.answers || [])
              .map((answer) => {
                return `<li>${`${answer.playerName}: ${answer.text}`}</li>`;
              })
              .join("")}
          </ul>
        </div>
      </div>
    </div>
  `;
}

function renderPlayerListItem(player) {
  return `
  <div class="item">
    <img class="ui avatar image" src="/img/${player.avatar}.svg">
    <div class="content">
      <div class="header">${player.name}</div>
      <div class="description">${player.joined}</div>
    </div>
  </div>
  `;
}

function renderPlayerList(game) {
  return `
    <div class="ui list" id="player-list">
      ${game.players.map(renderPlayerListItem).join("\n")}
    </div>
  `;
}

function renderHead(game) {
  const gameUrl = `${config.baseUrl}/quiz-join/${game.id}`;
  const gameLink = `<a href="${gameUrl}">${gameUrl}</a>`;

  return `
  <div style="margin: 10px;">
    <div class="ui fluid card">
      <div class="content">
        <div class="header">${game.title}</div>
        <div class="description">
          <p>Invite to join here: ${gameLink}</p>
          ${renderPlayerList(game)}
        </div>
      </div>
    </div>
  </div>
  `;
}

function renderGame(game) {
  const questionsHtml = (game.questions || [])
    .map((question, i) => {
      return renderQuestion({
        index: i,
        gameId: game.id,
        quizId: game.quizId,
        ...question,
      });
    })
    .join("\n");

  const header = renderHead(game);

  return `
    ${header} 
    ${questionsHtml}
    `;
}

router.get("/quiz-master/:id", async (req, res, next) => {
  try {
    const game = await gameRepo.getGameById(req.params.id);
    if (!game) {
      return res.sendStatus(404);
    }

    const answers = await gameRepo.getAnswers(game.id);
    const now = Date.now();
    const players = await gameRepo
      .getPlayersByGameId(game.id)
      .then((players) => {
        return players.map((player) => ({
          ...player,
          joined: `Joined ${datefns.getTimeDifference(now, player.createdAt)}`,
        }));
      });

    const questions = game.questions.map((q) => {
      const ans = answers.filter((a) => a.questionId === q.id);
      return {
        ...q,
        answers: ans,
      };
    });

    const html = render({
      title: "Play",
      body: renderGame({
        ...game,
        questions,
        players,
      }),
      scripts: ["/quiz-master.js"],
    });

    return res.status(200).send(html);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
