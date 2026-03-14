import { NextResponse } from "next/server";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const MINIMUM_FORM_FILL_MS = 1500;

type RateLimitEntry = {
  timestamps: number[];
};

declare global {
  var intakeRateLimitStore: Map<string, RateLimitEntry> | undefined;
}

const rateLimitStore =
  globalThis.intakeRateLimitStore ?? new Map<string, RateLimitEntry>();

if (process.env.NODE_ENV !== "production") {
  globalThis.intakeRateLimitStore = rateLimitStore;
}

function getRequestIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

function consumeRateLimitToken(key: string) {
  const now = Date.now();
  const existing = rateLimitStore.get(key);
  const timestamps = (existing?.timestamps ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  timestamps.push(now);
  rateLimitStore.set(key, { timestamps });

  return timestamps.length <= RATE_LIMIT_MAX_REQUESTS;
}

type IntakeProtectionOptions = {
  request: Request;
  routeKey: string;
  honeypot: string | undefined;
  formStartedAt: number | undefined;
};

export function enforceIntakeProtection(options: IntakeProtectionOptions) {
  if (options.honeypot?.trim()) {
    return NextResponse.json(
      { message: "Submission received.", blocked: true },
      { status: 200 },
    );
  }

  if (
    typeof options.formStartedAt !== "number" ||
    !Number.isFinite(options.formStartedAt)
  ) {
    return NextResponse.json(
      { errors: ["Refresh the page and try again."] },
      { status: 400 },
    );
  }

  if (Date.now() - options.formStartedAt < MINIMUM_FORM_FILL_MS) {
    return NextResponse.json(
      { errors: ["Please take a moment to review your details before submitting."] },
      { status: 422 },
    );
  }

  const rateLimitKey = `${options.routeKey}:${getRequestIp(options.request)}`;
  const isAllowed = consumeRateLimitToken(rateLimitKey);

  if (!isAllowed) {
    return NextResponse.json(
      { errors: ["Too many submissions from this device. Please try again shortly."] },
      { status: 429 },
    );
  }

  return null;
}
