import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import toast from 'react-hot-toast';
import { reviewAPI } from '../utils/api';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await reviewAPI.getCompanyReviews();
      if (res.data.success) {
        setReviews(res.data.data);
      }
    } catch (err) {
      toast.error("Could not load reviews.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) return;

    const toastId = toast.loading("Deleting Review...");
    try {
      const res = await reviewAPI.delete(id);
      if (res.data.success) {
        toast.success("Review deleted successfully.", { id: toastId });
        setReviews(prev => prev.filter(r => r._id !== id));
      }
    } catch (err) {
      toast.error("Error deleting review. Please try again.", { id: toastId });
    }
  };

  const processedReviews = useMemo(() => {
    let filtered = reviews.filter(r =>
      `${r.employeeId?.firstName} ${r.employeeId?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortBy === 'latest') filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === 'highest') filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    if (sortBy === 'lowest') filtered.sort((a, b) => (a.averageRating || 0) - (b.averageRating || 0));

    return filtered;
  }, [reviews, searchTerm, sortBy]);

  return (
    <div className="min-h-screen bg-[#fcfaf9] selection:bg-[#4c8051]/20 font-sans antialiased text-[#496279] uppercase overflow-x-hidden">
      {/* Background Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <Navbar scrolled={true} isAuthenticated={true} />

      <div className="container mx-auto px-6 pt-32 pb-24 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <Breadcrumb />
          <Link to="/dashboard/company" className="group flex items-center gap-4 text-[10px] font-black tracking-[0.3em] text-slate-400 hover:text-[#496279] transition-all">
            <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
            Back to Dashboard
          </Link>
        </div>

        {/* HEADER SECTION */}
        <div className="relative mb-20 flex flex-col md:flex-row justify-between items-end gap-12">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-[#4c8051] opacity-[0.03] rounded-full blur-[100px]"></div>
          <div className="relative z-10 flex-1">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white border border-slate-100 rounded-2xl text-[10px] font-black tracking-[0.3em] mb-8 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#4c8051] animate-pulse"></span>
              Live History
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-6">
              Review <span className="text-[#4c8051]">History.</span>
            </h1>
            <p className="text-slate-400 font-bold text-xs tracking-[0.4em] max-w-lg leading-relaxed">
              Manage and view all employee reviews you have submitted to the network.
            </p>
          </div>
          <div className="relative z-10 hidden md:block">
            <Link to="/review/submit" className="group bg-[#496279] text-white px-12 py-6 rounded-[2.5rem] font-black text-[11px] tracking-[0.4em] shadow-2xl hover:bg-[#4c8051] transition-all relative overflow-hidden flex items-center gap-4">
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <span className="relative z-10">Rate Employee</span>
              <i className="fas fa-plus relative z-10 text-[10px]"></i>
            </Link>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="bg-white border border-slate-100 p-8 rounded-[3rem] shadow-sm mb-12 flex flex-col md:flex-row items-center justify-between gap-8 animate-in fade-in duration-700">
          <div className="flex flex-1 items-center gap-6 w-full">
            <div className="flex-1 max-w-md flex items-center gap-4 bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl focus-within:border-[#4c8051] transition-all">
              <i className="fas fa-search text-slate-300"></i>
              <input
                type="text"
                placeholder="SEARCH EMPLOYEES..."
                className="bg-transparent outline-none w-full font-black text-[10px] tracking-widest placeholder:text-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl font-black text-[9px] tracking-widest outline-none focus:border-[#4c8051]"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="latest">Recent Reviews</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
          </div>
          <div className="text-[9px] font-black text-slate-300 tracking-[0.3em]">
            {processedReviews.length} Reviews Found
          </div>
        </div>

        {/* LEDGER FEED */}
        <div className="space-y-8 min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-8 opacity-40">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-slate-100 rounded-full"></div>
                <div className="absolute inset-0 border-t-4 border-[#4c8051] rounded-full animate-spin"></div>
              </div>
              <p className="text-[10px] font-black tracking-[0.5em] animate-pulse">Loading reviews...</p>
            </div>
          ) : processedReviews.length > 0 ? (
            processedReviews.map((r, i) => (
              <div key={r._id} className="group bg-white border border-slate-100 p-10 md:p-14 rounded-[4rem] hover:shadow-2xl hover:border-[#4c8051]/20 transition-all duration-700 flex flex-col lg:flex-row gap-12 items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#496279] opacity-[0.01] rounded-full blur-[80px] group-hover:opacity-[0.05] transition-all"></div>

                {/* Subject Info */}
                <div className="flex items-center gap-10 w-full lg:w-auto">
                  <div className="relative">
                    <div className="h-24 w-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-3xl font-black text-[#496279] border border-slate-100 shadow-inner group-hover:bg-[#496279] group-hover:text-white transition-all duration-500">
                      {r.employeeId?.firstName?.charAt(0)}
                    </div>
                    <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-[#4c8051] rounded-xl shadow-lg flex items-center justify-center text-white text-[10px]">
                      <i className="fas fa-check"></i>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black tracking-tighter leading-none mb-3 group-hover:text-[#4c8051] transition-colors">{r.employeeId?.firstName} {r.employeeId?.lastName}</h3>
                    <div className="flex items-center gap-4 opacity-40">
                      <span className="text-[9px] font-black tracking-widest">{r.employmentDetails?.designation || 'ENTRY'}</span>
                      <span className="h-1 w-1 bg-slate-400 rounded-full"></span>
                      <span className="text-[9px] font-black tracking-widest">{new Date(r.createdAt).toLocaleDateString('en-GB')}</span>
                    </div>
                  </div>
                </div>

                {/* Testimony Summary */}
                <div className="flex-1 w-full lg:w-auto p-10 bg-slate-50 border border-slate-100 rounded-[2.5rem] relative overflow-hidden shadow-inner">
                  <i className="fas fa-quote-left absolute top-4 left-4 text-slate-100 text-4xl"></i>
                  <p className="text-[11px] font-bold text-slate-400 leading-relaxed italic tracking-tight line-clamp-3 uppercase">
                    {r.comment}
                  </p>
                </div>

                {/* Performance Actions */}
                <div className="flex items-center gap-12 w-full lg:w-auto justify-between lg:justify-end">
                  <div className="text-right">
                    <p className="text-[9px] font-black text-slate-300 tracking-[0.4em] mb-2 uppercase">Overall Rating</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black tracking-tighter text-[#496279] group-hover:text-[#4c8051] transition-colors">{Math.round(r.averageRating * 10) / 10}</span>
                      <span className="text-base font-black opacity-20">/10</span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="h-14 w-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-[#dd8d88] hover:bg-[#dd8d88] hover:text-white transition-all shadow-sm hover:shadow-lg"
                    >
                      <i className="fas fa-trash-alt text-xs"></i>
                    </button>
                    <Link
                      to={`/review/edit/${r._id}`}
                      className="h-14 w-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-[#496279] hover:bg-[#496279] hover:text-white transition-all shadow-sm hover:shadow-lg"
                    >
                      <i className="fas fa-edit text-xs"></i>
                    </Link>
                    <Link
                      to={`/employee/${r.employeeId?._id}`}
                      className="px-8 py-5 bg-[#496279] text-white rounded-2xl font-black text-[9px] tracking-widest hover:bg-[#4c8051] shadow-lg hover:shadow-2xl transition-all"
                    >
                      VIEW PROFILE
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[5rem] border-2 border-dashed border-slate-100 text-center animate-in fade-in duration-1000">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-8 opacity-30">
                <i className="fas fa-scroll text-2xl"></i>
              </div>
              <h3 className="text-xl font-black tracking-tighter mb-4 opacity-50">No Reviews.</h3>
              <p className="text-[10px] font-black text-slate-400 tracking-[0.3em] max-w-xs leading-relaxed">
                You haven't submitted any employee reviews yet.
              </p>
              <Link to="/review/submit" className="mt-10 px-10 py-5 bg-[#496279] text-white rounded-2xl font-black text-[10px] tracking-widest hover:bg-[#4c8051] transition-all">
                Submit First Review
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-bottom { from { transform: translateY(2rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        
        .animate-in {
          animation-duration: 0.8s;
          animation-fill-mode: both;
          animation-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-8 { animation-name: slide-in-bottom; }
      `}} />
    </div>
  );
};

export default ManageReviews;