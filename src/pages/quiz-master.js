const express = require("express");
const gameRepo = require("../data/game-repo");
const router = express.Router();
const render = require("./render");

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

function renderGame(game) {
  return (game.questions || [])
    .map((question, i) => {
      return renderQuestion({
        index: i,
        gameId: game.id,
        quizId: game.quizId,
        ...question,
      });
    })
    .join("\n");
}

router.get("/quiz-master/:id", async (req, res, next) => {
  try {
    const game = await gameRepo.getGameById(req.params.id);
    if (!game) {
      return res.sendStatus(404);
    }

    const answers = await gameRepo.getAnswers(game.id);
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
      }),
      scripts: [],
    });

    return res.status(200).send(html);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
