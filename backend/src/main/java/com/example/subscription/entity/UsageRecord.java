package com.example.subscription.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "usage_records")
public class UsageRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Subscription subscription;

    private LocalDate usageDate;
    private Double usedGb;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Subscription getSubscription() { return subscription; }
    public void setSubscription(Subscription subscription) { this.subscription = subscription; }

    public LocalDate getUsageDate() { return usageDate; }
    public void setUsageDate(LocalDate usageDate) { this.usageDate = usageDate; }

    public Double getUsedGb() { return usedGb; }
    public void setUsedGb(Double usedGb) { this.usedGb = usedGb; }
}
