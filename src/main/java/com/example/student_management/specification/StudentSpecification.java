package com.example.student_management.specification;

import com.example.student_management.entity.Student;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class StudentSpecification {

    public static Specification<Student> filterStudents(
            String search,
            String department,
            Integer year) {

        return (root, query, criteriaBuilder) -> {

            List<Predicate> predicates = new ArrayList<>();

            // Search by name, email, phone, department, or ID
            if (search != null && !search.trim().isEmpty()) {

                String searchValue = "%" + search.trim().toLowerCase() + "%";

                List<Predicate> searchPredicates = new ArrayList<>();

                searchPredicates.add(
                        criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("name")),
                                searchValue
                        )
                );

                searchPredicates.add(
                        criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("email")),
                                searchValue
                        )
                );

                searchPredicates.add(
                        criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("phone")),
                                searchValue
                        )
                );

                searchPredicates.add(
                        criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("department")),
                                searchValue
                        )
                );

                // Search by ID
                try {
                    Long id = Long.parseLong(search.trim());

                    searchPredicates.add(
                            criteriaBuilder.equal(
                                    root.get("id"),
                                    id
                            )
                    );

                } catch (NumberFormatException ignored) {
                    // Search value is not a numeric ID
                }

                predicates.add(
                        criteriaBuilder.or(
                                searchPredicates.toArray(new Predicate[0])
                        )
                );
            }

            // Department filter
            if (department != null && !department.trim().isEmpty()) {

                predicates.add(
                        criteriaBuilder.equal(
                                criteriaBuilder.lower(root.get("department")),
                                department.trim().toLowerCase()
                        )
                );
            }

            // Year filter
            if (year != null) {

                predicates.add(
                        criteriaBuilder.equal(
                                root.get("year"),
                                year
                        )
                );
            }

            return criteriaBuilder.and(
                    predicates.toArray(new Predicate[0])
            );
        };
    }
}