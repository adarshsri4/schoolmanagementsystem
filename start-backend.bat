@echo off
setlocal
cd /d "%~dp0"
where mvn >nul 2>nul
if errorlevel 1 (
  echo Maven was not found. Install Apache Maven, then reopen this terminal.
  echo Download: https://maven.apache.org/download.cgi
  echo Check installation with: mvn -version
  pause
  exit /b 1
)
where java >nul 2>nul
if errorlevel 1 (
  echo Java was not found. Install JDK 17 or newer and reopen this terminal.
  pause
  exit /b 1
)
echo Starting School Management System backend on http://localhost:8080 ...
mvn spring-boot:run
pause
