/**
 * Copies backend into functions/backend for Firebase Cloud Functions deploy.
 */
const { cpSync, rmSync, existsSync, mkdirSync } = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const backendSrc = path.join(root, "backend");
const backendDest = path.join(root, "functions", "backend");

function copyBackend() {
  if (existsSync(backendDest)) rmSync(backendDest, { recursive: true, force: true });
  mkdirSync(path.join(root, "functions"), { recursive: true });

  cpSync(backendSrc, backendDest, {
    recursive: true,
    filter: (src) => {
      const rel = src.replace(/\\/g, "/");
      if (rel.includes("/node_modules")) return false;
      if (rel.includes("/scripts/test")) return false;
      return true;
    },
  });

  const dbSrc = path.join(backendSrc, "prisma", "dev.db");
  const dbDest = path.join(backendDest, "prisma", "dev.db");
  if (existsSync(dbSrc)) {
    const { copyFileSync, mkdirSync } = require("fs");
    mkdirSync(path.dirname(dbDest), { recursive: true });
    copyFileSync(dbSrc, dbDest);
    console.log("✅ Copied prisma/dev.db for Cloud Functions");
  } else {
    console.warn("⚠️  backend/prisma/dev.db missing — run: cd backend && npm run setup:demo");
  }

  console.log("✅ Copied backend → functions/backend");
}

copyBackend();
