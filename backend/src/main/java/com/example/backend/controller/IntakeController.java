package com.example.backend.controller;

import com.example.backend.entity.Intake;
import com.example.backend.entity.IntakeStatus;
import com.example.backend.entity.IntakeStatusHistory;
import com.example.backend.service.IntakeService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
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
    public Intake updateStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        return service.changeStatus(id, request.getStatus());
    }

    @GetMapping("/{id}/history")
    public List<IntakeStatusHistory> getHistory(@PathVariable Long id) {
        return service.getHistory(id);
    }

    @PostMapping("/generate")
    public void generate(Principal principal) {
        service.generateForToday(principal.getName());
    }

    @GetMapping
    public List<Intake> getAll(Principal principal) {
        return service.getAllByUser(principal.getName());
    }
}

@Data
class IntakeRequest {
    private Long scheduleId;
    private LocalDateTime plannedDatetime;
}


@Data
class StatusUpdateRequest {
    private IntakeStatus status;
}