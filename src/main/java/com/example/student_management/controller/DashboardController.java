package com.example.student_management.controller;

import com.example.student_management.dto.CourseAttendanceResponse;
import com.example.student_management.dto.DashboardResponse;
import com.example.student_management.service.DashboardService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(
            DashboardService dashboardService) {

        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard() {

        return ResponseEntity.ok(
                dashboardService.getDashboardStats()
        );
    }

    @GetMapping("/course-attendance")
    public ResponseEntity<List<CourseAttendanceResponse>>
    getCourseAttendance() {

        return ResponseEntity.ok(
                dashboardService.getCourseAttendance()
        );
    }
}