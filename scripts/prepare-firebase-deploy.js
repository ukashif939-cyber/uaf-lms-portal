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

  console.log("✅ Copied backend → functions/backend");
}

copyBackend();
