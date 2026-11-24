package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Medicine> medicines;

   @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Schedule> schedules;
}