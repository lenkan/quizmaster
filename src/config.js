const isProduction = process.env.NODE_ENV === "production";
function requireEnv(name, defaultValue) {
  const envValue = process.env[name];
  if (envValue === undefined && defaultValue === undefined) {
    throw new Error(`Missing env '${name}'`);
  }

  return envValue !== undefined ? envValue : defaultValue;
}

module.exports = {
  isProduction,
  db: {
    hostname: requireEnv("DB_HOST", "localhost"),
    port: parseInt(requireEnv("DB_PORT", "5432")),
    username: requireEnv("DB_USER", "postgres"),
    password: requireEnv("DB_PASSWORD", ""),
    dbname: requireEnv("DB_DATABASE", "quizmaster"),
  },
  redis: {
    hostname: requireEnv("REDIS_HOST", "localhost"),
    port: parseInt(requireEnv("REDIS_PORT", "6379")),
  },
  port: requireEnv("PORT", "8080"),
  baseUrl: requireEnv("BASE_URL", "http://localhost:8080"),
};
