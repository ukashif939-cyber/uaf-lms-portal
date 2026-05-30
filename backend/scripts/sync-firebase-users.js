/**
 * Creates student portal users in Firebase Auth (Email/Password).
 * Admin uses backend auth with password "admin" per TEST_ACCOUNTS.md
 * Run: node scripts/sync-firebase-users.js
 */
require("dotenv").config();

const API_KEY = process.env.FIREBASE_API_KEY || "AIzaSyBZ4qxqny2Ss5rVbO9-kIst0Y1fpOTMZw0";

const USERS = [
  { email: "ali.khan@uaf.edu.pk", password: "password123" },
  { email: "fatima.bibi@uaf.edu.pk", password: "password123" },
  { email: "ahmed.hassan@uaf.edu.pk", password: "password123" },
  { email: "ayesha.malik@uaf.edu.pk", password: "password123" },
  { email: "usman.ali@uaf.edu.pk", password: "password123" },
];

async function signUp(email, password) {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    }
  );
  const data = await res.json();
  if (res.ok) return { ok: true, email };
  if (data?.error?.message === "EMAIL_EXISTS") return { ok: true, email, existed: true };
  return { ok: false, email, error: data?.error?.message || "Unknown error" };
}

(async () => {
  console.log("Syncing Firebase Auth users (students only)...\n");
  console.log("Note: admin@uaf.edu.pk uses password 'admin' via backend auth (TEST_ACCOUNTS.md)\n");

  let ok = 0;
  let failed = 0;

  for (const user of USERS) {
    const result = await signUp(user.email, user.password);
    if (result.ok) {
      ok += 1;
      console.log(`✅ ${user.email}${result.existed ? " (already exists)" : ""}`);
    } else {
      failed += 1;
      console.log(`❌ ${user.email}: ${result.error}`);
    }
  }

  console.log(`\nDone: ${ok} ok, ${failed} failed`);
  process.exit(failed ? 1 : 0);
})();
