"use client";

import { useActionState } from "react";
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
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
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
        <span
          className="admin-intake-status"
          data-status={contact.status}
        >
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
        <span
          className="admin-intake-status"
          data-status={appointment.status}
        >
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
              defaultValue={
                appointment.assignedTo ?? appointment.attorneyName ?? ""
              }
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
}: IntakeWorkspaceProps) {
  const orderedContacts = [...contacts].sort((left, right) => {
    const openDelta =
      Number(isOpenWorkflowStatus(right.status)) -
      Number(isOpenWorkflowStatus(left.status));

    if (openDelta !== 0) {
      return openDelta;
    }

    return (
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
    );
  });
  const orderedAppointments = [...appointments].sort((left, right) => {
    const openDelta =
      Number(isOpenWorkflowStatus(right.status)) -
      Number(isOpenWorkflowStatus(left.status));

    if (openDelta !== 0) {
      return openDelta;
    }

    return (
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
    );
  });
  const openContacts = contacts.filter((contact) =>
    isOpenWorkflowStatus(contact.status),
  ).length;
  const openAppointments = appointments.filter((appointment) =>
    isOpenWorkflowStatus(appointment.status),
  ).length;

  return (
    <section className="admin-panel admin-inbox" id="admin-inbox">
      <div className="admin-panel-heading">
        <div>
          <p className="eyebrow">Inbox</p>
          <h2>Work messages and consultation requests from one queue</h2>
        </div>
      </div>

      <div className="admin-inbox-summary">
        <article className="admin-mini-stat">
          <span>Open messages</span>
          <strong>{openContacts}</strong>
        </article>
        <article className="admin-mini-stat">
          <span>Open consultations</span>
          <strong>{openAppointments}</strong>
        </article>
        <article className="admin-mini-stat">
          <span>Total tracked</span>
          <strong>{contacts.length + appointments.length}</strong>
        </article>
      </div>

      <div className="admin-inbox-grid">
        <section className="admin-inbox-column">
          <div className="admin-section-kicker">
            <p className="eyebrow">Messages</p>
            <h3>General enquiries and intake</h3>
          </div>
          <div className="admin-intake-stack">
            {contacts.length === 0 ? (
              <p className="admin-empty">No message submissions yet.</p>
            ) : (
              orderedContacts.map((contact) => (
                <ContactWorkflowCard key={contact.id} contact={contact} />
              ))
            )}
          </div>
        </section>

        <section className="admin-inbox-column">
          <div className="admin-section-kicker">
            <p className="eyebrow">Consultations</p>
            <h3>Requested calls and appointments</h3>
          </div>
          <div className="admin-intake-stack">
            {appointments.length === 0 ? (
              <p className="admin-empty">No consultation requests yet.</p>
            ) : (
              orderedAppointments.map((appointment) => (
                <AppointmentWorkflowCard
                  key={appointment.id}
                  appointment={appointment}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
