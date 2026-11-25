package com.example.backend.service;

import com.example.backend.entity.Intake;
import com.example.backend.entity.IntakeStatus;
import com.example.backend.entity.IntakeStatusHistory;
import com.example.backend.repository.IntakeHistoryRepository;
import com.example.backend.repository.IntakeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class IntakeScheduler {
    private final IntakeRepository intakeRepository;
    private final IntakeHistoryRepository historyRepository;
    private final NotificationService notificationService;

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void processIntakes() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime fiveMinutesAgo = now.minusMinutes(5);

        List<Intake> allIntakes = intakeRepository.findAll();

        for (Intake intake : allIntakes) {
            if (intake.getStatus() != IntakeStatus.PLANNED) {continue;}

            if (intake.getPlannedDatetime().isBefore(fiveMinutesAgo)) {
                intake.setStatus(IntakeStatus.SKIPPED);
                intakeRepository.save(intake);

                IntakeStatusHistory history = new IntakeStatusHistory();
                history.setIntake(intake);
                history.setOldStatus(IntakeStatus.PLANNED);
                history.setNewStatus(IntakeStatus.SKIPPED);
                history.setChangedAt(now);
                historyRepository.save(history);
            }

            else if (intake.getPlannedDatetime().isAfter(now) && intake.getPlannedDatetime().isBefore(now.plusMinutes(2))) {
                boolean exists = notificationService.notificationExists(intake.getId());
                if (!exists) {
                    notificationService.createNotificationForIntake(intake);
                }
            }
        }
    }
}