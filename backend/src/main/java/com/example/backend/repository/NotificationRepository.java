package com.example.backend.repository;


import com.example.backend.entity.Notification;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserAndIsReadFalse(User user);
    boolean existsByIntakeIdAndIsReadFalse(Long intakeId);
}