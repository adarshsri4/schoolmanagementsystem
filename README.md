# Sunrise Public School — Website + Java Backend Starter

This project contains the responsive school website prototype and a Java Spring Boot REST API starter.

## Website frontend
1. Extract the ZIP.
2. Open `index.html` in a browser or use VS Code Live Server.
3. The current frontend keeps demo submissions in that browser's localStorage. It is not yet connected to the REST API automatically.

## Java backend (Spring Boot)
Requirements: Java 17+ and Maven.

1. Open a terminal in the `backend` folder.
2. Run `mvn spring-boot:run`.
3. The API starts at `http://localhost:8080` and uses a local file-based H2 database by default, so MySQL is not required for the first run.
4. H2 console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:file:./data/sunrise-school`, user `sa`, blank password). Do not expose this console publicly.

### API examples
Create admission:
```bash
curl -X POST http://localhost:8080/api/admissions -H "Content-Type: application/json" -d '{"studentName":"Aarav Sharma","parentName":"Ravi Sharma","email":"parent@example.com","phone":"9876543210","requestedClass":"Class 1","address":"Delhi"}'
```
Check application status (replace the application number returned by the API):
```bash
curl http://localhost:8080/api/admissions/SPS-XXXXXXXX
```
Create a demo payment record (NO money is charged):
```bash
curl -X POST http://localhost:8080/api/payments/demo -H "Content-Type: application/json" -d '{"studentId":"SPS2026001","studentName":"Aarav Sharma","feeType":"tuition"}'
```
Fetch demo payment reference:
```bash
curl http://localhost:8080/api/payments/DEMO-XXXXXXXX
```

## Switch to MySQL
Create a database named `sunrise_school`, then edit `backend/src/main/resources/application.properties`: comment out the H2 datasource settings and uncomment the MySQL settings. Set `DB_USERNAME` and `DB_PASSWORD` environment variables. Do not commit real credentials.

## Important limitations / production checklist
- The frontend currently uses browser localStorage; wire its forms to the API before relying on the backend database.
- The payment endpoint is deliberately demo-only. It records a demo payment intent and never charges money.
- Real payment requires a merchant account, server-created gateway order, signature verification and verified webhooks. Never mark a payment successful based only on frontend input.
- Before production, add Spring Security, role-based access, password hashing, rate limiting, restricted CORS, HTTPS, document upload validation, audit logs, backups, and privacy/legal review. Do not expose student records or the H2 console publicly.
- Replace sample school name, contact information, notices, fees and images before deployment.
