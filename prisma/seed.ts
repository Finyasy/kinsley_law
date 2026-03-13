import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import {
  defaultHomePageContent,
  fallbackAttorneys,
  fallbackOfficeDetails,
  fallbackPracticeAreas,
  fallbackTestimonials,
} from "../lib/site-defaults";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const practiceAreaOwnerByName: Record<string, string | null> = {
  "Corporate Law": "jane.kinsley@kinsleylaw.com",
  "Family Law": "robert.johnson@kinsleylaw.com",
  "Real Estate": "amanda.lewis@kinsleylaw.com",
  "Criminal Defense": "michael.chen@kinsleylaw.com",
  "Estate Planning": null,
  "Personal Injury": null,
};

async function main() {
  for (const [index, attorney] of fallbackAttorneys.entries()) {
    await prisma.attorney.upsert({
      where: { email: attorney.email },
      update: {
        ...attorney,
        sortOrder: index,
      },
      create: {
        ...attorney,
        sortOrder: index,
      },
    });
  }

  for (const [index, practiceArea] of fallbackPracticeAreas.entries()) {
    const attorneyEmail = practiceAreaOwnerByName[practiceArea.name];
    const attorney = attorneyEmail
      ? await prisma.attorney.findUnique({
          where: { email: attorneyEmail },
          select: { id: true },
        })
      : null;

    const savedPracticeArea = await prisma.practiceArea.upsert({
      where: { name: practiceArea.name },
      update: {
        description: practiceArea.description,
        attorneyId: attorney?.id ?? null,
        sortOrder: index,
      },
      create: {
        name: practiceArea.name,
        description: practiceArea.description,
        attorneyId: attorney?.id ?? null,
        sortOrder: index,
      },
      select: { id: true },
    });

    await prisma.practiceAreaHighlight.deleteMany({
      where: {
        practiceAreaId: savedPracticeArea.id,
      },
    });

    await prisma.practiceAreaHighlight.createMany({
      data: practiceArea.highlights.map((label, index) => ({
        practiceAreaId: savedPracticeArea.id,
        label,
        sortOrder: index,
      })),
    });
  }

  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({
    data: fallbackTestimonials.map((testimonial, index) => ({
      ...testimonial,
      sortOrder: index,
    })),
  });

  await prisma.siteSetting.upsert({
    where: { key: "officeDetails" },
    update: { value: fallbackOfficeDetails },
    create: {
      key: "officeDetails",
      value: fallbackOfficeDetails,
    },
  });

  await prisma.siteSetting.upsert({
    where: { key: "homePageContent" },
    update: { value: defaultHomePageContent },
    create: {
      key: "homePageContent",
      value: defaultHomePageContent,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Failed to seed database:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
