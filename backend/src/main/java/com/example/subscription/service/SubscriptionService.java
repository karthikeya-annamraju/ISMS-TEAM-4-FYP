package com.example.subscription.service;

import com.example.subscription.entity.*;
import com.example.subscription.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class SubscriptionService {

    @Autowired private SubscriptionRepository subscriptionRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private PlanRepository planRepo;
    @Autowired private AuditLogRepository auditRepo;

    public Subscription subscribe(Long userId, Long planId, boolean autoRenew) {
        User user = userRepo.findById(userId).orElseThrow();
        Plan plan = planRepo.findById(planId).orElseThrow();

        Subscription sub = new Subscription();
        sub.setUser(user);
        sub.setPlan(plan);
        sub.setStartDate(LocalDate.now());
        sub.setEndDate(LocalDate.now().plusMonths(1));
        sub.setAutoRenew(autoRenew);
        sub.setStatus(Subscription.Status.ACTIVE);

        subscriptionRepo.save(sub);

        logAction(user.getId(), user.getRole().toString(),
                "SUBSCRIBE", "Subscribed to plan " + plan.getName());

        return sub;
    }

    public Subscription cancel(Long subId) {
        Subscription sub = subscriptionRepo.findById(subId).orElseThrow();
        sub.setStatus(Subscription.Status.CANCELLED);
        sub.setEndDate(LocalDate.now());
        subscriptionRepo.save(sub);

        logAction(sub.getUser().getId(), sub.getUser().getRole().toString(),
                "CANCEL", "Cancelled subscription " + subId);

        return sub;
    }

    public Subscription upgrade(Long subId, Long newPlanId) {
        Subscription sub = subscriptionRepo.findById(subId).orElseThrow();
        Plan newPlan = planRepo.findById(newPlanId).orElseThrow();
        sub.setPlan(newPlan);
        sub.setStartDate(LocalDate.now());
        sub.setEndDate(LocalDate.now().plusMonths(1));
        subscriptionRepo.save(sub);

        logAction(sub.getUser().getId(), sub.getUser().getRole().toString(),
                "UPGRADE", "Upgraded to plan " + newPlan.getName());

        return sub;
    }

    public Subscription downgrade(Long subId, Long newPlanId) {
        Subscription sub = subscriptionRepo.findById(subId).orElseThrow();
        Plan newPlan = planRepo.findById(newPlanId).orElseThrow();
        sub.setPlan(newPlan);
        sub.setStartDate(LocalDate.now());
        sub.setEndDate(LocalDate.now().plusMonths(1));
        subscriptionRepo.save(sub);

        logAction(sub.getUser().getId(), sub.getUser().getRole().toString(),
                "DOWNGRADE", "Downgraded to plan " + newPlan.getName());

        return sub;
    }

    public List<Subscription> getUserSubscriptions(Long userId) {
        return subscriptionRepo.findByUserId(userId);
    }

    private void logAction(Long actorId, String role, String action, String details) {
        AuditLog log = new AuditLog();
        log.setActorId(actorId);
        log.setActorRole(role);
        log.setAction(action);
        log.setDetails(details);
        auditRepo.save(log);
    }
}
