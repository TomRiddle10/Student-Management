// =========================================================
// Student Management System
// Frontend Configuration
// =========================================================

// =========================================================
// API Configuration
// =========================================================

// Keep this as /api.
//
// Development:
// Vite can proxy /api to Spring Boot.
//
// Docker:
// Nginx forwards /api requests to the backend container.
//
// This means we don't need to change API URLs when
// moving between local development and Docker.
export const API_URL = "/api";


// =========================================================
// Authentication Storage Keys
// =========================================================

export const AUTH_KEYS = {
  TOKEN: "token",
  ROLE: "role",
  USER: "user",
};


// =========================================================
// Get JWT Token
// =========================================================

export const getToken = () => {
  return localStorage.getItem(
    AUTH_KEYS.TOKEN
  );
};


// =========================================================
// Get Current User Role
// =========================================================

export const getRole = () => {
  return localStorage.getItem(
    AUTH_KEYS.ROLE
  );
};


// =========================================================
// Get Current User
// =========================================================

export const getUser = () => {
  const storedUser = localStorage.getItem(
    AUTH_KEYS.USER
  );

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    console.error(
      "Failed to parse stored user:",
      error
    );

    return null;
  }
};


// =========================================================
// Check Authentication
// =========================================================

export const isAuthenticated = () => {
  const token = getToken();

  return Boolean(token);
};


// =========================================================
// Authentication Headers
// =========================================================

export const getAuthHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",

    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
};


// =========================================================
// Bearer Token Only
// Useful for requests where Content-Type is not needed.
// =========================================================

export const getAuthOnlyHeaders = () => {
  const token = getToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};


// =========================================================
// Role Helpers
// =========================================================

export const isAdmin = () => {
  return getRole() === "ADMIN";
};


export const isTeacher = () => {
  return getRole() === "TEACHER";
};


export const isStudent = () => {
  return getRole() === "STUDENT";
};


// =========================================================
// Role-Based Access Helpers
// =========================================================

export const canManageStudents = () => {
  return isAdmin();
};


export const canManageCourses = () => {
  return isAdmin();
};


export const canManageTeachers = () => {
  return isAdmin();
};


export const canManageEnrollment = () => {
  return isAdmin();
};


export const canTakeAttendance = () => {
  return (
    isAdmin() ||
    isTeacher()
  );
};


export const canViewStudents = () => {
  return (
    isAdmin() ||
    isTeacher()
  );
};


// =========================================================
// Save Authentication Data
// Called after successful login.
// =========================================================

export const saveAuthData = (data) => {
  if (!data) {
    return;
  }

  if (data.token) {
    localStorage.setItem(
      AUTH_KEYS.TOKEN,
      data.token
    );
  }

  if (data.role) {
    localStorage.setItem(
      AUTH_KEYS.ROLE,
      data.role
    );
  }

  const user = {
    id: data.userId,
    username: data.username,
    email: data.email,
    role: data.role,
  };

  localStorage.setItem(
    AUTH_KEYS.USER,
    JSON.stringify(user)
  );
};


// =========================================================
// Clear Authentication Data
// Called during logout.
// =========================================================

export const clearAuthData = () => {
  localStorage.removeItem(
    AUTH_KEYS.TOKEN
  );

  localStorage.removeItem(
    AUTH_KEYS.ROLE
  );

  localStorage.removeItem(
    AUTH_KEYS.USER
  );
};


// =========================================================
// Get Current Authentication Information
// =========================================================

export const getAuthData = () => {
  return {
    token: getToken(),
    role: getRole(),
    user: getUser(),
    authenticated: isAuthenticated(),
  };
};


// =========================================================
// API Request Helper
// =========================================================
//
// Usage:
//
// const response = await apiFetch(
//   "/students"
// );
//
// const response = await apiFetch(
//   "/students/1",
//   {
//     method: "DELETE",
//   }
// );
//
// =========================================================

export const apiFetch = async (
  endpoint,
  options = {}
) => {
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };

  return fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );
};


// =========================================================
// API JSON Helper
// =========================================================
//
// Automatically:
// - Adds JWT
// - Sends JSON
// - Parses JSON response
// - Throws an error for HTTP failures
//
// =========================================================

export const apiRequest = async (
  endpoint,
  options = {}
) => {
  const response = await apiFetch(
    endpoint,
    options
  );

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data;
};


// =========================================================
// API GET
// =========================================================

export const apiGet = async (
  endpoint
) => {
  return apiRequest(endpoint);
};


// =========================================================
// API POST
// =========================================================

export const apiPost = async (
  endpoint,
  body
) => {
  return apiRequest(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
};


// =========================================================
// API PUT
// =========================================================

export const apiPut = async (
  endpoint,
  body
) => {
  return apiRequest(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  });
};


// =========================================================
// API DELETE
// =========================================================

export const apiDelete = async (
  endpoint
) => {
  return apiRequest(endpoint, {
    method: "DELETE",
  });
};