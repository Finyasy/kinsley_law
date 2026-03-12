import { NextResponse } from "next/server";
import { formatDatabaseErrorMessage, isDatabaseConfigured } from "@/lib/persistence";
import { prisma } from "@/lib/prisma";

type AppointmentPayload = {
  name?: string;
  email?: string;
  phone?: string;
  date?: string;
  time?: string;
  practiceArea?: string;
  description?: string;
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

  const payload = (await request.json()) as AppointmentPayload;
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
      select: { id: true },
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

    return NextResponse.json(
      {
        message: "Consultation request received. A member of the firm will confirm availability.",
        submission,
        persistence: "postgresql",
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
