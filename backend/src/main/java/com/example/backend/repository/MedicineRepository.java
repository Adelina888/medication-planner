package com.example.backend.repository;


import com.example.backend.entity.Medicine;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    List<Medicine> findByUser(User user);
}