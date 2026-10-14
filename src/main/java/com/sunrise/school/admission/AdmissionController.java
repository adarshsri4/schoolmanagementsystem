package com.sunrise.school.admission;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.UUID;

@RestController
@RequestMapping("/api/admissions")
@CrossOrigin(origins = "*") // Restrict to your real website domain before production.
public class AdmissionController {
    private final AdmissionRepository repository;
    public AdmissionController(AdmissionRepository repository) { this.repository = repository; }

    public record AdmissionRequest(@NotBlank String studentName, @NotBlank String parentName,
        @Email @NotBlank String email, @NotBlank @Pattern(regexp="[0-9+() -]{7,20}") String phone,
        @NotBlank String requestedClass, @NotBlank String address) {}

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Admission create(@Valid @RequestBody AdmissionRequest request) {
        Admission a = new Admission();
        a.applicationNumber = "SPS-" + UUID.randomUUID().toString().substring(0,8).toUpperCase();
        a.studentName = request.studentName().trim(); a.parentName = request.parentName().trim();
        a.email = request.email().trim(); a.phone = request.phone().trim();
        a.requestedClass = request.requestedClass().trim(); a.address = request.address().trim();
        return repository.save(a);
    }

    @GetMapping("/{applicationNumber}")
    public Admission status(@PathVariable String applicationNumber) {
        return repository.findByApplicationNumberIgnoreCase(applicationNumber)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));
    }
}
