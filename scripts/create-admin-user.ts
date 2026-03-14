import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import {
  hashAdminPassword,
  normalizeAdminEmail,
} from "../lib/admin-auth";

function readArgument(flag: string) {
  const index = process.argv.indexOf(flag);

  if (index === -1) {
    return "";
  }

  return process.argv[index + 1]?.trim() ?? "";
}

function printUsageAndExit() {
  console.error(
    'Usage: npm run admin:create -- --email "admin@kinsleylaw.com" --name "Kinsley Admin" --password "replace-with-a-long-password" [--role "admin"]',
  );
  process.exit(1);
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is required before creating an admin user.");
  process.exit(1);
}

const email = normalizeAdminEmail(readArgument("--email"));
const name = readArgument("--name");
const password = readArgument("--password");
const role = readArgument("--role") || "admin";

if (!email || !name || !password) {
  printUsageAndExit();
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await hashAdminPassword(password);
  const adminUser = await prisma.adminUser.upsert({
    where: { email },
    update: {
      name,
      role,
      isActive: true,
      passwordHash,
      sessions: {
        deleteMany: {},
      },
    },
    create: {
      email,
      name,
      role,
      passwordHash,
    },
  });

  console.log(
    `Admin user ready: ${adminUser.email} (${adminUser.role})`,
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Failed to create admin user:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
