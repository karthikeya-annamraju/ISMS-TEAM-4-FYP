package com.example.subscription.controller.admin;

import com.example.subscription.entity.Plan;
import com.example.subscription.service.PlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/plans")
@CrossOrigin(origins = "*")
public class AdminPlanController {

    @Autowired
    private PlanService planService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createPlan(@RequestBody Plan plan) {
        // TODO: Add admin role validation
        Plan createdPlan = planService.addPlan(plan);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Plan created successfully");
        response.put("data", createdPlan);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deletePlan(@PathVariable Long id) {
        // TODO: Add admin role validation
        planService.deletePlan(id);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Plan deleted successfully");

        return ResponseEntity.ok(response);
    }
}
