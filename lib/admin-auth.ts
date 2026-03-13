import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

export const ADMIN_SESSION_COOKIE = "kinsley_admin_session";
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 8;

function normalizeSecret(value: string | undefined) {
  return value?.trim() || "";
}

function bufferEquals(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function getSessionSigningSecret(password: string) {
  const configuredSecret = normalizeSecret(process.env.ADMIN_SESSION_SECRET);
  return configuredSecret || password;
}

function signSessionPayload(payload: string, password: string) {
  const signingSecret = getSessionSigningSecret(password);

  return createHmac("sha256", signingSecret).update(payload).digest("base64url");
}

export function getAdminPassword() {
  return normalizeSecret(process.env.ADMIN_DASHBOARD_PASSWORD);
}

export function hasAdminPasswordConfigured() {
  return getAdminPassword().length > 0;
}

export function createAdminSessionToken(password: string) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + ADMIN_SESSION_TTL_SECONDS;
  const nonce = randomBytes(12).toString("base64url");
  const payload = `${issuedAt}.${expiresAt}.${nonce}`;
  const signature = signSessionPayload(payload, password);

  return `v1.${payload}.${signature}`;
}

export function getAdminSessionMaxAge() {
  return ADMIN_SESSION_TTL_SECONDS;
}

export function isAdminPasswordValid(password: string) {
  const configuredPassword = getAdminPassword();

  if (!configuredPassword) {
    return false;
  }

  return bufferEquals(password, configuredPassword);
}

export function isAdminSessionValid(cookieValue: string | undefined) {
  const configuredPassword = getAdminPassword();

  if (!configuredPassword || !cookieValue) {
    return false;
  }

  const [version, issuedAtValue, expiresAtValue, nonce, signature] =
    cookieValue.split(".");

  if (
    version !== "v1" ||
    !issuedAtValue ||
    !expiresAtValue ||
    !nonce ||
    !signature
  ) {
    return false;
  }

  const expiresAt = Number.parseInt(expiresAtValue, 10);

  if (!Number.isFinite(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000)) {
    return false;
  }

  const payload = `${issuedAtValue}.${expiresAtValue}.${nonce}`;
  const expectedSignature = signSessionPayload(payload, configuredPassword);

  return bufferEquals(signature, expectedSignature);
}

export function hashAdminPasswordForDisplay() {
  const configuredPassword = getAdminPassword();

  if (!configuredPassword) {
    return "";
  }

  return createHash("sha256").update(configuredPassword).digest("hex");
}
