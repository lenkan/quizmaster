import express from "express";
import * as quizRepo from "../data/quiz-repo.js";
import * as gameRepo from "../data/game-repo.js";
import render from "./render.js";

const router = express.Router();

function renderQuestion(quizId, question, index) {
  return `
    <div id="question-${question.id}" style="margin-bottom: 10px;">
      <div class="ui fluid card">
        <div class="content">
          <div class="right floated">
            <div class="ui icon buttons tiny"> 
              <button 
                data-question-id="${question.id}"
                data-quiz-id="${quizId}"
                class="ui button remove-question"
              >
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
    title: quiz.title || "Build your quiz",
    scripts: ["/quiz-builder.js"],
    body: renderQuizBody(quiz),
  });
}

function renderQuizBody(quiz) {
  return `
  <h1 class="ui header">
    ${quiz.title || "Build your quiz"}
  </h1>
  <p class="ui paragraph">Add questions to your quiz</p>
  <div style="margin-bottom: 10px;">
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
  <div style="margin-bottom: 10px;">
    <form 
      class="ui form"
      action="/quiz-builder/${quiz.id}/games"
      method="post"
    >
      <button class="ui fluid button primary">Start</button>
    </form>
  </div>
`;
}

router.get("/quiz-builder/:id", async (req, res, next) => {
  try {
    const quiz = await quizRepo.getQuizById(req.params.id);
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
    const quiz = await quizRepo.getQuizById(req.params.id);
    const question = req.body;
    if (quiz) {
      await quizRepo.saveQuiz({
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

router.post("/quiz-builder/:id/games", async (req, res, next) => {
  try {
    const quiz = await quizRepo.getQuizById(req.params.id);
    const game = await gameRepo.createGame(quiz);
    res.redirect(`/quiz-master/${game.id}`);
  } catch (error) {
    next(error);
  }
});

router.post("/quiz-builder/:id/remove-question", async (req, res, next) => {
  try {
    const quizId = req.params.id;
    const questionId = parseInt(req.body.id);
    const quiz = await quizRepo.getQuizById(quizId);

    if (quiz) {
      const questions = quiz.questions.filter((q) => q.id !== questionId);
      await quizRepo.saveQuiz({
        ...quiz,
        questions,
      });
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});

export default router;
