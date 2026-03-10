package com.example.subscription.repository;

import com.example.subscription.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * UserRepository - Data Access Layer for User entity
 * 
 * Provides CRUD operations and custom query methods for User entities.
 * JpaRepository provides: save(), findById(), findAll(), delete(), update()
 * 
 * Custom methods:
 * - findByEmail(String email) - Find user by email
 * - existsByEmail(String email) - Check if email already exists
 * - findByRole(Role role) - Find all users with specific role
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find a user by email address
     * Useful for login verification
     * 
     * @param email - User's email
     * @return Optional containing User if found, empty otherwise
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if a user with given email exists
     * Useful for registration validation to prevent duplicate emails
     * 
     * @param email - User's email
     * @return true if email exists, false otherwise
     */
    boolean existsByEmail(String email);

    /**
     * Find all users with specific role (USER or ADMIN)
     * Useful for admin panel to list all users or admins
     * 
     * @param role - User role (USER or ADMIN)
     * @return List of users with given role
     */
    List<User> findByRole(User.Role role);
}
