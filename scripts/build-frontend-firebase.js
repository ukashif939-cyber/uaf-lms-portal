const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const frontendDir = path.join(__dirname, "..", "frontend");
const prodEnvPath = path.join(frontendDir, ".env.production");

/** Load .env.production only — never let .env.local override mobile/production builds */
function loadProductionEnv() {
  const env = { ...process.env, BUILD_FOR_FIREBASE: "1" };
  if (!fs.existsSync(prodEnvPath)) return env;
  const lines = fs.readFileSync(prodEnvPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (key.startsWith("NEXT_PUBLIC_") || key === "BUILD_FOR_FIREBASE") {
      env[key] = value;
    }
  }
  return env;
}

const buildEnv = loadProductionEnv();
console.log("Building frontend for Firebase with API:", buildEnv.NEXT_PUBLIC_API_BASE_URL || "(same-origin)");

execSync("npm run build", {
  cwd: frontendDir,
  stdio: "inherit",
  env: buildEnv,
});
