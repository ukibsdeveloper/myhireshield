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
    <div className="min-h-screen bg-[#fcfaf9] selection:bg-[#4c8051]/30">
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      <Navbar scrolled={true} isAuthenticated={true} user={user} />

      <div className="container mx-auto px-6 pt-32 pb-20 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <Breadcrumb />
          <Link to={user?.role === 'company' ? '/dashboard/company' : '/dashboard/employee'} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#4c8051] transition-all">
            <i className="fas fa-arrow-left"></i>
            Back to Dashboard
          </Link>
        </div>

        {/* Certificate Card Header */}
        <div className="bg-white border border-slate-100 rounded-[4rem] shadow-xl overflow-hidden relative mb-12 animate-in-scroll">
          <div className="h-40 bg-[#496279] relative overflow-hidden text-white flex items-center px-12 border-b border-white/5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#4c8051] opacity-20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] mb-2 opacity-60">Verified Professional Profile</p>
              <h2 className="text-2xl font-black uppercase tracking-tighter">Official Shield Certificate</h2>
            </div>
          </div>

          <div className="px-10 pb-16 text-center">
            <div className="relative -mt-20 mb-8 inline-block">
              <div className="h-44 w-44 bg-white rounded-[3rem] p-3 shadow-2xl mx-auto border border-slate-50">
                <div className="h-full w-full bg-[#fcfaf9] rounded-[2.5rem] flex items-center justify-center text-7xl font-black text-[#496279]">
                  {profile?.firstName?.charAt(0) || 'U'}
                </div>
              </div>
              {profile?.verified && (
                <div className="absolute -bottom-2 -right-2 bg-[#4c8051] text-white h-10 w-10 rounded-xl flex items-center justify-center border-4 border-white shadow-lg">
                  <i className="fas fa-check"></i>
                </div>
              )}
            </div>

            <h1 className="text-5xl font-black text-[#496279] uppercase tracking-tighter leading-none mb-2">
              {profile?.firstName} <span className="text-[#4c8051]">{profile?.lastName}</span>
            </h1>
            <p className="text-[#dd8d88] font-black text-[10px] uppercase tracking-[0.3em] mb-12">{profile?.email}</p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Mobile Node', val: profile?.phone || 'Private', icon: 'fa-phone' },
                { label: 'Tenure Years', val: `${profile?.totalExperience || 0} Exp`, icon: 'fa-briefcase' },
                { label: 'ID Status', val: profile?.verified ? 'Verified' : 'Pending', icon: 'fa-id-card', color: profile?.verified ? '#4c8051' : '#dd8d88' },
                { label: 'Shield Rank', val: `${profile?.overallScore || 0}%`, icon: 'fa-bolt', color: '#496279' }
              ].map((item, i) => (
                <div key={i} className="p-6 bg-[#fcfaf9] rounded-[2rem] border border-slate-50 flex flex-col items-center group hover:bg-white hover:shadow-xl transition-all">
                  <i className={`fas ${item.icon} text-lg mb-4`} style={{ color: item.color || '#496279' }}></i>
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">{item.label}</span>
                  <p className="text-xs font-black text-[#496279] uppercase tracking-tighter">{item.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center opacity-30">
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.4em]">
            HireShield Professional Verification v2.4 // Verified Profile ID: {profile?._id?.toUpperCase() || 'DEMO-PROFILE'}
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EmployeeProfile;