import express from "express";
import quizBuilder from "./pages/quiz-builder.js";
import quizMaster from "./pages/quiz-master.js";
import quizPlay from "./pages/quiz-player.js";
import quizJoin from "./pages/quiz-join.js";
import quizHome from "./pages/quiz-homepage.js";
import quizApi from "./api/quiz-api.js";
import gameApi from "./api/game-api.js";
import requestLogger from "./request-logger.js";
import * as logger from "./logger.js";
import config from "./config.js";
import http from "http";

const app = express();
const server = http.createServer(app);

app.use(requestLogger());
app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./www"));

app.use(quizHome);
app.use(quizBuilder);
app.use(quizMaster);
app.use(quizPlay);
app.use(quizJoin);
app.use("/api", quizApi);
app.use("/api", gameApi);

server.listen(config.port, () => {
  logger.info(`Listening on ${config.port}`);
});
