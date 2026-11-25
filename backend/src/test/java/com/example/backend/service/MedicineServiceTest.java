package com.example.backend.service;

import com.example.backend.entity.Medicine;
import com.example.backend.entity.User;
import com.example.backend.repository.MedicineRepository;
import com.example.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MedicineServiceTest {
    @Mock private MedicineRepository medicineRepository;
    @Mock private UserRepository userRepository;
    @InjectMocks private MedicineService medicineService;

    @Test
    void shouldCreateMedicine() {
        User user = new User(); user.setEmail("test@test.com");
        Medicine med = new Medicine(); med.setName("Аспирин");

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(medicineRepository.save(any(Medicine.class))).thenReturn(med);

        Medicine result = medicineService.create("test@test.com", med);
        assertNotNull(result);
        assertEquals("Аспирин", result.getName());
    }

    @Test
    void shouldUpdateMedicine() {
        Medicine existing = new Medicine(); existing.setId(1L); existing.setName("Старое");
        Medicine updated = new Medicine(); updated.setName("Новое");

        when(medicineRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(medicineRepository.save(any(Medicine.class))).thenReturn(existing);

        Medicine result = medicineService.update(1L, updated);
        assertEquals("Новое", result.getName());
    }

    @Test
    void shouldGetAllByUser() {
        User user = new User(); user.setEmail("test@test.com");
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(medicineRepository.findByUser(user)).thenReturn(List.of(new Medicine()));

        List<Medicine> result = medicineService.getAllByUser("test@test.com");
        assertEquals(1, result.size());
    }

    @Test
    void shouldDeleteMedicine() {
        medicineService.delete(1L);
        verify(medicineRepository).deleteById(1L);
    }
}