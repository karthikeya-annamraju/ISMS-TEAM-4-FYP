package com.example.subscription.ai.service;

import com.example.subscription.ai.dto.ChurnPredictionDTO;
import com.example.subscription.ai.dto.ModelTrainingResponseDTO;
import com.example.subscription.ai.entity.ChurnPrediction;
import com.example.subscription.ai.entity.MLModel;
import com.example.subscription.ai.repository.ChurnPredictionRepository;
import com.example.subscription.ai.repository.MLModelRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * AI Service Layer - Handles communication with Python ML Service
 * Responsibilities:
 * - CSV file handling and storage
 * - Train churn prediction models
 * - Generate churn predictions
 * - Provide personalized plan recommendations
 */
@Service
public class AIService {

    @Autowired
    private ChurnPredictionRepository churnPredictionRepository;

    @Autowired
    private MLModelRepository mlModelRepository;

    @Autowired
    private PythonMLClient pythonMLClient;

    @Value("${ai.upload.dir:uploads/csv}")
    private String uploadDir;

    private static final String RANDOM_FOREST_MODEL_TYPE = "RANDOM_FOREST";

    /**
     * Upload CSV dataset and initiate model training
     *
     * @param file CSV file containing training data
     * @return Training response with model ID and accuracy
     */
    public ModelTrainingResponseDTO uploadAndTrainModel(MultipartFile file) throws IOException {
        // Validate file
        if (file.isEmpty() || !file.getOriginalFilename().endsWith(".csv")) {
            return new ModelTrainingResponseDTO(null, null, null, "Invalid CSV file", "FAILED");
        }

        // Save file to disk
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }
        File savedFile = new File(uploadDir + "/" + fileName);
        file.transferTo(savedFile);

        // Call Python ML Service for training
        try {
            JsonNode trainingResult = pythonMLClient.trainModel(savedFile.getAbsolutePath());

            // Extract results
            double accuracy = trainingResult.get("accuracy").asDouble();
            int dataSize = trainingResult.get("data_size").asInt();

            // Save model metadata to database
            String modelName = "ChurnModel_" + System.currentTimeMillis();
            MLModel model = new MLModel(modelName, RANDOM_FOREST_MODEL_TYPE, accuracy, dataSize, savedFile.getAbsolutePath());
            MLModel savedModel = mlModelRepository.save(model);

            return new ModelTrainingResponseDTO(
                    savedModel.getId(),
                    modelName,
                    accuracy,
                    "Model trained successfully with " + dataSize + " records",
                    "SUCCESS"
            );
        } catch (Exception e) {
            return new ModelTrainingResponseDTO(null, null, null, "Training failed: " + e.getMessage(), "FAILED");
        }
    }

    /**
     * Predict churn probability for a user
     *
     * @param userId User ID for which to predict churn
     * @return Churn prediction with risk level and recommendations
     */
    public ChurnPredictionDTO predictChurn(Long userId) throws IOException {
        // Get active model
        Optional<MLModel> activeModel = mlModelRepository.findByIsActiveTrueOrderByTrainingDateDesc();
        if (activeModel.isEmpty()) {
            throw new RuntimeException("No active ML model found. Please train a model first.");
        }

        MLModel model = activeModel.get();

        // Call Python ML Service for prediction
        JsonNode predictionResult = pythonMLClient.predictChurn(userId, model.getModelPath());

        double churnProbability = predictionResult.get("churn_probability").asDouble();
        String riskLevel = determineRiskLevel(churnProbability);
        String recommendation = generateRecommendation(churnProbability, userId);

        // Save prediction to database
        ChurnPrediction prediction = new ChurnPrediction(
                userId,
                churnProbability,
                riskLevel,
                recommendation,
                model.getId()
        );
        ChurnPrediction savedPrediction = churnPredictionRepository.save(prediction);

        // Convert to DTO
        return convertToDTO(savedPrediction);
    }

    /**
     * Get latest churn prediction for a user
     */
    public Optional<ChurnPredictionDTO> getLatestPrediction(Long userId) {
        Optional<ChurnPrediction> prediction = churnPredictionRepository.findTopByUserIdOrderByPredictionDateDesc(userId);
        return prediction.map(this::convertToDTO);
    }

    /**
     * Get all high-risk users (for admin dashboard)
     */
    public List<ChurnPredictionDTO> getHighRiskUsers() {
        return churnPredictionRepository.findByRiskLevel("HIGH")
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get all medium-risk users
     */
    public List<ChurnPredictionDTO> getMediumRiskUsers() {
        return churnPredictionRepository.findByRiskLevel("MEDIUM")
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get model statistics (for admin)
     */
    public MLModel getActiveModel() {
        return mlModelRepository.findByIsActiveTrueOrderByTrainingDateDesc().orElse(null);
    }

    /**
     * Determine risk level based on churn probability
     */
    private String determineRiskLevel(Double probability) {
        if (probability > 0.7) return "HIGH";
        if (probability > 0.4) return "MEDIUM";
        return "LOW";
    }

    /**
     * Generate personalized plan recommendation based on churn analysis
     */
    private String generateRecommendation(Double churnProbability, Long userId) {
        if (churnProbability > 0.7) {
            return "Recommend: Premium Plan upgrade with 30% discount to retain high-value customer";
        } else if (churnProbability > 0.4) {
            return "Recommend: Mid-tier plan with loyalty bonus to improve engagement";
        } else {
            return "Low churn risk: Consider retention programs for optimal lifetime value";
        }
    }

    /**
     * Convert entity to DTO
     */
    private ChurnPredictionDTO convertToDTO(ChurnPrediction prediction) {
        ChurnPredictionDTO dto = new ChurnPredictionDTO(
                prediction.getUserId(),
                prediction.getChurnProbability(),
                prediction.getRiskLevel(),
                prediction.getRecommendedPlan()
        );
        dto.setPredictionDate(prediction.getPredictionDate().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        return dto;
    }
}
