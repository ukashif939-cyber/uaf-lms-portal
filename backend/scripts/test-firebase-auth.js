/** Auth smoke test — matches TEST_ACCOUNTS.md */
require("dotenv").config();

const API_KEY = process.env.FIREBASE_API_KEY || "AIzaSyBZ4qxqny2Ss5rVbO9-kIst0Y1fpOTMZw0";
const API_BASE = "http://localhost:5000";

async function firebaseSignIn(email, password) {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(`${email}: Firebase ${data?.error?.message || res.status}`);
  return data.idToken;
}

async function testStudent(email) {
  const idToken = await firebaseSignIn(email, "password123");
  const session = await fetch(`${API_BASE}/api/auth/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  const sessionData = await session.json();
  if (!session.ok) throw new Error(`${email}: ${sessionData.message}`);

  const attendance = await fetch(`${API_BASE}/api/student/attendance`, {
    headers: { Authorization: `Bearer ${idToken}` },
  });
  if (!attendance.ok) throw new Error(`${email}: attendance ${attendance.status}`);

  const attData = await attendance.json();
  console.log(`✅ ${email} — Firebase OK, ${attData.length} attendance subjects`);
}

async function testAdmin() {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@uaf.edu.pk", password: "admin" }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`admin: ${data.message}`);
  console.log(`✅ admin@uaf.edu.pk — backend auth OK (role=${data.user.role})`);
}

(async () => {
  await testStudent("ali.khan@uaf.edu.pk");
  await testAdmin();
  console.log("\nAll TEST_ACCOUNTS auth checks passed.");
})().catch((err) => {
  console.error("❌", err.message);
  process.exit(1);
});
