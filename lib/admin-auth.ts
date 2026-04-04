import {
  createHash,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/persistence";

export const ADMIN_SESSION_COOKIE = "kinsley_admin_session";
export const ADMIN_ROLE_ADMIN = "admin";
export const ADMIN_ROLE_EDITOR = "editor";
export const ADMIN_ROLE_OPTIONS = [ADMIN_ROLE_ADMIN, ADMIN_ROLE_EDITOR] as const;
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 8;
const PASSWORD_KEY_LENGTH = 64;
const SCRYPT_COST = 16384;
const SCRYPT_BLOCK_SIZE = 8;
const SCRYPT_PARALLELIZATION = 1;
const MIN_ADMIN_PASSWORD_LENGTH = 10;

type AdminSessionUser = {
  id: number;
  email: string;
  name: string;
  role: string;
};

function normalizeText(value: string | undefined) {
  return value?.trim() || "";
}

function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function safeStringEquals(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function normalizeAdminEmail(email: string) {
  return normalizeText(email).toLowerCase();
}

async function deriveScryptKey(password: string, salt: string) {
  return new Promise<Buffer>((resolve, reject) => {
    scryptCallback(
      password,
      salt,
      PASSWORD_KEY_LENGTH,
      {
        N: SCRYPT_COST,
        r: SCRYPT_BLOCK_SIZE,
        p: SCRYPT_PARALLELIZATION,
      },
      (error, derivedKey) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(derivedKey as Buffer);
      },
    );
  });
}

async function deriveStoredScryptKey(
  password: string,
  salt: string,
  options: { cost: number; blockSize: number; parallelization: number },
) {
  return new Promise<Buffer>((resolve, reject) => {
    scryptCallback(
      password,
      salt,
      PASSWORD_KEY_LENGTH,
      {
        N: options.cost,
        r: options.blockSize,
        p: options.parallelization,
      },
      (error, derivedKey) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(derivedKey as Buffer);
      },
    );
  });
}

export function getAdminSessionMaxAge() {
  return ADMIN_SESSION_TTL_SECONDS;
}

export async function hashAdminPassword(password: string) {
  const normalizedPassword = normalizeText(password);

  if (normalizedPassword.length < MIN_ADMIN_PASSWORD_LENGTH) {
    throw new Error(
      `Admin passwords must be at least ${MIN_ADMIN_PASSWORD_LENGTH} characters long.`,
    );
  }

  const salt = randomBytes(16).toString("hex");
  const derivedKey = await deriveScryptKey(normalizedPassword, salt);

  return [
    "scrypt",
    SCRYPT_COST,
    SCRYPT_BLOCK_SIZE,
    SCRYPT_PARALLELIZATION,
    salt,
    derivedKey.toString("hex"),
  ].join("$");
}

export async function verifyAdminPassword(
  password: string,
  passwordHash: string,
) {
  const [algorithm, costValue, blockSizeValue, parallelizationValue, salt, hash] =
    passwordHash.split("$");

  if (
    algorithm !== "scrypt" ||
    !costValue ||
    !blockSizeValue ||
    !parallelizationValue ||
    !salt ||
    !hash
  ) {
    return false;
  }

  const cost = Number.parseInt(costValue, 10);
  const blockSize = Number.parseInt(blockSizeValue, 10);
  const parallelization = Number.parseInt(parallelizationValue, 10);

  if (
    !Number.isFinite(cost) ||
    !Number.isFinite(blockSize) ||
    !Number.isFinite(parallelization)
  ) {
    return false;
  }

  const derivedKey = await deriveStoredScryptKey(password, salt, {
    cost,
    blockSize,
    parallelization,
  });

  return safeStringEquals(derivedKey.toString("hex"), hash);
}

export async function hasAdminUsersConfigured() {
  if (!isDatabaseConfigured()) {
    return false;
  }

  try {
    const count = await prisma.adminUser.count({
      where: { isActive: true },
    });
    return count > 0;
  } catch {
    return false;
  }
}

export async function authenticateAdminUser(
  email: string,
  password: string,
): Promise<AdminSessionUser | null> {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const normalizedEmail = normalizeAdminEmail(email);

  if (!normalizedEmail || !password) {
    return null;
  }

  const adminUser = await prisma.adminUser.findUnique({
    where: { email: normalizedEmail },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      passwordHash: true,
    },
  });

  if (!adminUser?.isActive) {
    return null;
  }

  const isPasswordValid = await verifyAdminPassword(
    password,
    adminUser.passwordHash,
  );

  if (!isPasswordValid) {
    return null;
  }

  return {
    id: adminUser.id,
    email: adminUser.email,
    name: adminUser.name,
    role: adminUser.role,
  };
}

export async function createAdminSession(options: {
  userId: number;
  userAgent?: string | null;
  ipAddress?: string | null;
}) {
  const sessionToken = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + ADMIN_SESSION_TTL_SECONDS * 1000);

  await prisma.adminSession.create({
    data: {
      adminUserId: options.userId,
      sessionTokenHash: hashSessionToken(sessionToken),
      expiresAt,
      userAgent: normalizeText(options.userAgent ?? undefined) || null,
      ipAddress: normalizeText(options.ipAddress ?? undefined) || null,
    },
  });

  return {
    sessionToken,
    expiresAt,
  };
}

export async function deleteAdminSession(sessionToken: string | undefined) {
  if (!isDatabaseConfigured() || !sessionToken) {
    return;
  }

  await prisma.adminSession.deleteMany({
    where: {
      sessionTokenHash: hashSessionToken(sessionToken),
    },
  });
}

export async function getAdminSession(
  sessionToken: string | undefined,
): Promise<
  | {
      user: AdminSessionUser;
      expiresAt: Date;
    }
  | null
> {
  if (!isDatabaseConfigured() || !sessionToken) {
    return null;
  }

  const session = await prisma.adminSession.findUnique({
    where: {
      sessionTokenHash: hashSessionToken(sessionToken),
    },
    include: {
      adminUser: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
        },
      },
    },
  });

  if (!session) {
    return null;
  }

  if (!session.adminUser.isActive || session.expiresAt <= new Date()) {
    await prisma.adminSession.deleteMany({
      where: { id: session.id },
    });
    return null;
  }

  return {
    user: {
      id: session.adminUser.id,
      email: session.adminUser.email,
      name: session.adminUser.name,
      role: session.adminUser.role,
    },
    expiresAt: session.expiresAt,
  };
}

export async function getAdminSessionFromCookies() {
  const cookieStore = await cookies();

  return getAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}

export async function requireAdminSessionUser() {
  const session = await getAdminSessionFromCookies();
  return session?.user ?? null;
}

export function isAdminManager(role: string) {
  return role === ADMIN_ROLE_ADMIN;
}

export async function touchAdminSession(sessionToken: string | undefined) {
  if (!isDatabaseConfigured() || !sessionToken) {
    return;
  }

  await prisma.adminSession.updateMany({
    where: {
      sessionTokenHash: hashSessionToken(sessionToken),
      expiresAt: {
        gt: new Date(),
      },
    },
    data: {
      lastSeenAt: new Date(),
    },
  });
}
