/**
 * Seeds all Google OAuth demo students with full portal data.
 * Run: node scripts/seed-google-users.js
 */
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { DEMO_GOOGLE_STUDENTS } = require("../lib/demoAccounts");

const prisma = new PrismaClient();

async function cloneStudentData(sourceId, targetId) {
  const sourceEnrollments = await prisma.enrollment.findMany({
    where: { studentId: sourceId },
    include: { attendance: true, marks: true, grade: true },
  });

  for (const src of sourceEnrollments) {
    const enrollment = await prisma.enrollment.create({
      data: { studentId: targetId, courseId: src.courseId, session: src.session },
    });

    for (const att of src.attendance) {
      await prisma.attendance.create({
        data: {
          enrollmentId: enrollment.id,
          date: att.date,
          status: att.status,
          remarks: att.remarks,
        },
      });
    }

    for (const mark of src.marks) {
      await prisma.mark.create({
        data: {
          enrollmentId: enrollment.id,
          type: mark.type,
          title: mark.title,
          obtainedMarks: mark.obtainedMarks,
          totalMarks: mark.totalMarks,
          weightPercent: mark.weightPercent,
          conductedAt: mark.conductedAt,
        },
      });
    }

    if (src.grade) {
      await prisma.grade.create({
        data: {
          enrollmentId: enrollment.id,
          letterGrade: src.grade.letterGrade,
          gradePoints: src.grade.gradePoints,
          totalMarksObt: src.grade.totalMarksObt,
          totalMarksMax: src.grade.totalMarksMax,
          session: src.grade.session,
          isReleased: src.grade.isReleased,
          releasedAt: src.grade.releasedAt,
        },
      });
    }
  }

  const sourceFees = await prisma.feeVoucher.findMany({ where: { studentId: sourceId } });
  for (const fee of sourceFees) {
    await prisma.feeVoucher.create({
      data: {
        studentId: targetId,
        voucherNo: `UAF-G-${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
        amount: fee.amount,
        type: fee.type,
        status: fee.status,
        semester: fee.semester,
        session: fee.session,
        dueDate: fee.dueDate,
        paidAt: fee.paidAt,
        paidAmount: fee.paidAmount,
        remarks: fee.remarks,
      },
    });
  }
}

async function upsertGoogleUser(config) {
  const source = await prisma.user.findUnique({
    where: { email: config.cloneFrom },
    include: { profile: true },
  });
  if (!source) throw new Error(`Clone source ${config.cloneFrom} not found`);

  const hash = await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 10);
  const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(config.email)}`;

  let user = await prisma.user.findUnique({ where: { email: config.email } });

  if (user) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        role: "STUDENT",
        isActive: true,
        profile: {
          update: {
            firstName: config.firstName,
            lastName: config.lastName,
            registrationId: config.registrationId,
            department: "Computer Science",
            program: "BS Computer Science",
            currentSemester: source.profile?.currentSemester ?? 7,
            enrollmentYear: 2024,
            cgpa: source.profile?.cgpa ?? 3.45,
            profileImageUrl: avatar,
          },
        },
      },
      include: { profile: true },
    });
  } else {
    user = await prisma.user.create({
      data: {
        email: config.email,
        passwordHash: hash,
        role: "STUDENT",
        isActive: true,
        profile: {
          create: {
            firstName: config.firstName,
            lastName: config.lastName,
            registrationId: config.registrationId,
            department: "Computer Science",
            program: "BS Computer Science",
            currentSemester: source.profile?.currentSemester ?? 7,
            enrollmentYear: 2024,
            expectedGradYear: 2028,
            cgpa: source.profile?.cgpa ?? 3.45,
            profileImageUrl: avatar,
          },
        },
      },
      include: { profile: true },
    });
  }

  const enrollmentCount = await prisma.enrollment.count({ where: { studentId: user.id } });
  if (enrollmentCount === 0) {
    await cloneStudentData(source.id, user.id);
  }

  const stats = {
    enrollments: await prisma.enrollment.count({ where: { studentId: user.id } }),
    attendance: await prisma.attendance.count({ where: { enrollment: { studentId: user.id } } }),
    grades: await prisma.grade.count({ where: { enrollment: { studentId: user.id } } }),
    fees: await prisma.feeVoucher.count({ where: { studentId: user.id } }),
  };

  console.log(`✅ ${config.email} (${config.firstName} ${config.lastName})`);
  console.log(`   Reg: ${user.profile.registrationId} | Enrollments: ${stats.enrollments} | Attendance: ${stats.attendance} | Grades: ${stats.grades} | Fees: ${stats.fees}`);
}

async function main() {
  console.log("Seeding Google demo students...\n");
  for (const config of DEMO_GOOGLE_STUDENTS) {
    await upsertGoogleUser(config);
  }
  console.log("\nGoogle demo students ready — sign in with Continue with Google");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
