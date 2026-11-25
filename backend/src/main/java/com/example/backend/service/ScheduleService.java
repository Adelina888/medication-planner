package com.example.backend.service;

import com.example.backend.entity.Medicine;
import com.example.backend.entity.Schedule;
import com.example.backend.entity.User;
import com.example.backend.repository.MedicineRepository;
import com.example.backend.repository.ScheduleRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleService {
    private final ScheduleRepository scheduleRepository;
    private final UserRepository userRepository;
    private final MedicineRepository medicineRepository;

    public List<Schedule> getAllByUser(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return scheduleRepository.findByUser(user);
    }

    public Schedule create(String email, Schedule schedule, Long medicineId) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Medicine medicine = medicineRepository.findById(medicineId).orElseThrow();

        schedule.setUser(user);
        schedule.setMedicine(medicine);
        return scheduleRepository.save(schedule);
    }
    public Schedule update(Long id, Schedule updatedSchedule, Long medicineId) {
        Schedule schedule = scheduleRepository.findById(id).orElseThrow();
        Medicine medicine = medicineRepository.findById(medicineId).orElseThrow();

        schedule.setMedicine(medicine);
        schedule.setDosage(updatedSchedule.getDosage());
        schedule.setFrequency(updatedSchedule.getFrequency());
        schedule.setIntakeTime(updatedSchedule.getIntakeTime());
        schedule.setStartDate(updatedSchedule.getStartDate());
        schedule.setEndDate(updatedSchedule.getEndDate());
        schedule.setComment(updatedSchedule.getComment());

        return scheduleRepository.save(schedule);
    }
    public void delete(Long id) {
        scheduleRepository.deleteById(id);
    }
}