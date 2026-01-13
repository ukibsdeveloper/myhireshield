import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Note: App.jsx handles base URL logic via axios defaults
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/reviews/company', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) setReviews(res.data.data);
      } catch (err) {
        console.error("Ledger fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfaf9] selection:bg-[#dd8d88]/30">
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <Navbar scrolled={true} isAuthenticated={true} />

      <div className="container mx-auto px-6 pt-32 pb-20 max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <Breadcrumb />
          <Link to="/dashboard/company" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#4c8051] transition-all">
            <i className="fas fa-arrow-left"></i>
            Back to Dashboard
          </Link>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 animate-on-scroll">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#496279]/10 rounded-lg text-[#496279] text-[10px] font-black uppercase tracking-widest mb-4 border border-[#496279]/10">
              <i className="fas fa-database"></i> Review Management
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#496279] uppercase tracking-tighter leading-none">
              Audit <span className="text-[#4c8051]">History.</span>
            </h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-4 leading-relaxed">Immutable historical record of professional integrity entries</p>
          </div>
          <Link to="/review/submit" className="bg-[#4c8051] text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:scale-105 transition-all active:scale-95">
            <i className="fas fa-plus-circle mr-2"></i> Deploy New Entry
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-20">
            <i className="fas fa-shield-halved fa-spin text-6xl text-[#496279] mb-4"></i>
            <p className="font-black uppercase tracking-[0.3em] text-xs">Accessing Secure Records...</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {reviews.length > 0 ? reviews.map((r, i) => (
              <div
                key={r._id}
                className="bg-white p-8 md:p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col lg:flex-row justify-between items-start lg:items-center group hover:border-[#496279] hover:shadow-2xl transition-all duration-500 animate-on-scroll"
              >
                <div className="flex items-center gap-8 mb-8 lg:mb-0">
                  <div className="relative">
                    <div className="h-20 w-20 bg-[#496279]/5 rounded-[2rem] flex items-center justify-center text-3xl font-black text-[#496279] border-2 border-white shadow-inner group-hover:bg-[#4c8051] group-hover:text-white transition-all duration-500">
                      {r.employeeId?.firstName?.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-7 w-7 bg-[#4c8051] border-4 border-white rounded-full flex items-center justify-center shadow-sm">
                      <i className="fas fa-fingerprint text-[10px] text-white"></i>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-[#496279] uppercase tracking-tight group-hover:text-[#4c8051] transition-colors">
                      {r.employeeId?.firstName} {r.employeeId?.lastName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 mt-2">
                      <span className="text-[10px] font-black text-[#4c8051] uppercase tracking-widest bg-[#4c8051]/5 px-3 py-1 rounded-lg">
                        Verified Node
                      </span>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                        <i className="fas fa-calendar-check"></i> {new Date(r.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-auto flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className="bg-[#fcfaf9] p-6 rounded-3xl border border-slate-50 lg:w-72">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Aggregate Rating</span>
                      <span className="text-xs font-black text-[#4c8051]">8.5/10</span>
                    </div>
                    <p className="text-[11px] font-bold text-[#496279]/60 leading-relaxed italic line-clamp-2 uppercase tracking-tight">
                      "{r.comment}"
                    </p>
                  </div>
                  <Link to={`/employee/${r.employeeId?._id}`} className="px-6 py-4 bg-white border border-slate-100 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-[#496279] hover:text-white transition-all shadow-sm">
                    Open File
                  </Link>
                </div>
              </div>
            )) : (
              /* No Record State */
              <div className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-slate-100 opacity-60">
                <i className="fas fa-folder-open text-4xl text-slate-200 mb-6"></i>
                <p className="text-[#496279] font-black uppercase tracking-[0.2em] text-sm">No historical data nodes found</p>
                <Link to="/review/submit" className="text-[#4c8051] text-[10px] font-black uppercase tracking-widest mt-4 inline-block border-b-2 border-[#4c8051]/20 hover:border-[#4c8051]">Add New Review →</Link>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ManageReviews;