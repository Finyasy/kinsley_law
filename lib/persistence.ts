import { prisma } from "@/lib/prisma";

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function formatDatabaseErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown database error";
}

export async function getDatabaseHealth() {
  if (!isDatabaseConfigured()) {
    return {
      configured: false,
      reachable: false,
    };
  }

  try {
    await prisma.$queryRaw`SELECT 1`;

    return {
      configured: true,
      reachable: true,
    };
  } catch {
    return {
      configured: true,
      reachable: false,
    };
  }
}
