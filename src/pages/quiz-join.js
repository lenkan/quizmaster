import express from "express";
import * as gameRepo from "../data/game-repo.js";
import render from "./render.js";
import expressSession from "./user-session.js";
const router = express.Router();

function renderJoinPage() {
  return `
  <form class="ui form" method="post">
    <h1>Join the quiz!</h1>
    <div class="ui action input fluid huge">
      <input 
        type="text"
        class="ui input field"
        placeholder="Your name"
        name="name"
      />
      <button class="ui button">Join</button>
    </div>
  </form>
  `;
}

router.use(expressSession);

router.get("/quiz-join/:id", async (req, res, next) => {
  try {
    const game = await gameRepo.getGameById(req.params.id);
    if (!game) {
      return res.sendStatus(404);
    }

    const html = render({
      title: "Play",
      body: renderJoinPage({
        ...game,
      }),
      scripts: [],
    });

    return res.status(200).send(html);
  } catch (error) {
    next(error);
  }
});

router.post("/quiz-join/:id", async (req, res, next) => {
  try {
    const game = await gameRepo.getGameById(req.params.id);
    if (!game) {
      return res.sendStatus(404);
    }

    await gameRepo.savePlayer({
      gameId: game.id,
      playerId: req.sessionID,
      name: req.body.name,
    });

    return res.redirect(`/quiz-play/${req.params.id}`);
  } catch (error) {
    next(error);
  }
});

export default router;
