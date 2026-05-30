# UAF LMS Portal

Web-based Learning Management System for the University of Agriculture Faisalabad (Final Year Project).

**Repository:** [github.com/ukashif939-cyber/uaf-lms-portal](https://github.com/ukashif939-cyber/uaf-lms-portal)  
**Live app (hosting):** [uaf-lms-main.web.app/login](https://uaf-lms-main.web.app/login)  
**Firebase project:** `uaf-lms-main`

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| Backend | Node.js, Express 5, Prisma ORM |
| Database | SQLite (`backend/prisma/dev.db`) |
| Auth | Firebase (Email/Password + Google) + backend session for admin |

---

## Quick start (local)

### 1. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Environment files

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env.local
```

### 3. Seed demo database

```bash
cd backend
npm run setup:demo
```

Creates **9 login accounts** and **~100 display-only students** for the admin dashboard. See [TEST_ACCOUNTS.md](./TEST_ACCOUNTS.md).

### 4. Run

**Terminal 1 — API:**
```bash
cd backend
npm run dev
```
→ http://localhost:5000

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
→ http://localhost:3000/login

**Single-port production (API + static UI):**
```bash
cd backend
npm run start:prod
```
→ http://localhost:5000/login

---

## Demo logins

Full list: **[TEST_ACCOUNTS.md](./TEST_ACCOUNTS.md)**

| Role | Email | Password |
|------|-------|----------|
| Student | `ali.khan@uaf.edu.pk` | `password123` |
| Admin | `admin@uaf.edu.pk` | `admin` |
| Google | `ukashif939@gmail.com` | Use **Continue with Google** |

- **9 accounts** can sign in (5 UAF email students, 3 Google students, 1 admin).
- **~100 other students** are display-only (`isActive: false`) — visible in admin stats, cannot log in.
- `Login Details.txt` lists display-only seed emails only — not login credentials.

---

## Deploy to Firebase

See **[DEPLOY.md](./DEPLOY.md)**.

Requirements: Firebase CLI login, **Blaze plan** for Cloud Functions.

```bash
npx firebase-tools login
deploy-firebase.bat
```

---

## Project structure

```
lms-portal-main/
├── frontend/          # Next.js app (src/app, components)
├── backend/           # Express API, Prisma, seeds
├── functions/         # Firebase Cloud Function (API)
├── scripts/           # Deploy helpers
├── firebase.json      # Hosting + API rewrites
├── TEST_ACCOUNTS.md   # Authoritative demo credentials
└── DEPLOY.md          # Firebase deployment guide
```

---

## Scripts

| Command | Location | Description |
|---------|----------|-------------|
| `npm run setup:demo` | `backend/` | Seed 9 logins + 100 display students |
| `npm run test:demo` | `backend/` | Verify demo accounts (server must be running) |
| `npm run deploy` | root | Build + deploy to Firebase |
| `npm run start:prod` | `backend/` | Serve API + built frontend on :5000 |

---

## License

Academic / FYP project — University of Agriculture Faisalabad.
