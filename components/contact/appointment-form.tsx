"use client";

import { type FormEvent, useState, useTransition } from "react";
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
};

export function AppointmentForm({ practiceAreas }: AppointmentFormProps) {
  const [formData, setFormData] = useState(initialState);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

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
      }>(response);

      if (!response.ok) {
        throw new Error(result?.errors?.join(" ") ?? "Unable to submit consultation request.");
      }

      setMessage(result?.message ?? "Consultation request sent.");
      setFormData(initialState);
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
      <p className="contact-note">
        Share your preferred consultation window and a short description of your
        matter. We will confirm availability with the relevant attorney.
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
      </div>

      <div className="button-row">
        <button type="submit" className="button-primary" disabled={isPending}>
          {isPending ? "Sending..." : "Request Consultation"}
        </button>
      </div>
    </form>
  );
}
