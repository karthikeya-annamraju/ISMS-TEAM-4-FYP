package com.example.subscription.dto;

/**
 * RegisterRequest DTO - Data Transfer Object for user/admin registration
 * 
 * This class encapsulates the data received from frontend during registration.
 * It validates the input before processing in the service layer.
 */
public class RegisterRequest {

    private String name;        // Full name of the user/admin
    private String email;       // Email address (must be unique)
    private String password;    // Password (will be encrypted)
    private String role;        // USER or ADMIN

    // ==================== Constructors ====================

    public RegisterRequest() {}

    public RegisterRequest(String name, String email, String password, String role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    // ==================== Getters & Setters ====================

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @Override
    public String toString() {
        return "RegisterRequest{" +
                "name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", role='" + role + '\'' +
                '}';
    }
}
