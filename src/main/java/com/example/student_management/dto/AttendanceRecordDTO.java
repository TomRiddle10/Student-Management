package com.example.student_management.dto;

import com.example.student_management.entity.AttendanceStatus;

public class AttendanceRecordDTO {

    private Long studentId;
    private AttendanceStatus status;

    public AttendanceRecordDTO() {
    }

    public AttendanceRecordDTO(
            Long studentId,
            AttendanceStatus status
    ) {
        this.studentId = studentId;
        this.status = status;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public AttendanceStatus getStatus() {
        return status;
    }

    public void setStatus(AttendanceStatus status) {
        this.status = status;
    }
}