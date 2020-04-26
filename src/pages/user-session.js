const expressSession = require("express-session");

const redis = require("ioredis");

const RedisStore = require("connect-redis")(expressSession);
const redisClient = redis.createClient();

module.exports = expressSession({
  secret: "quiz cat",
  store: new RedisStore({ client: redisClient }),
  saveUninitialized: true,
  resave: true,
});
