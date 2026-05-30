/**
 * Production server: API + static frontend on one port (same as Firebase hosting setup).
 * Run: node production.js
 */
const path = require("path");
const express = require("express");
const app = require("./server");

const PORT = Number(process.env.PORT || 5000);
const frontendDir = path.join(__dirname, "..", "frontend", "out");

app.use(express.static(frontendDir));

// SPA fallback — all non-API routes serve index.html
app.use((req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api")) return next();
  res.sendFile(path.join(frontendDir, "index.html"), (err) => {
    if (err) res.status(404).send("Frontend not built. Run: cd frontend && npm run build");
  });
});

app.listen(PORT, () => {
  console.log(`UAF LMS production server: http://localhost:${PORT}`);
  console.log(`Login: http://localhost:${PORT}/login`);
});
