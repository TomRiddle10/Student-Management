package com.example.student_management.dto;

public class DashboardResponse {

    private long totalStudents;
    private long totalCourses;
    private long totalEnrollments;
    private long totalAttendanceRecords;
    private long totalPresent;
    private long totalAbsent;
    private double overallAttendancePercentage;

    public DashboardResponse(
            long totalStudents,
            long totalCourses,
            long totalEnrollments,
            long totalAttendanceRecords,
            long totalPresent,
            long totalAbsent,
            double overallAttendancePercentage) {

        this.totalStudents = totalStudents;
        this.totalCourses = totalCourses;
        this.totalEnrollments = totalEnrollments;
        this.totalAttendanceRecords = totalAttendanceRecords;
        this.totalPresent = totalPresent;
        this.totalAbsent = totalAbsent;
        this.overallAttendancePercentage =
                overallAttendancePercentage;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public long getTotalCourses() {
        return totalCourses;
    }

    public long getTotalEnrollments() {
        return totalEnrollments;
    }

    public long getTotalAttendanceRecords() {
        return totalAttendanceRecords;
    }

    public long getTotalPresent() {
        return totalPresent;
    }

    public long getTotalAbsent() {
        return totalAbsent;
    }

    public double getOverallAttendancePercentage() {
        return overallAttendancePercentage;
    }
}