import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const EmployeeSearch = () => {
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false); // Ye track karega ki search button press hua hai ya nahi

  const API_BASE = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://api.myhireshield.com'; 

  const handleSearch = async () => {
    if (!fullName.trim() && !dob) return alert("Node verification requires at least Name or DOB.");

    setLoading(true);
    setSearched(true);
    try {
      const token = localStorage.getItem('token');
      // Final Synchronization with Backend API
      const res = await axios.get(`${API_BASE}/api/employees/search`, {
        params: { 
          name: fullName.trim(),
          dob: dob
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setResults(res.data.data);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error("Node Scanning Error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf9] selection:bg-[#dd8d88]/30">
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      <Navbar scrolled={true} isAuthenticated={true} />

      <div className="container mx-auto px-6 pt-32 pb-20 max-w-5xl">
        
        {/* Search Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#4c8051]/10 rounded-lg text-[#4c8051] text-[10px] font-black uppercase tracking-widest mb-6 border border-[#4c8051]/20">
            <i className="fas fa-fingerprint"></i> Identity Verification Node
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-[#496279] uppercase tracking-tighter mb-4">
            Deep <span className="text-[#4c8051]">Search.</span>
          </h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em]">Query the global professional integrity ledger</p>
        </div>

        {/* Input Terminal */}
        <div className="relative max-w-3xl mx-auto mb-20">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#4c8051]/20 to-[#496279]/20 rounded-[2.5rem] blur-xl opacity-50"></div>
          <div className="relative grid md:grid-cols-2 gap-4 bg-white p-4 rounded-[2.5rem] shadow-xl border border-slate-100">
            <div className="flex items-center gap-3 px-4 border-r border-slate-50">
              <i className="fas fa-user text-slate-300"></i>
              <input 
                type="text" placeholder="Full Name (Aadhar)" 
                className="w-full py-2 outline-none text-[#496279] font-bold placeholder:text-slate-300 text-sm"
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="flex gap-4 items-center pl-2">
              <div className="flex items-center gap-3 flex-1">
                <i className="fas fa-calendar-alt text-slate-300"></i>
                <input 
                  type="date" 
                  className="w-full py-2 outline-none text-slate-400 font-bold text-sm bg-transparent"
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>
              <button 
                onClick={handleSearch}
                disabled={loading}
                className="bg-[#496279] text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#3a4e61] transition-all shadow-xl active:scale-95 disabled:opacity-50"
              >
                {loading ? <i className="fas fa-circle-notch fa-spin"></i> : 'Verify Node'}
              </button>
            </div>
          </div>
        </div>

        {/* Results Stream */}
        <div className="space-y-6">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 opacity-20">
                <i className="fas fa-shield-halved fa-spin text-6xl text-[#496279] mb-4"></i>
                <p className="font-black uppercase tracking-[0.3em] text-[10px]">Scanning Data Ledger...</p>
             </div>
          ) : results.length > 0 ? (
            results.map((emp, i) => (
              <div key={emp._id} className="bg-white p-6 md:p-8 rounded-[3rem] border border-slate-100 flex flex-col md:flex-row justify-between items-center group hover:border-[#4c8051] transition-all duration-500 shadow-sm hover:shadow-xl">
                <div className="flex items-center gap-8 mb-6 md:mb-0">
                  <div className="h-20 w-20 bg-[#496279]/5 rounded-[2rem] flex items-center justify-center text-3xl font-black text-[#496279] border-2 border-white shadow-inner group-hover:bg-[#4c8051] group-hover:text-white transition-all duration-500">
                    {emp.firstName?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-[#496279] uppercase tracking-tight group-hover:text-[#4c8051] transition-colors">{emp.firstName} {emp.lastName}</h3>
                    <div className="flex items-center gap-3 mt-2">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{emp.currentDesignation || 'Verified Professional'}</span>
                       <span className="h-1 w-1 rounded-full bg-slate-200"></span>
                       <span className="text-[10px] font-black text-[#dd8d88] uppercase tracking-widest tracking-tighter">Identity Secured 🛡️</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-10 w-full md:w-auto border-t md:border-t-0 pt-6 md:pt-0 border-slate-50">
                  <div className="text-center md:text-right flex-1 md:flex-initial">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mb-1">Shield Score™</p>
                    <p className="text-4xl font-black text-[#496279] tracking-tighter leading-none">{emp.overallScore || '85'}%</p>
                  </div>
                  <Link to={`/employee/${emp._id}`} className="bg-[#fcfaf9] text-[#496279] border border-slate-200 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#496279] hover:text-white transition-all shadow-sm">
                    Analyze Node
                  </Link>
                </div>
              </div>
            ))
          ) : searched && !loading && (
            <div className="text-center py-24 bg-white rounded-[4rem] border border-dashed border-slate-200 opacity-60">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-xl">🚫</div>
              <p className="text-[#496279] font-black uppercase tracking-[0.2em] text-sm leading-none">No Authorized Node Found</p>
              <p className="text-slate-400 text-[10px] font-bold uppercase mt-2">Verify spelling or official date of birth</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EmployeeSearch;