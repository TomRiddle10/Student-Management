package com.example.student_management.repository;

import com.example.student_management.entity.Attendance;
import com.example.student_management.entity.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository
        extends JpaRepository<Attendance, Long> {

    Optional<Attendance> findByStudentIdAndCourseIdAndAttendanceDate(
            Long studentId,
            Long courseId,
            LocalDate attendanceDate
    );

    List<Attendance> findByCourseIdAndAttendanceDate(
            Long courseId,
            LocalDate attendanceDate
    );

    List<Attendance> findByStudentIdAndCourseId(
            Long studentId,
            Long courseId
    );

    long countByCourseId(Long courseId);
    
    long countByStudentIdAndCourseIdAndStatus(
            Long studentId,
            Long courseId,
            AttendanceStatus status
    );

    long countByStudentIdAndCourseId(
            Long studentId,
            Long courseId
    );

    List<Attendance> findByCourseIdAndAttendanceDateBetween(
            Long courseId,
            LocalDate startDate,
            LocalDate endDate
    );
}