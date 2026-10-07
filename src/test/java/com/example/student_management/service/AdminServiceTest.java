package com.example.student_management.service;

import com.example.student_management.dto.CreateTeacherRequest;
import com.example.student_management.entity.Role;
import com.example.student_management.entity.User;
import com.example.student_management.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AdminService adminService;

    private CreateTeacherRequest request;

    @BeforeEach
    void setUp() {

        request = new CreateTeacherRequest();

        request.setUsername("teacher01");
        request.setEmail("teacher01@studentmanagement.com");
        request.setPassword("teacher123");
    }

    // ------------------------------------------------
    // TEST 1: Create teacher successfully
    // ------------------------------------------------

    @Test
    void createTeacher_shouldCreateTeacher() {

        when(userRepository.existsByUsername("teacher01"))
                .thenReturn(false);

        when(userRepository.existsByEmail(
                "teacher01@studentmanagement.com"))
                .thenReturn(false);

        when(passwordEncoder.encode("teacher123"))
                .thenReturn("encodedPassword");

        User savedTeacher = new User(
                "teacher01",
                "teacher01@studentmanagement.com",
                "encodedPassword",
                Role.TEACHER
        );

        when(userRepository.save(any(User.class)))
                .thenReturn(savedTeacher);

        User result = adminService.createTeacher(request);

        assertNotNull(result);
        assertEquals("teacher01", result.getUsername());
        assertEquals(
                "teacher01@studentmanagement.com",
                result.getEmail()
        );
        assertEquals(Role.TEACHER, result.getRole());

        verify(userRepository).save(any(User.class));
        verify(passwordEncoder).encode("teacher123");
    }

    // ------------------------------------------------
    // TEST 2: Duplicate username
    // ------------------------------------------------

    @Test
    void createTeacher_duplicateUsername_shouldThrowException() {

        when(userRepository.existsByUsername("teacher01"))
                .thenReturn(true);

        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () -> adminService.createTeacher(request)
                );

        assertEquals(
                "Username already exists",
                exception.getMessage()
        );

        verify(userRepository, never())
                .save(any(User.class));
    }

    // ------------------------------------------------
    // TEST 3: Duplicate email
    // ------------------------------------------------

    @Test
    void createTeacher_duplicateEmail_shouldThrowException() {

        when(userRepository.existsByUsername("teacher01"))
                .thenReturn(false);

        when(userRepository.existsByEmail(
                "teacher01@studentmanagement.com"))
                .thenReturn(true);

        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () -> adminService.createTeacher(request)
                );

        assertEquals(
                "Email already exists",
                exception.getMessage()
        );

        verify(userRepository, never())
                .save(any(User.class));
    }

    // ------------------------------------------------
    // TEST 4: Get all teachers
    // ------------------------------------------------

    @Test
    void getAllTeachers_shouldReturnOnlyTeachers() {

        User teacher1 = new User(
                "teacher01",
                "teacher01@studentmanagement.com",
                "password",
                Role.TEACHER
        );

        User teacher2 = new User(
                "teacher02",
                "teacher02@studentmanagement.com",
                "password",
                Role.TEACHER
        );

        User student = new User(
                "student01",
                "student01@studentmanagement.com",
                "password",
                Role.STUDENT
        );

        User admin = new User(
                "admin",
                "admin@studentmanagement.com",
                "password",
                Role.ADMIN
        );

        when(userRepository.findAll())
                .thenReturn(
                        List.of(
                                teacher1,
                                teacher2,
                                student,
                                admin
                        )
                );

        List<User> result =
                adminService.getAllTeachers();

        assertEquals(2, result.size());

        assertTrue(
                result.stream()
                        .allMatch(user ->
                                user.getRole() == Role.TEACHER)
        );
    }

    // ------------------------------------------------
    // TEST 5: Get teachers when none exist
    // ------------------------------------------------

    @Test
    void getAllTeachers_whenNoneExist_shouldReturnEmptyList() {

        when(userRepository.findAll())
                .thenReturn(List.of());

        List<User> result =
                adminService.getAllTeachers();

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    // ------------------------------------------------
    // TEST 6: Delete teacher successfully
    // ------------------------------------------------

    @Test
    void deleteTeacher_shouldDeleteTeacher() {

        User teacher = new User(
                "teacher01",
                "teacher01@studentmanagement.com",
                "password",
                Role.TEACHER
        );

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(teacher));

        adminService.deleteTeacher(1L);

        verify(userRepository).delete(teacher);
    }

    // ------------------------------------------------
    // TEST 7: Delete non-existing user
    // ------------------------------------------------

    @Test
    void deleteTeacher_userNotFound_shouldThrowException() {

        when(userRepository.findById(1L))
                .thenReturn(Optional.empty());

        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () -> adminService.deleteTeacher(1L)
                );

        assertEquals(
                "User not found",
                exception.getMessage()
        );

        verify(userRepository, never())
                .delete(any(User.class));
    }

    // ------------------------------------------------
    // TEST 8: Cannot delete non-teacher
    // ------------------------------------------------

    @Test
    void deleteTeacher_whenUserIsNotTeacher_shouldThrowException() {

        User student = new User(
                "student01",
                "student01@studentmanagement.com",
                "password",
                Role.STUDENT
        );

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(student));

        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () -> adminService.deleteTeacher(1L)
                );

        assertEquals(
                "User is not a teacher",
                exception.getMessage()
        );

        verify(userRepository, never())
                .delete(any(User.class));
    }
}