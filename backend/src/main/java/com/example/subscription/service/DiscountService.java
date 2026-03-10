package com.example.subscription.service;

import com.example.subscription.entity.Discount;
import com.example.subscription.repository.DiscountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class DiscountService {

    @Autowired private DiscountRepository discountRepo;

    public Discount validateCode(String code) {
        Discount discount = discountRepo.findByCode(code);
        if (discount != null && discount.getActive()
                && discount.getValidFrom().isBefore(LocalDate.now())
                && discount.getValidTo().isAfter(LocalDate.now())) {
            return discount;
        }
        return null;
    }

    public Discount createDiscount(Discount discount) {
        return discountRepo.save(discount);
    }
}
