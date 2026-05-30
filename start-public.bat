@echo off
echo === UAF LMS Public Demo Link ===
cd /d "%~dp0"

echo.
echo [1/3] Building frontend (if needed)...
if not exist "frontend\out\login.html" (
  cd frontend
  call npm run build
  if errorlevel 1 exit /b 1
  cd ..
)

echo.
echo [2/3] Starting production server on port 5000...
start "UAF LMS Server" cmd /k "cd /d %~dp0backend && node production.js"

timeout /t 3 /nobreak >nul

echo.
echo [3/3] Starting Cloudflare tunnel...
echo.
echo Your public link will appear below (https://....trycloudflare.com)
echo Keep this window open during your presentation.
echo.
npx --yes cloudflared tunnel --url http://localhost:5000
