@echo off
echo === UAF LMS Firebase Deploy ===
cd /d "%~dp0"

echo.
echo Checking Firebase login...
call npx firebase-tools login:list 2>nul | findstr /C:"No authorized" >nul
if %errorlevel%==0 (
  echo.
  echo Please log in to Firebase first:
  call npx firebase-tools login
  if errorlevel 1 exit /b 1
)

echo.
echo [1/4] Preparing backend for Cloud Functions...
node scripts\prepare-firebase-deploy.js
if errorlevel 1 exit /b 1

echo.
echo [2/4] Building frontend (static export)...
cd frontend
call npm run build
if errorlevel 1 exit /b 1
cd ..

echo.
echo [3/4] Installing function dependencies...
cd functions
call npm install
if errorlevel 1 exit /b 1
cd ..

echo.
echo [4/4] Deploying to Firebase (hosting + functions)...
call npx firebase-tools deploy --project uaf-lms-main
if errorlevel 1 exit /b 1

echo.
echo === Deploy complete ===
echo App:  https://uaf-lms-main.web.app/login
echo API:  https://uaf-lms-main.web.app/api/health
echo.
pause
