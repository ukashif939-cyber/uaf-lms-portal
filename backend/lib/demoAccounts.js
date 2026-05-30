/**
 * Demo accounts that can log in (email/password or Google).
 * All other DB users are display-only for admin dashboard.
 */
const DEMO_STUDENTS_UAF = [
  { email: "ali.khan@uaf.edu.pk", password: "password123", name: "Ali Khan", regId: "2021-ag-1234" },
  { email: "fatima.bibi@uaf.edu.pk", password: "password123", name: "Fatima Bibi", regId: "2021-ag-5678" },
  { email: "ahmed.hassan@uaf.edu.pk", password: "password123", name: "Ahmed Hassan", regId: "2022-ag-2345" },
  { email: "ayesha.malik@uaf.edu.pk", password: "password123", name: "Ayesha Malik", regId: "2022-ag-3456" },
  { email: "usman.ali@uaf.edu.pk", password: "password123", name: "Usman Ali", regId: "2023-ag-4567" },
];

const DEMO_GOOGLE_STUDENTS = [
  {
    email: "ukashif939@gmail.com",
    firstName: "Ukashif",
    lastName: "Khan",
    registrationId: "2024-cs-0939",
    cloneFrom: "ali.khan@uaf.edu.pk",
  },
  {
    email: "muneebaiengineer@gmail.com",
    firstName: "Muneeba",
    lastName: "Engineer",
    registrationId: "2024-cs-1001",
    cloneFrom: "fatima.bibi@uaf.edu.pk",
  },
  {
    email: "zeeshananjumjalil@gmail.com",
    firstName: "Zeeshan",
    lastName: "Anjum",
    registrationId: "2024-cs-1002",
    cloneFrom: "ahmed.hassan@uaf.edu.pk",
  },
];

const DEMO_ADMIN = { email: "admin@uaf.edu.pk", password: "admin", name: "Admin User", regId: "ADMIN-001" };

const ALLOWED_EMAILS = new Set([
  ...DEMO_STUDENTS_UAF.map((s) => s.email),
  ...DEMO_GOOGLE_STUDENTS.map((s) => s.email),
  DEMO_ADMIN.email,
]);

function isDemoAccount(email) {
  return ALLOWED_EMAILS.has((email || "").toLowerCase());
}

module.exports = {
  DEMO_STUDENTS_UAF,
  DEMO_GOOGLE_STUDENTS,
  DEMO_ADMIN,
  ALLOWED_EMAILS,
  isDemoAccount,
};
