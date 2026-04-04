import { NextResponse } from "next/server";
import {
  sendAppointmentAutoReply,
  sendAppointmentNotification,
} from "@/lib/email-notifications";
import { enforceIntakeProtection } from "@/lib/intake-protection";
import { formatDatabaseErrorMessage, isDatabaseConfigured } from "@/lib/persistence";
import { prisma } from "@/lib/prisma";
import { parseRequestJson } from "@/lib/request-json";

type AppointmentPayload = {
  name?: string;
  email?: string;
  phone?: string;
  date?: string;
  time?: string;
  practiceArea?: string;
  description?: string;
  website?: string;
  formStartedAt?: number;
};

function validate(payload: AppointmentPayload) {
  const errors: string[] = [];

  if (!payload.name?.trim()) errors.push("Name is required.");
  if (!payload.email?.trim()) errors.push("Email is required.");
  if (!payload.phone?.trim()) errors.push("Phone is required.");
  if (!payload.date?.trim()) errors.push("Preferred date is required.");
  if (!payload.time?.trim()) errors.push("Preferred time is required.");
  if (!payload.practiceArea?.trim()) errors.push("Practice area is required.");
  if (!payload.description?.trim()) errors.push("Matter description is required.");

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

  const parsedBody = await parseRequestJson<AppointmentPayload>(request);

  if (!parsedBody.ok) {
    return NextResponse.json({ errors: [parsedBody.error] }, { status: 400 });
  }

  const payload = parsedBody.data;
  const protectionResponse = enforceIntakeProtection({
    request,
    routeKey: "appointment",
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
    const attorney = await prisma.attorney.findFirst({
      where: {
        OR: [
          { specialization: payload.practiceArea!.trim() },
          { practiceAreas: { some: { name: payload.practiceArea!.trim() } } },
        ],
      },
      select: { id: true, name: true },
    });

    const submission = await prisma.appointment.create({
      data: {
        name: payload.name!.trim(),
        email: payload.email!.trim(),
        phone: payload.phone!.trim(),
        date: new Date(payload.date!.trim()),
        time: payload.time!.trim(),
        practiceArea: payload.practiceArea!.trim(),
        description: payload.description!.trim(),
        attorneyId: attorney?.id ?? null,
      },
    });
    const [notification, clientReply] = await Promise.all([
      sendAppointmentNotification({
        name: submission.name,
        email: submission.email,
        phone: submission.phone,
        date: submission.date,
        time: submission.time,
        practiceArea: submission.practiceArea,
        description: submission.description,
        attorneyName: attorney?.name ?? null,
      }),
      sendAppointmentAutoReply({
        name: submission.name,
        email: submission.email,
        date: submission.date,
        time: submission.time,
        practiceArea: submission.practiceArea,
      }),
    ]);
    const savedSubmission = await prisma.appointment.update({
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
        message: "Consultation request received. A member of the firm will confirm availability.",
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
          "Unable to save your consultation request right now.",
          formatDatabaseErrorMessage(error),
        ],
      },
      { status: 500 },
    );
  }
}
