import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminSessionMaxAge,
  getAdminPassword,
  isAdminPasswordValid,
} from "@/lib/admin-auth";

type SessionPayload = {
  password?: string;
};

export async function POST(request: Request) {
  const configuredPassword = getAdminPassword();

  if (!configuredPassword) {
    return NextResponse.json(
      { error: "ADMIN_DASHBOARD_PASSWORD is not configured." },
      { status: 503 },
    );
  }

  let payload: SessionPayload;

  try {
    payload = (await request.json()) as SessionPayload;
  } catch {
    return NextResponse.json(
      { error: "A valid JSON payload is required." },
      { status: 400 },
    );
  }

  const password = payload.password?.trim() ?? "";

  if (!isAdminPasswordValid(password)) {
    return NextResponse.json(
      { error: "The admin password is incorrect." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: createAdminSessionToken(configuredPassword),
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: getAdminSessionMaxAge(),
  });

  return response;
}

export function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
