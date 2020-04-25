const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const client = new Client({
  database: process.env.DATABASE || "quizmaster",
  user: "postgres",
  password: "",
});

client
  .connect()
  .then(async () => {
    await run().finally(() => client.end());
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

const migrationsTable = "migrations";

const SQL_CREATE_MIGRATIONS_TABLE = `
CREATE TABLE IF NOT EXISTS ${migrationsTable} (
  id varchar(255) PRIMARY KEY UNIQUE,
  created_at timestamp WITH time zone DEFAULT CURRENT_TIMESTAMP
);
`;

const SQL_GET_MIGRATION_STATE = `
 SELECT id FROM ${migrationsTable} ORDER BY id DESC LIMIT 1;
`;

const SQL_INSERT_MIGRATION = `
  INSERT INTO ${migrationsTable} (id) VALUES ($1);
`;

function readText(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        return reject(err);
      }

      return resolve(data.toString());
    });
  });
}

async function readMigrations(dir) {
  const files = fs
    .readdirSync(dir)
    .filter((entry) => entry.endsWith(".pssql"))
    .sort((a, b) => a.localeCompare(b));

  return Promise.all(
    files.map(async (file) => {
      const filename = path.resolve(dir, file);
      const name = file.replace(".pssql", "");
      const script = await readText(filename);
      return { name, script };
    })
  );
}

async function getMigrationState() {
  await client.query(SQL_CREATE_MIGRATIONS_TABLE);
  const { rows } = await client.query(SQL_GET_MIGRATION_STATE);
  return rows[0].id;
}

async function run() {
  const migrationState = await getMigrationState();
  const migrations = await readMigrations("migrations");

  try {
    await client.query("BEGIN");

    for (const migration of migrations) {
      if (!migrationState || migration.name > migrationState) {
        await client.query(migration.script);
        await client.query(SQL_INSERT_MIGRATION, [migration.name]);
        console.log(`UP   ${migration.name}`);
      } else {
        console.log(`SKIP ${migration.name}`);
      }
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}
