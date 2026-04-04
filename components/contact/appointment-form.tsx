"use client";

import { type FormEvent, useEffect, useRef, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { readJsonResponse } from "@/lib/read-json-response";

type AppointmentFormProps = {
  practiceAreas: string[];
};

const initialState = {
  name: "",
  email: "",
  phone: "",
  date: "",
  time: "",
  practiceArea: "",
  description: "",
  website: "",
  formStartedAt: Date.now(),
};

function getSuccessMessage(result: {
  message?: string;
  clientReply?: {
    status?: string;
  };
}) {
  if (result.clientReply?.status === "sent") {
    return "Consultation request received. The firm is reviewing your preferred appointment window, and a confirmation email has been sent to your inbox.";
  }

  return (
    result.message ??
    "Consultation request received. The firm will review your preferred appointment window and respond with the next step."
  );
}

export function AppointmentForm({ practiceAreas }: AppointmentFormProps) {
  const [formData, setFormData] = useState(initialState);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const hasAppliedPrefill = useRef(false);

  useEffect(() => {
    if (hasAppliedPrefill.current) {
      return;
    }

    const requestedPracticeArea = searchParams.get("practiceArea");

    if (!requestedPracticeArea || !practiceAreas.includes(requestedPracticeArea)) {
      hasAppliedPrefill.current = true;
      return;
    }

    hasAppliedPrefill.current = true;
    setFormData((current) => ({
      ...current,
      practiceArea: current.practiceArea || requestedPracticeArea,
    }));
  }, [practiceAreas, searchParams]);

  function updateField(name: string, value: string) {
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function submitForm() {
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await readJsonResponse<{
        message?: string;
        errors?: string[];
        clientReply?: {
          status?: string;
        };
      }>(response);

      if (!response.ok) {
        throw new Error(result?.errors?.join(" ") ?? "Unable to submit consultation request.");
      }

      setMessage(getSuccessMessage(result ?? {}));
      setFormData({
        ...initialState,
        formStartedAt: Date.now(),
      });
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to submit consultation request.",
      );
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    startTransition(() => {
      void submitForm();
    });
  }

  return (
    <form className="contact-form-card" onSubmit={handleSubmit}>
      <div className="form-card-topline" />
      <p className="contact-note">
        Share your preferred consultation window and a short description of your
        matter. The firm will review it and route it to the right team before confirming the next step.
      </p>

      {message ? <div className="form-status">{message}</div> : null}
      {error ? <div className="form-error">{error}</div> : null}

      <div className="field-grid">
        <div className="field">
          <label htmlFor="appointment-name">Full name</label>
          <input
            id="appointment-name"
            name="name"
            value={formData.name}
            placeholder="Your full name"
            autoComplete="name"
            onChange={(event) => updateField(event.target.name, event.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="appointment-email">Email</label>
          <input
            id="appointment-email"
            type="email"
            name="email"
            value={formData.email}
            placeholder="name@email.com"
            autoComplete="email"
            onChange={(event) => updateField(event.target.name, event.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="appointment-phone">Phone</label>
          <input
            id="appointment-phone"
            name="phone"
            value={formData.phone}
            placeholder="+254 ..."
            autoComplete="tel"
            onChange={(event) => updateField(event.target.name, event.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="appointment-area">Practice area</label>
          <select
            id="appointment-area"
            name="practiceArea"
            value={formData.practiceArea}
            onChange={(event) => updateField(event.target.name, event.target.value)}
            required
          >
            <option value="">Select a practice area</option>
            {practiceAreas.map((practiceArea) => (
              <option key={practiceArea} value={practiceArea}>
                {practiceArea}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="appointment-date">Preferred date</label>
          <input
            id="appointment-date"
            type="date"
            name="date"
            value={formData.date}
            onChange={(event) => updateField(event.target.name, event.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="appointment-time">Preferred time</label>
          <input
            id="appointment-time"
            type="time"
            name="time"
            value={formData.time}
            onChange={(event) => updateField(event.target.name, event.target.value)}
            required
          />
        </div>

        <div className="field full">
          <label htmlFor="appointment-description">Matter summary</label>
          <textarea
            id="appointment-description"
            name="description"
            rows={6}
            value={formData.description}
            placeholder="Share the issue, desired consultation outcome, and any timing constraints."
            onChange={(event) => updateField(event.target.name, event.target.value)}
            required
          />
        </div>

        <div className="field full hidden-honeypot" aria-hidden="true">
          <label htmlFor="appointment-website">Website</label>
          <input
            id="appointment-website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={formData.website}
            onChange={(event) => updateField(event.target.name, event.target.value)}
          />
        </div>
      </div>

      <div className="button-row">
        <button type="submit" className="button-primary" disabled={isPending}>
          {isPending ? "Sending..." : "Request Consultation"}
        </button>
      </div>
    </form>
  );
}
