import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import EmailVerificationBanner from '../components/EmailVerificationBanner';
import AnalogGauge from '../components/AnalogGauge';
import { formatDateDDMMYYYY } from '../utils/helpers';

const EmployeeDashboard = () => {
  const { user, hasPaidForReport, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await analyticsAPI.getEmployeeAnalytics();
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

  // UI Helpers
  const shieldScore = stats?.overallScore || 0;
  const verificationPercent = stats?.verificationPercentage || 0;

  return (
    <div className="min-h-screen bg-[#fcfaf9] selection:bg-[#4c8051]/20 overflow-x-hidden tracking-tight font-sans antialiased">
      {/* Background Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <Navbar scrolled={true} isAuthenticated={true} user={user} />

      <div className="container mx-auto px-4 sm:px-6 pt-32 pb-32 sm:pb-24 max-w-7xl">
        <Breadcrumb />

        <div className="mb-6">
          <EmailVerificationBanner />
        </div>

        {/* HERO SECTION: CAREER VAULT ACCESS */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="lg:col-span-2 relative p-12 md:p-16 rounded-[4rem] bg-gradient-to-br from-[#496279] via-[#3a4e61] to-[#2c3d4a] text-white overflow-hidden shadow-2xl flex flex-col justify-center border border-white/5 group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#4c8051] opacity-20 rounded-full blur-[120px] -mr-48 -mt-48 transition-all duration-700 group-hover:scale-110"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#dd8d88] opacity-10 rounded-full blur-[100px] -ml-32 -mb-32"></div>

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-12">
                <div>
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-2xl text-xs font-black tracking-[0.3em] mb-8 border border-white/10 shadow-inner">
                    <span className="h-2 w-2 rounded-full bg-[#4c8051] animate-pulse"></span>
                    Identity Verified
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] mb-6">
                    Employee <br /> <span className="text-[#4c8051]">Dashboard.</span>
                  </h1>
                  <p className="text-white/40 font-bold text-xs tracking-[0.3em] uppercase">{user?.firstName} {user?.lastName} // Verified Account</p>
                </div>

                <div className="bg-white/8 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 text-center min-w-[220px] flex flex-col items-center">
                  <p className="text-[10px] font-black text-white/50 mb-4 uppercase tracking-[0.3em]">Trust Score</p>
                  {loading ? (
                    <div className="h-32 w-32 bg-white/10 animate-pulse rounded-full mx-auto"></div>
                  ) : (
                    <AnalogGauge score={shieldScore} size={180} label="" animate={true} />
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Link to="/reputation-report" className="group relative items-center justify-center bg-[#4c8051] text-white px-8 py-5 rounded-3xl font-black text-xs tracking-widest shadow-24 hover:scale-105 transition-all overflow-hidden flex whitespace-nowrap">
                  <span className="relative z-10">{hasPaidForReport ? 'View Full Report' : 'Unlock Report (₹99)'}</span>
                </Link>
                <Link to="/settings" className="bg-white/10 backdrop-blur-md text-white border border-white/10 px-8 py-5 rounded-3xl font-black text-xs tracking-widest shadow-xl hover:bg-white hover:text-[#496279] transition-all flex items-center justify-center gap-3 whitespace-nowrap">
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Verification Status Card */}
          <div className="bg-white border border-slate-100 rounded-[4rem] p-12 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="absolute -top-10 -right-10 opacity-5 group-hover:scale-110 transition-transform">
              <i className="fas fa-stamp text-[12rem] text-slate-200"></i>
            </div>

            <div className="relative z-10">
              <h3 className="text-[11px] font-black text-slate-300 tracking-[0.4em] mb-10 uppercase">Profile Verification</h3>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-6xl font-black text-[#496279] tracking-tighter leading-none">{verificationPercent}%</span>
                <span className="text-xs font-black text-[#4c8051] uppercase mb-1">Verified</span>
              </div>
              <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden mb-8">
                <div className="h-full bg-[#4c8051] rounded-full transition-all duration-1000" style={{ width: `${verificationPercent}%` }}></div>
              </div>
            </div>

            <div className="relative z-10 p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                {verificationPercent < 100 ? 'Please complete your profile. Upload documents to verify your work history.' : 'Your profile is fully verified and trusted.'}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: PERFORMANCE RATINGS */}
        <div className="grid lg:grid-cols-4 gap-12 mb-20">
          <div className="lg:col-span-3 bg-white border border-slate-100 rounded-[4rem] p-12 shadow-sm relative border-b-8 border-b-[#4c8051]">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-lg font-black text-[#496279] tracking-tighter uppercase">Performance Ratings</h2>
                <p className="text-xs text-slate-400 font-bold mt-2 uppercase tracking-[0.2em]">Verified feedback from your previous companies</p>
              </div>
              <div className="px-5 py-2 bg-[#fcfaf9] border border-slate-100 rounded-2xl text-xs font-black text-slate-400">
                Source: Verified Reviews
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
              {[
                { label: 'Work Quality', key: 'workQuality' },
                { label: 'Punctuality', key: 'punctuality' },
                { label: 'Behavior', key: 'behavior' },
                { label: 'Teamwork', key: 'teamwork' },
                { label: 'Communication', key: 'communication' },
                { label: 'Technical Skills', key: 'technicalSkills' }
              ].map((metric, i) => {
                const rawVal = stats?.scoreBreakdown?.[metric.key] || 0;
                const displayVal = Math.round(rawVal / 10 * 10) / 10;
                const pct = Math.min(rawVal, 100);
                const barColor = pct >= 70 ? '#4c8051' : pct >= 35 ? '#d4a017' : '#da8b86';
                return (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-black text-[#496279] uppercase tracking-widest">{metric.label}</span>
                      {loading ? (
                        <div className="h-3 w-10 bg-slate-100 animate-pulse rounded"></div>
                      ) : (
                        <span className="text-xs font-black tracking-tighter" style={{ color: barColor }}>{displayVal} / 10</span>
                      )}
                    </div>
                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: loading ? '0%' : `${pct}%`, backgroundColor: barColor }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-sm">
              <h3 className="text-xs font-black text-slate-300 tracking-[0.4em] mb-6 uppercase text-center">Review Count</h3>
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full border-8 border-slate-50 flex items-center justify-center mb-4">
                  <span className="text-4xl font-black text-[#496279]">{stats?.totalReviews || 0}</span>
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Reviews</p>
              </div>
            </div>

            <div className="bg-[#dd8d88]/5 border border-[#dd8d88]/20 p-10 rounded-[3rem] shadow-xl">
              <h3 className="text-[11px] font-black text-[#dd8d88] tracking-[0.4em] mb-6 uppercase">Notifications</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#dd8d88] mt-1 shrink-0"></div>
                  <p className="text-xs font-bold text-slate-500 uppercase leading-none">New review submitted by a company</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#496279] mt-1 shrink-0"></div>
                  <p className="text-xs font-bold text-slate-500 uppercase leading-none">A company viewed your profile</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: WORK HISTORY & FEEDBACK */}
        <div className="mb-24 px-8">
          <h2 className="text-[11px] font-black text-slate-400 tracking-[0.5em] mb-12 flex items-center gap-4 uppercase">
            <span className="h-px w-12 bg-slate-200"></span> Work History & Feedback
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stats?.recentReviews?.length > 0 ? stats.recentReviews.slice(0, 3).map((rev, i) => (
              <div key={i} className="bg-white border border-slate-100 p-10 rounded-[3.5rem] shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform">
                  <i className="fas fa-quote-right text-8xl"></i>
                </div>
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-xs font-black text-[#496279] group-hover:bg-[#4c8051] group-hover:text-white transition-all">
                    {rev.companyId?.companyName?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#496279] uppercase truncate">{rev.companyId?.companyName}</h4>
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">{formatDateDDMMYYYY(rev.createdAt)}</p>
                  </div>
                </div>
                <p className="text-xs font-medium text-slate-500 leading-relaxed italic border-l-2 border-slate-50 pl-6 uppercase tracking-tight line-clamp-2">
                  "{rev.comment}"
                </p>
              </div>
            )) : (
              <div className="col-span-3 text-center py-20 bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
                <p className="text-xs font-black text-slate-200 uppercase tracking-[0.5em]">No recent feedback found.</p>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER / SESSION META */}
        <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40 group">
          <div className="flex items-center gap-6">
            <div className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-black text-slate-500 tracking-widest">
              ID: {user?._id?.slice(-8).toUpperCase()}
            </div>
            <p className="text-xs font-bold text-slate-400 tracking-[0.3em] uppercase hidden md:block">HireShield Personal Dashboard // Version 1.0</p>
          </div>
          <button
            onClick={logout}
            className="group flex items-center gap-4 text-xs font-black tracking-[0.2em] text-[#496279] hover:text-[#dd8d88] transition-all uppercase"
          >
            <span className="group-hover:mr-2 transition-all">Logout</span>
            <i className="fas fa-power-off"></i>
          </button>
        </div>
      </div>

      <Footer />

      {/* Animation Styles */}
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

export default EmployeeDashboard;