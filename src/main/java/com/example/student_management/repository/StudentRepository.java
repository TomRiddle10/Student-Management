package com.example.student_management.repository;

import com.example.student_management.entity.Student;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface StudentRepository
        extends JpaRepository<Student, Long>,
                JpaSpecificationExecutor<Student> {

    Optional<Student> findByEmail(String email);
}