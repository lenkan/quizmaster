const express = require("express");
const gameRepo = require("../data/game-repo");
const router = express.Router();
const render = require("./render");
const expressSession = require("./user-session");

router.use(expressSession);

function renderAnswerForm(question) {
  const answerUrl = `/quiz-play/${question.gameId}/answers`;
  return `
  <form 
    class="ui form" 
    action="${answerUrl}"
    method="post"
  >
    <div class="ui field">
      <input 
        type="hidden" 
        name="questionId" 
        value="${question.id}" 
      />
      <input 
        type="text" 
        name="text" 
        class="ui input fluid" 
      />
    </div>
    <button class="ui fluid button">Answer</button>
  </form>
  `;
}

function renderAnswer(question) {
  return `<p>${question.answerText}</p>`;
}

function renderQuestion(question) {
  const answer = question.answerText
    ? renderAnswer(question)
    : renderAnswerForm(question);

  return `
    <div id="question-${question.id}" style="margin: 10px;">
      <div class="ui fluid card">
        <div class="content">
          <div class="header">Question ${question.index + 1}</div>
          <div class="description">${question.text}</div>
        </div>
        <div class="content">
        ${answer}
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

router.post("/quiz-play/:id/answers", async (req, res, next) => {
  try {
    const game = await gameRepo.getGameById(req.params.id);
    if (!game) {
      return res.sendStatus(404);
    }

    await gameRepo.saveAnswer({
      gameId: req.params.id,
      playerId: req.sessionID,
      text: req.body.text,
      questionId: req.body.questionId,
    });

    return res.redirect(`/quiz-play/${req.params.id}`);
  } catch (error) {
    next(error);
  }
});

router.get("/quiz-play/:id", async (req, res, next) => {
  try {
    const game = await gameRepo.getGameById(req.params.id);
    if (!game) {
      return res.sendStatus(404);
    }

    const player =
      req.sessionID && (await gameRepo.getPlayerById(req.sessionID));
    if (!player) {
      return res.redirect(`/quiz-join/${req.params.id}`);
    }

    const answers = await gameRepo.getPlayerAnswers(
      req.params.id,
      req.sessionID
    );

    const questions = game.questions.map((q) => {
      const answer = answers.find((ans) => ans.questionId === q.id);
      return {
        ...q,
        answerText: answer && answer.text,
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
