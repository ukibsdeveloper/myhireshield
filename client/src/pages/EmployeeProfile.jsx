import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // URL se ID lene ke liye
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import { Link } from 'react-router-dom';

const EmployeeProfile = () => {
  const { id } = useParams(); // URL parameter
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // MOCK DATA for local testing
  const mockProfile = {
    firstName: "Verified",
    lastName: "Professional",
    email: "support@hireshield.com",
    phone: "91-XXXX-XXXX",
    totalExperience: 5,
    verified: true,
    overallScore: 88
  };

  const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://api.myhireshield.com';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        // Agar ID hai toh searched profile, warna logged-in user ki profile
        const targetId = id || user?._id;

        if (!targetId && window.location.hostname !== 'localhost') {
          setError("Profile information missing.");
          return;
        }

        // Backend call for profile data
        const res = await axios.get(`${API_BASE}/api/employees/profile/${targetId || ''}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error("Profile Fetch Error:", err);
        setError("Synchronization failed.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, user, API_BASE]);

  // Fallback Logic
  const profile = data?.employee || (window.location.hostname === 'localhost' ? mockProfile : null);

  if (loading && window.location.hostname !== 'localhost') {
    return (
      <div className="min-h-screen bg-[#fcfaf9] flex items-center justify-center">
        <i className="fas fa-spinner fa-spin text-4xl text-[#496279]"></i>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfaf9] selection:bg-[#4c8051]/30 font-sans antialiased text-[#496279] uppercase overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      <Navbar scrolled={true} isAuthenticated={true} user={user} />

      <div className="container mx-auto px-6 pt-32 pb-20 max-w-5xl">
        <div className="flex justify-between items-center mb-10 opacity-60">
          <Breadcrumb />
          <Link to={user?.role === 'company' ? '/dashboard/company' : '/dashboard/employee'} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-[#4c8051] transition-all">
            <i className="fas fa-arrow-left"></i>
            Back to Dashboard
          </Link>
        </div>

        {/* Dossier Header */}
        <div className="bg-white border border-slate-100 rounded-[4rem] shadow-2xl overflow-hidden relative mb-12 animate-in slide-in-from-bottom-8 duration-1000">
          <div className="h-48 bg-gradient-to-r from-[#496279] to-[#3a4e61] relative overflow-hidden text-white flex items-center px-12 md:px-20 border-b border-white/5">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#4c8051] opacity-20 rounded-full blur-[100px] -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#dd8d88] opacity-10 rounded-full blur-[80px] -ml-32 -mb-32"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl text-[9px] font-black tracking-[0.4em] mb-4 border border-white/10 uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4c8051] animate-pulse"></span>
                Verified Profile Certificate
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none">Employee <span className="text-[#4c8051]">Profile.</span></h2>
            </div>
          </div>

          <div className="px-10 md:px-20 pb-20">
            <div className="relative -mt-24 mb-12 flex flex-col md:flex-row items-end gap-10">
              <div className="relative shrink-0">
                <div className="h-48 w-48 bg-white rounded-[3.5rem] p-4 shadow-24 mx-auto md:mx-0 border border-slate-100 relative z-10">
                  <div className="h-full w-full bg-[#fcfaf9] rounded-[3rem] flex items-center justify-center text-7xl font-black text-[#496279] shadow-inner group overflow-hidden">
                    {profile?.firstName?.charAt(0) || 'U'}
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white p-2 rounded-2xl shadow-xl z-20">
                  <div className="bg-[#4c8051] text-white h-12 w-12 rounded-xl flex items-center justify-center border-4 border-white">
                    <i className="fas fa-check-double"></i>
                  </div>
                </div>
              </div>

              <div className="flex-1 pb-4 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-3">
                  <h1 className="text-4xl md:text-6xl font-black text-[#496279] tracking-tighter leading-none">
                    {profile?.firstName} <span className="text-slate-300">{profile?.lastName}</span>
                  </h1>
                  <span className="px-4 py-1.5 bg-[#4c8051]/10 text-[#4c8051] text-[9px] font-black rounded-full tracking-[0.2em] uppercase border border-[#4c8051]/10">Top Verified User</span>
                </div>
                <p className="text-slate-400 font-bold text-xs tracking-[0.4em] uppercase mb-4">{profile?.email} // ID: {profile?._id?.substr(-6).toUpperCase()}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-8 opacity-40">
                  <div className="flex items-center gap-2"><i className="fas fa-user-check text-[10px]"></i> <span className="text-[8px] font-black tracking-widest uppercase">Identity Verified</span></div>
                  <div className="flex items-center gap-2"><i className="fas fa-history text-[10px]"></i> <span className="text-[8px] font-black tracking-widest uppercase">Verified Work History</span></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: 'Phone Number', val: profile?.phone || 'PRIVATE', icon: 'fa-phone', color: '#496279' },
                { label: 'Work Experience', val: `${profile?.totalExperience || 0} Years`, icon: 'fa-briefcase', color: '#496279' },
                { label: 'Verification Status', val: profile?.verified ? 'Verified' : 'Pending', icon: 'fa-id-card', color: profile?.verified ? '#4c8051' : '#dd8d88' },
                { label: 'Trust Score', val: `${profile?.overallScore || 0}%`, icon: 'fa-bolt', color: '#4c8051' }
              ].map((item, i) => (
                <div key={i} className="p-8 bg-[#fcfaf9] rounded-[3rem] border border-slate-50 flex flex-col items-center group hover:bg-white hover:shadow-24 transition-all duration-500 hover:-translate-y-2">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:bg-[#496279] group-hover:text-white transition-colors">
                    <i className={`fas ${item.icon} text-lg`} style={{ color: i === 3 ? '#4c8051' : 'inherit' }}></i>
                  </div>
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mb-2">{item.label}</span>
                  <p className="text-sm font-black text-[#496279] uppercase tracking-tighter leading-none" style={{ color: item.color }}>{item.val}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 bg-slate-50/50 p-10 rounded-[3.5rem] border border-slate-50 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Work History Summary</p>
              <h4 className="text-xl font-black tracking-tighter mb-6 uppercase text-[#496279]">This score is calculated based on verified feedback from previous employers.</h4>
              <Link to="/reputation-report" className="inline-flex items-center gap-4 px-10 py-5 bg-[#496279] text-white rounded-[2rem] font-black text-[10px] tracking-[0.3em] shadow-xl hover:bg-[#4c8051] transition-all active:scale-95">
                View Full Report
                <i className="fas fa-file-alt"></i>
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center opacity-30 mt-20">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.6em] mb-2">
            HireShield Verified Network // Profile ID: {profile?._id?.toUpperCase() || 'SUBJECT-ALPHA'}
          </p>
          <div className="w-12 h-[2px] bg-slate-300 mx-auto"></div>
        </div>
      </div>
      <Footer />

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-bottom { from { transform: translateY(3rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-in { animation: fade-in 0.8s, slide-in-bottom 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
      `}} />
    </div>
  );
};

export default EmployeeProfile;