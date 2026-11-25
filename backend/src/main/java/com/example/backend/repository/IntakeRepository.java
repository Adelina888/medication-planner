package com.example.backend.repository;

import com.example.backend.entity.Intake;
import com.example.backend.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IntakeRepository extends JpaRepository<Intake, Long> {
    List<Intake> findBySchedule(Schedule schedule);
}