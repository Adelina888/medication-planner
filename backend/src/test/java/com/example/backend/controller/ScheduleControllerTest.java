package com.example.backend.controller;

import com.example.backend.entity.Medicine;
import com.example.backend.entity.Schedule;
import com.example.backend.entity.User;
import com.example.backend.repository.*;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class ScheduleControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @Autowired private IntakeHistoryRepository historyRepository;
    @Autowired private NotificationRepository notificationRepository;
    @Autowired private IntakeRepository intakeRepository;
    @Autowired private ScheduleRepository scheduleRepository;
    @Autowired private MedicineRepository medicineRepository;
    @Autowired private UserRepository userRepository;

    private Medicine medicine;
    private final String testEmail = "sch@test.com";
    private final String origin = "http://localhost:5173";

    @BeforeEach
    void setUp() {
        historyRepository.deleteAll();
        notificationRepository.deleteAll();
        intakeRepository.deleteAll();
        scheduleRepository.deleteAll();
        medicineRepository.deleteAll();
        userRepository.deleteAll();

        User user = new User();
        user.setName("ScheduleUser"); user.setEmail(testEmail); user.setPasswordHash("hash");
        userRepository.save(user);

        medicine = new Medicine();
        medicine.setName("Vitamin C"); medicine.setForm("capsule"); medicine.setUnit("mg"); medicine.setUser(user);
        medicineRepository.save(medicine);
    }

    @Test
    void shouldCreateSchedule() throws Exception {
        Map<String, Object> payload = Map.of(
                "medicineId", medicine.getId(),
                "schedule", Map.of("dosage", "500мг", "frequency", "1 раз в день", "intakeTime", "08:00:00",
                        "startDate", "2026-11-25T08:00:00", "endDate", "2026-12-25T08:00:00", "comment", "После еды", "status", "ACTIVE")
        );
        mockMvc.perform(post("/api/schedules")
                        .with(user(testEmail)).header("Origin", origin)
                        .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.dosage").value("500мг"));
    }

    @Test
    void shouldGetAllByUser() throws Exception {
        mockMvc.perform(get("/api/schedules").with(user(testEmail)).header("Origin", origin))
                .andExpect(status().isOk()).andExpect(jsonPath("$").isArray());
    }

    @Test
    void shouldUpdateSchedule() throws Exception {
        Schedule s = new Schedule();
        s.setUser(userRepository.findByEmail(testEmail).get()); s.setMedicine(medicine);
        s.setDosage("100мг"); s.setFrequency("weekly"); s.setIntakeTime(java.time.LocalTime.of(9, 0));
        s.setStartDate(LocalDateTime.now()); s.setStatus("ACTIVE");
        Schedule saved = scheduleRepository.save(s);

        Map<String, Object> updatePayload = Map.of(
                "medicineId", medicine.getId(),
                "schedule", Map.of("dosage", "200мг", "frequency", "weekly", "intakeTime", "09:00:00",
                        "startDate", "2026-11-25T09:00:00", "endDate", "2026-12-25T09:00:00", "comment", "Updated", "status", "ACTIVE")
        );
        mockMvc.perform(put("/api/schedules/" + saved.getId())
                        .with(user(testEmail)).header("Origin", origin)
                        .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(updatePayload)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.dosage").value("200мг"));
    }

    @Test
    void shouldDeleteSchedule() throws Exception {
        Schedule s = new Schedule();
        s.setUser(userRepository.findByEmail(testEmail).get()); s.setMedicine(medicine);
        s.setDosage("100мг"); s.setFrequency("weekly"); s.setIntakeTime(java.time.LocalTime.of(9, 0));
        s.setStartDate(LocalDateTime.now()); s.setStatus("ACTIVE");
        Schedule saved = scheduleRepository.save(s);

        mockMvc.perform(delete("/api/schedules/" + saved.getId()).with(user(testEmail)).header("Origin", origin))
                .andExpect(status().isOk());
    }
}