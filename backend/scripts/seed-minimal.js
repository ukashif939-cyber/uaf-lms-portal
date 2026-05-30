/**
 * Minimal seed for local demo login (fast).
 * Run: node scripts/seed-minimal.js
 */
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

const DEMO_USERS = [
  {
    email: "admin@uaf.edu.pk",
    password: "admin123",
    role: "ADMIN",
    profile: {
      firstName: "Dr. Faheem",
      lastName: "Tariq",
      registrationId: "ADMIN-001",
      department: "Computer Science",
      program: "Administration",
      currentSemester: 0,
      enrollmentYear: 2015,
    },
  },
  {
    email: "ali.khan@uaf.edu.pk",
    password: "password123",
    role: "STUDENT",
    profile: {
      firstName: "Ali",
      lastName: "Khan",
      registrationId: "2021-ag-1234",
      department: "Computer Science",
      program: "BS Computer Science",
      currentSemester: 7,
      enrollmentYear: 2021,
      expectedGradYear: 2025,
      cgpa: 3.45,
    },
  },
  {
    email: "fatima.bibi@uaf.edu.pk",
    password: "password123",
    role: "STUDENT",
    profile: {
      firstName: "Fatima",
      lastName: "Bibi",
      registrationId: "2021-ag-1235",
      department: "Computer Science",
      program: "BS Computer Science",
      currentSemester: 7,
      enrollmentYear: 2021,
      cgpa: 3.62,
    },
  },
  {
    email: "ahmed.hassan@uaf.edu.pk",
    password: "password123",
    role: "STUDENT",
    profile: {
      firstName: "Ahmed",
      lastName: "Hassan",
      registrationId: "2021-ag-1236",
      department: "Agronomy",
      program: "BS Agronomy",
      currentSemester: 5,
      enrollmentYear: 2022,
      cgpa: 3.21,
    },
  },
  {
    email: "ayesha.malik@uaf.edu.pk",
    password: "password123",
    role: "STUDENT",
    profile: {
      firstName: "Ayesha",
      lastName: "Malik",
      registrationId: "2021-ag-1237",
      department: "Food Technology",
      program: "BS Food Technology",
      currentSemester: 6,
      enrollmentYear: 2021,
      cgpa: 3.78,
    },
  },
  {
    email: "usman.ali@uaf.edu.pk",
    password: "password123",
    role: "STUDENT",
    profile: {
      firstName: "Usman",
      lastName: "Ali",
      registrationId: "2021-ag-1238",
      department: "Horticulture",
      program: "BS Horticulture",
      currentSemester: 4,
      enrollmentYear: 2022,
      cgpa: 3.05,
    },
  },
];

async function main() {
  console.log("Seeding minimal demo users...\n");

  for (const row of DEMO_USERS) {
    const hash = await bcrypt.hash(row.password, 10);
    await prisma.user.upsert({
      where: { email: row.email },
      update: { passwordHash: hash, role: row.role },
      create: {
        email: row.email,
        passwordHash: hash,
        role: row.role,
        profile: { create: row.profile },
      },
    });
    console.log(`✅ ${row.email} / ${row.password}`);
  }

  console.log("\nDemo credentials:");
  console.log("  Student: ali.khan@uaf.edu.pk / password123");
  console.log("  Admin:   admin@uaf.edu.pk / admin123");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
