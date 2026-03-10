package com.example.subscription.ai.dto;

public class ModelTrainingResponseDTO {

    private Long modelId;
    private String modelName;
    private Double accuracy;
    private String message;
    private String status; // SUCCESS, FAILED

    // Constructors
    public ModelTrainingResponseDTO() {}

    public ModelTrainingResponseDTO(Long modelId, String modelName, Double accuracy, String message, String status) {
        this.modelId = modelId;
        this.modelName = modelName;
        this.accuracy = accuracy;
        this.message = message;
        this.status = status;
    }

    // Getters & Setters
    public Long getModelId() { return modelId; }
    public void setModelId(Long modelId) { this.modelId = modelId; }

    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }

    public Double getAccuracy() { return accuracy; }
    public void setAccuracy(Double accuracy) { this.accuracy = accuracy; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
