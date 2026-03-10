# API Testing Examples & Scenarios

## 🧪 Test Scenario 1: Complete User Journey

### Step 1: Register New User
```bash
curl -X POST http://localhost:8080/api/auth/register/user \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123"
  }'
```

**Expected Response (HTTP 201):**
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

✅ **What happened:**
- Email is checked for uniqueness
- Password "SecurePassword123" is encrypted with BCrypt
- User record created in database with timestamps
- Response includes userId for future reference

---

### Step 2: Try to Register with Same Email (Should Fail)
```bash
curl -X POST http://localhost:8080/api/auth/register/user \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "john@example.com",
    "password": "DifferentPassword456"
  }'
```

**Expected Response (HTTP 400):**
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

❌ **Why it failed:**
- Email "john@example.com" already exists
- Database has UNIQUE constraint on email column
- System rejects duplicate emails

---

### Step 3: Login with Correct Credentials
```bash
curl -X POST http://localhost:8080/api/auth/login/user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123"
  }'
```

**Expected Response (HTTP 200):**
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

✅ **What happened:**
- User found by email in database
- Plain password "SecurePassword123" compared with encrypted hash using BCrypt
- BCrypt.matches() returned true
- User details returned (password NOT included)

---

### Step 4: Try to Login with Wrong Password (Should Fail)
```bash
curl -X POST http://localhost:8080/api/auth/login/user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "WrongPassword"
  }'
```

**Expected Response (HTTP 401):**
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

❌ **Why it failed:**
- User found by email
- Provided password "WrongPassword" doesn't match encrypted hash
- BCrypt.matches() returned false
- No hints about whether email or password is wrong (security best practice)

---

## 🧪 Test Scenario 2: Admin Registration & Login

### Step 1: Register Admin
```bash
curl -X POST http://localhost:8080/api/auth/register/admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "AdminPassword123"
  }'
```

**Expected Response (HTTP 201):**
```json
{
  "success": true,
  "message": "ADMIN registered successfully!",
  "userId": 2,
  "userName": "Admin User",
  "email": "admin@example.com",
  "role": "ADMIN",
  "createdAt": "2026-01-25T11:00:00.654321"
}
```

✅ **What happened:**
- New user registered with role = "ADMIN"
- Same validation and encryption as regular user
- userId is 2 (incremented from previous user)

---

### Step 2: Admin Login
```bash
curl -X POST http://localhost:8080/api/auth/login/admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "AdminPassword123"
  }'
```

**Expected Response (HTTP 200):**
```json
{
  "success": true,
  "message": "Login successful!",
  "userId": 2,
  "userName": "Admin User",
  "email": "admin@example.com",
  "role": "ADMIN",
  "createdAt": "2026-01-25T11:00:00.654321"
}
```

✅ **What happened:**
- User found with email "admin@example.com"
- Password verified successfully
- Role is "ADMIN" (admin endpoint verified this)
- All admin details returned

---

### Step 3: Try to Login as Admin with Regular User Account (Should Fail)
```bash
curl -X POST http://localhost:8080/api/auth/login/admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123"
  }'
```

**Expected Response (HTTP 401):**
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

❌ **Why it failed:**
- User found and password is correct
- But role is "USER", not "ADMIN"
- Admin endpoint checks role before returning success
- Access denied for non-admin accounts

---

## 🧪 Test Scenario 3: Input Validation

### Missing Name
```bash
curl -X POST http://localhost:8080/api/auth/register/user \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "email": "test@example.com",
    "password": "TestPassword123"
  }'
```

**Response (HTTP 400):**
```json
{
  "success": false,
  "message": "Name is required."
}
```

---

### Missing Email
```bash
curl -X POST http://localhost:8080/api/auth/register/user \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "",
    "password": "TestPassword123"
  }'
```

**Response (HTTP 400):**
```json
{
  "success": false,
  "message": "Email is required."
}
```

---

### Missing Password
```bash
curl -X POST http://localhost:8080/api/auth/register/user \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": ""
  }'
```

**Response (HTTP 400):**
```json
{
  "success": false,
  "message": "Password is required."
}
```

---

### Missing Email in Login
```bash
curl -X POST http://localhost:8080/api/auth/login/user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "",
    "password": "TestPassword123"
  }'
```

**Response (HTTP 401):**
```json
{
  "success": false,
  "message": "Email is required."
}
```

---

## 🧪 Test Scenario 4: Password Encryption Verification

### Check Database to See Encrypted Password
```bash
# MySQL
mysql> SELECT id, name, email, password, role FROM users WHERE id = 1;
```

**Expected Output:**
```
+----+----------+------------------+---------------------------------------------+------+
| id | name     | email            | password                                    | role |
+----+----------+------------------+---------------------------------------------+------+
|  1 | John Doe | john@example.com | $2a$10$N9qo8uLOickgxVIc3xLHhO6Yn7zCnvSx... | USER |
+----+----------+------------------+---------------------------------------------+------+
```

✅ **What to notice:**
- Password starts with `$2a$10$` (BCrypt hash)
- Password is 60 characters long
- Every registration generates different hash (due to salt)
- Password is NOT "SecurePassword123" (encrypted)
- Different password creates different hash

---

### Password Comparison Algorithm (Behind the Scenes)

When user logs in with "SecurePassword123":

```
User Input: "SecurePassword123"
       ↓
BCryptPasswordEncoder.matches()
       ├─ Extract salt from stored hash
       ├─ Hash input password with extracted salt
       └─ Compare results
       ↓
Does match? $2a$10$N9qo8uLOickgxVIc3xLHhO6Yn7zCnvSx == $2a$10$N9qo8uLOickgxVIc3xLHhO6Yn7zCnvSx
       ↓
Yes → Login successful
No  → Login failed
```

---

## 🧪 Test Scenario 5: Timestamp Tracking

### Register User and Check Timestamps
```bash
# Register
curl -X POST http://localhost:8080/api/auth/register/user \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Timestamp User",
    "email": "timestamp@example.com",
    "password": "TestPassword123"
  }'
```

**Response shows:**
```json
{
  "success": true,
  "createdAt": "2026-01-25T10:30:15.123456"
}
```

### Check Database
```bash
mysql> SELECT id, email, created_at, updated_at FROM users WHERE email = 'timestamp@example.com';
```

**Output:**
```
+----+----------------------+---------------------+---------------------+
| id | email                | created_at          | updated_at          |
+----+----------------------+---------------------+---------------------+
|  3 | timestamp@example.com| 2026-01-25 10:30:15 | 2026-01-25 10:30:15 |
+----+----------------------+---------------------+---------------------+
```

✅ **What to notice:**
- `created_at` is set automatically when record is created
- `updated_at` is also set to creation time
- Both are `NOT NULL` in database
- Timestamps are managed by `@PrePersist` and `@PreUpdate` annotations

---

## 🧪 Test Scenario 6: Health Check & CORS

### Health Check
```bash
curl -v http://localhost:8080/api/auth/health
```

**Response (HTTP 200):**
```
< HTTP/1.1 200 OK
< Content-Type: text/plain;charset=UTF-8
< Content-Length: 42
<
Backend is running and healthy! ✓
```

---

### Check CORS Headers (Browser Test)
```bash
# From browser console in http://localhost:5173
fetch('http://localhost:8080/api/auth/health')
  .then(r => r.text())
  .then(console.log)
```

**Expected Response:**
- Status: 200 OK
- Headers include: `Access-Control-Allow-Origin: http://localhost:5173`
- Response body: `Backend is running and healthy! ✓`

---

## 📊 Test Summary

| Scenario | Expected Status | Endpoint | Result |
|----------|-----------------|----------|--------|
| Register user | 201 | `/register/user` | ✅ Created |
| Duplicate email | 400 | `/register/user` | ❌ Bad Request |
| Login success | 200 | `/login/user` | ✅ OK |
| Wrong password | 401 | `/login/user` | ❌ Unauthorized |
| Admin login | 200 | `/login/admin` | ✅ OK |
| User as admin | 401 | `/login/admin` | ❌ Unauthorized |
| Missing field | 400/401 | `/register/*` `/login/*` | ❌ Error |
| Health check | 200 | `/health` | ✅ OK |

---

## 🔐 Security Validation Tests

### Test 1: Password Not Returned in Response
```bash
curl -X POST http://localhost:8080/api/auth/login/user \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecurePassword123"}' \
  | jq '.password'
```

**Expected Output:**
```
null
```

✅ Password is never returned in API response

---

### Test 2: Password Hash Cannot Be Reversed
```bash
# Even if attacker gets database access:
# Stored hash: $2a$10$N9qo8uLOickgxVIc3xLHhO6Yn7zCnvSx...
# Cannot be reversed to: SecurePassword123
# BCrypt is one-way encryption
```

---

### Test 3: Same Password = Different Hash Each Time
```bash
# Register user 1
curl -X POST http://localhost:8080/api/auth/register/user \
  -d '{"name":"User1","email":"user1@test.com","password":"SamePassword"}'

# Register user 2
curl -X POST http://localhost:8080/api/auth/register/user \
  -d '{"name":"User2","email":"user2@test.com","password":"SamePassword"}'

# Check database:
mysql> SELECT email, password FROM users WHERE email IN ('user1@test.com', 'user2@test.com');
```

**Output:**
```
+---------------+---------------------------------------------+
| email         | password                                    |
+---------------+---------------------------------------------+
| user1@test.com | $2a$10$XXXXXXX... (different hash 1) |
| user2@test.com | $2a$10$YYYYYYY... (different hash 2) |
+---------------+---------------------------------------------+
```

✅ Even identical passwords produce different hashes (different salts)

---

## 📱 React/Frontend Testing

### Test from React Component
```javascript
// In your React component
async function testRegister() {
  try {
    const response = await fetch('http://localhost:8080/api/auth/register/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPassword123'
      })
    });
    
    const data = await response.json();
    console.log('Registration Response:', data);
    
    if (data.success) {
      console.log('✅ Registration successful!');
      console.log('User ID:', data.userId);
      console.log('Role:', data.role);
    } else {
      console.log('❌ Registration failed:', data.message);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}
```

---

## 🔍 Debugging Tips

### View Request Headers
```bash
curl -v -X POST http://localhost:8080/api/auth/login/user \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecurePassword123"}'
```

**Look for:**
- `> POST /api/auth/login/user HTTP/1.1`
- `> Host: localhost:8080`
- `> Content-Type: application/json`
- `< HTTP/1.1 200 OK`
- `< Access-Control-Allow-Origin: http://localhost:5173`

---

### View Database Records
```bash
# MySQL
mysql> SELECT * FROM users;
mysql> DESC users;  -- Show table structure

# H2
http://localhost:8080/h2-console
SELECT * FROM USERS;
```

---

### Check Application Logs
```bash
# When running: mvn spring-boot:run
# Look for:
# - "User .... created"
# - "Login attempt for ...."
# - "Password verified"
# - Any exceptions
```

---

## ✅ Verification Checklist

After running through all scenarios:

- [ ] All endpoints return correct HTTP status codes
- [ ] Passwords are encrypted in database (start with $2a$)
- [ ] Passwords are never returned in API responses
- [ ] Email uniqueness is enforced
- [ ] Timestamps are auto-generated
- [ ] Admin role verification works
- [ ] Input validation works
- [ ] CORS headers present
- [ ] Health check works
- [ ] Database records created correctly

**If all checks pass:** ✅ Backend is ready for production use!

---

**Test Date:** January 25, 2026
**Status:** Ready for Testing
