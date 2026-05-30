require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
// Prisma resolves SQLite paths relative to schema.prisma (prisma/ folder)
const resolved = path.resolve(__dirname, "..", "prisma", "dev.db");

async function count(model, label) {
  try {
    const n = await prisma[model].count();
    return { label, count: n };
  } catch {
    return { label, count: "—" };
  }
}

(async () => {
  const stats = fs.existsSync(resolved)
    ? fs.statSync(resolved)
    : null;

  console.log("=== Database Location ===");
  console.log("Provider: SQLite");
  console.log("Env:      DATABASE_URL=" + dbUrl);
  console.log("File:     " + resolved);
  if (stats) {
    console.log("Size:     " + (stats.size / 1024).toFixed(1) + " KB (" + stats.size + " bytes)");
    console.log("Modified: " + stats.mtime.toISOString());
  } else {
    console.log("Size:     file not found on disk");
  }

  console.log("\n=== Row Counts ===");
  const tables = [
    ["user", "Users"],
    ["profile", "Profiles"],
    ["course", "Courses"],
    ["enrollment", "Enrollments"],
    ["attendance", "Attendance records"],
    ["grade", "Grades"],
    ["mark", "Marks"],
    ["feeVoucher", "Fee vouchers"],
    ["libraryBook", "Library books"],
    ["bookIssue", "Book issues"],
    ["feedback", "Feedback"],
    ["survey", "Surveys"],
    ["notification", "Notifications"],
  ];

  let total = 0;
  for (const [model, label] of tables) {
    const row = await count(model, label);
    if (typeof row.count === "number") total += row.count;
    console.log(`  ${label.padEnd(22)} ${row.count}`);
  }
  console.log(`\n  ${"TOTAL (summed)".padEnd(22)} ${total}`);

  console.log("\n=== Users in DB ===");
  const users = await prisma.user.findMany({
    select: { email: true, role: true },
    orderBy: { email: "asc" },
  });
  for (const u of users) console.log(`  ${u.email} (${u.role})`);
})()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
