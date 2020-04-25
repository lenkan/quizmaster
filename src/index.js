const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const server = require("http").createServer(app);
const quizBuilder = require("./quiz-builder/router");
const quizMaster = require("./quiz-play/quiz-master");
const quizPlay = require("./quiz-play/quiz-player");
// const io = require("socket.io")(server);
const requestLogger = require("./request-logger");

app.use(requestLogger());
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./www"));

app.use(quizBuilder);
app.use(quizMaster);
app.use(quizPlay);

server.listen(8080);
