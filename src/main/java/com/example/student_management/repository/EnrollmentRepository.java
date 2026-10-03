package com.example.student_management.repository;

import com.example.student_management.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    
    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);

    
    List<Enrollment> findByStudentId(Long studentId);

    
    List<Enrollment> findByCourseId(Long courseId);

    
    Optional<Enrollment> findByStudentIdAndCourseId(
            Long studentId,
            Long courseId
    );
}