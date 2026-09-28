package com.financetracker.backend.budget;

import com.financetracker.backend.category.Category;
import com.financetracker.backend.user.User;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "budgets")
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal allocatedAmount;

    @Column(nullable = false)
    private Integer month;

    @Column(nullable = false)
    private Integer year;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Budget() {
    }

    public Budget(
            BigDecimal allocatedAmount,
            Integer month,
            Integer year,
            Category category,
            User user) {

        this.allocatedAmount = allocatedAmount;
        this.month = month;
        this.year = year;
        this.category = category;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public BigDecimal getAllocatedAmount() {
        return allocatedAmount;
    }

    public Integer getMonth() {
        return month;
    }

    public Integer getYear() {
        return year;
    }

    public Category getCategory() {
        return category;
    }

    public User getUser() {
        return user;
    }
}