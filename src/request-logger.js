import * as log from "./logger.js";

export default () => (req, res, next) => {
  const now = Date.now();
  res.on("finish", () => {
    log.info(
      req.method,
      req.path,
      res.statusCode,
      `${Math.round((Date.now() - now) / 1000)}ms`
    );
  });
  next();
};
