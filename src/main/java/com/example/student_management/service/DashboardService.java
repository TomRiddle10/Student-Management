package com.example.student_management.service;

import com.example.student_management.dto.CourseAttendanceResponse;
import com.example.student_management.dto.DashboardResponse;
import com.example.student_management.entity.AttendanceStatus;
import com.example.student_management.entity.Course;
import com.example.student_management.repository.AttendanceRepository;
import com.example.student_management.repository.CourseRepository;
import com.example.student_management.repository.EnrollmentRepository;
import com.example.student_management.repository.StudentRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AttendanceRepository attendanceRepository;

    public DashboardService(
            StudentRepository studentRepository,
            CourseRepository courseRepository,
            EnrollmentRepository enrollmentRepository,
            AttendanceRepository attendanceRepository) {

        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.attendanceRepository = attendanceRepository;
    }

    public DashboardResponse getDashboardStats() {

        long totalStudents =
                studentRepository.count();

        long totalCourses =
                courseRepository.count();

        long totalEnrollments =
                enrollmentRepository.count();

        long totalAttendanceRecords =
                attendanceRepository.count();

        long totalPresent =
                attendanceRepository
                        .findAll()
                        .stream()
                        .filter(attendance ->
                                attendance.getStatus()
                                        == AttendanceStatus.PRESENT)
                        .count();

        long totalAbsent =
                attendanceRepository
                        .findAll()
                        .stream()
                        .filter(attendance ->
                                attendance.getStatus()
                                        == AttendanceStatus.ABSENT)
                        .count();

        double overallAttendancePercentage = 0;

        if (totalAttendanceRecords > 0) {
            overallAttendancePercentage =
                    ((double) totalPresent
                            / totalAttendanceRecords) * 100;
        }

        return new DashboardResponse(
                totalStudents,
                totalCourses,
                totalEnrollments,
                totalAttendanceRecords,
                totalPresent,
                totalAbsent,
                overallAttendancePercentage
        );
    }

    // -----------------------------------------
    // COURSE-WISE ATTENDANCE
    // -----------------------------------------

    public List<CourseAttendanceResponse> getCourseAttendance() {

        List<Course> courses = courseRepository.findAll();

        return courses.stream()
                .map(course -> {

                    long total =
                            attendanceRepository
                                    .countByCourseId(course.getId());

                    long present =
                            attendanceRepository
                                    .findByCourseIdAndAttendanceDateBetween(
                                            course.getId(),
                                            java.time.LocalDate.of(2000, 1, 1),
                                            java.time.LocalDate.now()
                                    )
                                    .stream()
                                    .filter(attendance ->
                                            attendance.getStatus()
                                                    == AttendanceStatus.PRESENT)
                                    .count();

                    long absent =
                            total - present;

                    double percentage = 0;

                    if (total > 0) {
                        percentage =
                                ((double) present / total) * 100;
                    }

                    return new CourseAttendanceResponse(
                            course.getId(),
                            course.getCourseCode(),
                            course.getCourseName(),
                            total,
                            present,
                            absent,
                            percentage
                    );
                })
                .toList();
    }
}