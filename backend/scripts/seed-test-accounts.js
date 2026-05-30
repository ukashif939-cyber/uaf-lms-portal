/**
 * Seeds database to match TEST_ACCOUNTS.md and backend/data.js
 * Run: node scripts/seed-test-accounts.js
 */
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const {
  users,
  attendance,
  grades,
  fees,
  library,
  marksBreakdown,
} = require("../data");

const prisma = new PrismaClient();

const GRADE_POINTS = { "A+": 4.0, A: 4.0, "A-": 3.7, "B+": 3.3, B: 3.0, "B-": 2.7, C: 2.0, D: 1.0, F: 0.0 };

const ASSESSMENT_MAP = {
  Quiz: "QUIZ",
  Assignment: "ASSIGNMENT",
  "Mid Term": "MID_TERM",
  "Final Exam": "FINAL_EXAM",
};

const RESOURCE_TYPE = { Book: "BOOK", "E-Book": "EBOOK", Journal: "JOURNAL" };

const FEE_TYPE_HINTS = [
  [/semester fee/i, "TUITION"],
  [/hostel/i, "HOSTEL"],
  [/examination/i, "EXAMINATION"],
  [/library/i, "LIBRARY"],
  [/sports/i, "SPORTS"],
  [/transport/i, "OTHER"],
  [/lab/i, "OTHER"],
];

function feeTypeFromTitle(title) {
  for (const [re, type] of FEE_TYPE_HINTS) {
    if (re.test(title)) return type;
  }
  return "OTHER";
}

function courseCode(name) {
  return name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase() || "COURSE";
}

async function clearAll() {
  await prisma.attendance.deleteMany();
  await prisma.mark.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.feeVoucher.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.libraryBorrowing.deleteMany();
  await prisma.libraryResource.deleteMany();
  await prisma.teacherCourse.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.course.deleteMany();
}

async function main() {
  console.log("Seeding TEST_ACCOUNTS.md data...\n");
  await clearAll();

  const userByLegacyId = new Map();
  const courseByName = new Map();
  let courseCounter = 0;

  for (const u of users) {
    const [firstName, ...rest] = u.name.split(" ");
    const lastName = rest.join(" ") || firstName;
    const hash = await bcrypt.hash(u.password, 10);
    const created = await prisma.user.create({
      data: {
        email: u.email,
        passwordHash: hash,
        role: u.role.toUpperCase(),
        isActive: true,
        profile: {
          create: {
            firstName,
            lastName,
            registrationId: u.regId,
            department: u.role === "admin" ? "Administration" : "Computer Science",
            program: u.role === "admin" ? "Administration" : "BS Computer Science",
            currentSemester: u.role === "admin" ? 0 : 7,
            enrollmentYear: u.role === "admin" ? 2015 : 2021,
            profileImageUrl: u.avatar,
            cgpa: u.role === "student" ? 3.45 : 0,
          },
        },
      },
    });
    userByLegacyId.set(u.id, created);
    console.log(`✅ User ${u.email} / ${u.password}`);
  }

  async function getCourse(name) {
    if (courseByName.has(name)) return courseByName.get(name);
    courseCounter += 1;
    const code = `GEN-${String(courseCounter).padStart(3, "0")}`;
    const course = await prisma.course.create({
      data: {
        code,
        name,
        creditHours: 3,
        department: "General",
        semester: 5,
      },
    });
    courseByName.set(name, course);
    return course;
  }

  const enrollmentKey = new Map();
  async function getEnrollment(legacyStudentId, subject, session = "Fall 2024") {
    const student = userByLegacyId.get(legacyStudentId);
    const course = await getCourse(subject);
    const key = `${student.id}:${course.id}:${session}`;
    if (enrollmentKey.has(key)) return enrollmentKey.get(key);
    const enrollment = await prisma.enrollment.create({
      data: { studentId: student.id, courseId: course.id, session },
    });
    enrollmentKey.set(key, enrollment);
    return enrollment;
  }

  console.log("\n📅 Attendance...");
  for (const row of attendance) {
    const enrollment = await getEnrollment(row.studentId, row.subject, row.semester);
    const baseDate = new Date("2024-09-01");
    for (let i = 0; i < row.total; i++) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + i * 2);
      await prisma.attendance.create({
        data: {
          enrollmentId: enrollment.id,
          date,
          status: i < row.attended ? "PRESENT" : "ABSENT",
        },
      });
    }
  }
  console.log(`   ${attendance.length} subject records`);

  console.log("📊 Grades & marks...");
  for (const g of grades) {
    for (const result of g.results) {
      const enrollment = await getEnrollment(g.studentId, result.subject, g.semester);
      await prisma.grade.upsert({
        where: { enrollmentId: enrollment.id },
        update: {},
        create: {
          enrollmentId: enrollment.id,
          letterGrade: result.grade,
          gradePoints: GRADE_POINTS[result.grade] ?? 3.0,
          totalMarksObt: result.total,
          totalMarksMax: 100,
          session: g.semester,
          isReleased: true,
          releasedAt: new Date(),
        },
      });
    }
  }

  for (const mb of marksBreakdown) {
    for (const subj of mb.subjects) {
      const enrollment = await getEnrollment(mb.studentId, subj.subject, mb.semester);
      let day = 0;
      for (const item of subj.breakdown) {
        let type = "QUIZ";
        if (item.type.includes("Assignment")) type = "ASSIGNMENT";
        else if (item.type.includes("Mid")) type = "MID_TERM";
        else if (item.type.includes("Final")) type = "FINAL_EXAM";
        const conductedAt = new Date("2024-03-01");
        conductedAt.setDate(conductedAt.getDate() + day++);
        await prisma.mark.create({
          data: {
            enrollmentId: enrollment.id,
            type,
            title: item.type,
            obtainedMarks: item.marks,
            totalMarks: item.total,
            weightPercent: 10,
            conductedAt,
          },
        });
      }
    }
  }

  console.log("💰 Fees...");
  for (const f of fees) {
    const student = userByLegacyId.get(f.studentId);
    await prisma.feeVoucher.create({
      data: {
        studentId: student.id,
        voucherNo: f.id.toUpperCase(),
        amount: f.amount,
        type: feeTypeFromTitle(f.title),
        status: f.status.toUpperCase(),
        semester: 7,
        session: "Fall-2024",
        dueDate: new Date(f.dueDate),
        paidAt: f.status === "Paid" ? new Date(f.dueDate) : null,
        paidAmount: f.status === "Paid" ? f.amount : null,
        remarks: f.title,
      },
    });
  }
  console.log(`   ${fees.length} vouchers`);

  console.log("📚 Library...");
  for (const item of library) {
    await prisma.libraryResource.create({
      data: {
        title: item.title,
        author: item.author,
        type: RESOURCE_TYPE[item.type] || "BOOK",
        category: item.category,
        url: item.link,
      },
    });
  }
  console.log(`   ${library.length} items`);

  console.log("\n✅ TEST_ACCOUNTS seed complete.");
  console.log("   Student password: password123");
  console.log("   Admin password:   admin");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
