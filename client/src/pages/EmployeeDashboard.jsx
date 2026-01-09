import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const EmployeeDashboard = () => {
  const { user, hasPaidForReport } = useAuth(); // Context se status le rahe hain
  
  // Fake Score logic
  const shieldScore = 740; 

  const getScoreColor = (score) => {
    if (score >= 750) return '#4c8051'; // Green
    if (score >= 600) return '#496279'; // Blue/Neutral
    return '#dd8d88'; // Red/Risk
  };

  return (
    <div className="min-h-screen bg-[#fcfaf9] selection:bg-[#496279]/30">
      <Navbar scrolled={true} isAuthenticated={true} user={user} />

      <div className="container mx-auto px-6 pt-32 pb-20 max-w-5xl">
        
        {/* SECTION 1: THE GAUGE (Bureau Style) */}
        <div className="bg-white border border-slate-100 rounded-[3rem] p-12 shadow-2xl mb-12 text-center relative overflow-hidden animate-in fade-in duration-700">
          <div className="absolute top-0 left-0 w-full h-2 flex">
            <div className="flex-1 bg-red-400"></div>
            <div className="flex-1 bg-yellow-400"></div>
            <div className="flex-1 bg-[#4c8051]"></div>
          </div>

          <h2 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.4em] mb-10">Professional Integrity Index</h2>
          
          <div className="relative inline-block scale-110">
             <h1 className="text-9xl font-black tracking-tighter text-[#496279] animate-pulse-slow">
               {shieldScore}
             </h1>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-2" style={{ color: getScoreColor(shieldScore) }}>
               Current Status: {shieldScore >= 750 ? 'Elite Member' : 'Stable Node'}
             </p>
          </div>

          <div className="mt-12 max-w-md mx-auto">
             <p className="text-slate-400 text-[10px] font-bold uppercase leading-relaxed tracking-wider">
               Aggregated from <span className="text-[#496279]">3 Verified Enterprise Audits</span>. 
               Last updated: {new Date().toLocaleDateString('en-GB')}
             </p>
          </div>
        </div>

        {/* SECTION 2: ACCESS CONTROL */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Action Card: Check if paid or not */}
          <div className="bg-[#496279] rounded-[3rem] p-10 text-white shadow-xl relative group overflow-hidden border border-white/5">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#4c8051] opacity-10 rounded-full blur-3xl"></div>
            <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Historical Ledger</h3>
            <p className="text-white/50 text-[11px] font-bold uppercase leading-relaxed mb-10">
              Access full cross-enterprise behavioral trajectory, specific HR testimonies, and re-hire eligibility nodes.
            </p>
            
            <Link 
              to={hasPaidForReport ? "/reputation-report" : "/checkout"} 
              className="block w-full bg-[#4c8051] text-center py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95"
            >
              {hasPaidForReport ? "Open Full Ledger" : "Unlock History (₹499)"}
            </Link>
          </div>

          {/* Asset Status Card */}
          <div className="bg-white border border-slate-100 rounded-[3rem] p-10 flex flex-col justify-center shadow-sm relative group">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[#496279] shadow-inner group-hover:bg-[#4c8051]/10 transition-colors">
                   <i className="fas fa-file-contract text-xl"></i>
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Compliance Check</p>
                   <p className="text-sm font-black text-[#496279] uppercase">Verified Asset: Aadhar</p>
                </div>
             </div>
             <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed tracking-tight">
               Enterprise nodes are responsible for asset validation. Your current profile has 2 verified document nodes.
             </p>
          </div>

        </div>

        {/* Disclaimer Node */}
        <div className="mt-16 text-center opacity-30">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.4em]">
               HireShield Integrity Terminal // Verified Subject ID: {user?._id?.slice(-8).toUpperCase()}
            </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EmployeeDashboard;