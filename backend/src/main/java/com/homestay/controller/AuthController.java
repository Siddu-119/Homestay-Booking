package com.homestay.controller;

import com.homestay.models.User;
import com.homestay.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<User> loginOrRegister(@RequestBody User loginRequest) {
        Optional<User> existingUser = userRepository.findByEmail(loginRequest.getEmail());
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            // Update role if changed
            if (loginRequest.getRole() != null && !loginRequest.getRole().equals(user.getRole())) {
                user.setRole(loginRequest.getRole());
                userRepository.save(user);
            }
            return ResponseEntity.ok(user);
        } else {
            User newUser = userRepository.save(loginRequest);
            return ResponseEntity.ok(newUser);
        }
    }
}
