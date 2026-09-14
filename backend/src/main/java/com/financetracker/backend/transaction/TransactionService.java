package com.financetracker.backend.transaction;

import com.financetracker.backend.user.User;
import com.financetracker.backend.user.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionService(
            TransactionRepository transactionRepository,
            UserRepository userRepository) {

        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    public Transaction createTransaction(
            Long userId,
            TransactionRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Transaction transaction = new Transaction(
                request.getType(),
                request.getAmount(),
                request.getDescription(),
                request.getDate(),
                user
        );

        return transactionRepository.save(transaction);
    }

    public List<Transaction> getTransactions(Long userId) {
        return transactionRepository.findByUserId(userId);
    }

    public void deleteTransaction(Long userId, Long transactionId) {

        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (!transaction.getUser().getId().equals(userId)) {
            throw new RuntimeException("You are not allowed to delete this transaction");
        }

        transactionRepository.delete(transaction);
    }
}