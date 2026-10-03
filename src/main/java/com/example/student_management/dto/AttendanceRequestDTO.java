package com.example.student_management.dto;

import java.time.LocalDate;
import java.util.List;

public class AttendanceRequestDTO {

    private LocalDate date;

    private List<AttendanceRecordDTO> attendance;

    public AttendanceRequestDTO() {
    }

    public AttendanceRequestDTO(
            LocalDate date,
            List<AttendanceRecordDTO> attendance
    ) {
        this.date = date;
        this.attendance = attendance;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public List<AttendanceRecordDTO> getAttendance() {
        return attendance;
    }

    public void setAttendance(List<AttendanceRecordDTO> attendance) {
        this.attendance = attendance;
    }
}