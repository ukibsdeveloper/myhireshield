import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';

const CompanyDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await analyticsAPI.getCompanyAnalytics();
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // UI Helper: Trust Rating logic
  const trustRating = stats?.trustRating || 0;
  const strokeDashoffset = 364.4 - (364.4 * trustRating) / 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcfaf9] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 animate-pulse">
          <div className="relative">
            <i className="fas fa-shield-halved text-6xl text-[#496279]"></i>
            <div className="absolute inset-0 border-4 border-[#4c8051]/20 rounded-full animate-ping"></div>
          </div>
          <p className="font-black uppercase tracking-[0.4em] text-[10px] text-slate-400">Authenticating Account Access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaf9] selection:bg-[#4c8051]/20 overflow-x-hidden uppercase tracking-tight font-sans antialiased">
      {/* Background Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <Navbar scrolled={true} isAuthenticated={true} user={user} />

      <div className="container mx-auto px-6 pt-32 pb-24 max-w-7xl">
        <Breadcrumb />

        {/* HERO SECTION: WELCOME & PRIMARY ACTION */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="lg:col-span-2 relative p-12 md:p-16 rounded-[4rem] bg-gradient-to-br from-[#496279] via-[#3a4e61] to-[#2c3d4a] text-white overflow-hidden shadow-2xl flex flex-col justify-center border border-white/5 group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#4c8051] opacity-20 rounded-full blur-[120px] -mr-48 -mt-48 transition-all duration-700 group-hover:scale-110"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#dd8d88] opacity-10 rounded-full blur-[100px] -ml-32 -mb-32"></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="flex-1">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-2xl text-[10px] font-black tracking-[0.3em] mb-8 border border-white/10 shadow-inner">
                  <span className="h-2 w-2 rounded-full bg-[#4c8051] animate-pulse"></span>
                  Enterprise System Online
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] mb-6">
                  Vault <br /> <span className="text-[#4c8051]">Access.</span>
                </h1>
                <p className="text-white/40 font-bold text-xs tracking-[0.3em] uppercase">{user?.companyName || 'HireShield Enterprise'}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <Link to="/review/submit" className="group relative items-center justify-center bg-[#4c8051] text-white px-10 py-6 rounded-3xl font-black text-xs tracking-widest shadow-24 hover:scale-105 active:scale-95 transition-all overflow-hidden flex">
                  <span className="relative z-10 flex items-center gap-3">
                    <i className="fas fa-plus text-xs"></i> Deploy New Audit
                  </span>
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                </Link>

                <Link to="/add-employee" className="bg-white/10 backdrop-blur-md text-white border border-white/10 px-10 py-6 rounded-3xl font-black text-xs tracking-widest shadow-xl hover:bg-white hover:text-[#496279] transition-all flex items-center justify-center gap-3">
                  <i className="fas fa-user-plus text-xs"></i>
                  <span>Register Node</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Account Health Gauge Card */}
          <div className="bg-white border border-slate-100 rounded-[4rem] p-12 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
              <i className="fas fa-shield-check text-8xl text-slate-200"></i>
            </div>
            <div className="relative w-40 h-40 mb-8 p-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-50" />
                <circle
                  cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="12" fill="transparent"
                  strokeDasharray="465"
                  strokeDashoffset={465 - (465 * trustRating) / 100}
                  strokeLinecap="round"
                  className="text-[#4c8051] transition-all duration-1500 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-[#496279] tracking-tighter">{trustRating}%</span>
              </div>
            </div>
            <h3 className="text-[11px] font-black text-[#496279] tracking-[0.4em] mb-3 uppercase">Identity Integrity Score</h3>
            <div className="px-4 py-1.5 bg-[#4c8051]/5 rounded-full border border-[#4c8051]/10">
              <p className="text-[9px] text-[#4c8051] font-black tracking-widest uppercase">Level: {trustRating > 80 ? 'Master' : 'Standard'}</p>
            </div>
          </div>
        </div>

        {/* SECTION 2: LIVE METRICS */}
        <div className="mb-20">
          <h2 className="text-[11px] font-black text-slate-400 tracking-[0.5em] mb-8 ml-6 flex items-center gap-4">
            <span className="h-px w-12 bg-slate-200"></span> Live Performance Nodes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Integrity Logs', value: stats?.totalReviews || 0, icon: 'fa-star', color: '#4c8051', desc: 'Total enterprise audits published' },
              { label: 'Active Personnel', value: stats?.staffNodesCount || 0, icon: 'fa-users', color: '#496279', desc: 'Registered subject identifiers' },
              { label: 'Search Clearance', value: '100%', icon: 'fa-bolt', color: '#dd8d88', desc: 'Database synchronization status' }
            ].map((stat, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm hover:shadow-2xl transition-all relative group overflow-hidden border-b-4" style={{ borderColor: `${stat.color}20` }}>
                <div className="flex justify-between items-start mb-8">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform" style={{ color: stat.color }}>
                    <i className={`fas ${stat.icon}`}></i>
                  </div>
                  <div className="opacity-[0.03] absolute -right-4 -bottom-4 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-700">
                    <i className={`fas ${stat.icon} text-[12rem]`} style={{ color: stat.color }}></i>
                  </div>
                </div>
                <p className="text-[10px] font-black text-slate-400 tracking-[0.3em] mb-1 uppercase">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-6xl font-black text-[#496279] tracking-tighter">{stat.value}</p>
                  {i === 1 && <span className="text-[10px] font-black text-[#4c8051] uppercase mb-2">Nodes</span>}
                </div>
                <p className="text-[9px] text-slate-400 font-bold tracking-widest mt-4 uppercase border-t border-slate-50 pt-4">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: QUICK COMMAND CENTER (CARDS) */}
        <div className="mb-24">
          <h2 className="text-[11px] font-black text-slate-400 tracking-[0.5em] mb-10 ml-6 flex items-center gap-4">
            <span className="h-px w-12 bg-slate-200"></span> Command Center
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { to: "/employee/search", icon: 'fa-magnifying-glass', title: 'Deep Search', desc: 'Verify candidate identity nodes', bg: 'bg-[#496279]' },
              { to: "/company/upload-documents", icon: 'fa-cloud-arrow-up', title: 'Data Feed', desc: 'Secure document synchronization', bg: 'bg-[#4c8051]' },
              { to: "/review/manage", icon: 'fa-book-atlas', title: 'Audit Ledger', desc: 'Manage historical integrity logs', bg: 'bg-[#dd8d88]' },
              { to: "/verify/documents", icon: 'fa-certificate', title: 'Compliance', desc: 'System document verification', bg: 'bg-[#496279]' }
            ].map((cmd, i) => (
              <Link key={i} to={cmd.to} className="group p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col items-start gap-6 hover:-translate-y-2 border-l-4" style={{ borderColor: cmd.bg.includes('496279') ? '#49627920' : cmd.bg.includes('4c8051') ? '#4c805120' : '#dd8d8820' }}>
                <div className={`w-12 h-12 ${cmd.bg} text-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                  <i className={`fas ${cmd.icon} text-sm`}></i>
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#496279] uppercase tracking-widest mb-2 group-hover:text-[#4c8051] transition-colors">{cmd.title}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-relaxed">{cmd.desc}</p>
                </div>
                <div className="w-full flex justify-end mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <i className="fas fa-arrow-right text-[#4c8051]"></i>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* SECTION 4: ACTIVITY STREAM & LEDGER */}
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Recent Audits Table Card */}
          <div className="lg:col-span-3 bg-white border border-slate-100 rounded-[4rem] p-12 shadow-sm overflow-hidden relative border-t-8 border-t-[#496279]">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-lg font-black text-[#496279] tracking-tighter uppercase">Recent Audit Stream</h2>
                <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live Activity Feed
                </p>
              </div>
              <button className="px-8 py-4 bg-[#fcfaf9] text-[#496279] border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#496279] hover:text-white transition-all shadow-sm">
                <i className="fas fa-file-export mr-2"></i> Fetch PDF
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="pb-8 px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Employee Node</th>
                    <th className="pb-8 px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest text-center">Audit Status</th>
                    <th className="pb-8 px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest text-right">Shield Rank™</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {stats?.recentReviews?.length > 0 ? (
                    stats.recentReviews.map((row, i) => (
                      <tr key={i} className="group hover:bg-[#fcfaf9] transition-all cursor-pointer">
                        <td className="py-8 px-4">
                          <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-3xl bg-[#496279]/5 border-2 border-white shadow-inner flex items-center justify-center font-black text-[#496279] text-xl group-hover:bg-[#4c8051] group-hover:text-white transition-all">
                              {row.employeeId?.firstName?.charAt(0) || 'E'}
                            </div>
                            <div>
                              <p className="font-black text-[#496279] text-lg tracking-tighter leading-none group-hover:text-[#4c8051] transition-colors">
                                {row.employeeId?.firstName} {row.employeeId?.lastName}
                              </p>
                              <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest">{row.employeeId?.currentDesignation || 'Verified Professional'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-8 px-4 text-center">
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#4c8051]/5 text-[#4c8051] rounded-lg border border-[#4c8051]/10">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#4c8051]"></span>
                            <span className="text-[9px] font-black tracking-widest uppercase">Verified Entry</span>
                          </div>
                        </td>
                        <td className="py-8 px-4 text-right">
                          <div className="flex flex-col items-end">
                            <span className="text-2xl font-black text-[#496279] tracking-tighter">{row.employeeId?.overallScore || 0}%</span>
                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Trust Percentile</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="py-20 text-center text-xs font-black text-slate-200 uppercase tracking-[0.4em]">No recent audits deployed to system.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* System Notifications / Alerts Side */}
          <div className="space-y-8">
            <div className="bg-[#dd8d88]/5 border border-[#dd8d88]/10 rounded-[3rem] p-10 shadow-sm relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 opacity-5 group-hover:scale-110 transition-transform">
                <i className="fas fa-bell text-[10rem] text-[#dd8d88]"></i>
              </div>
              <h3 className="text-[11px] font-black text-[#dd8d88] tracking-[0.4em] mb-8 flex items-center gap-3 uppercase">
                <i className="fas fa-bolt-lightning animate-pulse"></i> Priority Feed
              </h3>
              <div className="space-y-8 relative z-10">
                <div className="border-l-4 border-[#4c8051] pl-6 py-2">
                  <p className="text-xs font-black text-[#496279] uppercase tracking-tight leading-none mb-2">Systems Nominal</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Global integrity network operational (100%)</p>
                </div>
                <div className="border-l-4 border-[#dd8d88] pl-6 py-2">
                  <p className="text-xs font-black text-[#496279] uppercase tracking-tight leading-none mb-2">Policy Update</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">2026 behavioral audit guidelines published</p>
                </div>
              </div>
            </div>

            <div className="bg-[#496279] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#4c8051] opacity-20 rounded-full blur-3xl"></div>
              <h4 className="text-[10px] font-black opacity-50 uppercase tracking-[0.4em] mb-4">Enterprise Support</h4>
              <p className="text-lg font-black tracking-tight leading-none mb-6 uppercase">Need Specialized Audit Clearance?</p>
              <button className="w-full py-4 bg-white text-[#496279] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                Contact Specialist
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Footer / Session Meta */}
        <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40 group">
          <div className="flex items-center gap-6">
            <div className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black text-slate-500 tracking-widest">
              ID: {user?._id?.slice(-8).toUpperCase()}
            </div>
            <p className="text-[10px] font-bold text-slate-400 tracking-[0.3em] uppercase hidden md:block">HireShield Enterprise Dashboard // Build 2026.04</p>
          </div>
          <button
            onClick={logout}
            className="group flex items-center gap-4 text-[10px] font-black tracking-[0.2em] text-[#496279] hover:text-[#dd8d88] transition-all uppercase"
          >
            <span className="group-hover:mr-2 transition-all">Terminate Authorized Session</span>
            <i className="fas fa-power-off"></i>
          </button>
        </div>
      </div>

      <Footer />

      {/* Custom Scoped Styles for animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-top { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes zoom-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        
        .animate-in {
          animation-duration: 0.8s;
          animation-fill-mode: both;
          animation-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-8 { 
           animation-name: slide-in-bottom;
        }
        @keyframes slide-in-bottom {
           from { transform: translateY(2rem); opacity: 0; }
           to { transform: translateY(0); opacity: 1; }
        }
      `}} />
    </div>
  );
};

export default CompanyDashboard;