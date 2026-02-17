import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { validateIdParam } from '../middleware/validation.middleware.js';
import {
    getAdminStats,
    getAllReviews,
    getAllUsers,
    getAllCompanies,
    toggleUserStatus,
    getAuditLogs
} from '../controllers/admin.controller.js';

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, authorize('admin'));

// Dashboard stats
router.get('/stats', getAdminStats);

// Review management (all reviews with filter)
router.get('/reviews', getAllReviews);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/toggle-status', validateIdParam('id'), toggleUserStatus);

// Company management
router.get('/companies', getAllCompanies);

// Audit logs
router.get('/audit-logs', getAuditLogs);

export default router;
