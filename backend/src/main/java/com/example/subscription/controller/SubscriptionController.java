package com.example.subscription.controller;

import com.example.subscription.entity.Subscription;
import com.example.subscription.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    @Autowired private SubscriptionService subscriptionService;

    @PostMapping
    public Subscription subscribe(@RequestParam Long userId,
                                  @RequestParam Long planId,
                                  @RequestParam(defaultValue = "true") boolean autoRenew) {
        return subscriptionService.subscribe(userId, planId, autoRenew);
    }

    @PutMapping("/{id}/cancel")
    public Subscription cancel(@PathVariable Long id) {
        return subscriptionService.cancel(id);
    }

    @PutMapping("/{id}/upgrade")
    public Subscription upgrade(@PathVariable Long id, @RequestParam Long newPlanId) {
        return subscriptionService.upgrade(id, newPlanId);
    }

    @PutMapping("/{id}/downgrade")
    public Subscription downgrade(@PathVariable Long id, @RequestParam Long newPlanId) {
        return subscriptionService.downgrade(id, newPlanId);
    }

    @GetMapping("/user/{userId}")
    public List<Subscription> getUserSubscriptions(@PathVariable Long userId) {
        return subscriptionService.getUserSubscriptions(userId);
    }
}
