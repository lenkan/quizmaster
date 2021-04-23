import expressSession from "express-session";
import config from "../config.js";

import Redis from "ioredis";
import connectRedis from "connect-redis";

const RedisStore = connectRedis(expressSession);
const redisClient = new Redis({
  host: config.redis.hostname,
  port: config.redis.port,
});

export default expressSession({
  secret: "quiz cat",
  store: new RedisStore({ client: redisClient }),
  saveUninitialized: true,
  resave: true,
});
