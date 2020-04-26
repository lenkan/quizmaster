const express = require("express");
const ctx = require("../data/context");
const router = express.Router();

router.get("/quizzes", async (req, res, next) => {
  try {
    const quizzes = await ctx.quiz.getQuizzes();
    res.status(200).send(quizzes);
  } catch (error) {
    next(error);
  }
});

router.get("/quizzes/:id", async (req, res, next) => {
  try {
    const quiz = await ctx.quiz.getQuizById(req.params.id);
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
    await ctx.quiz.saveQuiz({ ...req.body, id: req.params.id });
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

router.post("/quizzes", async (req, res, next) => {
  try {
    const quiz = await ctx.quiz.saveQuiz(req.body);
    res.status(201).location(`/quizzes/${quiz.id}`).send(quiz);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
