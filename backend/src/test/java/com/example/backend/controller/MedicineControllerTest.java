package com.example.backend.controller;

import com.example.backend.entity.Medicine;
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

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class MedicineControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @Autowired private IntakeHistoryRepository historyRepository;
    @Autowired private NotificationRepository notificationRepository;
    @Autowired private IntakeRepository intakeRepository;
    @Autowired private ScheduleRepository scheduleRepository;
    @Autowired private MedicineRepository medicineRepository;
    @Autowired private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        historyRepository.deleteAll();
        notificationRepository.deleteAll();
        intakeRepository.deleteAll();
        scheduleRepository.deleteAll();
        medicineRepository.deleteAll();
        userRepository.deleteAll();

        User u = new User();
        u.setName("Med");
        u.setEmail("med@test.com");
        u.setPasswordHash("hash");
        userRepository.save(u);
    }

    @Test
    void shouldCreateMedicine() throws Exception {
        Medicine m = new Medicine();
        m.setName("Аспирин"); m.setForm("таблетки"); m.setUnit("мг"); m.setDescription("обезболивающее");

        mockMvc.perform(post("/api/medicines")
                        .with(user("med@test.com"))
                        .header("Origin", "http://localhost:5173")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(m)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Аспирин"));
    }

    @Test
    void shouldGetAllByUser() throws Exception {
        mockMvc.perform(get("/api/medicines")
                        .with(user("med@test.com"))
                        .header("Origin", "http://localhost:5173"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void shouldUpdateAndDeleteMedicine() throws Exception {
        Medicine m = new Medicine();
        m.setName("Old"); m.setForm("x"); m.setUnit("y");

        String json = mockMvc.perform(post("/api/medicines")
                        .with(user("med@test.com"))
                        .header("Origin", "http://localhost:5173")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(m)))
                .andReturn().getResponse().getContentAsString();
        Long id = objectMapper.readTree(json).get("id").asLong();

        m.setName("New");
        mockMvc.perform(put("/api/medicines/" + id)
                        .with(user("med@test.com"))
                        .header("Origin", "http://localhost:5173")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(m)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("New"));

        mockMvc.perform(delete("/api/medicines/" + id)
                        .with(user("med@test.com"))
                        .header("Origin", "http://localhost:5173"))
                .andExpect(status().isOk());
    }
}