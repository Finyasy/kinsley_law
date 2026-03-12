import { createHash, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "kinsley_admin_session";

function normalizeSecret(value: string | undefined) {
  return value?.trim() || "";
}

export function getAdminPassword() {
  return normalizeSecret(process.env.ADMIN_DASHBOARD_PASSWORD);
}

export function hasAdminPasswordConfigured() {
  return getAdminPassword().length > 0;
}

export function createAdminSessionToken(secret: string) {
  return createHash("sha256").update(secret).digest("hex");
}

export function isAdminPasswordValid(password: string) {
  const configuredPassword = getAdminPassword();

  if (!configuredPassword) {
    return false;
  }

  const provided = Buffer.from(password);
  const expected = Buffer.from(configuredPassword);

  if (provided.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(provided, expected);
}

export function isAdminSessionValid(cookieValue: string | undefined) {
  const configuredPassword = getAdminPassword();

  if (!configuredPassword || !cookieValue) {
    return false;
  }

  const expectedToken = createAdminSessionToken(configuredPassword);
  const provided = Buffer.from(cookieValue);
  const expected = Buffer.from(expectedToken);

  if (provided.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(provided, expected);
}
