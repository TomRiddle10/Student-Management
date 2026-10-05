package com.example.student_management.service;

import com.example.student_management.entity.Course;
import com.example.student_management.entity.Enrollment;
import com.example.student_management.entity.Student;
import com.example.student_management.exception.ConflictException;
import com.example.student_management.exception.ResourceNotFoundException;
import com.example.student_management.repository.CourseRepository;
import com.example.student_management.repository.EnrollmentRepository;
import com.example.student_management.repository.StudentRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    public EnrollmentService(
            EnrollmentRepository enrollmentRepository,
            StudentRepository studentRepository,
            CourseRepository courseRepository) {

        this.enrollmentRepository = enrollmentRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    public List<Course> getStudentCourses(Long studentId) {

        studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found with id: " + studentId
                        )
                );

        return enrollmentRepository
                .findByStudentId(studentId)
                .stream()
                .map(Enrollment::getCourse)
                .toList();
    }

    public Course addCourseToStudent(
            Long studentId,
            Long courseId) {

        Student student = studentRepository
                .findById(studentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found with id: " + studentId
                        )
                );

        Course course = courseRepository
                .findById(courseId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Course not found with id: " + courseId
                        )
                );

        if (enrollmentRepository
                .existsByStudentIdAndCourseId(
                        studentId,
                        courseId)) {

            throw new ConflictException(
                    "Student is already enrolled in this course"
            );
        }

        Enrollment enrollment =
                new Enrollment(student, course);

        enrollmentRepository.save(enrollment);

        return course;
    }

    public void removeCourseFromStudent(
            Long studentId,
            Long courseId) {

        Enrollment enrollment =
                enrollmentRepository
                        .findByStudentIdAndCourseId(
                                studentId,
                                courseId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Student is not enrolled in this course"
                                )
                        );

        enrollmentRepository.delete(enrollment);
    }
}