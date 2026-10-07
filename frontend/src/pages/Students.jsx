import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const API_URL = "/api";

const emptyStudent = {
  name: "",
  email: "",
  phone: "",
  department: "",
  year: "",
};

function Students() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const isAdmin = role === "ADMIN";

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // =========================================================
  // Student data
  // =========================================================

  const [students, setStudents] = useState([]);

  // =========================================================
  // Pagination
  // =========================================================

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // =========================================================
  // Sorting
  // =========================================================

  const [sortBy, setSortBy] = useState("id");
  const [direction, setDirection] = useState("asc");

  // =========================================================
  // Search and filters
  // =========================================================

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] =
    useState("");
  const [yearFilter, setYearFilter] = useState("");

  const [departments, setDepartments] = useState([]);

  // =========================================================
  // Dialog
  // =========================================================

  const [openDialog, setOpenDialog] = useState(false);
  const [editingStudent, setEditingStudent] =
    useState(null);
  const [formData, setFormData] =
    useState(emptyStudent);

  // =========================================================
  // Snackbar
  // =========================================================

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // =========================================================
  // Snackbar helper
  // =========================================================

  const showMessage = (
    message,
    severity = "success"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // =========================================================
  // Load paginated students
  // =========================================================

  const fetchStudents = async () => {
    try {
      const params = new URLSearchParams();

      params.append("page", page);
      params.append("size", pageSize);
      params.append("sortBy", sortBy);
      params.append("direction", direction);

      if (search.trim()) {
        params.append(
          "search",
          search.trim()
        );
      }

      if (departmentFilter) {
        params.append(
          "department",
          departmentFilter
        );
      }

      if (yearFilter) {
        params.append("year", yearFilter);
      }

      const response = await fetch(
        `${API_URL}/students/page?${params.toString()}`,
        {
          headers: authHeaders,
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load students"
        );
      }

      const data = await response.json();

      setStudents(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(
        data.totalElements || 0
      );
    } catch (error) {
      console.error(error);

      showMessage(
        "Failed to load students",
        "error"
      );
    }
  };

  // =========================================================
  // Load students whenever page/filter/sorting changes
  // =========================================================

  useEffect(() => {
    fetchStudents();
  }, [
    page,
    pageSize,
    sortBy,
    direction,
    search,
    departmentFilter,
    yearFilter,
  ]);

  // =========================================================
  // Load departments
  // =========================================================

  const fetchDepartments = async () => {
    try {
      const response = await fetch(
        `${API_URL}/students`,
        {
          headers: authHeaders,
        }
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      const uniqueDepartments = [
        ...new Set(
          data
            .map(
              (student) =>
                student.department
            )
            .filter(Boolean)
        ),
      ].sort();

      setDepartments(uniqueDepartments);
    } catch (error) {
      console.error(
        "Failed to load departments:",
        error
      );
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // =========================================================
  // Sorting
  // =========================================================

  const handleSort = (field) => {
    if (sortBy === field) {
      setDirection(
        direction === "asc"
          ? "desc"
          : "asc"
      );
    } else {
      setSortBy(field);
      setDirection("asc");
    }

    setPage(0);
  };

  // =========================================================
  // Search
  // =========================================================

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  // =========================================================
  // Department filter
  // =========================================================

  const handleDepartmentChange = (
    event
  ) => {
    setDepartmentFilter(
      event.target.value
    );
    setPage(0);
  };

  // =========================================================
  // Year filter
  // =========================================================

  const handleYearChange = (event) => {
    setYearFilter(event.target.value);
    setPage(0);
  };

  // =========================================================
  // Clear filters
  // =========================================================

  const handleClearFilters = () => {
    setSearch("");
    setDepartmentFilter("");
    setYearFilter("");
    setPage(0);
  };

  const hasFilters =
    Boolean(search) ||
    Boolean(departmentFilter) ||
    Boolean(yearFilter);

  // =========================================================
  // Pagination
  // =========================================================

  const handlePageChange = (
    event,
    value
  ) => {
    setPage(value - 1);
  };

  const handlePageSizeChange = (
    event
  ) => {
    setPageSize(
      Number(event.target.value)
    );
    setPage(0);
  };

  // =========================================================
  // Add Student
  // =========================================================

  const handleAddStudent = () => {
    if (!isAdmin) {
      showMessage(
        "Only administrators can add students",
        "error"
      );
      return;
    }

    setEditingStudent(null);

    setFormData({
      ...emptyStudent,
    });

    setOpenDialog(true);
  };

  // =========================================================
  // Edit Student
  // =========================================================

  const handleEditStudent = (
    student
  ) => {
    if (!isAdmin) {
      showMessage(
        "Only administrators can edit students",
        "error"
      );
      return;
    }

    setEditingStudent(student);

    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone || "",
      department: student.department,
      year: student.year,
    });

    setOpenDialog(true);
  };

  // =========================================================
  // Form input
  // =========================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // Save Student
  // =========================================================

  const handleSubmit = async () => {
    if (!isAdmin) {
      showMessage(
        "Only administrators can manage students",
        "error"
      );
      return;
    }

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.department.trim() ||
      !formData.year
    ) {
      showMessage(
        "Please fill all required fields",
        "error"
      );

      return;
    }

    const year = Number(formData.year);

    if (year < 1 || year > 4) {
      showMessage(
        "Year must be between 1 and 4",
        "error"
      );

      return;
    }

    const studentData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      department:
        formData.department.trim(),
      year,
    };

    try {
      let response;

      if (editingStudent) {
        response = await fetch(
          `${API_URL}/students/${editingStudent.id}`,
          {
            method: "PUT",
            headers: authHeaders,
            body: JSON.stringify(
              studentData
            ),
          }
        );
      } else {
        response = await fetch(
          `${API_URL}/students`,
          {
            method: "POST",
            headers: authHeaders,
            body: JSON.stringify(
              studentData
            ),
          }
        );
      }

      if (!response.ok) {
        let message =
          "Failed to save student";

        try {
          const errorData =
            await response.json();

          if (errorData.message) {
            message =
              errorData.message;
          }
        } catch {
          // Ignore JSON parsing error
        }

        throw new Error(message);
      }

      setOpenDialog(false);

      await fetchStudents();
      await fetchDepartments();

      showMessage(
        editingStudent
          ? "Student updated successfully"
          : "Student added successfully"
      );
    } catch (error) {
      console.error(error);

      showMessage(
        error.message ||
          "Failed to save student",
        "error"
      );
    }
  };

  // =========================================================
  // Delete Student
  // =========================================================

  const handleDelete = async (id) => {
    if (!isAdmin) {
      showMessage(
        "Only administrators can delete students",
        "error"
      );
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this student?"
      );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/students/${id}`,
        {
          method: "DELETE",
          headers: authHeaders,
        }
      );

      if (!response.ok) {
        let message =
          "Failed to delete student";

        try {
          const errorData =
            await response.json();

          if (errorData.message) {
            message =
              errorData.message;
          }
        } catch {
          // Ignore JSON parsing error
        }

        throw new Error(message);
      }

      /*
       * If deleting the last student
       * on the current page, move back.
       */

      if (
        students.length === 1 &&
        page > 0
      ) {
        setPage(page - 1);
      } else {
        await fetchStudents();
      }

      await fetchDepartments();

      showMessage(
        "Student deleted successfully"
      );
    } catch (error) {
      console.error(error);

      showMessage(
        error.message ||
          "Failed to delete student",
        "error"
      );
    }
  };

  // =========================================================
  // Render
  // =========================================================

  return (
    <Box sx={{ pb: 5 }}>

      {/* =====================================================
          HEADER
      ====================================================== */}

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          sm: "center",
        }}
        flexDirection={{
          xs: "column",
          sm: "row",
        }}
        gap={2}
        mb={3}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={800}
          >
            Students
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Manage and search student
            records.
          </Typography>
        </Box>

        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={
              handleAddStudent
            }
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Add Student
          </Button>
        )}
      </Box>

      {/* =====================================================
          SEARCH + FILTERS
      ====================================================== */}

      <Card
        sx={{
          borderRadius: 3,
          mb: 2.5,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            spacing={2}
          >
            {/* Search */}

            <TextField
              fullWidth
              label="Search students"
              placeholder="Name, email, phone or ID..."
              value={search}
              onChange={
                handleSearchChange
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),

                endAdornment: search ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSearch("");
                        setPage(0);
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />

            {/* Department */}

            <FormControl
              sx={{
                minWidth: {
                  xs: "100%",
                  md: 210,
                },
              }}
            >
              <InputLabel>
                Department
              </InputLabel>

              <Select
                value={
                  departmentFilter
                }
                label="Department"
                onChange={
                  handleDepartmentChange
                }
              >
                <MenuItem value="">
                  All Departments
                </MenuItem>

                {departments.map(
                  (department) => (
                    <MenuItem
                      key={department}
                      value={department}
                    >
                      {department}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>

            {/* Year */}

            <FormControl
              sx={{
                minWidth: {
                  xs: "100%",
                  md: 150,
                },
              }}
            >
              <InputLabel>
                Year
              </InputLabel>

              <Select
                value={yearFilter}
                label="Year"
                onChange={
                  handleYearChange
                }
              >
                <MenuItem value="">
                  All Years
                </MenuItem>

                <MenuItem value="1">
                  Year 1
                </MenuItem>

                <MenuItem value="2">
                  Year 2
                </MenuItem>

                <MenuItem value="3">
                  Year 3
                </MenuItem>

                <MenuItem value="4">
                  Year 4
                </MenuItem>
              </Select>
            </FormControl>

            {/* Clear */}

            <Button
              variant="outlined"
              startIcon={
                <ClearIcon />
              }
              onClick={
                handleClearFilters
              }
              disabled={!hasFilters}
              sx={{
                minWidth: 120,
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              Clear
            </Button>
          </Stack>

          {/* Result information */}

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Showing{" "}
              <strong>
                {students.length}
              </strong>{" "}
              of{" "}
              <strong>
                {totalElements}
              </strong>{" "}
              students
            </Typography>

            {hasFilters && (
              <Typography
                variant="body2"
                color="primary"
                fontWeight={600}
              >
                Filters active
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* =====================================================
          STUDENT TABLE
      ====================================================== */}

      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box
            sx={{
              overflowX: "auto",
            }}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    bgcolor:
                      "action.hover",
                  }}
                >
                  {/* ID */}

                  <TableCell>
                    <TableSortLabel
                      active={
                        sortBy === "id"
                      }
                      direction={
                        sortBy === "id"
                          ? direction
                          : "asc"
                      }
                      onClick={() =>
                        handleSort("id")
                      }
                    >
                      <strong>
                        ID
                      </strong>
                    </TableSortLabel>
                  </TableCell>

                  {/* Name */}

                  <TableCell>
                    <TableSortLabel
                      active={
                        sortBy === "name"
                      }
                      direction={
                        sortBy === "name"
                          ? direction
                          : "asc"
                      }
                      onClick={() =>
                        handleSort("name")
                      }
                    >
                      <strong>
                        Name
                      </strong>
                    </TableSortLabel>
                  </TableCell>

                  {/* Email */}

                  <TableCell>
                    <strong>
                      Email
                    </strong>
                  </TableCell>

                  {/* Phone */}

                  <TableCell>
                    <strong>
                      Phone
                    </strong>
                  </TableCell>

                  {/* Department */}

                  <TableCell>
                    <TableSortLabel
                      active={
                        sortBy ===
                        "department"
                      }
                      direction={
                        sortBy ===
                        "department"
                          ? direction
                          : "asc"
                      }
                      onClick={() =>
                        handleSort(
                          "department"
                        )
                      }
                    >
                      <strong>
                        Department
                      </strong>
                    </TableSortLabel>
                  </TableCell>

                  {/* Year */}

                  <TableCell>
                    <TableSortLabel
                      active={
                        sortBy === "year"
                      }
                      direction={
                        sortBy === "year"
                          ? direction
                          : "asc"
                      }
                      onClick={() =>
                        handleSort("year")
                      }
                    >
                      <strong>
                        Year
                      </strong>
                    </TableSortLabel>
                  </TableCell>

                  {/* Actions */}

                  <TableCell align="center">
                    <strong>
                      Actions
                    </strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {students.length ===
                0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      align="center"
                      sx={{
                        py: 6,
                      }}
                    >
                      <Box>
                        <SearchIcon
                          sx={{
                            fontSize: 42,
                            color:
                              "text.disabled",
                            mb: 1,
                          }}
                        />

                        <Typography
                          fontWeight={600}
                        >
                          No students found
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mt: 0.5,
                          }}
                        >
                          Try changing your
                          search or filters.
                        </Typography>

                        {hasFilters && (
                          <Button
                            size="small"
                            onClick={
                              handleClearFilters
                            }
                            sx={{
                              mt: 1.5,
                              textTransform:
                                "none",
                            }}
                          >
                            Clear filters
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map(
                    (student) => (
                      <TableRow
                        key={
                          student.id
                        }
                        hover
                      >
                        <TableCell>
                          {student.id}
                        </TableCell>

                        <TableCell>
                          <Typography
                            fontWeight={600}
                          >
                            {student.name}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          {student.email}
                        </TableCell>

                        <TableCell>
                          {student.phone ||
                            "-"}
                        </TableCell>

                        <TableCell>
                          {
                            student.department
                          }
                        </TableCell>

                        <TableCell>
                          Year{" "}
                          {student.year}
                        </TableCell>

                        <TableCell align="center">

                          {/* View */}

                          <IconButton
                            color="primary"
                            onClick={() =>
                              navigate(
                                `/students/${student.id}`
                              )
                            }
                            title="View student"
                          >
                            <VisibilityIcon />
                          </IconButton>

                          {/* Admin actions */}

                          {isAdmin && (
                            <>
                              <IconButton
                                color="primary"
                                onClick={() =>
                                  handleEditStudent(
                                    student
                                  )
                                }
                                title="Edit student"
                              >
                                <EditIcon />
                              </IconButton>

                              <IconButton
                                color="error"
                                onClick={() =>
                                  handleDelete(
                                    student.id
                                  )
                                }
                                title="Delete student"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  )
                )}
              </TableBody>
            </Table>
          </Box>

          {/* =================================================
              PAGINATION
          ================================================== */}

          {totalElements > 0 && (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              gap={2}
              px={2.5}
              py={2}
              borderTop="1px solid"
              borderColor="divider"
            >
              {/* Rows per page */}

              <Box
                display="flex"
                alignItems="center"
                gap={1.5}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Rows per page:
                </Typography>

                <FormControl
                  size="small"
                >
                  <Select
                    value={pageSize}
                    onChange={
                      handlePageSizeChange
                    }
                  >
                    <MenuItem value={5}>
                      5
                    </MenuItem>

                    <MenuItem value={10}>
                      10
                    </MenuItem>

                    <MenuItem value={20}>
                      20
                    </MenuItem>

                    <MenuItem value={50}>
                      50
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Page information */}

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Page{" "}
                <strong>
                  {page + 1}
                </strong>{" "}
                of{" "}
                <strong>
                  {totalPages}
                </strong>
              </Typography>

              {/* Page buttons */}

              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={
                  handlePageChange
                }
                color="primary"
                shape="rounded"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* =====================================================
          ADD / EDIT DIALOG
      ====================================================== */}

      {isAdmin && (
        <Dialog
          open={openDialog}
          onClose={() =>
            setOpenDialog(false)
          }
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            {editingStudent
              ? "Edit Student"
              : "Add Student"}
          </DialogTitle>

          <DialogContent>
            <Stack spacing={2} mt={1}>
              <TextField
                label="Name"
                name="name"
                value={
                  formData.name
                }
                onChange={
                  handleChange
                }
                fullWidth
                required
              />

              <TextField
                label="Email"
                name="email"
                type="email"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
                fullWidth
                required
              />

              <TextField
                label="Phone"
                name="phone"
                value={
                  formData.phone
                }
                onChange={
                  handleChange
                }
                fullWidth
              />

              <TextField
                label="Department"
                name="department"
                value={
                  formData.department
                }
                onChange={
                  handleChange
                }
                fullWidth
                required
              />

              <TextField
                label="Year"
                name="year"
                type="number"
                value={
                  formData.year
                }
                onChange={
                  handleChange
                }
                slotProps={{
                  htmlInput: {
                    min: 1,
                    max: 4,
                  },
                }}
                fullWidth
                required
              />
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() =>
                setOpenDialog(false)
              }
              sx={{
                textTransform:
                  "none",
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={
                handleSubmit
              }
              sx={{
                textTransform:
                  "none",
              }}
            >
              {editingStudent
                ? "Update"
                : "Add Student"}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* =====================================================
          SNACKBAR
      ====================================================== */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar(
            (previous) => ({
              ...previous,
              open: false,
            })
          )
        }
      >
        <Alert
          severity={
            snackbar.severity
          }
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Students;