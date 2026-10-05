package com.example.student_management.controller;

import com.example.student_management.entity.Student;
import com.example.student_management.exception.ResourceNotFoundException;
import com.example.student_management.repository.UserRepository;
import com.example.student_management.security.JwtAuthenticationFilter;
import com.example.student_management.security.JwtService;
import com.example.student_management.service.StudentService;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(StudentController.class)
@AutoConfigureMockMvc(addFilters = false)
class StudentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    // IMPORTANT: no @Autowired here
    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private StudentService studentService;

    // Security dependencies required by the WebMvcTest context
    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserRepository userRepository;


    @Test
    void createStudent_shouldReturnCreatedStudent() throws Exception {

        Student student = new Student(
                "Rahul Patil",
                "rahul@gmail.com",
                "9876543210",
                "CSE",
                3
        );

        when(studentService.createStudent(any(Student.class)))
                .thenReturn(student);

        mockMvc.perform(
                post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(student))
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name").value("Rahul Patil"))
        .andExpect(jsonPath("$.email").value("rahul@gmail.com"))
        .andExpect(jsonPath("$.department").value("CSE"))
        .andExpect(jsonPath("$.year").value(3));

        verify(studentService).createStudent(any(Student.class));
    }


    @Test
    void getAllStudents_shouldReturnStudents() throws Exception {

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

        when(studentService.getAllStudents())
                .thenReturn(List.of(student1, student2));

        mockMvc.perform(
                get("/api/students")
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$.length()").value(2))
        .andExpect(jsonPath("$[0].name").value("Rahul"))
        .andExpect(jsonPath("$[1].name").value("Amit"));

        verify(studentService).getAllStudents();
    }


    @Test
    void getStudentById_shouldReturnStudent() throws Exception {

        Student student = new Student(
                "Rahul",
                "rahul@gmail.com",
                "9876543210",
                "CSE",
                3
        );

        when(studentService.getStudentById(1L))
                .thenReturn(student);

        mockMvc.perform(
                get("/api/students/1")
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name").value("Rahul"))
        .andExpect(jsonPath("$.email").value("rahul@gmail.com"))
        .andExpect(jsonPath("$.department").value("CSE"));

        verify(studentService).getStudentById(1L);
    }


    @Test
    void getStudentById_whenNotFound_shouldReturn404() throws Exception {

        when(studentService.getStudentById(999L))
                .thenThrow(
                        new ResourceNotFoundException("Student not found")
                );

        mockMvc.perform(
                get("/api/students/999")
        )
        .andExpect(status().isNotFound());

        verify(studentService).getStudentById(999L);
    }


    @Test
    void updateStudent_shouldReturnUpdatedStudent() throws Exception {

        Student updatedStudent = new Student(
                "Rahul Updated",
                "rahulupdated@gmail.com",
                "9999999999",
                "IT",
                4
        );

        when(
                studentService.updateStudent(
                        eq(1L),
                        any(Student.class)
                )
        ).thenReturn(updatedStudent);

        mockMvc.perform(
                put("/api/students/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(
                                objectMapper.writeValueAsString(
                                        updatedStudent
                                )
                        )
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name").value("Rahul Updated"))
        .andExpect(jsonPath("$.email").value("rahulupdated@gmail.com"))
        .andExpect(jsonPath("$.department").value("IT"))
        .andExpect(jsonPath("$.year").value(4));

        verify(studentService).updateStudent(
                eq(1L),
                any(Student.class)
        );
    }


    @Test
    void deleteStudent_shouldReturnSuccessMessage() throws Exception {

        doNothing()
                .when(studentService)
                .deleteStudent(1L);

        mockMvc.perform(
                delete("/api/students/1")
        )
        .andExpect(status().isOk())
        .andExpect(
                content().string(
                        "Student deleted successfully"
                )
        );

        verify(studentService).deleteStudent(1L);
    }


    @Test
    void getStudentsWithPagination_shouldReturnPage()
            throws Exception {

        Student student = new Student(
                "Rahul",
                "rahul@gmail.com",
                "9876543210",
                "CSE",
                3
        );

        Page<Student> page =
                new PageImpl<>(List.of(student));

        when(
                studentService.getStudentsWithPagination(
                        eq(0),
                        eq(10),
                        eq("name"),
                        eq("asc"),
                        nullable(String.class),
                        nullable(String.class),
                        nullable(Integer.class)
                )
        ).thenReturn(page);

        mockMvc.perform(
                get("/api/students/page")
                        .param("page", "0")
                        .param("size", "10")
                        .param("sortBy", "name")
                        .param("direction", "asc")
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content").isArray())
        .andExpect(jsonPath("$.content.length()").value(1))
        .andExpect(jsonPath("$.content[0].name").value("Rahul"))
        .andExpect(jsonPath("$.totalElements").value(1));

        verify(studentService).getStudentsWithPagination(
                eq(0),
                eq(10),
                eq("name"),
                eq("asc"),
                nullable(String.class),
                nullable(String.class),
                nullable(Integer.class)
        );
    }


    @Test
    void createStudent_withInvalidData_shouldReturn400()
            throws Exception {

        Student invalidStudent = new Student(
                "",
                "invalid-email",
                "9876543210",
                "",
                5
        );

        mockMvc.perform(
                post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(
                                objectMapper.writeValueAsString(
                                        invalidStudent
                                )
                        )
        )
        .andExpect(status().isBadRequest());

        verify(
                studentService,
                never()
        ).createStudent(any(Student.class));
    }
}