package com.example.subscription.dto;

/**
 * LoginRequest DTO - Data Transfer Object for user/admin login
 * 
 * This class encapsulates the credentials sent by frontend during login.
 * Contains only email and password for authentication.
 */
public class LoginRequest {

    private String email;       // Email address for login
    private String password;    // Password for verification

    // ==================== Constructors ====================

    public LoginRequest() {}

    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // ==================== Getters & Setters ====================

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "LoginRequest{" +
                "email='" + email + '\'' +
                '}';
    }
}
