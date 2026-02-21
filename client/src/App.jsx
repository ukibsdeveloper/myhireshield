import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './context/AuthContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import SkipLink from './components/SkipLink';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';

// Eager-load critical above-the-fold pages
import Home from './pages/Home';
import Login from './pages/Login';
import RegisterCompany from './pages/RegisterCompany';
// RegisterEmployee removed — employees are created by companies, not self-registered
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import NotFound from './pages/NotFound';

// Lazy-load dashboards, review flows, and document-heavy pages
const CompanyDashboard = lazy(() => import('./pages/CompanyDashboard'));
const EmployeeDashboard = lazy(() => import('./pages/EmployeeDashboard'));
const AddEmployee = lazy(() => import('./pages/AddEmployee'));
const EmployeeSearch = lazy(() => import('./pages/EmployeeSearch'));
const EmployeeProfile = lazy(() => import('./pages/EmployeeProfile'));
const SubmitReview = lazy(() => import('./pages/SubmitReview'));
const ManageReviews = lazy(() => import('./pages/ManageReviews'));
const VerifyDocuments = lazy(() => import('./pages/VerifyDocuments'));
const ReputationReport = lazy(() => import('./pages/ReputationReport'));
const Checkout = lazy(() => import('./pages/Checkout'));
const UpdateProfile = lazy(() => import('./pages/UpdateProfile'));
const CompanyUploadDocuments = lazy(() => import('./pages/CompanyUploadDocuments'));
const AdminModerateReviews = lazy(() => import('./pages/AdminModerateReviews'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const ConsentForm = lazy(() => import('./pages/ConsentForm'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));

/* CONFIGURATION */
const isLocalhost = window.location.hostname === 'localhost';
axios.defaults.baseURL = isLocalhost ? 'http://localhost:5000' : 'https://myhireshield.com';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#fcfaf9]" aria-label="Loading">
    <div className="text-center">
      <i className="fas fa-shield-halved fa-spin text-4xl text-[#496279] mb-4" aria-hidden />
      <p className="text-[#496279] font-black uppercase tracking-widest text-xs">Loading...</p>
    </div>
  </div>
);

/* GUARDS */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    const fallback = user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'company' ? '/dashboard/company' : '/dashboard/employee';
    return <Navigate to={fallback} replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated) {
    const to = user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'company' ? '/dashboard/company' : '/dashboard/employee';
    return <Navigate to={to} replace />;
  }
  return children;
};

function App() {
  return (
    <AccessibilityProvider>
      <div className="App">
        <SkipLink />
        <ScrollToTop />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4c8051',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#dd8d88',
                secondary: '#fff',
              },
            },
          }}
        />
        <main id="main-content" tabIndex={-1} role="main">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register/company" element={<PublicRoute><RegisterCompany /></PublicRoute>} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/verify-email/:token" element={<VerifyEmail />} />

              {/* Company Routes */}
              <Route path="/company/upload-documents" element={<ProtectedRoute allowedRoles={['company']}><CompanyUploadDocuments /></ProtectedRoute>} />
              <Route path="/dashboard/company" element={<ProtectedRoute allowedRoles={['company']}><CompanyDashboard /></ProtectedRoute>} />
              <Route path="/employee/add" element={<ProtectedRoute allowedRoles={['company']}><AddEmployee /></ProtectedRoute>} />
              <Route path="/review/submit" element={<ProtectedRoute allowedRoles={['company']}><SubmitReview /></ProtectedRoute>} />
              <Route path="/review/edit/:id" element={<ProtectedRoute allowedRoles={['company']}><SubmitReview /></ProtectedRoute>} />
              <Route path="/review/manage" element={<ProtectedRoute allowedRoles={['company']}><ManageReviews /></ProtectedRoute>} />
              <Route path="/verify/documents" element={<ProtectedRoute allowedRoles={['company']}><VerifyDocuments /></ProtectedRoute>} />
              <Route path="/employee/search" element={<ProtectedRoute allowedRoles={['company']}><EmployeeSearch /></ProtectedRoute>} />

              {/* Employee Routes */}
              <Route path="/dashboard/employee" element={<ProtectedRoute allowedRoles={['employee']}><EmployeeDashboard /></ProtectedRoute>} />
              <Route path="/reputation-report" element={<ProtectedRoute allowedRoles={['employee']}><ReputationReport /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute allowedRoles={['employee']}><Checkout /></ProtectedRoute>} />
              <Route path="/employee/profile" element={<ProtectedRoute allowedRoles={['employee']}><EmployeeProfile /></ProtectedRoute>} />

              {/* Admin */}
              <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/verify-reviews" element={<ProtectedRoute allowedRoles={['admin']}><AdminModerateReviews /></ProtectedRoute>} />

              {/* Shared Routes */}
              <Route path="/employee/:id" element={<ProtectedRoute><EmployeeProfile /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />

              {/* Public static & blog */}
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/consent" element={<ConsentForm />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </AccessibilityProvider>
  );
}

function AppWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

export default AppWithErrorBoundary;
