package com.sunrise.school.admission;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Admission {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) public Long id;
    @Column(nullable=false, unique=true) public String applicationNumber;
    @Column(nullable=false) public String studentName;
    @Column(nullable=false) public String parentName;
    @Column(nullable=false) public String email;
    @Column(nullable=false) public String phone;
    @Column(nullable=false) public String requestedClass;
    @Column(nullable=false, length=1000) public String address;
    @Column(nullable=false) public String status = "RECEIVED";
    @Column(nullable=false) public LocalDateTime submittedAt = LocalDateTime.now();
}
