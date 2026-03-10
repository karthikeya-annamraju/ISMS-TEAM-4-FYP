// Frontend Integration Guide - React with Axios/Fetch

// ==================== API SERVICE ====================

// Option 1: Using Axios (if you have axios installed)
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/auth';

const AuthService = {
  // Register a new user
  registerUser: async (name, email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register/user`, {
        name,
        email,
        password
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  },

  // Register a new admin
  registerAdmin: async (name, email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register/admin`, {
        name,
        email,
        password
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Admin registration failed'
      };
    }
  },

  // Login user
  loginUser: async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login/user`, {
        email,
        password
      });
      
      if (response.data.success) {
        // Store user data in localStorage
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('userRole', response.data.role);
        localStorage.setItem('userName', response.data.userName);
        localStorage.setItem('userEmail', response.data.email);
      }
      
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  },

  // Login admin
  loginAdmin: async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login/admin`, {
        email,
        password
      });
      
      if (response.data.success) {
        // Store admin data in localStorage
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('userRole', 'ADMIN');
        localStorage.setItem('userName', response.data.userName);
        localStorage.setItem('userEmail', response.data.email);
      }
      
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Admin login failed'
      };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return localStorage.getItem('userId') !== null;
  },

  // Get current user role
  getUserRole: () => {
    return localStorage.getItem('userRole');
  },

  // Get current user ID
  getUserId: () => {
    return localStorage.getItem('userId');
  }
};

export default AuthService;

// ==================== USAGE IN COMPONENTS ====================

// Example: User Registration Component
function UserRegisterComponent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Call API
    const response = await AuthService.registerUser(
      formData.name,
      formData.email,
      formData.password
    );

    if (response.success) {
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/auth/login/user'), 2000);
    } else {
      setMessage(`Error: ${response.message}`);
    }
  };

  return (
    <div>
      <h2>User Registration</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

// Example: User Login Component
function UserLoginComponent() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Call API
    const response = await AuthService.loginUser(
      formData.email,
      formData.password
    );

    if (response.success) {
      setMessage('Login successful! Redirecting to dashboard...');
      setTimeout(() => navigate('/user-dashboard'), 2000);
    } else {
      setMessage(`Error: ${response.message}`);
    }
  };

  return (
    <div>
      <h2>User Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

// Example: Admin Dashboard (Protected Route)
function AdminDashboard() {
  const userRole = AuthService.getUserRole();
  const userName = localStorage.getItem('userName');
  const navigate = useNavigate();

  // Check if user has admin role
  if (userRole !== 'ADMIN') {
    return <div>Access Denied. Admin role required.</div>;
  }

  const handleLogout = () => {
    AuthService.logout();
    navigate('/');
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {userName}!</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

// ==================== ENVIRONMENT SETUP ====================

// In your .env file (React project root):
VITE_API_BASE_URL=http://localhost:8080
VITE_API_AUTH_URL=http://localhost:8080/api/auth

// Usage in code:
const API_URL = import.meta.env.VITE_API_AUTH_URL;

// ==================== ERROR HANDLING BEST PRACTICES ====================

async function handleLogin(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/login/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    // Check if response is OK (status 200-299)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    
    if (data.success) {
      // Store user data
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('userRole', data.role);
      
      // Show success message
      showNotification('Login successful!', 'success');
      
      // Redirect based on role
      if (data.role === 'ADMIN') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } else {
      // API returned success=false
      showNotification(data.message, 'error');
    }
  } catch (error) {
    console.error('Login error:', error);
    showNotification(error.message || 'Network error', 'error');
  }
}

// ==================== TYPESCRIPT TYPES ====================

interface LoginResponse {
  success: boolean;
  message: string;
  userId?: number;
  userName?: string;
  email?: string;
  role?: 'USER' | 'ADMIN';
  createdAt?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// ==================== PROTECTED ROUTE COMPONENT ====================

function ProtectedRoute({ children, requiredRole = 'USER' }) {
  const userRole = AuthService.getUserRole();
  const isLoggedIn = AuthService.isLoggedIn();

  if (!isLoggedIn) {
    return <Navigate to="/auth/login/user" replace />;
  }

  if (requiredRole === 'ADMIN' && userRole !== 'ADMIN') {
    return <Navigate to="/user-dashboard" replace />;
  }

  return children;
}

// Usage:
// <ProtectedRoute requiredRole="ADMIN">
//   <AdminDashboard />
// </ProtectedRoute>

// ==================== ROUTING SETUP ====================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth/register/user" element={<UserRegister />} />
        <Route path="/auth/login/user" element={<UserLogin />} />
        <Route path="/auth/register/admin" element={<AdminRegister />} />
        <Route path="/auth/login/admin" element={<AdminLogin />} />

        {/* Protected routes */}
        <Route 
          path="/user-dashboard" 
          element={
            <ProtectedRoute requiredRole="USER">
              <UserDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
