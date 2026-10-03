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
import java.util.List;

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

    // Get all students of a course and their attendance for a specific date
    public List<AttendanceStudentDTO> getAttendanceForDate(
            Long courseId,
            LocalDate date) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        List<Enrollment> enrollments =
                enrollmentRepository.findByCourseId(courseId);

        List<Attendance> attendanceRecords =
                attendanceRepository.findByCourseIdAndAttendanceDate(
                        courseId,
                        date
                );

        return enrollments.stream()
                .map(enrollment -> {

                    Student student = enrollment.getStudent();

                    AttendanceStatus status = attendanceRecords.stream()
                            .filter(attendance ->
                                    attendance.getStudent().getId()
                                            .equals(student.getId()))
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

    // Save attendance for the entire class
    public void saveAttendance(
            Long courseId,
            AttendanceRequestDTO request) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        LocalDate date = request.getDate();

        for (AttendanceRecordDTO record : request.getAttendance()) {

            Student student = studentRepository.findById(
                    record.getStudentId()
            ).orElseThrow(() ->
                    new RuntimeException("Student not found"));

            boolean enrolled = enrollmentRepository
                    .existsByStudentIdAndCourseId(
                            student.getId(),
                            courseId
                    );

            if (!enrolled) {
                throw new RuntimeException(
                        "Student is not enrolled in this course"
                );
            }

            Attendance attendance =
                    attendanceRepository
                            .findByStudentIdAndCourseIdAndAttendanceDate(
                                    student.getId(),
                                    courseId,
                                    date
                            )
                            .orElse(new Attendance(
                                    student,
                                    course,
                                    date,
                                    record.getStatus()
                            ));

            attendance.setStatus(record.getStatus());

            attendanceRepository.save(attendance);
        }
    }

    // Get attendance summary for a student in a course
    public AttendanceSummaryDTO getAttendanceSummary(
            Long studentId,
            Long courseId) {

        studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException("Course not found"));

        long totalClasses =
                attendanceRepository.countByStudentIdAndCourseId(
                        studentId,
                        courseId
                );

        long present =
                attendanceRepository
                        .countByStudentIdAndCourseIdAndStatus(
                                studentId,
                                courseId,
                                AttendanceStatus.PRESENT
                        );

        long absent =
                attendanceRepository
                        .countByStudentIdAndCourseIdAndStatus(
                                studentId,
                                courseId,
                                AttendanceStatus.ABSENT
                        );

        double percentage = 0;

        if (totalClasses > 0) {
            percentage = ((double) present / totalClasses) * 100;
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