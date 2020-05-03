const log = require("./logger");

module.exports = () => (req, res, next) => {
  const now = Date.now();
  log.info("->", req.method, req.path);
  res.on("finish", () => {
    log.info(
      "<-",
      req.method,
      req.path,
      res.statusCode,
      `${Math.round((Date.now() - now) / 1000)}ms`
    );
  });
  next();
};
