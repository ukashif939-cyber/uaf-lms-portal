/** Verify all 9 demo accounts + display-only block */
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { ALLOWED_EMAILS, DEMO_STUDENTS_UAF, DEMO_ADMIN } = require("../lib/demoAccounts");

const prisma = new PrismaClient();
const API = "http://localhost:5000";

async function testBlocked(email) {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: "Student@UAF2024" }),
  });
  if (res.status === 401 || res.status === 403) {
    console.log(`✅ Blocked display-only: ${email}`);
    return;
  }
  throw new Error(`Display-only user ${email} should not login (${res.status})`);
}

(async () => {
  const totalStudents = await prisma.user.count({ where: { role: "STUDENT" } });
  const demoStudents = await prisma.user.count({ where: { role: "STUDENT", isActive: true } });
  const displayOnly = await prisma.user.count({ where: { role: "STUDENT", isActive: false } });

  console.log(`📊 Students: ${totalStudents} total | ${demoStudents} demo | ${displayOnly} display-only`);
  if (demoStudents !== 8) throw new Error(`Expected 8 demo students, got ${demoStudents}`);
  if (displayOnly < 50) throw new Error(`Expected 50+ display-only students, got ${displayOnly}`);

  for (const email of ALLOWED_EMAILS) {
    const u = await prisma.user.findUnique({ where: { email } });
    if (!u) throw new Error(`Missing demo account: ${email}`);
    if (u.isActive === false) throw new Error(`${email} should be active`);
  }
  console.log(`✅ All ${ALLOWED_EMAILS.size} demo accounts in DB and active`);

  for (const s of DEMO_STUDENTS_UAF) {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: s.email, password: s.password }),
    });
    if (!res.ok) throw new Error(`Demo login failed: ${s.email}`);
    console.log(`✅ Login OK: ${s.email}`);
  }

  const adminRes = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: DEMO_ADMIN.email, password: DEMO_ADMIN.password }),
  });
  if (!adminRes.ok) throw new Error("Admin login failed");
  console.log(`✅ Login OK: ${DEMO_ADMIN.email}`);

  const sampleDisplay = await prisma.user.findFirst({ where: { role: "STUDENT", isActive: false } });
  if (sampleDisplay) await testBlocked(sampleDisplay.email);

  const stats = await fetch(`${API}/api/admin/stats`).then((r) => r.json());
  console.log(`✅ Admin stats: ${stats.totalStudents} students, avg GPA ${stats.avgGpa}`);

  console.log("\nAll demo verification passed.");
})()
  .catch((e) => { console.error("❌", e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
