module.exports.getTimeDifference = function getJoinString(now, then) {
  const diffMs = new Date(now) - new Date(then).getTime();
  if (diffMs < 1000 * 30) {
    return `just now`;
  }

  if (diffMs < 1000 * 60) {
    return `a minute ago`;
  }

  const diffMinutes = Math.round(diffMs / 1000 / 60);

  if (diffMinutes < 5) {
    return `${diffMinutes} minutes ago`;
  }

  if (diffMinutes < 15) {
    return `10 minutes ago`;
  }

  if (diffMinutes < 40) {
    return `30 minutes ago`;
  }

  return `an hour ago`;
};
