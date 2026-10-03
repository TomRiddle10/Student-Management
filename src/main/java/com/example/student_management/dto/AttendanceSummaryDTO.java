package com.example.student_management.dto;

public class AttendanceSummaryDTO {

    private Long studentId;
    private Long courseId;
    private long totalClasses;
    private long present;
    private long absent;
    private double percentage;

    public AttendanceSummaryDTO() {
    }

    public AttendanceSummaryDTO(
            Long studentId,
            Long courseId,
            long totalClasses,
            long present,
            long absent,
            double percentage
    ) {
        this.studentId = studentId;
        this.courseId = courseId;
        this.totalClasses = totalClasses;
        this.present = present;
        this.absent = absent;
        this.percentage = percentage;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public long getTotalClasses() {
        return totalClasses;
    }

    public void setTotalClasses(long totalClasses) {
        this.totalClasses = totalClasses;
    }

    public long getPresent() {
        return present;
    }

    public void setPresent(long present) {
        this.present = present;
    }

    public long getAbsent() {
        return absent;
    }

    public void setAbsent(long absent) {
        this.absent = absent;
    }

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }
}