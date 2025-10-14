package com.ksj.clouddoctorweb.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "resources")
@Data
public class Resource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "account_id", nullable = false)
    private Long accountId;
    
    @Column(name = "resource_type", nullable = false)
    private String resourceType;
    
    @Column(name = "resource_id", nullable = false)
    private String resourceId;
    
    @Column(name = "resource_name")
    private String resourceName;
    
    private String status;
    
    @Column(name = "cost_per_hour", precision = 10, scale = 4)
    private BigDecimal costPerHour;
    
    @Column(name = "last_scanned")
    private LocalDateTime lastScanned = LocalDateTime.now();
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}