import express from "express";
import ctx from "../data/context.js";
import * as datefns from "../date-fns.js";
const router = express.Router();

router.get("/games/:id/players", async (req, res, next) => {
  try {
    const now = Date.now();
    const players = await ctx.game
      .getPlayersByGameId(req.params.id)
      .then((players) => {
        return players.map((player) => ({
          ...player,
          joined: `Joined ${datefns.getTimeDifference(now, player.createdAt)}`,
        }));
      });
    res.status(200).send(players);
  } catch (error) {
    next(error);
  }
});

export default router;
