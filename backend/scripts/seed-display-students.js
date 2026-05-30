/**
 * Adds ~100 display-only students for admin dashboard (cannot log in).
 * Run: node scripts/seed-display-students.js
 */
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { seed100Students } = require("../prisma/seed100students");

const prisma = new PrismaClient();

async function main() {
  console.log("Adding display-only students for admin dashboard...\n");
  const { created, skipped } = await seed100Students(prisma, { displayOnly: true });

  await prisma.user.updateMany({
    where: {
      role: "STUDENT",
      email: { endsWith: "@uaf.edu.pk" },
      NOT: {
        email: {
          in: [
            "ali.khan@uaf.edu.pk",
            "fatima.bibi@uaf.edu.pk",
            "ahmed.hassan@uaf.edu.pk",
            "ayesha.malik@uaf.edu.pk",
            "usman.ali@uaf.edu.pk",
          ],
        },
      },
    },
    data: { isActive: false },
  });

  const total = await prisma.user.count({ where: { role: "STUDENT" } });
  const displayOnly = await prisma.user.count({ where: { role: "STUDENT", isActive: false } });
  const demo = total - displayOnly;

  console.log(`\n📊 Student counts: ${total} total | ${demo} demo (can login) | ${displayOnly} display-only`);
  console.log(`   Created: ${created}, Skipped: ${skipped}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
