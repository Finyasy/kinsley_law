"use client";

import { type FormEvent, useEffect, useRef, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { readJsonResponse } from "@/lib/read-json-response";

type ContactFormProps = {
  practiceAreas: string[];
};

const initialState = {
  name: "",
  email: "",
  phone: "",
  service: "",
  message: "",
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
    return "Thank you for contacting Kinsley Advocates. We will be in touch shortly, and a confirmation email has been sent to your inbox.";
  }

  return (
    result.message ??
    "Thank you for contacting Kinsley Advocates. We will be in touch shortly."
  );
}

export function ContactForm({ practiceAreas }: ContactFormProps) {
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
      service: current.service || requestedPracticeArea,
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
      const response = await fetch("/api/contacts", {
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
        throw new Error(result?.errors?.join(" ") ?? "Unable to send message.");
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
          : "Unable to send message.",
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
        Use this form for general enquiries, new matters, or to request a call
        back from the firm.
      </p>

      {message ? <div className="form-status">{message}</div> : null}
      {error ? <div className="form-error">{error}</div> : null}

      <div className="field-grid">
        <div className="field">
          <label htmlFor="contact-name">Full name</label>
          <input
            id="contact-name"
            name="name"
            value={formData.name}
            placeholder="Your full name"
            autoComplete="name"
            onChange={(event) => updateField(event.target.name, event.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="contact-email">Email</label>
          <input
            id="contact-email"
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
          <label htmlFor="contact-phone">Phone</label>
          <input
            id="contact-phone"
            name="phone"
            value={formData.phone}
            placeholder="+254 ..."
            autoComplete="tel"
            onChange={(event) => updateField(event.target.name, event.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="contact-service">Service needed</label>
          <select
            id="contact-service"
            name="service"
            value={formData.service}
            onChange={(event) => updateField(event.target.name, event.target.value)}
            required
          >
            <option value="">Select a service</option>
            {practiceAreas.map((practiceArea) => (
              <option key={practiceArea} value={practiceArea}>
                {practiceArea}
              </option>
            ))}
          </select>
        </div>

        <div className="field full">
          <label htmlFor="contact-message">Your message</label>
          <textarea
            id="contact-message"
            name="message"
            rows={6}
            value={formData.message}
            placeholder="Tell us about the matter, urgency, and any key deadlines."
            onChange={(event) => updateField(event.target.name, event.target.value)}
            required
          />
        </div>

        <div className="field full hidden-honeypot" aria-hidden="true">
          <label htmlFor="contact-website">Website</label>
          <input
            id="contact-website"
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
          {isPending ? "Sending..." : "Send Message"}
        </button>
      </div>
    </form>
  );
}
