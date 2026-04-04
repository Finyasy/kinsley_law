import { NextResponse } from "next/server";
import {
  sendContactAutoReply,
  sendContactNotification,
} from "@/lib/email-notifications";
import { enforceIntakeProtection } from "@/lib/intake-protection";
import { formatDatabaseErrorMessage, isDatabaseConfigured } from "@/lib/persistence";
import { prisma } from "@/lib/prisma";
import { parseRequestJson } from "@/lib/request-json";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
  website?: string;
  formStartedAt?: number;
};

function validate(payload: ContactPayload) {
  const errors: string[] = [];

  if (!payload.name?.trim()) errors.push("Name is required.");
  if (!payload.email?.trim()) errors.push("Email is required.");
  if (!payload.service?.trim()) errors.push("Service is required.");
  if (!payload.message?.trim()) errors.push("Message is required.");

  return errors;
}

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      {
        errors: ["Database is not configured. Add DATABASE_URL before submitting forms."],
      },
      { status: 503 },
    );
  }

  const parsedBody = await parseRequestJson<ContactPayload>(request);

  if (!parsedBody.ok) {
    return NextResponse.json({ errors: [parsedBody.error] }, { status: 400 });
  }

  const payload = parsedBody.data;
  const protectionResponse = enforceIntakeProtection({
    request,
    routeKey: "contact",
    honeypot: payload.website,
    formStartedAt: payload.formStartedAt,
  });

  if (protectionResponse) {
    return protectionResponse;
  }

  const errors = validate(payload);

  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  try {
    const submission = await prisma.contact.create({
      data: {
        name: payload.name!.trim(),
        email: payload.email!.trim(),
        phone: payload.phone?.trim() || null,
        service: payload.service!.trim(),
        message: payload.message!.trim(),
      },
    });
    const [notification, clientReply] = await Promise.all([
      sendContactNotification({
        name: submission.name,
        email: submission.email,
        phone: submission.phone,
        service: submission.service,
        message: submission.message,
      }),
      sendContactAutoReply({
        name: submission.name,
        email: submission.email,
        service: submission.service,
      }),
    ]);
    const savedSubmission = await prisma.contact.update({
      where: { id: submission.id },
      data: {
        notificationStatus: notification.status,
        notificationDetail: notification.detail,
        clientReplyStatus: clientReply.status,
        clientReplyDetail: clientReply.detail,
      },
    });

    return NextResponse.json(
      {
        message: "Thank you for contacting Kinsley Advocates. We will be in touch shortly.",
        submission: savedSubmission,
        persistence: "postgresql",
        notification,
        clientReply,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        errors: [
          "Unable to save your message right now.",
          formatDatabaseErrorMessage(error),
        ],
      },
      { status: 500 },
    );
  }
}
