const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const path = require("path");

// Cloud Functions: resolve SQLite DB path before Prisma init
if (process.env.K_SERVICE || process.env.FUNCTIONS_EMULATOR) {
  process.env.DATABASE_URL =
    process.env.DATABASE_URL ||
    `file:${path.join(__dirname, "prisma", "dev.db")}`;
}

require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { verifyFirebaseIdToken } = require("./lib/firebaseAuth");
const allowedAuthEmails = require("./lib/allowedEmails");
const { isDemoAccount } = require("./lib/demoAccounts");

const prisma = new PrismaClient();
const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(cors({
  origin: (origin, cb) => {
    const allowed = [
      "http://localhost:3000",
      "http://localhost:3001",
      process.env.FRONTEND_URL,
      ...(process.env.CORS_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean),
    ].filter(Boolean);
    if (
      !origin ||
      allowed.includes(origin) ||
      /\.web\.app$/.test(origin) ||
      /\.firebaseapp\.com$/.test(origin) ||
      /\.trycloudflare\.com$/.test(origin) ||
      /\.loca\.lt$/.test(origin)
    ) {
      return cb(null, true);
    }
    cb(null, allowed[0]);
  },
  credentials: true,
}));
app.use(bodyParser.json({ limit: "5mb" }));

const toClientUser = (u) => ({
  id: u.id,
  email: u.email,
  role: (u.role || "").toLowerCase(),
  name: u.profile ? `${u.profile.firstName} ${u.profile.lastName}`.trim() : u.email.split("@")[0],
  regId: u.profile?.registrationId || "",
  avatar: u.profile?.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.email)}`,
  dept: u.profile?.department || "",
  isActive: u.isActive !== false,
  isDemo: isDemoAccount(u.email),
});

const authenticate = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (bearer) {
      try {
        const decoded = await verifyFirebaseIdToken(bearer);
        req.user = await prisma.user.findUnique({
          where: { email: decoded.email },
          include: { profile: true },
        });
        return next();
      } catch (_tokenErr) {
        req.user = null;
        return next();
      }
    }

    const userId = req.headers["x-user-id"];
    if (!userId) {
      req.user = null;
      return next();
    }
    req.user = await prisma.user.findUnique({
      where: { id: String(userId) },
      include: { profile: true },
    });
    next();
  } catch (err) {
    next(err);
  }
};
app.use(authenticate);

app.get("/", (_req, res) => {
  res.status(200).json({ status: "ok", message: "UAF LMS backend is running", health: "/health" });
});
const healthHandler = (_req, res) => res.status(200).json({ status: "healthy" });
app.get("/health", healthHandler);
app.get("/api/health", healthHandler);
app.get("/.well-known/appspecific/com.chrome.devtools.json", (_req, res) => res.status(204).end());

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!allowedAuthEmails.has((email || "").toLowerCase())) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const user = await prisma.user.findUnique({ where: { email }, include: { profile: true } });
    if (!user || user.isActive === false) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    return res.json({ user: toClientUser(user), token: `mock-jwt-token-${user.id}` });
  } catch (_err) {
    return res.status(500).json({ message: "Login failed" });
  }
});

app.post("/api/auth/session", async (req, res) => {
  try {
    const { idToken } = req.body;
    const decoded = await verifyFirebaseIdToken(idToken);
    if (!allowedAuthEmails.has(decoded.email)) {
      return res.status(403).json({ message: "This email is not authorized for the portal." });
    }

    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
      include: { profile: true },
    });
    if (!user) {
      return res.status(403).json({ message: "No portal account found for this email." });
    }
    if (user.isActive === false) {
      return res.status(403).json({ message: "This account is for display purposes only and cannot log in." });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        googleId: decoded.uid,
      },
    });
    return res.json({ user: toClientUser(user), token: idToken });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Session validation failed";
    return res.status(401).json({ message });
  }
});

app.get("/api/student/dashboard", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const studentId = req.user.id;
  const attendanceRows = await prisma.attendance.findMany({ where: { enrollment: { studentId } } });
  const present = attendanceRows.filter((a) => a.status === "PRESENT").length;
  const attendance = attendanceRows.length ? Math.round((present / attendanceRows.length) * 100) : 0;

  const grades = await prisma.grade.findMany({
    where: { enrollment: { studentId } },
    include: { enrollment: { include: { course: true } } },
  });
  let totalCredits = 0;
  let totalPoints = 0;
  for (const g of grades) {
    totalCredits += g.enrollment.course.creditHours;
    totalPoints += g.gradePoints * g.enrollment.course.creditHours;
  }
  const gpa = totalCredits ? (totalPoints / totalCredits).toFixed(2) : "0.00";

  const due = await prisma.feeVoucher.findMany({ where: { studentId, status: { in: ["PENDING", "OVERDUE"] } } });
  const dueAmount = due.reduce((sum, f) => sum + f.amount, 0);
  res.json({
    attendance: `${attendance}%`,
    gpa,
    dueFees: `Rs. ${Math.round(dueAmount).toLocaleString()}`,
    activity: [
      { id: 1, text: "Dashboard synced with database", time: "just now", type: "system" },
      { id: 2, text: `Loaded ${grades.length} course grades`, time: "just now", type: "grade" },
    ],
  });
});

app.get("/api/student/attendance", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const rows = await prisma.attendance.findMany({
    where: { enrollment: { studentId: req.user.id } },
    include: { enrollment: { include: { course: true } } },
    orderBy: { date: "desc" },
  });
  const byCourse = new Map();
  for (const row of rows) {
    const subject = row.enrollment.course.name;
    if (!byCourse.has(subject)) byCourse.set(subject, { subject, semester: row.enrollment.session, total: 0, attended: 0, percentage: 0 });
    const item = byCourse.get(subject);
    item.total += 1;
    if (row.status === "PRESENT" || row.status === "LATE") item.attended += 1;
    item.percentage = Math.round((item.attended / item.total) * 100);
  }
  res.json(Array.from(byCourse.values()));
});

app.get("/api/student/grades", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const rows = await prisma.grade.findMany({
    where: { enrollment: { studentId: req.user.id } },
    include: { enrollment: { include: { course: true } } },
  });
  res.json(rows.map((g) => ({ subject: g.enrollment.course.name, grade: g.letterGrade, points: g.gradePoints, total: g.totalMarksObt })));
});

app.get("/api/student/grades-enhanced", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const rows = await prisma.grade.findMany({
    where: { enrollment: { studentId: req.user.id } },
    include: { enrollment: { include: { course: true } } },
  });
  let totalCredits = 0;
  let totalPoints = 0;
  const courses = rows.map((g) => {
    totalCredits += g.enrollment.course.creditHours;
    totalPoints += g.gradePoints * g.enrollment.course.creditHours;
    return {
      code: g.enrollment.course.code,
      name: g.enrollment.course.name,
      grade: g.letterGrade,
      points: g.gradePoints,
      creditHours: g.enrollment.course.creditHours,
    };
  });
  const gpa = totalCredits ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  res.json({ semester: rows[0]?.session || "N/A", semesterGPA: gpa, cumulativeGPA: gpa, creditHours: totalCredits, courses });
});

app.get("/api/student/marks", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const rows = await prisma.mark.findMany({
    where: { enrollment: { studentId: req.user.id } },
    include: { enrollment: { include: { course: true } } },
    orderBy: { conductedAt: "desc" },
  });
  const bySubject = new Map();
  for (const m of rows) {
    const subject = m.enrollment.course.name;
    if (!bySubject.has(subject)) bySubject.set(subject, { subject, total: 0, breakdown: [] });
    const item = bySubject.get(subject);
    item.total += (m.obtainedMarks / m.totalMarks) * 100 * (m.weightPercent / 100);
    item.breakdown.push({ type: m.title, marks: m.obtainedMarks, total: m.totalMarks });
  }
  const subjects = Array.from(bySubject.values()).map((s) => ({ ...s, total: Math.round(s.total) }));
  res.json({ subjects });
});

app.get("/api/student/fees", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const rows = await prisma.feeVoucher.findMany({ where: { studentId: req.user.id }, orderBy: { dueDate: "asc" } });
  res.json(rows);
});

app.get("/api/library", async (_req, res) => {
  const rows = await prisma.libraryResource.findMany({ orderBy: { createdAt: "desc" } });
  res.json(rows.map((r) => ({ id: r.id, title: r.title, author: r.author, type: r.type, link: r.url || "#" })));
});

app.post("/api/feedback", async (req, res) => {
  const { userId, rating, text, ratings } = req.body;
  if (!userId) return res.status(400).json({ message: "userId required" });
  const item = await prisma.feedback.create({
    data: {
      studentId: userId,
      category: "General",
      rating: Number(rating || 0),
      comment: text || "",
      aiSummary: ratings ? JSON.stringify(ratings) : null,
    },
  });
  res.json({ message: "Feedback submitted successfully", feedback: item });
});

app.get("/api/admin/stats", async (_req, res) => {
  const totalStudents = await prisma.user.count({ where: { role: "STUDENT" } });
  const activeThisWeek = await prisma.user.count({ where: { role: "STUDENT", lastLoginAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } });
  const avgGpa = await prisma.profile.aggregate({ _avg: { cgpa: true }, where: { user: { role: "STUDENT" } } });
  res.json({ totalStudents, activeThisWeek, avgGpa: (avgGpa._avg.cgpa || 0).toFixed(2) });
});

app.get("/api/admin/users", async (_req, res) => {
  const rows = await prisma.user.findMany({ include: { profile: true }, orderBy: { createdAt: "desc" } });
  res.json(rows.map(toClientUser));
});

app.post("/api/admin/users", async (req, res) => {
  const { firstName, lastName, email, password, role, department, registrationId } = req.body;
  const hash = await bcrypt.hash(password || "password123", 10);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: hash,
      role: (role || "STUDENT").toUpperCase(),
      profile: {
        create: {
          firstName: firstName || "New",
          lastName: lastName || "User",
          registrationId: registrationId || `TMP-${Date.now()}`,
          department: department || "Computer Science",
          program: "BS Computer Science",
          enrollmentYear: new Date().getFullYear(),
          currentSemester: 1,
        },
      },
    },
    include: { profile: true },
  });
  res.status(201).json(toClientUser(user));
});

app.put("/api/admin/users/:id", async (req, res) => {
  const id = req.params.id;
  const { firstName, lastName, department, role, isActive } = req.body;
  const updated = await prisma.user.update({
    where: { id },
    data: {
      role: role ? role.toUpperCase() : undefined,
      isActive: typeof isActive === "boolean" ? isActive : undefined,
      profile: {
        update: {
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          department: department || undefined,
        },
      },
    },
    include: { profile: true },
  });
  res.json(toClientUser(updated));
});

app.delete("/api/admin/users/:id", async (req, res) => {
  const id = req.params.id;
  await prisma.user.delete({ where: { id } });
  res.status(204).end();
});

app.post("/api/admin/users/import", async (req, res) => {
  const { rows } = req.body;
  if (!Array.isArray(rows)) return res.status(400).json({ message: "rows array required" });
  let created = 0;
  for (const row of rows) {
    if (!row.email) continue;
    const exists = await prisma.user.findUnique({ where: { email: row.email } });
    if (exists) continue;
    const hash = await bcrypt.hash(row.password || "password123", 10);
    await prisma.user.create({
      data: {
        email: row.email,
        passwordHash: hash,
        role: (row.role || "STUDENT").toUpperCase(),
        profile: {
          create: {
            firstName: row.firstName || "Imported",
            lastName: row.lastName || "User",
            registrationId: row.registrationId || `IMP-${Date.now()}-${created}`,
            department: row.department || "Computer Science",
            program: row.program || "BS Computer Science",
            enrollmentYear: Number(row.enrollmentYear || new Date().getFullYear()),
            currentSemester: Number(row.currentSemester || 1),
          },
        },
      },
    });
    created += 1;
  }
  res.json({ created });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}
