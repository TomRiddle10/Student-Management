package com.example.student_management.controller;

import com.example.student_management.dto.CourseAttendanceResponse;
import com.example.student_management.dto.DashboardResponse;
import com.example.student_management.service.DashboardService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    // ADMIN + TEACHER
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard() {

        return ResponseEntity.ok(
                dashboardService.getDashboardStats()
        );
    }

    // ADMIN + TEACHER
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @GetMapping("/course-attendance")
    public ResponseEntity<List<CourseAttendanceResponse>>
    getCourseAttendance() {

        return ResponseEntity.ok(
                dashboardService.getCourseAttendance()
        );
    }
}