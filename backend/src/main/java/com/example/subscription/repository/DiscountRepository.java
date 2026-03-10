package com.example.subscription.repository;

import com.example.subscription.entity.Discount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiscountRepository extends JpaRepository<Discount, Long> {
    Discount findByCode(String code);
}
