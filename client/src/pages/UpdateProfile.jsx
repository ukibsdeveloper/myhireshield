import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const UpdateProfile = () => {
  const { user, updateProfile } = useAuth(); // AuthContext integration
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    companyName: '',
    currentDesignation: '',
    bio: ''
  });

  // Sync state with user data on mount or user change
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        companyName: user.companyName || '',
        currentDesignation: user.currentDesignation || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateProfile(formData); // Using context method
      if (res.success) {
        alert("Profile synchronized successfully!");
      } else {
        alert(res.error || "Update failed.");
      }
    } catch (err) {
      alert("Update failed. Please check network nodes.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-4 bg-[#fcfaf9] border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#4c8051] transition-all font-bold text-[#496279]";

  return (
    <div className="min-h-screen bg-[#fcfaf9] selection:bg-[#4c8051]/30">
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      <Navbar scrolled={true} isAuthenticated={true} user={user} />

      <div className="container mx-auto px-6 pt-32 pb-20 max-w-4xl">
        
        <div className="flex items-center gap-4 mb-12 animate-on-scroll">
           <div className="w-12 h-12 bg-[#496279] rounded-2xl flex items-center justify-center text-white shadow-lg">
              <i className="fas fa-user-cog"></i>
           </div>
           <div>
              <h1 className="text-3xl font-black text-[#496279] uppercase tracking-tighter leading-none">Settings.</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Modify Authorized Identity Node</p>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-slate-50 rounded-[3.5rem] p-10 md:p-14 shadow-xl animate-on-scroll">
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            
            {/* Read-only Identifier */}
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-2">Primary Identifier (Email)</label>
              <input type="text" value={user?.email || ''} disabled className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-300 cursor-not-allowed" />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-2">Contact Link (Mobile)</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="+91 XXXX" />
            </div>

            {/* Conditional Logic based on User Role */}
            {user?.role === 'company' ? (
              <div className="md:col-span-2 space-y-2">
                <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-2">Enterprise Entity Name</label>
                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className={inputClass} />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-2">Given Name</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={inputClass} />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-2">Family Name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={inputClass} />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-2">Current Active Designation</label>
                  <input type="text" name="currentDesignation" value={formData.currentDesignation} onChange={handleChange} className={inputClass} />
                </div>
              </>
            )}

            <div className="md:col-span-2 space-y-2">
              <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-2">Professional Summary</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" className={`${inputClass} resize-none`} placeholder="Describe the professional node scope..."></textarea>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
             <button type="submit" disabled={loading} className="flex-1 bg-[#496279] text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-[#3a4e61] transition-all">
                {loading ? <i className="fas fa-sync fa-spin mr-2"></i> : null}
                Synchronize Changes
             </button>
             <button type="button" onClick={() => window.location.reload()} className="px-10 py-5 border border-slate-100 rounded-[2rem] text-[10px] font-black text-slate-300 uppercase tracking-widest hover:bg-slate-50 transition-all">
                Reset Node
             </button>
          </div>
        </form>

        <div className="mt-12 p-8 border border-slate-100 rounded-[2.5rem] bg-white/50 opacity-40">
           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
             <i className="fas fa-info-circle mr-2"></i> 
             Security Protocol: Identity changes are logged and may trigger a re-verification cycle for integrity nodes.
           </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UpdateProfile;