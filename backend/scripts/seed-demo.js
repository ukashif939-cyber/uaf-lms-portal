/**
 * Full demo database seed:
 * - 9 login accounts (5 UAF students + 1 admin + 3 Google)
 * - 100 display-only students for admin dashboard stats
 * Run: node scripts/seed-demo.js
 */
require("dotenv").config();
const { execSync } = require("child_process");
const path = require("path");

const root = path.join(__dirname, "..");

function run(script) {
  console.log(`\n${"=".repeat(50)}\n▶ ${script}\n${"=".repeat(50)}`);
  execSync(`node ${path.join(root, script)}`, { stdio: "inherit", cwd: root });
}

async function main() {
  console.log("🚀 UAF LMS Demo Seed — login accounts + admin display data\n");
  run("scripts/seed-test-accounts.js");
  run("scripts/seed-google-users.js");
  run("scripts/seed-display-students.js");
  console.log("\n✅ Demo database ready for hosting.");
  console.log("   Login accounts: 9 (see TEST_ACCOUNTS.md)");
  console.log("   Display-only students: ~100 (admin dashboard only)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
