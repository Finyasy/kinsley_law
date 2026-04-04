const DEPRECATED_SSL_MODES = new Set(["prefer", "require", "verify-ca"]);

export function normalizeDatabaseUrl(connectionString: string | undefined | null) {
  if (!connectionString) {
    return connectionString ?? undefined;
  }

  let parsed: URL;

  try {
    parsed = new URL(connectionString);
  } catch {
    return connectionString;
  }

  const sslmode = parsed.searchParams.get("sslmode");

  if (!sslmode || !DEPRECATED_SSL_MODES.has(sslmode)) {
    return connectionString;
  }

  parsed.searchParams.set("sslmode", "verify-full");

  return parsed.toString();
}
