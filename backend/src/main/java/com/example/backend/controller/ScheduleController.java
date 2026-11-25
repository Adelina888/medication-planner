package com.example.backend.controller;

import com.example.backend.entity.Schedule;
import com.example.backend.service.ScheduleService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class ScheduleController {
    private final ScheduleService service;

    @GetMapping
    public List<Schedule> getAll(Principal principal) {
        return service.getAllByUser(principal.getName());
    }

    @PostMapping
    public Schedule create(Principal principal, @RequestBody ScheduleRequest request) {
        return service.create(principal.getName(), request.getSchedule(), request.getMedicineId());
    }
    @PutMapping("/{id}")
    public Schedule update(@PathVariable Long id, @RequestBody ScheduleRequest request) {
        return service.update(id, request.getSchedule(), request.getMedicineId());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}

@Data
class ScheduleRequest {
    private Schedule schedule;
    private Long medicineId;
}