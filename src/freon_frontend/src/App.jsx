import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ToastProvider from './components/ui/ToastProvider';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import FeedPage from './components/feed/FeedPage';
import CreatePostPage from './components/feed/CreatePostPage';
import UserPage from './components/users/UserPage';
import EditProfile from './components/users/EditProfile';
import UserPosts from './components/users/UserPosts';
import AllUsers from './components/users/AllUsers';
import ProfileView from './components/users/ProfileView';
import './styles/globals.css';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, hasProfile, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner message="Loading..." fullScreen={true} />;
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
    return <LoadingSpinner message="Loading..." fullScreen={true} />;
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
    return <LoadingSpinner message="Loading..." fullScreen={true} />;
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
    return <LoadingSpinner message="Loading..." fullScreen={true} />;
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
        
        <Route path="/create-post" element={
          <ProtectedRoute>
            <CreatePostPage />
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
        <div style={{ 
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background with animated gradient */}
                  <div className="app">
          {/* Minimal background overlay for subtle depth */}
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: '#ffffff',
            zIndex: -2
          }} />
          
          {/* Subtle accent elements for visual interest */}
          <div style={{
            position: 'fixed',
            top: '5%',
            right: '5%',
            width: '100px',
            height: '100px',
            background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.03) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(20px)',
            animation: 'subtleFloat 25s ease-in-out infinite',
            zIndex: -1
          }} />
          
          <div style={{
            position: 'fixed',
            bottom: '15%',
            left: '8%',
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, rgba(33, 33, 36, 0.02) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(15px)',
            animation: 'subtleFloat 20s ease-in-out infinite reverse',
            zIndex: -1
          }} />
          
          <AppLayout />
          <ToastProvider />
          
          {/* Minimal animations for subtle movement */}
          <style>{`
            @keyframes subtleFloat {
              0%, 100% { transform: translateY(0px) }
              50% { transform: translateY(-10px) }
            }
          `}</style>
        </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
