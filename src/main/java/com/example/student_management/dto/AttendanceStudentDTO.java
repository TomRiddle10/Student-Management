package com.example.student_management.dto;

import com.example.student_management.entity.AttendanceStatus;

public class AttendanceStudentDTO {

    private Long studentId;
    private String studentName;
    private AttendanceStatus status;

    public AttendanceStudentDTO() {
    }

    public AttendanceStudentDTO(
            Long studentId,
            String studentName,
            AttendanceStatus status
    ) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.status = status;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public AttendanceStatus getStatus() {
        return status;
    }

    public void setStatus(AttendanceStatus status) {
        this.status = status;
    }
}