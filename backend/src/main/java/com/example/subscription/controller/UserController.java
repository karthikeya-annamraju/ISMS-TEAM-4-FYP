package com.example.subscription.controller;

import com.example.subscription.entity.User;
import com.example.subscription.repository.UserRepository;
import com.example.subscription.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired private UserService userService;

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PutMapping("/{id}/role")
    public User updateUserRole(
            @PathVariable Long id,
            @RequestParam User.Role role) {

        return userService.updateUserRole(id, role);
    }

}
