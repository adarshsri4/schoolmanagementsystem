package com.sunrise.school.payment;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Payment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) public Long id;
    @Column(nullable=false, unique=true) public String reference;
    @Column(nullable=false) public String studentId;
    @Column(nullable=false) public String studentName;
    @Column(nullable=false) public String feeType;
    @Column(nullable=false) public long amountInPaise;
    @Column(nullable=false) public String status = "DEMO_PENDING";
    @Column(nullable=false) public LocalDateTime createdAt = LocalDateTime.now();
}
