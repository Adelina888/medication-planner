package com.example.backend.controller;

import com.example.backend.entity.Intake;
import com.example.backend.entity.IntakeStatus;
import com.example.backend.entity.IntakeStatusHistory;
import com.example.backend.service.IntakeService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/intakes")
@RequiredArgsConstructor
public class IntakeController {
    private final IntakeService service;

    @GetMapping("/schedule/{scheduleId}")
    public List<Intake> getBySchedule(@PathVariable Long scheduleId) {
        return service.getAllBySchedule(scheduleId);
    }

    @PostMapping
    public Intake create(@RequestBody IntakeRequest request) {
        return service.createIntake(request.getScheduleId(), request.getPlannedDatetime());
    }

    @PatchMapping("/{id}/status")
    public Intake updateStatus(@PathVariable Long id, @RequestParam IntakeStatus status) {
        return service.changeStatus(id, status);
    }

    @GetMapping("/{id}/history")
    public List<IntakeStatusHistory> getHistory(@PathVariable Long id) {
        return service.getHistory(id);
    }
}

@Data
class IntakeRequest {
    private Long scheduleId;
    private LocalDateTime plannedDatetime;
}

@Data
class StatusRequest {
    private String status;
}