import User from '../models/User.model.js';
import Company from '../models/Company.model.js';
import Employee from '../models/Employee.model.js';
import Review from '../models/Review.model.js';
import Document from '../models/Document.model.js';
import AuditLog from '../models/AuditLog.model.js';
import { safeError } from '../middleware/security.middleware.js';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Admin only
export const getAdminStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalCompanies,
            totalEmployees,
            totalReviews,
            pendingReviews,
            approvedReviews,
            rejectedReviews,
            totalDocuments,
            pendingDocuments,
            recentUsers
        ] = await Promise.all([
            User.countDocuments({ isActive: { $ne: false } }),
            Company.countDocuments(),
            Employee.countDocuments(),
            Review.countDocuments({ isActive: true }),
            Review.countDocuments({ isActive: true, moderationStatus: 'pending' }),
            Review.countDocuments({ isActive: true, moderationStatus: 'approved' }),
            Review.countDocuments({ isActive: true, moderationStatus: 'rejected' }),
            Document.countDocuments(),
            Document.countDocuments({ verificationStatus: 'pending' }),
            User.find({ isActive: { $ne: false } })
                .sort({ createdAt: -1 })
                .limit(5)
                .select('firstName lastName email role createdAt')
        ]);

        // Reviews over last 7 days for chart
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const reviewsTrend = await Review.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo }, isActive: true } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalCompanies,
                totalEmployees,
                totalReviews,
                pendingReviews,
                approvedReviews,
                rejectedReviews,
                totalDocuments,
                pendingDocuments,
                recentUsers,
                reviewsTrend
            }
        });
    } catch (error) {
        console.error('Admin Stats Error:', error);
        res.status(500).json({ success: false, message: safeError(error, 'Failed to fetch admin stats') });
    }
};

// @desc    Get all reviews with filters (Admin)
// @route   GET /api/admin/reviews
// @access  Admin only
export const getAllReviews = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const query = { isActive: true };
        if (status && ['pending', 'approved', 'rejected'].includes(status)) {
            query.moderationStatus = status;
        }

        const total = await Review.countDocuments(query);
        const reviews = await Review.find(query)
            .populate('employeeId', 'firstName lastName email currentDesignation')
            .populate('companyId', 'companyName')
            .populate('verifiedBy', 'firstName lastName')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            count: reviews.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: reviews
        });
    } catch (error) {
        console.error('Admin getAllReviews Error:', error);
        res.status(500).json({ success: false, message: safeError(error, 'Failed to fetch reviews') });
    }
};

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
// @access  Admin only
export const getAllUsers = async (req, res) => {
    try {
        const { role, page = 1, limit = 20, search } = req.query;
        const query = {};
        if (role && ['company', 'employee', 'admin'].includes(role)) {
            query.role = role;
        }
        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .select('-password -twoFactorSecret')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            count: users.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: users
        });
    } catch (error) {
        console.error('Admin getAllUsers Error:', error);
        res.status(500).json({ success: false, message: safeError(error, 'Failed to fetch users') });
    }
};

// @desc    Get all companies (Admin)
// @route   GET /api/admin/companies
// @access  Admin only
export const getAllCompanies = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const total = await Company.countDocuments();
        const companies = await Company.find()
            .populate('userId', 'firstName lastName email isActive')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            count: companies.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: companies
        });
    } catch (error) {
        res.status(500).json({ success: false, message: safeError(error, 'Failed to fetch companies') });
    }
};

// @desc    Toggle user active/suspended status (Admin)
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Admin only
export const toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        if (user.role === 'admin') {
            return res.status(403).json({ success: false, message: 'Cannot modify admin accounts' });
        }

        user.isSuspended = !user.isSuspended;
        await user.save();

        // Log the action
        await AuditLog.createLog({
            userId: req.user._id,
            userEmail: req.user.email,
            userRole: req.user.role,
            eventType: user.isSuspended ? 'account_suspended' : 'account_activated',
            eventData: { targetId: user._id, targetEmail: user.email },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            status: 'success'
        });

        res.status(200).json({
            success: true,
            message: user.isSuspended ? 'User suspended successfully' : 'User activated successfully',
            data: { isSuspended: user.isSuspended }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: safeError(error, 'Failed to update user status') });
    }
};

// @desc    Get audit logs (Admin)
// @route   GET /api/admin/audit-logs
// @access  Admin only
export const getAuditLogs = async (req, res) => {
    try {
        const { page = 1, limit = 30 } = req.query;
        const total = await AuditLog.countDocuments();
        const logs = await AuditLog.find()
            .populate('userId', 'firstName lastName email role')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            count: logs.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: logs
        });
    } catch (error) {
        res.status(500).json({ success: false, message: safeError(error, 'Failed to fetch audit logs') });
    }
};
