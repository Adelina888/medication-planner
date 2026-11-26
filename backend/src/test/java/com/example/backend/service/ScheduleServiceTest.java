package com.example.backend.service;

import com.example.backend.entity.Medicine;
import com.example.backend.entity.Schedule;
import com.example.backend.entity.User;
import com.example.backend.repository.MedicineRepository;
import com.example.backend.repository.ScheduleRepository;
import com.example.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ScheduleServiceTest {
    @Mock private ScheduleRepository scheduleRepository;
    @Mock private UserRepository userRepository;
    @Mock private MedicineRepository medicineRepository;
    @InjectMocks private ScheduleService scheduleService;

    @Test
    void shouldCreateSchedule() {
        User user = new User(); user.setEmail("test@test.com");
        Medicine med = new Medicine(); med.setId(1L);
        Schedule sch = new Schedule(); sch.setDosage("1 таблетка");

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(medicineRepository.findById(1L)).thenReturn(Optional.of(med));
        when(scheduleRepository.save(any(Schedule.class))).thenReturn(sch);

        Schedule result = scheduleService.create("test@test.com", sch, 1L);
        assertNotNull(result);
        assertEquals("1 таблетка", result.getDosage());
    }

    @Test
    void shouldUpdateSchedule() {
        Medicine med = new Medicine();
        med.setId(1L);

        Schedule existing = new Schedule();
        existing.setId(1L);
        existing.setDosage("Старая");

        Schedule updatedData = new Schedule();
        updatedData.setDosage("Новая");

        when(scheduleRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(medicineRepository.findById(1L)).thenReturn(Optional.of(med));

        when(scheduleRepository.save(any(Schedule.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Schedule result = scheduleService.update(1L, updatedData, 1L);

        assertEquals("Новая", result.getDosage());
        verify(scheduleRepository).save(any(Schedule.class));
    }

    @Test
    void shouldDeleteSchedule() {
        scheduleService.delete(1L);
        verify(scheduleRepository).deleteById(1L);
    }

    @Test
    void shouldGetAllByUser() {
        User user = new User();
        user.setEmail("test@test.com");

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(scheduleRepository.findByUserOrderByStartDateAsc(user)).thenReturn(java.util.List.of(new Schedule()));

        java.util.List<Schedule> result = scheduleService.getAllByUser("test@test.com");
        assertEquals(1, result.size());
    }
}