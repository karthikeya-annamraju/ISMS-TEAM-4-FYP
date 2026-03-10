package com.example.subscription.ai.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ml_models")
public class MLModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String modelName; // e.g., "ChurnPredictionModel_v1"

    @Column(nullable = false)
    private String modelType; // RANDOM_FOREST, etc.

    @Column(nullable = false)
    private Double accuracy; // Training accuracy score

    @Column(nullable = false)
    private Integer trainingDataSize; // Number of records used

    @Column(nullable = false)
    private LocalDateTime trainingDate;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column(length = 500)
    private String modelPath; // Path to serialized model file

    // Constructors
    public MLModel() {}

    public MLModel(String modelName, String modelType, Double accuracy, Integer trainingDataSize, String modelPath) {
        this.modelName = modelName;
        this.modelType = modelType;
        this.accuracy = accuracy;
        this.trainingDataSize = trainingDataSize;
        this.modelPath = modelPath;
        this.trainingDate = LocalDateTime.now();
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }

    public String getModelType() { return modelType; }
    public void setModelType(String modelType) { this.modelType = modelType; }

    public Double getAccuracy() { return accuracy; }
    public void setAccuracy(Double accuracy) { this.accuracy = accuracy; }

    public Integer getTrainingDataSize() { return trainingDataSize; }
    public void setTrainingDataSize(Integer trainingDataSize) { this.trainingDataSize = trainingDataSize; }

    public LocalDateTime getTrainingDate() { return trainingDate; }
    public void setTrainingDate(LocalDateTime trainingDate) { this.trainingDate = trainingDate; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean active) { this.isActive = active; }

    public String getModelPath() { return modelPath; }
    public void setModelPath(String modelPath) { this.modelPath = modelPath; }
}
