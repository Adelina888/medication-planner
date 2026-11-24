package com.example.backend.entity;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "medicines")
public class Medicine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String name;

    private String description;

    private String form;

    private String unit; 
}