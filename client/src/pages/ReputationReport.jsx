import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';

const ReputationReport = () => {
  const { user, hasPaidForReport } = useAuth();
  const [isUnlocked, setIsUnlocked] = useState(hasPaidForReport);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsUnlocked(hasPaidForReport);

    const fetchReport = async () => {
      try {
        const token = localStorage.getItem('token');
        // Backend se real analytics fetch kar rahe hain
        const res = await axios.get('/api/analytics/employee', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success) {
          setReportData(res.data.data);
        }
      } catch (err) {
        console.error("Report Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchReport();
  }, [user, hasPaidForReport]);

  if (loading) return <div className="min-h-screen flex items-center justify-center uppercase font-black text-[10px] tracking-[0.3em]">Decoding Integrity Node...</div>;

  // Real Score from Database
  const overallScore = reportData?.overallScore || 0;

  // Real Parameters from Database
  const parameters = [
    { label: 'Work Quality', score: reportData?.scoreBreakdown?.workQuality || 0, color: '#4c8051' },
    { label: 'Punctuality', score: reportData?.scoreBreakdown?.punctuality || 0, color: '#496279' },
    { label: 'Behavior', score: reportData?.scoreBreakdown?.behavior || 0, color: '#4c8051' },
    { label: 'Teamwork', score: reportData?.scoreBreakdown?.teamwork || 0, color: '#dd8d88' }
  ];

  return (
    <div className="min-h-screen bg-[#fcfaf9] selection:bg-[#496279]/30 font-sans">
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      <Navbar scrolled={true} isAuthenticated={true} user={user} />

      <div className="container mx-auto px-6 pt-32 pb-20 max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <Breadcrumb />
          <Link to="/dashboard/employee" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#4c8051] transition-all">
            <i className="fas fa-arrow-left"></i>
            Back to Dashboard
          </Link>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#4c8051]/10 rounded-lg text-[#4c8051] text-[9px] font-black uppercase tracking-widest mb-3">
              Certified Professional Report
            </div>
            <h1 className="text-4xl font-black text-[#496279] uppercase tracking-tighter">
              Integrity <span className="text-[#4c8051]">Audit Report</span>
            </h1>
          </div>
          <div className="px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-center">
            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Node Subject</p>
            <span className="text-[10px] font-black text-[#496279] uppercase tracking-tighter">{user?.firstName} {user?.lastName}</span>
          </div>
        </div>

        {/* Analytics Spectrum - Only if Paid */}
        {isUnlocked && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 animate-in fade-in zoom-in">
            <div className="p-8 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Integrity Spectrum (Real-time)</h4>
              <div className="flex items-end gap-2 h-32">
                {[40, 70, overallScore, 60, 85].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-xl transition-all duration-1000"
                    style={{ height: `${h}%`, backgroundColor: h > 80 ? '#4c8051' : h > 50 ? '#496279' : '#dd8d88' }}></div>
                ))}
              </div>
            </div>

            <div className="p-8 bg-white rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-3 h-3 rounded-full ${overallScore > 60 ? 'bg-[#4c8051]' : 'bg-[#dd8d88]'}`}></div>
                <p className="text-[10px] font-black text-[#496279] uppercase tracking-widest">
                  {overallScore > 60 ? 'Low Risk Profile' : 'High Risk Node'}
                </p>
              </div>
              <p className="text-xs text-slate-400 font-bold leading-relaxed uppercase tracking-tight">
                Current audit node represents an aggregate score of <span className="text-[#4c8051]">{overallScore}%</span> across verified enterprise logs.
              </p>
            </div>
          </div>
        )}

        {/* Score Summary Card - Database Linked */}
        <div className="bg-white border border-slate-100 rounded-[3.5rem] p-10 shadow-xl mb-12 relative overflow-hidden">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="text-center md:text-left">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4">Shield Aggregate Index</p>
              <h2 className="text-9xl font-black text-[#496279] tracking-tighter leading-none">{overallScore}</h2>
              <p className="text-[#4c8051] font-black uppercase text-[10px] tracking-widest mt-4">
                {overallScore >= 75 ? 'Verified Elite Status' : 'Standard Node Status'}
              </p>
            </div>
            <div className="space-y-4">
              {parameters.map((p, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                    <span>{p.label}</span>
                    <span>{p.score}/10</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${p.score * 10}%`, backgroundColor: p.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Complete History - All Reviews */}
        <div className="relative">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8 ml-4">Employment Audit Logs</h3>

          <div className={`space-y-6 ${!isUnlocked ? 'filter blur-xl pointer-events-none select-none opacity-40' : 'animate-in fade-in'}`}>
            {reportData?.recentReviews?.length > 0 ? reportData.recentReviews.map((rev, i) => (
              <div key={i} className="bg-white border border-slate-100 p-8 md:p-10 rounded-[3rem] shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center font-black text-[#496279] text-xs uppercase">
                      {rev.companyId?.companyName?.charAt(0) || 'E'}
                    </div>
                    <h4 className="font-black text-[#496279] uppercase text-sm tracking-tight">{rev.companyId?.companyName}</h4>
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                    {new Date(rev.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-500 leading-relaxed italic border-l-4 border-slate-50 pl-6 uppercase tracking-tight">
                  "{rev.comment}"
                </p>
              </div>
            )) : (
              <div className="text-center py-10 bg-white rounded-[3rem] border-dashed border-2 border-slate-100">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Verified Enterprise Logs Found</p>
              </div>
            )}
          </div>

          {/* Paywall Logic */}
          {!isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="bg-white/90 backdrop-blur-xl p-12 rounded-[4rem] border border-white shadow-2xl text-center max-w-md mx-6">
                <div className="w-20 h-20 bg-[#496279] rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-xl">
                  <i className="fas fa-fingerprint text-3xl"></i>
                </div>
                <h2 className="text-2xl font-black text-[#496279] uppercase tracking-tighter mb-4">Decode History</h2>
                <p className="text-[11px] font-bold text-slate-400 uppercase leading-relaxed mb-10 tracking-widest">
                  Employer feedback and behavioral nodes are encrypted. Access real-time node history.
                </p>
                <button
                  onClick={() => window.location.href = '/checkout'}
                  className="w-full bg-[#496279] text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-[#3a4e61] transition-all"
                >
                  Initialize Unlock (₹99)
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-20 text-center opacity-30">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.5em]">
            HireShield Professional Platform // Node ID: {user?._id?.toUpperCase()}
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReputationReport;