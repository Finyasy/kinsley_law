import { expect, test } from "@playwright/test";

test("contact intake rejects submissions that arrive too quickly", async ({
  request,
}) => {
  const response = await request.post("/api/contacts", {
    data: {
      name: "Too Fast",
      email: "too-fast@example.com",
      service: "Corporate Law",
      message: "Fast submission",
      website: "",
      formStartedAt: Date.now(),
    },
  });

  expect(response.status()).toBe(422);
  const body = await response.json();
  expect(body).toMatchObject({
    errors: expect.arrayContaining([
      "Please take a moment to review your details before submitting.",
    ]),
  });
});

test("contact intake swallows obvious bot honeypot submissions", async ({
  request,
}) => {
  const response = await request.post("/api/contacts", {
    data: {
      name: "Bot",
      email: "bot@example.com",
      service: "Corporate Law",
      message: "Spam submission",
      website: "https://spam.example.com",
      formStartedAt: Date.now() - 10_000,
    },
  });

  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toMatchObject({
    blocked: true,
  });
});
