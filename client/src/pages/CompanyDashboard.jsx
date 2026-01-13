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

  return (
    <div className="min-h-screen bg-[#fcfaf9] selection:bg-[#4c8051]/20 overflow-x-hidden uppercase tracking-tight font-sans antialiased text-[#496279]">
      {/* Background Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <Navbar scrolled={true} isAuthenticated={true} user={user} />

      <div className="container mx-auto px-6 pt-32 pb-24 max-w-7xl relative z-10">
        <Breadcrumb />

        {/* HERO SECTION: WELCOME & PRIMARY ACTION */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="lg:col-span-2 relative p-12 md:p-16 rounded-[4rem] bg-gradient-to-br from-[#496279] via-[#3a4e61] to-[#2c3d4a] text-white overflow-hidden shadow-[0_32px_64px_-16px_rgba(58,78,97,0.3)] flex flex-col justify-center border border-white/5 group">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4c8051] opacity-[0.15] rounded-full blur-[120px] -mr-64 -mt-64 transition-all duration-1000 group-hover:scale-125"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#dd8d88] opacity-[0.08] rounded-full blur-[100px] -ml-40 -mb-40"></div>

            {/* Design Element: Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '48px 48px' }}></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="flex-1">
                <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/5 backdrop-blur-2xl rounded-2xl text-[10px] font-black tracking-[0.4em] mb-10 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] transition-all group-hover:border-white/20">
                  <span className="h-2 w-2 rounded-full bg-[#4c8051] shadow-[0_0_12px_#4c8051] animate-pulse"></span>
                  {loading ? 'SCANNIG PROTOCOLS...' : 'SYSTEM SECURED & ONLINE'}
                </div>
                <h1 className="text-6xl md:text-[5.5rem] font-black tracking-[-0.04em] leading-[0.8] mb-8 drop-shadow-2xl">
                  VAULT <br /> <span className="text-[#4c8051] drop-shadow-[0_0_30px_rgba(76,128,81,0.3)]">ACCESS.</span>
                </h1>
                <div className="flex items-center gap-4">
                  <div className="h-px w-8 bg-white/20"></div>
                  <p className="text-white/50 font-black text-[10px] tracking-[0.5em] uppercase">{user?.companyName || 'HIRESHIELD ENTERPRISE'}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 w-full md:w-auto">
                <Link to="/review/submit" className="group relative flex items-center justify-center bg-[#4c8051] text-white px-12 py-7 rounded-[2rem] font-black text-xs tracking-[0.2em] shadow-[0_20px_40px_-12px_rgba(76,128,81,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(76,128,81,0.5)] hover:-translate-y-1 active:translate-y-0 transition-all duration-500 overflow-hidden whitespace-nowrap">
                  <span className="relative z-10 flex items-center gap-4">
                    <i className="fas fa-plus text-[10px]"></i> DEPLOY NEW AUDIT
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                </Link>

                <Link to="/add-employee" className="group flex items-center justify-center gap-4 bg-white/5 backdrop-blur-xl text-white border border-white/10 px-12 py-7 rounded-[2rem] font-black text-xs tracking-[0.2em] hover:bg-white hover:text-[#3a4e61] hover:-translate-y-1 active:translate-y-0 transition-all duration-500 shadow-xl whitespace-nowrap">
                  <i className="fas fa-user-plus text-[10px] transition-transform group-hover:rotate-12"></i>
                  <span>REGISTER NODE</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Account Health Gauge Card */}
          <div className="bg-white border border-slate-100 rounded-[4rem] p-12 shadow-[0_20px_48px_-12px_rgba(73,98,121,0.08)] flex flex-col items-center justify-center text-center relative overflow-hidden group hover:shadow-[0_32px_64px_-16px_rgba(73,98,121,0.15)] transition-all duration-700">
            {/* Decorative background element */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-slate-50 rounded-full blur-3xl opacity-50 group-hover:bg-[#4c8051]/10 transition-colors duration-700"></div>

            <div className="relative w-52 h-52 mb-10 flex items-center justify-center">
              {/* Outer Glow Ring */}
              <div className="absolute inset-4 rounded-full border border-slate-50 shadow-[inset_0_0_20px_rgba(0,0,0,0.02)]"></div>

              <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_15px_rgba(76,128,81,0.1)]">
                <circle cx="104" cy="104" r="92" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-50" />
                <circle
                  cx="104" cy="104" r="92" stroke="currentColor" strokeWidth="12" fill="transparent"
                  strokeDasharray="578"
                  strokeDashoffset={578 - (578 * trustRating) / 100}
                  strokeLinecap="round"
                  className="text-[#4c8051] transition-all duration-[2000ms] ease-out-expo shadow-[0_0_20px_rgba(76,128,81,0.4)]"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:scale-105 transition-transform duration-700">
                <div className="flex items-baseline mb-1">
                  <span className="text-6xl font-black text-[#3a4e61] tracking-[-0.05em] leading-none">{trustRating}</span>
                  <span className="text-2xl font-black text-[#4c8051] ml-0.5">%</span>
                </div>
                <div className="px-3 py-1 bg-slate-50 rounded-lg">
                  <span className="text-[7px] font-black text-slate-400 tracking-[0.4em] uppercase">INTEGRITY</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex flex-col items-center mt-2">
              <h3 className="text-[10px] font-black text-slate-400 tracking-[0.5em] mb-5 uppercase">IDENTITY CLEARANCE</h3>
              <div className={`px-8 py-3 rounded-2xl border-2 transition-all duration-500 shadow-sm ${trustRating > 80 ? 'bg-white border-[#4c8051]/20 text-[#4c8051]' : 'bg-white border-slate-100 text-slate-500'}`}>
                <p className="text-[10px] font-black tracking-[0.2em] uppercase flex items-center gap-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${trustRating > 80 ? 'bg-[#4c8051] shadow-[0_0_10px_#4c8051] animate-pulse' : 'bg-slate-300'}`}></span>
                  PROTOCOL: {trustRating > 80 ? 'MASTER' : 'STANDARD'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: LIVE METRICS */}
        <div className="mb-24">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-[11px] font-black text-slate-400 tracking-[0.6em] ml-6 flex items-center gap-6 uppercase">
              <span className="h-px w-16 bg-gradient-to-r from-slate-200 to-transparent"></span>
              Live Performance Nodes
            </h2>
            <div className="h-px flex-1 bg-slate-50 mx-10"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Integrity Logs', value: stats?.totalReviews || 0, icon: 'fa-signature', color: '#4c8051', desc: 'Enterprise audits published' },
              { label: 'Active Personnel', value: stats?.staffNodesCount || 0, icon: 'fa-shield-halved', color: '#3a4e61', desc: 'Registered subject identifiers' },
              { label: 'Search Clearance', value: '100%', icon: 'fa-satellite-dish', color: '#dd8d88', desc: 'Global database sync status' }
            ].map((stat, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-[3.5rem] p-12 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(58,78,97,0.12)] hover:-translate-y-2 transition-all duration-500 relative group overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-10">
                    <div className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 bg-slate-50" style={{ color: stat.color }}>
                      <i className={`fas ${stat.icon}`}></i>
                    </div>
                    <div className="opacity-[0.03] absolute -right-8 -top-8 group-hover:scale-125 group-hover:rotate-12 transition-all duration-1000 pointer-events-none">
                      <i className={`fas ${stat.icon} text-[15rem] text-slate-900 group-hover:text-black`}></i>
                    </div>
                  </div>

                  <p className="text-[10px] font-black text-slate-400 tracking-[0.4em] mb-2 uppercase">{stat.label}</p>
                  <div className="flex items-baseline gap-3">
                    {loading ? (
                      <div className="h-16 w-24 bg-slate-50 animate-pulse rounded-2xl"></div>
                    ) : (
                      <p className="text-7xl font-black text-[#3a4e61] tracking-[-0.06em] leading-none mb-1">{stat.value}</p>
                    )}
                    {i === 1 && !loading && <span className="text-[10px] font-black text-[#4c8051] tracking-widest uppercase mb-1">NODES</span>}
                  </div>

                  <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                    <p className="text-[10px] text-slate-300 font-bold tracking-[0.1em] uppercase">{stat.desc}</p>
                    <i className="fas fa-arrow-right-long text-slate-200 transition-all group-hover:translate-x-2 group-hover:text-[#4c8051]"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: COMMAND CENTER */}
        <div className="mb-24">
          <h2 className="text-[11px] font-black text-slate-400 tracking-[0.6em] mb-12 ml-6 flex items-center gap-6 uppercase">
            <span className="h-px w-16 bg-gradient-to-r from-slate-200 to-transparent"></span>
            Command Center
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { to: "/employee/search", icon: 'fa-magnifying-glass-chart', title: 'Deep Search', desc: 'VERIFY IDENTITY NODES', color: '#496279' },
              { to: "/company/upload-documents", icon: 'fa-vault', title: 'Data Feed', desc: 'SECURE DATA SYNC', color: '#4c8051' },
              { to: "/review/manage", icon: 'fa-receipt', title: 'Audit Ledger', desc: 'HISTORICAL LOGS', color: '#dd8d88' },
              { to: "/verify/documents", icon: 'fa-fingerprint', title: 'Compliance', desc: 'SYSTEM VERIFICATION', color: '#3a4e61' }
            ].map((cmd, i) => (
              <Link key={i} to={cmd.to} className="group p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.06)] transition-all duration-700 flex flex-col items-start gap-8 hover:-translate-y-3 relative overflow-hidden">
                {/* Hover Background Accent */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 bg-white border border-slate-50" style={{ color: cmd.color }}>
                  <i className={`fas ${cmd.icon} text-lg`}></i>
                </div>

                <div>
                  <h4 className="text-sm font-black text-[#3a4e61] uppercase tracking-[0.2em] mb-3 group-hover:text-[#4c8051] transition-colors">{cmd.title}</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">{cmd.desc}</p>
                </div>

                <div className="w-full flex justify-end mt-2">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                    <i className="fas fa-chevron-right text-[#4c8051] text-[10px]"></i>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* SECTION 4: ACTIVITY STREAM & LEDGER */}
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Recent Audits Table Card */}
          <div className="lg:col-span-3 bg-white border border-slate-100 rounded-[4rem] p-12 md:p-16 shadow-[0_20px_48px_-12px_rgba(0,0,0,0.05)] overflow-hidden relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 mb-16">
              <div>
                <h2 className="text-2xl font-black text-[#3a4e61] tracking-[-0.03em] uppercase mb-4">Recent Audit Stream</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-[#4c8051]/5 rounded-full border border-[#4c8051]/10">
                    <span className="h-2 w-2 rounded-full bg-[#4c8051] animate-pulse"></span>
                    <span className="text-[9px] text-[#4c8051] font-black tracking-widest uppercase">Live Activity Feed</span>
                  </div>
                  <span className="text-slate-200 text-xs">|</span>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">REAL-TIME SYSTEM MONITORING</p>
                </div>
              </div>
              <button className="group px-8 py-5 bg-[#3a4e61] text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#4c8051] hover:-translate-y-1 hover:shadow-2xl transition-all duration-500 shadow-xl flex items-center gap-4">
                <i className="fas fa-file-export text-[10px]"></i>
                <span>DOWNLOAD LEDGER</span>
              </button>
            </div>

            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-10 pt-4 px-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">EMPLOYEE NODE</th>
                    <th className="pb-10 pt-4 px-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] text-center">AUDIT STATUS</th>
                    <th className="pb-10 pt-4 px-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] text-right">SHIELD RANK™</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {stats?.recentReviews?.length > 0 ? (
                    stats.recentReviews.map((row, i) => (
                      <tr key={i} className="group hover:bg-slate-50/50 transition-all cursor-pointer">
                        <td className="py-10 px-6">
                          <div className="flex items-center gap-8">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm flex items-center justify-center font-black text-[#3a4e61] text-xl group-hover:scale-110 group-hover:bg-[#3a4e61] group-hover:text-white group-hover:border-[#3a4e61] transition-all duration-500">
                              {row.employeeId?.firstName?.charAt(0) || 'E'}
                            </div>
                            <div>
                              <p className="font-black text-[#3a4e61] text-xl tracking-[-0.04em] mb-1 group-hover:text-[#4c8051] transition-colors">
                                {row.employeeId?.firstName} {row.employeeId?.lastName}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{row.employeeId?.currentDesignation || 'VERIFIED PROFESSIONAL'}</span>
                                <span className="text-slate-200">/</span>
                                <span className="text-[9px] text-[#4c8051] font-black uppercase tracking-widest">SECURE</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-10 px-6 text-center">
                          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-emerald-50 text-[#4c8051] rounded-xl border border-emerald-100/50">
                            <i className="fas fa-check-double text-[10px]"></i>
                            <span className="text-[9px] font-black tracking-[0.2em] uppercase">VERIFIED ENTRY</span>
                          </div>
                        </td>
                        <td className="py-10 px-6 text-right">
                          <div className="flex flex-col items-end">
                            <span className="text-3xl font-black text-[#3a4e61] tracking-[-0.06em] leading-none mb-1">{row.employeeId?.overallScore || 0}%</span>
                            <div className="flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-[#4c8051]"></div>
                              <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">TRUST PERCENTILE</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="py-32 text-center">
                        <div className="flex flex-col items-center gap-4 opacity-20">
                          <i className="fas fa-database text-6xl text-slate-200"></i>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.6em]">NO RECENT AUDITS DEPLOYED</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* System Notifications / Alerts Side */}
          <div className="space-y-8">
            <div className="bg-[#3a4e61] rounded-[3.5rem] p-12 text-white shadow-[0_20px_48px_-12px_rgba(58,78,97,0.3)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#4c8051] opacity-20 rounded-full blur-[80px] -mr-20 -mt-20"></div>

              <h3 className="text-[10px] font-black text-white/40 tracking-[0.5em] mb-10 flex items-center gap-4 uppercase relative z-10">
                <i className="fas fa-bolt-lightning text-[#4c8051] animate-pulse"></i>
                PRIORITY FEED
              </h3>

              <div className="space-y-10 relative z-10">
                <div className="relative pl-8">
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#4c8051] to-transparent"></div>
                  <p className="text-xs font-black uppercase tracking-widest mb-2 group-hover:text-[#4c8051] transition-colors">SYSTEMS NOMINAL</p>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider leading-relaxed">GLOBEL INTEGRITY NETWORK OPERATIONAL (100%)</p>
                </div>

                <div className="relative pl-8">
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#dd8d88] to-transparent"></div>
                  <p className="text-xs font-black uppercase tracking-widest mb-2 group-hover:text-[#dd8d88] transition-colors">POLICY UPDATE</p>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider leading-relaxed">2026 BEHAVIORAL AUDIT GUIDELINES PUBLISHED</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-[3.5rem] p-12 shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 flex items-center justify-center text-[#3a4e61] mb-8 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                  <i className="fas fa-user-headset text-xl"></i>
                </div>
                <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-4">ENTERPRISE SUPPORT</h4>
                <p className="text-xl font-black text-[#3a4e61] tracking-[-0.02em] leading-tight mb-8 uppercase">NEED SPECIALIZED <br /> AUDIT CLEARANCE?</p>
                <button className="w-full py-5 bg-[#fcfaf9] text-[#3a4e61] border border-slate-100 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-[#3a4e61] hover:text-white hover:border-[#3a4e61] hover:-translate-y-1 active:translate-y-0 transition-all duration-500 shadow-sm">
                  CONTACT SPECIALIST
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Footer / Session Meta */}
        <div className="mt-32 pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-12 opacity-50 hover:opacity-100 transition-opacity duration-700">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-[9px] font-black text-[#3a4e61] tracking-[0.3em] shadow-sm">
              SYSTEM ID: {user?._id?.slice(-12).toUpperCase()}
            </div>
            <div className="flex items-center gap-4">
              <span className="h-1 w-1 rounded-full bg-slate-300"></span>
              <p className="text-[9px] font-bold text-slate-400 tracking-[0.4em] uppercase">HIRESHIELD ENTERPRISE // BUILD 2026.04.13</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="group flex items-center gap-5 text-[10px] font-black tracking-[0.4em] text-[#3a4e61] hover:text-[#dd8d88] transition-all duration-500 uppercase"
          >
            <span className="relative overflow-hidden inline-block group-hover:translate-x-1 transition-transform">
              TERMINATE AUTHORIZED SESSION
            </span>
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center transition-all duration-500 group-hover:bg-[#dd8d88]/10">
              <i className="fas fa-power-off text-xs"></i>
            </div>
          </button>
        </div>
      </div>

      <Footer />

      {/* Global Aesthetics Enhancements */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        
        body {
          font-family: 'Outfit', sans-serif;
          letter-spacing: -0.01em;
        }

        .ease-out-expo {
          transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
        }

        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-bottom {
          from { transform: translateY(3rem); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-in {
          animation-duration: 1s;
          animation-fill-mode: both;
          animation-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
        }
        
        .fade-in { animation-name: fade-in; }
        .slide-in-from-bottom-8 { animation-name: slide-in-bottom; }

        /* Custom Scrollbar for Premium Feel */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #fcfaf9; }
        ::-webkit-scrollbar-thumb { 
          background: #496279; 
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover { background: #4c8051; }

        /* Smooth Table Transitions */
        tr { transition: background-color 0.4s cubic-bezier(0.19, 1, 0.22, 1); }
      `}} />
    </div>
  );
};

export default CompanyDashboard;