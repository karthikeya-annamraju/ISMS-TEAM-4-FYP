package com.example.subscription.dto;

import java.time.LocalDateTime;

/**
 * LoginResponse DTO - Data Transfer Object for login response
 * 
 * This class represents the response sent to frontend after successful login.
 * Contains user details (without password) and success status.
 */
public class LoginResponse {

    private boolean success;            // true if login successful, false otherwise
    private String message;             // Success or error message
    private Long userId;                // User ID (null if login failed)
    private String userName;            // User's full name (null if login failed)
    private String email;               // User's email (null if login failed)
    private String role;                // User's role: USER or ADMIN (null if login failed)
    private LocalDateTime createdAt;    // Account creation timestamp

    // ==================== Constructors ====================

    public LoginResponse() {}

    public LoginResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public LoginResponse(boolean success, String message, Long userId, String userName, 
                        String email, String role, LocalDateTime createdAt) {
        this.success = success;
        this.message = message;
        this.userId = userId;
        this.userName = userName;
        this.email = email;
        this.role = role;
        this.createdAt = createdAt;
    }

    // ==================== Getters & Setters ====================

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "LoginResponse{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", userId=" + userId +
                ", userName='" + userName + '\'' +
                ", email='" + email + '\'' +
                ", role='" + role + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
