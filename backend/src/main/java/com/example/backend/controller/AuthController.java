package com.example.backend.controller;

import com.example.backend.service.AuthService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody AuthRequest request) {
        String token = authService.register(request.getName(), request.getEmail(), request.getPassword());
        return new AuthResponse(token, request.getEmail(), request.getName());
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        String token = authService.login(request.getEmail(), request.getPassword());
        String name = authService.getUserNameByEmail(request.getEmail());
        return new AuthResponse(token, request.getEmail(), name);
    }

}


@Data
class AuthRequest {
    private String name;
    private String email;
    private String password;
}

@Data
@RequiredArgsConstructor
class AuthResponse {
    private final String token;
    private final String email;
    private final String name;
}