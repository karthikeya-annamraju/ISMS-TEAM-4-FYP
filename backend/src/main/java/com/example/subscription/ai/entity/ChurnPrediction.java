package com.example.subscription.ai.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "churn_predictions")
public class ChurnPrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Double churnProbability; // 0.0 to 1.0

    @Column(nullable = false)
    private String riskLevel; // HIGH, MEDIUM, LOW

    @Column(length = 500)
    private String recommendedPlan; // Plan recommendation based on churn analysis

    @Column(nullable = false)
    private LocalDateTime predictionDate;

    @Column(nullable = false)
    private Long modelId; // Reference to training model version

    // Constructors
    public ChurnPrediction() {}

    public ChurnPrediction(Long userId, Double churnProbability, String riskLevel, String recommendedPlan, Long modelId) {
        this.userId = userId;
        this.churnProbability = churnProbability;
        this.riskLevel = riskLevel;
        this.recommendedPlan = recommendedPlan;
        this.modelId = modelId;
        this.predictionDate = LocalDateTime.now();
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Double getChurnProbability() { return churnProbability; }
    public void setChurnProbability(Double churnProbability) { this.churnProbability = churnProbability; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public String getRecommendedPlan() { return recommendedPlan; }
    public void setRecommendedPlan(String recommendedPlan) { this.recommendedPlan = recommendedPlan; }

    public LocalDateTime getPredictionDate() { return predictionDate; }
    public void setPredictionDate(LocalDateTime predictionDate) { this.predictionDate = predictionDate; }

    public Long getModelId() { return modelId; }
    public void setModelId(Long modelId) { this.modelId = modelId; }
}
