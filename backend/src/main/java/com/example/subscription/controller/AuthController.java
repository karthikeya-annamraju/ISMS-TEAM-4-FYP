package com.example.subscription.controller;

import com.example.subscription.dto.RegisterRequest;
import com.example.subscription.dto.LoginRequest;
import com.example.subscription.dto.LoginResponse;
import com.example.subscription.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * AuthController - REST API Endpoints for User & Admin Authentication
 * 
 * This controller handles:
 * - User registration (POST /api/auth/register/user)
 * - User login (POST /api/auth/login/user)
 * - Admin registration (POST /api/auth/register/admin)
 * - Admin login (POST /api/auth/login/admin)
 * 
 * CORS is enabled to allow requests from frontend (http://localhost:5173)
 * All responses are in JSON format
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // Allow requests from React frontend
public class AuthController {

    @Autowired
    private UserService userService;

    // ==================== USER REGISTRATION ====================

    /**
     * Register a new regular user
     * 
     * Endpoint: POST /api/auth/register/user
     * 
     * Request Body:
     * {
     *   "name": "John Doe",
     *   "email": "john@example.com",
     *   "password": "SecurePassword123"
     * }
     * 
     * Response (Success - HTTP 201):
     * {
     *   "success": true,
     *   "message": "USER registered successfully!",
     *   "userId": 1,
     *   "userName": "John Doe",
     *   "email": "john@example.com",
     *   "role": "USER",
     *   "createdAt": "2026-01-25T10:30:00"
     * }
     * 
     * Response (Failure - HTTP 400):
     * {
     *   "success": false,
     *   "message": "Email already registered. Please try with different email.",
     *   "userId": null,
     *   "userName": null,
     *   "email": null,
     *   "role": null,
     *   "createdAt": null
     * }
     * 
     * HTTP Status Codes:
     * - 201 CREATED: User registered successfully
     * - 400 BAD_REQUEST: Registration failed (validation error or duplicate email)
     */
    @PostMapping("/register/user")
    public ResponseEntity<LoginResponse> registerUser(@RequestBody RegisterRequest registerRequest) {
        // Set role to USER (even if not specified in request)
        registerRequest.setRole("USER");
        
        LoginResponse response = userService.registerUser(registerRequest);
        
        if (response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // ==================== ADMIN REGISTRATION ====================

    /**
     * Register a new admin
     * 
     * Endpoint: POST /api/auth/register/admin
     * 
     * Request Body:
     * {
     *   "name": "Admin User",
     *   "email": "admin@example.com",
     *   "password": "AdminPassword123"
     * }
     * 
     * Response (Success - HTTP 201):
     * {
     *   "success": true,
     *   "message": "ADMIN registered successfully!",
     *   "userId": 2,
     *   "userName": "Admin User",
     *   "email": "admin@example.com",
     *   "role": "ADMIN",
     *   "createdAt": "2026-01-25T10:35:00"
     * }
     * 
     * Response (Failure - HTTP 400):
     * {
     *   "success": false,
     *   "message": "Email already registered. Please try with different email.",
     *   "userId": null,
     *   "userName": null,
     *   "email": null,
     *   "role": null,
     *   "createdAt": null
     * }
     * 
     * HTTP Status Codes:
     * - 201 CREATED: Admin registered successfully
     * - 400 BAD_REQUEST: Registration failed (validation error or duplicate email)
     */
    @PostMapping("/register/admin")
    public ResponseEntity<LoginResponse> registerAdmin(@RequestBody RegisterRequest registerRequest) {
        // Set role to ADMIN
        registerRequest.setRole("ADMIN");
        
        LoginResponse response = userService.registerUser(registerRequest);
        
        if (response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // ==================== USER LOGIN ====================

    /**
     * User login endpoint
     * 
     * Endpoint: POST /api/auth/login/user
     * 
     * Request Body:
     * {
     *   "email": "john@example.com",
     *   "password": "SecurePassword123"
     * }
     * 
     * Response (Success - HTTP 200):
     * {
     *   "success": true,
     *   "message": "Login successful!",
     *   "userId": 1,
     *   "userName": "John Doe",
     *   "email": "john@example.com",
     *   "role": "USER",
     *   "createdAt": "2026-01-25T10:30:00"
     * }
     * 
     * Response (Failure - HTTP 401):
     * {
     *   "success": false,
     *   "message": "Invalid email or password. Please check and try again.",
     *   "userId": null,
     *   "userName": null,
     *   "email": null,
     *   "role": null,
     *   "createdAt": null
     * }
     * 
     * HTTP Status Codes:
     * - 200 OK: Login successful
     * - 401 UNAUTHORIZED: Invalid credentials
     */
    @PostMapping("/login/user")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest loginRequest) {
        LoginResponse response = userService.login(loginRequest);
        
        if (response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    // ==================== ADMIN LOGIN ====================

    /**
     * Admin login endpoint
     * 
     * Endpoint: POST /api/auth/login/admin
     * 
     * Request Body:
     * {
     *   "email": "admin@example.com",
     *   "password": "AdminPassword123"
     * }
     * 
     * Response (Success - HTTP 200):
     * {
     *   "success": true,
     *   "message": "Login successful!",
     *   "userId": 2,
     *   "userName": "Admin User",
     *   "email": "admin@example.com",
     *   "role": "ADMIN",
     *   "createdAt": "2026-01-25T10:35:00"
     * }
     * 
     * Response (Failure - HTTP 401):
     * {
     *   "success": false,
     *   "message": "Invalid email or password. Please check and try again.",
     *   "userId": null,
     *   "userName": null,
     *   "email": null,
     *   "role": null,
     *   "createdAt": null
     * }
     * 
     * HTTP Status Codes:
     * - 200 OK: Login successful
     * - 401 UNAUTHORIZED: Invalid credentials or not an admin
     */
    @PostMapping("/login/admin")
    public ResponseEntity<LoginResponse> loginAdmin(@RequestBody LoginRequest loginRequest) {
        LoginResponse response = userService.login(loginRequest);
        
        // Additional check: verify the logged-in user is an ADMIN
        if (response.isSuccess() && !response.getRole().equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse(false, "This account does not have admin privileges."));
        }
        
        if (response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    // ==================== HEALTH CHECK ====================

    /**
     * Health check endpoint to verify backend is running
     * 
     * Endpoint: GET /api/auth/health
     * 
     * Response (HTTP 200):
     * {
     *   "status": "Backend is running and healthy!",
     *   "timestamp": "2026-01-25T10:40:00"
     * }
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Backend is running and healthy! ✓");
    }
}
