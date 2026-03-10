package com.example.subscription.controller;

import com.example.subscription.entity.Discount;
import com.example.subscription.service.DiscountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/discounts")
public class DiscountController {

    @Autowired private DiscountService discountService;

    @PostMapping
    public Discount createDiscount(@RequestBody Discount discount) {
        return discountService.createDiscount(discount);
    }

    @GetMapping("/validate/{code}")
    public Discount validate(@PathVariable String code) {
        return discountService.validateCode(code);
    }
}
