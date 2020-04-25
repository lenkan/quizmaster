const { Client } = require("pg");

const client = new Client({ database: "quizmaster", user: "postgres" });

client.connect().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

module.exports = client;
