import config from "./config.js";
import util from "util";

const levels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const loglevel =
  levels[config.loglevel] !== undefined ? levels[config.loglevel] : 1;

function log(level, ...msg) {
  process.stdout.write(
    `${level}: ${msg.map((m) => util.format(m)).join(" ")}\n`
  );
}

export function info(...msg) {
  if (loglevel <= 1) {
    log("INFO", ...msg);
  }
}

export function error(...msg) {
  if (loglevel <= 3) {
    log("ERROR", ...msg);
  }
}

export function debug(...msg) {
  if (loglevel <= 0) {
    log("DEBUG", ...msg);
  }
}

export function warn(...msg) {
  if (loglevel <= 2) {
    log("WARN", ...msg);
  }
}
