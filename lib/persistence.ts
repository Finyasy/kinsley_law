export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function formatDatabaseErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown database error";
}
