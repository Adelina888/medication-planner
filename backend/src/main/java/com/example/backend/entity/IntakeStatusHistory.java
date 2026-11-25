package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "intake_status_history")
@Getter
@Setter
public class IntakeStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "intake_id", nullable = false)
    private Intake intake;

    @Enumerated(EnumType.STRING)
    @Column(name = "old_status", nullable = false)
    private IntakeStatus oldStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "new_status", nullable = false)
    private IntakeStatus newStatus;

    @Column(name = "changed_at", nullable = false)
    private LocalDateTime changedAt;
}