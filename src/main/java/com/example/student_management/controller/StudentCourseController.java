package com.example.student_management.controller;

import com.example.student_management.entity.Course;
import com.example.student_management.service.EnrollmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentCourseController {

    private final EnrollmentService enrollmentService;

    public StudentCourseController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    // Get courses of a student
    @GetMapping("/{studentId}/courses")
    public ResponseEntity<List<Course>> getStudentCourses(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                enrollmentService.getStudentCourses(studentId)
        );
    }

    // Add course to student
    @PostMapping("/{studentId}/courses/{courseId}")
    public ResponseEntity<Course> addCourse(
            @PathVariable Long studentId,
            @PathVariable Long courseId) {

        return ResponseEntity.ok(
                enrollmentService.addCourseToStudent(studentId, courseId)
        );
    }

    // Remove course from student
    @DeleteMapping("/{studentId}/courses/{courseId}")
    public ResponseEntity<String> removeCourse(
            @PathVariable Long studentId,
            @PathVariable Long courseId) {

        enrollmentService.removeCourseFromStudent(studentId, courseId);

        return ResponseEntity.ok(
                "Course removed from student successfully"
        );
    }
}