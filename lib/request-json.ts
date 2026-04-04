export async function parseRequestJson<T>(request: Request) {
  try {
    return {
      ok: true as const,
      data: (await request.json()) as T,
    };
  } catch {
    return {
      ok: false as const,
      error: "A valid JSON payload is required.",
    };
  }
}
