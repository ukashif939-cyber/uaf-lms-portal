// prisma/seed.js
// Run with: node prisma/seed.js
// Populates: 1000 students, 2 admins, 10 teachers, 30 courses,
//            enrollments, attendance, marks, grades, fees, library,
//            feedback, surveys, notifications

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { seed100Students } = require("./seed100students");

const prisma = new PrismaClient();

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min, max, dec = 2) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(dec));
const pick = (arr) => arr[rand(0, arr.length - 1)];
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const future = (days) =>
  new Date(Date.now() + days * 24 * 60 * 60 * 1000);
const past = (days) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000);
const dateOnly = (d) => new Date(d.toISOString().split("T")[0]);

// ─────────────────────────────────────────────
// STATIC DATA
// ─────────────────────────────────────────────

const MALE_NAMES = [
  "Muhammad Ali","Ahmad Hassan","Usman Khan","Bilal Ahmed","Faisal Raza",
  "Zeeshan Malik","Tariq Mehmood","Imran Butt","Umer Farooq","Saad Mirza",
  "Hamza Sheikh","Arslan Qureshi","Kamran Iqbal","Junaid Shah","Adnan Siddiqui",
  "Waseem Baig","Shoaib Akhtar","Rizwan Haider","Asim Javed","Nabeel Anwar",
  "Dawood Tanvir","Fahad Chaudhry","Talha Nawaz","Muneeb Rehman","Jahanzeb Ali",
  "Saqib Hussain","Waqas Saleem","Noman Aslam","Khurram Shahid","Danish Aziz",
];

const FEMALE_NAMES = [
  "Fatima Zahra","Ayesha Siddiqua","Zainab Noor","Hira Baig","Sana Malik",
  "Amna Riaz","Maham Khan","Saima Akhtar","Nadia Hussain","Rida Farooq",
  "Iqra Butt","Mehwish Saleem","Kiran Anwar","Shazia Ahmed","Bushra Iqbal",
  "Rabia Nawaz","Sobia Chaudhry","Anum Javed","Naila Shah","Afsheen Tanvir",
  "Maryam Aslam","Sadia Qureshi","Huma Raza","Nimra Mirza","Uzma Baig",
  "Layla Rehman","Summaiya Tariq","Fariha Imran","Zara Waqas","Hajra Shahid",
];

const DEPARTMENTS = [
  "Computer Science",
  "Agronomy",
  "Plant Pathology",
  "Food Technology",
  "Agricultural Engineering",
  "Horticulture",
  "Soil Science",
  "Animal Husbandry",
];

const PROGRAMS = {
  "Computer Science":         "BS Computer Science",
  "Agronomy":                 "BS Agronomy",
  "Plant Pathology":          "BS Plant Pathology",
  "Food Technology":          "BS Food Technology",
  "Agricultural Engineering": "BE Agricultural Engineering",
  "Horticulture":             "BS Horticulture",
  "Soil Science":             "BS Soil Science",
  "Animal Husbandry":         "BS Animal Husbandry",
};

const SESSIONS = ["Fall-2023", "Spring-2024", "Fall-2024"];
const LETTER_GRADES = ["A+","A","A-","B+","B","B-","C+","C","C-","D","F"];
const GRADE_POINTS   = [4.0, 4.0, 3.7, 3.3, 3.0, 2.7, 2.3, 2.0, 1.7, 1.0, 0.0];

const COURSES = [
  { code:"CS-101", name:"Introduction to Programming",      creditHours:3, department:"Computer Science",         semester:1 },
  { code:"CS-102", name:"Digital Logic Design",             creditHours:3, department:"Computer Science",         semester:1 },
  { code:"CS-201", name:"Data Structures & Algorithms",     creditHours:3, department:"Computer Science",         semester:3 },
  { code:"CS-301", name:"Database Systems",                 creditHours:3, department:"Computer Science",         semester:5 },
  { code:"CS-302", name:"Software Engineering",             creditHours:3, department:"Computer Science",         semester:5 },
  { code:"CS-401", name:"Artificial Intelligence",          creditHours:3, department:"Computer Science",         semester:7 },
  { code:"CS-402", name:"Web Development",                  creditHours:3, department:"Computer Science",         semester:7 },
  { code:"AGR-101",name:"Introduction to Agronomy",         creditHours:3, department:"Agronomy",                 semester:1 },
  { code:"AGR-201",name:"Crop Production Technology",       creditHours:3, department:"Agronomy",                 semester:3 },
  { code:"AGR-301",name:"Agricultural Meteorology",         creditHours:3, department:"Agronomy",                 semester:5 },
  { code:"FT-101", name:"Food Chemistry",                   creditHours:3, department:"Food Technology",          semester:1 },
  { code:"FT-201", name:"Food Processing Technology",       creditHours:3, department:"Food Technology",          semester:3 },
  { code:"FT-301", name:"Food Microbiology",                creditHours:3, department:"Food Technology",          semester:5 },
  { code:"PP-101", name:"Introduction to Plant Pathology",  creditHours:3, department:"Plant Pathology",          semester:1 },
  { code:"PP-201", name:"Fungal Diseases of Crops",         creditHours:3, department:"Plant Pathology",          semester:3 },
  { code:"AE-101", name:"Engineering Drawing",              creditHours:3, department:"Agricultural Engineering",  semester:1 },
  { code:"AE-201", name:"Farm Machinery",                   creditHours:3, department:"Agricultural Engineering",  semester:3 },
  { code:"HORT-101",name:"Horticulture Basics",             creditHours:3, department:"Horticulture",             semester:1 },
  { code:"HORT-201",name:"Vegetable Production",            creditHours:3, department:"Horticulture",             semester:3 },
  { code:"SS-101", name:"Soil Genesis & Classification",    creditHours:3, department:"Soil Science",             semester:1 },
  { code:"SS-201", name:"Soil Fertility Management",        creditHours:3, department:"Soil Science",             semester:3 },
  { code:"AH-101", name:"Animal Nutrition",                 creditHours:3, department:"Animal Husbandry",         semester:1 },
  { code:"AH-201", name:"Livestock Management",             creditHours:3, department:"Animal Husbandry",         semester:3 },
  { code:"MATH-101",name:"Calculus & Analytical Geometry",  creditHours:3, department:"Computer Science",         semester:1 },
  { code:"STAT-101",name:"Statistics & Probability",        creditHours:3, department:"Computer Science",         semester:2 },
  { code:"ENG-101", name:"Functional English",              creditHours:3, department:"Computer Science",         semester:1 },
  { code:"ISL-101", name:"Islamic Studies",                 creditHours:2, department:"Computer Science",         semester:1 },
  { code:"PAK-101", name:"Pakistan Studies",                creditHours:2, department:"Computer Science",         semester:2 },
  { code:"PHY-101", name:"Applied Physics",                 creditHours:3, department:"Agricultural Engineering",  semester:1 },
  { code:"CHEM-101",name:"Applied Chemistry",               creditHours:3, department:"Food Technology",          semester:1 },
];

const LIBRARY_BOOKS = [
  { title:"Clean Code",                author:"Robert C. Martin",      type:"BOOK",   category:"Computer Science" },
  { title:"The Pragmatic Programmer",  author:"Andrew Hunt",           type:"BOOK",   category:"Computer Science" },
  { title:"Introduction to Algorithms",author:"Cormen et al.",         type:"BOOK",   category:"Computer Science" },
  { title:"Database System Concepts",  author:"Silberschatz et al.",   type:"BOOK",   category:"Computer Science" },
  { title:"Artificial Intelligence",   author:"Stuart Russell",        type:"BOOK",   category:"Computer Science" },
  { title:"Crop Science",              author:"R.J. Aldrich",          type:"BOOK",   category:"Agronomy" },
  { title:"Principles of Agronomy",    author:"Goldsworthy & Fisher",  type:"BOOK",   category:"Agronomy" },
  { title:"Food Chemistry",            author:"H.D. Belitz",           type:"EBOOK",  category:"Food Technology" },
  { title:"Food Microbiology",         author:"W.C. Frazier",          type:"EBOOK",  category:"Food Technology" },
  { title:"Plant Pathology",           author:"G.N. Agrios",           type:"BOOK",   category:"Plant Pathology" },
  { title:"Soil Science Simplified",   author:"Helmut Kohnke",         type:"BOOK",   category:"Soil Science" },
  { title:"Livestock Nutrition",       author:"L.A. Maynard",          type:"BOOK",   category:"Animal Husbandry" },
  { title:"Journal of Agronomy",       author:"UAF Press",             type:"JOURNAL",category:"Agronomy" },
  { title:"Pakistan Journal of Botany",author:"Pakistan Bot. Soc.",    type:"JOURNAL",category:"Plant Pathology" },
  { title:"CS Research Quarterly",     author:"IEEE",                  type:"JOURNAL",category:"Computer Science" },
  { title:"Engineering Fundamentals",  author:"Eide et al.",           type:"BOOK",   category:"Agricultural Engineering" },
  { title:"Vegetable Crops",           author:"Knott's Handbook",      type:"EBOOK",  category:"Horticulture" },
  { title:"Statistical Methods",       author:"Snedecor & Cochran",    type:"BOOK",   category:"Computer Science" },
  { title:"Organic Chemistry",         author:"Paula Bruice",          type:"BOOK",   category:"Food Technology" },
  { title:"Water Resources Engineering",author:"Bedient & Huber",      type:"EBOOK",  category:"Agricultural Engineering" },
];

// ─────────────────────────────────────────────
// MAIN SEED FUNCTION
// ─────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting UAF LMS Database Seed...\n");

  // ── 1. Wipe existing data (safe for dev) ──
  console.log("🗑  Clearing old data...");
  await prisma.aiLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.surveyResponse.deleteMany();
  await prisma.survey.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.libraryBorrowing.deleteMany();
  await prisma.libraryResource.deleteMany();
  await prisma.feeVoucher.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.mark.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.teacherCourse.deleteMany();
  await prisma.course.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Old data cleared.\n");

  // ── 2. Courses ──
  console.log("📚 Creating 30 courses...");
  const createdCourses = await Promise.all(
    COURSES.map((c) => prisma.course.create({ data: c }))
  );
  console.log(`✅ ${createdCourses.length} courses created.\n`);

  // ── 3. Admins ──
  console.log("👑 Creating 2 admins...");
  const adminHash = await bcrypt.hash("admin", 10);
  const admins = await Promise.all([
    prisma.user.create({
      data: {
        email: "admin@uaf.edu.pk",
        passwordHash: adminHash,
        role: "ADMIN",
        profile: {
          create: {
            firstName: "Dr. Faheem", lastName: "Tariq",
            registrationId: "ADMIN-001", department: "Computer Science",
            program: "Administration", currentSemester: 0, enrollmentYear: 2015,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: "registrar@uaf.edu.pk",
        passwordHash: adminHash,
        role: "ADMIN",
        profile: {
          create: {
            firstName: "Mr. Asif", lastName: "Registrar",
            registrationId: "ADMIN-002", department: "Administration",
            program: "Administration", currentSemester: 0, enrollmentYear: 2010,
          },
        },
      },
    }),
  ]);
  console.log(`✅ ${admins.length} admins created.\n`);

  // ── 3.1 Demo student for quick login compatibility ──
  const demoStudentHash = await bcrypt.hash("password123", 10);
  const aliKhanUser = await prisma.user.create({
    data: {
      email: "ali.khan@uaf.edu.pk",
      passwordHash: demoStudentHash,
      role: "STUDENT",
      profile: {
        create: {
          firstName: "Ali",
          lastName: "Khan",
          registrationId: "2021-ag-1234",
          department: "Computer Science",
          program: "BS Computer Science",
          currentSemester: 7,
          enrollmentYear: 2021,
          expectedGradYear: 2025,
          cgpa: randFloat(3.0, 3.8),
        },
      },
    },
  });
  console.log("✅ Demo student ali.khan@uaf.edu.pk created.\n");

  // ── 4. Teachers (one per department + extras) ──
  console.log("👨‍🏫 Creating 10 teachers...");
  const teacherHash = await bcrypt.hash("Teacher@UAF2024", 10);
  const teacherData = [
    { email:"cs.teacher@uaf.edu.pk",   fn:"Dr. Imran",    ln:"Haider",   dept:"Computer Science" },
    { email:"cs2.teacher@uaf.edu.pk",  fn:"Dr. Zeeshan",  ln:"Anjum",    dept:"Computer Science" },
    { email:"agr.teacher@uaf.edu.pk",  fn:"Prof. Tariq",  ln:"Mahmood",  dept:"Agronomy" },
    { email:"ft.teacher@uaf.edu.pk",   fn:"Dr. Sana",     ln:"Malik",    dept:"Food Technology" },
    { email:"pp.teacher@uaf.edu.pk",   fn:"Dr. Khalid",   ln:"Rehman",   dept:"Plant Pathology" },
    { email:"ae.teacher@uaf.edu.pk",   fn:"Engr. Waqas",  ln:"Saleem",   dept:"Agricultural Engineering" },
    { email:"hort.teacher@uaf.edu.pk", fn:"Dr. Fatima",   ln:"Zahra",    dept:"Horticulture" },
    { email:"ss.teacher@uaf.edu.pk",   fn:"Dr. Saeed",    ln:"Ahmad",    dept:"Soil Science" },
    { email:"ah.teacher@uaf.edu.pk",   fn:"Dr. Bilal",    ln:"Chaudhry", dept:"Animal Husbandry" },
    { email:"math.teacher@uaf.edu.pk", fn:"Dr. Nadia",    ln:"Hussain",  dept:"Computer Science" },
  ];

  const teachers = await Promise.all(
    teacherData.map((t, i) =>
      prisma.user.create({
        data: {
          email: t.email,
          passwordHash: teacherHash,
          role: "TEACHER",
          profile: {
            create: {
              firstName: t.fn, lastName: t.ln,
              registrationId: `TCH-${String(i + 1).padStart(3, "0")}`,
              department: t.dept, program: "Teaching Staff",
              currentSemester: 0, enrollmentYear: 2018,
            },
          },
        },
      })
    )
  );
  console.log(`✅ ${teachers.length} teachers created.\n`);

  // Assign teachers to courses
  const csTeacher  = teachers[0];
  const csTeacher2 = teachers[1];
  const agrTeacher = teachers[2];

  const courseTeacherMap = {
    "CS-101": csTeacher.id,  "CS-102": csTeacher2.id, "CS-201": csTeacher.id,
    "CS-301": csTeacher.id,  "CS-302": csTeacher2.id, "CS-401": csTeacher.id,
    "CS-402": csTeacher2.id, "MATH-101": teachers[9].id, "STAT-101": teachers[9].id,
    "ENG-101": csTeacher2.id,"ISL-101": csTeacher2.id,"PAK-101": teachers[9].id,
    "AGR-101": agrTeacher.id,"AGR-201": agrTeacher.id,"AGR-301": agrTeacher.id,
    "FT-101":  teachers[3].id,"FT-201": teachers[3].id,"FT-301": teachers[3].id,
    "PP-101":  teachers[4].id,"PP-201": teachers[4].id,
    "AE-101":  teachers[5].id,"AE-201": teachers[5].id,"PHY-101": teachers[5].id,
    "HORT-101":teachers[6].id,"HORT-201":teachers[6].id,
    "SS-101":  teachers[7].id,"SS-201": teachers[7].id,
    "AH-101":  teachers[8].id,"AH-201": teachers[8].id,
    "CHEM-101":teachers[3].id,
  };

  for (const session of SESSIONS) {
    for (const [code, teacherId] of Object.entries(courseTeacherMap)) {
      const course = createdCourses.find((c) => c.code === code);
      if (course) {
        await prisma.teacherCourse.upsert({
          where: { teacherId_courseId_session: { teacherId, courseId: course.id, session } },
          update: {},
          create: { teacherId, courseId: course.id, session },
        });
      }
    }
  }

  // ── 5. Students (1000) ──
  console.log("🎓 Creating 1000 students...");
  const studentHash = await bcrypt.hash("password123", 10);
  const departments = Object.keys(PROGRAMS);
  const allStudents = [];

  const BATCH_SIZE = 50;
  for (let batch = 0; batch < 20; batch++) {
    const batchStudents = [];
    for (let i = 0; i < BATCH_SIZE; i++) {
      const idx     = batch * BATCH_SIZE + i;
      const isFemale = Math.random() > 0.55;
      const nameList = isFemale ? FEMALE_NAMES : MALE_NAMES;
      const fullName = nameList[idx % nameList.length];
      const [firstName, lastName] = fullName.split(" ");
      const dept     = departments[idx % departments.length];
      const year     = 2019 + (idx % 5); // entry years 2019-2023
      const regId    = `${year}-${dept.substring(0,2).toLowerCase()}-${String(7001 + idx).padStart(4,"0")}`;
      const semester = Math.min(8, (2024 - year) * 2 + 1);

      const student = await prisma.user.create({
        data: {
          email:        `${regId.replace(/-/g, ".")}@uaf.edu.pk`,
          passwordHash: studentHash,
          role:         "STUDENT",
          profile: {
            create: {
              firstName, lastName,
              gender:          isFemale ? "FEMALE" : "MALE",
              registrationId:  regId,
              department:      dept,
              program:         PROGRAMS[dept],
              currentSemester: semester,
              enrollmentYear:  year,
              expectedGradYear:year + 4,
              phone:           `03${rand(10,49)}${rand(1000000,9999999)}`,
              isHostelResident:Math.random() > 0.7,
              hostelBlock:     Math.random() > 0.7 ? pick(["A","B","C","D","E"]) : null,
              roomNumber:      Math.random() > 0.7 ? String(rand(101,520)) : null,
              cgpa:            randFloat(1.5, 4.0),
            },
          },
        },
      });
      batchStudents.push({ user: student, dept, semester, year, regId });
    }
    allStudents.push(...batchStudents);
    if ((batch + 1) % 5 === 0)
      console.log(`  → ${(batch + 1) * BATCH_SIZE} students created...`);
  }
  console.log(`✅ 1000 students created.\n`);

  // Include the demo student so they get enrollments, grades, attendance & fees
  allStudents.push({ user: aliKhanUser, dept: "Computer Science", semester: 7, year: 2021, regId: "2021-ag-1234" });

  // ── 6. Enrollments + Marks + Grades ──
  console.log("📝 Creating enrollments, marks & grades (this takes a moment)...");

  for (const { user, dept, semester } of allStudents) {
    // Enroll in 4-5 courses matching their department + common courses
    const deptCourses = createdCourses.filter(
      (c) => (c.department === dept || ["Computer Science","Agronomy"].includes(c.department))
             && c.semester <= semester
    );
    const selected = shuffle(deptCourses).slice(0, rand(4, 5));
    const session  = pick(SESSIONS);

    for (const course of selected) {
      const enrollment = await prisma.enrollment.create({
        data: { studentId: user.id, courseId: course.id, session },
      });

      // Marks: 2 quizzes, 1 assignment, mid, final
      const assessments = [
        { type:"QUIZ",       title:"Quiz 1",    total:10,  weight:5  },
        { type:"QUIZ",       title:"Quiz 2",    total:10,  weight:5  },
        { type:"ASSIGNMENT", title:"Assignment 1", total:20, weight:10 },
        { type:"MID_TERM",   title:"Mid Term",  total:50,  weight:30 },
        { type:"FINAL_EXAM", title:"Final Exam",total:100, weight:50 },
      ];
      let totalObt = 0, totalMax = 0;
      const markPromises = [];
      for (const a of assessments) {
        const pct = randFloat(0.45, 1.0);
        const obt = parseFloat((pct * a.total).toFixed(1));
        totalObt += obt * (a.weight / 100);
        totalMax += a.total * (a.weight / 100);
        markPromises.push(
          prisma.mark.create({
            data: {
              enrollmentId:  enrollment.id,
              type:          a.type,
              title:         a.title,
              obtainedMarks: obt,
              totalMarks:    a.total,
              weightPercent: a.weight,
              conductedAt:   past(rand(10, 120)),
            },
          })
        );
      }
      await Promise.all(markPromises);

      // Grade based on percentage
      const pct = totalObt / totalMax;
      const gi  = pct >= 0.95 ? 0 : pct >= 0.90 ? 1 : pct >= 0.85 ? 2 :
                  pct >= 0.80 ? 3 : pct >= 0.75 ? 4 : pct >= 0.70 ? 5 :
                  pct >= 0.65 ? 6 : pct >= 0.60 ? 7 : pct >= 0.55 ? 8 :
                  pct >= 0.50 ? 9 : 10;
      await prisma.grade.create({
        data: {
          enrollmentId:  enrollment.id,
          letterGrade:   LETTER_GRADES[gi],
          gradePoints:   GRADE_POINTS[gi],
          totalMarksObt: parseFloat(totalObt.toFixed(2)),
          totalMarksMax: parseFloat(totalMax.toFixed(2)),
          session,
          isReleased:    true,
          releasedAt:    past(rand(1, 30)),
        },
      });

      // Attendance (last 45 days, Mon-Fri approx)
      const attendancePromises = [];
      for (let d = 45; d >= 1; d -= rand(1, 3)) {
        const status =
          Math.random() < 0.85 ? "PRESENT" :
          Math.random() < 0.5  ? "ABSENT"  : "LATE";
        attendancePromises.push(
          prisma.attendance.create({
            data: {
              enrollmentId: enrollment.id,
              date:         dateOnly(past(d)),
              status,
            },
          }).catch(() => {}) // ignore duplicate date conflicts
        );
      }
      await Promise.all(attendancePromises);
    }
  }
  console.log("✅ Enrollments, marks, grades & attendance done.\n");

  // ── 7. Fee Vouchers ──
  console.log("💰 Creating fee vouchers...");
  const feeData = [];
  for (const { user, semester, dept } of allStudents) {
    for (const session of SESSIONS.slice(0, 2)) {
      const isHostel = Math.random() > 0.7;
      feeData.push({
        studentId: user.id,
        voucherNo: `UAF-${session.replace("-","")}-${rand(10000,99999)}`,
        amount:    rand(18000, 35000),
        type:      "TUITION",
        status:    pick(["PAID","PAID","PAID","PENDING","OVERDUE"]),
        semester,
        session,
        dueDate:   session.includes("Fall") ? new Date("2024-09-30") : new Date("2024-02-28"),
        paidAt:    Math.random() > 0.3 ? past(rand(10, 60)) : null,
      });
      if (isHostel) {
        feeData.push({
          studentId: user.id,
          voucherNo: `UAF-HST-${session.replace("-","")}-${rand(10000,99999)}`,
          amount:    rand(5000, 12000),
          type:      "HOSTEL",
          status:    pick(["PAID","PAID","PENDING","OVERDUE"]),
          semester,
          session,
          dueDate:   session.includes("Fall") ? new Date("2024-09-30") : new Date("2024-02-28"),
          paidAt:    Math.random() > 0.4 ? past(rand(10, 60)) : null,
        });
      }
    }
  }
  // Insert in chunks to avoid overwhelming DB
  const FEE_CHUNK = 500;
  for (let i = 0; i < feeData.length; i += FEE_CHUNK) {
    await prisma.feeVoucher.createMany({ data: feeData.slice(i, i + FEE_CHUNK), skipDuplicates: true });
  }
  console.log(`✅ ~${feeData.length} fee vouchers created.\n`);

  // ── 8. Library Resources ──
  console.log("📖 Creating library resources...");
  await Promise.all(
    LIBRARY_BOOKS.map((b) =>
      prisma.libraryResource.create({
        data: {
          ...b,
          publishYear:  rand(2010, 2023),
          totalCopies:  rand(3, 10),
          availCopies:  rand(1, 5),
        },
      })
    )
  );
  console.log(`✅ ${LIBRARY_BOOKS.length} library resources created.\n`);

  // ── 9. Feedback ──
  console.log("💬 Creating feedback entries...");
  const feedbackSample = allStudents.slice(0, 200); // 200 students give feedback
  const feedbackData = feedbackSample.flatMap(({ user }) => [
    {
      studentId: user.id, category: "Teaching",
      rating: rand(3, 5), comment: pick([
        "Excellent teaching methodology", "Very helpful professor",
        "Could improve pace", "Great interaction in class", "Clear explanations",
      ]),
      sentiment: "positive",
    },
    {
      studentId: user.id, category: "Online Classes",
      rating: rand(2, 5), comment: pick([
        "Good online platform", "Audio quality needs improvement",
        "Very well organized", "Assignments were helpful", "More recorded sessions needed",
      ]),
      sentiment: pick(["positive","neutral","negative"]),
    },
  ]);
  await prisma.feedback.createMany({ data: feedbackData });
  console.log(`✅ ${feedbackData.length} feedback entries created.\n`);

  // ── 10. Survey + Responses ──
  console.log("📊 Creating survey & responses...");
  const survey = await prisma.survey.create({
    data: {
      title: "Semester End Student Satisfaction Survey",
      description: "Help us improve by sharing your honest feedback",
      questions: [
        { id:"q1", question:"How satisfied are you with the teaching quality?", type:"rating", options:[] },
        { id:"q2", question:"How would you rate the library resources?",         type:"rating", options:[] },
        { id:"q3", question:"Were the fee payment processes smooth?",            type:"yesno",  options:["Yes","No"] },
        { id:"q4", question:"Any suggestions for improvement?",                  type:"text",   options:[] },
      ],
      isActive: true,
    },
  });
  const surveyResponses = allStudents.slice(0, 300).map(({ user }) => ({
    surveyId:  survey.id,
    studentId: user.id,
    answers:   { q1: rand(3,5), q2: rand(3,5), q3: pick(["Yes","No"]), q4: "" },
  }));
  await prisma.surveyResponse.createMany({ data: surveyResponses, skipDuplicates: true });
  console.log(`✅ Survey + ${surveyResponses.length} responses created.\n`);

  // ── 11. Notifications ──
  console.log("🔔 Creating notifications...");
  const notifData = allStudents.slice(0, 500).flatMap(({ user }) => [
    {
      userId: user.id, title: "Fee Due Reminder",
      message: "Your Fall-2024 tuition fee is due on 30 Sep 2024.",
      type: "FEE_REMINDER", isRead: Math.random() > 0.5,
    },
    {
      userId: user.id, title: "Grades Released",
      message: "Your Spring-2024 final grades are now available.",
      type: "GRADE_RELEASED", isRead: Math.random() > 0.3,
    },
  ]);
  const NOTIF_CHUNK = 500;
  for (let i = 0; i < notifData.length; i += NOTIF_CHUNK) {
    await prisma.notification.createMany({ data: notifData.slice(i, i + NOTIF_CHUNK) });
  }
  console.log(`✅ ${notifData.length} notifications created.\n`);

  // ── Done ──
  const counts = {
    users:         await prisma.user.count(),
    courses:       await prisma.course.count(),
    enrollments:   await prisma.enrollment.count(),
    marks:         await prisma.mark.count(),
    grades:        await prisma.grade.count(),
    attendance:    await prisma.attendance.count(),
    feeVouchers:   await prisma.feeVoucher.count(),
    library:       await prisma.libraryResource.count(),
    feedback:      await prisma.feedback.count(),
    notifications: await prisma.notification.count(),
  };

  console.log("╔══════════════════════════════════════╗");
  console.log("║   ✅  UAF LMS SEED COMPLETE!          ║");
  console.log("╠══════════════════════════════════════╣");
  for (const [k, v] of Object.entries(counts)) {
    console.log(`║  ${k.padEnd(18)} → ${String(v).padStart(7)} rows  ║`);
  }
  console.log("╠══════════════════════════════════════╣");
  console.log("║  TEST LOGINS:                        ║");
  console.log("║  admin@uaf.edu.pk / admin             ║");
  console.log("║  Any student email / password123      ║");
  console.log("╚══════════════════════════════════════╝");

  if (process.argv.includes("--students")) {
    console.log("\n🌱 Running the 100-student seeding helper...\n");
    await seed100Students(prisma);
    console.log("✅ 100-student seed helper finished.\n");
  }
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
