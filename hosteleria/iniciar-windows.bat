@echo off
title TPV Hosteleria
cd /d "%~dp0"
echo.
echo  ============================================
echo   Arrancando TPV Hosteleria...
echo   Abre el navegador en: http://localhost:3000
echo  ============================================
echo.
node --experimental-sqlite server.js
pause
