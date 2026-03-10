package com.example.subscription.ai.repository;

import com.example.subscription.ai.entity.ChurnPrediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChurnPredictionRepository extends JpaRepository<ChurnPrediction, Long> {

    // Find latest prediction for a user
    Optional<ChurnPrediction> findTopByUserIdOrderByPredictionDateDesc(Long userId);

    // Find all predictions for a user
    List<ChurnPrediction> findByUserId(Long userId);

    // Find all high-risk users
    List<ChurnPrediction> findByRiskLevel(String riskLevel);

    // Find predictions by model version
    List<ChurnPrediction> findByModelId(Long modelId);
}
