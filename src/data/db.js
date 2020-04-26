const { Client } = require("pg");
const config = require("../config");

const client = new Client({
  database: config.db.dbname,
  host: config.db.hostname,
  user: config.db.username,
  password: config.db.password,
  port: config.db.port,
});

client.connect().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

module.exports = client;
