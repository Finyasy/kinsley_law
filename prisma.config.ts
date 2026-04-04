import "dotenv/config";
import { defineConfig, env } from "prisma/config";

const migrationUrl =
  process.env.MIGRATION_DATABASE_URL?.trim() || env("DATABASE_URL");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: migrationUrl,
  },
});
