package com.financetracker.backend.transaction;

import com.financetracker.backend.category.Category;
import java.math.BigDecimal;
import java.time.LocalDate;

public class TransactionResponse {

    private Long id;
    private String type;
    private BigDecimal amount;
    private String description;
    private LocalDate date;

    private Long categoryId;
    private String categoryName;

    public TransactionResponse(Transaction transaction) {
        this.id = transaction.getId();
        this.type = transaction.getType();
        this.amount = transaction.getAmount();
        this.description = transaction.getDescription();
        this.date = transaction.getDate();

        Category category = transaction.getCategory();

        if (category != null) {
            this.categoryId = category.getId();
            this.categoryName = category.getName();
        }
    }

    public Long getId() {
        return id;
    }

    public String getType() {
        return type;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getDescription() {
        return description;
    }

    public LocalDate getDate() {
        return date;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }
}