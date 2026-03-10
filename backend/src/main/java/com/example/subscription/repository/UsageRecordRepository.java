package com.example.subscription.repository;

import com.example.subscription.entity.UsageRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsageRecordRepository extends JpaRepository<UsageRecord, Long> {
}
