package com.example.backend.controller;

import com.example.backend.entity.Medicine;
import com.example.backend.service.MedicineService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/medicines")
@RequiredArgsConstructor
public class MedicineController {
    private final MedicineService service;

    @GetMapping
    public List<Medicine> getAll(Principal principal) {
        return service.getAllByUser(principal.getName());
    }

    @PostMapping
    public Medicine create(Principal principal, @RequestBody Medicine medicine) {
        return service.create(principal.getName(), medicine);
    }

    @PutMapping("/{id}")
    public Medicine update(@PathVariable Long id, @RequestBody Medicine medicine) {
        return service.update(id, medicine);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}