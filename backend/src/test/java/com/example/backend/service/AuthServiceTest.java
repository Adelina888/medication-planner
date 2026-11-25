package com.example.backend.service;

import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;
    @InjectMocks private AuthService authService;

    @Test
    void shouldRegisterAndReturnToken() {
        when(userRepository.findByEmail("a@b.c")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("pass")).thenReturn("hash");
        when(jwtService.generateToken("a@b.c")).thenReturn("token123");

        String token = authService.register("A", "a@b.c", "pass");

        assertEquals("token123", token);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void shouldThrowWhenUserExists() {
        User u = new User();
        when(userRepository.findByEmail("a@b.c")).thenReturn(Optional.of(u));

        assertThrows(RuntimeException.class,
                () -> authService.register("A", "a@b.c", "pass"));
    }

    @Test
    void shouldLoginWithCorrectPassword() {
        User u = new User();
        u.setEmail("a@b.c"); u.setPasswordHash("hash");
        when(userRepository.findByEmail("a@b.c")).thenReturn(Optional.of(u));
        when(passwordEncoder.matches("pass", "hash")).thenReturn(true);
        when(jwtService.generateToken("a@b.c")).thenReturn("tok");

        assertEquals("tok", authService.login("a@b.c", "pass"));
    }

    @Test
    void shouldFailLoginWithWrongPassword() {
        User u = new User();
        u.setEmail("a@b.c"); u.setPasswordHash("hash");
        when(userRepository.findByEmail("a@b.c")).thenReturn(Optional.of(u));
        when(passwordEncoder.matches("bad", "hash")).thenReturn(false);

        assertThrows(RuntimeException.class,
                () -> authService.login("a@b.c", "bad"));
    }
}