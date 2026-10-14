package com.sunrise.school.payment;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*") // Restrict to your real website domain before production.
public class PaymentController {
    private final PaymentRepository repository;
    public PaymentController(PaymentRepository repository) { this.repository = repository; }

    // This endpoint records a DEMO payment intent only. It does not charge money.
    public record DemoPaymentRequest(@NotBlank String studentId, @NotBlank String studentName, @NotBlank String feeType) {}

    @PostMapping("/demo")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> createDemo(@Valid @RequestBody DemoPaymentRequest request) {
        Map<String, Long> fees = Map.of("tuition", 850000L, "admission", 500000L, "transport", 300000L, "exam", 120000L);
        Long amount = fees.get(request.feeType().toLowerCase());
        if (amount == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown fee type");
        Payment p = new Payment(); p.reference = "DEMO-" + UUID.randomUUID().toString().substring(0,8).toUpperCase();
        p.studentId = request.studentId().trim(); p.studentName = request.studentName().trim();
        p.feeType = request.feeType().toLowerCase(); p.amountInPaise = amount; p.status = "DEMO_ONLY_NOT_PAID";
        repository.save(p);
        return Map.of("reference", p.reference, "amountInPaise", p.amountInPaise, "status", p.status,
            "message", "Demo record only. No money was charged.");
    }

    @GetMapping("/{reference}")
    public Payment receipt(@PathVariable String reference) {
        return repository.findByReferenceIgnoreCase(reference)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment reference not found"));
    }
}
