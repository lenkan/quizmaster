module.exports = () => (req, res, next) => {
  const now = Date.now();
  console.log("->", req.method, req.path);
  res.on("finish", () => {
    console.log(
      "<-",
      req.method,
      req.path,
      res.statusCode,
      `${Math.round((Date.now() - now) / 1000)}ms`
    );
  });
  next();
};
