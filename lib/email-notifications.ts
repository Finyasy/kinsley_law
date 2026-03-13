import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import nodemailer from "nodemailer";

type NotificationSection = {
  label: string;
  value: string;
};

type InternalNotificationInput = {
  subject: string;
  previewSlug: string;
  replyTo?: string;
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
const fromName = process.env.SMTP_FROM_NAME?.trim() || "Kinsley Law Advocates";
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
    Boolean(fromEmail) &&
    recipients.length > 0;

  const hasPreviewMode =
    Boolean(previewDirectory) &&
    Boolean(fromEmail) &&
    recipients.length > 0;

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

function buildPlainTextBody(sections: NotificationSection[]) {
  return sections.map((section) => `${section.label}\n${section.value}`).join("\n\n");
}

function buildHtmlBody(sections: NotificationSection[]) {
  return [
    "<div style=\"font-family: Avenir Next, Segoe UI, Arial, sans-serif; color: #0b1727; line-height: 1.6;\">",
    ...sections.map(
      (section) =>
        `<div style="margin-bottom: 16px;"><div style="font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; color: #7a2022; font-weight: 700;">${escapeHtml(section.label)}</div><div style="margin-top: 6px; white-space: pre-wrap;">${escapeHtml(section.value)}</div></div>`,
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

async function writePreviewFile(input: InternalNotificationInput, config: NotificationConfig) {
  const previewRoot = path.resolve(config.previewDir);
  await mkdir(previewRoot, { recursive: true });

  const safeSlug = input.previewSlug.replace(/[^a-z0-9-]+/gi, "-").toLowerCase();
  const filename = `${new Date().toISOString().replaceAll(":", "-")}-${safeSlug}.json`;
  const outputPath = path.join(previewRoot, filename);

  await writeFile(
    outputPath,
    JSON.stringify(
      {
        to: config.recipients,
        from: `${config.fromName} <${config.fromEmail}>`,
        replyTo: input.replyTo ?? null,
        subject: input.subject,
        text: buildPlainTextBody(input.sections),
        html: buildHtmlBody(input.sections),
      },
      null,
      2,
    ),
  );

  return outputPath;
}

async function deliverInternalNotification(
  input: InternalNotificationInput,
): Promise<NotificationDeliveryResult> {
  const config = getNotificationConfig();

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
      to: config.recipients,
      from: `${config.fromName} <${config.fromEmail}>`,
      replyTo: input.replyTo,
      subject: input.subject,
      text: buildPlainTextBody(input.sections),
      html: buildHtmlBody(input.sections),
    });

    return {
      status: "sent",
      detail: `Delivered to ${config.recipients.join(", ")}.`,
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
  return deliverInternalNotification({
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
  return deliverInternalNotification({
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
