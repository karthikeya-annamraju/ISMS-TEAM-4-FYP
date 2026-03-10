package com.example.subscription.ai.repository;

import com.example.subscription.ai.entity.MLModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MLModelRepository extends JpaRepository<MLModel, Long> {

    // Find active model
    Optional<MLModel> findByIsActiveTrueOrderByTrainingDateDesc();

    // Find all models
    List<MLModel> findByOrderByTrainingDateDesc();

    // Find model by name
    Optional<MLModel> findByModelName(String modelName);
}
