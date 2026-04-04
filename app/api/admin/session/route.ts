import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  authenticateAdminUser,
  createAdminSession,
  deleteAdminSession,
  getAdminSessionMaxAge,
  hasAdminUsersConfigured,
} from "@/lib/admin-auth";
import { isDatabaseConfigured } from "@/lib/persistence";
import { parseRequestJson } from "@/lib/request-json";

type SessionPayload = {
  email?: string;
  password?: string;
};

function getRequestIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? null;
  }

  return request.headers.get("x-real-ip");
}

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "DATABASE_URL is not configured for admin authentication." },
      { status: 503 },
    );
  }

  if (!(await hasAdminUsersConfigured())) {
    return NextResponse.json(
      { error: "No admin users are configured yet. Create the first admin user before signing in." },
      { status: 503 },
    );
  }

  const parsedBody = await parseRequestJson<SessionPayload>(request);

  if (!parsedBody.ok) {
    return NextResponse.json(
      { error: parsedBody.error },
      { status: 400 },
    );
  }

  const payload = parsedBody.data;
  const email = payload.email?.trim() ?? "";
  const password = payload.password?.trim() ?? "";
  const user = await authenticateAdminUser(email, password);

  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  const session = await createAdminSession({
    userId: user.id,
    userAgent: request.headers.get("user-agent"),
    ipAddress: getRequestIp(request),
  });

  const response = NextResponse.json({
    ok: true,
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: session.sessionToken,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: session.expiresAt,
    maxAge: getAdminSessionMaxAge(),
  });
  response.headers.set("Cache-Control", "no-store, max-age=0");

  return response;
}

export async function DELETE(request: Request) {
  const response = NextResponse.json({ ok: true });
  const sessionToken = request.headers
    .get("cookie")
    ?.split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${ADMIN_SESSION_COOKIE}=`))
    ?.slice(ADMIN_SESSION_COOKIE.length + 1);

  await deleteAdminSession(sessionToken);

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  response.headers.set("Cache-Control", "no-store, max-age=0");

  return response;
}
