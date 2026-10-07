import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Button,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import LogoutIcon from "@mui/icons-material/Logout";

import { Link, Outlet, useNavigate } from "react-router-dom";

import {
  getRole,
  clearAuthData,
} from "../config";

const drawerWidth = 240;

function Layout() {
  const navigate = useNavigate();

  const role = getRole();

  const handleLogout = () => {
    clearAuthData();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* ================================================= */}
      {/* Top Bar */}
      {/* ================================================= */}

      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
          >
            Student Management System
          </Typography>
        </Toolbar>
      </AppBar>


      {/* ================================================= */}
      {/* Sidebar */}
      {/* ================================================= */}

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,

          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >

        {/* Logo */}

        <Toolbar>
          <Typography
            variant="h6"
            fontWeight="bold"
          >
            SMS
          </Typography>
        </Toolbar>

        <Divider />


        {/* ================================================= */}
        {/* Navigation */}
        {/* ================================================= */}

        <List>

          {/* Dashboard */}

          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/dashboard"
            >
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>

              <ListItemText
                primary="Dashboard"
              />
            </ListItemButton>
          </ListItem>


          {/* ================================================= */}
          {/* Students - ADMIN + TEACHER */}
          {/* ================================================= */}

          {(role === "ADMIN" ||
            role === "TEACHER") && (
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/students"
              >
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>

                <ListItemText
                  primary="Students"
                />
              </ListItemButton>
            </ListItem>
          )}


          {/* ================================================= */}
          {/* Courses - ALL ROLES */}
          {/* ================================================= */}

          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/courses"
            >
              <ListItemIcon>
                <SchoolIcon />
              </ListItemIcon>

              <ListItemText
                primary="Courses"
              />
            </ListItemButton>
          </ListItem>


          {/* ================================================= */}
          {/* Attendance - ADMIN + TEACHER */}
          {/* ================================================= */}

          {(role === "ADMIN" ||
            role === "TEACHER") && (
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/attendance"
              >
                <ListItemIcon>
                  <EventAvailableIcon />
                </ListItemIcon>

                <ListItemText
                  primary="Attendance"
                />
              </ListItemButton>
            </ListItem>
          )}


          {/* ================================================= */}
          {/* My Attendance - STUDENT */}
          {/* ================================================= */}

          {role === "STUDENT" && (
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/student-attendance"
              >
                <ListItemIcon>
                  <EventAvailableIcon />
                </ListItemIcon>

                <ListItemText
                  primary="My Attendance"
                />
              </ListItemButton>
            </ListItem>
          )}


          {/* ================================================= */}
          {/* Teachers - ADMIN ONLY */}
          {/* ================================================= */}

          {role === "ADMIN" && (
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/teachers"
              >
                <ListItemIcon>
                  <SupervisorAccountIcon />
                </ListItemIcon>

                <ListItemText
                  primary="Teachers"
                />
              </ListItemButton>
            </ListItem>
          )}

        </List>


        {/* ================================================= */}
        {/* Logout */}
        {/* ================================================= */}

        <Box
          sx={{
            marginTop: "auto",
            p: 1,
          }}
        >
          <Divider />

          <Button
            fullWidth
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              justifyContent: "flex-start",
              px: 2,
              py: 1.5,
              color: "text.primary",
            }}
          >
            Logout
          </Button>
        </Box>

      </Drawer>


      {/* ================================================= */}
      {/* Main Content */}
      {/* ================================================= */}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          minHeight: "100vh",
          backgroundColor: "#f5f7fa",
        }}
      >
        <Toolbar />

        <Outlet />
      </Box>

    </Box>
  );
}

export default Layout;