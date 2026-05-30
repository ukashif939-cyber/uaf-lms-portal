# Deploy UAF LMS to Firebase (Full Stack)

Everything runs on **one Firebase project** (`uaf-lms-main`):

| Part | Firebase service | URL |
|------|------------------|-----|
| Frontend | Hosting | `https://uaf-lms-main.web.app` |
| API | Cloud Functions | `https://uaf-lms-main.web.app/api/*` |
| Auth | Firebase Authentication | Email + Google |

Same-origin API — no CORS issues in production.

---

## One-time setup

### 1. Firebase CLI login (required once)

```bash
npx firebase-tools login
```

Sign in with the Google account that owns project **uaf-lms-main**.

### 2. Enable Blaze plan (if not already)

Cloud Functions need the **Blaze (pay-as-you-go)** plan. Free tier covers demo traffic.

Firebase Console → Project → Upgrade

### 3. Seed database (if fresh)

```bash
cd backend
npm run setup:demo
```

---

## Deploy (one command)

**Windows:**
```bash
deploy-firebase.bat
```

**Manual:**
```bash
node scripts/prepare-firebase-deploy.js
cd frontend && npm run build && cd ..
cd functions && npm install && cd ..
npx firebase-tools deploy --project uaf-lms-main
```

---

## After deploy

- **App:** https://uaf-lms-main.web.app/login  
- **API health:** https://uaf-lms-main.web.app/api/health  

### Firebase Console checklist

- [ ] Authentication → Email/Password **enabled**
- [ ] Authentication → Google **enabled**
- [ ] Authentication → Authorized domains → `uaf-lms-main.web.app` and `uaf-lms-main.firebaseapp.com`

---

## How it works

```
Browser → uaf-lms-main.web.app/login
       → /api/* rewrites to Cloud Function (Express + Prisma + SQLite)
       → other paths serve static Next.js from Hosting
```

Local dev unchanged:
```bash
cd backend && npm run dev    # port 5000
cd frontend && npm run dev   # port 3000
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `firebase login` required | Run `npx firebase-tools login` |
| API 404 after deploy | Wait 2–3 min for functions cold start; check `/api/health` |
| Google login fails | Add `uaf-lms-main.web.app` to Firebase Auth authorized domains |
| Build fails | Run from project root; ensure `frontend/.env.production` exists |

---

## Demo accounts

See `TEST_ACCOUNTS.md` — 9 login accounts, ~100 display-only students for admin stats.
