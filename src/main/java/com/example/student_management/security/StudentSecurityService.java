package com.example.student_management.security;

import com.example.student_management.entity.Student;
import com.example.student_management.entity.User;
import com.example.student_management.repository.StudentRepository;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service("studentSecurityService")
public class StudentSecurityService {

    private final StudentRepository studentRepository;

    public StudentSecurityService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public boolean canAccessStudent(
            Long studentId,
            Authentication authentication) {

        // ADMIN and TEACHER can access any student
        if (authentication.getAuthorities().stream()
                .anyMatch(authority ->
                        authority.getAuthority().equals("ROLE_ADMIN")
                        || authority.getAuthority().equals("ROLE_TEACHER"))) {

            return true;
        }

        // STUDENT can access only their own record
        Object principal = authentication.getPrincipal();

        if (!(principal instanceof User user)) {
            return false;
        }

        Student student = studentRepository
                .findByEmail(user.getEmail())
                .orElse(null);

        if (student == null) {
            return false;
        }

        return student.getId().equals(studentId);
    }
}