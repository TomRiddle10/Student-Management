# Student Management System

A full-stack Student Management System built with **Spring Boot, React, PostgreSQL, and Docker**. The application provides role-based access for administrators, teachers, and students, with student management, course enrollment, attendance tracking, analytics, authentication, and authorization.

---

## 🚀 Features

### 🔐 Authentication & Authorization

- JWT-based authentication
- Secure password hashing using BCrypt
- Role-Based Access Control (RBAC)
- Three user roles:
  - `ADMIN`
  - `TEACHER`
  - `STUDENT`
- Protected REST APIs using Spring Security
- Role-based frontend navigation and access control
- Student ownership validation for personal data

### 👨‍💼 Admin

- Manage students
- Manage courses
- Manage course enrollments
- Manage teachers
- View dashboard statistics
- View course-wise attendance analytics
- Take and manage attendance

### 👨‍🏫 Teacher

- View students
- View courses
- Take attendance
- View attendance analytics
- View dashboard statistics

### 👨‍🎓 Student

- View personal profile
- View enrolled courses
- View personal attendance
- View attendance percentage
- View present/absent statistics
- Access student dashboard

### 📚 Student Management

- Create students
- Update students
- Delete students
- Search students
- Filter students
- Sort students
- Server-side pagination
- View detailed student information

### 📖 Course Management

- Create courses
- Update courses
- Delete courses
- View courses
- Course code and credit management
- Course enrollment management

### 📊 Attendance Management

- Course-wise attendance
- Date-based attendance
- Present/Absent status
- Attendance history
- Attendance percentage calculation
- Student attendance summaries
- Course-wise attendance analytics
- Unique attendance record per student, course, and date

### 🛡️ Error Handling

- Global exception handling
- Custom resource-not-found handling
- Conflict handling
- Structured API error responses
- HTTP status-based error handling

### 🧪 Testing

- JUnit
- Mockito
- MockMvc
- Service-layer testing
- Controller-layer testing
- Security and authorization testing

### 🐳 Docker

The complete application can be containerized using Docker:

- React frontend
- Spring Boot backend
- PostgreSQL database
- Nginx reverse proxy
- Docker Compose

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │      React UI       │
                    │   Material UI       │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │   Spring Boot API   │
                    │                     │
                    │ Controllers         │
                    │ Services            │
                    │ Repositories        │
                    │ Security            │
                    └──────────┬──────────┘
                               │
                  ┌────────────┴────────────┐
                  │                         │
                  ▼                         ▼
        ┌──────────────────┐      ┌─────────────────┐
        │ Spring Security  │      │   PostgreSQL    │
        │ JWT + RBAC       │      │    Database     │
        └──────────────────┘      └─────────────────┘