package com.example.student_management.controller;

import com.example.student_management.entity.Course;
import com.example.student_management.service.EnrollmentService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentCourseController {

    private final EnrollmentService enrollmentService;

    public StudentCourseController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    // ADMIN and TEACHER can view any student's courses.
    // STUDENT can view only their own courses.
    @PreAuthorize(
            "@studentSecurityService.canAccessStudent(#studentId, authentication)"
    )
    @GetMapping("/{studentId}/courses")
    public ResponseEntity<List<Course>> getStudentCourses(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                enrollmentService.getStudentCourses(studentId)
        );
    }

    // Only ADMIN can enroll a student into a course
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{studentId}/courses/{courseId}")
    public ResponseEntity<Course> addCourse(
            @PathVariable Long studentId,
            @PathVariable Long courseId) {

        return ResponseEntity.ok(
                enrollmentService.addCourseToStudent(
                        studentId,
                        courseId
                )
        );
    }

    // Only ADMIN can remove a student's course
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{studentId}/courses/{courseId}")
    public ResponseEntity<String> removeCourse(
            @PathVariable Long studentId,
            @PathVariable Long courseId) {

        enrollmentService.removeCourseFromStudent(
                studentId,
                courseId
        );

        return ResponseEntity.ok(
                "Course removed from student successfully"
        );
    }
}