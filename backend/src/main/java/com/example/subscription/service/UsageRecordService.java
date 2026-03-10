package com.example.subscription.service;

import com.example.subscription.entity.UsageRecord;
import com.example.subscription.repository.UsageRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsageRecordService {

    @Autowired private UsageRecordRepository usageRepo;

    public UsageRecord addUsage(UsageRecord record) {
        return usageRepo.save(record);
    }

    public List<UsageRecord> getAllUsage() {
        return usageRepo.findAll();
    }
}
