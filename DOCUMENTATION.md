# UAF LMS - Complete Documentation
**University of Agriculture Faisalabad - Learning Management System**

---

## 📑 Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Getting Started](#getting-started)
4. [Backend Documentation](#backend-documentation)
5. [Frontend Documentation](#frontend-documentation)
6. [API Reference](#api-reference)
7. [Database Schema](#database-schema)
8. [User Guide](#user-guide)
9. [Development Guide](#development-guide)
10. [Troubleshooting](#troubleshooting)
11. [Deployment](#deployment)

---

## 📖 Project Overview

### About
UAF LMS is a comprehensive Learning Management System designed for the University of Agriculture Faisalabad. It provides students with a centralized platform to:
- View attendance records
- Check grades and academic performance
- Manage fee payments
- Access digital library resources
- Get AI-powered academic assistance
- Submit feedback

### Technology Stack

**Frontend:**
- **Framework:** Next.js 16.0.10 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** Custom components with Radix UI primitives
- **Charts:** Recharts
- **Animations:** Framer Motion
- **Icons:** Lucide React

**Backend:**
- **Runtime:** Node.js
- **Framework:** Express.js 5.2.1
- **Language:** JavaScript (CommonJS)
- **CORS:** Enabled for cross-origin requests
- **Body Parser:** JSON request parsing

### Features

#### Student Features
- 📊 **Dashboard:** Overview of attendance, GPA, and due fees
- 📅 **Attendance Tracking:** Subject-wise attendance records
- 📝 **Grades:** Detailed marks breakdown (Mid, Final, Sessional)
- 💰 **Fee Management:** View and track fee vouchers
- 📚 **Digital Library:** Access to books, journals, and e-books
- 🤖 **AI Assistant:** 24/7 academic help chatbot
- 💬 **Feedback System:** Submit suggestions and complaints

#### Admin Features
- 👥 **User Management:** View all users in the system
- 📈 **Statistics Dashboard:** System-wide analytics
- 📊 **Reports:** Student activity and performance metrics

---

## 🏗️ System Architecture

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Client Browser                        │
│                  (http://localhost:3000)                 │
└────────────────────────┬────────────────────────────────┘
                         │
                         │ HTTP Requests
                         │
┌────────────────────────▼────────────────────────────────┐
│                 Frontend (Next.js)                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Pages: Dashboard, Attendance, Grades, Fees...   │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Components: Cards, Buttons, Forms, Charts...    │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │
                         │ API Calls (fetch)
                         │
┌────────────────────────▼────────────────────────────────┐
│              Backend (Express.js)                        │
│                (http://localhost:5000)                   │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Routes: /api/auth, /api/student, /api/admin    │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Mock Data: users, attendance, grades, fees...   │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Project Structure

```
portal/
├── backend/
│   ├── node_modules/
│   ├── data.js              # Mock database
│   ├── server.js            # Express server
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   │   └── uaf-logo.png
│   ├── src/
│   │   ├── app/
│   │   │   ├── (portal)/    # Authenticated routes
│   │   │   │   ├── dashboard/
│   │   │   │   ├── attendance/
│   │   │   │   ├── grades/
│   │   │   │   ├── fees/
│   │   │   │   ├── library/
│   │   │   │   ├── feedback/
│   │   │   │   ├── admin/
│   │   │   │   └── layout.tsx
│   │   │   ├── layout.tsx   # Root layout
│   │   │   ├── page.tsx     # Login page
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── ui/          # Reusable UI components
│   │   │   └── AIAssistant.tsx
│   │   └── lib/
│   │       └── utils.ts
│   ├── package.json
│   └── next.config.ts
│
├── DOCUMENTATION.md         # This file
├── README.md               # Quick start guide
├── TEST_ACCOUNTS.md        # Test credentials
└── BACKEND_TEST_REPORT.md  # Test results
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** Version 18.x or higher
- **npm:** Version 9.x or higher
- **Operating System:** Windows, macOS, or Linux
- **Browser:** Chrome, Firefox, Safari, or Edge (latest versions)

### Installation

#### 1. Clone or Download the Project
```bash
cd C:\Users\Oogway\OneDrive\Desktop\portal
```

#### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

**Backend Dependencies:**
- express: ^5.2.1
- cors: ^2.8.5
- body-parser: ^2.2.1
- uuid: ^13.0.0
- dotenv: ^17.2.3

#### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

**Frontend Dependencies:**
- next: 16.0.10
- react: 19.2.1
- react-dom: 19.2.1
- typescript: ^5
- tailwindcss: ^4
- framer-motion: ^12.23.26
- recharts: ^3.5.1
- lucide-react: ^0.561.0

### Running the Application

#### Option 1: Manual Start (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
node server.js
```
Expected output:
```
Server running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Expected output:
```
▲ Next.js 16.0.10 (Turbopack)
- Local:        http://localhost:3000
✓ Ready in 2s
```

#### Option 2: PowerShell (Windows)

If you encounter execution policy errors:
```powershell
# Backend
cd backend
node server.js

# Frontend (new terminal)
cd frontend
powershell -ExecutionPolicy Bypass -Command "npm run dev"
```

### Accessing the Application

1. **Open Browser:** Navigate to http://localhost:3000
2. **Login:** Use test credentials (see below)
3. **Explore:** Navigate through different sections

### Test Credentials

**Primary Student Account:**
- Email: `ali.khan@uaf.edu.pk`
- Password: `password123`

**Other Student Accounts:** (all use password: `password123`)
- `fatima.bibi@uaf.edu.pk`
- `ahmed.hassan@uaf.edu.pk`
- `ayesha.malik@uaf.edu.pk`
- `usman.ali@uaf.edu.pk`

**Admin Account:**
- Email: `admin@uaf.edu.pk`
- Password: `admin`

---

## 🔧 Backend Documentation

### Server Configuration

**File:** `backend/server.js`

**Port:** 5000  
**CORS:** Enabled for all origins  
**Body Parser:** JSON format

### Data Storage

**File:** `backend/data.js`

The backend uses in-memory data storage with the following collections:

#### Users (6 total)
- 5 Students
- 1 Admin
- Fields: id, name, email, role, regId, avatar, password

#### Attendance (15 records)
- Subject-wise attendance for 4 students
- Fields: studentId, semester, subject, total, attended, percentage

#### Grades (4 students)
- Detailed marks breakdown
- Fields: studentId, semester, results[]
- Result fields: subject, grade, mid, final, sessional, total

#### Fees (12 vouchers)
- Various fee types for 5 students
- Fields: id, studentId, title, amount, status, dueDate

#### Library (20 items)
- Books, E-Books, and Journals
- Categories: Computer Science, Mathematics, Agriculture, Research, etc.
- Fields: id, title, author, type, category, link

#### Feedback (dynamic)
- User-submitted feedback
- Fields: id, rating, text, userId, date

### Middleware

**Authentication Middleware:**
```javascript
const authenticate = (req, res, next) => {
    const userId = req.headers['x-user-id'];
    if (userId) {
        req.user = users.find(u => u.id === userId);
    }
    next();
};
```

---

## 🎨 Frontend Documentation

### Routing Structure

**App Router (Next.js 13+):**

```
/                           → Login Page
/dashboard                  → Student Dashboard
/attendance                 → Attendance Records
/grades                     → Grade Report (Enhanced)
/marks                      → Marks Breakdown
/fees                       → Fee Vouchers
/library                    → Digital Library
/feedback                   → Feedback Form
/admin/dashboard            → Admin Dashboard (Stats & Actions)
/admin/panel                → Admin Panel (User Management)
```

### Layout Hierarchy

```
RootLayout (app/layout.tsx)
└── PortalLayout (app/(portal)/layout.tsx)
    ├── Sidebar Navigation
    ├── Header
    ├── AI Assistant
    └── Page Content
```

### Key Components

#### UI Components (`src/components/ui/`)
- **Button:** Customizable button with variants
- **Card:** Container with header, content, footer
- **Input:** Form input fields
- **Badge:** Status indicators
- **Avatar:** User profile images

#### Feature Components
- **AIAssistant:** Floating chatbot interface
- **Sidebar:** Navigation menu
- **StatsCard:** Dashboard metric cards
- **AttendanceChart:** Recharts area chart

### Styling System

**Design Tokens (globals.css):**
```css
--uaf-green: #006400      /* Primary brand color */
--uaf-accent: #FFD700     /* Secondary accent */
--uaf-dark: #1A1A1A       /* Text color */
--uaf-muted: #F5F5F5      /* Background */
```

**Tailwind Classes:**
- `glass-panel`: Glassmorphism effect
- `hover-lift`: Elevation on hover
- Custom font variables: `font-inter`, `font-poppins`

### State Management

**Client-Side State:**
- React `useState` for local component state
- `useEffect` for data fetching
- No global state management (simple app)

**Data Fetching Pattern:**
```typescript
useEffect(() => {
    fetch('http://localhost:5000/api/endpoint', {
        headers: { 'x-user-id': userId }
    })
    .then(res => res.json())
    .then(data => setData(data));
}, []);
```

---

## 📡 API Reference

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### POST `/api/auth/login`
Login with email and password.

**Request:**
```json
{
  "email": "ali.khan@uaf.edu.pk",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "1",
    "name": "Ali Khan",
    "email": "ali.khan@uaf.edu.pk",
    "role": "student",
    "regId": "2021-ag-1234",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Ali"
  },
  "token": "mock-jwt-token-1"
}
```

#### POST `/api/auth/google-mock`
Mock Google OAuth login.

**Request:**
```json
{
  "email": "ali.khan@uaf.edu.pk"
}
```

**Response:** Same as login

---

### Student Endpoints

#### GET `/api/student/dashboard`
Get dashboard statistics.

**Headers:**
```
x-user-id: 1
```

**Response:**
```json
{
  "attendance": "86%",
  "gpa": "3.1",
  "dueFees": "Rs. 500",
  "recentActivity": [
    {
      "id": 1,
      "text": "Marked present in Computer Science 101",
      "time": "2 hours ago"
    }
  ]
}
```

#### GET `/api/student/attendance`
Get attendance records.

**Headers:**
```
x-user-id: 1
```

**Response:**
```json
[
  {
    "studentId": "1",
    "semester": "Fall 2024",
    "subject": "Computer Science 101",
    "total": 20,
    "attended": 18,
    "percentage": 90
  }
]
```

#### GET `/api/student/grades`
Get grade records.

**Headers:**
```
x-user-id: 1
```

**Response:**
```json
[
  {
    "subject": "Data Structures",
    "grade": "A",
    "mid": 25,
    "final": 45,
    "sessional": 18,
    "total": 88
  }
]
```

#### GET `/api/student/fees`
Get fee vouchers.

**Headers:**
```
x-user-id: 1
```

**Response:**
```json
[
  {
    "id": "v1",
    "studentId": "1",
    "title": "Fall 2024 Semester Fee",
    "amount": 45000,
    "status": "Paid",
    "dueDate": "2024-09-15"
  }
]
```

#### GET `/api/student/grades-enhanced`
Get enhanced grade records with GPA points and credits.

**Headers:**
```
x-user-id: 1
```

**Response:**
```json
{
  "semesterGpa": "3.5",
  "cgpa": "3.4",
  "creditHours": 18,
  "results": [
    {
      "code": "CS-101",
      "subject": "Intro to CS",
      "grade": "A",
      "points": 4.0,
      "credit": 3,
      "marks": 85
    }
  ]
}
```

#### GET `/api/student/marks`
Get detailed marks breakdown per assessment type.

**Headers:**
```
x-user-id: 1
```

**Response:**
```json
[
  {
    "subject": "Computer Science 101",
    "assessments": [
      { "type": "Quiz 1", "obtained": 8, "total": 10 },
      { "type": "Assignment 1", "obtained": 9, "total": 10 },
      { "type": "Mid Term", "obtained": 25, "total": 30 },
      { "type": "Final Exam", "obtained": 40, "total": 50 }
    ]
  }
]

```

---

### Public Endpoints

#### GET `/api/library`
Get all library resources.

**Response:**
```json
[
  {
    "id": "l1",
    "title": "Introduction to Algorithms",
    "author": "Cormen, Leiserson, Rivest, Stein",
    "type": "Book",
    "category": "Computer Science",
    "link": "#"
  }
]
```

#### POST `/api/feedback`
Submit feedback.

**Request:**
```json
{
  "rating": 5,
  "text": "Great system!",
  "userId": "1"
}
```

**Response:**
```json
{
  "message": "Feedback submitted",
  "feedback": {
    "id": "uuid",
    "rating": 5,
    "text": "Great system!",
    "userId": "1",
    "date": "2024-12-13T..."
  }
}
```

---

### Admin Endpoints

#### GET `/api/admin/stats`
Get system statistics.

**Response:**
```json
{
  "totalStudents": 5,
  "activeThisWeek": 124,
  "avgGpa": "2.9"
}
```

#### GET `/api/admin/users`
Get all users.

**Response:**
```json
[
  {
    "id": "1",
    "name": "Ali Khan",
    "email": "ali.khan@uaf.edu.pk",
    "role": "student",
    "regId": "2021-ag-1234"
  }
]
```

---

## 🗄️ Database Schema

### Users Collection

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique identifier |
| name | String | Full name |
| email | String | Email address (@uaf.edu.pk) |
| role | String | "student" or "admin" |
| regId | String | Registration ID |
| avatar | String | Avatar URL |
| password | String | Plain text (mock only) |

### Attendance Collection

| Field | Type | Description |
|-------|------|-------------|
| studentId | String | Reference to user ID |
| semester | String | e.g., "Fall 2024" |
| subject | String | Subject name |
| total | Number | Total classes |
| attended | Number | Classes attended |
| percentage | Number | Attendance percentage |

### Grades Collection

| Field | Type | Description |
|-------|------|-------------|
| studentId | String | Reference to user ID |
| semester | String | e.g., "Spring 2024" |
| results | Array | Array of grade objects |

**Grade Object:**
| Field | Type | Description |
|-------|------|-------------|
| subject | String | Subject name |
| grade | String | Letter grade (A+, A, B+, etc.) |
| mid | Number | Midterm marks |
| final | Number | Final exam marks |
| sessional | Number | Sessional marks |
| total | Number | Total marks |

### Fees Collection

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique voucher ID |
| studentId | String | Reference to user ID |
| title | String | Fee description |
| amount | Number | Amount in PKR |
| status | String | "Paid" or "Pending" |
| dueDate | String | Due date (YYYY-MM-DD) |

### Library Collection

| Field | Type | Description |
|-------|------|-------------|
| id | String | Unique resource ID |
| title | String | Resource title |
| author | String | Author name |
| type | String | "Book", "E-Book", or "Journal" |
| category | String | Subject category |
| link | String | Resource link |

---

## 👤 User Guide

### For Students

#### Logging In
1. Navigate to http://localhost:3000
2. Enter your UAF email and password
3. Click "Sign In" or use "Continue with Google"

#### Viewing Dashboard
- See your attendance percentage
- Check current CGPA
- View due fees
- Review recent activity

#### Checking Attendance
1. Click "Attendance" in sidebar
2. View subject-wise breakdown
3. See total classes and attended classes
4. Check percentage for each subject

#### Viewing Grades
1. Click "Grades" in sidebar
2. See all subjects with marks
3. View Mid, Final, and Sessional marks
4. Check letter grades

#### Managing Fees
1. Click "Fees" in sidebar
2. View all fee vouchers
3. Check payment status
4. See due dates

#### Using Library
1. Click "Library" in sidebar
2. Browse available resources
3. Filter by category
4. Access books and journals

#### Getting AI Help
1. Click the AI Assistant bubble (bottom-right)
2. Type your question
3. Get instant responses
4. Ask about academics, courses, etc.

#### Submitting Feedback
1. Click "Feedback" in sidebar
2. Rate your experience (1-5 stars)
3. Write your feedback
4. Submit

### For Admins

#### Accessing Admin Module
1. Login with admin credentials
2. Automatically redirected to `/admin/dashboard`
3. Use Sidebar to toggle between Dashboard and Panel

#### Admin Dashboard (`/admin/dashboard`)
- **Stats:** Total Students, Active Users, Average GPA
- **Quick Actions:** Manage Users, View Reports, Fee Management, Analytics

#### Admin Panel (`/admin/panel`)
- **Detailed Stats:** Includes Faculty count
- **User Management:** Search, Filter by Role, Export CSV
- **User Table:** View name, email, department, role, and status logic

---

## 💻 Development Guide

### Adding a New Page

1. **Create Page File:**
```bash
frontend/src/app/(portal)/newpage/page.tsx
```

2. **Add Page Component:**
```tsx
"use client";

export default function NewPage() {
    return (
        <div>
            <h1>New Page</h1>
        </div>
    );
}
```

3. **Add Navigation Link:**
Update `frontend/src/app/(portal)/layout.tsx`

### Adding a New API Endpoint

1. **Open Backend Server:**
```bash
backend/server.js
```

2. **Add Route:**
```javascript
app.get('/api/new-endpoint', (req, res) => {
    res.json({ message: 'Hello' });
});
```

3. **Test Endpoint:**
```bash
curl http://localhost:5000/api/new-endpoint
```

### Adding Mock Data

1. **Open Data File:**
```bash
backend/data.js
```

2. **Add Data:**
```javascript
const newData = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
];

module.exports = { users, attendance, grades, fees, library, feedback, newData };
```

3. **Use in Server:**
```javascript
const { newData } = require('./data');

app.get('/api/newdata', (req, res) => {
    res.json(newData);
});
```

### Styling Guidelines

**Use Existing Design Tokens:**
```tsx
<div className="bg-uaf-green text-white">
    UAF Green Background
</div>
```

**Follow Component Patterns:**
```tsx
<Card className="glass-panel">
    <CardHeader>
        <CardTitle>Title</CardTitle>
    </CardHeader>
    <CardContent>
        Content here
    </CardContent>
</Card>
```

### Code Style

**TypeScript:**
- Use TypeScript for type safety
- Define interfaces for data structures
- Use proper typing for props

**React:**
- Use functional components
- Use hooks (useState, useEffect)
- Keep components small and focused

**CSS:**
- Use Tailwind utility classes
- Follow mobile-first approach
- Use custom classes for reusable styles

---

## 🔍 Troubleshooting

### Common Issues

#### 1. Backend Won't Start

**Error:** `Port 5000 already in use`

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /F /PID <PID>

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

#### 2. Frontend Won't Start

**Error:** `npm.ps1 cannot be loaded`

**Solution:**
```powershell
powershell -ExecutionPolicy Bypass -Command "npm run dev"
```

#### 3. No Data Showing

**Problem:** Frontend loads but no data appears

**Solution:**
1. Check if backend is running
2. Verify backend URL in frontend code
3. Check browser console for errors
4. Ensure CORS is enabled

#### 4. Hydration Mismatch Errors

**Error:** `Text content does not match server-rendered HTML`

**Solution:**
- Already fixed with `suppressHydrationWarning`
- Clear browser cache
- Restart dev server

#### 5. Chart Not Rendering

**Problem:** Attendance chart shows blank

**Solution:**
- Already fixed with client-side rendering
- Ensure `mounted` state is used
- Check browser console for errors

### Debug Mode

**Enable Verbose Logging:**

Backend:
```javascript
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});
```

Frontend:
```typescript
useEffect(() => {
    console.log('Component mounted');
    console.log('Data:', data);
}, [data]);
```

---

## 🚀 Deployment

### Production Build

#### Backend Deployment

1. **Prepare for Production:**
```bash
cd backend
npm install --production
```

2. **Environment Variables:**
Create `.env` file:
```
PORT=5000
NODE_ENV=production
```

3. **Start with PM2:**
```bash
npm install -g pm2
pm2 start server.js --name uaf-backend
```

#### Frontend Deployment

1. **Build for Production:**
```bash
cd frontend
npm run build
```

2. **Start Production Server:**
```bash
npm start
```

### Deployment Platforms

**Recommended Platforms:**

**Backend:**
- Heroku
- Railway
- Render
- DigitalOcean

**Frontend:**
- Vercel (recommended for Next.js)
- Netlify
- Cloudflare Pages

### Environment Configuration

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

**Backend (.env):**
```
PORT=5000
FRONTEND_URL=https://your-frontend-url.com
NODE_ENV=production
```

---

## 📊 Performance Optimization

### Backend Optimization
- Implement caching for frequently accessed data
- Use database instead of in-memory storage
- Add request rate limiting
- Compress responses with gzip

### Frontend Optimization
- Use Next.js Image component for images
- Implement lazy loading for routes
- Optimize bundle size
- Use React.memo for expensive components

---

## 🔐 Security Considerations

### Current Implementation (Development Only)
- ⚠️ Plain text passwords
- ⚠️ No real JWT implementation
- ⚠️ No input validation
- ⚠️ No rate limiting

### Production Requirements
- ✅ Hash passwords (bcrypt)
- ✅ Implement real JWT authentication
- ✅ Add input validation and sanitization
- ✅ Implement HTTPS
- ✅ Add CSRF protection
- ✅ Rate limit API endpoints
- ✅ Sanitize user inputs

---

## 📝 License

This project is developed for educational purposes for the University of Agriculture Faisalabad.

---

## 👥 Support

For issues or questions:
1. Check this documentation
2. Review test reports
3. Check browser console for errors
4. Verify both servers are running

---

## 📅 Version History

**Version 1.0.0** (December 13, 2024)
- Initial release
- Basic LMS functionality
- Mock data implementation
- Student and admin features
- AI Assistant integration
- Responsive design

---

**Last Updated:** December 13, 2024  
**Maintained By:** Development Team  
**Project Status:** Active Development
