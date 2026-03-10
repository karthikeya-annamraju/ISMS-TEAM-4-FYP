package com.example.subscription.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.io.IOException;
import java.util.Map;

/**
 * Python ML Service Client
 * Communication bridge between Spring Boot and Python ML Service
 * Handles: model training, churn prediction, recommendations
 */
@Component
public class PythonMLClient {

    @Value("${python.ml.service.url:http://localhost:5000}")
    private String pythonServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Send CSV file to Python service for model training
     */
    public JsonNode trainModel(String csvFilePath) throws IOException {
        String endpoint = pythonServiceUrl + "/api/train";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> requestBody = Map.of("csv_path", csvFilePath);
        HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);

        try {
            String response = restTemplate.postForObject(endpoint, request, String.class);
            return objectMapper.readTree(response);
        } catch (Exception e) {
            throw new IOException("Training request failed: " + e.getMessage(), e);
        }
    }

    /**
     * Request churn prediction for a user from Python service
     */
    public JsonNode predictChurn(Long userId, String modelPath) throws IOException {
        String endpoint = pythonServiceUrl + "/api/predict";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = Map.of(
                "user_id", userId,
                "model_path", modelPath
        );
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            String response = restTemplate.postForObject(endpoint, request, String.class);
            return objectMapper.readTree(response);
        } catch (Exception e) {
            throw new IOException("Prediction request failed: " + e.getMessage(), e);
        }
    }
}
