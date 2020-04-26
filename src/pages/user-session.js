const expressSession = require("express-session");
const config = require("../config");

const redis = require("ioredis");

const RedisStore = require("connect-redis")(expressSession);
const redisClient = redis({
  host: config.redis.hostname,
  port: config.redis.port,
});

module.exports = expressSession({
  secret: "quiz cat",
  store: new RedisStore({ client: redisClient }),
  saveUninitialized: true,
  resave: true,
});
