package com.example.student_management.service;

import com.example.student_management.dto.AttendanceRecordDTO;
import com.example.student_management.dto.AttendanceRequestDTO;
import com.example.student_management.dto.AttendanceStudentDTO;
import com.example.student_management.dto.AttendanceSummaryDTO;
import com.example.student_management.entity.Attendance;
import com.example.student_management.entity.AttendanceStatus;
import com.example.student_management.entity.Course;
import com.example.student_management.entity.Enrollment;
import com.example.student_management.entity.Student;
import com.example.student_management.repository.AttendanceRepository;
import com.example.student_management.repository.CourseRepository;
import com.example.student_management.repository.EnrollmentRepository;
import com.example.student_management.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;

    public AttendanceService(
            AttendanceRepository attendanceRepository,
            StudentRepository studentRepository,
            CourseRepository courseRepository,
            EnrollmentRepository enrollmentRepository) {

        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    // =========================================================
    // GET ATTENDANCE HISTORY FOR A MONTH
    // =========================================================

    public Map<LocalDate, Long> getAttendanceHistory(
            Long courseId,
            YearMonth month) {

        // Check whether course exists
        courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException("Course not found"));

        LocalDate startDate = month.atDay(1);
        LocalDate endDate = month.atEndOfMonth();

        List<Attendance> records =
                attendanceRepository
                        .findByCourseIdAndAttendanceDateBetween(
                                courseId,
                                startDate,
                                endDate
                        );

        Map<LocalDate, Long> history =
                new LinkedHashMap<>();

        for (Attendance attendance : records) {

            LocalDate date =
                    attendance.getAttendanceDate();

            history.put(
                    date,
                    history.getOrDefault(date, 0L) + 1
            );
        }

        return history;
    }

    // =========================================================
    // GET STUDENTS AND ATTENDANCE FOR A SPECIFIC DATE
    // =========================================================

    public List<AttendanceStudentDTO> getAttendanceForDate(
            Long courseId,
            LocalDate date) {

        // Check whether course exists
        courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException("Course not found"));

        // Get all students enrolled in this course
        List<Enrollment> enrollments =
                enrollmentRepository.findByCourseId(courseId);

        // Get attendance records for selected date
        List<Attendance> attendanceRecords =
                attendanceRepository
                        .findByCourseIdAndAttendanceDate(
                                courseId,
                                date
                        );

        return enrollments.stream()
                .map(enrollment -> {

                    Student student =
                            enrollment.getStudent();

                    AttendanceStatus status =
                            attendanceRecords.stream()
                                    .filter(attendance ->
                                            attendance
                                                    .getStudent()
                                                    .getId()
                                                    .equals(student.getId())
                                    )
                                    .map(Attendance::getStatus)
                                    .findFirst()
                                    .orElse(null);

                    return new AttendanceStudentDTO(
                            student.getId(),
                            student.getName(),
                            status
                    );
                })
                .toList();
    }

    // =========================================================
    // SAVE / UPDATE ATTENDANCE
    // =========================================================

    public void saveAttendance(
            Long courseId,
            AttendanceRequestDTO request) {

        Course course =
                courseRepository.findById(courseId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Course not found"
                                ));

        LocalDate date = request.getDate();

        for (AttendanceRecordDTO record :
                request.getAttendance()) {

            Student student =
                    studentRepository.findById(
                            record.getStudentId()
                    ).orElseThrow(() ->
                            new RuntimeException(
                                    "Student not found"
                            ));

            // Check whether student is enrolled
            boolean enrolled =
                    enrollmentRepository
                            .existsByStudentIdAndCourseId(
                                    student.getId(),
                                    courseId
                            );

            if (!enrolled) {
                throw new RuntimeException(
                        "Student is not enrolled in this course"
                );
            }

            // Check whether attendance already exists
            Attendance attendance =
                    attendanceRepository
                            .findByStudentIdAndCourseIdAndAttendanceDate(
                                    student.getId(),
                                    courseId,
                                    date
                            )
                            .orElse(
                                    new Attendance(
                                            student,
                                            course,
                                            date,
                                            record.getStatus()
                                    )
                            );

            // Update status
            attendance.setStatus(
                    record.getStatus()
            );

            attendanceRepository.save(
                    attendance
            );
        }
    }

    // =========================================================
    // GET ATTENDANCE SUMMARY
    // =========================================================

    public AttendanceSummaryDTO getAttendanceSummary(
            Long studentId,
            Long courseId) {

        // Check student
        studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student not found"
                        ));

        // Check course
        courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Course not found"
                        ));

        // Total attendance records
        long totalClasses =
                attendanceRepository
                        .countByStudentIdAndCourseId(
                                studentId,
                                courseId
                        );

        // Present count
        long present =
                attendanceRepository
                        .countByStudentIdAndCourseIdAndStatus(
                                studentId,
                                courseId,
                                AttendanceStatus.PRESENT
                        );

        // Absent count
        long absent =
                attendanceRepository
                        .countByStudentIdAndCourseIdAndStatus(
                                studentId,
                                courseId,
                                AttendanceStatus.ABSENT
                        );

        // Calculate percentage
        double percentage = 0;

        if (totalClasses > 0) {
            percentage =
                    ((double) present / totalClasses)
                            * 100;
        }

        return new AttendanceSummaryDTO(
                studentId,
                courseId,
                totalClasses,
                present,
                absent,
                percentage
        );
    }
}