# UAF LMS — Database Setup Guide
# How to go from zero to 1000 students in your PostgreSQL database

---

## STEP 0 — Install PostgreSQL on your machine

### Windows:
1. Go to https://www.postgresql.org/download/windows/
2. Download and run the installer
3. During install, set a password for the "postgres" user — REMEMBER IT
4. Default port is 5432 — leave it as is
5. After install, open "pgAdmin 4" from Start Menu to confirm it works

### Mac:
  brew install postgresql@15
  brew services start postgresql@15

---

## STEP 1 — Create the database

Open your terminal (or pgAdmin Query Tool) and run:

  psql -U postgres -c "CREATE DATABASE uaf_lms;"

That creates an empty database called uaf_lms.
Test it:
  psql -U postgres -d uaf_lms -c "SELECT version();"

---

## STEP 2 — Copy files into your project

Your project is at something like:  D:\Projects\uaf-lms\

Copy like this:

  your-project/
  ├── backend/
  │   ├── server.js          ← your existing file
  │   └── prisma/
  │       ├── schema.prisma  ← COPY schema.prisma here
  │       └── seed.js        ← COPY seed.js here
  ├── .env                   ← COPY .env.example, rename to .env
  └── package.json

---

## STEP 3 — Install Prisma in your backend

Open terminal in your backend folder:

  cd backend
  npm install prisma @prisma/client bcrypt
  npm install --save-dev prisma

---

## STEP 4 — Set up your .env file

Open .env.example, save a copy as .env, and update this one line:

  DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/uaf_lms"

Replace YOUR_PASSWORD with what you set during PostgreSQL install.
Everything else can stay as-is for now.

---

## STEP 5 — Run Prisma migrations (creates all tables)

From your backend folder:

  npx prisma migrate dev --name init

What this does:
  ✅ Reads your schema.prisma
  ✅ Creates all 17 tables in your uaf_lms database
  ✅ Creates a migrations/ folder to track changes

You should see:  "Your database is now in sync with your schema."

Verify in pgAdmin: open uaf_lms → Schemas → public → Tables
You should see all tables listed.

---

## STEP 6 — Seed 1000 students

  node prisma/seed.js

This takes about 2-4 minutes. You will see:
  🌱 Starting UAF LMS Database Seed...
  🗑  Clearing old data...
  📚 Creating 30 courses...
  🎓 Creating 1000 students...
  → 50 students created...
  → 100 students created...
  ...
  ✅ UAF LMS SEED COMPLETE!

When done, it prints a table showing how many rows were created.

---

## STEP 7 — Connect Prisma to your Express backend

In backend/server.js (or wherever your Express app lives), replace
the old in-memory data imports with Prisma:

BEFORE (old code):
  const { users, attendanceRecords } = require('./data');

AFTER (new code):
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

---

## STEP 8 — Update one route as a test

Find your attendance route. Replace the mock data with a real DB query:

BEFORE:
  app.get('/api/student/attendance', (req, res) => {
    res.json(attendanceRecords.filter(r => r.studentId === req.user.id));
  });

AFTER:
  app.get('/api/student/attendance', async (req, res) => {
    try {
      const records = await prisma.attendance.findMany({
        where: {
          enrollment: { studentId: req.user.id }
        },
        include: {
          enrollment: { include: { course: true } }
        },
        orderBy: { date: 'desc' }
      });
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch attendance' });
    }
  });

---

## STEP 9 — Repeat for all routes

Replace each route one by one. Priority order:

  1. /api/auth/login          ← Most important, do first
  2. /api/student/dashboard   ← Main page students see
  3. /api/student/attendance
  4. /api/student/grades
  5. /api/student/marks
  6. /api/student/fees
  7. /api/admin/users
  8. /api/admin/stats
  9. /api/library
  10. /api/feedback

---

## STEP 10 — Useful Prisma commands cheatsheet

  npx prisma studio            → Opens visual browser for your database
  npx prisma migrate dev       → Apply schema changes to DB
  npx prisma generate          → Regenerate the Prisma client
  npx prisma db reset          → Wipe DB and re-run seed (CAREFUL — deletes data)
  node prisma/seed.js          → Re-seed without wiping schema

---

## QUICK REFERENCE — Common Prisma Queries

# Get all students
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    include: { profile: true }
  });

# Get one student by ID
  const student = await prisma.user.findUnique({
    where: { id: studentId },
    include: { profile: true, enrollments: true }
  });

# Get student's grades
  const grades = await prisma.grade.findMany({
    where: { enrollment: { studentId } },
    include: { enrollment: { include: { course: true } } }
  });

# Get fee vouchers for a student
  const fees = await prisma.feeVoucher.findMany({
    where: { studentId },
    orderBy: { dueDate: 'asc' }
  });

# Mark attendance
  await prisma.attendance.create({
    data: { enrollmentId, date: new Date(), status: 'PRESENT' }
  });

---

## TEST IT NOW

After seeding, test with a login query:
  const user = await prisma.user.findUnique({
    where: { email: 'admin@uaf.edu.pk' },
    include: { profile: true }
  });
  console.log(user);

You should see the admin record printed.

---

## WHEN YOU'RE READY FOR DEPLOYMENT

Use Neon (free cloud PostgreSQL):
  1. Go to neon.tech → Sign up free
  2. Create project → Copy the connection string
  3. Update .env: DATABASE_URL="postgresql://..." (the neon URL)
  4. Run: npx prisma migrate deploy
  5. Run: node prisma/seed.js
  Done — your database is live on the internet.
