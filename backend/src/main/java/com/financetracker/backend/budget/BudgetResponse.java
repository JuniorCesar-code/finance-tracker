package com.financetracker.backend.budget;

import java.math.BigDecimal;

public class BudgetResponse {

    private Long id;
    private BigDecimal allocatedAmount;
    private BigDecimal spent;
    private BigDecimal remaining;
    private BigDecimal usagePercentage;
    private String status;
    private Integer month;
    private Integer year;
    private Long categoryId;
    private String categoryName;

    public BudgetResponse(
            Long id,
            BigDecimal allocatedAmount,
            BigDecimal spent,
            BigDecimal remaining,
            BigDecimal usagePercentage,
            String status,
            Integer month,
            Integer year,
            Long categoryId,
            String categoryName) {

        this.id = id;
        this.allocatedAmount = allocatedAmount;
        this.spent = spent;
        this.remaining = remaining;
        this.usagePercentage = usagePercentage;
        this.status = status;
        this.month = month;
        this.year = year;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
    }

    public Long getId() {
        return id;
    }

    public BigDecimal getAllocatedAmount() {
        return allocatedAmount;
    }

    public BigDecimal getSpent() {
        return spent;
    }

    public BigDecimal getRemaining() {
        return remaining;
    }

    public BigDecimal getUsagePercentage() {
        return usagePercentage;
    }

    public String getStatus() {
        return status;
    }

    public Integer getMonth() {
        return month;
    }

    public Integer getYear() {
        return year;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }
}