const { onRequest } = require("firebase-functions/v2/https");
const path = require("path");

process.env.DATABASE_URL =
  process.env.DATABASE_URL ||
  `file:${path.join(__dirname, "backend", "prisma", "dev.db")}`;
process.env.FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "uaf-lms-main";

const app = require("./backend/server");

exports.api = onRequest(
  {
    region: "us-central1",
    memory: "512MiB",
    timeoutSeconds: 60,
    maxInstances: 10,
  },
  app
);
