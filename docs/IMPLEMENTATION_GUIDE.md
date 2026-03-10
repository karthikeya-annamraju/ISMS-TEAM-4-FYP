# IntelliSub Backend Authentication System
## Complete Implementation Guide

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Project Setup](#project-setup)
3. [Database Configuration](#database-configuration)
4. [API Endpoints](#api-endpoints)
5. [Sample Requests & Responses](#sample-requests--responses)
6. [Testing the APIs](#testing-the-apis)
7. [Security Best Practices](#security-best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

### Layered Architecture

```
┌─────────────────────────────────────────┐
│      Controller Layer                   │
│  (AuthController - REST API)            │
└──────────────────┬──────────────────────┘
                   │ HTTP Request/Response
┌──────────────────▼──────────────────────┐
│      Service Layer                      │
│  (UserService - Business Logic)         │
│  - Password Encryption (BCrypt)         │
│  - Validation & Authentication          │
└──────────────────┬──────────────────────┘
                   │ Method calls
┌──────────────────▼──────────────────────┐
│      Repository Layer                   │
│  (UserRepository - Data Access)         │
│  - CRUD Operations                      │
│  - Custom Queries                       │
└──────────────────┬──────────────────────┘
                   │ Database queries
┌──────────────────▼──────────────────────┐
│      Database Layer                     │
│  MySQL / H2 Database                    │
│  - users table                          │
└─────────────────────────────────────────┘
```

### Data Flow for User Registration

```
React Frontend (Register Form)
        ↓
POST /api/auth/register/user
        ↓
AuthController.registerUser()
        ↓
UserService.registerUser()
        ├─ Validate input
        ├─ Check email uniqueness
        └─ Encrypt password with BCrypt
        ↓
UserRepository.save(user)
        ↓
MySQL/H2 Database
        ↓
LoginResponse (JSON) → React Frontend
```

### Data Flow for User Login

```
React Frontend (Login Form)
        ↓
POST /api/auth/login/user
        ↓
AuthController.loginUser()
        ↓
UserService.login()
        ├─ Find user by email
        ├─ Compare password using BCrypt
        └─ Return success/failure
        ↓
LoginResponse (JSON) → React Frontend
```

---

## Project Setup

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- MySQL 5.7+ OR (use H2 for quick testing)
- Git (optional)

### Step 1: Clone/Open Project
```bash
cd "c:\Users\hp\Desktop\Appu\Existing Project\demo"
```

### Step 2: Build the Project
```bash
# Clean build
mvn clean install

# If you have Maven installed globally:
mvn clean package
```

### Step 3: Start the Backend
```bash
# Using Maven
mvn spring-boot:run

# OR running the JAR directly
java -jar target/demo-0.0.1-SNAPSHOT.jar
```

**Expected Output:**
```
2026-01-25 10:30:00.123 INFO - SubscriptionApplication: Started in 4.567 seconds
```

Backend will be available at: `http://localhost:8080`

---

## Database Configuration

### Option 1: MySQL (Recommended for Production-like Development)

#### Setup MySQL Database
```bash
# 1. Open MySQL Command Line or MySQL Workbench
mysql -u root -p

# 2. Create database
CREATE DATABASE intellisubdb;

# 3. Verify
SHOW DATABASES;
```

#### Update application.properties
The following is already configured:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/intellisubdb?useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=Vaishnavi@5
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
```

**To change MySQL credentials:**
1. Update `spring.datasource.username` and `spring.datasource.password`
2. Restart the application

### Option 2: H2 In-Memory Database (Quick Testing)

H2 is perfect for quick testing without setting up MySQL.

#### Update application.properties
Uncomment this block in `application.properties`:
```properties
# -------- H2 Configuration --------
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

And comment out the MySQL configuration.

#### Access H2 Console
After starting the application, visit:
```
http://localhost:8080/h2-console
```

**H2 Console Login:**
- JDBC URL: `jdbc:h2:mem:testdb`
- User Name: `sa`
- Password: (leave empty)

#### View/Query Data in H2
```sql
-- View all tables
SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='PUBLIC';

-- View users
SELECT * FROM USERS;

-- Count users
SELECT COUNT(*) FROM USERS;
```

**⚠️ Important:** H2 is in-memory, so all data is lost when the application stops.

### Switching Between Databases

To switch from MySQL to H2:
1. Open `demo/src/main/resources/application.properties`
2. Comment out MySQL configuration (lines starting with `#`)
3. Uncomment H2 configuration
4. Save and restart the application

---

## API Endpoints

### Base URL
```
http://localhost:8080/api/auth
```

### Endpoints Summary

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---|
| POST | `/register/user` | Register new user | No |
| POST | `/register/admin` | Register new admin | No |
| POST | `/login/user` | User login | No |
| POST | `/login/admin` | Admin login | No |
| GET | `/health` | Health check | No |

---

## Sample Requests & Responses

### 1. User Registration

**Endpoint:** `POST /api/auth/register/user`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Success Response (HTTP 201 - Created):**
```json
{
  "success": true,
  "message": "USER registered successfully!",
  "userId": 1,
  "userName": "John Doe",
  "email": "john@example.com",
  "role": "USER",
  "createdAt": "2026-01-25T10:30:15.123456"
}
```

**Failure Response (HTTP 400 - Bad Request):**
```json
{
  "success": false,
  "message": "Email already registered. Please try with different email.",
  "userId": null,
  "userName": null,
  "email": null,
  "role": null,
  "createdAt": null
}
```

**Possible Error Messages:**
- `"Name is required."`
- `"Email is required."`
- `"Password is required."`
- `"Email already registered. Please try with different email."`
- `"Invalid role. Use 'USER' or 'ADMIN'."`

---

### 2. Admin Registration

**Endpoint:** `POST /api/auth/register/admin`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "AdminPassword123"
}
```

**Success Response (HTTP 201 - Created):**
```json
{
  "success": true,
  "message": "ADMIN registered successfully!",
  "userId": 2,
  "userName": "Admin User",
  "email": "admin@example.com",
  "role": "ADMIN",
  "createdAt": "2026-01-25T10:35:20.456789"
}
```

**Failure Response (HTTP 400 - Bad Request):**
```json
{
  "success": false,
  "message": "Email already registered. Please try with different email.",
  "userId": null,
  "userName": null,
  "email": null,
  "role": null,
  "createdAt": null
}
```

---

### 3. User Login

**Endpoint:** `POST /api/auth/login/user`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Success Response (HTTP 200 - OK):**
```json
{
  "success": true,
  "message": "Login successful!",
  "userId": 1,
  "userName": "John Doe",
  "email": "john@example.com",
  "role": "USER",
  "createdAt": "2026-01-25T10:30:15.123456"
}
```

**Failure Response (HTTP 401 - Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid email or password. Please check and try again.",
  "userId": null,
  "userName": null,
  "email": null,
  "role": null,
  "createdAt": null
}
```

---

### 4. Admin Login

**Endpoint:** `POST /api/auth/login/admin`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "AdminPassword123"
}
```

**Success Response (HTTP 200 - OK):**
```json
{
  "success": true,
  "message": "Login successful!",
  "userId": 2,
  "userName": "Admin User",
  "email": "admin@example.com",
  "role": "ADMIN",
  "createdAt": "2026-01-25T10:35:20.456789"
}
```

**Failure Response - Invalid Credentials (HTTP 401):**
```json
{
  "success": false,
  "message": "Invalid email or password. Please check and try again.",
  "userId": null,
  "userName": null,
  "email": null,
  "role": null,
  "createdAt": null
}
```

**Failure Response - Not an Admin (HTTP 401):**
```json
{
  "success": false,
  "message": "This account does not have admin privileges.",
  "userId": null,
  "userName": null,
  "email": null,
  "role": null,
  "createdAt": null
}
```

---

### 5. Health Check

**Endpoint:** `GET /api/auth/health`

**Request Headers:**
```
(No body needed)
```

**Success Response (HTTP 200):**
```
Backend is running and healthy! ✓
```

---

## Testing the APIs

### Using Postman

1. **Download Postman** from https://www.postman.com/downloads/

2. **Create a new request:**
   - Method: `POST`
   - URL: `http://localhost:8080/api/auth/register/user`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "name": "John Doe",
       "email": "john@example.com",
       "password": "SecurePassword123"
     }
     ```
   - Click **Send**

3. **Save responses** for testing login later

### Using cURL (Command Line)

**Register User:**
```bash
curl -X POST http://localhost:8080/api/auth/register/user \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123"
  }'
```

**Login User:**
```bash
curl -X POST http://localhost:8080/api/auth/login/user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123"
  }'
```

**Health Check:**
```bash
curl http://localhost:8080/api/auth/health
```

### Using JavaScript/Fetch API (React Frontend)

```javascript
// Register User
async function registerUser(name, email, password) {
  const response = await fetch('http://localhost:8080/api/auth/register/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      password
    })
  });
  
  const data = await response.json();
  console.log(data);
  return data;
}

// Login User
async function loginUser(email, password) {
  const response = await fetch('http://localhost:8080/api/auth/login/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password
    })
  });
  
  const data = await response.json();
  console.log(data);
  
  if (data.success) {
    // Store userId in localStorage for later use
    localStorage.setItem('userId', data.userId);
    localStorage.setItem('userRole', data.role);
  }
  
  return data;
}
```

---

## Security Best Practices

### 1. Password Encryption

**Current Implementation:**
- Uses BCrypt with automatic salt generation
- Each password is hashed individually
- Passwords are never stored in plain text

**BCrypt Strength:**
- Cost factor: 10 (default)
- Computation time: ~100ms per password
- Resistant to rainbow table attacks

### 2. Email Uniqueness

**Current Implementation:**
- Database constraint: `@Column(unique = true)`
- Application validation: `existsByEmail()` check before registration
- Prevents duplicate accounts

### 3. Input Validation

**Current Validations:**
```java
- Non-null/non-empty name
- Non-null/non-empty email
- Non-null/non-empty password
- Valid role (USER or ADMIN)
```

### 4. For Production (Not Currently Implemented)

⚠️ **Future Enhancements Needed:**

1. **JWT Authentication**
   ```java
   // Instead of returning user details, return JWT token
   return new JwtResponse(token, refreshToken, expiresIn);
   ```

2. **HTTPS/SSL**
   ```properties
   server.ssl.key-store=classpath:keystore.jks
   server.ssl.key-store-password=your-password
   ```

3. **Rate Limiting**
   - Prevent brute force login attempts
   - Max 5 login attempts per 15 minutes

4. **Password Requirements**
   - Minimum 8 characters
   - At least 1 uppercase letter
   - At least 1 number
   - At least 1 special character

5. **Two-Factor Authentication (2FA)**
   - OTP via email or SMS

6. **Audit Logging**
   - Log all login attempts
   - Log registration
   - Log failed authentications

---

## Troubleshooting

### Issue 1: "Connection refused" when starting backend

**Cause:** MySQL is not running or not accessible

**Solution:**
```bash
# Option 1: Start MySQL service
# Windows:
net start MySQL80  # or your MySQL version

# macOS:
brew services start mysql

# Option 2: Switch to H2 in-memory database (temporary)
# Uncomment H2 config in application.properties
```

### Issue 2: "Email already registered" on first registration

**Cause:** Database still has data from previous run

**Solution:**
```bash
# Option 1: Clear MySQL database
mysql> DROP DATABASE intellisubdb;
mysql> CREATE DATABASE intellisubdb;

# Option 2: If using H2, restart the application (data is lost on restart)

# Option 3: Use different email for testing
```

### Issue 3: Login returns "Invalid email or password" for correct credentials

**Possible Causes:**
- Password was changed after registration
- BCrypt hashing issue
- Database connection lost

**Debug Steps:**
1. Check if user exists in database:
   ```sql
   SELECT * FROM USERS WHERE email = 'john@example.com';
   ```
2. Verify password is not NULL
3. Check application logs for exceptions
4. Try registering again and logging in immediately

### Issue 4: CORS Error in Browser Console

**Error Message:**
```
Access to XMLHttpRequest at 'http://localhost:8080/...' from origin 
'http://localhost:5173' has been blocked by CORS policy
```

**Solution:**
1. Verify CORS is enabled in AuthController:
   ```java
   @CrossOrigin(origins = "http://localhost:5173")
   ```
2. Ensure frontend is running on port 5173
3. If using different port, update CORS origins
4. Clear browser cache and reload

### Issue 5: Port 8080 already in use

**Solution:**
```bash
# Option 1: Change port in application.properties
server.port=8081

# Option 2: Kill process using port 8080
# Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :8080
kill -9 <PID>
```

### Issue 6: Build fails with "Java version not supported"

**Cause:** Java version < 17

**Solution:**
```bash
# Check Java version
java -version

# Set JAVA_HOME to Java 17+
# Windows:
set JAVA_HOME=C:\Program Files\Java\jdk-17

# macOS/Linux:
export JAVA_HOME=/usr/libexec/java_home -v 17
```

---

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Sample Data

```sql
-- User (password: "password123" encrypted with BCrypt)
INSERT INTO users (name, email, password, role) VALUES 
('John Doe', 'john@example.com', '$2a$10$...encrypted...', 'USER');

-- Admin (password: "admin123" encrypted with BCrypt)
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@example.com', '$2a$10$...encrypted...', 'ADMIN');
```

---

## Next Steps

1. **Connect React Frontend**
   - Use provided JavaScript/Fetch examples
   - Store userId and role in localStorage
   - Implement logout functionality

2. **Add JWT Authentication**
   - Return JWT token on successful login
   - Validate token on protected endpoints
   - Implement token refresh mechanism

3. **Implement Protected Endpoints**
   - Create user profile endpoint
   - Add admin-only endpoints
   - Use Spring Security for authorization

4. **Add Email Verification**
   - Send verification email on registration
   - Mark email as verified before allowing login

5. **Implement Role-Based Access Control (RBAC)**
   - Restrict certain endpoints to ADMIN users only
   - Use `@PreAuthorize("hasRole('ADMIN')")`

---

## Files Modified/Created

```
demo/
├── pom.xml (Added BCrypt & H2 dependencies)
├── src/main/
│   ├── java/com/example/subscription/
│   │   ├── controller/
│   │   │   └── AuthController.java (NEW - REST API endpoints)
│   │   ├── dto/
│   │   │   ├── RegisterRequest.java (NEW)
│   │   │   ├── LoginRequest.java (NEW)
│   │   │   └── LoginResponse.java (NEW)
│   │   ├── entity/
│   │   │   └── User.java (UPDATED - Added password, timestamps)
│   │   ├── repository/
│   │   │   └── UserRepository.java (UPDATED - Added custom queries)
│   │   └── service/
│   │       └── UserService.java (UPDATED - Added auth methods)
│   └── resources/
│       └── application.properties (UPDATED - Database config options)
└── IMPLEMENTATION_GUIDE.md (THIS FILE)
```

---

## Contact & Support

For issues or questions about the implementation:
1. Check the Troubleshooting section above
2. Review the code comments for detailed explanations
3. Check Spring Boot documentation: https://spring.io/projects/spring-boot
4. Check MySQL documentation: https://dev.mysql.com/doc/

---

**Last Updated:** January 25, 2026
