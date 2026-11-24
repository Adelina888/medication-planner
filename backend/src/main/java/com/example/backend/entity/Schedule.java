package com.example.backend.entity;


import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Data
@Table(name = "schedules")
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medicine_id", nullable = false)
    private Medicine medicine;

    private String dosage;
    private String frequency;

    @Column(name = "intake_time")
    private LocalTime intakeTime;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    private String comment;
    private String status;
}