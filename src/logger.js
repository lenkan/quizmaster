const config = require("./config");

const levels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const loglevel =
  levels[config.loglevel] !== undefined ? levels[config.loglevel] : 1;

function log(level, ...msg) {
  console.log(`${level}:`, ...msg);
}

module.exports.info = function info(...msg) {
  if (loglevel <= 1) {
    log("INFO", ...msg);
  }
};

module.exports.error = function error(...msg) {
  if (loglevel <= 3) {
    log("ERROR", ...msg);
  }
};

module.exports.debug = function debug(...msg) {
  if (loglevel <= 0) {
    log("DEBUG", ...msg);
  }
};

module.exports.warn = function warn(...msg) {
  if (loglevel <= 2) {
    log("WARN", ...msg);
  }
};
