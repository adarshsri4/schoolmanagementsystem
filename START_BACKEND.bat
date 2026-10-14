@echo off
setlocal
cd /d "%~dp0backend"
echo Starting Sunrise Public School Spring Boot backend...
echo Keep this window open while testing the website.
echo.
where mvn >nul 2>nul
if errorlevel 1 (
  echo Maven was not found. Install Apache Maven and make sure 'mvn' works in a new Command Prompt.
  echo Download: https://maven.apache.org/download.cgi
  pause
  exit /b 1
)
java -version
if errorlevel 1 (
  echo Java is not installed or is not on PATH. Install JDK 17 or newer.
  pause
  exit /b 1
)
mvn spring-boot:run
pause
