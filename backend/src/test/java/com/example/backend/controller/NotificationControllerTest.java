package com.example.backend.controller;

import com.example.backend.entity.*;
import com.example.backend.repository.*;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class NotificationControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @Autowired private IntakeHistoryRepository historyRepository;
    @Autowired private IntakeRepository intakeRepository;
    @Autowired private ScheduleRepository scheduleRepository;
    @Autowired private MedicineRepository medicineRepository;
    @Autowired private NotificationRepository notificationRepository;
    @Autowired private UserRepository userRepository;

    private final String testEmail = "not@test.com";
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
        user.setName("NotifUser");
        user.setEmail(testEmail);
        user.setPasswordHash("dummy");
        userRepository.save(user);

        Medicine med = new Medicine();
        med.setName("Парацетамол");
        med.setUser(user);
        medicineRepository.save(med);

        Schedule sch = new Schedule();
        sch.setUser(user);
        sch.setMedicine(med);
        sch.setStatus("ACTIVE");
        sch.setIntakeTime(LocalDateTime.now().toLocalTime());
        sch.setStartDate(LocalDateTime.now());
        scheduleRepository.save(sch);

        Intake intake = new Intake();
        intake.setSchedule(sch);
        intake.setPlannedDatetime(LocalDateTime.now());
        intake.setStatus(IntakeStatus.PLANNED);
        intakeRepository.save(intake);

        Notification n = new Notification();
        n.setUser(user);
        n.setIntake(intake);
        n.setMessage("Пора пить таблетки");
        n.setIsRead(false);
        notificationRepository.save(n);
    }

    @Test
    void shouldGetAndReadNotification() throws Exception {
        mockMvc.perform(get("/api/notifications")
                        .with(user(testEmail))
                        .header("Origin", origin))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].message").value("Пора пить таблетки"));

        Notification n = notificationRepository.findAll().get(0);

        mockMvc.perform(patch("/api/notifications/" + n.getId() + "/read")
                        .with(user(testEmail))
                        .header("Origin", origin))
                .andExpect(status().isOk());
    }
}