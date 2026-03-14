import { expect, test } from "@playwright/test";

const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;

test.skip(
  !adminEmail || !adminPassword,
  "E2E admin credentials are required for admin workflow coverage.",
);

test("admin user can sign in and access the updated dashboard", async ({
  page,
}) => {
  await page.goto("/admin");

  await page.getByLabel("Admin email").fill(adminEmail!);
  await page.getByLabel("Password").fill(adminPassword!);
  await page.getByRole("button", { name: "Open Dashboard" }).click();

  await expect(
    page.getByRole("heading", {
      name: "Manage intake, content, and migration work with less noise.",
    }),
  ).toBeVisible();
  await expect(page.getByRole("tab", { name: /Inbox/i })).toBeVisible();
  await expect(page.getByText("Recent admin activity")).toBeVisible();
});
