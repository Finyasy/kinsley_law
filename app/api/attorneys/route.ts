import { NextResponse } from "next/server";
import { formatDatabaseErrorMessage, isDatabaseConfigured } from "@/lib/persistence";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      {
        errors: ["Database is not configured. Add DATABASE_URL before loading attorneys."],
      },
      { status: 503 },
    );
  }

  try {
    const attorneys = await prisma.attorney.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: {
        practiceAreas: {
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        },
      },
    });

    return NextResponse.json(attorneys);
  } catch (error) {
    return NextResponse.json(
      {
        errors: ["Unable to load attorneys right now.", formatDatabaseErrorMessage(error)],
      },
      { status: 500 },
    );
  }
}
