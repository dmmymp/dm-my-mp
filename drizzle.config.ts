
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  driver: "pg" as any, // Use type assertion to bypass the type error for driver
  dbCredentials: {
    connectionString: process.env.DATABASE_URL as string,
  } as any, // Use type assertion to bypass the type error for dbCredentials
  verbose: true,
  strict: true,
  dialect: "postgresql"
});
