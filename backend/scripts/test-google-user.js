/** Verify all 3 Google demo students have consistent portal data */
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { DEMO_GOOGLE_STUDENTS } = require("../lib/demoAccounts");

const prisma = new PrismaClient();
const API = "http://localhost:5000";

(async () => {
  for (const config of DEMO_GOOGLE_STUDENTS) {
    const user = await prisma.user.findUnique({ where: { email: config.email }, include: { profile: true } });
    if (!user) throw new Error(`Missing: ${config.email}`);

    const dash = await fetch(`${API}/api/student/dashboard`, { headers: { "x-user-id": user.id } });
    if (!dash.ok) throw new Error(`${config.email}: dashboard ${dash.status}`);

    const adminUsers = await fetch(`${API}/api/admin/users`).then((r) => r.json());
    const inAdmin = adminUsers.find((u) => u.email === config.email);
    if (!inAdmin || inAdmin.regId !== user.profile.registrationId) {
      throw new Error(`${config.email}: admin/student data mismatch`);
    }

    console.log(`✅ ${config.email} — ${user.profile.firstName} ${user.profile.lastName} (${user.profile.registrationId})`);
  }
  console.log("\nAll Google demo accounts verified.");
})()
  .catch((e) => { console.error("❌", e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
