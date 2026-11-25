package com.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Table(name = "intakes")
public class Intake {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id", nullable = false)
    private Schedule schedule;

    @Column(name = "planned_datetime")
    private LocalDateTime plannedDatetime;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private IntakeStatus status;

    @JsonIgnore
    @OneToMany(mappedBy = "intake", cascade = CascadeType.ALL)
    private List<IntakeStatusHistory> history;
}