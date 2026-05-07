@echo off
echo ============================================================
echo  EventSphere - Full Stack Startup Script
echo ============================================================
echo.

REM --- Start Backend ---
echo [1/2] Launching Backend (Node.js)...
start "EventSphere Backend" cmd /k "cd server && npm run dev"

REM --- Start Frontend ---
echo [2/2] Launching Frontend (Vite)...
start "EventSphere Frontend" cmd /k "cd client && npm run dev"

echo.
echo ============================================================
echo  Application is starting!
echo  Backend: http://localhost:5001
echo  Frontend: http://localhost:5173
echo ============================================================
pause
