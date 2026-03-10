package com.example.subscription.service;

import com.example.subscription.entity.Plan;
import com.example.subscription.repository.PlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlanService {

    @Autowired private PlanRepository planRepo;

    public Plan addPlan(Plan plan) {
        return planRepo.save(plan);
    }

    public List<Plan> getAllPlans() {
        return planRepo.findAll();
    }

    public Plan getPlanById(Long id) {
        return planRepo.findById(id).orElseThrow();
    }

    public Plan updatePlan(Long id, Plan newPlan) {
        Plan existing = getPlanById(id);
        existing.setName(newPlan.getName());
        existing.setProductType(newPlan.getProductType());
        existing.setMonthlyPrice(newPlan.getMonthlyPrice());
        existing.setDataQuotaGb(newPlan.getDataQuotaGb());
        existing.setDescription(newPlan.getDescription());
        existing.setActive(newPlan.getActive());
        return planRepo.save(existing);
    }

    public void deletePlan(Long id) {
        planRepo.deleteById(id);
    }
}
