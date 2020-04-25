const express = require("express");
const repo = require("./repo");
const router = express.Router();

router.delete("/quizzes/:id/questions/:qid", async (req, res, next) => {
  try {
    const quizId = req.params.id;
    const questionId = parseInt(req.params.qid);
    const quiz = await repo.getQuizById(quizId);

    if (quiz) {
      const questions = quiz.questions.filter((q) => q.id !== questionId);
      await repo.saveQuiz({
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

router.get("/quizzes", async (req, res, next) => {
  try {
    const quizzes = await repo.getQuizzes();
    res.status(200).send(quizzes);
  } catch (error) {
    next(error);
  }
});

router.get("/quizzes/:id", async (req, res, next) => {
  try {
    const quiz = await repo.getQuizById(req.params.id);
    if (!quiz) {
      res.sendStatus(404);
    } else {
      res.status(200).send(quiz);
    }
  } catch (error) {
    next(error);
  }
});

router.put("/quizzes/:id", async (req, res, next) => {
  try {
    await repo.saveQuiz({ ...req.body, id: req.params.id });
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

router.post("/quizzes", async (req, res, next) => {
  try {
    const quiz = await repo.saveQuiz(req.body);
    res.status(201).location(`/quizzes/${quiz.id}`).send(quiz);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
