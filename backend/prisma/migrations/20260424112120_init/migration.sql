-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'TEACHER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LEAVE', 'LATE');

-- CreateEnum
CREATE TYPE "AssessmentType" AS ENUM ('QUIZ', 'ASSIGNMENT', 'MID_TERM', 'FINAL_EXAM', 'LAB', 'PROJECT', 'PRESENTATION');

-- CreateEnum
CREATE TYPE "FeeType" AS ENUM ('TUITION', 'HOSTEL', 'EXAMINATION', 'LIBRARY', 'SPORTS', 'REGISTRATION', 'OTHER');

-- CreateEnum
CREATE TYPE "FeeStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'WAIVED');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('BOOK', 'EBOOK', 'JOURNAL', 'THESIS', 'MAGAZINE', 'VIDEO_LECTURE');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('FEE_REMINDER', 'ATTENDANCE_ALERT', 'GRADE_RELEASED', 'SURVEY_INVITE', 'GENERAL', 'AI_INSIGHT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "googleId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "gender" "Gender",
    "nic" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "profileImageUrl" TEXT,
    "registrationId" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "program" TEXT NOT NULL,
    "currentSemester" INTEGER NOT NULL DEFAULT 1,
    "enrollmentYear" INTEGER NOT NULL,
    "expectedGradYear" INTEGER,
    "cgpa" DOUBLE PRECISION DEFAULT 0.0,
    "isHostelResident" BOOLEAN NOT NULL DEFAULT false,
    "hostelBlock" TEXT,
    "roomNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "creditHours" INTEGER NOT NULL,
    "department" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherCourse" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "session" TEXT NOT NULL,

    CONSTRAINT "TeacherCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "session" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'PRESENT',
    "remarks" TEXT,
    "markedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mark" (
    "id" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "type" "AssessmentType" NOT NULL,
    "title" TEXT NOT NULL,
    "obtainedMarks" DOUBLE PRECISION NOT NULL,
    "totalMarks" DOUBLE PRECISION NOT NULL,
    "weightPercent" DOUBLE PRECISION NOT NULL,
    "conductedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grade" (
    "id" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "letterGrade" TEXT NOT NULL,
    "gradePoints" DOUBLE PRECISION NOT NULL,
    "totalMarksObt" DOUBLE PRECISION NOT NULL,
    "totalMarksMax" DOUBLE PRECISION NOT NULL,
    "session" TEXT NOT NULL,
    "isReleased" BOOLEAN NOT NULL DEFAULT false,
    "releasedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeeVoucher" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "voucherNo" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" "FeeType" NOT NULL DEFAULT 'TUITION',
    "status" "FeeStatus" NOT NULL DEFAULT 'PENDING',
    "semester" INTEGER NOT NULL,
    "session" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "paidAmount" DOUBLE PRECISION,
    "bankRef" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeeVoucher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LibraryResource" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "type" "ResourceType" NOT NULL,
    "category" TEXT NOT NULL,
    "isbn" TEXT,
    "publishYear" INTEGER,
    "edition" TEXT,
    "url" TEXT,
    "totalCopies" INTEGER NOT NULL DEFAULT 1,
    "availCopies" INTEGER NOT NULL DEFAULT 1,
    "thumbnailUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LibraryResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LibraryBorrowing" (
    "id" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "borrowedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "returnedAt" TIMESTAMP(3),
    "fineAmount" DOUBLE PRECISION DEFAULT 0,

    CONSTRAINT "LibraryBorrowing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "courseId" TEXT,
    "category" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "sentiment" TEXT,
    "aiSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Survey" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "questions" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyResponse" (
    "id" TEXT NOT NULL,
    "surveyId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveyResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'GENERAL',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "sentViaEmail" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "feature" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "tokens" INTEGER,
    "latencyMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_registrationId_key" ON "Profile"("registrationId");

-- CreateIndex
CREATE INDEX "Profile_registrationId_idx" ON "Profile"("registrationId");

-- CreateIndex
CREATE INDEX "Profile_department_idx" ON "Profile"("department");

-- CreateIndex
CREATE UNIQUE INDEX "Course_code_key" ON "Course"("code");

-- CreateIndex
CREATE INDEX "Course_department_idx" ON "Course"("department");

-- CreateIndex
CREATE INDEX "Course_semester_idx" ON "Course"("semester");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherCourse_teacherId_courseId_session_key" ON "TeacherCourse"("teacherId", "courseId", "session");

-- CreateIndex
CREATE INDEX "Enrollment_studentId_idx" ON "Enrollment"("studentId");

-- CreateIndex
CREATE INDEX "Enrollment_session_idx" ON "Enrollment"("session");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_studentId_courseId_session_key" ON "Enrollment"("studentId", "courseId", "session");

-- CreateIndex
CREATE INDEX "Attendance_date_idx" ON "Attendance"("date");

-- CreateIndex
CREATE INDEX "Attendance_status_idx" ON "Attendance"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_enrollmentId_date_key" ON "Attendance"("enrollmentId", "date");

-- CreateIndex
CREATE INDEX "Mark_enrollmentId_idx" ON "Mark"("enrollmentId");

-- CreateIndex
CREATE INDEX "Mark_type_idx" ON "Mark"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Grade_enrollmentId_key" ON "Grade"("enrollmentId");

-- CreateIndex
CREATE INDEX "Grade_session_idx" ON "Grade"("session");

-- CreateIndex
CREATE UNIQUE INDEX "FeeVoucher_voucherNo_key" ON "FeeVoucher"("voucherNo");

-- CreateIndex
CREATE INDEX "FeeVoucher_studentId_idx" ON "FeeVoucher"("studentId");

-- CreateIndex
CREATE INDEX "FeeVoucher_status_idx" ON "FeeVoucher"("status");

-- CreateIndex
CREATE INDEX "FeeVoucher_dueDate_idx" ON "FeeVoucher"("dueDate");

-- CreateIndex
CREATE INDEX "LibraryResource_type_idx" ON "LibraryResource"("type");

-- CreateIndex
CREATE INDEX "LibraryResource_category_idx" ON "LibraryResource"("category");

-- CreateIndex
CREATE INDEX "LibraryBorrowing_studentId_idx" ON "LibraryBorrowing"("studentId");

-- CreateIndex
CREATE INDEX "Feedback_studentId_idx" ON "Feedback"("studentId");

-- CreateIndex
CREATE INDEX "Feedback_category_idx" ON "Feedback"("category");

-- CreateIndex
CREATE INDEX "Feedback_rating_idx" ON "Feedback"("rating");

-- CreateIndex
CREATE INDEX "SurveyResponse_surveyId_idx" ON "SurveyResponse"("surveyId");

-- CreateIndex
CREATE UNIQUE INDEX "SurveyResponse_surveyId_studentId_key" ON "SurveyResponse"("surveyId", "studentId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- CreateIndex
CREATE INDEX "AiLog_userId_idx" ON "AiLog"("userId");

-- CreateIndex
CREATE INDEX "AiLog_feature_idx" ON "AiLog"("feature");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherCourse" ADD CONSTRAINT "TeacherCourse_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherCourse" ADD CONSTRAINT "TeacherCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mark" ADD CONSTRAINT "Mark_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeVoucher" ADD CONSTRAINT "FeeVoucher_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LibraryBorrowing" ADD CONSTRAINT "LibraryBorrowing_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "LibraryResource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyResponse" ADD CONSTRAINT "SurveyResponse_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyResponse" ADD CONSTRAINT "SurveyResponse_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiLog" ADD CONSTRAINT "AiLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
