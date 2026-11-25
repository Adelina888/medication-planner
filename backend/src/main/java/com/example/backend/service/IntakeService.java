package com.example.backend.service;

import com.example.backend.entity.*;
import com.example.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
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
        return intakeRepository.save(intake);
    }

    public List<Intake> getAllBySchedule(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId).orElseThrow();
        return intakeRepository.findBySchedule(schedule);
    }

    public Intake changeStatus(Long intakeId, IntakeStatus newStatus) {
        Intake intake = intakeRepository.findById(intakeId).orElseThrow();
        IntakeStatus oldStatus = intake.getStatus();

        intake.setStatus(newStatus);
        intakeRepository.save(intake);


        IntakeStatusHistory history = new IntakeStatusHistory();
        history.setIntake(intake);
        history.setOldStatus(oldStatus);
        history.setNewStatus(newStatus);
        history.setChangedAt(LocalDateTime.now());
        historyRepository.save(history);

        return intake;
    }

    public List<IntakeStatusHistory> getHistory(Long intakeId) {
        return historyRepository.findByIntakeIdOrderByChangedAtDesc(intakeId);
    }


    public List<Intake> generateForToday(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        List<Schedule> schedules = scheduleRepository.findByUser(user);
        List<Intake> created = new java.util.ArrayList<>();

        for (Schedule schedule : schedules) {
            if (schedule.getStatus().equals("ACTIVE") && schedule.getIntakeTime() != null) {
                LocalDateTime todayTime = LocalDateTime.now().with(schedule.getIntakeTime());


                boolean exists = intakeRepository.findBySchedule(schedule).stream()
                        .anyMatch(i -> i.getPlannedDatetime().toLocalDate().equals(todayTime.toLocalDate()));

                if (!exists) {
                    Intake intake = new Intake();
                    intake.setSchedule(schedule);
                    intake.setPlannedDatetime(todayTime);
                    intake.setStatus(IntakeStatus.PLANNED);
                    created.add(intakeRepository.save(intake));
                }
            }
        }
        return created;
    }
}