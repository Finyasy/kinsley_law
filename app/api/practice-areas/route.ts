import { NextResponse } from "next/server";
import { formatDatabaseErrorMessage, isDatabaseConfigured } from "@/lib/persistence";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      {
        errors: ["Database is not configured. Add DATABASE_URL before loading practice areas."],
      },
      { status: 503 },
    );
  }

  try {
    const practiceAreas = await prisma.practiceArea.findMany({
      orderBy: { name: "asc" },
      include: {
        attorney: true,
        highlights: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    return NextResponse.json(practiceAreas);
  } catch (error) {
    return NextResponse.json(
      {
        errors: ["Unable to load practice areas right now.", formatDatabaseErrorMessage(error)],
      },
      { status: 500 },
    );
  }
}
