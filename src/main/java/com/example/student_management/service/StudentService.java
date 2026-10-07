package com.example.student_management.service;

import com.example.student_management.entity.Student;
import com.example.student_management.entity.User;
import com.example.student_management.exception.ResourceNotFoundException;
import com.example.student_management.repository.StudentRepository;
import com.example.student_management.repository.UserRepository;
import com.example.student_management.specification.StudentSpecification;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    public StudentService(
            StudentRepository studentRepository,
            UserRepository userRepository) {

        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
    }

    public Student createStudent(Student student) {
        return studentRepository.save(student);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Student not found"
                        )
                );
    }

    // =========================================================
    // GET LOGGED-IN STUDENT
    // =========================================================

    public Student getCurrentStudent(String login) {

    User user = userRepository.findByUsername(login)
            .orElseGet(() ->
                    userRepository.findByEmail(login)
                            .orElseThrow(() ->
                                    new ResourceNotFoundException("User not found")
                            )
            );

    return studentRepository.findByEmail(user.getEmail())
            .orElseThrow(() ->
                    new ResourceNotFoundException("Student profile not found")
            );
}

    public Student updateStudent(Long id, Student student) {

        Student existingStudent = getStudentById(id);

        existingStudent.setName(student.getName());
        existingStudent.setEmail(student.getEmail());
        existingStudent.setPhone(student.getPhone());
        existingStudent.setDepartment(student.getDepartment());
        existingStudent.setYear(student.getYear());

        return studentRepository.save(existingStudent);
    }

    public void deleteStudent(Long id) {

        Student student = getStudentById(id);

        studentRepository.delete(student);
    }

    // Server-side filtering + sorting + pagination
    public Page<Student> getStudentsWithPagination(
            int page,
            int size,
            String sortBy,
            String direction,
            String search,
            String department,
            Integer year) {

        Sort sort;

        if (direction.equalsIgnoreCase("desc")) {
            sort = Sort.by(sortBy).descending();
        } else {
            sort = Sort.by(sortBy).ascending();
        }

        Pageable pageable = PageRequest.of(
                page,
                size,
                sort
        );

        return studentRepository.findAll(
                StudentSpecification.filterStudents(
                        search,
                        department,
                        year
                ),
                pageable
        );
    }
}