import pg from "pg";
import config from "../config.js";

const client = new pg.Client({
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

export default client;
