import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageMeta from '../components/PageMeta';
import { adminAPI, reviewAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { formatDateDDMMYYYY, formatDateTime } from '../utils/helpers';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [users, setUsers] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewFilter, setReviewFilter] = useState('pending');
    const [userFilter, setUserFilter] = useState('');
    const [userSearch, setUserSearch] = useState('');
    const [reviewPage, setReviewPage] = useState(1);
    const [userPage, setUserPage] = useState(1);
    const [reviewMeta, setReviewMeta] = useState({});
    const [userMeta, setUserMeta] = useState({});
    const [expandedReview, setExpandedReview] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        if (activeTab === 'reviews') fetchReviews();
        if (activeTab === 'users') fetchUsers();
        if (activeTab === 'audit') fetchAuditLogs();
    }, [activeTab, reviewFilter, reviewPage, userFilter, userPage, userSearch]);

    const fetchStats = async () => {
        try {
            const res = await adminAPI.getStats();
            if (res.data.success) setStats(res.data.data);
        } catch (err) {
            toast.error('Failed to load dashboard stats');
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const res = await adminAPI.getReviews({ status: reviewFilter, page: reviewPage, limit: 10 });
            if (res.data.success) {
                setReviews(res.data.data);
                setReviewMeta({ total: res.data.total, totalPages: res.data.totalPages, currentPage: res.data.currentPage });
            }
        } catch (err) {
            toast.error('Failed to load reviews');
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await adminAPI.getUsers({ role: userFilter, page: userPage, limit: 15, search: userSearch });
            if (res.data.success) {
                setUsers(res.data.data);
                setUserMeta({ total: res.data.total, totalPages: res.data.totalPages, currentPage: res.data.currentPage });
            }
        } catch (err) {
            toast.error('Failed to load users');
        }
    };

    const fetchAuditLogs = async () => {
        try {
            const res = await adminAPI.getAuditLogs({ page: 1, limit: 30 });
            if (res.data.success) setAuditLogs(res.data.data);
        } catch (err) {
            toast.error('Failed to load audit logs');
        }
    };

    const handleModerate = async (reviewId, action) => {
        const toastId = toast.loading(action === 'approve' ? 'Approving...' : 'Rejecting...');
        try {
            const res = await reviewAPI.moderate(reviewId, action);
            if (res.data.success) {
                toast.success(res.data.message, { id: toastId });
                fetchReviews();
                fetchStats();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Action failed', { id: toastId });
        }
    };

    const handleToggleUser = async (userId) => {
        try {
            const res = await adminAPI.toggleUserStatus(userId);
            if (res.data.success) {
                toast.success(res.data.message);
                fetchUsers();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update user');
        }
    };

    if (user?.role !== 'admin') {
        return (
            <div className="min-h-screen bg-[#fcfaf9] flex items-center justify-center">
                <p className="text-[#496279] font-black text-xl">Access Denied — Admin Only</p>
            </div>
        );
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: 'fas fa-chart-pie' },
        { id: 'reviews', label: 'Reviews', icon: 'fas fa-star' },
        { id: 'users', label: 'Users', icon: 'fas fa-users' },
        { id: 'audit', label: 'Audit Logs', icon: 'fas fa-history' },
    ];

    const statCards = stats ? [
        { label: 'Total Users', value: stats.totalUsers, icon: 'fas fa-users', color: '#496279' },
        { label: 'Companies', value: stats.totalCompanies, icon: 'fas fa-building', color: '#4c8051' },
        { label: 'Employees', value: stats.totalEmployees, icon: 'fas fa-user-tie', color: '#dd8d88' },
        { label: 'Total Reviews', value: stats.totalReviews, icon: 'fas fa-star', color: '#496279' },
        { label: 'Pending Reviews', value: stats.pendingReviews, icon: 'fas fa-clock', color: '#e6a23c' },
        { label: 'Approved', value: stats.approvedReviews, icon: 'fas fa-check-circle', color: '#4c8051' },
        { label: 'Rejected', value: stats.rejectedReviews, icon: 'fas fa-times-circle', color: '#dd8d88' },
        { label: 'Documents', value: stats.totalDocuments, icon: 'fas fa-file-alt', color: '#496279' },
    ] : [];

    const getStatusBadge = (status) => {
        const map = {
            pending: 'bg-amber-100 text-amber-700 border-amber-200',
            approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            rejected: 'bg-rose-100 text-rose-700 border-rose-200',
        };
        return map[status] || 'bg-slate-100 text-slate-500';
    };

    const getRatingColor = (avg) => {
        if (avg >= 7) return 'text-emerald-600';
        if (avg >= 5) return 'text-amber-600';
        return 'text-rose-600';
    };

    return (
        <div className="min-h-screen bg-[#fcfaf9] selection:bg-[#4c8051]/20 font-sans antialiased text-[#496279] overflow-x-hidden">
            <PageMeta title="Admin Dashboard — HireShield" noIndex />
            <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            <Navbar scrolled={true} isAuthenticated={true} user={user} />

            <div className="container mx-auto px-3 sm:px-4 md:px-6 pt-24 sm:pt-28 pb-32 sm:pb-32 sm:pb-24 max-w-7xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div>
                        <p className="text-xs font-black tracking-[0.4em] text-[#dd8d88] uppercase mb-2">Admin Control Center</p>
                        <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tighter">
                            Dashboard <span className="text-[#4c8051]">Panel</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-xs font-black text-emerald-700 tracking-wider">System Active</span>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 mb-8 sm:mb-10 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-hide snap-x snap-mandatory">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 sm:gap-2.5 px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs font-black tracking-widest uppercase transition-all whitespace-nowrap snap-start ${activeTab === tab.id
                                ? 'bg-[#496279] text-white shadow-lg shadow-[#496279]/20'
                                : 'bg-white border border-slate-100 text-slate-400 hover:text-[#496279] hover:border-slate-200'
                                }`}
                        >
                            <i className={tab.icon}></i>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* =================== OVERVIEW TAB =================== */}
                {activeTab === 'overview' && (
                    <div className="animate-in fade-in duration-500">
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <i className="fas fa-circle-notch fa-spin text-4xl text-[#4c8051]"></i>
                            </div>
                        ) : (
                            <>
                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
                                    {statCards.map((card, i) => (
                                        <div key={i} className="bg-white border border-slate-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all group">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: card.color }}>
                                                    <i className={`${card.icon} text-lg`}></i>
                                                </div>
                                                <i className="fas fa-arrow-trend-up text-xs text-slate-300 group-hover:text-[#4c8051] transition-colors"></i>
                                            </div>
                                            <p className="text-2xl sm:text-3xl font-black tracking-tight mb-1">{card.value}</p>
                                            <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">{card.label}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Quick Actions + Recent Users */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Quick Actions */}
                                    <div className="bg-white border border-slate-100 rounded-xl sm:rounded-2xl p-5 sm:p-8">
                                        <h3 className="text-lg font-black tracking-tight mb-6">Quick Actions</h3>
                                        <div className="space-y-3">
                                            {[
                                                { label: 'Moderate Pending Reviews', icon: 'fas fa-gavel', count: stats?.pendingReviews, action: () => { setActiveTab('reviews'); setReviewFilter('pending'); }, color: '#e6a23c' },
                                                { label: 'Pending Documents', icon: 'fas fa-file-signature', count: stats?.pendingDocuments, action: () => { }, color: '#496279' },
                                                { label: 'Manage All Users', icon: 'fas fa-user-cog', count: stats?.totalUsers, action: () => setActiveTab('users'), color: '#4c8051' },
                                                { label: 'View Audit Trail', icon: 'fas fa-shield-halved', count: null, action: () => setActiveTab('audit'), color: '#dd8d88' },
                                            ].map((item, i) => (
                                                <button key={i} onClick={item.action} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: item.color }}>
                                                            <i className={item.icon}></i>
                                                        </div>
                                                        <span className="text-xs sm:text-sm font-black tracking-tight">{item.label}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        {item.count != null && (
                                                            <span className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-xs font-black">{item.count}</span>
                                                        )}
                                                        <i className="fas fa-chevron-right text-xs text-slate-300 group-hover:text-[#496279] transition-colors"></i>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Recent Users */}
                                    <div className="bg-white border border-slate-100 rounded-xl sm:rounded-2xl p-5 sm:p-8">
                                        <h3 className="text-lg font-black tracking-tight mb-6">Recent Registrations</h3>
                                        {stats?.recentUsers?.length ? (
                                            <div className="space-y-4">
                                                {stats.recentUsers.map((u, i) => (
                                                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-[#496279] text-white flex items-center justify-center font-black text-sm">
                                                                {u.firstName?.charAt(0)}{u.lastName?.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-black tracking-tight">{u.firstName} {u.lastName}</p>
                                                                <p className="text-xs text-slate-400 font-bold">{u.email}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-black tracking-wider uppercase ${u.role === 'company' ? 'bg-[#4c8051]/10 text-[#4c8051]' : u.role === 'admin' ? 'bg-[#dd8d88]/10 text-[#dd8d88]' : 'bg-[#496279]/10 text-[#496279]'
                                                                }`}>{u.role}</span>
                                                            <p className="text-xs text-slate-300 font-bold mt-1">{formatDateDDMMYYYY(u.createdAt)}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-slate-400 text-center py-8">No recent users</p>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* =================== REVIEWS TAB =================== */}
                {activeTab === 'reviews' && (
                    <div className="animate-in fade-in duration-500">
                        {/* Filter Tabs */}
                        <div className="flex flex-wrap gap-2 mb-8">
                            {['pending', 'approved', 'rejected'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => { setReviewFilter(f); setReviewPage(1); }}
                                    className={`px-5 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${reviewFilter === f
                                        ? f === 'pending' ? 'bg-amber-500 text-white' : f === 'approved' ? 'bg-emerald-600 text-white' : 'bg-rose-500 text-white'
                                        : 'bg-white border border-slate-100 text-slate-400 hover:text-[#496279]'
                                        }`}
                                >
                                    {f} {reviewFilter === f && reviewMeta.total != null && `(${reviewMeta.total})`}
                                </button>
                            ))}
                        </div>

                        {/* Reviews List */}
                        {reviews.length === 0 ? (
                            <div className="bg-white border border-slate-100 rounded-2xl p-16 text-center">
                                <i className="fas fa-inbox text-5xl text-slate-200 mb-4"></i>
                                <p className="font-black text-slate-400">No {reviewFilter} reviews found</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {reviews.map(r => {
                                    const avgRating = r.ratings ? (Object.values(r.ratings).reduce((a, b) => a + b, 0) / Object.keys(r.ratings).length).toFixed(1) : 'N/A';
                                    const isExpanded = expandedReview === r._id;
                                    return (
                                        <div key={r._id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-md transition-all">
                                            {/* Review Header */}
                                            <div className="p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
                                                <div className="flex items-start gap-4 flex-1">
                                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#496279] text-white flex items-center justify-center font-black shrink-0 text-sm">
                                                        {r.employeeId?.firstName?.charAt(0)}{r.employeeId?.lastName?.charAt(0)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-3 flex-wrap">
                                                            <p className="font-black text-base sm:text-lg tracking-tight">{r.employeeId?.firstName} {r.employeeId?.lastName}</p>
                                                            <span className={`px-3 py-1 rounded-lg text-xs font-black tracking-wider uppercase border ${getStatusBadge(r.moderationStatus)}`}>
                                                                {r.moderationStatus}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-slate-400 font-bold mt-1">
                                                            <i className="fas fa-building mr-1.5"></i>{r.companyId?.companyName}
                                                            <span className="mx-2">•</span>
                                                            <i className="fas fa-calendar mr-1.5"></i>{formatDateDDMMYYYY(r.createdAt)}
                                                            <span className="mx-2">•</span>
                                                            <span className={`font-black ${getRatingColor(avgRating)}`}>
                                                                <i className="fas fa-star mr-1"></i>{avgRating}/10
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                                                    <button
                                                        onClick={() => setExpandedReview(isExpanded ? null : r._id)}
                                                        className="px-4 py-2.5 bg-slate-50 border border-slate-100 text-slate-500 rounded-xl text-xs font-black tracking-wider hover:bg-white transition-all"
                                                    >
                                                        {isExpanded ? 'Collapse' : 'View Details'}
                                                    </button>
                                                    {r.moderationStatus === 'pending' && (
                                                        <>
                                                            <button onClick={() => handleModerate(r._id, 'approve')} className="px-4 sm:px-5 py-2.5 bg-[#4c8051] text-white rounded-xl text-xs font-black tracking-wider hover:opacity-90 transition-all flex-1 sm:flex-none">
                                                                <i className="fas fa-check mr-1.5"></i>Approve
                                                            </button>
                                                            <button onClick={() => handleModerate(r._id, 'reject')} className="px-4 sm:px-5 py-2.5 bg-[#dd8d88] text-white rounded-xl text-xs font-black tracking-wider hover:opacity-90 transition-all flex-1 sm:flex-none">
                                                                <i className="fas fa-times mr-1.5"></i>Reject
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Expanded Detail */}
                                            {isExpanded && (
                                                <div className="border-t border-slate-50 p-6 bg-slate-50/50 animate-in fade-in duration-300">
                                                    {/* Ratings Grid */}
                                                    <h4 className="text-xs font-black tracking-[0.3em] text-slate-400 uppercase mb-4">Rating Breakdown</h4>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                                                        {r.ratings && Object.entries(r.ratings).map(([key, val]) => (
                                                            <div key={key} className="bg-white p-3 rounded-xl border border-slate-100 text-center">
                                                                <p className="text-xs font-bold text-slate-400 capitalize mb-1">{key.replace(/([A-Z])/g, ' $1')}</p>
                                                                <p className={`text-xl font-black ${getRatingColor(val)}`}>{val}</p>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Employment Details */}
                                                    {r.employmentDetails && (
                                                        <>
                                                            <h4 className="text-xs font-black tracking-[0.3em] text-slate-400 uppercase mb-3">Employment Details</h4>
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                                                                <div className="bg-white p-3 rounded-xl border border-slate-100">
                                                                    <p className="text-xs text-slate-400 font-bold">Designation</p>
                                                                    <p className="font-black text-sm">{r.employmentDetails.designation}</p>
                                                                </div>
                                                                <div className="bg-white p-3 rounded-xl border border-slate-100">
                                                                    <p className="text-xs text-slate-400 font-bold">Type</p>
                                                                    <p className="font-black text-sm capitalize">{r.employmentDetails.employmentType}</p>
                                                                </div>
                                                                <div className="bg-white p-3 rounded-xl border border-slate-100">
                                                                    <p className="text-xs text-slate-400 font-bold">Start Date</p>
                                                                    <p className="font-black text-sm">{formatDateDDMMYYYY(r.employmentDetails.startDate)}</p>
                                                                </div>
                                                                <div className="bg-white p-3 rounded-xl border border-slate-100">
                                                                    <p className="text-xs text-slate-400 font-bold">End Date</p>
                                                                    <p className="font-black text-sm">{formatDateDDMMYYYY(r.employmentDetails.endDate)}</p>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}

                                                    {/* Comment */}
                                                    <h4 className="text-xs font-black tracking-[0.3em] text-slate-400 uppercase mb-3">Review Comment</h4>
                                                    <div className="bg-white p-4 rounded-xl border border-slate-100 mb-4">
                                                        <p className="text-sm text-slate-600 leading-relaxed">{r.comment}</p>
                                                    </div>

                                                    {/* Would Rehire */}
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs font-black text-slate-400 tracking-wider uppercase">Would Rehire:</span>
                                                        <span className={`px-3 py-1 rounded-lg text-xs font-black ${r.wouldRehire ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                            {r.wouldRehire ? 'Yes' : 'No'}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Pagination */}
                        {reviewMeta.totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-8">
                                {Array.from({ length: reviewMeta.totalPages }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setReviewPage(i + 1)}
                                        className={`w-10 h-10 rounded-xl text-xs font-black ${reviewPage === i + 1 ? 'bg-[#496279] text-white' : 'bg-white border border-slate-100 text-slate-400 hover:text-[#496279]'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* =================== USERS TAB =================== */}
                {activeTab === 'users' && (
                    <div className="animate-in fade-in duration-500">
                        {/* Filters */}
                        <div className="flex flex-col md:flex-row gap-3 mb-8">
                            <div className="flex flex-wrap gap-2">
                                {['', 'company', 'employee', 'admin'].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => { setUserFilter(f); setUserPage(1); }}
                                        className={`px-3 sm:px-5 py-2.5 rounded-xl text-xs font-black tracking-wider sm:tracking-widest uppercase transition-all ${userFilter === f ? 'bg-[#496279] text-white' : 'bg-white border border-slate-100 text-slate-400 hover:text-[#496279]'
                                            }`}
                                    >
                                        {f || 'All'}
                                    </button>
                                ))}
                            </div>
                            <div className="flex-1 max-w-md">
                                <div className="relative">
                                    <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
                                    <input
                                        type="text"
                                        placeholder="Search by name or email..."
                                        value={userSearch}
                                        onChange={e => { setUserSearch(e.target.value); setUserPage(1); }}
                                        className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-[#4c8051] transition-colors"
                                    />
                                </div>
                            </div>
                            {userMeta.total != null && (
                                <span className="self-center text-xs font-black text-slate-300 tracking-wider">{userMeta.total} Users Found</span>
                            )}
                        </div>

                        {/* Users Table */}
                        {users.length === 0 ? (
                            <div className="bg-white border border-slate-100 rounded-2xl p-16 text-center">
                                <i className="fas fa-user-slash text-5xl text-slate-200 mb-4"></i>
                                <p className="font-black text-slate-400">No users found</p>
                            </div>
                        ) : (
                            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[640px]">
                                        <thead>
                                            <tr className="border-b border-slate-50">
                                                <th className="text-left px-6 py-4 text-xs font-black text-slate-300 tracking-wider uppercase">User</th>
                                                <th className="text-left px-6 py-4 text-xs font-black text-slate-300 tracking-wider uppercase">Email</th>
                                                <th className="text-left px-6 py-4 text-xs font-black text-slate-300 tracking-wider uppercase">Role</th>
                                                <th className="text-left px-6 py-4 text-xs font-black text-slate-300 tracking-wider uppercase">Joined</th>
                                                <th className="text-left px-6 py-4 text-xs font-black text-slate-300 tracking-wider uppercase">Status</th>
                                                <th className="text-right px-6 py-4 text-xs font-black text-slate-300 tracking-wider uppercase">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map(u => (
                                                <tr key={u._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-xl bg-[#496279] text-white flex items-center justify-center font-black text-xs">
                                                                {u.firstName?.charAt(0)}{u.lastName?.charAt(0)}
                                                            </div>
                                                            <span className="font-black text-sm">{u.firstName} {u.lastName}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-500 font-bold">{u.email}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-black tracking-wider uppercase ${u.role === 'company' ? 'bg-[#4c8051]/10 text-[#4c8051]' : u.role === 'admin' ? 'bg-[#dd8d88]/10 text-[#dd8d88]' : 'bg-[#496279]/10 text-[#496279]'
                                                            }`}>{u.role}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-xs text-slate-400 font-bold">{formatDateDDMMYYYY(u.createdAt)}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${u.isSuspended ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                            {u.isSuspended ? 'Suspended' : 'Active'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        {u.role !== 'admin' && (
                                                            <button
                                                                onClick={() => handleToggleUser(u._id)}
                                                                className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider transition-all ${u.isSuspended
                                                                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                                                                    }`}
                                                            >
                                                                {u.isSuspended ? 'Activate' : 'Suspend'}
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Pagination */}
                        {userMeta.totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-8">
                                {Array.from({ length: userMeta.totalPages }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setUserPage(i + 1)}
                                        className={`w-10 h-10 rounded-xl text-xs font-black ${userPage === i + 1 ? 'bg-[#496279] text-white' : 'bg-white border border-slate-100 text-slate-400 hover:text-[#496279]'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* =================== AUDIT LOGS TAB =================== */}
                {activeTab === 'audit' && (
                    <div className="animate-in fade-in duration-500">
                        {auditLogs.length === 0 ? (
                            <div className="bg-white border border-slate-100 rounded-2xl p-16 text-center">
                                <i className="fas fa-shield-halved text-5xl text-slate-200 mb-4"></i>
                                <p className="font-black text-slate-400">No audit logs recorded yet</p>
                            </div>
                        ) : (
                            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
                                <div className="p-6 border-b border-slate-50">
                                    <h3 className="text-lg font-black tracking-tight">System Audit Trail</h3>
                                    <p className="text-xs text-slate-400 font-bold mt-1">All actions are recorded for security compliance</p>
                                </div>
                                <div className="divide-y divide-slate-50">
                                    {auditLogs.map((log, i) => (
                                        <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
                                            <div className="w-10 h-10 rounded-xl bg-[#496279]/10 flex items-center justify-center shrink-0">
                                                <i className={`fas ${log.action?.includes('LOGIN') ? 'fa-sign-in-alt' :
                                                    log.action?.includes('REVIEW') ? 'fa-star' :
                                                        log.action?.includes('USER') ? 'fa-user' :
                                                            log.action?.includes('DOCUMENT') ? 'fa-file' :
                                                                'fa-bolt'
                                                    } text-[#496279] text-sm`}></i>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-black tracking-tight">{log.action?.replace(/_/g, ' ')}</p>
                                                <p className="text-xs text-slate-400 font-bold truncate">
                                                    {log.userId?.firstName} {log.userId?.lastName} ({log.userId?.role})
                                                    {log.ipAddress && <span className="ml-2">• IP: {log.ipAddress}</span>}
                                                </p>
                                            </div>
                                            <span className="text-xs text-slate-300 font-bold whitespace-nowrap">{formatDateTime(log.createdAt)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default AdminDashboard;
