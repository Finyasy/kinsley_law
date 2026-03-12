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
        errors: ["Database is not configured. Add DATABASE_URL before loading attorneys."],
      },
      { status: 503 },
    );
  }

  const { id } = await context.params;
  const attorneyId = Number(id);

  if (Number.isNaN(attorneyId)) {
    return NextResponse.json({ error: "Attorney id must be a number." }, { status: 400 });
  }

  try {
    const attorney = await prisma.attorney.findUnique({
      where: { id: attorneyId },
      include: {
        practiceAreas: {
          orderBy: { name: "asc" },
        },
        appointments: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!attorney) {
      return NextResponse.json({ error: "Attorney not found." }, { status: 404 });
    }

    return NextResponse.json(attorney);
  } catch (error) {
    return NextResponse.json(
      {
        errors: ["Unable to load attorney right now.", formatDatabaseErrorMessage(error)],
      },
      { status: 500 },
    );
  }
}
