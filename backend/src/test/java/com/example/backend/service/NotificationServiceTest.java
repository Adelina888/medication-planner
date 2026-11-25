package com.example.backend.service;

import com.example.backend.entity.*;
import com.example.backend.repository.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock private NotificationRepository notificationRepository;
    @Mock private IntakeRepository intakeRepository;
    @Mock private UserRepository userRepository;
    @InjectMocks private NotificationService service;

    @Test
    void shouldCreateNotificationForIntake() {
        User u = new User(); Medicine m = new Medicine(); m.setName("X");
        Schedule s = new Schedule(); s.setUser(u); s.setMedicine(m); s.setDosage("1");
        Intake i = new Intake(); i.setSchedule(s);

        service.createNotificationForIntake(i);

        verify(notificationRepository).save(any(Notification.class));
    }

    @Test
    void shouldMarkAsRead() {
        Notification n = new Notification(); n.setIsRead(false);
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(n));

        service.markAsRead(1L);

        verify(notificationRepository).save(n);
    }
}