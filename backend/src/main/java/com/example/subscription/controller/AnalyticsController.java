package com.example.subscription.controller;

import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    @GetMapping("/summary")
    public Map<String, Object> getAnalyticsSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalUsers", 1234);
        summary.put("activeUsers", 1088);
        summary.put("churnedUsers", 146);
        summary.put("activeSubscriptions", 856);
        summary.put("monthlyRevenue", 45678);
        summary.put("churnRate", 2.3);

        return summary;
    }

    @GetMapping("/churn-trend")
    public List<Map<String, Object>> getChurnTrend() {
        List<Map<String, Object>> trend = new ArrayList<>();

        trend.add(createTrendData("Jan", 1.8));
        trend.add(createTrendData("Feb", 2.1));
        trend.add(createTrendData("Mar", 1.9));
        trend.add(createTrendData("Apr", 2.5));
        trend.add(createTrendData("May", 2.3));
        trend.add(createTrendData("Jun", 2.3));

        return trend;
    }

    @GetMapping("/plan-distribution")
    public List<Map<String, Object>> getPlanDistribution() {
        List<Map<String, Object>> distribution = new ArrayList<>();

        distribution.add(createPlanData("Basic", 320));
        distribution.add(createPlanData("Gold", 456));
        distribution.add(createPlanData("Platinum", 80));

        return distribution;
    }

    private Map<String, Object> createTrendData(String month, double churnRate) {
        Map<String, Object> data = new HashMap<>();
        data.put("month", month);
        data.put("churnRate", churnRate);
        return data;
    }

    private Map<String, Object> createPlanData(String planName, int userCount) {
        Map<String, Object> data = new HashMap<>();
        data.put("planName", planName);
        data.put("userCount", userCount);
        return data;
    }
}
