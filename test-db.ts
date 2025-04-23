require("dotenv").config({ path: ".env.local" }); // Explicitly load .env.local

const { drizzle } = require("drizzle-orm/node-postgres");
const { Pool } = require("pg");
const schema = require("./db/schema");

console.log("DATABASE_URL:", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Neon might not provide a CA certificate
  },
});

const db = drizzle(pool, { schema });

async function testConnection() {
  try {
    const result = await db.select().from(schema.letters).limit(1);
    console.log("Connection successful! First row:", result);
  } catch (err) {
    console.error("Failed to connect to the database:", err);
  }
}

testConnection();