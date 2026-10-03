package com.example.student_management.controller;

import com.example.student_management.dto.AttendanceRequestDTO;
import com.example.student_management.dto.AttendanceStudentDTO;
import com.example.student_management.dto.AttendanceSummaryDTO;
import com.example.student_management.service.AttendanceService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    // Get all students of a course and their attendance for a date
    @GetMapping("/courses/{courseId}/attendance")
    public ResponseEntity<List<AttendanceStudentDTO>> getAttendance(
            @PathVariable Long courseId,
            @RequestParam LocalDate date) {

        return ResponseEntity.ok(
                attendanceService.getAttendanceForDate(courseId, date)
        );
    }

    // Save attendance for a course and date
    @PostMapping("/courses/{courseId}/attendance")
    public ResponseEntity<String> saveAttendance(
            @PathVariable Long courseId,
            @RequestBody AttendanceRequestDTO request) {

        attendanceService.saveAttendance(courseId, request);

        return ResponseEntity.ok("Attendance saved successfully");
    }

    // Get attendance summary of a student for a course
    @GetMapping("/students/{studentId}/attendance")
    public ResponseEntity<AttendanceSummaryDTO> getAttendanceSummary(
            @PathVariable Long studentId,
            @RequestParam Long courseId) {

        return ResponseEntity.ok(
                attendanceService.getAttendanceSummary(studentId, courseId)
        );
    }
}