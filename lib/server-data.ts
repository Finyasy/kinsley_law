import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/persistence";
import {
  defaultHomePageContent,
  fallbackAttorneys,
  fallbackOfficeDetails,
  fallbackPracticeAreas,
  fallbackTestimonials,
  type HomePageContent,
  type OfficeDetails,
} from "@/lib/site-defaults";

type PracticeSummary = {
  id: number;
  name: string;
};

export type PageAttorney = (typeof fallbackAttorneys)[number] & {
  id?: number;
  sortOrder?: number;
  practiceAreas: PracticeSummary[];
};

export type PagePracticeArea = {
  id?: number;
  sortOrder?: number;
  name: string;
  description: string;
  highlights: string[];
  attorney?: {
    id: number;
    name: string;
  } | null;
};

export type PageTestimonial = (typeof fallbackTestimonials)[number] & {
  id?: number;
  sortOrder?: number;
};

export type AdminDashboardData = {
  databaseConfigured: boolean;
  homePageContent: HomePageContent;
  officeDetails: OfficeDetails;
  counts: {
    attorneys: number;
    practiceAreas: number;
    contacts: number;
    appointments: number;
    testimonials: number;
  };
  attorneys: PageAttorney[];
  practiceAreas: PagePracticeArea[];
  testimonials: PageTestimonial[];
  contacts: Array<{
    id: number;
    name: string;
    email: string;
    phone: string | null;
    service: string;
    message: string;
    createdAt: Date;
  }>;
  appointments: Array<{
    id: number;
    name: string;
    email: string;
    phone: string;
    date: Date;
    time: string;
    practiceArea: string;
    description: string;
    attorneyName: string | null;
    createdAt: Date;
  }>;
  settings: Array<{
    key: string;
    value: unknown;
    updatedAt: Date;
  }>;
};

async function readSiteSetting<T>(key: string, fallback: T): Promise<T> {
  if (!isDatabaseConfigured()) {
    return fallback;
  }

  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key },
      select: { value: true },
    });

    return (setting?.value as T | undefined) ?? fallback;
  } catch {
    return fallback;
  }
}

export async function getHomePageContent(): Promise<HomePageContent> {
  return readSiteSetting("homePageContent", defaultHomePageContent);
}

export async function getOfficeDetails(): Promise<OfficeDetails> {
  return readSiteSetting("officeDetails", fallbackOfficeDetails);
}

export async function getTestimonialsForPage(): Promise<PageTestimonial[]> {
  if (!isDatabaseConfigured()) {
    return fallbackTestimonials;
  }

  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    if (testimonials.length === 0) {
      return fallbackTestimonials;
    }

    return testimonials.map((testimonial) => ({
      id: testimonial.id,
      sortOrder: testimonial.sortOrder,
      name: testimonial.name,
      title: testimonial.title,
      quote: testimonial.quote,
    }));
  } catch {
    return fallbackTestimonials;
  }
}

export async function getAttorneysForPage(): Promise<PageAttorney[]> {
  if (!isDatabaseConfigured()) {
    return fallbackAttorneys.map((attorney) => ({
      ...attorney,
      practiceAreas: [],
    }));
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

    return attorneys.map((attorney) => ({
      id: attorney.id,
      sortOrder: attorney.sortOrder,
      name: attorney.name,
      email: attorney.email,
      phone: attorney.phone,
      bio: attorney.bio,
      position: attorney.position ?? "",
      specialization: attorney.specialization ?? "",
      practiceAreas: attorney.practiceAreas.map((practiceArea) => ({
        id: practiceArea.id,
        name: practiceArea.name,
      })),
    }));
  } catch {
    return fallbackAttorneys.map((attorney) => ({
      ...attorney,
      practiceAreas: [],
    }));
  }
}

export async function getPracticeAreasForPage(): Promise<PagePracticeArea[]> {
  if (!isDatabaseConfigured()) {
    return fallbackPracticeAreas;
  }

  try {
    const practiceAreas = await prisma.practiceArea.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: {
        attorney: {
          select: {
            id: true,
            name: true,
          },
        },
        highlights: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    return practiceAreas.map((practiceArea) => ({
      id: practiceArea.id,
      sortOrder: practiceArea.sortOrder,
      name: practiceArea.name,
      description: practiceArea.description,
      highlights:
        practiceArea.highlights.length > 0
          ? practiceArea.highlights.map((highlight) => highlight.label)
          : fallbackPracticeAreas.find((item) => item.name === practiceArea.name)?.highlights ?? [],
      attorney: practiceArea.attorney,
    }));
  } catch {
    return fallbackPracticeAreas;
  }
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const attorneys = await getAttorneysForPage();
  const practiceAreas = await getPracticeAreasForPage();
  const testimonials = await getTestimonialsForPage();
  const homePageContent = await getHomePageContent();
  const officeDetails = await getOfficeDetails();
  const settings = [
    {
      key: "homePageContent",
      value: homePageContent,
      updatedAt: new Date(0),
    },
    {
      key: "officeDetails",
      value: officeDetails,
      updatedAt: new Date(0),
    },
  ];

  if (!isDatabaseConfigured()) {
    return {
      databaseConfigured: false,
      homePageContent,
      officeDetails,
      counts: {
        attorneys: attorneys.length,
        practiceAreas: practiceAreas.length,
        contacts: 0,
        appointments: 0,
        testimonials: testimonials.length,
      },
      attorneys,
      practiceAreas,
      testimonials,
      contacts: [],
      appointments: [],
      settings,
    };
  }

  try {
    const [
      contactCount,
      appointmentCount,
      storedSettings,
      contacts,
      appointments,
    ] = await Promise.all([
      prisma.contact.count(),
      prisma.appointment.count(),
      prisma.siteSetting.findMany({
        orderBy: { key: "asc" },
      }),
      prisma.contact.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      prisma.appointment.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: {
          attorney: {
            select: { name: true },
          },
        },
      }),
    ]);

    return {
      databaseConfigured: true,
      homePageContent,
      officeDetails,
      counts: {
        attorneys: attorneys.length,
        practiceAreas: practiceAreas.length,
        contacts: contactCount,
        appointments: appointmentCount,
        testimonials: testimonials.length,
      },
      attorneys,
      practiceAreas,
      testimonials,
      contacts: contacts.map((contact) => ({
        id: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        service: contact.service,
        message: contact.message,
        createdAt: contact.createdAt,
      })),
      appointments: appointments.map((appointment) => ({
        id: appointment.id,
        name: appointment.name,
        email: appointment.email,
        phone: appointment.phone,
        date: appointment.date,
        time: appointment.time,
        practiceArea: appointment.practiceArea,
        description: appointment.description,
        attorneyName: appointment.attorney?.name ?? null,
        createdAt: appointment.createdAt,
      })),
      settings: storedSettings.map((setting) => ({
        key: setting.key,
        value: setting.value,
        updatedAt: setting.updatedAt,
      })),
    };
  } catch {
    return {
      databaseConfigured: false,
      homePageContent,
      officeDetails,
      counts: {
        attorneys: attorneys.length,
        practiceAreas: practiceAreas.length,
        contacts: 0,
        appointments: 0,
        testimonials: testimonials.length,
      },
      attorneys,
      practiceAreas,
      testimonials,
      contacts: [],
      appointments: [],
      settings,
    };
  }
}
