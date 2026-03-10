package com.example.subscription.ai.dto;

public class ChurnPredictionDTO {

    private Long userId;
    private Double churnProbability;
    private String riskLevel;
    private String recommendedPlan;
    private String predictionDate;

    // Constructors
    public ChurnPredictionDTO() {}

    public ChurnPredictionDTO(Long userId, Double churnProbability, String riskLevel, String recommendedPlan) {
        this.userId = userId;
        this.churnProbability = churnProbability;
        this.riskLevel = riskLevel;
        this.recommendedPlan = recommendedPlan;
    }

    // Getters & Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Double getChurnProbability() { return churnProbability; }
    public void setChurnProbability(Double churnProbability) { this.churnProbability = churnProbability; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public String getRecommendedPlan() { return recommendedPlan; }
    public void setRecommendedPlan(String recommendedPlan) { this.recommendedPlan = recommendedPlan; }

    public String getPredictionDate() { return predictionDate; }
    public void setPredictionDate(String predictionDate) { this.predictionDate = predictionDate; }
}
