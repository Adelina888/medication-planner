package com.example.backend.service;

import com.example.backend.entity.*;
import com.example.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IntakeService {
    private final IntakeRepository intakeRepository;
    private final IntakeHistoryRepository historyRepository;
    private final ScheduleRepository scheduleRepository;
    private final UserRepository userRepository;

    public Intake createIntake(Long scheduleId, LocalDateTime plannedTime) {
        Schedule schedule = scheduleRepository.findById(scheduleId).orElseThrow();
        Intake intake = new Intake();
        intake.setSchedule(schedule);
        intake.setPlannedDatetime(plannedTime);
        intake.setStatus(IntakeStatus.PLANNED);

        Intake saved = intakeRepository.save(intake);
        saveHistory(saved, null);
        return saved;
    }

    public List<Intake> getAllByUser(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        List<Schedule> schedules = scheduleRepository.findByUser(user);
        List<Intake> allIntakes = new ArrayList<>();

        for (Schedule schedule : schedules) {
            allIntakes.addAll(intakeRepository.findBySchedule(schedule));
        }

        allIntakes.sort(Comparator.comparing(Intake::getPlannedDatetime));

        return allIntakes;
    }

    public List<Intake> getAllBySchedule(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId).orElseThrow();
        return intakeRepository.findBySchedule(schedule); // Можно тоже отсортировать, если нужно
    }

    public Intake changeStatus(Long intakeId, IntakeStatus newStatus) {
        Intake intake = intakeRepository.findById(intakeId).orElseThrow();
        IntakeStatus oldStatus = intake.getStatus();

        intake.setStatus(newStatus);
        intakeRepository.save(intake);

        saveHistory(intake, oldStatus);
        return intake;
    }

    public List<IntakeStatusHistory> getHistory(Long intakeId) {
        return historyRepository.findByIntakeIdOrderByChangedAtDesc(intakeId);
    }

    private void saveHistory(Intake intake, IntakeStatus oldStatus) {
        IntakeStatusHistory history = new IntakeStatusHistory();
        history.setIntake(intake);
        history.setOldStatus(oldStatus);
        history.setNewStatus(intake.getStatus());
        history.setChangedAt(LocalDateTime.now());
        historyRepository.save(history);
    }

    public List<Intake> generateForToday(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        List<Schedule> schedules = scheduleRepository.findByUser(user);
        List<Intake> created = new ArrayList<>();

        for (Schedule schedule : schedules) {
            if ("ACTIVE".equals(schedule.getStatus()) && schedule.getIntakeTime() != null) {
                LocalDateTime todayTime = LocalDateTime.now().with(schedule.getIntakeTime());

                boolean exists = intakeRepository.findBySchedule(schedule).stream()
                        .anyMatch(i -> i.getPlannedDatetime().toLocalDate().equals(todayTime.toLocalDate()));

                if (!exists) {
                    Intake intake = new Intake();
                    intake.setSchedule(schedule);
                    intake.setPlannedDatetime(todayTime);
                    intake.setStatus(IntakeStatus.PLANNED);

                    Intake savedIntake = intakeRepository.save(intake);

                    saveHistory(savedIntake, null);
                    created.add(savedIntake);
                }
            }
        }
        return created;
    }
}