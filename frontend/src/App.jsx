import { BrowserRouter, Navigate, Route, Routes, Outlet, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Landing from './pages/Landing';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

function Layout() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-zinc-100 lg:flex-row flex-col">
      {/* Sidebar - hidden on mobile */}
      <aside className="lg:w-64 lg:flex-shrink-0 hidden lg:block border-r border-slate-100">
        <Sidebar />
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
        
        {/* Mobile Bottom Nav */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-100">
          <MobileNav />
        </div>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen bg-slate-50"><div className="glass-card p-12 text-xl font-[Geist]">Loading...</div></div>;
  return (
    <Routes>
      <Route path="/" element={!user ? <Landing /> : <Navigate to="/dashboard" replace />} />
      <Route path="/landing" element={!user ? <Landing /> : <Navigate to="/dashboard" replace />} />
      
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
      </Route>
      
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function MobileNav() {
  return (
    <nav className="flex justify-around py-2 px-4">
      <Link to="/dashboard" className="flex flex-col items-center text-slate-600 hover:text-indigo-600 p-2 rounded-xl hover:bg-slate-100 transition-all">
        <span className="text-xl">🏠</span>
        <span className="text-xs font-[Inter]">Home</span>
      </Link>
      <Link to="/profile" className="flex flex-col items-center text-slate-600 hover:text-indigo-600 p-2 rounded-xl hover:bg-slate-100 transition-all">
        <span className="text-xl">👤</span>
        <span className="text-xs font-[Inter]">Profile</span>
      </Link>
    </nav>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
