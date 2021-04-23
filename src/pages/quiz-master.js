import express from "express";
import * as gameRepo from "../data/game-repo.js";
import render from "./render.js";
import config from "../config.js";
import * as datefns from "../date-fns.js";
const router = express.Router();

const Question = (question) => `
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

const PlayerListItem = (player) => `
<div class="item">
  <img class="ui avatar image" src="/img/${player.avatarId}.svg">
  <div class="content">
    <div class="header">${player.name}</div>
    <div class="description">${player.joined}</div>
  </div>
</div>
`;

const PlayerList = (game) => `
<div class="ui list" id="player-list">
  ${game.players.map(PlayerListItem).join("\n")}
</div>
`;

const Head = (game) => {
  const gameUrl = `${config.baseUrl}/quiz-join/${game.id}`;
  const gameLink = `<a href="${gameUrl}">${gameUrl}</a>`;

  return `
  <div style="margin: 10px;">
    <div class="ui fluid card">
      <div class="content">
        <div class="header">${game.title}</div>
        <div class="description">
          <p>Invite to join here: ${gameLink}</p>
          ${PlayerList(game)}
        </div>
      </div>
    </div>
  </div>
  `;
};

function renderGame(game) {
  const questionsHtml = (game.questions || [])
    .map((question, i) => {
      return Question({
        index: i,
        gameId: game.id,
        quizId: game.quizId,
        ...question,
      });
    })
    .join("\n");

  const header = Head(game);

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

export default router;
