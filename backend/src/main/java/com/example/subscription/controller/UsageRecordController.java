package com.example.subscription.controller;

import com.example.subscription.entity.UsageRecord;
import com.example.subscription.service.UsageRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usage")
public class UsageRecordController {

    @Autowired private UsageRecordService usageService;

    @PostMapping
    public UsageRecord addUsage(@RequestBody UsageRecord record) {
        return usageService.addUsage(record);
    }

    @GetMapping
    public List<UsageRecord> getAllUsage() {
        return usageService.getAllUsage();
    }
}
