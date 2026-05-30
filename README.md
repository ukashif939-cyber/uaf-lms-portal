# UAF LMS - Final Year Project

A comprehensive Learning Management System for the University of Agriculture Faisalabad.

## 🚀 Quick Start

### 1. Start the Backend
The backend serves the API and mock data.
```bash
cd backend
npm install  # (If not already installed)
node server.js
```
Server will run on `http://localhost:5000`.

### 2. Start the Frontend
The frontend is built with Next.js.
```bash
cd frontend
npm install  # (If not already installed)
npm run dev
```
App will run on `http://localhost:3000`.

## 🔑 Login Credentials

Use the following demo account to log in:
- **Email:** `ali.khan@uaf.edu.pk`
- **Password:** `password123`

**Admin Account:**
- **Email:** `admin@uaf.edu.pk`
- **Password:** `admin`

## 🛠 Features

- **Student Dashboard:** View attendance, GPA, fees, and activity.
- **Attendance Report:** Detailed subject-wise breakdown.
- **Fees:** View vouchers and payment status.
- **Digital Library:** access books and journals.
- **AI Assistant:** Instant academic help (bottom-right bubble).
- **Admin Module:** Dedicated Dashboard and Panel for management (`/admin`).

## 🎨 Design System

- **Primary Color:** UAF Green (`#006400`)
- **Fonts:** Inter & Poppins
- **UI:** Glassmorphism, Rounded Cards, Smooth Animations.

## 📂 Project Structure

- `frontend/`: Next.js App Router application.
- `backend/`: Node.js Express API.
- `src/components/`: Reusable UI components.
- `src/app/(portal)/`: Authenticated routes.
