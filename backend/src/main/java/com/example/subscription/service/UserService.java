package com.example.subscription.service;

import com.example.subscription.dto.RegisterRequest;
import com.example.subscription.dto.LoginRequest;
import com.example.subscription.dto.LoginResponse;
import com.example.subscription.entity.User;
import com.example.subscription.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * UserService - Business Logic Layer for User/Admin Authentication & Management
 * 
 * This service handles:
 * - User and Admin registration with password encryption
 * - Login authentication with password verification
 * - User management (CRUD operations)
 * - Role-based access control
 * 
 * IMPORTANT: Passwords are encrypted using BCrypt before storing in database.
 * Never store plain-text passwords.
 */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // ==================== Password Encoding ====================
    // BCrypt automatically handles salt generation and hashing
    // Spring Security provides BCryptPasswordEncoder for secure password storage
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // ==================== Registration ====================

    /**
     * Register a new user or admin
     * 
     * @param registerRequest - Contains name, email, password, and role
     * @return LoginResponse with success status and created user details
     * 
     * Validation:
     * - Email must be unique (not already registered)
     * - Password must not be empty
     * - Role must be either USER or ADMIN
     */
    public LoginResponse registerUser(RegisterRequest registerRequest) {
        try {
            // Validation: Check if email already exists
            if (userRepository.existsByEmail(registerRequest.getEmail())) {
                return new LoginResponse(false, "Email already registered. Please try with different email.");
            }

            // Validation: Check required fields
            if (registerRequest.getName() == null || registerRequest.getName().trim().isEmpty()) {
                return new LoginResponse(false, "Name is required.");
            }

            if (registerRequest.getPassword() == null || registerRequest.getPassword().trim().isEmpty()) {
                return new LoginResponse(false, "Password is required.");
            }

            if (registerRequest.getEmail() == null || registerRequest.getEmail().trim().isEmpty()) {
                return new LoginResponse(false, "Email is required.");
            }

            // Determine role (default to USER if not specified or invalid)
            User.Role role = User.Role.USER;
            if (registerRequest.getRole() != null) {
                try {
                    role = User.Role.valueOf(registerRequest.getRole().toUpperCase());
                } catch (IllegalArgumentException e) {
                    return new LoginResponse(false, "Invalid role. Use 'USER' or 'ADMIN'.");
                }
            }

            // Create new user with encrypted password
            User newUser = new User();
            newUser.setName(registerRequest.getName());
            newUser.setEmail(registerRequest.getEmail());
            newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword())); // Encrypt password
            newUser.setRole(role);

            // Save to database
            User savedUser = userRepository.save(newUser);

            // Return success response with user details (password excluded)
            return new LoginResponse(
                    true,
                    role.toString() + " registered successfully!",
                    savedUser.getId(),
                    savedUser.getName(),
                    savedUser.getEmail(),
                    savedUser.getRole().toString(),
                    savedUser.getCreatedAt()
            );

        } catch (Exception e) {
            return new LoginResponse(false, "Registration failed: " + e.getMessage());
        }
    }

    // ==================== Login ====================

    /**
     * Authenticate user or admin with email and password
     * 
     * @param loginRequest - Contains email and password
     * @return LoginResponse with authentication result and user details
     * 
     * Authentication Flow:
     * 1. Check if user exists with given email
     * 2. If not found, return failure response
     * 3. If found, verify password using BCrypt comparison
     * 4. If password matches, return user details
     * 5. If password doesn't match, return failure response
     */
    public LoginResponse login(LoginRequest loginRequest) {
        try {
            // Validation: Check required fields
            if (loginRequest.getEmail() == null || loginRequest.getEmail().trim().isEmpty()) {
                return new LoginResponse(false, "Email is required.");
            }

            if (loginRequest.getPassword() == null || loginRequest.getPassword().trim().isEmpty()) {
                return new LoginResponse(false, "Password is required.");
            }

            // Step 1: Find user by email
            Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());

            if (userOptional.isEmpty()) {
                return new LoginResponse(false, "Invalid email or password. Please check and try again.");
            }

            User user = userOptional.get();

            // Step 2: Verify password using BCrypt
            // passwordEncoder.matches() securely compares plain password with encrypted stored password
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                return new LoginResponse(false, "Invalid email or password. Please check and try again.");
            }

            // Step 3: Authentication successful - return user details
            return new LoginResponse(
                    true,
                    "Login successful!",
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getRole().toString(),
                    user.getCreatedAt()
            );

        } catch (Exception e) {
            return new LoginResponse(false, "Login failed: " + e.getMessage());
        }
    }

    // ==================== User Management ====================

    /**
     * Create a user directly (used internally by admin)
     */
    public User createUser(User user) {
        return userRepository.save(user);
    }

    /**
     * Get all users
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Get user by ID
     */
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
    }

    /**
     * Get user by email
     */
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    /**
     * Get all users with specific role
     * Useful for admin panel to list all users or all admins
     */
    public List<User> getUsersByRole(User.Role role) {
        return userRepository.findByRole(role);
    }

    /**
     * Check if email already exists
     * Useful for validation during registration
     */
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * Update user role (only for admins)
     */
    public User updateUserRole(Long id, User.Role role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(role);
        return userRepository.save(user);
    }

    /**
     * Delete user
     */
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }
}
