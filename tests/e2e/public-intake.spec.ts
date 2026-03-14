import { expect, test } from "@playwright/test";

test("public contact and consultation forms submit successfully", async ({
  page,
}) => {
  const stamp = Date.now();

  await page.goto("/contact");
  await page.waitForTimeout(2600);

  await page.getByLabel("Full name").first().fill(`Contact User ${stamp}`);
  await page.getByLabel("Email").first().fill(`contact-${stamp}@example.com`);
  await page.getByLabel("Phone").first().fill("+254700000001");
  await page.getByLabel("Service needed").selectOption({ index: 1 });
  await page
    .getByLabel("Your message")
    .fill("Need advice on a business dispute with an urgent filing timeline.");
  await page.getByRole("button", { name: "Send Message" }).click();

  await expect(
    page.getByText("Thank you for contacting Kinsley Law Advocates"),
  ).toBeVisible();

  await page.waitForTimeout(2600);

  await page.getByLabel("Full name").nth(1).fill(`Consultation User ${stamp}`);
  await page
    .getByLabel("Email")
    .nth(1)
    .fill(`consultation-${stamp}@example.com`);
  await page.getByLabel("Phone").nth(1).fill("+254700000002");
  await page.getByLabel("Practice area").selectOption({ index: 1 });
  await page.getByLabel("Preferred date").fill("2030-06-15");
  await page.getByLabel("Preferred time").fill("10:30");
  await page
    .getByLabel("Matter summary")
    .fill("Need a consultation on a commercial contract dispute.");
  await page.getByRole("button", { name: "Request Consultation" }).click();

  await expect(
    page.getByText("Consultation request received"),
  ).toBeVisible();
});
