package com.example.backend.service;

import com.example.backend.entity.*;
import com.example.backend.repository.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IntakeServiceTest {

    @Mock private IntakeRepository intakeRepository;
    @Mock private IntakeHistoryRepository historyRepository;
    @Mock private ScheduleRepository scheduleRepository;
    @Mock private UserRepository userRepository;
    @InjectMocks private IntakeService service;

    @Test
    void shouldCreateIntakeWithHistory() {
        Schedule s = new Schedule();
        when(scheduleRepository.findById(1L)).thenReturn(Optional.of(s));
        when(intakeRepository.save(any(Intake.class))).thenAnswer(inv -> {
            Intake i = inv.getArgument(0); i.setId(10L); return i;
        });

        Intake result = service.createIntake(1L, LocalDateTime.now());

        assertNotNull(result);
        assertEquals(IntakeStatus.PLANNED, result.getStatus());
        verify(historyRepository).save(any(IntakeStatusHistory.class));
    }

    @Test
    void shouldChangeStatusAndWriteHistory() {
        Intake i = new Intake();
        i.setId(5L); i.setStatus(IntakeStatus.PLANNED);
        when(intakeRepository.findById(5L)).thenReturn(Optional.of(i));

        Intake result = service.changeStatus(5L, IntakeStatus.TAKEN);

        assertEquals(IntakeStatus.TAKEN, result.getStatus());
        verify(historyRepository).save(argThat((IntakeStatusHistory h) ->
                h.getOldStatus() == IntakeStatus.PLANNED &&
                        h.getNewStatus() == IntakeStatus.TAKEN
        ));
    }

    @Test
    void shouldNotGenerateDuplicateForToday() {
        User u = new User(); u.setEmail("a@b.c");
        Schedule s = new Schedule();
        s.setStatus("ACTIVE"); s.setIntakeTime(LocalDateTime.now().toLocalTime());
        Intake existing = new Intake();
        existing.setPlannedDatetime(LocalDateTime.now());

        when(userRepository.findByEmail("a@b.c")).thenReturn(Optional.of(u));
        when(scheduleRepository.findByUser(u)).thenReturn(List.of(s));
        when(intakeRepository.findBySchedule(s)).thenReturn(List.of(existing));

        List<Intake> created = service.generateForToday("a@b.c");

        assertTrue(created.isEmpty());
        verify(intakeRepository, never()).save(any());
    }
}