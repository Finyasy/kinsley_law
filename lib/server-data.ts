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

function findFallbackAttorneyRecord(identifier: { email: string; name: string }) {
  const normalizedEmail = identifier.email.trim().toLowerCase();
  const normalizedName = identifier.name.trim().toLowerCase();

  return fallbackAttorneys.find((attorney) => (
    attorney.email.trim().toLowerCase() === normalizedEmail ||
    attorney.name.trim().toLowerCase() === normalizedName
  ));
}

export type PageAttorney = (typeof fallbackAttorneys)[number] & {
  id?: number;
  sortOrder?: number;
  photoUrl?: string | null;
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

export type ContactSubmission = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  service: string;
  message: string;
  status: string;
  notificationStatus: string | null;
  notificationDetail: string | null;
  clientReplyStatus: string | null;
  clientReplyDetail: string | null;
  assignedTo: string | null;
  internalNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AppointmentSubmission = {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  practiceArea: string;
  description: string;
  status: string;
  notificationStatus: string | null;
  notificationDetail: string | null;
  clientReplyStatus: string | null;
  clientReplyDetail: string | null;
  assignedTo: string | null;
  internalNotes: string | null;
  attorneyName: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminAccountSummary = {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  activeSessionCount: number;
  lastSeenAt: Date | null;
};

export type AdminAuditEntry = {
  id: number;
  action: string;
  entityType: string;
  entityId: string | null;
  summary: string;
  metadata: unknown;
  createdAt: Date;
  actor: {
    id: number;
    name: string;
    email: string;
    role: string;
  } | null;
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
    adminUsers: number;
    activeAdminSessions: number;
  };
  attorneys: PageAttorney[];
  practiceAreas: PagePracticeArea[];
  testimonials: PageTestimonial[];
  contacts: ContactSubmission[];
  appointments: AppointmentSubmission[];
  adminUsers: AdminAccountSummary[];
  auditLogs: AdminAuditEntry[];
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

function normalizeAttorneyCopy(value: string) {
  return value
    .replace(/Strategic counsel with/gi, "Strategic attorneys with")
    .replace(/Strategic counsel/gi, "Strategic attorneys")
    .replace(/Trusted counsel/gi, "Trusted attorneys")
    .replace(/Cross-disciplinary counsel/gi, "Cross-disciplinary support from attorneys")
    .replace(/Practical counsel/gi, "Practical guidance from attorneys")
    .replace(/legal counsel/gi, "legal services led by attorneys")
    .replace(/\bcounsel\b/gi, "attorneys");
}

function normalizeHomePageContent(content: HomePageContent): HomePageContent {
  return {
    ...content,
    heroEyebrow: normalizeAttorneyCopy(content.heroEyebrow),
    heroDescription: normalizeAttorneyCopy(content.heroDescription),
    valueRotatorLabel: normalizeAttorneyCopy(content.valueRotatorLabel),
    valueRotatorPrefix: normalizeAttorneyCopy(content.valueRotatorPrefix),
    legacyParagraphs: content.legacyParagraphs.map(normalizeAttorneyCopy),
    achievements: content.achievements.map(normalizeAttorneyCopy),
    valueRotatorWords: content.valueRotatorWords.map(normalizeAttorneyCopy),
  };
}

export async function getHomePageContent(): Promise<HomePageContent> {
  const content = await readSiteSetting("homePageContent", defaultHomePageContent);
  return normalizeHomePageContent(content);
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
      photoUrl: attorney.photoUrl ?? null,
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

    return attorneys.map((attorney) => {
      const fallbackAttorney = findFallbackAttorneyRecord({
        email: attorney.email,
        name: attorney.name,
      });

      return {
        ...fallbackAttorney,
        id: attorney.id,
        sortOrder: attorney.sortOrder,
        name: attorney.name,
        email: attorney.email,
        phone: attorney.phone,
        bio: attorney.bio,
        position: attorney.position ?? fallbackAttorney?.position ?? "",
        specialization:
          attorney.specialization ?? fallbackAttorney?.specialization ?? "",
        photoUrl: attorney.photoUrl ?? fallbackAttorney?.photoUrl ?? null,
        practiceAreas: attorney.practiceAreas.map((practiceArea) => ({
          id: practiceArea.id,
          name: practiceArea.name,
        })),
      };
    });
  } catch {
    return fallbackAttorneys.map((attorney) => ({
      ...attorney,
      photoUrl: attorney.photoUrl ?? null,
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

export async function getAdminDashboardData(options?: {
  includeAdminManagement?: boolean;
}): Promise<AdminDashboardData> {
  const includeAdminManagement = options?.includeAdminManagement ?? false;
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
        adminUsers: 0,
        activeAdminSessions: 0,
      },
      attorneys,
      practiceAreas,
      testimonials,
      contacts: [],
      appointments: [],
      adminUsers: [],
      auditLogs: [],
      settings,
    };
  }

  try {
    const [
      contactCount,
      appointmentCount,
      adminUserCount,
      activeAdminSessionCount,
      storedSettings,
      contacts,
      appointments,
      adminUsers,
      auditLogs,
    ] = await Promise.all([
      prisma.contact.count(),
      prisma.appointment.count(),
      includeAdminManagement ? prisma.adminUser.count() : Promise.resolve(0),
      includeAdminManagement
        ? prisma.adminSession.count({
            where: {
              expiresAt: {
                gt: new Date(),
              },
            },
          })
        : Promise.resolve(0),
      prisma.siteSetting.findMany({
        orderBy: { key: "asc" },
      }),
      prisma.contact.findMany({
        orderBy: { createdAt: "desc" },
      }),
      prisma.appointment.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          attorney: {
            select: { name: true },
          },
        },
      }),
      includeAdminManagement
        ? prisma.adminUser.findMany({
            orderBy: [{ isActive: "desc" }, { name: "asc" }],
            include: {
              sessions: {
                where: {
                  expiresAt: {
                    gt: new Date(),
                  },
                },
                orderBy: {
                  lastSeenAt: "desc",
                },
              },
            },
          })
        : Promise.resolve([]),
      prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 18,
        include: {
          actorAdminUser: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
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
        adminUsers: adminUserCount,
        activeAdminSessions: activeAdminSessionCount,
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
        status: contact.status,
        notificationStatus: contact.notificationStatus,
        notificationDetail: contact.notificationDetail,
        clientReplyStatus: contact.clientReplyStatus,
        clientReplyDetail: contact.clientReplyDetail,
        assignedTo: contact.assignedTo,
        internalNotes: contact.internalNotes,
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt,
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
        status: appointment.status,
        notificationStatus: appointment.notificationStatus,
        notificationDetail: appointment.notificationDetail,
        clientReplyStatus: appointment.clientReplyStatus,
        clientReplyDetail: appointment.clientReplyDetail,
        assignedTo: appointment.assignedTo,
        internalNotes: appointment.internalNotes,
        attorneyName: appointment.attorney?.name ?? null,
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt,
      })),
      adminUsers: includeAdminManagement
        ? adminUsers.map((adminUser) => ({
            id: adminUser.id,
            name: adminUser.name,
            email: adminUser.email,
            role: adminUser.role,
            isActive: adminUser.isActive,
            createdAt: adminUser.createdAt,
            updatedAt: adminUser.updatedAt,
            activeSessionCount: adminUser.sessions.length,
            lastSeenAt: adminUser.sessions[0]?.lastSeenAt ?? null,
          }))
        : [],
      auditLogs: auditLogs.map((auditLog) => ({
        id: auditLog.id,
        action: auditLog.action,
        entityType: auditLog.entityType,
        entityId: auditLog.entityId,
        summary: auditLog.summary,
        metadata: auditLog.metadata,
        createdAt: auditLog.createdAt,
        actor: auditLog.actorAdminUser
          ? {
              id: auditLog.actorAdminUser.id,
              name: auditLog.actorAdminUser.name,
              email: auditLog.actorAdminUser.email,
              role: auditLog.actorAdminUser.role,
            }
          : null,
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
        adminUsers: 0,
        activeAdminSessions: 0,
      },
      attorneys,
      practiceAreas,
      testimonials,
      contacts: [],
      appointments: [],
      adminUsers: [],
      auditLogs: [],
      settings,
    };
  }
}
