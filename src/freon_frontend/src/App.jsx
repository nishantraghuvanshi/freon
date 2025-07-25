import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import LoadingSpinner from './components/common/LoadingSpinner';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import FeedPage from './components/feed/FeedPage';
import UserPage from './components/users/UserPage';
import EditProfile from './components/users/EditProfile';
import UserPosts from './components/users/UserPosts';
import AllUsers from './components/users/AllUsers';
import ProfileView from './components/users/ProfileView';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, hasProfile, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!hasProfile) {
    return <Navigate to="/register" replace />;
  }
  
  return children;
}

// Login Route Component (for login page only)
function LoginRoute({ children }) {
  const { isAuthenticated, hasProfile, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }
  
  if (isAuthenticated && hasProfile) {
    return <Navigate to="/feed" replace />;
  }
  
  if (isAuthenticated && !hasProfile) {
    return <Navigate to="/register" replace />;
  }
  
  return children;
}

// Home Route Component (smart redirect based on auth state)
function HomeRoute() {
  const { isAuthenticated, hasProfile, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!hasProfile) {
    return <Navigate to="/register" replace />;
  }
  
  return <Navigate to="/feed" replace />;
}

// Registration Route Component (only for authenticated users without profile)
function RegisterRoute({ children }) {
  const { isAuthenticated, hasProfile, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (hasProfile) {
    return <Navigate to="/feed" replace />;
  }
  
  return children;
}

// Main App Layout
function AppLayout() {
  const { isAuthenticated, hasProfile } = useAuth();
  
  return (
    <>
      {isAuthenticated && hasProfile && <Navbar />}
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={
          <LoginRoute>
            <LoginPage />
          </LoginRoute>
        } />
        
        <Route path="/register" element={
          <RegisterRoute>
            <RegisterPage />
          </RegisterRoute>
        } />
        
        {/* Protected Routes */}
        <Route path="/feed" element={
          <ProtectedRoute>
            <FeedPage />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        }>
          {/* Nested routes for user management */}
          <Route path="edit" element={<EditProfile />} />
          <Route path="posts" element={<UserPosts />} />
          <Route path="users" element={<AllUsers />} />
          <Route path="user/:userId" element={<ProfileView />} />
        </Route>
        
        {/* Default redirect */}
        <Route path="/" element={<HomeRoute />} />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<HomeRoute />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
          <AppLayout />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
