import { useEffect, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

const API_URL = "http://localhost:8080/api";

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/students`)
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((error) =>
        console.error("Error loading students:", error)
      );

    fetch(`${API_URL}/courses`)
      .then((response) => response.json())
      .then((data) => setCourses(data))
      .catch((error) =>
        console.error("Error loading courses:", error)
      );
  }, []);

  const cards = [
    {
      title: "Total Students",
      value: students.length,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: "Total Courses",
      value: courses.length,
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: "Attendance",
      value: "Manage",
      icon: <EventAvailableIcon sx={{ fontSize: 40 }} />,
    },
  ];

  return (
    <Box>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={1}
      >
        Dashboard
      </Typography>

      <Typography
        color="text.secondary"
        mb={4}
      >
        Student Management System Overview
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} md={4} key={card.title}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                      mb={1}
                    >
                      {card.title}
                    </Typography>

                    <Typography
                      variant="h4"
                      fontWeight="bold"
                    >
                      {card.value}
                    </Typography>
                  </Box>

                  {card.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card
        sx={{
          mt: 4,
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight="bold"
            mb={2}
          >
            Recent Students
          </Typography>

          {students.length === 0 ? (
            <Typography color="text.secondary">
              No students found.
            </Typography>
          ) : (
            students.slice(0, 5).map((student) => (
              <Box
                key={student.id}
                sx={{
                  py: 1.5,
                  borderBottom: "1px solid #eee",
                }}
              >
                <Typography fontWeight="500">
                  {student.name}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {student.email}
                </Typography>
              </Box>
            ))
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default Dashboard;