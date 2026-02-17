import { lazy } from 'react';

// Dynamic imports with chunk splitting for better performance
export const lazyLoad = (importFunc) => {
  return lazy(importFunc);
};

// Route-based code splitting
export const Home = lazyLoad(() => import('../pages/Home'));
export const Login = lazyLoad(() => import('../pages/Login'));
export const RegisterCompany = lazyLoad(() => import('../pages/RegisterCompany'));
export const RegisterEmployee = lazyLoad(() => import('../pages/RegisterEmployee'));
export const ForgotPassword = lazyLoad(() => import('../pages/ForgotPassword'));
export const ResetPassword = lazyLoad(() => import('../pages/ResetPassword'));
export const VerifyEmail = lazyLoad(() => import('../pages/VerifyEmail'));
export const NotFound = lazyLoad(() => import('../pages/NotFound'));

// Dashboard routes (lazy loaded)
export const CompanyDashboard = lazyLoad(() => import('../pages/CompanyDashboard'));
export const EmployeeDashboard = lazyLoad(() => import('../pages/EmployeeDashboard'));
export const AdminDashboard = lazyLoad(() => import('../pages/AdminDashboard'));

// Feature routes (lazy loaded)
export const AddEmployee = lazyLoad(() => import('../pages/AddEmployee'));
export const EmployeeSearch = lazyLoad(() => import('../pages/EmployeeSearch'));
export const EmployeeProfile = lazyLoad(() => import('../pages/EmployeeProfile'));
export const SubmitReview = lazyLoad(() => import('../pages/SubmitReview'));
export const ManageReviews = lazyLoad(() => import('../pages/ManageReviews'));
export const VerifyDocuments = lazyLoad(() => import('../pages/VerifyDocuments'));
export const ReputationReport = lazyLoad(() => import('../pages/ReputationReport'));
export const Checkout = lazyLoad(() => import('../pages/Checkout'));
export const UpdateProfile = lazyLoad(() => import('../pages/UpdateProfile'));
export const CompanyUploadDocuments = lazyLoad(() => import('../pages/CompanyUploadDocuments'));
export const AdminModerateReviews = lazyLoad(() => import('../pages/AdminModerateReviews'));

// Static pages (lazy loaded)
export const Terms = lazyLoad(() => import('../pages/Terms'));
export const Privacy = lazyLoad(() => import('../pages/Privacy'));
export const ConsentForm = lazyLoad(() => import('../pages/ConsentForm'));
export const RefundPolicy = lazyLoad(() => import('../pages/RefundPolicy'));
export const Disclaimer = lazyLoad(() => import('../pages/Disclaimer'));
export const Blog = lazyLoad(() => import('../pages/Blog'));
export const BlogPost = lazyLoad(() => import('../pages/BlogPost'));

// Preload critical routes
export const preloadRoute = (routeComponent) => {
  return () => {
    const componentPromise = routeComponent();
    componentPromise.catch(() => {
      // Handle preloading errors silently
    });
    return componentPromise;
  };
};

// Preload dashboard routes when user is authenticated
export const preloadAuthenticatedRoutes = () => {
  if (localStorage.getItem('token')) {
    setTimeout(() => {
      preloadRoute(() => import('../pages/CompanyDashboard'))();
      preloadRoute(() => import('../pages/EmployeeDashboard'))();
      preloadRoute(() => import('../pages/AdminDashboard'))();
    }, 2000); // Preload after 2 seconds
  }
};
