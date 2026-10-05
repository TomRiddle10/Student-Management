package com.example.student_management.dto;

public class CourseAttendanceResponse {

    private Long courseId;
    private String courseCode;
    private String courseName;

    private long total;
    private long present;
    private long absent;

    private double percentage;

    public CourseAttendanceResponse(
            Long courseId,
            String courseCode,
            String courseName,
            long total,
            long present,
            long absent,
            double percentage) {

        this.courseId = courseId;
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.total = total;
        this.present = present;
        this.absent = absent;
        this.percentage = percentage;
    }

    public Long getCourseId() {
        return courseId;
    }

    public String getCourseCode() {
        return courseCode;
    }

    public String getCourseName() {
        return courseName;
    }

    public long getTotal() {
        return total;
    }

    public long getPresent() {
        return present;
    }

    public long getAbsent() {
        return absent;
    }

    public double getPercentage() {
        return percentage;
    }
}