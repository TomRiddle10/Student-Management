package com.example.student_management;

import com.example.student_management.entity.Role;
import com.example.student_management.entity.User;
import com.example.student_management.repository.UserRepository;
import com.example.student_management.security.JwtService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.RestClient;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class SecurityIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    private String baseUrl;

    @BeforeEach
    void setUp() {

        baseUrl = "http://localhost:" + port;

        userRepository.deleteAll();

        createUser(
                "testadmin",
                "admin@test.com",
                "admin123",
                Role.ADMIN
        );

        createUser(
                "testteacher",
                "teacher@test.com",
                "teacher123",
                Role.TEACHER
        );

        createUser(
                "teststudent",
                "student@test.com",
                "student123",
                Role.STUDENT
        );
    }

    private User createUser(
            String username,
            String email,
            String password,
            Role role) {

        User user = new User();

        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);

        return userRepository.save(user);
    }

    private String generateToken(String username) {

        User user = userRepository
                .findByUsername(username)
                .orElseThrow();

        return jwtService.generateToken(user);
    }

    private RestClient restClient() {

        return RestClient.builder()
                .baseUrl(baseUrl)
                .build();
    }

    // ==================================================
    // 1. UNAUTHENTICATED USER
    // ==================================================

    @Test
    void unauthenticatedUser_shouldReceive401() {

        var response = restClient()
                .get()
                .uri("/api/students")
                .exchange((request, clientResponse) ->
                        clientResponse.getStatusCode());

        assertEquals(
                HttpStatus.UNAUTHORIZED,
                response
        );
    }

    // ==================================================
    // 2. ADMIN CAN VIEW STUDENTS
    // ==================================================

    @Test
    void admin_shouldViewStudents() {

        String token = generateToken("testadmin");

        var response = restClient()
                .get()
                .uri("/api/students")
                .header(
                        HttpHeaders.AUTHORIZATION,
                        "Bearer " + token
                )
                .exchange((request, clientResponse) ->
                        clientResponse.getStatusCode());

        assertEquals(
                HttpStatus.OK,
                response
        );
    }

    // ==================================================
    // 3. TEACHER CAN VIEW STUDENTS
    // ==================================================

    @Test
    void teacher_shouldViewStudents() {

        String token = generateToken("testteacher");

        var response = restClient()
                .get()
                .uri("/api/students")
                .header(
                        HttpHeaders.AUTHORIZATION,
                        "Bearer " + token
                )
                .exchange((request, clientResponse) ->
                        clientResponse.getStatusCode());

        assertEquals(
                HttpStatus.OK,
                response
        );
    }

    // ==================================================
    // 4. STUDENT CANNOT VIEW ALL STUDENTS
    // ==================================================

    @Test
    void student_shouldNotViewAllStudents() {

        String token = generateToken("teststudent");

        var response = restClient()
                .get()
                .uri("/api/students")
                .header(
                        HttpHeaders.AUTHORIZATION,
                        "Bearer " + token
                )
                .exchange((request, clientResponse) ->
                        clientResponse.getStatusCode());

        assertEquals(
                HttpStatus.FORBIDDEN,
                response
        );
    }

    // ==================================================
    // 5. TEACHER CANNOT CREATE STUDENT
    // ==================================================

    @Test
    void teacher_shouldNotCreateStudent() {

        String token = generateToken("testteacher");

        var response = restClient()
                .post()
                .uri("/api/students")
                .header(
                        HttpHeaders.AUTHORIZATION,
                        "Bearer " + token
                )
                .contentType(MediaType.APPLICATION_JSON)
                .body("""
                        {
                            "name": "Test Student",
                            "email": "teacher-security-test@test.com",
                            "phone": "9999999999",
                            "department": "CSE",
                            "year": 3
                        }
                        """)
                .exchange((request, clientResponse) ->
                        clientResponse.getStatusCode());

        assertEquals(
                HttpStatus.FORBIDDEN,
                response
        );
    }

    // ==================================================
    // 6. STUDENT CANNOT CREATE STUDENT
    // ==================================================

    @Test
    void student_shouldNotCreateStudent() {

        String token = generateToken("teststudent");

        var response = restClient()
                .post()
                .uri("/api/students")
                .header(
                        HttpHeaders.AUTHORIZATION,
                        "Bearer " + token
                )
                .contentType(MediaType.APPLICATION_JSON)
                .body("""
                        {
                            "name": "Another Student",
                            "email": "student-security-test@test.com",
                            "phone": "8888888888",
                            "department": "CSE",
                            "year": 2
                        }
                        """)
                .exchange((request, clientResponse) ->
                        clientResponse.getStatusCode());

        assertEquals(
                HttpStatus.FORBIDDEN,
                response
        );
    }

    // ==================================================
    // 7. ADMIN CAN CREATE STUDENT
    // ==================================================

    @Test
    void admin_shouldCreateStudent() {

        String token = generateToken("testadmin");

        String uniqueEmail =
                "security-test-" + System.currentTimeMillis()
                        + "@test.com";

        var response = restClient()
                .post()
                .uri("/api/students")
                .header(
                        HttpHeaders.AUTHORIZATION,
                        "Bearer " + token
                )
                .contentType(MediaType.APPLICATION_JSON)
                .body("""
                        {
                            "name": "Security Test Student",
                            "email": "%s",
                            "phone": "7777777777",
                            "department": "CSE",
                            "year": 3
                        }
                        """.formatted(uniqueEmail))
                .exchange((request, clientResponse) ->
                        clientResponse.getStatusCode());

        assertEquals(
                HttpStatus.OK,
                response
        );
    }

    // ==================================================
    // 8. TEACHER CANNOT DELETE STUDENT
    // ==================================================

    @Test
    void teacher_shouldNotDeleteStudent() {

        String token = generateToken("testteacher");

        var response = restClient()
                .delete()
                .uri("/api/students/1")
                .header(
                        HttpHeaders.AUTHORIZATION,
                        "Bearer " + token
                )
                .exchange((request, clientResponse) ->
                        clientResponse.getStatusCode());

        assertEquals(
                HttpStatus.FORBIDDEN,
                response
        );
    }

    // ==================================================
    // 9. STUDENT CANNOT DELETE STUDENT
    // ==================================================

    @Test
    void student_shouldNotDeleteStudent() {

        String token = generateToken("teststudent");

        var response = restClient()
                .delete()
                .uri("/api/students/1")
                .header(
                        HttpHeaders.AUTHORIZATION,
                        "Bearer " + token
                )
                .exchange((request, clientResponse) ->
                        clientResponse.getStatusCode());

        assertEquals(
                HttpStatus.FORBIDDEN,
                response
        );
    }
}