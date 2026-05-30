const { execSync } = require("child_process");
const path = require("path");

process.env.BUILD_FOR_FIREBASE = "1";
process.env.NEXT_PUBLIC_API_BASE_URL = "";

execSync("npm run build", {
  cwd: path.join(__dirname, "..", "frontend"),
  stdio: "inherit",
  env: { ...process.env, BUILD_FOR_FIREBASE: "1", NEXT_PUBLIC_API_BASE_URL: "" },
});
