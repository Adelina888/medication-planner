package com.example.backend.service;

import com.example.backend.entity.*;
import com.example.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final IntakeRepository intakeRepository;
    private final UserRepository userRepository;

    public List<Notification> getUnread(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return notificationRepository.findByUserAndIsReadFalse(user);
    }

    public void markAsRead(Long id) {
        Notification n = notificationRepository.findById(id).orElseThrow();
        n.setIsRead(true);
        notificationRepository.save(n);
    }

    public void createNotificationForIntake(Intake intake) {
        Notification n = new Notification();
        n.setUser(intake.getSchedule().getUser());
        n.setIntake(intake);
        n.setMessage("Пора принять: " + intake.getSchedule().getMedicine().getName() + " (" + intake.getSchedule().getDosage() + ")");
        notificationRepository.save(n);
    }
    public boolean notificationExists(Long intakeId) { return notificationRepository.existsByIntakeIdAndIsReadFalse(intakeId); }
    public void checkUpcomingIntakes() {
        LocalDateTime now = LocalDateTime.now();
        List<Intake> allPlanned = intakeRepository.findAll().stream()
                .filter(i -> i.getStatus() == IntakeStatus.PLANNED).toList();

        for (Intake intake : allPlanned) {
            if (intake.getPlannedDatetime().isAfter(now) && intake.getPlannedDatetime().isBefore(now.plusMinutes(2))) {
                boolean exists = notificationRepository.existsByIntakeIdAndIsReadFalse(intake.getId());
                if (!exists) {
                    Notification n = new Notification();
                    n.setUser(intake.getSchedule().getUser());
                    n.setIntake(intake);
                    n.setMessage("Скоро прием: " + intake.getSchedule().getMedicine().getName());
                    notificationRepository.save(n);
                }
            }
        }
    }
}