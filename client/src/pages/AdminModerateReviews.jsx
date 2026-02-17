import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { reviewAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { formatDateDDMMYYYY } from '../utils/helpers';

const AdminModerateReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await reviewAPI.getPending();
      if (res.data.success) setReviews(res.data.data);
    } catch (err) {
      toast.error('Could not load pending reviews.');
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (reviewId, action) => {
    const toastId = toast.loading(action === 'approve' ? 'Approving...' : 'Rejecting...');
    try {
      const res = await reviewAPI.moderate(reviewId, action);
      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setReviews(prev => prev.filter(r => r._id !== reviewId));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed.', { id: toastId });
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#fcfaf9] flex items-center justify-center">
        <p className="text-[#496279] font-black">You are not authorized to view this page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaf9] selection:bg-[#4c8051]/20 font-sans antialiased text-[#496279] overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      <Navbar scrolled={true} isAuthenticated={true} user={user} />

      <div className="container mx-auto px-4 sm:px-6 pt-32 pb-32 sm:pb-24 max-w-5xl">
        <div className="mb-12">
          <h1 className="text-4xl font-black tracking-tighter mb-2">Verify <span className="text-[#4c8051]">Reviews</span></h1>
          <p className="text-slate-400 text-sm">Approve or reject reviews before they appear on the website.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><i className="fas fa-circle-notch fa-spin text-4xl text-[#4c8051]"></i></div>
        ) : reviews.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-[3rem] p-16 text-center">
            <i className="fas fa-check-circle text-5xl text-[#4c8051] mb-4"></i>
            <p className="font-black text-[#496279]">No pending reviews. All clear!</p>
            <Link to="/dashboard/company" className="inline-block mt-6 text-[#4c8051] font-black text-sm">Back to Dashboard</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((r) => (
              <div key={r._id} className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <p className="font-black text-xl text-[#496279]">{r.employeeId?.firstName} {r.employeeId?.lastName}</p>
                    <p className="text-slate-400 text-xs mt-1">Company: {r.companyId?.companyName}</p>
                    <p className="text-slate-400 text-xs mt-1">Submitted: {formatDateDDMMYYYY(r.createdAt)}</p>
                    <p className="text-slate-500 text-sm mt-3 line-clamp-2">{r.comment}</p>
                  </div>
                  <div className="flex gap-4 shrink-0">
                    <button
                      onClick={() => handleModerate(r._id, 'approve')}
                      className="px-6 py-3 bg-[#4c8051] text-white rounded-xl font-black text-xs uppercase tracking-wider hover:opacity-90"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleModerate(r._id, 'reject')}
                      className="px-6 py-3 bg-[#dd8d88] text-white rounded-xl font-black text-xs uppercase tracking-wider hover:opacity-90"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminModerateReviews;
