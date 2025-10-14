package com.ksj.clouddoctorweb.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "cloud_providers")
@Data
public class CloudProvider {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(name = "display_name", nullable = false)
    private String displayName;
    
    @Column(name = "icon_url")
    private String iconUrl;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
}