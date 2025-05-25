import { join } from "node:path";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: join(__dirname, "schema.ts"),
  out: join(__dirname, "migrations"),
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
});
