package com.example.student_management.controller;

import com.example.student_management.dto.CreateTeacherRequest;
import com.example.student_management.entity.User;
import com.example.student_management.service.AdminService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/teachers")
    public ResponseEntity<User> createTeacher(
            @Valid @RequestBody CreateTeacherRequest request
    ) {
        return ResponseEntity.ok(
                adminService.createTeacher(request)
        );
    }

    @GetMapping("/teachers")
    public ResponseEntity<List<User>> getAllTeachers() {

        return ResponseEntity.ok(
                adminService.getAllTeachers()
        );
    }

    @DeleteMapping("/teachers/{id}")
    public ResponseEntity<String> deleteTeacher(
            @PathVariable Long id
    ) {

        adminService.deleteTeacher(id);

        return ResponseEntity.ok(
                "Teacher deleted successfully"
        );
    }
}