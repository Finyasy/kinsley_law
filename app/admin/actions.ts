"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  isAdminSessionValid,
} from "@/lib/admin-auth";
import { type AdminActionState } from "@/lib/admin-editor-state";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/persistence";
import {
  type HomePageContent,
  type OfficeDetails,
} from "@/lib/site-defaults";

function readRequiredText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function readOptionalText(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value.length > 0 ? value : "";
}

function readInteger(value: string) {
  if (!value) {
    return null;
  }

  const parsedValue = Number.parseInt(value, 10);
  return Number.isNaN(parsedValue) ? null : parsedValue;
}

function parseLineList(value: string) {
  return value
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

async function resolveSortOrder(options: {
  id: number | null;
  providedSortOrder: number | null;
  providedSortOrderValue: string;
  entity: "attorney" | "practiceArea" | "testimonial";
}): Promise<number> {
  const { id, providedSortOrder, providedSortOrderValue, entity } = options;

  if (providedSortOrderValue) {
    return providedSortOrder ?? 0;
  }

  if (id) {
    if (entity === "attorney") {
      const existingRecord = await prisma.attorney.findUnique({
        where: { id },
        select: { sortOrder: true },
      });
      return existingRecord?.sortOrder ?? 0;
    }

    if (entity === "practiceArea") {
      const existingRecord = await prisma.practiceArea.findUnique({
        where: { id },
        select: { sortOrder: true },
      });
      return existingRecord?.sortOrder ?? 0;
    }

    const existingRecord = await prisma.testimonial.findUnique({
      where: { id },
      select: { sortOrder: true },
    });
    return existingRecord?.sortOrder ?? 0;
  }

  if (entity === "attorney") {
    return prisma.attorney.count();
  }

  if (entity === "practiceArea") {
    return prisma.practiceArea.count();
  }

  return prisma.testimonial.count();
}

async function validateAdminWriteAccess() {
  if (!isDatabaseConfigured()) {
    return "Database access is unavailable. Content editing is disabled.";
  }

  const cookieStore = await cookies();
  const isAuthenticated = isAdminSessionValid(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value,
  );

  if (!isAuthenticated) {
    return "Your admin session is no longer valid. Refresh and sign in again.";
  }

  return null;
}

function errorState(message: string): AdminActionState {
  return {
    status: "error",
    message,
  };
}

function successState(message: string): AdminActionState {
  return {
    status: "success",
    message,
  };
}

function revalidateAdminContent(paths: string[]) {
  for (const path of ["/admin", ...paths]) {
    revalidatePath(path);
  }
}

export async function updateOfficeDetailsAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const accessError = await validateAdminWriteAccess();

  if (accessError) {
    return errorState(accessError);
  }

  const officeDetails: OfficeDetails = {
    addressLine1: readRequiredText(formData, "addressLine1"),
    addressLine2: readRequiredText(formData, "addressLine2"),
    city: readRequiredText(formData, "city"),
    phone: readRequiredText(formData, "phone"),
    email: readRequiredText(formData, "email"),
    hoursWeekday: readRequiredText(formData, "hoursWeekday"),
    hoursWeekend: readRequiredText(formData, "hoursWeekend"),
  };

  if (Object.values(officeDetails).some((value) => value.length === 0)) {
    return errorState("Complete every office detail field before saving.");
  }

  await prisma.siteSetting.upsert({
    where: { key: "officeDetails" },
    update: { value: officeDetails },
    create: {
      key: "officeDetails",
      value: officeDetails,
    },
  });

  revalidateAdminContent(["/contact"]);
  return successState("Office details saved.");
}

export async function updateHomePageContentAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const accessError = await validateAdminWriteAccess();

  if (accessError) {
    return errorState(accessError);
  }

  const highlights = Array.from({ length: 4 }, (_, index) => ({
    value: readRequiredText(formData, `highlight-value-${index}`),
    label: readRequiredText(formData, `highlight-label-${index}`),
  }));

  const credibilityBand = Array.from({ length: 3 }, (_, index) => ({
    label: readRequiredText(formData, `credibility-label-${index}`),
    value: readRequiredText(formData, `credibility-value-${index}`),
  }));

  const legacyMetrics = Array.from({ length: 4 }, (_, index) => ({
    value: readRequiredText(formData, `metric-value-${index}`),
    text: readRequiredText(formData, `metric-text-${index}`),
  }));

  if (
    highlights.some((item) => !item.value || !item.label) ||
    credibilityBand.some((item) => !item.label || !item.value) ||
    legacyMetrics.some((item) => !item.value || !item.text)
  ) {
    return errorState("Complete every homepage metric and credibility field before saving.");
  }

  const valueRotatorWords = parseLineList(readRequiredText(formData, "valueRotatorWords"));
  const legacyParagraphs = parseLineList(readRequiredText(formData, "legacyParagraphs"));
  const achievements = parseLineList(readRequiredText(formData, "achievements"));

  if (valueRotatorWords.length < 2) {
    return errorState("Add at least two rotating value words for the homepage hero.");
  }

  if (legacyParagraphs.length === 0 || achievements.length === 0) {
    return errorState("Legacy paragraphs and achievements must each contain at least one entry.");
  }

  const homePageContent: HomePageContent = {
    heroEyebrow: readRequiredText(formData, "heroEyebrow"),
    heroDescription: readRequiredText(formData, "heroDescription"),
    portraitEyebrow: readRequiredText(formData, "portraitEyebrow"),
    portraitText: readRequiredText(formData, "portraitText"),
    valueRotatorLabel: readRequiredText(formData, "valueRotatorLabel"),
    valueRotatorPrefix: readRequiredText(formData, "valueRotatorPrefix"),
    valueRotatorWords,
    highlights,
    credibilityBand,
    legacySectionEyebrow: readRequiredText(formData, "legacySectionEyebrow"),
    legacySectionTitle: readRequiredText(formData, "legacySectionTitle"),
    legacyParagraphs,
    achievements,
    legacyMetrics,
    servicesEyebrow: readRequiredText(formData, "servicesEyebrow"),
    servicesTitle: readRequiredText(formData, "servicesTitle"),
    teamEyebrow: readRequiredText(formData, "teamEyebrow"),
    teamTitle: readRequiredText(formData, "teamTitle"),
    testimonialsEyebrow: readRequiredText(formData, "testimonialsEyebrow"),
    testimonialsTitle: readRequiredText(formData, "testimonialsTitle"),
    ctaEyebrow: readRequiredText(formData, "ctaEyebrow"),
    ctaTitle: readRequiredText(formData, "ctaTitle"),
  };

  if (
    Object.values(homePageContent).some((value) =>
      typeof value === "string" ? value.length === 0 : false,
    )
  ) {
    return errorState("Complete every homepage copy field before saving.");
  }

  await prisma.siteSetting.upsert({
    where: { key: "homePageContent" },
    update: { value: homePageContent },
    create: {
      key: "homePageContent",
      value: homePageContent,
    },
  });

  revalidateAdminContent(["/"]);
  return successState("Homepage content saved.");
}

export async function savePracticeAreaAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const accessError = await validateAdminWriteAccess();

  if (accessError) {
    return errorState(accessError);
  }

  const idValue = readOptionalText(formData, "id");
  const attorneyIdValue = readOptionalText(formData, "attorneyId");
  const sortOrderValue = readOptionalText(formData, "sortOrder");
  const sortHighlights = parseLineList(readRequiredText(formData, "highlights"));
  const id = readInteger(idValue);
  const attorneyId = readInteger(attorneyIdValue);
  const sortOrder = readInteger(sortOrderValue);
  const name = readRequiredText(formData, "name");
  const description = readRequiredText(formData, "description");

  if (!name || !description || sortHighlights.length === 0) {
    return errorState("Practice area name, description, and highlights are required.");
  }

  if (idValue && id === null) {
    return errorState("Practice area ID is invalid.");
  }

  if (attorneyIdValue && attorneyId === null) {
    return errorState("Lead attorney selection is invalid.");
  }

  if (sortOrderValue && sortOrder === null) {
    return errorState("Practice area display order is invalid.");
  }

  const resolvedSortOrder = await resolveSortOrder({
    id,
    providedSortOrder: sortOrder,
    providedSortOrderValue: sortOrderValue,
    entity: "practiceArea",
  });

  try {
    await prisma.$transaction(async (transaction) => {
      const practiceArea = id
        ? await transaction.practiceArea.update({
            where: { id },
            data: {
              name,
              description,
              attorneyId,
              sortOrder: resolvedSortOrder,
            },
          })
        : await transaction.practiceArea.create({
            data: {
              name,
              description,
              attorneyId,
              sortOrder: resolvedSortOrder,
            },
          });

      await transaction.practiceAreaHighlight.deleteMany({
        where: { practiceAreaId: practiceArea.id },
      });

      await transaction.practiceAreaHighlight.createMany({
        data: sortHighlights.map((label, index) => ({
          practiceAreaId: practiceArea.id,
          label,
          sortOrder: index,
        })),
      });
    });
  } catch (error) {
    return errorState(
      error instanceof Error
        ? error.message
        : "Unable to save the practice area.",
    );
  }

  revalidateAdminContent(["/", "/about", "/contact", "/services"]);
  return successState(id ? "Practice area updated." : "Practice area created.");
}

export async function saveAttorneyAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const accessError = await validateAdminWriteAccess();

  if (accessError) {
    return errorState(accessError);
  }

  const idValue = readOptionalText(formData, "id");
  const id = readInteger(idValue);
  const sortOrderValue = readOptionalText(formData, "sortOrder");
  const sortOrder = readInteger(sortOrderValue);
  const name = readRequiredText(formData, "name");
  const email = readRequiredText(formData, "email").toLowerCase();
  const phone = readRequiredText(formData, "phone");
  const position = readRequiredText(formData, "position");
  const specialization = readRequiredText(formData, "specialization");
  const photoUrl = readOptionalText(formData, "photoUrl");
  const bio = readRequiredText(formData, "bio");

  if (!name || !email || !phone || !position || !specialization || !bio) {
    return errorState("Complete every attorney field before saving.");
  }

  if (idValue && id === null) {
    return errorState("Attorney ID is invalid.");
  }

  if (sortOrderValue && sortOrder === null) {
    return errorState("Attorney display order is invalid.");
  }

  const resolvedSortOrder = await resolveSortOrder({
    id,
    providedSortOrder: sortOrder,
    providedSortOrderValue: sortOrderValue,
    entity: "attorney",
  });

  try {
    if (id) {
      await prisma.attorney.update({
        where: { id },
        data: {
          name,
          email,
          phone,
          position,
          specialization,
          photoUrl: photoUrl || null,
          bio,
          sortOrder: resolvedSortOrder,
        },
      });
    } else {
      await prisma.attorney.create({
        data: {
          name,
          email,
          phone,
          position,
          specialization,
          photoUrl: photoUrl || null,
          bio,
          sortOrder: resolvedSortOrder,
        },
      });
    }
  } catch (error) {
    return errorState(
      error instanceof Error
        ? error.message
        : "Unable to save the attorney.",
    );
  }

  revalidateAdminContent(["/", "/about", "/services"]);
  return successState(id ? "Attorney updated." : "Attorney created.");
}

export async function deleteAttorneyAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const accessError = await validateAdminWriteAccess();

  if (accessError) {
    return errorState(accessError);
  }

  const id = readInteger(readRequiredText(formData, "id"));

  if (id === null) {
    return errorState("Attorney ID is invalid.");
  }

  await prisma.attorney.delete({
    where: { id },
  });

  revalidateAdminContent(["/", "/about", "/services", "/contact"]);
  return successState("Attorney deleted and related assignments were cleared.");
}

export async function saveTestimonialAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const accessError = await validateAdminWriteAccess();

  if (accessError) {
    return errorState(accessError);
  }

  const idValue = readOptionalText(formData, "id");
  const sortOrderValue = readOptionalText(formData, "sortOrder");
  const id = readInteger(idValue);
  const sortOrder = readInteger(sortOrderValue);
  const name = readRequiredText(formData, "name");
  const title = readRequiredText(formData, "title");
  const quote = readRequiredText(formData, "quote");

  if (!name || !title || !quote) {
    return errorState("Name, title, and quote are required.");
  }

  if (idValue && id === null) {
    return errorState("Testimonial ID is invalid.");
  }

  if (sortOrderValue && sortOrder === null) {
    return errorState("Testimonial ordering is invalid.");
  }

  const resolvedSortOrder = await resolveSortOrder({
    id,
    providedSortOrder: sortOrder,
    providedSortOrderValue: sortOrderValue,
    entity: "testimonial",
  });

  if (id) {
    await prisma.testimonial.update({
      where: { id },
      data: {
        name,
        title,
        quote,
        sortOrder: resolvedSortOrder,
      },
    });
  } else {
    await prisma.testimonial.create({
      data: {
        name,
        title,
        quote,
        sortOrder: resolvedSortOrder,
      },
    });
  }

  revalidateAdminContent(["/"]);
  return successState(id ? "Testimonial updated." : "Testimonial added.");
}

export async function deleteTestimonialAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const accessError = await validateAdminWriteAccess();

  if (accessError) {
    return errorState(accessError);
  }

  const id = readInteger(readRequiredText(formData, "id"));

  if (id === null) {
    return errorState("Testimonial ID is invalid.");
  }

  await prisma.testimonial.delete({
    where: { id },
  });

  revalidateAdminContent(["/"]);
  return successState("Testimonial deleted.");
}
