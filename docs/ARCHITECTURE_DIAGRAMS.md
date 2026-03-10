# Backend System Architecture Diagrams

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                               │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  React Frontend (Port 5173)                                  │   │
│  │  ┌─────────────────────────────────────────────────────────┐ │   │
│  │  │ Landing Page                                            │ │   │
│  │  │  [User Button]          [Admin Button]                 │ │   │
│  │  │        ↓                       ↓                        │ │   │
│  │  │   Register/Login User    Register/Login Admin         │ │   │
│  │  │        ↓                       ↓                        │ │   │
│  │  │   User Dashboard         Admin Dashboard              │ │   │
│  │  └─────────────────────────────────────────────────────────┘ │   │
│  │                                                                │   │
│  │  Uses: Axios / Fetch API                                      │   │
│  │  Stores: userId, userRole in localStorage                    │   │
│  └──────────────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────────────┘
                           │ HTTP REST API (JSON)
                           │ CORS: http://localhost:5173
                           ↓
┌──────────────────────────────────────────────────────────────────────┐
│                  SPRING BOOT BACKEND (Port 8080)                     │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ REST API Controller Layer                                      │  │
│  │ ┌──────────────────────────────────────────────────────────┐  │  │
│  │ │ AuthController                                           │  │  │
│  │ │ • POST /api/auth/register/user                           │  │  │
│  │ │ • POST /api/auth/register/admin                          │  │  │
│  │ │ • POST /api/auth/login/user                              │  │  │
│  │ │ • POST /api/auth/login/admin                             │  │  │
│  │ │ • GET /api/auth/health                                   │  │  │
│  │ └──────────────────────┬───────────────────────────────────┘  │  │
│  └────────────────────────┼──────────────────────────────────────┘  │
│                           │                                         │
│  ┌────────────────────────▼──────────────────────────────────────┐  │
│  │ Business Logic Layer (Service)                               │  │
│  │ ┌──────────────────────────────────────────────────────────┐  │  │
│  │ │ UserService                                              │  │  │
│  │ │ • registerUser() - Validate & encrypt password          │  │  │
│  │ │ • login() - Authenticate & verify password              │  │  │
│  │ │ • getUsersByRole()                                       │  │  │
│  │ │ • emailExists()                                          │  │  │
│  │ │ • User management methods                                │  │  │
│  │ │                                                          │  │  │
│  │ │ Uses: BCryptPasswordEncoder                              │  │  │
│  │ └──────────────────────┬───────────────────────────────────┘  │  │
│  └────────────────────────┼──────────────────────────────────────┘  │
│                           │                                         │
│  ┌────────────────────────▼──────────────────────────────────────┐  │
│  │ Data Access Layer (Repository)                               │  │
│  │ ┌──────────────────────────────────────────────────────────┐  │  │
│  │ │ UserRepository (extends JpaRepository)                   │  │  │
│  │ │ • findByEmail(String) - Find user by email               │  │  │
│  │ │ • existsByEmail(String) - Check email existence          │  │  │
│  │ │ • findByRole(Role) - Get users by role                   │  │  │
│  │ │ • save(), findById(), findAll(), delete() - CRUD         │  │  │
│  │ └──────────────────────┬───────────────────────────────────┘  │  │
│  └────────────────────────┼──────────────────────────────────────┘  │
│                           │                                         │
│  ┌────────────────────────▼──────────────────────────────────────┐  │
│  │ Entity/Model Layer                                            │  │
│  │ ┌──────────────────────────────────────────────────────────┐  │  │
│  │ │ User Entity                                              │  │  │
│  │ │ • id (Long) - PK                                         │  │  │
│  │ │ • name (String) - Full name                              │  │  │
│  │ │ • email (String) - Unique email                          │  │  │
│  │ │ • password (String) - Encrypted with BCrypt              │  │  │
│  │ │ • role (Enum) - USER or ADMIN                            │  │  │
│  │ │ • createdAt (LocalDateTime) - Auto-set                   │  │  │
│  │ │ • updatedAt (LocalDateTime) - Auto-updated               │  │  │
│  │ └──────────────────────┬───────────────────────────────────┘  │  │
│  └────────────────────────┼──────────────────────────────────────┘  │
│                           │                                         │
│  ┌────────────────────────▼──────────────────────────────────────┐  │
│  │ DTOs (Data Transfer Objects)                                  │  │
│  │ • RegisterRequest - Input for registration                    │  │
│  │ • LoginRequest - Input for login                              │  │
│  │ • LoginResponse - Output for both register & login            │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                           │                                         │
└───────────────────────────┼─────────────────────────────────────────┘
                            │ JDBC / SQL Queries
                            │ Spring Data JPA
                            ↓
┌────────────────────────────────────────────────────────────────────────┐
│                        DATABASE LAYER                                  │
│                                                                        │
│  ┌──────────────────────────────────┐  ┌──────────────────────────┐   │
│  │  MySQL Database (Production)      │  │  H2 Database (Testing)   │   │
│  │                                   │  │                          │   │
│  │  intellisubdb                     │  │  testdb (in-memory)      │   │
│  │  ┌────────────────────────────┐   │  │  ┌──────────────────────┐ │
│  │  │ users table                │   │  │  │ USERS table          │ │
│  │  │ ┌──────────────────────────┤   │  │  │ ┌──────────────────┤ │
│  │  │ │ id (BIGINT) PK           │   │  │  │ │ id (BIGINT) PK   │ │
│  │  │ │ name (VARCHAR)           │   │  │  │ │ name (VARCHAR)   │ │
│  │  │ │ email (VARCHAR) UNIQUE   │   │  │  │ │ email (VARCHAR)  │ │
│  │  │ │ password (VARCHAR) [hash]│   │  │  │ │ password (VARCHAR│ │
│  │  │ │ role (ENUM) USER/ADMIN   │   │  │  │ │ role (VARCHAR)   │ │
│  │  │ │ created_at (TIMESTAMP)   │   │  │  │ │ created_at (TS)  │ │
│  │  │ │ updated_at (TIMESTAMP)   │   │  │  │ │ updated_at (TS)  │ │
│  │  │ └──────────────────────────┤   │  │  │ └──────────────────┤ │
│  │  └────────────────────────────┘   │  │  └──────────────────────┘ │
│  │  Port: 3306                       │  │  Port: Embedded            │
│  │  Persistent: Yes                  │  │  Persistent: No (RAM only) │
│  └──────────────────────────────────┘  └──────────────────────────┘   │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. User Registration Flow

```
┌─────────────────────────────────────────┐
│   React Component (Register Form)        │
│  ┌───────────────────────────────────┐   │
│  │ Input: name, email, password      │   │
│  │ Button: [Register]                │   │
│  └─────────────┬─────────────────────┘   │
└────────────────┼──────────────────────────┘
                 │ State: Submit form
                 ↓
┌─────────────────────────────────────────┐
│  POST /api/auth/register/user            │
│  Headers: Content-Type: application/json │
│  Body: {name, email, password}           │
└────────────────┬────────────────────────┘
                 │ HTTP POST
                 ↓
┌─────────────────────────────────────────┐
│   AuthController.registerUser()          │
│  ┌───────────────────────────────────┐   │
│  │ 1. Extract RegisterRequest DTO    │   │
│  │ 2. Set role = "USER"              │   │
│  │ 3. Call userService.registerUser()│   │
│  └─────────────┬─────────────────────┘   │
└────────────────┼──────────────────────────┘
                 │ Method call
                 ↓
┌─────────────────────────────────────────┐
│   UserService.registerUser()             │
│  ┌───────────────────────────────────┐   │
│  │ 1. Validate input                 │   │
│  │    • Check name is not empty      │   │
│  │    • Check email is not empty     │   │
│  │    • Check password is not empty  │   │
│  │                                   │   │
│  │ 2. Check email uniqueness         │   │
│  │    call: userRepository           │   │
│  │           .existsByEmail(email)   │   │
│  │    if exists → return error       │   │
│  │                                   │   │
│  │ 3. Create User object             │   │
│  │    • name = input name            │   │
│  │    • email = input email          │   │
│  │    • password = BCrypt encode     │   │
│  │    • role = USER                  │   │
│  │                                   │   │
│  │ 4. Save to database               │   │
│  │    call: userRepository.save()    │   │
│  │    Database triggers @PrePersist: │   │
│  │    • createdAt = now()            │   │
│  │    • updatedAt = now()            │   │
│  │                                   │   │
│  │ 5. Return LoginResponse           │   │
│  │    ✅ success: true               │   │
│  │    ✅ userId: 1                   │   │
│  │    ✅ role: "USER"                │   │
│  │    ✅ createdAt: timestamp        │   │
│  └─────────────┬─────────────────────┘   │
└────────────────┼──────────────────────────┘
                 │ Returns LoginResponse
                 ↓
┌─────────────────────────────────────────┐
│   AuthController.registerUser()          │
│  ┌───────────────────────────────────┐   │
│  │ Check response.isSuccess()        │   │
│  │ if true:                          │   │
│  │   return ResponseEntity.          │   │
│  │     status(HttpStatus.CREATED)    │   │
│  │     .body(response)               │   │
│  │ else:                             │   │
│  │   return ResponseEntity.          │   │
│  │     status(HttpStatus.BAD_REQUEST)│   │
│  │     .body(response)               │   │
│  └─────────────┬─────────────────────┘   │
└────────────────┼──────────────────────────┘
                 │ HTTP 201 or 400
                 ↓
┌─────────────────────────────────────────┐
│   React Component                        │
│  ┌───────────────────────────────────┐   │
│  │ Receive: LoginResponse (JSON)     │   │
│  │                                   │   │
│  │ if success:                       │   │
│  │   Show "Registration successful!"│   │
│  │   Redirect to Login page          │   │
│  │ else:                             │   │
│  │   Show error message              │   │
│  │   Let user retry                  │   │
│  └───────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## 3. User Login Flow

```
┌─────────────────────────────────────────┐
│   React Component (Login Form)           │
│  ┌───────────────────────────────────┐   │
│  │ Input: email, password            │   │
│  │ Button: [Login]                   │   │
│  └─────────────┬─────────────────────┘   │
└────────────────┼──────────────────────────┘
                 │ State: Submit form
                 ↓
┌─────────────────────────────────────────┐
│  POST /api/auth/login/user               │
│  Headers: Content-Type: application/json │
│  Body: {email, password}                 │
└────────────────┬────────────────────────┘
                 │ HTTP POST
                 ↓
┌─────────────────────────────────────────┐
│   AuthController.loginUser()             │
│  ┌───────────────────────────────────┐   │
│  │ 1. Extract LoginRequest DTO       │   │
│  │ 2. Call userService.login()       │   │
│  │ 3. Check response.isSuccess()     │   │
│  │ 4. Return appropriate status:     │   │
│  │    • 200 OK if success            │   │
│  │    • 401 UNAUTHORIZED if failed   │   │
│  └─────────────┬─────────────────────┘   │
└────────────────┼──────────────────────────┘
                 │ Method call
                 ↓
┌─────────────────────────────────────────────────────────┐
│   UserService.login()                                   │
│  ┌───────────────────────────────────────────────────┐  │
│  │ 1. Validate input                                │  │
│  │    • Check email is not empty                    │  │
│  │    • Check password is not empty                 │  │
│  │                                                  │  │
│  │ 2. Find user by email                            │  │
│  │    userRepository.findByEmail(email)             │  │
│  │    ┌────────────────────────────────────┐        │  │
│  │    │ User not found?                    │        │  │
│  │    │ → Return error: "Invalid email or  │        │  │
│  │    │   password. Please check and try   │        │  │
│  │    │   again."                          │        │  │
│  │    └────────────────────────────────────┘        │  │
│  │                                                  │  │
│  │ 3. Verify password (BCrypt comparison)          │  │
│  │    ┌────────────────────────────────────┐        │  │
│  │    │ Algorithm:                         │        │  │
│  │    │ passwordEncoder.matches(           │        │  │
│  │    │   "input_password",                │        │  │
│  │    │   "stored_bcrypt_hash"             │        │  │
│  │    │ )                                  │        │  │
│  │    └────────────────────────────────────┘        │  │
│  │    ┌────────────────────────────────────┐        │  │
│  │    │ Password doesn't match?            │        │  │
│  │    │ → Return error: "Invalid email or  │        │  │
│  │    │   password. Please check and try   │        │  │
│  │    │   again."                          │        │  │
│  │    └────────────────────────────────────┘        │  │
│  │                                                  │  │
│  │ 4. Password matches! Return user details        │  │
│  │    ✅ success: true                              │  │
│  │    ✅ userId: user.id                            │  │
│  │    ✅ userName: user.name                        │  │
│  │    ✅ email: user.email                          │  │
│  │    ✅ role: user.role                            │  │
│  │    ✅ createdAt: user.createdAt                  │  │
│  │    ⚠️  (password NOT returned)                    │  │
│  └─────────────┬─────────────────────────────────────┘  │
└────────────────┼──────────────────────────────────────────┘
                 │ Returns LoginResponse
                 ↓
┌─────────────────────────────────────────┐
│   AuthController.loginUser()             │
│  ┌───────────────────────────────────┐   │
│  │ Check response.isSuccess()        │   │
│  │ if true:                          │   │
│  │   return 200 OK                   │   │
│  │ else:                             │   │
│  │   return 401 UNAUTHORIZED         │   │
│  └─────────────┬─────────────────────┘   │
└────────────────┼──────────────────────────┘
                 │ HTTP 200 or 401
                 ↓
┌─────────────────────────────────────────┐
│   React Component                        │
│  ┌───────────────────────────────────┐   │
│  │ Receive: LoginResponse (JSON)     │   │
│  │                                   │   │
│  │ if success:                       │   │
│  │   Save to localStorage:           │   │
│  │   • userId                        │   │
│  │   • userRole                      │   │
│  │   • userName                      │   │
│  │   • userEmail                     │   │
│  │                                   │   │
│  │   Show "Login successful!"        │   │
│  │   Redirect to User Dashboard      │   │
│  │                                   │   │
│  │ else:                             │   │
│  │   Show error message              │   │
│  │   Let user retry                  │   │
│  └───────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## 4. Admin Login Flow (with Role Verification)

```
┌─────────────────────────────────────────┐
│   React Component (Admin Login Form)     │
│  ┌───────────────────────────────────┐   │
│  │ Input: email, password            │   │
│  │ Button: [Admin Login]             │   │
│  └─────────────┬─────────────────────┘   │
└────────────────┼──────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────┐
│  POST /api/auth/login/admin              │
│  (Same as /login/user, but with extra   │
│   role verification)                    │
└────────────────┬────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────┐
│   AuthController.loginAdmin()                       │
│  ┌───────────────────────────────────────────────┐  │
│  │ 1. Call userService.login(loginRequest)       │  │
│  │    (Same as loginUser())                      │  │
│  │                                               │  │
│  │ 2. Additional check:                          │  │
│  │    if (response.isSuccess() &&                │  │
│  │        !response.getRole().equals("ADMIN"))   │  │
│  │    {                                          │  │
│  │      // User is authenticated but not admin   │  │
│  │      return 401 UNAUTHORIZED                  │  │
│  │      message: "This account does not have     │  │
│  │               admin privileges."              │  │
│  │    }                                          │  │
│  │                                               │  │
│  │ 3. If success AND role is ADMIN:              │  │
│  │    return 200 OK with user details            │  │
│  │                                               │  │
│  │ 4. Otherwise:                                 │  │
│  │    return 401 UNAUTHORIZED                    │  │
│  └─────────────┬─────────────────────────────────┘  │
└────────────────┼──────────────────────────────────────┘
                 │
        ┌────────┴──────────┐
        │                   │
        ↓                   ↓
   ┌─────────┐          ┌──────────┐
   │ 200 OK  │          │ 401 UNAUTH
   │ ADMIN   │          │ NOT ADMIN
   │ LOGIN   │          │ OR INVALID
   │SUCCESS  │          │ CREDENTIALS
   └─────────┘          └──────────┘
        │                   │
        ↓                   ↓
┌──────────────────┐  ┌──────────────────┐
│ React Component  │  │ React Component  │
│ Save to          │  │ Show error:      │
│ localStorage     │  │ "This account    │
│ Redirect to      │  │ does not have    │
│ Admin Dashboard  │  │ admin            │
│                  │  │ privileges."     │
└──────────────────┘  └──────────────────┘
```

---

## 5. Database Table Structure

```
┌─────────────────────────────────────────────────────────┐
│                     USERS TABLE                         │
│  (Auto-created by Spring Boot from User.java entity)    │
│                                                         │
│  CREATE TABLE users (                                   │
│    id BIGINT AUTO_INCREMENT PRIMARY KEY,                │
│    name VARCHAR(255) NOT NULL,                          │
│    email VARCHAR(255) UNIQUE NOT NULL,                  │
│    password VARCHAR(255) NOT NULL,                      │
│    role ENUM('USER','ADMIN') DEFAULT 'USER',            │
│    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,      │
│    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP       │
│                       ON UPDATE CURRENT_TIMESTAMP,      │
│    UNIQUE KEY uk_email (email)                          │
│  );                                                     │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                    SAMPLE DATA                          │
├──────┬───────────┬──────────────────┬──────────────────┤
│ id   │ name      │ email            │ role             │
├──────┼───────────┼──────────────────┼──────────────────┤
│ 1    │ John Doe  │ john@example.com │ USER             │
│ 2    │ Admin Usr │ admin@example.com│ ADMIN            │
└──────┴───────────┴──────────────────┴──────────────────┘
│                                                         │
├─────────────────────────────────────────────────────────┤
│                 PASSWORD (Encrypted)                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ BCrypt Hash (60 chars, irreversible):                   │
│ $2a$10$N9qo8uLOickgxVIc3xLHhO6Yn7zCnvSx                │
│ x4bvWXkCVtJJg/...truncated...                          │
│                                                         │
│ Can verify with: BCryptPasswordEncoder.matches()        │
│ Cannot decrypt or reverse                              │
└─────────────────────────────────────────────────────────┘
```

---

## 6. API Request/Response Format

```
REGISTRATION REQUEST
┌─────────────────────────────────────────────────────┐
│ POST /api/auth/register/user                        │
│ Content-Type: application/json                      │
│                                                     │
│ {                                                   │
│   "name": "John Doe",                               │
│   "email": "john@example.com",                      │
│   "password": "SecurePassword123"                   │
│ }                                                   │
└─────────────────────────────────────────────────────┘

REGISTRATION SUCCESS RESPONSE (HTTP 201)
┌─────────────────────────────────────────────────────┐
│ {                                                   │
│   "success": true,                                  │
│   "message": "USER registered successfully!",       │
│   "userId": 1,                                      │
│   "userName": "John Doe",                           │
│   "email": "john@example.com",                      │
│   "role": "USER",                                   │
│   "createdAt": "2026-01-25T10:30:15.123456"        │
│ }                                                   │
└─────────────────────────────────────────────────────┘

REGISTRATION FAILURE RESPONSE (HTTP 400)
┌─────────────────────────────────────────────────────┐
│ {                                                   │
│   "success": false,                                 │
│   "message": "Email already registered. Please      │
│              try with different email.",            │
│   "userId": null,                                   │
│   "userName": null,                                 │
│   "email": null,                                    │
│   "role": null,                                     │
│   "createdAt": null                                 │
│ }                                                   │
└─────────────────────────────────────────────────────┘
```

---

## 7. Security: Password Encryption Process

```
USER REGISTRATION
┌──────────────────┐
│ Plain Password   │
│ "MyPassword123"  │
└────────┬─────────┘
         │
         ↓
┌────────────────────────────────┐
│ BCryptPasswordEncoder           │
│ (Spring Security)               │
│                                 │
│ 1. Generate random salt         │
│ 2. Hash password with salt      │
│ 3. Cost factor: 10 (~100ms)     │
│ 4. Return irreversible hash     │
└────────┬────────────────────────┘
         │
         ↓
┌────────────────────────────────┐
│ BCrypt Hash (60 characters)     │
│ $2a$10$N9qo8uLOickgxVIc3xLH... │
│                                 │
│ Structure:                      │
│ $2a$ = BCrypt algorithm         │
│ $10$ = Cost factor (10)         │
│ ...rest = salt + hash           │
└────────┬────────────────────────┘
         │
         ↓
    STORED IN DATABASE

───────────────────────────────────────

USER LOGIN
┌──────────────────┐
│ Plain Password   │
│ "MyPassword123"  │
└────────┬─────────┘
         │
         ↓
┌────────────────────────────────┐
│ BCryptPasswordEncoder           │
│ .matches(inputPassword,         │
│          storedHash)            │
│                                 │
│ 1. Extract salt from hash       │
│ 2. Hash input with extracted    │
│    salt                         │
│ 3. Compare results              │
└────────┬────────────────────────┘
         │
    ┌────┴────┐
    │          │
    ↓          ↓
┌─────┐    ┌───────┐
│MATCH│    │NO MATCH
│     │    │
│✅OK │    │❌FAIL
│     │    │
└─────┘    └───────┘
    │          │
    ↓          ↓
  LOGIN OK   LOGIN FAILED
  GRANT       DENY
  ACCESS      ACCESS
```

---

## 8. CORS (Cross-Origin Resource Sharing)

```
┌──────────────────────────────────────────────────────────┐
│         React Frontend (http://localhost:5173)            │
│                                                          │
│  fetch('http://localhost:8080/api/auth/login/user')     │
└──────────────────────────┬───────────────────────────────┘
                           │
                           ↓
                   (Cross-Origin Request)
                           │
                           ↓
┌──────────────────────────────────────────────────────────┐
│    Spring Boot Backend (http://localhost:8080)            │
│                                                          │
│    @CrossOrigin(origins = "http://localhost:5173")      │
│    public class AuthController {                        │
│      @PostMapping("/login/user")                        │
│      public ResponseEntity<LoginResponse> loginUser()   │
│      {                                                  │
│        // Process request...                           │
│        return response;                                │
│      }                                                  │
│    }                                                    │
│                                                          │
│    Response Headers:                                     │
│    Access-Control-Allow-Origin: http://localhost:5173   │
│    Access-Control-Allow-Methods: POST, GET, OPTIONS     │
│    Access-Control-Allow-Headers: Content-Type           │
└──────────────────────────────────────────────────────────┘
                           │
                           ↓
┌──────────────────────────────────────────────────────────┐
│         React Frontend - CORS Headers Verified ✓          │
│                                                          │
│  ✅ Response allowed from http://localhost:5173         │
│  ✅ Can read response body                              │
│  ✅ Can use data in application                         │
└──────────────────────────────────────────────────────────┘
```

---

**All diagrams created:** January 25, 2026
