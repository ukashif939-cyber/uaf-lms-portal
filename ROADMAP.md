# 🚀 UAF LMS - Path to Production Roadmap

This roadmap outlines the steps to transition the project from its current **Prototype/Demo** state to a **Fully Functional Production Application** that can be used by students and faculty in daily life.

---

## 📊 Current Status Assessment

| Component | Status | Description |
|-----------|--------|-------------|
| **Frontend** | 🟢 Ready (UI) | Pages are designed (Login, Dashboard, Grades, etc.). Currently connected to a mock backend. |
| **Backend** | 🟡 Mock | Uses in-memory data (`data.js`). No real database. Resets on restart. |
| **Database** | 🔴 Missing | No persistent storage (SQL/NoSQL). |
| **Auth** | 🟡 Simulation | Mock login logic. No real security or password hashing. |
| **Admin** | ⚪ Partial | Admin UI exists but cannot actually "Create" or "Edit" data permanently. |

---

## 🗺️ The Roadmap

### Phase 1: Foundation & Database (Weeks 1-2)
**Goal:** Establish persistent storage so data doesn't disappear.

1.  **Choose Database:**
    *   *Recommendation:* **PostgreSQL** (Relational, good for structured academic data like Grades/Attendance).
    *   *Tools:* Use **Prisma ORM** for easy interaction.
2.  **Design Schema:**
    *   `Users` (id, email, password_hash, role: ADMIN/STUDENT/TEACHER)
    *   `Courses` (id, name, code, credit_hours)
    *   `Enrollments` (student_id, course_id)
    *   `Attendance` (id, enrollment_id, date, status)
    *   `Grades` (id, enrollment_id, type: QUIZ/MID/FINAL, marks_obtained, total_marks)
3.  **Setup Database:** 
    *   Initialize Prisma in `backend/`.
    *   Create migrations to generate tables.

### Phase 2: Secure Authentication (Week 3)
**Goal:** Real security for student and admin accounts.

1.  **Backend Auth:**
    *   Implement **bcrypt** to hash passwords (never store plain text!).
    *   Implement **JWT (JSON Web Tokens)** for session management.
    *   create `/api/auth/register` (for admins to add students) and `/api/auth/login`.
2.  **Frontend Auth Integration:**
    *   Update `login/page.tsx` to call the real API and store the JWT in a secure cookie or local storage.
    *   Create "Protected Routes" (middleware) that redirect unauthenticated users to Login.

### Phase 3: Backend Architecture Upgrade (Week 4)
**Goal:** Move away from `server.js` spaghetti code to a scalable structure.

1.  **MVC Pattern:** Refactor `backend/` into:
    *   `controllers/` (Logic)
    *   `routes/` (API Endpoints)
    *   `middleware/` (Auth checks)
    *   `services/` (Database interactions)
2.  **Validation:** Add **Zod** or **Joi** to validate input (e.g., ensure "marks" are numbers between 0-100).

### Phase 4: Admin "Power" Features (Weeks 5-6)
**Goal:** Allow Admins to actually manage the university.

1.  **User Management:** Create/Edit/Delete Students and Teachers.
2.  **Course Management:** Create courses and assign teachers to them.
3.  **Result Entry:**
    *   Build an interface for **Teachers/Admins** to input grades for a class.
    *   *Current UI only shows grades; we need a UI to **enter** them.*

### Phase 5: Student & Teacher Features (Week 7)
**Goal:** Connect the existing UI to the real database.

1.  **Student Portal:** Connect Dashboard, Grades, and Attendance pages to fetch from the Postgres database.
2.  **Teacher Portal:** Create a dedicated dashboard for teachers to:
    *   View their assigned courses.
    *   Mark attendance.
    *   Upload marks.

### Phase 6: Deployment & Polish (Week 8)
**Goal:** Make it live on the internet.

1.  **Frontend Deployment:** Deploy Next.js app to **Vercel**.
2.  **Backend Deployment:** Deploy Node.js API to **Render**, **Railway**, or **AWS**.
3.  **Database:** Host PostgreSQL on **Neon** or **Supabase**.
4.  **Domain:** Buy `uaf-portal.com` (example) and connect it.

---

## 🛠️ Immediate Next Step: Phase 1

If you are ready to start **Phase 1 (Database)**, we should:
1.  Decide if you want to use **PostgreSQL** (Recommended) or MongoDB.
2.  Install **Prisma** in your backend.
3.  Draft the `schema.prisma` file.

**Shall we start with Phase 1?**
