package com.example.subscription.service;

import com.example.subscription.entity.AuditLog;
import com.example.subscription.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditLogService {

    @Autowired private AuditLogRepository auditRepo;

    public List<AuditLog> getAllLogs() {
        return auditRepo.findAll();
    }
}
