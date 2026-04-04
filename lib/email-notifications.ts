import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import nodemailer from "nodemailer";
import {
  FIRM_CONTACT_EMAIL,
  FIRM_CONTACT_PHONE,
} from "@/lib/firm-contact";

type NotificationSection = {
  label: string;
  value: string;
};

type NotificationEmailInput = {
  to: string[];
  subject: string;
  previewSlug: string;
  replyTo?: string;
  intro?: string[];
  closing?: string[];
  sections: NotificationSection[];
};

export type NotificationDeliveryStatus =
  | "disabled"
  | "preview"
  | "sent"
  | "failed";

export type NotificationDeliveryResult = {
  status: NotificationDeliveryStatus;
  detail: string;
};

type NotificationMode = "disabled" | "preview" | "smtp";

type NotificationConfig = {
  mode: NotificationMode;
  recipients: string[];
  fromEmail: string;
  fromName: string;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPass: string;
  previewDir: string;
};

const previewDirectory = process.env.EMAIL_PREVIEW_DIR?.trim() ?? "";
const recipients = (process.env.NOTIFICATION_TO_EMAILS ?? "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const fromEmail = process.env.SMTP_FROM_EMAIL?.trim() ?? "";
const fromName = process.env.SMTP_FROM_NAME?.trim() || "Kinsley Advocates";
const smtpHost = process.env.SMTP_HOST?.trim() ?? "";
const smtpPort = Number.parseInt(process.env.SMTP_PORT?.trim() ?? "587", 10);
const smtpSecure = (process.env.SMTP_SECURE?.trim() ?? "false").toLowerCase() === "true";
const smtpUser = process.env.SMTP_USER?.trim() ?? "";
const smtpPass = process.env.SMTP_PASS?.trim() ?? "";

let transporterPromise:
  | ReturnType<typeof nodemailer.createTransport>
  | null = null;

function getNotificationConfig(): NotificationConfig {
  const hasSmtpCredentials =
    Boolean(smtpHost) &&
    Number.isFinite(smtpPort) &&
    Boolean(smtpUser) &&
    Boolean(smtpPass) &&
    Boolean(fromEmail);

  const hasPreviewMode = Boolean(previewDirectory) && Boolean(fromEmail);

  return {
    mode: hasSmtpCredentials ? "smtp" : hasPreviewMode ? "preview" : "disabled",
    recipients,
    fromEmail,
    fromName,
    smtpHost,
    smtpPort,
    smtpSecure,
    smtpUser,
    smtpPass,
    previewDir: previewDirectory,
  };
}

export function getNotificationStatusLabel() {
  const config = getNotificationConfig();

  if (config.mode === "smtp") {
    return "SMTP configured";
  }

  if (config.mode === "preview") {
    return "Preview mode";
  }

  return "Disabled";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildPlainTextBody(input: NotificationEmailInput) {
  return [
    ...(input.intro ?? []),
    ...(input.intro?.length ? [""] : []),
    ...input.sections.map((section) => `${section.label}\n${section.value}`),
    ...(input.closing?.length ? [""] : []),
    ...(input.closing ?? []),
  ].join("\n\n");
}

function buildHtmlBody(input: NotificationEmailInput) {
  return [
    "<div style=\"font-family: Avenir Next, Segoe UI, Arial, sans-serif; color: #0b1727; line-height: 1.6;\">",
    ...(input.intro ?? []).map(
      (paragraph) =>
        `<p style="margin: 0 0 16px;">${escapeHtml(paragraph)}</p>`,
    ),
    ...input.sections.map(
      (section) =>
        `<div style="margin-bottom: 16px;"><div style="font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; color: #7a2022; font-weight: 700;">${escapeHtml(section.label)}</div><div style="margin-top: 6px; white-space: pre-wrap;">${escapeHtml(section.value)}</div></div>`,
    ),
    ...(input.closing ?? []).map(
      (paragraph) =>
        `<p style="margin: 0 0 16px;">${escapeHtml(paragraph)}</p>`,
    ),
    "</div>",
  ].join("");
}

function getTransporter() {
  if (!transporterPromise) {
    const config = getNotificationConfig();

    transporterPromise = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpSecure,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
    });
  }

  return transporterPromise;
}

async function writePreviewFile(input: NotificationEmailInput, config: NotificationConfig) {
  const previewRoot = path.resolve(config.previewDir);
  await mkdir(previewRoot, { recursive: true });

  const safeSlug = input.previewSlug.replace(/[^a-z0-9-]+/gi, "-").toLowerCase();
  const filename = `${new Date().toISOString().replaceAll(":", "-")}-${safeSlug}.json`;
  const outputPath = path.join(previewRoot, filename);

  await writeFile(
    outputPath,
    JSON.stringify(
      {
        to: input.to,
        from: `${config.fromName} <${config.fromEmail}>`,
        replyTo: input.replyTo ?? null,
        subject: input.subject,
        text: buildPlainTextBody(input),
        html: buildHtmlBody(input),
      },
      null,
      2,
    ),
  );

  return outputPath;
}

async function deliverNotification(
  input: NotificationEmailInput,
): Promise<NotificationDeliveryResult> {
  const config = getNotificationConfig();

  if (input.to.length === 0) {
    return {
      status: "disabled",
      detail: "No notification recipient is configured.",
    };
  }

  if (config.mode === "disabled") {
    return {
      status: "disabled",
      detail: "Email notifications are not configured.",
    };
  }

  if (config.mode === "preview") {
    const outputPath = await writePreviewFile(input, config);

    return {
      status: "preview",
      detail: `Notification preview written to ${outputPath}.`,
    };
  }

  try {
    const transporter = getTransporter();

    await transporter.sendMail({
      to: input.to,
      from: `${config.fromName} <${config.fromEmail}>`,
      replyTo: input.replyTo,
      subject: input.subject,
      text: buildPlainTextBody(input),
      html: buildHtmlBody(input),
    });

    return {
      status: "sent",
      detail: `Delivered to ${input.to.join(", ")}.`,
    };
  } catch (error) {
    const detail =
      error instanceof Error ? error.message : "Unknown email delivery failure.";

    console.error("Email notification delivery failed:", detail);

    return {
      status: "failed",
      detail,
    };
  }
}

export async function sendContactNotification(input: {
  name: string;
  email: string;
  phone: string | null;
  service: string;
  message: string;
}) {
  return deliverNotification({
    to: recipients,
    subject: `[Kinsley Law] New contact enquiry: ${input.service}`,
    previewSlug: `contact-${input.service}-${input.name}`,
    replyTo: input.email,
    sections: [
      { label: "Submission type", value: "General contact enquiry" },
      { label: "Client name", value: input.name },
      { label: "Email", value: input.email },
      { label: "Phone", value: input.phone || "Not provided" },
      { label: "Service", value: input.service },
      { label: "Message", value: input.message },
    ],
  });
}

export async function sendContactAutoReply(input: {
  name: string;
  email: string;
  service: string;
}) {
  return deliverNotification({
    to: [input.email],
    subject: "Kinsley Advocates received your enquiry",
    previewSlug: `contact-autoreply-${input.service}-${input.name}`,
    intro: [
      `Dear ${input.name},`,
      "Thank you for contacting Kinsley Advocates. Your enquiry has been received and the firm will review and route it shortly.",
    ],
    sections: [
      { label: "Matter category", value: input.service },
      {
        label: "What happens next",
        value:
          "The firm will review the details you shared, route the matter internally, and contact you using the email address or phone number you provided.",
      },
      {
        label: "Urgent matters",
        value:
          `If your issue is time-sensitive, please reply to this email, write to ${FIRM_CONTACT_EMAIL}, or call ${FIRM_CONTACT_PHONE} so we can prioritize the matter.`,
      },
    ],
    closing: [
      "Regards,",
      "Kinsley Advocates",
    ],
  });
}

export async function sendAppointmentNotification(input: {
  name: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  practiceArea: string;
  description: string;
  attorneyName: string | null;
}) {
  return deliverNotification({
    to: recipients,
    subject: `[Kinsley Law] New consultation request: ${input.practiceArea}`,
    previewSlug: `appointment-${input.practiceArea}-${input.name}`,
    replyTo: input.email,
    sections: [
      { label: "Submission type", value: "Consultation request" },
      { label: "Client name", value: input.name },
      { label: "Email", value: input.email },
      { label: "Phone", value: input.phone },
      {
        label: "Preferred consultation window",
        value: `${input.date.toLocaleDateString("en-US")} at ${input.time}`,
      },
      { label: "Practice area", value: input.practiceArea },
      { label: "Assigned attorney", value: input.attorneyName ?? "Unassigned" },
      { label: "Matter summary", value: input.description },
    ],
  });
}

export async function sendAppointmentAutoReply(input: {
  name: string;
  email: string;
  date: Date;
  time: string;
  practiceArea: string;
}) {
  return deliverNotification({
    to: [input.email],
    subject: "Kinsley Advocates received your consultation request",
    previewSlug: `appointment-autoreply-${input.practiceArea}-${input.name}`,
    intro: [
      `Dear ${input.name},`,
      "Thank you for requesting a consultation with Kinsley Advocates. We have received your preferred appointment window and the firm will review and route the request before confirming the next step.",
    ],
    sections: [
      { label: "Practice area", value: input.practiceArea },
      {
        label: "Requested consultation window",
        value: `${input.date.toLocaleDateString("en-GB", { dateStyle: "medium" })} at ${input.time}`,
      },
      {
        label: "What happens next",
        value:
          "The firm will review the request, route it internally, and respond with confirmation or an alternative time if your preferred slot is unavailable.",
      },
      {
        label: "Firm contact",
        value: `${FIRM_CONTACT_EMAIL} | ${FIRM_CONTACT_PHONE}`,
      },
    ],
    closing: [
      "Regards,",
      "Kinsley Advocates",
    ],
  });
}
