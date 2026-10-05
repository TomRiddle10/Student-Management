package com.example.student_management.controller;

import com.example.student_management.dto.AttendanceRequestDTO;
import com.example.student_management.dto.AttendanceStudentDTO;
import com.example.student_management.dto.AttendanceSummaryDTO;
import com.example.student_management.service.AttendanceService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    // =========================================================
    // GET ATTENDANCE FOR A DATE
    // ADMIN + TEACHER
    // =========================================================

    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @GetMapping("/courses/{courseId}/attendance")
    public ResponseEntity<List<AttendanceStudentDTO>> getAttendance(
            @PathVariable Long courseId,
            @RequestParam LocalDate date) {

        return ResponseEntity.ok(
                attendanceService.getAttendanceForDate(
                        courseId,
                        date
                )
        );
    }

    // =========================================================
    // SAVE / UPDATE ATTENDANCE
    // ADMIN + TEACHER
    // =========================================================

    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @PostMapping("/courses/{courseId}/attendance")
    public ResponseEntity<String> saveAttendance(
            @PathVariable Long courseId,
            @RequestBody AttendanceRequestDTO request) {

        attendanceService.saveAttendance(
                courseId,
                request
        );

        return ResponseEntity.ok(
                "Attendance saved successfully"
        );
    }

    // =========================================================
    // ATTENDANCE HISTORY
    // ADMIN + TEACHER
    // =========================================================

    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    @GetMapping("/courses/{courseId}/attendance/history")
    public ResponseEntity<Map<LocalDate, Long>> getAttendanceHistory(
            @PathVariable Long courseId,
            @RequestParam String month) {

        YearMonth yearMonth = YearMonth.parse(month);

        return ResponseEntity.ok(
                attendanceService.getAttendanceHistory(
                        courseId,
                        yearMonth
                )
        );
    }

    // =========================================================
    // STUDENT ATTENDANCE SUMMARY
    // ADMIN + TEACHER → ANY STUDENT
    // STUDENT → OWN ATTENDANCE ONLY
    // =========================================================

    @PreAuthorize(
            "@studentSecurityService.canAccessStudent(#studentId, authentication)"
    )
    @GetMapping("/students/{studentId}/attendance")
    public ResponseEntity<AttendanceSummaryDTO> getAttendanceSummary(
            @PathVariable Long studentId,
            @RequestParam Long courseId) {

        return ResponseEntity.ok(
                attendanceService.getAttendanceSummary(
                        studentId,
                        courseId
                )
        );
    }
}