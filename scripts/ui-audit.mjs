import "dotenv/config";
import { chromium, devices } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const baseUrl = process.env.UI_AUDIT_BASE_URL ?? "http://127.0.0.1:3000";
const adminEmail = process.env.UI_AUDIT_ADMIN_EMAIL ?? "";
const adminPassword = process.env.UI_AUDIT_ADMIN_PASSWORD ?? "";
const chromeExecutable =
  process.env.CHROME_EXECUTABLE_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const auditLabel = process.env.UI_AUDIT_LABEL ?? "before";
const artifactRoot = path.resolve("artifacts", "ui-audit", auditLabel);
const screenshotsRoot = path.join(artifactRoot, "screenshots");
const videosRoot = path.join(artifactRoot, "videos");

const desktopRoutes = [
  { slug: "home", url: "/" },
  { slug: "about", url: "/about" },
  { slug: "services", url: "/services" },
  { slug: "contact", url: "/contact" },
];

async function ensureArtifactDirs() {
  await fs.mkdir(screenshotsRoot, { recursive: true });
  await fs.mkdir(videosRoot, { recursive: true });
}

async function dismissStickyHeader(page) {
  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  });
}

async function capturePage(page, slug) {
  await dismissStickyHeader(page);
  await page.screenshot({
    path: path.join(screenshotsRoot, `${slug}.png`),
    fullPage: true,
  });
}

async function recordScroll(page) {
  for (const step of [450, 500, 550, 600]) {
    await page.mouse.wheel(0, step);
    await page.waitForTimeout(350);
  }
}

async function captureDesktop(browser) {
  const context = await browser.newContext({
    viewport: { width: 1512, height: 982 },
    recordVideo: {
      dir: videosRoot,
      size: { width: 1512, height: 982 },
    },
    colorScheme: "light",
  });

  const page = await context.newPage();

  for (const route of desktopRoutes) {
    await page.goto(`${baseUrl}${route.url}`, { waitUntil: "networkidle" });
    await capturePage(page, `desktop-${route.slug}`);
  }

  await page.goto(`${baseUrl}/admin`, { waitUntil: "networkidle" });
  await capturePage(page, "desktop-admin-login");

  if (adminEmail && adminPassword) {
    await page.getByLabel("Admin email").fill(adminEmail);
    await page.getByLabel("Password").fill(adminPassword);
    await page.getByRole("button", { name: "Open Dashboard" }).click();
    await page.getByRole("button", { name: "Sign out" }).waitFor();
    await page.waitForLoadState("networkidle");
    await capturePage(page, "desktop-admin-dashboard");
    await recordScroll(page);
  }

  await context.close();
}

async function captureMobile(browser) {
  const context = await browser.newContext({
    ...devices["iPhone 13"],
    recordVideo: {
      dir: videosRoot,
      size: { width: 390, height: 844 },
    },
    colorScheme: "light",
  });

  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await capturePage(page, "mobile-home");

  await page.getByLabel("Toggle navigation").click();
  await page.screenshot({
    path: path.join(screenshotsRoot, "mobile-nav-open.png"),
  });

  await page.getByRole("navigation").getByRole("link", { name: "Contact", exact: true }).click();
  await page.waitForLoadState("networkidle");
  await capturePage(page, "mobile-contact");

  await context.close();
}

async function main() {
  await ensureArtifactDirs();

  const browser = await chromium.launch({
    executablePath: chromeExecutable,
    headless: true,
  });

  try {
    await captureDesktop(browser);
    await captureMobile(browser);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
