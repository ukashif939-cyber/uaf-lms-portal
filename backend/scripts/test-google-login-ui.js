/**
 * Browser test: login page + Google sign-in popup opens correctly.
 * Run: node scripts/test-google-login-ui.js
 */
const { chromium } = require("playwright-core");

const LOGIN_URL = "http://localhost:3000/login";

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("Opening login page...");
  await page.goto(LOGIN_URL, { waitUntil: "networkidle", timeout: 30000 });

  const googleBtn = page.getByRole("button", { name: /continue with google/i });
  await googleBtn.waitFor({ state: "visible", timeout: 10000 });
  console.log("✅ Login page loaded with Google button");

  const popupPromise = context.waitForEvent("page", { timeout: 15000 }).catch(() => null);

  await googleBtn.click();
  const popup = await popupPromise;

  if (!popup) {
    throw new Error("Google sign-in popup did not open");
  }

  await popup.waitForLoadState("domcontentloaded", { timeout: 15000 });
  const popupUrl = popup.url();
  console.log(`✅ Google popup opened: ${popupUrl.slice(0, 80)}...`);

  const ok =
    popupUrl.includes("accounts.google.com") ||
    popupUrl.includes("firebaseapp.com") ||
    popupUrl.includes("google.com");

  if (!ok) {
    throw new Error(`Unexpected popup URL: ${popupUrl}`);
  }

  await popup.close();
  await browser.close();
  console.log("\nGoogle sign-in UI test passed.");
})().catch((err) => {
  console.error("❌", err.message);
  process.exit(1);
});
