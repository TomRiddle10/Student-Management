package com.example.student_management.config;

import com.example.student_management.entity.Attendance;
import com.example.student_management.entity.AttendanceStatus;
import com.example.student_management.entity.Course;
import com.example.student_management.entity.Enrollment;
import com.example.student_management.entity.Role;
import com.example.student_management.entity.Student;
import com.example.student_management.entity.User;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

@Configuration
public class DataInitializer {

    private static final Random RANDOM = new Random(2026);

    @PersistenceContext
    private EntityManager entityManager;

    private final TransactionTemplate transactionTemplate;

    public DataInitializer(
            org.springframework.transaction.PlatformTransactionManager transactionManager
    ) {
        this.transactionTemplate =
                new TransactionTemplate(transactionManager);
    }

    // =========================================================
    // COMMAND LINE RUNNER
    // =========================================================

    @Bean
    public CommandLineRunner initializeData(
            PasswordEncoder passwordEncoder
    ) {
        return args -> {

            transactionTemplate.executeWithoutResult(
                    status -> seedDatabase(passwordEncoder)
            );

        };
    }


    // =========================================================
    // SEED DATABASE
    // =========================================================

    private void seedDatabase(
            PasswordEncoder passwordEncoder
    ) {

        Long existingUsers =
                entityManager
                        .createQuery(
                                "SELECT COUNT(u) FROM User u",
                                Long.class
                        )
                        .getSingleResult();

        // -----------------------------------------------------
        // DO NOT SEED AGAIN
        // -----------------------------------------------------

        if (existingUsers > 0) {

            System.out.println();
            System.out.println(
                    "=========================================="
            );
            System.out.println(
                    "Database already contains users."
            );
            System.out.println(
                    "Skipping demo data initialization."
            );
            System.out.println(
                    "=========================================="
            );
            System.out.println();

            return;
        }


        System.out.println();
        System.out.println(
                "=========================================="
        );
        System.out.println(
                "Starting demo data initialization..."
        );
        System.out.println(
                "=========================================="
        );


        // =====================================================
        // 1. ADMIN
        // =====================================================

        User admin = new User(
                "admin",
                "admin@studentmanagement.com",
                passwordEncoder.encode("admin123"),
                Role.ADMIN
        );

        entityManager.persist(admin);

        System.out.println(
                "Created admin user."
        );


        // =====================================================
        // 2. TEACHERS
        // =====================================================

        List<User> teachers = new ArrayList<>();

        for (int i = 1; i <= 8; i++) {

            String username =
                    String.format(
                            "teacher%02d",
                            i
                    );

            User teacher = new User(
                    username,
                    username
                            + "@studentmanagement.com",
                    passwordEncoder.encode(
                            "teacher123"
                    ),
                    Role.TEACHER
            );

            entityManager.persist(teacher);

            teachers.add(teacher);
        }

        System.out.println(
                "Created 8 teachers."
        );


        // =====================================================
        // 3. COURSES
        // =====================================================

        List<Course> courses =
                new ArrayList<>();

        courses.add(
                new Course(
                        "CSE101",
                        "Programming Fundamentals",
                        4
                )
        );

        courses.add(
                new Course(
                        "CSE102",
                        "Data Structures",
                        4
                )
        );

        courses.add(
                new Course(
                        "CSE103",
                        "Object Oriented Programming",
                        4
                )
        );

        courses.add(
                new Course(
                        "CSE104",
                        "Database Management Systems",
                        4
                )
        );

        courses.add(
                new Course(
                        "CSE105",
                        "Operating Systems",
                        4
                )
        );

        courses.add(
                new Course(
                        "CSE106",
                        "Computer Networks",
                        4
                )
        );

        courses.add(
                new Course(
                        "CSE107",
                        "Software Engineering",
                        3
                )
        );

        courses.add(
                new Course(
                        "CSE108",
                        "Web Development",
                        3
                )
        );

        courses.add(
                new Course(
                        "CSE109",
                        "Artificial Intelligence",
                        4
                )
        );

        courses.add(
                new Course(
                        "CSE110",
                        "Machine Learning",
                        4
                )
        );

        courses.add(
                new Course(
                        "CSE111",
                        "Cloud Computing",
                        3
                )
        );

        courses.add(
                new Course(
                        "CSE112",
                        "Cyber Security",
                        3
                )
        );

        courses.add(
                new Course(
                        "CSE113",
                        "Computer Architecture",
                        3
                )
        );

        courses.add(
                new Course(
                        "CSE114",
                        "Distributed Systems",
                        4
                )
        );

        courses.add(
                new Course(
                        "CSE115",
                        "DevOps and CI/CD",
                        3
                )
        );


        for (Course course : courses) {

            entityManager.persist(course);
        }

        entityManager.flush();

        System.out.println(
                "Created "
                        + courses.size()
                        + " courses."
        );


        // =====================================================
        // 4. STUDENTS + STUDENT USERS
        // =====================================================

        String[] firstNames = {

                "Aarav",
                "Vivaan",
                "Aditya",
                "Arjun",
                "Rohan",
                "Rahul",
                "Aryan",
                "Kunal",
                "Akash",
                "Sahil",
                "Yash",
                "Om",
                "Atharv",
                "Vedant",
                "Shubham",
                "Tanmay",
                "Harsh",
                "Abhishek",
                "Pranav",
                "Aniket"
        };


        String[] lastNames = {

                "Sharma",
                "Patil",
                "Pawar",
                "Deshmukh",
                "Jadhav",
                "Kulkarni",
                "Joshi",
                "More",
                "Chavan",
                "Thakur",
                "Kadam",
                "Shinde",
                "Gaikwad",
                "Bhosale",
                "Mane"
        };


        String[] departments = {

                "Computer Science",
                "Information Technology",
                "Artificial Intelligence",
                "Data Science",
                "Cyber Security"
        };


        List<Student> students =
                new ArrayList<>();


        for (int i = 1; i <= 100; i++) {

            String username =
                    String.format(
                            "student%03d",
                            i
                    );


            String firstName =
                    firstNames[
                            (i - 1)
                                    % firstNames.length
                    ];


            String lastName =
                    lastNames[
                            (i * 7)
                                    % lastNames.length
                    ];


            String name =
                    firstName
                            + " "
                            + lastName;


            String email =
                    username
                            + "@studentmanagement.com";


            String phone =
                    "9"
                            + String.format(
                                    "%09d",
                                    100000000 + i
                            );


            String department =
                    departments[
                            (i - 1)
                                    % departments.length
                    ];


            int year =
                    ((i - 1) % 4) + 1;


            Student student =
                    new Student(
                            name,
                            email,
                            phone,
                            department,
                            year
                    );


            entityManager.persist(student);

            students.add(student);


            // Student login account

            User studentUser =
                    new User(
                            username,
                            email,
                            passwordEncoder.encode(
                                    "student123"
                            ),
                            Role.STUDENT
                    );


            entityManager.persist(
                    studentUser
            );
        }


        entityManager.flush();


        System.out.println(
                "Created 100 students."
        );


        // =====================================================
        // 5. ENROLLMENTS
        // =====================================================

        List<Enrollment> enrollments =
                new ArrayList<>();


        for (Student student : students) {

            List<Course> shuffledCourses =
                    new ArrayList<>(
                            courses
                    );


            Collections.shuffle(
                    shuffledCourses,
                    new Random(
                            student.getId()
                    )
            );


            // Every student gets 4-6 courses

            int numberOfCourses =
                    4 + RANDOM.nextInt(3);


            for (
                    int i = 0;
                    i < numberOfCourses;
                    i++
            ) {

                Course course =
                        shuffledCourses.get(i);


                Enrollment enrollment =
                        new Enrollment(
                                student,
                                course
                        );


                enrollment.setEnrolledAt(
                        LocalDateTime.now()
                                .minusDays(
                                        RANDOM.nextInt(
                                                60
                                        )
                                )
                );


                entityManager.persist(
                        enrollment
                );

                enrollments.add(
                        enrollment
                );
            }
        }


        entityManager.flush();


        System.out.println(
                "Created "
                        + enrollments.size()
                        + " enrollments."
        );


        // =====================================================
        // 6. ATTENDANCE
        // =====================================================

        LocalDate endDate =
                LocalDate.now();


        LocalDate startDate =
                endDate.minusDays(45);


        int attendanceCount = 0;


        for (
                Enrollment enrollment :
                enrollments
        ) {

            LocalDate date =
                    startDate;


            while (
                    !date.isAfter(endDate)
            ) {

                // Monday - Friday only

                if (
                        date.getDayOfWeek()
                                .getValue()
                                <= 5
                ) {

                    AttendanceStatus status;


                    // 85% Present
                    // 15% Absent

                    if (
                            RANDOM.nextInt(100)
                                    < 85
                    ) {

                        status =
                                AttendanceStatus.PRESENT;

                    } else {

                        status =
                                AttendanceStatus.ABSENT;
                    }


                    Attendance attendance =
                            new Attendance(
                                    enrollment
                                            .getStudent(),
                                    enrollment
                                            .getCourse(),
                                    date,
                                    status
                            );


                    entityManager.persist(
                            attendance
                    );


                    attendanceCount++;
                }


                date =
                        date.plusDays(1);
            }
        }


        entityManager.flush();


        // =====================================================
        // SUMMARY
        // =====================================================

        System.out.println();
        System.out.println(
                "=========================================="
        );
        System.out.println(
                "DEMO DATA INITIALIZATION COMPLETE"
        );
        System.out.println(
                "=========================================="
        );

        System.out.println(
                "Admin       : 1"
        );

        System.out.println(
                "Teachers    : 8"
        );

        System.out.println(
                "Students    : 100"
        );

        System.out.println(
                "Courses     : "
                        + courses.size()
        );

        System.out.println(
                "Enrollments : "
                        + enrollments.size()
        );

        System.out.println(
                "Attendance  : "
                        + attendanceCount
        );

        System.out.println(
                "------------------------------------------"
        );

        System.out.println(
                "ADMIN"
        );

        System.out.println(
                "Username: admin"
        );

        System.out.println(
                "Password: admin123"
        );

        System.out.println(
                "------------------------------------------"
        );

        System.out.println(
                "TEACHER"
        );

        System.out.println(
                "Username: teacher01"
        );

        System.out.println(
                "Password: teacher123"
        );

        System.out.println(
                "------------------------------------------"
        );

        System.out.println(
                "STUDENT"
        );

        System.out.println(
                "Username: student001"
        );

        System.out.println(
                "Password: student123"
        );

        System.out.println(
                "=========================================="
        );

        System.out.println();
    }
}