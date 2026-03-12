import { NextResponse } from "next/server";
import { formatDatabaseErrorMessage, isDatabaseConfigured } from "@/lib/persistence";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, context: RouteContext) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      {
        errors: ["Database is not configured. Add DATABASE_URL before loading practice areas."],
      },
      { status: 503 },
    );
  }

  const { id } = await context.params;
  const practiceAreaId = Number(id);

  if (Number.isNaN(practiceAreaId)) {
    return NextResponse.json({ error: "Practice area id must be a number." }, { status: 400 });
  }

  try {
    const practiceArea = await prisma.practiceArea.findUnique({
      where: { id: practiceAreaId },
      include: {
        attorney: true,
        highlights: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!practiceArea) {
      return NextResponse.json({ error: "Practice area not found." }, { status: 404 });
    }

    return NextResponse.json(practiceArea);
  } catch (error) {
    return NextResponse.json(
      {
        errors: ["Unable to load practice area right now.", formatDatabaseErrorMessage(error)],
      },
      { status: 500 },
    );
  }
}
