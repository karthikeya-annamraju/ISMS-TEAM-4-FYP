package com.example.subscription.ai.dto;

public class ModelTrainingRequestDTO {

    private String fileName;
    private Integer trainingDataSize;

    // Constructors
    public ModelTrainingRequestDTO() {}

    public ModelTrainingRequestDTO(String fileName, Integer trainingDataSize) {
        this.fileName = fileName;
        this.trainingDataSize = trainingDataSize;
    }

    // Getters & Setters
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public Integer getTrainingDataSize() { return trainingDataSize; }
    public void setTrainingDataSize(Integer trainingDataSize) { this.trainingDataSize = trainingDataSize; }
}
