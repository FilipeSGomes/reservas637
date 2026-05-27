const { Client } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env.local") });

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const files = ["schema.sql", "rls.sql"];
  for (const file of files) {
    const sql = fs.readFileSync(path.join(__dirname, "../supabase", file), "utf8");
    console.log(`\n→ Rodando ${file}...`);
    await client.query(sql);
    console.log(`✓ ${file} concluído`);
  }

  await client.end();
  console.log("\n✓ Migrations concluídas.");
}

run().catch((err) => {
  console.error("Erro na migration:", err.message);
  process.exit(1);
});
