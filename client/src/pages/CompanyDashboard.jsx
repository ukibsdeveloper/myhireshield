import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI } from '../utils/api';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer';

const CompanyDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fallback / Mock data for local development
  const displayStats = stats || { totalReviews: 128, totalEmployees: 42, totalVerifications: 95 };
  const displayUser = user || { email: 'admin@hireshield.com', companyName: 'HireShield Enterprise' };

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

  return (
    <div className="min-h-screen bg-[#fcfaf9] selection:bg-[#dd8d88]/30 overflow-x-hidden uppercase tracking-tight">
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <Navbar scrolled={true} isAuthenticated={true} user={displayUser} />

      <div className="container mx-auto px-6 pt-32 pb-20 max-w-7xl">
        
        {/* TOP ROW: Welcome & Main Action */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12 animate-in fade-in duration-700">
          <div className="lg:col-span-2 relative p-10 rounded-[3rem] bg-[#496279] text-white overflow-hidden shadow-2xl flex flex-col justify-center border border-white/5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#4c8051] opacity-20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[9px] font-black tracking-[0.2em] mb-6 border border-white/10">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4c8051] animate-pulse"></span>
                  Secure Enterprise Node
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-4">
                  System <br /> <span className="text-[#4c8051]">Authorized.</span>
                </h1>
                <p className="text-white/50 font-bold text-[10px] tracking-[0.2em]">{displayUser.companyName}</p>
              </div>
              
              <Link to="/review/submit" className="bg-[#4c8051] text-white px-10 py-5 rounded-2xl font-black text-[10px] tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all whitespace-nowrap">
                <i className="fas fa-plus mr-2"></i> Deploy New Audit
              </Link>
            </div>
          </div>

          {/* Account Health Gauge */}
          <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="relative w-32 h-32 mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-50" />
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="364.4" strokeDashoffset="91.1" className="text-[#4c8051] transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-[#496279]">75%</span>
              </div>
            </div>
            <h3 className="text-[10px] font-black text-[#496279] tracking-[0.3em] mb-2">Trust Rating</h3>
            <p className="text-[9px] text-slate-400 font-bold tracking-widest">Verification Status: High</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { label: 'Integrity Logs', value: displayStats.totalReviews, icon: 'fa-star', color: '#4c8051' },
            { label: 'Staff Nodes', value: displayStats.totalEmployees, icon: 'fa-users', color: '#496279' },
            { label: 'Clearance Rate', value: '98%', icon: 'fa-bolt', color: '#dd8d88' }
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all relative group overflow-hidden">
               <div className="absolute -right-4 -bottom-4 opacity-[0.05] group-hover:scale-110 transition-transform">
                  <i className={`fas ${stat.icon} text-9xl`} style={{ color: stat.color }}></i>
               </div>
               <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] mb-1">{stat.label}</p>
               <p className="text-5xl font-black text-[#496279] tracking-tighter">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* MIDDLE SECTION */}
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-sm font-black text-[#496279] tracking-[0.3em]">Recent Audit Ledger</h2>
                <p className="text-[10px] text-slate-400 font-bold mt-1">Real-time Node Verification Logs</p>
              </div>
              <button className="text-[9px] font-black text-white bg-[#496279] px-6 py-2.5 rounded-full tracking-widest hover:bg-[#3a4e61] transition-all shadow-lg shadow-[#496279]/10">Export Report</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-6 text-[9px] font-black text-slate-300 tracking-[0.2em]">Node Identifier</th>
                    <th className="pb-6 text-[9px] font-black text-slate-300 tracking-[0.2em]">Clearance Level</th>
                    <th className="pb-6 text-[9px] font-black text-slate-300 tracking-[0.2em] text-right">Shield Score™</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { name: 'Karan Malhotra', status: 'Full Clearance', score: '98', color: '#4c8051', sub: 'Tech Node 091' },
                    { name: 'Sanya Gupta', status: 'Processing...', score: '--', color: '#dd8d88', sub: 'UI Node 112' },
                    { name: 'Vikram Singh', status: 'Full Clearance', score: '82', color: '#4c8051', sub: 'PM Node 440' },
                  ].map((row, i) => (
                    <tr key={i} className="group hover:bg-slate-50/50 transition-all cursor-pointer">
                      <td className="py-6">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-[#496279] text-xs">
                             {row.name.charAt(0)}
                           </div>
                           <div>
                             <p className="font-black text-[#496279] text-sm tracking-tight leading-none">{row.name}</p>
                             <p className="text-[9px] text-slate-400 font-bold mt-1">{row.sub}</p>
                           </div>
                        </div>
                      </td>
                      <td className="py-6">
                        <div className="flex items-center gap-2">
                           <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: row.color }}></span>
                           <span className="text-[10px] font-black text-slate-500 tracking-widest">{row.status}</span>
                        </div>
                      </td>
                      <td className="py-6 text-right font-black text-[#496279]">{row.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Command Sidebar */}
          <div className="space-y-8 animate-in slide-in-from-right duration-700">
            <div className="bg-[#dd8d88]/10 border border-[#dd8d88]/20 rounded-[2.5rem] p-8">
               <h3 className="text-[10px] font-black text-[#dd8d88] tracking-[0.2em] mb-4 flex items-center gap-2">
                 <i className="fas fa-bell"></i> Critical Alerts
               </h3>
               <div className="border-l-2 border-[#dd8d88] pl-4">
                  <p className="text-[10px] font-black text-[#496279] leading-tight">Verification Pending</p>
                  <p className="text-[9px] font-bold text-slate-400 mt-1">Sanya Gupta Identity Sync Required</p>
               </div>
            </div>

            <div className="space-y-4">
               {[
                 { to: "/employee/search", icon: 'fa-search', title: 'Identity Search', color: '#496279' },
                 { to: "/review/submit", icon: 'fa-file-shield', title: 'Submit Audit', color: '#4c8051' },
                 { to: "/review/manage", icon: 'fa-database', title: 'Managed History', color: '#496279' },
               ].map((action, i) => (
                 <Link key={i} to={action.to} className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl hover:border-[#4c8051] transition-all shadow-sm group hover:-translate-y-1">
                    <span className="text-[10px] font-black text-[#496279] tracking-widest">{action.title}</span>
                    <i className={`fas ${action.icon} text-slate-200 group-hover:text-[#4c8051] transition-colors`}></i>
                 </Link>
               ))}
            </div>
          </div>
        </div>

        {/* System Node Footer */}
        <div className="mt-20 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40">
          <p className="text-[9px] font-bold text-slate-400 tracking-[0.4em]">HireShield Secure Terminal // Node_v2.4.9</p>
          <button onClick={logout} className="text-[9px] font-black tracking-widest hover:text-[#dd8d88] transition-all">
            <i className="fas fa-power-off mr-2"></i> Terminate Session
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CompanyDashboard;