# UAF LMS - Demo Accounts (Login Enabled)

Only these **9 accounts** can sign in. All other students in the database are **display-only** (visible on admin dashboard, cannot log in).

## Email / Password Students

| Name | Email | Password |
|------|-------|----------|
| Ali Khan | `ali.khan@uaf.edu.pk` | `password123` |
| Fatima Bibi | `fatima.bibi@uaf.edu.pk` | `password123` |
| Ahmed Hassan | `ahmed.hassan@uaf.edu.pk` | `password123` |
| Ayesha Malik | `ayesha.malik@uaf.edu.pk` | `password123` |
| Usman Ali | `usman.ali@uaf.edu.pk` | `password123` |

## Google Sign-In Students

Use **Continue with Google** on the login page:

| Name | Email | Reg ID |
|------|-------|--------|
| Ukashif Khan | `ukashif939@gmail.com` | 2024-cs-0939 |
| Muneeba Engineer | `muneebaiengineer@gmail.com` | 2024-cs-1001 |
| Zeeshan Anjum | `zeeshananjumjalil@gmail.com` | 2024-cs-1002 |

## Admin

| Email | Password | Access |
|-------|----------|--------|
| `admin@uaf.edu.pk` | `admin` | `/admin/dashboard`, `/admin/panel` |

---

## Display-Only Data (~100 students)

Seeded from `prisma/seed100students.js` for **admin dashboard statistics and user list only**. These accounts have `isActive: false` and are blocked at login.

---

## Setup Database

```bash
cd backend
npm run setup:demo
```

## Firebase Console

Enable **Email/Password** and **Google** under Authentication → Sign-in method.  
Add your hosting domain under Authorized domains.

---

**Last Updated:** May 2026
