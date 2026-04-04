"use client";

import {
  useActionState,
  useDeferredValue,
  useMemo,
  useState,
} from "react";
import {
  updateAppointmentWorkflowAction,
  updateContactWorkflowAction,
} from "@/app/admin/actions";
import {
  initialAdminActionState,
  type AdminActionState,
} from "@/lib/admin-editor-state";
import {
  appointmentStatusOptions,
  contactStatusOptions,
  getWorkflowStatusLabel,
  isOpenWorkflowStatus,
} from "@/lib/intake-workflow";
import type {
  AppointmentSubmission,
  ContactSubmission,
} from "@/lib/server-data";

type IntakeWorkspaceProps = {
  contacts: ContactSubmission[];
  appointments: AppointmentSubmission[];
  currentAdminName: string;
  currentAdminEmail: string;
};

type QueueFilter = "all" | "messages" | "consultations";
type AssignmentFilter = "all" | "mine" | "unassigned" | "assigned";
type StatusFilter =
  | "all"
  | "open"
  | "closed"
  | (typeof contactStatusOptions)[number]["value"]
  | (typeof appointmentStatusOptions)[number]["value"];

const queueOptions: Array<{ value: QueueFilter; label: string }> = [
  { value: "all", label: "All queues" },
  { value: "messages", label: "Messages only" },
  { value: "consultations", label: "Consultations only" },
];

const assignmentOptions: Array<{ value: AssignmentFilter; label: string }> = [
  { value: "all", label: "All assignments" },
  { value: "mine", label: "Assigned to me" },
  { value: "unassigned", label: "Unassigned" },
  { value: "assigned", label: "Assigned items" },
];

const statusOptions: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "All statuses" },
  { value: "open", label: "Open work" },
  { value: "closed", label: "Closed" },
  ...contactStatusOptions,
  ...appointmentStatusOptions.filter(
    (option) => !contactStatusOptions.some((item) => item.value === option.value),
  ),
];

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function normalizeText(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function matchesCurrentAdmin(
  assignedTo: string | null | undefined,
  currentAdminName: string,
  currentAdminEmail: string,
) {
  const normalizedAssigned = normalizeText(assignedTo);

  if (!normalizedAssigned) {
    return false;
  }

  const nameTokens = normalizeText(currentAdminName)
    .split(/\s+/)
    .filter(Boolean);
  const emailTokens = normalizeText(currentAdminEmail)
    .split(/[@._-]+/)
    .filter(Boolean);

  return [...nameTokens, ...emailTokens].some(
    (token) => token.length > 2 && normalizedAssigned.includes(token),
  );
}

function matchesStatusFilter(status: string, statusFilter: StatusFilter) {
  if (statusFilter === "all") {
    return true;
  }

  if (statusFilter === "open") {
    return isOpenWorkflowStatus(status);
  }

  if (statusFilter === "closed") {
    return status === "closed";
  }

  return status === statusFilter;
}

function matchesAssignmentFilter(
  assignedTo: string | null | undefined,
  assignmentFilter: AssignmentFilter,
  currentAdminName: string,
  currentAdminEmail: string,
) {
  if (assignmentFilter === "all") {
    return true;
  }

  if (assignmentFilter === "mine") {
    return matchesCurrentAdmin(assignedTo, currentAdminName, currentAdminEmail);
  }

  if (assignmentFilter === "unassigned") {
    return !normalizeText(assignedTo);
  }

  return Boolean(normalizeText(assignedTo));
}

function matchesSearch(
  fields: Array<string | null | undefined>,
  searchQuery: string,
) {
  if (!searchQuery) {
    return true;
  }

  return fields.some((field) => normalizeText(field).includes(searchQuery));
}

function FormMessage({ state }: { state: AdminActionState }) {
  if (state.status === "idle" || !state.message) {
    return null;
  }

  return (
    <div className={state.status === "success" ? "form-status" : "form-error"}>
      {state.message}
    </div>
  );
}

function FormSubmitButton({
  idleLabel,
  pendingLabel,
  isPending,
}: {
  idleLabel: string;
  pendingLabel: string;
  isPending: boolean;
}) {
  return (
    <button type="submit" className="button-primary" disabled={isPending}>
      {isPending ? pendingLabel : idleLabel}
    </button>
  );
}

function getDeliveryLabel(status: string | null) {
  switch (status) {
    case "sent":
      return "Sent";
    case "failed":
      return "Failed";
    case "preview":
      return "Preview";
    case "disabled":
      return "Disabled";
    default:
      return "Pending";
  }
}

function DeliveryStatusBlock({
  title,
  status,
  detail,
}: {
  title: string;
  status: string | null;
  detail: string | null;
}) {
  return (
    <div className="admin-delivery-card" data-status={status ?? "pending"}>
      <span>{title}</span>
      <strong>{getDeliveryLabel(status)}</strong>
      <p>{detail ?? "No delivery attempt has been recorded yet."}</p>
    </div>
  );
}

function ContactWorkflowCard({ contact }: { contact: ContactSubmission }) {
  const [state, formAction, isPending] = useActionState(
    updateContactWorkflowAction,
    initialAdminActionState,
  );

  return (
    <article className="admin-intake-card">
      <div className="admin-intake-card-header">
        <div>
          <p className="eyebrow">Message</p>
          <h3>{contact.name}</h3>
        </div>
        <span className="admin-intake-status" data-status={contact.status}>
          {getWorkflowStatusLabel(contact.status)}
        </span>
      </div>

      <div className="admin-intake-meta">
        <div>
          <span>Service</span>
          <strong>{contact.service}</strong>
        </div>
        <div>
          <span>Submitted</span>
          <strong>{formatDate(contact.createdAt)}</strong>
        </div>
        <div>
          <span>Last update</span>
          <strong>{formatDate(contact.updatedAt)}</strong>
        </div>
        <div>
          <span>Assignment</span>
          <strong>{contact.assignedTo ?? "Unassigned"}</strong>
        </div>
      </div>

      <div className="admin-intake-message">
        <p>{contact.message}</p>
      </div>

      <div className="admin-intake-contact-row">
        <a href={`mailto:${contact.email}`} className="button-secondary">
          Email client
        </a>
        {contact.phone ? (
          <a href={`tel:${contact.phone}`} className="button-secondary">
            Call client
          </a>
        ) : null}
      </div>

      <div className="admin-intake-contact-list">
        <div>
          <span>Email</span>
          <strong>{contact.email}</strong>
        </div>
        {contact.phone ? (
          <div>
            <span>Phone</span>
            <strong>{contact.phone}</strong>
          </div>
        ) : null}
      </div>

      <div className="admin-delivery-grid">
        <DeliveryStatusBlock
          title="Internal alert"
          status={contact.notificationStatus}
          detail={contact.notificationDetail}
        />
        <DeliveryStatusBlock
          title="Client auto-reply"
          status={contact.clientReplyStatus}
          detail={contact.clientReplyDetail}
        />
      </div>

      <form action={formAction} className="admin-intake-form">
        <input type="hidden" name="id" value={contact.id} />
        <FormMessage state={state} />
        <div className="admin-editor-fields">
          <div className="field">
            <label htmlFor={`contact-status-${contact.id}`}>Status</label>
            <select
              id={`contact-status-${contact.id}`}
              name="status"
              defaultValue={contact.status}
            >
              {contactStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor={`contact-assigned-${contact.id}`}>Assigned to</label>
            <input
              id={`contact-assigned-${contact.id}`}
              name="assignedTo"
              defaultValue={contact.assignedTo ?? ""}
              placeholder="Lead partner or intake owner"
            />
          </div>
          <div className="field full">
            <label htmlFor={`contact-notes-${contact.id}`}>Internal notes</label>
            <textarea
              id={`contact-notes-${contact.id}`}
              name="internalNotes"
              rows={4}
              defaultValue={contact.internalNotes ?? ""}
              placeholder="Capture urgency, follow-up tasks, and what has already been sent."
            />
          </div>
        </div>
        <div className="button-row">
          <FormSubmitButton
            idleLabel="Save Message Workflow"
            pendingLabel="Saving..."
            isPending={isPending}
          />
        </div>
      </form>
    </article>
  );
}

function AppointmentWorkflowCard({
  appointment,
}: {
  appointment: AppointmentSubmission;
}) {
  const [state, formAction, isPending] = useActionState(
    updateAppointmentWorkflowAction,
    initialAdminActionState,
  );

  return (
    <article className="admin-intake-card">
      <div className="admin-intake-card-header">
        <div>
          <p className="eyebrow">Consultation</p>
          <h3>{appointment.name}</h3>
        </div>
        <span className="admin-intake-status" data-status={appointment.status}>
          {getWorkflowStatusLabel(appointment.status)}
        </span>
      </div>

      <div className="admin-intake-meta">
        <div>
          <span>Practice area</span>
          <strong>{appointment.practiceArea}</strong>
        </div>
        <div>
          <span>Preferred slot</span>
          <strong>
            {new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(
              new Date(appointment.date),
            )}{" "}
            at {appointment.time}
          </strong>
        </div>
        <div>
          <span>Lead attorney</span>
          <strong>{appointment.attorneyName ?? "Unassigned"}</strong>
        </div>
        <div>
          <span>Assignment</span>
          <strong>{appointment.assignedTo ?? "Unassigned"}</strong>
        </div>
      </div>

      <div className="admin-intake-message">
        <p>{appointment.description}</p>
      </div>

      <div className="admin-intake-contact-row">
        <a href={`mailto:${appointment.email}`} className="button-secondary">
          Email client
        </a>
        <a href={`tel:${appointment.phone}`} className="button-secondary">
          Call client
        </a>
      </div>

      <div className="admin-intake-contact-list">
        <div>
          <span>Email</span>
          <strong>{appointment.email}</strong>
        </div>
        <div>
          <span>Phone</span>
          <strong>{appointment.phone}</strong>
        </div>
        <div>
          <span>Submitted</span>
          <strong>{formatDate(appointment.createdAt)}</strong>
        </div>
        <div>
          <span>Last update</span>
          <strong>{formatDate(appointment.updatedAt)}</strong>
        </div>
      </div>

      <div className="admin-delivery-grid">
        <DeliveryStatusBlock
          title="Internal alert"
          status={appointment.notificationStatus}
          detail={appointment.notificationDetail}
        />
        <DeliveryStatusBlock
          title="Client auto-reply"
          status={appointment.clientReplyStatus}
          detail={appointment.clientReplyDetail}
        />
      </div>

      <form action={formAction} className="admin-intake-form">
        <input type="hidden" name="id" value={appointment.id} />
        <FormMessage state={state} />
        <div className="admin-editor-fields">
          <div className="field">
            <label htmlFor={`appointment-status-${appointment.id}`}>Status</label>
            <select
              id={`appointment-status-${appointment.id}`}
              name="status"
              defaultValue={appointment.status}
            >
              {appointmentStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor={`appointment-assigned-${appointment.id}`}>
              Assigned to
            </label>
            <input
              id={`appointment-assigned-${appointment.id}`}
              name="assignedTo"
              defaultValue={appointment.assignedTo ?? appointment.attorneyName ?? ""}
              placeholder="Attorney or operations owner"
            />
          </div>
          <div className="field full">
            <label htmlFor={`appointment-notes-${appointment.id}`}>
              Internal notes
            </label>
            <textarea
              id={`appointment-notes-${appointment.id}`}
              name="internalNotes"
              rows={4}
              defaultValue={appointment.internalNotes ?? ""}
              placeholder="Record the proposed slot, conflicts, and next follow-up."
            />
          </div>
        </div>
        <div className="button-row">
          <FormSubmitButton
            idleLabel="Save Consultation Workflow"
            pendingLabel="Saving..."
            isPending={isPending}
          />
        </div>
      </form>
    </article>
  );
}

export function IntakeWorkspace({
  contacts,
  appointments,
  currentAdminName,
  currentAdminEmail,
}: IntakeWorkspaceProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [queueFilter, setQueueFilter] = useState<QueueFilter>("all");
  const [assignmentFilter, setAssignmentFilter] =
    useState<AssignmentFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("open");
  const deferredSearchQuery = useDeferredValue(normalizeText(searchQuery));

  const visibleContacts = useMemo(() => {
    return contacts
      .filter((contact) => {
        return (
          matchesStatusFilter(contact.status, statusFilter) &&
          matchesAssignmentFilter(
            contact.assignedTo,
            assignmentFilter,
            currentAdminName,
            currentAdminEmail,
          ) &&
          matchesSearch(
            [
              contact.name,
              contact.email,
              contact.phone,
              contact.service,
              contact.message,
              contact.assignedTo,
              contact.internalNotes,
            ],
            deferredSearchQuery,
          )
        );
      })
      .sort((left, right) => {
        const openDelta =
          Number(isOpenWorkflowStatus(right.status)) -
          Number(isOpenWorkflowStatus(left.status));

        if (openDelta !== 0) {
          return openDelta;
        }

        return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
      });
  }, [
    assignmentFilter,
    contacts,
    currentAdminEmail,
    currentAdminName,
    deferredSearchQuery,
    statusFilter,
  ]);

  const visibleAppointments = useMemo(() => {
    return appointments
      .filter((appointment) => {
        return (
          matchesStatusFilter(appointment.status, statusFilter) &&
          matchesAssignmentFilter(
            appointment.assignedTo,
            assignmentFilter,
            currentAdminName,
            currentAdminEmail,
          ) &&
          matchesSearch(
            [
              appointment.name,
              appointment.email,
              appointment.phone,
              appointment.practiceArea,
              appointment.description,
              appointment.attorneyName,
              appointment.assignedTo,
              appointment.internalNotes,
            ],
            deferredSearchQuery,
          )
        );
      })
      .sort((left, right) => {
        const openDelta =
          Number(isOpenWorkflowStatus(right.status)) -
          Number(isOpenWorkflowStatus(left.status));

        if (openDelta !== 0) {
          return openDelta;
        }

        return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
      });
  }, [
    appointments,
    assignmentFilter,
    currentAdminEmail,
    currentAdminName,
    deferredSearchQuery,
    statusFilter,
  ]);

  const visibleMessageCount = visibleContacts.length;
  const visibleConsultationCount = visibleAppointments.length;
  const visibleTrackedCount = visibleMessageCount + visibleConsultationCount;
  const visibleUnassignedCount =
    visibleContacts.filter((contact) => !normalizeText(contact.assignedTo)).length +
    visibleAppointments.filter((appointment) => !normalizeText(appointment.assignedTo))
      .length;

  const showMessages = queueFilter !== "consultations";
  const showConsultations = queueFilter !== "messages";

  return (
    <section className="admin-panel admin-inbox" id="admin-inbox">
      <div className="admin-panel-heading">
        <div>
          <p className="eyebrow">Inbox</p>
          <h2>Work messages and consultation requests from one queue</h2>
        </div>
      </div>

      <div className="admin-inbox-toolbar">
        <div className="field full">
          <label htmlFor="admin-inbox-search">Search the queue</label>
          <input
            id="admin-inbox-search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by client, service, practice area, message, note, or assignee"
          />
        </div>
        <div className="field">
          <label htmlFor="admin-inbox-queue">Queue</label>
          <select
            id="admin-inbox-queue"
            value={queueFilter}
            onChange={(event) => setQueueFilter(event.target.value as QueueFilter)}
          >
            {queueOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="admin-inbox-status">Status</label>
          <select
            id="admin-inbox-status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="admin-inbox-assignment">Assignment</label>
          <select
            id="admin-inbox-assignment"
            value={assignmentFilter}
            onChange={(event) =>
              setAssignmentFilter(event.target.value as AssignmentFilter)
            }
          >
            {assignmentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="admin-filter-chip-row" aria-label="Inbox quick filters">
        <button
          type="button"
          className="admin-filter-chip"
          data-active={statusFilter === "open"}
          onClick={() => setStatusFilter("open")}
        >
          Open work
        </button>
        <button
          type="button"
          className="admin-filter-chip"
          data-active={assignmentFilter === "mine"}
          onClick={() => setAssignmentFilter("mine")}
        >
          Assigned to me
        </button>
        <button
          type="button"
          className="admin-filter-chip"
          data-active={assignmentFilter === "unassigned"}
          onClick={() => setAssignmentFilter("unassigned")}
        >
          Unassigned
        </button>
        <button
          type="button"
          className="admin-filter-chip"
          data-active={
            searchQuery.length === 0 &&
            queueFilter === "all" &&
            assignmentFilter === "all" &&
            statusFilter === "all"
          }
          onClick={() => {
            setSearchQuery("");
            setQueueFilter("all");
            setAssignmentFilter("all");
            setStatusFilter("all");
          }}
        >
          Clear filters
        </button>
      </div>

      <div className="admin-inbox-summary">
        <article className="admin-mini-stat">
          <span>Visible messages</span>
          <strong>{visibleMessageCount}</strong>
        </article>
        <article className="admin-mini-stat">
          <span>Visible consultations</span>
          <strong>{visibleConsultationCount}</strong>
        </article>
        <article className="admin-mini-stat">
          <span>Needs assignment</span>
          <strong>{visibleUnassignedCount}</strong>
        </article>
      </div>

      <div className="admin-inbox-results">
        Showing {visibleTrackedCount} matching item
        {visibleTrackedCount === 1 ? "" : "s"} across the selected queue.
      </div>

      {visibleTrackedCount === 0 ? (
        <div className="admin-empty-state">
          <p className="admin-empty">
            No messages or consultations match the current filters.
          </p>
        </div>
      ) : null}

      {visibleTrackedCount > 0 ? (
        <div className="admin-inbox-grid">
          {showMessages ? (
            <section className="admin-inbox-column">
              <div className="admin-section-kicker">
                <p className="eyebrow">Messages</p>
                <h3>General enquiries and intake</h3>
              </div>
              <div className="admin-intake-stack">
                {visibleContacts.length === 0 ? (
                  <p className="admin-empty">No message submissions match these filters.</p>
                ) : (
                  visibleContacts.map((contact) => (
                    <ContactWorkflowCard key={contact.id} contact={contact} />
                  ))
                )}
              </div>
            </section>
          ) : null}

          {showConsultations ? (
            <section className="admin-inbox-column">
              <div className="admin-section-kicker">
                <p className="eyebrow">Consultations</p>
                <h3>Requested calls and appointments</h3>
              </div>
              <div className="admin-intake-stack">
                {visibleAppointments.length === 0 ? (
                  <p className="admin-empty">
                    No consultation requests match these filters.
                  </p>
                ) : (
                  visibleAppointments.map((appointment) => (
                    <AppointmentWorkflowCard
                      key={appointment.id}
                      appointment={appointment}
                    />
                  ))
                )}
              </div>
            </section>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
