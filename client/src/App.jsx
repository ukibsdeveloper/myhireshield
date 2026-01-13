import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import RegisterCompany from './pages/RegisterCompany';
import RegisterEmployee from './pages/RegisterEmployee';
import CompanyDashboard from './pages/CompanyDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeSearch from './pages/EmployeeSearch';
import EmployeeProfile from './pages/EmployeeProfile';
import SubmitReview from './pages/SubmitReview';
import ManageReviews from './pages/ManageReviews';
import VerifyDocuments from './pages/VerifyDocuments';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import ConsentForm from './pages/ConsentForm';
import RefundPolicy from './pages/RefundPolicy';
import Disclaimer from './pages/Disclaimer';
import ReputationReport from './pages/ReputationReport';
import Checkout from './pages/Checkout';
import UpdateProfile from './pages/UpdateProfile';
import CompanyUploadDocuments from './pages/CompanyUploadDocuments';

/* CONFIGURATION */
const isLocalhost = window.location.hostname === 'localhost';
axios.defaults.baseURL = isLocalhost ? 'http://localhost:5000' : 'https://myhireshield.com';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* GUARDS */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfaf9]">
      <div className="text-center">
        <i className="fas fa-shield-halved fa-spin text-4xl text-[#496279] mb-4"></i>
        <p className="text-[#496279] font-black uppercase tracking-widest text-[10px]">Validating Access...</p>
      </div>
    </div>
  );
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={user?.role === 'company' ? '/dashboard/company' : '/dashboard/employee'} replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={user?.role === 'company' ? "/dashboard/company" : "/dashboard/employee"} replace />;
  }
  return children;
};

function App() {
  return (
    <div className="App">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register/company" element={<PublicRoute><RegisterCompany /></PublicRoute>} />
        <Route path="/register/employee" element={<PublicRoute><RegisterEmployee /></PublicRoute>} />

        {/* Company Routes */}
        <Route path="/company/upload-documents" element={<ProtectedRoute allowedRoles={['company']}><CompanyUploadDocuments /></ProtectedRoute>} />
        <Route path="/dashboard/company" element={<ProtectedRoute allowedRoles={['company']}><CompanyDashboard /></ProtectedRoute>} />
        <Route path="/review/submit" element={<ProtectedRoute allowedRoles={['company']}><SubmitReview /></ProtectedRoute>} />
        <Route path="/review/manage" element={<ProtectedRoute allowedRoles={['company']}><ManageReviews /></ProtectedRoute>} />
        <Route path="/verify/documents" element={<ProtectedRoute allowedRoles={['company']}><VerifyDocuments /></ProtectedRoute>} />
        <Route path="/employee/search" element={<ProtectedRoute allowedRoles={['company']}><EmployeeSearch /></ProtectedRoute>} />

        {/* Employee Routes */}
        <Route path="/dashboard/employee" element={<ProtectedRoute allowedRoles={['employee']}><EmployeeDashboard /></ProtectedRoute>} />
        <Route path="/reputation-report" element={<ProtectedRoute allowedRoles={['employee']}><ReputationReport /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute allowedRoles={['employee']}><Checkout /></ProtectedRoute>} />
        <Route path="/employee/profile" element={<ProtectedRoute allowedRoles={['employee']}><EmployeeProfile /></ProtectedRoute>} />

        {/* Shared Routes */}
        <Route path="/employee/:id" element={<ProtectedRoute><EmployeeProfile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/consent" element={<ConsentForm />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/disclaimer" element={<Disclaimer />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;