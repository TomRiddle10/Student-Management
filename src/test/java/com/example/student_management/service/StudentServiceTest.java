package com.example.student_management.service;

import com.example.student_management.entity.Student;
import com.example.student_management.exception.ResourceNotFoundException;
import com.example.student_management.repository.StudentRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private StudentService studentService;


    @Test
    void createStudent_shouldReturnSavedStudent() {

        Student student = new Student(
                "Rahul Patil",
                "rahul@gmail.com",
                "9876543210",
                "CSE",
                3
        );

        when(studentRepository.save(student)).thenReturn(student);

        Student result = studentService.createStudent(student);

        assertNotNull(result);
        assertEquals("Rahul Patil", result.getName());
        assertEquals("rahul@gmail.com", result.getEmail());

        verify(studentRepository).save(student);
    }


    @Test
    void getAllStudents_shouldReturnStudents() {

        Student student1 = new Student(
                "Rahul",
                "rahul@gmail.com",
                "9876543210",
                "CSE",
                3
        );

        Student student2 = new Student(
                "Amit",
                "amit@gmail.com",
                "9876543211",
                "IT",
                2
        );

        when(studentRepository.findAll())
                .thenReturn(List.of(student1, student2));

        List<Student> result = studentService.getAllStudents();

        assertEquals(2, result.size());

        verify(studentRepository).findAll();
    }


    @Test
    void getStudentById_shouldReturnStudent() {

        Student student = new Student(
                "Rahul",
                "rahul@gmail.com",
                "9876543210",
                "CSE",
                3
        );

        when(studentRepository.findById(1L))
                .thenReturn(Optional.of(student));

        Student result = studentService.getStudentById(1L);

        assertNotNull(result);
        assertEquals("Rahul", result.getName());

        verify(studentRepository).findById(1L);
    }


    @Test
    void getStudentById_shouldThrowExceptionWhenNotFound() {

        when(studentRepository.findById(999L))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> studentService.getStudentById(999L)
        );

        verify(studentRepository).findById(999L);
    }


    @Test
    void updateStudent_shouldUpdateStudent() {

        Student existingStudent = new Student(
                "Old Name",
                "old@gmail.com",
                "1111111111",
                "CSE",
                2
        );

        Student updatedStudent = new Student(
                "New Name",
                "new@gmail.com",
                "2222222222",
                "IT",
                3
        );

        when(studentRepository.findById(1L))
                .thenReturn(Optional.of(existingStudent));

        when(studentRepository.save(existingStudent))
                .thenReturn(existingStudent);

        Student result =
                studentService.updateStudent(1L, updatedStudent);

        assertEquals("New Name", result.getName());
        assertEquals("new@gmail.com", result.getEmail());
        assertEquals("2222222222", result.getPhone());
        assertEquals("IT", result.getDepartment());
        assertEquals(3, result.getYear());

        verify(studentRepository).findById(1L);
        verify(studentRepository).save(existingStudent);
    }


    @Test
    void deleteStudent_shouldDeleteStudent() {

        Student student = new Student(
                "Rahul",
                "rahul@gmail.com",
                "9876543210",
                "CSE",
                3
        );

        when(studentRepository.findById(1L))
                .thenReturn(Optional.of(student));

        studentService.deleteStudent(1L);

        verify(studentRepository).findById(1L);
        verify(studentRepository).delete(student);
    }


    @Test
    void deleteStudent_shouldThrowExceptionWhenNotFound() {

        when(studentRepository.findById(999L))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> studentService.deleteStudent(999L)
        );

        verify(studentRepository).findById(999L);
        verify(studentRepository, never()).delete(any(Student.class));
    }


    @Test
    void getStudentsWithPagination_shouldReturnPage() {

        Student student = new Student(
                "Rahul",
                "rahul@gmail.com",
                "9876543210",
                "CSE",
                3
        );

        Page<Student> page =
                new PageImpl<>(List.of(student));

        when(studentRepository.findAll(
                any(org.springframework.data.jpa.domain.Specification.class),
                any(PageRequest.class)
        )).thenReturn(page);

        Page<Student> result =
                studentService.getStudentsWithPagination(
                        0,
                        10,
                        "name",
                        "asc",
                        "Rahul",
                        "CSE",
                        3
                );

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());

        verify(studentRepository).findAll(
                any(org.springframework.data.jpa.domain.Specification.class),
                any(PageRequest.class)
        );
    }
}