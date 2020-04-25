const express = require("express");
const repo = require("./repo");
const sessions = require("../quiz-play/repo");
const api = require("./api");
const router = express.Router();
const render = require("../views/render");

function renderQuestion(quizId, question, index) {
  return `
    <div id="question-${question.id}" style="margin: 10px;">
      <div class="ui fluid card">
        <div class="content">
          <div class="right floated">
            <div
              data-question-index="${question.id}"
              data-quiz-id="${quizId}"
              class="ui icon buttons tiny delete-question"
            >
              <button class="ui button">
                <i class="trash icon"></i>
              </button>
            </div>
          </div>
          <div class="header">Question ${index + 1}</div>
          <div class="description">${question.text}</div>
        </div>
      </div>
    </div>
  `;
}

function renderQuiz(quiz) {
  return render({
    title: "Build your quiz",
    scripts: ["/quiz-builder.js"],
    body: renderQuizBody(quiz),
  });
}

function renderQuizBody(quiz) {
  return `
  <div style="margin: 10px;">
    <form 
      class="ui form" 
      action="/quiz-builder/${quiz.id}/questions" 
      method="post"
    >
      <div class="field">
        <input class="ui input" type="text" name="text">
      </div>
      <button class="ui fluid button">Add</button>
    </form>
  </div>
  ${(quiz.questions || []).map((question, i) => {
    return renderQuestion(quiz.id, question, i);
  })}
  <div style="margin: 10px;">
    <form 
      class="ui form"
      action="/quiz-builder/${quiz.id}/sessions"
      method="post"
    >
      <button class="ui fluid button primary">Start</button>
    </form>
  </div>
`;
}

router.get("/quiz-builder/:id", async (req, res, next) => {
  try {
    const quiz = await repo.getQuizById(req.params.id);
    if (quiz) {
      const html = renderQuiz(quiz);
      res.status(200).send(html);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});

router.post("/quiz-builder/:id/questions", async (req, res, next) => {
  try {
    const quiz = await repo.getQuizById(req.params.id);
    const question = req.body;
    if (quiz) {
      await repo.saveQuiz({
        ...quiz,
        questions: [...quiz.questions, question],
      });
      res.redirect(`/quiz-builder/${quiz.id}`);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});

router.post("/quiz-builder/:id/sessions", async (req, res, next) => {
  try {
    const quiz = await repo.getQuizById(req.params.id);
    const session = await sessions.createSession(quiz);
    res.redirect(`/quiz-master/${session.id}`);
  } catch (error) {
    next(error);
  }
});

router.use("/api", api);

module.exports = router;
