package com.financetracker.backend.budget;

import com.financetracker.backend.transaction.Transaction;
import com.financetracker.backend.transaction.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final TransactionRepository transactionRepository;

    public BudgetService(
            BudgetRepository budgetRepository,
            TransactionRepository transactionRepository) {

        this.budgetRepository = budgetRepository;
        this.transactionRepository = transactionRepository;
    }

    public List<BudgetResponse> getBudgets(Long userId) {

        List<Budget> budgets = budgetRepository.findByUserId(userId);

        return budgets.stream()
                .map(this::calculateBudget)
                .toList();
    }

    private BudgetResponse calculateBudget(Budget budget) {

        List<Transaction> transactions =
                transactionRepository.findByUserIdAndCategoryId(
                        budget.getUser().getId(),
                        budget.getCategory().getId()
                );

        BigDecimal spent = transactions.stream()
                .filter(transaction ->
                        "EXPENSE".equalsIgnoreCase(transaction.getType()))
                .filter(transaction ->
                        transaction.getDate().getMonthValue() == budget.getMonth())
                .filter(transaction ->
                        transaction.getDate().getYear() == budget.getYear())
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal remaining =
                budget.getAllocatedAmount().subtract(spent);

        BigDecimal usagePercentage = BigDecimal.ZERO;

        if (budget.getAllocatedAmount().compareTo(BigDecimal.ZERO) > 0) {
            usagePercentage = spent
                    .multiply(BigDecimal.valueOf(100))
                    .divide(
                            budget.getAllocatedAmount(),
                            2,
                            RoundingMode.HALF_UP
                    );
        }

        String status;

        if (usagePercentage.compareTo(BigDecimal.valueOf(80)) < 0) {
            status = "GREEN";
        } else if (usagePercentage.compareTo(BigDecimal.valueOf(100)) <= 0) {
            status = "ORANGE";
        } else {
            status = "RED";
        }

        return new BudgetResponse(
                budget.getId(),
                budget.getAllocatedAmount(),
                spent,
                remaining,
                usagePercentage,
                status,
                budget.getMonth(),
                budget.getYear(),
                budget.getCategory().getId(),
                budget.getCategory().getName()
        );
    }
}