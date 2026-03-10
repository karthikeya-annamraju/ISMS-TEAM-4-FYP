package com.example.subscription.controller;

import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    @GetMapping("/churn-risk")
    public List<Map<String, Object>> getChurnRiskUsers() {
        List<Map<String, Object>> riskUsers = new ArrayList<>();

        riskUsers.add(createRiskUser(
                1L,
                "John Doe",
                "john@example.com",
                0.85,
                "HIGH",
                "Offer 20% discount for 3 months"));

        riskUsers.add(createRiskUser(
                2L,
                "Jane Smith",
                "jane@example.com",
                0.78,
                "HIGH",
                "Provide personalized feature training"));

        riskUsers.add(createRiskUser(
                3L,
                "Bob Johnson",
                "bob@example.com",
                0.55,
                "MEDIUM",
                "Send engagement email campaign"));

        riskUsers.add(createRiskUser(
                4L,
                "Alice Williams",
                "alice@example.com",
                0.48,
                "MEDIUM",
                "Highlight new features they might like"));

        riskUsers.add(createRiskUser(
                5L,
                "Charlie Brown",
                "charlie@example.com",
                0.25,
                "LOW",
                "Continue current engagement strategy"));

        return riskUsers;
    }

    private Map<String, Object> createRiskUser(
            Long id,
            String name,
            String email,
            double churnProbability,
            String riskLevel,
            String recommendation) {

        Map<String, Object> user = new HashMap<>();
        user.put("id", id);
        user.put("name", name);
        user.put("email", email);
        user.put("churnProbability", churnProbability);
        user.put("riskLevel", riskLevel);
        user.put("recommendation", recommendation);

        return user;
    }
}
