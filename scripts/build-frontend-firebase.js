const { execSync } = require("child_process");
const path = require("path");

process.env.BUILD_FOR_FIREBASE = "1";
execSync("npm run build", {
  cwd: path.join(__dirname, "..", "frontend"),
  stdio: "inherit",
  env: { ...process.env, BUILD_FOR_FIREBASE: "1" },
});
