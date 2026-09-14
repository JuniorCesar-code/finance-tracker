package com.financetracker.backend.transaction;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody TransactionRequest request) {

        Long userId = Long.valueOf(jwt.getSubject());

        Transaction transaction =
                transactionService.createTransaction(userId, request);

        TransactionResponse response =
                new TransactionResponse(transaction);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getTransactions(
            @AuthenticationPrincipal Jwt jwt) {

        Long userId = Long.valueOf(jwt.getSubject());

        List<TransactionResponse> transactions =
                transactionService.getTransactions(userId)
                        .stream()
                        .map(TransactionResponse::new)
                        .toList();

        return ResponseEntity.ok(transactions);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long id) {

        Long userId = Long.valueOf(jwt.getSubject());

        transactionService.deleteTransaction(userId, id);

        return ResponseEntity.noContent().build();
    }
}