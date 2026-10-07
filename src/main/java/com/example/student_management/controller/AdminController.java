package com.example.student_management.controller;

import com.example.student_management.dto.CreateTeacherRequest;
import com.example.student_management.entity.User;
import com.example.student_management.service.AdminService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:3000"
})
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/teachers")
    public ResponseEntity<User> createTeacher(
            @RequestBody CreateTeacherRequest request
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
    public ResponseEntity<Void> deleteTeacher(
            @PathVariable Long id
    ) {
        adminService.deleteTeacher(id);
        return ResponseEntity.noContent().build();
    }
}