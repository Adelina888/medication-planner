package com.example.backend.service;


import com.example.backend.entity.Medicine;
import com.example.backend.entity.User;
import com.example.backend.repository.MedicineRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicineService {
    private final MedicineRepository repository;
    private final UserRepository userRepository;

    public List<Medicine> getAllByUser(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return repository.findByUser(user);
    }

    public Medicine create(String email, Medicine medicine) {
        User user = userRepository.findByEmail(email).orElseThrow();
        medicine.setUser(user);
        return repository.save(medicine);
    }

    public Medicine update(Long id, Medicine updated) {
        Medicine med = repository.findById(id).orElseThrow();
        med.setName(updated.getName());
        med.setDescription(updated.getDescription());
        med.setForm(updated.getForm());
        med.setUnit(updated.getUnit());
        return repository.save(med);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}