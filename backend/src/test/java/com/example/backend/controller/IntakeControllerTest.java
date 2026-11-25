package com.example.backend.controller;

import com.example.backend.entity.*;
import com.example.backend.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;


import java.time.LocalTime;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class IntakeControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private IntakeRepository intakeRepository;
    @Autowired private IntakeHistoryRepository historyRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ScheduleRepository scheduleRepository;
    @Autowired private MedicineRepository medicineRepository;

    @BeforeEach
    void setUp() {
        historyRepository.deleteAll();
        intakeRepository.deleteAll();
        scheduleRepository.deleteAll();
        medicineRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void shouldGenerateIntakesAndChangeStatus() throws Exception {
        User user = new User();
        user.setEmail("test@test.com");
        user.setName("Test");
        user.setPasswordHash("dummy");
        userRepository.save(user);

        Medicine med = new Medicine();
        med.setName("Аспирин");
        med.setUser(user);
        medicineRepository.save(med);

        Schedule sch = new Schedule();
        sch.setUser(user);
        sch.setMedicine(med);
        sch.setStatus("ACTIVE");
        sch.setIntakeTime(LocalTime.now());
        scheduleRepository.save(sch);

        mockMvc.perform(post("/api/intakes/generate")
                        .with(user("test@test.com"))
                        .header("Origin", "http://localhost:5173"))
                .andExpect(status().isOk());

        Intake intake = intakeRepository.findAll().get(0);

        mockMvc.perform(patch("/api/intakes/" + intake.getId() + "/status")
                        .with(user("test@test.com"))  // <--
                        .header("Origin", "http://localhost:5173")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\": \"TAKEN\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("TAKEN"));

        mockMvc.perform(get("/api/intakes/" + intake.getId() + "/history")
                        .with(user("test@test.com"))  // <--
                        .header("Origin", "http://localhost:5173"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].newStatus").value("TAKEN"));
    }
    @Test
    void shouldGetAllByUser() throws Exception {
        User user = new User();
        user.setEmail("test2@test.com");
        user.setName("Test2");
        user.setPasswordHash("dummy");
        userRepository.save(user);

        mockMvc.perform(get("/api/intakes")
                        .with(user("test2@test.com"))
                        .header("Origin", "http://localhost:5173"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }
}