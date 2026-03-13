export const contactStatusOptions = [
  { value: "new", label: "New" },
  { value: "reviewing", label: "Reviewing" },
  { value: "responded", label: "Responded" },
  { value: "closed", label: "Closed" },
] as const;

export const appointmentStatusOptions = [
  { value: "new", label: "New" },
  { value: "reviewing", label: "Reviewing" },
  { value: "scheduled", label: "Scheduled" },
  { value: "closed", label: "Closed" },
] as const;

export type ContactStatus = (typeof contactStatusOptions)[number]["value"];
export type AppointmentStatus =
  (typeof appointmentStatusOptions)[number]["value"];

const statusLabelMap = new Map<string, string>(
  [...contactStatusOptions, ...appointmentStatusOptions].map((option) => [
    option.value,
    option.label,
  ]),
);

export function getWorkflowStatusLabel(status: string) {
  return statusLabelMap.get(status) ?? status;
}

export function isOpenWorkflowStatus(status: string) {
  return status !== "closed";
}
