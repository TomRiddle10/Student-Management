package com.example.student_management.service;

import com.example.student_management.dto.CreateTeacherRequest;
import com.example.student_management.entity.Role;
import com.example.student_management.entity.User;
import com.example.student_management.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User createTeacher(CreateTeacherRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User teacher = new User(
                request.getUsername(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                Role.TEACHER
        );

        return userRepository.save(teacher);
    }

    public List<User> getAllTeachers() {
        return userRepository.findAll()
                .stream()
                .filter(user -> user.getRole() == Role.TEACHER)
                .toList();
    }

    public void deleteTeacher(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (user.getRole() != Role.TEACHER) {
            throw new RuntimeException("User is not a teacher");
        }

        userRepository.delete(user);
    }
}