# 🚀 Quick Start Guide

## 5-Minute Backend Setup

### Prerequisites
- Java 17+ installed
- Maven installed (or use `mvn` from project directory)
- MySQL running (or use H2 for quick testing)

### Step 1: Navigate to Project
```bash
cd "c:\Users\hp\Desktop\Appu\Existing Project\demo"
```

### Step 2: Build & Run
```bash
# Build
mvn clean install

# Run
mvn spring-boot:run
```

**You should see:**
```
Started SubscriptionApplication in 5.234 seconds
```

✅ Backend is running on `http://localhost:8080`

---

## Test the APIs (Using Postman or cURL)

### Test 1: Health Check
```bash
curl http://localhost:8080/api/auth/health
```
**Expected:** `Backend is running and healthy! ✓`

### Test 2: Register User
```bash
curl -X POST http://localhost:8080/api/auth/register/user \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"pass123"}'
```
**Expected:** Success response with `userId`, `userName`, `role: "USER"`

### Test 3: Login User
```bash
curl -X POST http://localhost:8080/api/auth/login/user \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass123"}'
```
**Expected:** Same user details returned

---

## Database

### Using MySQL
Database `intellisubdb` will be created automatically.

**View data:**
```bash
mysql -u root -p
mysql> USE intellisubdb;
mysql> SELECT * FROM users;
```

### Using H2 (No Setup Needed!)
1. Uncomment H2 config in `application.properties`
2. Restart backend
3. Visit `http://localhost:8080/h2-console`
   - JDBC URL: `jdbc:h2:mem:testdb`
   - User: `sa`
   - Password: (leave empty)

---

## Project Structure

```
demo/
├── src/main/java/com/example/subscription/
│   ├── controller/
│   │   └── AuthController.java ← REST APIs
│   ├── service/
│   │   └── UserService.java ← Business logic
│   ├── entity/
│   │   └── User.java ← Database model
│   ├── repository/
│   │   └── UserRepository.java ← Database queries
│   └── dto/
│       ├── RegisterRequest.java
│       ├── LoginRequest.java
│       └── LoginResponse.java
└── src/main/resources/
    └── application.properties ← Config
```

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/register/user` | POST | Register user |
| `/api/auth/register/admin` | POST | Register admin |
| `/api/auth/login/user` | POST | User login |
| `/api/auth/login/admin` | POST | Admin login |
| `/api/auth/health` | GET | Health check |

---

## Common Issues & Fixes

### ❌ "Connection refused"
**Fix:** Start MySQL or switch to H2 in `application.properties`

### ❌ "Email already registered"
**Fix:** Use different email or clear database

### ❌ "Port 8080 already in use"
**Fix:** Change port in `application.properties`: `server.port=8081`

### ❌ "Java version not supported"
**Fix:** Ensure Java 17+ is installed: `java -version`

---

## Next Steps

1. **Connect React Frontend** → See `FRONTEND_INTEGRATION_GUIDE.js`
2. **Read Full Guide** → See `IMPLEMENTATION_GUIDE.md`
3. **Implement JWT** → Add token-based authentication
4. **Add Email Verification** → Verify emails before login

---

## File Locations

- 📄 Implementation Guide: `/IMPLEMENTATION_GUIDE.md`
- 📄 Frontend Integration: `/FRONTEND_INTEGRATION_GUIDE.js`
- 🔧 Application Config: `/demo/src/main/resources/application.properties`
- 🏗️ Source Code: `/demo/src/main/java/com/example/subscription/`

---

**Happy Coding! 🎉**
